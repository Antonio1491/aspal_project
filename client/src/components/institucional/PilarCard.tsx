import pilarComunidad from "@assets/ilustraciones/pilar-comunidad.webp";
import pilarConocimiento from "@assets/ilustraciones/pilar-conocimiento.webp";
import pilarDatos from "@assets/ilustraciones/pilar-datos.webp";
import pilarTecnologia from "@assets/ilustraciones/pilar-tecnologia.webp";
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import { Proximamente } from "@/components/layout/Proximamente";
import type { EnlaceContenido, IdPilar, Pilar } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

/**
 * Ilustraciones de la marca (familia miel y noche de la versión anterior del
 * sitio), en versión ligera de 480 px derivada de `recurso-*.webp`. Datos usa
 * la de la lupa sobre perfiles: análisis y comparación.
 */
const ILUSTRACIONES: Record<IdPilar, string> = {
  comunidad: pilarComunidad,
  conocimiento: pilarConocimiento,
  tecnologia: pilarTecnologia,
  datos: pilarDatos,
};

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
  ilustracion = false,
}: {
  pilar: Pilar;
  variante: "resumen" | "detalle";
  /** Ilustración de la marca arriba de la tarjeta, en lugar del icono (home). */
  ilustracion?: boolean;
}) {
  const Icono = pilar.icono;
  const Titulo = variante === "detalle" ? "h2" : "h3";
  const resumen = variante === "resumen";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-background p-6 md:p-8",
        // En «resumen» toda la tarjeta lleva al detalle (el enlace se estira
        // con after:inset-0): objetivo táctil grande y un solo tabulador. El anillo
        // sale solo con teclado (has-[:focus-visible]) y, en alto contraste, como outline.
        resumen &&
          "relative transition-colors hover:border-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 forced-colors:has-[:focus-visible]:outline forced-colors:has-[:focus-visible]:outline-2",
      )}
      data-testid={`pilar-${pilar.id}`}
    >
      {ilustracion ? (
        <div className="-mx-6 -mt-6 mb-2 flex h-44 items-end justify-center overflow-hidden rounded-t-2xl bg-accent md:-mx-8 md:-mt-8">
          <img
            src={ILUSTRACIONES[pilar.id]}
            alt=""
            width={480}
            height={520}
            loading="lazy"
            decoding="async"
            className="h-40 w-auto"
            data-testid={`img-pilar-${pilar.id}`}
          />
        </div>
      ) : (
        <Icono className="h-8 w-8 text-primary" aria-hidden="true" />
      )}
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
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-medium text-primary underline underline-offset-4 outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
          aria-label={`${pilar.nombre}: cómo se traduce`}
          data-testid={`pilar-${pilar.id}-detalle`}
        >
          Cómo se traduce
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
