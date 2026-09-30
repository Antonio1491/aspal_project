---
title: Catálogo de componentes y estilos (/componentes)
type: feat
status: active
date: 2026-09-30
---

# Catálogo de componentes y estilos: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Una página `/componentes` (pública pero oculta) donde cualquier programador vea los estilos y componentes que ya existen y pruebe sus variantes, respaldada por un registro tipado que obliga a registrar cada componente y detecta los que ya nadie usa, para que un agente reutilice en vez de crear.

**Architecture:** El registro (`client/src/catalogo/registro.ts`) es la fuente única: una entrada por archivo de `client/src/components/**`, con para qué sirve, cuándo usarlo y cuándo no, sus props, si está en uso y cómo se ve. Un test en `node` lo compara con el disco y con los imports reales. La página lo recorre: fundamentos (color con contraste medido en vivo, tipografía, clases compartidas, botones, bandas), y una ficha por componente con su demo, controles de variantes y el código que la reproduce. Las demos viven en `client/src/catalogo/` y TypeScript obliga a que toda entrada con `vista: "demo"` tenga la suya.

**Tech Stack:** React 18, wouter, Tailwind, shadcn/ui, Vitest (`node`). Sin dependencias nuevas; se elimina `@radix-ui/react-avatar`.

**Spec:** petición de Antonio (2026-09-30): página para que cualquier programador vea los estilos existentes, pruebe variaciones visuales, y para que el agente revise y reutilice componentes en vez de crear nuevos en cada vista. Decisiones suyas: **pública pero oculta** (noindex, fuera del sitemap); alcance: **fundamentos, componentes propios, shadcn/ui y catálogo para el agente**.

## Global Constraints

- `CLAUDE.md` manda. UI, comentarios e identificadores en español.
- **Solo commits locales, nunca `git push`.** Rama: `etapa1/k-catalogo` desde `feat/etapa-1-institucional`; se integra con `--no-ff` en el Task 6.
- Puertas antes de cada commit: `npm run check`, `npm run lint` (0 errores; hoy hay 8 avisos previos), `npx prettier --check client server docs scripts CLAUDE.md`, `npm test`. En los Tasks 3–6, además `npm run build` (sus puertas: un `<h1>` presente, un solo `<main id="contenido">`, nada a `opacity:0`, assets sin huérfanos).
- `/componentes`: `indexable: false` en `SEO` (sale con `<meta name="robots" content="noindex">` y fuera del sitemap). **No** se enlaza desde el menú ni el pie.
- Las demos **nunca** tienen efectos reales: el formulario de suscripción no envía a Mailchimp desde el catálogo.
- Sin dependencias nuevas. Sin copy institucional nuevo: las demos usan el contenido real de `client/src/content/` y, donde hace falta un post de WordPress, un ejemplo rotulado como tal.
- Puerto de desarrollo 5001 (5000 es de otro proyecto: no matar). Build: `PORT=5002 npm start`.

## Review Focus

1. **Alguien crea un componente y no lo registra**, o registra uno que no existe. El test del Task 1 compara el registro con los archivos de `client/src/components/**`.
2. **Un componente deja de usarse y sigue marcado «en uso»** (o al revés). El test del Task 1 busca sus importadores reales (alias `@/components/…` y rutas relativas), excluyendo el propio catálogo.
3. **Probar el formulario en el catálogo da de alta un correo en Mailchimp.** El Task 4 intercepta el `submit` en captura; el Task 6 comprueba en la pestaña Red que no sale ningún `POST /api/suscripcion`.
4. **Google indexa `/componentes`.** El Task 3 añade un test: `indexable: false`, ausente del sitemap y con `noindex` en el `<head>`.
5. **Un control con texto largo o un componente ancho rompe la página a 375 px.** El marco de cada demo es `overflow-x-auto`; el Task 6 mide el desborde a 375 y 1280.

## Decisiones (rulings)

| #   | Decisión                                                                                                                       | Por qué                                                                                                                                                                 | Coste si es errónea                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| K1  | Página dentro de la app, no Storybook/Ladle                                                                                    | Antonio eligió pública-oculta; así usa los mismos tokens, proveedores y prerender, sin una segunda herramienta que mantener                                             | Migrar las demos a Storybook más adelante     |
| K2  | Se borran `TestimonialsSection`, `TestimonialCard` y `ui/avatar` (+ `@radix-ui/react-avatar`)                                  | Nadie los importa: `TestimonialsSection` solo aparece comentado en `plataforma.tsx`, y avatar solo lo usaba `TestimonialCard`. `CLAUDE.md`: en `ui/` solo lo que se usa | Recuperarlos del historial de git             |
| K3  | `client/src/lib/clases.ts` con las tres cadenas de clases repetidas (título de banda, botón miel y botón contorno sobre noche) | Se repetían 5–6 veces entre páginas; el catálogo las enseña como la forma de hacerlo                                                                                    | Volver a escribirlas en línea                 |
| K4  | El registro es datos puros (`registro.ts`) y las demos van aparte (`demos-*.tsx`)                                              | El test corre en `node` sin resolver imágenes ni componentes; TypeScript garantiza que toda entrada `vista: "demo"` tenga su demo                                       | —                                             |
| K5  | El uso se mide por importadores directos                                                                                       | Simple y verificable. Un componente importado solo por otro sin uso cuenta como «en uso»: se detecta en la siguiente pasada, al borrar el padre                         | Un muerto transitivo sobrevive una iteración  |
| K6  | La página tendrá más de un `<h1>`/`<h2>` fuera de orden (la demo de `HeroInstitucional` pinta el suyo)                         | Enseñar el componente real exige su marcado real; es una página interna y noindex                                                                                       | Aviso `heading-order` de axe (buena práctica) |

---

## Mapa de archivos

| Archivo                                                                                                           | Responsabilidad                                                  | Task |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---- |
| `client/src/catalogo/tipos.ts`                                                                                    | Tipos: entrada del registro, demo, controles                     | 1    |
| `client/src/catalogo/registro.ts`                                                                                 | Una entrada por componente; tipos derivados de ids               | 1    |
| `client/src/catalogo/registro.test.ts`                                                                            | Registro = disco; estado = imports reales                        | 1    |
| `client/src/components/sections/Testimonial*.tsx`, `client/src/components/ui/avatar.tsx`                          | Se borran (K2)                                                   | 1    |
| `client/src/lib/clases.ts` (+ `.test.ts`)                                                                         | Clases compartidas; test que prohíbe copiarlas                   | 2    |
| `client/src/pages/{inicio,mapa-de-ruta,nosotros,que-hacemos,unete}.tsx`, `ContenidoReciente.tsx`, `EtapaMapa.tsx` | Usan `clases.ts`                                                 | 2    |
| `client/src/lib/contraste.ts` (+ `.test.ts`)                                                                      | Contraste WCAG puro y `PARES`; `tokens.test.ts` lo reutiliza     | 3    |
| `client/src/catalogo/fundamentos.ts`                                                                              | Colores, escala tipográfica                                      | 3    |
| `client/src/catalogo/SeccionFundamentos.tsx`                                                                      | Color con contraste en vivo, tipografía, clases, botones, bandas | 3    |
| `client/src/catalogo/FichaComponente.tsx`, `CopiarCodigo.tsx`, `demos.ts`                                         | Ficha de un componente; botón de copiar; acceso a demos          | 3    |
| `client/src/pages/componentes.tsx`; `rutas.ts`, `App.tsx`, `seo.ts` (+ `seo.test.ts`)                             | La página y su alta noindex                                      | 3    |
| `client/src/catalogo/VistaDemo.tsx`                                                                               | Marco, controles y código de una demo                            | 4    |
| `client/src/catalogo/demos-propios.tsx`                                                                           | Demos de layout, institucional, contenido y formularios          | 4    |
| `client/src/catalogo/demos-ui.tsx`                                                                                | Demos de shadcn/ui                                               | 5    |
| `CLAUDE.md`, `docs/design-guidelines.md`, `docs/architecture.md`                                                  | Regla «reutiliza antes de crear» y dónde está el catálogo        | 5    |

## Análisis de conflictos entre tasks

| Tasks     | Comparten                                                                                       | Produce → consume                                                     | Resultado                                                |
| --------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| 1 → 3,4,5 | `tipos.ts`, `registro.ts`                                                                       | `REGISTRO`, `IdDemoPropio`, `IdDemoUi`, `Demo`, `Control`, `Valores`  | Nombres fijados en el Interfaces del Task 1              |
| 1 ↔ 2     | `registro.test.ts`                                                                              | El Task 2 no crea componentes (solo `lib/`)                           | Sin conflicto                                            |
| 2 → 3     | `clases.ts`                                                                                     | `H2_BANDA`, `BOTON_MIEL_NOCHE`, `BOTON_CONTORNO_NOCHE` → fundamentos  | Sin conflicto                                            |
| 3 → 4,5   | `demos.ts`                                                                                      | `demoDe(id)` devuelve `undefined` en el Task 3; el 4 y el 5 lo llenan | Orden obligatorio                                        |
| 1 → 3     | `registro.test.ts` excluye `client/src/catalogo/` y `pages/componentes.tsx` de los importadores | La página no cuenta como uso                                          | Evita que el catálogo mantenga vivo lo que nadie más usa |

---

### Task 1: Registro del catálogo, su test y limpieza de componentes muertos

**Files:**

- Create: `client/src/catalogo/tipos.ts`
- Create: `client/src/catalogo/registro.ts`
- Create: `client/src/catalogo/registro.test.ts`
- Delete: `client/src/components/sections/TestimonialsSection.tsx`, `client/src/components/sections/TestimonialCard.tsx`, `client/src/components/ui/avatar.tsx`
- Modify: `client/src/pages/plataforma.tsx` (borrar la línea `{/* <TestimonialsSection /> */}`), `package.json`/`package-lock.json` (`npm uninstall @radix-ui/react-avatar`)
- Modify: `vitest.config.ts` solo si `client/src/**/*.test.ts` no cubriera `client/src/catalogo/` (ya lo cubre: comprobarlo, no tocarlo si no hace falta)

**Interfaces:**

- Consumes: nada.
- Produces:
  - `tipos.ts`: `Categoria`, `Estado`, `Vista`, `EntradaCatalogo`, `Control`, `Valores`, `Fondo = "blanco" | "suave" | "noche"`, `Demo` (con `controles?`, `fondo?: Fondo | ((v: Valores) => Fondo)`, `nota?`, `render(v)`, `codigo(v)`).
  - `registro.ts`: `REGISTRO` (`as const satisfies readonly EntradaCatalogo[]`), `CATEGORIAS: readonly { id: Categoria; titulo: string; descripcion: string }[]`, tipos `IdComponente`, `IdDemoPropio` (vista demo, categoría ≠ ui), `IdDemoUi` (vista demo, categoría ui).

- [ ] **Step 0: Rama**

```bash
git switch feat/etapa-1-institucional
git switch -c etapa1/k-catalogo
```

- [ ] **Step 1: Tipos**

`client/src/catalogo/tipos.ts`:

