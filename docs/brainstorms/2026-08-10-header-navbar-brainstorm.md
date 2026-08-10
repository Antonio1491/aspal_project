---
date: 2026-08-10
topic: header-navbar
---

# Rediseño del header y el menú de navegación

## Qué vamos a construir

Rehacer `client/src/components/layout/Header.tsx` partiendo de un hecho
incómodo: **el menú promete doce destinos y diez no llevan a ningún lado**.
El problema no es estético. Sobre esa base arreglada, aplicar mejoras de
arquitectura de información, jerarquía de conversión y accesibilidad.

Referencia visual aportada: el header de ANPR México (`navbar.png`). Se toma
su estructura y su claridad de CTA; no su paleta ni todos sus elementos.

Alcance acordado: **solo el header**. La franja superior de anuncios queda
fuera, aunque el componente se deja preparado para recibirla.

## Lo que la investigación destapó

**Diez de doce enlaces son cadáveres.** Comprobado cruzando los `href` de
`Header.tsx` contra las rutas de `App.tsx` y contra los `id` que existen de
verdad en `client/src/pages` y `client/src/components/sections`:

| Estado | Enlaces |
| --- | --- |
| Funcionan | `Blog`, `Podcast`, `Sé Miembro` |
| Ancla a una sección inexistente | `Biblioteca Digital`, `Cursos en Línea`, `Documentos`, `Comunidad`, `Directorio de Miembros`, `Directorio de la Industria`, `Eventos y Grupos`, `Bolsa de Trabajo → Home / Candidatos / Reclutadores` |

Ninguno de esos `id` (`#biblioteca`, `#cursos`, `#documentos`, `#comunidad`,
`#directorio-miembros`, `#directorio-industria`, `#eventos`, `#bolsa-home`,
`#candidatos`, `#reclutadores`) existe en el proyecto. Al hacer clic no ocurre
nada: ni navegación, ni error, ni aviso. Para un director de asociación
evaluando si vale la pena asociarse, eso se lee como sitio abandonado.

**El botón `Iniciar sesión` no tiene `onClick`.** `Header.tsx:303`. Es
decorativo.

**Hay dos URLs de registro conviviendo y una está rota.** El Hero apunta a
`https://asociacionesprofesionales.org/register/membresia-basica/` y el Header
a `https://comunidad.asociacionesprofesionales.org/register/membresia-basica/`.
Verificado por HTTP: la del Header sirve la página real de MemberPress
("Membresía Básica"); **la del Hero devuelve un documento vacío, sin título**.
La divergencia es exactamente el patrón que `CLAUDE.md` describe para
`server/` y `api/`, repetido en el cliente.

**Pero la plataforma de comunidad está viva.** Sondeando
`comunidad.asociacionesprofesionales.org` se encontraron cuatro secciones
reales que el menú daba por inexistentes:

| Sección | Ruta verificada | Título servido |
| --- | --- | --- |
| Comunidad | `/comunidad/` | Comunidad ASPAL |
| Directorio de Miembros | `/miembros/` | Miembros |
| Eventos y Grupos | `/grupos/` | Grupos |
| Cursos en Línea | `/cursos/` | Courses archivo |
| Login | `/login/` | Login |

Sin destino real: Biblioteca Digital, Documentos, Directorio de la Industria y
Bolsa de Trabajo. `/calendario/` existe pero es un *Calendario Editorial*
interno: no sirve como agenda pública.

El hallazgo invierte el balance del menú: **de 3 destinos vivos y 7 en gris,
a 7 vivos y 3 en gris**.

**`VideoModal` está duplicado.** `Header.tsx:23-95` reimplementa el mismo modal
de vídeo que ya vive en `HeroSection.tsx:48-84`. Son 72 líneas mantenidas por
partida doble.

## El público condiciona las decisiones

ASPAL le habla a directivos y personal de asociaciones profesionales de
Latinoamérica: gente que *gestiona* una asociación, no early adopters de SaaS.

