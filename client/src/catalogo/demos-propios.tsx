import BlogCard from "@/components/content/BlogCard";
import { ContenidoReciente } from "@/components/content/ContenidoReciente";
import { PodcastCard } from "@/components/content/PodcastCard";
import { FormSuscripcion } from "@/components/forms/FormSuscripcion";
import { EtapaMapa } from "@/components/institucional/EtapaMapa";
import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";
import { MuroAliados } from "@/components/institucional/MuroAliados";
import { PerfilCard } from "@/components/institucional/PerfilCard";
import { PilarCard } from "@/components/institucional/PilarCard";
import { RutaTimeline } from "@/components/institucional/RutaTimeline";
import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";
import { TarjetaCompromiso } from "@/components/institucional/TarjetaCompromiso";
import { Banda } from "@/components/layout/Banda";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Proximamente } from "@/components/layout/Proximamente";
import { PERFILES } from "@/content/institucional/equipo";
import { ETAPAS } from "@/content/institucional/mapa-ruta";
import {
  ALIADOS_FUNDADORES,
  CATEGORIAS_ALIADOS_PENDIENTES,
  DEFENDEMOS,
  RUTA,
} from "@/content/institucional/nosotros";
import { PILARES } from "@/content/institucional/pilares";
import type { TransformedPost } from "@shared/wordpress/types";
import type { IdDemoPropio } from "./registro";
import type { Demo, Fondo } from "./tipos";

/** Post de ejemplo para las tarjetas de contenido (no es un artículo real). */
const POST_EJEMPLO: TransformedPost = {
  id: 1,
  title: "Artículo de ejemplo del catálogo",
  slug: "ejemplo",
  excerpt:
    "Extracto de ejemplo para ver cómo corta la tarjeta un texto de dos o tres líneas en el listado.",
  content: "",
  featuredImage: "/og-aspal.png",
  category: "Blog",
  categorySlugs: ["blog"],
  publishedAt: "2026-09-01T12:00:00Z",
  isGated: false,
  readingMinutes: 5,
  author: "ASPAL",
  link: "https://comunidad.asociacionesprofesionales.org/",
};

const texto = (v: string | boolean) => String(v);