```ts
import type { ReactNode } from "react";

/** Papel del componente. La carpeta de `client/src/components/` lo acota (ver el test). */
export type Categoria =
  | "layout"
  | "institucional"
  | "contenido"
  | "formularios"
  | "ui"
  | "legado"
  | "infraestructura";

/** `sin-uso`: nadie lo importa. El test obliga a marcarlo; lo normal es borrarlo. */
export type Estado = "en-uso" | "sin-uso";

/**
 * Cómo se ve en /componentes. `demo`: con controles. `en-esta-pagina`: ya está
 * alrededor (cabecera, pie…). `sin-vista`: no pinta nada propio o solo tiene
 * sentido en su página (legado de /plataforma, infraestructura).
 */
export type Vista = "demo" | "en-esta-pagina" | "sin-vista";

export interface EntradaCatalogo {
  /** kebab-case; ancla de su ficha en /componentes. */
  id: string;
  nombre: string;
  /** Ruta desde la raíz del repo, con `/`. */
  archivo: string;
  /** La línea de import tal cual se escribe. */
  importar: string;
  categoria: Categoria;
  descripcion: string;
  usarCuando: string;
  evitarPara?: string;
  /** Firma resumida de las props. */
  props: string;
  estado: Estado;
  vista: Vista;
}

export type Control =
  | {
      tipo: "opciones";
      clave: string;
      etiqueta: string;
      opciones: readonly string[];
      inicial: string;
    }
  | { tipo: "texto"; clave: string; etiqueta: string; inicial: string }
  | { tipo: "interruptor"; clave: string; etiqueta: string; inicial: boolean };

export type Valores = Record<string, string | boolean>;

export type Fondo = "blanco" | "suave" | "noche";

export interface Demo {
  controles?: readonly Control[];
  /** Fondo del marco. Función si depende de un control (p. ej. tono noche). */
  fondo?: Fondo | ((valores: Valores) => Fondo);
  /** Aviso bajo la demo (efectos desactivados, datos de la API real…). */
  nota?: string;
  render: (valores: Valores) => ReactNode;
  /** Código que reproduce la demo con los valores actuales. */
  codigo: (valores: Valores) => string;
}
```

- [ ] **Step 2: El test que falla**

`client/src/catalogo/registro.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { REGISTRO } from "./registro";
import type { Categoria } from "./tipos";

const RAIZ = resolve(import.meta.dirname, "..", "..", "..");
const SRC = join(RAIZ, "client", "src");
const posix = (ruta: string) => ruta.split(sep).join("/");

function recorrer(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const ruta = join(dir, entrada);
    return statSync(ruta).isDirectory() ? recorrer(ruta) : [ruta];
  });
}

const enDisco = recorrer(join(SRC, "components"))
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
  .map((f) => posix(relative(RAIZ, f)))
  .sort();

// El propio catálogo no cuenta como uso: si no, mantendría vivo lo que nadie
// más importa.
const fuentes = recorrer(SRC)
  .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => ({ ruta: posix(relative(RAIZ, f)), texto: readFileSync(f, "utf8") }))
  .filter(
    (f) =>
      !f.ruta.startsWith("client/src/catalogo/") &&
      f.ruta !== "client/src/pages/componentes.tsx",
  );

/** Quién importa el archivo: por alias `@/components/<carpeta>/<Nombre>` o relativo. */
function importadores(archivo: string): string[] {
  const nombre = basename(archivo, ".tsx");
  const carpeta = basename(dirname(archivo));
  const patron = new RegExp(
    `["'](?:@/components/${carpeta}/${nombre}|\\.\\.?/(?:${carpeta}/)?${nombre})["']`,
  );
  return fuentes
    .filter((f) => f.ruta !== archivo && patron.test(f.texto))
    .map((f) => f.ruta);
}

const CATEGORIAS_POR_CARPETA: Record<string, Categoria[]> = {
  layout: ["layout", "infraestructura"],
  institucional: ["institucional"],
  content: ["contenido"],
  forms: ["formularios"],
  ui: ["ui"],
  sections: ["legado"],
};

