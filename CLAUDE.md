# CLAUDE.md

Contexto para agentes de IA que trabajen en este repositorio.

## Qué es esto

Sitio público de ASPAL: landing + blog + podcast. React 18 (Vite) sobre un
Express mínimo que hace de proxy sobre un WordPress headless.

**No hay base de datos, sesiones, autenticación ni estado de servidor.** Si una
tarea parece necesitar cualquiera de esas cosas, es señal de que hay que
confirmarla antes de implementarla, no de improvisar una capa nueva.

## La regla que más importa

**Toda la lógica de WordPress vive en `shared/wordpress/`. Punto.**

```
shared/wordpress/types.ts       WPPost (crudo) · TransformedPost (normalizado)
shared/wordpress/transform.ts   normalización
shared/wordpress/client.ts      fetch contra WordPress   [SOLO SERVIDOR]
shared/wordpress/routes.ts      registro de los endpoints /api/*
```

La montan dos consumidores que **solo hacen wiring**:

- `server/index.ts` → desarrollo y self-hosted
- `api/index.ts` → función serverless de Vercel (esto es lo que corre en producción)

Históricamente `api/index.ts` era una copia literal del código del servidor y
había que sincronizar cada cambio a mano. Divergieron. Por eso existe `shared/`.

**Nunca** añadas un endpoint, un campo o una transformación directamente en
`server/` o en `api/`: hazlo en `shared/wordpress/` y ambos lo heredan.

### Fronteras de import

| Desde                 | Puede importar                             |
| --------------------- | ------------------------------------------ |
| `client/src/**`       | `@shared/wordpress/types` — **solo tipos** |
| `server/**`, `api/**` | cualquier cosa de `shared/wordpress/`      |

`client.ts` lee `process.env` y hace fetch de red: si acaba en el bundle del
navegador, rompe. El cliente obtiene datos por `/api/*`, nunca importando ese
módulo.

No redeclares la forma de un post en un componente. Estuvo declarada cinco
veces —y en el cliente con el nombre equivocado (`WPPost` para la forma ya
transformada)—. Importa `TransformedPost`.

## Comandos

```bash
npm run dev      # Express + Vite HMR en :5000
npm run build    # cliente -> dist/public, servidor -> dist/
npm run check    # typecheck: client + server + shared + api
```

`npm run check` es la puerta de calidad antes de cualquier commit. Cubre `api/`
—no siempre fue así, y por eso el código de producción pasó tiempo sin
typecheckear.

## Entorno de desarrollo

- **Windows.** El shell por defecto es PowerShell; hay Git Bash disponible.
- **Node 20** (`.nvmrc`).
- `reusePort` está desactivado en Windows a propósito (`server/index.ts`):
  `SO_REUSEPORT` no existe ahí y `listen()` lanza `ENOTSUP`. No lo "arregles".
- **El puerto 5000 suele estar ocupado por otro proyecto de esta máquina.**
  Si ves `EADDRINUSE`, no mates el proceso: arranca en otro puerto con
  `PORT=5001 npm run dev`.

## Convenciones

- **La UI está en español.** Todo texto visible, en español. Los comentarios de
  código también.
- Rutas con `wouter` en `client/src/App.tsx`. Añadir una página = añadir su
  `<Route>` ahí.
- Datos con TanStack Query. La `queryKey` es el path del endpoint.
- Alias: `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` →
  `client/src/assets/`.
- `data-testid` en elementos interactivos y significativos. Mantenlo.
- **Los fallos de WordPress se propagan y salen como 5xx.** `client.ts` lanza y
  `routes.ts` traduce. No lo degrades a `[]`: el cliente necesita distinguir
  "no se pudo cargar" (→ reintentar) de "no hay artículos" (→ estado vacío), y
  con la política anterior ambos llegaban como el mismo array vacío. El único
  `null`/404 legítimo es `/api/posts/:slug` cuando el post de verdad no existe.

  Antes se degradaba a vacío "para que la landing renderizara aunque el blog
  no respondiera". Esa justificación era falsa: `home.tsx` no consume la API.
  Solo lo hacen `blog.tsx` y `blog-post.tsx`.

### shadcn/ui

`client/src/components/ui/` contiene **solo los componentes en uso**. Se
eliminaron 37 sin usar junto con sus dependencias. Si necesitas uno nuevo,
añádelo con el CLI de shadcn (`components.json` ya está configurado) e instala
su dependencia de Radix — no lo reintroduzcas a mano ni asumas que ya está.

## Verificar el trabajo

Un cambio no está hecho hasta que se ve funcionando:

```bash
npm run check
PORT=5001 npm run dev
curl http://localhost:5001/api/health
curl "http://localhost:5001/api/posts?per_page=2"
```

Y para cambios de UI, abrir la ruta afectada en el navegador y mirarla. Las
secciones usan animaciones de entrada de framer-motion: una captura tomada al
instante puede salir en blanco sin que nada esté roto — espera o haz scroll
antes de concluir que hay un fallo.

## Contexto que ahorra tiempo

- `client/src/assets/` pesa ~11 MB y está versionado. Los nombres con timestamp
  (`image_1764775862961.png`) son heredados; los descriptivos son los buenos.
- El proyecto nació en Replit y se migró a Vercel. Si encuentras restos de
  Replit, sobran.
- La documentación de arquitectura está en `docs/architecture.md`; la guía de
  diseño (paleta, tipografía, espaciado) en `docs/design-guidelines.md`.
