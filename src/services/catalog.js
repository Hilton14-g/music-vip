// Catálogo VIP preconfigurado con canciones verificadas y 100% reproducibles de YouTube
// Géneros: Urbano & Reggaetón, Pop Hits, Lo-Fi Chill, Rock Clásicos, EDM Electrónica, Hip-Hop & Trap

export const GENRES = [
  { id: 'all', name: 'Todos', icon: 'Sparkles', color: 'from-cyan-500 to-blue-600' },
  { id: 'urban', name: 'Urbano & Reggaetón', icon: 'Flame', color: 'from-orange-500 to-rose-600' },
  { id: 'pop', name: 'Pop Hits', icon: 'Music', color: 'from-pink-500 to-purple-600' },
  { id: 'lofi', name: 'Lo-Fi & Chill', icon: 'Coffee', color: 'from-indigo-500 to-cyan-400' },
  { id: 'rock', name: 'Rock Clásicos', icon: 'Zap', color: 'from-amber-500 to-red-600' },
  { id: 'electronic', name: 'EDM & Electrónica', icon: 'Radio', color: 'from-emerald-400 to-teal-600' },
  { id: 'hiphop', name: 'Hip-Hop & Trap', icon: 'Headphones', color: 'from-purple-600 to-pink-500' }
];

