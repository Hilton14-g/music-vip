import { INITIAL_TRACKS } from './catalog';
import { getStoredSettings, DEFAULT_YOUTUBE_API_KEY } from './storage';

export const parseISO8601Duration = (duration) => {
  if (!duration) return 210;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 210;
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Consulta oficial y recursiva a la API interna de YouTube Music
 */
export const searchYouTubeMusicApi = async (query) => {
  if (!query || !query.trim()) return null;

  try {
    const response = await fetch('/api/ytm/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB_REMIX',
            clientVersion: '1.20240101.01.00'
          }
        },
        query: query.trim()
      })
    });

    if (!response.ok) return null;
    const data = await response.json();

    const sections = data.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];
    const songs = [];
    const seenIds = new Set();

    // Escaneo recursivo profundo para extraer canciones reales de YouTube Music
    function scan(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (obj.musicResponsiveListItemRenderer) {
        const r = obj.musicResponsiveListItemRenderer;
        const flex0 = r.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;
        const flex1 = r.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;
        const title = flex0?.[0]?.text;
        const artist = flex1?.[0]?.text || flex1?.[2]?.text || 'YouTube Music';
        const album = flex1?.[2]?.text || flex1?.[4]?.text || 'YouTube Music Official';
        const videoId = r.playlistItemData?.videoId || flex0?.[0]?.navigationEndpoint?.watchEndpoint?.videoId;

        // Parsear duración real en segundos
        let durationSec = 210;
        if (flex1) {
          for (const run of flex1) {
            if (run.text && /^\d+:\d+$/.test(run.text.trim())) {
              const parts = run.text.trim().split(':').map(Number);
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                durationSec = parts[0] * 60 + parts[1];
              }
            }
          }
        }

        // Miniatura
        const thumbnails = r.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
        const cover = thumbnails[thumbnails.length - 1]?.url || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

        // Descartar Reels/Shorts menores a 60 segundos y duplicados
        if (title && videoId && !seenIds.has(videoId) && durationSec >= 60) {
          seenIds.add(videoId);
          songs.push({
            id: `ytm-${videoId}`,
            youtubeId: videoId,
            title,
            artist,
            album,
            duration: durationSec,
            genre: 'all',
            cover: cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            plays: 'YouTube Music',
            lyrics: `Escuchando "${title}" por ${artist} directamente de YouTube Music Oficial.`
          });
        }
      }

      for (const key in obj) {
        scan(obj[key]);
      }
    }

    scan(sections);
    return songs.length > 0 ? songs : null;
  } catch (err) {
    console.warn('Error conectando a YouTube Music API:', err);
    return null;
  }
};

export const extractYouTubeId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoId) => {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Búsqueda principal con YouTube Data API v3 Oficial + Filtrado de Shorts
 */
export const searchYouTubeMusic = async (query) => {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();
  const directId = extractYouTubeId(cleanQuery);

  if (directId) {
    return [{
      id: `yt-${directId}`,
      youtubeId: directId,
      title: 'YouTube Track ' + directId,
      artist: 'Audio Oficial de YouTube',
      album: 'Reproducción Directa',
      duration: 210,
      genre: 'all',
      cover: getYouTubeThumbnail(directId),
      plays: 'Directo',
      lyrics: 'Audio cargado directamente desde el enlace de YouTube.'
    }];
  }

  // 1. YouTube Data API v3 Oficial con la clave de Google Cloud
  const settings = getStoredSettings();
  const apiKey = (settings.youtubeApiKey && settings.youtubeApiKey.trim().length > 20) 
    ? settings.youtubeApiKey.trim() 
    : DEFAULT_YOUTUBE_API_KEY;

  if (apiKey && apiKey.length > 20) {
    try {
      const gRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(cleanQuery)}&type=video&videoCategoryId=10&maxResults=20&key=${apiKey}`
      );
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.items && gData.items.length > 0) {
          const videoIds = gData.items.map(i => i.id?.videoId).filter(Boolean).join(',');

          // Obtener duraciones exactas con videos.list
          const vRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`
          );

          if (vRes.ok) {
            const vData = await vRes.json();
            const validTracks = [];

            for (const v of vData.items || []) {
              const durSec = parseISO8601Duration(v.contentDetails?.duration);
              // FILTRO ESTRICTO: descartar clips y reels menores a 60 segundos
              if (durSec >= 60) {
                const rawTitle = v.snippet?.title || 'Canción Oficial';
                const channel = v.snippet?.channelTitle || 'Artista Oficial';
                const thumbs = v.snippet?.thumbnails;
                const cover = thumbs?.maxres?.url || thumbs?.high?.url || thumbs?.medium?.url || getYouTubeThumbnail(v.id);

                // Limpiar sufijos como "(Official Video)", etc. para una experiencia 100% de música
                const cleanTitle = rawTitle
                  .replace(/(\(Official Video\)|\(Video Oficial\)|\(Official Music Video\)|\(Official Audio\)|\(Audio Oficial\)|\(Visualizer\))/gi, '')
                  .trim();

                validTracks.push({
                  id: `yt-${v.id}`,
                  youtubeId: v.id,
                  title: cleanTitle || rawTitle,
                  artist: channel.replace(/VEVO$/i, '').trim(),
                  album: 'YouTube Music Oficial',
                  duration: durSec,
                  genre: 'all',
                  cover,
                  plays: 'Audio HD',
                  lyrics: `Reproduciendo "${cleanTitle || rawTitle}" por ${channel} en Music VIP.`
                });
              }
            }

            if (validTracks.length > 0) {
              return validTracks;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Fallo en Google YouTube Data API, pasando a fallback:', e);
    }
  }

  // 2. Consulta a la API interna de YouTube Music
  const apiSongs = await searchYouTubeMusicApi(cleanQuery);
  if (apiSongs && apiSongs.length > 0) {
    return apiSongs;
  }

  // 3. Fallback a catálogo local
  const qLower = cleanQuery.toLowerCase();
  return INITIAL_TRACKS.filter(track => 
    track.title.toLowerCase().includes(qLower) ||
    track.artist.toLowerCase().includes(qLower) ||
    (track.album && track.album.toLowerCase().includes(qLower))
  );
};
