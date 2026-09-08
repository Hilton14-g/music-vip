// Integración con MediaSession API para control en pantalla de bloqueo de teléfonos (Android/iOS) y teclas de PC

export const updateMediaSession = ({ track, isPlaying, onPlay, onPause, onNext, onPrev, onSeek }) => {
  if (!('mediaSession' in navigator) || !track) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || 'Music VIP Track',
      artist: track.artist || 'Artista VIP',
      album: track.album || 'Music VIP Player',
      artwork: [
        { src: track.cover, sizes: '96x96', type: 'image/jpeg' },
        { src: track.cover, sizes: '128x128', type: 'image/jpeg' },
        { src: track.cover, sizes: '256x256', type: 'image/jpeg' },
        { src: track.cover, sizes: '512x512', type: 'image/jpeg' }
      ]
    });

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    navigator.mediaSession.setActionHandler('play', () => {
      if (onPlay) onPlay();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      if (onPause) onPause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      if (onPrev) onPrev();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (onNext) onNext();
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (onSeek && details.seekTime !== undefined) {
        onSeek(details.seekTime);
      }
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 10;
      if (onSeek) onSeek(skipTime, true);
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = -(details.seekOffset || 10);
      if (onSeek) onSeek(skipTime, true);
    });

  } catch (error) {
    console.warn('MediaSession API warning:', error);
  }
};
