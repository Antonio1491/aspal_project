---
title: PR E2 de la Etapa 1 — /nosotros, /que-hacemos y /nuestro-equipo
type: feat
status: active
date: 2026-09-29
spec: docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
parent: docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md
---

# PR E2 — Páginas institucionales: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar las tres páginas de «Acerca de», con el copy literal del documento Concepto NOSOTROS:

- **`/nosotros`**: los 10 bloques;
- **`/que-hacemos`**: los 4 pilares, con anclas;
- **`/nuestro-equipo`**: los tres perfiles.

Además, activar sus enlaces en el menú y en una subnavegación compartida.

**Architecture:** Todo el copy vive en módulos tipados de `client/src/content/institucional/`:

- `pilares.ts`: lo comparten `/nosotros` y `/que-hacemos`;
- `nosotros.ts`;
- `equipo.ts`.

Son versionables, se prerenderizan y no dependen del muro de pago de WordPress. Un test comprueba que no hay textos vacíos y que los enlaces internos existen. Cada componente nuevo nace con la primera página que lo usa (plan padre, corrección 3). Las páginas se construyen con `Banda` y `HeroInstitucional` (PR E1). No hay animaciones de opacidad: las tres páginas se prerenderizan y deben leerse sin JavaScript. La Ruta 2026–2030 usa `<details>` nativo: abre con clic, toque y teclado (Enter o Espacio sobre el resumen), y su texto sigue en el HTML para los buscadores.

**Tech Stack:** React 18, wouter, Tailwind (tokens del PR A), lucide-react, Vitest. Sin dependencias nuevas.

**Spec:** `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md`: §6.2, §6.3, §6.4, RF-07, RF-08, RF-10 y RF-14. Copy: `ASPAL_Concepto_Nosotros_Web V1.docx` (Descargas de Antonio), bloques 1 a 10 y §7 (SEO). Plan padre: `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md`.

## Global Constraints

- `CLAUDE.md` manda. UI, comentarios e identificadores en español.
- **Solo commits locales, nunca `git push`.** Rama de trabajo: `etapa1/e2-institucional`, desde `feat/etapa-1-institucional`; vuelve a ella en el Task 5.
- Puertas antes de cada commit: `npm run check`, `npm run lint` (0 errores), `npm run format:check`, `npm test`. Al cerrar, además `npm run build` y el navegador a 375, 768, 1024 y 1440 px.
- **Copy literal del Concepto NOSOTROS.** Este plan lo transcribe en el Task 1; no se reescribe ni se «mejora». Lo que el documento no trae (fotos, LinkedIn, bios de 60–80 palabras, integrantes del Consejo, logo de Parksys, Dossier) queda como `// PENDIENTE:` y no se inventa.
- **Año de fundación (D7):** el documento dice 2024 (resaltado para confirmar) y la presentación, 2016. Va en una sola constante, `ANIO_FUNDACION = "2024"`, con `// PENDIENTE (D7)`. Si Luis confirma otro año, se cambia en una línea.
- Hashtag literal del documento: `#NingunDirectorDirigeSolo`.
- Sin animaciones de opacidad, un solo `<h1>` por página, encabezados sin saltos (RF-14), objetivos de al menos 44 px y `data-testid` en todo lo interactivo.
- Anclas de los pilares (RF-08): `/que-hacemos#comunidad`, `#conocimiento`, `#tecnologia` y `#datos`, con compensación del header y de la subnavegación (`scroll-mt-32`).
- Puerto de desarrollo 5001.

## Review Focus

1. **Llegar a `/que-hacemos#tecnologia` desde fuera.** El bloque tiene que quedar visible, no tapado por el header fijo ni por la subnavegación. Lo cubren el Task 2 (`scroll-mt-32` e ids de `PILARES`) y el test de contenido que exige que cada id sea un ancla válida.
2. **Leer la Ruta 2026–2030 solo con teclado o en un móvil sin hover.** Cada hito se abre con Enter o con un toque, y el texto está en el HTML prerenderizado. Lo cubre el Task 4 (`<details>` nativo) y la comprobación del build con `grep` en `nosotros.html`.
3. **Un enlace del contenido apunta a una ruta que no existe o que aún es «Próximamente».** Lo cubre el Task 1: el test de contenido pasa `esRutaConocida` a todo `href` interno.
4. **Texto vacío o placeholder en el copy** (un «TBD», o un campo `""` que deja una tarjeta vacía). Lo cubre el Task 1: el test recorre los módulos y rechaza cadenas vacías y los patrones `TBD`, `Lorem` y `[`.
5. **La subnavegación «Acerca de» a 375 px** con tres destinos. Debe hacer scroll horizontal dentro de sí misma, sin desbordar la página. Lo cubre el Task 2 (`overflow-x-auto`) y la verificación en navegador.

---

## Mapa de archivos

| Archivo                                                                                            | Responsabilidad                                     | Task    |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------- |
| `client/src/content/institucional/pilares.ts`                                                      | Los 4 pilares (compartidos)                         | 1       |
| `client/src/content/institucional/nosotros.ts`                                                     | Bloques 1–4 y 6–10                                  | 1       |
| `client/src/content/institucional/equipo.ts`                                                       | Intro y perfiles                                    | 1       |
| `client/src/content/institucional/contenido.test.ts`                                               | Integridad del contenido                            | 1       |
| `client/src/components/institucional/SubnavSeccion.tsx`                                            | Barra «Acerca de»                                   | 2       |
| `client/src/components/institucional/PilarCard.tsx`                                                | Pilar resumido o detallado                          | 2       |
| `client/src/pages/que-hacemos.tsx`                                                                 | Página                                              | 2       |
| `client/src/components/institucional/PerfilCard.tsx`                                               | Tarjeta de perfil con silueta                       | 3       |
| `client/src/pages/nuestro-equipo.tsx`                                                              | Página                                              | 3       |
| `client/src/components/institucional/TarjetaCompromiso.tsx`, `RutaTimeline.tsx`, `MuroAliados.tsx` | Bloques de Nosotros                                 | 4       |
| `client/src/pages/nosotros.tsx`                                                                    | Página                                              | 4       |
| `rutas.ts`, `seo.ts`, `App.tsx`                                                                    | Una ruta y su SEO por página                        | 2, 3, 4 |
| `navegacion.ts`, tests de rutas y de sugerencias                                                   | Hrefs de Acerca de y ejemplos de «ruta inexistente» | 4       |
| `Footer.tsx`                                                                                       | `id="boletin"` para el CTA de Nosotros              | 4       |
| `docs/design-guidelines.md`                                                                        | Contenido institucional                             | 5       |

---

### Task 1: Contenido institucional tipado

**Files:**

- Create: `client/src/content/institucional/pilares.ts`, `nosotros.ts`, `equipo.ts` y `contenido.test.ts`

**Interfaces:**

