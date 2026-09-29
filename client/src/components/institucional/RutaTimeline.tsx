import type { Hito } from "@/content/institucional/nosotros";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Ruta ASPAL 2026–2030 (Bloque 7, RF-07). Escalera horizontal en escritorio y
 * vertical en móvil. Cada hito es un <details> nativo: se abre con clic, toque
 * y teclado (Enter/Espacio en el resumen) sin JavaScript, y su texto está en el
 * HTML prerenderizado. El hito en curso va en pizarra sólida; los futuros, con
 * borde tenue, sin bajar la opacidad del texto (contraste AA), y una etiqueta
 * escrita para que el estado no dependa del color.
 */
export function RutaTimeline({ hitos }: { hitos: Hito[] }) {
  return (
    <ol className="grid gap-4 lg:grid-cols-6">
      {hitos.map((hito, i) => {
        const enCurso = hito.estado === "en-curso";
        return (
          <li
            key={hito.anio}
            className={cn("h-full lg:mt-[var(--escalon)]")}
            style={{ "--escalon": `${(hitos.length - 1 - i) * 1.5}rem` } as CSSProperties}
          >
            <details
              className={cn(
                "group h-full rounded-2xl border-2 p-4",
                enCurso
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/50 bg-background text-foreground",
              )}
              data-testid={`hito-${i}`}
            >
              <summary
                data-testid={`hito-${i}-resumen`}
                className={cn(
                  "flex min-h-11 cursor-pointer list-none flex-col gap-1 rounded-md outline-none focus-visible:ring-2 [&::-webkit-details-marker]:hidden",
                  enCurso
                    ? "focus-visible:ring-primary-foreground"
                    : "focus-visible:ring-ring",
                )}
              >
                <span className="text-sm font-semibold">{hito.anio}</span>
                <span className="text-lg font-bold leading-tight">{hito.nombre}</span>
                <span className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide">
                  {enCurso ? "En curso" : "Próximo"}
                  <ChevronDown
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <p className="mt-3 text-sm">{hito.descripcion}</p>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