- **Vienen a resolver, no a explorar.** El menú debe mapear tareas —asociarse,
  capacitarse, entrar a la comunidad, buscar contenido— y no el organigrama.
- **Sesgo de edad alto.** Objetivos táctiles ≥44px, contraste AA real, nada de
  gris claro a 12px. Hoy los ítems son `text-sm text-muted-foreground`.
- **El español alarga las etiquetas.** "Directorio de la Industria" son 26
  caracteres. Un menú centrado con cuatro grupos así se rompe entre 768px y
  1100px: hay que diseñarlo para eso, no descubrirlo después.
- **Institucional, no startup.** Hoy el elemento más llamativo del sitio es
  **"Ver Video"** en amarillo. El botón más valioso del header está gastado en
  un vídeo promocional en lugar de en la conversión que sostiene a la
  organización: asociarse.

## Qué se toma de la referencia y qué no

Se toma: menú corto de cuatro entradas, CTA primario único y explícito
(`Únete`), estado activo visible, y aire vertical mayor.

No se toma: el icono de "casa" como primer ítem —el logo ya enlaza a inicio,
es redundante—; el racimo de cuatro acciones a la derecha, que diluye el CTA;
ni su azul. La identidad de ASPAL es slate `hsl(206 31% 20%)` + amarillo miel
`hsl(42 93% 68%)`, el panal del logo, y funciona mejor que el azul ajeno.

Tampoco se toma el buscador. El sitio **no tiene búsqueda implementada**: una
lupa decorativa repetiría el pecado que este trabajo corrige. Entra cuando se
construya de verdad.

## Decisiones acordadas

1. **Los destinos sin página se quedan visibles, marcados "Próximamente".**
   Se descartó apuntarlos a la plataforma externa (no existen allí) y se
   descartó ocultarlos (un menú de tres ítems proyecta una organización mucho
   más pequeña de lo que ASPAL es). Mitigación del riesgo de "producto a medio
   terminar": cada desplegable abre con destinos vivos arriba y los
   "Próximamente" al fondo, de modo que se lean como hoja de ruta.
2. **Sin franja superior de anuncios.** El proyecto no tiene base de datos ni
   panel de administración, y sacar los eventos de WordPress exigiría un tipo
   de contenido que no consta que exista. El header se estructura para
   admitirla después sin rehacerlo.
3. **A la derecha solo `Iniciar sesión` y `Únete`.** "Ver Video" sale del
   header: el Hero ya lo ofrece como CTA secundario (`HeroSection.tsx:158`),
   así que no se pierde nada y se elimina el modal duplicado.

## Diseño

### Arquitectura de información

Tres entradas de menú en lugar de doce destinos sueltos. Cada ítem lleva una
descripción de una línea: el público no conoce el vocabulario interno del
proyecto.

**Aprende**
| Ítem | Descripción | Destino |
| --- | --- | --- |
| Blog | Artículos y análisis del sector | `/blog` (interno) |
| Podcast | Conversaciones con el sector | `/podcast` (interno) |
| Cursos en Línea | Capacitación para tu equipo | `comunidad.…/cursos/` ↗ |
| Biblioteca Digital | Documentos y recursos descargables | Próximamente |

**Comunidad**
| Ítem | Descripción | Destino |
| --- | --- | --- |
| Comunidad | El feed de la red ASPAL | `comunidad.…/comunidad/` ↗ |
| Directorio de Miembros | Quién es quién en la red | `comunidad.…/miembros/` ↗ |
| Eventos y Grupos | Agenda y grupos de trabajo | `comunidad.…/grupos/` ↗ |
| Directorio de la Industria | Proveedores y aliados | Próximamente |

**Bolsa de Trabajo** — enlace simple, marcado Próximamente.

Notas de la reorganización:

- **"Documentos" se absorbe en Biblioteca Digital.** Eran lo mismo con dos
  nombres.
- **"Bolsa de Trabajo" deja de ser desplegable.** Sus tres hijos —Home,
  Candidatos, Reclutadores— son navegación *interna* de una sección, no
  navegación de sitio.
