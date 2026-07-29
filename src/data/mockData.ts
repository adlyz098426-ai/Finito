import { Series, NotificationItem } from '../types';

export const INITIAL_SERIES_CATALOG: Series[] = [
  {
    id: 'stranger-things',
    title: 'Stranger Things 5',
    originalTitle: 'Stranger Things',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    genres: ['Sci-Fi', 'Terror', 'Aventura', 'Drama'],
    year: 2026,
    maturityRating: '16+',
    matchScore: 99,
    status: 'Próximo Estreno',
    synopsis: 'Hawkins está al borde del abismo. Once y sus amigos deben reunirse para la batalla final contra Vecna y el Upside Down en la esperada temporada final de la serie fenómeno de Netflix.',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour', 'Winona Ryder'],
    totalSeasons: 5,
    totalEpisodes: 42,
    watchStatus: 'watching',
    currentSeason: 4,
    currentEpisode: 9,
    notificationsEnabled: true,
    isFavorite: true,
    userRating: 5,
    userNotes: '¡Esperando impaciente la temporada final!',
    nextRelease: {
      seasonNumber: 5,
      episodeNumber: 1,
      episodeTitle: 'Capítulo Uno: El Rastreo (The Crawl)',
      airDateISO: new Date(Date.now() + 86400000 * 3 + 3600000 * 5).toISOString(), // 3 days from now
      displayDate: 'En 3 días',
      synopsis: 'La amenaza se propaga rápidamente por Hawkins. El grupo reúne sus últimas defensas mientras el Upside Down invade la superficie.'
    },
    seasons: [
      {
        seasonNumber: 4,
        title: 'Temporada 4',
        episodes: [
          {
            id: 'st-s4e1',
            seasonNumber: 4,
            episodeNumber: 1,
            title: 'El club del Fuego del Infierno',
            releaseDate: '2022-05-27',
            durationMinutes: 76,
            synopsis: 'El terror regresa a Hawkins en un nuevo año escolar lleno de desafíos.',
            isWatched: true,
          },
          {
            id: 'st-s4e8',
            seasonNumber: 4,
            episodeNumber: 8,
            title: 'Papa',
            releaseDate: '2022-07-01',
            durationMinutes: 85,
            synopsis: 'Once enfrenta decisiones críticas en el laboratorio mientras Hawkins arde.',
            isWatched: true,
          },
          {
            id: 'st-s4e9',
            seasonNumber: 4,
            episodeNumber: 9,
            title: 'El plan',
            releaseDate: '2022-07-01',
            durationMinutes: 142,
            synopsis: 'Con coraje y una lista de reproducción a punto, los héroes atacan desde todos los frentes.',
            isWatched: true,
          }
        ]
      },
      {
        seasonNumber: 5,
        title: 'Temporada 5 (Estreno Mundial)',
        episodes: [
          {
            id: 'st-s5e1',
            seasonNumber: 5,
            episodeNumber: 1,
            title: 'Capítulo Uno: El Rastreo',
            releaseDate: 'Estreno Próximo',
            durationMinutes: 75,
            synopsis: 'El comienzo del fin para Hawkins.',
            isWatched: false,
            isNewRelease: true,
          },
          {
            id: 'st-s5e2',
            seasonNumber: 5,
            episodeNumber: 2,
            title: 'Capítulo Dos: La Desaparición de...',
            releaseDate: 'Estreno Próximo',
            durationMinutes: 68,
            synopsis: 'Revelaciones impactantes sobre los orígenes de Vecna.',
            isWatched: false,
          }
        ]
      }
    ]
  },
  {
    id: 'wednesday',
    title: 'Merlina (Wednesday) - T2',
    originalTitle: 'Wednesday',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    genres: ['Misterio', 'Fantasía', 'Comedia Negra'],
    year: 2026,
    maturityRating: '13+',
    matchScore: 98,
    status: 'Próximo Estreno',
    synopsis: 'Merlina Addams regresa a la Academia Nunca Más para descifrar un nuevo y sombrío misterio familiar cargado de lo oculto, nuevos enemigos y giros inesperados.',
    cast: ['Jenna Ortega', 'Emma Myers', 'Steve Buscemi', 'Catherine Zeta-Jones'],
    totalSeasons: 2,
    totalEpisodes: 16,
    watchStatus: 'plan_to_watch',
    currentSeason: 1,
    currentEpisode: 8,
    notificationsEnabled: true,
    isFavorite: true,
    userRating: 5,
    userNotes: '¡Jenna Ortega es increíble en este papel!',
    nextRelease: {
      seasonNumber: 2,
      episodeNumber: 1,
      episodeTitle: 'Capítulo I: Sombra en el Jardín',
      airDateISO: new Date(Date.now() + 86400000 * 7 + 3600000 * 12).toISOString(), // 7 days from now
      displayDate: 'En 7 días',
      synopsis: 'Un nuevo semestre comienza en Nunca Más, acompañado de inquietantes cartas anónimas dirigidas a Merlina.'
    },
    seasons: [
      {
        seasonNumber: 1,
        title: 'Temporada 1',
        episodes: [
          {
            id: 'wed-s1e1',
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'Un trágico día para empezar',
            releaseDate: '2022-11-23',
            durationMinutes: 59,
            synopsis: 'Merlina llega a Nunca Más e inmediatamente encuentra sospechosos de un extraño asesinato.',
            isWatched: true,
          }
        ]
      },
      {
        seasonNumber: 2,
        title: 'Temporada 2',
        episodes: [
          {
            id: 'wed-s2e1',
            seasonNumber: 2,
            episodeNumber: 1,
            title: 'Sombra en el Jardín',
            releaseDate: 'Estreno Próximo',
            durationMinutes: 55,
            synopsis: 'Misterio renovado en el campus de Nunca Más.',
            isWatched: false,
            isNewRelease: true,
          }
        ]
      }
    ]
  },
  {
    id: 'squid-game',
    title: 'El Juego del Calamar 3',
    originalTitle: 'Squid Game',
    posterUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    genres: ['Suspenso', 'Drama', 'Acción', 'Corea'],
    year: 2026,
    maturityRating: '18+',
    matchScore: 97,
    status: 'En Emisión',
    synopsis: 'Gi-hun vuelve al corazón del juego diabólico para desenmascarar la organización secreta. La temporada final promete ser la más desafiante de todas.',
    cast: ['Lee Jung-jae', 'Lee Byung-hun', 'Wi Ha-jun', 'Gong Yoo'],
    totalSeasons: 3,
    totalEpisodes: 21,
    watchStatus: 'watching',
    currentSeason: 2,
    currentEpisode: 6,
    notificationsEnabled: true,
    isFavorite: false,
    userRating: 4,
    nextRelease: {
      seasonNumber: 3,
      episodeNumber: 1,
      episodeTitle: 'Episodio 1: La Última Ficha',
      airDateISO: new Date(Date.now() + 86400000 * 1 + 3600000 * 2).toISOString(), // 1 day
      displayDate: 'Mañana a las 09:00',
      synopsis: 'Gi-hun establece contacto con aliados inesperados en la isla antes de que inicie la primera ronda.'
    },
    seasons: [
      {
        seasonNumber: 2,
        title: 'Temporada 2',
        episodes: [
          {
            id: 'sg-s2e1',
            seasonNumber: 2,
            episodeNumber: 1,
            title: 'Pan o Leche',
            releaseDate: '2024-12-26',
            durationMinutes: 62,
            synopsis: 'Tres años después, Gi-hun renuncia a ir a Estados Unidos y busca al reclutador.',
            isWatched: true,
          }
        ]
      },
      {
        seasonNumber: 3,
        title: 'Temporada 3 Final',
        episodes: [
          {
            id: 'sg-s3e1',
            seasonNumber: 3,
            episodeNumber: 1,
            title: 'La Última Ficha',
            releaseDate: 'Próximo Estreno',
            durationMinutes: 65,
            synopsis: 'La confrontación directa contra el Líder entra en su fase definitiva.',
            isWatched: false,
            isNewRelease: true
          }
        ]
      }
    ]
  },
  {
    id: 'one-piece',
    title: 'One Piece - Live Action T2',
    originalTitle: 'One Piece',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    genres: ['Aventura', 'Acción', 'Fantasía'],
    year: 2026,
    maturityRating: '13+',
    matchScore: 96,
    status: 'Próximo Estreno',
    synopsis: 'Luffy y los Sombreros de Paja zarpando hacia la Grand Line, encontrando nuevos compañeros, despiadados cazadores de recompensas y el legendario reino de Arabasta.',
    cast: ['Iñaki Godoy', 'Mackenyu', 'Emily Rudd', 'Jacob Romero', 'Taz Skylar'],
    totalSeasons: 2,
    totalEpisodes: 16,
    watchStatus: 'plan_to_watch',
    currentSeason: 1,
    currentEpisode: 8,
    notificationsEnabled: true,
    isFavorite: true,
    userRating: 5,
    nextRelease: {
      seasonNumber: 2,
      episodeNumber: 1,
      episodeTitle: 'Rumbo a Loguetown',
      airDateISO: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days
      displayDate: 'En 14 días',
      synopsis: 'La tripulación llega a la famosa ciudad donde comenzó y terminó el Rey de los Piratas, Gol D. Roger.'
    },
    seasons: [
      {
        seasonNumber: 1,
        title: 'Temporada 1',
        episodes: [
          {
            id: 'op-s1e1',
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'Amanecer de una aventura',
            releaseDate: '2023-08-31',
            durationMinutes: 64,
            synopsis: 'El joven pirata Monkey D. Luffy se lanza al mar en busca del mítico tesoro.',
            isWatched: true,
          }
        ]
      }
    ]
  },
  {
    id: 'cobra-kai',
    title: 'Cobra Kai - Parte Final',
    originalTitle: 'Cobra Kai',
    posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    genres: ['Acción', 'Artes Marciales', 'Comedia', 'Drama'],
    year: 2025,
    maturityRating: '16+',
    matchScore: 94,
    status: 'Completada',
    synopsis: 'Miyagi-Do se prepara para el torneo mundial Sekai Taikai. Daniel LaRusso y Johnny Lawrence deben unir sus estilos para vencer las sombras de Kreese.',
    cast: ['Ralph Macchio', 'William Zabka', 'Xolo Maridueña', 'Tanner Buchanan'],
    totalSeasons: 6,
    totalEpisodes: 65,
    watchStatus: 'completed',
    currentSeason: 6,
    currentEpisode: 15,
    notificationsEnabled: false,
    isFavorite: true,
    userRating: 5,
    seasons: [
      {
        seasonNumber: 6,
        title: 'Temporada 6',
        episodes: [
          {
            id: 'ck-s6e15',
            seasonNumber: 6,
            episodeNumber: 15,
            title: 'El Legado Miyagi',
            releaseDate: '2025-02-13',
            durationMinutes: 48,
            synopsis: 'La épica conclusión en la que el destino del Karate en All Valley se define para siempre.',
            isWatched: true
          }
        ]
      }
    ]
  },
  {
    id: 'bridgerton',
    title: 'Bridgerton - Temporada 4',
    originalTitle: 'Bridgerton',
    posterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
    genres: ['Romance', 'Drama de Época', 'Historia'],
    year: 2026,
    maturityRating: '18+',
    matchScore: 95,
    status: 'En Producción',
    synopsis: 'Benedict Bridgerton protagoniza esta nueva entrega romántica centrada en el intrigante baile de máscaras y la misteriosa Dama de Plateado.',
    cast: ['Luke Thompson', 'Yerin Ha', 'Nicola Coughlan', 'Luke Newton'],
    totalSeasons: 4,
    totalEpisodes: 32,
    watchStatus: 'plan_to_watch',
    currentSeason: 3,
    currentEpisode: 8,
    notificationsEnabled: true,
    isFavorite: false,
    userRating: 4,
    nextRelease: {
      seasonNumber: 4,
      episodeNumber: 1,
      episodeTitle: 'El Baile de Máscaras',
      airDateISO: new Date(Date.now() + 86400000 * 25).toISOString(),
      displayDate: 'En 25 días',
      synopsis: 'Benedict queda cautivado por una enigmática mujer durante el baile organizado por Lady Danbury.'
    },
    seasons: [
      {
        seasonNumber: 3,
        title: 'Temporada 3',
        episodes: [
          {
            id: 'bg-s3e8',
            seasonNumber: 3,
            episodeNumber: 8,
            title: 'Hacia la luz',
            releaseDate: '2024-06-13',
            durationMinutes: 70,
            synopsis: 'Penélope toma una postura pública para defender su identidad como Lady Whistledown.',
            isWatched: true
          }
        ]
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    seriesId: 'squid-game',
    seriesTitle: 'El Juego del Calamar 3',
    seriesPoster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=200&q=80',
    title: '¡Nuevo Episodio Mañana!',
    message: 'El episodio "La Última Ficha" se estrena mañana a las 09:00 AM en Netflix.',
    type: 'new_episode',
    timestamp: 'Hace 10 min',
    read: false,
    releaseDate: 'Mañana, 09:00 AM'
  },
  {
    id: 'notif-2',
    seriesId: 'stranger-things',
    seriesTitle: 'Stranger Things 5',
    seriesPoster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    title: 'Recordatorio de Estreno',
    message: 'Quedan solo 3 días para el gran estreno de la Temporada Final de Stranger Things.',
    type: 'season_premiere',
    timestamp: 'Hace 2 horas',
    read: false,
    releaseDate: 'En 3 días'
  },
  {
    id: 'notif-3',
    seriesId: 'wednesday',
    seriesTitle: 'Merlina (Wednesday)',
    seriesPoster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=200&q=80',
    title: 'Notificaciones Activadas',
    message: 'Recibirás alertas inmediatas en cuanto se liberen tráileres y fechas de estreno de la Temporada 2.',
    type: 'system',
    timestamp: 'Ayer',
    read: true,
    releaseDate: 'En 7 días'
  }
];
