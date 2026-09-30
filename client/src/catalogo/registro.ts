/**
 * Catálogo de componentes: una entrada por archivo de `client/src/components/`.
 * Lo lee la página /componentes y, sobre todo, quien vaya a crear una vista:
 * antes de escribir un componente, busca aquí uno que ya lo resuelva
 * (`usarCuando`, `evitarPara`). `registro.test.ts` falla si un componente no
 * está registrado o si su `estado` no coincide con quién lo importa.
 */
import type { Categoria, EntradaCatalogo } from "./tipos";

export const CATEGORIAS: readonly {
  id: Categoria;
  titulo: string;
  descripcion: string;
}[] = [
  {
    id: "layout",
    titulo: "Estructura de página",
    descripcion: "Lo que arma cualquier página: bandas, hero, cabecera, pie.",
  },
  {
    id: "institucional",
    titulo: "Institucional",
    descripcion:
      "Piezas de Nosotros, ¿Qué hacemos?, Equipo y Mapa de Ruta. Leen su copy de client/src/content/institucional.",
  },
  {
    id: "contenido",
    titulo: "Contenido de WordPress",
    descripcion: "Tarjetas y bloques que pintan artículos y episodios de /api/*.",
  },
  {
    id: "formularios",
    titulo: "Formularios",
    descripcion: "Captura de datos. Validan con la misma función que el servidor.",
  },
  {
    id: "ui",
    titulo: "Base (shadcn/ui)",
    descripcion:
      "Primitivas tematizadas con los tokens del sitio. Solo las que se usan; una nueva se añade con el CLI de shadcn.",
  },
  {
    id: "legado",
    titulo: "Legado de /plataforma",
    descripcion:
      "Secciones de la antigua home de producto. Solo viven en /plataforma: no las reutilices en páginas nuevas.",
  },
  {
    id: "infraestructura",
    titulo: "Infraestructura",
    descripcion:
      "Componentes sin interfaz propia que montan comportamiento global en App.tsx.",
  },
];

