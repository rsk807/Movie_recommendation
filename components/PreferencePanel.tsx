'use client';

import React from 'react';
import { GENRES, LANGUAGES, MOOD_GENRE_MAP } from '@/lib/constants';
import { MoodType, UserPreferences } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, Trash2, Sparkles } from 'lucide-react';

interface PreferencePanelProps {
    preferences: UserPreferences;
    onUpdate: (updates: Partial<UserPreferences>) => void;
    onClear: () => void;
    onGetRecommendations: () => void;
    loading?: boolean;
}

export default function PreferencePanel({
    preferences,
    onUpdate,
    onClear,
    onGetRecommendations,
    loading
}: PreferencePanelProps) {
    const toggleGenre = (id: number) => {
        const current = preferences.favoriteGenres;
        const updated = current.includes(id)
            ? current.filter(g => g !== id)
            : [...current, id];
        onUpdate({ favoriteGenres: updated });
    };

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-xl mb-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Discovery filters
                </h2>
                <button
                    onClick={onClear}
                    className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                >
                    <Trash2 className="h-3 w-3" />
                    Clear
                </button>
            </div>

            <div className="space-y-8">
                {/* Mood Section */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 block">Current Mood</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(MOOD_GENRE_MAP) as MoodType[]).map(mood => (
                            mood !== 'None' && (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => onUpdate({ mood: preferences.mood === mood ? 'None' : mood })}
                                    className={cn(
                                        "text-[10px] font-bold py-2.5 px-2 rounded border transition-all truncate uppercase tracking-wider",
                                        preferences.mood === mood
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-background hover:bg-secondary border-border"
                                    )}
                                >
                                    {mood}
                                </button>
                            )
                        ))}
                    </div>
                </div>

                {/* Rating & Year */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Min Rating</label>
                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">{preferences.minRating}+</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="10" step="0.5"
                            value={preferences.minRating}
                            onChange={(e) => onUpdate({ minRating: Number(e.target.value) })}
                            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Released After</label>
                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">{preferences.yearRange[0]}</span>
                        </div>
                        <input
                            type="range"
                            min="1960" max="2025" step="1"
                            value={preferences.yearRange[0]}
                            onChange={(e) => onUpdate({ yearRange: [Number(e.target.value), 2025] })}
                            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 block">Language</label>
                    <div className="relative">
                        <select
                            value={preferences.preferredLanguage}
                            onChange={(e) => onUpdate({ preferredLanguage: e.target.value })}
                            className="w-full bg-secondary/50 hover:bg-secondary border border-border rounded-md px-3 py-2.5 text-xs font-bold outline-none ring-primary/20 focus:ring-4 transition-all appearance-none"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code} className="bg-card">{lang.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</div>
                    </div>
                </div>

                {/* Genres */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 block">Genres Selection</label>
                    <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {GENRES.map(genre => (
                            <button
                                key={genre.id}
                                type="button"
                                onClick={() => toggleGenre(genre.id)}
                                className={cn(
                                    "text-[9px] font-bold px-3 py-1.5 rounded border transition-all uppercase tracking-tighter",
                                    preferences.favoriteGenres.includes(genre.id)
                                        ? "bg-primary text-white border-primary"
                                        : "bg-background hover:bg-secondary border-border"
                                )}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    onGetRecommendations();
                    document.getElementById('discovery-panel')?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={loading}
                className="mt-4 w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Sparkles className="h-4 w-4" />
                        Apply Changes
                    </>
                )}
            </button>
        </div>
    );
}
