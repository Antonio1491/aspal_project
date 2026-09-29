---
title: PR B de la Etapa 1 — SEO por ruta, prerender y 404 real
type: feat
status: active
date: 2026-09-29
spec: docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
parent: docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md
---

# PR B — SEO por ruta, prerender y 404 real: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada ruta pública se entregue como HTML legible sin JavaScript, con su propio título, descripción, canonical y Open Graph; que exista `sitemap.xml` y `robots.txt`; y que una dirección inexistente responda **código 404** con una página que ayude a la persona a llegar a donde quería ir.

**Architecture:** Los metadatos de cada ruta viven en `client/src/lib/seo.ts`, indexados por el mismo tipo `RutaEstatica` de `rutas.ts`, así que una ruta sin SEO no compila. Después del build del cliente, un segundo build de Vite (`--ssr`) empaqueta `client/src/entry-server.tsx`, y `scripts/prerender.mjs` renderiza cada ruta con `renderToString` + `<Router ssrPath>` de wouter sobre la plantilla `dist/public/index.html`. Escribe `index.html`, `<ruta>.html`, `404.html`, `spa.html` (el shell vacío que sirven las rutas dinámicas), `sitemap.xml` y `robots.txt`. Vercel (`cleanUrls` y sin rewrite comodín) y Express en producción (`server/static.ts`) sirven esos archivos con las mismas reglas. El cliente sigue arrancando con `createRoot`, sin hidratación. El HTML prerenderizado sirve a buscadores y a quien no ejecuta JavaScript, y React lo sustituye al cargar.

**Tech Stack:** React 18 (`react-dom/server`), wouter 3.3.5 (`ssrPath`), Vite 5 (build `--ssr`), Express 4, Vitest 3 (entorno `node`), Vercel (`cleanUrls`, `rewrites`).

**Spec:** `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md` (RF-10, RF-11, RF-14 y §8 «Animaciones y prerender»). Plan padre: `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md` (inventario, correcciones y convenciones del PR A).

**Viabilidad comprobada (29 sep 2026):** un build `vite build --ssr src/entry-server.tsx --outDir ../dist/ssr --emptyOutDir` (rutas relativas a `client/`) renderiza `/`, `/blog`, `/podcast`, `/plataforma` y `/404` sin errores. Cada ruta sale con su H1, y las URLs de las imágenes coinciden con los hashes del build del cliente. Así que el plan B del origen (prerenderizar solo el `<head>`) no hace falta.

## Global Constraints

- `CLAUDE.md` manda sobre este plan. Toda la UI y los comentarios, en español. Los identificadores también, como en el resto del repo.
- **Solo commits locales, nunca `git push`.** Rama de trabajo: `etapa1/b-seo-prerender`, creada desde `feat/etapa-1-institucional` antes del Task 1; vuelve a ella en el Task 7.
- Las puertas antes de cada commit son `npm run check`, `npm run lint` (0 errores), `npm run format:check` y `npm test`. Al cerrar el PR se añaden `npm run build` y la revisión en el navegador a 375, 768, 1024 y 1440 px.
- Puerto: el 5000 suele estar ocupado. Usa `PORT=5001 npm run dev` (Git Bash) o `$env:PORT=5001; npm run dev` (PowerShell). Para el servidor de producción local usa el 5002.
- Dominio canónico: **`https://www.asociacionesprofesionales.org`**. El apex responde 307 hacia `www`; comprobado con `curl -I` el 29 sep 2026.
- No se inventa copy institucional. Las descripciones SEO reutilizan textos que ya están en el sitio (`index.html`, `blog.tsx` y `podcast.tsx`).
- En código nuevo no se anima la opacidad del contenido: el HTML prerenderizado dejaría texto invisible.
- `client/src/**` solo importa **tipos** de `@shared/wordpress/`. El servidor puede importar módulos puros de `client/src/lib/` con ruta relativa.
- `data-testid` en todo elemento interactivo o significativo. Objetivos táctiles de 44 px como mínimo (`min-h-11`).

## Review Focus

1. **Dirección con mayúsculas, barra final o plural** (`/Blog`, `/blog/`, `/blogs`, `/podcasts/`). La barra final redirige con 308 a la ruta sin barra (Task 6, `static.test.ts`, y `trailingSlash: false` en Vercel). El resto de casos llega al 404, que propone la ruta correcta (Task 3, `sugerencias.test.ts`).
2. **Buscador o lector sin JavaScript.** Cada ruta estática debe entregar su H1 y sus metadatos propios en el HTML. Task 5: el prerender aborta el build si falta un `<h1>` o un `<title>` propio.
3. **Recargar un artículo `/blog/:slug` en producción.** No puede dar 404: se sirve el shell (`spa.html`) y el cliente carga el artículo. Lo cubre el Task 6 (`static.test.ts` y `vercel.test.ts`).
4. **Comillas, `&` o `<` en títulos y descripciones.** Deben quedar escapados en los atributos y en el JSON-LD, sin romper el `<head>` ni permitir cerrar el `<script>`. Task 1 (`seo.test.ts`).
5. **El `404.html` prerenderizado se genera una sola vez para todas las rutas.** No puede mostrar una dirección concreta («/404») a quien no ejecuta JavaScript. Task 4 (la ruta solo se pinta en el navegador) y Task 5 (el prerender aborta si aparece).

---

## Mapa de archivos

| Archivo                                                 | Responsabilidad                                                | Task |
| ------------------------------------------------------- | -------------------------------------------------------------- | ---- |
| `client/src/lib/marca.ts`                               | + `URL_SITIO`                                                  | 1    |
| `client/src/lib/seo.ts` (nuevo)                         | Metadatos por ruta, `<head>` en HTML, sitemap y robots         | 1    |
| `client/public/og-aspal.png` (nuevo)                    | Imagen Open Graph de 1200×630 generada desde el logotipo       | 1    |
| `client/src/components/layout/CabeceraRuta.tsx` (nuevo) | Mantiene el título y la descripción al navegar sin recargar    | 2    |
| `client/src/lib/sugerencias.ts` (nuevo)                 | «¿Quisiste decir…?», destinos sugeridos y enlace para reportar | 3    |
| `client/src/pages/not-found.tsx`                        | Página 404 rediseñada                                          | 4    |
| `client/src/lib/analitica.ts`                           | + evento `error_404`                                           | 4    |
| `client/src/entry-server.tsx` (nuevo)                   | Entrada del build SSR                                          | 5    |
| `scripts/prerender.mjs` (nuevo)                         | Escribe los HTML, el sitemap y robots                          | 5    |
| `package.json`                                          | Script `build`                                                 | 5    |
| `server/static.ts` (nuevo)                              | Servir `dist/public` en producción con 404 real                | 6    |
| `vercel.json`                                           | `cleanUrls` y rewrites sin comodín                             | 6    |
| `docs/architecture.md`, `CLAUDE.md`                     | Documentar el flujo nuevo                                      | 7    |

---

### Task 1: `seo.ts` — metadatos por ruta, `<head>`, sitemap y robots

**Files:**

- Modify: `client/src/lib/marca.ts`, `client/src/lib/marca.test.ts`
- Create: `client/src/lib/seo.ts`, `client/src/lib/seo.test.ts`
- Create: `client/public/og-aspal.png`

**Interfaces:**

- Consumes: `RUTAS_ESTATICAS`, `RutaEstatica` de `./rutas`; `CONTACTO`, `NOMBRE_COMPLETO`, `NOMBRE_CORTO`, `NOMBRE_MARCA`, `REDES`, `TITULO_SITIO` de `./marca`.
- Produces:
  - `URL_SITIO = "https://www.asociacionesprofesionales.org"` (en `marca.ts`, sin barra final)
  - `interface MetaRuta { titulo: string; descripcion: string; indexable: boolean }`
  - `SEO: Record<RutaEstatica, MetaRuta>`
  - `SEO_404: MetaRuta`
  - `metaDeRuta(ruta: string): MetaRuta | null` (null si no es una ruta estática)
  - `escaparHtml(texto: string): string`
  - `urlCanonica(ruta: RutaEstatica): string`
  - `etiquetasHead(ruta: RutaEstatica | null): string` (null = 404)
  - `generarSitemap(): string`
  - `generarRobots(): string`

