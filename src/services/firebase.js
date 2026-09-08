// Servicio oficial de Firebase para Autenticación y Cloud Firestore
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const STORAGE_FIREBASE_CONFIG_KEY = 'music_vip_firebase_config';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB9JinvDGz2yYf3zI7rVvOHn3jd1dLvoxA",
  authDomain: "play-music-7085a.firebaseapp.com",
  projectId: "play-music-7085a",
  storageBucket: "play-music-7085a.firebasestorage.app",
  messagingSenderId: "334801327448",
  appId: "1:334801327448:web:5fd1b36fda30087438412d",
  measurementId: "G-KH7EEXGCG7"
};

// 1. Obtener credenciales de Firebase (.env o LocalStorage de Ajustes)
export const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) return parsed;
    }
  } catch (e) {}

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId
  };
};

export const saveFirebaseConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
    window.location.reload();
  } catch (e) {
    console.error('Error al guardar configuración de Firebase:', e);
  }
};

export const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
};

// 2. Inicializar Firebase de forma segura
let app = null;
let auth = null;
let db = null;

try {
  const config = getFirebaseConfig();
  if (config.apiKey && config.projectId) {
    app = !getApps().length ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase no inicializado aún o credenciales pendientes:', error);
}

export { app, auth, db };

// 3. MÉTODOS DE AUTENTICACIÓN
export const registerWithEmail = async (email, password, displayName = 'Usuario VIP') => {
  if (!auth) throw new Error('Firebase no está configurado aún. Por favor ingresa tus credenciales en Ajustes.');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, {
      displayName: displayName.trim(),
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`
    });
  }
  return userCredential.user;
};

export const loginWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase no está configurado aún. Por favor ingresa tus credenciales en Ajustes.');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  if (!auth) throw new Error('Firebase no está configurado aún. Por favor ingresa tus credenciales en Ajustes.');
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

export const logoutUser = async () => {
  if (!auth) return;
  await signOut(auth);
};

// 4. MÉTODOS DE CLOUD FIRESTORE PARA PLAYLISTS & RESPALDO (PAPELERA)

/**
 * Suscribirse en tiempo real a las playlists del usuario
 */
export const subscribeToUserPlaylists = (userId, callback) => {
  if (!db || !userId) return () => {};

  try {
    const playlistsRef = collection(db, 'users', userId, 'playlists');
    return onSnapshot(playlistsRef, (snapshot) => {
      const playlists = [];
      snapshot.forEach((docSnap) => {
        playlists.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(playlists);
    }, (err) => {
      console.warn('Error escuchando playlists en Firestore:', err);
    });
  } catch (err) {
    console.error('Error al suscribir playlists:', err);
    return () => {};
  }
};

// Sanitizar cualquier objeto o array para eliminar campos 'undefined' antes de Firestore
export const sanitizeForFirestore = (data) => {
  if (data === undefined) return null;
  if (data === null) return null;
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
};

/**
 * Guardar o actualizar una playlist en Firestore
 */
export const savePlaylistToFirestore = async (userId, playlist) => {
  if (!db || !userId || !playlist?.id) return;
  try {
    const docRef = doc(db, 'users', userId, 'playlists', playlist.id);
    const sanitized = sanitizeForFirestore({
      ...playlist,
      isDeleted: playlist.isDeleted ?? false,
      deletedAt: playlist.deletedAt ?? null,
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    console.error('Error guardando playlist en Firestore:', err);
  }
};

/**
 * Enviar playlist a la papelera (Soft Delete) - ¡Queda guardada y respaldada!
 */
export const softDeletePlaylistInFirestore = async (userId, playlistId) => {
  if (!db || !userId || !playlistId) return;
  try {
    const docRef = doc(db, 'users', userId, 'playlists', playlistId);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error enviando playlist a la papelera en Firestore:', err);
  }
};

/**
 * Restaurar playlist desde la papelera
 */
export const restorePlaylistInFirestore = async (userId, playlistId) => {
  if (!db || !userId || !playlistId) return;
  try {
    const docRef = doc(db, 'users', userId, 'playlists', playlistId);
    await setDoc(docRef, {
      isDeleted: false,
      deletedAt: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error restaurando playlist en Firestore:', err);
  }
};

/**
 * Borrado definitivo permanente de Firestore
 */
export const permanentlyDeletePlaylistInFirestore = async (userId, playlistId) => {
  if (!db || !userId || !playlistId) return;
  try {
    const docRef = doc(db, 'users', userId, 'playlists', playlistId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error eliminando permanentemente playlist en Firestore:', err);
  }
};

/**
 * Guardar favoritos del usuario en Firestore
 */
export const saveFavoritesToFirestore = async (userId, favorites) => {
  if (!db || !userId) return;
  try {
    const docRef = doc(db, 'users', userId, 'userData', 'favorites');
    const sanitizedItems = sanitizeForFirestore(favorites || []);
    await setDoc(docRef, { items: sanitizedItems, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Error guardando favoritos en Firestore:', err);
  }
};

/**
 * Obtener favoritos del usuario desde Firestore
 */
export const getFavoritesFromFirestore = async (userId) => {
  if (!db || !userId) return null;
  try {
    const docRef = doc(db, 'users', userId, 'userData', 'favorites');
    const snap = await getDoc(docRef);
    if (snap.exists() && Array.isArray(snap.data()?.items)) {
      return snap.data().items;
    }
  } catch (err) {
    console.error('Error cargando favoritos de Firestore:', err);
  }
  return null;
};
