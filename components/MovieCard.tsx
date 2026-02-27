'use client';

import React from 'react';
import Image from 'next/image';
import { TMDB_IMAGE_BASE_URL, POSTER_SIZE, GENRES } from '@/lib/constants';
import { Movie } from '@/lib/types';
import { Star, Plus, Heart, EyeOff, ExternalLink, Check } from 'lucide-react';
import { cn, getYear } from '@/lib/utils';

interface MovieCardProps {
    movie: Movie;
    isLiked?: boolean;
    isIgnored?: boolean;
    isInWatchlist?: boolean;
    onLike?: () => void;
    onWatchlist?: () => void;
    onIgnore?: () => void;
}

export default function MovieCard({
    movie,
    isLiked,
    isIgnored,
    isInWatchlist,
    onLike,
    onWatchlist,
    onIgnore
}: MovieCardProps) {
    const defaultPlaceholder = '/placeholder-poster.svg';
    const [imgSrc, setImgSrc] = React.useState<string>(defaultPlaceholder);

    React.useEffect(() => {
        if (movie.poster_path) {
            setImgSrc(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        } else {
            setImgSrc(defaultPlaceholder);
        }
    }, [movie.id, movie.poster_path]);

    const movieGenres = movie.genre_ids
        .map(id => GENRES.find(g => g.id === id)?.name)
        .filter(Boolean)
        .slice(0, 2);

    return (
        <div className={cn(
            "group relative flex flex-col transition-all duration-300",
            isIgnored && "opacity-40 grayscale scale-95"
        )}>
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg group-hover:shadow-primary/20 group-hover:scale-[1.05] transition-all duration-500 z-10">
                <Image
                    src={imgSrc}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={() => setImgSrc(defaultPlaceholder)}
                    unoptimized={imgSrc.endsWith('.svg')}
                />

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onWatchlist?.();
                        }}
                        title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-2xl",
                            isInWatchlist ? "bg-primary text-white" : "bg-white/20 backdrop-blur-md text-white hover:bg-white/40"
                        )}
                    >
                        {isInWatchlist ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike?.();
                            }}
                            className={cn(
                                "p-2 rounded-full transition-all",
                                isLiked ? "bg-primary text-white" : "bg-white/20 backdrop-blur-md text-white hover:bg-red-600"
                            )}
                        >
                            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onIgnore?.();
                            }}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-gray-800"
                        >
                            <EyeOff className="h-4 w-4" />
                        </button>
                        <a
                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-blue-600"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-4 px-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-primary text-primary bg-primary/5 uppercase">
                        98% Match
                    </span>
                    <span className="text-xs text-muted-foreground">{getYear(movie.release_date)}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                        <Star className="h-3 w-3 text-primary fill-current" />
                        <span className="text-xs font-bold italic">{movie.vote_average.toFixed(1)}</span>
                    </div>
                </div>
                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                    {movieGenres.join(' • ')}
                </p>
                <p className="text-[10px] text-muted-foreground/80 line-clamp-3 mt-2 leading-relaxed">
                    {movie.overview || "No overview available."}
                </p>
            </div>
        </div>
    );
}
