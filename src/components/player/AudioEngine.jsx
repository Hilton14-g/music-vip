import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const AudioEngine = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    nextTrack,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    seek
  } = usePlayer();

  const iframeRef = useRef(null);
  const silentAudioRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const originParam = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';

  // Enviar comando a través de postMessage a la API interna de YouTube
  const sendCommand = (func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  // Cargar canción cuando cambia el track
  useEffect(() => {
    if (!currentTrack?.youtubeId || !iframeRef.current) return;

    // Cargar directamente el video con autoplay y origin habilitado para postMessage
    const newSrc = `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&origin=${originParam}&playsinline=1&controls=0&disablekb=1&fs=0&modestbranding=1`;
    iframeRef.current.src = newSrc;
    setIsPlaying(true);
    setCurrentTime(0);
    keepAudioAlive();
  }, [currentTrack?.youtubeId]);

  // Sincronizar Play / Pause
  useEffect(() => {
    if (!iframeLoaded) return;
    if (isPlaying) {
      sendCommand('playVideo');
      keepAudioAlive();
    } else {
      sendCommand('pauseVideo');
    }
  }, [isPlaying, iframeLoaded]);

  // Sincronizar Volumen y Mute
  useEffect(() => {
    if (!iframeLoaded) return;
    const targetVol = isMuted ? 0 : volume;
    sendCommand('setVolume', [targetVol]);
  }, [volume, isMuted, iframeLoaded]);

  // Escuchar eventos de reproducción desde YouTube
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // Escuchar infoDelivery de YouTube
        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            setCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          // playerState: 0 = Ended, 1 = Playing, 2 = Paused
          if (data.info.playerState === 0) {
            nextTrack();
          } else if (data.info.playerState === 1) {
            setIsPlaying(true);
          } else if (data.info.playerState === 2) {
            setIsPlaying(false);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Reloj activo y sincronización continua para el corredor de minutos
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        // Pedir a YouTube el estado actual por postMessage
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'listening' }),
            '*'
          );
        }

        // Avance suave del corredor de minutos
        setCurrentTime(prev => {
          const maxDur = duration || 300;
          if (prev >= maxDur - 0.5) {
            return prev;
          }
          return Math.min(prev + 0.5, maxDur);
        });
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, duration]);

  const keepAudioAlive = () => {
    if (silentAudioRef.current) {
      try {
        silentAudioRef.current.play().catch(() => {});
      } catch (e) {}
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    }
  };

  return (
    <>
      {/* 
        Motor de Audio Persistente de YouTube Music:
        Posicionado detrás del fondo negro con opacidad mínima y dimensiones de 280x160px.
        Esto asegura que el navegador no suspenda el audio, sin mostrar video alguno al usuario.
      */}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '280px',
          height: '160px',
          zIndex: -20,
          opacity: 0.01,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          id="persistent-audio-iframe"
          title="Music VIP Audio Stream"
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${currentTrack?.youtubeId || 'FfVdwJKylNM'}?autoplay=0&enablejsapi=1&origin=${originParam}&playsinline=1&controls=0&disablekb=1&fs=0&modestbranding=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
          style={{ border: 'none' }}
          onLoad={handleIframeLoad}
        />
      </div>

      {/* Keepalive silencioso para segundo plano en móviles */}
      <audio 
        ref={silentAudioRef} 
        loop 
        preload="auto"
        src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
      />
    </>
  );
};
