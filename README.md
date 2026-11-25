# Yose Barber

Sitio web y panel administrativo de Yose Barber. Los archivos principales permanecen en la raíz para facilitar el despliegue en GitHub/Vercel.

## Archivos

- `index.html`, `index.css`, `index.js`: sitio público.
- `admin.html`, `admin.css`, `admin.js`: panel de administración.
- `defaults.js`: contenido y configuración inicial (incluye módulos opcionales apagados).
- `firebase-config.js`: configuración pública del proyecto Firebase.
- `firestore.rules`: reglas de seguridad para publicar contenido, visitas, reservas y conversiones.
- `logo.svg`: identidad visual.

## Módulos de crecimiento opcionales

En el panel, pestaña **Crecimiento**, puedes activar o desactivar cada módulo de forma independiente. Todos comienzan desactivados:

1. **Reservas online**: formulario de solicitud de fecha, horario, servicio y ubicación. Las solicitudes se guardan en Firestore.
2. **Planes VIP**: publica los planes que estén marcados como activos.
3. **CRM**: permite consultar las solicitudes recibidas y cambiar su estado (nuevo, contactado, agendado, concluido o cancelado).
4. **Testimonios**: controla la publicación de las reseñas cargadas en Contacto.
5. **Conversiones**: registra clics de interés en WhatsApp y planes VIP, siempre con consentimiento de analítica.
6. **Analítica de visitas**: registra fecha, dispositivo, página y ubicación aproximada (ciudad/región/país) después del consentimiento. No se almacena la dirección IP.

Para activar cambios: selecciona los módulos en **Crecimiento**, pulsa **Guardar alterações** y después **Publicar alterações**. La vista previa no sustituye la publicación.

## Configuración obligatoria de Firebase

1. Comprueba que `firebase-config.js` tenga la configuración correcta del proyecto.
2. En Firebase Authentication, habilita Email/Password y crea el usuario administrador.
3. En Firestore, crea manualmente `admins/{UID}` para el UID de ese usuario. El documento puede estar vacío. Las reglas impiden crear o consultar estos documentos desde el cliente.
4. Publica el contenido de `firestore.rules` en Firestore Rules.
5. Habilita Firestore y verifica que el dominio de producción esté autorizado en Firebase Authentication.

Las nuevas colecciones son `leads` (solicitudes), `conversions` (clics) y `visits` (visitas). Las reglas permiten crear solicitudes y eventos mínimos desde el sitio público, pero solo administradores pueden consultarlos. Solo administradores pueden cambiar el estado de una solicitud.

## Privacidad y operación

- La geolocalización de visitas se estima mediante el proveedor IPAPI y puede no estar disponible o ser imprecisa.
- El visitante puede aceptar o rechazar la analítica opcional. El rechazo evita tanto el registro de visitas como los eventos de conversión.
- No solicites datos sensibles en el formulario público.
- Antes de operar reservas online, revisa las solicitudes y confirma manualmente disponibilidad con el cliente.

## Despliegue

Mantén todos los archivos en la raíz del repositorio. Para Vercel se conserva `vercel.json`, que redirige `/admin` a `admin.html`.
