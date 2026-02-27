import { UserPreferences, MoodType } from './types';

const STORAGE_KEY = 'cinematch_preferences';

const INITIAL_PREFERENCES: UserPreferences = {
    favoriteGenres: [],
    preferredLanguage: 'en',
    yearRange: [1970, 2026],
    minRating: 5,
    mood: 'None',
    likedMovies: [],
    watchlist: [],
    hiddenMovies: [],
    watchedMovies: [],
};

export const PreferenceManager = {
    getPreferences(): UserPreferences {
        if (typeof window === 'undefined') return INITIAL_PREFERENCES;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return INITIAL_PREFERENCES;
        try {
            const parsed = JSON.parse(stored);
            // Auto-clean any past duplicates from all list types
            const clean = { ...INITIAL_PREFERENCES, ...parsed };
            const lists: (keyof UserPreferences)[] = ['likedMovies', 'watchlist', 'hiddenMovies', 'watchedMovies', 'favoriteGenres'];

            lists.forEach(key => {
                if (Array.isArray(clean[key])) {
                    (clean[key] as any) = Array.from(new Set(clean[key] as any[]));
                }
            });

            return clean;
        } catch (e) {
            return INITIAL_PREFERENCES;
        }
    },

    setPreferences(prefs: Partial<UserPreferences>) {
        if (typeof window === 'undefined') return;
        const current = this.getPreferences();
        const updated = { ...current, ...prefs };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    toggleMovieInList(movieId: number, listName: 'likedMovies' | 'watchlist' | 'hiddenMovies' | 'watchedMovies') {
        const currentPrefs = this.getPreferences();
        const currentList = currentPrefs[listName] || [];

        // Use a Set to ensure unique IDs and filter out the movie if it already exists
        const isPresent = currentList.includes(movieId);
        let updatedList: number[];

        if (isPresent) {
            updatedList = currentList.filter(id => id !== movieId);
        } else {
            updatedList = [...currentList, movieId];
        }

        // Final deduplication safety check
        const uniqueList = Array.from(new Set(updatedList));

        this.setPreferences({ [listName]: uniqueList });
        return uniqueList.includes(movieId);
    },

    clearPreferences() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
        return INITIAL_PREFERENCES;
    }
};
