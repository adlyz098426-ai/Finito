import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Check, Trash2, Zap, Clock, Calendar, CheckCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onSimulateReleaseAlert: () => void;
  browserNotificationsEnabled: boolean;
  onToggleBrowserNotifications: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onSimulateReleaseAlert,
  browserNotificationsEnabled,
  onToggleBrowserNotifications,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 border border-red-900/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4 animate-bounce" />
            Centro de Notificaciones & Alertas
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Notificaciones de Estrenos de Netflix
          </h2>
          <p className="text-xs text-zinc-400">
            Mantente al día con los nuevos episodios y temporadas de tus series favoritas.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Test Live Release Notification */}
          <button
            onClick={onSimulateReleaseAlert}
            className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-900/40 active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            Probar Alerta en Vivo
          </button>

          {/* Browser Notifications Permission Switch */}
          <button
            onClick={onToggleBrowserNotifications}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              browserNotificationsEnabled
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {browserNotificationsEnabled ? 'Alertas Web Activas' : 'Activar Alertas Web'}
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todas ({notifications.length})
          </button>

          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'unread'
                ? 'bg-[#E50914] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sin leer ({unreadCount})
          </button>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors border border-zinc-700"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              Marcar todas leídas
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold rounded-lg transition-colors border border-red-900/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-3">
            <BellOff className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300">No hay notificaciones aquí</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {filterType === 'unread'
                ? '¡Estás al día! No tienes ninguna notificación pendiente sin leer.'
                : 'Haz clic en "Probar Alerta en Vivo" arriba para simular una alerta de estreno.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  notif.read
                    ? 'bg-zinc-900/60 border-zinc-800/60 opacity-80'
                    : 'bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-900 border-red-900/50 shadow-md'
                }`}
              >
                {/* Poster Image */}
                <img
                  src={notif.seriesPoster}
                  alt={notif.seriesTitle}
                  className="w-12 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white truncate">
                        {notif.seriesTitle}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-red-300">
                    {notif.title}
                  </h4>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 font-medium text-zinc-300">
                      <Clock className="w-3 h-3 text-red-400" />
                      Estreno: {notif.releaseDate}
                    </span>
                  </div>
                </div>

                {/* Individual Action Buttons */}
                <div className="flex items-center gap-1 shrink-0 pt-1">
                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Marcar como leída"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteNotification(notif.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Eliminar notificación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
};