describe("registro del catálogo", () => {
  it("tiene una entrada por cada componente de client/src/components, y nada más", () => {
    expect(REGISTRO.map((e) => e.archivo).sort()).toEqual(enDisco);
  });

  it("usa ids únicos en kebab-case", () => {
    const ids = REGISTRO.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it("clasifica cada componente según su carpeta", () => {
    for (const e of REGISTRO) {
      const carpeta = basename(dirname(e.archivo));
      expect(CATEGORIAS_POR_CARPETA[carpeta], e.archivo).toContain(e.categoria);
    }
  });

  it("marca en uso lo que alguien importa y sin uso lo que no", () => {
    for (const e of REGISTRO) {
      const usado = importadores(e.archivo).length > 0;
      expect(
        e.estado,
        `${e.nombre}: ${usado ? "tiene importadores" : "nadie lo importa"}`,
      ).toBe(usado ? "en-uso" : "sin-uso");
    }
  });

  it("da una línea de import que apunta a su archivo", () => {
    for (const e of REGISTRO) {
      const modulo = `@/components/${basename(dirname(e.archivo))}/${basename(e.archivo, ".tsx")}`;
      expect(e.importar, e.nombre).toContain(`"${modulo}"`);
    }
  });

  it("no deja textos vacíos", () => {
    for (const e of REGISTRO) {
      for (const texto of [e.nombre, e.descripcion, e.usarCuando, e.props]) {
        expect(texto.trim(), e.id).not.toBe("");
      }
    }
  });
});
```

Run: `npx vitest run client/src/catalogo/registro.test.ts`
Expected: FAIL, `Cannot find module './registro'`.

- [ ] **Step 3: Borrar lo que nadie usa (K2)**

```bash
git rm client/src/components/sections/TestimonialsSection.tsx client/src/components/sections/TestimonialCard.tsx client/src/components/ui/avatar.tsx
npm uninstall @radix-ui/react-avatar
```

En `client/src/pages/plataforma.tsx`, borra la línea `{/* <TestimonialsSection /> */}`. Comprueba que no quedan referencias:

Run: `grep -rn "Testimonial\|ui/avatar\|react-avatar" client/src package.json`
Expected: sin resultados.

- [ ] **Step 4: El registro**

`client/src/catalogo/registro.ts`:

```ts
/**
 * Catálogo de componentes: una entrada por archivo de `client/src/components/`.
 * Lo lee la página /componentes y, sobre todo, quien vaya a crear una vista:
 * antes de escribir un componente, busca aquí uno que ya lo resuelva
 * (`usarCuando`, `evitarPara`). `registro.test.ts` falla si un componente no
 * está registrado o si su `estado` no coincide con quién lo importa.
 */
import type { Categoria, EntradaCatalogo } from "./tipos";

export const CATEGORIAS: readonly {
  id: Categoria;
  titulo: string;
  descripcion: string;
}[] = [
  {
    id: "layout",
    titulo: "Estructura de página",
    descripcion: "Lo que arma cualquier página: bandas, hero, cabecera, pie.",
  },
  {
    id: "institucional",
    titulo: "Institucional",
    descripcion:
      "Piezas de Nosotros, ¿Qué hacemos?, Equipo y Mapa de Ruta. Leen su copy de client/src/content/institucional.",
  },
  {
    id: "contenido",
    titulo: "Contenido de WordPress",
    descripcion: "Tarjetas y bloques que pintan artículos y episodios de /api/*.",
  },
  {
    id: "formularios",
    titulo: "Formularios",
    descripcion: "Captura de datos. Validan con la misma función que el servidor.",
  },
  {
    id: "ui",
    titulo: "Base (shadcn/ui)",
    descripcion:
      "Primitivas tematizadas con los tokens del sitio. Solo las que se usan; una nueva se añade con el CLI de shadcn.",
  },
  {
    id: "legado",
    titulo: "Legado de /plataforma",
    descripcion:
      "Secciones de la antigua home de producto. Solo viven en /plataforma: no las reutilices en páginas nuevas.",
  },
  {
    id: "infraestructura",
    titulo: "Infraestructura",
    descripcion:
      "Componentes sin interfaz propia que montan comportamiento global en App.tsx.",
  },
];

export const REGISTRO = [
  // ── Estructura de página ───────────────────────────────────────────────
  {
    id: "banda",
    nombre: "Banda",
    archivo: "client/src/components/layout/Banda.tsx",
    importar: 'import { Banda } from "@/components/layout/Banda";',
    categoria: "layout",
    descripcion:
      "Franja horizontal a todo el ancho con el contenedor y el espaciado del sitio (py-16 md:py-24, max-w-7xl).",
    usarCuando: "Cada bloque de una página. Alterna tonos: blanco → suave → noche.",
    evitarPara:
      "Tarjetas o cajas dentro de una banda: para eso, un div con rounded-2xl border.",
    props:
      'tono?: "blanco" | "suave" | "noche"; id?: string; className?: string; children',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "hero-institucional",
    nombre: "HeroInstitucional",
    archivo: "client/src/components/layout/HeroInstitucional.tsx",
    importar:
      'import { HeroInstitucional } from "@/components/layout/HeroInstitucional";',
    categoria: "layout",
    descripcion:
      "Banda noche con overline miel y el único <h1> de la página. Sin animaciones: se prerenderiza.",
    usarCuando: "La cabecera de cualquier página institucional nueva.",
    evitarPara: "Más de una vez por página (pinta el <h1>).",
    props: "overline: string; overlineNormal?: boolean; titulo: string; children?",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "proximamente",
    nombre: "Proximamente",
    archivo: "client/src/components/layout/Proximamente.tsx",
    importar: 'import { Proximamente } from "@/components/layout/Proximamente";',
    categoria: "layout",
    descripcion: "Etiqueta «Próximamente» para un destino que aún no existe.",
    usarCuando: "Junto a un enlace o sección sin página todavía (menú, pilares, pie).",
    props: "className?: string",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "aviso-pestana-nueva",
    nombre: "AvisoPestanaNueva",
    archivo: "client/src/components/layout/AvisoPestanaNueva.tsx",
    importar:
      'import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";',
    categoria: "layout",
    descripcion:
      "Texto solo para lectores de pantalla: «(se abre en una pestaña nueva)».",
    usarCuando: 'Dentro de todo enlace con target="_blank", junto al icono ↗.',
    props: "sin props",
    estado: "en-uso",
    vista: "sin-vista",
  },
  {
    id: "header",
    nombre: "Header",
    archivo: "client/src/components/layout/Header.tsx",
    importar: 'import Header from "@/components/layout/Header";',
    categoria: "layout",
    descripcion:
      "Cabecera con los cinco rubros (mega-menú desde 1280 px), panel móvil modal y botón Únete. Lee client/src/lib/navegacion.ts.",
    usarCuando:
      "Primera pieza de toda página. Para cambiar el menú, edita navegacion.ts, no este componente.",
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "footer",
    nombre: "Footer",
    archivo: "client/src/components/layout/Footer.tsx",
    importar: 'import Footer from "@/components/layout/Footer";',
    categoria: "layout",
    descripcion:
      "Pie institucional: boletín, cuatro columnas de navegación, contacto y franja legal.",
    usarCuando:
      "Última pieza de toda página. conBoletin={false} si la página ya tiene su propio formulario de boletín.",
    props: "conBoletin?: boolean",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "saltar-al-contenido",
    nombre: "SaltarAlContenido",
    archivo: "client/src/components/layout/SaltarAlContenido.tsx",
    importar:
      'import { SaltarAlContenido } from "@/components/layout/SaltarAlContenido";',
    categoria: "infraestructura",
    descripcion:
      'Primer enlace de cada página (visible al tabular): salta al <main id="contenido">.',
    usarCuando:
      'Ya está en App.tsx. Toda página nueva necesita su <main id="contenido" tabIndex={-1}> (el build lo exige).',
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "scroll-to-top",
    nombre: "ScrollToTop",
    archivo: "client/src/components/layout/ScrollToTop.tsx",
    importar: 'import { ScrollToTop } from "@/components/layout/ScrollToTop";',
    categoria: "layout",
    descripcion: "Botón flotante «volver arriba» que aparece tras 300 px de scroll.",
    usarCuando: "Ya está en App.tsx; no se añade por página.",
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "cabecera-ruta",
    nombre: "CabeceraRuta",
    archivo: "client/src/components/layout/CabeceraRuta.tsx",
    importar: 'import { CabeceraRuta } from "@/components/layout/CabeceraRuta";',
    categoria: "infraestructura",
    descripcion:
      "Mantiene título y descripción al navegar sin recargar y canonicaliza mayúsculas en la URL.",
    usarCuando:
      "Ya está en App.tsx. El título de una página nueva va en SEO de client/src/lib/seo.ts.",
    props: "sin props",
    estado: "en-uso",
    vista: "sin-vista",
  },
  {
    id: "scroll-restoration",
    nombre: "ScrollRestoration",
    archivo: "client/src/components/layout/ScrollRestoration.tsx",
    importar:
      'import { ScrollRestoration } from "@/components/layout/ScrollRestoration";',
    categoria: "infraestructura",
    descripcion:
      "Restaura el scroll con Atrás/Adelante y lleva a las anclas (#etapa-3, #tecnologia) al entrar o recargar.",
    usarCuando: "Ya está en App.tsx. Las anclas nuevas solo necesitan id y scroll-mt-32.",
    props: "sin props",
    estado: "en-uso",
    vista: "sin-vista",
  },
  {
    id: "error-boundary",
    nombre: "ErrorBoundary",
    archivo: "client/src/components/layout/ErrorBoundary.tsx",
    importar: 'import { ErrorBoundary } from "@/components/layout/ErrorBoundary";',
    categoria: "infraestructura",
    descripcion:
      "Captura errores de render y muestra una salida (recargar o ir al inicio) en vez de una pantalla en blanco.",
    usarCuando: "Ya envuelve el Router en App.tsx.",
    props: "children",
    estado: "en-uso",
    vista: "sin-vista",
  },

  // ── Institucional ──────────────────────────────────────────────────────
  {
    id: "pilar-card",
    nombre: "PilarCard",
    archivo: "client/src/components/institucional/PilarCard.tsx",
    importar: 'import { PilarCard } from "@/components/institucional/PilarCard";',
    categoria: "institucional",
    descripcion:
      "Tarjeta de uno de los 4 pilares. «resumen» (h3, enlace al detalle) o «detalle» (h2, cómo se traduce y enlaces).",
    usarCuando:
      "Mostrar pilares: home, Nosotros, ¿Qué hacemos?. Datos en content/institucional/pilares.ts.",
    props: 'pilar: Pilar; variante: "resumen" | "detalle"',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "tarjeta-compromiso",
    nombre: "TarjetaCompromiso",
    archivo: "client/src/components/institucional/TarjetaCompromiso.tsx",
    importar:
      'import { TarjetaCompromiso } from "@/components/institucional/TarjetaCompromiso";',
    categoria: "institucional",
    descripcion: "Tarjeta simple de título + texto (Lo que defendemos).",
    usarCuando: "Enunciados cortos de valores o compromisos en rejilla.",
    props: "titulo: string; texto: string",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "ruta-timeline",
    nombre: "RutaTimeline",
    archivo: "client/src/components/institucional/RutaTimeline.tsx",
    importar: 'import { RutaTimeline } from "@/components/institucional/RutaTimeline";',
    categoria: "institucional",
    descripcion:
      "Escalera de hitos por año con <details> nativo: se abre con clic, toque o teclado.",
    usarCuando: "Cualquier línea de tiempo con detalle desplegable.",
    props: "hitos: Hito[]",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "perfil-card",
    nombre: "PerfilCard",
    archivo: "client/src/components/institucional/PerfilCard.tsx",
    importar: 'import { PerfilCard } from "@/components/institucional/PerfilCard";',
    categoria: "institucional",
    descripcion:
      "Perfil de una persona: foto (o silueta con el isotipo), nombre, cargo, bio y LinkedIn.",
    usarCuando: "Equipo, Consejo, ponentes.",
    props: "perfil: Perfil",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "muro-aliados",
    nombre: "MuroAliados",
    archivo: "client/src/components/institucional/MuroAliados.tsx",
    importar: 'import { MuroAliados } from "@/components/institucional/MuroAliados";',
    categoria: "institucional",
    descripcion:
      "Rejilla estática de aliados con logo y descripción, y categorías pendientes opcionales.",
    usarCuando: "Aliados o patrocinadores. Sin carrusel automático (accesibilidad).",
    props: "fundadores: Aliado[]; pendientes?: string[]",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "subnav-seccion",
    nombre: "SubnavSeccion",
    archivo: "client/src/components/institucional/SubnavSeccion.tsx",
    importar: 'import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";',
    categoria: "institucional",
    descripcion:
      "Subnavegación fija bajo la cabecera con las páginas de «Acerca de», marcando la activa.",
    usarCuando: "Páginas de Acerca de. Sus destinos salen de navegacion.ts.",
    props: "sin props",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "indice-etapas",
    nombre: "IndiceEtapas",
    archivo: "client/src/components/institucional/IndiceEtapas.tsx",
    importar: 'import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";',
    categoria: "institucional",
    descripcion:
      "Las 7 etapas del Mapa de Ruta en lista ordenada: franja de la home (enlaza a /mapa-de-ruta#etapa-N) o índice de la página.",
    usarCuando: "Enlazar a las etapas del Mapa de Ruta.",
    props: 'origen: "home" | "mapa"',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "etapa-mapa",
    nombre: "EtapaMapa",
    archivo: "client/src/components/institucional/EtapaMapa.tsx",
    importar: 'import { EtapaMapa } from "@/components/institucional/EtapaMapa";',
    categoria: "institucional",
    descripcion:
      "Una etapa del Mapa de Ruta: pasos, frase de cierre y enlaces a la anterior y la siguiente.",
    usarCuando: "Dentro de una Banda con id={etapa.id} en /mapa-de-ruta.",
    props: "etapa: EtapaMapa; anterior?: EtapaMapa; siguiente?: EtapaMapa",
    estado: "en-uso",
    vista: "demo",
  },

  // ── Contenido de WordPress ─────────────────────────────────────────────
  {
    id: "blog-card",
    nombre: "BlogCard",
    archivo: "client/src/components/content/BlogCard.tsx",
    importar: 'import BlogCard from "@/components/content/BlogCard";',
    categoria: "contenido",
    descripcion:
      "Tarjeta de artículo: imagen (si la hay), título, extracto y fecha. Enlaza fuera (muro de MemberPress, D9).",
    usarCuando: "Listar artículos de /api/posts.",
    evitarPara: "Episodios de podcast: PodcastCard.",
    props: "post: TransformedPost",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "podcast-card",
    nombre: "PodcastCard",
    archivo: "client/src/components/content/PodcastCard.tsx",
    importar: 'import { PodcastCard } from "@/components/content/PodcastCard";',
    categoria: "contenido",
    descripcion:
      "Tarjeta de episodio: portada (si la hay), número opcional, título, descripción y fecha.",
    usarCuando: "Listar episodios de /api/podcasts.",
    props: "podcast: TransformedPost; episodeNumber?: number",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "contenido-reciente",
    nombre: "ContenidoReciente",
    archivo: "client/src/components/content/ContenidoReciente.tsx",
    importar:
      'import { ContenidoReciente } from "@/components/content/ContenidoReciente";',
    categoria: "contenido",
    descripcion:
      "Banda con 3 artículos y el último episodio. Si la API falla, desaparece (RF-13).",
    usarCuando: "Traer contenido reciente a una página institucional.",
    props: "sin props",
    estado: "en-uso",
    vista: "demo",
  },

  // ── Formularios ────────────────────────────────────────────────────────
  {
    id: "form-suscripcion",
    nombre: "FormSuscripcion",
    archivo: "client/src/components/forms/FormSuscripcion.tsx",
    importar: 'import { FormSuscripcion } from "@/components/forms/FormSuscripcion";',
    categoria: "formularios",
    descripcion:
      "Alta al boletín: valida con la misma función que el servidor, envía a /api/suscripcion y explica la doble confirmación.",
    usarCuando: "Cualquier captura de correo. origen etiqueta la alta en Mailchimp.",
    evitarPara: "Formularios que no sean de boletín.",
    props:
      'origen: "unete" | "home" | "footer" | "eventos"; variante: "completo" | "compacto"; tono?: "claro" | "noche"',
    estado: "en-uso",
    vista: "demo",
  },

  // ── Base (shadcn/ui) ───────────────────────────────────────────────────
  {
    id: "button",
    nombre: "Button",
    archivo: "client/src/components/ui/button.tsx",
    importar: 'import { Button } from "@/components/ui/button";',
    categoria: "ui",
    descripcion:
      'Botón base. Primario: variant="secondary" (miel). Secundario: outline. Sobre noche: clases de client/src/lib/clases.ts.',
    usarCuando: "Toda acción. Con asChild para envolver un Link o un <a>.",
    evitarPara: "Enlaces de texto dentro de un párrafo.",
    props:
      'variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"; size?: "default" | "sm" | "lg" | "icon"; asChild?: boolean',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "badge",
    nombre: "Badge",
    archivo: "client/src/components/ui/badge.tsx",
    importar: 'import { Badge } from "@/components/ui/badge";',
    categoria: "ui",
    descripcion: "Etiqueta pequeña (categoría, número de episodio).",
    usarCuando: "Metadatos cortos que no se pulsan.",
    props: 'variant?: "default" | "secondary" | "outline" | "destructive"',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "card",
    nombre: "Card",
    archivo: "client/src/components/ui/card.tsx",
    importar:
      'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";',
    categoria: "ui",
    descripcion:
      "Contenedor con borde y fondo de tarjeta, con partes Header/Title/Description/Content/Footer.",
    usarCuando:
      "Tarjetas de contenido de WordPress. En páginas institucionales se usa un div rounded-2xl border (ver PilarCard).",
    props: "className?; children (componer con CardHeader, CardContent…)",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "input",
    nombre: "Input",
    archivo: "client/src/components/ui/input.tsx",
    importar: 'import { Input } from "@/components/ui/input";',
    categoria: "ui",
    descripcion: "Campo de texto tematizado.",
    usarCuando: "Dentro de un formulario, siempre con <label> asociado.",
    props: "props de <input>",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "collapsible",
    nombre: "Collapsible",
    archivo: "client/src/components/ui/collapsible.tsx",
    importar:
      'import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";',
    categoria: "ui",
    descripcion: "Bloque que se abre y cierra (acordeones del panel móvil).",
    usarCuando:
      "Grupos desplegables controlados. Para texto estático que se despliega, <details> nativo (ver RutaTimeline).",
    props: "open?; onOpenChange?; children",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "tooltip",
    nombre: "Tooltip",
    archivo: "client/src/components/ui/tooltip.tsx",
    importar:
      'import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";',
    categoria: "ui",
    descripcion: "Ayuda breve al pasar o enfocar. TooltipProvider ya está en App.tsx.",
    usarCuando:
      "Aclarar un icono. Nunca para información imprescindible (no llega en móvil).",
    props: "Tooltip > TooltipTrigger asChild + TooltipContent",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "toast",
    nombre: "Toast",
    archivo: "client/src/components/ui/toast.tsx",
    // Se lanza desde el hook; el componente de "@/components/ui/toast" lo pinta el Toaster.
    importar:
      'import { toast } from "@/hooks/use-toast"; // pinta: "@/components/ui/toast"',
    categoria: "ui",
    descripcion:
      "Aviso temporal en esquina. Se lanza con toast({ title, description }) desde @/hooks/use-toast.",
    usarCuando: "Confirmaciones breves que no requieren acción.",
    evitarPara: "Errores de formulario: van junto al campo (ver FormSuscripcion).",
    props: "toast({ title, description, variant })",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "toaster",
    nombre: "Toaster",
    archivo: "client/src/components/ui/toaster.tsx",
    importar: 'import { Toaster } from "@/components/ui/toaster";',
    categoria: "ui",
    descripcion: "Contenedor donde aparecen los toasts.",
    usarCuando: "Ya está en App.tsx.",
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "navigation-menu",
    nombre: "NavigationMenu",
    archivo: "client/src/components/ui/navigation-menu.tsx",
    importar:
      'import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";',
    categoria: "ui",
    descripcion: "Primitiva del mega-menú de escritorio (Radix).",
    usarCuando: "Solo la usa Header. axe marca su focus proxy: es interno de Radix.",
    props: "ver Radix NavigationMenu",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },

  // ── Legado de /plataforma ──────────────────────────────────────────────
  ...(
    [
      [
        "hero-section",
        "HeroSection",
        "HeroSection",
        "default",
        "Hero de producto con captura del panel.",
      ],
      [
        "problem-section",
        "ProblemSection",
        "ProblemSection",
        "default",
        "Bloque problema/solución con ilustración (y MembershipProblemSection).",
      ],
      [
        "features-grid",
        "FeaturesGrid",
        "FeaturesGrid",
        "default",
        "Rejilla de funcionalidades de producto.",
      ],
      [
        "feature-card",
        "FeatureCard",
        "FeatureCard",
        "default",
        "Tarjeta de una funcionalidad (la usa FeaturesGrid).",
      ],
      [
        "logo-carousel",
        "LogoCarousel",
        "LogoCarousel",
        "default",
        "Carrusel de logos de clientes.",
      ],
      [
        "cta-section",
        "CTASection",
        "CTASection",
        "default",
        "Llamada final a registrarse en la plataforma.",
      ],
      [
        "community-graphics",
        "CommunityGraphics",
        "HexagonNetwork",
        "named",
        "Gráficos decorativos SVG (HexagonNetwork, DecorativeBlob…).",
      ],
    ] as const
  ).map(([id, archivo, nombre, exportacion, descripcion]) => ({
    id,
    nombre: archivo === "CommunityGraphics" ? "CommunityGraphics" : nombre,
    archivo: `client/src/components/sections/${archivo}.tsx`,
    importar:
      exportacion === "default"
        ? `import ${nombre} from "@/components/sections/${archivo}";`
        : `import { ${nombre} } from "@/components/sections/${archivo}";`,
    categoria: "legado" as const,
    descripcion,
    usarCuando: "Solo en /plataforma, hasta su reubicación en la Etapa 3.",
    evitarPara:
      "Páginas nuevas: usa Banda, HeroInstitucional y los componentes institucionales.",
    props: "ver el archivo",
    estado: "en-uso" as const,
    vista: "sin-vista" as const,
  })),
] as const satisfies readonly EntradaCatalogo[];

type Entrada = (typeof REGISTRO)[number];
export type IdComponente = Entrada["id"];
export type IdDemoPropio = Exclude<
  Extract<Entrada, { vista: "demo" }>,
  { categoria: "ui" }
>["id"];
export type IdDemoUi = Extract<Entrada, { vista: "demo"; categoria: "ui" }>["id"];
```

> Si `as const satisfies` no acepta el spread del legado (TypeScript puede ensanchar los literales dentro del `map`), escribe las 7 entradas de legado a mano con la misma forma. El test y los tipos derivados (`IdDemoPropio`, `IdDemoUi`) deben seguir siendo uniones de literales: compruébalo con `npm run check` y un `const _x: IdDemoUi = "button";` temporal.

- [ ] **Step 5: Test en verde**

Run: `npx vitest run client/src/catalogo/registro.test.ts`
Expected: PASS (6 tests). Si «marca en uso…» falla, el mensaje dice qué componente y por qué: corrige su `estado`, no el test.

- [ ] **Step 6: Puertas y commit**

```bash
npm run check && npm run lint && npx prettier --check client server docs scripts CLAUDE.md && npm test && npm run build
git add -A client/src/catalogo client/src/components client/src/pages/plataforma.tsx package.json package-lock.json
git commit -m "Registro del catálogo de componentes, con test contra el disco y los imports; fuera los componentes sin uso"
```

---

### Task 2: Clases compartidas

**Files:**

- Create: `client/src/lib/clases.ts`, `client/src/lib/clases.test.ts`
- Modify: `client/src/pages/inicio.tsx`, `mapa-de-ruta.tsx`, `nosotros.tsx`, `que-hacemos.tsx`, `unete.tsx`; `client/src/components/content/ContenidoReciente.tsx`; `client/src/components/institucional/EtapaMapa.tsx`

**Interfaces:**

- Produces: `H2_BANDA`, `BOTON_MIEL_NOCHE`, `BOTON_CONTORNO_NOCHE` (strings).

- [ ] **Step 1: El test que falla**

`client/src/lib/clases.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BOTON_CONTORNO_NOCHE, BOTON_MIEL_NOCHE, H2_BANDA } from "./clases";

const SRC = resolve(import.meta.dirname, "..");
function recorrer(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const f = join(dir, e);
    return statSync(f).isDirectory() ? recorrer(f) : [f];
  });
}
const tsx = recorrer(SRC).filter((f) => f.endsWith(".tsx"));

