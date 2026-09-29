import logoAnpr from "@assets/Recurso 50comunidad ASPAL_1763678044080.png";
import logoWup from "@assets/Recurso 53comunidad ASPAL_1763678055285.png";
import type { Aliado } from "@/content/institucional/nosotros";

const LOGOS = { wup: logoWup, anpr: logoAnpr } as const;

/**
 * Muro de aliados (Bloque 9). En la Etapa 1 solo los fundadores; las demás
 * categorías se anuncian «conforme se firmen convenios» (§6.2). Rejilla
 * estática: sin carrusel automático (accesibilidad).
 */
export function MuroAliados({
  fundadores,
  pendientes,
}: {
  fundadores: Aliado[];
  pendientes: string[];
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground">
        Fundadores y respaldo institucional
      </h3>
      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {fundadores.map((aliado) => (
          <li
            key={aliado.nombre}
            className="flex h-full flex-col rounded-2xl border border-border bg-background p-6"
            data-testid={`aliado-${aliado.nombre.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex h-24 items-center">
              {aliado.logo ? (
                <img
                  src={LOGOS[aliado.logo]}
                  alt={aliado.nombre}
                  width={aliado.logo === "wup" ? 240 : 207}
                  height={aliado.logo === "wup" ? 95 : 102}
                  className="max-h-20 w-auto"
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {aliado.nombre}
                </span>
              )}
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              {aliado.logo && (
                <strong className="font-semibold text-foreground">
                  {aliado.nombre}:{" "}
                </strong>
              )}
              {aliado.descripcion}
            </p>
          </li>
        ))}
      </ul>
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {pendientes.map((categoria) => (
          <li
            key={categoria}
            className="rounded-2xl border border-dashed border-border p-4 text-base text-muted-foreground"
          >
            <span className="font-semibold text-foreground">{categoria}.</span> Conforme
            se firmen convenios.
          </li>
        ))}
      </ul>
    </div>
  );
}
