import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

/** Clave con la que marcamos cada entrada del historial. */
const INDEX_KEY = "__srIdx";

interface IndexedState {
  [INDEX_KEY]?: number;
}

/**
 * Lleva al elemento del hash. Primer intento síncrono (mismo motivo que en la
 * restauración); si aún no existe, reintento por frames y, si nunca aparece,
 * al top. Sin `behavior: smooth`, para respetar el movimiento reducido;
 * `scroll-mt-*` del destino compensa el header fijo. Devuelve la función que
 * cancela el reintento.
 */
function irAlAncla(hash: string): () => void {
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // hash mal codificado: se usa tal cual
  }

  let intentos = 0;
  let frame = 0;

  const intentar = () => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView();
      return true;
    }
    if (intentos >= 60) {
      window.scrollTo(0, 0);
      return true;
    }
    intentos += 1;
    return false;
  };

  if (!intentar()) {
    const reintentar = () => {
      if (intentar()) return;
      frame = window.requestAnimationFrame(reintentar);
    };
    frame = window.requestAnimationFrame(reintentar);
  }

  return () => window.cancelAnimationFrame(frame);
}

/**
 * Restauración de scroll entre rutas.
 *
 * `ScrollToTop.tsx` es el botón flotante — el nombre estaba ocupado.
 *
 * ## Por qué se indexa el historial y no se escucha `popstate`
 *
 * La versión evidente —marcar un flag en `popstate` y leerlo en el efecto de
 * ruta— no funciona. Medido en el navegador:
 *
 * ```
 * t=72920  scrollTo(0,0)  con location.pathname ya en "/blog"
 * t=72942  popstate
 * ```
 *
 * Wouter actualiza su localización y React ejecuta los efectos ANTES de que el
 * evento `popstate` llegue a nuestro listener, así que el flag siempre llegaba
 * tarde y toda navegación Atrás se trataba como navegación nueva: scroll al
 * top y botón Atrás roto, justo lo que esto viene a evitar.
 *
 * En su lugar se sella un índice incremental en `history.state`. Una entrada
 * sin sellar es necesariamente nueva; una ya sellada solo puede venir de
 * Atrás o Adelante. No depende del orden de los eventos.
 *
 * ## Los otros dos requisitos
 *
 * - **`history.scrollRestoration = "manual"`.** En `auto`, el navegador
 *   restaura mientras TanStack Query aún no ha resuelto: mide la altura del
 *   esqueleto y clampa el scroll. Los dos mecanismos pelean.
 * - **Restaurar cuando el documento ya tiene altura**, no en el efecto de
 *   ruta. De ahí el reintento por `requestAnimationFrame`.
 */
export function ScrollRestoration() {
  const [location] = useLocation();
  /** posición de scroll por índice de entrada del historial */
  const positions = useRef(new Map<number, number>());
  const currentIndex = useRef(0);
  const counter = useRef(0);

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return;
    }

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  // Guarda la posición de la entrada activa, no de la ruta: dos entradas
  // distintas pueden compartir ruta y tener posiciones distintas.
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        positions.current.set(currentIndex.current, window.scrollY);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /** cancelación del reintento de ancla en curso (efecto de ruta o hashchange) */
  const cancelarAncla = useRef<() => void>(() => {});

  // Anclas internas (<a href="#…">) dentro de la misma página. Wouter solo mira
  // el pathname, así que el efecto de ruta no corre; pero el navegador SÍ crea
  // una entrada de historial sin sellar. Sin este listener, esa entrada
  // quedaría sin índice y al volver con Atrás no habría posición que restaurar.
  //
  // Dos escenarios distintos:
  // - Atrás/Adelante DENTRO de la página (entre entradas con y sin hash, ya
  //   selladas): solo cambia el hash. Se restaura la posición guardada de esa
  //   entrada o, si no la hay, se va al ancla.
  // - Atrás DESDE OTRA página hacia una entrada con hash: cambia el pathname,
  //   lo resuelve el efecto de ruta de abajo.
  useEffect(() => {
    const onHashChange = () => {
      const state = (window.history.state ?? {}) as IndexedState;
      const stamped = state[INDEX_KEY];

      // Clic en un ancla: entrada nueva. Se sella y NO se mueve el scroll: el
      // navegador ya saltó al ancla.
      if (typeof stamped !== "number") {
        counter.current += 1;
        currentIndex.current = counter.current;
        window.history.replaceState(
          { ...state, [INDEX_KEY]: currentIndex.current },
          "",
          window.location.href,
        );
        return;
      }

      currentIndex.current = stamped;
      counter.current = Math.max(counter.current, stamped);
      cancelarAncla.current();

      const guardada = positions.current.get(stamped);
      if (guardada !== undefined) {
        window.scrollTo(0, guardada);
      } else if (window.location.hash) {
        cancelarAncla.current = irAlAncla(window.location.hash);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      cancelarAncla.current();
    };
  }, []);

  useEffect(() => {
    cancelarAncla.current();
    const state = (window.history.state ?? {}) as IndexedState;
    const stamped = state[INDEX_KEY];

    // Entrada nueva: sellarla e ir al ancla (si la URL trae #) o al top.
    if (typeof stamped !== "number") {
      counter.current += 1;
      currentIndex.current = counter.current;

      window.history.replaceState(
        { ...state, [INDEX_KEY]: currentIndex.current },
        "",
        window.location.href,
      );

      if (!window.location.hash) {
        window.scrollTo(0, 0);
        return;
      }

      const cancelar = irAlAncla(window.location.hash);
      cancelarAncla.current = cancelar;
      return cancelar;
    }

    // Entrada ya conocida: viene de Atrás o Adelante.
    currentIndex.current = stamped;
    counter.current = Math.max(counter.current, stamped);

    const target = positions.current.get(stamped) ?? 0;

    if (target === 0) {
      // Sin posición guardada (p. ej. F5 sobre `/que-hacemos#tecnologia`): si
      // la URL trae hash, al ancla; si no, al top.
      if (window.location.hash) {
        const cancelar = irAlAncla(window.location.hash);
        cancelarAncla.current = cancelar;
        return cancelar;
      }
      window.scrollTo(0, 0);
      return;
    }

    // Primer intento SÍNCRONO. Es el caso normal: al volver, TanStack Query ya
    // tiene los datos en caché y el documento ya tiene altura.
    //
    // No delegar este primer intento a `requestAnimationFrame`: si el bucle de
    // frames está estrangulado —pestaña en segundo plano, ventana oculta— el
    // callback no se ejecuta y la restauración no ocurre nunca, en silencio.
    // Medido: 2,2 s sin un solo frame con la pestaña sin foco.
    let attempts = 0;
    let frame = 0;

    const restore = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll >= target || attempts > 60) {
        window.scrollTo(0, Math.min(target, Math.max(maxScroll, 0)));
        return true;
      }

      attempts += 1;
      return false;
    };

    if (restore()) {
      return;
    }

    // Solo si el contenido aún no ha llegado: reintento por frames.
    const retry = () => {
      if (restore()) return;
      frame = window.requestAnimationFrame(retry);
    };

    frame = window.requestAnimationFrame(retry);
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return null;
}
