---
title: PR F de la Etapa 1 — Home institucional, /mapa-de-ruta, imágenes y opacidad
type: feat
status: active
date: 2026-09-29
---

# PR F de la Etapa 1: home institucional y Mapa de Ruta — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir la home de producto por la home institucional de 8 bandas (§6.1) y publicar `/mapa-de-ruta` con las 7 etapas y 23 pasos de la guía oficial de ASPAL (§6.5). Además, dejar `/plataforma` legible sin JavaScript, pasar a WebP las imágenes pesadas y cerrar el enlace «Saltar al contenido» (RF-14).

**Architecture:** El copy del Mapa de Ruta vive en un módulo tipado, `client/src/content/institucional/mapa-ruta.ts`, igual que el de Nosotros. Lo consumen `/mapa-de-ruta` (completo) y la franja de etapas de la home. La home (`pages/inicio.tsx`) se arma con los componentes que ya existen: `HeroInstitucional`, `Banda`, `PilarCard`, `MuroAliados`, `FormSuscripcion`, `BlogCard` y `PodcastCard`. Solo hay tres componentes nuevos: `IndiceEtapas`, `EtapaMapa` y `ContenidoReciente`. Dos puertas nuevas en el build impiden que vuelvan los problemas que este PR cierra:

- el prerender aborta si una página sale con contenido a `opacity:0` o sin `id="contenido"`;
- `check-assets` aborta si hay un asset huérfano o una imagen de más de 250 KB.

**Tech Stack:** React 18, wouter, TanStack Query, Tailwind (tokens del PR A), lucide-react y Vitest (entorno `node`). Dependencia nueva, solo de desarrollo: `sharp`, para la conversión única a WebP.

**Spec:** `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md`: §6.1, §6.5, RF-10, RF-12, RF-13, RF-14 y RF-15. Plan padre: `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md` (fila F de la hoja de ruta, y la corrección 6 sobre `CLAUDE.md`). Pendientes heredados: plan del PR B, «Qué queda fuera», punto 2 (`/plataforma` a opacidad 0).

**Fuente del Mapa de Ruta** (el plan de la etapa lo daba como insumo pendiente de la CG; ya existe publicado):

- Guía de 16 páginas: `https://comunidad.asociacionesprofesionales.org/wp-content/uploads/2024/05/Mapa-de-Ruta-para-Organizaciones-Profesionales-ASPAL.pdf` (8,2 MB, rasterizada). La transcripción literal está en el Task 1.
- Infografía de una página: `https://comunidad.asociacionesprofesionales.org/wp-content/uploads/2024/07/mapa-de-ruta-organizaciones-profesionales-ASPAL.pdf` (286.771 bytes). Es la que se sirve como descarga.
- **No usar** `mapa-de-ruta.pdf` de Descargas: es el Mapa de Ruta de la **ANPR** para parques y espacios públicos, no el de ASPAL.

## Global Constraints

- `CLAUDE.md` manda. UI, comentarios e identificadores en español.
- **Solo commits locales, nunca `git push`.** Rama de trabajo: `etapa1/f-home-mapa`, creada desde `feat/etapa-1-institucional`. En el Task 7 se integra de vuelta con `--no-ff`.
- Puertas antes de cada commit: `npm run check`, `npm run lint` (0 errores), `npm run format:check` y `npm test`. En los Tasks 4 a 7, además `npm run build`: ahí viven las puertas del prerender y de los assets.
- **Copy literal de sus fuentes.** El del Mapa sale de la guía oficial y el de la home, del Concepto NOSOTROS ya transcrito en `nosotros.ts`. Nada se reescribe. Las únicas correcciones del Mapa son erratas mecánicas y se listan en el Task 1. Lo que falta (fotos, pre-anuncio del Encuentro, la cifra «22 organizaciones») queda como `// PENDIENTE:` y no se inventa.
- **D7 sigue abierta:** `ANIO_FUNDACION` no se toca.
- **D10 (pre-anuncio del Encuentro CDMX 2027) no está aprobada.** La home usa la alternativa de la §6.1: eventos «Próximamente» con enlace a `/eventos`.
- **D9 sigue abierta:** el contenido reciente usa `BlogCard` y `PodcastCard` tal cual (título, imagen, extracto y fecha), igual que `/blog`.
- Sin animaciones de opacidad en el contenido, un solo `<h1>` por página, encabezados sin saltos, objetivos de al menos 44 px y `data-testid` en todo lo interactivo.
- Un enlace a otro dominio lleva ↗, `target="_blank"` y `AvisoPestanaNueva`. Los eventos de analítica usan la lista cerrada de `analitica.ts`, sin eventos nuevos.
- Puerto de desarrollo 5001; para el build, `PORT=5002 npm start`.

## Review Focus

1. **La API de WordPress caída o lenta al cargar la home.** El bloque de contenido reciente se oculta y el resto de la página no se entera; mientras carga, muestra un esqueleto que no es texto invisible. Lo cubre el Task 3 con la función pura `vistaReciente` y sus tests: pendiente, error, vacío y mixto.
2. **Enlace profundo a `/mapa-de-ruta#etapa-6`, desde la home, desde fuera o al recargar.** Tiene que llegar a la etapa. Lo cubren el Task 1 (el test exige ids `etapa-1` a `etapa-7`, únicos) y el Task 2 (comprobación en navegador de la llegada desde fuera y del F5; `ScrollRestoration` ya resuelve las anclas desde el PR E2).
3. **Leer `/`, `/mapa-de-ruta` y `/plataforma` sin JavaScript** (buscadores, conexión lenta, JS bloqueado). Nada puede quedar a opacidad 0. Lo cubre el Task 4: una puerta en `prerender.mjs` rompe el build.
4. **La franja de 7 etapas y los nombres largos** («Operaciones y Administración», «Extensión y Política Pública») a 375 y 1024 px. Sin scroll horizontal ni texto cortado. Lo cubren el Task 2 (rejilla de 2 → 4 → 7 columnas) y la pasada de navegador del Task 7.
5. **Un post o un episodio sin imagen destacada.** No puede salir una imagen rota ni una petición a `/placeholder-podcast.jpg`, que no existe. Lo cubre el Task 3: `PodcastCard` pinta la imagen solo si la hay, como ya hace `BlogCard`. Se comprueba con `grep` en el Step 7 del Task 3.

## Decisiones de este plan (rulings)

| #   | Decisión                                                                                                                                                                                                                       | Por qué                                                                                                                                                                | Coste si es errónea                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| F1  | El contenido de las 7 etapas se toma de la guía oficial de 2024 publicada en la comunidad                                                                                                                                      | Es el único Mapa de Ruta de ASPAL que existe, y el sitio de la comunidad lo ofrece hoy («Descarga gratis»). La §6.5 pedía que lo entregara la CG                       | La CG ajusta textos en `mapa-ruta.ts`: minutos           |
| F2  | Hero de la home sin foto                                                                                                                                                                                                       | No hay fotos reales de eventos en el repo (insumo de la semana 0). Un hero de texto además mejora el LCP                                                               | Añadir la foto: un `<img>` en `inicio.tsx`               |
| F3  | Cifras: 15+ países · 4 pilares · 7 etapas y 23 pasos · meta de 1,000 líderes al 2030. **Se descarta «22 organizaciones analizadas»**                                                                                           | La 22 no tiene fuente en ningún documento del repo y la §6.1 exige cifras verificables. Las otras salen de `nosotros.ts` o se cuentan. La de 1,000 se rotula como meta | Cambiar una fila de `CIFRAS`                             |
| F4  | Banda de eventos genérica con enlace a `/eventos` (D10 no aprobada)                                                                                                                                                            | Es la alternativa que la propia §6.1 prevé                                                                                                                             | Sustituir el texto por el pre-anuncio                    |
| F5  | Solo WebP; sin AVIF                                                                                                                                                                                                            | Todo navegador en uso lo soporta. AVIF duplicaría cada archivo y obligaría a `<picture>` para un ahorro marginal sobre el objetivo de RF-15 (Lighthouse ≥ 72)          | Añadir AVIF más tarde con el mismo script                |
| F6  | La home vive en `pages/inicio.tsx`                                                                                                                                                                                             | `home.tsx` se mudó a `plataforma.tsx` en el PR A. «Inicio» es el nombre en español de la ruta                                                                          | Renombrar un archivo                                     |
| F7  | Se incluye «Saltar al contenido» (RF-14, Task 6), que no tenía dueño en ningún PR                                                                                                                                              | El PR F es el último de la etapa, y el Task 6 añade el `<main>` que `/blog`, `/blog/:slug`, `/podcast` y `/plataforma` no tienen                                       | Es un task aislado: se puede revertir sin tocar el resto |
| F8  | Erratas corregidas en el copy del Mapa: dobles espacios, punto final que faltaba (cierre de la etapa 2 y línea del paso 23), «una área» → «un área» y «las principales estratégicas» → «las principales estrategias». Nada más | Son erratas tipográficas o gramaticales evidentes. Se listan aquí para que la CG las vea                                                                               | Volver al texto de la guía en `mapa-ruta.ts`             |
| F9  | Los pasos usan el nombre de la tarjeta, no el del cuerpo. Por ejemplo, «Yo Directora / Director» y no «Rol del Director(a)»                                                                                                    | La tarjeta es el nombre del paso en ambas versiones de la guía; el título del cuerpo es un encabezado de párrafo                                                       | Cambiar un `nombre`                                      |

---

## Mapa de archivos

| Archivo                                                                                                                  | Responsabilidad                                                    | Task |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---- |
| `client/src/content/institucional/mapa-ruta.ts`                                                                          | Copy del Mapa: 7 etapas, 23 pasos, textos de la página             | 1    |
| `client/src/content/institucional/mapa-ruta.test.ts`                                                                     | Estructura del Mapa y existencia del PDF                           | 1    |
| `client/public/mapa-de-ruta-aspal.pdf`                                                                                   | Infografía descargable (286.771 bytes)                             | 1    |
| `client/src/components/institucional/IndiceEtapas.tsx`                                                                   | Lista de las 7 etapas (franja de la home e índice de la página)    | 2    |
| `client/src/components/institucional/EtapaMapa.tsx`                                                                      | Una etapa: pasos, cierre y navegación a la anterior y la siguiente | 2    |
| `client/src/pages/mapa-de-ruta.tsx`                                                                                      | Página `/mapa-de-ruta`                                             | 2    |
| `client/src/lib/rutas.ts`, `client/src/App.tsx`, `client/src/lib/seo.ts`, `client/src/lib/navegacion.ts`                 | Alta de la ruta, SEO y enlace del menú (Recursos › Aprende)        | 2, 3 |
| `client/src/content/institucional/inicio.ts`                                                                             | Cifras y texto de eventos de la home                               | 3    |
| `client/src/lib/contenido-reciente.ts` (+ `.test.ts`)                                                                    | `vistaReciente`: cargando, oculta o lista                          | 3    |
| `client/src/components/content/ContenidoReciente.tsx`                                                                    | Banda de 3 artículos + último episodio                             | 3    |
| `client/src/components/content/PodcastCard.tsx`, `client/src/pages/podcast.tsx`                                          | Usar `TransformedPost`; sin imagen rota                            | 3    |
| `client/src/pages/inicio.tsx`                                                                                            | Home institucional de 8 bandas                                     | 3    |
| `client/src/components/institucional/MuroAliados.tsx`                                                                    | `pendientes` opcional                                              | 3    |
| `client/src/pages/eventos.tsx`                                                                                           | Usa el texto compartido de `inicio.ts`                             | 3    |
| `CLAUDE.md`, `docs/architecture.md`                                                                                      | La home ya consume la API                                          | 3    |
| `scripts/prerender.mjs`                                                                                                  | Puerta: sin `opacity:0` (T4) y con `id="contenido"` (T6)           | 4, 6 |
| `client/src/components/sections/{HeroSection,ProblemSection,FeaturesGrid,LogoCarousel,CTASection,CommunityGraphics}.tsx` | Sin animación de opacidad                                          | 4    |
| `scripts/check-assets.mjs`, `scripts/imagenes.mjs`, `package.json`                                                       | Huérfanos, límite de peso, conversión a WebP                       | 5    |
| `client/src/assets/**`                                                                                                   | WebP nuevos; PNG pesados y huérfanos fuera                         | 5    |
| `client/src/pages/plataforma.tsx`, `client/src/components/sections/HeroSection.tsx`, `PerfilCard.tsx`, `not-found.tsx`   | Imports `.webp` con `width`, `height` y `loading`                  | 5    |
| `client/src/components/layout/SaltarAlContenido.tsx`                                                                     | Enlace «Saltar al contenido»                                       | 6    |
| `client/src/pages/*.tsx`                                                                                                 | `<main id="contenido" tabIndex={-1}>` en todas                     | 6    |