- Consumes: `COMUNIDAD` de `@/lib/navegacion`; `esRutaConocida` de `@/lib/rutas` (en el test).
- Produces:
  - `type IdPilar = "comunidad" | "conocimiento" | "tecnologia" | "datos"`
  - `interface EnlaceContenido { etiqueta: string; href?: string; externo?: boolean }`: sin `href` = «Próximamente»
  - `interface Pilar { id: IdPilar; nombre: string; subtitulo: string; compromiso: string; comoSeTraduce: string; icono: LucideIcon; enlaces: EnlaceContenido[] }`
  - `PILARES: Pilar[]`
  - `ANIO_FUNDACION`, `HERO_NOSOTROS: { tagline: string; parrafo: string }`, `QUIENES_SOMOS: string[]`, `MISION`, `VISION`, `HASHTAG`
  - `DEFENDEMOS: { titulo: string; texto: string }[]`, `APORTES: string[]`
  - `interface Hito { anio: string; nombre: string; descripcion: string; estado: "en-curso" | "futuro" }`, `RUTA: Hito[]`
  - `interface TarjetaGobierno { titulo: string; texto: string; enlace: EnlaceContenido }`, `HACEN_POSIBLE: TarjetaGobierno[]`
  - `interface Aliado { nombre: string; descripcion: string; logo?: "wup" | "anpr" }`, `ALIADOS_FUNDADORES: Aliado[]`, `CATEGORIAS_ALIADOS_PENDIENTES: string[]`
  - `CTA_FINAL: string[]`
  - `INTRO_EQUIPO: string`
  - `interface Perfil { nombre: string; cargo: string; bio: string; foto?: string; linkedin?: string }`, `PERFILES: Perfil[]`

- [ ] **Step 1: Test de integridad**

`client/src/content/institucional/contenido.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { esRutaConocida } from "@/lib/rutas";
import { INTRO_EQUIPO, PERFILES } from "./equipo";
import * as nosotros from "./nosotros";
import { PILARES } from "./pilares";

/** Todas las cadenas de un valor, recorriendo objetos y arrays (no funciones ni iconos). */
function cadenas(valor: unknown): string[] {
  if (typeof valor === "string") return [valor];
  if (Array.isArray(valor)) return valor.flatMap(cadenas);
  if (
    valor &&
    typeof valor === "object" &&
    !("$$typeof" in valor) &&
    !("render" in valor)
  ) {
    return Object.values(valor).flatMap(cadenas);
  }
  return [];
}

const todo = [
  ...cadenas(PILARES),
  ...cadenas(nosotros),
  ...cadenas(PERFILES),
  INTRO_EQUIPO,
];

describe("contenido institucional", () => {
  it("no tiene textos vacíos ni marcadores de relleno", () => {
    expect(todo.filter((t) => !t.trim())).toEqual([]);
    expect(todo.filter((t) => /\bTBD\b|lorem|^\[|\]$/i.test(t))).toEqual([]);
  });

  it("tiene los cuatro pilares con ids de ancla únicos", () => {
    const ids = PILARES.map((p) => p.id);
    expect(ids).toEqual(["comunidad", "conocimiento", "tecnologia", "datos"]);
    for (const id of ids) expect(id).toMatch(/^[a-z]+$/);
  });

  it("enlaza solo rutas internas que existen, y externos por https", () => {
    const enlaces = [
      ...PILARES.flatMap((p) => p.enlaces),
      ...nosotros.HACEN_POSIBLE.map((t) => t.enlace),
    ];
    for (const e of enlaces) {
      if (!e.href) continue;
      if (e.externo) expect(e.href, e.etiqueta).toMatch(/^https:\/\//);
      else if (!e.href.startsWith("#")) expect(esRutaConocida(e.href), e.href).toBe(true);
    }
  });

  it("respeta la estructura del Concepto NOSOTROS", () => {
    expect(nosotros.QUIENES_SOMOS).toHaveLength(3);
    expect(nosotros.DEFENDEMOS.map((d) => d.titulo)).toEqual([
      "Nuestra causa",
      "Nuestra propuesta de valor",
      "Nuestra promesa",
      "Nuestro compromiso",
    ]);
    expect(nosotros.APORTES).toHaveLength(7);
    expect(nosotros.RUTA.map((h) => h.anio)).toEqual([
      "2026",
      "Q1 2027",
      "Dic 2027",
      "Q4 2028",
      "2029",
      "2030",
    ]);
    expect(nosotros.HACEN_POSIBLE).toHaveLength(3);
    expect(PERFILES.map((p) => p.nombre)).toEqual([
      "Luis Romahn",
      "Patricia Hernández de Anda",
      "Antonio Góngora",
    ]);
  });

  it("usa el año de fundación en un solo lugar", () => {
    expect(nosotros.QUIENES_SOMOS[0]).toContain(`Nacimos en ${nosotros.ANIO_FUNDACION}`);
  });

  it("escribe el hashtag tal como lo trae el documento", () => {
    expect(nosotros.HASHTAG).toBe("#NingunDirectorDirigeSolo");
  });
});
```

(Los enlaces de `HACEN_POSIBLE` a `/nuestro-equipo` fallarán hasta el Task 3. Por eso ese test se deja en `it.todo` en este Task y se activa en el Task 4: ver el Step 3.)

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/content/institucional/contenido.test.ts`
Expected: FAIL. No resuelve `./equipo`, `./nosotros` ni `./pilares`.

- [ ] **Step 3: Los tres módulos**

`client/src/content/institucional/pilares.ts`:

```ts
/**
 * Los 4 Pilares ASPAL (Concepto NOSOTROS, Bloque 5). Copy literal: no se
 * reescribe aquí. Lo usan /nosotros (resumen) y /que-hacemos (detalle); el id
 * es el ancla de /que-hacemos (RF-08).
 */
import { COMUNIDAD } from "@/lib/navegacion";
import { BarChart3, BookOpen, Cpu, Users, type LucideIcon } from "lucide-react";

export type IdPilar = "comunidad" | "conocimiento" | "tecnologia" | "datos";

/** Enlace de contenido. Sin `href`, la sección aún no existe («Próximamente»). */
export interface EnlaceContenido {
  etiqueta: string;
  href?: string;
  externo?: boolean;
}

export interface Pilar {
  id: IdPilar;
  nombre: string;
  subtitulo: string;
  compromiso: string;
  comoSeTraduce: string;
  icono: LucideIcon;
  enlaces: EnlaceContenido[];
}

