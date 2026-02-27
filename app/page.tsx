'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PreferencePanel from '@/components/PreferencePanel';
import MovieGrid from '@/components/MovieGrid';
import WatchlistDrawer from '@/components/WatchlistDrawer';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';
import InfoModal from '@/components/InfoModal';
import { Movie, UserPreferences } from '@/lib/types';
import { PreferenceManager } from '@/lib/preferences';
import { Bookmark, Sparkles, Wand2, Play, Info, ChevronRight, Heart, EyeOff, SlidersHorizontal, Search, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { TMDB_IMAGE_BASE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Home() {
  const [preferences, setPreferences] = useState<UserPreferences>(PreferenceManager.getPreferences());
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [infoModal, setInfoModal] = useState<{ open: boolean; type: 'help' | 'privacy' }>({ open: false, type: 'help' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (customPrefs?: UserPreferences) => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customPrefs || preferences),
      });
      const data = await res.json();
      setRecommendations(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = PreferenceManager.setPreferences(updates);
    if (updated) {
      setPreferences(updated);
      setLoading(true);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchRecommendations(updated);
      }, 500);
    }
  };

  const handleClearPreferences = () => {
    const cleared = PreferenceManager.clearPreferences();
    if (cleared) {
      setPreferences(cleared);
      setRecommendations([]);
    }
  };

  const featuredMovie = recommendations[0] || null;

  const handleMovieSelect = (movie: Movie) => {
    PreferenceManager.toggleMovieInList(movie.id, 'likedMovies');
    const updated = PreferenceManager.getPreferences();
    setPreferences(updated);
    fetchRecommendations(updated);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Header
        onMovieSelect={handleMovieSelect}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        language={preferences.preferredLanguage}
        watchlistCount={preferences.watchlist.length}
      />

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredMovie?.id || 'empty'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {featuredMovie && featuredMovie.backdrop_path ? (
              <Image
                src={`${TMDB_IMAGE_BASE_URL}original${featuredMovie.backdrop_path}`}
                alt={featuredMovie.title}
                fill
                priority
                className="object-cover transition-transform duration-10000 scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = 'linear-gradient(to bottom right, var(--background), var(--card), rgba(var(--primary), 0.2))';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-background via-card to-primary/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-4 sm:px-8 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                Featured Match
              </span>
              {featuredMovie && (
                <span className="text-primary font-bold text-sm">99% Relevant</span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              {featuredMovie?.title || "YOUR MOVIE JUNKIE JOURNEY STARTS HERE"}
            </h1>

            <p className="text-lg text-white/70 line-clamp-3 md:line-clamp-4 max-w-xl font-medium leading-relaxed">
              {featuredMovie?.overview || "Tell us what you love, how you feel, and we'll scan millions of movies to find your next obsession. Powered by AI and real-time TMDB data."}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => {
                  if (featuredMovie) {
                    PreferenceManager.toggleMovieInList(featuredMovie.id, 'watchlist');
                    const updated = PreferenceManager.getPreferences();
                    setPreferences(updated);
                    fetchRecommendations(updated);
                  }
                }}
                className="bg-white text-black font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-md hover:bg-white/90 active:scale-95 transition-all shadow-2xl flex items-center gap-2 text-sm sm:text-base"
              >
                <div className="bg-black text-white rounded-full p-1">
                  {preferences.watchlist.includes(featuredMovie?.id || 0) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                {preferences.watchlist.includes(featuredMovie?.id || 0) ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => featuredMovie && handleMovieSelect(featuredMovie)}
                  className={cn(
                    "p-4 rounded-md transition-all flex items-center gap-2 font-bold backdrop-blur-md",
                    featuredMovie && preferences.likedMovies.includes(featuredMovie.id)
                      ? "bg-primary text-white"
                      : "bg-zinc-700/60 text-white hover:bg-zinc-700 font-bold"
                  )}
                >
                  <Heart className={cn("h-6 w-6", featuredMovie && preferences.likedMovies.includes(featuredMovie.id) && "fill-current")} />
                  {featuredMovie && preferences.likedMovies.includes(featuredMovie.id) ? 'Liked' : 'Like'}
                </button>
                <button
                  onClick={() => {
                    if (featuredMovie) {
                      PreferenceManager.toggleMovieInList(featuredMovie.id, 'hiddenMovies');
                      setPreferences(PreferenceManager.getPreferences());
                      fetchRecommendations();
                    }
                  }}
                  className="p-4 rounded-md bg-zinc-700/60 text-white hover:bg-zinc-700 transition-all backdrop-blur-md"
                  title="Hide this recommendation"
                >
                  <EyeOff className="h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative z-20 -mt-32 space-y-16 pb-20">
        <div className="container mx-auto px-4 sm:px-8">
          <Dashboard preferences={preferences} recommendations={recommendations} />
        </div>

        <div id="discovery-panel" className="container mx-auto px-4 sm:px-8 flex flex-col lg:grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden w-full flex items-center justify-between p-4 rounded-xl bg-card border font-bold text-sm uppercase tracking-widest"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              {showMobileFilters ? 'Hide Filters' : 'Refine Discovery'}
            </div>
            <span className="text-[10px] text-muted-foreground">{preferences.favoriteGenres.length + (preferences.mood !== 'None' ? 1 : 0)} Active</span>
          </button>

          {/* Preference Sidebar */}
          <div className={cn(
            "lg:col-span-1 lg:block",
            showMobileFilters ? "block" : "hidden"
          )}>
            <div className="sticky top-24 space-y-4">
              <PreferencePanel
                preferences={preferences}
                onUpdate={handleUpdatePreferences}
                onClear={handleClearPreferences}
                onGetRecommendations={fetchRecommendations}
                loading={loading}
              />

              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20 transition-all group"
              >
                <Bookmark className="h-5 w-5 group-hover:scale-110 transition-transform" />
                View Watchlist ({preferences.watchlist.length})
              </button>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 border-b border-primary/20 pb-4">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2 sm:gap-3">
                <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                Your Top Matches
              </h2>
              <button
                onClick={() => fetchRecommendations()}
                className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:underline underline-offset-4 bg-transparent border-none p-0 outline-none"
              >
                Fresh Data <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {loading && recommendations.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="aspect-[2/3] bg-card/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <MovieGrid
                movies={recommendations}
                preferences={preferences}
                onRefresh={() => {
                  const updated = PreferenceManager.getPreferences();
                  setPreferences(updated);
                  fetchRecommendations(updated);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistIds={preferences.watchlist}
        language={preferences.preferredLanguage}
        onRemove={(id) => {
          PreferenceManager.toggleMovieInList(id, 'watchlist');
          setPreferences(PreferenceManager.getPreferences());
        }}
      />

      <Footer onShowInfo={(type) => setInfoModal({ open: true, type })} />

      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ ...infoModal, open: false })}
        type={infoModal.type}
      />
    </main>
  );
}