export const REGISTRO = [
  // ── Estructura de página ───────────────────────────────────────────────
  {
    id: "banda",
    nombre: "Banda",
    archivo: "client/src/components/layout/Banda.tsx",
    importar: 'import { Banda } from "@/components/layout/Banda";',
    categoria: "layout",
    descripcion:
      "Franja horizontal a todo el ancho con el contenedor y el espaciado del sitio (py-16 md:py-24, max-w-7xl).",
    usarCuando: "Cada bloque de una página. Alterna tonos: blanco → suave → noche.",
    evitarPara:
      "Tarjetas o cajas dentro de una banda: para eso, un div con rounded-2xl border.",
    props:
      'tono?: "blanco" | "suave" | "noche"; id?: string; className?: string; children',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "hero-institucional",
    nombre: "HeroInstitucional",
    archivo: "client/src/components/layout/HeroInstitucional.tsx",
    importar:
      'import { HeroInstitucional } from "@/components/layout/HeroInstitucional";',
    categoria: "layout",
    descripcion:
      "Banda noche con overline miel y el único <h1> de la página. Sin animaciones: se prerenderiza.",
    usarCuando: "La cabecera de cualquier página institucional nueva.",
    evitarPara: "Más de una vez por página (pinta el <h1>).",
    props: "overline: string; overlineNormal?: boolean; titulo: string; children?",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "proximamente",
    nombre: "Proximamente",
    archivo: "client/src/components/layout/Proximamente.tsx",
    importar: 'import { Proximamente } from "@/components/layout/Proximamente";',
    categoria: "layout",
    descripcion: "Etiqueta «Próximamente» para un destino que aún no existe.",
    usarCuando: "Junto a un enlace o sección sin página todavía (menú, pilares, pie).",
    props: "className?: string",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "aviso-pestana-nueva",
    nombre: "AvisoPestanaNueva",
    archivo: "client/src/components/layout/AvisoPestanaNueva.tsx",
    importar:
      'import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";',
    categoria: "layout",
    descripcion:
      "Texto solo para lectores de pantalla: «(se abre en una pestaña nueva)».",
    usarCuando: 'Dentro de todo enlace con target="_blank", junto al icono ↗.',
    props: "sin props",
    estado: "en-uso",
    vista: "sin-vista",
  },
  {
    id: "header",
    nombre: "Header",
    archivo: "client/src/components/layout/Header.tsx",
    importar: 'import Header from "@/components/layout/Header";',
    categoria: "layout",
    descripcion:
      "Cabecera con los cinco rubros (mega-menú desde 1280 px), panel móvil modal y botón Únete. Lee client/src/lib/navegacion.ts.",
    usarCuando:
      "Primera pieza de toda página. Para cambiar el menú, edita navegacion.ts, no este componente.",
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "footer",
    nombre: "Footer",
    archivo: "client/src/components/layout/Footer.tsx",
    importar: 'import Footer from "@/components/layout/Footer";',
    categoria: "layout",
    descripcion:
      "Pie institucional: boletín, cuatro columnas de navegación, contacto y franja legal.",
    usarCuando:
      "Última pieza de toda página. conBoletin={false} si la página ya tiene su propio formulario de boletín.",
    props: "conBoletin?: boolean",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "saltar-al-contenido",
    nombre: "SaltarAlContenido",
    archivo: "client/src/components/layout/SaltarAlContenido.tsx",
    importar:
      'import { SaltarAlContenido } from "@/components/layout/SaltarAlContenido";',
    categoria: "infraestructura",
    descripcion:
      'Primer enlace de cada página (visible al tabular): salta al <main id="contenido">.',
    usarCuando:
      'Ya está en App.tsx. Toda página nueva necesita su <main id="contenido" tabIndex={-1}> (el build lo exige).',
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "scroll-to-top",
    nombre: "ScrollToTop",
    archivo: "client/src/components/layout/ScrollToTop.tsx",
    importar: 'import { ScrollToTop } from "@/components/layout/ScrollToTop";',
    categoria: "layout",
    descripcion: "Botón flotante «volver arriba» que aparece tras 300 px de scroll.",
    usarCuando: "Ya está en App.tsx; no se añade por página.",
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "cabecera-ruta",
    nombre: "CabeceraRuta",
    archivo: "client/src/components/layout/CabeceraRuta.tsx",
    importar: 'import { CabeceraRuta } from "@/components/layout/CabeceraRuta";',
    categoria: "infraestructura",
    descripcion:
      "Mantiene título y descripción al navegar sin recargar y canonicaliza mayúsculas en la URL.",
    usarCuando:
      "Ya está en App.tsx. El título de una página nueva va en SEO de client/src/lib/seo.ts.",
    props: "sin props",
    estado: "en-uso",
    vista: "sin-vista",
  },
  {
    id: "scroll-restoration",
    nombre: "ScrollRestoration",
    archivo: "client/src/components/layout/ScrollRestoration.tsx",
    importar:
      'import { ScrollRestoration } from "@/components/layout/ScrollRestoration";',
    categoria: "infraestructura",
    descripcion:
      "Restaura el scroll con Atrás/Adelante y lleva a las anclas (#etapa-3, #tecnologia) al entrar o recargar.",
    usarCuando: "Ya está en App.tsx. Las anclas nuevas solo necesitan id y scroll-mt-32.",
    props: "sin props",
    estado: "en-uso",
    vista: "sin-vista",
  },
  {
    id: "error-boundary",
    nombre: "ErrorBoundary",
    archivo: "client/src/components/layout/ErrorBoundary.tsx",
    importar: 'import { ErrorBoundary } from "@/components/layout/ErrorBoundary";',
    categoria: "infraestructura",
    descripcion:
      "Captura errores de render y muestra una salida (recargar o ir al inicio) en vez de una pantalla en blanco.",
    usarCuando: "Ya envuelve el Router en App.tsx.",
    props: "children",
    estado: "en-uso",
    vista: "sin-vista",
  },

  // ── Institucional ──────────────────────────────────────────────────────
  {
    id: "pilar-card",
    nombre: "PilarCard",
    archivo: "client/src/components/institucional/PilarCard.tsx",
    importar: 'import { PilarCard } from "@/components/institucional/PilarCard";',
    categoria: "institucional",
    descripcion:
      "Tarjeta de uno de los 4 pilares. «resumen» (h3, enlace al detalle) o «detalle» (h2, cómo se traduce y enlaces).",
    usarCuando:
      "Mostrar pilares: home, Nosotros, ¿Qué hacemos?. Datos en content/institucional/pilares.ts.",
    props: 'pilar: Pilar; variante: "resumen" | "detalle"',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "tarjeta-compromiso",
    nombre: "TarjetaCompromiso",
    archivo: "client/src/components/institucional/TarjetaCompromiso.tsx",
    importar:
      'import { TarjetaCompromiso } from "@/components/institucional/TarjetaCompromiso";',
    categoria: "institucional",
    descripcion: "Tarjeta simple de título + texto (Lo que defendemos).",
    usarCuando: "Enunciados cortos de valores o compromisos en rejilla.",
    props: "titulo: string; texto: string",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "ruta-timeline",
    nombre: "RutaTimeline",
    archivo: "client/src/components/institucional/RutaTimeline.tsx",
    importar: 'import { RutaTimeline } from "@/components/institucional/RutaTimeline";',
    categoria: "institucional",
    descripcion:
      "Escalera de hitos por año con <details> nativo: se abre con clic, toque o teclado.",
    usarCuando: "Cualquier línea de tiempo con detalle desplegable.",
    props: "hitos: Hito[]",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "perfil-card",
    nombre: "PerfilCard",
    archivo: "client/src/components/institucional/PerfilCard.tsx",
    importar: 'import { PerfilCard } from "@/components/institucional/PerfilCard";',
    categoria: "institucional",
    descripcion:
      "Perfil de una persona: foto (o silueta con el isotipo), nombre, cargo, bio y LinkedIn.",
    usarCuando: "Equipo, Consejo, ponentes.",
    props: "perfil: Perfil",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "muro-aliados",
    nombre: "MuroAliados",
    archivo: "client/src/components/institucional/MuroAliados.tsx",
    importar: 'import { MuroAliados } from "@/components/institucional/MuroAliados";',
    categoria: "institucional",
    descripcion:
      "Rejilla estática de aliados con logo y descripción, y categorías pendientes opcionales.",
    usarCuando: "Aliados o patrocinadores. Sin carrusel automático (accesibilidad).",
    props: "fundadores: Aliado[]; pendientes?: string[]",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "subnav-seccion",
    nombre: "SubnavSeccion",
    archivo: "client/src/components/institucional/SubnavSeccion.tsx",
    importar: 'import { SubnavSeccion } from "@/components/institucional/SubnavSeccion";',
    categoria: "institucional",
    descripcion:
      "Subnavegación fija bajo la cabecera con las páginas de «Acerca de», marcando la activa.",
    usarCuando: "Páginas de Acerca de. Sus destinos salen de navegacion.ts.",
    props: "sin props",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "indice-etapas",
    nombre: "IndiceEtapas",
    archivo: "client/src/components/institucional/IndiceEtapas.tsx",
    importar: 'import { IndiceEtapas } from "@/components/institucional/IndiceEtapas";',
    categoria: "institucional",
    descripcion:
      "Las 7 etapas del Mapa de Ruta en lista ordenada: franja de la home (enlaza a /mapa-de-ruta#etapa-N) o índice de la página.",
    usarCuando: "Enlazar a las etapas del Mapa de Ruta.",
    props: 'origen: "home" | "mapa"',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "etapa-mapa",
    nombre: "EtapaMapa",
    archivo: "client/src/components/institucional/EtapaMapa.tsx",
    importar: 'import { EtapaMapa } from "@/components/institucional/EtapaMapa";',
    categoria: "institucional",
    descripcion:
      "Una etapa del Mapa de Ruta: pasos, frase de cierre y enlaces a la anterior y la siguiente.",
    usarCuando: "Dentro de una Banda con id={etapa.id} en /mapa-de-ruta.",
    props: "etapa: EtapaMapa; anterior?: EtapaMapa; siguiente?: EtapaMapa",
    estado: "en-uso",
    vista: "demo",
  },

  // ── Contenido de WordPress ─────────────────────────────────────────────
  {
    id: "blog-card",
    nombre: "BlogCard",
    archivo: "client/src/components/content/BlogCard.tsx",
    importar: 'import BlogCard from "@/components/content/BlogCard";',
    categoria: "contenido",
    descripcion:
      "Tarjeta de artículo: imagen (si la hay), título, extracto y fecha. Enlaza fuera (muro de MemberPress, D9).",
    usarCuando: "Listar artículos de /api/posts.",
    evitarPara: "Episodios de podcast: PodcastCard.",
    props: "post: TransformedPost",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "podcast-card",
    nombre: "PodcastCard",
    archivo: "client/src/components/content/PodcastCard.tsx",
    importar: 'import { PodcastCard } from "@/components/content/PodcastCard";',
    categoria: "contenido",
    descripcion:
      "Tarjeta de episodio: portada (si la hay), número opcional, título, descripción y fecha.",
    usarCuando: "Listar episodios de /api/podcasts.",
    props: "podcast: TransformedPost; episodeNumber?: number",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "contenido-reciente",
    nombre: "ContenidoReciente",
    archivo: "client/src/components/content/ContenidoReciente.tsx",
    importar:
      'import { ContenidoReciente } from "@/components/content/ContenidoReciente";',
    categoria: "contenido",
    descripcion:
      "Banda con 3 artículos y el último episodio. Si la API falla, desaparece (RF-13).",
    usarCuando: "Traer contenido reciente a una página institucional.",
    props: "sin props",
    estado: "en-uso",
    vista: "demo",
  },

  // ── Formularios ────────────────────────────────────────────────────────
  {
    id: "form-suscripcion",
    nombre: "FormSuscripcion",
    archivo: "client/src/components/forms/FormSuscripcion.tsx",
    importar: 'import { FormSuscripcion } from "@/components/forms/FormSuscripcion";',
    categoria: "formularios",
    descripcion:
      "Alta al boletín: valida con la misma función que el servidor, envía a /api/suscripcion y explica la doble confirmación.",
    usarCuando: "Cualquier captura de correo. origen etiqueta la alta en Mailchimp.",
    evitarPara: "Formularios que no sean de boletín.",
    props:
      'origen: "unete" | "home" | "footer" | "eventos"; variante: "completo" | "compacto"; tono?: "claro" | "noche"',
    estado: "en-uso",
    vista: "demo",
  },

  // ── Base (shadcn/ui) ───────────────────────────────────────────────────
  {
    id: "button",
    nombre: "Button",
    archivo: "client/src/components/ui/button.tsx",
    importar: 'import { Button } from "@/components/ui/button";',
    categoria: "ui",
    descripcion:
      'Botón base. Primario: variant="secondary" (miel). Secundario: outline. Sobre noche: clases de client/src/lib/clases.ts.',
    usarCuando: "Toda acción. Con asChild para envolver un Link o un <a>.",
    evitarPara: "Enlaces de texto dentro de un párrafo.",
    props:
      'variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"; size?: "default" | "sm" | "lg" | "icon"; asChild?: boolean',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "badge",
    nombre: "Badge",
    archivo: "client/src/components/ui/badge.tsx",
    importar: 'import { Badge } from "@/components/ui/badge";',
    categoria: "ui",
    descripcion: "Etiqueta pequeña (categoría, número de episodio).",
    usarCuando: "Metadatos cortos que no se pulsan.",
    props: 'variant?: "default" | "secondary" | "outline" | "destructive"',
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "card",
    nombre: "Card",
    archivo: "client/src/components/ui/card.tsx",
    importar:
      'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";',
    categoria: "ui",
    descripcion:
      "Contenedor con borde y fondo de tarjeta, con partes Header/Title/Description/Content/Footer.",
    usarCuando:
      "Tarjetas de contenido de WordPress. En páginas institucionales se usa un div rounded-2xl border (ver PilarCard).",
    props: "className?; children (componer con CardHeader, CardContent…)",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "input",
    nombre: "Input",
    archivo: "client/src/components/ui/input.tsx",
    importar: 'import { Input } from "@/components/ui/input";',
    categoria: "ui",
    descripcion: "Campo de texto tematizado.",
    usarCuando: "Dentro de un formulario, siempre con <label> asociado.",
    props: "props de <input>",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "collapsible",
    nombre: "Collapsible",
    archivo: "client/src/components/ui/collapsible.tsx",
    importar:
      'import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";',
    categoria: "ui",
    descripcion: "Bloque que se abre y cierra (acordeones del panel móvil).",
    usarCuando:
      "Grupos desplegables controlados. Para texto estático que se despliega, <details> nativo (ver RutaTimeline).",
    props: "open?; onOpenChange?; children",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "tooltip",
    nombre: "Tooltip",
    archivo: "client/src/components/ui/tooltip.tsx",
    importar:
      'import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";',
    categoria: "ui",
    descripcion: "Ayuda breve al pasar o enfocar. TooltipProvider ya está en App.tsx.",
    usarCuando:
      "Aclarar un icono. Nunca para información imprescindible (no llega en móvil).",
    props: "Tooltip > TooltipTrigger asChild + TooltipContent",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "toast",
    nombre: "Toast",
    archivo: "client/src/components/ui/toast.tsx",
    // Se lanza desde el hook; el componente de "@/components/ui/toast" lo pinta el Toaster.
    importar:
      'import { toast } from "@/hooks/use-toast"; // pinta: "@/components/ui/toast"',
    categoria: "ui",
    descripcion:
      "Aviso temporal en esquina. Se lanza con toast({ title, description }) desde @/hooks/use-toast.",
    usarCuando: "Confirmaciones breves que no requieren acción.",
    evitarPara: "Errores de formulario: van junto al campo (ver FormSuscripcion).",
    props: "toast({ title, description, variant })",
    estado: "en-uso",
    vista: "demo",
  },
  {
    id: "toaster",
    nombre: "Toaster",
    archivo: "client/src/components/ui/toaster.tsx",
    importar: 'import { Toaster } from "@/components/ui/toaster";',
    categoria: "ui",
    descripcion: "Contenedor donde aparecen los toasts.",
    usarCuando: "Ya está en App.tsx.",
    props: "sin props",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },
  {
    id: "navigation-menu",
    nombre: "NavigationMenu",
    archivo: "client/src/components/ui/navigation-menu.tsx",
    importar:
      'import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";',
    categoria: "ui",
    descripcion: "Primitiva del mega-menú de escritorio (Radix).",
    usarCuando: "Solo la usa Header. axe marca su focus proxy: es interno de Radix.",
    props: "ver Radix NavigationMenu",
    estado: "en-uso",
    vista: "en-esta-pagina",
  },

  // ── Legado de /plataforma ──────────────────────────────────────────────
  ...(
    [
      [
        "hero-section",
        "HeroSection",
        "HeroSection",
        "default",
        "Hero de producto con captura del panel.",
      ],
      [
        "problem-section",
        "ProblemSection",
        "ProblemSection",
        "default",
        "Bloque problema/solución con ilustración (y MembershipProblemSection).",
      ],
      [
        "features-grid",
        "FeaturesGrid",
        "FeaturesGrid",
        "default",
        "Rejilla de funcionalidades de producto.",
      ],
      [
        "feature-card",
        "FeatureCard",
        "FeatureCard",
        "default",
        "Tarjeta de una funcionalidad (la usa FeaturesGrid).",
      ],
      [
        "logo-carousel",
        "LogoCarousel",
        "LogoCarousel",
        "default",
        "Carrusel de logos de clientes.",
      ],
      [
        "cta-section",
        "CTASection",
        "CTASection",
        "default",
        "Llamada final a registrarse en la plataforma.",
      ],
      [
        "community-graphics",
        "CommunityGraphics",
        "HexagonNetwork",
        "named",
        "Gráficos decorativos SVG (HexagonNetwork, DecorativeBlob…).",
      ],
    ] as const
  ).map(([id, archivo, nombre, exportacion, descripcion]) => ({
    id,
    nombre: archivo === "CommunityGraphics" ? "CommunityGraphics" : nombre,
    archivo: `client/src/components/sections/${archivo}.tsx`,
    importar:
      exportacion === "default"
        ? `import ${nombre} from "@/components/sections/${archivo}";`
        : `import { ${nombre} } from "@/components/sections/${archivo}";`,
    categoria: "legado" as const,
    descripcion,
    usarCuando: "Solo en /plataforma, hasta su reubicación en la Etapa 3.",
    evitarPara:
      "Páginas nuevas: usa Banda, HeroInstitucional y los componentes institucionales.",
    props: "ver el archivo",
    estado: "en-uso" as const,
    vista: "sin-vista" as const,
  })),
] as const satisfies readonly EntradaCatalogo[];

type Entrada = (typeof REGISTRO)[number];
export type IdComponente = Entrada["id"];
export type IdDemoPropio = Exclude<
  Extract<Entrada, { vista: "demo" }>,
  { categoria: "ui" }
>["id"];
export type IdDemoUi = Extract<Entrada, { vista: "demo"; categoria: "ui" }>["id"];
