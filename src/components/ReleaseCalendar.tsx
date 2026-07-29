import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Bell, BellOff, Sparkles, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { Series } from '../types';

interface ReleaseCalendarProps {
  seriesList: Series[];
  onSelectSeries: (series: Series) => void;
  onToggleNotification: (seriesId: string) => void;
  onOpenAiHype: (series: Series) => void;
}

export const ReleaseCalendar: React.FC<ReleaseCalendarProps> = ({
  seriesList,
  onSelectSeries,
  onToggleNotification,
  onOpenAiHype,
}) => {
  const [onlyNotified, setOnlyNotified] = useState<boolean>(false);

  // Filter shows with nextRelease information
  const showsWithReleases = seriesList.filter(s => {
    if (!s.nextRelease) return false;
    if (onlyNotified && !s.notificationsEnabled) return false;
    return true;
  });

  // Sort chronologically by airDateISO
  showsWithReleases.sort((a, b) => {
    const timeA = new Date(a.nextRelease?.airDateISO || '').getTime();
    const timeB = new Date(b.nextRelease?.airDateISO || '').getTime();
    return timeA - timeB;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 border border-red-900/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            Calendario Oficial de Estrenos
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Próximos Lanzamientos en Netflix
          </h2>
          <p className="text-xs text-zinc-400">
            Sigue las fechas de lanzamiento exactas de nuevos episodios y temporadas globales.
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setOnlyNotified(!onlyNotified)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            onlyNotified
              ? 'bg-[#E50914] border-red-500 text-white shadow-lg shadow-red-900/40'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          {onlyNotified ? 'Mostrando: Mis Series Notificadas' : 'Mostrando: Todo el Catálogo'}
        </button>
      </div>

      {/* Calendar Timeline Grid */}
      {showsWithReleases.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-3">
          <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">No hay estrenos programados bajo este filtro</h3>
          <p className="text-xs text-zinc-500">
            Intenta desactivar el filtro de notificadas o añade más series a tu seguimiento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {showsWithReleases.map((series, idx) => {
            const rel = series.nextRelease!;
            return (
              <motion.div
                key={series.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group"
              >
                
                {/* Series & Poster Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={series.posterUrl}
                    alt={series.title}
                    className="w-16 h-22 object-cover rounded-xl border border-zinc-700/80 shadow shrink-0 group-hover:scale-105 transition-transform"
                  />

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-red-950 border border-red-800 text-red-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        T{rel.seasonNumber} Ep{rel.episodeNumber}
                      </span>
                      <span className="bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {series.genres[0]}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white truncate group-hover:text-red-400 transition-colors">
                      {series.title}
                    </h3>

                    <p className="text-xs font-semibold text-red-300">
                      "{rel.episodeTitle}"
                    </p>

                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {rel.synopsis || series.synopsis}
                    </p>
                  </div>
                </div>

                {/* Release Date Badge & Actions Right */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                  
                  {/* Countdown / Air Date Pill */}
                  <div className="bg-gradient-to-r from-red-950 to-zinc-950 border border-red-800/60 p-2.5 rounded-xl text-center min-w-[140px]">
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                      Fecha de Lanzamiento
                    </span>
                    <span className="text-sm font-black text-white block mt-0.5">
                      {rel.displayDate}
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleNotification(series.id)}
                      className={`p-2 rounded-lg text-xs font-bold transition-all ${
                        series.notificationsEnabled
                          ? 'bg-[#E50914] text-white shadow'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                      title={series.notificationsEnabled ? 'Notificación Activa' : 'Activar Notificación'}
                    >
                      {series.notificationsEnabled ? <Bell className="w-4 h-4 fill-current" /> : <BellOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onOpenAiHype(series)}
                      className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/40 text-purple-300 hover:bg-purple-900 transition-colors"
                      title="Teorías de Estreno AI"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectSeries(series)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg border border-zinc-700 transition-colors"
                    >
                      Ver Serie
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