export const PILARES: Pilar[] = [
  {
    id: "comunidad",
    nombre: "Comunidad",
    subtitulo: "Ningún director dirige solo.",
    compromiso:
      "Conectamos a los directivos y equipos de asociaciones de toda LATAM en una red viva de pares.",
    comoSeTraduce:
      "Foros por etapa del Mapa de Ruta, directorio de miembros, red de mentoring, Encuentro Latinoamericano CDMX 2027.",
    icono: Users,
    enlaces: [
      { etiqueta: "Comunidad ASPAL", href: `${COMUNIDAD}/comunidad/`, externo: true },
      {
        etiqueta: "Directorio de miembros",
        href: `${COMUNIDAD}/miembros/`,
        externo: true,
      },
    ],
  },
  {
    id: "conocimiento",
    nombre: "Conocimiento",
    subtitulo: "El saber acumulado del sector, curado y en español.",
    compromiso:
      "Te damos acceso a las mejores prácticas globales y regionales de gestión asociativa.",
    comoSeTraduce:
      "Podcast Conexión Profesional, Blog, Webinars mensuales, Biblioteca curada, Academia ASPAL y cursos certificados.",
    icono: BookOpen,
    enlaces: [
      { etiqueta: "Blog", href: "/blog" },
      { etiqueta: "Podcast Conexión Profesional", href: "/podcast" },
      { etiqueta: "Cursos en línea", href: `${COMUNIDAD}/cursos/`, externo: true },
    ],
  },
  {
    id: "tecnologia",
    nombre: "Tecnología",
    subtitulo: "Años de prueba y error, resueltos.",
    compromiso:
      "Te ofrecemos la plataforma SaaS especializada para asociaciones, ya operativa en WUP y ANPR.",
    comoSeTraduce:
      "Gestión de membresías, pasarela de pagos, email marketing, comunidad en línea, analítica — todo listo para operar.",
    icono: Cpu,
    enlaces: [{ etiqueta: "Conoce la plataforma", href: "/plataforma" }],
  },
  {
    id: "datos",
    nombre: "Datos",
    subtitulo: "Decisiones con evidencia, no con intuición.",
    compromiso: "Generamos los benchmarks reales del sector asociativo latinoamericano.",
    comoSeTraduce:
      "Estudio Comparativo anual, Reporte del Estado del Sector LATAM, encuestas de retención y tendencias regionales.",
    icono: BarChart3,
    // PENDIENTE (Etapa 3): el Estudio Comparativo tiene su página.
    enlaces: [{ etiqueta: "Estudio Comparativo" }],
  },
];
```

`client/src/content/institucional/nosotros.ts`:

```ts
/**
 * Página Nosotros: copy literal del documento «Concepto NOSOTROS» (julio 2026),
 * bloques 1–4 y 6–10. El Bloque 5 son los pilares (`pilares.ts`).
 */
import type { EnlaceContenido } from "./pilares";

// PENDIENTE (D7): el documento dice 2024 (resaltado para confirmar) y la
// presentación al Consejo, 2016. Confirmar con el DG antes de publicar.
export const ANIO_FUNDACION = "2024";

export const HASHTAG = "#NingunDirectorDirigeSolo";

/** Bloque 1: Hero institucional. */
export const HERO_NOSOTROS = {
  tagline: "La red en español del sector asociativo de América Latina.",
  parrafo:
    "Somos ASPAL — Asociaciones Profesionales de Latinoamérica. La casa común donde se forman, conectan y crecen los líderes que construyen el sector asociativo de la región.",
};

/** Bloque 2: Quiénes somos. */
export const QUIENES_SOMOS: string[] = [
  `ASPAL es la primera organización en español dedicada a profesionalizar la gestión de asociaciones, sociedades, colegios y federaciones de toda América Latina. Nacimos en ${ANIO_FUNDACION} dentro del ecosistema de World Urban Parks y ANPR México, y en 2026 iniciamos nuestra etapa de consolidación como red regional independiente con miembros individuales y grupales en todo LATAM.`,
  "Trabajamos con cuatro palancas — Comunidad, Conocimiento, Tecnología y Datos — para que cada asociación de la región tenga las herramientas, las conexiones y la evidencia que necesita para cumplir su misión y crecer con propósito.",
  "Nuestra sede operativa está en Mérida, Yucatán (México), y desde ahí articulamos una red de líderes, invitados y aliados presentes en más de 15 países de Iberoamérica.",
];

/** Bloque 3: Nuestra esencia (copy oficial, no se edita). */
export const MISION =
  "Somos la red en español que profesionaliza la gestión asociativa en América Latina, brindando formación, comunidad, tecnología y datos para que cada asociación cumpla su misión con resultados sostenibles.";
export const VISION =
  "Para 2030, ningún director de asociación profesional en América Latina dirigirá solo: ASPAL será la casa común donde se forman, conectan y crecen los líderes que construyen el sector asociativo de la región.";

/** Bloque 4: Lo que defendemos. */
export const DEFENDEMOS: { titulo: string; texto: string }[] = [
  {
    titulo: "Nuestra causa",
    texto:
      "Creemos que las asociaciones profesionales transforman a las profesiones que representan y, con ellas, a los países que integran. Cuando el sector asociativo LATAM se profesionaliza, las profesiones de la región ganan estándares, voz pública y capacidad de incidir.",
  },
  {
    titulo: "Nuestra propuesta de valor",
    texto:
      "Conectamos a los líderes de asociaciones de América Latina con las mejores prácticas, la comunidad de pares y las herramientas tecnológicas que hoy solo eran accesibles en inglés y a precios estadounidenses.",
  },
  {
    titulo: "Nuestra promesa",
    texto:
      "Al unirte a ASPAL dejas de dirigir tu asociación solo. Encuentras un directorio de colegas, una biblioteca curada, una plataforma tecnológica lista para usar y datos reales del sector para decidir con evidencia.",
  },
  {
    titulo: "Nuestro compromiso",
    texto:
      "Trabajamos por y para el sector, no por encima de él. Nuestras decisiones se rigen por el Consejo Directivo, nuestros ingresos se reinvierten en el ecosistema y nuestra voz es la de nuestros miembros — no la de un patrocinador.",
  },
];

/** Bloque 6: Cómo aportamos al sector asociativo LATAM. */
export const APORTES: string[] = [
  "Formamos a directores, staff y voluntarios del sector asociativo de LATAM en gestión, gobernanza y transformación digital.",
  "Publicamos guías, artículos y podcast en español para acortar la curva de aprendizaje del sector.",
  "Facilitamos plataforma tecnológica lista para asociaciones que no tienen recursos internos de TI.",
  "Producimos datos, tendencias e investigaciones propias del sector asociativo latinoamericano.",
  "Conectamos a colegas de toda la región a través de foros, comunidades y el Encuentro Latinoamericano anual.",
  "Impulsamos alianzas con organizaciones referentes (ASAE, CSAE, ESAE, WUP) para llevar el mejor benchmark internacional a LATAM.",
  "Reconocemos y certificamos las buenas prácticas de gestión asociativa a través de nuestra Certificación Profesional (CGA).",
];

/** Bloque 7: Ruta ASPAL 2026–2030. */
export interface Hito {
  anio: string;
  nombre: string;
  descripcion: string;
  estado: "en-curso" | "futuro";
}

