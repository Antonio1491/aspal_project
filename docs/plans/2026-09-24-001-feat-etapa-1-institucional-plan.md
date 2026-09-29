---
title: Rediseño institucional del sitio ASPAL — Etapa 1
type: feat
status: active
date: 2026-09-24
origin: Proyecto ASPAL (ASPAL_Auditoria_Web_v4_Julio2026.xlsx y ASPAL_Concepto_Nosotros_Web V1.docx)
---

# feat: Rediseño institucional del sitio ASPAL — Etapa 1

> Copia en el repositorio del documento vivo del plan
> (<https://claude.ai/code/artifact/3ea76183-36fc-4d5a-a2c4-2dff4ff9d2f9>), tomada el 24 sep 2026.
> Las decisiones y el estado de la matriz se actualizan en ese documento. Si una decisión
> cambia el alcance, actualiza también este archivo en el mismo PR.

## 0. Instrucciones para agentes (Claude Code)

- Lee `CLAUDE.md` antes de tocar código. Sus reglas mandan sobre este plan.
- Trabaja **un PR a la vez**, en el orden de la sección 12 (PR A a PR F), en ramas que salgan
  de `feat/etapa-1-institucional` y vuelvan a ella o a `staging`. Nunca a `main`.
- Si una decisión de la sección 10 sigue abierta, implementa la **recomendación** del plan y
  déjala aislada (`lib/navegacion.ts`, `lib/marca.ts`, `content/institucional/`) para que
  cambiarla después sea trivial.
- El endpoint `/api/suscripcion` es la primera escritura del sitio: **detente y confirma**
  con el usuario antes de implementarlo, como pide `CLAUDE.md`.
- No inventes copy institucional: sale del documento Concepto NOSOTROS. Lo que falte
  (año de fundación, etapas del Mapa de Ruta, bios finales) va como dato pendiente visible
  en el código (`// PENDIENTE:`), no como texto inventado.
- Antes de dar un PR por terminado: `npm run check`, `npm run lint`, `npm run format:check`,
  `npm test` y `npm run build` en verde, y la ruta revisada en el navegador a 375, 768, 1024
  y 1440 px. En PowerShell el puerto alterno es `$env:PORT=5001; npm run dev`.

## 1. Resumen ejecutivo

La Etapa 1 convierte asociacionesprofesionales.org de una landing de producto SaaS en el sitio institucional de ASPAL: menú de 6 rubros con mega-menú, homepage institucional y 6 páginas nuevas, construido sobre el repositorio actual (React + WordPress headless) y con la paleta pizarra + miel que ya usa el sitio. Propuesta de lanzamiento: 30 oct 2026.

**Por qué ahora.** La Misión y Visión aprobadas en mayo exigen una homepage institucional. Hoy el hero dice "Crea y gestiona tu comunidad en línea" y el 90% de la home vende la plataforma. La Etapa 1 del Excel estaba fechada del 20 jul al 9 ago 2026; este plan la re-calendariza en 5 semanas.

**Alcance de la Etapa 1 (15 tareas y 5 metas del Excel de auditoría, detalle en la sección 11):**

- Navegación: menú de 6 rubros, mega-menú Recursos con 4 grupos (Aprende · Certifícate · Participa · Conecta) y botón Únete persistente.
- Homepage institucional con el hero y la tagline nuevos, y el Mapa de Ruta como CTA principal.
- Páginas nuevas: /nosotros (10 bloques), /que-hacemos (4 pilares + Dossier PDF), /nuestro-equipo, /mapa-de-ruta y /unete (suscriptor gratuito).
- Footer institucional rediseñado.
- Base técnica para crecer: SEO por página, eventos de analítica y accesibilidad AA desde el diseño.

**Fuera de alcance:** membresías de pago, eventos, comunidad migrada, biblioteca y buscador (Etapas 2 a 5). En el menú aparecen como "Próximamente" para que la arquitectura refleje la ambición completa, como pide la auditoría.

**Entregables:** código en rama `staging` → `main`, 6 páginas publicadas, Dossier ASPAL 2026 descargable, tokens de diseño documentados y esta matriz de seguimiento actualizada.

## 2. Diagnóstico del sitio y del repositorio

La base técnica es sólida y reutilizable; lo que falla es el mensaje y la arquitectura. El repositorio `aspal` es una SPA en React 18 + Vite + TypeScript + Tailwind + shadcn/ui, con un Express mínimo (y su gemelo serverless en Vercel) que hace de proxy sobre el WordPress headless de `comunidad.asociacionesprofesionales.org`. No hay base de datos, sesiones ni autenticación, y solo existen 4 rutas: `/`, `/blog`, `/blog/:slug` y `/podcast`.

| Hallazgo                           | Evidencia en el repo                                                                                                                                                                                   | Qué implica para la Etapa 1                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Home 100% SaaS                     | `home.tsx`: hero "Crea y Gestiona tu Comunidad en Línea" + 6 bloques de producto (membresías, comunidad, contenido, cursos, marketing, bolsa)                                                          | Reescribir la home; mover el contenido SaaS a `/plataforma` hasta su reubicación en Etapa 3                |
| Cifras no verificables             | `HeroSection.tsx`: contadores "500+ asociaciones activas" y "50,000+ miembros"; el Excel reporta unos 120 suscriptores y 0 miembros pagados al 6 jul                                                   | Retirarlas ya: riesgo reputacional. Sustituir por cifras reales (15+ países, 22 organizaciones analizadas) |
| Faltan las páginas institucionales | Sin rutas `/nosotros`, `/que-hacemos`, `/nuestro-equipo`, `/mapa-de-ruta`, `/unete` en `App.tsx`                                                                                                       | Son el núcleo de la etapa                                                                                  |
| Menú de 3 entradas                 | `lib/navegacion.ts`: Aprende · Comunidad · Bolsa de Trabajo; ya es fuente única para header y footer, con patrón "Próximamente"                                                                        | Evolucionar a 6 rubros sin tirar el patrón; es la mejor pieza del código actual                            |
| Únete sale del dominio             | Apunta al registro MemberPress en `comunidad.`; "Iniciar sesión" a `comunidad./login` (ambos funcionan desde ago 2026)                                                                                 | Únete pasa a `/unete` en el dominio principal                                                              |
| Footer incompleto                  | Columnas heredadas del menú + contacto; redes FB, X, LinkedIn, Instagram; sin YouTube, boletín ni legales                                                                                              | Rediseño completo (sección 6)                                                                              |
| Nombre de marca inconsistente      | `<title>`: "Asociación de Profesionales de Asociaciones Latinoamérica"; footer: "Asociaciones y Sociedades Profesionales de América Latina"; documentos: "Asociaciones Profesionales de Latinoamérica" | Unificar en todo el sitio (decisión en sección 10)                                                         |
| SEO débil por arquitectura         | Render solo en cliente, un único title/description en `index.html`, sin Open Graph ni sitemap; rutas inexistentes responden 200                                                                        | Head por ruta + prerender de páginas institucionales                                                       |
| Contenido WP bajo muro de pago     | `docs/plans/…REVISION-PENDIENTE.md`: 15 de 15 posts devuelven el aviso de MemberPress en lugar del cuerpo                                                                                              | La home solo puede mostrar título, extracto e imagen de posts hasta que se decida la política de acceso    |
| Imágenes pesadas                   | Hero e ilustraciones en PNG de 0.5 a 1.1 MB; fondos decorativos fijos animados                                                                                                                         | Pasar a WebP/AVIF y carga diferida; meta Lighthouse 72+ (hoy 68 según el Excel)                            |
| Buena base de accesibilidad        | `lang="es"`, zoom permitido, `prefers-reduced-motion`, objetivos táctiles de 44 px, menú móvil con foco atrapado                                                                                       | Mantener y extender a las páginas nuevas                                                                   |
| Calidad automatizada               | CI en GitHub: typecheck, lint, formato, tests (vitest) y build                                                                                                                                         | Añadir un test que impida enlaces del menú a rutas inexistentes                                            |
| Guía de diseño obsoleta            | `docs/design-guidelines.md` habla de Inter y morado; el código usa Montserrat y pizarra + miel                                                                                                         | Reescribirla con los tokens de la sección 4                                                                |

No encontré el chatbot "Asistente ANPR" en este repositorio: vive en el WordPress de comunidad y su rebranding es de la Etapa 0.

## 3. Qué tomamos de las referencias

De ASAE tomamos la arquitectura (rubros claros, Join y Login separados, un About robusto con subpáginas); de ANPR, la estructura hermana (mega-menú de 4 grupos, botón Únete miel en todas las páginas, narrativa visual). La identidad visual sigue siendo la de ASPAL.

| Patrón               | ASAE                                                                              | ANPR México                                                              | Adaptación ASPAL en Etapa 1                                                                      |
| -------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Menú de nivel 1      | 6 rubros: Resources · Programs · Career · Membership · Advocacy · About           | Acerca de · Recursos · Eventos · Buscar · Únete                          | Acerca de · Recursos · Eventos · Membresía · Comunidad · Únete                                   |
| Mega-menú            | Resources: 15 temas + productos (Associations Now, Sample Center, Stellar…)       | Recursos: Capacítate (5) · Certifícate (2) · Participa (4) · Conecta (4) | Recursos: Aprende · Certifícate · Participa · Conecta, cada destino con una línea de descripción |
| Acciones de cabecera | Join y Login separados, más Give, Shop, Advertise y Solutions HQ                  | Botón Únete miel persistente                                             | Solo "Iniciar sesión" (texto) y "Únete" (miel, único botón lleno)                                |
| Homepage             | Featured Events + "ASAE Recommends"                                               | Slider de 7 imágenes con chips temáticos + tagline                       | Hero estático con tagline; bandas de pilares, Mapa de Ruta, contenido reciente y próximo evento  |
| Nosotros             | Who We Are · What We Stand For · What We Do + 10 subpáginas                       | Cronología, esencia, 7 aportes, 4 tarjetas de gobernanza, aliados        | Los 10 bloques del Concepto NOSOTROS + submenú de 9 destinos                                     |
| Qué hacemos          | Cause / Value / Promise / Guarantee                                               | 3 unidades + Dossier PDF                                                 | 4 pilares ASPAL + Dossier ASPAL 2026                                                             |
| Footer               | Columnas por rubro, Advertise · Contact · Privacy, sello de acreditación, 5 redes | Logo, enlaces, recursos, contacto, redes, boletín                        | 5 columnas + boletín + legales + YouTube                                                         |

**Lo que no tomamos:** el racimo de 6 botones de ASAE (diluye la conversión), el slider automático de ANPR (penaliza accesibilidad y la guía del repo lo prohíbe), la paleta azul de ANPR y la página About sin imágenes de ASAE.

Fuentes: [asaecenter.org](https://www.asaecenter.org/), consultado el 24 sep 2026. El sitio de [ANPR México](https://anpr.org.mx/web/) bloqueó la lectura automatizada, así que sus patrones vienen del análisis de la hoja 2 de la auditoría y del documento Concepto NOSOTROS.

## 4. Identidad visual: se conserva la marca actual

Se mantienen los dos colores que el sitio usa hoy, pizarra `hsl(206 31% 20%)` y miel `hsl(42 93% 68%)`, más el azul noche del logotipo. Ningún token existente cambia de valor; se agregan tres para cubrir los usos nuevos. Los valores salen de `client/src/index.css` y del archivo del logotipo en el repositorio.

| Token                         | Valor                  | Uso                                                  | Contraste verificado                                        |
| ----------------------------- | ---------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| `--primary` pizarra (existe)  | #233543                | Títulos, botones de contorno, bandas institucionales | Blanco encima: 12.6:1                                       |
| `--secondary` miel (existe)   | #F9CC62                | Botón Únete, acentos, subrayado de ruta activa       | Pizarra encima: 8.3:1. Nunca texto miel sobre blanco: 1.5:1 |
| `--brand-noche` (nuevo)       | #112738, azul del logo | Hero, banda CTA final, franja inferior del footer    | Miel encima: 10.1:1 · blanco: 15.3:1                        |
| `--miel-texto` (nuevo)        | #8A6414                | Overlines y etiquetas de sección sobre fondo claro   | Sobre blanco: 5.4:1                                         |
| `--fondo-suave` (nuevo)       | #F7F8FA                | Bandas alternas                                      | Pizarra encima: 11.9:1                                      |
| `--accent` (existe)           | #FEF5E1                | Hover en menús y tarjetas destacadas                 | Pizarra encima: 11.7:1                                      |
| `--muted-foreground` (existe) | #576875                | Texto secundario                                     | Sobre blanco: 5.8:1                                         |

**Tipografía.** Montserrat 400 a 800, la fuente actual del sitio y la que está en los activos de marca del repositorio. Escala: H1 48–64 px, H2 32–40 px, H3 24 px, cuerpo 18 px (el público tiene sesgo de edad alto) y overline 13 px en mayúsculas. El Concepto NOSOTROS propone Poppins; cambiarla sería un rebranding, no un rediseño, así que queda como decisión (sección 10).

**Diferencia con la presentación al Consejo.** La lámina 16 lista Azul #162742, Miel #F5C64B y Oscuro #0F1E33. Son cercanos pero no iguales a los del sitio y el logo. Recomiendo actualizar el Design System a los valores de esta tabla.

**Lenguaje visual:**

- Motivo gráfico: el hexágono del panal del logo como fondo semitransparente en el hero, la banda "Únete a la casa común" y la Ruta 2026–2030. Ya existe como `HexagonNetwork` en `CommunityGraphics.tsx`.
- Iconografía: Lucide (ya instalada), de línea, en pizarra. Pilares: Users (Comunidad), BookOpen (Conocimiento), Cpu (Tecnología), BarChart3 (Datos).
- Fotografía: rostros reales de directores latinoamericanos en eventos; retratos del equipo con el mismo fondo y luz. Sin stock genérico ni mockups de dashboard.
- Espaciado: 96 px entre bandas en escritorio y 64 px en móvil, contenedor `max-w-7xl`, ritmo blanco → fondo suave → noche.
- Botones: primario miel con texto pizarra; secundario de contorno pizarra; sobre fondo noche, contorno blanco.
- Tarjetas: `rounded-2xl`, borde sutil, sombra solo en hover. Se retira el glassmorphism de la guía anterior.

## 5. Arquitectura de información

El menú principal queda en 6 rubros: **Acerca de · Recursos · Eventos · Membresía · Comunidad · Únete**, la opción B que la Coordinación General recomendó al DG (hoja 4, decisión 4). Recursos es el catálogo completo en mega-menú; Eventos y Comunidad son atajos a los grupos Participa y Conecta. Esa repetición es deliberada, igual que en ANPR.

| Rubro     | Grupo       | Destinos y estado en la Etapa 1                                                                                                                                                                                                                                                                                                                     |
| --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Acerca de | —           | **Nosotros** `/nosotros` (nuevo) · **¿Qué hacemos?** `/que-hacemos` (nuevo) · **Nuestro equipo** `/nuestro-equipo` (nuevo) · Contacto `/contacto` (Etapa 0) · Consejo Directivo (próx., E2) · Aliados y patrocinadores (próx., E3) · Iniciativas LATAM y Agenda (próx., E4) · Sala de prensa (próx., E5) · Mensaje del Director General (próx., E5) |
| Recursos  | Aprende     | Blog `/blog` (existe) · Podcast Conexión Profesional `/podcast` (existe) · **Mapa de Ruta** `/mapa-de-ruta` (nuevo) · Estudios e investigaciones (próx., E3) · Biblioteca digital (próx., E4)                                                                                                                                                       |
| Recursos  | Certifícate | Cursos en línea ↗ plataforma de comunidad (existe; pasa a `/academia` en E4) · Bootcamps de directivos (próx., E5) · Certificación CGA (próx., 2028)                                                                                                                                                                                                |
| Recursos  | Participa   | Calendario de eventos · Webinars mensuales (próx., E3) · Encuentro CDMX 2027 (próx., E4) · Premios ASPAL (próx., 2027)                                                                                                                                                                                                                              |
| Recursos  | Conecta     | Comunidad ↗ · Directorio de miembros ↗ (existen en la plataforma) · Directorio de la industria (próx., E5) · Bolsa de trabajo (próx., E5)                                                                                                                                                                                                           |
| Eventos   | —           | Enlace a `/eventos`: página "Próximamente" con captura de correo, hasta que llegue el calendario en E3; el pre-anuncio del Encuentro CDMX 2027 espera la decisión 10 del DG                                                                                                                                                                         |
| Membresía | —           | **Únete gratis** `/unete` (nuevo) · Membresía básica ↗ (MemberPress, existe) · Niveles y precios, Beneficios y Preguntas frecuentes (próx., E3)                                                                                                                                                                                                     |
| Comunidad | —           | Actividad de la red ↗ · Grupos ↗ · Directorio de miembros ↗ · Foros por etapa del Mapa de Ruta (próx., E2)                                                                                                                                                                                                                                          |
| Únete     | Botón       | `/unete`, en todas las páginas; a la izquierda, "Iniciar sesión" ↗ al login de la plataforma                                                                                                                                                                                                                                                        |

**Reglas de navegación:**

- Un destino sin página se muestra con la etiqueta "Próximamente" y no es clicable, como ya hace el repositorio. Dentro de cada grupo, los destinos vivos van arriba.
- Los enlaces que salen del dominio llevan ↗ y abren en pestaña nueva.
- Cada destino lleva una línea de descripción: el público no conoce el vocabulario interno.
- La plataforma SaaS sale del menú: vive en `/plataforma`, enlazada desde el pilar Tecnología y el footer, hasta su reubicación al subdominio en E3.
- Menú completo desde 1024 px; por debajo, el panel móvil actual con acordeones por rubro y Únete fijo abajo.

## 6. Páginas y componentes

La Etapa 1 publica 6 páginas nuevas o reescritas, más dos páginas de soporte (`/eventos` en modo Próximamente y `/plataforma` con el contenido SaaS). Todo el copy de Nosotros sale tal cual del documento Concepto NOSOTROS.

### 6.1 Homepage institucional `/`

1. **Hero** sobre fondo noche con hexágonos: overline "Asociaciones Profesionales de Latinoamérica", H1 "La red en español del sector asociativo de América Latina.", un párrafo y dos CTA: "Empieza por el Mapa de Ruta" (miel) y "Únete a la comunidad" (contorno). Foto real de un evento.
2. **Cifras verificables**: 15+ países · 4 pilares · 22 organizaciones analizadas · meta de 1,000 líderes al 2030. Sustituyen los contadores actuales.
3. **Los 4 pilares** en tarjetas que llevan a `/que-hacemos#comunidad`, `#conocimiento`, `#tecnologia` y `#datos`.
4. **Mapa de Ruta destacado**: las 7 etapas en una franja horizontal, CTA a `/mapa-de-ruta`.
5. **Contenido reciente**: 3 artículos del blog y el último episodio del podcast, con la API que ya existe.
6. **Próximo gran evento**: pre-anuncio del Encuentro Latinoamericano CDMX 2027 con captura de correo, si el DG lo aprueba (decisión 10); si no, webinars y calendario próximamente.
7. **Aliados fundadores**: World Urban Parks, ANPR México y Parksys, en rejilla estática.
8. **Únete a la casa común**: #NingúnDirectorDirigeSolo + formulario de boletín en línea.

Sale de la home: los 6 bloques de producto y el modal "Ver video", que pasan a `/plataforma`.

### 6.2 Nosotros `/nosotros`

Los 10 bloques del Concepto NOSOTROS, en orden: Hero · Quiénes somos · Nuestra esencia · Lo que defendemos · Los 4 Pilares · Cómo aportamos · Ruta ASPAL 2026–2030 · Quiénes hacen posible ASPAL · Aliados · Únete a la casa común. Ajustes para la web:

- **Ruta 2026–2030**: escalera horizontal en escritorio y vertical en móvil. Hitos cumplidos en pizarra sólida y futuros al 40%. El detalle se abre con hover, foco de teclado y toque, no solo hover.
- **Quiénes hacen posible ASPAL**: Equipo lleva a `/nuestro-equipo`; Consejo muestra "Próximamente"; Aliados baja al bloque 9 (`#aliados`).
- **Muro de aliados**: en Etapa 1 solo la categoría Fundadores con logos; las otras tres se anuncian "conforme se firmen convenios".
- **CTA final**: Explorar membresías → `/unete` (hasta E3) · Suscribirme al boletín → formulario · Contactar → `/contacto`.
- **Subnavegación "Acerca de"**: barra fija bajo el header, compartida por Nosotros, Qué hacemos y Nuestro equipo.

### 6.3 ¿Qué hacemos? `/que-hacemos`

- Intro corta: para quién trabajamos (directivos, staff y voluntarios de asociaciones, sociedades, colegios y federaciones).
- Un bloque por pilar con ancla propia: nombre, subtítulo, compromiso, "cómo se traduce" y enlaces a lo que ya existe. Comunidad → plataforma ↗; Conocimiento → blog, podcast y cursos; Tecnología → `/plataforma`; Datos → Estudio Comparativo (próx.).
- Banda de descarga del **Dossier ASPAL 2026** (PDF de 8 a 12 páginas, sin formulario previo y con evento de analítica).
- CTA final a `/unete`.

### 6.4 Nuestro equipo `/nuestro-equipo`

- Intro: equipo compacto respaldado por el secretariado compartido con WUP y ANPR (15 personas).
- 3 tarjetas de perfil: Luis Romahn, Patricia Hernández de Anda y Antonio Góngora. Foto 4:5, nombre, cargo, bio de 60 a 80 palabras y LinkedIn.
- Sin foto profesional, silueta con el hexágono ASPAL (mitigación prevista en el Excel).

### 6.5 Mapa de Ruta `/mapa-de-ruta`

- Hero con la promesa del marco y las 7 etapas en un paso a paso navegable.
- Por etapa: nombre, qué resuelve, recursos relacionados y, desde E2, su foro.
- CTA a `/unete`. El contenido de las 7 etapas debe entregarlo la Coordinación General (sección 10).

### 6.6 Únete `/unete`

- Dos caminos lado a lado: **Suscriptor gratuito** (formulario propio) y **Membresía básica** ↗ en la plataforma actual.
- Formulario: nombre, correo, país (lista LATAM + España y Portugal), organización, cargo y consentimiento del aviso de privacidad. Antispam con campo trampa. Estados de enviando, éxito y error.
- Qué recibes al unirte, 3 preguntas frecuentes y el aviso de que los niveles profesional y grupal llegan en E3.

### 6.7 Footer institucional (todas las páginas)

- Fila superior: logo, descripción de una línea y formulario de boletín.
- 5 columnas: Acerca de · Recursos · Eventos · Membresía · Contacto (correo, teléfono, Mérida, Yucatán).
- Redes: Facebook, X, LinkedIn, Instagram y YouTube (nuevo).
- Barra legal: © ASPAL — Asociaciones Profesionales de Latinoamérica · Aviso de privacidad · Términos · "Con el respaldo de World Urban Parks y ANPR México".

### 6.8 Componentes nuevos o evolucionados

| Componente                                | Tipo                            | Dónde se usa                                     |
| ----------------------------------------- | ------------------------------- | ------------------------------------------------ |
| `Header` + `MegaMenu`                     | Evoluciona                      | Todas las páginas                                |
| `Footer`                                  | Reescribe                       | Todas las páginas                                |
| `Banda` (variantes blanco, suave y noche) | Nuevo                           | Todas las secciones                              |
| `HeroInstitucional`                       | Nuevo                           | Home, Nosotros, Qué hacemos, Equipo, Mapa, Únete |
| `PilarCard`                               | Nuevo                           | Home, Nosotros, Qué hacemos                      |
| `TarjetaCompromiso`                       | Nuevo                           | Nosotros (bloques 3, 4 y 8)                      |
| `RutaTimeline`                            | Nuevo                           | Nosotros                                         |
| `PerfilCard`                              | Nuevo                           | Nuestro equipo                                   |
| `MuroAliados`                             | Nuevo; reemplaza `LogoCarousel` | Home, Nosotros                                   |
| `FormSuscripcion`                         | Nuevo                           | Únete, home, footer, `/eventos`                  |
| `SubnavSeccion`                           | Nuevo                           | Acerca de                                        |
| `PaginaProximamente`                      | Nuevo                           | `/eventos` y futuros destinos                    |
| `Seo`                                     | Nuevo                           | Todas las páginas                                |

## 7. Requerimientos funcionales

Cada requerimiento tiene un criterio de aceptación comprobable y apunta a las tareas del Excel que cubre (IDs de la sección 11).

| ID    | Requerimiento                                                                              | Criterio de aceptación                                                                                                                                                                                                      | Cubre               |
| ----- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| RF-01 | Menú de 6 rubros desde una sola fuente (`navegacion.ts`) para header, panel móvil y footer | Un test falla si un enlace interno del menú no tiene ruta en la app                                                                                                                                                         | E1-01, E1-07        |
| RF-02 | Mega-menú Recursos de 4 columnas con título de grupo, icono y descripción por destino      | Se abre con clic, Enter o Espacio; flechas recorren destinos; Esc cierra y devuelve el foco; `aria-expanded` correcto                                                                                                       | E1-02               |
| RF-03 | Ruta activa visible                                                                        | Subrayado miel de 2 px más peso tipográfico y `aria-current="page"`; nunca solo color                                                                                                                                       | E1-01               |
| RF-04 | Únete persistente                                                                          | Visible en todas las rutas: header en escritorio, fijo abajo en el panel móvil; lleva a `/unete`; dispara `click_unete` con el origen                                                                                       | E1-03               |
| RF-05 | Alta de suscriptor gratuito                                                                | Validación en cliente, envío a `/api/suscripcion`, alta en la lista del boletín con etiqueta de origen (unete, home, footer, eventos), doble confirmación por correo, consentimiento explícito y evento `signup_suscriptor` | E1-13, E1-14        |
| RF-06 | Descarga del Dossier ASPAL 2026                                                            | PDF de 5 MB o menos, se abre en pestaña nueva y dispara `download_dossier`                                                                                                                                                  | E1-09               |
| RF-07 | Ruta 2026–2030 interactiva                                                                 | El detalle de cada hito se abre con hover, foco o toque; en móvil la escalera es vertical                                                                                                                                   | E1-06               |
| RF-08 | Anclas por pilar                                                                           | `/que-hacemos#tecnologia` y demás llegan al bloque correcto, compensando la altura del header fijo                                                                                                                          | E1-08               |
| RF-09 | Página Próximamente con captura                                                            | `/eventos` explica qué llega y cuándo, y reutiliza el formulario de RF-05                                                                                                                                                   | E1-01               |
| RF-10 | SEO por página                                                                             | Title, description, canonical y Open Graph 1200×630 propios en cada ruta nueva; JSON-LD `Organization` en la home; `sitemap.xml` y `robots.txt`; HTML prerenderizado legible sin JavaScript                                 | E1-04 a E1-13       |
| RF-11 | 404 real                                                                                   | Una ruta inexistente responde código 404, no 200                                                                                                                                                                            | E1-15               |
| RF-12 | Analítica                                                                                  | Eventos GA4 vía `dataLayer`: `click_unete`, `signup_suscriptor`, `download_dossier`, `click_mapa_ruta`, `click_menu`, `salida_plataforma`                                                                                   | E1-03, E1-09, E1-11 |
| RF-13 | Contenido reciente en la home                                                              | 3 posts + último episodio, con esqueleto de carga; si la API falla, el bloque se oculta sin afectar al resto                                                                                                                | E1-04               |
| RF-14 | Accesibilidad WCAG 2.1 AA                                                                  | Enlace "Saltar al contenido", foco visible, contrastes de la sección 4, `alt` en toda imagen informativa, jerarquía de encabezados sin saltos, 0 errores críticos en axe                                                    | Todas               |
| RF-15 | Rendimiento                                                                                | Imágenes WebP/AVIF con dimensiones y carga diferida; LCP menor a 2.5 s en 4G; CLS menor a 0.1; Lighthouse móvil de 72 o más                                                                                                 | E1-04               |
| RF-16 | Responsive                                                                                 | Sin scroll horizontal ni textos cortados a 375, 768, 1024 y 1440 px                                                                                                                                                         | Todas               |
| RF-17 | Redirecciones                                                                              | URLs antiguas conocidas redirigen a las nuevas; el registro externo antiguo del hero deja de usarse                                                                                                                         | E1-15               |

## 8. Plan técnico en el repositorio

Todo se construye en el repositorio actual y respetando `CLAUDE.md`: lógica de servidor solo en `shared/`, UI en español, `data-testid` en lo interactivo y `npm run check` en verde antes de cada PR. La única pieza de backend nueva es el endpoint de suscripción.

| Área        | Cambio                                                                                                                                                                                                        | Archivos                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Rutas       | 7 rutas nuevas: `/nosotros`, `/que-hacemos`, `/nuestro-equipo`, `/mapa-de-ruta`, `/unete`, `/eventos`, `/plataforma`. La lista se extrae a un módulo para que tests, prerender y sitemap usen la misma fuente | `App.tsx`, `lib/rutas.ts` (nuevo)                                                 |
| Navegación  | `NAVEGACION` pasa a 6 rubros; `EntradaNav` admite `grupos` para el mega-menú. Se conservan `DestinoNav` y el patrón Próximamente                                                                              | `lib/navegacion.ts`, `navegacion.test.ts`, `Header.tsx`, `ui/navigation-menu.tsx` |
| Contenido   | Copy institucional en módulos tipados: nosotros, pilares, equipo, ruta, aliados, mapa. Versionado, prerenderizable e independiente del muro de pago de WordPress. La CG lo revisa en el preview de cada PR    | `content/institucional/*.ts` (nuevo)                                              |
| Tokens      | `--brand-noche`, `--miel-texto`, `--fondo-suave`; guía de diseño reescrita                                                                                                                                    | `index.css`, `tailwind.config.ts`, `docs/design-guidelines.md`                    |
| Suscripción | `POST /api/suscripcion` hacia la API del proveedor de boletín (Mailchimp, el que el Excel prevé para E2). Validación, campo trampa y límite por IP. Claves en variables de entorno de Vercel                  | `shared/suscripcion/` (nuevo, mismo patrón que `shared/wordpress/`)               |
| SEO         | Componente `Seo` por ruta; script posterior al build que prerenderiza cada ruta a `dist/public/<ruta>/index.html`; `sitemap.xml` generado desde `rutas.ts`; `robots.txt`                                      | `components/layout/Seo.tsx`, `scripts/prerender.mjs`, `client/public/robots.txt`  |
| 404 real    | El fallback global del SPA se sustituye por la lista de rutas conocidas más una página 404 estática                                                                                                           | `vercel.json`                                                                     |
| Imágenes    | Conversión a WebP/AVIF con dimensiones fijas y `loading="lazy"`; salen de la home los PNG de 1 MB                                                                                                             | `vite.config.ts` o `scripts/imagenes.mjs`                                         |
| Analítica   | `track(evento, datos)` empuja a `window.dataLayer`; el contenedor GTM llega en la Etapa 0                                                                                                                     | `lib/analitica.ts` (nuevo)                                                        |
| Dossier     | PDF servido como estático                                                                                                                                                                                     | `client/public/docs/dossier-aspal-2026.pdf`                                       |
| SaaS        | La home actual se muda intacta a `/plataforma`                                                                                                                                                                | `pages/plataforma.tsx`                                                            |
| Marca       | Nombre unificado en title, meta y footer                                                                                                                                                                      | `index.html`, `Footer.tsx`                                                        |

**Dos cuidados técnicos:**

- **Animaciones y prerender.** Hoy las secciones entran con opacidad 0 vía framer-motion. En el HTML prerenderizado eso dejaría texto invisible para buscadores y lectores sin JavaScript. En las páginas nuevas se anima solo el desplazamiento, nunca la opacidad del contenido.
- **Primera escritura del sitio.** `CLAUDE.md` pide confirmar cualquier estado de servidor antes de implementarlo. El endpoint de suscripción no guarda datos propios (los delega al proveedor), pero requiere aprobación de Antonio (sección 10).

**Pruebas nuevas:** navegación sin enlaces muertos, validación del formulario, cliente de suscripción con `fetch` simulado y un smoke test que confirma un H1 en el HTML prerenderizado de cada ruta.

**Flujo de trabajo:** rama `feat/etapa-1-institucional` desde `staging` y 7 PRs pequeños: (1) tokens, header y footer; (2) home; (3) Nosotros; (4) Qué hacemos + Dossier; (5) Equipo + Mapa de Ruta; (6) Únete + API; (7) SEO, prerender y 404. Cada PR genera un preview de Vercel para que la CG revise copy y diseño antes del merge.

## 9. Cronograma y criterios de aceptación

Cinco semanas: una de decisiones y contenidos, tres de construcción y una de QA y lanzamiento. Las decisiones de la sección 10 deben cerrarse el 2 oct 2026 para no mover el lanzamiento del 30 oct 2026.

| Semana | Fechas (2026)  | Trabajo                                                                                                                         | Entregable                               | Responsable                |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------- |
| 0      | 28 sep – 2 oct | Decisiones pendientes, copy congelado, fotos del equipo, contenido de las 7 etapas del Mapa de Ruta, Dossier en diseño          | Insumos completos y wireframes aprobados | DG + CG                    |
| 1      | 5 – 9 oct      | Tokens, header con mega-menú, footer, `rutas.ts`, componente `Seo`                                                              | PR 1 en preview                          | TI                         |
| 2      | 12 – 16 oct    | Homepage institucional; página Nosotros                                                                                         | PR 2 y PR 3                              | TI; CG revisa copy         |
| 3      | 19 – 23 oct    | Qué hacemos + Dossier; Equipo + Mapa de Ruta; Únete + API de suscripción                                                        | PR 4, 5 y 6                              | TI; Antonio aprueba la API |
| 4      | 26 – 30 oct    | Prerender, sitemap y 404; QA de accesibilidad (axe), Lighthouse, 4 anchos y 4 navegadores; Test del Miembro y Test del Fundador | PR 7; merge a `main` y lanzamiento       | TI + CG                    |

**La etapa se da por cerrada cuando:**

- [ ] Están publicadas las 6 páginas nuevas y el sitio suma 9 páginas institucionales (meta del Excel para la Etapa 1).
- [ ] El menú de 6 rubros funciona en escritorio y móvil, con 0 enlaces muertos verificados en CI.
- [ ] Al menos 5 páginas tienen title y meta description propios (meta del Excel; el plan entrega 9).
- [ ] Lighthouse móvil de 72 o más en rendimiento para la home (meta del Excel; hoy 68).
- [ ] axe reporta 0 errores críticos o serios en las 6 páginas nuevas.
- [ ] El formulario de suscripción da de alta con doble confirmación y los 6 eventos de analítica llegan a GA4.
- [ ] La Coordinación General aprobó copy y diseño en el preview.

La meta de 150 suscriptores al cierre depende de la promoción, no del sitio; el plan solo garantiza que la captura funcione en 4 puntos (home, footer, `/unete` y `/eventos`).

## 10. Decisiones, dependencias y riesgos

Hay 10 decisiones abiertas; varias vienen de contradicciones entre los propios documentos. Este plan ya asume la recomendación de cada una, así que cerrarlas no cambia el alcance, solo lo confirma.

| #   | Decisión                                                  | Contradicción u opciones                               | Recomendación                                                                              | Decide       |
| --- | --------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------ |
| D1  | Menú de 6 rubros (decisión 4 del DG, abierta desde julio) | Hoja 2: con Eventos. Hoja 3: con Agenda y sin Eventos  | Acerca de · Recursos · Eventos · Membresía · Comunidad · Únete; Agenda dentro de Acerca de | DG           |
| D2  | Destino del botón Únete                                   | Hoja 2: `/membresia`. Hoja 3: `/unete`                 | `/unete` en E1; se revisa cuando exista `/membresia` en E3                                 | DG + CG      |
| D3  | Tipografía                                                | Montserrat (sitio) o Poppins (Concepto NOSOTROS)       | Montserrat                                                                                 | DG           |
| D4  | Valores de color                                          | Sitio y logo, o lámina 16 de la presentación           | Sitio y logo; actualizar el Design System                                                  | CG           |
| D5  | Nombre visible de la marca                                | 3 variantes en el sitio y los documentos               | "ASPAL — Asociaciones Profesionales de Latinoamérica"                                      | DG           |
| D6  | Estructura de Qué hacemos                                 | Hoja 1: 3 unidades. Hoja 2 y Concepto: 4 pilares       | 4 pilares                                                                                  | CG           |
| D7  | Año de fundación en el copy                               | Documento Nosotros: 2024. Presentación, lámina 7: 2016 | Confirmar antes de publicar Nosotros                                                       | DG           |
| D8  | Endpoint de suscripción                                   | Formulario embebido del proveedor o API propia         | API propia hacia Mailchimp, sin guardar datos                                              | Antonio      |
| D9  | Acceso al contenido de WordPress                          | MemberPress bloquea 15 de 15 posts al público          | Blog y podcast abiertos; solo recursos premium con muro                                    | DG + Antonio |
| D10 | Etapa del footer                                          | Hoja 5: Etapa 1. Hoja 2: Etapa 2                       | Etapa 1: sin él el menú nuevo queda incoherente                                            | CG           |

**Insumos que el equipo web necesita en la semana 0:**

- Retratos de Luis, Patricia y Antonio, y sus bios (decisión 8 del DG).
- Contenido de las 7 etapas del Mapa de Ruta y su URL actual: el Excel lo marca "Activo", pero no está en este repositorio.
- Dossier ASPAL 2026 diseñado en PDF.
- Logos en alta de WUP, ANPR y Parksys, y fotos reales de eventos para hero y mosaico.
- De la Etapa 0: páginas `/contacto`, `/aviso-privacidad` y `/terminos`, contenedor GTM y rebranding del chatbot (vive fuera de este repositorio).

| Riesgo                                                                                                           | Probabilidad | Impacto | Mitigación                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------- | ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Las decisiones del DG no se cierran a tiempo                                                                     | Alta         | Alto    | Publicar con las recomendaciones de la CG: menú y copy viven en `navegacion.ts` y `content/`, así que ajustarlos después toma minutos  |
| Las fotos del equipo no llegan                                                                                   | Media        | Medio   | Silueta con el hexágono ASPAL y reemplazo sin tocar código                                                                             |
| El muro de MemberPress sigue activo                                                                              | Alta         | Medio   | La home muestra solo título e imagen de cada post; se resuelve con D9                                                                  |
| El prerender choca con wouter o framer-motion                                                                    | Media        | Medio   | Plan B: prerenderizar solo el `<head>` de cada ruta (title, meta y OG) y dejar el cuerpo en cliente                                    |
| El menú en español no cabe entre 1024 y 1180 px                                                                  | Media        | Bajo    | Probar con copy real en la semana 1; si no cabe, panel móvil hasta 1180 px                                                             |
| Spam en el formulario                                                                                            | Media        | Bajo    | Campo trampa, límite por IP y doble confirmación                                                                                       |
| El resto del calendario del Excel ya venció (Etapas 2 y 3 terminaban el 30 sep)                                  | Alta         | Alto    | Re-calendarizar las Etapas 2 a 5 al cerrar la Etapa 1                                                                                  |
| El Excel asume plugins de WordPress (Yoast, The Events Calendar, WP Job Manager) y el dominio principal es React | Alta         | Medio   | No afecta a la Etapa 1. Antes de la Etapa 3, decidir si eventos, bolsa y biblioteca se sirven desde WordPress o se integran por su API |

## 11. Matriz de seguimiento de la Etapa 1

El plan cubre las 15 tareas de la Etapa 1: 10 por completo y 5 en parte, porque dependen de insumos externos al sitio (fotos, Dossier, contenido del Mapa de Ruta) o de etapas posteriores. De las 5 metas de la etapa, cubre 3 por completo, 1 en parte y deja fuera la de episodios de podcast, que es producción de contenido.

### Tareas

| ID    | Tarea de la Etapa 1                                                 | Origen en el Excel         | Prioridad | Cobertura | Dónde se cubre / qué falta                                                                                 | Estado    |
| ----- | ------------------------------------------------------------------- | -------------------------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| E1-01 | Menú de nivel 1 de 6 rubros                                         | H2 #1 · H4 D4 · H5         | P1        | Completa  | §5 · RF-01 · RF-03                                                                                         | Pendiente |
| E1-02 | Mega-menú Recursos: Aprende · Certifícate · Participa · Conecta     | H2 #2                      | P1        | Completa  | §5 · RF-02                                                                                                 | Pendiente |
| E1-03 | Botón Únete persistente                                             | H2 #4 · H5                 | P1        | Completa  | §5 · RF-04; destino `/unete` (D2)                                                                          | Pendiente |
| E1-04 | Homepage institucional, no SaaS                                     | H1 #3 · H5                 | P1        | Completa  | §6.1 · RF-13 · RF-15                                                                                       | Pendiente |
| E1-05 | Hero con la tagline "La red en español del sector asociativo LATAM" | H2 #6                      | P1        | Completa  | §6.1                                                                                                       | Pendiente |
| E1-06 | Publicar `/nosotros` con los 10 bloques                             | H1 #4 · H2 #7 · H3 #1 · H5 | P1        | Completa  | §6.2 · RF-07; confirmar año de fundación (D7)                                                              | Pendiente |
| E1-07 | Subpáginas del menú Nosotros / Acerca de                            | H2 #7                      | P1        | Parcial   | §5 · §6.2. Arquitectura completa; 5 de 9 destinos quedan "Próximamente" porque el Excel los ubica en E2–E5 | Pendiente |
| E1-08 | Publicar `/que-hacemos` con los 4 pilares                           | H1 #5 · H2 #8 · H3 #2 · H5 | P1        | Completa  | §6.3 · RF-08 (D6)                                                                                          | Pendiente |
| E1-09 | Dossier ASPAL 2026 en PDF descargable                               | H2 #8 · H2 #22 · H5        | P2        | Parcial   | §6.3 · RF-06. La web queda lista; el PDF lo producen CG y diseño                                           | Pendiente |
| E1-10 | Publicar `/nuestro-equipo` con fotos profesionales                  | H1 #6 · H2 #9 · H3 #3 · H5 | P2        | Parcial   | §6.4. Página completa; las fotos dependen de la sesión (decisión 8 del DG)                                 | Pendiente |
| E1-11 | Mapa de Ruta como CTA principal de la home                          | H2 #21 · H5                | P2        | Completa  | §6.1 · RF-12                                                                                               | Pendiente |
| E1-12 | Página `/mapa-de-ruta` en el dominio principal                      | H3 #13                     | —         | Parcial   | §6.5. Plantilla lista; falta el contenido de las 7 etapas                                                  | Pendiente |
| E1-13 | `/unete` con formulario de suscriptor gratuito                      | H3 #41                     | —         | Completa  | §6.6 · RF-05 (D8)                                                                                          | Pendiente |
| E1-14 | Rediseño del footer                                                 | H5 (H2 #50 lo ubica en E2) | P2        | Completa  | §6.7 (D10)                                                                                                 | Pendiente |
| E1-15 | Unificación de dominios, parte del sitio principal                  | H1 #2 (Etapa 0–1)          | P1        | Parcial   | RF-11 · RF-17. Rutas propias, redirecciones y 404; la migración de comunidad sigue en E0 y E2              | Pendiente |

### Metas de la Etapa 1 (hoja 5, KPIs al cierre)

| ID   | Meta                                 | Cobertura   | Dónde se cubre / qué falta                                                                   | Estado    |
| ---- | ------------------------------------ | ----------- | -------------------------------------------------------------------------------------------- | --------- |
| M-01 | 9 páginas institucionales publicadas | Completa    | §9: 6 nuevas + contacto, aviso de privacidad y términos de la Etapa 0                        | Pendiente |
| M-02 | 5 páginas con meta description       | Completa    | RF-10: el plan entrega 9                                                                     | Pendiente |
| M-03 | Lighthouse de 72 en rendimiento      | Completa    | RF-15                                                                                        | Pendiente |
| M-04 | 150 suscriptores del boletín         | Parcial     | RF-05. La captura queda lista en 4 puntos; la cifra depende de la promoción                  | Pendiente |
| M-05 | 5 episodios de podcast publicados    | No cubierta | Producción de contenido, fuera del alcance web; `/podcast` los muestra en cuanto se publican | Pendiente |

Origen: H1 = hoja "1. Resumen Jul 2026", H2 = "2. Auditoría ASAE-ANPR-ASPAL", H3 = "3. Estructura ideal", H4 = "4. Decisiones DG", H5 = "5. Plan Jul-Dic 2026" del archivo `ASPAL_Auditoria_Web_v4_Julio2026.xlsx`. Las tareas de la Etapa 0 (chatbot, legales, GTM, contacto) son dependencias, no parte de esta matriz.

## 12. Qué se puede avanzar sin Patricia y Luis

El código puede arrancar hoy: las 15 tareas se pueden empezar, 5 no dependen de nadie, 6 solo esperan un visto bueno antes de pasar a producción y 4 esperan contenido (fotos, Dossier, Mapa de Ruta). La regla: todo se construye con las recomendaciones de este plan y se integra en `staging`; nada llega a `main` sin la aprobación de Patricia (copy y diseño) y de Luis (D1, D5 y D7).

| ID    | Tarea                                | Arranque         | Qué se hace ya                                                                      | Qué queda esperando                                                |
| ----- | ------------------------------------ | ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| E1-02 | Mega-menú Recursos                   | Sin dependencias | Componente completo, con teclado y lectores de pantalla                             | —                                                                  |
| E1-05 | Hero con la nueva tagline            | Sin dependencias | Hero completo; la tagline ya está aprobada en la auditoría                          | Foto de evento opcional: se puede lanzar con el motivo hexagonal   |
| E1-07 | Subpáginas de Acerca de              | Sin dependencias | Submenú completo con sus "Próximamente"                                             | —                                                                  |
| E1-11 | Mapa de Ruta como CTA de la home     | Sin dependencias | Botón, banda y evento de analítica                                                  | —                                                                  |
| E1-15 | Dominios: rutas, 404 y redirecciones | Sin dependencias | Todo: es trabajo técnico                                                            | —                                                                  |
| E1-01 | Menú de 6 rubros                     | Solo visto bueno | Menú completo con la composición recomendada                                        | Luis aprueba D1                                                    |
| E1-03 | Botón Únete persistente              | Solo visto bueno | Botón en todas las rutas hacia `/unete`                                             | Confirmar D2                                                       |
| E1-06 | Página `/nosotros`                   | Solo visto bueno | Los 10 bloques con el copy del Concepto NOSOTROS, que ya es final                   | Luis confirma el año de fundación (D7); el Consejo aprueba el copy |
| E1-08 | Página `/que-hacemos`                | Solo visto bueno | Página completa con los 4 pilares                                                   | Patricia confirma D6                                               |
| E1-13 | `/unete` y suscripción               | Solo visto bueno | Formulario y endpoint probados con un proveedor simulado; D8 la decide Antonio      | Clave y lista de Mailchimp de quien administre la cuenta           |
| E1-14 | Footer                               | Solo visto bueno | Footer completo                                                                     | Patricia confirma D10                                              |
| E1-04 | Homepage institucional               | Espera contenido | Estructura y 8 bandas; el bloque de contenido reciente muestra solo título e imagen | Fotos reales de eventos; D9 para mostrar extractos                 |
| E1-09 | Dossier PDF                          | Espera contenido | Botón de descarga oculto hasta que exista el archivo, con su evento                 | El PDF (Patricia y diseño)                                         |
| E1-10 | Página `/nuestro-equipo`             | Espera contenido | Página con las bios del Concepto y siluetas                                         | Retratos y bios finales                                            |
| E1-12 | Página `/mapa-de-ruta`               | Espera contenido | Plantilla; y el contenido, si ya está publicado en la plataforma de comunidad       | Las 7 etapas, si no están publicadas en ningún lado                |

**Orden de trabajo mientras no haya decisiones** (sustituye al orden de PRs de la sección 8):

1. **PR A — Cimientos.** `lib/rutas.ts` con el test de enlaces muertos; `lib/marca.ts` con nombre, contacto y redes en un solo lugar, para que D5 sea un cambio de una línea; `lib/analitica.ts`; los 3 tokens nuevos; mudar la home actual a `/plataforma`.
2. **PR B — SEO, prerender y 404.** Antes era el PR 7. No depende de contenido y es el mayor riesgo técnico del plan, así que conviene probarlo primero.
3. **PR C — Navegación.** Header con mega-menú y footer, con la composición recomendada.
4. **PR D — Componentes.** Banda, HeroInstitucional, PilarCard, TarjetaCompromiso, RutaTimeline, PerfilCard, MuroAliados, SubnavSeccion, PaginaProximamente y FormSuscripcion.
5. **PR E — Páginas con copy ya documentado.** `/nosotros`, `/que-hacemos`, `/nuestro-equipo` y `/unete` con su API.
6. **PR F — Home y Mapa de Ruta**, con imágenes optimizadas y el contenido que haya.

**Una corrección al plan:** `/eventos` se construye con texto genérico ("calendario y webinars próximamente"). El pre-anuncio del Encuentro CDMX 2027 es la decisión 10 del DG, aún abierta, con fecha límite el 15 de octubre.

**Lo que sí espera a cada quien:**

- **Luis (DG):** D1 menú, D3 tipografía, D5 nombre visible, D7 año de fundación, D9 acceso al contenido de WordPress (con Antonio), pre-anuncio del Encuentro y presupuesto de fotografía.
- **Patricia (CG):** aprobación de copy y diseño en los previews, D4, D6 y D10, Dossier en PDF, contenido del Mapa de Ruta, fotos, logos de aliados y bios finales.

Este archivo es la copia del plan que lee Claude Code; la versión viva está en el enlace del inicio.
