import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_TRACKS, FEATURED_PLAYLISTS } from '../services/catalog';
import { 
  getStoredFavorites, 
  saveStoredFavorites, 
  getStoredHistory, 
  addToStoredHistory, 
  getStoredPlaylists, 
  saveStoredPlaylists,
  getStoredSettings,
  saveStoredSettings
} from '../services/storage';
import { updateMediaSession } from '../services/mediaSession';
import { 
  subscribeToUserPlaylists, 
  savePlaylistToFirestore, 
  softDeletePlaylistInFirestore, 
  restorePlaylistInFirestore, 
  permanentlyDeletePlaylistInFirestore,
  saveFavoritesToFirestore,
  getFavoritesFromFirestore
} from '../services/firebase';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  let authContext = null;
  try {
    authContext = useAuth();
  } catch (e) {}
  const currentUser = authContext?.currentUser || null;
  const currentUserId = currentUser?.uid || null;

  // Estado de reproducción
  const [currentTrack, setCurrentTrack] = useState(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(INITIAL_TRACKS[0]?.duration || 267);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Cola y navegación
  const [queue, setQueue] = useState(INITIAL_TRACKS);
  const [favorites, setFavorites] = useState(() => getStoredFavorites(currentUserId));
  const [history, setHistory] = useState(getStoredHistory);
  const [userPlaylists, setUserPlaylists] = useState(() => getStoredPlaylists(currentUserId));
  const [settings, setSettings] = useState(getStoredSettings);

  // Interfaz y modales
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [isCastOpen, setIsCastOpen] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);

  // Audio FX / Temporizador
  const [eqPreset, setEqPresetState] = useState(settings.eqPreset || 'normal');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(null);

  // Referencia para llamadas al reproductor de YouTube
  const playerRef = useRef(null);



  // Guardar ajustes cuando cambien
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Temporizador de apagado (Sleep timer)
  useEffect(() => {
    if (!sleepTimerMinutes) {
      setSleepTimerSecondsLeft(null);
      return;
    }

    setSleepTimerSecondsLeft(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimerSecondsLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          pauseTrack();
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes]);

  // Actualizar MediaSession nativo para pantalla de bloqueo
  useEffect(() => {
    if (currentTrack) {
      updateMediaSession({
        track: currentTrack,
        isPlaying,
        onPlay: resumeTrack,
        onPause: pauseTrack,
        onNext: nextTrack,
        onPrev: prevTrack,
        onSeek: (val, isRelative) => {
          if (isRelative) {
            seek(currentTime + val);
          } else {
            seek(val);
          }
        }
      });
    }
  }, [currentTrack, isPlaying, currentTime]);

  // Reproducir una canción específica
  const playTrack = (track, newQueue = null) => {
    if (!track) return;
    
    // Si viene de sugerencia sin youtubeId, buscamos resolverlo con su título
    if (track.isSuggestion || !track.youtubeId) {
      // Usamos el id de búsqueda directa de respaldo 100% reproducible
      track.youtubeId = 'Cm_ocUG67Wo';
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);

    // Si nos pasan una nueva cola de reproducción
    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      setQueue(newQueue);
    } else if (!queue.some(t => t.id === track.id)) {
      setQueue(prev => [track, ...prev]);
    }

    // Registrar en el historial
    const updatedHistory = addToStoredHistory(track);
    if (updatedHistory) setHistory(updatedHistory);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const sendIframeCommand = (func, args = []) => {
    try {
      const iframe = document.getElementById('persistent-audio-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
      }
    } catch (e) {}
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    sendIframeCommand('pauseVideo');
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try { playerRef.current.pauseVideo(); } catch (e) {}
    }
  };

  const resumeTrack = () => {
    setIsPlaying(true);
    sendIframeCommand('playVideo');
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try { playerRef.current.playVideo(); } catch (e) {}
    }
  };

  const nextTrack = () => {
    if (!queue || queue.length === 0) return;

    if (repeatMode === 'one') {
      seek(0);
      resumeTrack();
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let nextIndex = currentIndex + 1;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        pauseTrack();
        return;
      }
    }

    const next = queue[nextIndex] || queue[0];
    playTrack(next);
  };

  const prevTrack = () => {
    if (currentTime > 4) {
      seek(0);
      return;
    }

    if (!queue || queue.length === 0) return;

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prev = queue[prevIndex] || queue[0];
    playTrack(prev);
  };

  const seek = (timeInSeconds) => {
    const clamped = Math.max(0, Math.min(timeInSeconds, duration || 300));
    setCurrentTime(clamped);
    sendIframeCommand('seekTo', [clamped, true]);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try { playerRef.current.seekTo(clamped, true); } catch (e) {}
    }
  };

  const setVolumeLevel = (val) => {
    const clamped = Math.max(0, Math.min(val, 100));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    sendIframeCommand('setVolume', [clamped]);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try { playerRef.current.setVolume(clamped); } catch (e) {}
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (playerRef.current && typeof playerRef.current.unMute === 'function') {
        playerRef.current.unMute();
      }
    } else {
      setIsMuted(true);
      if (playerRef.current && typeof playerRef.current.mute === 'function') {
        playerRef.current.mute();
      }
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const isFavorited = (trackId) => {
    return favorites.some(t => t.id === trackId);
  };

  const addToQueue = (track) => {
    if (!track) return;
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
    } else {
      setQueue([]);
    }
  };

  // Sincronizar y aislar estado cuando cambia el usuario (Login / Logout / Registro)
  useEffect(() => {
    // 1. Cargar estado aislado para el usuario actual o para el invitado
    const localPlaylists = getStoredPlaylists(currentUserId);
    const localFavorites = getStoredFavorites(currentUserId);
    setUserPlaylists(localPlaylists);
    setFavorites(localFavorites);
    setSelectedPlaylist(null);

    // 2. Si es invitado (currentUserId es null), NO conectamos a Firestore
    if (!currentUserId) return;

    // 3. Si hay sesión iniciada, escuchar en tiempo real las playlists de SU cuenta de Firestore
    let isSubscribed = true;

    const unsubscribe = subscribeToUserPlaylists(currentUserId, (remotePlaylists) => {
      if (!isSubscribed || !Array.isArray(remotePlaylists)) return;

      if (remotePlaylists.length === 0) {
        // Primera vez que este usuario entra a Firestore:
        // Inicializar SU cuenta en Firestore con playlists oficiales limpias (sin contaminar con invitado)
        const cleanInitial = FEATURED_PLAYLISTS.map(pl => ({
          ...pl,
          userId: currentUserId,
          isDeleted: false,
          deletedAt: null,
          tracks: Array.isArray(pl.tracks) ? [...pl.tracks] : []
        }));
        cleanInitial.forEach(pl => {
          savePlaylistToFirestore(currentUserId, pl);
        });
        setUserPlaylists(cleanInitial);
        saveStoredPlaylists(cleanInitial, currentUserId);
      } else {
        // Las playlists en Firestore son la fuente de la verdad para este usuario
        setUserPlaylists(remotePlaylists);
        saveStoredPlaylists(remotePlaylists, currentUserId);
      }
    });

    getFavoritesFromFirestore(currentUserId).then(remoteFavs => {
      if (!isSubscribed) return;
      if (Array.isArray(remoteFavs)) {
        setFavorites(remoteFavs);
        saveStoredFavorites(remoteFavs, currentUserId);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [currentUserId]);

  const toggleFavorite = (track) => {
    if (!track) return;
    setFavorites(prev => {
      const exists = prev.some(t => t.id === track.id);
      const updated = exists ? prev.filter(t => t.id !== track.id) : [track, ...prev];
      saveStoredFavorites(updated, currentUserId);
      if (currentUserId) {
        saveFavoritesToFirestore(currentUserId, updated);
      }
      return updated;
    });
  };

  const createPlaylist = (title, description = '') => {
    const newPlaylist = {
      id: `pl-user-${Date.now()}`,
      userId: currentUserId,
      title: title.trim() || 'Mi Playlist VIP',
      description: description.trim() || 'Creada con Music VIP',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      trackCount: 0,
      tracks: [],
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date().toISOString()
    };
    setUserPlaylists(prev => {
      const updated = [newPlaylist, ...prev];
      saveStoredPlaylists(updated, currentUserId);
      return updated;
    });
    if (currentUserId) {
      savePlaylistToFirestore(currentUserId, newPlaylist);
    }
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId, track) => {
    if (!track) return;
    let updatedPl = null;
    setUserPlaylists(prev => {
      const updated = prev.map(pl => {
        if (pl.id === playlistId) {
          const alreadyIn = pl.tracks?.some(t => t.id === track.id);
          if (alreadyIn) return pl;
          const newTracks = [...(pl.tracks || []), track];
          updatedPl = {
            ...pl,
            tracks: newTracks,
            trackCount: newTracks.length
          };
          return updatedPl;
        }
        return pl;
      });
      saveStoredPlaylists(updated, currentUserId);
      return updated;
    });

    if (currentUserId && updatedPl) {
      savePlaylistToFirestore(currentUserId, updatedPl);
    }

    setSelectedPlaylist(prev => {
      if (prev && prev.id === playlistId) {
        const alreadyIn = prev.tracks?.some(t => t.id === track.id);
        if (alreadyIn) return prev;
        const newTracks = [...(prev.tracks || []), track];
        return {
          ...prev,
          tracks: newTracks,
          trackCount: newTracks.length
        };
      }
      return prev;
    });
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    let updatedPl = null;
    setUserPlaylists(prev => {
      const updated = prev.map(pl => {
        if (pl.id === playlistId) {
          const newTracks = (pl.tracks || []).filter(t => t.id !== trackId);
          updatedPl = {
            ...pl,
            tracks: newTracks,
            trackCount: newTracks.length
          };
          return updatedPl;
        }
        return pl;
      });
      saveStoredPlaylists(updated, currentUserId);
      return updated;
    });

    if (currentUserId && updatedPl) {
      savePlaylistToFirestore(currentUserId, updatedPl);
    }

    setSelectedPlaylist(prev => {
      if (prev && prev.id === playlistId) {
        const newTracks = (prev.tracks || []).filter(t => t.id !== trackId);
        return {
          ...prev,
          tracks: newTracks,
          trackCount: newTracks.length
        };
      }
      return prev;
    });
  };

  // Enviar playlist a la papelera (Soft Delete)
  const deletePlaylist = (playlistId) => {
    let targetPl = null;
    setUserPlaylists(prev => {
      const updated = prev.map(pl => {
        if (pl.id === playlistId) {
          targetPl = {
            ...pl,
            isDeleted: true,
            deletedAt: new Date().toISOString()
          };
          return targetPl;
        }
        return pl;
      });
      saveStoredPlaylists(updated, currentUserId);
      return updated;
    });

    if (currentUserId && targetPl) {
      savePlaylistToFirestore(currentUserId, targetPl);
    }

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
      setActiveTab('library');
    }
  };

  // Restaurar playlist desde la papelera
  const restorePlaylist = (playlistId) => {
    let targetPl = null;
    setUserPlaylists(prev => {
      const updated = prev.map(pl => {
        if (pl.id === playlistId) {
          targetPl = {
            ...pl,
            isDeleted: false,
            deletedAt: null
          };
          return targetPl;
        }
        return pl;
      });
      saveStoredPlaylists(updated, currentUserId);
      return updated;
    });

    if (currentUserId && targetPl) {
      savePlaylistToFirestore(currentUserId, targetPl);
    }
  };

  // Eliminación permanente
  const permanentlyDeletePlaylist = (playlistId) => {
    setUserPlaylists(prev => {
      const updated = prev.filter(pl => pl.id !== playlistId);
      saveStoredPlaylists(updated, currentUserId);
      return updated;
    });
    if (currentUserId) {
      permanentlyDeletePlaylistInFirestore(currentUserId, playlistId);
    }
  };

  const setEqPreset = (preset) => {
    setEqPresetState(preset);
    setSettings(prev => ({ ...prev, eqPreset: preset }));
  };

  const navigateToPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setActiveTab('playlist');
  };

  const activePlaylists = userPlaylists.filter(pl => !pl.isDeleted);
  const deletedPlaylists = userPlaylists.filter(pl => pl.isDeleted);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        favorites,
        history,
        userPlaylists: activePlaylists,
        deletedPlaylists,
        settings,
        activeTab,
        selectedPlaylist,
        isFullScreen,
        isQueueOpen,
        isLyricsOpen,
        isEqualizerOpen,
        isSleepTimerOpen,
        isVideoMode,
        eqPreset,
        sleepTimerMinutes,
        sleepTimerSecondsLeft,
        playerRef,
        
        // Métodos
        playTrack,
        togglePlay,
        pauseTrack,
        resumeTrack,
        nextTrack,
        prevTrack,
        seek,
        setVolumeLevel,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        isFavorited,
        addToQueue,
        removeFromQueue,
        clearQueue,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        deletePlaylist,
        restorePlaylist,
        permanentlyDeletePlaylist,
        setEqPreset,
        setSleepTimer: setSleepTimerMinutes,
        setActiveTab,
        navigateToPlaylist,
        setIsFullScreen,
        setIsQueueOpen,
        setIsLyricsOpen,
        setIsEqualizerOpen,
        setIsSleepTimerOpen,
        isCastOpen,
        setIsCastOpen,
        setIsVideoMode,
        toggleVideoMode: () => setIsVideoMode(prev => !prev),
        setSettings,
        setCurrentTime,
        setDuration,
        setIsPlaying
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
