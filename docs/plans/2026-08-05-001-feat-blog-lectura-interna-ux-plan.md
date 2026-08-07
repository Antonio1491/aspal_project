---
title: Lectura interna y rediseño UX del blog
type: feat
status: active
date: 2026-08-05
origin: docs/brainstorms/2026-08-05-blog-ux-brainstorm.md
---

# feat: Lectura interna y rediseño UX del blog

## Resumen

Llevar la lectura de artículos dentro del sitio (`/blog/:slug`), retirar el
filtro de categorías que hoy falla 6 de cada 7 veces, sacar los podcasts de la
rejilla del blog y rehacer la experiencia de lectura del artículo para que
sirva a la prioridad número uno del proyecto: captar socios.

Origen y razonamiento completo en
[docs/brainstorms/2026-08-05-blog-ux-brainstorm.md](../brainstorms/2026-08-05-blog-ux-brainstorm.md).

Prioridades acordadas, por orden: **captar socios nuevos → construir autoridad
de sector → servir a los socios actuales**. Diseño **móvil primero**, porque no
hay analítica fiable y es la apuesta que menos perdona equivocarse.

## Problema

Tres fallos verificados contra la API real, no supuestos:

**El filtro de categorías no filtra.** `blog.tsx` declara siete categorías a
mano (Arquitectura, Comunidad, Innovación, Tecnología, Diseño, General).
WordPress solo tiene dos: `Blog` (7 posts) y `Podcast` (8, id=3). Ninguna
coincide, así que todo chip que no sea "Todos" lleva a un resultado vacío.
`getCategoryColor` en `BlogCard` apuesta por un tercer juego distinto: las tres
listas están desalineadas entre sí.

**El mismo gesto lleva a dos sitios distintos.** El post destacado del hero
navega a `/blog/:slug`; las seis tarjetas de la rejilla abren WordPress en otra
pestaña. `blog-post.tsx` existe completo y casi nadie llega a él.

**La rejilla mezcla podcasts.** De 15 posts, 8 son episodios que ya tienen su
propia página.

Verificado contra la API:

```
categoría 'podcast' -> id=3
total posts publicados:            15
con categories_exclude=3:           7   <- artículos de blog reales
solo categoría podcast:             8
```

## Decisiones

Heredadas del brainstorm:

- **Destino interno** `/blog/:slug`. Coste asumido: se pierden los comentarios
  y la actividad de comunidad que viva en WordPress.
- **El filtro se retira**, no se arregla. Con una sola categoría no hay nada que
  filtrar. Vuelve cuando haya volumen y taxonomía real.
- **La insignia de categoría se retira con él**, por el mismo motivo: idéntica
  en todas las tarjetas, cero información en el punto más visible.
- **Los podcasts salen** de la rejilla. `PodcastCard` sigue enlazando fuera a
  propósito, y lo señala con `ExternalLink`.
- **El CTA de cierre pasa a captación.** Hoy dice "Ver más artículos".
- **Fuera de alcance:** newsletter, autores, series y buscador.

Resueltas durante la planificación:

| Decisión                         | Elegido                                 | Motivo                                                                                                   |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Slug de podcast en `/blog/:slug` | Redirigir a `/podcast`                  | El contenido existe, solo está en la sección equivocada. Evita además duplicar contenido sin `canonical` |
| Orden CTA / "sigue leyendo"      | **CTA el último**                       | La prioridad 1 es captación y la ley de pico-final exige que cierre él. Poner enlaces debajo lo entierra |
| Objetivos táctiles de 44 px      | Overrides locales del flujo de blog     | Subir `button.tsx` toca landing y podcast, fuera del alcance declarado. Se anota como deuda              |
| Vacío frente a error             | **Se distinguen**                       | Ver nota de arquitectura abajo                                                                           |
| Metadatos por página             | Solo `<title>`; sin vista previa social | Ver consecuencias asumidas abajo                                                                         |

### Nota de arquitectura: se relaja la degradación a vacío

`CLAUDE.md` documenta hoy que los endpoints degradan a lista vacía ante un fallo
de WordPress, con la justificación de que _"la landing tiene que renderizar
aunque el blog no responda"_.

