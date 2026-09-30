import { PilarCard } from "@/components/institucional/PilarCard";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { CTA_FINAL, HASHTAG, QUIENES_SOMOS } from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { BOTON_MIEL_NOCHE } from "@/lib/clases";
import { Link } from "wouter";

/**
 * ¿Qué hacemos? (§6.3): los 4 pilares, cada uno con su ancla (RF-08). La
 * intro es el segundo párrafo de «Quiénes somos» (las cuatro palancas).
 * PENDIENTE: banda de descarga del Dossier ASPAL 2026 (oculta hasta que exista
 * el PDF; RF-06, evento download_dossier).
 */
export default function QueHacemos() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SubnavSeccion />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        <HeroInstitucional overline="¿Qué hacemos?" titulo="Los 4 Pilares ASPAL">
          <p>{QUIENES_SOMOS[1]}</p>
        </HeroInstitucional>

        {PILARES.map((pilar, i) => (
          <Banda
            key={pilar.id}
            id={pilar.id}
            tono={i % 2 === 0 ? "blanco" : "suave"}
            className="scroll-mt-32"
          >
            <div className="mx-auto max-w-4xl">
              <PilarCard pilar={pilar} variante="detalle" />
            </div>
          </Banda>
        ))}

        <Banda tono="noche">
          <p className="text-[13px] font-semibold tracking-wider text-secondary">
            {HASHTAG}
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Únete a la casa común</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{CTA_FINAL[1]}</p>
          <Button variant="secondary" className={`mt-8 ${BOTON_MIEL_NOCHE}`} asChild>
            <Link
              href="/unete"
              onClick={() => registrarEvento("click_unete", { origen: "que_hacemos" })}
              data-testid="button-que-hacemos-unete"
            >
              Únete a la comunidad
            </Link>
          </Button>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
