# YOSE BARBER — Landing page + panel de administración

Barbería masculina a domicilio en Curitiba. HTML5 + CSS3 + JavaScript puro, sin dependencias ni compilación.

## Archivos

| Archivo | Función |
| --- | --- |
| `index.html` | La web pública |
| `style.css` | Diseño (mobile-first) |
| `script.js` | Lógica de la web y motor de configuración (valores por defecto) |
| `site-config.js` | **Configuración publicada** (número de WhatsApp, textos, colores, orden…). Lo genera el panel |
| `admin.html`, `admin.css`, `admin.js` | Panel de administración |

## Cómo se usa el panel

1. Abre `admin.html` en el navegador (con `index.html` en la misma carpeta). Muestra la web a la derecha, en vivo, con selector Escritorio / Tablet / Móvil.
2. Edita lo que necesites. Cada cambio se ve al instante en la vista previa y se guarda como borrador en ese navegador.
3. Pulsa **Descargar site-config.js** y reemplaza el archivo del mismo nombre en el hosting, junto a `index.html`.
4. Recarga la web con Ctrl+F5.

Los cambios del panel no modifican la web publicada hasta que subas el archivo. Por eso el panel no necesita contraseña: nadie puede alterar el sitio desde él. Si prefieres que `admin.html` no esté en el sitio público, no lo subas al hosting y úsalo solo en tu computadora.

## Qué controla el panel

- **Contacto:** número de WhatsApp (único para todos los botones), Instagram y los 5 mensajes automáticos.
- **Secciones:** orden (subir/bajar), mostrar/ocultar secciones completas y elementos sueltos (servicios, fotos de la galería, bloques “Por qué elegir”, beneficios del hero). El menú se reordena solo.
- **Textos:** todos los textos visibles, incluidos los precios de las tarjetas (hoy “Consulte o valor”).
- **Imágenes:** enlace, ruta del hosting (`img/foto.jpg`) o archivo subido, más texto alternativo.
- **Tema:** colores individuales, 5 temas listos (dorado, plata, cobre, champán, claro) y radio de bordes.
- **Tipografía:** fuente de títulos y de textos (Google Fonts), tamaño general y de títulos.
- **Diseño:** foto del hero y de “Sobre” a izquierda o derecha, espacio entre secciones, ancho del contenido, botón del encabezado y barra fija móvil.
- **Reseñas y barrios:** solo datos reales. Vacío = la web muestra el mensaje elegante / invita a consultar por WhatsApp.
- **SEO:** título y descripción.

## Notas

- Si `site-config.js` falta o está vacío, la web usa los valores por defecto de `script.js`.
- Las imágenes subidas desde el panel se incrustan dentro de `site-config.js` (pesado). Lo más liviano es subir las fotos al hosting y usar su ruta.
- Las fotos actuales son de referencia (Unsplash, licencia de uso comercial). Si alguna no carga, se muestra una imagen alternativa.
- El mapa de “Onde atendemos” es una referencia general de Curitiba, no una dirección del negocio.
- No se inventaron precios, reseñas, años de experiencia, certificaciones, dirección ni barrios.
- Tras publicar con dominio propio, agrega en `<head>`: `<link rel="canonical" href="https://SEU-DOMINIO.com.br/">`.