---

## Análisis de conflictos entre tasks

| Tasks    | Comparten                               | Produce → consume                                                          | Resultado                                                                                       |
| -------- | --------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1 → 2    | `mapa-ruta.ts`                          | `ETAPAS`, `MAPA_RUTA`, tipos `EtapaMapa`/`PasoMapa` → componentes y página | Los nombres fijados en el Interfaces del Task 1                                                 |
| 1 → 3    | `mapa-ruta.ts`                          | `ETAPAS` → `CIFRAS` (cuenta etapas y pasos)                                | Sin conflicto                                                                                   |
| 2 → 3    | `IndiceEtapas`, `seo.ts`, `rutas.ts`    | `IndiceEtapas({ origen: "home" })` → franja de la home                     | El Task 2 crea el componente con ambos orígenes                                                 |
| 3 → 4    | `prerender.mjs`, `/`                    | La home nueva sin opacidad → puerta del Task 4                             | Orden obligatorio: con la home vieja en `/`, la puerta fallaría también ahí. El Task 3 va antes |
| 4 → 5    | `HeroSection.tsx`, `ProblemSection.tsx` | Task 4 quita la opacidad; Task 5 cambia el `<img>`                         | Mismo archivo, distinta zona. Se ejecutan en serie: sin conflicto                               |
| 4 → 6    | `prerender.mjs` (`componer`)            | Dos puertas en la misma función                                            | El Task 6 añade la suya debajo de la del Task 4                                                 |
| 3, 5 → 6 | `pages/*.tsx`                           | El Task 6 toca el `<main>` de todas las páginas                            | Va al final para no chocar con los cambios de contenido                                         |

---

### Task 1: Contenido del Mapa de Ruta y PDF descargable

**Files:**

- Create: `client/src/content/institucional/mapa-ruta.ts`
- Create: `client/src/content/institucional/mapa-ruta.test.ts`
- Create: `client/public/mapa-de-ruta-aspal.pdf`
- Modify: `client/src/content/institucional/contenido.test.ts` (añadir el Mapa a `todo`)

**Interfaces:**

- Consumes: nada.
- Produces:
  - `interface PasoMapa { numero: number; nombre: string; linea: string; descripcion: string[] }`
  - `interface EtapaMapa { numero: number; id: string; nombre: string; resumen: string; pasos: PasoMapa[]; cierre: string }`
  - `const ETAPAS: EtapaMapa[]`, con `id` de `"etapa-1"` a `"etapa-7"`.
  - `const MAPA_RUTA: { titulo; subtitulo; comoUsar; recorrer; checkList; impulsa: { titulo; texto }; pdf: { href: "/mapa-de-ruta-aspal.pdf"; peso: "280 KB" } }`, todo `string`.

- [ ] **Step 0: Crear la rama**

```bash
git switch feat/etapa-1-institucional
git switch -c etapa1/f-home-mapa
```

- [ ] **Step 1: Escribir el test que falla**

`client/src/content/institucional/mapa-ruta.test.ts`:

```ts
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ETAPAS, MAPA_RUTA } from "./mapa-ruta";

const pasos = ETAPAS.flatMap((etapa) => etapa.pasos);

describe("Mapa de Ruta", () => {
  it("tiene las 7 etapas en orden, cada una con su ancla etapa-N", () => {
    expect(ETAPAS.map((e) => e.numero)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(ETAPAS.map((e) => e.id)).toEqual(ETAPAS.map((e) => `etapa-${e.numero}`));
  });

  it("numera los 23 pasos en orden, sin huecos ni repetidos", () => {
    expect(pasos.map((p) => p.numero)).toEqual(
      Array.from({ length: 23 }, (_, i) => i + 1),
    );
  });

  it("reparte los pasos por etapa como la guía: 4, 4, 4, 3, 3, 4 y 1", () => {
    expect(ETAPAS.map((e) => e.pasos.length)).toEqual([4, 4, 4, 3, 3, 4, 1]);
  });

  it("no deja textos vacíos, dobles espacios ni marcas de markdown", () => {
    const textos = [
      ...Object.values(MAPA_RUTA).flatMap((v) =>
        typeof v === "string" ? [v] : Object.values(v),
      ),
      ...ETAPAS.flatMap((e) => [e.nombre, e.resumen, e.cierre]),
      ...pasos.flatMap((p) => [p.nombre, p.linea, ...p.descripcion]),
    ];
    for (const texto of textos) {
      expect(texto.trim(), texto).not.toBe("");
      expect(texto, texto).not.toMatch(/\s{2}|\*|_/);
    }
  });

  it("cierra con punto cada párrafo y cada cierre de etapa", () => {
    for (const etapa of ETAPAS) expect(etapa.cierre, etapa.id).toMatch(/\.$/);
    for (const paso of pasos) {
      for (const parrafo of paso.descripcion) expect(parrafo, paso.nombre).toMatch(/\.$/);
    }
  });

  it("sirve el PDF desde el propio dominio", () => {
    const archivo = path.resolve(
      import.meta.dirname,
      "../../../public",
      MAPA_RUTA.pdf.href.slice(1),
    );
    expect(existsSync(archivo)).toBe(true);
    expect(statSync(archivo).size).toBeLessThan(400 * 1024);
  });
});
```

- [ ] **Step 2: Ejecutarlo y ver que falla**

Run: `npx vitest run client/src/content/institucional/mapa-ruta.test.ts`
Expected: FAIL, `Cannot find module './mapa-ruta'`.

- [ ] **Step 3: Escribir el módulo de contenido**

`client/src/content/institucional/mapa-ruta.ts`:

