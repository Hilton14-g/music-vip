import React from 'react';
import { X, FileText, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const LyricsModal = () => {
  const { isLyricsOpen, setIsLyricsOpen, currentTrack } = usePlayer();

  if (!isLyricsOpen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f111d] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white truncate max-w-xs">{currentTrack.title}</h3>
              <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>
          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Letras */}
        <div className="flex-1 overflow-y-auto py-6 px-2 space-y-4 text-center" data-lenis-prevent>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Letras Verificadas
          </div>
          <div className="text-lg md:text-xl text-slate-200 font-medium leading-loose whitespace-pre-line select-text">
            {currentTrack.lyrics || 'Letras no disponibles para este tema musical.'}
          </div>
        </div>

        {/* Pie */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsLyricsOpen(false)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
