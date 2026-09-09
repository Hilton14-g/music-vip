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

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const nextTrackRef = useRef(nextTrack);
  nextTrackRef.current = nextTrack;

  const isInitialMountRef = useRef(true);
  const userInteractedRef = useRef(false);

  const audioContextRef = useRef(null);
  const wakeLockRef = useRef(null);

  // 1. Activar AudioContext continuo para mantener el proceso de audio activo en segundo plano en Android/iOS
  const startAudioKeepalive = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }

      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        if (!audioContextRef.current._keepAliveStarted) {
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          gain.gain.value = 0.0001; // Inaudible para el oído humano
          osc.frequency.value = 432;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          audioContextRef.current._keepAliveStarted = true;
        }
      }
    } catch (e) {
      console.warn('AudioContext keepalive:', e);
    }

    if (silentAudioRef.current) {
      silentAudioRef.current.play().catch(() => {});
    }
  };

  // 2. Wake Lock API: Evitar suspensión automática mientras suena música
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator && !wakeLockRef.current) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      } catch (err) {
        // Silencioso si el SO o batería restringen WakeLock
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  };

  // 3. Manejo de pantalla bloqueada o cambio de pestaña (visibilitychange)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // La pantalla se apagó o la app pasó a segundo plano
        if (isPlayingRef.current) {
          startAudioKeepalive();
          // Enviar ráfaga de playVideo para contrarrestar la pausa de YouTube
          setTimeout(() => sendCommand('playVideo'), 100);
          setTimeout(() => sendCommand('playVideo'), 400);
        }
      } else {
        // La pantalla se encendió de nuevo
        if (isPlayingRef.current) {
          requestWakeLock();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
      releaseWakeLock();
    };
  }, []);

  // Cargar canción cuando cambia el track (evitando reproducción automática al abrir la app)
  useEffect(() => {
    if (!currentTrack?.youtubeId || !iframeRef.current) return;

    // Si es el primer montaje al abrir la app, no activar autoplay a menos que el usuario lo haya pedido
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (!isPlaying) {
        return;
      }
    }

    userInteractedRef.current = true;
    const newSrc = `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&origin=${originParam}&playsinline=1&controls=0&disablekb=1&fs=0&modestbranding=1`;
    iframeRef.current.src = newSrc;
    setIsPlaying(true);
    setCurrentTime(0);
    startAudioKeepalive();
    requestWakeLock();
  }, [currentTrack?.youtubeId]);

  // Sincronizar Play / Pause
  useEffect(() => {
    if (!iframeLoaded) return;
    if (isPlaying) {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
        if (iframeRef.current && currentTrack?.youtubeId) {
          const newSrc = `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&origin=${originParam}&playsinline=1&controls=0&disablekb=1&fs=0&modestbranding=1`;
          iframeRef.current.src = newSrc;
        }
      } else {
        sendCommand('playVideo');
      }
      startAudioKeepalive();
      requestWakeLock();
    } else {
      sendCommand('pauseVideo');
      releaseWakeLock();
    }
  }, [isPlaying, iframeLoaded]);

  // Sincronizar Volumen y Mute
  useEffect(() => {
    if (!iframeLoaded) return;
    const targetVol = isMuted ? 0 : volume;
    sendCommand('setVolume', [targetVol]);
  }, [volume, isMuted, iframeLoaded]);

  // Escuchar eventos de reproducción desde YouTube (con nextTrackRef actualizado para evitar stale closures)
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
            nextTrackRef.current?.();
          } else if (data.info.playerState === 1) {
            setIsPlaying(true);
          } else if (data.info.playerState === 2) {
            // Si YouTube se pausa involuntariamente por bloqueo de pantalla, forzar continuación
            if (document.hidden && isPlayingRef.current) {
              sendCommand('playVideo');
              return;
            }
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
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'listening' }),
            '*'
          );
        }

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