```ts
/**
 * Mapa de Ruta para Organizaciones Profesionales (§6.5 del plan de la Etapa 1).
 *
 * Copy literal de la guía oficial de ASPAL (2024), publicada en la comunidad:
 * la versión de 16 páginas (…/uploads/2024/05/Mapa-de-Ruta-para-Organizaciones-
 * Profesionales-ASPAL.pdf) y la infografía de una página (…/uploads/2024/07/
 * mapa-de-ruta-organizaciones-profesionales-ASPAL.pdf), que es la que se
 * descarga. Solo se corrigieron erratas mecánicas; están listadas en el plan
 * del PR F (decisión F8). Lo usan /mapa-de-ruta y la franja de la home.
 */

export interface PasoMapa {
  /** Numeración continua de la guía, del 1 al 23. */
  numero: number;
  nombre: string;
  /** La línea corta de la tarjeta. */
  linea: string;
  /** Uno o dos párrafos del cuerpo de la guía. */
  descripcion: string[];
}

export interface EtapaMapa {
  numero: number;
  /** Ancla de /mapa-de-ruta: `etapa-N`. */
  id: string;
  nombre: string;
  /** Línea del índice de etapas de la guía. */
  resumen: string;
  pasos: PasoMapa[];
  /** Frase en negrita con que la guía cierra la etapa. */
  cierre: string;
}

export const MAPA_RUTA = {
  titulo: "Mapa de Ruta para Organizaciones Profesionales",
  subtitulo:
    "Guía práctica sobre las etapas de gestión de una asociación o sociedad profesional.",
  comoUsar:
    "Este mapa de ruta se divide en etapas, cada etapa se divide en pasos y cada paso es un área prioritaria para lograr una gestión integral de tu organización.",
  recorrer:
    "Para profundizar en cada una de las etapas puedes recorrer el mapa de principio a fin.",
  checkList:
    "Si eres Miembro Premium, también puedes consultar dentro de la Comunidad en Línea de Asociaciones y Sociedades Profesionales los check list correspondientes a cada etapa y pasos.",
  impulsa: {
    titulo: "Impulsa tu Organización con Nuestro Mapa de Ruta",
    texto:
      "Encuentra dentro de nuestra comunidad recursos y herramientas que te ayuden a llevar a tu organización al siguiente nivel.",
  },
  pdf: { href: "/mapa-de-ruta-aspal.pdf", peso: "280 KB" },
} as const;

export const ETAPAS: EtapaMapa[] = [
  {
    numero: 1,
    id: "etapa-1",
    nombre: "Gestión",
    resumen: "Liderazgo, estructura, misión / visión y gobernanza",
    pasos: [
      {
        numero: 1,
        nombre: "Yo Directora / Director",
        linea: "Rol, responsabilidades y desarrollo profesional",
        descripcion: [
          "El director de una asociación lidera y toma decisiones estratégicas, enfocándose en alinear los objetivos y la misión de la organización, además de su desarrollo personal y profesional.",
        ],
      },
      {
        numero: 2,
        nombre: "Mi Organización",
        linea: "Estructura, funcionamiento y alcances",
        descripcion: [
          "Una asociación es una entidad formada por personas con intereses comunes, organizando actividades y gestionando recursos eficientemente mediante una estructura definida.",
        ],
      },
      {
        numero: 3,
        nombre: "Misión y Visión",
        linea: "Definición, construcción e importancia",
        descripcion: [
          "Las declaraciones de misión y visión son cruciales, delineando el propósito y las aspiraciones futuras de la asociación y dirigiendo todas sus actividades y decisiones.",
        ],
      },
      {
        numero: 4,
        nombre: "Gobernanza",
        linea: "Estructura, roles y políticas clave",
        descripcion: [
          "La estructura de gobernanza incluye roles específicos y políticas clave para asegurar la transparencia y eficiencia de la asociación, respondiendo a las necesidades de sus miembros.",
        ],
      },
    ],
    cierre:
      "Estos componentes son esenciales para la fundación y/o gestión efectiva de una asociación, garantizando su estructura, liderazgo y guía.",
  },
  {
    numero: 2,
    id: "etapa-2",
    nombre: "Estrategia y Planeación",
    resumen: "Planeación estratégica, plan y modelo de negocios y certificación",
    pasos: [
      {
        numero: 5,
        nombre: "Planeación Estratégica",
        linea: "Procesos y herramientas para la planeación",
        descripcion: [
          "Procesos y herramientas diseñados para establecer objetivos a largo plazo y determinar las mejores estrategias para alcanzarlos. Esta fase es crucial para alinear los recursos y esfuerzos de la asociación con su visión y metas futuras.",
        ],
      },
      {
        numero: 6,
        nombre: "Plan de Negocios",
        linea: "Objetivos, estrategias, mercado y finanzas",
        descripcion: [
          "Desarrollo y ejecución de la estrategia de la asociación; describe la estructura organizativa, estrategias de mercado y proyecciones financieras. Es una herramienta fundamental para dirigir el negocio y atraer recursos e inversión.",
        ],
      },
      {
        numero: 7,
        nombre: "Modelo de Negocios",
        linea: "Oferta actual y potencial de productos y servicios",
        descripcion: [
          "Consiste en el análisis y definición de la oferta actual de productos y servicios y la exploración de oportunidades para expandir o mejorar esta oferta. Este modelo ayuda a determinar cómo la asociación genera valor para sus miembros.",
        ],
      },
      {
        numero: 8,
        nombre: "Certificación",
        linea: "Reconocimiento sobre estándares y conocimientos específicos",
        descripcion: [
          "Este proceso valida las competencias y cumplimiento de estándares dentro de la industria, proporcionando reconocimiento formal. Las certificaciones pueden mejorar la credibilidad y abrir nuevas oportunidades comerciales.",
        ],
      },
    ],
    cierre:
      "Cada uno de estos elementos juega un papel fundamental en la consolidación de una estrategia cohesiva que guíe a la asociación hacia el logro de sus objetivos a largo plazo.",
  },
  {
    numero: 3,
    id: "etapa-3",
    nombre: "Operaciones y Administración",
    resumen: "Finanzas, recursos humanos, legal, riesgo, inclusión y diversidad",
    pasos: [
      {
        numero: 9,
        nombre: "Manejo Financiero",
        linea: "Gestión financiera, presupuestos y reportes",
        descripcion: [
          "Enfocado en los principios básicos de la gestión financiera, incluyendo la creación de presupuestos y la elaboración de reportes financieros. Esta área es esencial para asegurar la salud económica y la sostenibilidad de la organización.",
        ],
      },
      {
        numero: 10,
        nombre: "Recursos Humanos",
        linea: "Personal, cultura organizacional y liderazgo",
        descripcion: [
          "Se centra en la gestión efectiva del personal, el desarrollo de una cultura organizacional positiva y el fortalecimiento del liderazgo. Estos aspectos son clave para maximizar la productividad y el bienestar del equipo.",
        ],
      },
      {
        numero: 11,
        nombre: "Legal y Riesgo",
        linea: "Responsabilidad legal y manejo del riesgo",
        descripcion: [
          "Implica la comprensión y el manejo de las obligaciones legales de la asociación, así como la identificación y mitigación de riesgos potenciales. Es vital para proteger a la organización de posibles litigios y otras complicaciones legales.",
        ],
      },
      {
        numero: 12,
        nombre: "Inclusión y Diversidad",
        linea: "Implementación de políticas de inclusión y diversidad",
        descripcion: [
          "Es la implementación y promoción de políticas que fomenten un ambiente inclusivo y diverso. Estas políticas enriquecen la organización, mejoran la innovación y aseguran el respeto y la equidad entre todos los miembros y personal.",
        ],
      },
    ],
    cierre:
      "Cada uno de estos componentes contribuye al funcionamiento eficiente y ético de la organización, facilitando su operación diaria y asegurando su cumplimiento con normativas y expectativas sociales.",
  },
  {
    numero: 4,
    id: "etapa-4",
    nombre: "Mkt, T.I. y Comunicación",
    resumen: "Marca, digitalización, publicidad, comunicación y relaciones públicas",
    pasos: [
      {
        numero: 13,
        nombre: "Branding e Imagen",
        linea: "Estrategias para el desarrollo y gestión de la marca",
        descripcion: [
          "Estrategias para crear y gestionar la identidad de marca de la organización. Esto incluye el desarrollo de una imagen coherente y atractiva que refleje los valores y objetivos de la asociación, vital para fortalecer la percepción y el reconocimiento en el mercado.",
        ],
      },
      {
        numero: 14,
        nombre: "Digitalización y T.I.",
        linea:
          "Integración de tecnologías digitales para la profesionalización y promoción",
        descripcion: [
          "Este elemento aborda la adopción de tecnologías digitales para mejorar los procesos internos y la interacción con los miembros. La digitalización facilita una gestión más eficiente y promueve la presencia de la organización en plataformas digitales, expandiendo su alcance y eficacia operativa.",
          "Entre las principales estrategias se encuentra el uso de comunidades en línea que brindan servicios automatizados a los miembros y la oportunidad de disfrutar de recursos exclusivos que ayudan a mejorar la capacitación y el networking. Las principales herramientas son los foros de discusión, biblioteca digital, directorio de miembros, creación de perfil profesional y cursos en línea.",
        ],
      },
      {
        numero: 15,
        nombre: "Mkt y Comunicación",
        linea: "Promoción, publicidad y relaciones públicas",
        descripcion: [
          "Uso de técnicas avanzadas de marketing y relaciones públicas para promover a la asociación, atraer nuevos miembros y mantener una comunicación efectiva con los stakeholders. Incluye desde campañas publicitarias hasta estrategias de comunicación en redes sociales y eventos, todo orientado a mejorar la visibilidad y el impacto de la organización.",
        ],
      },
    ],
    cierre:
      "Cada uno de estos aspectos es crucial para la proyección externa de la asociación, asegurando que su mensaje llegue de manera efectiva y atractiva a su público objetivo.",
  },
  {
    numero: 5,
    id: "etapa-5",
    nombre: "Membresía y Programas",
    resumen:
      "Prospección, crecimiento y retención. Programas educativos y bolsa de trabajo",
    pasos: [
      {
        numero: 16,
        nombre: "Membresía",
        linea: "Captación, crecimiento, retención y recuperación",
        descripcion: [
          "Se enfoca en definir qué constituye ser miembro de la organización y en desarrollar estrategias efectivas para atraer, comprometer, retener y recuperar miembros. Esto puede incluir tácticas de marketing dirigidas, beneficios exclusivos y programas de lealtad que incentiven la renovación y el compromiso continuo.",
        ],
      },
      {
        numero: 17,
        nombre: "Contenido y Educación",
        linea: "Programas educativos y de contenido",
        descripcion: [
          "Creación y administración de programas educativos y contenido relevante que aporte valor a los miembros. Estos programas pueden variar desde seminarios web y cursos en línea hasta conferencias y talleres, todos diseñados para mantener a los miembros informados, comprometidos y en constante aprendizaje.",
          "También incluye otro tipo de elementos de contenido como pueden ser los blogs, podcast, revistas especializadas y por supuesto el contenido ofertado a través de los eventos de la organización.",
        ],
      },
      {
        numero: 18,
        nombre: "Desarrollo Profesional",
        linea: "Centro profesional de carrera y bolsa de trabajo",
        descripcion: [
          "Se centra en ofrecer oportunidades para el crecimiento profesional continuo de la membresía a través de capacitaciones, certificaciones y otras formas de educación avanzada. El objetivo es apoyar la carrera de los miembros y proporcionarles las herramientas necesarias para avanzar en sus campos respectivos.",
          "Organizaciones modernas pueden ofrecer servicios de centro profesional de carrera a partir del establecimiento de una bolsa de trabajo en donde el ecosistema pueda interactuar a través de ofertas laborales y oportunidades de exponer la experiencia de los miembros a través de un perfil profesional y el currículum u hoja de vida.",
        ],
      },
    ],
    cierre:
      "Estos componentes son esenciales para mantener una base de miembros activa y comprometida, asegurando que la organización sigue siendo relevante y valiosa para sus integrantes.",
  },
  {
    numero: 6,
    id: "etapa-6",
    nombre: "Extensión y Política Pública",
    resumen: "Eventos, patrocinios, donativos, industria y política pública",
    pasos: [
      {
        numero: 19,
        nombre: "Eventos",
        linea: "Planificación y gestión de eventos de la asociación",
        descripcion: [
          "Este aspecto cubre la organización y manejo de eventos para la asociación, desde conferencias y reuniones hasta seminarios y funciones sociales. La planificación eficaz de eventos es fundamental para facilitar la red de contactos entre los miembros, promover la marca de la asociación y proporcionar valor añadido.",
        ],
      },
      {
        numero: 20,
        nombre: "Patrocinios y Donativos",
        linea: "Estrategias para la obtención de fondos y gestión de patrocinadores",
        descripcion: [
          "Involucra el desarrollo de estrategias para atraer financiación a través de patrocinios y donaciones. Esto incluye la identificación de potenciales patrocinadores o donantes, la gestión de relaciones con estos, y la creación de paquetes de patrocinio que ofrezcan beneficios mutuos.",
        ],
      },
      {
        numero: 21,
        nombre: "Relaciones con la Industria",
        linea: "Fomento de alianzas y colaboraciones con proveedores de la industria",
        descripcion: [
          "Se centra en construir y mantener alianzas estratégicas con proveedores y otras entidades relevantes dentro de la industria. Estas colaboraciones pueden ayudar a la asociación a obtener recursos, servicios y apoyo que potencien sus iniciativas y proyectos.",
        ],
      },
      {
        numero: 22,
        nombre: "Política Pública y Abogacía",
        linea: "Involucramiento en asuntos públicos y defensa de intereses",
        descripcion: [
          "Refiere a la participación activa de la asociación en la política pública y la defensa de intereses que afectan a su sector. Esto puede incluir cabildeo, participación en la formulación de políticas y campañas de sensibilización para influir en decisiones que impactan a los miembros y la industria en general.",
        ],
      },
    ],
    cierre:
      "Cada uno de estos componentes juega un papel crucial en la ampliación del alcance y la influencia de la asociación, asegurando que sus intereses y los de sus miembros sean representados y defendidos adecuadamente en un espectro más amplio de actividades y sectores.",
  },
  {
    numero: 7,
    id: "etapa-7",
    nombre: "Evaluación y Mejora Continua",
    resumen: "Evaluación a programas, procesos y estrategias de mejora continua",
    pasos: [
      {
        numero: 23,
        nombre: "Investigación y Evaluación",
        linea: "Métodos para la evaluación de programas y estrategias de mejora continua",
        descripcion: [
          "Este concepto se centra en el uso de métodos sistemáticos para evaluar la efectividad de los programas y estrategias de la asociación. La investigación y evaluación implican recoger y analizar datos para entender el impacto de las actividades realizadas y determinar áreas que requieren mejoras. Estos métodos pueden incluir encuestas, entrevistas, grupos focales y análisis de datos existentes.",
          "El propósito de este proceso es asegurar que la organización no solo mantiene sus estándares de calidad, sino que también busca oportunidades para optimizar sus operaciones y aumentar el valor que ofrece a sus miembros.",
          "La mejora continua se logra identificando los éxitos y fallos de las iniciativas actuales, adaptando las estrategias de acuerdo a los resultados obtenidos y desarrollando nuevas prácticas que respondan mejor a las necesidades y expectativas de los miembros y stakeholders.",
        ],
      },
    ],
    cierre:
      "La investigación y evaluación son esenciales para el crecimiento sostenido y la relevancia a largo plazo de la asociación, permitiéndole adaptarse y responder eficazmente a un entorno cambiante.",
  },
];
```

