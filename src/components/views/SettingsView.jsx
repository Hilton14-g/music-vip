import React, { useState } from 'react';
import { 
  Settings, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Key, 
  Radio, 
  Download, 
  Volume2, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { getFirebaseConfig, saveFirebaseConfig, isFirebaseConfigured } from '../../services/firebase';

export const SettingsView = () => {
  const { settings, setSettings } = usePlayer();
  const [apiKeyInput, setApiKeyInput] = useState(settings.youtubeApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [firebaseInput, setFirebaseInput] = useState(getFirebaseConfig());
  const [firebaseSaved, setFirebaseSaved] = useState(false);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setSettings(prev => ({ ...prev, youtubeApiKey: apiKeyInput.trim() }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    saveFirebaseConfig(firebaseInput);
    setFirebaseSaved(true);
    setTimeout(() => setFirebaseSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-cyan-400" />
          Ajustes & Experiencia VIP
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Configura la aplicación, instala en tu móvil y conoce cómo disfrutar música continua sin bloqueos.
        </p>
      </div>

      {/* SECCIÓN 1: CÓMO FUNCIONA LA REPRODUCCIÓN SIN BLOQUEOS */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-3 text-cyan-400">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="text-lg font-bold text-white">
            ¿Por qué Music VIP reproduce sin cortes ni bloqueos?
          </h3>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          En YouTube tradicional, si cambias de pestaña o bloqueas la pantalla de tu teléfono, el video se pausa inmediatamente. En <strong>Music VIP</strong> hemos implementado 3 tecnologías clave para evitarlo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block">1. Núcleo Persistente</span>
            <p className="text-xs text-slate-400">
              El motor de audio vive en la capa raíz de la aplicación. Puedes navegar por cualquier sección sin reiniciar la reproducción.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block">2. MediaSession API</span>
            <p className="text-xs text-slate-400">
              Control nativo con carátula y botones en la <strong>pantalla de bloqueo</strong> de Android, iOS y teclas de PC.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block">3. Audio Keepalive</span>
            <p className="text-xs text-slate-400">
              Evita que navegadores móviles congelen la pestaña cuando minimizas el navegador o apagas la pantalla.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: INSTALAR EN TU TELÉFONO O COMPUTADORA (PWA) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 text-cyan-400">
          <Download className="w-6 h-6" />
          <h3 className="text-lg font-bold text-white">
            Instalar como App Nativa (Android / iPhone / PC)
          </h3>
        </div>

        <p className="text-xs md:text-sm text-slate-300">
          Music VIP es una <strong>Progressive Web App (PWA)</strong>. No necesitas descargarla desde la Play Store o App Store. Puedes instalarla directamente en tu pantalla de inicio:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Móvil */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3.5">
            <Smartphone className="w-8 h-8 text-pink-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">En Teléfonos (Android / iPhone)</h4>
              <ul className="text-xs text-slate-400 mt-1.5 space-y-1 list-disc list-inside">
                <li><strong>Android (Chrome):</strong> Toca los 3 puntos (⋮) y selecciona <em>"Instalar aplicación"</em>.</li>
                <li><strong>iPhone (Safari):</strong> Toca el botón <em>Compartir</em> y elige <em>"Añadir a pantalla de inicio"</em>.</li>
              </ul>
            </div>
          </div>

          {/* PC */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3.5">
            <Monitor className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">En PC (Windows / Mac)</h4>
              <ul className="text-xs text-slate-400 mt-1.5 space-y-1 list-disc list-inside">
                <li>En Chrome o Edge, haz clic en el icono de <strong>Instalar</strong> en el extremo derecho de la barra de direcciones.</li>
                <li>Se abrirá en su propia ventana sin marcos de navegador.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: API KEY DE YOUTUBE (OPCIONAL) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <Key className="w-6 h-6" />
          <h3 className="text-lg font-bold text-white">
            Clave de YouTube Data API v3 (Opcional)
          </h3>
        </div>

        <p className="text-xs md:text-sm text-slate-300">
          La app funciona 100% de forma autónoma con el catálogo y búsqueda inteligente. Si deseas búsquedas en vivo personalizadas ilimitadas con tu propia cuota de Google Cloud, puedes pegar tu clave API aquí:
        </p>

        <form onSubmit={handleSaveApiKey} className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 bg-[#121422] border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all flex-shrink-0"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                ¡Guardada!
              </>
            ) : (
              'Guardar Clave'
            )}
          </button>
        </form>
      </div>

      {/* SECCIÓN 4: BASE DE DATOS Y USUARIOS (FIREBASE) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">
              Base de Datos en la Nube & Usuarios (Firebase)
            </h3>
          </div>
          {isFirebaseConfigured() ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Conectado
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
              Pendiente
            </span>
          )}
        </div>

        <p className="text-xs md:text-sm text-slate-300">
          Vincular tu proyecto de Firebase permite que cada usuario inicie sesión con su cuenta y mantenga sus playlists respaldadas en la nube con papelera de recuperación.
        </p>

        <form onSubmit={handleSaveFirebase} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Project ID (ID de Proyecto)
              </label>
              <input
                type="text"
                value={firebaseInput.projectId}
                onChange={(e) => setFirebaseInput({ ...firebaseInput, projectId: e.target.value })}
                placeholder="mi-proyecto-music"
                className="w-full bg-[#121422] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                API Key de Firebase
              </label>
              <input
                type="text"
                value={firebaseInput.apiKey}
                onChange={(e) => setFirebaseInput({ ...firebaseInput, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-[#121422] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={firebaseInput.authDomain}
                onChange={(e) => setFirebaseInput({ ...firebaseInput, authDomain: e.target.value })}
                placeholder="mi-proyecto.firebaseapp.com"
                className="w-full bg-[#121422] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                App ID
              </label>
              <input
                type="text"
                value={firebaseInput.appId}
                onChange={(e) => setFirebaseInput({ ...firebaseInput, appId: e.target.value })}
                placeholder="1:123456789:web:abcdef"
                className="w-full bg-[#121422] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              * Las credenciales se guardan de forma segura en tu navegador.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
            >
              {firebaseSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  ¡Firebase Guardado!
                </>
              ) : (
                'Guardar Configuración Firebase'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* INFORMACIÓN DE LA APLICACIÓN */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div>
          <span className="font-bold text-white">Music VIP Player</span> • Versión 1.0.0 Pro
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Calidad Ultra HD
        </div>
      </div>
    </div>
  );
};
