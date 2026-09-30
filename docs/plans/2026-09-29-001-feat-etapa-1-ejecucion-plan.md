---
title: Plan de ejecución de la Etapa 1 — aterrizado sobre el repositorio
type: feat
status: active
date: 2026-09-29
spec: docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
---

# Etapa 1 institucional — Plan de ejecución

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ejecutar la Etapa 1 del plan institucional reutilizando lo que ya existe en el repositorio (marca, tipografía, colores, logotipos, header, footer y navegación) en lugar de construirlo de nuevo.

**Architecture:** El plan de origen se escribió fuera del repo, con los requerimientos del equipo. Este documento hace tres cosas: (1) inventaría lo que ya existe y dice qué se reutiliza tal cual, qué evoluciona y qué falta; (2) corrige los puntos del plan de origen que chocan con el código; (3) detalla a nivel de tarea el **PR A (Cimientos)**. Los PR B a F quedan como hoja de ruta: cada uno recibe su plan detallado justo antes de ejecutarse, porque dependen de decisiones que cierran el 2 oct y del código que deje el PR anterior.

**Tech Stack:** React 18 + Vite 5 + TypeScript 5.6, Tailwind 3 + shadcn/ui (new-york), wouter 3.3, TanStack Query 5, framer-motion 11, lucide-react, Vitest 3 (entorno `node`), Express 4 / función serverless de Vercel.

**Spec:** `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md` (en adelante, "el plan de origen"). Quien ejecute lee los dos.

## Global Constraints

- `CLAUDE.md` manda sobre este plan y sobre el plan de origen.
- Toda la UI y los comentarios de código, en español. Los identificadores siguen el idioma del repo (`esRutaActiva`, `NAVEGACION`, `Proximamente`): en español.
- Nada llega a `main`. Las ramas de cada PR salen de `feat/etapa-1-institucional` y vuelven a ella; `feat/etapa-1-institucional` sale de `staging`.
- **Solo commits locales. Nunca `git push` salvo que Antonio lo pida explícitamente.**
- Puertas antes de cerrar cada tarea: `npm run check`, `npm run lint`, `npm run format:check`, `npm test`. Antes de cerrar cada PR, además `npm run build` y la revisión en el navegador a 375, 768, 1024 y 1440 px.
- Servidor de desarrollo: el puerto 5000 suele estar ocupado. En PowerShell: `$env:PORT=5001; npm run dev`. En Git Bash: `PORT=5001 npm run dev`. Si aparece `EADDRINUSE`, no se mata ningún proceso.
- Ningún token de color existente cambia de valor. Solo se añaden `--brand-noche`, `--miel-texto` y `--fondo-suave`.
- Tipografía: Montserrat 400–800, cargada ya desde Google Fonts en `client/index.html`. No se añade otra familia.
- No se inventa copy institucional. Lo que falte va como `// PENDIENTE:` en el código, nunca como texto inventado.
- Componentes de shadcn nuevos: con su CLI (`components.json` ya está configurado), nunca copiados a mano.
- `data-testid` en todo elemento interactivo o significativo.
- `client/src/**` solo importa **tipos** de `@shared/wordpress/`.

## Review Focus

1. **Enlace del menú con ancla o consulta** (`/que-hacemos#tecnologia`, `/blog?pagina=2`): debe contar como ruta existente si existe la ruta base. Si no, el test de enlaces muertos bloqueará los enlaces a los pilares de RF-08. Lo cubre el Task 1 (`rutas.test.ts`, «ignora el ancla y la consulta»).
2. **Barra final o segmentos extra** (`/blog/`, `/blog/a/b`, `/blogosfera`): no deben pasar por rutas existentes. Si pasaran, el test daría por buena una ruta que wouter manda al 404. Task 1.
3. **Añadir una ruta a `rutas.ts` sin su página** (o al revés): debe fallar el typecheck, no aparecer como pantalla en blanco. Task 1, garantizado por el tipo `Record<RutaEstatica, ComponentType>`.
4. **`registrarEvento` fuera del navegador** (test en `node`, y más adelante el prerender del PR B): no puede lanzar excepción, porque rompería el render. Task 5 («no falla sin `window`»).
5. **Nombre de marca distinto entre `<title>` y pie**: es el mismo defecto que el plan de origen encontró (tres nombres distintos). Task 3 («el título de index.html usa el nombre de marca»).

---

## 1. Inventario: qué ya existe y qué se hace con ello

Este es el hueco del plan de origen. Todo lo de esta tabla se **reutiliza**; nada se redibuja desde cero.

### 1.1 Marca y activos

| Pieza                      | Dónde está                                                                     | Qué hay                                                                                        | Decisión                                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logotipo para fondo claro  | `client/src/assets/ASPAL-para fondo claro_1763675327795.png` (1500×429)        | Panal de 4 hexágonos + "Aspal" en azul noche                                                   | Se reutiliza tal cual en el header y el pie (ya lo hacen)                                                                                                                                           |
| Logotipo para fondo oscuro | `client/src/assets/ASPAL-para fondo oscuro_1763675345456.png` (1500×429)       | Versión clara                                                                                  | **Nuevo uso:** hero, banda final y franja inferior del pie sobre fondo noche. Hoy solo se usa con `dark:`, que nunca se activa (ver 1.2)                                                            |
| Isotipo (panal)            | `client/src/assets/Aspal-Icono_1763675356866.png` (1500×1877)                  | Los 4 hexágonos                                                                                | Silueta de las tarjetas de perfil sin foto (plan de origen §6.4). Hoy no se usa en ningún sitio                                                                                                     |
| Favicon                    | `client/public/favicon.png` (128×128)                                          | Isotipo                                                                                        | Se queda. El Open Graph del PR B necesita una imagen propia de 1200×630                                                                                                                             |
| Motivo hexagonal           | `HexagonNetwork` en `client/src/components/sections/CommunityGraphics.tsx:158` | SVG del panal                                                                                  | Fondo semitransparente del hero, de la banda «Únete a la casa común» y de la Ruta 2026–2030                                                                                                         |
| Logos de aliados           | `client/src/assets/Recurso 5{0,2,3}comunidad ASPAL_*.png`                      | ANPR México (50), Expo Mascotas (52), World Urban Parks (53), en gris y a unos 240 px de ancho | ANPR y WUP sirven para `MuroAliados`. **Expo Mascotas no es aliado fundador** y se queda solo en `/plataforma`. **Falta el logo de Parksys.** Hacen falta versiones en alta (insumo de la semana 0) |
| Ilustraciones de producto  | `client/src/assets/recurso-*.png`, `generated_images/*` (0.6–1.1 MB)           | Material SaaS                                                                                  | Se quedan en `/plataforma`. Ninguna entra en páginas institucionales                                                                                                                                |
| `Montserrat-Regular_*.otf` | `client/src/assets/`                                                           | Archivo de fuente                                                                              | No lo importa nadie: la fuente llega de Google Fonts. Se deja y no se usa                                                                                                                           |

