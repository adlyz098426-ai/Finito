import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Film, Sparkles, Image, Calendar, Check } from 'lucide-react';
import { Series, WatchStatus } from '../types';

interface AddCustomSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSeries: (newSeries: Series) => void;
}

export const AddCustomSeriesModal: React.FC<AddCustomSeriesModalProps> = ({
  isOpen,
  onClose,
  onAddSeries,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState('Sci-Fi, Drama');
  const [synopsis, setSynopsis] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [totalSeasons, setTotalSeasons] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(10);
  const [status, setStatus] = useState<'En Emisión' | 'Próximo Estreno' | 'Completada' | 'En Producción'>('Próximo Estreno');
  const [watchStatus, setWatchStatus] = useState<WatchStatus>('plan_to_watch');
  const [nextReleaseDate, setNextReleaseDate] = useState('2026-09-01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const defaultPoster = posterUrl.trim() || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80';
    const defaultBackdrop = backdropUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';

    const parsedGenres = genres.split(',').map(g => g.trim()).filter(Boolean);

    const newShow: Series = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      posterUrl: defaultPoster,
      backdropUrl: defaultBackdrop,
      genres: parsedGenres.length ? parsedGenres : ['Drama'],
      year: new Date().getFullYear(),
      maturityRating: '16+',
      matchScore: 98,
      status,
      synopsis: synopsis.trim() || 'Serie agregada manualmente por el usuario.',
      cast: ['Actor Principal', 'Protagonista'],
      totalSeasons: Number(totalSeasons) || 1,
      totalEpisodes: Number(totalEpisodes) || 10,
      watchStatus,
      currentSeason: 1,
      currentEpisode: 1,
      notificationsEnabled: true,
      isFavorite: false,
      seasons: [
        {
          seasonNumber: 1,
          title: 'Temporada 1',
          episodes: Array.from({ length: Number(totalEpisodes) || 10 }).map((_, i) => ({
            id: `custom-ep-${i + 1}`,
            seasonNumber: 1,
            episodeNumber: i + 1,
            title: `Episodio ${i + 1}`,
            releaseDate: nextReleaseDate || '2026-09-01',
            durationMinutes: 50,
            synopsis: `Episodio ${i + 1} de ${title}`,
            isWatched: false,
          }))
        }
      ],
      nextRelease: nextReleaseDate ? {
        seasonNumber: 1,
        episodeNumber: 1,
        episodeTitle: 'Capítulo Estreno 1',
        airDateISO: new Date(nextReleaseDate).toISOString(),
        displayDate: nextReleaseDate,
        synopsis: 'Primer episodio estreno.'
      } : undefined
    };

    onAddSeries(newShow);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 my-auto"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#E50914]" />
              Añadir Nueva Serie a Tu Lista
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Título de la Serie *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Black Mirror S7, Lupin T4..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Géneros (separados por coma)</label>
                <input
                  type="text"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Sci-Fi, Suspenso"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Estado de Emisión</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
                >
                  <option value="Próximo Estreno">Próximo Estreno</option>
                  <option value="En Emisión">En Emisión</option>
                  <option value="Completada">Completada</option>
                  <option value="En Producción">En Producción</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Total Temporadas</label>
                <input
                  type="number"
                  min={1}
                  value={totalSeasons}
                  onChange={(e) => setTotalSeasons(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Total Episodios</label>
                <input
                  type="number"
                  min={1}
                  value={totalEpisodes}
                  onChange={(e) => setTotalEpisodes(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Próxima Fecha de Estreno / Episodio</label>
              <input
                type="date"
                value={nextReleaseDate}
                onChange={(e) => setNextReleaseDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Sinopsis</label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Breve descripción de la serie..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-red-500 h-16 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-900/30"
              >
                Guardar Serie
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
