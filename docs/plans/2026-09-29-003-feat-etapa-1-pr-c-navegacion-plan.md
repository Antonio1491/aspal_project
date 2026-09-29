---
title: PR C de la Etapa 1 — Menú de 6 rubros, mega-menú Recursos y pie institucional
type: feat
status: active
date: 2026-09-29
spec: docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
parent: docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md
---

# PR C — Navegación institucional: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir el menú de 3 entradas por la arquitectura institucional: Acerca de · Recursos (mega-menú de 4 grupos) · Eventos · Membresía · Comunidad, con el botón Únete, y reescribir el pie en 5 columnas con barra legal, legible sin JavaScript.

**Architecture:** `client/src/lib/navegacion.ts` sigue siendo la **fuente única** de cabecera, panel móvil, pie y 404. `EntradaNav` admite `grupos` además de `destinos`. `destinosDe(entrada)` aplana ambas formas para todos los consumidores, así que ninguno vuelve a leer `entrada.destinos` directamente. Los destinos sin página siguen siendo «Próximamente» (sin `href`), y el test de enlaces muertos garantiza que ninguno se active antes de que exista su ruta. El mega-menú reutiliza el `NavigationMenu` de Radix que ya está en uso; solo se centra su viewport. El pie deja framer-motion: el prerender del PR B lo dejaba a opacidad 0.

**Tech Stack:** React 18, wouter 3.3.5, Radix NavigationMenu y Collapsible (vía shadcn, ya instalados), lucide-react 0.453, Tailwind 3 con los tokens del PR A (`bg-noche`, `text-miel-texto`, `bg-fondo-suave`), Vitest 3.

**Spec:** `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md`, §5 (arquitectura de información), §6.7 (footer), RF-01, RF-02, RF-03, RF-04, RF-12 y RF-14. Plan padre: `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md`.

## Global Constraints

- `CLAUDE.md` manda. UI, comentarios e identificadores en español.
- **Solo commits locales, nunca `git push`.** Rama de trabajo: `etapa1/c-navegacion`, creada desde `feat/etapa-1-institucional` antes del Task 1; vuelve a ella en el Task 5.
- Puertas antes de cada commit: `npm run check`, `npm run lint` (0 errores), `npm run format:check`, `npm test`. Al cerrar el PR, además `npm run build` y el navegador a 375, 768, 1024 y 1440 px.
- Puerto de desarrollo 5001 (el 5000 suele estar ocupado); producción local en el 5002.
- **Composición del menú = la recomendación D1** del plan de origen: Acerca de · Recursos · Eventos · Membresía · Comunidad + botón Únete. Se construye así mientras el DG no decida otra cosa.
- **El botón Únete sigue apuntando a `URL_REGISTRO`** (MemberPress, externo) hasta el PR E, que crea `/unete`. El test de enlaces muertos impide enlazar `/unete` antes.
- Un destino sin página se muestra «Próximamente» y no es clicable. Dentro de cada lista, los destinos vivos van arriba.
- Los enlaces externos llevan ↗, abren en pestaña nueva y registran `salida_plataforma`.
- Ruta activa: subrayado miel + peso + `aria-current="page"`, nunca solo color (ya existe; se conserva).
- Menú completo desde `lg` (1024 px) y panel móvil por debajo. Esto ya existe; el Task 2 comprueba que cabe.
- No se inventa copy institucional. Las descripciones de una línea de cada destino son microcopy de navegación.
- En código nuevo, nada de animaciones de opacidad sobre el contenido. El pie entra sin framer-motion.
- `data-testid` en todo lo interactivo, objetivos táctiles ≥ 44 px, contrastes de `tokens.test.ts`.

## Review Focus

1. **Una persona con solo teclado abre Recursos.** Las flechas recorren los enlaces del mega-menú, Inicio y Fin saltan a los extremos, y Escape cierra y devuelve el foco al disparador (esto último lo da Radix). Lo cubren el Task 2 (`teclado.test.ts`) y la verificación en navegador.
2. **Entre 1024 y 1279 px** el menú y las acciones caben sin solaparse ni cortar el logo. Es el riesgo que anticipaba el plan de origen. Lo cubre el Task 2, Step 7: medición y alternativa concreta.
3. **Un destino cuya página aún no existe** (`/nosotros`, `/eventos`, `/unete`) debe seguir en «Próximamente». Lo cubre el Task 1, con el test de enlaces muertos sobre `destinosDe`.
4. **La misma URL externa aparece en dos rubros** (Comunidad dentro de Recursos → Conecta y en el rubro Comunidad). El 404 no debe proponerla dos veces. Lo cubre el Task 1: `sugerencias.test.ts` deduplica por `href`.
5. **El pie sin JavaScript.** En el HTML prerenderizado no puede quedar a opacidad 0, como pasaba antes. Lo cubre el Task 4, Step 6: `grep` sobre `dist/public/blog.html`.

---

## Mapa de archivos

| Archivo                                        | Responsabilidad                                                                                                            | Task             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `client/src/lib/navegacion.ts`                 | Modelo (`GrupoNav`), catálogo de 5 rubros, `destinosDe`, `listasDe`, `destinosPie`, `ENTRADAS_PIE`, `registrarClicDestino` | 1                |
| `client/src/lib/navegacion.test.ts`            | Reescrito para el catálogo nuevo                                                                                           | 1                |
| `client/src/lib/sugerencias.ts` (+ test)       | `destinosSugeridos` usa `destinosDe` y deduplica por `href`                                                                | 1                |
| `client/src/lib/teclado.ts` (+ test)           | Índice del siguiente foco con flechas, Inicio y Fin                                                                        | 2                |
| `client/src/components/ui/navigation-menu.tsx` | Viewport centrado bajo el menú                                                                                             | 2                |
| `client/src/components/layout/Header.tsx`      | Mega-menú, entrada-enlace, analítica y panel móvil con grupos                                                              | 1 (mínimo), 2, 3 |
| `client/src/components/layout/Footer.tsx`      | Pie institucional, reescrito                                                                                               | 1 (mínimo), 4    |
| `docs/design-guidelines.md`                    | Sección de navegación                                                                                                      | 5                |

---

### Task 1: Modelo y catálogo de 5 rubros en `navegacion.ts`

**Files:**

- Modify: `client/src/lib/navegacion.ts` (tipos, `NAVEGACION`, helpers)
- Rewrite: `client/src/lib/navegacion.test.ts`
- Modify: `client/src/lib/sugerencias.ts`, `client/src/lib/sugerencias.test.ts`
- Modify (lo mínimo para compilar): `client/src/components/layout/Header.tsx`, `client/src/components/layout/Footer.tsx`

**Interfaces:**

- Consumes: `registrarEvento` de `./analitica`; `esRutaConocida` de `./rutas` (solo en tests).
- Produces:
  - `interface GrupoNav { titulo: string; testid: string; destinos: DestinoNav[] }`
  - `EntradaNav` añade `grupos?: GrupoNav[]`
  - `destinosDe(entrada: EntradaNav): DestinoNav[]`: grupos aplanados, o `destinos`, o `[]`
  - `listasDe(entrada: EntradaNav): DestinoNav[][]`: cada lista que se pinta junta (un grupo, o los `destinos`)
  - `esDesplegable(entrada: EntradaNav): boolean`
  - `ENTRADAS_PIE: readonly string[]`: los `testid` de las entradas que forman columnas en el pie, en orden
  - `destinosPie(entrada: EntradaNav): DestinoNav[]`: solo los destinos con `href`
  - `registrarClicDestino(destino: DestinoNav, origen: "menu" | "menu_movil" | "footer"): void`
  - Se conservan `COMUNIDAD`, `URL_REGISTRO`, `URL_LOGIN`, `DestinoNav`, `esRutaActiva` y `esEntradaActiva` (esta última ahora mira `destinosDe` y el `href` propio).

