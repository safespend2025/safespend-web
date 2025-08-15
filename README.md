# SafeSpend Web (PWA)
Clon web simple de SafeSpend (tarjetas, gastos, utilización). Funciona offline y se puede instalar como app.

## Cómo desplegar en Cloudflare Pages
1) Crea un repo en GitHub y sube estos archivos (contenido de la carpeta, no la carpeta entera).
2) En Cloudflare Pages → Create a project → Connect to Git → selecciona el repo.
3) Build command: (vacío). Output directory: `/`.
4) Deploy. Abre tu URL y en iPhone: Compartir → Añadir a pantalla de inicio.

## Uso
- Añade tarjetas con nombre y límite.
- Añade gastos/pagos. Se calcula balance, restante y % de utilización por tarjeta y total.
- Historial de últimos 10 movimientos.
- Alertas cuando la utilización total supera 35%, 50%, 75%, 90% (mientras la app está abierta).
