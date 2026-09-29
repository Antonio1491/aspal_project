import { ETAPAS } from "@/content/institucional/mapa-ruta";
import { registrarEvento } from "@/lib/analitica";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const CLASES_ENLACE =
  "flex h-full min-h-11 flex-col rounded-2xl border border-border bg-background transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Las 7 etapas del Mapa de Ruta como lista ordenada. En la home es la franja
 * que lleva a cada etapa de /mapa-de-ruta. En la propia página es el índice
 * «paso a paso»: salta al ancla y añade el resumen de cada etapa.
 */
export function IndiceEtapas({ origen }: { origen: "home" | "mapa" }) {
  const enPagina = origen === "mapa";
  return (
    <ol
      className={cn(
        "grid gap-3",
        enPagina
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7",
      )}
      data-testid={`indice-etapas-${origen}`}
    >
      {ETAPAS.map((etapa) => {
        const contenido = (
          <>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Etapa {etapa.numero}
            </span>
            <span className="mt-1 hyphens-auto break-words text-base font-bold text-foreground">
              {etapa.nombre}
            </span>
            {enPagina && (
              <span className="mt-1 hyphens-auto break-words text-sm text-muted-foreground">
                {etapa.resumen}
              </span>
            )}
          </>
        );
        const testid = `etapa-${origen}-${etapa.numero}`;
        return (
          <li key={etapa.id}>
            {enPagina ? (
              <a
                href={`#${etapa.id}`}
                className={cn(CLASES_ENLACE, "p-4")}
                data-testid={testid}
              >
                {contenido}
              </a>
            ) : (
              <Link
                href={`/mapa-de-ruta#${etapa.id}`}
                className={cn(CLASES_ENLACE, "p-3 xl:p-4")}
                onClick={() =>
                  registrarEvento("click_mapa_ruta", {
                    origen: "home_etapa",
                    etapa: etapa.numero,
                  })
                }
                data-testid={testid}
              >
                {contenido}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
