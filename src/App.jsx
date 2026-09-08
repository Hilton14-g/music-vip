import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { AudioEngine } from './components/player/AudioEngine';
import { PlayerBar } from './components/player/PlayerBar';
import { FullScreenPlayer } from './components/player/FullScreenPlayer';
import { QueueDrawer } from './components/player/QueueDrawer';
import { LyricsModal } from './components/player/LyricsModal';
import { EqualizerModal } from './components/player/EqualizerModal';
import { SleepTimerModal } from './components/player/SleepTimerModal';
import { AuthModal } from './components/auth/AuthModal';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { Header } from './components/navigation/Header';

import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { LibraryView } from './components/views/LibraryView';
import { PlaylistView } from './components/views/PlaylistView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout = () => {
  const { activeTab } = usePlayer();

  return (
    <div className="flex min-h-screen bg-[#08090d] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Motor de Audio Persistente Invisible */}
      <AudioEngine />

      {/* Sidebar para Pantallas de Escritorio / Tablets */}
      <Sidebar />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 pb-32 md:pb-24">
        {/* Cabecera con Buscador Rápido y Estado VIP */}
        <Header />

        {/* Vista Activa */}
        <main className="flex-1 px-4 md:px-8 pt-6 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'search' && <SearchView />}
          {activeTab === 'library' && <LibraryView />}
          {activeTab === 'playlist' && <PlaylistView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Barra de Reproducción Inferior Persistente */}
      <PlayerBar />

      {/* Barra de Navegación Móvil */}
      <MobileNav />

      {/* Reproductor a Pantalla Completa (Vinilo, Letras, Visualizador) */}
      <FullScreenPlayer />

      {/* Modales Globales */}
      <QueueDrawer />
      <LyricsModal />
      <EqualizerModal />
      <SleepTimerModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <MainLayout />
      </PlayerProvider>
    </AuthProvider>
  );
}

