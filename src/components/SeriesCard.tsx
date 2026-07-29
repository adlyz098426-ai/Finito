import React from 'react';
import { motion } from 'motion/react';
import { Bell, BellOff, Heart, Play, Sparkles, CheckCircle2, Clock, Star, ChevronRight } from 'lucide-react';
import { Series, WatchStatus } from '../types';

interface SeriesCardProps {
  series: Series;
  onSelectSeries: (series: Series) => void;
  onToggleNotification: (seriesId: string) => void;
  onToggleFavorite: (seriesId: string) => void;
  onChangeStatus: (seriesId: string, status: WatchStatus) => void;
  onOpenAiRecap: (series: Series) => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  onSelectSeries,
  onToggleNotification,
  onToggleFavorite,
  onChangeStatus,
  onOpenAiRecap,
}) => {
  // Calculate total watched episodes
  const totalWatched = series.seasons.reduce((acc, season) => {
    return acc + season.episodes.filter(ep => ep.isWatched).length;
  }, 0);

  const totalEpisodes = series.totalEpisodes || 1;
  const progressPercent = Math.min(100, Math.round((totalWatched / totalEpisodes) * 100));

  const statusLabels: Record<WatchStatus, { label: string; color: string }> = {
    watching: { label: 'Viendo', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    plan_to_watch: { label: 'Por Ver', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    completed: { label: 'Completada', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    on_hold: { label: 'En Pausa', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    favorites: { label: 'Favorita', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-zinc-900/90 rounded-xl border border-zinc-800/80 overflow-hidden shadow-lg hover:shadow-2xl hover:border-zinc-700/80 flex flex-col justify-between"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[16/9] sm:aspect-[3/2] overflow-hidden bg-zinc-950">
        <img
          src={series.backdropUrl || series.posterUrl}
          alt={series.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
          loading="lazy"
        />

        {/* Dark Gradients for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-black/60" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Match Score */}
            <span className="bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
              {series.matchScore}% Coincidencia
            </span>

            {/* Maturity Rating */}
            <span className="bg-zinc-900/80 backdrop-blur-md text-zinc-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-zinc-700">
              {series.maturityRating}
            </span>
          </div>

          {/* Quick Actions Right (Favorite & Notification Toggle) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(series.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                series.isFavorite
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                  : 'bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80'
              }`}
              title={series.isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
            >
              <Heart className={`w-3.5 h-3.5 ${series.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleNotification(series.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                series.notificationsEnabled
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-900/50'
                  : 'bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80'
              }`}
              title={
                series.notificationsEnabled
                  ? 'Notificaciones activadas (Desactivar)'
                  : 'Activar notificaciones de nuevos episodios'
              }
            >
              {series.notificationsEnabled ? (
                <Bell className="w-3.5 h-3.5 fill-current animate-pulse" />
              ) : (
                <BellOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Title & Status Badge on Backdrop */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusLabels[series.watchStatus]?.color}`}>
              {statusLabels[series.watchStatus]?.label}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
              T{series.currentSeason || 1} • Ep {series.currentEpisode || 1}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white tracking-wide truncate group-hover:text-red-400 transition-colors">
            {series.title}
          </h3>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3 bg-zinc-900/95">
        
        {/* Next Episode Release Alert Banner if Available */}
        {series.nextRelease ? (
          <div className="bg-red-950/40 border border-red-800/40 rounded-lg p-2 flex items-start gap-2">
            <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-red-300 truncate">
                  Estreno: T{series.nextRelease.seasonNumber} Ep{series.nextRelease.episodeNumber}
                </span>
                <span className="text-red-400 font-extrabold ml-1 shrink-0">
                  {series.nextRelease.displayDate}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                "{series.nextRelease.episodeTitle}"
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed italic">
            "{series.synopsis}"
          </p>
        )}

        {/* Progress Bar & Episode Count */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Progreso de la Serie</span>
            <span className="font-semibold text-zinc-200">
              {totalWatched} / {totalEpisodes} epis. ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Genres & Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {series.genres.slice(0, 3).map((g, idx) => (
            <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/60">
              {g}
            </span>
          ))}
          {series.notificationsEnabled && (
            <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800/50 flex items-center gap-1">
              <Bell className="w-2.5 h-2.5" /> Alertas
            </span>
          )}
        </div>

        {/* Status Switcher & Action Buttons */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          
          {/* Status Dropdown Selector */}
          <select
            value={series.watchStatus}
            onChange={(e) => onChangeStatus(series.id, e.target.value as WatchStatus)}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-800 text-zinc-200 text-xs rounded-md px-2 py-1 border border-zinc-700 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="watching">🍿 Viendo</option>
            <option value="plan_to_watch">📋 Por Ver</option>
            <option value="completed">✅ Completada</option>
            <option value="on_hold">⏸️ En Pausa</option>
          </select>

          <div className="flex items-center gap-1.5">
            {/* AI Recap Quick Button */}
            <button
              onClick={() => onOpenAiRecap(series)}
              className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-700/40 text-purple-300 transition-colors"
              title="Obtener resumen AI sin spoilers"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {/* View Details / Episodes Button */}
            <button
              onClick={() => onSelectSeries(series)}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#E50914] hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              Episodios
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
