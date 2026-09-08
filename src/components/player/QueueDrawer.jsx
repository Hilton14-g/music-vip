import React from 'react';
import { X, Play, Trash2, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const QueueDrawer = () => {
  const {
    queue,
    currentTrack,
    isQueueOpen,
    isPlaying,
    playTrack,
    removeFromQueue,
    clearQueue,
    setIsQueueOpen
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0d0f1a] border-l border-white/10 h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Cola de Reproducción</h3>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 font-semibold px-2 py-0.5 rounded-full">
              {queue.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearQueue}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors"
              title="Vaciar cola"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar
            </button>
            <button
              onClick={() => setIsQueueOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pista actual */}
        {currentTrack && (
          <div className="my-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Sonando ahora</span>
            <div className="flex items-center gap-3 mt-2">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-11 h-11 rounded-lg object-cover" 
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
            </div>
          </div>
        )}

        {/* Lista de siguientes pistas */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">A continuación</span>
          {queue.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              La cola está vacía. ¡Agrega canciones desde el catálogo o búsqueda!
            </div>
          ) : (
            queue.map((track, idx) => {
              const isCurrent = track.id === currentTrack?.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors group ${isCurrent ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div 
                    onClick={() => playTrack(track)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="text-xs font-mono text-slate-500 w-4 text-center">{idx + 1}</span>
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover" 
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className={`text-sm truncate ${isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-200 group-hover:text-white'}`}>
                        {track.title}
                      </h5>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => playTrack(track)}
                      className="p-1.5 text-slate-300 hover:text-cyan-400 rounded hover:bg-white/10"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
