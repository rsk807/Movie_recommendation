'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Movie } from '@/lib/types';
import { debounce } from '@/lib/utils';
import Image from 'next/image';
import { TMDB_IMAGE_BASE_URL } from '@/lib/constants';

interface SearchBarProps {
    onMovieSelect: (movie: Movie) => void;
    language?: string;
}

export default function SearchBar({ onMovieSelect, language }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const performSearch = async (val: string) => {
        if (!val.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(val)}&lang=${language || 'en'}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useRef(debounce(performSearch, 500)).current;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(true);
        debouncedSearch(val);
    };

    const handleSelect = (movie: Movie) => {
        onMovieSelect(movie);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-lg" ref={containerRef}>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search movies..."
                    className="w-full h-10 pl-10 pr-10 rounded-md border-none bg-secondary/50 backdrop-blur-md focus:bg-secondary focus:ring-1 ring-primary/50 outline-none transition-all text-sm"
                    onFocus={() => query.trim() && setIsOpen(true)}
                />
                {loading ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                ) : query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {isOpen && (results.length > 0 || query.trim()) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-md shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {results.slice(0, 8).map(movie => (
                                <a
                                    key={movie.id}
                                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        setQuery('');
                                        setResults([]);
                                        setIsOpen(false);
                                    }}
                                    className="w-full p-3 flex items-start gap-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                >
                                    <div className="relative h-14 w-10 flex-shrink-0 bg-secondary rounded overflow-hidden">
                                        <Image
                                            src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}w92${movie.poster_path}` : '/placeholder-poster.svg'}
                                            alt={movie.title}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-poster.svg';
                                            }}
                                            unoptimized={!movie.poster_path}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white line-clamp-1">{movie.title}</h4>
                                        <p className="text-[10px] text-muted-foreground mb-1">{movie.release_date || 'Unknown'}</p>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-primary">
                                                ⭐ {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : !loading && query.trim() && (
                        <div className="p-8 text-center text-xs text-muted-foreground italic">
                            No matches found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
