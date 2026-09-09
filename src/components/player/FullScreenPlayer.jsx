import React, { useState } from 'react';
import { 
  ChevronDown, 
  Heart, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Disc3, 
  FileText, 
  Radio, 
  ListMusic, 
  Sliders, 
  Moon,
  Share2,
  Tv
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { AudioVisualizer } from './AudioVisualizer';

export const FullScreenPlayer = () => {
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
    isFullScreen,
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
    setIsEqualizerOpen,
    setIsSleepTimerOpen,
    setIsCastOpen
  } = usePlayer();

  const [viewMode, setViewMode] = useState('vinyl'); // 'vinyl' | 'lyrics' | 'visualizer'
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekVal, setSeekVal] = useState(0);

  if (!isFullScreen || !currentTrack) return null;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayCurrentTime = isSeeking ? seekVal : currentTime;
  const progressPercent = duration > 0 ? (displayCurrentTime / duration) * 100 : 0;
  const isFav = isFavorited(currentTrack.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentTrack.title} - ${currentTrack.artist}`,
        text: `Escuchando "${currentTrack.title}" en Music VIP`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace de Music VIP copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090d] flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* Luz ambiental de fondo según el arte */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 pointer-events-none transition-all duration-1000 bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500"
      />

      {/* CABECERA SUPERIOR */}
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <button
          onClick={() => setIsFullScreen(false)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95"
          title="Minimizar reproductor"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            Reproduciendo Ahora
          </span>
          <h3 className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-md">
            {currentTrack.album || 'Music VIP Unlimited'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSleepTimerOpen(true)}
            className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative ${sleepTimerSecondsLeft ? 'text-amber-400' : 'text-slate-300'}`}
            title="Temporizador de apagado"
          >
            <Moon className="w-5 h-5" />
            {sleepTimerSecondsLeft && (
              <span className="absolute -top-1 -right-1 text-[9px] bg-amber-500 text-black font-bold px-1 rounded-full">
                {Math.ceil(sleepTimerSecondsLeft / 60)}m
              </span>
            )}
          </button>
          <button
            onClick={() => setIsEqualizerOpen(true)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            title="Ajustes de Sonido"
          >
            <Sliders className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsCastOpen(true)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Transmitir a la TV"
          >
            <Tv className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            title="Compartir"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL INTERCAMBIABLE (VINILO / LETRAS / VISUALIZADOR) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-xl mx-auto w-full">
        {/* Selector de modo central */}
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full mb-6 border border-white/10">
          <button
            onClick={() => setViewMode('vinyl')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${viewMode === 'vinyl' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,242,254,0.6)]' : 'text-slate-400 hover:text-white'}`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            Portada
          </button>
          <button
            onClick={() => setViewMode('lyrics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${viewMode === 'lyrics' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,242,254,0.6)]' : 'text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Letras
          </button>
          <button
            onClick={() => setViewMode('visualizer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${viewMode === 'visualizer' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,242,254,0.6)]' : 'text-slate-400 hover:text-white'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            Ondas
          </button>
        </div>

        {/* 1. MODO VINILO & PORTADA */}
        {viewMode === 'vinyl' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative group">
              {/* Vinilo rotatorio que asoma por detrás de la portada */}
              <div 
                className={`w-60 h-60 md:w-72 md:h-72 rounded-full border-4 border-slate-900 bg-black flex items-center justify-center shadow-2xl relative transition-transform duration-700 ${isPlaying ? 'animate-vinyl' : 'paused-anim'}`}
                style={{
                  background: 'radial-gradient(circle, #2a2a2a 2%, #111 4%, #222 10%, #111 20%, #2a2a2a 35%, #111 50%, #222 75%, #08090d 100%)'
                }}
              >
                <div className="w-20 h-20 rounded-full border-2 border-cyan-400/40 flex items-center justify-center overflow-hidden">
                  <img src={currentTrack.cover} alt="center label" className="w-full h-full object-cover" />
                </div>
                <div className="w-4 h-4 rounded-full bg-slate-950 border border-white/40 absolute"></div>
              </div>

              {/* Carátula flotante principal con brillo */}
              <div className="absolute -inset-2 md:-inset-4 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 md:w-68 md:h-68 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 transform -translate-x-6 md:-translate-x-8 transition-transform group-hover:-translate-x-12">
                  <img 
                    src={currentTrack.cover} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Visualizador sutil bajo el disco */}
            <div className="w-full max-w-sm mt-8 px-4">
              <AudioVisualizer barCount={32} height={35} />
            </div>
          </div>
        )}

        {/* 2. MODO LETRAS */}
        {viewMode === 'lyrics' && (
          <div className="w-full h-72 md:h-80 overflow-y-auto px-6 py-4 glass-card rounded-2xl text-center flex flex-col justify-center items-center">
            <h4 className="text-cyan-400 text-xs uppercase font-bold tracking-wider mb-3">Letras de la Canción</h4>
            <div className="text-slate-200 text-base md:text-lg leading-relaxed font-medium whitespace-pre-line select-text">
              {currentTrack.lyrics || 'Letras no disponibles para este tema.'}
            </div>
          </div>
        )}

        {/* 3. MODO VISUALIZADOR INMERSIVO */}
        {viewMode === 'visualizer' && (
          <div className="w-full h-72 md:h-80 flex flex-col items-center justify-center glass-card rounded-2xl p-6">
            <h4 className="text-cyan-400 text-xs uppercase font-bold tracking-wider mb-6">Visualizador de Frecuencias</h4>
            <div className="w-full flex-1 flex items-center">
              <AudioVisualizer barCount={48} height={100} />
            </div>
            <p className="text-xs text-slate-400 mt-4">Respuesta armónica procesada en tiempo real</p>
          </div>
        )}
      </div>

      {/* INFORMACIÓN DE PISTA & CONTROLES */}
      <div className="relative z-10 p-6 md:p-8 max-w-xl mx-auto w-full">
        {/* Título, Artista y Corazón */}
        <div className="flex items-center justify-between mb-4">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl md:text-2xl font-bold text-white truncate hover:text-cyan-400 transition-colors">
              {currentTrack.title}
            </h2>
            <p className="text-slate-400 text-sm md:text-base truncate">
              {currentTrack.artist}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack)}
            className={`p-3 rounded-full bg-white/10 hover:bg-white/20 transition-transform active:scale-90 ${isFav ? 'text-pink-500' : 'text-slate-300'}`}
          >
            <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Barra de progreso interactiva */}
        <div className="mb-6">
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
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-3 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-mono">
            <span>{formatTime(displayCurrentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Botones de control principales */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full hover:bg-white/10 transition-colors ${isShuffle ? 'text-cyan-400' : 'text-slate-400'}`}
            title="Aleatorio"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-3 text-white hover:text-cyan-400 hover:bg-white/10 rounded-full transition-all active:scale-95"
            title="Anterior"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:shadow-[0_0_40px_rgba(0,242,254,0.9)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-black" />
            ) : (
              <Play className="w-8 h-8 fill-black ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-3 text-white hover:text-cyan-400 hover:bg-white/10 rounded-full transition-all active:scale-95"
            title="Siguiente"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 rounded-full hover:bg-white/10 transition-colors ${repeatMode !== 'off' ? 'text-cyan-400' : 'text-slate-400'}`}
            title="Repetir"
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>

        {/* Barra de volumen inferior */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <button onClick={toggleMute} className="text-slate-400 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolumeLevel(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs text-slate-400 w-8 text-right font-mono">{isMuted ? '0' : volume}%</span>

          <button
            onClick={() => setIsQueueOpen(true)}
            className="p-1 text-slate-400 hover:text-cyan-400 transition-colors ml-2"
            title="Ver Cola"
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
