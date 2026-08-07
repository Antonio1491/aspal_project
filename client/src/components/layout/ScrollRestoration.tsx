import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

/**
 * Restauración de scroll entre rutas.
 *
 * `ScrollToTop.tsx` es el botón flotante — el nombre estaba ocupado.
 *
 * Tres requisitos, y los tres importan:
 *
 * 1. **Distinguir navegación nueva de POP.** Un `scrollTo(0,0)` en cada cambio
 *    de ruta rompe el botón Atrás: el usuario vuelve a la rejilla y aparece
 *    arriba del todo, no donde estaba.
 * 2. **`history.scrollRestoration = "manual"`.** En `auto`, el navegador
 *    restaura mientras TanStack Query aún no ha resuelto: mide la altura del
 *    esqueleto y clampa el scroll. Los dos mecanismos pelean.
 * 3. **Restaurar cuando el documento ya tiene altura**, no en el efecto de
 *    ruta. Por eso el reintento por `requestAnimationFrame`.
 *
 * Sin esto, tocar la última tarjeta de una rejilla larga deja al usuario a
 * 2.400 px dentro del artículo nuevo, o sea en el pie.
 */
export function ScrollRestoration() {
  const [location] = useLocation();
  const positions = useRef(new Map<string, number>());
  const isPopNavigation = useRef(false);
  const previousLocation = useRef(location);

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

  // Marca de POP. `popstate` se dispara antes de que wouter propague la nueva
  // localización, así que el flag ya está puesto cuando corre el efecto de ruta.
  useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Guarda la posición de la ruta que se abandona.
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        positions.current.set(location, window.scrollY);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location]);

  useEffect(() => {
    if (previousLocation.current === location) {
      return;
    }
    previousLocation.current = location;

    const wasPop = isPopNavigation.current;
    isPopNavigation.current = false;

    if (!wasPop) {
      positions.current.delete(location);
      window.scrollTo(0, 0);
      return;
    }

    const target = positions.current.get(location);
    if (target === undefined || target === 0) {
      window.scrollTo(0, 0);
      return;
    }

    // El contenido puede no haber llegado todavía: se reintenta unos cuantos
    // frames hasta que el documento tenga altura suficiente.
    let attempts = 0;
    let frame = 0;

    const restore = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll >= target || attempts > 60) {
        window.scrollTo(0, Math.min(target, Math.max(maxScroll, 0)));
        return;
      }

      attempts += 1;
      frame = window.requestAnimationFrame(restore);
    };

    frame = window.requestAnimationFrame(restore);
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return null;
}
