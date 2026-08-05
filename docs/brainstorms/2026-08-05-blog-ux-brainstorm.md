---
date: 2026-08-05
topic: blog-ux
---

# UX y diseño de la página de blog

## Qué vamos a construir

Rehacer la experiencia del blog partiendo de arreglar lo que está roto, y sobre
esa base aplicar mejoras de UX justificadas una a una. El objetivo por orden:
captar socios nuevos, construir autoridad de sector y servir a los socios
actuales.

Diseño móvil primero por prudencia (no hay analítica fiable todavía),
enriquecido en escritorio.

## Lo que la investigación destapó

Tres hallazgos que cambian el planteamiento. No eran deuda estética: la
experiencia está funcionalmente rota.

**El filtro falla 6 de cada 7 veces.** `blog.tsx` tiene siete categorías
escritas a mano (Arquitectura, Comunidad, Innovación, Tecnología, Diseño,
General). WordPress solo tiene dos: `Blog` (7 posts) y `Podcast` (8). Ninguna
coincide, así que todo chip que no sea "Todos" lleva a "No hay artículos en esta
categoría". `getCategoryColor` en `BlogCard` apuesta por un tercer juego
distinto — las tres listas están desalineadas entre sí.

**Las tarjetas expulsan al usuario del sitio.** `BlogCard` enlaza a
`post.link` con `target="_blank"` hacia WordPress, mientras `/blog/:slug` y
`blog-post.tsx` existen completos y solo los usa el post destacado. El mismo
gesto lleva a dos sitios distintos.

**La rejilla mezcla podcasts.** De 15 posts, 8 son de categoría `Podcast` y ya
tienen su propia página.

## Por qué este enfoque

Se consideraron tres caminos:

- **Rediseño editorial completo** (portada editorial, series, autores,
  newsletter). Descartado: 15 artículos no sostienen esa estructura. Se
  diseñaría para un volumen que no existe.
- **Solo capa de animación.** Descartado: animar un filtro que falla 6 de 7
  veces lo empeora, porque hace más visible algo que no funciona.
- **Arreglar cimientos y pulir con criterio.** Elegido. El grueso del valor sale
  de arreglar lo roto, que además es barato, y cada mejora encima es defendible
  y medible.

## Decisiones tomadas

- **Destino de las tarjetas: interno (`/blog/:slug`).** Unifica el gesto con el
  destacado, rescata `blog-post.tsx` y pone la experiencia de lectura bajo
  control propio, que es donde vive la prioridad de captación. Coste asumido:
  se pierden los comentarios y la actividad de comunidad que viva en WordPress.
- **El filtro de categorías se retira.** Quitando los podcasts solo queda la
  categoría `Blog`: siete artículos bajo una etiqueta. Un filtro de un elemento
  no es un filtro, y dejarlo roto o vacío cuesta más credibilidad que no
  tenerlo. Vuelve cuando haya volumen y una taxonomía real en WordPress —
  momento en que las categorías se derivarán de los datos, nunca a mano.
- **La insignia de categoría desaparece con él.** Si todos los artículos son
  `Blog`, la insignia es idéntica en todas las tarjetas: ocupa el punto más
  visible para transmitir cero información. Ese espacio pasa a lo que sí varía
  (tiempo de lectura y fecha), que es justo lo que usa un lector con poca
  agenda para decidir si abre algo. `getCategoryColor` se retira con ella.
- **Los podcasts salen de la rejilla del blog.** Ya tienen `/podcast`.
- **El CTA de cierre del artículo pasa a captación.** Hoy dice "Ver más
  artículos", que sirve a la prioridad 2 desde el punto de máxima atención.
- **Móvil primero.** Sin datos, es la apuesta que menos perdona equivocarse.
- **Fuera de alcance:** newsletter, autores, series y buscador. Con este volumen
  un buscador es peor que un filtro que funcione.

## Leyes de UX aplicadas, por zona

### Descubrimiento

Al retirarse el filtro, estas leyes dejan de aplicarse a unos chips y pasan a
justificar por qué no los hay.

| Ley       | Decisión                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hick**  | Cero opciones que sopesar. Con siete artículos, la rejilla completa se abarca de un vistazo: filtrar no ahorra trabajo, lo añade            |
| **Jakob** | Un filtro debe filtrar. Retirarlo cumple la expectativa mejor que mantenerlo vacío, y la credibilidad es el producto de quien cobra cuota   |
| **Fitts** | Se aplica ahora al objetivo que queda: la tarjeta entera es el área pulsable, y los objetivos táctiles del artículo van a 44 px como mínimo |

Cuando el filtro vuelva, estas tres leyes gobiernan su diseño: opciones
derivadas de los datos, ninguna que lleve a un resultado vacío y chips de 44 px.

### Rejilla y escaneo

| Ley                      | Decisión                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Posición serial**      | Se recuerda lo primero y lo último: el destacado ya aprovecha la cabeza, el pie de la rejilla está desaprovechado |
| **Doherty** (<400 ms)    | Los skeletons existen pero son bloques grises sin la silueta de la tarjeta; el salto al cargar es brusco          |
| **Miller**               | Cargas de 6-9 artículos, no 15 de golpe                                                                           |
| **Proximidad (Gestalt)** | Agrupar metadatos (categoría, fecha, tiempo de lectura) para que el ojo los lea como un bloque                    |

### Artículo — donde vive la prioridad de captación

| Ley                       | Decisión                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Pico-final** (Kahneman) | El cierre es el único momento de atención plena garantizada: ahí va la invitación a asociarse           |
| **Zeigarnik**             | Barra de progreso de lectura: lo incompleto genera tensión de completarse, y quien termina llega al CTA |
| **Tesler**                | El tiempo de lectura estimado traslada complejidad del usuario al sistema                               |
| **Estética-usabilidad**   | En decisiones de gasto institucional, lo cuidado se percibe como fiable                                 |

### Transversal: accesibilidad

Público directivo con sesgo de edad mayor, y organizaciones que a menudo tienen
obligaciones formales de accesibilidad. Hoy los chips son `<button>` sin
`aria-pressed` y las tarjetas no tienen `focus-visible`: recorrer la página con
teclado es una experiencia muda.

### Regla que gobierna las animaciones

Ninguna decorativa: cada una comunica **estado, jerarquía o continuidad**, o se
cae. `prefers-reduced-motion` se respeta sin excepción — parte del público lo
tiene activado por motivos médicos, no por preferencia.

## Preguntas abiertas

- **Orden de prioridad sin confirmar del todo.** Se asumió captación >
  autoridad > socios actuales, que es el orden en que se listaron las opciones.
  Conviene confirmarlo: mueve el peso del diseño, no el análisis.
- **No hay analítica.** Se decidió móvil primero por prudencia. Merece medirse
  para decidir con datos en la próxima iteración.
- **Comentarios de WordPress.** Al pasar a lectura interna se pierden. Falta
  saber si hoy tienen uso real.
- **Cuándo recuperar el filtro.** Queda retirado, no cancelado. Falta acordar el
  disparador: un número de artículos, o el momento en que se categorice el
  contenido en WordPress. Sin disparador explícito, "ya lo recuperaremos" se
  convierte en nunca.

## Siguiente paso

→ `/ce:plan` para el detalle de implementación.
