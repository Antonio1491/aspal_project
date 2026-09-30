import { ETAPAS } from "@/content/institucional/mapa-ruta";
import { useAnimarAlVer } from "@/hooks/use-animar-al-ver";
import { registrarEvento } from "@/lib/analitica";
import { HEXAGONO_PUNTA } from "@/lib/clases";
import { cn } from "@/lib/utils";
import {
  Compass,
  Handshake,
  Landmark,
  Megaphone,
  Route,
  Settings2,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";

const CLASES_ENLACE =
  "flex h-full min-h-11 flex-col rounded-2xl border border-border bg-background transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Icono por etapa en la franja de la home. PENDIENTE (fase 2 de la edición de
 * la home): la guía oficial del Mapa de Ruta tiene su propio icono en hexágono
 * por etapa; cuando se extraigan del PDF como SVG, sustituyen a estos.
 */
const ICONOS: Record<number, LucideIcon> = {
  1: Landmark,
  2: Compass,
  3: Settings2,
  4: Megaphone,
  5: Users,
  6: Handshake,
  7: TrendingUp,
};

/**
 * Las 7 etapas del Mapa de Ruta como lista ordenada. En la home es un paso a
 * paso: insignia hexagonal con icono y una línea que une las etapas (desde
 * `xl`, cuando caben en una fila); cada una lleva a su etapa en /mapa-de-ruta.
 * En la propia página es el índice: salta al ancla y añade el resumen.
 *
 * En la home, la primera vez que entra en pantalla la línea se traza de la
 * etapa 1 a la 7 y las insignias se activan en secuencia (useAnimarAlVer:
 * solo transform, nada en el prerender ni con «reducir movimiento»).
 */
export function IndiceEtapas({ origen }: { origen: "home" | "mapa" }) {
  const { ref, estado } = useAnimarAlVer<HTMLOListElement>();

  if (origen === "mapa") {
    return (
      <ol
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        data-testid="indice-etapas-mapa"
      >
        {ETAPAS.map((etapa) => (
          <li key={etapa.id}>
            <a
              href={`#${etapa.id}`}
              className={cn(CLASES_ENLACE, "p-4")}
              data-testid={`etapa-mapa-${etapa.numero}`}
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Etapa {etapa.numero}
              </span>
              <span className="mt-1 hyphens-auto break-words text-base font-bold text-foreground">
                {etapa.nombre}
              </span>
              <span className="mt-1 hyphens-auto break-words text-sm text-muted-foreground">
                {etapa.resumen}
              </span>
            </a>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol
      ref={ref}
      className={cn(
        "group/ruta relative grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7",
        // Línea del camino, detrás de las insignias: solo cuando es una fila.
        // top-10 = p-2 del enlace (8 px) + media insignia (32 px). Se traza
        // desde la izquierda (origin-left) al entrar en pantalla.
        "xl:before:absolute xl:before:left-[7%] xl:before:right-[7%] xl:before:top-10 xl:before:h-0.5 xl:before:origin-left xl:before:bg-secondary xl:before:content-['']",
        "data-[anim=esperando]:before:scale-x-0 data-[anim=activa]:before:animate-trazo",
      )}
      data-anim={estado}
      data-testid="indice-etapas-home"
    >
      {ETAPAS.map((etapa, i) => {
        const Icono = ICONOS[etapa.numero] ?? Route;
        const primera = etapa.numero === 1;
        return (
          <li key={etapa.id} className="relative">
            <Link
              href={`/mapa-de-ruta#${etapa.id}`}
              className="group flex min-h-11 flex-col items-center rounded-2xl p-2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() =>
                registrarEvento("click_mapa_ruta", {
                  origen: "home_etapa",
                  etapa: etapa.numero,
                })
              }
              data-testid={`etapa-home-${etapa.numero}`}
            >
              <span
                className={cn(
                  "flex h-16 w-14 items-center justify-center transition-colors",
                  "group-data-[anim=esperando]/ruta:scale-75 group-data-[anim=activa]/ruta:animate-insignia",
                  HEXAGONO_PUNTA,
                  primera
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-noche text-noche-foreground group-hover:bg-primary",
                )}
                style={{ animationDelay: `${150 + i * 180}ms` }}
                aria-hidden="true"
              >
                <Icono className="h-6 w-6" />
              </span>
              <span className="mt-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Etapa {etapa.numero}
              </span>
              <span className="mt-1 hyphens-auto break-words text-base font-bold text-foreground group-hover:underline group-hover:underline-offset-4">
                {etapa.nombre}
              </span>
              {primera && (
                <span className="mt-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Empieza aquí
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
