export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
  original_language: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface UserPreferences {
  favoriteGenres: number[];
  preferredLanguage: string;
  yearRange: [number, number];
  minRating: number;
  mood: MoodType;
  likedMovies: number[];
  watchlist: number[];
  hiddenMovies: number[];
  watchedMovies: number[];
}

export type MoodType = 'Happy' | 'Sad' | 'Excited' | 'Relaxed' | 'Thrilled' | 'Romantic' | 'Curious' | 'None';

export interface RecommendationRequest {
  favoriteGenres: number[];
  language?: string;
  preferredLanguage?: string;
  yearRange?: [number, number];
  minRating?: number;
  mood?: MoodType;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