- [ ] **Step 1: Test de `URL_SITIO`**

Añade a `client/src/lib/marca.test.ts` (y `URL_SITIO` al import de `./marca`):

```ts
it("usa el dominio canónico con www y sin barra final", () => {
  // El apex responde 307 hacia www: canonical y sitemap deben apuntar al
  // destino final, no a una redirección.
  expect(URL_SITIO).toBe("https://www.asociacionesprofesionales.org");
});
```

- [ ] **Step 2: Test de `seo.ts`**

`client/src/lib/seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { URL_SITIO } from "./marca";
import { RUTAS_ESTATICAS } from "./rutas";
import {
  SEO,
  SEO_404,
  escaparHtml,
  etiquetasHead,
  generarRobots,
  generarSitemap,
  metaDeRuta,
  urlCanonica,
} from "./seo";

describe("metadatos por ruta", () => {
  it("da a cada ruta estática un título propio con la marca", () => {
    const titulos = RUTAS_ESTATICAS.map((r) => SEO[r].titulo);
    for (const t of titulos) expect(t).toContain("ASPAL");
    expect(new Set(titulos).size).toBe(titulos.length);
  });

  it("da a cada ruta una descripción de 50 a 160 caracteres", () => {
    // Por debajo, Google la reescribe; por encima, la corta.
    for (const ruta of RUTAS_ESTATICAS) {
      const largo = SEO[ruta].descripcion.length;
      expect(largo, ruta).toBeGreaterThanOrEqual(50);
      expect(largo, ruta).toBeLessThanOrEqual(160);
    }
  });

  it("resuelve los metadatos solo de rutas estáticas", () => {
    expect(metaDeRuta("/blog")).toBe(SEO["/blog"]);
    expect(metaDeRuta("/blog/un-articulo")).toBeNull();
    expect(metaDeRuta("/no-existe")).toBeNull();
  });

  it("nunca indexa el 404", () => {
    expect(SEO_404.indexable).toBe(false);
  });
});

describe("escaparHtml", () => {
  it("escapa lo que rompería un atributo o una etiqueta", () => {
    expect(escaparHtml(`A & B "C" <D>`)).toBe("A &amp; B &quot;C&quot; &lt;D&gt;");
  });
});

describe("etiquetasHead", () => {
  it("apunta el canonical y og:url al dominio canónico", () => {
    const head = etiquetasHead("/blog");
    expect(head).toContain(`<link rel="canonical" href="${URL_SITIO}/blog" />`);
    expect(head).toContain(`<meta property="og:url" content="${URL_SITIO}/blog" />`);
    expect(urlCanonica("/")).toBe(`${URL_SITIO}/`);
  });

  it("incluye título, descripción e imagen Open Graph de 1200×630", () => {
    const head = etiquetasHead("/podcast");
    expect(head).toContain(`<title>${escaparHtml(SEO["/podcast"].titulo)}</title>`);
    expect(head).toContain('<meta name="description"');
    expect(head).toContain(
      `<meta property="og:image" content="${URL_SITIO}/og-aspal.png" />`,
    );
    expect(head).toContain('<meta property="og:image:width" content="1200" />');
    expect(head).toContain('<meta property="og:image:height" content="630" />');
    expect(head).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(head).not.toContain("noindex");
  });

  it("añade JSON-LD de Organization solo en la home", () => {
    const home = etiquetasHead("/");
    const json = home.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1];
    expect(json).toBeDefined();
    const datos = JSON.parse(json!);
    expect(datos["@type"]).toBe("Organization");
    expect(datos.url).toBe(`${URL_SITIO}/`);
    expect(etiquetasHead("/blog")).not.toContain("application/ld+json");
  });

  it("no deja que el JSON-LD cierre su propio <script>", () => {
    const json = etiquetasHead("/").match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )![1];
    expect(json).not.toMatch(/<\//);
  });

  it("marca el 404 como noindex y sin canonical", () => {
    const head = etiquetasHead(null);
    expect(head).toContain(`<title>${escaparHtml(SEO_404.titulo)}</title>`);
    expect(head).toContain('<meta name="robots" content="noindex" />');
    expect(head).not.toContain("canonical");
  });
});

describe("sitemap y robots", () => {
  it("lista cada ruta indexable con su URL canónica", () => {
    const sitemap = generarSitemap();
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    for (const ruta of RUTAS_ESTATICAS.filter((r) => SEO[r].indexable)) {
      expect(sitemap).toContain(`<loc>${urlCanonica(ruta)}</loc>`);
    }
    expect(sitemap).not.toContain("/api");
  });

  it("publica el sitemap y cierra /api/ a los rastreadores", () => {
    const robots = generarRobots();
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toContain(`Sitemap: ${URL_SITIO}/sitemap.xml`);
  });
});
```

- [ ] **Step 3: Comprobar que falla**

Run: `npx vitest run client/src/lib/seo.test.ts client/src/lib/marca.test.ts`
Expected: FAIL. `seo.test.ts` no resuelve `./seo`, y `marca.test.ts` falla porque `URL_SITIO` es `undefined`.

- [ ] **Step 4: Añadir `URL_SITIO` a `marca.ts`**

Después de `TITULO_SITIO`:

```ts
/**
 * Dominio canónico. El apex (sin www) responde 307 hacia aquí, así que
 * canonical, Open Graph y sitemap apuntan a este y no a una redirección.
 */
export const URL_SITIO = "https://www.asociacionesprofesionales.org";
```

- [ ] **Step 5: Implementar `seo.ts`**

`client/src/lib/seo.ts`:

