# SafeSpend Web (Auto-update)
- Service Worker se actualiza solo en cada deploy (cache-busting).
- Activa inmediatamente la nueva versión y recarga la app.
- Datos en localStorage (`ss:data`) se conservan.

## Deploy/Actualizar
1. Sube/actualiza archivos en tu repo de GitHub.
2. Cloudflare Pages publica automáticamente.
3. Al abrir la app, verás "Actualizando…" y luego se recargará sola.