export const DEMOS_PROPIOS: Record<IdDemoPropio, Demo> = {
  banda: {
    controles: [
      {
        tipo: "opciones",
        clave: "tono",
        etiqueta: "tono",
        opciones: ["blanco", "suave", "noche"],
        inicial: "suave",
      },
    ],
    render: (v) => (
      <Banda tono={texto(v.tono) as "blanco" | "suave" | "noche"}>
        <p className="text-lg">Contenido de una banda con tono «{texto(v.tono)}».</p>
      </Banda>
    ),
    codigo: (v) => `<Banda tono="${texto(v.tono)}">\n  …\n</Banda>`,
  },
  "hero-institucional": {
    controles: [
      { tipo: "texto", clave: "overline", etiqueta: "overline", inicial: "Nosotros" },
      {
        tipo: "texto",
        clave: "titulo",
        etiqueta: "titulo",
        inicial: "La red en español del sector asociativo de América Latina.",
      },
      {
        tipo: "interruptor",
        clave: "overlineNormal",
        etiqueta: "overlineNormal (sin mayúsculas)",
        inicial: false,
      },
    ],
    nota: "Pinta el <h1> de la página: úsalo una sola vez.",
    render: (v) => (
      <HeroInstitucional
        overline={texto(v.overline)}
        overlineNormal={Boolean(v.overlineNormal)}
        titulo={texto(v.titulo)}
      >
        <p>Párrafo de apoyo del hero.</p>
      </HeroInstitucional>
    ),
    codigo: (v) =>
      `<HeroInstitucional overline="${texto(v.overline)}"${v.overlineNormal ? " overlineNormal" : ""} titulo="${texto(v.titulo)}">\n  <p>…</p>\n</HeroInstitucional>`,
  },
  proximamente: {
    render: () => (
      <p className="flex items-center gap-2 text-lg">
        Estudios e investigaciones <Proximamente />
      </p>
    ),
    codigo: () => `<span>Estudios e investigaciones</span> <Proximamente />`,
  },
  "pilar-card": {
    controles: [
      {
        tipo: "opciones",
        clave: "pilar",
        etiqueta: "pilar",
        opciones: PILARES.map((p) => p.id),
        inicial: "comunidad",
      },
      {
        tipo: "opciones",
        clave: "variante",
        etiqueta: "variante",
        opciones: ["resumen", "detalle"],
        inicial: "resumen",
      },
    ],
    render: (v) => (
      <div className="max-w-xl">
        <PilarCard
          pilar={PILARES.find((p) => p.id === v.pilar) ?? PILARES[0]}
          variante={texto(v.variante) as "resumen" | "detalle"}
        />
      </div>
    ),
    codigo: (v) =>
      `<PilarCard pilar={PILARES.find((p) => p.id === "${texto(v.pilar)}")!} variante="${texto(v.variante)}" />`,
  },
  "tarjeta-compromiso": {
    controles: [
      {
        tipo: "texto",
        clave: "titulo",
        etiqueta: "titulo",
        inicial: DEFENDEMOS[0].titulo,
      },
      { tipo: "texto", clave: "texto", etiqueta: "texto", inicial: DEFENDEMOS[0].texto },
    ],
    render: (v) => (
      <div className="max-w-md">
        <TarjetaCompromiso titulo={texto(v.titulo)} texto={texto(v.texto)} />
      </div>
    ),
    codigo: (v) => `<TarjetaCompromiso titulo="${texto(v.titulo)}" texto="…" />`,
  },
  "ruta-timeline": {
    render: () => <RutaTimeline hitos={RUTA} />,
    codigo: () => `<RutaTimeline hitos={RUTA} />`,
  },
  "perfil-card": {
    controles: [
      {
        tipo: "opciones",
        clave: "perfil",
        etiqueta: "perfil",
        opciones: PERFILES.map((p) => p.nombre),
        inicial: PERFILES[0].nombre,
      },
    ],
    render: (v) => (
      <div className="max-w-sm">
        <PerfilCard perfil={PERFILES.find((p) => p.nombre === v.perfil) ?? PERFILES[0]} />
      </div>
    ),
    codigo: (v) =>
      `<PerfilCard perfil={PERFILES.find((p) => p.nombre === "${texto(v.perfil)}")!} />`,
  },
  "muro-aliados": {
    controles: [
      {
        tipo: "interruptor",
        clave: "pendientes",
        etiqueta: "con categorías pendientes",
        inicial: true,
      },
    ],
    fondo: "suave",
    render: (v) => (
      <MuroAliados
        fundadores={ALIADOS_FUNDADORES}
        pendientes={v.pendientes ? CATEGORIAS_ALIADOS_PENDIENTES : undefined}
      />
    ),
    codigo: (v) =>
      `<MuroAliados fundadores={ALIADOS_FUNDADORES}${v.pendientes ? " pendientes={CATEGORIAS_ALIADOS_PENDIENTES}" : ""} />`,
  },
  "subnav-seccion": {
    nota: "Sticky bajo la cabecera. Solo se pinta con dos o más destinos de Acerca de y marca la ruta activa.",
    render: () => <SubnavSeccion />,
    codigo: () => `<Header />\n<SubnavSeccion />`,
  },
  "indice-etapas": {
    controles: [
      {
        tipo: "opciones",
        clave: "origen",
        etiqueta: "origen",
        opciones: ["home", "mapa"],
        inicial: "home",
      },
    ],
    render: (v) => <IndiceEtapas origen={texto(v.origen) as "home" | "mapa"} />,
    codigo: (v) => `<IndiceEtapas origen="${texto(v.origen)}" />`,
  },
  "etapa-mapa": {
    controles: [
      {
        tipo: "opciones",
        clave: "etapa",
        etiqueta: "etapa",
        opciones: ETAPAS.map((e) => String(e.numero)),
        inicial: "1",
      },
    ],
    render: (v) => {
      const i = Number(v.etapa) - 1;
      return (
        <EtapaMapa etapa={ETAPAS[i]} anterior={ETAPAS[i - 1]} siguiente={ETAPAS[i + 1]} />
      );
    },
    codigo: (v) =>
      `<EtapaMapa etapa={ETAPAS[${Number(v.etapa) - 1}]} anterior={ETAPAS[${Number(v.etapa) - 2}]} siguiente={ETAPAS[${Number(v.etapa)}]} />`,
  },
  "blog-card": {
    controles: [
      {
        tipo: "interruptor",
        clave: "imagen",
        etiqueta: "con imagen destacada",
        inicial: true,
      },
    ],
    fondo: "suave",
    nota: "Datos de ejemplo. En la app, el post llega de /api/posts.",
    render: (v) => (
      <div className="max-w-sm">
        <BlogCard
          post={{
            ...POST_EJEMPLO,
            featuredImage: v.imagen ? POST_EJEMPLO.featuredImage : "",
          }}
        />
      </div>
    ),
    codigo: () => `<BlogCard post={post} />`,
  },
  "podcast-card": {
    controles: [
      { tipo: "interruptor", clave: "imagen", etiqueta: "con portada", inicial: true },
      {
        tipo: "opciones",
        clave: "episodio",
        etiqueta: "episodeNumber",
        opciones: ["—", "1", "12"],
        inicial: "12",
      },
    ],
    fondo: "suave",
    nota: "Datos de ejemplo. En la app, el episodio llega de /api/podcasts.",
    render: (v) => (
      <div className="max-w-sm">
        <PodcastCard
          podcast={{
            ...POST_EJEMPLO,
            featuredImage: v.imagen ? POST_EJEMPLO.featuredImage : "",
          }}
          episodeNumber={v.episodio === "—" ? undefined : Number(v.episodio)}
        />
      </div>
    ),
    codigo: (v) =>
      `<PodcastCard podcast={episodio}${v.episodio === "—" ? "" : ` episodeNumber={${texto(v.episodio)}}`} />`,
  },
  "contenido-reciente": {
    nota: "Usa la API real (/api/posts y /api/podcasts). Si falla, el bloque desaparece: es el comportamiento esperado.",
    render: () => <ContenidoReciente />,
    codigo: () => `<ContenidoReciente />`,
  },
  "form-suscripcion": {
    controles: [
      {
        tipo: "opciones",
        clave: "variante",
        etiqueta: "variante",
        opciones: ["compacto", "completo"],
        inicial: "compacto",
      },
      {
        tipo: "opciones",
        clave: "tono",
        etiqueta: "tono",
        opciones: ["claro", "noche"],
        inicial: "claro",
      },
    ],
    fondo: (v): Fondo => (v.tono === "noche" ? "noche" : "blanco"),
    nota: "En el catálogo el envío está desactivado: no se da de alta ningún correo.",
    render: (v) => (
      // Bloquea el submit en captura: el onSubmit del formulario nunca llega a
      // correr, así que no hay POST a /api/suscripcion desde el catálogo.
      <div
        className="max-w-xl"
        onSubmitCapture={(evento) => {
          evento.preventDefault();
          evento.stopPropagation();
        }}
      >
        <FormSuscripcion
          origen="home"
          variante={texto(v.variante) as "compacto" | "completo"}
          tono={texto(v.tono) as "claro" | "noche"}
        />
      </div>
    ),
    codigo: (v) =>
      `<FormSuscripcion origen="…" variante="${texto(v.variante)}"${v.tono === "noche" ? ' tono="noche"' : ""} />`,
  },
};
