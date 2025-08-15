# SafeSpend Web (Auto-update + Fecha de pago + Colores + Orden)
- Añadir tarjeta: **Nombre, Límite, Día de pago (1–31)**.
- Tarjetas **ordenadas** por fecha próxima de pago (las urgentes arriba).
- **Colores por urgencia**: verde (>15 días), amarillo (6–15), rojo (≤5) y marcado si está **atrasada**.
- Barra de utilización por tarjeta + totales arriba.
- Auto-actualización del Service Worker: la app detecta y recarga sola al publicar cambios.

## Actualizar en Cloudflare Pages
1) Sube los archivos a tu repo (reemplaza existentes) y haz Commit.
2) Cloudflare Pages hace deploy.
3) Abre tu URL: verás “Actualizando…” y se recarga sola. Los datos permanecen en `localStorage`.
