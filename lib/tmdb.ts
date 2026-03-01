import { Movie, MovieResponse, RecommendationRequest } from './types';
import { MOOD_GENRE_MAP, MOOD_EXCLUDE_MAP } from './constants';
import { FALLBACK_MOVIES } from './fallback-data';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchWithRetryAndTimeout(url: string, options: RequestInit = {}, retries = 2, timeoutMs = 10000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                next: { revalidate: 300 } // Cache for 5 minutes
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`TMDB HTTP error ${response.status}`);
            }
            return await response.json();
        } catch (error: unknown) {
            clearTimeout(timeoutId);
            if (attempt === retries) {
                console.error(`Fetch failed after ${retries} retries:`, error);
                throw error;
            }
            // short delay before retry
            await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
        }
    }
}

export async function fetchFromTMDB(endpoint: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<unknown> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB_API_KEY is not set. Falling back to local data.');
        return null;
    }
    console.log(`[TMDB FETCH] ${endpoint}`, params);

    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        ...Object.fromEntries(
            Object.entries(params).filter((entry) => entry[1] !== undefined).map(([k, v]) => [k, String(v)])
        ),
    });

    return fetchWithRetryAndTimeout(`${TMDB_BASE_URL}${endpoint}?${queryParams}`);
}

export async function getRecommendations(req: RecommendationRequest): Promise<Movie[]> {
    console.log(`[getRecommendations] Starts. lang: ${req.preferredLanguage || req.language}`);
    if (!TMDB_API_KEY) {
        console.log('[getRecommendations] No TMDB API KEY. Falling back.');
        return getLocalFallback(req);
    }

    const lang = req.preferredLanguage || req.language || 'en';
    const moodGenres = req.mood ? MOOD_GENRE_MAP[req.mood] : [];
    const excludeGenres = req.mood ? MOOD_EXCLUDE_MAP[req.mood] : [];
    const userGenres = req.favoriteGenres || [];

    const langMap: Record<string, string> = {
        hi: 'hi-IN', fr: 'fr-FR', de: 'de-DE', it: 'it-IT',
        es: 'es-ES', ja: 'ja-JP', ko: 'ko-KR'
    };

    const mappedLang = langMap[lang] || lang;
    const baseParams: Record<string, string | number | boolean | undefined> = {
        sort_by: 'popularity.desc',
        with_original_language: lang,
        language: mappedLang,
        page: 1,
        without_genres: excludeGenres.length > 0 ? excludeGenres.join(',') : undefined,
    };

    let withGenres: string | undefined = undefined;
    if (userGenres.length > 0 && moodGenres.length > 0) {
        withGenres = `${userGenres.join('|')},${moodGenres.join('|')}`;
    } else if (userGenres.length > 0) {
        withGenres = userGenres.join('|');
    } else if (moodGenres.length > 0) {
        withGenres = moodGenres.join('|');
    }

    try {
        // Step 1: Strict Filters
        const strictParams = {
            ...baseParams,
            'vote_average.gte': Math.max(req.minRating || 6, 5),
            'vote_count.gte': lang === 'en' ? 100 : 5,
            'primary_release_date.gte': req.yearRange ? `${req.yearRange[0]}-01-01` : '1980-01-01',
            'primary_release_date.lte': req.yearRange ? `${req.yearRange[1]}-12-31` : '2027-12-31',
            with_genres: withGenres,
        };

        let data = (await fetchFromTMDB('/discover/movie', strictParams)) as { results?: Movie[] };
        const results: Movie[] = data?.results || [];

        // Step 2: Relax Filters if results < 5
        if (results.length < 5) {
            console.log("Relaxing filters due to low results.");
            const combinedGenres = [...new Set([...userGenres, ...moodGenres])];
            const relaxedParams = {
                ...baseParams,
                'vote_average.gte': 4,
                'vote_count.gte': 0,
                'primary_release_date.gte': '1970-01-01',
                with_genres: combinedGenres.length > 0 ? combinedGenres.join('|') : undefined,
            };

            data = (await fetchFromTMDB('/discover/movie', relaxedParams)) as { results?: Movie[] };
            const newItems = data?.results || [];
            newItems.forEach((m: Movie) => {
                if (!results.some(r => r.id === m.id)) results.push(m);
            });
        }

        // Step 3: Fetch popular movies in the requested language if still < 5
        if (results.length < 5) {
            console.log("Fetching popular movies for language as fallback.");
            data = (await fetchFromTMDB('/discover/movie', {
                with_original_language: lang,
                language: mappedLang,
                sort_by: 'popularity.desc',
                page: 1
            })) as { results?: Movie[] };
            const newItems = data?.results || [];
            newItems.forEach((m: Movie) => {
                if (!results.some(r => r.id === m.id)) results.push(m);
            });
        }

        // Step 4: Fallback dataset if API fails or yields < 5
        if (results.length < 5 && lang === 'en') {
            console.log("Yielding local fallback dataset.");
            return guaranteeTenMovies(results);
        }

        // Apply simplistic scoring to sort remaining valid options
        const scoredResults = results.map(movie => {
            let score = 0;
            const uMatches = movie.genre_ids ? movie.genre_ids.filter(id => userGenres.includes(id)).length : 0;
            const mMatches = movie.genre_ids ? movie.genre_ids.filter(id => moodGenres.includes(id)).length : 0;

            score += uMatches * 40;
            score += mMatches * 30;
            if (uMatches > 0 && mMatches > 0) score += 100;

            score += (movie.vote_average * 2);
            score += Math.min(movie.popularity / 50, 10);
            return { movie, score };
        });

        // Exclude excluded genres strictly
        const finalMovies = scoredResults
            .filter(item => !item.movie.genre_ids || !item.movie.genre_ids.some(id => excludeGenres.includes(id)))
            .sort((a, b) => b.score - a.score)
            .map(item => item.movie);

        const returnMovies = finalMovies.length > 0 ? finalMovies : results;
        return lang === 'en' ? guaranteeTenMovies(returnMovies) : returnMovies;
    } catch (error) {
        console.error('TMDB pipeline failed, relying on local fallback:', error);
        return getLocalFallback(req);
    }
}

