import React, { useState } from 'react';
import { 
  X, 
  Tv, 
  Cast, 
  Airplay, 
  Smartphone, 
  Radio, 
  ExternalLink, 
  Copy, 
  Check, 
  Maximize, 
  Sparkles,
  Bluetooth
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const CastModal = () => {
  const { isCastOpen, setIsCastOpen, currentTrack, setIsFullScreen } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('chromecast'); // 'chromecast' | 'airplay' | 'smarttv' | 'bluetooth'

  if (!isCastOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://music-vip.vercel.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&bgcolor=08090d&color=00f2fe&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTvFullscreen = () => {
    setIsCastOpen(false);
    setIsFullScreen(true);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Intentar disparar diálogo nativo de transmisión si el navegador lo permite
  const triggerNativeCast = async () => {
    try {
      const audioEl = document.querySelector('audio');
      if (audioEl && audioEl.remote) {
        await audioEl.remote.prompt();
        return;
      }
    } catch (e) {}

    try {
      const audioEl = document.querySelector('audio');
      if (audioEl && audioEl.webkitShowPlaybackTargetPicker) {
        audioEl.webkitShowPlaybackTargetPicker();
        return;
      }
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Luz ambiental */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                Conectar a tu Smart TV
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider">
                  VIP
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Disfruta tu música en pantalla grande y sonido envolvente.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCastOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pista sonando actualmente */}
        {currentTrack && (
          <div className="my-4 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-12 h-12 rounded-xl object-cover shadow-md"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">
                Sonando ahora
              </span>
              <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
              <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>
        )}

        {/* Selector de Métodos de Conexión */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 rounded-2xl mb-4 border border-white/5">
          <button
            onClick={() => setActiveTab('chromecast')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'chromecast'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cast className="w-4 h-4" />
            <span>Chromecast</span>
          </button>

          <button
            onClick={() => setActiveTab('airplay')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'airplay'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Airplay className="w-4 h-4" />
            <span>AirPlay</span>
          </button>

          <button
            onClick={() => setActiveTab('smarttv')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'smarttv'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>App en TV</span>
          </button>

          <button
            onClick={() => setActiveTab('bluetooth')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'bluetooth'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bluetooth className="w-4 h-4" />
            <span>Bluetooth</span>
          </button>
        </div>

        {/* Contenido según pestaña */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3" data-lenis-prevent>
          {/* 1. CHROMECAST / GOOGLE CAST */}
          {activeTab === 'chromecast' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Cast className="w-4 h-4" />
                  Desde Chrome en Móvil o PC
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Asegúrate de que tu Smart TV o Chromecast y tu dispositivo estén en la <strong>misma red WiFi</strong>.</li>
                  <li>En Google Chrome, toca los <strong>3 puntos (⋮)</strong> en la esquina superior derecha.</li>
                  <li>Selecciona la opción <strong>"Transmitir..." (Cast)</strong>.</li>
                  <li>Elige tu televisor para ver la carátula y escuchar el audio en tu sala.</li>
                </ol>

                <button
                  onClick={triggerNativeCast}
                  className="w-full mt-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Cast className="w-4 h-4" />
                  Intentar Transmitir Ahora
                </button>
              </div>
            </div>
          )}

          {/* 2. AIRPLAY (APPLE TV / IPHONE / MAC) */}
          {activeTab === 'airplay' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                  <Airplay className="w-4 h-4" />
                  Desde iPhone, iPad o Mac (AirPlay)
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Verifica que tu iPhone y Smart TV (LG, Samsung, Sony, Roku o Apple TV) estén en el <strong>mismo WiFi</strong>.</li>
                  <li>Desliza hacia abajo desde la esquina superior derecha de tu iPhone para abrir el <strong>Centro de Control</strong>.</li>
                  <li>Toca el icono de <strong>AirPlay</strong> (el triángulo con ondas en el recuadro de música).</li>
                  <li>Elige tu Smart TV para enviar el sonido envolvente.</li>
                </ol>
              </div>
            </div>
          )}

          {/* 3. ABRIR EN NAVEGADOR DE SMART TV */}
          {activeTab === 'smarttv' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Abrir Music VIP directo en tu TV
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Abre el navegador web de tu Smart TV (LG webOS, Samsung Tizen, Android TV o Fire TV) e ingresa tu enlace o escanea el código:
                </p>

                {/* Código QR */}
                <div className="inline-block p-3 bg-[#08090d] border border-cyan-500/30 rounded-2xl shadow-xl">
                  <img 
                    src={qrUrl} 
                    alt="Código QR para Smart TV" 
                    className="w-36 h-36 mx-auto rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1.5 font-semibold">
                    Escanea o abre en tu TV
                  </span>
                </div>

                <div className="flex gap-2 justify-center pt-1">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '¡Copiado!' : 'Copiar URL para TV'}
                  </button>

                  <button
                    onClick={handleOpenTvFullscreen}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    Modo Pantalla Completa TV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. BLUETOOTH */}
          {activeTab === 'bluetooth' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Bluetooth className="w-4 h-4" />
                  Barra de Sonido o Altavoces de TV
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Pon tu televisor, barra de sonido o Home Theater en <strong>modo emparejamiento Bluetooth</strong>.</li>
                  <li>En tu móvil o computadora, entra a los Ajustes de Bluetooth y selecciona tu TV.</li>
                  <li>Todo el audio de Music VIP se transmitirá en alta definición directamente a los altavoces de tu salón.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Audio Ultra HD sin pérdidas
          </span>
          <button
            onClick={() => setIsCastOpen(false)}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