**Colores del logotipo, medidos sobre el PNG:** miel `#FCC760`, azul noche `#112738`, contorno `#1F2B3B`. El `--secondary` del sitio (`#F9CC62`) es casi el mismo miel. `#112738` es exactamente el `--brand-noche` que propone el plan de origen, así que ese token nuevo sale del logo, no de la lámina 16.

**Nota sobre D3 (tipografía):** el wordmark «Aspal» del logotipo está dibujado en una geométrica tipo Poppins. Probablemente de ahí viene la propuesta Poppins del Concepto NOSOTROS. El logo es una imagen, así que no choca con usar Montserrat en el texto. Se mantiene Montserrat, como recomienda el plan.

### 1.2 Sistema visual en código

| Pieza                            | Dónde                                                                         | Estado real                                                                                                                                                         | Decisión                                                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Pizarra `--primary`              | `client/src/index.css`                                                        | `206 31% 20%` = `#233543`                                                                                                                                           | Se queda (sin cambios)                                                                                                        |
| Miel `--secondary`               | `index.css`                                                                   | `42 93% 68%` = `#F9CC62`, texto encima `--secondary-foreground` pizarra                                                                                             | Se queda. Es el botón Únete (`<Button variant="secondary">`)                                                                  |
| `--accent`                       | `index.css`                                                                   | `42 93% 94%` = `#FEF5E1`                                                                                                                                            | Se queda                                                                                                                      |
| `--muted-foreground`             | `index.css`                                                                   | `206 15% 40%` = `#576875`                                                                                                                                           | Se queda                                                                                                                      |
| Contrastes del plan de origen §4 | —                                                                             | **Verificados:** blanco/pizarra 12.64, pizarra/miel 8.33, miel/noche 10.09, blanco/noche 15.32, miel-texto/blanco 5.37, pizarra/fondo-suave 11.89, gris/blanco 5.77 | El Task 4 los fija en un test                                                                                                 |
| Modo oscuro                      | Variables `.dark` + clases `dark:`                                            | **No hay nada que active `.dark`**: el sitio es solo claro                                                                                                          | Los tokens nuevos se definen solo en `:root`. No se añaden variantes `dark:` en código nuevo                                  |
| Montserrat 400–800               | `client/index.html` (Google Fonts) + `--font-sans`                            | Funciona                                                                                                                                                            | Se queda. La escala del plan (H1 48–64, cuerpo 18 px) se aplica con utilidades de Tailwind en los componentes nuevos          |
| Sistema de elevación             | `hover-elevate` / `active-elevate-2` en `index.css`                           | Es el hover neutro de la casa (el header ya lo usa)                                                                                                                 | Las tarjetas nuevas lo usan en lugar de inventar sombras                                                                      |
| Movimiento reducido              | `MotionConfig reducedMotion="user"` en `App.tsx` + media query en `index.css` | Funciona                                                                                                                                                            | Se hereda. Además, regla nueva: en páginas nuevas no se anima la opacidad del contenido (plan de origen §8, por el prerender) |
| Guía de diseño                   | `docs/design-guidelines.md`                                                   | **Obsoleta** (Inter, morado, glassmorphism)                                                                                                                         | Se reescribe en el Task 6 a partir de este inventario                                                                         |

### 1.3 Navegación, layout y páginas

| Pieza                                               | Dónde                                | Estado real (rama `feat/navbar-footer`, 6 commits sobre `staging`)                                                                                                                                        | Decisión                                                                                                                                                     |
| --------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `navegacion.ts`                                     | `client/src/lib/`                    | Fuente única de header y pie. `DestinoNav` con `descripcion`, `icono`, `href?`, `externo?`, patrón «Próximamente». 3 entradas: Aprende · Comunidad · Bolsa de Trabajo. Tests en `navegacion.test.ts`      | **Evoluciona** en el PR C: 6 rubros y `grupos` para el mega-menú. No se tira                                                                                 |
| `Header.tsx`                                        | `components/layout/`                 | Radix NavigationMenu, desplegables con icono y descripción, ruta activa con subrayado miel + peso + `aria-current`, panel móvil en portal con foco atrapado, Escape, bloqueo de scroll y Únete fijo abajo | **Evoluciona** en el PR C. RF-03 y la mitad de RF-04 **ya están hechos**. Cambia el corte a escritorio de `md` (768) a `lg` (1024), porque 6 rubros no caben |
| `Footer.tsx`                                        | `components/layout/`                 | Columnas derivadas de `NAVEGACION`, contacto accionable, 4 redes y botón Únete                                                                                                                            | **Evoluciona** en el PR C: fila de boletín, 5 columnas, YouTube y barra legal. Redes y contacto pasan a `marca.ts` en el Task 3                              |
| `Proximamente`                                      | `components/layout/Proximamente.tsx` | Etiqueta de sección no construida                                                                                                                                                                         | Se reutiliza en el menú y en `PaginaProximamente` (`/eventos`)                                                                                               |
| `NotFound`                                          | `pages/not-found.tsx`                | 404 en español, con header, pie y salidas                                                                                                                                                                 | Se reutiliza. El PR B hace que además responda **código** 404                                                                                                |
| `BlogCard` / `PodcastCard`                          | `components/content/`                | Tarjetas ya conectadas a `TransformedPost`                                                                                                                                                                | Bloque «Contenido reciente» de la home (PR F)                                                                                                                |
| `ErrorBoundary`, `ScrollRestoration`, `ScrollToTop` | `components/layout/`                 | Funcionan                                                                                                                                                                                                 | Sin cambios                                                                                                                                                  |
| shadcn en uso                                       | `components/ui/`                     | avatar, badge, button, card, collapsible, input, navigation-menu, toast, tooltip                                                                                                                          | El formulario de suscripción necesitará `label` y `checkbox` (y quizá `select`), vía CLI                                                                     |
| Home actual                                         | `pages/home.tsx`                     | 100% SaaS, contadores falsos «500+ / 50,000+» en `HeroSection.tsx`                                                                                                                                        | Se muda **intacta** a `/plataforma` (Task 1). Los contadores se retiran ya (Task 2)                                                                          |
| Únete                                               | `URL_REGISTRO` (MemberPress externo) | Funciona                                                                                                                                                                                                  | Pasa a `/unete` **en el mismo PR que crea `/unete`** (PR E), nunca antes: el test de enlaces muertos lo impediría                                            |

## 2. Correcciones al plan de origen