export async function searchMovies(query: string, lang: string = 'en'): Promise<Movie[]> {
    if (!TMDB_API_KEY) {
        return lang === 'en' ? FALLBACK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase())) : [];
    }
    try {
        const data = (await fetchFromTMDB('/search/movie', { query, language: lang })) as MovieResponse;
        return data?.results || [];
    } catch {
        return lang === 'en' ? FALLBACK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase())) : [];
    }
}

export async function getMovieDetails(movieId: number, lang: string = 'en'): Promise<Movie | null> {
    if (!TMDB_API_KEY) {
        return FALLBACK_MOVIES.find(m => m.id === movieId) || null;
    }
    try {
        const details = (await fetchFromTMDB(`/movie/${movieId}`, { language: lang })) as Movie;
        if (!details || !details.id) throw new Error('No details');
        return details;
    } catch {
        return FALLBACK_MOVIES.find(m => m.id === movieId) || null;
    }
}

function getLocalFallback(req: RecommendationRequest): Movie[] {
    const lang = req.preferredLanguage || req.language || 'en';
    if (lang !== 'en') return [];

    const valid = FALLBACK_MOVIES.filter(movie => {
        const matchesGenre = req.favoriteGenres.length === 0 || movie.genre_ids.some(id => req.favoriteGenres.includes(id));
        const inYearRange = !req.yearRange ||
            (Number(movie.release_date.split('-')[0]) >= req.yearRange[0] && Number(movie.release_date.split('-')[0]) <= req.yearRange[1]);
        const matchesRating = !req.minRating || movie.vote_average >= req.minRating;
        return matchesGenre && inYearRange && matchesRating;
    });
    return guaranteeTenMovies(valid);
}

function guaranteeTenMovies(movies: Movie[]): Movie[] {
    const finalSet = [...movies];
    for (const fb of FALLBACK_MOVIES) {
        if (finalSet.length >= 10) break;
        if (!finalSet.some(m => m.id === fb.id)) {
            finalSet.push(fb);
        }
    }
    return finalSet.slice(0, 20); // up to 20
}
