import { MuroAliados } from "@/components/institucional/MuroAliados";
import { PilarCard } from "@/components/institucional/PilarCard";
import { RutaTimeline } from "@/components/institucional/RutaTimeline";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { TarjetaCompromiso } from "@/components/institucional/TarjetaCompromiso";
import { Proximamente } from "@/components/layout/Proximamente";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import {
  ALIADOS_FUNDADORES,
  APORTES,
  CATEGORIAS_ALIADOS_PENDIENTES,
  CTA_FINAL,
  DEFENDEMOS,
  HACEN_POSIBLE,
  HASHTAG,
  HERO_NOSOTROS,
  MISION,
  QUIENES_SOMOS,
  RUTA,
  VISION,
} from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import { registrarEvento } from "@/lib/analitica";
import { BOTON_CONTORNO_NOCHE, BOTON_MIEL_NOCHE, H2_BANDA } from "@/lib/clases";
import { CONTACTO } from "@/lib/marca";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

/** Nosotros (§6.2): los 10 bloques del Concepto NOSOTROS, en su orden. */
export default function Nosotros() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SubnavSeccion />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 1. Hero */}
        <HeroInstitucional overline="Nosotros" titulo={HERO_NOSOTROS.tagline}>
          <p>{HERO_NOSOTROS.parrafo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className={BOTON_MIEL_NOCHE} asChild>
              <Link
                href="/unete"
                onClick={() => registrarEvento("click_unete", { origen: "nosotros" })}
                data-testid="button-nosotros-unete"
              >
                Únete a la comunidad
              </Link>
            </Button>
            <Button variant="outline" className={BOTON_CONTORNO_NOCHE} asChild>
              <a href="#lo-que-defendemos" data-testid="button-nosotros-propuesta">
                Conoce nuestra propuesta de valor
              </a>
            </Button>
          </div>
        </HeroInstitucional>

        {/* 2. Quiénes somos */}
        <Banda id="quienes-somos">
          <div className="mx-auto max-w-3xl">
            <h2 className={H2_BANDA}>Quiénes somos</h2>
            {QUIENES_SOMOS.map((parrafo) => (
              <p
                key={parrafo.slice(0, 20)}
                className="mt-4 text-lg text-muted-foreground"
              >
                {parrafo}
              </p>
            ))}
          </div>
        </Banda>

        {/* 3. Nuestra esencia */}
        <Banda id="esencia" tono="suave">
          <h2 className={H2_BANDA}>Nuestra esencia</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-miel-texto">
                Misión
              </h3>
              <p className="mt-3 text-lg text-foreground">{MISION}</p>
            </article>
            <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-miel-texto">
                Visión 2030
              </h3>
              <p className="mt-3 text-lg text-foreground">{VISION}</p>
            </article>
          </div>
          <p className="mt-6 text-center text-xl font-bold text-primary">{HASHTAG}</p>
        </Banda>

        {/* 4. Lo que defendemos */}
        <Banda id="lo-que-defendemos" className="scroll-mt-32">
          <h2 className={H2_BANDA}>Lo que defendemos</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {DEFENDEMOS.map((d) => (
              <li key={d.titulo}>
                <TarjetaCompromiso titulo={d.titulo} texto={d.texto} />
              </li>
            ))}
          </ul>
        </Banda>

        {/* 5. Los 4 Pilares */}
        <Banda id="pilares" tono="suave">
          <h2 className={H2_BANDA}>Los 4 Pilares ASPAL</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PILARES.map((pilar) => (
              <li key={pilar.id}>
                <PilarCard pilar={pilar} variante="resumen" />
              </li>
            ))}
          </ul>
        </Banda>

        {/* 6. Cómo aportamos */}
        <Banda>
          <h2 className={H2_BANDA}>Cómo aportamos al sector asociativo LATAM</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {APORTES.map((aporte) => (
              <li
                key={aporte.slice(0, 20)}
                className="flex gap-3 text-lg text-foreground"
              >
                <CheckCircle2
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {aporte}
              </li>
            ))}
          </ul>
        </Banda>

        {/* 7. Ruta 2026–2030 */}
        <Banda id="ruta" tono="suave">
          <h2 className={H2_BANDA}>Ruta ASPAL 2026–2030</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Nuestras metas, año a año. Abre cada hito para ver el detalle.
          </p>
          <div className="mt-8">
            <RutaTimeline hitos={RUTA} />
          </div>
        </Banda>

        {/* 8. Quiénes hacen posible ASPAL */}
        <Banda>
          <h2 className={H2_BANDA}>Quiénes hacen posible ASPAL</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {HACEN_POSIBLE.map((tarjeta, i) => (
              <li key={tarjeta.titulo}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground">{tarjeta.titulo}</h3>
                  <p className="mt-3 text-base text-muted-foreground">{tarjeta.texto}</p>
                  <div className="mt-auto pt-4">
                    {tarjeta.enlace.href ? (
                      tarjeta.enlace.href.startsWith("/") ? (
                        <Link
                          href={tarjeta.enlace.href}
                          data-testid={`enlace-hacen-posible-${i}`}
                          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
                        >
                          {tarjeta.enlace.etiqueta}
                        </Link>
                      ) : (
                        <a
                          href={tarjeta.enlace.href}
                          data-testid={`enlace-hacen-posible-${i}`}
                          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
                        >
                          {tarjeta.enlace.etiqueta}
                        </a>
                      )
                    ) : (
                      <span className="inline-flex min-h-11 items-center gap-2 text-muted-foreground">
                        {tarjeta.enlace.etiqueta} <Proximamente />
                      </span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Banda>

        {/* 9. Aliados */}
        <Banda id="aliados" tono="suave" className="scroll-mt-32">
          <h2 className={H2_BANDA}>Aliados estratégicos</h2>
          <div className="mt-8">
            <MuroAliados
              fundadores={ALIADOS_FUNDADORES}
              pendientes={CATEGORIAS_ALIADOS_PENDIENTES}
            />
          </div>
        </Banda>

        {/* 10. Únete a la casa común */}
        <Banda tono="noche">
          <h2 className="text-3xl font-extrabold md:text-5xl">{HASHTAG}</h2>
          {CTA_FINAL.map((parrafo) => (
            <p
              key={parrafo.slice(0, 20)}
              className="mt-4 max-w-2xl text-lg text-white/85"
            >
              {parrafo}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className={BOTON_MIEL_NOCHE} asChild>
              <Link
                href="/unete"
                onClick={() => registrarEvento("click_unete", { origen: "nosotros" })}
                data-testid="button-nosotros-membresias"
              >
                Explorar membresías
              </Link>
            </Button>
            <Button variant="outline" className={BOTON_CONTORNO_NOCHE} asChild>
              <a href="#boletin" data-testid="button-nosotros-boletin">
                Suscribirme al boletín
              </a>
            </Button>
            {/* PENDIENTE (Etapa 0): /contacto. Mientras tanto, correo. */}
            <Button variant="outline" className={BOTON_CONTORNO_NOCHE} asChild>
              <a
                href={`mailto:${CONTACTO.correo}`}
                data-testid="button-nosotros-contacto"
              >
                Contactar al equipo
              </a>
            </Button>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