describe("clases compartidas", () => {
  it.each([
    ["H2_BANDA", H2_BANDA],
    ["BOTON_MIEL_NOCHE", BOTON_MIEL_NOCHE],
    ["BOTON_CONTORNO_NOCHE", BOTON_CONTORNO_NOCHE],
  ])("nadie copia %s en línea: se importa de lib/clases.ts", (_nombre, clases) => {
    const copias = tsx.filter((f) => readFileSync(f, "utf8").includes(`"${clases}"`));
    expect(copias).toEqual([]);
  });
});
```

Run: `npx vitest run client/src/lib/clases.test.ts` → FAIL (`./clases` no existe).

- [ ] **Step 2: El módulo**

`client/src/lib/clases.ts`:

```ts
/**
 * Clases que se repetían página a página. Impórtalas en vez de copiarlas: el
 * test de al lado falla si alguien vuelve a escribir la cadena en línea. Se
 * ven en /componentes (Fundamentos).
 */

/** Título de banda (h2): 32–40 px, negrita. */
export const H2_BANDA = "text-3xl font-bold text-foreground md:text-4xl";

/** Botón miel sobre banda noche: `<Button variant="secondary" className={…}>`. */
export const BOTON_MIEL_NOCHE =
  "min-h-11 px-6 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";

/**
 * Botón de contorno blanco sobre banda noche: `<Button variant="outline" className={…}>`.
 * `[border-color:white]` y no `border-white`: la variante outline pone
 * `[border-color:var(--button-outline)]` y tailwind-merge solo fusiona la
 * propiedad arbitraria igual.
 */
export const BOTON_CONTORNO_NOCHE =
  "min-h-11 [border-color:white] bg-transparent px-6 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";
```

- [ ] **Step 3: Sustituir las copias**

En cada archivo de la lista, cambia la cadena literal por la constante y añade el import `from "@/lib/clases"`. Lugares actuales (`grep -rnF` de cada cadena):

- `H2_BANDA`: `ContenidoReciente.tsx:61`, `EtapaMapa.tsx:28`, `inicio.tsx:24` (constante local `h2`), `mapa-de-ruta.tsx:59`, `nosotros.tsx:32` (constante local `h2`), `unete.tsx:98`.
- `BOTON_MIEL_NOCHE`: `inicio.tsx:26` y `mapa-de-ruta.tsx:16` (constantes locales `BOTON_MIEL`), `nosotros.tsx:47`, `nosotros.tsx:224`, `que-hacemos.tsx:50`.
- `BOTON_CONTORNO_NOCHE`: `inicio.tsx:28` y `mapa-de-ruta.tsx:18` (`BOTON_CONTORNO`), `nosotros.tsx:60`, `:237`, `:247`.

Borra las constantes locales (`h2`, `BOTON_MIEL`, `BOTON_CONTORNO`) y usa las importadas. Donde una clase se combina con otra (`` `mt-2 ${h2}` ``), usa `cn("mt-2", H2_BANDA)` o la plantilla con la constante. El HTML resultante debe ser idéntico: compruébalo con `npm run build` y `diff` de `dist/public/index.html` antes y después (guarda una copia antes de empezar).

- [ ] **Step 4: Verde, puertas y commit**

Run: `npx vitest run client/src/lib/clases.test.ts` → PASS.

```bash
cp dist/public/index.html /tmp/antes-index.html   # (antes del Step 3)
npm run check && npm run lint && npx prettier --check client && npm test && npm run build
diff <(sed 's/></>\n</g' /tmp/antes-index.html) <(sed 's/></>\n</g' dist/public/index.html)   # esperado: sin diferencias salvo hashes de assets
git add client/src/lib/clases.ts client/src/lib/clases.test.ts client/src/pages client/src/components/content/ContenidoReciente.tsx client/src/components/institucional/EtapaMapa.tsx
git commit -m "Clases compartidas para títulos de banda y botones sobre noche, con test que impide copiarlas"
```

---

### Task 3: Contraste reutilizable y página /componentes con Fundamentos

**Files:**

- Create: `client/src/lib/contraste.ts`, `client/src/lib/contraste.test.ts`
- Modify: `client/src/lib/tokens.test.ts` (usa `contraste.ts`)
- Create: `client/src/catalogo/fundamentos.ts`, `SeccionFundamentos.tsx`, `FichaComponente.tsx`, `CopiarCodigo.tsx`, `demos.ts`
- Create: `client/src/pages/componentes.tsx`
- Modify: `client/src/lib/rutas.ts`, `client/src/App.tsx`, `client/src/lib/seo.ts`, `client/src/lib/seo.test.ts`

**Interfaces:**

- Consumes: `REGISTRO`, `CATEGORIAS`, tipos (Task 1); `H2_BANDA`, `BOTON_*` (Task 2).
- Produces:
  - `contraste.ts`: `type Hsl = [number, number, number]`, `hslDeTexto(valor: string): Hsl | null`, `contraste(texto: Hsl, fondo: Hsl): number`, `PARES: readonly (readonly [string, string])[]`.
  - `demos.ts`: `demoDe(id: string): Demo | undefined` (en este task devuelve siempre `undefined`).
  - `FichaComponente({ entrada }: { entrada: EntradaCatalogo })`.

- [ ] **Step 1: Tests que fallan**

`client/src/lib/contraste.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { contraste, hslDeTexto } from "./contraste";

