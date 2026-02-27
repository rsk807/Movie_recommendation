'use client';

import React, { useEffect, useState } from 'react';
import { Movie } from '@/lib/types';
import { getMovieDetails } from '@/lib/tmdb';
import { X, Bookmark, Trash2, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { TMDB_IMAGE_BASE_URL } from '@/lib/constants';
import { cn, exportToCSV } from '@/lib/utils';

interface WatchlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    watchlistIds: number[];
    onRemove: (id: number) => void;
    language?: string;
}

export default function WatchlistDrawer({
    isOpen,
    onClose,
    watchlistIds,
    onRemove,
    language = 'en'
}: WatchlistDrawerProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && watchlistIds.length > 0) {
            const uniqueIds = Array.from(new Set(watchlistIds));
            loadWatchlist(uniqueIds);
        } else if (watchlistIds.length === 0) {
            setMovies([]);
        }
    }, [isOpen, watchlistIds]);

    const loadWatchlist = async (ids: number[]) => {
        setLoading(true);
        try {
            const fetched = await Promise.all(
                ids.map(id => getMovieDetails(id, language))
            );

            const seen = new Set();
            const uniqueMovies = (fetched.filter(Boolean) as Movie[]).filter(m => {
                if (seen.has(m.id)) return false;
                seen.add(m.id);
                return true;
            });

            setMovies(uniqueMovies);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear your entire watchlist?')) {
            // Remove from background storage one by one
            watchlistIds.forEach(id => onRemove(id));
            setMovies([]);
        }
    };

    const handleExport = () => {
        const dataToExport = movies.map(m => ({
            Title: m.title,
            ReleaseDate: m.release_date || 'N/A',
            Rating: m.vote_average?.toFixed(1) || '0.0',
            Overview: m.overview || '',
            Link: `https://www.themoviedb.org/movie/${m.id}`
        }));
        exportToCSV(dataToExport, 'my-watchlist.csv');
    };

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />
            <div className={cn(
                "fixed right-0 top-0 h-full w-full max-w-md bg-[#141414] border-l border-white/10 z-[101] shadow-2xl transition-transform duration-300 ease-out transform",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                        <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                            <Bookmark className="h-5 w-5 text-primary" />
                            Watchlist ({watchlistIds.filter((v, i, a) => a.indexOf(v) === i).length})
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Retrieving Data...</p>
                            </div>
                        ) : movies.length > 0 ? (
                            <div className="space-y-4">
                                {movies.map(movie => (
                                    <div key={movie.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all duration-300">
                                        <div className="relative h-28 w-20 flex-shrink-0 bg-muted/20 rounded-lg overflow-hidden shadow-xl shadow-black/40">
                                            <Image
                                                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}w500${movie.poster_path}` : '/placeholder-poster.svg'}
                                                alt={movie.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                unoptimized={!movie.poster_path}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h4>
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    {movie.release_date?.split('-')[0] || 'N/A'} • ⭐ {movie.vote_average?.toFixed(1) || '0.0'}
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <a
                                                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                                                    target="_blank"
                                                    className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <ExternalLink className="h-2.5 w-2.5" /> Details
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        onRemove(movie.id);
                                                        setMovies(prev => prev.filter(m => m.id !== movie.id));
                                                    }}
                                                    className="text-[10px] uppercase font-bold tracking-widest text-destructive/80 hover:text-destructive flex items-center gap-1 transition-colors"
                                                >
                                                    <Trash2 className="h-2.5 w-2.5" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center opacity-40">
                                <Bookmark className="h-16 w-16 mb-4 stroke-[1px]" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Your list is clear</h3>
                                <p className="text-[10px] mt-2">Saved matches will appear here.</p>
                            </div>
                        )}
                    </div>

                    {movies.length > 0 && (
                        <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl flex flex-col gap-3">
                            <button
                                onClick={handleExport}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg font-bold hover:bg-white/90 active:scale-95 transition-all text-sm uppercase tracking-widest"
                            >
                                <Download className="h-4 w-4" />
                                Export List (CSV)
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="w-full flex items-center justify-center gap-2 text-destructive/60 hover:text-destructive border border-white/5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                            >
                                <Trash2 className="h-3 w-3" />
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
