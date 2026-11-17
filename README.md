# YOSE BARBER
Todo en una sola carpeta (lista para Git/Vercel): `index.html` (sitio), `admin.html` (panel), `defaults.js` (valores por defecto), `firebase-config.js`, `logo.svg`, `firestore.rules`, `firestore.rules.temporal`, `vercel.json`.

## Probar en local (sin Firebase)
Dejar `firebase-config.js` vacio. Ejecutar `iniciar-local.sh` o `iniciar-local.bat` (requiere Python) y abrir `http://localhost:8000/admin.html`. Salvar/Publicar guardan en el navegador (localStorage).

## Publicar (Vercel + Firebase)
1. Subir esta carpeta a Git y conectarla a Vercel (sin build, raiz del repo). Panel en barbeariaadomicilio.vercel.app/admin (reescritura en vercel.json).
2. Firebase: crear proyecto, activar Firestore, copiar la config web en `firebase-config.js`.
3. Firestore > Rules: pegar `firestore.rules.temporal` (panel sin contrasena, solo mientras prueba). Para uso real: `ADMIN_OPEN=false` y `firestore.rules` (hoy el panel no incluye pantalla de login: pendiente reactivarla).

## Notas
Fotos subidas desde el celular se guardan dentro del documento de Firestore (limite 1 MB; el panel avisa). Verifique el WhatsApp (12 digitos; Brasil usa 13). Con el panel abierto, cualquiera con la URL puede editar la web.
