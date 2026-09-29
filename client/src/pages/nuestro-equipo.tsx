import { PerfilCard } from "@/components/institucional/PerfilCard";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { INTRO_EQUIPO, PERFILES } from "@/content/institucional/equipo";

/** Nuestro equipo (§6.4): intro y tres perfiles del Concepto NOSOTROS, Bloque 8. */
export default function NuestroEquipo() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SubnavSeccion />
      <main className="flex-1">
        <HeroInstitucional overline="Nuestro equipo" titulo="Quiénes hacen posible ASPAL">
          <p>{INTRO_EQUIPO}</p>
        </HeroInstitucional>
        <Banda tono="suave">
          <ul className="grid gap-6 md:grid-cols-3">
            {PERFILES.map((perfil) => (
              <li key={perfil.nombre}>
                <PerfilCard perfil={perfil} />
              </li>
            ))}
          </ul>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
