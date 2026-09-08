# 🎵 Music VIP — Web & Mobile Audio Streaming App

Reproductor web y móvil premium para streaming de música con 0% videos visibles, 0% publicidad invasiva y 0% shorts/reels menores a 60 segundos. Integrado con la API de YouTube Music y sincronización en la nube con Firebase.

---

## ✨ Características Principales

- **🎧 Audio Puro (Cero Video en Pantalla):** Interfaz enfocada al 100% en la música con disco de vinilo rotatorio, visualizador de frecuencias de audio y carátulas HD.
- **🚫 Filtro Anti-Shorts:** Descarte automático de clips y reels menores a 60 segundos para reproducir únicamente canciones completas de estudio.
- **☁️ Firebase Cloud Sync:** Registro e inicio de sesión con Correo/Contraseña o Google. Sincronización instantánea de playlists y favoritos en Cloud Firestore.
- **🛡️ Modo Híbrido Aislado:** Modo invitado con almacenamiento local independiente y modo usuario con respaldo en la nube.
- **🗑️ Papelera y Respaldo Inteligente:** Las playlists eliminadas van a la papelera donde pueden ser restauradas en cualquier momento con todas sus canciones.
- **🎛️ Ecualizador VIP:** Presets (Bass Boost, Pop, Rock, Jazz, etc.) para ajustar la experiencia sonora.
- **⏱️ Temporizador de Apagado (Sleep Timer):** Apagado automático en 15, 30, 45 o 60 minutos.
- **📱 PWA Nativa (Instalable):** Se puede instalar directamente en Android (Chrome), iOS (Safari) o PC (Chrome/Edge).

---

## 🚀 Puesta en Marcha Local

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Hilton14-g/music-vip.git
cd music-vip
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Variables de entorno (Opcional):**
Copia el archivo `.env.example` a `.env` y coloca tus credenciales de Firebase / YouTube:
```bash
cp .env.example .env
```

4. **Ejecutar servidor de desarrollo:**
```bash
npm run dev
```
Abre en tu navegador: `http://localhost:5173/`

---

## 🌐 Despliegue en Vercel

Este proyecto está 100% preconfigurado para Vercel:
1. Conecta tu repositorio de GitHub en [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. (Opcional) Agrega las variables de entorno en el panel de Vercel.
4. Pulsa **Deploy**.
5. **Importante:** En la consola de Firebase, agrega tu dominio de Vercel (ejemplo: `music-vip.vercel.app`) a **Authentication > Settings > Authorized Domains**.

---

## 📄 Licencia
Distribuido bajo la licencia MIT.
