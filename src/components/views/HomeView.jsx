import React, { useState } from 'react';
import { Play, Flame, Sparkles, TrendingUp, Radio, Music, Disc } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { GENRES, INITIAL_TRACKS } from '../../services/catalog';
import { TrackCard } from '../common/TrackCard';

export const HomeView = () => {
  const { playTrack, navigateToPlaylist, currentTrack, isPlaying, userPlaylists } = usePlayer();
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Filtrar canciones según género seleccionado
  const filteredTracks = selectedGenre === 'all'
    ? INITIAL_TRACKS
    : INITIAL_TRACKS.filter(t => t.genre === selectedGenre);

  // Canción destacada para el Hero Banner
  const heroTrack = INITIAL_TRACKS[0];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* HERO BANNER VIP */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-cyan-500/20">
        {/* Gradiente de fondo ambiental */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-purple-900/20 to-black/80 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Lanzamiento Destacado VIP
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {heroTrack.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-semibold mt-1">
            {heroTrack.artist} • <span className="text-cyan-400 font-normal">{heroTrack.album}</span>
          </p>
          <p className="text-sm text-slate-400 mt-3 line-clamp-2">
            Disfruta del éxito del momento con reproducción sin pausas ni publicidad invasiva.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => playTrack(heroTrack, INITIAL_TRACKS)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(0,242,254,0.7)] hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-black" />
              Escuchar Ahora
            </button>

            {userPlaylists.length > 0 && (
              <button
                onClick={() => navigateToPlaylist(userPlaylists[0])}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-colors"
              >
                Ver Playlist
              </button>
            )}
          </div>
        </div>

        {/* Portada destacada flotante con halo */}
        <div className="relative z-10 hidden sm:block flex-shrink-0">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <img 
              src={heroTrack.cover} 
              alt={heroTrack.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* FILTROS POR GÉNERO (Pill buttons con scroll horizontal táctil) */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRES.map((g) => {
            const isSelected = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,254,0.4)] scale-105'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 1: CANCIONES DESTACADAS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-extrabold text-white">Éxitos Más Escuchados</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredTracks.length} temas disponibles
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredTracks.slice(0, 10).map((track) => (
            <TrackCard key={track.id} track={track} queueContext={filteredTracks} />
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: PLAYLISTS VIP CURADAS */}
      {userPlaylists.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-extrabold text-white">Colecciones & Playlists VIP</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {userPlaylists.slice(0, 4).map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigateToPlaylist(pl)}
                className="glass-card p-4 rounded-2xl cursor-pointer group hover:border-cyan-400/40 transition-all flex flex-col justify-between"
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-black/40">
                  <img 
                    src={pl.cover} 
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-opacity">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors truncate">
                    {pl.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {pl.description}
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {pl.tracks?.length ?? pl.trackCount ?? 0} Canciones Seleccionadas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: LO-FI & AMBIENTAL CONTINUO */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#0c0e17] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Transmisión Lo-Fi Sin Fin (Chill & Focus)</h4>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Ideal para trabajar, estudiar o relajarte sin pausas de sonido.
            </p>
          </div>
        </div>

        <button
          onClick={() => playTrack(INITIAL_TRACKS.find(t => t.genre === 'lofi') || INITIAL_TRACKS[0])}
          className="px-6 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex-shrink-0 transition-all hover:scale-105"
        >
          Iniciar Radio Lo-Fi
        </button>
      </div>
    </div>
  );
};
