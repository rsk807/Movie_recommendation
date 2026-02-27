'use client';

import React from 'react';
import MovieCard from './MovieCard';
import { Movie, UserPreferences } from '@/lib/types';
import { PreferenceManager } from '@/lib/preferences';
import { Sparkles } from 'lucide-react';

interface MovieGridProps {
    movies: Movie[];
    preferences: UserPreferences;
    onRefresh: () => void;
}

export default function MovieGrid({ movies, preferences, onRefresh }: MovieGridProps) {
    const handleAction = (movieId: number, list: 'likedMovies' | 'watchlist' | 'hiddenMovies') => {
        PreferenceManager.toggleMovieInList(movieId, list);
        onRefresh();
    };

    if (movies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-secondary/20 rounded-2xl border border-dashed border-white/10 text-center px-4">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Scanning the Cinematic Universe...</h3>
                <p className="text-muted-foreground max-w-xs text-sm font-medium leading-relaxed">
                    We couldn't find matches for this specific combination. Try relaxing your filters or selecting a different mood!
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 text-xs font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4"
                >
                    Reset Recommendations
                </button>
            </div>
        );
    }

    // Filter out hidden movies from the main grid
    const visibleMovies = movies.filter(m => !preferences.hiddenMovies.includes(m.id));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {visibleMovies.map(movie => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLiked={preferences.likedMovies.includes(movie.id)}
                    isInWatchlist={preferences.watchlist.includes(movie.id)}
                    onLike={() => handleAction(movie.id, 'likedMovies')}
                    onWatchlist={() => handleAction(movie.id, 'watchlist')}
                    onIgnore={() => handleAction(movie.id, 'hiddenMovies')}
                />
            ))}
        </div>
    );
}