- [ ] **Step 4: Descargar el PDF al propio dominio**

```bash
curl -sSf -o client/public/mapa-de-ruta-aspal.pdf "https://comunidad.asociacionesprofesionales.org/wp-content/uploads/2024/07/mapa-de-ruta-organizaciones-profesionales-ASPAL.pdf"
wc -c client/public/mapa-de-ruta-aspal.pdf
```

Expected: `286771 client/public/mapa-de-ruta-aspal.pdf`. Si el tamaño no coincide o `curl` falla, para e informa: no sirvas otro archivo.

- [ ] **Step 5: Sumar el Mapa al test de contenido compartido**

En `client/src/content/institucional/contenido.test.ts`, añade `import { ETAPAS, MAPA_RUTA } from "./mapa-ruta";` y, dentro del array `todo`, `...cadenas(ETAPAS), ...cadenas(MAPA_RUTA),`. Así el Mapa pasa también por el filtro de `TBD`, `lorem` y corchetes.

- [ ] **Step 6: Ejecutar los tests**

Run: `npx vitest run client/src/content/institucional`
Expected: PASS (el test nuevo y `contenido.test.ts`).

- [ ] **Step 7: Puertas y commit**

```bash
npm run check && npm run lint && npm run format:check && npm test
git add client/src/content/institucional/mapa-ruta.ts client/src/content/institucional/mapa-ruta.test.ts client/src/content/institucional/contenido.test.ts client/public/mapa-de-ruta-aspal.pdf
git commit -m "Transcribir el Mapa de Ruta oficial de ASPAL: 7 etapas y 23 pasos, con su PDF"
```

---

### Task 2: Página `/mapa-de-ruta`

**Files:**

- Create: `client/src/components/institucional/IndiceEtapas.tsx`
- Create: `client/src/components/institucional/EtapaMapa.tsx`
- Create: `client/src/pages/mapa-de-ruta.tsx`
- Modify: `client/src/lib/rutas.ts` (`RUTAS_ESTATICAS`)
- Modify: `client/src/App.tsx` (`PAGINAS`)
- Modify: `client/src/lib/seo.ts` (`SEO`)
- Modify: `client/src/lib/navegacion.ts:196-202` (Mapa de Ruta con `href` y sin el comentario PENDIENTE)
- Test: `client/src/lib/rutas.test.ts`, `client/src/lib/navegacion.test.ts`

**Interfaces:**

- Consumes: `ETAPAS`, `MAPA_RUTA` y `EtapaMapa` (Task 1); `registrarEvento` (`@/lib/analitica`); `Banda` y `HeroInstitucional` (layout); `AvisoPestanaNueva`; `COMUNIDAD` (`@/lib/navegacion`).
- Produces:
  - `IndiceEtapas({ origen }: { origen: "home" | "mapa" })`. Con `"home"`, cada etapa es un `Link` a `/mapa-de-ruta#etapa-N` que registra `click_mapa_ruta { origen: "home_etapa", etapa: N }`. Con `"mapa"`, es un `<a href="#etapa-N">` sin evento. Testids: `indice-etapas-${origen}` en la lista y `etapa-${origen}-${N}` en cada enlace.
  - `EtapaMapa({ etapa, anterior, siguiente }: { etapa: EtapaMapa; anterior?: EtapaMapa; siguiente?: EtapaMapa })`.
  - La ruta `"/mapa-de-ruta"` en `RUTAS_ESTATICAS`.

- [ ] **Step 1: Escribir los tests que fallan**

En `client/src/lib/rutas.test.ts`, dentro de `it("conoce cada ruta estática", …)`, añade `expect(esRutaConocida("/mapa-de-ruta")).toBe(true);`.

En `client/src/lib/navegacion.test.ts`, al final del `describe` principal:

```ts
it("enlaza el Mapa de Ruta desde Recursos › Aprende", () => {
  const mapa = destinos.find((d) => d.testid === "link-mapa-ruta");
  expect(mapa?.href).toBe("/mapa-de-ruta");
});
```

Run: `npx vitest run client/src/lib/rutas.test.ts client/src/lib/navegacion.test.ts`
Expected: FAIL en las dos aserciones nuevas.

- [ ] **Step 2: Dar de alta la ruta, su SEO y el enlace del menú**

`client/src/lib/rutas.ts`: añade `"/mapa-de-ruta"` a `RUTAS_ESTATICAS`, detrás de `"/nosotros"`.

`client/src/lib/seo.ts`, dentro de `SEO` (TypeScript lo exige):

```ts
  "/mapa-de-ruta": {
    titulo: "Mapa de Ruta para Organizaciones Profesionales · ASPAL",
    descripcion:
      "Guía práctica sobre las etapas de gestión de una asociación o sociedad profesional: 7 etapas y 23 pasos, de la gobernanza a la mejora continua.",
    indexable: true,
  },
```

`client/src/lib/navegacion.ts`: en el destino «Mapa de Ruta» borra el comentario `// PENDIENTE (PR F): /mapa-de-ruta.` y añade `href: "/mapa-de-ruta",`. El test «pone los destinos vivos antes que los Próximamente» sigue en verde: Blog, Podcast y Mapa quedan vivos y en ese orden.

- [ ] **Step 3: `IndiceEtapas`**

`client/src/components/institucional/IndiceEtapas.tsx`:

```tsx
import { ETAPAS } from "@/content/institucional/mapa-ruta";
import { registrarEvento } from "@/lib/analitica";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const CLASES_ENLACE =
  "flex h-full min-h-11 flex-col rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Las 7 etapas del Mapa de Ruta como lista ordenada. En la home es la franja
 * que lleva a cada etapa de /mapa-de-ruta. En la propia página es el índice
 * «paso a paso»: salta al ancla y añade el resumen de cada etapa.
 */
export function IndiceEtapas({ origen }: { origen: "home" | "mapa" }) {
  const enPagina = origen === "mapa";
  return (
    <ol
      className={cn(
        "grid gap-3",
        enPagina
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7",
      )}
      data-testid={`indice-etapas-${origen}`}
    >
      {ETAPAS.map((etapa) => {
        const contenido = (
          <>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Etapa {etapa.numero}
            </span>
            <span className="mt-1 text-base font-bold text-foreground">
              {etapa.nombre}
            </span>
            {enPagina && (
              <span className="mt-1 text-sm text-muted-foreground">{etapa.resumen}</span>
            )}
          </>
        );
        const testid = `etapa-${origen}-${etapa.numero}`;
        return (
          <li key={etapa.id}>
            {enPagina ? (
              <a href={`#${etapa.id}`} className={CLASES_ENLACE} data-testid={testid}>
                {contenido}
              </a>
            ) : (
              <Link
                href={`/mapa-de-ruta#${etapa.id}`}
                className={CLASES_ENLACE}
                onClick={() =>
                  registrarEvento("click_mapa_ruta", {
                    origen: "home_etapa",
                    etapa: etapa.numero,
                  })
                }
                data-testid={testid}
              >
                {contenido}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 4: `EtapaMapa`**

`client/src/components/institucional/EtapaMapa.tsx`:

```tsx
import { ETAPAS, type EtapaMapa as Etapa } from "@/content/institucional/mapa-ruta";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CLASES_VECINA =
  "inline-flex min-h-11 items-center gap-2 font-medium text-primary underline underline-offset-4";

/**
 * Una etapa del Mapa de Ruta: sus pasos, la frase de cierre de la guía y
 * enlaces a la etapa anterior y a la siguiente, para recorrer el mapa de
 * principio a fin sin volver al índice.
 */
export function EtapaMapa({
  etapa,
  anterior,
  siguiente,
}: {
  etapa: Etapa;
  anterior?: Etapa;
  siguiente?: Etapa;
}) {
  return (
    <article aria-labelledby={`${etapa.id}-titulo`} data-testid={`seccion-${etapa.id}`}>
      <p className="text-[13px] font-semibold uppercase tracking-wider text-primary">
        Etapa {etapa.numero} de {ETAPAS.length}
      </p>
      <h2
        id={`${etapa.id}-titulo`}
        className="mt-2 text-3xl font-bold text-foreground md:text-4xl"
      >
        {etapa.nombre}
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">{etapa.resumen}</p>

      <ol className="mt-8 grid gap-6 md:grid-cols-2">
        {etapa.pasos.map((paso) => (
          <li
            key={paso.numero}
            className="rounded-2xl border border-border bg-background p-6"
            data-testid={`paso-${paso.numero}`}
          >
            <p className="text-sm font-semibold text-primary">Paso {paso.numero}</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">{paso.nombre}</h3>
            <p className="mt-1 italic text-muted-foreground">{paso.linea}</p>
            {paso.descripcion.map((parrafo) => (
              <p key={parrafo.slice(0, 24)} className="mt-3 text-base text-foreground">
                {parrafo}
              </p>
            ))}
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-3xl border-l-4 border-secondary pl-4 text-lg font-semibold text-foreground">
        {etapa.cierre}
      </p>

      <nav
        aria-label={`Etapas vecinas de ${etapa.nombre}`}
        className="mt-8 flex flex-wrap justify-between gap-4"
      >
        {anterior ? (
          <a
            href={`#${anterior.id}`}
            className={CLASES_VECINA}
            data-testid={`${etapa.id}-anterior`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Etapa {anterior.numero}: {anterior.nombre}
          </a>
        ) : (
          <span />
        )}
        {siguiente && (
          <a
            href={`#${siguiente.id}`}
            className={CLASES_VECINA}
            data-testid={`${etapa.id}-siguiente`}
          >
            Etapa {siguiente.numero}: {siguiente.nombre}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </nav>
    </article>
  );
}
```

- [ ] **Step 5: La página**

`client/src/pages/mapa-de-ruta.tsx`:

```tsx
import { EtapaMapa } from "@/components/institucional/EtapaMapa";
import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { ETAPAS, MAPA_RUTA } from "@/content/institucional/mapa-ruta";
import { registrarEvento } from "@/lib/analitica";
import { COMUNIDAD } from "@/lib/navegacion";
import { ArrowUpRight, Download } from "lucide-react";
import { Link } from "wouter";

const BOTON_MIEL =
  "min-h-11 px-6 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";
const BOTON_CONTORNO =
  "min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";

/**
 * Mapa de Ruta (§6.5): las 7 etapas de la guía oficial en un paso a paso
 * navegable. Índice arriba, una banda por etapa con ancla propia (`#etapa-N`)
 * y enlaces a la etapa anterior y a la siguiente. Los foros por etapa llegan en
 * la Etapa 2 del plan.
 */
