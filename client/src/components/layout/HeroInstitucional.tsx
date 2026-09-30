import { Banda } from "@/components/layout/Banda";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Hero de las páginas institucionales: banda noche, overline miel y un único
 * H1. Sin animaciones de opacidad: se prerenderiza.
 */
export function HeroInstitucional({
  overline,
  overlineNormal,
  titulo,
  children,
}: {
  overline: string;
  /** Sin mayúsculas forzadas: para hashtags, que se leen mal en versalitas. */
  overlineNormal?: boolean;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <Banda tono="noche">
      <p
        className={cn(
          "text-[13px] font-semibold tracking-wider text-secondary",
          overlineNormal ? "normal-case" : "uppercase",
        )}
      >
        {overline}
      </p>
      <h1
        className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        data-testid="text-hero-titulo"
      >
        {titulo}
      </h1>
      {children && <div className="mt-6 max-w-2xl text-lg text-white/85">{children}</div>}
    </Banda>
  );
}