**Esa justificación es falsa:** está verificado que `home.tsx` no consume la
API. Solo `blog.tsx` y `blog-post.tsx` la consumen. La política protege a un
consumidor que no existe y, a cambio, hace que "WordPress caído" y "no hay
artículos publicados" lleguen al cliente como el mismo array vacío.

Este plan cambia la política: `shared/wordpress/client.ts` deja de tragarse los
errores y `routes.ts` los traduce a un 5xx. **`CLAUDE.md` debe actualizarse en
la misma fase**, o la regla escrita contradirá al código.

## Fases

### Fase 0 — Datos y resiliencia

Todo en `shared/`, siguiendo la regla de `CLAUDE.md` de que la lógica de
WordPress no se reimplementa en los consumidores.

- [ ] `shared/wordpress/client.ts`: extraer `resolvePodcastCategoryId()` del
      interior de `fetchPodcasts` y reutilizarlo en ambos sitios.
      **No codificar `3` a mano:** dejaría dos fuentes de verdad y, si la
      categoría se recrea en WordPress, los podcasts reaparecerían en la rejilla
      en silencio — justo el fallo que este plan viene a eliminar.
- [ ] `fetchPosts` pasa a excluir esa categoría con `categories_exclude`.
- [ ] Dejar de degradar a `[]`: propagar el error y que `routes.ts` devuelva
      5xx. Actualizar `CLAUDE.md` en el mismo commit.
- [ ] `shared/wordpress/transform.ts`: calcular `readingMinutes` **una sola vez**
      sobre el texto ya limpio con `stripHtml`, y añadirlo a `TransformedPost`.
      Hoy `estimateReadTime` está duplicado en `blog.tsx:45` y `BlogCard.tsx:31`,
      y opera sobre HTML crudo: cada `<img src="…" class="…" alt="…">` cuenta
      como ~6 palabras, así que el dato está inflado de forma desigual. La
      retirada de la insignia lo asciende a metadato principal de la tarjeta:
      no puede ser un dato falso.
- [ ] `transform.ts`: dejar de añadir `"..."` incondicionalmente al extracto.
      Con extracto vacío la tarjeta muestra literalmente `"..."`.
- [ ] Usar `date_gmt` en lugar de `date`. Sin zona horaria se parsea como hora
      local del navegador y la fecha puede diferir un día entre husos
      latinoamericanos.
- [ ] Error boundary alrededor de `<Router>` en `App.tsx`. Hoy
      `format(new Date(publishedAt))` lanza `RangeError` con una fecha
      malformada y **tumba la aplicación entera a pantalla en blanco**. El
      backend se blinda con cuidado y el cliente cae por un `format()`.

**Verificación:** `npm run check` · los tres endpoints responden · `/api/posts`
devuelve 7 y ninguno de categoría `Podcast` · con `WP_API_BASE` apuntando a un
host inválido, `/api/posts` devuelve 5xx y no `200 []`.

### Fase 1 — Navegación interna, retirada del filtro, scroll y foco

- [ ] `BlogCard.tsx`: `<a href={post.link} target="_blank">` → `<Link href={`/blog/${post.slug}`}>`.
- [ ] Cambiar el icono `ArrowUpRight` por `ArrowRight`. `ArrowUpRight` es el
      símbolo de "abre fuera" y `PodcastCard` lo usa deliberadamente para eso.
      Mantenerlo diría "salgo del sitio" en tarjetas que ya no salen.
- [ ] `aria-label` con el título en el enlace de la tarjeta y `alt=""` en su
      imagen. Si no, el nombre accesible del enlace es la concatenación de
      imagen + tiempo + título + extracto + fecha: seis tarjetas producen seis
      párrafos en la lista de enlaces de un lector de pantalla.
- [ ] Retirar el filtro completo: `CATEGORIES`, `activeCategory`, el `useMemo`
      de filtrado y la sección "Temas de Interés" entera.
- [ ] Retirar la insignia de `BlogCard` y `getCategoryColor`.
- [ ] Retirar `post.category` también de **`blog.tsx:128`** (metadatos del
      destacado) y **`blog-post.tsx:103`** (insignia de cabecera). La
      especificación original solo mencionaba `BlogCard`; si estos dos se
      quedan, dirán "Blog" en el 100% de los casos.
