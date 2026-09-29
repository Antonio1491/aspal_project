import { ETAPAS, type EtapaMapa as Etapa } from "@/content/institucional/mapa-ruta";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CLASES_VECINA =
  "inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Una etapa del Mapa de Ruta: sus pasos, la frase de cierre de la guía y
 * enlaces a la etapa anterior y a la siguiente, para recorrer el mapa de
 * principio a fin sin volver al índice.
 */
export function EtapaMapa({
  etapa,
  anterior,
  siguiente,
}: {
  etapa: Etapa;
  anterior?: Etapa;
  siguiente?: Etapa;
}) {
  return (
    <article aria-labelledby={`${etapa.id}-titulo`} data-testid={`seccion-${etapa.id}`}>
      <p className="text-[13px] font-semibold uppercase tracking-wider text-primary">
        Etapa {etapa.numero} de {ETAPAS.length}
      </p>
      <h2
        id={`${etapa.id}-titulo`}
        className="mt-2 text-3xl font-bold text-foreground md:text-4xl"
      >
        {etapa.nombre}
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">{etapa.resumen}</p>

      <ol className="mt-8 grid gap-6 md:grid-cols-2">
        {etapa.pasos.map((paso) => (
          <li
            key={paso.numero}
            className="rounded-2xl border border-border bg-background p-6"
            data-testid={`paso-${paso.numero}`}
          >
            <p className="text-sm font-semibold text-primary">Paso {paso.numero}</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">{paso.nombre}</h3>
            <p className="mt-1 italic text-muted-foreground">{paso.linea}</p>
            {paso.descripcion.map((parrafo, i) => (
              // Contenido estático: el orden no cambia.
              <p key={i} className="mt-3 text-base text-foreground">
                {parrafo}
              </p>
            ))}
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-3xl border-l-4 border-secondary pl-4 text-lg font-semibold text-foreground">
        {etapa.cierre}
      </p>

      <nav
        aria-label={`Etapas vecinas de ${etapa.nombre}`}
        className="mt-8 flex flex-wrap justify-between gap-4"
      >
        {anterior ? (
          <a
            href={`#${anterior.id}`}
            className={CLASES_VECINA}
            data-testid={`${etapa.id}-anterior`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Etapa {anterior.numero}: {anterior.nombre}
          </a>
        ) : (
          <span />
        )}
        {siguiente && (
          <a
            href={`#${siguiente.id}`}
            className={CLASES_VECINA}
            data-testid={`${etapa.id}-siguiente`}
          >
            Etapa {siguiente.numero}: {siguiente.nombre}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </nav>
    </article>
  );
}
