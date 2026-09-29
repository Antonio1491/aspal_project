# Arquitectura

Documento de referencia técnica. Para arrancar el proyecto ve al
[README](../README.md); para las reglas que deben seguir los agentes de IA, a
[CLAUDE.md](../CLAUDE.md).

## Panorama

Landing institucional de ASPAL con blog y podcast. React 18 + TypeScript sobre
Vite, servido por un Express mínimo cuya única función es hacer de proxy sobre
la REST API de un WordPress headless y normalizar la respuesta.

Sin base de datos. Sin sesiones. Sin autenticación. El sitio es público,
de solo lectura y sin estado.

## Frontend

**Rutas** (`wouter`, definidas en `client/src/App.tsx`):

| Ruta          | Página                                        |
| ------------- | --------------------------------------------- |
| `/`           | Landing                                       |
| `/blog`       | Listado de artículos con filtro por categoría |
| `/blog/:slug` | Artículo individual                           |
| `/podcast`    | Listado de episodios                          |
| `*`           | 404                                           |

**Estado:** TanStack Query para estado de servidor; hooks de React para estado
local. Hooks propios en `client/src/hooks/` (`use-mobile`, `use-toast`).

**Estilos:** Tailwind CSS como base, shadcn/ui (variante New York) para las
primitivas accesibles, tipografía Montserrat. La paleta institucional
morado/amarillo y el resto de decisiones visuales están en
[design-guidelines.md](design-guidelines.md).

**Organización de componentes:**

```
components/
  layout/     Header, Footer, ScrollToTop
  sections/   HeroSection, FeaturesGrid, FeatureCard, ProblemSection,
              TestimonialsSection, TestimonialCard, CTASection,
              LogoCarousel, CommunityGraphics, AnimatedSection
  content/    BlogCard, PodcastCard
  ui/         primitivas shadcn/ui — solo las que se usan
```

Las secciones entran con animaciones de framer-motion al hacer scroll.
Los elementos interactivos y significativos llevan `data-testid`.

## Backend

Express con TypeScript. Dos despliegues del mismo código:

| Entorno                  | Entrada           | Rol                                |
| ------------------------ | ----------------- | ---------------------------------- |
| Desarrollo / self-hosted | `server/index.ts` | Express + middleware de Vite (HMR) |
| Producción (Vercel)      | `api/index.ts`    | Función serverless para `/api/*`   |

**Ambos son solo wiring.** La lógica está en `shared/wordpress/`:

```
types.ts       WPPost (crudo de WordPress) · TransformedPost (normalizado)
transform.ts   limpieza de HTML, extracción de imagen, normalización
client.ts      fetch contra WordPress            [SOLO SERVIDOR]
routes.ts      registro de los endpoints /api/*
```

Esta separación existe por una razón concreta: `api/index.ts` fue durante un
tiempo una copia literal de la lógica del servidor, con la instrucción de
sincronizar cada cambio a mano. No se sostuvo — `/api/health` llegó a existir
solo en Vercel. Ahora un endpoint nuevo en `shared/wordpress/routes.ts` aparece
en los dos entornos a la vez.

`client.ts` lee `process.env` y no debe llegar nunca al bundle del navegador.
El cliente solo importa tipos desde `shared/`.

**Modo desarrollo vs producción** (`server/index.ts`): con
`NODE_ENV=development` se monta el middleware de Vite; si no, se sirven los
estáticos de `dist/public/`. En ambos casos el mismo proceso sirve API y
cliente en un único puerto.

## Datos

No hay persistencia. Todo el contenido se pide a WordPress en cada request:

`https://comunidad.asociacionesprofesionales.org/wp-json/wp/v2`
(configurable con `WP_API_BASE`)

| Endpoint                       | Origen                                              |
| ------------------------------ | --------------------------------------------------- |
| `GET /api/posts?per_page=N`    | `/posts?_embed`                                     |
| `GET /api/posts/:slug`         | `/posts?_embed&slug=…` · `404` si no hay resultados |
| `GET /api/podcasts?per_page=N` | `/posts` filtrado por la categoría `podcast`        |
| `GET /api/health`              | —                                                   |

**Normalización** (`transformPost`): se limpia el HTML para título y extracto
(truncado a 200 caracteres), el contenido se conserva como HTML crudo para
renderizar, y la imagen destacada cae al primer `<img>` del contenido cuando
WordPress no devuelve `wp:featuredmedia`. Autor por defecto: `ASPAL`.
Categoría por defecto: `General`.

Los podcasts no son un tipo de contenido propio: son posts de la categoría
`podcast`, cuyo id hay que resolver por slug antes de poder filtrar. Eso
implica **dos** llamadas a WordPress por petición de podcasts.

**Errores:** los fallos de WordPress se propagan y salen como 5xx: `client.ts`
lanza y `routes.ts` traduce. El cliente distingue así «no se pudo cargar» de
«no hay artículos». El único `null`/404 legítimo es `/api/posts/:slug` cuando el
post no existe.

No se requieren credenciales — la API de WordPress es pública.

## Despliegue

Vercel, según `vercel.json`:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist/public`
- `/api/(.*)` → la función serverless
- `/(.*)` → `index.html` (fallback de SPA)

Ramas: `main` → producción · `staging` → preview.

## Dependencias externas

**UI:** primitivas de Radix (avatar, collapsible, navigation-menu, slot, toast,
tooltip), Lucide para iconos, class-variance-authority para variantes,
framer-motion para animación.

**Utilidades:** date-fns con locale español para fechas, clsx y tailwind-merge
para composición de clases.

**Servicios referenciados desde la UI:** redes sociales, YouTube para el vídeo
de portada, y el sistema de registro externo en asociacionesprofesionales.org.

**Assets:** en `client/src/assets/` (~11 MB versionados) — logotipos ASPAL para
fondo claro y oscuro, logos de aliados (ANPR México, Expo Mascotas, World Urban
Parks) e ilustraciones de producto.

## Historia

El proyecto nació en Replit y se migró a Vercel. Se han eliminado el andamiaje
de Replit, 37 componentes de shadcn/ui sin usar y las 36 dependencias que
arrastraban.
