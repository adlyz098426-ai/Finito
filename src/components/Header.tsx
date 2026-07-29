import React from 'react';
import { Search, Bell, Sparkles, Calendar, Film, Plus, Zap } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: 'watchlist' | 'calendar' | 'notifications' | 'ai';
  setActiveTab: (tab: 'watchlist' | 'calendar' | 'notifications' | 'ai') => void;
  unreadCount: number;
  onOpenAddModal: () => void;
  onSimulateReleaseAlert: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenAddModal,
  onSimulateReleaseAlert,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          <div 
            onClick={() => setActiveTab('watchlist')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-[#E50914] text-white font-black text-xl px-2.5 py-1 rounded tracking-tighter shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-wider leading-none">
                FLIX<span className="text-[#E50914]">PULSE</span>
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest font-medium uppercase">
                Netflix Tracker & Releases
              </span>
            </div>
          </div>

          {/* Mobile Actions Right */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className="p-2 rounded-full bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-purple-500/30 text-purple-300"
              title="Asistente AI"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 w-full md:w-auto justify-center overflow-x-auto">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'watchlist'
                ? 'bg-[#E50914] text-white font-semibold shadow-md shadow-red-900/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Film className="w-4 h-4" />
            Mis Listas
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-[#E50914] text-white font-semibold shadow-md shadow-red-900/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendario de Estrenos
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-[#E50914] text-white font-semibold shadow-md shadow-red-900/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notificaciones
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-purple-700 to-red-600 text-white font-semibold shadow-md shadow-purple-900/40'
                : 'text-purple-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            Asistente AI
          </button>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar serie, género, actor..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#E50914] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Test Live Alert Button */}
          <button
            onClick={onSimulateReleaseAlert}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-950/60 to-zinc-900 hover:from-red-900/80 border border-red-700/40 rounded-lg text-xs text-red-200 font-medium transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Probar notificación en vivo de nuevo episodio"
          >
            <Zap className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            Probar Alerta
          </button>

          {/* Add Show Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md shadow-red-900/20 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Añadir Serie
          </button>
        </div>

      </div>
    </header>
  );
};
