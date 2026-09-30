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
import { VocesRed } from "@/components/institucional/VocesRed";
import { Banda } from "@/components/layout/Banda";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { PatronPanal } from "@/components/layout/PatronPanal";
import { Proximamente } from "@/components/layout/Proximamente";
import { PERFILES } from "@/content/institucional/equipo";
import type { Testimonio } from "@/content/institucional/inicio";
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

/** Testimonios de ejemplo para la demo de VocesRed (rotulados como tales). */
const TESTIMONIOS_EJEMPLO: Testimonio[] = [
  {
    cita: "Texto de ejemplo del catálogo: aquí va una cita real de menos de 30 palabras de un directivo de la red.",
    nombre: "Nombre Apellido",
    cargo: "Dirección ejecutiva",
    organizacion: "Asociación de ejemplo",
    pais: "México",
  },
  {
    cita: "Segunda cita de ejemplo, para ver cómo se reparte la rejilla con dos o tres testimonios.",
    nombre: "Otra Persona",
    cargo: "Presidencia",
    organizacion: "Colegio de ejemplo",
    pais: "Colombia",
  },
];

const texto = (v: string | boolean) => String(v);

/** Atributo JSX con el valor escapado: una comilla en el texto no rompe el código. */
const atributo = (nombre: string, valor: string | boolean) =>
  `${nombre}={${JSON.stringify(texto(valor))}}`;

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
      {
        tipo: "interruptor",
        clave: "visual",
        etiqueta: "visual (panal a la derecha, desde lg)",
        inicial: false,
      },
    ],
    nota: "Pinta el <h1> de la página: úsalo una sola vez. La columna visual solo aparece desde 1024 px.",
    render: (v) => (
      <HeroInstitucional
        overline={texto(v.overline)}
        overlineNormal={Boolean(v.overlineNormal)}
        titulo={texto(v.titulo)}
        visual={v.visual ? <PatronPanal /> : undefined}
      >
        <p>Párrafo de apoyo del hero.</p>
      </HeroInstitucional>
    ),
    codigo: (v) =>
      `<HeroInstitucional ${atributo("overline", v.overline)}${v.overlineNormal ? " overlineNormal" : ""} ${atributo("titulo", v.titulo)}${v.visual ? " visual={<PatronPanal />}" : ""}>\n  <p>…</p>\n</HeroInstitucional>`,
  },
  "patron-panal": {
    fondo: "noche",
    nota: "Decorativo (aria-hidden) y estático: se prerenderiza igual sin JavaScript.",
    render: () => (
      <div className="mx-auto max-w-md">
        <PatronPanal />
      </div>
    ),
    codigo: () => `<PatronPanal className="…" />`,
  },
  proximamente: {
    render: () => (
      <p className="flex flex-wrap items-center gap-2 text-lg">
        Estudios e investigaciones <Proximamente />
      </p>
    ),
    codigo: () =>
      `<p className="flex flex-wrap items-center gap-2 text-lg">
  Estudios e investigaciones <Proximamente />
</p>`,
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
      {
        tipo: "interruptor",
        clave: "ilustracion",
        etiqueta: "ilustracion",
        inicial: true,
      },
    ],
    render: (v) => (
      <div className="max-w-sm">
        <PilarCard
          pilar={PILARES.find((p) => p.id === v.pilar) ?? PILARES[0]}
          variante={texto(v.variante) as "resumen" | "detalle"}
          ilustracion={Boolean(v.ilustracion)}
        />
      </div>
    ),
    codigo: (v) =>
      `<PilarCard pilar={PILARES.find((p) => p.id === ${JSON.stringify(texto(v.pilar))})!} variante="${texto(v.variante)}"${v.ilustracion ? " ilustracion" : ""} />`,
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
    codigo: (v) =>
      `<TarjetaCompromiso ${atributo("titulo", v.titulo)} ${atributo("texto", v.texto)} />`,
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
      `<PerfilCard perfil={PERFILES.find((p) => p.nombre === ${JSON.stringify(texto(v.perfil))})!} />`,
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
    codigo: (v) => {
      const i = Number(v.etapa) - 1;
      // Sin `anterior` en la primera etapa ni `siguiente` en la última.
      const anterior = i > 0 ? ` anterior={ETAPAS[${i - 1}]}` : "";
      const siguiente = i < ETAPAS.length - 1 ? ` siguiente={ETAPAS[${i + 1}]}` : "";
      return `<EtapaMapa etapa={ETAPAS[${i}]}${anterior}${siguiente} />`;
    },
  },
  "blog-card": {
    controles: [
      {
        tipo: "interruptor",
        clave: "imagen",
        etiqueta: "con imagen destacada",
        inicial: true,
      },
      {
        tipo: "opciones",
        clave: "tipo",
        etiqueta: "etiqueta",
        opciones: ["—", "Blog", "Podcast"],
        inicial: "Blog",
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
          etiqueta={v.tipo === "—" ? undefined : texto(v.tipo)}
        />
      </div>
    ),
    codigo: (v) =>
      `<BlogCard post={post}${v.tipo === "—" ? "" : ` ${atributo("etiqueta", v.tipo)}`} />`,
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
  "voces-red": {
    nota: "Testimonios de ejemplo del catálogo (no son reales). En la home, con TESTIMONIOS vacío la sección no se pinta.",
    render: () => <VocesRed testimonios={TESTIMONIOS_EJEMPLO} />,
    codigo: () => `<VocesRed testimonios={TESTIMONIOS} />`,
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
