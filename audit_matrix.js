
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const LANGUAGES = ['en', 'hi', 'fr', 'de', 'it', 'es', 'ja', 'ko'];
const GENRES = [28, 12, 16, 35, 80, 18, 10751, 14, 27, 878, 53];

async function testCombination(lang, genreId) {
    const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        with_original_language: lang,
        with_genres: genreId.toString(),
        'vote_average.gte': '0',
        'vote_count.gte': '0',
        page: '1'
    });

    const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const count = data.results ? data.results.length : 0;
        return { lang, genreId, count, success: true };
    } catch (e) {
        return { lang, genreId, count: 0, success: false, error: e.message };
    }
}

async function runFullAudit() {
    console.log("--- STARTING FULL GENRE/LANGUAGE AUDIT ---");
    const results = [];

    // Sample a few critical combinations to avoid hitting rate limits too hard but verify the matrix
    for (const lang of LANGUAGES) {
        console.log(`Auditing Language: ${lang}...`);
        for (const genreId of [28, 35, 18, 27]) { // Action, Comedy, Drama, Horror (Critical ones)
            const result = await testCombination(lang, genreId);
            results.push(result);
            if (result.count === 0) {
                console.warn(`[CHECK] Zero results for Lang: ${lang}, Genre: ${genreId}`);
            }
        }
    }

    const failed = results.filter(r => r.count === 0);
    console.log("\n--- AUDIT SUMMARY ---");
    console.log(`Total Tested: ${results.length}`);
    console.log(`Successful Pairs: ${results.length - failed.length}`);
    console.log(`Zero Result Pairs: ${failed.length}`);

    if (failed.length > 0) {
        console.log("Details of missing content:");
        failed.forEach(f => console.log(` - ${f.lang} with GenreID ${f.genreId}`));
    }
    console.log("--- AUDIT COMPLETE ---");
}

runFullAudit();
