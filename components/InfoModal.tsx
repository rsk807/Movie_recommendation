'use client';

import React from 'react';
import { X, HelpCircle, ShieldCheck, Tv, Sparkles, Languages, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'help' | 'privacy';
}

export default function InfoModal({ isOpen, onClose, type }: InfoModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        {type === 'help' ? (
                            <>
                                <HelpCircle className="h-6 w-6 text-primary" />
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">How to use CineMatch</h2>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">Privacy & Rights</h2>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {type === 'help' ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Sparkles className="h-4 w-4" />
                                        <h3 className="font-bold uppercase text-xs tracking-widest">1. Set Discovery</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Use the Discovery Panel to choose your current <strong>Mood</strong> or select specific <strong>Genres</strong> you're interested in.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Languages className="h-4 w-4" />
                                        <h3 className="font-bold uppercase text-xs tracking-widest">2. Filter Results</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Adjust the <strong>Rating</strong>, <strong>Release Year</strong>, and <strong>Language</strong> filters to match your exact taste.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Heart className="h-4 w-4" />
                                        <h3 className="font-bold uppercase text-xs tracking-widest">3. Build List</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Like movies or add them to your <strong>Watchlist</strong> by hovering over cards. This helps humanize your future recommendations.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Tv className="h-4 w-4" />
                                        <h3 className="font-bold uppercase text-xs tracking-widest">4. Quick Search</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Use the search bar in the header to find specific movies and directly add them to your collection.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-center">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                                    Pro Tip: Click "Fresh Data" anytime to get a new set of targeted matches!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white">Data Rights Management</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    CineMatch is a movie exploration platform that leverages the extensive database of The Movie Database (TMDB).
                                    <span className="block mt-4 p-4 bg-red-600/10 border-l-4 border-red-600 font-bold text-white italic">
                                        "All movie data, titles, descriptions, and images are provided by The Movie Database (TMDB). All rights reserved to TMDB."
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-4 border-t border-white/5 pt-6">
                                <h3 className="text-lg font-bold text-white">Your Privacy</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    CineMatch does not store your personal information on our servers. All your preferences, likes, and watchlists are
                                    <strong> stored locally in your browser</strong>. We do not track you or sell your data.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
                                <img
                                    src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                                    alt="TMDB Logo"
                                    className="h-6"
                                />
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                    This product uses the TMDB API but is not endorsed or certified by TMDB.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