export default function MapaDeRuta() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroInstitucional overline="Mapa de Ruta" titulo={MAPA_RUTA.titulo}>
          <p>{MAPA_RUTA.subtitulo}</p>
          <p className="mt-4">{MAPA_RUTA.comoUsar}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className={BOTON_MIEL} asChild>
              <a href="#etapa-1" data-testid="button-mapa-empezar">
                Empieza por la Etapa 1
              </a>
            </Button>
            <Button variant="outline" className={BOTON_CONTORNO} asChild>
              <a
                href={MAPA_RUTA.pdf.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  registrarEvento("click_mapa_ruta", { origen: "descarga_pdf" })
                }
                data-testid="button-mapa-pdf"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Descarga el mapa (PDF, {MAPA_RUTA.pdf.peso})
                <AvisoPestanaNueva />
              </a>
            </Button>
          </div>
        </HeroInstitucional>

        <Banda tono="suave">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Las {ETAPAS.length} etapas
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            {MAPA_RUTA.recorrer}
          </p>
          <div className="mt-8">
            <IndiceEtapas origen="mapa" />
          </div>
        </Banda>

        {ETAPAS.map((etapa, i) => (
          <Banda
            key={etapa.id}
            id={etapa.id}
            tono={i % 2 === 0 ? "blanco" : "suave"}
            className="scroll-mt-16"
          >
            <EtapaMapa etapa={etapa} anterior={ETAPAS[i - 1]} siguiente={ETAPAS[i + 1]} />
          </Banda>
        ))}

        <Banda tono="noche">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold md:text-4xl">{MAPA_RUTA.impulsa.titulo}</h2>
            <p className="mt-4 text-lg text-white/85">{MAPA_RUTA.impulsa.texto}</p>
            <p className="mt-3 text-lg text-white/85">{MAPA_RUTA.checkList}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" className={BOTON_MIEL} asChild>
                <Link
                  href="/unete"
                  onClick={() => registrarEvento("click_unete", { origen: "mapa_ruta" })}
                  data-testid="button-mapa-unete"
                >
                  Únete a la comunidad
                </Link>
              </Button>
              <Button variant="outline" className={BOTON_CONTORNO} asChild>
                <a
                  href={COMUNIDAD}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    registrarEvento("salida_plataforma", {
                      destino: COMUNIDAD,
                      origen: "mapa_ruta",
                    })
                  }
                  data-testid="button-mapa-comunidad"
                >
                  Ir a la comunidad
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <AvisoPestanaNueva />
                </a>
              </Button>
            </div>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

Encabezados: `h1` en el hero; `h2` en «Las 7 etapas», en cada etapa y en la banda final; `h3` en cada paso. No hay saltos.

- [ ] **Step 6: Registrar la página**

`client/src/App.tsx`: `import MapaDeRuta from "@/pages/mapa-de-ruta";` y, en `PAGINAS`, `"/mapa-de-ruta": MapaDeRuta,`.

- [ ] **Step 7: Tests y puertas**

Run: `npm run check && npm run lint && npm run format:check && npm test`
Expected: todo en verde, incluidos los dos tests del Step 1. `seo.test.ts` valida que la descripción nueva mide entre 50 y 160 caracteres.

- [ ] **Step 8: Verificar en el navegador**

Con `PORT=5001 npm run dev`, a 1440 y a 375 px:

1. `/mapa-de-ruta`: hero; índice de 7 etapas (4 columnas en escritorio, 1 en móvil); 7 bandas alternas; banda final noche.
2. Clic en «Etapa 6» del índice: llega a «Extensión y Política Pública», con el título visible bajo el header. Atrás: vuelve arriba (comportamiento del PR E2).
3. Entrar en frío a `http://localhost:5001/mapa-de-ruta#etapa-7` y recargar con F5: llega a la etapa 7.
4. «Descarga el mapa» abre el PDF en una pestaña nueva y `window.dataLayer` recibe `click_mapa_ruta` con `origen: "descarga_pdf"`.
5. Menú › Recursos › Aprende muestra Mapa de Ruta como enlace vivo, sin «Próximamente».
6. Sin scroll horizontal a 375 px (`document.documentElement.scrollWidth === innerWidth`).

- [ ] **Step 9: Commit**

```bash
git add client/src/components/institucional/IndiceEtapas.tsx client/src/components/institucional/EtapaMapa.tsx client/src/pages/mapa-de-ruta.tsx client/src/lib/rutas.ts client/src/lib/rutas.test.ts client/src/App.tsx client/src/lib/seo.ts client/src/lib/navegacion.ts client/src/lib/navegacion.test.ts
git commit -m "Publicar /mapa-de-ruta: índice de etapas, una banda por etapa y descarga del PDF"
```

---

### Task 3: Home institucional

**Files:**

- Create: `client/src/content/institucional/inicio.ts`
- Create: `client/src/lib/contenido-reciente.ts`
- Create: `client/src/lib/contenido-reciente.test.ts`
- Create: `client/src/components/content/ContenidoReciente.tsx`
- Create: `client/src/pages/inicio.tsx`
- Modify: `client/src/components/content/PodcastCard.tsx` (tipo `TransformedPost`, imagen condicional, nombre accesible)
- Modify: `client/src/pages/podcast.tsx` (borrar la interfaz `WPPodcast` redeclarada y usar `TransformedPost`)
- Modify: `client/src/components/institucional/MuroAliados.tsx` (`pendientes` opcional)
- Modify: `client/src/pages/eventos.tsx` (texto desde `inicio.ts`)
- Modify: `client/src/App.tsx` (`"/": Inicio`, sin el comentario PENDIENTE)
- Modify: `client/src/lib/seo.ts` (descripción de `/`, sin el comentario PENDIENTE)
- Modify: `client/src/content/institucional/contenido.test.ts` (cifras)
- Modify: `CLAUDE.md`, `docs/architecture.md`

**Interfaces:**

- Consumes: `ETAPAS` y `MAPA_RUTA` (Task 1); `IndiceEtapas` (Task 2); `PILARES`, `PilarCard` (`variante: "resumen"`), `HERO_NOSOTROS`, `HASHTAG`, `CTA_FINAL`, `ALIADOS_FUNDADORES`, `MuroAliados`, `FormSuscripcion` (`origen: "home"`, `variante: "compacto"`, `tono: "noche"`), `BlogCard` (`post: TransformedPost`) y `registrarEvento`.
- Produces:
  - `interface Cifra { valor: string; etiqueta: string }`, `const CIFRAS: Cifra[]` y `const TEXTO_EVENTOS: string`, en `inicio.ts`.
  - `interface EstadoConsulta { pendiente: boolean; error: boolean; cantidad: number }`.
  - `type VistaReciente = "cargando" | "oculta" | "lista"`.
  - `function vistaReciente(...consultas: EstadoConsulta[]): VistaReciente`.
  - `ContenidoReciente()`: renderiza su propia `Banda` o `null`.
  - `PodcastCard({ podcast }: { podcast: TransformedPost; episodeNumber?: number })`.

- [ ] **Step 1: Escribir los tests que fallan**

`client/src/lib/contenido-reciente.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { vistaReciente, type EstadoConsulta } from "./contenido-reciente";

const pendiente: EstadoConsulta = { pendiente: true, error: false, cantidad: 0 };
const fallo: EstadoConsulta = { pendiente: false, error: true, cantidad: 0 };
const vacia: EstadoConsulta = { pendiente: false, error: false, cantidad: 0 };
const conDatos: EstadoConsulta = { pendiente: false, error: false, cantidad: 3 };

describe("vistaReciente (RF-13)", () => {
  it("muestra el esqueleto mientras alguna consulta sigue pendiente", () => {
    expect(vistaReciente(pendiente, pendiente)).toBe("cargando");
    expect(vistaReciente(conDatos, pendiente)).toBe("cargando");
  });

  it("oculta el bloque si todas fallan", () => {
    expect(vistaReciente(fallo, fallo)).toBe("oculta");
  });

  it("oculta el bloque si no hay nada que mostrar, haya fallo o no", () => {
    expect(vistaReciente(vacia, vacia)).toBe("oculta");
    expect(vistaReciente(vacia, fallo)).toBe("oculta");
  });

  it("muestra lo que sí llegó aunque la otra consulta falle", () => {
    expect(vistaReciente(conDatos, fallo)).toBe("lista");
    expect(vistaReciente(fallo, { ...conDatos, cantidad: 1 })).toBe("lista");
  });
});
```

En `client/src/content/institucional/contenido.test.ts`, importa `CIFRAS` y `TEXTO_EVENTOS` desde `./inicio`, añádelos a `todo` (`...cadenas(CIFRAS), TEXTO_EVENTOS`) y agrega:

```ts
it("da a la home cuatro cifras que el sitio respalda", () => {
  expect(CIFRAS.map((c) => c.valor)).toEqual(["15+", "4", "7", "1,000"]);
  expect(CIFRAS[2].etiqueta).toContain("23 pasos");
  expect(CIFRAS[3].etiqueta).toMatch(/meta/i);
});
```

Run: `npx vitest run client/src/lib/contenido-reciente.test.ts client/src/content/institucional`
Expected: FAIL, porque no existen los módulos.

- [ ] **Step 2: Contenido de la home y `vistaReciente`**

`client/src/content/institucional/inicio.ts`:

```ts
/**
 * Textos propios de la home (§6.1). Hero, pilares, aliados y cierre reutilizan
 * los de `nosotros.ts` y `pilares.ts`; aquí solo va lo que no existe en otro
 * sitio.
 */
import { ETAPAS } from "./mapa-ruta";
import { PILARES } from "./pilares";

export interface Cifra {
  valor: string;
  etiqueta: string;
}

const PASOS = ETAPAS.reduce((total, etapa) => total + etapa.pasos.length, 0);

/**
 * Solo cifras que el sitio respalda: los 15+ países salen de Nosotros (Quiénes
 * somos); pilares, etapas y pasos se cuentan; los 1,000 líderes son la meta
 * 2030 de la Ruta y se rotulan como meta.
 * PENDIENTE (CG): la §6.1 pedía «22 organizaciones analizadas», pero ningún
 * documento del repo da esa cifra. Entra cuando la CG diga de dónde sale.
 */
export const CIFRAS: Cifra[] = [
  { valor: "15+", etiqueta: "países con líderes, invitados y aliados de la red" },
  {
    valor: String(PILARES.length),
    etiqueta: "pilares: Comunidad, Conocimiento, Tecnología y Datos",
  },
  {
    valor: String(ETAPAS.length),
    etiqueta: `etapas y ${PASOS} pasos en el Mapa de Ruta`,
  },
  { valor: "1,000", etiqueta: "líderes formados: nuestra meta al 2030" },
];

/**
 * Eventos «Próximamente». Lo comparten /eventos y la home.
 * PENDIENTE (D10): pre-anuncio del Encuentro Latinoamericano CDMX 2027.
 */
export const TEXTO_EVENTOS =
  "Estamos preparando el calendario de eventos y los webinars mensuales de ASPAL.";
```

En `client/src/pages/eventos.tsx`, el primer párrafo del hero pasa a ser `{TEXTO_EVENTOS} Déjanos tu correo y te avisamos en cuanto abramos inscripciones.`. Importa `TEXTO_EVENTOS` desde `@/content/institucional/inicio`. El texto visible queda idéntico.

