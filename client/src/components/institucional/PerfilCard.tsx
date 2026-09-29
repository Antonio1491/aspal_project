import iconoAspal from "@assets/Aspal-Icono_1763675356866.png";
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import type { Perfil } from "@/content/institucional/equipo";
import { registrarEvento } from "@/lib/analitica";
import { Linkedin } from "lucide-react";

/**
 * Tarjeta de perfil (§6.4): foto 4:5, nombre, cargo, bio y LinkedIn. Sin foto,
 * silueta con el isotipo ASPAL (mitigación prevista en el Excel), así que al
 * llegar los retratos basta con rellenar `foto` en equipo.ts.
 */
export function PerfilCard({ perfil }: { perfil: Perfil }) {
  const testid = `perfil-${perfil.nombre.toLowerCase().split(" ")[0]}`;
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background"
      data-testid={testid}
    >
      <div className="flex aspect-[4/5] items-center justify-center bg-fondo-suave">
        {perfil.foto ? (
          <img
            src={perfil.foto}
            alt={`Retrato de ${perfil.nombre}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={iconoAspal}
            alt=""
            aria-hidden="true"
            width={1500}
            height={1877}
            className="h-24 w-auto opacity-60"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold text-foreground">{perfil.nombre}</h2>
        <p className="mt-1 font-medium text-miel-texto">{perfil.cargo}</p>
        <p className="mt-3 text-base text-muted-foreground">{perfil.bio}</p>
        {perfil.linkedin && (
          <a
            href={perfil.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              registrarEvento("salida_plataforma", {
                destino: perfil.linkedin!,
                origen: "equipo",
              })
            }
            data-testid={`${testid}-linkedin`}
            className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-medium text-primary underline underline-offset-4"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
            <AvisoPestanaNueva />
          </a>
        )}
      </div>
    </article>
  );
}
