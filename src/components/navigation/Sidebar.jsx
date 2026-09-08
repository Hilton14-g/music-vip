import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  PlusCircle, 
  Settings, 
  Flame, 
  Sparkles, 
  Crown,
  Heart,
  Music2
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userPlaylists, 
    createPlaylist, 
    navigateToPlaylist, 
    selectedPlaylist 
  } = usePlayer();

  const handleCreatePlaylist = () => {
    const name = prompt('Nombre de tu nueva playlist:');
    if (name && name.trim()) {
      const pl = createPlaylist(name);
      navigateToPlaylist(pl);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0a0c14] border-r border-white/10 h-screen sticky top-0 p-5 select-none z-30">
      {/* LOGO MUSIC VIP */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-3 cursor-pointer group mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.5)] group-hover:scale-105 transition-transform">
          <Crown className="w-6 h-6 text-black fill-black" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              MUSIC <span className="text-cyan-400">VIP</span>
            </h1>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded border border-cyan-500/40">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">YouTube Audio Stream</p>
        </div>
      </div>

      {/* MENÚ PRINCIPAL */}
      <div className="space-y-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'home'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-5 h-5" />
          Inicio
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'search'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-5 h-5" />
          Explorar & Buscar
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'library'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Library className="w-5 h-5" />
          Tu Biblioteca
        </button>
      </div>

      {/* SEPARADOR */}
      <hr className="border-white/10 my-6" />

      {/* PLAYLISTS */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Playlists VIP</span>
          <button
            onClick={handleCreatePlaylist}
            className="text-slate-400 hover:text-cyan-400 p-1 rounded hover:bg-white/5 transition-colors"
            title="Crear Playlist"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-1 pr-1">
          {userPlaylists.length === 0 ? (
            <p className="text-[11px] text-slate-500 px-3 py-2 italic">Sin playlists activas</p>
          ) : (
            userPlaylists.map((pl) => {
              const isSel = activeTab === 'playlist' && selectedPlaylist?.id === pl.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => navigateToPlaylist(pl)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium truncate flex items-center gap-2 transition-colors ${
                    isSel ? 'text-cyan-400 bg-white/10 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Music2 className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                  <span className="truncate">{pl.title}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* TARJETA INFORMATIVA VIP / AJUSTES */}
      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-white/10 text-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          Ajustes & PWA
        </button>

        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/40 to-purple-950/40 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Flame className="w-4 h-4" />
            Sin Bloqueos ni Cortes
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Audio continuo en segundo plano y con pantalla apagada.
          </p>
        </div>
      </div>
    </aside>
  );
};
