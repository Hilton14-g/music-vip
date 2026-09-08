import React from 'react';
import { Home, Search, Library, ListMusic, Settings } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const MobileNav = () => {
  const { activeTab, setActiveTab } = usePlayer();

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'library', label: 'Biblioteca', icon: Library },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c14]/95 backdrop-blur-xl border-t border-white/10 md:hidden flex items-center justify-around py-2 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-500/15' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