- [ ] Añadir un `<h2>` que nombre la rejilla ("Últimos artículos"), visible o
      `sr-only`. Con la sección de temas se va el único encabezado de la zona y
      la rejilla queda como un bloque anónimo para navegación por encabezados.
- [ ] Reasignar el espaciado vertical: la rejilla tiene `pb-16 md:pb-24` **sin
      padding superior** porque hoy lo aporta la sección que se elimina. Sin
      esto, la primera fila queda pegada a la onda del hero.
- [ ] Post destacado solo si hay **2 o más** artículos. Con 1, hoy se lo come el
      destacado y debajo aparece "no hay artículos": la página se contradice.
- [ ] Sacar el `<h1>` fuera del panel condicional (`blog.tsx:82`). Con 0
      artículos la página se queda **sin `<h1>`** y con una caja de color vacía
      de 420 px.
- [ ] Tres estados distintos, no uno: cargando · cargado con 0 artículos
      ("Todavía no hay artículos publicados") · fallo de carga ("No hemos podido
      cargar los artículos" + botón **Reintentar** con `refetch()`). El copy
      actual, _"No hay artículos en esta categoría"_, queda huérfano: menciona
      una categoría que ya no existe y sería lo que vería el usuario con el
      backend caído.
- [ ] Esqueletos con la silueta de la tarjeta real, no bloques `h-96` grises.
- [ ] **Restauración de scroll.** Componente nuevo — `ScrollToTop.tsx` es un
      botón flotante, el nombre está ocupado; usar `ScrollRestoration`.
      Requisitos: - Distinguir navegación nueva (→ top) de POP (→ restaurar). Un
      `scrollTo(0,0)` en cada cambio de ruta **rompe el botón Atrás**. - `history.scrollRestoration = "manual"`: en `auto`, el navegador
      restaura mientras TanStack Query aún no ha resuelto, mide la altura del
      esqueleto y clampa el scroll. Los dos mecanismos pelean. - Restaurar **después** de que los datos asienten, no en el efecto de ruta.
- [ ] Foco al `<h1>` del artículo con `tabIndex={-1}` tras navegar, y
      actualización de `document.title`. Hoy el foco cae a `<body>`: un usuario
      de teclado vuelve a recorrer todo el `Header` en cada navegación, y un
      lector de pantalla no anuncia nada.

> **Por qué esto es P0 y no pulido:** hoy el único enlace interno está a ~200 px
> del top, así que nadie notó que no hay reseteo de scroll. Cuando las seis
> tarjetas naveguen internamente, tocar la última (scroll ~2400 px en móvil)
> deja al usuario a 2400 px dentro del artículo nuevo: en el footer. Y el caso
> peor lo crea este mismo plan — "sigue leyendo" está al final por definición.

**Verificación:** ver criterios de aceptación 1-6 y 14.

### Fase 2 — Experiencia de lectura del artículo

- [ ] **Barra de progreso anclada al `<article>`**, no al documento:
      `(scrollY + innerHeight - articleTop) / articleHeight`, con clamp a [0,1].
      Si se calcula sobre `document.scrollHeight`, el denominador incluye
      Header, imagen, CTA, "sigue leyendo" y Footer: en un artículo corto el
      usuario **termina de leer con la barra al 35%** y la ley de Zeigarnik se
      invierte, empujándole a irse justo cuando debería llegar al CTA.
- [ ] Ocultarla si el contenido cabe en el viewport (`scrollHeight - clientHeight = 0`
      → división por cero → `NaN` en el `width`).
- [ ] `aria-hidden="true"`. El impulso natural es `role="progressbar"` con
      `aria-valuenow`, pero eso **inunda de anuncios** a un lector de pantalla
      que ya tiene su propio feedback de posición.
- [ ] Sin `transition` de anchura, en ambos modos de movimiento: debe responder
      al input directo, no ir con retraso respecto al scroll.
- [ ] `requestAnimationFrame` + listener `{ passive: true }`. `ScrollToTop.tsx:17`
      ya registra un listener sin `passive` ni throttle; un segundo con
      `setState` en cada evento produce jank en gama media.
- [ ] `ResizeObserver` sobre el artículo, y dimensiones o `aspect-ratio` en la
      imagen destacada. Sin esto, las imágenes de WordPress cargan tarde,
      cambian `scrollHeight` y **la barra retrocede mientras el usuario lee**.
- [ ] Decidir su posición respecto al `Header` sticky (`h-16`, `z-50`): dentro
      del header, o `top-16` con `z-[60]`. No es cosmético — determina si se ve.
- [ ] **"Sigue leyendo"**, no "artículos relacionados". Tras retirar el filtro no
      queda ninguna señal de relación: serán los más recientes. Llamarlos
      relacionados es la misma promesa incumplida que motivó retirar el filtro. - Excluir el artículo actual, o el usuario puede tocar una tarjeta que
      apunta a donde ya está y la página parecerá congelada. - Ocultar la sección entera si quedan 0. - Reutilizar la key `["/api/posts", { per_page: 7 }]` con su propio
      `queryFn`: comparte caché con la rejilla y sale gratis. **Atención:**
      `queryClient.ts:47` define un `queryFn` por defecto que hace
      `queryKey.join("/")`; una key con objeto sin `queryFn` propio pediría
      `/api/posts/[object Object]`.
- [ ] **CTA de captación, el último elemento de la página.** URL de registro
      (confirmar contra `Header.tsx:289`), con parámetros UTM. Sin UTM, la
      conversión del cambio que sirve a la prioridad 1 es imposible de medir ni
      siquiera desde WordPress — es lo más barato del plan y lo único que
      permitirá defender la decisión en la próxima iteración.
- [ ] Redirigir a `/podcast` si el post pertenece a la categoría podcast.
      `fetchPostBySlug` no filtra por categoría, así que excluirlos de
      `/api/posts` no los excluye de `/api/posts/:slug`. Hoy un episodio se
      renderizaría como artículo, con CTA de socios y con su iframe de
      reproductor desbordando en móvil (`prose` no tiene regla para iframes).
- [ ] `retry` con backoff para las queries del blog. Con `retry: false` y
      `staleTime: Infinity` (`queryClient.ts:50-51`), **un solo fetch fallido en
      una cobertura irregular muestra "El artículo que buscas no existe o ha
      sido eliminado"** — y queda cacheado toda la sesión. Le decimos al usuario
      que el artículo no existe cuando existe. Hoy casi no se dispara; con este
      plan `/blog/:slug` pasa a ser la única ruta de lectura del sitio.
- [ ] Separar el 404 real ("no existe") del fallo de carga ("no se pudo cargar,
      reintentar").
- [ ] `max-w-[65ch]` para la prosa. Hoy `prose-lg max-w-none` dentro de
      `max-w-4xl` da ~110 caracteres por línea, muy por encima del rango legible
      de 45-75. Para un público con sesgo de edad mayor es de lo más rentable.
- [ ] Reglas de desbordamiento para tablas, `<pre>` e iframes del contenido de
      WordPress: sin ellas provocan scroll horizontal de toda la página en móvil.
- [ ] Imagen destacada condicional: `transform.ts` deja cadena vacía si no hay
      `wp:featuredmedia` ni `<img>` en el cuerpo, y `<img src="">` **solicita la
      propia página** y pinta el icono de imagen rota, a ancho completo.
- [ ] Limitar el tamaño del título del artículo en móvil (`text-6xl` sin tope
      puede ocupar la pantalla entera antes del primer párrafo).

### Fase 3 — Accesibilidad, movimiento y documento

- [ ] `client/index.html`: `lang="en"` → `lang="es"`. Un lector de pantalla lee
      español con motor de pronunciación inglesa: ininteligible.
      **WCAG 3.1.1, nivel A.**
- [ ] Quitar `maximum-scale=1` del viewport: bloquea el pinch-zoom.
      **WCAG 1.4.4, nivel AA.** Es el ajuste que más usa el perfil de edad que
      describe el brainstorm.
- [ ] Añadir `<title>` — hoy **no existe ninguno**, la pestaña muestra la URL
      cruda — y título por página.
- [ ] Arreglar el favicon. `index.html` apunta a
      `/attached_assets/Aspal-Icono_1763675356866.png`, que devuelve **200 con
      `Content-Type: text/html`**: es el fallback del SPA sirviendo `index.html`
      donde el navegador espera un PNG. `client/public/favicon.png` existe,
      funciona y no lo referencia nadie. (Roto desde antes de la
      reestructuración: Vite sirve `/` desde `client/public/`, y
      `client/public/attached_assets/` nunca existió.)
- [ ] **`prefers-reduced-motion` necesita dos mecanismos, no uno:** - framer-motion → `<MotionConfig reducedMotion="user">` en `App.tsx`. - CSS de Tailwind (`animate-pulse`, `transition-*`, `hover:scale-105`) →
      `@media (prefers-reduced-motion: reduce)` en `index.css`, que hoy **no
      tiene ninguna** (0 coincidencias en 330 líneas). - Y un tercero que escapa a ambos: `window.scrollTo({behavior:"smooth"})`
      en `ScrollToTop.tsx:25` es animación en JS que la media query no cubre.
- [ ] **Blindar el modo de fallo:** las tarjetas arrancan en `opacity: 0`
      esperando la animación. Si se desactiva sin fijar el estado final, **el
      contenido queda invisible para siempre** justo para quien activó la
      preferencia por motivos médicos.
- [ ] Reflejar cada `group-hover:` de `BlogCard` con su `group-focus-within:`.
      Hoy la tarjeta comunica interactividad con cinco efectos exclusivos de
      hover; un usuario de teclado recibe una fracción de la señal.
- [ ] Objetivos táctiles de 44 px en el flujo de blog mediante overrides
      locales. Medidas reales de `button.tsx`: `default` 36 px · `sm` 32 px ·
      `lg` 40 px · `icon` 36 px — **ninguna llega**. Afecta a "Volver al blog",
      al CTA de cierre, al menú móvil y a `ScrollToTop`.
- [ ] `aria-label` en `ScrollToTop` (icon-only: hoy se anuncia como "botón" a
      secas) y revisar `hidden lg:block`, que lo hace invisible en móvil justo
      cuando este plan alarga las páginas.
- [ ] `not-found.tsx` al español. Hoy dice _"404 Page Not Found"_ y
      _"Did you forget to add the page to the router?"_ — texto de desarrollador
      en producción — con colores `bg-gray-50`/`text-gray-900` codificados que
      rompen el modo oscuro, y sin `Header` ni `Footer`, o sea sin salida.
      Viola la regla de `CLAUDE.md` de que toda la UI está en español.

## Leyes de UX aplicadas

Trasladadas del brainstorm, ajustadas a lo que se descubrió al planificar.

| Zona           | Ley                     | Cómo se materializa                                                                  |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| Descubrimiento | **Hick**                | Cero opciones que sopesar: con 7 artículos la rejilla se abarca de un vistazo        |
| Descubrimiento | **Jakob**               | Un filtro debe filtrar; retirarlo cumple la expectativa mejor que dejarlo vacío      |
| Rejilla        | **Doherty** (<400 ms)   | Esqueletos con la silueta real, y navegación instantánea sembrando desde la caché    |
| Rejilla        | **Posición serial**     | Destacado en cabeza, CTA al pie                                                      |
| Rejilla        | **Proximidad**          | Fecha y tiempo de lectura agrupados en el hueco que deja la insignia                 |
| Artículo       | **Pico-final**          | El CTA de captación es el último elemento de la página                               |
| Artículo       | **Zeigarnik**           | Barra de progreso anclada al artículo — anclada al documento haría lo contrario      |
| Artículo       | **Tesler**              | `readingMinutes` calculado en el servidor sobre texto limpio, no estimado sobre HTML |
| Artículo       | **Estética-usabilidad** | Longitud de línea legible: `65ch` en vez de ~110 caracteres                          |

## Casos límite

| Caso                           | Qué pasa hoy                                         | Qué debe pasar                                     |
| ------------------------------ | ---------------------------------------------------- | -------------------------------------------------- |
| 0 artículos                    | Hero vacío de 420 px, **página sin `<h1>`**          | Estado vacío con encabezado y copy honesto         |
| 1 artículo                     | Destacado arriba + "no hay artículos" debajo         | Sin destacado por debajo de 2                      |
| 8+ artículos                   | El 8.º **desaparece en silencio** (`per_page=7`)     | Definir umbral que obligue a paginación            |
| Fallo de WordPress             | Indistinguible de "no hay artículos"                 | Mensaje de error + Reintentar                      |
| Fetch fallido en `/blog/:slug` | "El artículo no existe", cacheado toda la sesión     | Reintento con backoff; 404 solo si es 404          |
| `featuredImage` vacío          | `<img src="">` solicita la propia página, icono roto | Ocultar el bloque de imagen                        |
| `excerpt` vacío                | La tarjeta muestra `"..."`                           | Sin sufijo si no hubo truncamiento                 |
| `content` vacío                | Barra `NaN`, "1 min lectura"                         | Ocultar barra; `readingMinutes` mínimo coherente   |
| `content` corto                | Barra al ~35% al terminar de leer                    | Anclada al `<article>`; oculta si cabe en viewport |
| Imágenes cargando tarde        | La barra retrocede mientras se lee                   | `ResizeObserver` + dimensiones en la imagen        |
| Fecha inválida                 | `RangeError` → **pantalla en blanco total**          | Error boundary + fecha defensiva                   |
| Slug de podcast                | Se renderiza como artículo con CTA de socios         | Redirección a `/podcast`                           |
| `/blog/` con barra final       | Cae en `:slug` vacío → "no encontrado"               | Redirección a `/blog`                              |
| Título muy largo               | `text-6xl` sin tope llena la pantalla en móvil       | Escala tipográfica con límite                      |

## Criterios de aceptación

**No hay runner de tests en el proyecto**, así que esto es lista de verificación
manual. Ver "Riesgos".

**Navegación**

- [ ] 1. Desde la última tarjeta de la rejilla en móvil: el artículo abre en el top, con el `<h1>` visible.
- [ ] 2. Atrás desde el artículo: la rejilla aparece con la tarjeta de origen en pantalla.
- [ ] 3. Atrás → Adelante: el artículo, otra vez en el top.
- [ ] 4. Enlace directo a `/blog/:slug` en pestaña nueva: carga sin pasar por `/blog`.
- [ ] 5. Desde "sigue leyendo" (al fondo): el artículo nuevo abre en el top y la barra arranca en 0.
- [ ] 6. F5 estando en `/blog/:slug`: funciona tras el build (`vercel.json` ya reescribe `/(.*)` → `/`).

**Estados**

- [ ] 7. Con `WP_API_BASE` a un host inválido: `/blog` muestra error con Reintentar, no "no hay artículos"; `/blog/:slug` no dice "no existe".
- [ ] 8. Con 0 y con 1 artículo: la página tiene `<h1>` y no se contradice.
- [ ] 9. Slug de podcast en `/blog/:slug`: redirige a `/podcast`.
- [ ] 10. Slug inexistente: 404 en español con salida clara.

**Barra de progreso**

- [ ] 11. Artículo más corto que el viewport: la barra no aparece (ni al 0%, ni al 100%, ni `NaN`).
- [ ] 12. Al llegar al final del **cuerpo del artículo** (no del footer): marca 100%.
- [ ] 13. Con imágenes cargando en 3G lento: la barra no retrocede.

**Accesibilidad**

- [ ] 14. Recorrido completo de `/blog` y `/blog/:slug` **solo con teclado**: cada elemento enfocado es visible y, tras navegar, el foco está en el contenido y no en `<body>`.
- [ ] 15. Lector de pantalla: se pronuncia en español, cada tarjeta se anuncia con su título y no con seis líneas, y el cambio de ruta se anuncia.
- [ ] 16. Pinch-zoom al 200% funciona en móvil.
- [ ] 17. Con `prefers-reduced-motion: reduce`: **todo el contenido es visible**, nada queda en opacidad 0, y no hay scroll suave.
- [ ] 18. Todo objetivo táctil del flujo mide ≥44 px, o la excepción queda documentada.
- [ ] 19. A 320 px de ancho: ningún artículo produce scroll horizontal.

**Puertas de calidad**

- [ ] 20. `npm run check`, `npm run lint`, `npm run format:check` y `npm run build` en verde.
- [ ] 21. `CLAUDE.md` actualizado con la nueva política de errores.

## Consecuencias asumidas

Escritas aquí para que nadie las descubra por sorpresa:

- **Se pierden los comentarios** y la actividad de comunidad que viva hoy en
  WordPress (heredado del brainstorm).
- **Compartir un artículo por WhatsApp o LinkedIn dará una vista previa vacía.**
  Los rastreadores sociales no ejecutan JavaScript: leen el HTML tal cual llega
  del servidor. Añadir `<title>` por página arregla la pestaña del navegador,
  **no** la vista previa. Arreglarla de verdad exige prerenderizado o servir
  HTML específico a rastreadores desde la función de Vercel. Hasta hoy lo cubría
  WordPress; este cambio se lo lleva sin sustituto. Decisión explícita: se
  aborda en un plan aparte.
- **Inconsistencia de tamaños de botón** entre el flujo de blog (44 px) y el
  resto del sitio (36-40 px), hasta que se suba el sistema.

## Riesgos

| Riesgo                                                                                                                                                 | Mitigación                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **No hay tests.** El plan añade comportamiento con estado (scroll, foco, progreso) que es justo lo que más se rompe en silencio                        | Los 21 criterios son verificación manual obligatoria. Recomendado —fuera de alcance— introducir Vitest + Testing Library antes de la siguiente iteración sobre esta zona |
| Relajar la degradación a vacío toca `shared/`, que consumen los dos entornos                                                                           | Verificar los tres endpoints en dev y el build de Vercel. `CLAUDE.md` en el mismo commit                                                                                 |
| La restauración de scroll es el punto más frágil: tres mecanismos que pelean (wouter, `scrollRestoration` del navegador, resolución de TanStack Query) | Fase propia, criterios 1-5 dedicados, probar en móvil real y no solo en el simulador                                                                                     |
| `per_page=7` codifica el número de artículos que hay hoy                                                                                               | Anotado como caso límite; definir el umbral de paginación antes de publicar el octavo                                                                                    |

## Preguntas abiertas

- **Disparador para recuperar el filtro.** Sigue sin acordarse (heredado del
  brainstorm). Sin criterio explícito, "retirado temporalmente" se convierte en
  "retirado".
- **URL exacta del CTA** y si abre en la misma pestaña o en otra. El `Header`
  usa `target="_blank"`; conviene decidir si el artículo hace lo mismo.
- **¿Tienen uso real los comentarios de WordPress?** Determina cuánto duele la
  consecuencia asumida.
- **Umbral de paginación:** ¿a partir de cuántos artículos?

## Fuentes

- **Brainstorm de origen:** [docs/brainstorms/2026-08-05-blog-ux-brainstorm.md](../brainstorms/2026-08-05-blog-ux-brainstorm.md)
  — decisiones heredadas: destino interno, retirada del filtro y de la insignia,
  podcasts fuera de la rejilla, CTA de captación al cierre, móvil primero.
- **Arquitectura:** [docs/architecture.md](../architecture.md)
- **Reglas para agentes:** [CLAUDE.md](../../CLAUDE.md) — la lógica de WordPress
  vive solo en `shared/`.
- **Validación contra la API real:** `categories_exclude=3` → 7 posts;
  `categories=3` → 8; total 15.

### Archivos implicados

`shared/wordpress/{client,transform,types,routes}.ts` ·
`client/src/pages/{blog,blog-post,not-found}.tsx` ·
`client/src/components/content/BlogCard.tsx` ·
`client/src/components/layout/ScrollToTop.tsx` (+ nuevo `ScrollRestoration`) ·
`client/src/{App.tsx,index.css}` · `client/src/lib/queryClient.ts` ·
`client/index.html` · `CLAUDE.md`