`client/src/lib/contenido-reciente.ts`:

```ts
/**
 * Qué muestra el bloque de contenido reciente de la home (RF-13). Si la API
 * falla, el bloque se oculta sin afectar al resto; mientras carga, esqueleto.
 * Pura, para poder probarla sin DOM (Vitest corre en `node`).
 */
export interface EstadoConsulta {
  pendiente: boolean;
  error: boolean;
  cantidad: number;
}

export type VistaReciente = "cargando" | "oculta" | "lista";

export function vistaReciente(...consultas: EstadoConsulta[]): VistaReciente {
  if (consultas.some((c) => c.pendiente)) return "cargando";
  return consultas.some((c) => !c.error && c.cantidad > 0) ? "lista" : "oculta";
}
```

Run: `npx vitest run client/src/lib/contenido-reciente.test.ts client/src/content/institucional`
Expected: PASS.

- [ ] **Step 3: `PodcastCard` con `TransformedPost` y sin imagen rota**

`CLAUDE.md` prohíbe redeclarar la forma de un post. En `client/src/components/content/PodcastCard.tsx`:

- borra la interfaz `WPPodcast`;
- importa `import type { TransformedPost } from "@shared/wordpress/types";`;
- cambia a `podcast: TransformedPost`.

Luego sustituye la etiqueta `<a …>` de apertura por:

```tsx
    <a
      href={podcast.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`${podcast.title} (se abre en una pestaña nueva)`}
      data-testid={`link-podcast-${podcast.id}`}
    >
```

Sustituye también el bloque de la imagen, que pedía `/placeholder-podcast.jpg`, un archivo que no existe:

```tsx
{
  /* Condicional: un <img src=""> o un placeholder inexistente pinta el
              icono de imagen rota. Decorativa: el título está en el aria-label. */
}
{
  podcast.featuredImage && (
    <div className="aspect-video w-full overflow-hidden rounded-t-md bg-muted/30">
      <img
        src={podcast.featuredImage}
        alt=""
        loading="lazy"
        className="h-full w-full object-contain"
        data-testid={`img-podcast-artwork-${podcast.id}`}
      />
    </div>
  );
}
```

Añade `aria-hidden="true"` a los iconos `Calendar` y `ExternalLink`.

En `client/src/pages/podcast.tsx`, borra la interfaz `WPPodcast` y usa `useQuery<TransformedPost[]>`, con `import type { TransformedPost } from "@shared/wordpress/types";`.

- [ ] **Step 4: `ContenidoReciente`**

`client/src/components/content/ContenidoReciente.tsx`:

```tsx
import BlogCard from "@/components/content/BlogCard";
import { PodcastCard } from "@/components/content/PodcastCard";
import { Banda } from "@/components/layout/Banda";
import { vistaReciente, type EstadoConsulta } from "@/lib/contenido-reciente";
import type { TransformedPost } from "@shared/wordpress/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

async function cargar(url: string): Promise<TransformedPost[]> {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`Error al cargar ${url}: ${respuesta.status}`);
  return respuesta.json();
}

function estado(consulta: UseQueryResult<TransformedPost[]>): EstadoConsulta {
  return {
    pendiente: consulta.isPending,
    error: consulta.isError,
    cantidad: consulta.data?.length ?? 0,
  };
}

const REINTENTO = {
  retry: 2,
  retryDelay: (intento: number) => Math.min(1000 * 2 ** intento, 8000),
};

/**
 * Contenido reciente de la home (RF-13): 3 artículos y el último episodio.
 * Si la API falla, el bloque desaparece y el resto de la home sigue igual. En
 * el HTML prerenderizado sale el esqueleto: las consultas no corren en el
 * servidor.
 */
export function ContenidoReciente() {
  const articulos = useQuery<TransformedPost[]>({
    queryKey: ["/api/posts", { per_page: 3 }],
    queryFn: () => cargar("/api/posts?per_page=3"),
    ...REINTENTO,
  });
  const episodios = useQuery<TransformedPost[]>({
    queryKey: ["/api/podcasts", { per_page: 1 }],
    queryFn: () => cargar("/api/podcasts?per_page=1"),
    ...REINTENTO,
  });

  const vista = vistaReciente(estado(articulos), estado(episodios));
  if (vista === "oculta") return null;

  const episodio = episodios.data?.[0];

  return (
    <Banda tono="suave" id="contenido-reciente">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Contenido reciente
        </h2>
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline underline-offset-4"
          data-testid="link-home-blog"
        >
          Ver todo el blog
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {vista === "cargando" ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <p className="sr-only" role="status">
            Cargando contenido reciente…
          </p>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              aria-hidden="true"
              className="h-80 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {articulos.data?.map((post) => (
            <li key={post.id}>
              <BlogCard post={post} />
            </li>
          ))}
          {episodio && (
            <li>
              <PodcastCard podcast={episodio} />
            </li>
          )}
        </ul>
      )}
    </Banda>
  );
}
```

`animate-pulse` anima la opacidad por CSS en un bloque decorativo `aria-hidden` y sin texto. La puerta del Task 4 solo mira los `style` en línea, así que no la dispara.

- [ ] **Step 5: `MuroAliados` con `pendientes` opcional**

En `client/src/components/institucional/MuroAliados.tsx`, cambia la prop a `pendientes?: string[]` y envuelve la segunda `<ul>` en `{pendientes && pendientes.length > 0 && (…)}`. Así no queda una lista vacía en el árbol de accesibilidad. Nosotros sigue pasándola, así que ahí no cambia nada.

- [ ] **Step 6: La página de inicio**

`client/src/pages/inicio.tsx`:

```tsx
import { ContenidoReciente } from "@/components/content/ContenidoReciente";
import { FormSuscripcion } from "@/components/forms/FormSuscripcion";
import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";
import { MuroAliados } from "@/components/institucional/MuroAliados";
import { PilarCard } from "@/components/institucional/PilarCard";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { CIFRAS, TEXTO_EVENTOS } from "@/content/institucional/inicio";
import { MAPA_RUTA } from "@/content/institucional/mapa-ruta";
import {
  ALIADOS_FUNDADORES,
  CTA_FINAL,
  HASHTAG,
  HERO_NOSOTROS,
} from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { NOMBRE_COMPLETO } from "@/lib/marca";
import { Link } from "wouter";

const h2 = "text-3xl font-bold text-foreground md:text-4xl";
const BOTON_MIEL =
  "min-h-11 px-6 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";
const BOTON_CONTORNO =
  "min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";

/**
 * Home institucional (§6.1): 8 bandas. El contenido de producto que ocupaba la
 * raíz vive en /plataforma desde el PR A.
 * PENDIENTE (insumo de la semana 0): foto real de un evento en el hero.
 */
export default function Inicio() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroInstitucional overline={NOMBRE_COMPLETO} titulo={HERO_NOSOTROS.tagline}>
          <p>{HERO_NOSOTROS.parrafo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className={BOTON_MIEL} asChild>
              <Link
                href="/mapa-de-ruta"
                onClick={() =>
                  registrarEvento("click_mapa_ruta", { origen: "home_hero" })
                }
                data-testid="button-home-mapa"
              >
                Empieza por el Mapa de Ruta
              </Link>
            </Button>
            <Button variant="outline" className={BOTON_CONTORNO} asChild>
              <Link
                href="/unete"
                onClick={() => registrarEvento("click_unete", { origen: "home" })}
                data-testid="button-home-unete"
              >
                Únete a la comunidad
              </Link>
            </Button>
          </div>
        </HeroInstitucional>

        {/* 2. Cifras verificables */}
        <Banda>
          <h2 className="sr-only">ASPAL en cifras</h2>
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CIFRAS.map((cifra) => (
              <div key={cifra.valor} data-testid={`cifra-${cifra.valor}`}>
                <dt className="sr-only">{cifra.etiqueta}</dt>
                <dd className="text-5xl font-extrabold text-primary">{cifra.valor}</dd>
                <dd className="mt-2 text-lg text-muted-foreground">{cifra.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </Banda>

        {/* 3. Los 4 pilares */}
        <Banda tono="suave">
          <h2 className={h2}>Los 4 Pilares ASPAL</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PILARES.map((pilar) => (
              <PilarCard key={pilar.id} pilar={pilar} variante="resumen" />
            ))}
          </div>
        </Banda>

        {/* 4. Mapa de Ruta destacado */}
        <Banda>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-primary">
            Mapa de Ruta
          </p>
          <h2 className={`mt-2 ${h2}`}>{MAPA_RUTA.titulo}</h2>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            {MAPA_RUTA.subtitulo}
          </p>
          <div className="mt-8">
            <IndiceEtapas origen="home" />
          </div>
          <Button className="mt-8 min-h-11 px-6" asChild>
            <Link
              href="/mapa-de-ruta"
              onClick={() =>
                registrarEvento("click_mapa_ruta", { origen: "home_franja" })
              }
              data-testid="button-home-mapa-franja"
            >
              Explora el Mapa de Ruta
            </Link>
          </Button>
        </Banda>

        {/* 5. Contenido reciente (se oculta si la API falla) */}
        <ContenidoReciente />

        {/* 6. Próximo gran evento: D10 sin aprobar, alternativa de la §6.1 */}
        <Banda>
          <h2 className={h2}>Próximos eventos</h2>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{TEXTO_EVENTOS}</p>
          <Button variant="outline" className="mt-6 min-h-11 px-6" asChild>
            <Link href="/eventos" data-testid="button-home-eventos">
              Avísame cuando abran inscripciones
            </Link>
          </Button>
        </Banda>

        {/* 7. Aliados fundadores */}
        <Banda tono="suave">
          <h2 className={`mb-8 ${h2}`}>Aliados fundadores</h2>
          <MuroAliados fundadores={ALIADOS_FUNDADORES} />
        </Banda>

        {/* 8. Únete a la casa común */}
        <Banda tono="noche">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[13px] font-semibold tracking-wider text-secondary">
                {HASHTAG}
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Únete a la casa común
              </h2>
              {CTA_FINAL.map((parrafo) => (
                <p key={parrafo.slice(0, 20)} className="mt-4 text-lg text-white/85">
                  {parrafo}
                </p>
              ))}
              <Link
                href="/unete"
                className="mt-6 inline-flex min-h-11 items-center font-medium text-secondary underline underline-offset-4"
                onClick={() => registrarEvento("click_unete", { origen: "home_final" })}
                data-testid="link-home-unete-final"
              >
                Ver todas las formas de unirte
              </Link>
            </div>
            <div>
              <FormSuscripcion origen="home" variante="compacto" tono="noche" />
            </div>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

Encabezados: `h1` en el hero y `h2` en cada banda. La de cifras lleva un `h2` solo para lectores de pantalla, para no saltar de `h1` a nada. `PilarCard` en `resumen` usa `h3`, y `MuroAliados` también. No hay saltos.

- [ ] **Step 7: Conectar la raíz, el SEO y la documentación**

`client/src/App.tsx`: `import Inicio from "@/pages/inicio";`. En `PAGINAS`, borra las dos líneas del comentario PENDIENTE y pon `"/": Inicio,`.

`client/src/lib/seo.ts`: borra el comentario PENDIENTE de `"/"` y cambia su descripción a:

```ts
    descripcion:
      "La red en español del sector asociativo de América Latina: comunidad, conocimiento, tecnología y datos para asociaciones profesionales.",