```ts
/**
 * Metadatos de cada ruta: título, descripción, canonical, Open Graph y JSON-LD
 * (RF-10 del plan de la Etapa 1).
 *
 * Los consume el prerender (`scripts/prerender.mjs`, vía `entry-server.tsx`)
 * para escribir el `<head>` de cada HTML, y `CabeceraRuta` para mantener el
 * título al navegar sin recargar. `SEO` está indexado por `RutaEstatica`: una
 * ruta nueva en `rutas.ts` sin su entrada aquí no compila.
 *
 * Las descripciones reutilizan textos que el sitio ya publica; no se inventa
 * copy institucional.
 */

import {
  CONTACTO,
  NOMBRE_COMPLETO,
  NOMBRE_CORTO,
  NOMBRE_MARCA,
  REDES,
  TITULO_SITIO,
  URL_SITIO,
} from "./marca";
import { RUTAS_ESTATICAS, type RutaEstatica } from "./rutas";

export interface MetaRuta {
  titulo: string;
  descripcion: string;
  indexable: boolean;
}

export const SEO: Record<RutaEstatica, MetaRuta> = {
  // PENDIENTE (PR F): la home institucional trae su propia descripción.
  "/": {
    titulo: TITULO_SITIO,
    descripcion:
      "Comunidad de profesionales de asociaciones de Latinoamérica: formación, recursos, eventos y podcast.",
    indexable: true,
  },
  "/blog": {
    titulo: "Blog · ASPAL",
    descripcion:
      "Recursos, guías y mejores prácticas para asociaciones profesionales de Latinoamérica.",
    indexable: true,
  },
  "/podcast": {
    titulo: "Conexión Profesional · Podcast de ASPAL",
    descripcion:
      "El podcast que explora y fortalece las redes en asociaciones profesionales.",
    indexable: true,
  },
  "/plataforma": {
    titulo: "Crea y gestiona tu comunidad en línea · ASPAL",
    descripcion:
      "Membresías, comunidad en línea, contenido, cursos, marketing y bolsa de trabajo para asociaciones profesionales.",
    indexable: true,
  },
};

export const SEO_404: MetaRuta = {
  titulo: "Página no encontrada · ASPAL",
  descripcion: "La página que buscas no existe o ha cambiado de dirección.",
  indexable: false,
};

const IMAGEN_OG = { ruta: "/og-aspal.png", ancho: 1200, alto: 630 } as const;

/** Metadatos de una ruta estática; `null` para rutas dinámicas o inexistentes. */
export function metaDeRuta(ruta: string): MetaRuta | null {
  return (RUTAS_ESTATICAS as readonly string[]).includes(ruta)
    ? SEO[ruta as RutaEstatica]
    : null;
}

export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function urlCanonica(ruta: RutaEstatica): string {
  return ruta === "/" ? `${URL_SITIO}/` : `${URL_SITIO}${ruta}`;
}

function jsonLdOrganizacion(): string {
  const [localidad, region] = CONTACTO.ciudad.split(", ");
  const datos = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: NOMBRE_COMPLETO,
    alternateName: NOMBRE_CORTO,
    url: `${URL_SITIO}/`,
    logo: `${URL_SITIO}/favicon.png`,
    email: CONTACTO.correo,
    telephone: CONTACTO.telefono.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: localidad,
      addressRegion: region,
      addressCountry: "MX",
    },
    sameAs: REDES.map((red) => red.href),
  };
  // `<` escapado: ningún valor puede cerrar el <script> que lo contiene.
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}

/**
 * Bloque completo de `<head>` para una ruta (título incluido). `null` es el 404:
 * sin canonical y con noindex. El prerender lo inserta en lugar del `<title>` y
 * la descripción por defecto de `index.html`.
 */
export function etiquetasHead(ruta: RutaEstatica | null): string {
  const meta = ruta === null ? SEO_404 : SEO[ruta];
  const e = escaparHtml;
  const lineas = [
    `<title>${e(meta.titulo)}</title>`,
    `<meta name="description" content="${e(meta.descripcion)}" />`,
  ];

  if (!meta.indexable) lineas.push('<meta name="robots" content="noindex" />');

  if (ruta !== null) {
    const url = urlCanonica(ruta);
    lineas.push(
      `<link rel="canonical" href="${url}" />`,
      '<meta property="og:type" content="website" />',
      `<meta property="og:site_name" content="${e(NOMBRE_MARCA)}" />`,
      '<meta property="og:locale" content="es_MX" />',
      `<meta property="og:title" content="${e(meta.titulo)}" />`,
      `<meta property="og:description" content="${e(meta.descripcion)}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${URL_SITIO}${IMAGEN_OG.ruta}" />`,
      `<meta property="og:image:width" content="${IMAGEN_OG.ancho}" />`,
      `<meta property="og:image:height" content="${IMAGEN_OG.alto}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
    );
  }

  if (ruta === "/") {
    lineas.push(`<script type="application/ld+json">${jsonLdOrganizacion()}</script>`);
  }

  return lineas.map((linea) => `    ${linea}`).join("\n");
}

