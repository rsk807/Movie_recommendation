'use client';

import React from 'react';
import { UserPreferences, Movie, Genre } from '@/lib/types';
import { GENRES } from '@/lib/constants';
import { BarChart3, TrendingUp, Heart, Star } from 'lucide-react';

interface DashboardProps {
    preferences: UserPreferences;
    recommendations: Movie[];
}

export default function Dashboard({ preferences, recommendations }: DashboardProps) {
    const avgRating = recommendations.length > 0
        ? (recommendations.reduce((acc, m) => acc + m.vote_average, 0) / recommendations.length).toFixed(1)
        : '0.0';

    const topGenres = recommendations.length > 0
        ? Array.from(new Set(recommendations.flatMap(m => m.genre_ids)))
            .map(id => ({
                name: GENRES.find(g => g.id === id)?.name || 'Other',
                count: recommendations.filter(m => m.genre_ids.includes(id)).length
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
        : [];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Top Matches</p>
                    <p className="text-xl font-bold">{recommendations.length}</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Star className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg. Rating</p>
                    <p className="text-xl font-bold">{avgRating}</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <Heart className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Liked Movies</p>
                    <p className="text-xl font-bold">{preferences.likedMovies.length}</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Primary Genre</p>
                    <p className="text-xl font-bold truncate max-w-[120px]">
                        {topGenres[0]?.name || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}
