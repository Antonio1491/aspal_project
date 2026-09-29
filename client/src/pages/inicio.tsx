import { ContenidoReciente } from "@/components/content/ContenidoReciente";
import { FormSuscripcion } from "@/components/forms/FormSuscripcion";
import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";
import { MuroAliados } from "@/components/institucional/MuroAliados";
import { PilarCard } from "@/components/institucional/PilarCard";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { CIFRAS, TEXTO_EVENTOS } from "@/content/institucional/inicio";
import { MAPA_RUTA } from "@/content/institucional/mapa-ruta";
import {
  ALIADOS_FUNDADORES,
  CTA_FINAL,
  HASHTAG,
  HERO_NOSOTROS,
} from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { NOMBRE_COMPLETO } from "@/lib/marca";
import { Link } from "wouter";

const h2 = "text-3xl font-bold text-foreground md:text-4xl";
const BOTON_MIEL =
  "min-h-11 px-6 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";
const BOTON_CONTORNO =
  "min-h-11 border-white bg-transparent px-6 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noche";

/**
 * Home institucional (§6.1): 8 bandas. El contenido de producto que ocupaba la
 * raíz vive en /plataforma desde el PR A.
 * PENDIENTE (insumo de la semana 0): foto real de un evento en el hero.
 */
export default function Inicio() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroInstitucional overline={NOMBRE_COMPLETO} titulo={HERO_NOSOTROS.tagline}>
          <p>{HERO_NOSOTROS.parrafo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className={BOTON_MIEL} asChild>
              <Link
                href="/mapa-de-ruta"
                onClick={() =>
                  registrarEvento("click_mapa_ruta", { origen: "home_hero" })
                }
                data-testid="button-home-mapa"
              >
                Empieza por el Mapa de Ruta
              </Link>
            </Button>
            <Button variant="outline" className={BOTON_CONTORNO} asChild>
              <Link
                href="/unete"
                onClick={() => registrarEvento("click_unete", { origen: "home" })}
                data-testid="button-home-unete"
              >
                Únete a la comunidad
              </Link>
            </Button>
          </div>
        </HeroInstitucional>

        {/* 2. Cifras verificables */}
        <Banda>
          <h2 className="sr-only">ASPAL en cifras</h2>
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CIFRAS.map((cifra) => (
              <div key={cifra.valor} data-testid={`cifra-${cifra.valor}`}>
                <dt className="sr-only">{cifra.etiqueta}</dt>
                <dd className="text-5xl font-extrabold text-primary">{cifra.valor}</dd>
                <dd className="mt-2 text-lg text-muted-foreground">{cifra.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </Banda>

        {/* 3. Los 4 pilares */}
        <Banda tono="suave">
          <h2 className={h2}>Los 4 Pilares ASPAL</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PILARES.map((pilar) => (
              <PilarCard key={pilar.id} pilar={pilar} variante="resumen" />
            ))}
          </div>
        </Banda>

        {/* 4. Mapa de Ruta destacado */}
        <Banda>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-primary">
            Mapa de Ruta
          </p>
          <h2 className={`mt-2 ${h2}`}>{MAPA_RUTA.titulo}</h2>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            {MAPA_RUTA.subtitulo}
          </p>
          <div className="mt-8">
            <IndiceEtapas origen="home" />
          </div>
          <Button className="mt-8 min-h-11 px-6" asChild>
            <Link
              href="/mapa-de-ruta"
              onClick={() =>
                registrarEvento("click_mapa_ruta", { origen: "home_franja" })
              }
              data-testid="button-home-mapa-franja"
            >
              Explora el Mapa de Ruta
            </Link>
          </Button>
        </Banda>

        {/* 5. Contenido reciente (se oculta si la API falla) */}
        <ContenidoReciente />

        {/* 6. Próximo gran evento: D10 sin aprobar, alternativa de la §6.1 */}
        <Banda>
          <h2 className={h2}>Próximos eventos</h2>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{TEXTO_EVENTOS}</p>
          <Button variant="outline" className="mt-6 min-h-11 px-6" asChild>
            <Link href="/eventos" data-testid="button-home-eventos">
              Avísame cuando abran inscripciones
            </Link>
          </Button>
        </Banda>

        {/* 7. Aliados fundadores */}
        <Banda tono="suave">
          <h2 className={`mb-8 ${h2}`}>Aliados fundadores</h2>
          <MuroAliados fundadores={ALIADOS_FUNDADORES} />
        </Banda>

        {/* 8. Únete a la casa común */}
        <Banda tono="noche">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[13px] font-semibold tracking-wider text-secondary">
                {HASHTAG}
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Únete a la casa común
              </h2>
              {CTA_FINAL.map((parrafo) => (
                <p key={parrafo.slice(0, 20)} className="mt-4 text-lg text-white/85">
                  {parrafo}
                </p>
              ))}
              <Link
                href="/unete"
                className="mt-6 inline-flex min-h-11 items-center font-medium text-secondary underline underline-offset-4"
                onClick={() => registrarEvento("click_unete", { origen: "home_final" })}
                data-testid="link-home-unete-final"
              >
                Ver todas las formas de unirte
              </Link>
            </div>
            <div>
              <FormSuscripcion origen="home" variante="compacto" tono="noche" />
            </div>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
