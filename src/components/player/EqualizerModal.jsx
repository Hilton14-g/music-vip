import React from 'react';
import { X, Sliders, Activity, Disc, Sparkles, Volume2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const PRESETS = [
  { id: 'normal', name: 'Original Studio', desc: 'Audio balanceado puro y fiel a la producción original.', icon: Disc },
  { id: 'bass', name: 'Mega Bass Boost', desc: 'Refuerzo potente de graves y sub-bajos para trap y reggaetón.', icon: Activity },
  { id: 'vocal', name: 'Claridad Vocal', desc: 'Realce de frecuencias medias para destacar la voz del cantante.', icon: Sparkles },
  { id: 'club', name: 'Club / Electronic', desc: 'Enfoque en pegada rítmica y agudos cristalinos para EDM.', icon: Volume2 },
  { id: 'chill', name: 'Suave & Acústico', desc: 'Tonos cálidos y relajantes para estudio, trabajo y descanso.', icon: Sliders }
];

export const EqualizerModal = () => {
  const { isEqualizerOpen, setIsEqualizerOpen, eqPreset, setEqPreset } = usePlayer();

  if (!isEqualizerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f111d] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Ecualizador & Modos VIP</h3>
          </div>
          <button
            onClick={() => setIsEqualizerOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-3 mb-4">
          Selecciona un perfil de procesamiento sonoro para adaptar la respuesta y animación armónica.
        </p>

        <div className="space-y-2.5">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = eqPreset === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => setEqPreset(preset.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected 
                    ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(0,242,254,0.15)]' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-cyan-400 text-black shadow-md' : 'bg-white/10 text-slate-300'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                      {preset.name}
                    </h4>
                    {isSelected && (
                      <span className="text-[10px] bg-cyan-400 text-black px-2 py-0.5 rounded-full font-bold uppercase">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{preset.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsEqualizerOpen(false)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
