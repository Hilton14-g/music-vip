// Imports actualizados
import React, { useState } from 'react';
import { Heart, Plus, History, ListMusic, Play, Shuffle, Trash2, RotateCcw, ArchiveRestore, ShieldCheck } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackRow } from '../common/TrackRow';

export const LibraryView = () => {
  const { 
    favorites, 
    history, 
    userPlaylists, 
    deletedPlaylists = [],
    createPlaylist, 
    deletePlaylist,
    restorePlaylist,
    permanentlyDeletePlaylist,
    navigateToPlaylist, 
    playTrack,
    toggleFavorite,
    toggleShuffle 
  } = usePlayer();

  const [activeSubTab, setActiveSubTab] = useState('favorites'); // 'favorites' | 'playlists' | 'history' | 'trash'

  const handleNewPlaylist = () => {
    const name = prompt('Ingresa el nombre para tu nueva Playlist:');
    if (name && name.trim()) {
      const pl = createPlaylist(name);
      navigateToPlaylist(pl);
    }
  };

  const playAllFavorites = () => {
    if (favorites.length > 0) {
      playTrack(favorites[0], favorites);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Tu Biblioteca VIP</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Tus canciones favoritas, historial y playlists respaldadas con recuperación.
          </p>
        </div>

        <button
          onClick={handleNewPlaylist}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs md:text-sm shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nueva Playlist
        </button>
      </div>

      {/* PESTAÑAS SUB-TAB */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('favorites')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors flex-shrink-0 ${
            activeSubTab === 'favorites'
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          Favoritos ({favorites.length})
        </button>

        <button
          onClick={() => setActiveSubTab('playlists')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors flex-shrink-0 ${
            activeSubTab === 'playlists'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          Mis Playlists ({userPlaylists.length})
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors flex-shrink-0 ${
            activeSubTab === 'history'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          Historial ({history.length})
        </button>

        <button
          onClick={() => setActiveSubTab('trash')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors flex-shrink-0 ${
            activeSubTab === 'trash'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArchiveRestore className="w-4 h-4" />
          Papelera & Respaldo ({deletedPlaylists.length})
        </button>
      </div>

      {/* CONTENIDO SEGÚN SUB-TAB */}

      {/* 1. FAVORITOS */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={playAllFavorites}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 text-black font-bold text-xs md:text-sm hover:scale-105 transition-all shadow-[0_0_12px_rgba(0,242,254,0.4)]"
              >
                <Play className="w-4 h-4 fill-black" />
                Reproducir Todo
              </button>
            </div>
          )}

          {favorites.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass-card text-slate-400 p-6">
              <Heart className="w-12 h-12 mx-auto text-pink-500/40 mb-3" />
              <h4 className="text-lg font-bold text-white">Aún no tienes canciones favoritas</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Haz clic en el icono del corazón en cualquier canción que te guste para guardarla aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {favorites.map((track, idx) => (
                <TrackRow 
                  key={`fav-${track.id}`} 
                  track={track} 
                  index={idx} 
                  queueContext={favorites} 
                  onRemove={(t) => toggleFavorite(t)}
                  removeTooltip="Quitar de Favoritos"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MIS PLAYLISTS */}
      {activeSubTab === 'playlists' && (
        <div className="space-y-4">
          {userPlaylists.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass-card text-slate-400 p-6">
              <ListMusic className="w-12 h-12 mx-auto text-cyan-500/40 mb-3" />
              <h4 className="text-lg font-bold text-white">No has creado playlists todavía</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                Crea listas personalizadas con tus canciones favoritas para cualquier ocasión.
              </p>
              <button
                onClick={handleNewPlaylist}
                className="px-5 py-2.5 rounded-full bg-cyan-400 text-black font-bold text-xs shadow-lg hover:scale-105 transition-all"
              >
                Crear Mi Primera Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {userPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => navigateToPlaylist(pl)}
                  className="glass-card p-4 rounded-2xl cursor-pointer group hover:border-cyan-400/40 transition-all flex flex-col justify-between relative"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-black/40">
                    <img 
                      src={pl.cover} 
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-opacity">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>

                    {/* Botón enviar playlist a la papelera */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Enviar a la papelera la playlist "${pl.title}"? Podrás recuperarla cuando quieras.`)) {
                          deletePlaylist(pl.id);
                        }
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      title="Enviar a la papelera"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors truncate">
                      {pl.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {pl.trackCount || 0} canciones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. HISTORIAL RECIENTE */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass-card text-slate-400 p-6">
              <History className="w-12 h-12 mx-auto text-purple-500/40 mb-3" />
              <h4 className="text-lg font-bold text-white">Historial Vacío</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Las canciones que escuches se guardarán automáticamente aquí para que nunca las pierdas de vista.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((track, idx) => (
                <TrackRow key={`hist-${track.id}-${idx}`} track={track} index={idx} queueContext={history} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PAPELERA & RECUPERACIÓN DE PLAYLISTS */}
      {activeSubTab === 'trash' && (
        <div className="space-y-4">
          {deletedPlaylists.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass-card text-slate-400 p-6">
              <ArchiveRestore className="w-12 h-12 mx-auto text-amber-500/40 mb-3" />
              <h4 className="text-lg font-bold text-white">Papelera de Respaldo Vacía</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Si alguna vez borras una playlist, quedará guardada de forma segura aquí. Podrás restaurarla con todas sus canciones con un solo clic.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <span>
                  Estas playlists están respaldadas en la nube. Pulsa <strong>Restaurar</strong> para regresarlas inmediatamente a tu lista activa con todas sus canciones intactas.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {deletedPlaylists.map(pl => (
                  <div key={pl.id} className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={pl.cover} 
                        alt={pl.title} 
                        className="w-14 h-14 rounded-xl object-cover grayscale opacity-70 flex-shrink-0 border border-white/10" 
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-sm truncate">{pl.title}</h4>
                        <p className="text-xs text-slate-400">{pl.trackCount || 0} canciones</p>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                          En papelera
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => restorePlaylist(pl.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restaurar Playlist
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar definitivamente "${pl.title}" de tu cuenta? Esta acción no se puede deshacer.`)) {
                            permanentlyDeletePlaylist(pl.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
