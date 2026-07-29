import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Film, HelpCircle, Flame, Send, CheckCircle2, ArrowRight, RefreshCw, Star } from 'lucide-react';
import { Series, AiRecommendation } from '../types';

interface AiAssistantModalProps {
  seriesList: Series[];
  onAddRecommendedShow?: (title: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ seriesList, onAddRecommendedShow }) => {
  const [activeTab, setActiveTab] = useState<'recommend' | 'recap' | 'hype'>('recommend');

  // Recommendation State
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Misterio']);
  const [moodInput, setMoodInput] = useState<string>('Series adictivas con giros de guión sorprendentes');
  const [recLoading, setRecLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);

  // Recap State
  const [selectedShowTitle, setSelectedShowTitle] = useState<string>(seriesList[0]?.title || 'Stranger Things 5');
  const [recapLoading, setRecapLoading] = useState<boolean>(false);
  const [recapResult, setRecapResult] = useState<string>('');

  // Hype State
  const [hypeQuery, setHypeQuery] = useState<string>(seriesList[0]?.title || 'Merlina');
  const [hypeLoading, setHypeLoading] = useState<boolean>(false);
  const [hypeResult, setHypeResult] = useState<string>('');

  const genresOptions = ['Sci-Fi', 'Terror', 'Aventura', 'Misterio', 'Drama', 'Comedia', 'Romance', 'Anime', 'Acción'];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleGetRecommendations = async () => {
    setRecLoading(true);
    setRecommendations([]);
    try {
      const watchlistTitles = seriesList.map(s => s.title);
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watchlistTitles,
          favoriteGenres: selectedGenres,
          mood: moodInput,
        }),
      });
      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error('Error fetching AI recommendations', e);
    } finally {
      setRecLoading(false);
    }
  };

  const handleGetRecap = async () => {
    setRecapLoading(true);
    setRecapResult('');
    try {
      const res = await fetch('/api/ai/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showTitle: selectedShowTitle }),
      });
      const data = await res.json();
      setRecapResult(data.recap || 'No se pudo generar el resumen.');
    } catch (e) {
      setRecapResult('Error al obtener el resumen.');
    } finally {
      setRecapLoading(false);
    }
  };

  const handleGetHype = async () => {
    setHypeLoading(true);
    setHypeResult('');
    try {
      const res = await fetch('/api/ai/hype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showTitle: hypeQuery }),
      });
      const data = await res.json();
      setHypeResult(data.hype || 'Sin información de novedades disponible.');
    } catch (e) {
      setHypeResult('Error al consultar novedades.');
    } finally {
      setHypeLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-zinc-900 to-red-950 border border-purple-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-300 animate-spin-slow" />
            Asistente IA de Netflix & Gemini
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Asistente Inteligente de Contenido
          </h2>
          <p className="text-xs text-zinc-300">
            Recomendaciones personalizadas, resúmenes sin spoilers y análisis de estrenos impulsados por IA.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recommend')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'recommend'
              ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          ¿Qué ver ahora en Netflix?
        </button>

        <button
          onClick={() => setActiveTab('recap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'recap'
              ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          Resumen Sin Spoilers
        </button>

        <button
          onClick={() => setActiveTab('hype')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'hype'
              ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-red-400" />
          Teorías & Fechas de Estreno
        </button>
      </div>

      {/* TAB 1: RECOMMENDATIONS */}
      {activeTab === 'recommend' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Configura tus preferencias de recomendación
            </h3>

            {/* Genre Pills */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Géneros favoritos:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {genresOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedGenres.includes(g)
                        ? 'bg-purple-600 text-white border border-purple-400'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">¿Qué tipo de energía o trama buscas hoy?</label>
              <input
                type="text"
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                placeholder="Ej: Series para maratonear este fin de semana con ritmo rápido..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleGetRecommendations}
              disabled={recLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-700 to-red-600 hover:from-purple-600 hover:to-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {recLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analizando catálogo de Netflix con Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generar Recomendaciones Personalizadas
                </>
              )}
            </button>
          </div>

          {/* Results Grid */}
          {recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Recomendaciones Sugeridas por la IA
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900 border border-purple-800/40 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-emerald-950 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                          {rec.matchScore} Coincidencia
                        </span>
                        <span className="text-[10px] text-zinc-400">{rec.seasonsCount}</span>
                      </div>

                      <h4 className="text-base font-extrabold text-white">
                        {rec.title}
                      </h4>

                      <p className="text-xs text-purple-300 font-semibold italic">
                        "{rec.tagline}"
                      </p>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>

                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded w-fit border border-zinc-700">
                      Género: {rec.genre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECAP */}
      {activeTab === 'recap' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400" />
            Generador de Resumen "En el capítulo anterior..." (Sin Spoilers)
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Selecciona o escribe el nombre de la serie:</label>
            <div className="flex gap-2">
              <select
                value={selectedShowTitle}
                onChange={(e) => setSelectedShowTitle(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                {seriesList.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>

              <button
                onClick={handleGetRecap}
                disabled={recapLoading}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-all shadow disabled:opacity-50 whitespace-nowrap"
              >
                {recapLoading ? 'Generando...' : 'Obtener Resumen'}
              </button>
            </div>
          </div>

          {recapResult && (
            <div className="p-4 bg-zinc-950 rounded-xl border border-purple-800/40 text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
              {recapResult}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HYPE */}
      {activeTab === 'hype' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            Noticias, Teorías & Fechas de Lanzamiento
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">¿De qué serie quieres conocer las novedades?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hypeQuery}
                onChange={(e) => setHypeQuery(e.target.value)}
                placeholder="Ej: Stranger Things 5, Merlina T2, Squid Game 3..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
              />

              <button
                onClick={handleGetHype}
                disabled={hypeLoading}
                className="px-5 py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow disabled:opacity-50 whitespace-nowrap"
              >
                {hypeLoading ? 'Consultando...' : 'Buscar Novedades'}
              </button>
            </div>
          </div>

          {hypeResult && (
            <div className="p-4 bg-zinc-950 rounded-xl border border-red-900/40 text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
              {hypeResult}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
