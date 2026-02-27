'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Clapperboard, Tv } from 'lucide-react';
import SearchBar from './SearchBar';
import { Movie } from '@/lib/types';
import { PreferenceManager } from '@/lib/preferences';

interface HeaderProps {
    onMovieSelect?: (movie: Movie) => void;
    onOpenWatchlist?: () => void;
    language?: string;
    watchlistCount?: number;
}

export default function Header({ onMovieSelect, onOpenWatchlist, language, watchlistCount = 0 }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();

    const handleMovieSelect = (movie: Movie) => {
        PreferenceManager.toggleMovieInList(movie.id, 'likedMovies');
        if (onMovieSelect) {
            onMovieSelect(movie);
        }
    };

    return (
        <header className="fixed top-0 z-[100] w-full bg-black/90 backdrop-blur-md border-b border-white/5 h-16 sm:h-20">
            <div className="container mx-auto px-4 sm:px-8 flex h-full items-center justify-between gap-4 sm:gap-8">
                <div className="flex items-center gap-4 sm:gap-8 min-w-fit">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                            <Tv className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-white">
                            Cine<span className="text-primary italic">Match</span>
                        </h1>
                    </div>

                    <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-white/70 uppercase">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Home</button>
                        <button onClick={() => document.getElementById('discovery-panel')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Movies</button>
                        <button onClick={onOpenWatchlist} className="hover:text-white transition-colors flex items-center gap-1.5">
                            My List
                            {watchlistCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                                    {watchlistCount}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                <div className="flex-1 max-w-lg">
                    <SearchBar onMovieSelect={handleMovieSelect} language={language} />
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    ) : (
                        <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    )}
                </button>
            </div>
        </header>
    );
}
