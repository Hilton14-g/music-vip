import React from 'react';
import { Play, Pause, Heart, MoreVertical, Plus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const TrackCard = ({ track, queueContext = null }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, toggleFavorite, isFavorited, addToQueue } = usePlayer();

  if (!track) return null;

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const isFav = isFavorited(track.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueContext);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  const handleAddQueue = (e) => {
    e.stopPropagation();
    addToQueue(track);
  };

  return (
    <div 
      onClick={handlePlayClick}
      className="group relative glass-card p-3 rounded-2xl flex flex-col cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Contenedor de carátula */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-black/40">
        <img 
          src={track.cover} 
          alt={track.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Botón Play Neón Flotante */}
        <div className={`absolute bottom-2 right-2 transition-all duration-300 ${isCurrentPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}>
          <button
            onClick={handlePlayClick}
            className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.8)] hover:scale-110 active:scale-95 transition-transform"
          >
            {isCurrentPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>
        </div>

        {/* Indicador de ecualizador si está sonando */}
        {isCurrentPlaying && (
          <div className="absolute top-2 left-2 flex items-end gap-0.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-cyan-400/40">
            <span className="w-1 h-3 bg-cyan-400 animate-pulse"></span>
            <span className="w-1 h-4 bg-cyan-400 animate-ping"></span>
            <span className="w-1 h-2 bg-cyan-400 animate-pulse"></span>
          </div>
        )}

        {/* Botón Favorito en portada */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm transition-all ${
            isFav ? 'text-pink-500 opacity-100' : 'text-white/70 opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info de la pista */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className={`text-sm font-bold truncate transition-colors ${isCurrent ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
            {track.title}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {track.artist}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
          <span className="truncate">{track.album || 'Single'}</span>
          <button
            onClick={handleAddQueue}
            className="p-1 hover:text-cyan-400 hover:bg-white/5 rounded transition-colors"
            title="Añadir a la cola"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
