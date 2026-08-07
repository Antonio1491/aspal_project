---
title: Lista de revisión — plan de lectura interna del blog
type: revision
status: pendiente
date: 2026-08-07
plan: docs/plans/2026-08-05-001-feat-blog-lectura-interna-ux-plan.md
---

# Lista de revisión

Puntos que **no** se pudieron ejecutar tal y como los describe el plan, o que
exigen una decisión que no me corresponde tomar. Ordenados por gravedad.

---

## 🔴 1. Todo el contenido de WordPress está tras un muro de pago

**Esto invalida la premisa central del plan.**

La API de WordPress **no devuelve el cuerpo de ningún artículo** a una petición
anónima. Los 15 posts —los 7 de blog y los 8 de podcast— devuelven un stub de
MemberPress en lugar del contenido:

```html
<div class="mp_wrapper">
  <div class="mepr-unauthorized-message">
    <p>You are unauthorized to view this page.</p>
  </div>
  <div class="mepr-login-form-wrap">…formulario de login…</div>
</div>
```

Verificado contra el origen, sin pasar por nuestro proxy:

```
total posts: 15   ·   bloqueados: 15   ·   abiertos: 0
```

De los 15, catorce tienen exactamente 184 caracteres de contenido (solo el
mensaje) y uno 2.184 (el mensaje más el formulario de login completo).

### Qué implica

El plan entero se apoya en «llevar la lectura dentro del sitio». Si las
tarjetas apuntaran a `/blog/:slug` tal y como pide la Fase 1, el usuario
aterrizaría en una página nuestra que muestra _"You are unauthorized to view
this page"_ en inglés y un formulario de login de MemberPress incrustado dentro
de `prose`. **Sería peor que hoy**, porque hoy la tarjeta lleva a WordPress,
que al menos renderiza su propio muro con su login funcionando.

Con esto caen, tal y como están escritas:

- **Fase 1** — el cambio de destino de las tarjetas a `/blog/:slug`.
- **Fase 2** — barra de progreso de lectura, `max-w-[65ch]` para la prosa,
  «sigue leyendo», y el CTA de captación al cierre. Todas asumen que hay un
  artículo que leer. La barra de progreso sobre 7 palabras no significa nada.
- **Fase 0 parcial** — `readingMinutes` se calcula bien, pero sobre contenido
  bloqueado da 1 minuto en los siete artículos. Ver punto 2.

### Hay un fallo en producción hoy mismo

El post destacado del hero **ya enlaza a `/blog/:slug`** (`blog.tsx:70` y
`:110`). O sea que la página de artículo interna ya es alcanzable, y ya está
mostrando el mensaje de MemberPress en inglés a cualquiera que pinche el
destacado. No es un riesgo futuro: está pasando ahora.

Mitigación aplicada: `blog-post.tsx` ahora detecta el contenido bloqueado y
muestra un estado honesto en español en vez de volcar el formulario. Es un
parche, no la decisión.

### Qué hay que decidir (no puedo decidirlo yo)

1. **¿Es intencionado que el contenido sea solo para socios?** Si lo es, el
   blog no puede ser una herramienta de captación en el sentido que asume el
   plan, y hay que rehacer el planteamiento: el blog pasaría a ser escaparate
   (títulos y extractos, que sí son públicos) con el artículo tras registro.
2. **¿O es un fallo de configuración de MemberPress?** Si los artículos
   deberían ser públicos, se arregla en WordPress y el plan original vuelve a
   ser válido casi entero.
3. **Tercera vía:** autenticar nuestro servidor contra WordPress (usuario de
   aplicación) para leer el contenido completo desde `shared/wordpress/client.ts`.
   Ojo: eso publicaría contenido de pago sin muro, así que es una decisión de
   negocio, no técnica.

**Hasta que esto se decida, las tarjetas de la rejilla siguen enlazando fuera.**
Prefiero dejar el comportamiento actual que enviar al usuario a una página
nuestra rota.

---

## 🟠 2. `readingMinutes` es real pero el dato de origen no

El cálculo es correcto y está donde debe (servidor, sobre texto limpio). Pero
como el contenido está bloqueado, los siete artículos dan **1 minuto**.

El plan asciende el tiempo de lectura a metadato principal de la tarjeta justo
al retirar la insignia. Mostrar «1 min» idéntico en las siete tarjetas repite
exactamente el problema que motivó retirar la insignia: ocupar un hueco visible
con cero información, y encima con un dato falso.

**Aplicado:** `transform.ts` marca el post con `isGated` cuando detecta el stub
de MemberPress, y la tarjeta oculta el tiempo de lectura en ese caso. Se
mostrará solo cuando el dato sea real. **A revisar** si prefieres otra salida.

---

## 🟡 3. Decisiones del plan que seguían abiertas y siguen abiertas

Ninguna la puedo cerrar yo. Las cuatro venían ya marcadas como «preguntas
abiertas» en el plan.

