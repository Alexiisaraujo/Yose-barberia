# YOSE BARBER (v2)
Estructura: `public/` (index.html, defaults.js, firebase-config.js, admin/index.html), `firestore.rules`, `vercel.json`.

## Puesta en marcha (Firebase + Vercel)
1. console.firebase.google.com: crear proyecto. Activar Authentication > Email/Password. Crear Firestore.
2. Project settings > Your apps > Web: copiar la config en `public/firebase-config.js`.
3. Authentication > Users: crear su usuario administrador (la contraseña solo existe en Firebase).
4. Firestore: crear coleccion `admins`, documento con ID = UID de ese usuario (campo cualquiera).
5. Firestore > Rules: pegar `firestore.rules` y publicar.
6. Subir la carpeta a Vercel (Output Directory: `public`). Panel en `/admin`.

## Uso
Admin: tema, fuentes, orden/visibilidad de secciones, textos, servicios, precios, WhatsApp, galeria, regiones, opiniones. "Salvar" guarda borrador; "Publicar" lo envia al sitio; "Restaurar" vuelve a la version publicada.

## Pendiente / no incluido
Subida de fotos (hoy por URL; falta Firebase Storage), recortar imagenes, duplicar secciones, roles multiples. NO probado con un proyecto Firebase real. Verifique el WhatsApp (12 digitos, Brasil usa 13).

## Modo sin contraseña (temporal)
`ADMIN_OPEN=true` en `public/firebase-config.js` abre /admin sin login. En Firestore > Rules pegar `firestore.rules.temporal` (omitir pasos 3 y 4). Antes de uso real: `ADMIN_OPEN=false` y reglas de `firestore.rules`.
Logo: `public/assets/logo.svg` (reemplazable desde el admin con otra URL).

## Probar en local (sin Firebase, sin login)
Dejar `firebase-config.js` vacio y `ADMIN_OPEN=true`. Ejecutar `iniciar-local.sh` (Mac/Linux) o `iniciar-local.bat` (Windows; requiere Python). Abrir http://localhost:8000/admin/ . Salvar/Publicar guardan en el navegador (localStorage) y http://localhost:8000 muestra lo publicado. Solo para pruebas: no es la web real.