1. **Header y footer no parten de cero.** El PR C evoluciona los componentes de `feat/navbar-footer`. Por eso esa rama se integra antes que nada (Task 0).
2. **Un solo orden de PRs:** el de la §12 (A–F). El de la §8 (7 PRs) queda sin efecto.
3. **Desaparece el «PR D — Componentes».** Cada componente nuevo se crea en el PR de la primera página que lo usa: `Banda`, `HeroInstitucional`, `PilarCard`, `TarjetaCompromiso`, `RutaTimeline`, `MuroAliados` y `SubnavSeccion` en «Nosotros»; `PerfilCard` en «Equipo»; `FormSuscripcion` y `PaginaProximamente` en «Únete». Diseñarlos sin una página que los use obliga a adivinar sus props y no se pueden revisar en el preview.
4. **Fuera el «límite por IP»** del endpoint de suscripción. En serverless un contador en memoria no se comparte entre instancias, y cualquier otra opción es estado de servidor, que `CLAUDE.md` pide no improvisar. Queda el campo trampa + la doble confirmación del proveedor. El endpoint sigue necesitando la aprobación explícita de Antonio (D8).
5. **Aliados:** Expo Mascotas no es fundador, y el logo de Parksys no existe en el repo.
6. **`CLAUDE.md` tiene datos obsoletos que confunden a los agentes:** el alias `@assets/` apunta a `client/src/assets/`, no a `attached_assets/`. Y la frase «`home.tsx` no consume la API» dejará de ser cierta en el PR F. Se corrige el alias en el Task 6; la frase, en el PR F.
7. **`docs/architecture.md` contradice a `CLAUDE.md`** en la degradación de errores de WordPress (dice que se devuelve lista vacía). Se corrige en el Task 6.

## 3. Hoja de ruta de PRs

| PR    | Contenido                                                                                                                               | Reutiliza                                                       | Espera a                                                                                                                                      | Plan detallado                                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 0     | Integrar `feat/navbar-footer` en `staging` y crear la rama de la etapa                                                                  | —                                                               | —                                                                                                                                             | Task 0 (abajo)                                                                                                             |
| **A** | Cimientos: `rutas.ts` + test de enlaces muertos, `/plataforma`, cifras falsas fuera, `marca.ts`, tokens, `analitica.ts`, guía de diseño | Todo lo de §1                                                   | Nadie                                                                                                                                         | **Tasks 1–7 (abajo)**                                                                                                      |
| B     | SEO por ruta (`Seo`), prerender, `sitemap.xml`, `robots.txt`, 404 real en Vercel                                                        | `rutas.ts` (A), `marca.ts` (A), `NotFound`                      | Nadie. Es el mayor riesgo técnico: si el prerender choca con wouter o framer-motion, se aplica el plan B de la §10 del origen (solo `<head>`) | Se escribe al cerrar A. Punto de partida verificado: wouter 3.3.5 admite `<Router ssrPath>` para renderizar en el servidor |
| C     | Menú de 6 rubros + mega-menú Recursos + footer institucional                                                                            | `Header`, `Footer`, `navegacion.ts`, `Proximamente`, `marca.ts` | D1, D2, D10: se construye con la recomendación                                                                                                | Se escribe al cerrar B                                                                                                     |
| E     | `/nosotros`, `/que-hacemos`, `/nuestro-equipo`, `/unete` + `/api/suscripcion` en `shared/suscripcion/`, `/eventos`                      | `HexagonNetwork`, isotipo, logos de aliados, tokens, `Button`   | D6, D7 y D8 (**Antonio aprueba antes de tocar la API**), clave y lista de Mailchimp                                                           | Uno por página, al llegar                                                                                                  |
| F     | Home institucional + `/mapa-de-ruta`, imágenes en WebP/AVIF                                                                             | `BlogCard`, `PodcastCard`, logo para fondo oscuro               | Fotos, contenido de las 7 etapas, D9                                                                                                          | Al llegar                                                                                                                  |

---

## 4. Tareas

### Task 0: Integrar `feat/navbar-footer` y preparar las ramas

**Files:**

- Commit: `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md` (hoy sin versionar), `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md`

**Interfaces:**

- Consumes: —
- Produces: rama `feat/etapa-1-institucional` (desde `staging` con el header y el footer nuevos) y rama de trabajo `etapa1/a-cimientos`.

- [ ] **Step 1: Pasar las puertas en `feat/navbar-footer`**

```bash
git switch feat/navbar-footer
npm run check && npm run lint && npm run format:check && npm test && npm run build
```

Expected: todo en verde. Si algo falla, **detente** y avisa: no se integra una rama roja.

- [ ] **Step 2: Integrar en `staging` (local, sin push)**

```bash
git switch staging
git merge --no-ff feat/navbar-footer -m "Integrar el rediseño del header y el pie"
```

Los archivos sin versionar de `docs/plans/` viajan con el cambio de rama sin conflicto.

- [ ] **Step 3: Crear la rama de la etapa y versionar los dos planes**

```bash
git switch -c feat/etapa-1-institucional
git add docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md
git commit -m "Añadir el plan de la Etapa 1 y su plan de ejecución sobre el repo"
```

- [ ] **Step 4: Abrir la rama del PR A**

```bash
git switch -c etapa1/a-cimientos
```

---

### Task 1: Fuente única de rutas, test de enlaces muertos y `/plataforma`

**Files:**

- Create: `client/src/lib/rutas.ts`
- Create: `client/src/lib/rutas.test.ts`
- Modify: `client/src/lib/navegacion.test.ts` (nuevo `it` en «catálogo de navegación»)
- Rename: `client/src/pages/home.tsx` → `client/src/pages/plataforma.tsx` (función `Home` → `Plataforma`)
- Modify: `client/src/App.tsx`

**Interfaces:**

- Consumes: `NAVEGACION`, `DestinoNav` de `@/lib/navegacion`.
- Produces:
  - `RUTAS_ESTATICAS: readonly ["/", "/blog", "/podcast", "/plataforma"]`
  - `type RutaEstatica = (typeof RUTAS_ESTATICAS)[number]`
  - `RUTAS_DINAMICAS: readonly ["/blog/:slug"]`
  - `type RutaDinamica = (typeof RUTAS_DINAMICAS)[number]`
  - `esRutaConocida(href: string): boolean`
  - Página `Plataforma` (default export de `@/pages/plataforma`).
  - Los PR B, C y E añaden rutas **solo** aquí y en el `PAGINAS` de `App.tsx`.

- [ ] **Step 1: Escribir el test de `rutas.ts`**

