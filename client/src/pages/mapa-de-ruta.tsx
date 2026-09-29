import { EtapaMapa } from "@/components/institucional/EtapaMapa";
import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { ETAPAS, MAPA_RUTA } from "@/content/institucional/mapa-ruta";
import { registrarEvento } from "@/lib/analitica";
import { COMUNIDAD } from "@/lib/navegacion";
import { ArrowUpRight, Download } from "lucide-react";
import { Link } from "wouter";

const BOTON_MIEL =
  "min-h-11 px-6 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";
const BOTON_CONTORNO =
  "min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";

/**
 * Mapa de Ruta (§6.5): las 7 etapas de la guía oficial en un paso a paso
 * navegable. Índice arriba, una banda por etapa con ancla propia (`#etapa-N`)
 * y enlaces a la etapa anterior y a la siguiente. Los foros por etapa llegan en
 * la Etapa 2 del plan.
 */
export default function MapaDeRuta() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        <HeroInstitucional overline="Mapa de Ruta" titulo={MAPA_RUTA.titulo}>
          <p>{MAPA_RUTA.subtitulo}</p>
          <p className="mt-4">{MAPA_RUTA.comoUsar}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className={BOTON_MIEL} asChild>
              <a href="#etapa-1" data-testid="button-mapa-empezar">
                Empieza por la Etapa 1
              </a>
            </Button>
            <Button variant="outline" className={BOTON_CONTORNO} asChild>
              <a
                href={MAPA_RUTA.pdf.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  registrarEvento("click_mapa_ruta", { origen: "descarga_pdf" })
                }
                data-testid="button-mapa-pdf"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Descarga el mapa (PDF, {MAPA_RUTA.pdf.peso})
                <AvisoPestanaNueva />
              </a>
            </Button>
          </div>
        </HeroInstitucional>

        <Banda tono="suave">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Las {ETAPAS.length} etapas
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            {MAPA_RUTA.recorrer}
          </p>
          <div className="mt-8">
            <IndiceEtapas origen="mapa" />
          </div>
        </Banda>

        {ETAPAS.map((etapa, i) => (
          <Banda
            key={etapa.id}
            id={etapa.id}
            tono={i % 2 === 0 ? "blanco" : "suave"}
            className="scroll-mt-16"
          >
            <EtapaMapa etapa={etapa} anterior={ETAPAS[i - 1]} siguiente={ETAPAS[i + 1]} />
          </Banda>
        ))}

        <Banda tono="noche">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold md:text-4xl">{MAPA_RUTA.impulsa.titulo}</h2>
            <p className="mt-4 text-lg text-white/85">{MAPA_RUTA.impulsa.texto}</p>
            <p className="mt-3 text-lg text-white/85">{MAPA_RUTA.checkList}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" className={BOTON_MIEL} asChild>
                <Link
                  href="/unete"
                  onClick={() => registrarEvento("click_unete", { origen: "mapa_ruta" })}
                  data-testid="button-mapa-unete"
                >
                  Únete a la comunidad
                </Link>
              </Button>
              <Button variant="outline" className={BOTON_CONTORNO} asChild>
                <a
                  href={COMUNIDAD}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    registrarEvento("salida_plataforma", {
                      destino: COMUNIDAD,
                      origen: "mapa_ruta",
                    })
                  }
                  data-testid="button-mapa-comunidad"
                >
                  Ir a la comunidad
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <AvisoPestanaNueva />
                </a>
              </Button>
            </div>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
