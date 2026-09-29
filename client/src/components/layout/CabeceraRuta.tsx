import { metaDeRuta } from "@/lib/seo";
import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Mantiene el título y la descripción al navegar sin recargar. Al cargar, el
 * HTML prerenderizado ya los trae; esto cubre los cambios de ruta dentro de la
 * SPA. Las rutas dinámicas (`/blog/:slug`) y el 404 fijan su propio título, así
 * que aquí solo se tocan las rutas estáticas.
 */
export function CabeceraRuta() {
  const [ruta] = useLocation();

  useEffect(() => {
    const meta = metaDeRuta(ruta);
    if (!meta) return;
    document.title = meta.titulo;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.descripcion);
  }, [ruta]);

  return null;
}