describe("contraste", () => {
  it("lee el formato de los tokens de index.css", () => {
    expect(hslDeTexto("206 53% 14%")).toEqual([206, 53, 14]);
    expect(hslDeTexto(" 41 75% 31% ")).toEqual([41, 75, 31]);
    expect(hslDeTexto("#ffffff")).toBeNull();
  });

  it("da 21:1 entre negro y blanco y 1:1 entre iguales", () => {
    expect(contraste([0, 0, 0], [0, 0, 100])).toBeCloseTo(21, 1);
    expect(contraste([206, 53, 14], [206, 53, 14])).toBeCloseTo(1, 5);
  });
});
```

En `client/src/lib/seo.test.ts`, añade:

```ts
it("publica /componentes sin indexar y fuera del sitemap", () => {
  expect(SEO["/componentes"].indexable).toBe(false);
  expect(generarSitemap()).not.toContain("/componentes");
  expect(etiquetasHead("/componentes")).toContain(
    '<meta name="robots" content="noindex" />',
  );
});
```

Run: `npx vitest run client/src/lib/contraste.test.ts client/src/lib/seo.test.ts` → FAIL.

- [ ] **Step 2: `contraste.ts` y `tokens.test.ts` sobre él**

`client/src/lib/contraste.ts`:

```ts
/**
 * Contraste WCAG entre dos colores HSL, en el formato de los tokens de
 * index.css ("206 53% 14%"). Lo usan tokens.test.ts (contra el CSS) y la
 * página /componentes (contra los valores que el navegador ya calculó).
 */
export type Hsl = [number, number, number];

