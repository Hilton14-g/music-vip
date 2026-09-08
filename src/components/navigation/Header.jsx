import React, { useState, useEffect } from 'react';
import { Search, Download, Crown, User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { setActiveTab } = usePlayer();
  const { currentUser, openLogin, logout } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar Music VIP en tu teléfono o PC:\n\n• En Android/Chrome: Pulsa los 3 puntos y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".\n• En iPhone (Safari): Pulsa el botón Compartir y elige "Añadir a pantalla de inicio".\n• En PC (Edge/Chrome): Pulsa el icono de instalar en la barra de direcciones.');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#08090d]/80 backdrop-blur-md px-4 md:px-8 py-3.5 border-b border-white/5 flex items-center justify-between gap-4">
      {/* Barra de búsqueda rápida para escritorio */}
      <div 
        onClick={() => setActiveTab('search')}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 w-full max-w-md cursor-pointer transition-all group"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        <span className="text-xs md:text-sm text-slate-400 group-hover:text-slate-200 truncate">
          ¿Qué deseas escuchar? Canciones, artistas o URLs...
        </span>
      </div>

      {/* Botones de acción derecha */}
      <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,242,254,0.2)]"
            title="Instalar como app nativa en Teléfono o PC"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar App</span>
          </button>
        )}

        {/* Insignia VIP */}
        <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 px-2.5 py-1.5 rounded-full">
          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-bold text-amber-300">VIP</span>
        </div>

        {/* Perfil de Usuario / Iniciar Sesión con Firebase */}
        {currentUser ? (
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pl-2.5">
            <div className="flex items-center gap-1.5">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'Usuario'} 
                  className="w-6 h-6 rounded-full object-cover border border-cyan-400"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-white max-w-[90px] md:max-w-[130px] truncate hidden sm:inline">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={openLogin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
        )}
      </div>
    </header>
  );
};