`client/src/lib/rutas.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { RUTAS_ESTATICAS, esRutaConocida } from "./rutas";

describe("esRutaConocida", () => {
  it("conoce cada ruta estática", () => {
    for (const ruta of RUTAS_ESTATICAS) {
      expect(esRutaConocida(ruta), ruta).toBe(true);
    }
  });

  it("acepta un artículo del blog por su slug", () => {
    expect(esRutaConocida("/blog/el-poder-del-podcasting")).toBe(true);
  });

  it("rechaza una ruta que todavía no existe", () => {
    expect(esRutaConocida("/nosotros")).toBe(false);
  });

  it("ignora el ancla y la consulta", () => {
    // Los pilares se enlazan como /que-hacemos#tecnologia: existe si existe la página.
    expect(esRutaConocida("/podcast#ultimo")).toBe(true);
    expect(esRutaConocida("/blog?pagina=2")).toBe(true);
  });

  it("no confunde prefijos, barras finales ni segmentos de más", () => {
    expect(esRutaConocida("/blogosfera")).toBe(false);
    expect(esRutaConocida("/blog/")).toBe(false);
    expect(esRutaConocida("/blog/a/b")).toBe(false);
  });

  it("no da por interna una URL externa ni una vacía", () => {
    expect(esRutaConocida("https://comunidad.asociacionesprofesionales.org/")).toBe(
      false,
    );
    expect(esRutaConocida("")).toBe(false);
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/rutas.test.ts`
Expected: FAIL — `Failed to resolve import "./rutas"`.

- [ ] **Step 3: Implementar `rutas.ts`**

`client/src/lib/rutas.ts`:

```ts
/**
 * Fuente única de las rutas que existen en el sitio.
 *
 * La consumen `App.tsx` (qué página pinta cada ruta) y el test de navegación
 * (ningún enlace del menú puede apuntar a una ruta que no existe); después la
 * usarán también el prerender y el sitemap. Si una ruta no está aquí, no
 * existe.
 *
 * Existe porque el menú llegó a prometer doce destinos de los que diez no
 * llevaban a ningún sitio, y nada lo detectaba.
 */

/** Rutas sin parámetros. Cada una tiene su página en `App.tsx`. */
export const RUTAS_ESTATICAS = ["/", "/blog", "/podcast", "/plataforma"] as const;
export type RutaEstatica = (typeof RUTAS_ESTATICAS)[number];

/** Rutas con parámetros, en la sintaxis de wouter. */
export const RUTAS_DINAMICAS = ["/blog/:slug"] as const;
export type RutaDinamica = (typeof RUTAS_DINAMICAS)[number];

/** Compara segmento a segmento; un `:parámetro` acepta cualquier valor no vacío. */
function coincidePatron(patron: string, ruta: string): boolean {
  const esperados = patron.split("/");
  const recibidos = ruta.split("/");
  return (
    esperados.length === recibidos.length &&
    esperados.every((segmento, i) =>
      segmento.startsWith(":") ? recibidos[i] !== "" : segmento === recibidos[i],
    )
  );
}

/**
 * ¿Lleva este enlace interno a una página que existe?
 *
 * Se ignoran `#ancla` y `?consulta`: `/que-hacemos#tecnologia` existe si
 * existe `/que-hacemos`. La barra final no se normaliza: `/blog/` no es una
 * forma canónica y no debe aparecer en el menú.
 */
