import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, BellOff, Heart, Check, Clock, Star, Sparkles, Film, Calendar, Volume2, ShieldAlert, MessageSquare } from 'lucide-react';
import { Series, WatchStatus } from '../types';

interface SeriesDetailModalProps {
  series: Series | null;
  onClose: () => void;
  onToggleEpisodeWatched: (seriesId: string, seasonNum: number, epId: string) => void;
  onToggleSeasonWatched: (seriesId: string, seasonNum: number, markAll: boolean) => void;
  onToggleNotification: (seriesId: string) => void;
  onToggleFavorite: (seriesId: string) => void;
  onUpdateUserRatingNotes: (seriesId: string, rating: number, notes: string) => void;
  onChangeStatus: (seriesId: string, status: WatchStatus) => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({
  series,
  onClose,
  onToggleEpisodeWatched,
  onToggleSeasonWatched,
  onToggleNotification,
  onToggleFavorite,
  onUpdateUserRatingNotes,
  onChangeStatus,
}) => {
  if (!series) return null;

  const [selectedSeason, setSelectedSeason] = useState<number>(series.currentSeason || 1);
  const [userRating, setUserRating] = useState<number>(series.userRating || 5);
  const [userNotes, setUserNotes] = useState<string>(series.userNotes || '');
  
  // AI Modal states
  const [aiRecapLoading, setAiRecapLoading] = useState<boolean>(false);
  const [aiRecapText, setAiRecapText] = useState<string>('');
  const [aiHypeLoading, setAiHypeLoading] = useState<boolean>(false);
  const [aiHypeText, setAiHypeText] = useState<string>('');

  // Countdown timer state for next release
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    if (!series.nextRelease?.airDateISO) return;

    const targetDate = new Date(series.nextRelease.airDateISO).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [series.nextRelease]);

  const activeSeasonData = series.seasons.find(s => s.seasonNumber === selectedSeason) || series.seasons[0];

  const handleSaveNotes = () => {
    onUpdateUserRatingNotes(series.id, userRating, userNotes);
  };