export const RUTA: Hito[] = [
  {
    anio: "2026",
    nombre: "Relanzamiento",
    descripcion:
      "Nueva plataforma web, Podcast Temporada 1 (16 episodios), primeros ingresos por alianza Parksys, comunidad activa con 300 suscriptores.",
    estado: "en-curso",
  },
  {
    anio: "Q1 2027",
    nombre: "Primer Encuentro Latinoamericano",
    descripcion:
      "Congreso CDMX con 150 directores de asociación en sala. Primer estudio comparativo del sector.",
    estado: "futuro",
  },
  {
    anio: "Dic 2027",
    nombre: "Presencia regional",
    descripcion:
      "ASPAL con miembros activos en 10 países de América Latina. Primeros 3 clientes de plataforma SaaS.",
    estado: "futuro",
  },
  {
    anio: "Q4 2028",
    nombre: "Certificación",
    descripcion:
      "Lanzamiento de la Certificación Profesional ASPAL (CGA — Certificación en Gestión Asociativa).",
    estado: "futuro",
  },
  {
    anio: "2029",
    nombre: "Consolidación",
    descripcion:
      "500 líderes formados por la Academia ASPAL. 50 asociaciones-miembro grupales.",
    estado: "futuro",
  },
  {
    anio: "2030",
    nombre: "Visión cumplida",
    descripcion:
      "1,000 líderes formados · presencia en los 20 países de LATAM · comunidad activa de pares en español.",
    estado: "futuro",
  },
];

/** Bloque 8: Quiénes hacen posible ASPAL. */
export interface TarjetaGobierno {
  titulo: string;
  texto: string;
  enlace: EnlaceContenido;
}

export const HACEN_POSIBLE: TarjetaGobierno[] = [
  {
    titulo: "Equipo Ejecutivo",
    texto:
      "La operación diaria de ASPAL está a cargo de un equipo compacto y experimentado, respaldado por el secretariado compartido con WUP y ANPR (15 personas en total).",
    enlace: { etiqueta: "Conoce al equipo", href: "/nuestro-equipo" },
  },
  {
    titulo: "Consejo Directivo",
    texto:
      "El gobierno estratégico de ASPAL recae en su Consejo Directivo, integrado por líderes del sector asociativo de la región. Orienta la visión de largo plazo, aprueba las decisiones estratégicas y protege la misión frente a intereses particulares.",
    // PENDIENTE (Etapa 2): integrantes con foto, cargo, organización y ciudad.
    enlace: { etiqueta: "Integrantes" },
  },
  {
    titulo: "Aliados Estratégicos",
    texto:
      "ASPAL nace y crece dentro de un ecosistema de organizaciones aliadas. Su respaldo institucional y su comunidad son parte del capital fundacional de ASPAL.",
    enlace: { etiqueta: "Ver aliados", href: "#aliados" },
  },
];

/** Bloque 9: Aliados estratégicos. En la Etapa 1 solo los fundadores. */
export interface Aliado {
  nombre: string;
  descripcion: string;
  /** Clave del logo en MuroAliados. Sin logo, se muestra el nombre. */
  logo?: "wup" | "anpr";
}

export const ALIADOS_FUNDADORES: Aliado[] = [
  {
    nombre: "World Urban Parks",
    descripcion:
      "Red global de más de 15 países que ampara el trabajo institucional de ASPAL.",
    logo: "wup",
  },
  {
    nombre: "ANPR México",
    descripcion:
      "Organización hermana, referente del secretariado compartido y de la operación tecnológica.",
    logo: "anpr",
  },
  {
    // PENDIENTE: logo de Parksys en alta resolución (insumo de la semana 0).
    nombre: "Parksys",
    descripcion:
      "Plataforma tecnológica aliada, generadora de ingresos para ASPAL desde julio 2026.",
  },
];

/** Categorías del muro que se anuncian «conforme se firmen convenios» (§6.2). */
export const CATEGORIAS_ALIADOS_PENDIENTES: string[] = [
  "Aliados regionales",
  "Aliados internacionales",
  "Patrocinadores y sponsors",
];

/** Bloque 10: Únete a la casa común. */
export const CTA_FINAL: string[] = [
  "Si diriges o formas parte del equipo de una asociación, sociedad, colegio o federación profesional en América Latina, esta es tu casa.",
  "Únete a la comunidad ASPAL: la red en español que profesionaliza el sector asociativo LATAM.",
];
```

`client/src/content/institucional/equipo.ts`:

```ts
/**
 * Nuestro equipo (Concepto NOSOTROS, Bloque 8, tarjeta 1). Copy literal.
 *
 * PENDIENTE (semana 0): retratos con el mismo fondo y luz, perfiles de
 * LinkedIn y bios finales de 60–80 palabras (§6.4). Sin foto, la tarjeta
 * muestra la silueta con el isotipo.
 */
export const INTRO_EQUIPO =
  "La operación diaria de ASPAL está a cargo de un equipo compacto y experimentado, respaldado por el secretariado compartido con WUP y ANPR (15 personas en total).";

export interface Perfil {
  nombre: string;
  cargo: string;
  bio: string;
  foto?: string;
  linkedin?: string;
}

