// Almacenamiento local persistente (LocalStorage) para favoritos, historial y playlists
import { FEATURED_PLAYLISTS } from './catalog';

const STORAGE_KEYS = {
  FAVORITES: 'music_vip_favorites',
  HISTORY: 'music_vip_history',
  PLAYLISTS: 'music_vip_playlists',
  SETTINGS: 'music_vip_settings'
};

export const getUserScopedKey = (type, userId = null) => {
  const scope = userId ? `user_${userId}` : 'guest';
  return `music_vip_${scope}_${type}`;
};

export const getStoredFavorites = (userId = null) => {
  try {
    const key = getUserScopedKey('favorites', userId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error al cargar favoritos:', e);
    return [];
  }
};

export const saveStoredFavorites = (favorites, userId = null) => {
  try {
    const key = getUserScopedKey('favorites', userId);
    localStorage.setItem(key, JSON.stringify(favorites || []));
  } catch (e) {
    console.error('Error al guardar favoritos:', e);
  }
};

export const getStoredHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error al cargar historial:', e);
    return [];
  }
};

export const addToStoredHistory = (track) => {
  if (!track || !track.id) return;
  try {
    const history = getStoredHistory();
    // Filter out duplicates and keep top 40 recent tracks
    const updated = [track, ...history.filter(t => t.id !== track.id)].slice(0, 40);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error al guardar historial:', e);
  }
};

export const getDefaultPlaylists = (userId = null) => {
  return FEATURED_PLAYLISTS.map(pl => ({
    ...pl,
    userId: userId || null,
    isDeleted: false,
    deletedAt: null,
    tracks: Array.isArray(pl.tracks) ? [...pl.tracks] : []
  }));
};

export const getStoredPlaylists = (userId = null) => {
  const key = getUserScopedKey('playlists', userId);
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Si es el modo invitado (sin loguear) y todas las playlists quedaron marcadas como borradas,
        // restaurar automáticamente el catálogo completo para que el invitado siempre tenga música limpia
        const activeCount = parsed.filter(p => !p.isDeleted).length;
        if (!userId && activeCount === 0) {
          const freshGuest = getDefaultPlaylists(null);
          localStorage.setItem(key, JSON.stringify(freshGuest));
          return freshGuest;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error al cargar playlists:', e);
  }

  // Inicializar con las playlists destacadas por defecto para este ámbito específico (aislado)
  try {
    const initialPlaylists = getDefaultPlaylists(userId);
    localStorage.setItem(key, JSON.stringify(initialPlaylists));
    return initialPlaylists;
  } catch (e) {
    return FEATURED_PLAYLISTS;
  }
};

export const saveStoredPlaylists = (playlists, userId = null) => {
  try {
    const key = getUserScopedKey('playlists', userId);
    localStorage.setItem(key, JSON.stringify(playlists || []));
  } catch (e) {
    console.error('Error al guardar playlists:', e);
  }
};

export const DEFAULT_YOUTUBE_API_KEY = 'AIzaSyBWexDZovLcJ-OHjKKIPAENTpUzHcNgEBQ';

export const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const parsed = data ? JSON.parse(data) : {};
    return {
      youtubeApiKey: parsed.youtubeApiKey || DEFAULT_YOUTUBE_API_KEY,
      eqPreset: parsed.eqPreset || 'normal',
      bassBoost: parsed.bassBoost ?? false,
      audioQuality: parsed.audioQuality || 'high',
      themeAccent: parsed.themeAccent || 'cyan'
    };
  } catch (e) {
    console.error('Error al cargar ajustes:', e);
    return {
      youtubeApiKey: DEFAULT_YOUTUBE_API_KEY,
      eqPreset: 'normal',
      bassBoost: false,
      audioQuality: 'high',
      themeAccent: 'cyan'
    };
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error al guardar ajustes:', e);
  }
};