```

`CLAUDE.md`, sección «Convenciones»: en el punto de fallos de WordPress, sustituye

> Antes se degradaba a vacío "para que la landing renderizara aunque el blog
> no respondiera". Esa justificación era falsa: `home.tsx` no consume la API.
> Solo lo hacen `blog.tsx` y `blog-post.tsx`.

por

> Antes se degradaba a vacío "para que la landing renderizara aunque el blog
> no respondiera". No hace falta: la home (`inicio.tsx`) consume la API solo en
> `ContenidoReciente`, que oculta el bloque si la petición falla (RF-13) y deja
> el resto de la página intacto. También la consumen `blog.tsx`,
> `blog-post.tsx` y `podcast.tsx`.

`docs/architecture.md`: donde se liste qué páginas consumen `/api/*`, añade la home (`ContenidoReciente`). Si no hay tal lista, añade una línea en la sección de páginas.

Comprueba que no quedan restos:

Run: `grep -rn "placeholder-podcast\|interface WPPodcast\|PENDIENTE (PR F)" client/src`
Expected: sin resultados.

- [ ] **Step 8: Puertas**

Run: `npm run check && npm run lint && npm run format:check && npm test`
Expected: todo en verde.

- [ ] **Step 9: Verificar en el navegador**

Con `PORT=5001 npm run dev`, a 1440 y a 375 px, en `/`:

1. Las 8 bandas en orden: hero noche; cifras; pilares; mapa; contenido reciente; eventos; aliados; únete noche.
2. «Empieza por el Mapa de Ruta» lleva a `/mapa-de-ruta`. Una etapa de la franja lleva a su ancla. Los eventos llegan a `dataLayer`.
3. Contenido reciente con 3 artículos y 1 episodio, o sin episodio si la API no devuelve ninguno.
4. **API caída:** para el servidor y arranca con `WP_API_BASE=http://127.0.0.1:9/wp-json/wp/v2 PORT=5001 npm run dev`. La banda de contenido reciente muestra el esqueleto y desaparece tras los reintentos (unos 3 s); el resto de la home no cambia. Vuelve a arrancar el servidor normal.
5. El formulario de la banda final envía con `origen: "home"`: revísalo en la pestaña Red (payload de `POST /api/suscripcion`).
6. Sin scroll horizontal a 375 px.

- [ ] **Step 10: Commit**

```bash
git add client/src/content/institucional/inicio.ts client/src/content/institucional/contenido.test.ts client/src/lib/contenido-reciente.ts client/src/lib/contenido-reciente.test.ts client/src/components/content/ContenidoReciente.tsx client/src/components/content/PodcastCard.tsx client/src/pages/podcast.tsx client/src/components/institucional/MuroAliados.tsx client/src/pages/inicio.tsx client/src/pages/eventos.tsx client/src/App.tsx client/src/lib/seo.ts CLAUDE.md docs/architecture.md
git commit -m "Home institucional: hero, cifras, pilares, Mapa de Ruta, contenido reciente, eventos, aliados y boletín"
```

---

### Task 4: `/plataforma` legible sin JavaScript

**Files:**

- Modify: `scripts/prerender.mjs` (función `componer`)
- Modify: `client/src/components/sections/HeroSection.tsx`, `ProblemSection.tsx`, `FeaturesGrid.tsx`, `LogoCarousel.tsx`, `CTASection.tsx` y `CommunityGraphics.tsx`

**Interfaces:**

- Consumes: la home del Task 3. Ya no usa estos componentes, así que la puerta solo puede fallar en `/plataforma`.
- Produces: la puerta del prerender, que aborta si el HTML de una ruta contiene `opacity:0` en un `style`.

- [ ] **Step 1: Escribir la puerta (el «test que falla»)**

En `scripts/prerender.mjs`, dentro de `componer`, justo después de la comprobación de `<h1`:

```js
// Contenido a opacidad 0 en el HTML: sin JavaScript (buscadores, JS
// bloqueado, antes de hidratar) no se ve. framer-motion lo escribe como
// style="opacity:0…" al renderizar `initial`. 0.5 sí vale; 0 no.
if (/opacity:\s*0(?![.\d])/.test(cuerpo)) {
  throw new Error(
    `prerender: ${nombre} tiene contenido a opacity:0 (animación de entrada)`,
  );
}
```

- [ ] **Step 2: Ver que falla**

Run: `npm run build`
Expected: FAIL con `prerender: /plataforma tiene contenido a opacity:0 (animación de entrada)`. Hoy son 98 apariciones.

- [ ] **Step 3: Quitar la opacidad de las animaciones de entrada**

En cada archivo de la lista:

- En `initial`, `animate`, `whileInView` y en las variantes (`hidden`, `visible`, `show`…), **borra la clave `opacity`** cuando forme parte de una animación de entrada. Deja la traslación y la escala: el contenido sigue deslizándose al entrar, pero ya es visible en el HTML.
- Si un `initial` o una variante se queda vacío, borra también su pareja (`whileInView`/`animate`/`viewport`/`transition`). Si el `motion.x` se queda sin ninguna prop de movimiento, cámbialo por la etiqueta HTML normal.
- **No toques** los bucles decorativos cuyo primer fotograma no es 0, por ejemplo `animate={{ opacity: [0.3, 0.6, 0.3] }}`. Si un bucle empieza en `0` (`[0, 1, 0]`), cámbialo para que empiece en `0.3`.
- `Header.tsx` (mega-menú con `exit`) y `blog.tsx` quedan fuera: no se prerenderizan abiertos y la puerta no los detecta.

Verifica que no queda nada en los archivos tocados:

Run: `grep -n "opacity: 0\b\|opacity: 0," client/src/components/sections/*.tsx`
Expected: sin resultados.

- [ ] **Step 4: Build en verde**

Run: `npm run build`
Expected: `prerender: 10 rutas, 404.html, spa.html, sitemap.xml y robots.txt`, sin errores.

Run: `for f in dist/public/*.html; do echo "$(grep -o 'opacity:0' $f | wc -l) $f"; done`
Expected: `0` en todas.

- [ ] **Step 5: Verificar en el navegador**

`PORT=5002 npm start` y abre `http://localhost:5002/plataforma`. Recorre la página con scroll: las secciones entran deslizándose, sin huecos ni solapes. Desactiva JavaScript (DevTools › Settings › Disable JavaScript) y recarga: todo el texto es visible.

- [ ] **Step 6: Puertas y commit**

```bash
npm run check && npm run lint && npm run format:check && npm test
git add scripts/prerender.mjs client/src/components/sections
git commit -m "Quitar las animaciones de opacidad de /plataforma y prohibirlas en el prerender"
```

---

### Task 5: Imágenes en WebP, sin huérfanos y con límite de peso

**Files:**

- Modify: `scripts/check-assets.mjs` (huérfanos y límite de 250 KB)
- Create: `scripts/imagenes.mjs` (conversión única a WebP)
- Modify: `package.json` (`sharp` en `devDependencies`; `check-assets` antes de `vite build`)
- Modify: `client/src/pages/plataforma.tsx`, `client/src/components/sections/HeroSection.tsx`, `client/src/components/institucional/PerfilCard.tsx`, `client/src/pages/not-found.tsx` (imports a `.webp`, más `width`/`height`/`loading`)
- Delete: los PNG sustituidos y los huérfanos de `client/src/assets/`

**Interfaces:**

- Consumes: nada de tasks anteriores.
- Produces: `npm run check:assets` falla con cualquier archivo de `client/src/assets/` sin referencia `@assets/…` en `client/src/**/*.{ts,tsx}`, o con cualquier imagen referenciada de más de 250 KB. `npm run build` lo ejecuta antes de `vite build`.

- [ ] **Step 1: Ampliar `check-assets` (el «test que falla»)**

En `scripts/check-assets.mjs`:

1. Recoge cada referencia en un `Set` mientras recorres los imports: `referencias.add(match[1])`.
2. Añade `sep` al import de `node:path` y, antes del bloque final `if (missing.length > 0)`, inserta:

```js
// Huérfanos: archivos que ningún import usa. Pesan en el repo y confunden
// sobre qué imagen es la buena (CLAUDE.md: los nombres con timestamp son
// heredados).
const huerfanos = walk(ASSETS)
  .map((f) => relative(ASSETS, f).split(sep).join("/"))
  .filter((asset) => !referencias.has(asset));

// Límite de peso (RF-15): ninguna imagen que llegue al navegador por encima de
// 250 KB. Las de 1 MB eran la causa del Lighthouse de 68.
const LIMITE = 250 * 1024;
const pesados = [...referencias]
  .filter((asset) => /\.(png|jpe?g|webp|avif|gif)$/i.test(asset))
  .map((asset) => ({
    asset,
    bytes: statSync(join(ASSETS, asset), { throwIfNoEntry: false })?.size ?? 0,
  }))
  .filter(({ bytes }) => bytes > LIMITE);

if (huerfanos.length > 0) {
  console.error(`✗ ${huerfanos.length} asset(s) sin usar en client/src/assets:\n`);
  for (const asset of huerfanos) console.error(`  ${asset}`);
}
if (pesados.length > 0) {
  console.error(`✗ ${pesados.length} imagen(es) por encima de ${LIMITE / 1024} KB:\n`);
  for (const { asset, bytes } of pesados)
    console.error(`  ${asset} (${Math.round(bytes / 1024)} KB)`);
}
if (huerfanos.length > 0 || pesados.length > 0) process.exit(1);
```

3. Ajusta el mensaje de éxito final: `✓ assets: referencias resueltas, sin huérfanos y ninguna imagen por encima de 250 KB`.

En `package.json`, el script `build` empieza por `node scripts/check-assets.mjs && vite build …`: así la puerta corre también en Vercel.

Run: `npm run check:assets`
Expected: FAIL. Lista como huérfanos los 4 `image_17647….png`, 7 de los 8 `generated_images/*.png` y la fuente `Montserrat-Regular_….otf` (la tipografía llega por Google Fonts: compruébalo con `grep -rn "Montserrat" client/index.html client/src/index.css tailwind.config.ts`). Lista como pesado `generated_images/hero_dashboard_with_yellow_background.png` (1.074 KB).

- [ ] **Step 2: Script de conversión**

```bash
npm install --save-dev sharp
```

`scripts/imagenes.mjs`:

```js
#!/usr/bin/env node
/**
 * Conversión única de las imágenes en uso a WebP (RF-15). Escribe el .webp
 * junto al original e imprime tamaño y dimensiones, que son los `width` y
 * `height` que llevan los <img>. Los originales se borran a mano después, con
 * `git rm`: git los conserva si hay que regenerar.
 *
 * Uso: node scripts/imagenes.mjs
 */
import sharp from "sharp";
import { join, resolve } from "node:path";

const ASSETS = resolve(import.meta.dirname, "..", "client", "src", "assets");

