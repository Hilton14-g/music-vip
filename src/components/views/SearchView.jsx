import React, { useState, useEffect, useTransition } from 'react';
import { Search, X, Link, Play, Sparkles, Music, Loader2, Video, Flame } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { searchYouTubeMusic, extractYouTubeId, getYouTubeThumbnail } from '../../services/youtube';
import { GENRES, INITIAL_TRACKS } from '../../services/catalog';
import { TrackRow } from '../common/TrackRow';

const TRENDING_TAGS = [
  'Bad Bunny', 'Feid', 'Karol G', 'Peso Pluma', 'Quevedo', 
  'The Weeknd', 'Linkin Park', 'Lofi Girl', 'Coldplay', 'EDM'
];

export const SearchView = () => {
  const { playTrack } = usePlayer();
  const [query, setQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Búsqueda ultra veloz en tiempo real
  const handleQueryChange = (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // 1. Respuesta instantánea en 0ms con catálogo local para respuesta inmediata
    const qLower = text.trim().toLowerCase();
    const localMatches = INITIAL_TRACKS.filter(track => 
      track.title.toLowerCase().includes(qLower) ||
      track.artist.toLowerCase().includes(qLower) ||
      (track.album && track.album.toLowerCase().includes(qLower))
    );
    if (localMatches.length > 0) {
      setResults(localMatches);
    }
  };

  // Enriquecer con catálogo completo de YouTube en segundo plano (Debounce 280ms)
  useEffect(() => {
    if (!query.trim()) return;

    let isCurrent = true;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const enriched = await searchYouTubeMusic(query);
        if (isCurrent && enriched && enriched.length > 0) {
          startTransition(() => {
            setResults(enriched);
          });
        }
      } catch (e) {
        console.error('Error buscando:', e);
      } finally {
        if (isCurrent) {
          setIsSearching(false);
        }
      }
    }, 280);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Manejo de reproducción directa por URL de YouTube
  const handlePlayDirectUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const videoId = extractYouTubeId(urlInput);
    if (!videoId) {
      alert('Por favor ingresa un enlace válido de YouTube o YouTube Music (ej: https://youtu.be/xxx o https://www.youtube.com/watch?v=xxx)');
      return;
    }

    const customTrack = {
      id: `yt-direct-${videoId}`,
      youtubeId: videoId,
      title: 'YouTube Stream ' + videoId,
      artist: 'Audio Oficial de YouTube',
      album: 'Enlace Directo',
      duration: 240,
      genre: 'all',
      cover: getYouTubeThumbnail(videoId),
      plays: 'Directo',
      lyrics: 'Audio cargado directamente desde el enlace de YouTube.'
    };

    playTrack(customTrack);
    setUrlInput('');
  };

  const handleGenreClick = (genreId) => {
    const genreTracks = INITIAL_TRACKS.filter(t => t.genre === genreId);
    setResults(genreTracks);
    const genreObj = GENRES.find(g => g.id === genreId);
    setQuery(genreObj ? genreObj.name : '');
  };

  const handleTagClick = (tag) => {
    handleQueryChange(tag);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* CABECERA CON BARRA DE BÚSQUEDA */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Explorar & Buscar en YouTube
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Búsqueda instantánea en tiempo real de canciones, artistas y enlaces.
          </p>
        </div>

        {/* Input Principal de Búsqueda */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Buscar artista, canción (ej: Bad Bunny, Feid, Lofi, Rock)..."
            className="w-full bg-[#121422] border border-white/10 focus:border-cyan-400 rounded-2xl py-3.5 pl-12 pr-12 text-sm md:text-base text-white placeholder:text-slate-500 outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(0,242,254,0.25)]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Etiquetas de Tendencias Rápidas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
            <Flame className="w-3.5 h-3.5 text-rose-500" /> Top:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 whitespace-nowrap transition-all flex-shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Pegar enlace directo de YouTube */}
        <form onSubmit={handlePlayDirectUrl} className="flex gap-2">
          <div className="relative flex-1">
            <Link className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="O pega cualquier link de YouTube (ej: https://youtu.be/...)..."
              className="w-full bg-[#121422]/60 border border-white/10 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs md:text-sm text-white placeholder:text-slate-500 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs md:text-sm flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.3)] flex-shrink-0 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            Reproducir Link
          </button>
        </form>
      </div>

      {/* RESULTADOS DE BÚSQUEDA INSTANTÁNEOS */}
      {query && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Resultados para "{query}" ({results.length})
            </h3>
            {isSearching && (
              <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Actualizando...</span>
              </div>
            )}
          </div>

          {results.length === 0 && !isSearching ? (
            <div className="p-8 text-center rounded-2xl glass-panel text-slate-400">
              <Video className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-base font-semibold text-white">No se encontraron resultados directos</p>
              <p className="text-xs text-slate-400 mt-1">
                Puedes pegar el enlace directo del video de YouTube en el campo superior para reproducirlo al instante.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((track, idx) => (
                <TrackRow key={`${track.id}-${idx}`} track={track} index={idx} queueContext={results} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TARJETAS DE EXPLORACIÓN POR CATEGORÍA (Cuando no hay búsqueda activa) */}
      {!query && (
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Explorar Géneros & Estilos
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GENRES.filter(g => g.id !== 'all').map((genre) => {
              return (
                <div
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${genre.color} cursor-pointer group shadow-lg transition-all hover:scale-105 hover:shadow-cyan-500/20 flex flex-col justify-between h-28 relative overflow-hidden`}
                >
                  <div className="relative z-10 font-bold text-white text-base md:text-lg drop-shadow-md">
                    {genre.name}
                  </div>
                  <span className="relative z-10 text-[11px] font-semibold text-white/80">
                    Tocar para explorar
                  </span>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-black/20 rounded-full blur-sm transform group-hover:scale-125 transition-transform" />
                </div>
              );
            })}
          </div>

          {/* SUGERENCIAS RÁPIDAS */}
          <div className="pt-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Canciones Recomendadas para ti
            </h4>
            <div className="space-y-1">
              {INITIAL_TRACKS.slice(0, 8).map((track, idx) => (
                <TrackRow key={track.id} track={track} index={idx} queueContext={INITIAL_TRACKS} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