- [ ] **Step 1: Reescribir el test**

Sustituye `client/src/lib/navegacion.test.ts` entero:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COMUNIDAD,
  ENTRADAS_PIE,
  NAVEGACION,
  URL_LOGIN,
  URL_REGISTRO,
  destinosDe,
  destinosPie,
  esDesplegable,
  esEntradaActiva,
  esRutaActiva,
  listasDe,
  registrarClicDestino,
  type DestinoNav,
  type EntradaNav,
} from "./navegacion";
import { esRutaConocida } from "./rutas";

const destinos: DestinoNav[] = NAVEGACION.flatMap(destinosDe);
const entrada = (etiqueta: string): EntradaNav =>
  NAVEGACION.find((e) => e.etiqueta === etiqueta)!;

afterEach(() => vi.unstubAllGlobals());

describe("esRutaActiva", () => {
  it("marca la ruta exacta", () => {
    expect(esRutaActiva("/blog", "/blog")).toBe(true);
  });

  it("mantiene /blog activa mientras se lee un artículo", () => {
    expect(esRutaActiva("/blog", "/blog/el-poder-del-podcasting")).toBe(true);
  });

  it("compara por segmento, no por prefijo de texto", () => {
    expect(esRutaActiva("/blog", "/blogosfera")).toBe(false);
  });

  it("solo activa la raíz en la raíz exacta", () => {
    expect(esRutaActiva("/", "/")).toBe(true);
    expect(esRutaActiva("/", "/blog")).toBe(false);
  });

  it("nunca marca un destino externo ni uno que no existe", () => {
    expect(esRutaActiva(`${COMUNIDAD}/comunidad/`, "/")).toBe(false);
    expect(esRutaActiva(undefined, "/blog")).toBe(false);
  });
});

describe("arquitectura del menú (D1)", () => {
  it("tiene los cinco rubros en el orden recomendado", () => {
    expect(NAVEGACION.map((e) => e.etiqueta)).toEqual([
      "Acerca de",
      "Recursos",
      "Eventos",
      "Membresía",
      "Comunidad",
    ]);
  });

  it("organiza Recursos en los cuatro grupos del mega-menú", () => {
    expect(entrada("Recursos").grupos?.map((g) => g.titulo)).toEqual([
      "Aprende",
      "Certifícate",
      "Participa",
      "Conecta",
    ]);
  });

  it("aplana grupos y destinos en el mismo orden en que se pintan", () => {
    const recursos = entrada("Recursos");
    expect(destinosDe(recursos)).toEqual(recursos.grupos!.flatMap((g) => g.destinos));
    expect(destinosDe(entrada("Membresía"))).toEqual(entrada("Membresía").destinos);
    expect(destinosDe(entrada("Eventos"))).toEqual([]);
  });

  it("sabe qué entradas despliegan algo", () => {
    expect(esDesplegable(entrada("Recursos"))).toBe(true);
    expect(esDesplegable(entrada("Acerca de"))).toBe(true);
    expect(esDesplegable(entrada("Eventos"))).toBe(false);
  });
});

describe("esEntradaActiva", () => {
  it("marca Recursos cuando lo está uno de sus destinos, esté en el grupo que esté", () => {
    expect(esEntradaActiva(entrada("Recursos"), "/blog/un-articulo")).toBe(true);
    expect(esEntradaActiva(entrada("Recursos"), "/podcast")).toBe(true);
    expect(esEntradaActiva(entrada("Recursos"), "/")).toBe(false);
  });

  it("nunca marca un rubro que solo apunta fuera o que no existe aún", () => {
    expect(esEntradaActiva(entrada("Comunidad"), "/blog")).toBe(false);
    expect(esEntradaActiva(entrada("Eventos"), "/eventos")).toBe(false);
  });
});

