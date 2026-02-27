import { Genre, MoodType } from './types';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

export const GENRES: Genre[] = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
];

export const MOOD_GENRE_MAP: Record<MoodType, number[]> = {
    Happy: [35, 16, 10751, 14, 10402],
    Sad: [18, 10749, 10402],
    Excited: [28, 12, 878, 14, 53],
    Relaxed: [99, 10751, 35, 37, 18],
    Thrilled: [53, 27, 80, 9648],
    Romantic: [10749, 18, 35],
    Curious: [99, 9648, 36, 10770, 878],
    None: [],
};

export const MOOD_EXCLUDE_MAP: Record<MoodType, number[]> = {
    Happy: [27, 53, 10752, 80], // No Horror, Thriller, War, Crime
    Sad: [28, 12, 35, 16], // Filter out high-energy/comedy
    Relaxed: [28, 27, 53, 10752, 12], // No Action, Horror, Thriller, War, Adventure
    Excited: [99, 10751, 37], // No Docs, Westerns
    Thrilled: [10751, 16, 35, 10749], // No Family, Animation, Comedy, Romance
    Romantic: [27, 53, 10752, 28, 80], // No Horror, Thriller, War, Action, Crime
    Curious: [35, 16, 10751], // Filter out light-hearted stuff when curious
    None: [],
};

export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'it', name: 'Italian' },
];

export const DEFAULT_PREFERENCES = {
    yearRange: [1990, 2024],
    minRating: 6,
};