  const fetchAiRecap = async () => {
    setAiRecapLoading(true);
    setAiRecapText('');
    try {
      const res = await fetch('/api/ai/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showTitle: series.title,
          season: selectedSeason,
          episode: series.currentEpisode || 1,
        }),
      });
      const data = await res.json();
      if (data.recap) {
        setAiRecapText(data.recap);
      } else {
        setAiRecapText('No se pudo generar el resumen. Intenta nuevamente.');
      }
    } catch (e: any) {
      setAiRecapText('Error al comunicarse con el servicio AI.');
    } finally {
      setAiRecapLoading(false);
    }
  };

  const fetchAiHype = async () => {
    setAiHypeLoading(true);
    setAiHypeText('');
    try {
      const res = await fetch('/api/ai/hype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showTitle: series.title }),
      });
      const data = await res.json();
      if (data.hype) {
        setAiHypeText(data.hype);
      } else {
        setAiHypeText('No hay novedades disponibles en este momento.');
      }
    } catch (e) {
      setAiHypeText('Error al cargar novedades de la serie.');
    } finally {
      setAiHypeLoading(false);
    }
  };

  const isSeasonFullyWatched = activeSeasonData?.episodes.every(e => e.isWatched) ?? false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto flex-1">
            
            {/* Backdrop Hero Header */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950">
              <img
                src={series.backdropUrl}
                alt={series.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

              {/* Title & Primary Badges */}
              <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#E50914] text-white text-xs font-black px-2.5 py-0.5 rounded shadow">
                    SERIE NETFLIX
                  </span>
                  <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {series.matchScore}% Coincidencia
                  </span>
                  <span className="bg-zinc-900/80 text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-zinc-700">
                    {series.maturityRating}
                  </span>
                  <span className="bg-zinc-900/80 text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-zinc-700">
                    {series.totalSeasons} Temporadas
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {series.title}
                </h1>

                {/* Quick Toggle Bar inside Hero */}
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <button
                    onClick={() => onToggleNotification(series.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      series.notificationsEnabled
                        ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/40'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {series.notificationsEnabled ? <Bell className="w-4 h-4 fill-current animate-bounce" /> : <BellOff className="w-4 h-4" />}
                    {series.notificationsEnabled ? 'Notificaciones ACTIVADAS' : 'Activar Notificaciones'}
                  </button>

                  <button
                    onClick={() => onToggleFavorite(series.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      series.isFavorite
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${series.isFavorite ? 'fill-current' : ''}`} />
                    {series.isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}
                  </button>

                  <select
                    value={series.watchStatus}
                    onChange={(e) => onChangeStatus(series.id, e.target.value as WatchStatus)}
                    className="bg-zinc-800 text-zinc-200 text-xs font-bold rounded-lg px-3 py-1.5 border border-zinc-700 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="watching">🍿 Viendo</option>
                    <option value="plan_to_watch">📋 Por Ver</option>
                    <option value="completed">✅ Completada</option>
                    <option value="on_hold">⏸️ En Pausa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Next Episode Release Live Countdown Box */}
            {series.nextRelease && (
              <div className="mx-6 -mt-3 relative z-20 bg-gradient-to-r from-red-950/90 via-zinc-900 to-zinc-900 border border-red-700/50 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start text-red-400 font-extrabold text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4 animate-pulse" />
                    Próximo Estreno de Episodio en Netflix
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    T{series.nextRelease.seasonNumber} Ep{series.nextRelease.episodeNumber}: "{series.nextRelease.episodeTitle}"
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Fecha programada: <span className="text-red-300 font-medium">{series.nextRelease.displayDate}</span>
                  </p>
                </div>

                {/* Countdown Timer Badges */}
                <div className="flex items-center gap-2 bg-black/60 p-2.5 rounded-lg border border-red-900/40 shrink-0">
                  <div className="flex flex-col items-center px-2">
                    <span className="text-lg font-black text-white">{timeLeft.days}</span>
                    <span className="text-[9px] uppercase text-zinc-400 font-semibold">Días</span>
                  </div>
                  <span className="text-red-500 font-bold">:</span>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-zinc-400 font-semibold">Horas</span>
                  </div>
                  <span className="text-red-500 font-bold">:</span>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-lg font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-zinc-400 font-semibold">Min</span>
                  </div>
                  <span className="text-red-500 font-bold">:</span>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-lg font-black text-red-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-zinc-400 font-semibold">Seg</span>
                  </div>
                </div>
              </div>
            )}

            {/* Main Show Details Section */}
            <div className="p-6 space-y-6">
              
              {/* Synopsis & Cast */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Sinopsis</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {series.synopsis}
                  </p>

                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {series.genres.map((g, idx) => (
                      <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-700">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Elenco Principal</h4>
                  <ul className="text-xs text-zinc-300 space-y-1">
                    {series.cast.map((actor, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-red-500">•</span> {actor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Features Action Bar */}
              <div className="p-4 bg-gradient-to-r from-purple-950/50 via-zinc-900 to-red-950/50 rounded-xl border border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-900/60 text-purple-300 border border-purple-500/30">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-200">Asistente Inteligente para esta Serie</h4>
                    <p className="text-[11px] text-zinc-400">
                      Obtén un resumen de lo sucedido o conoce teorías de estreno sin spoilers.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={fetchAiRecap}
                    disabled={aiRecapLoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {aiRecapLoading ? 'Generando...' : 'Resumen AI (Sin Spoilers)'}
                  </button>

                  <button
                    onClick={fetchAiHype}
                    disabled={aiHypeLoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {aiHypeLoading ? 'Buscando...' : 'Teorías de Estreno'}
                  </button>
                </div>
              </div>

              {/* AI Output Result Box if loaded */}
              {(aiRecapText || aiHypeText) && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-purple-700/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300 border-b border-zinc-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Respuesta del Asistente AI
                    </span>
                    <button
                      onClick={() => { setAiRecapText(''); setAiHypeText(''); }}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      Cerrar
                    </button>
                  </div>
                  <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                    {aiRecapText || aiHypeText}
                  </div>
                </div>
              )}

              {/* Seasons & Episodes Section */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-500" />
                    Temporadas y Episodios
                  </h3>

                  {/* Mark All Season Watched Action */}
                  <button
                    onClick={() => onToggleSeasonWatched(series.id, selectedSeason, !isSeasonFullyWatched)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isSeasonFullyWatched
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isSeasonFullyWatched ? 'Temporada Vista' : 'Marcar Temporada Completa'}
                  </button>
                </div>

                {/* Season Tabs Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
                  {series.seasons.map((season) => (
                    <button
                      key={season.seasonNumber}
                      onClick={() => setSelectedSeason(season.seasonNumber)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedSeason === season.seasonNumber
                          ? 'bg-[#E50914] text-white shadow-md shadow-red-900/40'
                          : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {season.title || `Temporada ${season.seasonNumber}`}
                    </button>
                  ))}
                </div>

                {/* Episode List */}
                <div className="space-y-2">
                  {activeSeasonData?.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      onClick={() => onToggleEpisodeWatched(series.id, selectedSeason, episode.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                        episode.isWatched
                          ? 'bg-zinc-950/80 border-zinc-800/80 opacity-80'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="pt-0.5">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            episode.isWatched
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-zinc-600 group-hover:border-red-500'
                          }`}
                        >
                          {episode.isWatched && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* Episode Information */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs sm:text-sm font-bold ${episode.isWatched ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>
                            E{episode.episodeNumber}. {episode.title}
                          </h4>

                          <div className="flex items-center gap-2 shrink-0 text-[11px] text-zinc-400">
                            {episode.isNewRelease && (
                              <span className="bg-red-950 text-red-300 font-extrabold text-[10px] px-2 py-0.5 rounded border border-red-800 animate-pulse">
                                NUEVO ESTRENO
                              </span>
                            )}
                            <span>{episode.durationMinutes} min</span>
                            <span>•</span>
                            <span>{episode.releaseDate}</span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {episode.synopsis}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Personal Rating & Watch Notes Section */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Tu Calificación y Notas Personales
                </h4>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">Calificación:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= userRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Notas sobre la serie:</label>
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Escribe tus teorías, opiniones o comentarios sobre los episodios..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500 h-20 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg border border-zinc-700 transition-colors"
                  >
                    Guardar Notas
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};
