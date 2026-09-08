import React from 'react';
import { X, Moon, Clock, Check } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const TIMER_OPTIONS = [
  { label: 'Desactivado', minutes: null },
  { label: '15 Minutos', minutes: 15 },
  { label: '30 Minutos', minutes: 30 },
  { label: '45 Minutos', minutes: 45 },
  { label: '60 Minutos (1 Hora)', minutes: 60 },
  { label: '90 Minutos', minutes: 90 }
];

export const SleepTimerModal = () => {
  const {
    isSleepTimerOpen,
    setIsSleepTimerOpen,
    sleepTimerMinutes,
    sleepTimerSecondsLeft,
    setSleepTimer
  } = usePlayer();

  if (!isSleepTimerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f111d] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">Temporizador de Apagado</h3>
          </div>
          <button
            onClick={() => setIsSleepTimerOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sleepTimerSecondsLeft && (
          <div className="my-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">Apagado automático en</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {Math.floor(sleepTimerSecondsLeft / 60)}m {sleepTimerSecondsLeft % 60}s
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-3 mb-4">
          La música se pausará automáticamente cuando el tiempo finalice. Perfecto para dormir.
        </p>

        <div className="space-y-2">
          {TIMER_OPTIONS.map((opt, i) => {
            const isSelected = sleepTimerMinutes === opt.minutes;
            return (
              <button
                key={i}
                onClick={() => {
                  setSleepTimer(opt.minutes);
                  if (opt.minutes === null) {
                    setIsSleepTimerOpen(false);
                  }
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 opacity-70" />
                  {opt.label}
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsSleepTimerOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