/** [archivo, ancho máximo]: el doble del ancho al que se pinta, para pantallas 2x. */
const TRABAJOS = [
  ["generated_images/hero_dashboard_with_yellow_background.png", 1400],
  ["recurso-8-comunidad.png", 960],
  ["recurso-3-blog.png", 960],
  ["recurso-40-certificaciones.png", 960],
  ["recurso-27-marketing.png", 960],
  ["recurso-26-bolsa-trabajo.png", 960],
  ["recurso-13-membresias.png", 960],
  ["Aspal-Icono_1763675356866.png", 512],
];

for (const [archivo, ancho] of TRABAJOS) {
  const origen = join(ASSETS, archivo);
  const destino = origen.replace(/\.png$/, ".webp");
  const info = await sharp(origen)
    .resize({ width: ancho, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(destino);
  console.log(
    `${archivo} → ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`,
  );
}
```

Run: `node scripts/imagenes.mjs`
Expected: 8 líneas y todas por debajo de 250 KB. **Guarda la salida**: sus dimensiones son los `width`/`height` del Step 3. Si alguna supera el límite, baja su ancho en `TRABAJOS` y repite.

- [ ] **Step 3: Apuntar los imports a WebP con dimensiones**

- `client/src/pages/plataforma.tsx`: los seis `@assets/recurso-*.png` pasan a `.webp`.
- `client/src/components/sections/HeroSection.tsx`: `heroDashboard` pasa a `.webp`. En su `<img>` añade `width` y `height` con los valores del Step 2, `fetchPriority="high"` y `decoding="async"`. Es la imagen LCP de `/plataforma`, así que sin `loading="lazy"`.
- `client/src/components/sections/ProblemSection.tsx` y `FeaturesGrid.tsx`, si pintan esas imágenes: añade `width`, `height`, `loading="lazy"` y `decoding="async"` en el `<img>` que recibe la prop. Todas las de `recurso-*` salen de 960 de ancho; el alto lo da el Step 2. Si las seis no comparten proporción, añade `width`/`height` a la prop del componente y pásalos desde `plataforma.tsx`.
- `client/src/components/institucional/PerfilCard.tsx` y `client/src/pages/not-found.tsx`: `Aspal-Icono_1763675356866.png` pasa a `.webp`. Conserva los `width`/`height` que ya tengan.

- [ ] **Step 4: Borrar sustituidos y huérfanos**

```bash
git rm client/src/assets/recurso-8-comunidad.png client/src/assets/recurso-3-blog.png client/src/assets/recurso-40-certificaciones.png client/src/assets/recurso-27-marketing.png client/src/assets/recurso-26-bolsa-trabajo.png client/src/assets/recurso-13-membresias.png client/src/assets/Aspal-Icono_1763675356866.png client/src/assets/generated_images/hero_dashboard_with_yellow_background.png
```

Después borra con `git rm` cada archivo que el Step 1 listó como huérfano. Antes de cada uno, confirma con `grep -rn "<nombre>" client/ server/ shared/ api/ scripts/` que nada lo usa por otra vía (CSS, `public/`, HTML).

Run: `npm run check:assets`
Expected: `✓ assets: referencias resueltas, sin huérfanos y ninguna imagen por encima de 250 KB`.

- [ ] **Step 5: Build y comparación**

Run: `npm run build && du -sh client/src/assets && ls -S -l dist/public/assets | head -5`
Expected: build en verde; `client/src/assets` baja de ~11 MB a menos de 1 MB. Anota en el informe el antes y el después.

`CLAUDE.md`, «Contexto que ahorra tiempo»: cambia «`client/src/assets/` pesa ~11 MB y está versionado» por «`client/src/assets/` solo contiene lo que se usa (lo vigila `check-assets`) y ninguna imagen supera 250 KB», con el tamaño real.

- [ ] **Step 6: Verificar en el navegador**

`PORT=5002 npm start`: `/plataforma` (hero y las seis ilustraciones), `/nuestro-equipo` (silueta de los perfiles) y `/no-existe` (isotipo del 404). No hay imágenes rotas y, en la pestaña Red, todas son `.webp`.

- [ ] **Step 7: Puertas y commit**

```bash
npm run check && npm run lint && npm run format:check && npm test
git add -A client/src/assets scripts/check-assets.mjs scripts/imagenes.mjs package.json package-lock.json client/src/pages/plataforma.tsx client/src/components/sections client/src/components/institucional/PerfilCard.tsx client/src/pages/not-found.tsx CLAUDE.md
git commit -m "Pasar las imágenes en uso a WebP, borrar los assets huérfanos y limitar el peso a 250 KB"
```

---

### Task 6: «Saltar al contenido» (RF-14)

**Files:**

- Create: `client/src/components/layout/SaltarAlContenido.tsx`
- Modify: `client/src/App.tsx` (renderizarlo antes que todo lo demás)
- Modify: todas las páginas de `client/src/pages/` (`<main id="contenido" tabIndex={-1}>`)
- Modify: `scripts/prerender.mjs` (puerta: cada ruta tiene `id="contenido"`)

**Interfaces:**

- Consumes: la puerta del Task 4 en `componer`.
- Produces: `SaltarAlContenido()`. Cada página renderiza exactamente un `<main id="contenido">`.

- [ ] **Step 1: La puerta que falla**

En `scripts/prerender.mjs`, en `componer`, debajo de la puerta de opacidad:

```js
// RF-14: el enlace «Saltar al contenido» apunta a #contenido en todas las rutas.
if (!cuerpo.includes('id="contenido"')) {
  throw new Error(`prerender: ${nombre} no tiene <main id="contenido">`);
}
```

Run: `npm run build`
Expected: FAIL en la primera ruta.

- [ ] **Step 2: El componente**

`client/src/components/layout/SaltarAlContenido.tsx`:

```tsx
/**
 * Primer elemento enfocable de cada página (RF-14): con Tab, salta el header y
 * el menú de cinco rubros. Invisible hasta recibir el foco. `#contenido` es el
 * `<main>` de cada página, con tabIndex={-1} para que reciba el foco.
 */
export function SaltarAlContenido() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-3 focus:font-semibold focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      data-testid="link-saltar-contenido"
    >
      Saltar al contenido
    </a>
  );
}
```

En `client/src/App.tsx`, renderiza `<SaltarAlContenido />` como primer hijo dentro de `<TooltipProvider>`, antes de `<Toaster />`.

- [ ] **Step 3: `<main id="contenido">` en todas las páginas**

Hoy `eventos`, `nosotros`, `not-found`, `nuestro-equipo`, `que-hacemos` y `unete` ya tienen `<main>`; también `inicio` y `mapa-de-ruta`, de este PR. Añade `id="contenido"` y `tabIndex={-1}`, y agrega `focus:outline-none` a su `className`.

`blog.tsx`, `blog-post.tsx`, `podcast.tsx` y `plataforma.tsx` **no tienen `<main>`**. Envuelve todo lo que va entre `<Header />` y `<Footer />` en `<main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">`. Revisa que no cambie el layout: si el contenedor raíz es `flex flex-col`, `flex-1` mantiene el pie abajo.

Run: `grep -L 'id="contenido"' client/src/pages/*.tsx`
Expected: sin resultados.

- [ ] **Step 4: Build en verde**

Run: `npm run build`
Expected: prerender de 10 rutas, sin errores.

- [ ] **Step 5: Verificar en el navegador**

En `/`, `/blog` y `/mapa-de-ruta`, recarga y pulsa Tab una vez. Aparece «Saltar al contenido» arriba a la izquierda, con foco visible. Enter: el foco pasa al `<main>` (`document.activeElement.id === "contenido"`) y el siguiente Tab cae en el primer enlace del contenido, no en el menú. Con Atrás se vuelve arriba, como con cualquier ancla (PR E2).

- [ ] **Step 6: Puertas y commit**

```bash
npm run check && npm run lint && npm run format:check && npm test
git add client/src/components/layout/SaltarAlContenido.tsx client/src/App.tsx client/src/pages scripts/prerender.mjs
git commit -m "Añadir «Saltar al contenido» y un <main id=\"contenido\"> en todas las páginas"
```

---

### Task 7: Verificación final e integración

**Files:** ninguno nuevo. Si esta pasada encuentra algo, se corrige en su archivo con un commit propio.

- [ ] **Step 1: Puertas completas**

```bash
npm run check && npm run lint && npm run format:check && npm test && npm run build
```

Expected: todo en verde; el prerender de 10 rutas incluye `mapa-de-ruta.html`; `dist/public/sitemap.xml` contiene `/mapa-de-ruta`.

- [ ] **Step 2: HTML sin JavaScript**

```bash
grep -c "Mapa de Ruta para Organizaciones Profesionales" dist/public/index.html dist/public/mapa-de-ruta.html
grep -c "Investigación y Evaluación" dist/public/mapa-de-ruta.html
grep -c 'application/ld+json' dist/public/index.html
```

Expected: cada `grep` da 1 o más.

- [ ] **Step 3: Navegador a 375, 768, 1024 y 1440 px**

`PORT=5002 npm start`. Recorre `/`, `/mapa-de-ruta` y `/plataforma`. En cada ancho: sin scroll horizontal, sin texto cortado y con foco visible al tabular. Deja constancia de la franja de 7 etapas a 1024 px, en una sola fila.

- [ ] **Step 4: Lighthouse móvil de la home (RF-15, meta ≥ 72)**

```bash
npx --yes lighthouse http://localhost:5002/ --form-factor=mobile --only-categories=performance,accessibility --output=json --output-path=./.lighthouse-home.json --chrome-flags="--headless=new" --quiet
node -e "const r=require('./.lighthouse-home.json');console.log('rendimiento',Math.round(r.categories.performance.score*100),'accesibilidad',Math.round(r.categories.accessibility.score*100),'LCP',r.audits['largest-contentful-paint'].displayValue,'CLS',r.audits['cumulative-layout-shift'].displayValue)"
rm .lighthouse-home.json
```

Anota las cifras en el informe. Si el rendimiento queda por debajo de 72, no lo arregles aquí: informa de la causa principal según Lighthouse. Un servidor local no es Vercel y la cifra que cuenta es la del preview.

- [ ] **Step 5: Integrar en la rama de la etapa**

```bash
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/f-home-mapa -m "PR F: home institucional, Mapa de Ruta, imágenes WebP y opacidad"
```

Sin `git push`.

---

## Qué queda fuera y a quién le toca

- **Foto real de un evento en el hero de la home**: insumo de la semana 0. Cuando llegue, es un `<img>` WebP con dimensiones en `inicio.tsx`.
- **«22 organizaciones analizadas»**: la CG tiene que decir de dónde sale esa cifra (decisión F3).
- **Pre-anuncio del Encuentro CDMX 2027**: se sustituye `TEXTO_EVENTOS` cuando el DG apruebe la decisión 10.
- **Recursos relacionados y foro por etapa del Mapa (§6.5)**: los foros llegan en la Etapa 2. La relación entre etapas y artículos del blog no existe en ninguna fuente; con D9 abierta, tampoco hay artículos legibles a los que enlazar.
- **Revisión de copy por la CG en el preview**:
  - las erratas corregidas (F8);
  - «Mkt, T.I. y Comunicación», abreviatura literal de la guía que un lector de pantalla lee mal;
  - que el H1 de la home y el de Nosotros coinciden, como manda la §6.1.
- **Lighthouse en el preview de Vercel**: la cifra local es orientativa.
