// Vercel Serverless Function: Motor de Búsqueda Ilimitado de YouTube Music (Sin Cuota / 100% Gratis)
// Implementa 3 capas de respaldo en cascada para garantizar disponibilidad permanente:
// 1. YouTube Music API Oficial (WEB_REMIX)
// 2. YouTube Web API Estándar (WEB)
// 3. Extractor de Resultados HTML Público (ytInitialData Scraper)

function extractTracks(data) {
  const songs = [];
  const seenIds = new Set();

  function scan(obj) {
    if (!obj || typeof obj !== 'object') return;

    // Formato 1: YouTube Music Oficial
    if (obj.musicResponsiveListItemRenderer) {
      const r = obj.musicResponsiveListItemRenderer;
      const flex0 = r.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;
      const flex1 = r.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;
      const title = flex0?.[0]?.text;
      const artist = flex1?.[0]?.text || flex1?.[2]?.text || 'YouTube Music';
      const album = flex1?.[2]?.text || flex1?.[4]?.text || 'YouTube Music Official';
      const videoId = r.playlistItemData?.videoId || flex0?.[0]?.navigationEndpoint?.watchEndpoint?.videoId;

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

      const thumbnails = r.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
      const cover = thumbnails[thumbnails.length - 1]?.url || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

      if (title && videoId && !seenIds.has(videoId) && durationSec >= 50) {
        seenIds.add(videoId);
        songs.push({
          id: `ytm-${videoId}`,
          youtubeId: videoId,
          title,
          artist,
          album,
          duration: durationSec,
          genre: 'all',
          cover: cover || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          plays: 'YouTube Music',
          lyrics: `Escuchando "${title}" por ${artist} en Music VIP.`
        });
      }
    }

    // Formato 2: YouTube Web Estándar
    if (obj.videoRenderer) {
      const vr = obj.videoRenderer;
      const rawTitle = vr.title?.runs?.[0]?.text || vr.title?.simpleText || '';
      const videoId = vr.videoId;
      const artist = vr.ownerText?.runs?.[0]?.text || vr.shortBylineText?.runs?.[0]?.text || 'Artista Oficial';
      const lengthText = vr.lengthText?.simpleText || '';

      let durationSec = 210;
      if (lengthText && /^\d+:\d+$/.test(lengthText.trim())) {
        const parts = lengthText.trim().split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          durationSec = parts[0] * 60 + parts[1];
        }
      }

      const thumbs = vr.thumbnail?.thumbnails || [];
      const cover = thumbs[thumbs.length - 1]?.url || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

      const cleanTitle = rawTitle
        .replace(/(\(Official Video\)|\(Video Oficial\)|\(Official Music Video\)|\(Official Audio\)|\(Audio Oficial\)|\(Visualizer\))/gi, '')
        .trim();

      if (cleanTitle && videoId && !seenIds.has(videoId) && durationSec >= 50) {
        seenIds.add(videoId);
        songs.push({
          id: `ytm-${videoId}`,
          youtubeId: videoId,
          title: cleanTitle,
          artist: artist.replace(/VEVO$/i, '').trim(),
          album: 'YouTube Music Oficial',
          duration: durationSec,
          genre: 'all',
          cover: cover || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          plays: 'Audio HD',
          lyrics: `Escuchando "${cleanTitle}" por ${artist} en Music VIP.`
        });
      }
    }

    for (const key in obj) {
      scan(obj[key]);
    }
  }

  scan(data);
  return songs;
}

export default async function handler(req, res) {
  // Cabeceras CORS universales
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const query = body?.query || req.query?.q || '';
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'El parámetro de búsqueda es requerido' });
    }

    const cleanQuery = query.trim();

    // 1. CAPA 1: YouTube Music Oficial (WEB_REMIX)
    try {
      const ytmRes = await fetch('https://music.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://music.youtube.com',
          'Referer': 'https://music.youtube.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB_REMIX',
              clientVersion: '1.20240101.01.00'
            }
          },
          query: cleanQuery
        })
      });

      if (ytmRes.ok) {
        const data = await ytmRes.json();
        const results = extractTracks(data);
        if (results.length > 0) {
          return res.status(200).json({ results, ...data });
        }
      }
    } catch (e) {
      console.warn('Capa 1 (YouTube Music) omitida:', e.message);
    }

    // 2. CAPA 2: YouTube Web Estándar (WEB)
    try {
      const ytRes = await fetch('https://www.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://www.youtube.com',
          'Referer': 'https://www.youtube.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240101.01.00'
            }
          },
          query: cleanQuery
        })
      });

      if (ytRes.ok) {
        const data = await ytRes.json();
        const results = extractTracks(data);
        if (results.length > 0) {
          return res.status(200).json({ results, ...data });
        }
      }
    } catch (e) {
      console.warn('Capa 2 (YouTube Web) omitida:', e.message);
    }

    // 3. CAPA 3: Extractor de Resultados HTML Público (Nunca se bloquea)
    try {
      const htmlRes = await fetch(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
          }
        }
      );

      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
        if (match) {
          const data = JSON.parse(match[1]);
          const results = extractTracks(data);
          if (results.length > 0) {
            return res.status(200).json({ results, ...data });
          }
        }
      }
    } catch (e) {
      console.warn('Capa 3 (HTML Scraper) omitida:', e.message);
    }

    return res.status(502).json({ 
      error: 'No se encontraron resultados en los servidores de YouTube',
      results: [] 
    });
  } catch (error) {
    console.error('Error global en proxy de búsqueda:', error);
    return res.status(500).json({ error: error.message || 'Error interno', results: [] });
  }
}
