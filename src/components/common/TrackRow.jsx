import React from 'react';
import { Play, Pause, Heart, Plus, Music, Trash2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const TrackRow = ({ track, index, queueContext = null, onRemove = null, removeTooltip = 'Eliminar' }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, toggleFavorite, isFavorited, addToQueue } = usePlayer();

  if (!track) return null;

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const isFav = isFavorited(track.id);

  const formatTime = (seconds) => {
    if (!seconds) return '3:20';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRowClick = () => {
    if (isCurrent && isPlaying) {
      togglePlay();
    } else {
      playTrack(track, queueContext);
    }
  };

  return (
    <div 
      onClick={handleRowClick}
      className={`group flex items-center justify-between p-2.5 md:p-3 rounded-xl cursor-pointer transition-all ${
        isCurrent ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      {/* Columna Izquierda: Índice / Play / Carátula / Título */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        {/* Número o Play */}
        <div className="w-6 text-center text-xs font-mono text-slate-400 group-hover:hidden flex items-center justify-center">
          {isCurrentPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 h-3 bg-cyan-400 animate-pulse"></span>
              <span className="w-1 h-2 bg-cyan-400 animate-ping"></span>
            </div>
          ) : (
            index !== undefined ? index + 1 : <Music className="w-3.5 h-3.5" />
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); handleRowClick(); }}
          className="w-6 text-cyan-400 hidden group-hover:flex items-center justify-center"
        >
          {isCurrentPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Portada */}
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
        </div>

        {/* Título y Artista */}
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
            {track.title}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Columna Central: Álbum (visible en tablets y desktop) */}
      <div className="hidden md:block w-1/4 text-xs text-slate-400 truncate px-2">
        {track.album || 'Music VIP'}
      </div>

      {/* Columna Derecha: Duración, Cola y Corazón */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
          title="Añadir a la cola"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
          className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
            isFav ? 'text-pink-500' : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
          title={isFav ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(track);
            }}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors opacity-80 md:opacity-0 group-hover:opacity-100"
            title={removeTooltip}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <span className="text-xs text-slate-400 font-mono w-10 text-right">
          {formatTime(track.duration)}
        </span>
      </div>
    </div>
  );
};