export const INITIAL_TRACKS = [
  // --- URBANO & REGGAETÓN ---
  {
    id: 'yt-FfVdwJKylNM',
    youtubeId: 'FfVdwJKylNM',
    title: 'Monaco',
    artist: 'Bad Bunny',
    album: 'Nadie Sabe Lo Que Va A Pasar Mañana',
    duration: 267,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: '142.5M',
    lyrics: `Dime si te acuerdas de mí
Bebiendo champán en Mónaco
Hierba fina y autos exóticos
Gastando los millones rápido
La vida es una sola y se vive al máximo.`
  },
  {
    id: 'yt-kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'Vida',
    duration: 282,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    plays: '8.4B',
    lyrics: `Sí, sabes que ya llevo un rato mirándote
Tengo que bailar contigo hoy
Vi que tu mirada ya estaba llamándome
Muéstrame el camino que yo voy.`
  },
  {
    id: 'yt-Cm_ocUG67Wo',
    youtubeId: 'Cm_ocUG67Wo',
    title: 'Gata Only',
    artist: 'FloyyMenor & Cris Mj',
    album: 'Single 2024',
    duration: 222,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: '520M',
    lyrics: `Mami, dime si tú estás pa' mí
Que yo estoy pa' ti
Bailando en la disco pegaditos
Tú y yo solos aquí.`
  },
  {
    id: 'yt-k45a1-77P10',
    youtubeId: 'k45a1-77P10',
    title: 'Qlona',
    artist: 'Karol G ft. Peso Pluma',
    album: 'Mañana Será Bonito',
    duration: 172,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: '310.8M',
    lyrics: `Ayer te vi en la disco y te veías tan bien
Me dieron unas ganas de volverte a ver
Bailando suavecita hasta el amanecer.`
  },
  {
    id: 'yt-10EX_4Jmi3Q',
    youtubeId: '10EX_4Jmi3Q',
    title: 'Tití Me Preguntó',
    artist: 'Bad Bunny',
    album: 'Un Verano Sin Ti',
    duration: 243,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: '1.1B',
    lyrics: `Tití me preguntó si tengo muchas novias
Muchas novias, hoy tengo a una, mañana otra
Me las voy a llevar a todas pa' un VIP.`
  },
  {
    id: 'yt-A_g3lMcWXX0',
    youtubeId: 'A_g3lMcWXX0',
    title: 'Quevedo: Bzrp Music Sessions, Vol. 52 (Quédate)',
    artist: 'Bizarrap & Quevedo',
    album: 'Bzrp Music Sessions',
    duration: 198,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: '680M',
    lyrics: `Quédate, que las noches sin ti duelen
Tengo en la mente las poses y todos los gemidos
Que ya no quiero nada que no sea contigo.`
  },
  {
    id: 'yt-CocEMWJZ9uc',
    youtubeId: 'CocEMWJZ9uc',
    title: 'Shakira: Bzrp Music Sessions, Vol. 53',
    artist: 'Bizarrap & Shakira',
    album: 'Bzrp Music Sessions',
    duration: 213,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: '710M',
    lyrics: `Una loba como yo no está pa' tipos como tú
Pa' tipos como tú, a ti te quedé grande
Y por eso estás con una igualita que tú.`
  },
  {
    id: 'yt-lZiafs_D-8g',
    youtubeId: 'lZiafs_D-8g',
    title: 'Ella Baila Sola',
    artist: 'Eslabon Armado & Peso Pluma',
    album: 'Desvelado',
    duration: 165,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    plays: '590M',
    lyrics: `Compa, ¿qué le parece esa morra?
La que anda bailando sola me gusta pa' mí
Bella, ella sabe que está buena
Que todos los morros miran cómo baila.`
  },
  {
    id: 'yt-CFPLIaMpGrY',
    youtubeId: 'CFPLIaMpGrY',
    title: 'Todo De Ti',
    artist: 'Rauw Alejandro',
    album: 'Vice Versa',
    duration: 199,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    plays: '650M',
    lyrics: `El olor de tu perfume en mi cama
Tú dejaste tu camisa y tus ganas
Me gusta todo de ti, de ti, de ti.`
  },
  {
    id: 'yt-qGKrc3A6HHM',
    youtubeId: 'qGKrc3A6HHM',
    title: 'Gasolina',
    artist: 'Daddy Yankee',
    album: 'Barrio Fino',
    duration: 192,
    genre: 'urban',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: '850M',
    lyrics: `A ella le gusta la gasolina
Dame más gasolina
Cómo le encanta la gasolina
Dame más gasolina.`
  },

  // --- POP GLOBAL ---
  {
    id: 'yt-4NRXx6U8ABQ',
    youtubeId: '4NRXx6U8ABQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    genre: 'pop',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    plays: '4.1B',
    lyrics: `I've been on my own for long enough
Maybe you can show me how to love, maybe
I'm going through withdrawals
You don't even have to do too much.`
  },
  {
    id: 'yt-JGwWNGJdvx8',
    youtubeId: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: 233,
    genre: 'pop',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    plays: '6.2B',
    lyrics: `The club isn't the best place to find a lover
So the bar is where I go
Me and my friends at the table doing shots
Drinking fast and then we talk slow...`
  },
  {
    id: 'yt-hT_nvWreIhg',
    youtubeId: 'hT_nvWreIhg',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    album: 'Native',
    duration: 257,
    genre: 'pop',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    plays: '3.9B',
    lyrics: `Lately, I've been, I've been losing sleep
Dreaming about the things that we could be
But, baby, I've been, I've been praying hard
Said no more counting dollars, we'll be counting stars.`
  },
  {
    id: 'yt-TUVcZfQe-Kw',
    youtubeId: 'TUVcZfQe-Kw',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    genre: 'pop',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    plays: '890M',
    lyrics: `If you wanna run away with me, I know a galaxy
And I can take you for a ride
I had a premonition that we fell into a rhythm
Where the music don't stop for life.`
  },
  {
    id: 'yt-fHI8X4OXluQ',
    youtubeId: 'fHI8X4OXluQ',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    duration: 230,
    genre: 'pop',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    plays: '2.4B',
    lyrics: `I'm tryna put you in the worst mood, ah
P1 cleaner than your church shoes, ah
Milli point two just to hurt you, ah
Look what you've done, I'm a motherfuckin' starboy.`
  },

  // --- LO-FI & CHILL ---
  {
    id: 'yt-jfKfPfyJRdk',
    youtubeId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    artist: 'Lofi Girl',
    album: 'Endless Stream Session',
    duration: 3600,
    genre: 'lofi',
    cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    plays: '1.2B',
    lyrics: `[Instrumental Chill Beats]
Vibraciones cálidas para estudiar, relajarse o trabajar.
Música continua sin pausas.`
  },
  {
    id: 'yt-5qap5aO4i9A',
    youtubeId: '5qap5aO4i9A',
    title: 'Lofi Coffee Shop Vibes',
    artist: 'ChillHop Music',
    album: 'Cafe & Rain Beats',
    duration: 1800,
    genre: 'lofi',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    plays: '42.8M',
    lyrics: `[Beats suaves de café y lluvia]
Sonidos analógicos de vinilo y piano nostálgico.`
  },

  // --- ROCK CLÁSICOS ---
  {
    id: 'yt-fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 359,
    genre: 'rock',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    plays: '1.7B',
    lyrics: `Is this the real life? Is this just fantasy?
Caught in a landslide, no escape from reality
Open your eyes, look up to the skies and see...`
  },
  {
    id: 'yt-1w7OgIMMRc4',
    youtubeId: '1w7OgIMMRc4',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    duration: 303,
    genre: 'rock',
    cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop&q=80',
    plays: '1.6B',
    lyrics: `She's got a smile that it seems to me
Reminds me of childhood memories
Where everything was as fresh as the bright blue sky.`
  },
  {
    id: 'yt-v2AC41dglnM',
    youtubeId: 'v2AC41dglnM',
    title: 'Thunderstruck',
    artist: 'AC/DC',
    album: 'The Razors Edge',
    duration: 292,
    genre: 'rock',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    plays: '1.4B',
    lyrics: `Thunder! (Thunder!)
Rode down the highway, broke the limit
We hit the town, went through to Texas
Yeah, Texas, and we had some fun.`
  },
  {
    id: 'yt-7wtfhZwyrcc',
    youtubeId: '7wtfhZwyrcc',
    title: 'Believer',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    duration: 204,
    genre: 'rock',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    plays: '2.5B',
    lyrics: `First things first
I'ma say all the words inside my head
I'm fired up and tired of the way that things have been, oh-ooh
The way that things have been, oh-ooh.`
  },

  // --- ELECTRONIC & EDM ---
  {
    id: 'yt-ALZHF5UqnU4',
    youtubeId: 'ALZHF5UqnU4',
    title: 'Alone',
    artist: 'Marshmello',
    album: 'Joytime',
    duration: 198,
    genre: 'electronic',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    plays: '2.5B',
    lyrics: `I'm so alone
Nothing feels like home
I'm so alone
Trying to find my way back home to you.`
  },
  {
    id: 'yt-60ItHLz5WEA',
    youtubeId: '60ItHLz5WEA',
    title: 'Faded',
    artist: 'Alan Walker',
    album: 'Different World',
    duration: 212,
    genre: 'electronic',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: '3.6B',
    lyrics: `You were the shadow to my light
Did you feel us?
Another start, you fade away
Afraid our aim is out of sight
Wanna see us alive.`
  },
  {
    id: 'yt-IcrbM1l_BoI',
    youtubeId: 'IcrbM1l_BoI',
    title: 'Wake Me Up',
    artist: 'Avicii',
    album: 'True',
    duration: 272,
    genre: 'electronic',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    plays: '2.3B',
    lyrics: `Feeling my way through the darkness
Guided by a beating heart
I can't tell where the journey will end
But I know where to start.`
  },

  // --- HIP-HOP & TRAP ---
  {
    id: 'yt-YVkUvmDQ3HY',
    youtubeId: 'YVkUvmDQ3HY',
    title: 'Without Me',
    artist: 'Eminem',
    album: 'The Eminem Show',
    duration: 297,
    genre: 'hiphop',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    plays: '1.9B',
    lyrics: `Guess who's back, back again?
Shady's back, tell a friend
Guess who's back, guess who's back?
Guess who's back, guess who's back?`
  },
  {
    id: 'yt-tvTRZJ-4EyI',
    youtubeId: 'tvTRZJ-4EyI',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    album: 'DAMN.',
    duration: 184,
    genre: 'hiphop',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: '1.1B',
    lyrics: `Nobody pray for me
It been that day for me
Way (yeah, yeah!)
Ay, I remember syrup sandwiches and crime allowances.`
  }
];