- **"Eventos" no sube a primer nivel**, aunque el público lo justificaría: su
  destino real es una página titulada "Grupos". Prometer "Eventos" y aterrizar
  en "Grupos" es la misma desconexión que este trabajo corrige. Sube cuando
  exista agenda propia.
- **"Sé Miembro" desaparece del menú.** Apuntaba a la misma URL de registro
  que ahora sirve el botón `Únete`: mantener las dos sería ofrecer la misma
  acción dos veces en la misma barra, compitiendo entre sí.
- **Los enlaces externos se marcan** con icono ↗, `target="_blank"` y
  `rel="noopener noreferrer"`. El usuario debe saber que sale del sitio.
- **Cada destino lleva un icono descriptivo**, decorativo (`aria-hidden`) y
  siempre junto a la etiqueta escrita, nunca en su lugar. Se eligen siluetas
  distintas entre sí —periódico, micrófono, birrete, libros, bocadillos,
  personas, calendario, edificio, maletín— porque a 16px lo que separa un
  icono de otro es la forma, no el detalle. Aparecen dentro de los menús y en
  el panel móvil, **no en la barra superior**: ahí añadirían ruido y le
  restarían foco al único botón lleno.

### Estructura visual

- **Tres columnas reales**: `flex-1` en los laterales para que el menú quede
  ópticamente centrado. Hoy `justify-between` lo descentra.
- **Altura `h-16` → `h-20`** en escritorio, compactando a `h-16` al superar
  32px de scroll. Logo de `h-8` a `h-10`.
- **Un solo botón lleno en todo el header**: `Únete` en amarillo `secondary`.
  `Iniciar sesión` en ghost con texto slate.

### Estados

- **Ruta activa** con `useLocation()` de wouter: subrayado amarillo de 2px
  **más** peso tipográfico. Nunca el color como único canal.
- Hover en los desplegables con fondo `accent`, no solo cambio de texto.
- Ítems "Próximamente": `aria-disabled`, cursor por defecto, badge discreto.
  No se renderizan como `<a>`.

### Móvil

Es la parte más rota hoy: el menú es un `div` que empuja el contenido, sin
overlay, sin bloqueo de scroll, sin `Escape`, sin foco atrapado, y **no se
cierra al navegar** —se toca "Blog", cambia la página y el menú sigue abierto
encima—.

Pasa a ser un panel a pantalla completa que cierra al navegar, bloquea el
scroll del cuerpo, responde a `Escape`, atrapa el foco y fija `Únete` abajo a
ancho completo, al alcance del pulgar. Objetivos táctiles ≥44px.

### Accesibilidad

`<nav aria-label="Principal">`, `aria-current="page"` en la ruta activa,
`aria-expanded` en el toggle móvil, foco visible con `--ring` y contraste AA
verificado. `MotionConfig reducedMotion="user"` ya cubre framer-motion
globalmente desde `App.tsx`; mantenerlo.

### Limpieza incluida

- Se elimina `VideoModal` de `Header.tsx` (72 líneas duplicadas).
- Se corrige la URL rota del Hero y **ambas URLs pasan a un único módulo
  compartido**, para que no vuelvan a divergir:
  - `Únete` → `https://comunidad.asociacionesprofesionales.org/register/membresia-basica/`
  - `Iniciar sesión` → `https://comunidad.asociacionesprofesionales.org/login/`

## Fuera de alcance

Franja superior de anuncios, buscador, footer, y construir las páginas que hoy
faltan (Biblioteca Digital, Directorio de la Industria, Bolsa de Trabajo).

## Cómo se verifica

`npm run check` en verde, y en el navegador a 375px, 768px, 1024px y 1440px:
cada enlace vivo llega a su destino, ningún "Próximamente" es clicable, el
indicador de ruta activa acierta en `/`, `/blog`, `/blog/:slug` y `/podcast`,
y el panel móvil cierra al navegar.
