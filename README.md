# ASPAL — Asociaciones Profesionales

Sitio público de ASPAL: landing institucional, blog y podcast. El contenido
editorial no vive aquí — se sirve en tiempo real desde un WordPress headless.

- **Repositorio:** <https://github.com/Antonio1491/aspal_project>
- **Sitio institucional:** <https://asociacionesprofesionales.org>
- **Fuente de contenido:** <https://comunidad.asociacionesprofesionales.org>

---

## Qué es

Una SPA de React que presenta la propuesta de ASPAL a asociaciones y
organizaciones sin ánimo de lucro: gestión de membresías, comunidad en línea,
certificaciones, marketing y bolsa de trabajo.

Detrás hay un servidor Express mínimo cuya única responsabilidad es hacer de
proxy sobre la REST API de WordPress y normalizar la respuesta antes de que
llegue al cliente. **No hay base de datos, ni sesiones, ni autenticación**: el
sitio es público, de solo lectura y sin estado.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 18 · TypeScript · Vite |
| Estilos | Tailwind CSS · shadcn/ui (New York) · Montserrat |
| Rutas | wouter |
| Datos | TanStack Query |
| Animación | framer-motion |
| Backend | Express (dev y self-hosted) · función serverless en Vercel |
| Contenido | WordPress REST API (headless) |

## Arranque rápido

Requiere **Node 20** (ver `.nvmrc`).

```bash
git clone https://github.com/Antonio1491/aspal_project.git
cd aspal_project
npm install
cp .env.example .env      # opcional: todos los valores tienen default
npm run dev
```

Abre <http://localhost:5000>.

> **Si el puerto 5000 está ocupado**, arranca en otro:
> `PORT=5001 npm run dev`

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Express + Vite con HMR |
| `npm run build` | Cliente a `dist/public/`, servidor a `dist/` |
| `npm run start` | Sirve el build de producción |
| `npm run check` | Typecheck de `client/`, `server/`, `shared/` y `api/` |

## Estructura

```
shared/wordpress/     ⚠️ fuente única: tipos, transformación y endpoints
server/               Express para desarrollo y self-hosted
api/index.ts          función serverless de Vercel (solo wiring)
client/src/
  components/
    layout/           Header, Footer, ScrollToTop
    sections/         bloques de la landing
    content/          BlogCard, PodcastCard
    ui/               primitivas shadcn/ui en uso
  pages/              home · blog · blog/:slug · podcast · 404
docs/                 arquitectura y guía de diseño
```

**La regla que no se rompe:** toda la lógica de WordPress —tipos, normalización
y rutas `/api/*`— vive **solo** en `shared/wordpress/`. El servidor Express y la
función de Vercel la montan; ninguno de los dos la reimplementa. Antes sí lo
hacían y acabaron divergiendo.

## API

Todos los endpoints son públicos, de solo lectura y sin parámetros de auth.

| Endpoint | Descripción |
|---|---|
| `GET /api/posts?per_page=N` | Últimos posts (por defecto 6) |
| `GET /api/posts/:slug` | Post individual · `404` si no existe |
| `GET /api/podcasts?per_page=N` | Episodios de la categoría `podcast` |
| `GET /api/health` | Sonda de estado |

Los posts se devuelven ya normalizados (`TransformedPost`): el HTML se limpia
para el extracto y la imagen destacada cae al primer `<img>` del contenido
cuando WordPress no trae `wp:featuredmedia`.

Ante un fallo de WordPress los endpoints devuelven lista vacía en vez de
error: la landing debe renderizar aunque el blog esté caído.

## Variables de entorno

Ninguna es obligatoria — la API de WordPress es pública.

| Variable | Default | Para qué |
|---|---|---|
| `PORT` | `5000` | Puerto del servidor Express |
| `WP_API_BASE` | `https://comunidad.asociacionesprofesionales.org/wp-json/wp/v2` | Origen del contenido |
| `NODE_ENV` | — | `development` activa Vite/HMR; si no, sirve `dist/` |

## Despliegue

Vercel, configurado en `vercel.json`:

- El cliente se construye a `dist/public/` y se sirve como estático.
- `api/index.ts` se despliega como función serverless para `/api/*`.
- El resto de rutas cae al `index.html` (SPA fallback).

Ramas: `main` → producción · `staging` → preview.

## Contribuir

1. Rama desde `staging`.
2. `npm run check` tiene que pasar antes de abrir PR — cubre también `api/`.
3. Si tocas los endpoints, tócalos en `shared/wordpress/`, nunca en los dos
   consumidores por separado.

Más contexto en [`docs/architecture.md`](docs/architecture.md) y
[`docs/design-guidelines.md`](docs/design-guidelines.md). Si trabajas con
agentes de IA, [`CLAUDE.md`](CLAUDE.md) es el contrato que deben seguir.

## Licencia

MIT — ver [LICENSE](LICENSE).
