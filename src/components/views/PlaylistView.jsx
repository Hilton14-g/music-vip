import React from 'react';
import { Play, Shuffle, Clock, ChevronLeft, Trash2, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { INITIAL_TRACKS } from '../../services/catalog';
import { TrackRow } from '../common/TrackRow';

export const PlaylistView = () => {
  const { 
    selectedPlaylist, 
    userPlaylists,
    deletedPlaylists,
    setActiveTab, 
    playTrack, 
    toggleShuffle, 
    isShuffle,
    removeTrackFromPlaylist,
    deletePlaylist
  } = usePlayer();

  if (!selectedPlaylist) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>No hay ninguna playlist seleccionada.</p>
        <button
          onClick={() => setActiveTab('library')}
          className="mt-4 px-5 py-2 rounded-full bg-cyan-400 text-black font-bold text-xs"
        >
          Volver a Mi Biblioteca
        </button>
      </div>
    );
  }

  // Obtenemos la versión reactiva y actualizada de la playlist
  const currentPlaylist = userPlaylists.find(p => p.id === selectedPlaylist?.id)
    || (deletedPlaylists || []).find(p => p.id === selectedPlaylist?.id)
    || selectedPlaylist;

  // Obtener pistas de la playlist (sin resurrección automática)
  const playlistTracks = Array.isArray(currentPlaylist.tracks) ? currentPlaylist.tracks : [];

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  const handleShufflePlay = () => {
    if (playlistTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlistTracks.length);
      if (!isShuffle) toggleShuffle();
      playTrack(playlistTracks[randomIndex], playlistTracks);
    }
  };

  const handleDeletePlaylist = () => {
    if (window.confirm(`¿Enviar a la papelera la playlist "${currentPlaylist.title}"? Podrás restaurarla cuando quieras.`)) {
      deletePlaylist(currentPlaylist.id);
      setActiveTab('library');
    }
  };

  const totalDuration = playlistTracks.reduce((acc, t) => acc + (t.duration || 210), 0);
  const totalMins = Math.floor(totalDuration / 60);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Botón Volver */}
      <button
        onClick={() => setActiveTab('library')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a Biblioteca
      </button>

      {/* CABECERA DE LA PLAYLIST */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/20">
          <img 
            src={currentPlaylist.cover} 
            alt={currentPlaylist.title} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
            Playlist VIP
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white mt-1 leading-tight">
            {currentPlaylist.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-2 line-clamp-2">
            {currentPlaylist.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-4 font-medium">
            <span>{playlistTracks.length} canciones</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              aprox. {totalMins} minutos
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(0,242,254,0.6)] hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-black" />
              Reproducir
            </button>

            <button
              onClick={handleShufflePlay}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-all hover:scale-105"
            >
              <Shuffle className="w-4 h-4" />
              Aleatorio
            </button>

            <button
              onClick={handleDeletePlaylist}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-500/10 hover:bg-red-500/25 text-red-400 font-bold text-sm border border-red-500/20 transition-all hover:scale-105"
              title="Enviar a la papelera"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Playlist
            </button>
          </div>
        </div>
      </div>

      {/* LISTA DE PISTAS */}
      <div className="space-y-1">
        {playlistTracks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl glass-panel text-slate-400">
            <Music className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p>Esta playlist aún no tiene canciones.</p>
            <p className="text-xs text-slate-500 mt-1">Busca canciones en el buscador o añádelas con el icono (+).</p>
          </div>
        ) : (
          playlistTracks.map((track, idx) => (
            <TrackRow 
              key={`${track.id}-${idx}`} 
              track={track} 
              index={idx} 
              queueContext={playlistTracks} 
              onRemove={(t) => removeTrackFromPlaylist(currentPlaylist.id, t.id)}
              removeTooltip="Eliminar de esta playlist"
            />
          ))
        )}
      </div>
    </div>
  );
};
