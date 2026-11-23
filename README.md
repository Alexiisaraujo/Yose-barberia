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

## Produtos recomendados
Painel > aba "Produtos": formulário com nome, foto (URL da imagem, com prévia), descrição, preço opcional, link de compra/afiliado, tipo (Amazon, Mercado Livre, Loja própria, WhatsApp, Outro) e estado (Publicado/Oculto). "SALVAR PRODUTO" grava e publica na hora na seção "Produtos recomendados" (só o bloco `amazon` do documento `site/config`; o resto do site não é publicado junto). Editar, ocultar/publicar, reordenar e eliminar também publicam na hora. A foto e o link de compra são campos separados: o campo da foto recusa links de lojas (Amazon, Mercado Livre, WhatsApp) e testa se a imagem carrega. Os links de compra aceitam qualquer site http(s) e abrem em nova aba com `noopener noreferrer`. As regras do Firestore não mudam.
