# YOSE BARBER
Carpeta lista para Git/Vercel (sin build): `index.html` (sitio), `admin.html` (panel con login), `defaults.js`, `firebase-config.js`, `logo.svg`, `firestore.rules`, `vercel.json`.

## Firebase (proyecto yose-barberia)
1. Authentication > Sign-in method: activar Correo/contrasena. Authentication > Users: crear el/los administradores.
2. Authentication > Settings > Dominios autorizados: agregar el dominio de Vercel.
3. Firestore: crear la base de datos. En `firestore.rules` reemplazar `TU_CORREO@gmail.com` por el correo del administrador (varios: separar con coma) y pegar en Firestore > Rules > Publicar.
4. Recomendado: Authentication > Settings > User actions: desactivar "Enable create (sign-up)" para que nadie pueda registrarse.

## Probar en local (sin Firebase)
Vaciar `FIREBASE_CONFIG` en `firebase-config.js` (apiKey ""), ejecutar `iniciar-local.sh` o `.bat`. El panel funciona sin login y guarda en localStorage. Con Firebase configurado, probar siempre por http://localhost (no abrir el archivo directo).

## Notas
Panel: /admin. Fotos subidas desde el celular se guardan en el documento de Firestore (limite 1 MB; el panel avisa). Verifique el WhatsApp (12 digitos; Brasil usa 13).