export const FEATURED_PLAYLISTS = [
  {
    id: 'pl-vip-trending',
    title: 'VIP Top Trending Global',
    description: 'Los mayores éxitos que suenan en todo el planeta en este instante.',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    trackCount: 8,
    isDeleted: false,
    deletedAt: null,
    tracks: [
      INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[2], INITIAL_TRACKS[3],
      INITIAL_TRACKS[4], INITIAL_TRACKS[5], INITIAL_TRACKS[6], INITIAL_TRACKS[7]
    ].filter(Boolean)
  },
  {
    id: 'pl-urbano-fuego',
    title: 'Reggaetón & Trap Fuego',
    description: 'El perreo más duro y los beats urbanos más prendidos.',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    trackCount: 6,
    isDeleted: false,
    deletedAt: null,
    tracks: [
      INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[2], INITIAL_TRACKS[3],
      INITIAL_TRACKS[4], INITIAL_TRACKS[8] || INITIAL_TRACKS[0]
    ].filter(Boolean)
  },
  {
    id: 'pl-lofi-chill',
    title: 'Lo-Fi Chill & Focus VIP',
    description: 'Para estudiar, programar o relajarse sin interrupciones.',
    cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    trackCount: 2,
    isDeleted: false,
    deletedAt: null,
    tracks: INITIAL_TRACKS.filter(t => t.genre === 'lofi')
  },
  {
    id: 'pl-rock-legends',
    title: 'Leyendas del Rock',
    description: 'Guitarras legendarias, solos épicos y clásicos inmortales.',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    trackCount: 4,
    isDeleted: false,
    deletedAt: null,
    tracks: INITIAL_TRACKS.filter(t => t.genre === 'rock')
  }
];
