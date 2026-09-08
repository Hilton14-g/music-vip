import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    login, 
    register, 
    loginGoogle,
    isFirebaseConfigured
  } = useAuth();

  const { setActiveTab } = usePlayer();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
        setSuccessMsg('¡Bienvenido de vuelta a Music VIP!');
      } else {
        if (!displayName.trim()) {
          setErrorMsg('Por favor ingresa tu nombre de usuario.');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, displayName);
        setSuccessMsg('¡Cuenta VIP creada con éxito!');
      }
      setTimeout(() => {
        closeAuthModal();
      }, 1200);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este correo electrónico ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('El formato del correo no es válido.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Falta activar "Correo electrónico/contraseña" en Firebase Console ➔ Authentication ➔ Método de acceso.');
      } else {
        setErrorMsg(err.message || 'Ocurrió un error al procesar la solicitud.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginGoogle();
      setSuccessMsg('¡Sesión iniciada con Google!');
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Falta activar el proveedor "Google" en Firebase Console ➔ Authentication ➔ Método de acceso.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToSettings = () => {
    closeAuthModal();
    setActiveTab('settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Luz ambiental */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-pink-500 p-0.5 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
            <div className="w-full h-full bg-[#0c0e17] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white">
            {authModalMode === 'login' ? 'Bienvenido a Music VIP' : 'Crea tu Cuenta VIP'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login' 
              ? 'Tus playlists, favoritos y canciones respaldadas en Firebase.' 
              : 'Disfruta de playlists con respaldo y sincronización en la nube.'}
          </p>
        </div>

        {/* Banner si Firebase no está configurado todavía */}
        {!isFirebaseConfigured && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>Tu proyecto de Firebase aún no está vinculado.</p>
              <button
                onClick={handleGoToSettings}
                className="mt-1.5 font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                Configurar credenciales en Ajustes
              </button>
            </div>
          </div>
        )}

        {/* Selector de pestañas Iniciar Sesión / Registrarse */}
        <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authModalMode === 'login'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authModalMode === 'register'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Alertas de error o éxito */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre o apodo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121422] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121422] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121422] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFirebaseConfigured}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {authModalMode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                {isSubmitting ? 'Iniciando sesión...' : 'Entrar a Music VIP'}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
              </>
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c0e17] px-3 text-[10px] uppercase font-bold text-slate-500 absolute">
            O continúa con
          </span>
        </div>

        {/* Botón de Google */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isSubmitting || !isFirebaseConfigured}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};