| Pregunta                                                        | Por qué bloquea                                                                                                                                                            |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **URL exacta del CTA de captación**, y si abre en pestaña nueva | La Fase 2 la necesita. `Header.tsx` usa `target="_blank"` hacia una URL de registro; hace falta confirmar cuál es la buena y qué UTM quieres                               |
| **Disparador para recuperar el filtro** de categorías           | El filtro queda retirado. Sin un criterio explícito («cuando haya N artículos» o «cuando se categorice en WordPress»), «retirado temporalmente» se convierte en «retirado» |
| **Umbral de paginación**                                        | `per_page=7` codifica el número de artículos que hay hoy. El octavo artículo desaparecerá en silencio                                                                      |
| **¿Se usan los comentarios de WordPress?**                      | Determina cuánto cuesta de verdad la lectura interna, si se retoma                                                                                                         |

---

## 🟡 4. Vista previa social: sigue sin resolverse

El plan ya lo daba por asumido y lo dejaba para otro plan aparte. Lo repito
aquí para que no se pierda: compartir un artículo por WhatsApp o LinkedIn da
vista previa vacía, porque los rastreadores no ejecutan JavaScript. Añadir
`<title>` por página arregla la pestaña del navegador, no la vista previa.

Mientras las tarjetas sigan enlazando a WordPress (punto 1), este problema
**no existe todavía**: lo que se comparte es la URL de WordPress, que sí trae
sus metadatos. Aparecerá en el momento en que se active la lectura interna.

---

## 🟢 5. Cobertura de tests

Se ha introducido **Vitest** (32 tests) sobre la capa de transformación y el
cliente de WordPress, que es donde vive la lógica pura y donde el plan había
detectado los fallos de datos. El paso de tests está añadido al CI.

---

## Estado de los 21 criterios de aceptación

Verificados en Chrome contra el servidor de desarrollo, salvo donde se indica.

| #   | Criterio                               | Estado                                             |
| --- | -------------------------------------- | -------------------------------------------------- |
| 1   | El artículo abre en el top             | ✅                                                 |
| 2   | Atrás restaura la rejilla              | ✅ 600 px → 600 px (y una segunda vuelta también)  |
| 3   | Atrás → Adelante, artículo en el top   | ✅                                                 |
| 4   | Enlace directo a `/blog/:slug`         | ✅                                                 |
| 5   | Desde «sigue leyendo»                  | ⚠️ no aplica: las tarjetas enlazan fuera (punto 1) |
| 6   | F5 en `/blog/:slug`                    | ⏳ requiere el build desplegado                    |
| 7   | WordPress caído → error + Reintentar   | ✅ `/api/posts` da 500, no `200 []`                |
| 8   | Con 0 y 1 artículo la página no miente | ⏳ no reproducible con los datos reales            |
| 9   | Slug de podcast redirige a `/podcast`  | ✅                                                 |
| 10  | Slug inexistente → 404 en español      | ✅ y sin botón Reintentar, que sería incoherente   |
| 11  | Barra de progreso oculta si cabe       | ❌ no implementada (punto 1)                       |
| 12  | Barra al 100 % al final del cuerpo     | ❌ no implementada (punto 1)                       |
| 13  | La barra no retrocede en 3G lento      | ❌ no implementada (punto 1)                       |
| 14  | Recorrido completo con teclado         | ⏳ **manual**                                      |
| 15  | Lector de pantalla                     | ⏳ **manual**                                      |
| 16  | Pinch-zoom al 200 %                    | ⏳ **manual** (el `maximum-scale` ya está quitado) |
| 17  | `prefers-reduced-motion`               | ⏳ **manual**: hay que activarlo en el sistema     |
| 18  | Objetivos táctiles ≥ 44 px             | ⏳ **manual** en dispositivo real                  |
| 19  | Sin scroll horizontal a 320 px         | ⏳ **manual**: el resize no cambió el viewport     |
| 20  | check · lint · format:check · build    | ✅ los cuatro en verde, más 32 tests               |
| 21  | `CLAUDE.md` con la política de errores | ✅                                                 |

Además, sin errores en la consola del navegador en `/blog`, `/blog/:slug` ni
en el 404.

### Lo que hay que probar a mano

Son cinco cosas y ninguna se puede automatizar sin más herramientas:

1. **Teclado** (criterio 14): recorrer `/blog` y un artículo solo con Tab.
2. **Lector de pantalla** (15): NVDA o VoiceOver, comprobar que pronuncia en
   español y que cada tarjeta se anuncia con su título y no con seis líneas.
3. **Pinch-zoom** (16) en un móvil real.
4. **Movimiento reducido** (17): activarlo en el sistema operativo y confirmar
   que **todo el contenido se ve** y nada queda en opacidad 0.
5. **320 px** (19): con las herramientas de desarrollo, no redimensionando la
   ventana.

---

## Qué sí quedó hecho y verificado

Ver los mensajes de commit para el detalle. Resumen:

- **Fase 0** completa y verificada contra la API real.
- **Fase 1** completa salvo el cambio de destino de las tarjetas (punto 1).
- **Fase 2** solo las partes independientes del contenido bloqueado.
- **Fase 3** completa.

La restauración de scroll necesitó dos arreglos que solo aparecieron al
probarla en el navegador: escuchar `popstate` llega tarde respecto a los
efectos de wouter, y el primer intento de restauración no puede ir en
`requestAnimationFrame`. Está en el commit correspondiente.
