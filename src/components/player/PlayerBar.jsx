import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  ListMusic, 
  Maximize2, 
  Sliders, 
  Moon, 
  FileText 
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { AudioVisualizer } from './AudioVisualizer';

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isFavorited,
    sleepTimerSecondsLeft,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    setIsFullScreen,
    setIsQueueOpen,
    setIsLyricsOpen,
    setIsEqualizerOpen,
    setIsSleepTimerOpen
  } = usePlayer();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekVal, setSeekVal] = useState(0);

  if (!currentTrack) return null;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayCurrentTime = isSeeking ? seekVal : currentTime;
  const progressPercent = duration > 0 ? (displayCurrentTime / duration) * 100 : 0;
  const isFav = isFavorited(currentTrack.id);

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-[#0c0e17]/95 backdrop-blur-xl border-t border-white/10 px-3 md:px-6 py-2.5 shadow-2xl transition-all">
      {/* Barra de progreso superior interactiva para móviles */}
      <div 
        className="block md:hidden absolute top-0 left-0 right-0 h-1 bg-white/10 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          seek(clickPos * duration);
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 shadow-[0_0_8px_rgba(0,242,254,0.8)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* LADO IZQUIERDO: Información del Track y Carátula */}
        <div className="flex items-center gap-3 min-w-0 max-w-[45%] md:max-w-[30%]">
          <div 
            onClick={() => setIsFullScreen(true)}
            className="relative flex-shrink-0 cursor-pointer group"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-transform ${isPlaying ? 'ring-2 ring-cyan-400/50' : ''}`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
          </div>

          <div 
            onClick={() => setIsFullScreen(true)}
            className="min-w-0 cursor-pointer overflow-hidden"
          >
            <h4 className="text-sm md:text-base font-semibold text-white truncate hover:text-cyan-400 transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-slate-400 truncate hover:text-slate-200">
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(currentTrack)}
            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 ${isFav ? 'text-pink-500' : 'text-slate-400 hover:text-white'}`}
            title={isFav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* CENTRO: Controles Principales & Barra de Tiempo (Desktop) */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-3 md:gap-5 mb-1">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors hidden sm:block ${isShuffle ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title="Modo Aleatorio"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Anterior */}
            <button
              onClick={prevTrack}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Anterior"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play / Pause Principal */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)] hover:shadow-[0_0_20px_rgba(0,242,254,0.7)] hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black text-black" />
              ) : (
                <Play className="w-5 h-5 fill-black text-black ml-0.5" />
              )}
            </button>

            {/* Siguiente */}
            <button
              onClick={nextTrack}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Siguiente"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repetir */}
            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors hidden sm:block ${repeatMode !== 'off' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title={`Repetir: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Scrubber de tiempo en desktop */}
          <div className="w-full hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-10 text-right font-mono">{formatTime(displayCurrentTime)}</span>
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.5"
                value={displayCurrentTime}
                onMouseDown={() => {
                  setIsSeeking(true);
                  setSeekVal(currentTime);
                }}
                onTouchStart={() => {
                  setIsSeeking(true);
                  setSeekVal(currentTime);
                }}
                onChange={(e) => {
                  setSeekVal(parseFloat(e.target.value));
                }}
                onMouseUp={(e) => {
                  setIsSeeking(false);
                  seek(parseFloat(e.target.value));
                }}
                onTouchEnd={() => {
                  setIsSeeking(false);
                  seek(seekVal);
                }}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2.5 transition-all"
              />
            </div>
            <span className="w-10 text-left font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* LADO DERECHO: Herramientas VIP, Volumen y Modales */}
        <div className="flex items-center gap-2 md:gap-3 justify-end min-w-0">
          {/* Mini Visualizer en Desktop */}
          <div className="hidden lg:block w-20">
            <AudioVisualizer mini={true} barCount={18} height={20} />
          </div>


          {/* Letras */}
          <button
            onClick={() => setIsLyricsOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Ver Letras"
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Ecualizador / FX */}
          <button
            onClick={() => setIsEqualizerOpen(true)}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
            title="Ecualizador & FX"
          >
            <Sliders className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Sleep Timer */}
          <button
            onClick={() => setIsSleepTimerOpen(true)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors relative hidden sm:block ${sleepTimerSecondsLeft ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
            title="Temporizador de apagado"
          >
            <Moon className="w-4 h-4 md:w-5 md:h-5" />
            {sleepTimerSecondsLeft && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-black font-bold px-1 rounded-full">
                {Math.ceil(sleepTimerSecondsLeft / 60)}m
              </span>
            )}
          </button>

          {/* Cola de reproducción */}
          <button
            onClick={() => setIsQueueOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Cola de reproducción"
          >
            <ListMusic className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Control de Volumen (Desktop) */}
          <div className="hidden md:flex items-center gap-2 group ml-1">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseInt(e.target.value))}
              className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Botón expandir pantalla completa en móviles */}
          <button
            onClick={() => setIsFullScreen(true)}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-full transition-colors block md:hidden"
            title="Abrir reproductor completo"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