describe("catálogo de navegación", () => {
  it("no enlaza ninguna ruta interna que no exista", () => {
    // RF-01: un enlace interno sin página es un fallo de CI. Por eso
    // /nosotros, /eventos o /unete siguen en «Próximamente» hasta su PR.
    const internos = [...NAVEGACION, ...destinos]
      .map((e) => e.href)
      .filter((href): href is string => href !== undefined && !href.startsWith("http"));
    expect(internos.filter((href) => !esRutaConocida(href))).toEqual([]);
  });

  it("no repite ningún data-testid entre rubros, grupos y destinos", () => {
    const grupos = NAVEGACION.flatMap((e) => e.grupos ?? []);
    const ids = [
      ...NAVEGACION.map((e) => e.testid),
      ...grupos.map((g) => g.testid),
      ...destinos.map((d) => d.testid),
    ];
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("da descripción e icono a todos los destinos", () => {
    expect(destinos.filter((d) => !d.descripcion.trim())).toEqual([]);
    expect([...NAVEGACION, ...destinos].filter((e) => !e.icono)).toEqual([]);
  });

  it("no repite icono dentro de una misma lista", () => {
    for (const e of NAVEGACION) {
      for (const lista of listasDe(e)) {
        const iconos = lista.map((d) => d.icono);
        expect(new Set(iconos).size, `iconos repetidos en "${e.etiqueta}"`).toBe(
          iconos.length,
        );
      }
    }
  });

  it("pone los destinos vivos antes que los «Próximamente» en cada lista", () => {
    for (const e of NAVEGACION) {
      for (const lista of listasDe(e)) {
        const primeroPendiente = lista.findIndex((d) => !d.href);
        if (primeroPendiente === -1) continue;
        const vivosDespues = lista.slice(primeroPendiente).filter((d) => d.href);
        expect(
          vivosDespues.map((d) => d.etiqueta),
          e.etiqueta,
        ).toEqual([]);
      }
    }
  });

  it("marca como externo todo destino que salga del sitio, y solo esos", () => {
    for (const destino of destinos) {
      expect(Boolean(destino.externo), destino.etiqueta).toBe(
        Boolean(destino.href?.startsWith("http")),
      );
    }
  });

  it("apunta el registro y el login al subdominio de comunidad", () => {
    expect(URL_REGISTRO).toBe(`${COMUNIDAD}/register/membresia-basica/`);
    expect(URL_LOGIN).toBe(`${COMUNIDAD}/login/`);
    expect(COMUNIDAD).toContain("comunidad.");
  });
});

describe("pie", () => {
  it("usa como columnas Acerca de, Recursos, Eventos y Membresía, en ese orden", () => {
    const columnas = ENTRADAS_PIE.map(
      (id) => NAVEGACION.find((e) => e.testid === id)?.etiqueta,
    );
    expect(columnas).toEqual(["Acerca de", "Recursos", "Eventos", "Membresía"]);
  });

  it("lista en el pie solo destinos vivos", () => {
    const recursos = destinosPie(entrada("Recursos"));
    expect(recursos.length).toBeGreaterThan(0);
    expect(recursos.every((d) => Boolean(d.href))).toBe(true);
    expect(destinosPie(entrada("Eventos"))).toEqual([]);
  });
});

describe("registrarClicDestino", () => {
  it("registra click_menu con el destino y el origen", () => {
    const ventana: { dataLayer?: unknown[] } = {};
    vi.stubGlobal("window", ventana);
    const blog = destinos.find((d) => d.href === "/blog")!;
    registrarClicDestino(blog, "menu");
    expect(ventana.dataLayer).toEqual([
      { event: "click_menu", destino: "/blog", etiqueta: "Blog", origen: "menu" },
    ]);
  });

  it("añade salida_plataforma cuando el destino sale del sitio", () => {
    const ventana: { dataLayer?: unknown[] } = {};
    vi.stubGlobal("window", ventana);
    const cursos = destinos.find((d) => d.testid === "link-cursos")!;
    registrarClicDestino(cursos, "footer");
    expect(ventana.dataLayer).toEqual([
      {
        event: "click_menu",
        destino: cursos.href,
        etiqueta: cursos.etiqueta,
        origen: "footer",
      },
      { event: "salida_plataforma", destino: cursos.href, origen: "footer" },
    ]);
  });

  it("no registra nada de un destino que aún no existe", () => {
    const ventana: { dataLayer?: unknown[] } = {};
    vi.stubGlobal("window", ventana);
    registrarClicDestino(
      destinos.find((d) => !d.href)!,
      "menu",
    );
    expect(ventana.dataLayer).toBeUndefined();
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/navegacion.test.ts`
Expected: FAIL. No existen `destinosDe`, `listasDe`, `esDesplegable`, `ENTRADAS_PIE`, `destinosPie` ni `registrarClicDestino`, y el catálogo tiene 3 entradas.

- [ ] **Step 3: Reescribir `navegacion.ts`**

Conserva sin cambios el comentario de cabecera, las constantes `COMUNIDAD`, `URL_REGISTRO` y `URL_LOGIN`, la interfaz `DestinoNav` y la función `esRutaActiva`. Sustituye el resto así.

Import de iconos (reemplaza el actual):

```ts
import { registrarEvento } from "./analitica";
import {
  Activity,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  CircleHelp,
  Contact,
  FileSearch,
  Gift,
  Globe,
  GraduationCap,
  Handshake,
  Info,
  Landmark,
  Layers,
  Library,
  Mail,
  MapPin,
  Megaphone,
  MessagesSquare,
  Mic,
  Newspaper,
  Presentation,
  Quote,
  Route,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";
```

Tipos y catálogo (después de `DestinoNav`):

```ts
/** Un grupo con título dentro de un mega-menú (Recursos: Aprende, Certifícate…). */
export interface GrupoNav {
  titulo: string;
  testid: string;
  destinos: DestinoNav[];
}

/**
 * Una entrada de primer nivel. Despliega `destinos` (lista simple) o `grupos`
 * (mega-menú), o es un enlace suelto con `href`. Sin nada de eso, es un rubro
 * que todavía no existe y se anuncia como «Próximamente».
 */
export interface EntradaNav {
  etiqueta: string;
  testid: string;
  icono: LucideIcon;
  href?: string;
  externo?: boolean;
  destinos?: DestinoNav[];
  grupos?: GrupoNav[];
}

/**
 * Arquitectura de la Etapa 1: la opción recomendada para la decisión D1 del
 * plan (Acerca de · Recursos · Eventos · Membresía · Comunidad, más el botón
 * Únete). Recursos es el catálogo completo; Eventos y Comunidad son atajos,
 * repetidos a propósito, a los grupos Participa y Conecta.
 *
 * Cada destino sin página se queda sin `href` («Próximamente») hasta el PR que
 * crea su ruta: el test de enlaces muertos lo exige.
 */
export const NAVEGACION: EntradaNav[] = [
  {
    etiqueta: "Acerca de",
    testid: "menu-acerca-de",
    icono: Info,
    // PENDIENTE (PR E): /nosotros, /que-hacemos y /nuestro-equipo.
    // PENDIENTE (Etapa 0): /contacto.
    destinos: [
      {
        etiqueta: "Nosotros",
        descripcion: "Quiénes somos y qué defendemos",
        icono: Building2,
        testid: "link-nosotros",
      },
      {
        etiqueta: "¿Qué hacemos?",
        descripcion: "Los cuatro pilares de ASPAL",
        icono: Layers,
        testid: "link-que-hacemos",
      },
      {
        etiqueta: "Nuestro equipo",
        descripcion: "Las personas detrás de ASPAL",
        icono: UsersRound,
        testid: "link-equipo",
      },
      {
        etiqueta: "Contacto",
        descripcion: "Escríbenos o llámanos",
        icono: Mail,
        testid: "link-contacto",
      },
      {
        etiqueta: "Consejo Directivo",
        descripcion: "Quién gobierna ASPAL",
        icono: Landmark,
        testid: "link-consejo",
      },
      {
        etiqueta: "Aliados y patrocinadores",
        descripcion: "Organizaciones que nos respaldan",
        icono: Handshake,
        testid: "link-aliados",
      },
      {
        etiqueta: "Iniciativas LATAM y Agenda",
        descripcion: "Lo que impulsamos en la región",
        icono: Globe,
        testid: "link-iniciativas",
      },
      {
        etiqueta: "Sala de prensa",
        descripcion: "Noticias y materiales para medios",
        icono: Megaphone,
        testid: "link-prensa",
      },
      {
        etiqueta: "Mensaje del Director General",
        descripcion: "La visión de la dirección",
        icono: Quote,
        testid: "link-mensaje-dg",
      },
    ],
  },
  {
    etiqueta: "Recursos",
    testid: "menu-recursos",
    icono: Library,
    grupos: [
      {
        titulo: "Aprende",
        testid: "grupo-aprende",
        destinos: [
          {
            etiqueta: "Blog",
            descripcion: "Artículos y análisis del sector",
            icono: Newspaper,
            href: "/blog",
            testid: "link-blog",
          },
          {
            etiqueta: "Podcast Conexión Profesional",
            descripcion: "Conversaciones con el sector",
            icono: Mic,
            href: "/podcast",
            testid: "link-podcast",
          },
          // PENDIENTE (PR F): /mapa-de-ruta.
          {
            etiqueta: "Mapa de Ruta",
            descripcion: "El camino de una asociación en siete etapas",
            icono: Route,
            testid: "link-mapa-ruta",
          },
          {
            etiqueta: "Estudios e investigaciones",
            descripcion: "Datos del sector asociativo",
            icono: FileSearch,
            testid: "link-estudios",
          },
          {
            etiqueta: "Biblioteca digital",
            descripcion: "Documentos y recursos descargables",
            icono: Library,
            testid: "link-biblioteca",
          },
        ],
      },
      {
        titulo: "Certifícate",
        testid: "grupo-certificate",
        destinos: [
          {
            etiqueta: "Cursos en línea",
            descripcion: "Capacitación para tu equipo",
            icono: GraduationCap,
            href: `${COMUNIDAD}/cursos/`,
            externo: true,
            testid: "link-cursos",
          },
          {
            etiqueta: "Bootcamps de directivos",
            descripcion: "Formación intensiva para quien dirige",
            icono: Presentation,
            testid: "link-bootcamps",
          },
          {
            etiqueta: "Certificación CGA",
            descripcion: "Acreditación profesional del sector",
            icono: Award,
            testid: "link-cga",
          },
        ],
      },
      {
        titulo: "Participa",
        testid: "grupo-participa",
        destinos: [
          {
            etiqueta: "Calendario de eventos",
            descripcion: "Lo que viene en la agenda",
            icono: CalendarDays,
            testid: "link-calendario",
          },
          {
            etiqueta: "Webinars mensuales",
            descripcion: "Sesiones en vivo con expertos",
            icono: Video,
            testid: "link-webinars",
          },
          {
            etiqueta: "Encuentro CDMX 2027",
            descripcion: "El encuentro latinoamericano del sector",
            icono: MapPin,
            testid: "link-encuentro",
          },
          {
            etiqueta: "Premios ASPAL",
            descripcion: "Reconocimiento a las mejores prácticas",
            icono: Trophy,
            testid: "link-premios",
          },
        ],
      },
      {
        titulo: "Conecta",
        testid: "grupo-conecta",
        destinos: [
          {
            etiqueta: "Comunidad",
            descripcion: "El feed de la red ASPAL",
            icono: MessagesSquare,
            href: `${COMUNIDAD}/comunidad/`,
            externo: true,
            testid: "link-recursos-comunidad",
          },
          {
            etiqueta: "Directorio de miembros",
            descripcion: "Quién es quién en la red",
            icono: Users,
            href: `${COMUNIDAD}/miembros/`,
            externo: true,
            testid: "link-recursos-miembros",
          },
          {
            etiqueta: "Directorio de la industria",
            descripcion: "Proveedores y aliados del sector",
            icono: Building2,
            testid: "link-directorio-industria",
          },
          {
            etiqueta: "Bolsa de trabajo",
            descripcion: "Vacantes del sector asociativo",
            icono: Briefcase,
            testid: "link-bolsa",
          },
        ],
      },
    ],
  },
  {
    etiqueta: "Eventos",
    testid: "menu-eventos",
    icono: CalendarDays,
    // PENDIENTE (PR E): href "/eventos", la página «Próximamente» con captura.
  },
  {
    etiqueta: "Membresía",
    testid: "menu-membresia",
    icono: BadgeCheck,
    destinos: [
      {
        etiqueta: "Membresía básica",
        descripcion: "Accede a la plataforma de comunidad",
        icono: BadgeCheck,
        href: URL_REGISTRO,
        externo: true,
        testid: "link-membresia-basica",
      },
      // PENDIENTE (PR E): /unete.
      {
        etiqueta: "Únete gratis",
        descripcion: "Suscríbete sin costo",
        icono: UserPlus,
        testid: "link-unete",
      },
      {
        etiqueta: "Niveles y precios",
        descripcion: "Compara las opciones de membresía",
        icono: Layers,
        testid: "link-niveles",
      },
      {
        etiqueta: "Beneficios",
        descripcion: "Lo que recibes como miembro",
        icono: Gift,
        testid: "link-beneficios",
      },
      {
        etiqueta: "Preguntas frecuentes",
        descripcion: "Resolvemos tus dudas",
        icono: CircleHelp,
        testid: "link-preguntas",
      },
    ],
  },
  {
    etiqueta: "Comunidad",
    testid: "menu-comunidad",
    icono: Users,
    destinos: [
      {
        etiqueta: "Actividad de la red",
        descripcion: "Lo último en la comunidad",
        icono: Activity,
        href: `${COMUNIDAD}/comunidad/`,
        externo: true,
        testid: "link-comunidad-actividad",
      },
      {
        etiqueta: "Grupos",
        descripcion: "Grupos de trabajo y de interés",
        icono: UsersRound,
        href: `${COMUNIDAD}/grupos/`,
        externo: true,
        testid: "link-comunidad-grupos",
      },
      {
        etiqueta: "Directorio de miembros",
        descripcion: "Quién es quién en la red",
        icono: Contact,
        href: `${COMUNIDAD}/miembros/`,
        externo: true,
        testid: "link-comunidad-miembros",
      },
      {
        etiqueta: "Foros por etapa del Mapa de Ruta",
        descripcion: "Conversación por etapa",
        icono: MessagesSquare,
        testid: "link-foros",
      },
    ],
  },
];

/** Entradas que forman columna en el pie, en orden (§6.7 del plan). */
export const ENTRADAS_PIE: readonly string[] = [
  "menu-acerca-de",
  "menu-recursos",
  "menu-eventos",
  "menu-membresia",
];

/** Todos los destinos de una entrada, con grupos aplanados, en orden de pintado. */
export function destinosDe(entrada: EntradaNav): DestinoNav[] {
  return entrada.grupos
    ? entrada.grupos.flatMap((grupo) => grupo.destinos)
    : (entrada.destinos ?? []);
}

/** Las listas que se pintan juntas: cada grupo, o la lista simple. */
export function listasDe(entrada: EntradaNav): DestinoNav[][] {
  if (entrada.grupos) return entrada.grupos.map((grupo) => grupo.destinos);
  return entrada.destinos ? [entrada.destinos] : [];
}

export function esDesplegable(entrada: EntradaNav): boolean {
  return destinosDe(entrada).length > 0;
}

/** En el pie solo van destinos vivos: el catálogo completo es del menú. */
export function destinosPie(entrada: EntradaNav): DestinoNav[] {
  return destinosDe(entrada).filter((destino) => Boolean(destino.href));
}

/**
 * Analítica de un clic en un destino (RF-12): siempre `click_menu`, y además
 * `salida_plataforma` si el destino sale del dominio.
 */
export function registrarClicDestino(
  destino: DestinoNav,
  origen: "menu" | "menu_movil" | "footer",
): void {
  if (!destino.href) return;
  registrarEvento("click_menu", {
    destino: destino.href,
    etiqueta: destino.etiqueta,
    origen,
  });
  if (destino.externo) {
    registrarEvento("salida_plataforma", { destino: destino.href, origen });
  }
}
```

`esEntradaActiva` queda así (sustituye la actual):

```ts
/** Un rubro se marca activo si lo está su propio enlace o cualquiera de sus destinos. */
export function esEntradaActiva(entrada: EntradaNav, ruta: string): boolean {
  return (
    esRutaActiva(entrada.href, ruta) ||
    destinosDe(entrada).some((destino) => esRutaActiva(destino.href, ruta))
  );
}
```

- [ ] **Step 4: `sugerencias.ts` usa `destinosDe` y no repite URLs**

En `client/src/lib/sugerencias.ts`, cambia el import a `import { NAVEGACION, destinosDe, type DestinoNav } from "./navegacion";` y `destinosSugeridos` por:

```ts
/**
 * Destinos del menú que existen, en su orden y sin repetir URL: la comunidad
 * aparece en Recursos y en su propio rubro, y el 404 no debe ofrecerla dos veces.
 */
export function destinosSugeridos(): DestinoNav[] {
  const vistos = new Set<string>();
  return NAVEGACION.flatMap(destinosDe).filter((destino) => {
    if (!destino.href || vistos.has(destino.href)) return false;
    vistos.add(destino.href);
    return true;
  });
}
```

En `sugerencias.test.ts`, añade al `describe("destinosSugeridos")`:

```ts
it("no ofrece dos veces la misma URL", () => {
  const hrefs = destinosSugeridos().map((d) => d.href);
  expect(new Set(hrefs).size).toBe(hrefs.length);
});
```

- [ ] **Step 5: Header y Footer, lo mínimo para compilar**

No se rediseñan aquí (eso son los Tasks 2 a 4); solo dejan de leer `entrada.destinos`:

- `Header.tsx`: importa `destinosDe` y `esDesplegable` de `@/lib/navegacion`. En `EntradaEscritorio` cambia `if (!entrada.destinos)` por `if (!esDesplegable(entrada))` y `entrada.destinos.map` por `destinosDe(entrada).map`. En `PanelMovil` cambia `entrada.destinos ? (` por `esDesplegable(entrada) ? (`. En `GrupoMovil` cambia `entrada.destinos?.map` por `destinosDe(entrada).map`.
- `Footer.tsx`: importa `destinosDe` y `esDesplegable`. Cambia `NAVEGACION.filter((entrada) => entrada.destinos?.length)` por `NAVEGACION.filter(esDesplegable)` y `entrada.destinos?.map` por `destinosDe(entrada).map`.

- [ ] **Step 6: Comprobar que pasa**

Run: `npx vitest run client/src/lib/navegacion.test.ts client/src/lib/sugerencias.test.ts`
Expected: PASS.

- [ ] **Step 7: Puertas y commit**

```bash
npx prettier --write client/src/lib/navegacion.ts client/src/lib/navegacion.test.ts client/src/lib/sugerencias.ts client/src/lib/sugerencias.test.ts client/src/components/layout/Header.tsx client/src/components/layout/Footer.tsx
npm run check && npm run lint && npm run format:check && npm test
git add client/src/lib/navegacion.ts client/src/lib/navegacion.test.ts client/src/lib/sugerencias.ts client/src/lib/sugerencias.test.ts client/src/components/layout/Header.tsx client/src/components/layout/Footer.tsx
git commit -m "Pasar el menú a los cinco rubros institucionales con grupos para Recursos"
```

---

### Task 2: Mega-menú de escritorio accesible

**Files:**

- Create: `client/src/lib/teclado.ts`, `client/src/lib/teclado.test.ts`
- Modify: `client/src/components/ui/navigation-menu.tsx` (wrapper del viewport)
- Modify: `client/src/components/layout/Header.tsx` (`DestinoEscritorio` y `EntradaEscritorio`)

**Interfaces:**

- Consumes: `destinosDe`, `esDesplegable`, `registrarClicDestino`, `GrupoNav` (Task 1).
- Produces: `indiceSiguiente(actual: number, total: number, tecla: string): number | null`.

- [ ] **Step 1: Test de la navegación con teclado**

`client/src/lib/teclado.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { indiceSiguiente } from "./teclado";

describe("indiceSiguiente", () => {
  it("avanza con flecha abajo o derecha y retrocede con arriba o izquierda", () => {
    expect(indiceSiguiente(0, 5, "ArrowDown")).toBe(1);
    expect(indiceSiguiente(0, 5, "ArrowRight")).toBe(1);
    expect(indiceSiguiente(3, 5, "ArrowUp")).toBe(2);
    expect(indiceSiguiente(3, 5, "ArrowLeft")).toBe(2);
  });

  it("da la vuelta en los extremos", () => {
    expect(indiceSiguiente(4, 5, "ArrowDown")).toBe(0);
    expect(indiceSiguiente(0, 5, "ArrowUp")).toBe(4);
  });

  it("salta a los extremos con Inicio y Fin", () => {
    expect(indiceSiguiente(2, 5, "Home")).toBe(0);
    expect(indiceSiguiente(2, 5, "End")).toBe(4);
  });

  it("entra por el primero si el foco aún no está en la lista", () => {
    expect(indiceSiguiente(-1, 5, "ArrowDown")).toBe(0);
    expect(indiceSiguiente(-1, 5, "ArrowUp")).toBe(0);
  });

  it("ignora otras teclas y listas vacías", () => {
    expect(indiceSiguiente(1, 5, "Tab")).toBeNull();
    expect(indiceSiguiente(1, 5, "a")).toBeNull();
    expect(indiceSiguiente(-1, 0, "ArrowDown")).toBeNull();
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/teclado.test.ts`
Expected: FAIL. No resuelve `./teclado`.

- [ ] **Step 3: Implementar `teclado.ts`**

```ts
/**
 * Movimiento del foco con flechas dentro de un desplegable (RF-02). Radix ya
 * abre con Enter o Espacio, cierra con Escape y devuelve el foco al
 * disparador; lo que no hace es recorrer los enlaces de nuestro contenido.
 *
 * Pura: recibe la posición actual (-1 si el foco aún no está en la lista) y
 * devuelve la siguiente, o `null` si la tecla no le corresponde.
 */
export function indiceSiguiente(
  actual: number,
  total: number,
  tecla: string,
): number | null {
  if (total === 0) return null;
  switch (tecla) {
    case "Home":
      return 0;
    case "End":
      return total - 1;
    case "ArrowDown":
    case "ArrowRight":
      return actual === -1 ? 0 : (actual + 1) % total;
    case "ArrowUp":
    case "ArrowLeft":
      return actual === -1 ? 0 : (actual - 1 + total) % total;
    default:
      return null;
  }
}
```

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run client/src/lib/teclado.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Centrar el viewport del menú**

En `client/src/components/ui/navigation-menu.tsx`, dentro de `NavigationMenuViewport`, cambia el wrapper:

```tsx
  // Editado (Etapa 1, PR C): centrado bajo el menú en lugar de alineado a su
  // borde izquierdo, para que el mega-menú de Recursos quepa a 1024 px.
  <div className={cn("absolute left-1/2 top-full flex -translate-x-1/2 justify-center")}>
```

- [ ] **Step 6: Mega-menú, entrada-enlace y analítica en `Header.tsx`**

Añade al import de `@/lib/navegacion` los nombres `registrarClicDestino` y `type GrupoNav`, y añade `import { indiceSiguiente } from "@/lib/teclado";` y `import type { KeyboardEvent } from "react";`.

En `DestinoEscritorio`:

- Cambia la fila `<div className="flex items-center gap-1.5">` por `<div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">`. En las columnas estrechas del mega-menú, la marca «Próximamente» baja de línea en lugar de apretar la etiqueta.
- Añade `onClick={() => registrarClicDestino(destino, "menu")}` al `<a>` externo y al `<Link>` interno.

Añade, antes de `EntradaEscritorio`:

```tsx
/** Flechas, Inicio y Fin recorren los enlaces del desplegable abierto (RF-02). */
function alPulsarEnDesplegable(evento: KeyboardEvent<HTMLElement>) {
  const enlaces = Array.from(
    evento.currentTarget.querySelectorAll<HTMLElement>("a[href]"),
  );
  const actual = enlaces.indexOf(document.activeElement as HTMLElement);
  const siguiente = indiceSiguiente(actual, enlaces.length, evento.key);
  if (siguiente === null) return;
  evento.preventDefault();
  enlaces[siguiente].focus();
}

/** Una columna del mega-menú: título del grupo y sus destinos. */
function GrupoEscritorio({ grupo, ruta }: { grupo: GrupoNav; ruta: string }) {
  const idTitulo = `titulo-${grupo.testid}`;
  return (
    <div data-testid={grupo.testid}>
      {/* Párrafo y no encabezado: un h3 dentro de la cabecera saltaría niveles
          antes del h1 de la página (RF-14). */}
      <p
        id={idTitulo}
        className="px-3 pb-1 pt-2 text-[13px] font-semibold uppercase tracking-wider text-miel-texto"
      >
        {grupo.titulo}
      </p>
      <ul className="grid gap-1" aria-labelledby={idTitulo}>
        {grupo.destinos.map((destino) => (
          <DestinoEscritorio key={destino.testid} destino={destino} ruta={ruta} />
        ))}
      </ul>
    </div>
  );
}
```

En `EntradaEscritorio`, sustituye el bloque `if (!esDesplegable(entrada)) { … }` y el `return` final por:

```tsx
if (!esDesplegable(entrada)) {
  // Rubro con página propia (Eventos, cuando exista /eventos).
  if (entrada.href) {
    return (
      <NavigationMenuItem>
        <Link
          href={entrada.href}
          className={cn(
            navigationMenuTriggerStyle(),
            "relative bg-transparent",
            activa && "font-semibold text-foreground",
          )}
          aria-current={activa ? "page" : undefined}
          data-testid={entrada.testid}
        >
          {entrada.etiqueta}
          {subrayado}
        </Link>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <div
        className={cn(
          navigationMenuTriggerStyle(),
          "relative cursor-default gap-2 bg-transparent text-muted-foreground hover:bg-transparent",
        )}
        aria-disabled="true"
        data-testid={entrada.testid}
      >
        {entrada.etiqueta}
        <Proximamente />
        {subrayado}
      </div>
    </NavigationMenuItem>
  );
}

return (
  <NavigationMenuItem>
    <NavigationMenuTrigger
      className={cn("relative bg-transparent", activa && "font-semibold text-foreground")}
      data-testid={entrada.testid}
    >
      {entrada.etiqueta}
      {subrayado}
    </NavigationMenuTrigger>
    <NavigationMenuContent onKeyDown={alPulsarEnDesplegable}>
      {entrada.grupos ? (
        // Cuatro columnas en 60rem, sin pasar del ancho de la ventana menos
        // el margen: a 1024 px ocupa 960 px, centrado bajo el menú.
        <div className="grid w-[min(calc(100vw-4rem),60rem)] grid-cols-4 gap-2 p-3">
          {entrada.grupos.map((grupo) => (
            <GrupoEscritorio key={grupo.testid} grupo={grupo} ruta={ruta} />
          ))}
        </div>
      ) : (
        // 380px: cabe la etiqueta más larga junto a su marca de Próximamente.
        <ul className="grid w-[380px] gap-1 p-2">
          {destinosDe(entrada).map((destino) => (
            <DestinoEscritorio key={destino.testid} destino={destino} ruta={ruta} />
          ))}
        </ul>
      )}
    </NavigationMenuContent>
  </NavigationMenuItem>
);
```

- [ ] **Step 7: ¿Cabe a 1024 px? Medirlo, y aplicar la alternativa si no**

Con `PORT=5001 npm run dev`, abre `http://localhost:5001/blog` a 1024×800 y ejecuta en la consola:

```js
(() => {
  const nav = document
    .querySelector('nav[aria-label="Principal"]')
    .getBoundingClientRect();
  const acciones = document
    .querySelector('[data-testid="button-login"]')
    .getBoundingClientRect();
  const logo = document
    .querySelector('[data-testid="img-logo-light"]')
    .getBoundingClientRect();
  return {
    navDerecha: nav.right,
    accionesIzquierda: acciones.left,
    logoAncho: logo.width,
    logoDerecha: logo.right,
    navIzquierda: nav.left,
  };
})();
```

Expected: `navDerecha < accionesIzquierda`, `logoDerecha < navIzquierda` y `logoAncho` ≈ 140.

**Si no se cumple** (es el riesgo que el plan de origen anticipaba entre 1024 y 1180 px), sube el corte a `xl` (1280 px) en `Header.tsx`:

- Las dos `lg:flex` pasan a `xl:flex`.
- Las dos `lg:hidden` (el botón hamburguesa y el panel) pasan a `xl:hidden`.
- `matchMedia("(min-width: 1024px)")` pasa a `"(min-width: 1280px)"`.
- El comentario sobre `lg` pasa a decir: «Desde `xl` (1280 px): con cinco rubros y la marca Próximamente, a 1024 no cabían».

Repite la medición a 1280. Anota en el informe cuál de los dos cortes quedó.

- [ ] **Step 8: Puertas y commit**

```bash
npx prettier --write client/src/lib/teclado.ts client/src/lib/teclado.test.ts client/src/components/layout/Header.tsx
npm run check && npm run lint && npm run format:check && npm test
git add client/src/lib/teclado.ts client/src/lib/teclado.test.ts client/src/components/ui/navigation-menu.tsx client/src/components/layout/Header.tsx
git commit -m "Añadir el mega-menú de Recursos con navegación por teclado y analítica de clics"
```

Verificación en navegador (la hace el controlador): a 1440 y 1024 px, abrir Recursos con clic y con Enter. Las flechas recorren los enlaces vivos, Escape cierra y el foco vuelve a «Recursos». Las cuatro columnas se ven completas y centradas. Un clic en Blog deja en `dataLayer` un `click_menu`; un clic en Cursos deja `click_menu` y `salida_plataforma`.

---

### Task 3: Panel móvil con grupos

**Files:**

- Modify: `client/src/components/layout/Header.tsx` (`DestinoMovil`, `GrupoMovil` y la lista de `PanelMovil`)

**Interfaces:**

- Consumes: `destinosDe`, `esDesplegable`, `registrarClicDestino`, `GrupoNav` (Task 1).
- Produces: el panel móvil con un acordeón por rubro. Dentro de Recursos, cada grupo lleva su subtítulo.

- [ ] **Step 1: Analítica en `DestinoMovil`**

Añade `onClick={() => registrarClicDestino(destino, "menu_movil")}` al `<a>` externo y al `<Link>` interno de `DestinoMovil`.

- [ ] **Step 2: Grupos en `GrupoMovil`**

Sustituye el `<CollapsibleContent>` de `GrupoMovil` por:

```tsx
<CollapsibleContent className="space-y-1 pb-2 pl-1">
  {entrada.grupos
    ? entrada.grupos.map((grupo) => (
        <div key={grupo.testid} className="pt-2" data-testid={`mobile-${grupo.testid}`}>
          <p
            id={`mobile-titulo-${grupo.testid}`}
            className="px-3 pb-1 text-[13px] font-semibold uppercase tracking-wider text-miel-texto"
          >
            {grupo.titulo}
          </p>
          <div role="list" aria-labelledby={`mobile-titulo-${grupo.testid}`}>
            {grupo.destinos.map((destino) => (
              <div role="listitem" key={destino.testid}>
                <DestinoMovil destino={destino} ruta={ruta} />
              </div>
            ))}
          </div>
        </div>
      ))
    : destinosDe(entrada).map((destino) => (
        <DestinoMovil key={destino.testid} destino={destino} ruta={ruta} />
      ))}
</CollapsibleContent>
```

- [ ] **Step 3: Rubro-enlace en el panel**

En `PanelMovil`, la rama que no es desplegable debe pintar un enlace si la entrada tiene `href`, y la marca «Próximamente» si no. Sustituye esa rama (`<div key={entrada.testid} … aria-disabled="true" …>`) por:

```tsx
entrada.href ? (
  <Link
    key={entrada.testid}
    href={entrada.href}
    className="flex min-h-11 items-center gap-3 py-2 text-base font-medium text-foreground"
    aria-current={esEntradaActiva(entrada, ruta) ? "page" : undefined}
    data-testid={`mobile-${entrada.testid}`}
  >
    <entrada.icono className="h-4 w-4 shrink-0" aria-hidden="true" />
    {entrada.etiqueta}
  </Link>
) : (
  <div
    key={entrada.testid}
    className="flex min-h-11 items-center gap-3 py-2 text-base font-medium text-muted-foreground opacity-70"
    aria-disabled="true"
    data-testid={`mobile-${entrada.testid}`}
  >
    <entrada.icono className="h-4 w-4 shrink-0" aria-hidden="true" />
    {entrada.etiqueta}
    <Proximamente className="ml-auto" />
  </div>
);
```

(Es un ternario anidado dentro del `esDesplegable(entrada) ? <GrupoMovil …/> : …` que ya existe.)

- [ ] **Step 4: Puertas y commit**

```bash
npx prettier --write client/src/components/layout/Header.tsx
npm run check && npm run lint && npm run format:check && npm test
git add client/src/components/layout/Header.tsx
git commit -m "Mostrar los grupos de Recursos en el panel móvil y medir sus clics"
```

Verificación en navegador (la hace el controlador): a 375 px, abrir el menú. Aparecen cinco rubros; Recursos se despliega con cuatro subtítulos miel; Eventos sale como «Próximamente». Se puede hacer scroll hasta el final con Únete fijo abajo y sin scroll horizontal. Un clic en Blog cierra el panel y deja `click_menu` con `origen: "menu_movil"`.

---

### Task 4: Pie institucional

**Files:**

- Rewrite: `client/src/components/layout/Footer.tsx`

**Interfaces:**

- Consumes: `NAVEGACION`, `ENTRADAS_PIE`, `destinosPie`, `registrarClicDestino`, `URL_REGISTRO`, `EntradaNav`, `DestinoNav` (navegacion); `CONTACTO`, `NOMBRE_MARCA`, `REDES` (marca); `registrarEvento` (analitica); `Proximamente`.
- Produces: `Footer` (default export) sin framer-motion. `data-testid`: `footer`, `img-footer-logo`, `text-footer-descripcion`, `button-social-*`, `footer-<testid entrada>`, `footer-<testid destino>`, `text-footer-contact-title`, `text-contact-email`, `text-contact-phone`, `text-contact-address`, `button-footer-registro`, `text-copyright`, `footer-aviso-privacidad`, `footer-terminos` y `text-footer-respaldo`.

- [ ] **Step 1: Reescribir `Footer.tsx`**

```tsx
import logoLight from "@assets/ASPAL-para fondo claro_1763675327795.png";
import { Proximamente } from "@/components/layout/Proximamente";
import { Button } from "@/components/ui/button";
import { registrarEvento } from "@/lib/analitica";
import { CONTACTO, NOMBRE_MARCA, REDES } from "@/lib/marca";
import {
  ENTRADAS_PIE,
  NAVEGACION,
  URL_REGISTRO,
  destinosPie,
  registrarClicDestino,
  type DestinoNav,
  type EntradaNav,
} from "@/lib/navegacion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";

/** Un dato de contacto que se puede accionar: escribir, llamar o ubicar. */
function Contacto({
  icono: Icono,
  href,
  children,
  testid,
}: {
  icono: LucideIcon;
  href?: string;
  children: React.ReactNode;
  testid: string;
}) {
  const contenido = (
    <>
      <Icono className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="break-all">{children}</span>
    </>
  );
  const clases = "flex min-h-11 items-start gap-2 py-2 text-sm text-muted-foreground";

  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`${clases} transition-colors hover:text-primary`}
          data-testid={testid}
        >
          {contenido}
        </a>
      ) : (
        <div className={clases} data-testid={testid}>
          {contenido}
        </div>
      )}
    </li>
  );
}

/** Un destino vivo del pie. */
function DestinoPie({ destino }: { destino: DestinoNav }) {
  const clases =
    "flex min-h-11 items-center gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-primary";
  const alPulsar = () => registrarClicDestino(destino, "footer");

  return (
    <li>
      {destino.externo ? (
        <a
          href={destino.href}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
          onClick={alPulsar}
          data-testid={`footer-${destino.testid}`}
        >
          {destino.etiqueta}
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="sr-only">(se abre en otra pestaña)</span>
        </a>
      ) : (
        <Link
          href={destino.href!}
          className={clases}
          onClick={alPulsar}
          data-testid={`footer-${destino.testid}`}
        >
          {destino.etiqueta}
        </Link>
      )}
    </li>
  );
}

/**
 * Una columna del pie: los destinos vivos del rubro. Si todavía no tiene
 * ninguno (Eventos, Acerca de hasta el PR E), se anuncia una sola vez como
 * «Próximamente» en lugar de listar el catálogo pendiente: el pie resume, el
 * catálogo completo es del menú.
 */
function ColumnaPie({ entrada }: { entrada: EntradaNav }) {
  const destinos = destinosPie(entrada);
  return (
    <div>
      <h3
        className="font-semibold text-foreground"
        data-testid={`footer-${entrada.testid}`}
      >
        {entrada.etiqueta}
      </h3>
      {destinos.length > 0 ? (
        <ul className="mt-2">
          {destinos.map((destino) => (
            <DestinoPie key={destino.testid} destino={destino} />
          ))}
        </ul>
      ) : (
        <p className="mt-3">
          <Proximamente />
        </p>
      )}
    </div>
  );
}

/**
 * Pie institucional (§6.7 del plan de la Etapa 1): marca, cuatro columnas de
 * navegación, contacto, y una franja noche con la barra legal.
 *
 * Sin framer-motion: el pie entraba con `whileInView` y opacidad 0, así que en
 * el HTML prerenderizado (y para quien no ejecuta JavaScript) era invisible.
 *
 * PENDIENTE (PR E): el formulario del boletín en la fila de marca, cuando exista
 * /api/suscripcion (decisión D8).
 */
export default function Footer() {
  const columnas = ENTRADAS_PIE.map((id) =>
    NAVEGACION.find((e) => e.testid === id),
  ).filter((entrada): entrada is EntradaNav => entrada !== undefined);

  return (
    <footer className="border-t border-border bg-fondo-suave" data-testid="footer">
      <h2 className="sr-only">Pie de página</h2>

      <div className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src={logoLight}
              alt={NOMBRE_MARCA}
              width={1500}
              height={429}
              className="h-8 w-auto"
              data-testid="img-footer-logo"
            />
            <p
              className="mt-4 text-sm text-muted-foreground"
              data-testid="text-footer-descripcion"
            >
              La red en español del sector asociativo de América Latina.
            </p>
            <div className="mt-4 flex flex-wrap gap-1">
              {REDES.map((red) => (
                <Button
                  key={red.testid}
                  size="icon"
                  variant="ghost"
                  className="h-11 w-11"
                  asChild
                  data-testid={red.testid}
                >
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ASPAL en ${red.nombre} (se abre en otra pestaña)`}
                  >
                    <red.icono className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {columnas.map((entrada) => (
            <ColumnaPie key={entrada.testid} entrada={entrada} />
          ))}

          {/* Contacto */}
          <div>
            <h3
              className="font-semibold text-foreground"
              data-testid="text-footer-contact-title"
            >
              Contacto
            </h3>
            <ul className="mt-2">
              <Contacto
                icono={Mail}
                href={`mailto:${CONTACTO.correo}`}
                testid="text-contact-email"
              >
                {CONTACTO.correo}
              </Contacto>
              <Contacto
                icono={Phone}
                href={`tel:${CONTACTO.telefono.replace(/\s/g, "")}`}
                testid="text-contact-phone"
              >
                {CONTACTO.telefono}
              </Contacto>
              <Contacto icono={MapPin} testid="text-contact-address">
                {CONTACTO.ciudad}
              </Contacto>
            </ul>
            {/* El pie es el final del recorrido: quien llega hasta aquí merece
                encontrar la conversión sin volver arriba. */}
            <Button variant="secondary" className="mt-4 min-h-11 w-full" asChild>
              <a
                href={URL_REGISTRO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("click_unete", { origen: "footer" })}
                data-testid="button-footer-registro"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Únete a ASPAL
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Franja noche: el azul del logotipo cierra la página (§4 del plan). */}
      <div className="bg-noche text-noche-foreground">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-sm md:flex-row md:flex-wrap md:items-center md:justify-between md:px-8">
          <p data-testid="text-copyright">
            © {new Date().getFullYear()} {NOMBRE_MARCA}
          </p>
          {/* PENDIENTE (Etapa 0): /aviso-privacidad y /terminos. */}
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li className="flex items-center gap-2" data-testid="footer-aviso-privacidad">
              Aviso de privacidad <Proximamente />
            </li>
            <li className="flex items-center gap-2" data-testid="footer-terminos">
              Términos <Proximamente />
            </li>
          </ul>
          <p data-testid="text-footer-respaldo">
            Con el respaldo de World Urban Parks y ANPR México
          </p>
        </div>
      </div>
    </footer>
  );
}
```

La descripción del pie es la tagline aprobada en la auditoría (§6.1 del plan de origen: «La red en español del sector asociativo de América Latina»). La frase de respaldo sale literal de §6.7.

- [ ] **Step 2: Puertas**

```bash
npx prettier --write client/src/components/layout/Footer.tsx
npm run check && npm run lint && npm run format:check && npm test
```

Expected: verde. Si `framer-motion` ya no se importa en el pie, no debe quedar ningún import sin usar.

- [ ] **Step 3: Contraste de la franja noche**

`text-noche-foreground` (blanco) sobre `bg-noche` ya está en `PARES` de `tokens.test.ts` (15.3:1). La marca «Próximamente» lleva su propio fondo (`bg-muted`) y su texto (`text-muted-foreground`), con 5.8:1. No hace falta añadir pares.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/layout/Footer.tsx
git commit -m "Rehacer el pie institucional: cuatro columnas, contacto y franja legal, sin animación de opacidad"
```

- [ ] **Step 5: Verificación en navegador (la hace el controlador)**

A 375, 768, 1024 y 1440 px, en `/blog`:

- Las cuatro columnas y el contacto se ven completos. Acerca de y Eventos muestran «Próximamente»; Recursos, Blog, Podcast, Cursos ↗, Comunidad ↗ y Directorio ↗; Membresía, Membresía básica ↗.
- La franja noche se lee.
- No hay scroll horizontal.

- [ ] **Step 6: Legible sin JavaScript**

```bash
npm run build
node -e "const h=require('fs').readFileSync('dist/public/blog.html','utf8');const f=h.slice(h.indexOf('data-testid=\"footer\"'));console.log('opacity0 en el pie:',(f.match(/opacity:0/g)||[]).length,'| respaldo:',f.includes('Con el respaldo de World Urban Parks'))"
```

Expected: `opacity0 en el pie: 0 | respaldo: true`.

---

### Task 5: Documentar y cerrar el PR C

**Files:**

- Modify: `docs/design-guidelines.md` (sección nueva «Navegación»)

**Interfaces:**

- Consumes: Tasks 1–4.
- Produces: la guía que leen los PR E y F.

- [ ] **Step 1: Sección «Navegación» en la guía de diseño**

Añade a `docs/design-guidelines.md`, antes de «## Movimiento»:

```markdown
## Navegación

- Fuente única: `client/src/lib/navegacion.ts`. Cabecera, panel móvil, pie y
  404 leen de ahí; ningún componente declara enlaces propios.
- Cinco rubros (Acerca de · Recursos · Eventos · Membresía · Comunidad) y el
  botón Únete, el único botón lleno de la cabecera. Recursos es un mega-menú
  de cuatro grupos (Aprende · Certifícate · Participa · Conecta).
- Un destino sin página no lleva `href` y se muestra «Próximamente». Al crear
  su página, se le pone `href` en el mismo PR (el test de enlaces muertos lo
  exige). Dentro de cada lista, los vivos van arriba.
- Externos: ↗, pestaña nueva, texto `sr-only` «(se abre en otra pestaña)» y
  evento `salida_plataforma`.
- Menú completo desde el corte que fija `Header.tsx` (lg o xl, ver el PR C);
  por debajo, panel móvil con un acordeón por rubro y Únete fijo abajo.
- Teclado en el mega-menú: flechas, Inicio y Fin (`lib/teclado.ts`); Radix da
  Enter/Espacio para abrir y Escape para cerrar.
- Pie: solo destinos vivos por columna; si un rubro no tiene ninguno, una sola
  marca «Próximamente». Sin animaciones de entrada.
```

(Cambia «el corte que fija `Header.tsx` (lg o xl, ver el PR C)» por el corte que quedó en el Task 2, Step 7: «desde `lg` (1024 px)» o «desde `xl` (1280 px)».)

- [ ] **Step 2: Puertas completas y build**

```bash
npx prettier --write docs/design-guidelines.md
npm run check && npm run lint && npm run format:check && npm test && npm run build
```

Expected: verde. Tests: los 122 del PR B más los nuevos. `navegacion.test.ts` queda con 22 tests, `teclado.test.ts` suma 5 y `sugerencias.test.ts` suma 1.

- [ ] **Step 3: Commit**

```bash
git add docs/design-guidelines.md
git commit -m "Documentar la navegación institucional en la guía de diseño"
```

- [ ] **Step 4: Verificación en navegador (la hace el controlador) e integración local**

Rutas `/`, `/blog`, un artículo y `/no-existe`, a 375, 768, 1024 y 1440 px:

- Menú, mega-menú, panel móvil y pie.
- Ruta activa en Recursos al estar en `/blog`.
- Teclado en Recursos: flechas y Escape.
- `dataLayer` recibe `click_menu` y `salida_plataforma`.
- El 404 ofrece destinos sin repetir.

Después:

```bash
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/c-navegacion -m "PR C: menú de cinco rubros, mega-menú Recursos y pie institucional"
```

---

## Qué queda fuera y a quién le toca

- **Formulario del boletín en el pie** → PR E, junto a `/api/suscripcion`, que requiere la decisión D8 de Antonio.
- **Únete → `/unete`** → PR E. Hasta entonces sigue en MemberPress (externo).
- **`href` de Nosotros, ¿Qué hacemos?, Nuestro equipo y Eventos** → PR E. **Mapa de Ruta** → PR F. **Contacto, aviso de privacidad y términos** → Etapa 0.
- **YouTube en las redes**: falta la URL oficial (`PENDIENTE` en `marca.ts`).
- **Barra de subnavegación «Acerca de»** (§6.2): va con la primera página que la usa, en el PR E.
