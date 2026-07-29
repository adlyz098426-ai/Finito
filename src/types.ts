export type WatchStatus = 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'favorites';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  releaseDate: string; // e.g. '2026-08-01'
  durationMinutes: number;
  synopsis: string;
  isWatched?: boolean;
  isNewRelease?: boolean;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface NextRelease {
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle: string;
  airDateISO: string; // e.g. '2026-08-05T00:00:00.000Z'
  displayDate: string; // e.g. '5 de Agosto, 2026'
  synopsis?: string;
}

export interface Series {
  id: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl: string;
  genres: string[];
  year: number;
  maturityRating: string; // e.g., '16+', '18+', 'TV-MA'
  matchScore: number; // e.g., 97
  status: 'En Emisión' | 'Próximo Estreno' | 'Completada' | 'En Producción';
  synopsis: string;
  cast: string[];
  totalSeasons: number;
  totalEpisodes: number;
  seasons: Season[];
  nextRelease?: NextRelease;
  
  // User specific state (persisted)
  watchStatus: WatchStatus;
  currentSeason: number;
  currentEpisode: number;
  notificationsEnabled: boolean;
  isFavorite: boolean;
  userRating?: number; // 1 to 5
  userNotes?: string;
  lastUpdated?: string;
}

export interface NotificationItem {
  id: string;
  seriesId: string;
  seriesTitle: string;
  seriesPoster: string;
  title: string;
  message: string;
  type: 'new_episode' | 'season_premiere' | 'reminder' | 'system';
  timestamp: string; // ISO or relative
  read: boolean;
  releaseDate: string;
}

export interface AiRecommendation {
  title: string;
  genre: string;
  seasonsCount: string;
  matchScore: string;
  reason: string;
  tagline: string;
}