export function hslDeTexto(valor: string): Hsl | null {
  const m = valor.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function hslARgb([h, s, l]: Hsl): number[] {
  const sat = s / 100;
  const lum = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lum, 1 - lum);
  const f = (n: number) =>
    lum - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function luminancia(rgb: number[]): number {
  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(texto: Hsl, fondo: Hsl): number {
  const a = luminancia(hslARgb(texto));
  const b = luminancia(hslARgb(fondo));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** [texto, fondo]: todo par que el diseño usa para texto normal. AA exige 4.5. */
export const PARES: readonly (readonly [string, string])[] = [
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["brand-noche-foreground", "brand-noche"],
  ["secondary", "brand-noche"],
  ["miel-texto", "background"],
  ["primary", "fondo-suave"],
  ["muted-foreground", "fondo-suave"],
  ["muted-foreground", "background"],
  ["primary", "accent"],
];
```

En `client/src/lib/tokens.test.ts`: borra `hslARgb`, `luminancia` y el array `PARES` locales; importa `contraste as contrasteHsl, PARES` de `./contraste`; conserva `token(nombre)` (lee el CSS) y define `const contraste = (t: string, f: string) => contrasteHsl(token(t), token(f));`. Los tests existentes no cambian.

- [ ] **Step 3: Alta de la ruta noindex**

- `rutas.ts`: `"/componentes"` al final de `RUTAS_ESTATICAS`.
- `seo.ts`, en `SEO`:

```ts
  "/componentes": {
    titulo: "Componentes y estilos · ASPAL",
    descripcion:
      "Catálogo interno de componentes, colores y tipografía del sitio de ASPAL, para quien desarrolla y diseña.",
    indexable: false,
  },
```

- `App.tsx`: `import Componentes from "@/pages/componentes";` y `"/componentes": Componentes,` en `PAGINAS`.

- [ ] **Step 4: Datos de fundamentos**

`client/src/catalogo/fundamentos.ts`:

```ts
/**
 * Fundamentos para /componentes. Las clases van escritas enteras para que
 * Tailwind las genere. Fuente: docs/design-guidelines.md.
 */
export const COLORES = [
  {
    token: "primary",
    nombre: "Pizarra",
    muestra: "bg-primary",
    uso: "Títulos, botones de contorno, bandas institucionales",
  },
  {
    token: "secondary",
    nombre: "Miel",
    muestra: "bg-secondary",
    uso: "Botón primario (Únete), acentos. Nunca como texto sobre blanco",
  },
  {
    token: "brand-noche",
    nombre: "Noche",
    muestra: "bg-noche",
    uso: "Hero, banda final, franja del pie",
  },
  {
    token: "miel-texto",
    nombre: "Miel texto",
    muestra: "bg-miel-texto",
    uso: "Overlines y etiquetas sobre claro",
  },
  {
    token: "fondo-suave",
    nombre: "Fondo suave",
    muestra: "bg-fondo-suave",
    uso: "Bandas alternas",
  },
  { token: "accent", nombre: "Acento", muestra: "bg-accent", uso: "Tarjetas destacadas" },
  {
    token: "muted-foreground",
    nombre: "Texto secundario",
    muestra: "bg-muted-foreground",
    uso: "Descripciones, metadatos",
  },
  { token: "background", nombre: "Fondo", muestra: "bg-background", uso: "Fondo base" },
] as const;

export const TIPOGRAFIA = [
  { nivel: "H1", clases: "text-5xl lg:text-6xl font-bold", muestra: "La red en español" },
  {
    nivel: "H2",
    clases: "text-3xl md:text-4xl font-bold",
    muestra: "Los 4 Pilares ASPAL",
  },
  { nivel: "H3", clases: "text-2xl font-semibold", muestra: "Comunidad" },
  {
    nivel: "Cuerpo",
    clases: "text-lg",
    muestra: "Profesionalizamos la gestión asociativa en América Latina.",
  },
  {
    nivel: "Overline",
    clases: "text-[13px] font-semibold uppercase tracking-wider text-miel-texto",
    muestra: "Mapa de Ruta",
  },
] as const;
```

- [ ] **Step 5: Copiar código, ficha y acceso a demos**

`client/src/catalogo/CopiarCodigo.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Bloque de código con botón de copiar. El aviso «Copiado» llega al lector de pantalla. */
export function CopiarCodigo({ codigo, testid }: { codigo: string; testid: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl bg-noche p-4 pr-24 text-sm text-noche-foreground">
        <code>{codigo}</code>
      </pre>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 min-h-9 bg-background"
        onClick={async () => {
          await navigator.clipboard?.writeText(codigo);
          setCopiado(true);
          window.setTimeout(() => setCopiado(false), 1500);
        }}
        data-testid={testid}
      >
        {copiado ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span aria-live="polite">{copiado ? "Copiado" : "Copiar"}</span>
      </Button>
    </div>
  );
}
```

`client/src/catalogo/demos.ts`:

```ts
import type { Demo } from "./tipos";

/** Demo de un componente por id. Los Tasks 4 y 5 la llenan. */
const DEMOS: Partial<Record<string, Demo>> = {};

export function demoDe(id: string): Demo | undefined {
  return DEMOS[id];
}
```

`client/src/catalogo/FichaComponente.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import { CopiarCodigo } from "./CopiarCodigo";
import { demoDe } from "./demos";
import type { EntradaCatalogo } from "./tipos";

const VISTA: Record<EntradaCatalogo["vista"], string> = {
  demo: "",
  "en-esta-pagina": "Se ve en esta misma página (cabecera, pie o botones globales).",
  "sin-vista": "No tiene vista propia aquí: ver su archivo y la página donde se usa.",
};

/** Ficha de un componente: qué es, cuándo usarlo, cómo importarlo y su demo. */
export function FichaComponente({ entrada }: { entrada: EntradaCatalogo }) {
  const demo = entrada.vista === "demo" ? demoDe(entrada.id) : undefined;
  return (
    <article
      id={entrada.id}
      aria-labelledby={`${entrada.id}-titulo`}
      className="scroll-mt-32 rounded-2xl border border-border bg-background p-6"
      data-testid={`ficha-${entrada.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3
          id={`${entrada.id}-titulo`}
          className="text-2xl font-semibold text-foreground"
        >
          {entrada.nombre}
        </h3>
        {entrada.estado === "sin-uso" && <Badge variant="destructive">Sin uso</Badge>}
      </div>
      <p className="mt-1 break-all font-mono text-sm text-muted-foreground">
        {entrada.archivo}
      </p>
      <p className="mt-3 text-lg text-foreground">{entrada.descripcion}</p>
      <dl className="mt-4 grid gap-3 text-base md:grid-cols-2">
        <div>
          <dt className="font-semibold text-foreground">Úsalo para</dt>
          <dd className="text-muted-foreground">{entrada.usarCuando}</dd>
        </div>
        {entrada.evitarPara && (
          <div>
            <dt className="font-semibold text-foreground">No lo uses para</dt>
            <dd className="text-muted-foreground">{entrada.evitarPara}</dd>
          </div>
        )}
        <div className="md:col-span-2">
          <dt className="font-semibold text-foreground">Props</dt>
          <dd className="font-mono text-sm text-muted-foreground">{entrada.props}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <CopiarCodigo codigo={entrada.importar} testid={`copiar-import-${entrada.id}`} />
      </div>
      {entrada.vista !== "demo" && (
        <p className="mt-4 text-muted-foreground">{VISTA[entrada.vista]}</p>
      )}
      {demo && (
        <div className="mt-6" data-testid={`demo-${entrada.id}`}>
          {/* Task 4: <VistaDemo id demo /> */}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 6: Sección de fundamentos**

`client/src/catalogo/SeccionFundamentos.tsx`:

```tsx
import { Banda } from "@/components/layout/Banda";
import { Button } from "@/components/ui/button";
import { useEnCliente } from "@/hooks/use-en-cliente";
import { BOTON_CONTORNO_NOCHE, BOTON_MIEL_NOCHE, H2_BANDA } from "@/lib/clases";
import { contraste, hslDeTexto, PARES } from "@/lib/contraste";
import { CopiarCodigo } from "./CopiarCodigo";
import { COLORES, TIPOGRAFIA } from "./fundamentos";

const h3 = "text-2xl font-semibold text-foreground";

/** Contraste medido sobre los valores que el navegador ya resolvió (index.css). */
function useContrastes() {
  const enCliente = useEnCliente();
  if (!enCliente) return null;
  const estilo = getComputedStyle(document.documentElement);
  return PARES.map(([texto, fondo]) => {
    const t = hslDeTexto(estilo.getPropertyValue(`--${texto}`));
    const f = hslDeTexto(estilo.getPropertyValue(`--${fondo}`));
    return { texto, fondo, ratio: t && f ? contraste(t, f) : null };
  });
}

export function SeccionFundamentos() {
  const contrastes = useContrastes();
  return (
    <section
      id="fundamentos"
      aria-labelledby="fundamentos-titulo"
      className="scroll-mt-32"
    >
      <h2 id="fundamentos-titulo" className={H2_BANDA}>
        Fundamentos
      </h2>

      <h3 className={`mt-10 ${h3}`}>Color</h3>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLORES.map((c) => (
          <li
            key={c.token}
            className="overflow-hidden rounded-2xl border border-border"
            data-testid={`color-${c.token}`}
          >
            <div className={`h-20 ${c.muestra}`} aria-hidden="true" />
            <div className="p-4">
              <p className="font-semibold text-foreground">{c.nombre}</p>
              <p className="font-mono text-sm text-muted-foreground">
                --{c.token} · {c.muestra}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{c.uso}</p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className={`mt-10 ${h3}`}>Contraste de los pares de texto</h3>
      <p className="mt-2 text-muted-foreground">
        Medido en vivo sobre index.css. AA exige 4,5:1. Un par nuevo se añade a PARES en
        client/src/lib/contraste.ts.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PARES.map(([texto, fondo], i) => {
          const ratio = contrastes?.[i]?.ratio;
          return (
            <li key={`${texto}-${fondo}`} className="rounded-xl border border-border p-4">
              <p className="font-mono text-sm">
                {texto} sobre {fondo}
              </p>
              <p
                className="mt-1 text-lg font-semibold"
                data-testid={`contraste-${texto}-${fondo}`}
              >
                {ratio
                  ? `${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? "✓ AA" : "✗ no cumple AA"}`
                  : "—"}
              </p>
            </li>
          );
        })}
      </ul>

      <h3 className={`mt-10 ${h3}`}>Tipografía</h3>
      <p className="mt-2 text-muted-foreground">
        Montserrat 400–800, servida desde /fuentes/montserrat-v31/.
      </p>
      <ul className="mt-4 space-y-4">
        {TIPOGRAFIA.map((t) => (
          <li key={t.nivel} className="rounded-xl border border-border p-4">
            <p className="font-mono text-sm text-muted-foreground">
              {t.nivel} · {t.clases}
            </p>
            <p className={`mt-2 ${t.clases}`}>{t.muestra}</p>
          </li>
        ))}
      </ul>

      <h3 className={`mt-10 ${h3}`}>Clases compartidas</h3>
      <p className="mt-2 text-muted-foreground">
        En client/src/lib/clases.ts. Impórtalas; un test impide copiarlas en línea.
      </p>
      <div className="mt-4 space-y-3">
        <CopiarCodigo
          codigo={`import { H2_BANDA } from "@/lib/clases";\n// "${H2_BANDA}"`}
          testid="copiar-h2-banda"
        />
      </div>

      <h3 className={`mt-10 ${h3}`}>Botones</h3>
      <div className="mt-4 flex flex-wrap gap-3 rounded-2xl border border-border p-6">
        <Button variant="secondary" className="min-h-11 px-6">
          Primario (secondary)
        </Button>
        <Button variant="outline" className="min-h-11 px-6">
          Secundario (outline)
        </Button>
        <Button className="min-h-11 px-6">Pizarra (default)</Button>
        <Button variant="ghost" className="min-h-11 px-6">
          Fantasma (ghost)
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 rounded-2xl bg-noche p-6 [--ring:42_93%_68%]">
        <Button variant="secondary" className={BOTON_MIEL_NOCHE}>
          Miel sobre noche
        </Button>
        <Button variant="outline" className={BOTON_CONTORNO_NOCHE}>
          Contorno sobre noche
        </Button>
      </div>
      <div className="mt-3">
        <CopiarCodigo
          codigo={`import { BOTON_CONTORNO_NOCHE, BOTON_MIEL_NOCHE } from "@/lib/clases";\n\n<Button variant="secondary" className={BOTON_MIEL_NOCHE}>…</Button>\n<Button variant="outline" className={BOTON_CONTORNO_NOCHE}>…</Button>`}
          testid="copiar-botones-noche"
        />
      </div>

      <h3 className={`mt-10 ${h3}`}>Bandas</h3>
      <p className="mt-2 text-muted-foreground">
        Ritmo blanco → suave → noche. Cada bloque de página es una Banda.
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        {(["blanco", "suave", "noche"] as const).map((tono) => (
          <Banda key={tono} tono={tono} className="py-6 md:py-8">
            <p className="text-lg">tono="{tono}"</p>
          </Banda>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: La página**

`client/src/pages/componentes.tsx`:

```tsx
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { FichaComponente } from "@/catalogo/FichaComponente";
import { CATEGORIAS, REGISTRO } from "@/catalogo/registro";
import { SeccionFundamentos } from "@/catalogo/SeccionFundamentos";
import { H2_BANDA } from "@/lib/clases";

/**
 * Catálogo interno (pública pero noindex; no se enlaza desde el menú). Para
 * quien programa o diseña: ver lo que existe, probar variantes y copiar el
 * código. La fuente es client/src/catalogo/registro.ts.
 */
export default function Componentes() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        <HeroInstitucional overline="Para el equipo" titulo="Componentes y estilos">
          <p>
            Todo lo que ya existe en el sitio, con sus variantes y el código para usarlo.
            Antes de crear un componente nuevo, busca aquí uno que lo resuelva. Página
            interna: no aparece en buscadores.
          </p>
        </HeroInstitucional>

        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
          <nav aria-label="Índice del catálogo" className="mb-10 lg:mb-0">
            <ul className="space-y-1 lg:sticky lg:top-24">
              <li>
                <a
                  href="#fundamentos"
                  className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                >
                  Fundamentos
                </a>
              </li>
              {CATEGORIAS.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#categoria-${c.id}`}
                    className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {c.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-16">
            <SeccionFundamentos />
            {CATEGORIAS.map((c) => {
              const entradas = REGISTRO.filter((e) => e.categoria === c.id);
              return (
                <section
                  key={c.id}
                  id={`categoria-${c.id}`}
                  aria-labelledby={`categoria-${c.id}-titulo`}
                  className="scroll-mt-32"
                >
                  <h2 id={`categoria-${c.id}-titulo`} className={H2_BANDA}>
                    {c.titulo}
                  </h2>
                  <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
                    {c.descripcion}
                  </p>
                  <div className="mt-6 space-y-6">
                    {entradas.map((e) => (
                      <FichaComponente key={e.id} entrada={e} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 8: Tests, puertas, navegador y commit**

Run: `npx vitest run client/src/lib client/src/catalogo` → PASS.

```bash
npm run check && npm run lint && npx prettier --write client/src/catalogo client/src/pages/componentes.tsx client/src/lib && npm test && npm run build
grep -c 'content="noindex"' dist/public/componentes.html   # 1
grep -c "componentes" dist/public/sitemap.xml               # 0
```

En `PORT=5001 npm run dev`, abre `/componentes`: hero, índice, Fundamentos (8 colores, 9 contrastes con ✓ AA, tipografía, botones claros y sobre noche, tres bandas) y una ficha por componente en cada categoría. Sin scroll horizontal a 375 px.

```bash
git add client/src/lib/contraste.ts client/src/lib/contraste.test.ts client/src/lib/tokens.test.ts client/src/lib/seo.ts client/src/lib/seo.test.ts client/src/lib/rutas.ts client/src/App.tsx client/src/catalogo client/src/pages/componentes.tsx
git commit -m "Página /componentes (noindex): fundamentos con contraste en vivo y una ficha por componente"
```

---

### Task 4: Demos con controles de los componentes propios

**Files:**

- Create: `client/src/catalogo/VistaDemo.tsx`, `client/src/catalogo/demos-propios.tsx`
- Modify: `client/src/catalogo/demos.ts`, `client/src/catalogo/FichaComponente.tsx`

**Interfaces:**

- Consumes: `Demo`, `Control`, `Valores`, `Fondo`, `IdDemoPropio` (Task 1); `CopiarCodigo`, `demoDe` (Task 3).
- Produces: `VistaDemo({ id, demo }: { id: string; demo: Demo })`; `DEMOS_PROPIOS: Record<IdDemoPropio, Demo>`.

- [ ] **Step 1: `VistaDemo`**

`client/src/catalogo/VistaDemo.tsx`:

```tsx
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import { CopiarCodigo } from "./CopiarCodigo";
import type { Control, Demo, Fondo, Valores } from "./tipos";

const FONDOS: Record<Fondo, string> = {
  blanco: "bg-background",
  suave: "bg-fondo-suave",
  noche: "bg-noche text-noche-foreground [--ring:42_93%_68%]",
};

function valoresIniciales(controles: readonly Control[] = []): Valores {
  return Object.fromEntries(controles.map((c) => [c.clave, c.inicial]));
}

function CampoControl({
  control,
  valor,
  alCambiar,
}: {
  control: Control;
  valor: string | boolean;
  alCambiar: (v: string | boolean) => void;
}) {
  const id = useId();
  const clases =
    "min-h-11 w-full rounded-md border border-input bg-background px-3 text-base";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {control.etiqueta}
      </label>
      {control.tipo === "opciones" && (
        <select
          id={id}
          className={clases}
          value={String(valor)}
          onChange={(e) => alCambiar(e.target.value)}
        >
          {control.opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
      {control.tipo === "texto" && (
        <Input
          id={id}
          className="min-h-11"
          value={String(valor)}
          onChange={(e) => alCambiar(e.target.value)}
        />
      )}
      {control.tipo === "interruptor" && (
        <input
          id={id}
          type="checkbox"
          className="h-6 w-6"
          checked={Boolean(valor)}
          onChange={(e) => alCambiar(e.target.checked)}
        />
      )}
    </div>
  );
}

/** Demo en vivo: controles, marco con el componente y el código que la reproduce. */
export function VistaDemo({ id, demo }: { id: string; demo: Demo }) {
  const [valores, setValores] = useState<Valores>(() => valoresIniciales(demo.controles));
  const fondo =
    typeof demo.fondo === "function" ? demo.fondo(valores) : (demo.fondo ?? "blanco");
  return (
    <div className="space-y-4">
      {demo.controles && demo.controles.length > 0 && (
        <fieldset className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
          <legend className="px-1 text-sm font-semibold text-muted-foreground">
            Variantes
          </legend>
          {demo.controles.map((c) => (
            <CampoControl
              key={c.clave}
              control={c}
              valor={valores[c.clave]}
              alCambiar={(v) => setValores((a) => ({ ...a, [c.clave]: v }))}
            />
          ))}
        </fieldset>
      )}
      <div
        className={cn(
          "overflow-x-auto rounded-2xl border border-border p-4 md:p-6",
          FONDOS[fondo],
        )}
        data-testid={`marco-${id}`}
      >
        {demo.render(valores)}
      </div>
      {demo.nota && <p className="text-sm text-muted-foreground">{demo.nota}</p>}
      <CopiarCodigo codigo={demo.codigo(valores)} testid={`copiar-codigo-${id}`} />
    </div>
  );
}
```

En `FichaComponente.tsx`, sustituye el comentario del Task 3 por `<VistaDemo id={entrada.id} demo={demo} />` (e importa `VistaDemo`).

- [ ] **Step 2: Demos de los componentes propios**

`client/src/catalogo/demos-propios.tsx`:

```tsx
import BlogCard from "@/components/content/BlogCard";
import { ContenidoReciente } from "@/components/content/ContenidoReciente";
import { PodcastCard } from "@/components/content/PodcastCard";
import { FormSuscripcion } from "@/components/forms/FormSuscripcion";
import { EtapaMapa } from "@/components/institucional/EtapaMapa";
import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";
import { MuroAliados } from "@/components/institucional/MuroAliados";
import { PerfilCard } from "@/components/institucional/PerfilCard";
import { PilarCard } from "@/components/institucional/PilarCard";
import { RutaTimeline } from "@/components/institucional/RutaTimeline";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { TarjetaCompromiso } from "@/components/institucional/TarjetaCompromiso";
import { Banda } from "@/components/layout/Banda";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Proximamente } from "@/components/layout/Proximamente";
import { PERFILES } from "@/content/institucional/equipo";
import { ETAPAS } from "@/content/institucional/mapa-ruta";
import {
  ALIADOS_FUNDADORES,
  CATEGORIAS_ALIADOS_PENDIENTES,
  DEFENDEMOS,
  RUTA,
} from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import type { TransformedPost } from "@shared/wordpress/types";
import type { IdDemoPropio } from "./registro";
import type { Demo, Fondo } from "./tipos";

/** Post de ejemplo para las tarjetas de contenido (no es un artículo real). */
const POST_EJEMPLO: TransformedPost = {
  id: 1,
  title: "Artículo de ejemplo del catálogo",
  slug: "ejemplo",
  excerpt:
    "Extracto de ejemplo para ver cómo corta la tarjeta un texto de dos o tres líneas en el listado.",
  content: "",
  featuredImage: "/og-aspal.png",
  category: "Blog",
  categorySlugs: ["blog"],
  publishedAt: "2026-09-01T12:00:00Z",
  isGated: false,
  readingMinutes: 5,
  author: "ASPAL",
  link: "https://comunidad.asociacionesprofesionales.org/",
};

const texto = (v: string | boolean) => String(v);

export const DEMOS_PROPIOS: Record<IdDemoPropio, Demo> = {
  banda: {
    controles: [
      {
        tipo: "opciones",
        clave: "tono",
        etiqueta: "tono",
        opciones: ["blanco", "suave", "noche"],
        inicial: "suave",
      },
    ],
    render: (v) => (
      <Banda tono={texto(v.tono) as "blanco" | "suave" | "noche"}>
        <p className="text-lg">Contenido de una banda con tono «{texto(v.tono)}».</p>
      </Banda>
    ),
    codigo: (v) => `<Banda tono="${texto(v.tono)}">\n  …\n</Banda>`,
  },
  "hero-institucional": {
    controles: [
      { tipo: "texto", clave: "overline", etiqueta: "overline", inicial: "Nosotros" },
      {
        tipo: "texto",
        clave: "titulo",
        etiqueta: "titulo",
        inicial: "La red en español del sector asociativo de América Latina.",
      },
      {
        tipo: "interruptor",
        clave: "overlineNormal",
        etiqueta: "overlineNormal (sin mayúsculas)",
        inicial: false,
      },
    ],
    nota: "Pinta el <h1> de la página: úsalo una sola vez.",
    render: (v) => (
      <HeroInstitucional
        overline={texto(v.overline)}
        overlineNormal={Boolean(v.overlineNormal)}
        titulo={texto(v.titulo)}
      >
        <p>Párrafo de apoyo del hero.</p>
      </HeroInstitucional>
    ),
    codigo: (v) =>
      `<HeroInstitucional overline="${texto(v.overline)}"${v.overlineNormal ? " overlineNormal" : ""} titulo="${texto(v.titulo)}">\n  <p>…</p>\n</HeroInstitucional>`,
  },
  proximamente: {
    render: () => (
      <p className="flex items-center gap-2 text-lg">
        Estudios e investigaciones <Proximamente />
      </p>
    ),
    codigo: () => `<span>Estudios e investigaciones</span> <Proximamente />`,
  },
  "pilar-card": {
    controles: [
      {
        tipo: "opciones",
        clave: "pilar",
        etiqueta: "pilar",
        opciones: PILARES.map((p) => p.id),
        inicial: "comunidad",
      },
      {
        tipo: "opciones",
        clave: "variante",
        etiqueta: "variante",
        opciones: ["resumen", "detalle"],
        inicial: "resumen",
      },
    ],
    render: (v) => (
      <div className="max-w-xl">
        <PilarCard
          pilar={PILARES.find((p) => p.id === v.pilar) ?? PILARES[0]}
          variante={texto(v.variante) as "resumen" | "detalle"}
        />
      </div>
    ),
    codigo: (v) =>
      `<PilarCard pilar={PILARES.find((p) => p.id === "${texto(v.pilar)}")!} variante="${texto(v.variante)}" />`,
  },
  "tarjeta-compromiso": {
    controles: [
      {
        tipo: "texto",
        clave: "titulo",
        etiqueta: "titulo",
        inicial: DEFENDEMOS[0].titulo,
      },
      { tipo: "texto", clave: "texto", etiqueta: "texto", inicial: DEFENDEMOS[0].texto },
    ],
    render: (v) => (
      <div className="max-w-md">
        <TarjetaCompromiso titulo={texto(v.titulo)} texto={texto(v.texto)} />
      </div>
    ),
    codigo: (v) => `<TarjetaCompromiso titulo="${texto(v.titulo)}" texto="…" />`,
  },
  "ruta-timeline": {
    render: () => <RutaTimeline hitos={RUTA} />,
    codigo: () => `<RutaTimeline hitos={RUTA} />`,
  },
  "perfil-card": {
    controles: [
      {
        tipo: "opciones",
        clave: "perfil",
        etiqueta: "perfil",
        opciones: PERFILES.map((p) => p.nombre),
        inicial: PERFILES[0].nombre,
      },
    ],
    render: (v) => (
      <div className="max-w-sm">
        <PerfilCard perfil={PERFILES.find((p) => p.nombre === v.perfil) ?? PERFILES[0]} />
      </div>
    ),
    codigo: (v) =>
      `<PerfilCard perfil={PERFILES.find((p) => p.nombre === "${texto(v.perfil)}")!} />`,
  },
  "muro-aliados": {
    controles: [
      {
        tipo: "interruptor",
        clave: "pendientes",
        etiqueta: "con categorías pendientes",
        inicial: true,
      },
    ],
    fondo: "suave",
    render: (v) => (
      <MuroAliados
        fundadores={ALIADOS_FUNDADORES}
        pendientes={v.pendientes ? CATEGORIAS_ALIADOS_PENDIENTES : undefined}
      />
    ),
    codigo: (v) =>
      `<MuroAliados fundadores={ALIADOS_FUNDADORES}${v.pendientes ? " pendientes={CATEGORIAS_ALIADOS_PENDIENTES}" : ""} />`,
  },
  "subnav-seccion": {
    nota: "Sticky bajo la cabecera. Solo se pinta con dos o más destinos de Acerca de y marca la ruta activa.",
    render: () => <SubnavSeccion />,
    codigo: () => `<Header />\n<SubnavSeccion />`,
  },
  "indice-etapas": {
    controles: [
      {
        tipo: "opciones",
        clave: "origen",
        etiqueta: "origen",
        opciones: ["home", "mapa"],
        inicial: "home",
      },
    ],
    render: (v) => <IndiceEtapas origen={texto(v.origen) as "home" | "mapa"} />,
    codigo: (v) => `<IndiceEtapas origen="${texto(v.origen)}" />`,
  },
  "etapa-mapa": {
    controles: [
      {
        tipo: "opciones",
        clave: "etapa",
        etiqueta: "etapa",
        opciones: ETAPAS.map((e) => String(e.numero)),
        inicial: "1",
      },
    ],
    render: (v) => {
      const i = Number(v.etapa) - 1;
      return (
        <EtapaMapa etapa={ETAPAS[i]} anterior={ETAPAS[i - 1]} siguiente={ETAPAS[i + 1]} />
      );
    },
    codigo: (v) =>
      `<EtapaMapa etapa={ETAPAS[${Number(v.etapa) - 1}]} anterior={ETAPAS[${Number(v.etapa) - 2}]} siguiente={ETAPAS[${Number(v.etapa)}]} />`,
  },
  "blog-card": {
    controles: [
      {
        tipo: "interruptor",
        clave: "imagen",
        etiqueta: "con imagen destacada",
        inicial: true,
      },
    ],
    fondo: "suave",
    nota: "Datos de ejemplo. En la app, el post llega de /api/posts.",
    render: (v) => (
      <div className="max-w-sm">
        <BlogCard
          post={{
            ...POST_EJEMPLO,
            featuredImage: v.imagen ? POST_EJEMPLO.featuredImage : "",
          }}
        />
      </div>
    ),
    codigo: () => `<BlogCard post={post} />`,
  },
  "podcast-card": {
    controles: [
      { tipo: "interruptor", clave: "imagen", etiqueta: "con portada", inicial: true },
      {
        tipo: "opciones",
        clave: "episodio",
        etiqueta: "episodeNumber",
        opciones: ["—", "1", "12"],
        inicial: "12",
      },
    ],
    fondo: "suave",
    nota: "Datos de ejemplo. En la app, el episodio llega de /api/podcasts.",
    render: (v) => (
      <div className="max-w-sm">
        <PodcastCard
          podcast={{
            ...POST_EJEMPLO,
            featuredImage: v.imagen ? POST_EJEMPLO.featuredImage : "",
          }}
          episodeNumber={v.episodio === "—" ? undefined : Number(v.episodio)}
        />
      </div>
    ),
    codigo: (v) =>
      `<PodcastCard podcast={episodio}${v.episodio === "—" ? "" : ` episodeNumber={${texto(v.episodio)}}`} />`,
  },
  "contenido-reciente": {
    nota: "Usa la API real (/api/posts y /api/podcasts). Si falla, el bloque desaparece: es el comportamiento esperado.",
    render: () => <ContenidoReciente />,
    codigo: () => `<ContenidoReciente />`,
  },
  "form-suscripcion": {
    controles: [
      {
        tipo: "opciones",
        clave: "variante",
        etiqueta: "variante",
        opciones: ["compacto", "completo"],
        inicial: "compacto",
      },
      {
        tipo: "opciones",
        clave: "tono",
        etiqueta: "tono",
        opciones: ["claro", "noche"],
        inicial: "claro",
      },
    ],
    fondo: (v): Fondo => (v.tono === "noche" ? "noche" : "blanco"),
    nota: "En el catálogo el envío está desactivado: no se da de alta ningún correo.",
    render: (v) => (
      // Bloquea el submit en captura: el onSubmit del formulario nunca llega a
      // correr, así que no hay POST a /api/suscripcion desde el catálogo.
      <div
        className="max-w-xl"
        onSubmitCapture={(evento) => {
          evento.preventDefault();
          evento.stopPropagation();
        }}
      >
        <FormSuscripcion
          origen="home"
          variante={texto(v.variante) as "compacto" | "completo"}
          tono={texto(v.tono) as "claro" | "noche"}
        />
      </div>
    ),
    codigo: (v) =>
      `<FormSuscripcion origen="…" variante="${texto(v.variante)}"${v.tono === "noche" ? ' tono="noche"' : ""} />`,
  },
};
```

`client/src/catalogo/demos.ts` pasa a:

```ts
import { DEMOS_PROPIOS } from "./demos-propios";
import type { Demo } from "./tipos";

/** Demo de un componente por id. El Task 5 añade las de shadcn/ui. */
const DEMOS: Partial<Record<string, Demo>> = { ...DEMOS_PROPIOS };

export function demoDe(id: string): Demo | undefined {
  return DEMOS[id];
}
```

- [ ] **Step 3: Puertas, navegador y commit**

```bash
npm run check && npm run lint && npx prettier --write client/src/catalogo && npm test && npm run build
```

`npm run check` es la prueba de exhaustividad: si falta la demo de un id con `vista: "demo"` que no sea `ui`, no compila.

En `/componentes` (dev en 5001): cada control cambia la demo y el código; el formulario, con datos válidos y «Suscribirme», **no** hace `POST /api/suscripcion` (pestaña Red).

```bash
git add client/src/catalogo
git commit -m "Demos con controles y código de los componentes propios en /componentes"
```

---

### Task 5: Demos de shadcn/ui y la regla «reutiliza antes de crear»

**Files:**

- Create: `client/src/catalogo/demos-ui.tsx`
- Modify: `client/src/catalogo/demos.ts`, `CLAUDE.md`, `docs/design-guidelines.md`, `docs/architecture.md`

**Interfaces:**

- Consumes: `IdDemoUi` (Task 1), `demos.ts` (Task 4).
- Produces: `DEMOS_UI: Record<IdDemoUi, Demo>`.

- [ ] **Step 1: Demos de ui**

`client/src/catalogo/demos-ui.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import type { IdDemoUi } from "./registro";
import type { Demo, Fondo } from "./tipos";

type VarianteBoton = "default" | "secondary" | "outline" | "ghost" | "destructive";
type TamanoBoton = "default" | "sm" | "lg" | "icon";

export const DEMOS_UI: Record<IdDemoUi, Demo> = {
  button: {
    controles: [
      {
        tipo: "opciones",
        clave: "variant",
        etiqueta: "variant",
        opciones: ["secondary", "outline", "default", "ghost", "destructive"],
        inicial: "secondary",
      },
      {
        tipo: "opciones",
        clave: "size",
        etiqueta: "size",
        opciones: ["default", "sm", "lg"],
        inicial: "default",
      },
      {
        tipo: "texto",
        clave: "texto",
        etiqueta: "texto",
        inicial: "Únete a la comunidad",
      },
      { tipo: "interruptor", clave: "disabled", etiqueta: "disabled", inicial: false },
    ],
    render: (v) => (
      <Button
        variant={String(v.variant) as VarianteBoton}
        size={String(v.size) as TamanoBoton}
        disabled={Boolean(v.disabled)}
        className="min-h-11 px-6"
      >
        {String(v.texto)}
      </Button>
    ),
    codigo: (v) =>
      `<Button variant="${String(v.variant)}"${v.size !== "default" ? ` size="${String(v.size)}"` : ""}${v.disabled ? " disabled" : ""} className="min-h-11 px-6">\n  ${String(v.texto)}\n</Button>`,
  },
  badge: {
    controles: [
      {
        tipo: "opciones",
        clave: "variant",
        etiqueta: "variant",
        opciones: ["default", "secondary", "outline", "destructive"],
        inicial: "secondary",
      },
    ],
    render: (v) => (
      <Badge
        variant={String(v.variant) as "default" | "secondary" | "outline" | "destructive"}
      >
        Episodio 12
      </Badge>
    ),
    codigo: (v) => `<Badge variant="${String(v.variant)}">Episodio 12</Badge>`,
  },
  card: {
    fondo: "suave",
    render: () => (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Título de la tarjeta</CardTitle>
          <CardDescription>Descripción breve.</CardDescription>
        </CardHeader>
        <CardContent>Contenido.</CardContent>
      </Card>
    ),
    codigo: () =>
      `<Card>\n  <CardHeader>\n    <CardTitle>…</CardTitle>\n    <CardDescription>…</CardDescription>\n  </CardHeader>\n  <CardContent>…</CardContent>\n</Card>`,
  },
  input: {
    controles: [
      {
        tipo: "texto",
        clave: "placeholder",
        etiqueta: "placeholder",
        inicial: "tu@correo.org",
      },
      { tipo: "interruptor", clave: "disabled", etiqueta: "disabled", inicial: false },
    ],
    render: (v) => (
      <div className="max-w-sm space-y-1">
        <label htmlFor="demo-input" className="text-sm font-semibold">
          Correo electrónico
        </label>
        <Input
          id="demo-input"
          type="email"
          placeholder={String(v.placeholder)}
          disabled={Boolean(v.disabled)}
          className="min-h-11"
        />
      </div>
    ),
    codigo: (v) =>
      `<label htmlFor="correo">Correo electrónico</label>\n<Input id="correo" type="email" placeholder="${String(v.placeholder)}"${v.disabled ? " disabled" : ""} />`,
  },
  collapsible: {
    render: () => (
      <Collapsible className="max-w-md rounded-xl border border-border">
        <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between px-4 font-medium">
          Recursos
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 text-muted-foreground">
          Blog · Podcast · Mapa de Ruta
        </CollapsibleContent>
      </Collapsible>
    ),
    codigo: () =>
      `<Collapsible>\n  <CollapsibleTrigger>Recursos</CollapsibleTrigger>\n  <CollapsibleContent>…</CollapsibleContent>\n</Collapsible>`,
  },
  tooltip: {
    render: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Más información">
            <Info aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ayuda breve; nunca información imprescindible.</TooltipContent>
      </Tooltip>
    ),
    codigo: () =>
      `<Tooltip>\n  <TooltipTrigger asChild>\n    <Button variant="outline" size="icon" aria-label="Más información"><Info aria-hidden="true" /></Button>\n  </TooltipTrigger>\n  <TooltipContent>…</TooltipContent>\n</Tooltip>`,
  },
  toast: {
    controles: [
      { tipo: "texto", clave: "titulo", etiqueta: "title", inicial: "Enlace copiado" },
    ],
    render: (v) => (
      <Button
        variant="outline"
        className="min-h-11"
        onClick={() =>
          toast({
            title: String(v.titulo),
            description: "Aviso de ejemplo del catálogo.",
          })
        }
      >
        Lanzar toast
      </Button>
    ),
    codigo: (v) =>
      `import { toast } from "@/hooks/use-toast";\n\ntoast({ title: "${String(v.titulo)}", description: "…" });`,
  },
};

/** Para que TypeScript no marque Fondo como import sin uso si ninguna demo lo necesita. */
export type { Fondo };
```

> Si `IdDemoUi` incluye un id sin demo aquí (o al revés), `npm run check` falla: ajusta la demo, no el tipo. Quita el `export type { Fondo }` si el lint lo considera innecesario.

En `demos.ts`: `import { DEMOS_UI } from "./demos-ui";` y `const DEMOS = { ...DEMOS_PROPIOS, ...DEMOS_UI };`.

- [ ] **Step 2: La regla en `CLAUDE.md`**

Añade, tras «### shadcn/ui»:

```markdown
### Componentes: reutiliza antes de crear

El catálogo está en `client/src/catalogo/registro.ts` y se ve en
`/componentes` (pública, noindex, sin enlace en el menú). Antes de crear un
componente o una vista:

1. Busca en `registro.ts` (`usarCuando`, `evitarPara`) uno que ya lo resuelva.
   Reutilízalo; si le falta una variante, añádela al existente.
2. Estilos que se repiten: `client/src/lib/clases.ts`. No copies cadenas de
   clases (un test lo impide para las que ya están ahí).
3. Si hace falta uno nuevo: créalo en la carpeta de su categoría, regístralo
   (`registro.test.ts` falla si no) y, si su `vista` es `"demo"`, añade su demo
   en `client/src/catalogo/demos-*.tsx` (TypeScript lo exige).
4. Un componente que deja de usarse se borra: el mismo test lo detecta.
```

En `docs/design-guidelines.md`, bajo «## Componentes y espaciado», una línea: «Catálogo vivo con demos y código: `/componentes` (fuente: `client/src/catalogo/registro.ts`). Clases compartidas: `client/src/lib/clases.ts`.»

En `docs/architecture.md`, añade `/componentes` a la tabla de rutas («catálogo interno, noindex»).

- [ ] **Step 3: Puertas y commit**

```bash
npm run check && npm run lint && npx prettier --write client/src/catalogo CLAUDE.md docs && npm test && npm run build
git add client/src/catalogo CLAUDE.md docs/design-guidelines.md docs/architecture.md
git commit -m "Demos de shadcn/ui en el catálogo y regla «reutiliza antes de crear» en CLAUDE.md"
```

---

### Task 6: Verificación final e integración

**Files:** ninguno nuevo; lo que esta pasada encuentre se corrige con commit propio.

- [ ] **Step 1: Puertas completas** — `npm run check && npm run lint && npx prettier --check client server docs scripts CLAUDE.md && npm test && npm run build`. Esperado: verde; prerender de 11 rutas.
- [ ] **Step 2: Oculta de verdad** — `grep -c noindex dist/public/componentes.html` → 1; `grep -c componentes dist/public/sitemap.xml` → 0; `grep -rn '"/componentes"' client/src/lib/navegacion.ts` → sin resultados.
- [ ] **Step 3: Navegador (`PORT=5002 npm start`)** a 375 y 1280 px: sin scroll horizontal; cada control cambia su demo; «Copiar» copia; el formulario no hace `POST /api/suscripcion`; 0 errores en consola; hidratación sin avisos `[hidratación]`.
- [ ] **Step 4: axe** en `/componentes` (mismas etiquetas que la pasada de la Etapa 1). Esperado: 0 violaciones graves o críticas; se aceptan `heading-order`/`page-has-heading-one` múltiples por la demo de `HeroInstitucional` (K6) y el focus proxy de Radix. Cualquier otra se corrige.
- [ ] **Step 5: Integrar** —

```bash
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/k-catalogo -m "Catálogo de componentes y estilos en /componentes, con registro que obliga a reutilizar"
```

Sin `git push`.