export function esRutaConocida(href: string): boolean {
  const ruta = href.split(/[?#]/)[0];
  return (
    (RUTAS_ESTATICAS as readonly string[]).includes(ruta) ||
    RUTAS_DINAMICAS.some((patron) => coincidePatron(patron, ruta))
  );
}
```

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run client/src/lib/rutas.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Añadir el test de enlaces muertos a `navegacion.test.ts`**

En el import de la cabecera añade `import { esRutaConocida } from "./rutas";`. Dentro de `describe("catálogo de navegación", …)`, como primer `it`:

```ts
it("no enlaza ninguna ruta interna que no exista", () => {
  // RF-01 del plan de la Etapa 1: un enlace interno del menú sin página es
  // un fallo de CI, no algo que se descubre haciendo clic.
  const internos = [...NAVEGACION, ...destinos]
    .map((e) => e.href)
    .filter((href): href is string => href !== undefined && !href.startsWith("http"));
  expect(internos.filter((href) => !esRutaConocida(href))).toEqual([]);
});
```

- [ ] **Step 6: Comprobar que el test muerde**

Cambia temporalmente el `href` de Blog en `navegacion.ts` de `"/blog"` a `"/blogg"`.
Run: `npx vitest run client/src/lib/navegacion.test.ts`
Expected: FAIL con `expected [ '/blogg' ] to deeply equal []`.
Deshaz el cambio y vuelve a ejecutarlo. Expected: PASS.

- [ ] **Step 7: Mudar la home a `/plataforma`**

```bash
git mv client/src/pages/home.tsx client/src/pages/plataforma.tsx
```

En `client/src/pages/plataforma.tsx`, cambia `export default function Home() {` por:

```tsx
/**
 * Contenido de producto (la plataforma SaaS para asociaciones). Era la home
 * hasta la Etapa 1; se mudó intacto aquí para dejar la raíz a la home
 * institucional. Se reubica al subdominio en la Etapa 3.
 */
export default function Plataforma() {
```

- [ ] **Step 8: Cablear `App.tsx` contra `rutas.ts`**

Sustituye `import Home from "@/pages/home";` por `import Plataforma from "@/pages/plataforma";`, añade:

```tsx
import type { ComponentType } from "react";
import {
  RUTAS_DINAMICAS,
  RUTAS_ESTATICAS,
  type RutaDinamica,
  type RutaEstatica,
} from "@/lib/rutas";
```

y reemplaza la función `Router` por:

```tsx
/**
 * Una página por cada ruta de `rutas.ts`. El tipo `Record` hace que añadir una
 * ruta sin su página (o una página sin su ruta) no compile.
 */
const PAGINAS: Record<RutaEstatica, ComponentType> = {
  // PENDIENTE (PR F): "/" pasa a la home institucional. Hasta entonces sirve el
  // mismo contenido de producto que /plataforma.
  "/": Plataforma,
  "/blog": Blog,
  "/podcast": Podcast,
  "/plataforma": Plataforma,
};

const PAGINAS_DINAMICAS: Record<RutaDinamica, ComponentType> = {
  "/blog/:slug": BlogPost,
};

function Router() {
  return (
    <Switch>
      {RUTAS_ESTATICAS.map((ruta) => (
        <Route key={ruta} path={ruta} component={PAGINAS[ruta]} />
      ))}
      {RUTAS_DINAMICAS.map((ruta) => (
        <Route key={ruta} path={ruta} component={PAGINAS_DINAMICAS[ruta]} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}
```

(`Switch` de wouter 3.3.5 aplana arrays de hijos: `flattenChildren` en `node_modules/wouter/esm/index.js`.)

- [ ] **Step 9: Puertas**

```bash
npx prettier --write client/src/lib/rutas.ts client/src/lib/rutas.test.ts client/src/lib/navegacion.test.ts client/src/App.tsx client/src/pages/plataforma.tsx
npm run check && npm run lint && npm run format:check && npm test
```

Expected: todo en verde.

- [ ] **Step 10: Ver que funciona**

`$env:PORT=5001; npm run dev` (PowerShell) y abre `http://localhost:5001/`, `/plataforma`, `/blog`, `/blog/<un slug real>` y `/nosotros`. Expected: las cuatro primeras renderizan su página (`/` y `/plataforma` iguales); `/nosotros`, el 404 en español. Espera o haz scroll antes de concluir que algo está en blanco: las secciones entran con framer-motion.

- [ ] **Step 11: Commit**

```bash
git add client/src/lib/rutas.ts client/src/lib/rutas.test.ts client/src/lib/navegacion.test.ts client/src/App.tsx client/src/pages/plataforma.tsx
git commit -m "Centralizar las rutas, prohibir enlaces muertos en el menú y mudar la home a /plataforma"
```

---

### Task 2: Retirar las cifras no verificables del hero

El plan de origen (§2) pide retirarlas ya: el hero dice «500+ asociaciones activas» y «50,000+ miembros», y el Excel reporta unos 120 suscriptores y 0 miembros de pago.

**Files:**

- Modify: `client/src/components/sections/HeroSection.tsx`
- Delete: `client/src/hooks/use-animated-counter.ts` (su único consumidor es este hero)

**Interfaces:**

- Consumes: —
- Produces: `HeroSection` sin contadores. No cambia su API (sigue sin props).

- [ ] **Step 1: Confirmar el único consumidor del hook**

Run: `git grep -n "use-animated-counter\|useAnimatedCounter" -- client/src`
Expected: solo `client/src/components/sections/HeroSection.tsx` y el propio hook.

- [ ] **Step 2: Quitar los contadores**

En `HeroSection.tsx`:

- borra `import { useAnimatedCounter } from "@/hooks/use-animated-counter";`
- borra la función `AnimatedCounter` entera
- borra el bloque que empieza con `{/* Stats - animated counters */}` y su `<motion.div …>…</motion.div>` (los dos `AnimatedCounter` y el separador), y déjalo así en su lugar:

```tsx
{
  /* Aquí había dos contadores —"500+ asociaciones activas" y
                "50,000+ miembros"— que no correspondían a ninguna cifra real.
                Se retiraron en la Etapa 1; las cifras verificables van en la
                home institucional. */
}
```

- [ ] **Step 3: Borrar el hook huérfano**

```bash
git rm client/src/hooks/use-animated-counter.ts
```

- [ ] **Step 4: Puertas y verificación**

```bash
npm run check && npm run lint && npm run format:check && npm test
git grep -n "50000\|500+" -- client/src
```

Expected: puertas en verde; el `grep` no devuelve nada. En el navegador, `/plataforma` a 375 y 1440 px: hero sin contadores y sin hueco raro bajo los botones.

- [ ] **Step 5: Commit**

```bash
git add -A client/src/components/sections/HeroSection.tsx client/src/hooks/use-animated-counter.ts
git commit -m "Retirar del hero los contadores de asociaciones y miembros, que no eran reales"
```

---

### Task 3: `marca.ts` — nombre, contacto y redes en un solo lugar

La D5 (nombre visible) sigue abierta. Con este módulo, cambiarla es editar una línea y el test detecta si `index.html` se queda atrás.

**Files:**

- Create: `client/src/lib/marca.ts`
- Create: `client/src/lib/marca.test.ts`
- Modify: `client/src/components/layout/Footer.tsx` (usa `REDES`, `CONTACTO`, `NOMBRE_MARCA`)
- Modify: `client/index.html` (`<title>`)

**Interfaces:**

- Consumes: —
- Produces:
  - `NOMBRE_CORTO = "ASPAL"`
  - `NOMBRE_COMPLETO = "Asociaciones Profesionales de Latinoamérica"`
  - `NOMBRE_MARCA = "ASPAL — Asociaciones Profesionales de Latinoamérica"`
  - `CONTACTO: { correo: string; telefono: string; ciudad: string }`
  - `interface RedSocial { nombre: string; icono: LucideIcon; href: string; testid: string }`
  - `REDES: RedSocial[]`
  - El PR B (`Seo`, JSON-LD `Organization`) y el PR C (pie) leen de aquí.

- [ ] **Step 1: Escribir el test**

`client/src/lib/marca.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTACTO, NOMBRE_COMPLETO, NOMBRE_MARCA, REDES } from "./marca";

const indexHtml = readFileSync(
  resolve(import.meta.dirname, "..", "..", "index.html"),
  "utf8",
);

describe("marca", () => {
  it("el título de index.html usa el nombre de marca", () => {
    // Llegó a haber tres nombres distintos en el título, el pie y los
    // documentos. index.html no puede importar TypeScript: este test es lo que
    // impide que vuelva a divergir.
    const titulo = indexHtml.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
    expect(titulo).toContain(NOMBRE_COMPLETO);
  });

  it("compone el nombre visible a partir de sus partes", () => {
    expect(NOMBRE_MARCA).toBe(`ASPAL — ${NOMBRE_COMPLETO}`);
  });

  it("enlaza todas las redes por https y sin repetir data-testid", () => {
    for (const red of REDES) expect(red.href, red.nombre).toMatch(/^https:\/\//);
    const ids = REDES.map((r) => r.testid);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tiene un correo y un teléfono accionables", () => {
    expect(CONTACTO.correo).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
    expect(CONTACTO.telefono.replace(/\s/g, "")).toMatch(/^\+\d{10,13}$/);
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/marca.test.ts`
Expected: FAIL — `Failed to resolve import "./marca"`.

- [ ] **Step 3: Implementar `marca.ts`**

`client/src/lib/marca.ts` (las URLs y los datos de contacto se mueven tal cual desde `Footer.tsx`):

```ts
/**
 * Identidad de ASPAL en un solo lugar: nombre visible, contacto y redes.
 *
 * El nombre es la decisión D5 del plan de la Etapa 1, todavía abierta. Aquí va
 * la recomendación; si cambia, se edita `NOMBRE_COMPLETO` y el `<title>` de
 * `client/index.html` (el test de este módulo avisa si se queda atrás).
 */

import { Facebook, Instagram, Linkedin, Twitter, type LucideIcon } from "lucide-react";

export const NOMBRE_CORTO = "ASPAL";
export const NOMBRE_COMPLETO = "Asociaciones Profesionales de Latinoamérica";
export const NOMBRE_MARCA = `${NOMBRE_CORTO} — ${NOMBRE_COMPLETO}`;

export const CONTACTO = {
  correo: "vinculacion@asociacionesprofesionales.org",
  telefono: "+52 999 163 4080",
  ciudad: "Mérida, Yucatán",
} as const;

export interface RedSocial {
  nombre: string;
  icono: LucideIcon;
  href: string;
  testid: string;
}

// PENDIENTE: YouTube (plan de la Etapa 1, §6.7). Falta la URL oficial del
// canal y no se inventa.
export const REDES: RedSocial[] = [
  {
    nombre: "Facebook",
    icono: Facebook,
    href: "https://www.facebook.com/asociacionesprofesionales",
    testid: "button-social-facebook",
  },
  {
    nombre: "X",
    icono: Twitter,
    href: "https://x.com/ASPALATAM",
    testid: "button-social-twitter",
  },
  {
    nombre: "LinkedIn",
    icono: Linkedin,
    // Sin `?viewAsMember=true`: ese parámetro se cuela al copiar la URL desde
    // una sesión iniciada y no pinta nada en un enlace público.
    href: "https://www.linkedin.com/company/asociaciones-profesionales-aspal/",
    testid: "button-social-linkedin",
  },
  {
    nombre: "Instagram",
    icono: Instagram,
    href: "https://www.instagram.com/aspalatam/",
    testid: "button-social-instagram",
  },
];
```

- [ ] **Step 4: Actualizar `index.html`**

En `client/index.html`, sustituye el `<title>` por:

```html
<title>ASPAL · Asociaciones Profesionales de Latinoamérica</title>
```

- [ ] **Step 5: Comprobar que pasa**

Run: `npx vitest run client/src/lib/marca.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Que el pie lea de `marca.ts`**

En `client/src/components/layout/Footer.tsx`:

- borra las constantes locales `REDES`, `CORREO` y `TELEFONO`, y quita `Facebook`, `Instagram`, `Linkedin` y `Twitter` del import de `lucide-react`
- añade `import { CONTACTO, NOMBRE_MARCA, REDES } from "@/lib/marca";`
- en el bloque de contacto, cambia `CORREO` por `CONTACTO.correo`, `TELEFONO` por `CONTACTO.telefono` y el literal `Mérida, Yucatán` por `{CONTACTO.ciudad}`
- cambia el texto del copyright por:

```tsx
            © {new Date().getFullYear()} {NOMBRE_MARCA}. Todos los derechos reservados.
```

- [ ] **Step 7: Puertas y verificación**

```bash
npx prettier --write client/src/lib/marca.ts client/src/lib/marca.test.ts client/src/components/layout/Footer.tsx client/index.html
npm run check && npm run lint && npm run format:check && npm test
```

Expected: verde. En el navegador, el pie de `/blog`: las 4 redes, el correo (abre `mailto:`), el teléfono (`tel:+529991634080`), Mérida y el copyright «ASPAL — Asociaciones Profesionales de Latinoamérica». La pestaña muestra el título nuevo.

- [ ] **Step 8: Commit**

```bash
git add client/src/lib/marca.ts client/src/lib/marca.test.ts client/src/components/layout/Footer.tsx client/index.html
git commit -m "Unificar nombre, contacto y redes de ASPAL en marca.ts"
```

---

### Task 4: Tres tokens de color nuevos, con los contrastes vigilados por test

**Files:**

- Modify: `client/src/index.css` (bloque `:root`)
- Modify: `tailwind.config.ts` (`theme.extend.colors`)
- Create: `client/src/lib/tokens.test.ts`

**Interfaces:**

- Consumes: —
- Produces (utilidades de Tailwind para los PR C–F):
  - `bg-noche` / `text-noche` (y `text-noche-foreground`): azul noche del logo, `206 53% 14%` ≈ `#112738`
  - `text-miel-texto`: miel legible sobre fondo claro, `41 75% 31%` ≈ `#8A6414`
  - `bg-fondo-suave`: bandas alternas, `220 23% 97%` ≈ `#F7F8FA`

- [ ] **Step 1: Escribir el test de contraste**

`client/src/lib/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Los contrastes de la paleta (plan de la Etapa 1, §4), comprobados contra los
 * valores reales de index.css. Si alguien ajusta un token y rompe AA, falla
 * aquí y no en una auditoría con axe al final.
 */
const css = readFileSync(resolve(import.meta.dirname, "..", "index.css"), "utf8");
const raiz = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

function token(nombre: string): [number, number, number] {
  const m = raiz.match(
    new RegExp(`--${nombre}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%;`),
  );
  if (!m) throw new Error(`Falta el token --${nombre} en :root`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function hslARgb([h, s, l]: [number, number, number]): number[] {
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

function contraste(texto: string, fondo: string): number {
  const a = luminancia(hslARgb(token(texto)));
  const b = luminancia(hslARgb(token(fondo)));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// [texto, fondo]: todo par que el diseño usa para texto normal. AA exige 4.5.
const PARES: [string, string][] = [
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

describe("contraste de la paleta", () => {
  it.each(PARES)("%s sobre %s cumple AA (4.5:1)", (texto, fondo) => {
    expect(contraste(texto, fondo)).toBeGreaterThanOrEqual(4.5);
  });

  it("el miel no sirve como texto sobre blanco", () => {
    // Por eso existe --miel-texto. Si este test falla, alguien oscureció el
    // miel de marca: el botón Únete cambiaría de color.
    expect(contraste("secondary", "background")).toBeLessThan(3);
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/tokens.test.ts`
Expected: FAIL en los pares con `brand-noche`, `miel-texto` y `fondo-suave` — `Falta el token --brand-noche en :root`. El resto, PASS.

- [ ] **Step 3: Añadir los tokens a `index.css`**

En `client/src/index.css`, dentro de `:root`, justo después de `--chart-5: 206 25% 45%;`:

```css
/* Etapa 1. Noche es el azul del logotipo, medido sobre el PNG (#112738).
     Miel-texto existe porque el miel de marca sobre blanco da 1.5:1: nunca
     sirve para texto. Solo en :root: el sitio no tiene modo oscuro (nada
     activa la clase .dark). */
--brand-noche: 206 53% 14%;
--brand-noche-foreground: 0 0% 100%;
--miel-texto: 41 75% 31%;
--fondo-suave: 220 23% 97%;
```

- [ ] **Step 4: Exponerlos en Tailwind**

En `tailwind.config.ts`, dentro de `colors`, después del bloque `ring`:

```ts
        noche: {
          DEFAULT: "hsl(var(--brand-noche) / <alpha-value>)",
          foreground: "hsl(var(--brand-noche-foreground) / <alpha-value>)",
        },
        "miel-texto": "hsl(var(--miel-texto) / <alpha-value>)",
        "fondo-suave": "hsl(var(--fondo-suave) / <alpha-value>)",
```

- [ ] **Step 5: Comprobar que pasa**

Run: `npx vitest run client/src/lib/tokens.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 6: Puertas y build**

```bash
npx prettier --write client/src/index.css tailwind.config.ts client/src/lib/tokens.test.ts
npm run check && npm run lint && npm run format:check && npm test && npm run build
```

Expected: verde. (Las clases nuevas no aparecen en el CSS construido hasta que algún componente las use: es lo normal con Tailwind.)

- [ ] **Step 7: Commit**

```bash
git add client/src/index.css tailwind.config.ts client/src/lib/tokens.test.ts
git commit -m "Añadir los tokens noche, miel-texto y fondo-suave, y vigilar los contrastes AA"
```

---

### Task 5: `analitica.ts` y el primer evento, `click_unete`

GTM llega en la Etapa 0. Mientras tanto, los eventos van a `window.dataLayer`: cuando exista el contenedor, los recoge sin tocar código.

**Files:**

- Create: `client/src/lib/analitica.ts`
- Create: `client/src/lib/analitica.test.ts`
- Modify: `client/src/components/layout/Header.tsx` (botones Únete de escritorio y del panel móvil)
- Modify: `client/src/components/layout/Footer.tsx` (botón Únete del pie)

**Interfaces:**

- Consumes: —
- Produces:
  - `type EventoAnalitica = "click_unete" | "signup_suscriptor" | "download_dossier" | "click_mapa_ruta" | "click_menu" | "salida_plataforma"`
  - `type DatosEvento = Record<string, string | number | boolean>`
  - `registrarEvento(evento: EventoAnalitica, datos?: DatosEvento): void`, que empuja `{ event: evento, ...datos }` a `window.dataLayer`.
  - Orígenes de `click_unete` que se usan desde ya: `"header"`, `"menu_movil"`, `"footer"`. Los PR E y F añaden `"home"`, `"nosotros"`, `"que_hacemos"` y `"unete"`.

- [ ] **Step 1: Escribir el test**

`client/src/lib/analitica.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { registrarEvento } from "./analitica";

afterEach(() => vi.unstubAllGlobals());

describe("registrarEvento", () => {
  it("empuja el evento con sus datos a dataLayer", () => {
    const ventana: { dataLayer?: unknown[] } = {};
    vi.stubGlobal("window", ventana);
    registrarEvento("click_unete", { origen: "header" });
    expect(ventana.dataLayer).toEqual([{ event: "click_unete", origen: "header" }]);
  });

  it("respeta lo que ya había en dataLayer", () => {
    const ventana = { dataLayer: [{ event: "gtm.js" }] as unknown[] };
    vi.stubGlobal("window", ventana);
    registrarEvento("download_dossier");
    expect(ventana.dataLayer).toEqual([
      { event: "gtm.js" },
      { event: "download_dossier" },
    ]);
  });

  it("no falla sin window (tests y prerender)", () => {
    expect(() => registrarEvento("click_menu", { destino: "/blog" })).not.toThrow();
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/analitica.test.ts`
Expected: FAIL — `Failed to resolve import "./analitica"`.

- [ ] **Step 3: Implementar `analitica.ts`**

`client/src/lib/analitica.ts`:

```ts
/**
 * Eventos de analítica del sitio (RF-12 del plan de la Etapa 1).
 *
 * Solo empuja a `window.dataLayer`. El contenedor de GTM llega en la Etapa 0 y
 * lo recoge desde ahí; mientras no exista, los eventos se acumulan sin efecto.
 * La lista de eventos es cerrada a propósito: un nombre mal escrito no compila,
 * en lugar de aparecer en GA4 como un evento fantasma.
 */

export type EventoAnalitica =
  | "click_unete"
  | "signup_suscriptor"
  | "download_dossier"
  | "click_mapa_ruta"
  | "click_menu"
  | "salida_plataforma";

export type DatosEvento = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function registrarEvento(evento: EventoAnalitica, datos: DatosEvento = {}): void {
  // Sin `window` (tests en node, prerender) no hay nada que medir.
  if (typeof window === "undefined") return;
  window.dataLayer ??= [];
  window.dataLayer.push({ event: evento, ...datos });
}
```

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run client/src/lib/analitica.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Medir los tres botones Únete**

Añade `import { registrarEvento } from "@/lib/analitica";` en `Header.tsx` y en `Footer.tsx`. Pon el `onClick` en el `<a>` interior de cada botón (el `Button` usa `asChild`):

- `Header.tsx`, botón de escritorio (`data-testid="button-registro"`):

```tsx
              <a
                href={URL_REGISTRO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("click_unete", { origen: "header" })}
              >
```

- `Header.tsx`, panel móvil (`data-testid="button-mobile-registro"`): igual, con `{ origen: "menu_movil" }`.
- `Footer.tsx` (`data-testid="button-footer-registro"`): añade `onClick={() => registrarEvento("click_unete", { origen: "footer" })}` al `<a>`.

- [ ] **Step 6: Puertas y verificación en el navegador**

```bash
npx prettier --write client/src/lib/analitica.ts client/src/lib/analitica.test.ts client/src/components/layout/Header.tsx client/src/components/layout/Footer.tsx
npm run check && npm run lint && npm run format:check && npm test
```

En `http://localhost:5001/blog` haz clic en Únete del header (1440 px), en el del panel móvil (375 px) y en el del pie. Tras cada clic, en la consola: `window.dataLayer`. Expected: tres entradas `click_unete` con `origen` `header`, `menu_movil` y `footer`.

- [ ] **Step 7: Commit**

```bash
git add client/src/lib/analitica.ts client/src/lib/analitica.test.ts client/src/components/layout/Header.tsx client/src/components/layout/Footer.tsx
git commit -m "Añadir registrarEvento sobre dataLayer y medir los clics en Únete"
```

---

### Task 6: Reescribir la guía de diseño y corregir la documentación obsoleta

**Files:**

- Rewrite: `docs/design-guidelines.md`
- Modify: `CLAUDE.md` (alias `@assets/`)
- Modify: `docs/architecture.md` (degradación de WordPress y ubicación de assets)
- Modify: `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md` (nota al inicio)

**Interfaces:**

- Consumes: tokens del Task 4, `marca.ts` del Task 3.
- Produces: la guía que siguen los PR C–F.

- [ ] **Step 1: Reescribir `docs/design-guidelines.md`**

Sustituye el contenido entero por:

```markdown
# Guía de diseño de ASPAL

Refleja lo que el código hace hoy. La versión anterior (Inter, morado,
glassmorphism) describía un sitio que ya no existe.

## Marca

- **Logotipo:** `client/src/assets/ASPAL-para fondo claro_*.png` sobre fondos
  claros; `ASPAL-para fondo oscuro_*.png` sobre `bg-noche`. Nunca el de fondo
  claro sobre fondo oscuro.
- **Isotipo** (panal de 4 hexágonos): `Aspal-Icono_*.png`. Es la silueta de
  perfil cuando falta la foto.
- **Motivo gráfico:** `HexagonNetwork` (`components/sections/CommunityGraphics.tsx`),
  semitransparente, en el hero, en la banda «Únete a la casa común» y en la Ruta
  2026–2030.
- **Nombre visible:** `NOMBRE_MARCA` de `client/src/lib/marca.ts`. No se escribe a mano.

## Color

Tokens en `client/src/index.css` (`:root`). Solo modo claro.

| Token                                     | Clase                               | Uso                                                                        |
| ----------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `--primary` pizarra `#233543`             | `bg-primary`, `text-primary`        | Títulos, botones de contorno, bandas institucionales                       |
| `--secondary` miel `#F9CC62`              | `<Button variant="secondary">`      | Únete (el único botón lleno de la cabecera), acentos, marca de ruta activa |
| `--brand-noche` `#112738` (azul del logo) | `bg-noche`, `text-noche-foreground` | Hero, banda CTA final, franja inferior del pie                             |
| `--miel-texto` `#8A6414`                  | `text-miel-texto`                   | Overlines y etiquetas sobre fondo claro                                    |
| `--fondo-suave` `#F7F8FA`                 | `bg-fondo-suave`                    | Bandas alternas                                                            |
| `--accent` `#FEF5E1`                      | `bg-accent`                         | Tarjetas destacadas                                                        |
| `--muted-foreground` `#576875`            | `text-muted-foreground`             | Texto secundario                                                           |

**Nunca** texto miel sobre blanco (1.5:1). Todo par nuevo de texto y fondo se
añade a `PARES` en `client/src/lib/tokens.test.ts`.

## Tipografía

Montserrat 400–800 (Google Fonts, `client/index.html`). Escala:

| Nivel    | Tamaño   | Clases                                                               |
| -------- | -------- | -------------------------------------------------------------------- |
| H1       | 48–64 px | `text-5xl lg:text-6xl font-bold`                                     |
| H2       | 32–40 px | `text-3xl md:text-4xl font-bold`                                     |
| H3       | 24 px    | `text-2xl font-semibold`                                             |
| Cuerpo   | 18 px    | `text-lg` (el público tiene sesgo de edad alto)                      |
| Overline | 13 px    | `text-[13px] font-semibold uppercase tracking-wider text-miel-texto` |

## Componentes y espaciado

- Botones: primario `variant="secondary"` (miel, texto pizarra); secundario
  `variant="outline"`; sobre `bg-noche`, contorno blanco. Objetivo táctil de 44 px mínimo (`min-h-11`).
- Tarjetas: `rounded-2xl`, borde sutil y `hover-elevate`. Sin glassmorphism.
- Bandas: `py-16 md:py-24`, contenedor `max-w-7xl mx-auto px-4 md:px-8`, ritmo
  blanco → `bg-fondo-suave` → `bg-noche`.
- Iconos: Lucide, de línea, en pizarra, siempre con `aria-hidden` y junto a su
  texto. Pilares: Users (Comunidad), BookOpen (Conocimiento), Cpu (Tecnología), BarChart3 (Datos).
- Secciones sin construir: `<Proximamente />`, nunca un enlace a ningún sitio.

## Movimiento

- Todo framer-motion respeta `MotionConfig reducedMotion="user"` (App.tsx).
- **En páginas nuevas se anima solo el desplazamiento (`y`), nunca la
  opacidad del contenido:** el HTML prerenderizado mostraría texto invisible a
  buscadores y a quien no ejecuta JavaScript.
- Sin sliders automáticos ni animaciones infinitas en páginas institucionales.

## Fotografía

Rostros reales de directivos latinoamericanos en eventos; retratos del equipo
con el mismo fondo y la misma luz. Sin fotos de stock ni mockups de dashboard
(esos viven solo en `/plataforma`).
```

- [ ] **Step 2: Corregir `CLAUDE.md`**

En la línea de alias, cambia `` `@assets/` →
  `attached_assets/` `` por `` `@assets/` → `client/src/assets/` ``. En «Contexto que ahorra tiempo», cambia `` `attached_assets/` pesa ~11 MB y está versionado `` por `` `client/src/assets/` pesa ~11 MB y está versionado ``. El resto de la frase se queda.

- [ ] **Step 3: Corregir `docs/architecture.md`**

Sustituye el párrafo que empieza con `**Degradación:**` por:

```markdown
**Errores:** los fallos de WordPress se propagan y salen como 5xx: `client.ts`
lanza y `routes.ts` traduce. El cliente distingue así «no se pudo cargar» de
«no hay artículos». El único `null`/404 legítimo es `/api/posts/:slug` cuando el
post no existe.
```

En «Dependencias externas», cambia ``en `attached_assets/` (~11 MB versionados)`` por ``en `client/src/assets/` (~11 MB versionados)``.

- [ ] **Step 4: Nota en el plan de origen**

En `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md`, justo debajo del bloque de cita inicial (antes de `## 0.`):

```markdown
> **Ejecución:** `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md` aterriza
> este plan sobre el repositorio (inventario de lo que se reutiliza y correcciones).
> Donde discrepen, manda el plan de ejecución.
```

- [ ] **Step 5: Puertas**

```bash
npx prettier --write docs/design-guidelines.md docs/architecture.md CLAUDE.md docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
npm run format:check
```

Expected: verde.

- [ ] **Step 6: Commit**

```bash
git add docs/design-guidelines.md CLAUDE.md docs/architecture.md docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
git commit -m "Reescribir la guía de diseño con la marca real y corregir la documentación obsoleta"
```

---

### Task 7: Cerrar el PR A

**Files:** —

**Interfaces:**

- Consumes: Tasks 1–6.
- Produces: `feat/etapa-1-institucional` con los cimientos, lista para el plan del PR B.

- [ ] **Step 1: Todas las puertas, incluido el build**

```bash
npm run check && npm run lint && npm run format:check && npm test && npm run build
```

Expected: verde, con 24 tests nuevos respecto a `staging`: 6 de `rutas`, 1 de `navegacion`, 4 de `marca`, 10 de `tokens` y 3 de `analitica`.

- [ ] **Step 2: API intacta**

Con el servidor en marcha en el 5001:

```bash
curl http://localhost:5001/api/health
curl "http://localhost:5001/api/posts?per_page=2"
```

Expected: `health` responde bien; `posts` devuelve 2 elementos (o 5xx si WordPress está caído, nunca `[]` como fallo).

- [ ] **Step 3: Revisión visual a 375, 768, 1024 y 1440 px**

Rutas: `/`, `/plataforma`, `/blog`, `/podcast`, `/nosotros` (404). Revisa que no haya scroll horizontal, que el hero no tenga contadores, que el pie muestre el nombre de marca y que el menú móvil abra y cierre.

- [ ] **Step 4: Integrar en la rama de la etapa (local)**

```bash
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/a-cimientos -m "PR A: cimientos de la Etapa 1"
```

- [ ] **Step 5: Siguiente paso**

Escribir el plan detallado del PR B (SEO, prerender y 404) sobre el código ya integrado.