export function generarSitemap(): string {
  const urls = RUTAS_ESTATICAS.filter((ruta) => SEO[ruta].indexable)
    .map((ruta) => `  <url><loc>${urlCanonica(ruta)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function generarRobots(): string {
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${URL_SITIO}/sitemap.xml\n`;
}
```

- [ ] **Step 6: Comprobar que pasa**

Run: `npx vitest run client/src/lib/seo.test.ts client/src/lib/marca.test.ts`
Expected: PASS.

- [ ] **Step 7: Generar la imagen Open Graph**

Guarda este script en `$env:TEMP\og-aspal.ps1` (fuera del repo) y ejecútalo desde la raíz del repo con `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:TEMP\og-aspal.ps1"`. En Git Bash, la ruta es `"$TEMP/og-aspal.ps1"`.

```powershell
# Imagen Open Graph 1200x630: fondo noche (el azul del logotipo), el logotipo
# para fondo oscuro centrado y una franja miel abajo. Solo activos de marca.
Add-Type -AssemblyName System.Drawing
$raiz = (Resolve-Path ".").Path
$logo = [System.Drawing.Image]::FromFile("$raiz\client\src\assets\ASPAL-para fondo oscuro_1763675345456.png")
$lienzo = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($lienzo)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.ColorTranslator]::FromHtml("#112738"))
$ancho = 720
$alto = [int]($logo.Height * $ancho / $logo.Width)
$g.DrawImage($logo, [int]((1200 - $ancho) / 2), [int]((630 - $alto) / 2), $ancho, $alto)
$miel = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#F9CC62"))
$g.FillRectangle($miel, 0, 606, 1200, 24)
$lienzo.Save("$raiz\client\public\og-aspal.png", [System.Drawing.Imaging.ImageFormat]::Png)
$miel.Dispose(); $g.Dispose(); $lienzo.Dispose(); $logo.Dispose()
```

Expected: existe `client/public/og-aspal.png`, de 1200×630 y menos de 200 KB. Compruébalo con `powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Drawing; $i=[System.Drawing.Image]::FromFile('client\public\og-aspal.png'); \"$($i.Width)x$($i.Height)\"; $i.Dispose()"` y `ls -l client/public/og-aspal.png`.

- [ ] **Step 8: Puertas y commit**

```bash
npx prettier --write client/src/lib/seo.ts client/src/lib/seo.test.ts client/src/lib/marca.ts client/src/lib/marca.test.ts
npm run check && npm run lint && npm run format:check && npm test
git add client/src/lib/seo.ts client/src/lib/seo.test.ts client/src/lib/marca.ts client/src/lib/marca.test.ts client/public/og-aspal.png
git commit -m "Añadir los metadatos SEO por ruta, el sitemap, robots y la imagen Open Graph"
```

---

### Task 2: `CabeceraRuta` — título y descripción al navegar sin recargar

El HTML prerenderizado ya trae el `<head>` correcto, pero al navegar dentro de la SPA el título no cambia. Hoy solo lo gestionan `blog.tsx` y `blog-post.tsx`, cada uno a su manera.

**Files:**

- Create: `client/src/components/layout/CabeceraRuta.tsx`
- Modify: `client/src/App.tsx` (montar `<CabeceraRuta />`)
- Modify: `client/src/pages/blog.tsx` (quitar el `useEffect` que fija `"Blog · ASPAL"`, que ahora viene de `SEO`)

**Interfaces:**

- Consumes: `metaDeRuta(ruta: string): MetaRuta | null` de `@/lib/seo`.
- Produces: `CabeceraRuta(): null`, que se monta una sola vez en `App`.

- [ ] **Step 1: Crear el componente**

`client/src/components/layout/CabeceraRuta.tsx`:

```tsx
import { metaDeRuta } from "@/lib/seo";
import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Mantiene el título y la descripción al navegar sin recargar. Al cargar, el
 * HTML prerenderizado ya los trae; esto cubre los cambios de ruta dentro de la
 * SPA. Las rutas dinámicas (`/blog/:slug`) y el 404 fijan su propio título, así
 * que aquí solo se tocan las rutas estáticas.
 */
export function CabeceraRuta() {
  const [ruta] = useLocation();

  useEffect(() => {
    const meta = metaDeRuta(ruta);
    if (!meta) return;
    document.title = meta.titulo;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.descripcion);
  }, [ruta]);

  return null;
}
```

- [ ] **Step 2: Montarlo en `App.tsx`**

Importa `import { CabeceraRuta } from "@/components/layout/CabeceraRuta";` y colócalo justo antes de `<ScrollRestoration />`:

```tsx
          <Toaster />
          <CabeceraRuta />
          <ScrollRestoration />
```

- [ ] **Step 3: Quitar el título duplicado de `blog.tsx`**

Borra este bloque de `Blog()`:

```tsx
useEffect(() => {
  document.title = "Blog · ASPAL";
}, []);
```

Si `useEffect` deja de usarse en el archivo, quítalo del import de `react`.

- [ ] **Step 4: Puertas y verificación**

```bash
npx prettier --write client/src/components/layout/CabeceraRuta.tsx client/src/App.tsx client/src/pages/blog.tsx
npm run check && npm run lint && npm run format:check && npm test
```

Verificación en el navegador (la hace el controlador): en `PORT=5001 npm run dev`, navega con clics de `/` a `/blog` y de ahí a `/podcast`. La pestaña debe mostrar «Blog · ASPAL» y después «Conexión Profesional · Podcast de ASPAL». Entra en un artículo y vuelve a `/blog`: la pestaña vuelve a «Blog · ASPAL».

- [ ] **Step 5: Commit**

```bash
git add client/src/components/layout/CabeceraRuta.tsx client/src/App.tsx client/src/pages/blog.tsx
git commit -m "Mantener el título y la descripción de cada ruta al navegar sin recargar"
```

---

### Task 3: `sugerencias.ts` — la lógica que hace útil al 404

**Files:**

- Create: `client/src/lib/sugerencias.ts`, `client/src/lib/sugerencias.test.ts`

**Interfaces:**

- Consumes: `RUTAS_ESTATICAS`, `esRutaConocida` de `./rutas`; `NAVEGACION`, `DestinoNav` de `./navegacion`; `CONTACTO`, `URL_SITIO` de `./marca`.
- Produces:
  - `sugerirRuta(ruta: string): string | null`: ruta existente más probable, o `null`. Nunca devuelve `"/"`, porque «Ir al inicio» ya es la acción por defecto.
  - `destinosSugeridos(): DestinoNav[]`: los destinos del menú que tienen `href`, en su orden.
  - `enlaceReporte(ruta: string, referente: string): string`: `mailto:` con asunto y cuerpo prellenados.

- [ ] **Step 1: Escribir los tests**

`client/src/lib/sugerencias.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CONTACTO, URL_SITIO } from "./marca";
import { destinosSugeridos, enlaceReporte, sugerirRuta } from "./sugerencias";

describe("sugerirRuta", () => {
  it("corrige mayúsculas y barras finales", () => {
    expect(sugerirRuta("/Blog")).toBe("/blog");
    expect(sugerirRuta("/blog/")).toBe("/blog");
    expect(sugerirRuta("/PODCAST//")).toBe("/podcast");
  });

  it("corrige un artículo con mayúsculas o barra final", () => {
    expect(sugerirRuta("/Blog/Mi-Articulo/")).toBe("/blog/mi-articulo");
  });

  it("quita extensiones de sitios anteriores", () => {
    expect(sugerirRuta("/blog.html")).toBe("/blog");
    expect(sugerirRuta("/podcast/index.php")).toBe("/podcast");
  });

  it("perdona erratas de hasta dos letras", () => {
    expect(sugerirRuta("/blogs")).toBe("/blog");
    expect(sugerirRuta("/bog")).toBe("/blog");
    expect(sugerirRuta("/podcats")).toBe("/podcast");
    expect(sugerirRuta("/plataformas")).toBe("/plataforma");
  });

  it("conserva el resto de la dirección si con la corrección existe", () => {
    expect(sugerirRuta("/blogs/mi-articulo")).toBe("/blog/mi-articulo");
  });

  it("ignora tildes, consulta y ancla", () => {
    expect(sugerirRuta("/pódcast?origen=correo#inicio")).toBe("/podcast");
  });

  it("no inventa cuando nada se parece", () => {
    expect(sugerirRuta("/nosotros")).toBeNull();
    expect(sugerirRuta("/wp-admin")).toBeNull();
    expect(sugerirRuta("/b")).toBeNull();
  });

  it("nunca sugiere la raíz", () => {
    expect(sugerirRuta("/index.html")).toBeNull();
    expect(sugerirRuta("//")).toBeNull();
  });

  it("aguanta una dirección mal codificada", () => {
    expect(() => sugerirRuta("/%E0%A4%A")).not.toThrow();
  });
});

describe("destinosSugeridos", () => {
  it("ofrece solo destinos que llevan a algún sitio, sin repetir", () => {
    const destinos = destinosSugeridos();
    expect(destinos.length).toBeGreaterThan(0);
    expect(destinos.every((d) => Boolean(d.href))).toBe(true);
    const ids = destinos.map((d) => d.testid);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("enlaceReporte", () => {
  it("prepara un correo a ASPAL con la dirección rota y la de origen", () => {
    const enlace = enlaceReporte("/nosotros", "https://ejemplo.com/boletin");
    expect(enlace.startsWith(`mailto:${CONTACTO.correo}?subject=`)).toBe(true);
    const cuerpo = decodeURIComponent(enlace.split("&body=")[1]);
    expect(cuerpo).toContain(`${URL_SITIO}/nosotros`);
    expect(cuerpo).toContain("https://ejemplo.com/boletin");
  });

  it("dice que no se sabe el origen cuando no lo hay", () => {
    const cuerpo = decodeURIComponent(enlaceReporte("/x", "").split("&body=")[1]);
    expect(cuerpo).toContain("Venía de: no lo sé");
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/sugerencias.test.ts`
Expected: FAIL. No resuelve `./sugerencias`.

- [ ] **Step 3: Implementar**

`client/src/lib/sugerencias.ts`:

```ts
/**
 * Lógica de la página 404: adivinar a dónde quería ir la persona, ofrecerle
 * salidas reales y facilitarle avisar del enlace roto.
 *
 * Pura y sin DOM para poder probarla: la página solo la pinta.
 */

import { CONTACTO, URL_SITIO } from "./marca";
import { NAVEGACION, type DestinoNav } from "./navegacion";
import { RUTAS_ESTATICAS, esRutaConocida } from "./rutas";

/** Erratas que se perdonan: hasta dos letras cambiadas, sobrantes o faltantes. */
const DISTANCIA_MAXIMA = 2;

/** Distancia de Levenshtein entre dos cadenas. */
function distancia(a: string, b: string): number {
  const fila = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const arriba = fila[j];
      fila[j] = Math.min(
        fila[j] + 1,
        fila[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = arriba;
    }
  }
  return fila[b.length];
}

/** Minúsculas, sin tildes, sin consulta ni ancla, sin extensión ni barras sobrantes. */
function normalizar(ruta: string): string {
  let r = ruta.split(/[?#]/)[0];
  try {
    r = decodeURI(r);
  } catch {
    // Dirección mal codificada: se compara tal cual.
  }
  r = r
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\/index\.[a-z]+$/, "/")
    .replace(/\.(html?|php|aspx?)$/, "")
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");
  return r === "" ? "/" : r;
}

/**
 * La ruta existente que la persona probablemente quería, o `null`. Primero
 * prueba la dirección normalizada tal cual (`/Blog/` → `/blog`) y después
 * corrige erratas en el primer segmento (`/blogs/x` → `/blog/x`).
 */
export function sugerirRuta(ruta: string): string | null {
  const normalizada = normalizar(ruta);
  if (normalizada === "/") return null;
  if (esRutaConocida(normalizada)) return normalizada;

  const [, primero = "", ...resto] = normalizada.split("/");
  let mejor: string | null = null;
  let menor = DISTANCIA_MAXIMA + 1;
  for (const candidata of RUTAS_ESTATICAS) {
    if (candidata === "/") continue;
    const d = distancia(primero, candidata.slice(1));
    if (d < menor) {
      menor = d;
      mejor = candidata;
    }
  }
  if (!mejor) return null;

  const completa = [mejor, ...resto].join("/");
  return resto.length > 0 && esRutaConocida(completa) ? completa : mejor;
}

/** Destinos del menú que existen, en su orden: las salidas que ofrece el 404. */
export function destinosSugeridos(): DestinoNav[] {
  return NAVEGACION.flatMap((entrada) => entrada.destinos ?? []).filter((d) =>
    Boolean(d.href),
  );
}

/** Correo prellenado para avisar de un enlace roto: dirección y origen incluidos. */
export function enlaceReporte(ruta: string, referente: string): string {
  const asunto = "Enlace roto en el sitio de ASPAL";
  const cuerpo = [
    "Hola, llegué a una página que no existe.",
    "",
    `Dirección: ${URL_SITIO}${ruta}`,
    `Venía de: ${referente || "no lo sé"}`,
  ].join("\n");
  return `mailto:${CONTACTO.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
```

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run client/src/lib/sugerencias.test.ts`
Expected: PASS, 12 tests.

- [ ] **Step 5: Puertas y commit**

```bash
npx prettier --write client/src/lib/sugerencias.ts client/src/lib/sugerencias.test.ts
npm run check && npm run lint && npm run format:check && npm test
git add client/src/lib/sugerencias.ts client/src/lib/sugerencias.test.ts
git commit -m "Añadir la lógica del 404: ruta sugerida, destinos y enlace para avisar"
```

---

### Task 4: Página 404 pensada para quien se perdió

**Decisiones de UX** (por qué la página es así):

| Decisión                                                                      | Motivo                                                                                                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| H1 en lenguaje llano («No encontramos esta página»), sin culpar a nadie       | Quien llega aquí no hizo nada mal. «404» va como etiqueta pequeña, no como titular                                                          |
| Se muestra la dirección solicitada                                            | Permite ver la errata por uno mismo. Solo se pinta en el navegador (Review Focus 5)                                                         |
| «¿Quisiste decir…?» con botón miel cuando hay sugerencia                      | Es el arreglo en un clic para la causa más común (mayúsculas, barra final, plural). Si hay sugerencia, «Ir al inicio» pasa a ser secundario |
| «¿Buscabas tu cuenta? Inicia sesión»                                          | Mucha gente llega desde enlaces viejos de la plataforma de comunidad buscando entrar                                                        |
| «Quizá te interese»: los destinos reales del menú, con su icono y descripción | Salidas concretas en vez de un callejón. Salen de `navegacion.ts`, así que nunca proponen una página que no existe                          |
| «¿Llegaste desde un enlace de ASPAL? Avísanos» con un correo prellenado       | Convierte el error en un aviso útil para el equipo. La dirección y el origen van dentro                                                     |
| Evento `error_404` con la ruta y el origen                                    | Para encontrar enlaces rotos en GA4 sin esperar a que alguien escriba                                                                       |
| El foco va al H1 al montar                                                    | Un lector de pantalla anuncia dónde está. Es el mismo patrón que `blog-post.tsx`                                                            |
| Sin animación de opacidad; objetivos de 44 px; enlaces externos anunciados    | Prerender, público de edad alta y WCAG AA                                                                                                   |

**Files:**

- Modify: `client/src/lib/analitica.ts` (añade `"error_404"` a `EventoAnalitica`)
- Rewrite: `client/src/pages/not-found.tsx`

**Interfaces:**

- Consumes: `sugerirRuta`, `destinosSugeridos`, `enlaceReporte` (Task 3); `SEO_404` (Task 1); `registrarEvento` y `EventoAnalitica` de `@/lib/analitica`; `URL_LOGIN` y `DestinoNav` de `@/lib/navegacion`.
- Produces: `NotFound` (default export). Los `data-testid` son `text-404-title`, `text-404-message`, `text-404-ruta`, `card-404-sugerencia`, `button-404-sugerencia`, `button-404-home`, `link-404-login`, `404-<testid del destino>` y `link-404-reportar`.

- [ ] **Step 1: Añadir el evento**

En `client/src/lib/analitica.ts`, añade `| "error_404"` al final de la unión `EventoAnalitica`.

- [ ] **Step 2: Reescribir `not-found.tsx`**

Sustituye el archivo entero por:

```tsx
import iconoAspal from "@assets/Aspal-Icono_1763675356866.png";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { registrarEvento } from "@/lib/analitica";
import { URL_LOGIN, type DestinoNav } from "@/lib/navegacion";
import { SEO_404 } from "@/lib/seo";
import { destinosSugeridos, enlaceReporte, sugerirRuta } from "@/lib/sugerencias";
import { ArrowRight, ArrowUpRight, Home, LogIn, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

/** Un destino real del menú, como salida del 404. */
function DestinoSugerido({ destino }: { destino: DestinoNav }) {
  const Icono = destino.icono;
  const clases =
    "hover-elevate flex min-h-11 gap-3 rounded-2xl border border-border p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const contenido = (
    <>
      <Icono className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          {destino.etiqueta}
          {destino.externo && (
            <>
              <ArrowUpRight
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </>
          )}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {destino.descripcion}
        </span>
      </span>
    </>
  );

  return (
    <li>
      {destino.externo ? (
        <a
          href={destino.href}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
          data-testid={`404-${destino.testid}`}
        >
          {contenido}
        </a>
      ) : (
        <Link
          href={destino.href!}
          className={clases}
          data-testid={`404-${destino.testid}`}
        >
          {contenido}
        </Link>
      )}
    </li>
  );
}

/**
 * 404 del sitio, pensado para quien se perdió y no para el servidor.
 *
 * Responde a las tres preguntas de quien llega aquí: qué pasó (lenguaje llano,
 * sin culpas), cómo lo arreglo (la ruta que probablemente quería, en un clic) y
 * a dónde voy ahora (salidas reales del menú, más iniciar sesión, porque mucha
 * gente llega desde enlaces viejos de la plataforma de comunidad). Y facilita
 * avisar del enlace roto con un correo ya escrito.
 *
 * El mismo componente produce el `404.html` prerenderizado, que es uno solo
 * para todas las direcciones inexistentes. Por eso la ruta pedida y lo que
 * depende de ella (sugerencia, correo) se pintan solo en el navegador: en el
 * servidor mostrarían una dirección que nadie pidió.
 */
export default function NotFound() {
  const [ruta] = useLocation();
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const [referente, setReferente] = useState<string | null>(null);

  useEffect(() => {
    setReferente(document.referrer);
    document.title = SEO_404.titulo;
    // Como en los artículos: el lector de pantalla anuncia dónde está.
    tituloRef.current?.focus();
    registrarEvento("error_404", { ruta, referente: document.referrer || "directo" });
  }, [ruta]);

  const enNavegador = referente !== null;
  const sugerencia = enNavegador ? sugerirRuta(ruta) : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <img
            src={iconoAspal}
            alt=""
            aria-hidden="true"
            width={1500}
            height={1877}
            className="h-14 w-auto"
          />

          <p className="mt-6 text-[13px] font-semibold uppercase tracking-wider text-miel-texto">
            Error 404
          </p>
          <h1
            ref={tituloRef}
            tabIndex={-1}
            className="mt-2 text-4xl font-bold text-foreground outline-none md:text-5xl"
            data-testid="text-404-title"
          >
            No encontramos esta página
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg text-muted-foreground"
            data-testid="text-404-message"
          >
            Puede que el enlace esté roto, que la página haya cambiado de dirección o que
            la dirección tenga un error de escritura.
          </p>

          {enNavegador && (
            <p
              className="mt-4 text-base text-muted-foreground"
              data-testid="text-404-ruta"
            >
              Dirección solicitada:{" "}
              <code className="break-all rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
                {ruta}
              </code>
            </p>
          )}

          {sugerencia && (
            <div
              className="mt-8 rounded-2xl border border-border bg-accent p-5"
              data-testid="card-404-sugerencia"
            >
              <p className="text-lg text-foreground">
                ¿Quisiste decir{" "}
                <code className="break-all font-semibold">{sugerencia}</code>?
              </p>
              <Button
                variant="secondary"
                className="mt-4 min-h-11 px-6"
                asChild
                data-testid="button-404-sugerencia"
              >
                <Link href={sugerencia}>
                  Ir a esa página
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              variant={sugerencia ? "outline" : "secondary"}
              className="min-h-11 px-6"
              asChild
              data-testid="button-404-home"
            >
              <Link href="/">
                <Home aria-hidden="true" />
                Ir al inicio
              </Link>
            </Button>
            <a
              href={URL_LOGIN}
              className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4"
              data-testid="link-404-login"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              ¿Buscabas tu cuenta? Inicia sesión
            </a>
          </div>

          <section className="mt-14" aria-labelledby="titulo-404-destinos">
            <h2
              id="titulo-404-destinos"
              className="text-2xl font-semibold text-foreground"
            >
              Quizá te interese
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {destinosSugeridos().map((destino) => (
                <DestinoSugerido key={destino.testid} destino={destino} />
              ))}
            </ul>
          </section>

          {enNavegador && (
            <p className="mt-12 border-t border-border pt-6 text-base text-muted-foreground">
              ¿Llegaste aquí desde un enlace de ASPAL?{" "}
              <a
                href={enlaceReporte(ruta, referente)}
                className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline underline-offset-4"
                data-testid="link-404-reportar"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Avísanos y lo corregimos
              </a>
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

`setReferente` dentro del efecto dispara el aviso `react-hooks/set-state-in-effect`. Es un warning, no un error, y el repo ya lo tiene en `Header.tsx` con el mismo patrón («montado»). Aquí es intencionado: el valor solo existe en el navegador.

- [ ] **Step 3: Puertas**

```bash
npx prettier --write client/src/pages/not-found.tsx client/src/lib/analitica.ts
npm run check && npm run lint && npm run format:check && npm test
```

Expected: verde. Lint: 0 errores; se permite un warning más, `set-state-in-effect`, en `not-found.tsx`.

- [ ] **Step 4: Verificación en el navegador (la hace el controlador)**

En `PORT=5001 npm run dev`:

- `/Blog/` debe mostrar la tarjeta «¿Quisiste decir /blog?», y su botón lleva a `/blog`.
- `/nosotros` no muestra tarjeta; «Ir al inicio» es el botón miel.
- En ambos casos la pestaña dice «Página no encontrada · ASPAL», la dirección solicitada es la real, `window.dataLayer` recibe `error_404` y el enlace «Avísanos» abre un `mailto:` que incluye la dirección.
- Sin scroll horizontal a 375, 768, 1024 y 1440 px. Una ruta larga (`/esto/es/una/ruta/muy/larga/que/no/existe/para/nada`) se parte y no desborda.

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/not-found.tsx client/src/lib/analitica.ts
git commit -m "Rediseñar el 404: sugerir la ruta correcta, ofrecer salidas y permitir avisar del enlace"
```

---

### Task 5: Prerender — HTML por ruta, `404.html`, `spa.html`, sitemap y robots

**Files:**

- Create: `client/src/entry-server.tsx`
- Create: `scripts/prerender.mjs`
- Modify: `package.json` (script `build`)

**Interfaces:**

- Consumes: `RUTAS_ESTATICAS` (rutas.ts); `etiquetasHead`, `generarSitemap` y `generarRobots` (Task 1); `App` (App.tsx).
- Produces (en `dist/public/`): `index.html` (`/` prerenderizada), `blog.html`, `podcast.html`, `plataforma.html`, `404.html` (noindex), `spa.html` (la plantilla sin prerender, para rutas dinámicas), `sitemap.xml` y `robots.txt`. Y `dist/ssr/entry-server.js`, que solo sirve durante el build. El Task 6 sirve estos nombres.

- [ ] **Step 1: Entrada SSR**

`client/src/entry-server.tsx`:

```tsx
/**
 * Entrada del build de prerender (`vite build --ssr`). Solo corre en el build,
 * nunca en el navegador: `scripts/prerender.mjs` la importa ya empaquetada desde
 * `dist/ssr/` y escribe un HTML por ruta.
 *
 * `ssrPath` hace que wouter resuelva la ruta sin `window.location`. El resto de
 * la app ya es seguro en el servidor: todo acceso a `window` y `document` vive
 * en efectos o manejadores.
 */
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export { RUTAS_ESTATICAS } from "./lib/rutas";
export { etiquetasHead, generarRobots, generarSitemap } from "./lib/seo";

export function renderizar(ruta: string): string {
  return renderToString(
    <Router ssrPath={ruta}>
      <App />
    </Router>,
  );
}
```

- [ ] **Step 2: Script de prerender**

`scripts/prerender.mjs`:

```js
#!/usr/bin/env node
/**
 * Prerender de las rutas estáticas (RF-10 y RF-11 del plan de la Etapa 1).
 *
 * Corre después de los dos builds de Vite: toma `dist/public/index.html` como
 * plantilla y escribe un HTML por ruta con su `<head>` propio y el cuerpo ya
 * renderizado, además de `404.html`, `spa.html`, `sitemap.xml` y `robots.txt`.
 *
 * Es también una puerta: aborta el build si una ruta sale sin `<h1>` o si el
 * 404 compartido muestra una dirección concreta.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const RAIZ = resolve(import.meta.dirname, "..");
const PUBLICO = join(RAIZ, "dist", "public");
const ENTRADA = join(RAIZ, "dist", "ssr", "entry-server.js");

const { renderizar, RUTAS_ESTATICAS, etiquetasHead, generarSitemap, generarRobots } =
  await import(pathToFileURL(ENTRADA).href);

const plantilla = await readFile(join(PUBLICO, "index.html"), "utf8");

const TITULO = /[ \t]*<title>[\s\S]*?<\/title>\s*/;
const DESCRIPCION = /[ \t]*<meta\s+name="description"[\s\S]*?\/?>\s*/;
const RAIZ_APP = '<div id="root"></div>';

if (!TITULO.test(plantilla)) throw new Error("prerender: la plantilla no tiene <title>");
if (!DESCRIPCION.test(plantilla)) {
  throw new Error('prerender: la plantilla no tiene <meta name="description">');
}
if (!plantilla.includes(RAIZ_APP)) {
  throw new Error(`prerender: la plantilla no tiene ${RAIZ_APP}`);
}

/**
 * Sustituciones con función, no con cadena: el HTML renderizado puede contener
 * `$&` o `$1`, que `String.replace` interpretaría como patrones.
 */
function componer(ruta, cuerpo) {
  const nombre = ruta ?? "404";
  if (!cuerpo.includes("<h1")) throw new Error(`prerender: ${nombre} no tiene <h1>`);
  return plantilla
    .replace(TITULO, () => "")
    .replace(DESCRIPCION, () => "")
    .replace("</head>", () => `${etiquetasHead(ruta)}\n  </head>`)
    .replace(RAIZ_APP, () => `<div id="root">${cuerpo}</div>`);
}

async function escribir(archivo, contenido) {
  const destino = join(PUBLICO, archivo);
  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, contenido);
}

// El shell sin prerender: lo sirven las rutas dinámicas (/blog/:slug). Se
// guarda antes de sobrescribir index.html con la home prerenderizada.
await escribir("spa.html", plantilla);

for (const ruta of RUTAS_ESTATICAS) {
  const archivo = ruta === "/" ? "index.html" : `${ruta.slice(1)}.html`;
  await escribir(archivo, componer(ruta, renderizar(ruta)));
}

// Cualquier ruta que no esté en rutas.ts renderiza NotFound.
const cuerpo404 = renderizar("/404");
if (cuerpo404.includes("Dirección solicitada")) {
  throw new Error("prerender: el 404 compartido no puede mostrar una dirección concreta");
}
await escribir("404.html", componer(null, cuerpo404));

await escribir("sitemap.xml", generarSitemap());
await escribir("robots.txt", generarRobots());

console.log(
  `prerender: ${RUTAS_ESTATICAS.length} rutas, 404.html, spa.html, sitemap.xml y robots.txt`,
);
```

- [ ] **Step 3: Encadenarlo en `package.json`**

Sustituye el script `build` por:

```json
    "build": "vite build && vite build --ssr src/entry-server.tsx --outDir ../dist/ssr --emptyOutDir && node scripts/prerender.mjs && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
```

(Las rutas de `--ssr` y `--outDir` son relativas a `client/`, el `root` de Vite. Comprobado el 29 sep 2026.)

- [ ] **Step 4: Construir y comprobar el resultado**

```bash
npm run build
ls dist/public
grep -o "<title>[^<]*</title>" dist/public/index.html dist/public/blog.html dist/public/podcast.html dist/public/plataforma.html dist/public/404.html dist/public/spa.html
grep -c "<h1" dist/public/blog.html dist/public/404.html
grep -c 'name="robots" content="noindex"' dist/public/404.html dist/public/blog.html
grep -c "application/ld+json" dist/public/index.html dist/public/blog.html
cat dist/public/sitemap.xml dist/public/robots.txt
grep -c '<div id="root"></div>' dist/public/spa.html
```

Expected:

- El build imprime `prerender: 4 rutas, 404.html, spa.html, sitemap.xml y robots.txt`.
- Los títulos son los de `SEO` en cada archivo: «Página no encontrada · ASPAL» en `404.html` y el título por defecto en `spa.html`.
- `<h1` aparece al menos una vez en `blog.html` y en `404.html`.
- `noindex` sale 1 en `404.html` y 0 en `blog.html`.
- JSON-LD sale 1 en `index.html` y 0 en `blog.html`.
- El sitemap tiene las 4 URLs con `https://www.asociacionesprofesionales.org`.
- `spa.html` conserva el `<div id="root"></div>` vacío.

- [ ] **Step 5: Probar que la puerta muerde**

Renombra temporalmente el `<h1` de `client/src/pages/podcast.tsx` a `<h2` y ejecuta `npm run build`.
Expected: el build falla con `prerender: /podcast no tiene <h1>`. Deshaz el cambio.

- [ ] **Step 6: Puertas y commit**

```bash
npx prettier --write client/src/entry-server.tsx scripts/prerender.mjs package.json
npm run check && npm run lint && npm run format:check && npm test
git add client/src/entry-server.tsx scripts/prerender.mjs package.json
git commit -m "Prerenderizar cada ruta con su head propio y generar 404.html, sitemap y robots"
```

---

### Task 6: Servir el 404 de verdad — Express en producción y Vercel

**Files:**

- Create: `server/static.ts`, `server/static.test.ts`, `server/vercel.test.ts`
- Modify: `server/vite.ts` (quitar `serveStatic`), `server/index.ts` (importar `serveStatic` de `./static`)
- Modify: `vercel.json`
- Modify: `vitest.config.ts` (`include` añade `"server/**/*.test.ts"`)

**Interfaces:**

- Consumes: `RUTAS_DINAMICAS` de `../client/src/lib/rutas`; los archivos del Task 5.
- Produces: `serveStatic(app: Express, distPath?: string): void`. Por defecto usa `path.resolve(import.meta.dirname, "public")`, igual que hoy.

- [ ] **Step 1: Tests**

`server/static.test.ts`:

```ts
import express from "express";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveStatic } from "./static";

let servidor: Server;
let base: string;
let dist: string;

beforeAll(async () => {
  dist = mkdtempSync(join(tmpdir(), "aspal-dist-"));
  for (const [archivo, marca] of [
    ["index.html", "HOME"],
    ["blog.html", "BLOG"],
    ["spa.html", "SHELL"],
    ["404.html", "NO-ENCONTRADA"],
  ]) {
    writeFileSync(join(dist, archivo), `<html>${marca}</html>`);
  }
  const app = express();
  serveStatic(app, dist);
  await new Promise<void>((listo) => {
    servidor = app.listen(0, listo);
  });
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
});

afterAll(() => {
  servidor.close();
  rmSync(dist, { recursive: true, force: true });
});

async function pedir(ruta: string) {
  const respuesta = await fetch(`${base}${ruta}`, { redirect: "manual" });
  return { estado: respuesta.status, cuerpo: await respuesta.text() };
}

describe("serveStatic", () => {
  it("sirve la home prerenderizada", async () => {
    expect(await pedir("/")).toEqual({ estado: 200, cuerpo: "<html>HOME</html>" });
  });

  it("sirve cada ruta estática sin extensión", async () => {
    expect(await pedir("/blog")).toEqual({ estado: 200, cuerpo: "<html>BLOG</html>" });
  });

  it("redirige la barra final a la ruta sin barra, conservando la consulta", async () => {
    // Si no, /blog/ recibiría el 404.html pero wouter pintaría el blog en el
    // cliente: código y contenido se contradirían.
    const respuesta = await fetch(`${base}/blog/?origen=correo`, { redirect: "manual" });
    expect(respuesta.status).toBe(308);
    expect(respuesta.headers.get("location")).toBe("/blog?origen=correo");
  });

  it("sirve el shell a las rutas dinámicas, con 200", async () => {
    // Recargar un artículo no puede dar 404: el cliente lo carga desde la API.
    expect(await pedir("/blog/un-articulo")).toEqual({
      estado: 200,
      cuerpo: "<html>SHELL</html>",
    });
  });

  it("responde 404 de verdad, con la página 404, a lo que no existe", async () => {
    expect(await pedir("/no-existe")).toEqual({
      estado: 404,
      cuerpo: "<html>NO-ENCONTRADA</html>",
    });
    expect((await pedir("/blog/a/b")).estado).toBe(404);
  });
});
```

`server/vercel.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { RUTAS_DINAMICAS } from "../client/src/lib/rutas";

interface Reescritura {
  source: string;
  destination: string;
}

const config = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "..", "vercel.json"), "utf8"),
) as { cleanUrls?: boolean; trailingSlash?: boolean; rewrites: Reescritura[] };

describe("vercel.json", () => {
  it("no tiene un rewrite comodín que convierta todo en 200", () => {
    // Era `{ "source": "/(.*)", "destination": "/" }`: cualquier dirección
    // inexistente respondía 200 con la home (RF-11).
    const comodines = config.rewrites.filter(
      (r) => r.destination === "/" || r.destination === "/index.html",
    );
    expect(comodines).toEqual([]);
  });

  it("sirve las rutas estáticas sin extensión", () => {
    expect(config.cleanUrls).toBe(true);
  });

  it("redirige la barra final, igual que Express", () => {
    expect(config.trailingSlash).toBe(false);
  });

  it("manda cada ruta dinámica al shell", () => {
    for (const ruta of RUTAS_DINAMICAS) {
      expect(config.rewrites).toContainEqual({ source: ruta, destination: "/spa.html" });
    }
  });

  it("mantiene la API en la función serverless", () => {
    expect(config.rewrites).toContainEqual({ source: "/api/(.*)", destination: "/api" });
  });
});
```

En `vitest.config.ts`, añade `"server/**/*.test.ts"` a `include`, y en el comentario de cabecera cambia «no hay tests de componentes todavía» por «sin tests de componentes; `server/` se prueba levantando Express en un puerto libre».

- [ ] **Step 2: Comprobar que fallan**

Run: `npx vitest run server/`
Expected: FAIL. `static.test.ts` no resuelve `./static`. `vercel.test.ts` falla en «comodín» (el rewrite `/(.*)` → `/` sigue ahí), en `cleanUrls` y en el shell.

- [ ] **Step 3: `server/static.ts`**

```ts
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { RUTAS_DINAMICAS } from "../client/src/lib/rutas";

/**
 * Sirve el build en producción con las mismas reglas que `vercel.json`:
 *
 * - `/` y cada ruta estática → su HTML prerenderizado (`blog.html` responde a `/blog`)
 * - rutas dinámicas (`/blog/:slug`) → `spa.html`, el shell que carga el cliente
 * - todo lo demás → `404.html` con **código 404**
 *
 * Antes cualquier dirección caía en `index.html` con 200: para un buscador, el
 * sitio tenía infinitas páginas iguales a la home.
 */
export function serveStatic(
  app: Express,
  distPath = path.resolve(import.meta.dirname, "public"),
) {
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Como `trailingSlash: false` en Vercel: `/blog/` redirige a `/blog`.
  app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith("/")) {
      const consulta = req.url.slice(req.path.length);
      res.redirect(308, req.path.replace(/\/+$/, "") + consulta);
      return;
    }
    next();
  });

  app.use(express.static(distPath, { extensions: ["html"] }));

  for (const ruta of RUTAS_DINAMICAS) {
    app.get(ruta, (_req, res) => {
      res.sendFile(path.resolve(distPath, "spa.html"));
    });
  }

  app.use("*", (_req, res) => {
    res.status(404).sendFile(path.resolve(distPath, "404.html"));
  });
}
```

- [ ] **Step 4: Cablearlo**

- En `server/vite.ts`, borra la función `serveStatic` entera y el import de `express` si queda sin uso (`type Express` se sigue usando en `setupVite`).
- En `server/index.ts`, cambia `import { setupVite, serveStatic, log } from "./vite";` por:

```ts
import { serveStatic } from "./static";
import { setupVite, log } from "./vite";
```

- [ ] **Step 5: `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/blog/:slug", "destination": "/spa.html" }
  ]
}
```

Sin el comodín, Vercel sirve primero los archivos que existen (`cleanUrls` resuelve `/blog` → `blog.html`), después aplica los rewrites, y lo que no encaja en nada recibe `404.html` con código 404.

- [ ] **Step 6: Comprobar que pasan**

Run: `npx vitest run server/`
Expected: PASS, 10 tests.

- [ ] **Step 7: Probar el servidor de producción de verdad**

```bash
npm run build
PORT=5002 npm start &
sleep 3
for r in / /blog /podcast /plataforma /blog/el-poder-del-podcasting-para-las-asociaciones /no-existe /Blog/ /sitemap.xml /robots.txt /api/health; do
  printf "%-60s %s\n" "$r" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:5002$r")"
done
curl -s http://localhost:5002/no-existe | grep -o "<title>[^<]*</title>"
kill %1
```

(En PowerShell: `$env:PORT=5002; $env:NODE_ENV="production"; node dist/index.js`, en una ventana aparte, y `curl.exe` para las peticiones.)

Expected: 200 en `/`, `/blog`, `/podcast`, `/plataforma`, el artículo, `/sitemap.xml`, `/robots.txt` y `/api/health`. **308** en `/Blog/` (hacia `/Blog`) y **404** en `/no-existe`. El título del 404 es «Página no encontrada · ASPAL».

- [ ] **Step 8: Puertas y commit**

```bash
npx prettier --write server/static.ts server/static.test.ts server/vercel.test.ts server/vite.ts server/index.ts vercel.json vitest.config.ts
npm run check && npm run lint && npm run format:check && npm test
git add server/static.ts server/static.test.ts server/vercel.test.ts server/vite.ts server/index.ts vercel.json vitest.config.ts
git commit -m "Responder 404 de verdad a las rutas inexistentes, en Express y en Vercel"
```

---

### Task 7: Documentar el flujo y cerrar el PR B

**Files:**

- Modify: `CLAUDE.md`, `docs/architecture.md`

**Interfaces:**

- Consumes: Tasks 1–6.
- Produces: la documentación que leen los agentes de los PR C, E y F.

- [ ] **Step 1: `CLAUDE.md`**

En la convención de rutas (la línea que empieza por «Rutas con `wouter`»), añade al final de la frase: «y su título y descripción en `SEO` de `client/src/lib/seo.ts` (también lo exige TypeScript)». En «Comandos», cambia el comentario de `npm run build` por `# cliente -> dist/public, prerender por ruta, servidor -> dist/`. En «Verificar el trabajo», añade tras los `curl`:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5001/no-existe   # en dev: 200 (Vite); en build: 404
```

y una frase: «El 404 real solo existe en el build (`npm run build && PORT=5002 npm start`); el servidor de desarrollo de Vite responde 200 a todo.»

- [ ] **Step 2: `docs/architecture.md`**

En «Despliegue», sustituye la lista de `vercel.json` por:

```markdown
- `buildCommand`: `npm run build`. Son dos builds de Vite (cliente y `--ssr`) más
  `scripts/prerender.mjs`, que escribe un HTML por ruta estática, `404.html`,
  `spa.html`, `sitemap.xml` y `robots.txt`.
- `outputDirectory`: `dist/public`
- `cleanUrls`: `/blog` sirve `blog.html`
- `/api/(.*)` → la función serverless
- `/blog/:slug` → `spa.html` (el shell vacío; el cliente carga el artículo)
- Todo lo demás → `404.html` con código 404. Ya no hay fallback de SPA.

Express en producción (`server/static.ts`) aplica las mismas reglas.
```

- [ ] **Step 3: Puertas completas y build**

```bash
npx prettier --write CLAUDE.md docs/architecture.md
npm run check && npm run lint && npm run format:check && npm test && npm run build
```

Expected: verde, con 35 tests nuevos (1 de `marca`, 12 de `seo`, 12 de `sugerencias`, 5 de `static` y 5 de `vercel`). Vitest pasa de 74 a 109.

- [ ] **Step 4: Verificación en el navegador (la hace el controlador)**

Primero con el build (`PORT=5002 npm start`): `/`, `/blog`, un artículo, `/Blog/` y `/nosotros`, a 375, 768, 1024 y 1440 px. Después, con JavaScript desactivado, `/blog` y `/no-existe`: se ven el H1 y el texto, y el 404 no muestra ninguna «Dirección solicitada».

- [ ] **Step 5: Commit e integración (local)**

```bash
git add CLAUDE.md docs/architecture.md
git commit -m "Documentar el prerender y el 404 real"
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/b-seo-prerender -m "PR B: SEO por ruta, prerender y 404 real"
```

---

## Qué queda fuera y a quién le toca

- **Pie de página invisible sin JavaScript.** `Footer.tsx` entra con `whileInView` y `opacity: 0`, así que en el HTML prerenderizado queda a opacidad 0. Lo resuelve el **PR C**, que reescribe el pie, siguiendo la regla de no animar la opacidad del contenido.
- **La home SaaS prerenderizada sale casi toda a opacidad 0** (103 elementos de framer-motion). Es transitorio hasta el **PR F**, que la sustituye.
- **Redirecciones de URLs antiguas (RF-17).** No hay una lista de URLs antiguas conocidas; el 404 con sugerencia cubre las erratas. Cuando aparezca la lista, van como `redirects` en `vercel.json` y un `app.get` en `server/static.ts`.
- **`/blog/:slug` de un artículo que no existe** responde 200 con el shell, y el cliente muestra su aviso de no encontrado (un «soft 404»). Evitarlo exigiría consultar WordPress en el borde, y eso no entra en esta etapa.
- **La configuración de Vercel solo se valida en un preview.** Aquí no hay CLI de Vercel, y el push lo decide Antonio. El Task 6 prueba las mismas reglas en Express y fija `vercel.json` con un test. Tras el primer despliegue a preview hay que comprobar: `curl -I <preview>/no-existe` → 404, `<preview>/blog` → 200 y un artículo recargado → 200.
