import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Bell,
  Calendar,
  Sparkles,
  Heart,
  Clock,
  Filter,
  CheckCircle2,
  Zap,
  Plus,
  Tv,
  Star,
  Check,
  Volume2,
  X,
  Play
} from 'lucide-react';

import { Series, NotificationItem, WatchStatus } from './types';
import { INITIAL_SERIES_CATALOG, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/Header';
import { SeriesCard } from './components/SeriesCard';
import { SeriesDetailModal } from './components/SeriesDetailModal';
import { NotificationCenter } from './components/NotificationCenter';
import { ReleaseCalendar } from './components/ReleaseCalendar';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AddCustomSeriesModal } from './components/AddCustomSeriesModal';

export default function App() {
  // Load initial state from localStorage or mock defaults
  const [seriesList, setSeriesList] = useState<Series[]>(() => {
    try {
      const saved = localStorage.getItem('netflix_tracker_series');
      return saved ? JSON.parse(saved) : INITIAL_SERIES_CATALOG;
    } catch (e) {
      return INITIAL_SERIES_CATALOG;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('netflix_tracker_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeTab, setActiveTab] = useState<'watchlist' | 'calendar' | 'notifications' | 'ai'>('watchlist');
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'watching' | 'plan_to_watch' | 'completed' | 'favorites' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('netflix_tracker_series', JSON.stringify(seriesList));
  }, [seriesList]);

  useEffect(() => {
    localStorage.setItem('netflix_tracker_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Audio effect helper for notification chime
  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Notification per Series
  const handleToggleNotification = (seriesId: string) => {
    setSeriesList(prev =>
      prev.map(series => {
        if (series.id === seriesId) {
          const newState = !series.notificationsEnabled;
          showToast(
            newState
              ? `🔔 Notificaciones ACTIVADAS para "${series.title}"`
              : `🔕 Notificaciones deshabilitadas para "${series.title}"`
          );
          if (newState) playNotificationSound();
          return { ...series, notificationsEnabled: newState };
        }
        return series;
      })
    );
  };

  // Toggle Favorite
  const handleToggleFavorite = (seriesId: string) => {
    setSeriesList(prev =>
      prev.map(series => {
        if (series.id === seriesId) {
          const newFav = !series.isFavorite;
          showToast(newFav ? `❤️ Añadido a Favoritos: "${series.title}"` : `Quitado de Favoritos`);
          return { ...series, isFavorite: newFav };
        }
        return series;
      })
    );
  };

  // Change Watch Status
  const handleChangeStatus = (seriesId: string, status: WatchStatus) => {
    setSeriesList(prev =>
      prev.map(series => {
        if (series.id === seriesId) {
          return { ...series, watchStatus: status };
        }
        return series;
      })
    );
    showToast(`Estado actualizado a: ${status.replace('_', ' ')}`);
  };

  // Toggle Episode Watched
  const handleToggleEpisodeWatched = (seriesId: string, seasonNum: number, epId: string) => {
    setSeriesList(prev =>
      prev.map(series => {
        if (series.id === seriesId) {
          const updatedSeasons = series.seasons.map(season => {
            if (season.seasonNumber === seasonNum) {
              const updatedEpisodes = season.episodes.map(ep => {
                if (ep.id === epId) {
                  return { ...ep, isWatched: !ep.isWatched };
                }
                return ep;
              });
              return { ...season, episodes: updatedEpisodes };
            }
            return season;
          });

          // Calculate current episode progress
          const currentSeasonData = updatedSeasons.find(s => s.seasonNumber === seasonNum);
          const watchedInSeason = currentSeasonData?.episodes.filter(e => e.isWatched).length || 0;

          return {
            ...series,
            seasons: updatedSeasons,
            currentEpisode: watchedInSeason > 0 ? watchedInSeason : 1,
          };
        }
        return series;
      })
    );

    // Keep active modal in sync
    if (selectedSeries && selectedSeries.id === seriesId) {
      const updatedShow = seriesList.find(s => s.id === seriesId);
      if (updatedShow) setSelectedSeries(updatedShow);
    }
  };

  // Toggle Season Watched
  const handleToggleSeasonWatched = (seriesId: string, seasonNum: number, markAll: boolean) => {
    setSeriesList(prev =>
      prev.map(series => {
        if (series.id === seriesId) {
          const updatedSeasons = series.seasons.map(season => {
            if (season.seasonNumber === seasonNum) {
              const updatedEpisodes = season.episodes.map(ep => ({
                ...ep,
                isWatched: markAll,
              }));
              return { ...season, episodes: updatedEpisodes };
            }
            return season;
          });
          return { ...series, seasons: updatedSeasons };
        }
        return series;
      })
    );
    showToast(markAll ? `✅ Temporada ${seasonNum} marcada como vista` : `Paso a no vista`);
  };

  // Update Rating and Notes
  const handleUpdateRatingNotes = (seriesId: string, rating: number, notes: string) => {
    setSeriesList(prev =>
      prev.map(series => {
        if (series.id === seriesId) {
          return { ...series, userRating: rating, userNotes: notes };
        }
        return series;
      })
    );
    showToast(`Nota guardada correctamente para la serie`);
  };

  // Add Custom Series
  const handleAddSeries = (newShow: Series) => {
    setSeriesList(prev => [newShow, ...prev]);
    showToast(`Serie "${newShow.title}" agregada a tu lista`);
  };

  // Notification Operations
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast('Historial de notificaciones limpiado');
  };

  // SIMULATE LIVE RELEASE ALERT (Demonstrates real-time episode release notifications)
  const handleSimulateReleaseAlert = () => {
    playNotificationSound();

    const sampleShow = seriesList.find(s => s.notificationsEnabled) || seriesList[0];
    const newAlert: NotificationItem = {
      id: `notif-sim-${Date.now()}`,
      seriesId: sampleShow.id,
      seriesTitle: sampleShow.title,
      seriesPoster: sampleShow.posterUrl,
      title: '🚨 ESTRENO EN VIVO: ¡Nuevo Episodio Disponible!',
      message: `¡Atención! El nuevo episodio de "${sampleShow.title}" ya está disponible para transmitir en Netflix.`,
      type: 'new_episode',
      timestamp: 'Ahora mismo',
      read: false,
      releaseDate: 'Disponible Ahora',
    };

    setNotifications(prev => [newAlert, ...prev]);
    showToast(`🚨 ¡ESTRENO EN NETFLIX! Nuevo episodio disponible de ${sampleShow.title}`);
  };

  // Filter Series for Watchlist Tab
  const filteredSeries = seriesList.filter(series => {
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchTitle = series.title.toLowerCase().includes(q);
      const matchGenre = series.genres.some(g => g.toLowerCase().includes(q));
      const matchCast = series.cast.some(c => c.toLowerCase().includes(q));
      if (!matchTitle && !matchGenre && !matchCast) return false;
    }

    // Tab filter
    if (watchlistFilter === 'watching') return series.watchStatus === 'watching';
    if (watchlistFilter === 'plan_to_watch') return series.watchStatus === 'plan_to_watch';
    if (watchlistFilter === 'completed') return series.watchStatus === 'completed';
    if (watchlistFilter === 'favorites') return series.isFavorite;
    if (watchlistFilter === 'upcoming') return series.status === 'Próximo Estreno' || !!series.nextRelease;

    return true;
  });

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 font-sans selection:bg-[#E50914] selection:text-white flex flex-col justify-between">
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-[#E50914] text-white text-xs sm:text-sm font-extrabold px-4 py-3 rounded-xl shadow-2xl border border-red-400 flex items-center gap-3 backdrop-blur-md"
          >
            <Bell className="w-4 h-4 animate-bounce shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadNotifCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onSimulateReleaseAlert={handleSimulateReleaseAlert}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* VIEW 1: WATCHLIST & CATALOG */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            
            {/* Hero Highlight Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#E50914] text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                    DESTACADO DE HOY
                  </span>
                  <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Estreno en 3 Días
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Stranger Things 5: El Capítulo Final
                </h1>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Hawkins se prepara para la batalla definitiva. Recibe notificaciones automáticas en cuanto se libere el episodio 1 de la temporada final.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const st = seriesList.find(s => s.id === 'stranger-things');
                      if (st) setSelectedSeries(st);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-900/40"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Ver Tráiler & Episodios
                  </button>

                  <button
                    onClick={handleSimulateReleaseAlert}
                    className="flex items-center gap-2 px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold rounded-xl border border-zinc-700 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    Simular Notificación
                  </button>
                </div>
              </div>

              {/* Poster Art Right */}
              <div className="relative shrink-0 w-36 sm:w-48 aspect-[2/3] rounded-xl overflow-hidden border-2 border-red-600/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="Stranger Things 5"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Watchlist Filter Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {[
                  { id: 'all', label: 'Todas', count: seriesList.length },
                  { id: 'watching', label: '🍿 Viendo', count: seriesList.filter(s => s.watchStatus === 'watching').length },
                  { id: 'plan_to_watch', label: '📋 Por Ver', count: seriesList.filter(s => s.watchStatus === 'plan_to_watch').length },
                  { id: 'completed', label: '✅ Completadas', count: seriesList.filter(s => s.watchStatus === 'completed').length },
                  { id: 'favorites', label: '❤️ Favoritas', count: seriesList.filter(s => s.isFavorite).length },
                  { id: 'upcoming', label: '🚀 Próximos Estrenos', count: seriesList.filter(s => s.status === 'Próximo Estreno').length },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setWatchlistFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      watchlistFilter === filter.id
                        ? 'bg-[#E50914] text-white shadow-md shadow-red-900/30'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Status counter */}
              <div className="text-xs text-zinc-400 font-medium shrink-0">
                Mostrando <span className="font-bold text-white">{filteredSeries.length}</span> series
              </div>

            </div>

            {/* Series Cards Grid */}
            {filteredSeries.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
                <Tv className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-zinc-300">No hay series en esta sección</h3>
                <p className="text-xs text-zinc-500">
                  Prueba cambiando de filtro o busca con otra palabra clave.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.map(series => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    onSelectSeries={(s) => setSelectedSeries(s)}
                    onToggleNotification={handleToggleNotification}
                    onToggleFavorite={handleToggleFavorite}
                    onChangeStatus={handleChangeStatus}
                    onOpenAiRecap={(s) => {
                      setSelectedSeries(s);
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: RELEASE CALENDAR */}
        {activeTab === 'calendar' && (
          <ReleaseCalendar
            seriesList={seriesList}
            onSelectSeries={(s) => setSelectedSeries(s)}
            onToggleNotification={handleToggleNotification}
            onOpenAiHype={(s) => {
              setSelectedSeries(s);
            }}
          />
        )}

        {/* VIEW 3: NOTIFICATIONS CENTER */}
        {activeTab === 'notifications' && (
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
            onSimulateReleaseAlert={handleSimulateReleaseAlert}
            browserNotificationsEnabled={browserNotificationsEnabled}
            onToggleBrowserNotifications={() => {
              setBrowserNotificationsEnabled(!browserNotificationsEnabled);
              showToast(
                !browserNotificationsEnabled
                  ? 'Alertas web del navegador activadas'
                  : 'Alertas desactivadas'
              );
            }}
          />
        )}

        {/* VIEW 4: AI ASSISTANT */}
        {activeTab === 'ai' && (
          <AiAssistantModal
            seriesList={seriesList}
            onAddRecommendedShow={(title) => {
              showToast(`Añadiendo recomendación: ${title}`);
            }}
          />
        )}

      </main>

      {/* Show Details Modal */}
      <SeriesDetailModal
        series={selectedSeries}
        onClose={() => setSelectedSeries(null)}
        onToggleEpisodeWatched={handleToggleEpisodeWatched}
        onToggleSeasonWatched={handleToggleSeasonWatched}
        onToggleNotification={handleToggleNotification}
        onToggleFavorite={handleToggleFavorite}
        onUpdateUserRatingNotes={handleUpdateRatingNotes}
        onChangeStatus={handleChangeStatus}
      />

      {/* Add Custom Series Modal */}
      <AddCustomSeriesModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSeries={handleAddSeries}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-4 text-center text-xs text-zinc-500 bg-[#0f0f0f] mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#E50914] text-white font-bold px-1.5 py-0.5 rounded text-[10px]">N</span>
            <span className="font-semibold text-zinc-400">Netflix Series Tracker & Release Notifier</span>
          </div>
          <p>© 2026 FlixPulse • Impulsado por Gemini 3.6 AI</p>
        </div>
      </footer>

    </div>
  );
}
