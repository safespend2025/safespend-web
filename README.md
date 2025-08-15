# SafeSpend Web (Auto-update + Fecha de pago)
- Añadir tarjeta ahora incluye **Día de pago (1–31)**.
- Muestra **próxima fecha de pago** y **días restantes**; resalta si faltan ≤ 5 días.
- Auto-actualización: el Service Worker actualiza y recarga la app al publicar cambios.
- Los datos siguen en `localStorage` con la clave `ss:data`.

## Actualizar en Cloudflare Pages
1) Sube/reemplaza archivos en tu repo de GitHub conectado.
2) Cloudflare Pages hace deploy.
3) Abres tu URL y la app se recarga sola mostrando la versión nueva.