export const PERFILES: Perfil[] = [
  {
    nombre: "Luis Romahn",
    cargo: "Director General y Fundador",
    bio: "CEO de World Urban Parks, autor de Construyendo Mi Parque (2018), Salzburg Fellow 2021, WUP Emerging Leaders Award 2021.",
  },
  {
    nombre: "Patricia Hernández de Anda",
    cargo: "Coordinadora General",
    bio: "22+ años de trayectoria en el sector social, gobierno y asociaciones civiles en México y España.",
  },
  {
    nombre: "Antonio Góngora",
    cargo: "Coordinador de Tecnología",
    bio: "Responsable de la plataforma SaaS y de la infraestructura digital de ASPAL, WUP y ANPR.",
  },
];
```

En `contenido.test.ts`, cambia `it("enlaza solo rutas internas que existen…"` por `it.todo("enlaza solo rutas internas que existen… (se activa en el Task 4)")` y guarda el cuerpo en un comentario. El Task 4 lo reactiva cuando existan `/nuestro-equipo` y el resto de rutas.

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run client/src/content/institucional/contenido.test.ts`
Expected: PASS, 5 tests y 1 todo.

- [ ] **Step 5: Puertas y commit**

```bash
npx prettier --write client/src/content/
npm run check && npm run lint && npm run format:check && npm test
git add client/src/content/
git commit -m "Añadir el contenido institucional del Concepto NOSOTROS en módulos tipados"
```

---

### Task 2: `/que-hacemos`, `SubnavSeccion` y `PilarCard`

**Files:**

- Create: `client/src/components/institucional/SubnavSeccion.tsx`, `client/src/components/institucional/PilarCard.tsx`, `client/src/pages/que-hacemos.tsx`
- Modify: `client/src/lib/rutas.ts` (`"/que-hacemos"`), `client/src/lib/seo.ts`, `client/src/App.tsx`

**Interfaces:**

- Consumes: `PILARES`, `CTA_FINAL` y `HASHTAG` (Task 1); `Banda` y `HeroInstitucional` (PR E1); `NAVEGACION`, `destinosDe` y `esRutaActiva`; `AvisoPestanaNueva` y `Proximamente`.
- Produces:
  - `SubnavSeccion(): JSX.Element | null`. Pinta los destinos internos vivos de «Acerca de» y devuelve null si hay menos de dos.
  - `PilarCard({ pilar, variante }: { pilar: Pilar; variante: "resumen" | "detalle" })`

- [ ] **Step 1: `SubnavSeccion.tsx`**

```tsx
import { NAVEGACION, destinosDe, esRutaActiva } from "@/lib/navegacion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

/**
 * Subnavegación «Acerca de» (§6.2): barra fija bajo el header, compartida por
 * Nosotros, ¿Qué hacemos? y Nuestro equipo. Sale de navegacion.ts (solo los
 * destinos internos vivos), así que un destino nuevo aparece aquí solo al
 * darle `href`. Con menos de dos destinos no tiene sentido y no se pinta.
 */
export function SubnavSeccion() {
  const [ruta] = useLocation();
  const acerca = NAVEGACION.find((entrada) => entrada.testid === "menu-acerca-de");
  const destinos = acerca ? destinosDe(acerca).filter((d) => d.href && !d.externo) : [];
  if (destinos.length < 2) return null;

  return (
    <nav
      aria-label="Acerca de"
      className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur"
      data-testid="subnav-acerca-de"
    >
      <div className="container mx-auto max-w-7xl overflow-x-auto px-4 md:px-8">
        <ul className="flex gap-1">
          {destinos.map((destino) => {
            const activo = esRutaActiva(destino.href, ruta);
            return (
              <li key={destino.testid}>
                <Link
                  href={destino.href!}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors",
                    activo
                      ? "border-secondary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                  data-testid={`subnav-${destino.testid}`}
                >
                  {destino.etiqueta}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: `PilarCard.tsx`**

```tsx
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import { Proximamente } from "@/components/layout/Proximamente";
import type { EnlaceContenido, Pilar } from "@/content/institucional/pilares";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

function EnlacePilar({ enlace, testid }: { enlace: EnlaceContenido; testid: string }) {
  const clases =
    "inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline underline-offset-4";
  if (!enlace.href) {
    return (
      <span
        className="inline-flex min-h-11 items-center gap-2 text-muted-foreground"
        data-testid={testid}
      >
        {enlace.etiqueta} <Proximamente />
      </span>
    );
  }
  if (enlace.externo) {
    return (
      <a
        href={enlace.href}
        target="_blank"
        rel="noopener noreferrer"
        className={clases}
        data-testid={testid}
      >
        {enlace.etiqueta}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        <AvisoPestanaNueva />
      </a>
    );
  }
  return (
    <Link href={enlace.href} className={clases} data-testid={testid}>
      {enlace.etiqueta}
    </Link>
  );
}

/**
 * Un pilar ASPAL. «resumen» (en Nosotros): nombre, subtítulo, compromiso y
 * enlace al detalle. «detalle» (en ¿Qué hacemos?): todo, más «cómo se traduce»
 * y los enlaces a lo que ya existe.
 */
export function PilarCard({
  pilar,
  variante,
}: {
  pilar: Pilar;
  variante: "resumen" | "detalle";
}) {
  const Icono = pilar.icono;
  const Titulo = variante === "detalle" ? "h2" : "h3";

  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 md:p-8"
      data-testid={`pilar-${pilar.id}`}
    >
      <Icono className="h-8 w-8 text-primary" aria-hidden="true" />
      <Titulo className="mt-4 text-2xl font-bold text-foreground">{pilar.nombre}</Titulo>
      <p className="mt-1 text-lg italic text-muted-foreground">{pilar.subtitulo}</p>
      <p className="mt-4 text-lg text-foreground">
        <strong className="font-semibold">Compromiso ASPAL:</strong> {pilar.compromiso}
      </p>
      {variante === "detalle" ? (
        <>
          <p className="mt-3 text-lg text-foreground">
            <strong className="font-semibold">Cómo se traduce:</strong>{" "}
            {pilar.comoSeTraduce}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6">
            {pilar.enlaces.map((enlace, i) => (
              <li key={enlace.etiqueta}>
                <EnlacePilar enlace={enlace} testid={`pilar-${pilar.id}-enlace-${i}`} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link
          href={`/que-hacemos#${pilar.id}`}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-medium text-primary underline underline-offset-4"
          data-testid={`pilar-${pilar.id}-detalle`}
        >
          Cómo se traduce
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
```

- [ ] **Step 3: Ruta, SEO y página**

`rutas.ts`: añade `"/que-hacemos"` a `RUTAS_ESTATICAS`. `seo.ts`:

```ts
  "/que-hacemos": {
    titulo: "¿Qué hacemos? · ASPAL",
    descripcion:
      "Comunidad, conocimiento, tecnología y datos: los cuatro pilares con los que ASPAL profesionaliza el sector asociativo de América Latina.",
    indexable: true,
  },
```

`App.tsx`: `import QueHacemos from "@/pages/que-hacemos";` y `"/que-hacemos": QueHacemos` en `PAGINAS`.

`client/src/pages/que-hacemos.tsx`:

```tsx
import { PilarCard } from "@/components/institucional/PilarCard";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { CTA_FINAL, HASHTAG, QUIENES_SOMOS } from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { Link } from "wouter";

/**
 * ¿Qué hacemos? (§6.3): los 4 pilares, cada uno con su ancla (RF-08). La
 * intro es el segundo párrafo de «Quiénes somos» (las cuatro palancas).
 * PENDIENTE: banda de descarga del Dossier ASPAL 2026 (oculta hasta que exista
 * el PDF; RF-06, evento download_dossier).
 */
export default function QueHacemos() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SubnavSeccion />
      <main className="flex-1">
        <HeroInstitucional overline="¿Qué hacemos?" titulo="Los 4 Pilares ASPAL">
          <p>{QUIENES_SOMOS[1]}</p>
        </HeroInstitucional>

        {PILARES.map((pilar, i) => (
          <Banda
            key={pilar.id}
            id={pilar.id}
            tono={i % 2 === 0 ? "blanco" : "suave"}
            className="scroll-mt-32"
          >
            <div className="mx-auto max-w-4xl">
              <PilarCard pilar={pilar} variante="detalle" />
            </div>
          </Banda>
        ))}

        <Banda tono="noche">
          <p className="text-[13px] font-semibold tracking-wider text-secondary">
            {HASHTAG}
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Únete a la casa común</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{CTA_FINAL[1]}</p>
          <Button variant="secondary" className="mt-8 min-h-11 px-6" asChild>
            <Link
              href="/unete"
              onClick={() => registrarEvento("click_unete", { origen: "que_hacemos" })}
              data-testid="button-que-hacemos-unete"
            >
              Únete a la comunidad
            </Link>
          </Button>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

Los pilares llevan `h2` (variante «detalle») bajo el `h1` del hero: la jerarquía no se salta.

- [ ] **Step 4: Puertas y comprobación**

```bash
npx prettier --write client/src
npm run check && npm run lint && npm run format:check && npm test
```

En `PORT=5001 npm run dev`, abre `/que-hacemos#tecnologia`: el bloque Tecnología queda a la vista, no tapado por el header. La subnavegación aún no se ve (solo un destino vivo). Hay que anotar la verificación visual para el controlador.

- [ ] **Step 5: Commit**

```bash
git add client/src
git commit -m "Publicar ¿Qué hacemos? con los cuatro pilares y sus anclas"
```

---

### Task 3: `/nuestro-equipo` y `PerfilCard`

**Files:**

- Create: `client/src/components/institucional/PerfilCard.tsx`, `client/src/pages/nuestro-equipo.tsx`
- Modify: `rutas.ts` (`"/nuestro-equipo"`), `seo.ts`, `App.tsx`

**Interfaces:**

- Consumes: `INTRO_EQUIPO` y `PERFILES` (Task 1); `SubnavSeccion` (Task 2); el isotipo `@assets/Aspal-Icono_1763675356866.png`.
- Produces: `PerfilCard({ perfil }: { perfil: Perfil })`

- [ ] **Step 1: `PerfilCard.tsx`**

```tsx
import iconoAspal from "@assets/Aspal-Icono_1763675356866.png";
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import type { Perfil } from "@/content/institucional/equipo";
import { Linkedin } from "lucide-react";

/**
 * Tarjeta de perfil (§6.4): foto 4:5, nombre, cargo, bio y LinkedIn. Sin foto,
 * silueta con el isotipo ASPAL (mitigación prevista en el Excel), así que al
 * llegar los retratos basta con rellenar `foto` en equipo.ts.
 */
export function PerfilCard({ perfil }: { perfil: Perfil }) {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background"
      data-testid={`perfil-${perfil.nombre.toLowerCase().split(" ")[0]}`}
    >
      <div className="flex aspect-[4/5] items-center justify-center bg-fondo-suave">
        {perfil.foto ? (
          <img
            src={perfil.foto}
            alt={`Retrato de ${perfil.nombre}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={iconoAspal}
            alt=""
            aria-hidden="true"
            width={1500}
            height={1877}
            className="h-24 w-auto opacity-60"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold text-foreground">{perfil.nombre}</h2>
        <p className="mt-1 font-medium text-miel-texto">{perfil.cargo}</p>
        <p className="mt-3 text-base text-muted-foreground">{perfil.bio}</p>
        {perfil.linkedin && (
          <a
            href={perfil.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-medium text-primary underline underline-offset-4"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
            <AvisoPestanaNueva />
          </a>
        )}
      </div>
    </article>
  );
}
```

(La silueta es un `img` decorativo con opacidad; no es texto, así que no afecta al contraste AA.)

- [ ] **Step 2: Ruta, SEO y página**

`rutas.ts`: añade `"/nuestro-equipo"`. `seo.ts`:

```ts
  "/nuestro-equipo": {
    titulo: "Nuestro equipo · ASPAL",
    descripcion:
      "La operación diaria de ASPAL está a cargo de un equipo compacto y experimentado, respaldado por el secretariado compartido con WUP y ANPR.",
    indexable: true,
  },
```

`App.tsx`: `import NuestroEquipo from "@/pages/nuestro-equipo";` y `"/nuestro-equipo": NuestroEquipo`.

`client/src/pages/nuestro-equipo.tsx`:

```tsx
import { PerfilCard } from "@/components/institucional/PerfilCard";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { INTRO_EQUIPO, PERFILES } from "@/content/institucional/equipo";

/** Nuestro equipo (§6.4): intro y tres perfiles del Concepto NOSOTROS, Bloque 8. */
export default function NuestroEquipo() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SubnavSeccion />
      <main className="flex-1">
        <HeroInstitucional overline="Nuestro equipo" titulo="Quiénes hacen posible ASPAL">
          <p>{INTRO_EQUIPO}</p>
        </HeroInstitucional>
        <Banda tono="suave">
          <ul className="grid gap-6 md:grid-cols-3">
            {PERFILES.map((perfil) => (
              <li key={perfil.nombre}>
                <PerfilCard perfil={perfil} />
              </li>
            ))}
          </ul>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Puertas y commit**

```bash
npx prettier --write client/src
npm run check && npm run lint && npm run format:check && npm test
git add client/src
git commit -m "Publicar Nuestro equipo con los tres perfiles y silueta a falta de retrato"
```

---

### Task 4: `/nosotros` con sus 10 bloques, y los enlaces de «Acerca de»

**Files:**

- Create: `client/src/components/institucional/TarjetaCompromiso.tsx`, `RutaTimeline.tsx` y `MuroAliados.tsx`; `client/src/pages/nosotros.tsx`
- Modify: `rutas.ts` (`"/nosotros"`), `seo.ts`, `App.tsx`
- Modify: `client/src/lib/navegacion.ts` (hrefs de Nosotros, ¿Qué hacemos? y Nuestro equipo)
- Modify: `client/src/lib/rutas.test.ts` y `sugerencias.test.ts` (sus ejemplos de «ruta inexistente» usaban `/nosotros`)
- Modify: `client/src/content/institucional/contenido.test.ts` (reactiva el `it.todo`)
- Modify: `client/src/components/layout/Footer.tsx` (`id="boletin"`)

**Interfaces:**

- Consumes: todo el Task 1; `PilarCard` y `SubnavSeccion` (Task 2).
- Produces: `TarjetaCompromiso({ titulo, texto })`, `RutaTimeline({ hitos }: { hitos: Hito[] })` y `MuroAliados({ fundadores, pendientes })`.

- [ ] **Step 1: Componentes**

`TarjetaCompromiso.tsx`:

```tsx
/** Tarjeta de «Lo que defendemos» (Bloque 4). */
export function TarjetaCompromiso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <article className="h-full rounded-2xl border border-border bg-background p-6 md:p-8">
      <h3 className="text-xl font-bold text-foreground">{titulo}</h3>
      <p className="mt-3 text-lg text-muted-foreground">{texto}</p>
    </article>
  );
}
```

`RutaTimeline.tsx`:

```tsx
import type { Hito } from "@/content/institucional/nosotros";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/**
 * Ruta ASPAL 2026–2030 (Bloque 7, RF-07). Escalera horizontal en escritorio y
 * vertical en móvil. Cada hito es un <details> nativo: se abre con clic, toque
 * y teclado (Enter/Espacio en el resumen) sin JavaScript, y su texto está en el
 * HTML prerenderizado. El hito en curso va en pizarra sólida; los futuros, con
 * borde tenue, sin bajar la opacidad del texto (contraste AA), y una etiqueta
 * escrita para que el estado no dependa del color.
 */
export function RutaTimeline({ hitos }: { hitos: Hito[] }) {
  return (
    <ol className="grid gap-4 lg:grid-cols-6">
      {hitos.map((hito, i) => {
        const enCurso = hito.estado === "en-curso";
        return (
          <li
            key={hito.anio}
            className={cn("lg:mt-[var(--escalon)]")}
            style={
              { "--escalon": `${(hitos.length - 1 - i) * 1.5}rem` } as React.CSSProperties
            }
          >
            <details
              className={cn(
                "group h-full rounded-2xl border-2 p-4",
                enCurso
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/30 bg-background text-foreground",
              )}
              data-testid={`hito-${i}`}
            >
              <summary className="flex min-h-11 cursor-pointer list-none flex-col gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold">{hito.anio}</span>
                <span className="text-lg font-bold leading-tight">{hito.nombre}</span>
                <span className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide">
                  {enCurso ? "En curso" : "Próximo"}
                  <ChevronDown
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <p className="mt-3 text-sm">{hito.descripcion}</p>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
```

(El escalón visual en escritorio sube de izquierda a derecha con margen superior decreciente. En móvil la lista es una columna.)

`MuroAliados.tsx`:

```tsx
import logoAnpr from "@assets/Recurso 50comunidad ASPAL_1763678044080.png";
import logoWup from "@assets/Recurso 53comunidad ASPAL_1763678055285.png";
import type { Aliado } from "@/content/institucional/nosotros";

const LOGOS = { wup: logoWup, anpr: logoAnpr } as const;

/**
 * Muro de aliados (Bloque 9). En la Etapa 1 solo los fundadores; las demás
 * categorías se anuncian «conforme se firmen convenios» (§6.2). Rejilla
 * estática: sin carrusel automático (accesibilidad).
 */
export function MuroAliados({
  fundadores,
  pendientes,
}: {
  fundadores: Aliado[];
  pendientes: string[];
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground">
        Fundadores y respaldo institucional
      </h3>
      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {fundadores.map((aliado) => (
          <li
            key={aliado.nombre}
            className="flex h-full flex-col rounded-2xl border border-border bg-background p-6"
            data-testid={`aliado-${aliado.nombre.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex h-24 items-center">
              {aliado.logo ? (
                <img
                  src={LOGOS[aliado.logo]}
                  alt={aliado.nombre}
                  className="max-h-20 w-auto"
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {aliado.nombre}
                </span>
              )}
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              {aliado.logo && (
                <strong className="font-semibold text-foreground">
                  {aliado.nombre}:{" "}
                </strong>
              )}
              {aliado.descripcion}
            </p>
          </li>
        ))}
      </ul>
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {pendientes.map((categoria) => (
          <li
            key={categoria}
            className="rounded-2xl border border-dashed border-border p-4 text-base text-muted-foreground"
          >
            <span className="font-semibold text-foreground">{categoria}.</span> Conforme
            se firmen convenios.
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Página `/nosotros`**

`rutas.ts`: añade `"/nosotros"`. `seo.ts` (descripción del §7 del documento):

```ts
  "/nosotros": {
    titulo: "Nosotros · ASPAL",
    descripcion:
      "La red en español que profesionaliza la gestión asociativa de América Latina. Formación, comunidad, tecnología y datos para asociaciones profesionales LATAM.",
    indexable: true,
  },
```

`App.tsx`: `import Nosotros from "@/pages/nosotros";` y `"/nosotros": Nosotros`.

`client/src/pages/nosotros.tsx`:

```tsx
import { MuroAliados } from "@/components/institucional/MuroAliados";
import { PilarCard } from "@/components/institucional/PilarCard";
import { RutaTimeline } from "@/components/institucional/RutaTimeline";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { TarjetaCompromiso } from "@/components/institucional/TarjetaCompromiso";
import { Proximamente } from "@/components/layout/Proximamente";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import {
  ALIADOS_FUNDADORES,
  APORTES,
  CATEGORIAS_ALIADOS_PENDIENTES,
  CTA_FINAL,
  DEFENDEMOS,
  HACEN_POSIBLE,
  HASHTAG,
  HERO_NOSOTROS,
  MISION,
  QUIENES_SOMOS,
  RUTA,
  VISION,
} from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { CONTACTO } from "@/lib/marca";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const h2 = "text-3xl font-bold text-foreground md:text-4xl";

/** Nosotros (§6.2): los 10 bloques del Concepto NOSOTROS, en su orden. */
export default function Nosotros() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SubnavSeccion />
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroInstitucional overline="Nosotros" titulo={HERO_NOSOTROS.tagline}>
          <p>{HERO_NOSOTROS.parrafo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className="min-h-11 px-6" asChild>
              <Link
                href="/unete"
                onClick={() => registrarEvento("click_unete", { origen: "nosotros" })}
                data-testid="button-nosotros-unete"
              >
                Únete a la comunidad
              </Link>
            </Button>
            <Button
              variant="outline"
              className="min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10"
              asChild
            >
              <a href="#lo-que-defendemos" data-testid="button-nosotros-propuesta">
                Conoce nuestra propuesta de valor
              </a>
            </Button>
          </div>
        </HeroInstitucional>

        {/* 2. Quiénes somos */}
        <Banda id="quienes-somos">
          <div className="mx-auto max-w-3xl">
            <h2 className={h2}>Quiénes somos</h2>
            {QUIENES_SOMOS.map((parrafo) => (
              <p
                key={parrafo.slice(0, 20)}
                className="mt-4 text-lg text-muted-foreground"
              >
                {parrafo}
              </p>
            ))}
          </div>
        </Banda>

        {/* 3. Nuestra esencia */}
        <Banda id="esencia" tono="suave">
          <h2 className={h2}>Nuestra esencia</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-miel-texto">
                Misión
              </h3>
              <p className="mt-3 text-lg text-foreground">{MISION}</p>
            </article>
            <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-miel-texto">
                Visión 2030
              </h3>
              <p className="mt-3 text-lg text-foreground">{VISION}</p>
            </article>
          </div>
          <p className="mt-6 text-center text-xl font-bold text-primary">{HASHTAG}</p>
        </Banda>

        {/* 4. Lo que defendemos */}
        <Banda id="lo-que-defendemos" className="scroll-mt-32">
          <h2 className={h2}>Lo que defendemos</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {DEFENDEMOS.map((d) => (
              <li key={d.titulo}>
                <TarjetaCompromiso titulo={d.titulo} texto={d.texto} />
              </li>
            ))}
          </ul>
        </Banda>

        {/* 5. Los 4 Pilares */}
        <Banda id="pilares" tono="suave">
          <h2 className={h2}>Los 4 Pilares ASPAL</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PILARES.map((pilar) => (
              <li key={pilar.id}>
                <PilarCard pilar={pilar} variante="resumen" />
              </li>
            ))}
          </ul>
        </Banda>

        {/* 6. Cómo aportamos */}
        <Banda>
          <h2 className={h2}>Cómo aportamos al sector asociativo LATAM</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {APORTES.map((aporte) => (
              <li
                key={aporte.slice(0, 20)}
                className="flex gap-3 text-lg text-foreground"
              >
                <CheckCircle2
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {aporte}
              </li>
            ))}
          </ul>
        </Banda>

        {/* 7. Ruta 2026–2030 */}
        <Banda id="ruta" tono="suave">
          <h2 className={h2}>Ruta ASPAL 2026–2030</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Abre cada hito para ver el detalle.
          </p>
          <div className="mt-8">
            <RutaTimeline hitos={RUTA} />
          </div>
        </Banda>

        {/* 8. Quiénes hacen posible ASPAL */}
        <Banda>
          <h2 className={h2}>Quiénes hacen posible ASPAL</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {HACEN_POSIBLE.map((tarjeta) => (
              <li key={tarjeta.titulo}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground">{tarjeta.titulo}</h3>
                  <p className="mt-3 text-base text-muted-foreground">{tarjeta.texto}</p>
                  <div className="mt-auto pt-4">
                    {tarjeta.enlace.href ? (
                      <a
                        href={tarjeta.enlace.href}
                        className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
                      >
                        {tarjeta.enlace.etiqueta}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center gap-2 text-muted-foreground">
                        {tarjeta.enlace.etiqueta} <Proximamente />
                      </span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Banda>

        {/* 9. Aliados */}
        <Banda id="aliados" tono="suave" className="scroll-mt-32">
          <h2 className={h2}>Aliados estratégicos</h2>
          <div className="mt-8">
            <MuroAliados
              fundadores={ALIADOS_FUNDADORES}
              pendientes={CATEGORIAS_ALIADOS_PENDIENTES}
            />
          </div>
        </Banda>

        {/* 10. Únete a la casa común */}
        <Banda tono="noche">
          <h2 className="text-3xl font-extrabold md:text-5xl">{HASHTAG}</h2>
          {CTA_FINAL.map((parrafo) => (
            <p
              key={parrafo.slice(0, 20)}
              className="mt-4 max-w-2xl text-lg text-white/85"
            >
              {parrafo}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className="min-h-11 px-6" asChild>
              <Link
                href="/unete"
                onClick={() => registrarEvento("click_unete", { origen: "nosotros" })}
                data-testid="button-nosotros-membresias"
              >
                Explorar membresías
              </Link>
            </Button>
            <Button
              variant="outline"
              className="min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10"
              asChild
            >
              <a href="#boletin" data-testid="button-nosotros-boletin">
                Suscribirme al boletín
              </a>
            </Button>
            {/* PENDIENTE (Etapa 0): /contacto. Mientras tanto, correo. */}
            <Button
              variant="outline"
              className="min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10"
              asChild
            >
              <a
                href={`mailto:${CONTACTO.correo}`}
                data-testid="button-nosotros-contacto"
              >
                Contactar al equipo
              </a>
            </Button>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

(El `<a href>` de «Quiénes hacen posible» sirve para `/nuestro-equipo` y para `#aliados`. Un `<a>` interno recarga la página en lugar de navegar en la SPA; si molesta, usa `Link` cuando `href` empiece por `/`. Hazlo: `tarjeta.enlace.href.startsWith("/") ? <Link …> : <a …>`.)

- [ ] **Step 3: Pie, menú y tests**

- `Footer.tsx`: añade `id="boletin"` y `className="… scroll-mt-32"` a la fila del boletín.
- `navegacion.ts`: da `href` a Nosotros (`"/nosotros"`), ¿Qué hacemos? (`"/que-hacemos"`) y Nuestro equipo (`"/nuestro-equipo"`), y quita sus `PENDIENTE (PR E)`. Siguen siendo los tres primeros: vivos antes que pendientes.
- `rutas.test.ts`: en «rechaza una ruta que todavía no existe», cambia `"/nosotros"` por `"/inexistente"`.
- `sugerencias.test.ts`: en «no inventa cuando nada se parece», cambia `"/nosotros"` por `"/inexistente"`.
- `navegacion.test.ts`: si el comentario del test de enlaces muertos menciona `/nosotros` como pendiente, actualízalo.
- `contenido.test.ts`: reactiva el test de enlaces (quita el `it.todo`).

Run: `npx vitest run client/src`
Expected: PASS.

- [ ] **Step 4: Puertas, build y comprobaciones**

```bash
npx prettier --write client/src
npm run check && npm run lint && npm run format:check && npm test && npm run build
grep -c "<h1" dist/public/nosotros.html dist/public/que-hacemos.html dist/public/nuestro-equipo.html
grep -c "Visión cumplida" dist/public/nosotros.html
grep -o 'id="tecnologia"' dist/public/que-hacemos.html
```

Expected: verde. El prerender genera 9 rutas. Hay un `<h1` por página, los hitos están en el HTML y existe el ancla `tecnologia`.

- [ ] **Step 5: Commit**

```bash
git add client/src
git commit -m "Publicar Nosotros con sus diez bloques y activar las páginas de Acerca de"
```

- [ ] **Step 6: Verificación en navegador (la hace el controlador)**

A 375, 768, 1024 y 1440 px:

- La subnavegación «Acerca de» aparece en las tres páginas, marca la activa y a 375 px hace scroll dentro de sí.
- Los hitos de la Ruta se abren con Enter y con clic.
- `/que-hacemos#datos` desde otra página deja el bloque a la vista.
- El CTA «Suscribirme al boletín» baja al boletín del pie.
- No hay scroll horizontal.
- Con JavaScript desactivado, `/nosotros` se lee completa.

---

### Task 5: Documentar y cerrar el PR E2

**Files:**

- Modify: `docs/design-guidelines.md`

- [ ] **Step 1: Sección «Contenido institucional»**

Añade antes de «## Movimiento»:

```markdown
## Contenido institucional

- El copy de Nosotros, ¿Qué hacemos? y Nuestro equipo vive en
  `client/src/content/institucional/` y es literal del documento «Concepto
  NOSOTROS». Cambiar un texto = editar ese módulo; las páginas no llevan copy.
- `contenido.test.ts` rechaza textos vacíos, marcadores de relleno y enlaces a
  rutas que no existen.
- Datos pendientes (año de fundación D7, fotos, LinkedIn, Consejo, logo de
  Parksys, Dossier) van como `PENDIENTE` en el módulo, nunca inventados.
- Componentes de estas páginas: `components/institucional/` (SubnavSeccion,
  PilarCard, PerfilCard, TarjetaCompromiso, RutaTimeline, MuroAliados).
```

- [ ] **Step 2: Puertas completas, build y commit**

```bash
npx prettier --write docs/design-guidelines.md
npm run check && npm run lint && npm run format:check && npm test && npm run build
git add docs/design-guidelines.md
git commit -m "Documentar el contenido institucional y sus componentes"
```

- [ ] **Step 3: Integración (la hace el controlador, tras la revisión final)**

```bash
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/e2-institucional -m "PR E2: Nosotros, ¿Qué hacemos? y Nuestro equipo"
```

---

## Qué queda fuera

- **D7, año de fundación:** hoy 2024. Es una sola constante y se cambia cuando Luis lo confirme.
- **Retratos, LinkedIn y bios de 60–80 palabras:** hoy se muestran siluetas y las bios cortas del documento.
- **Consejo Directivo (Etapa 2):** hoy aparece como «Próximamente».
- **Logo de Parksys:** hoy se muestra su nombre en texto.
- **Dossier ASPAL 2026 (RF-06):** la banda de descarga no se pinta hasta que exista el PDF.
- **Contacto (Etapa 0):** el botón «Contactar al equipo» usa el correo.
- **Fotografía de eventos** para los heroes y el mosaico de «Quiénes somos» (Bloque 2): cuando llegue.
