import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import { Proximamente } from "@/components/layout/Proximamente";
import type { EnlaceContenido, Pilar } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

function EnlacePilar({ enlace, testid }: { enlace: EnlaceContenido; testid: string }) {
  const clases =
    "inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline underline-offset-4";
  if (!enlace.href) {
    return (
      <span
        className="inline-flex min-h-11 items-center gap-2 text-muted-foreground"
        data-testid={testid}
      >
        {enlace.etiqueta} <Proximamente />
      </span>
    );
  }
  if (enlace.externo) {
    return (
      <a
        href={enlace.href}
        target="_blank"
        rel="noopener noreferrer"
        className={clases}
        onClick={() =>
          registrarEvento("salida_plataforma", { destino: enlace.href!, origen: "pilar" })
        }
        data-testid={testid}
      >
        {enlace.etiqueta}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        <AvisoPestanaNueva />
      </a>
    );
  }
  return (
    <Link href={enlace.href} className={clases} data-testid={testid}>
      {enlace.etiqueta}
    </Link>
  );
}

/**
 * Un pilar ASPAL. «resumen» (en Nosotros): nombre, subtítulo, compromiso y
 * enlace al detalle. «detalle» (en ¿Qué hacemos?): todo, más «cómo se traduce»
 * y los enlaces a lo que ya existe.
 */
export function PilarCard({
  pilar,
  variante,
}: {
  pilar: Pilar;
  variante: "resumen" | "detalle";
}) {
  const Icono = pilar.icono;
  const Titulo = variante === "detalle" ? "h2" : "h3";

  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 md:p-8"
      data-testid={`pilar-${pilar.id}`}
    >
      <Icono className="h-8 w-8 text-primary" aria-hidden="true" />
      <Titulo className="mt-4 text-2xl font-bold text-foreground">{pilar.nombre}</Titulo>
      <p className="mt-1 text-lg italic text-muted-foreground">{pilar.subtitulo}</p>
      <p className="mt-4 text-lg text-foreground">
        <strong className="font-semibold">Compromiso ASPAL:</strong> {pilar.compromiso}
      </p>
      {variante === "detalle" ? (
        <>
          <p className="mt-3 text-lg text-foreground">
            <strong className="font-semibold">Cómo se traduce:</strong>{" "}
            {pilar.comoSeTraduce}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6">
            {pilar.enlaces.map((enlace, i) => (
              <li key={enlace.etiqueta}>
                <EnlacePilar enlace={enlace} testid={`pilar-${pilar.id}-enlace-${i}`} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link
          href={`/que-hacemos#${pilar.id}`}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-medium text-primary underline underline-offset-4"
          data-testid={`pilar-${pilar.id}-detalle`}
        >
          Cómo se traduce
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
