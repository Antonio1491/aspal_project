/**
 * Fuente única de verdad de la navegación del sitio y de las URLs de la
 * plataforma de comunidad.
 *
 * Existe por la misma razón que `shared/wordpress/`: la URL de registro estaba
 * escrita a mano en dos sitios (`Header.tsx` y `HeroSection.tsx`), divergieron,
 * y la del Hero apuntaba a `asociacionesprofesionales.org` sin el subdominio
 * `comunidad.` — que sirve un documento vacío. Un solo módulo, dos consumidores.
 *
 * Un destino sin `href` es una sección que todavía no existe: se muestra en el
 * menú marcada como "Próximamente", nunca como enlace. Antes esos destinos
 * apuntaban a anclas (`#biblioteca`, `#cursos`…) que no existen en ninguna
 * página: el clic no hacía absolutamente nada.
 */

import {
  Briefcase,
  Building2,
  CalendarDays,
  GraduationCap,
  Library,
  MessagesSquare,
  Mic,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";

export const COMUNIDAD = "https://comunidad.asociacionesprofesionales.org";

export const URL_REGISTRO = `${COMUNIDAD}/register/membresia-basica/`;
export const URL_LOGIN = `${COMUNIDAD}/login/`;

/**
 * Un destino concreto del menú. Sin `href` = sección aún no construida.
 *
 * El `icono` es decorativo: siempre acompaña a la etiqueta escrita, nunca la
 * sustituye, y va con `aria-hidden`. Se eligen siluetas distintas entre sí
 * —periódico, micrófono, birrete, libros, bocadillos, personas, calendario,
 * edificio, maletín— porque a 16px lo que distingue un icono de otro es la
 * forma, no el detalle.
 */
export interface DestinoNav {
  etiqueta: string;
  /** Una línea de contexto: el público no conoce el vocabulario interno. */
  descripcion: string;
  icono: LucideIcon;
  href?: string;
  externo?: boolean;
  testid: string;
}

/** Una entrada de primer nivel: desplegable (con `destinos`) o enlace suelto. */
export interface EntradaNav {
  etiqueta: string;
  testid: string;
  icono: LucideIcon;
  href?: string;
  externo?: boolean;
  destinos?: DestinoNav[];
}

export const NAVEGACION: EntradaNav[] = [
  {
    etiqueta: "Aprende",
    testid: "menu-aprende",
    icono: GraduationCap,
    destinos: [
      {
        etiqueta: "Blog",
        descripcion: "Artículos y análisis del sector",
        icono: Newspaper,
        href: "/blog",
        testid: "link-blog",
      },
      {
        etiqueta: "Podcast",
        descripcion: "Conversaciones con el sector",
        icono: Mic,
        href: "/podcast",
        testid: "link-podcast",
      },
      {
        etiqueta: "Cursos en Línea",
        descripcion: "Capacitación para tu equipo",
        icono: GraduationCap,
        href: `${COMUNIDAD}/cursos/`,
        externo: true,
        testid: "link-cursos",
      },
      {
        etiqueta: "Biblioteca Digital",
        descripcion: "Documentos y recursos descargables",
        icono: Library,
        testid: "link-biblioteca",
      },
    ],
  },
  {
    etiqueta: "Comunidad",
    testid: "menu-comunidad",
    icono: Users,
    destinos: [
      {
        etiqueta: "Comunidad",
        descripcion: "El feed de la red ASPAL",
        icono: MessagesSquare,
        href: `${COMUNIDAD}/comunidad/`,
        externo: true,
        testid: "link-comunidad",
      },
      {
        etiqueta: "Directorio de Miembros",
        descripcion: "Quién es quién en la red",
        icono: Users,
        href: `${COMUNIDAD}/miembros/`,
        externo: true,
        testid: "link-directorio-miembros",
      },
      {
        etiqueta: "Eventos y Grupos",
        descripcion: "Agenda y grupos de trabajo",
        icono: CalendarDays,
        href: `${COMUNIDAD}/grupos/`,
        externo: true,
        testid: "link-eventos",
      },
      {
        etiqueta: "Directorio de la Industria",
        descripcion: "Proveedores y aliados del sector",
        icono: Building2,
        testid: "link-directorio-industria",
      },
    ],
  },
  {
    etiqueta: "Bolsa de Trabajo",
    testid: "menu-bolsa",
    icono: Briefcase,
  },
];

/**
 * ¿Esta ruta interna es la que se está viendo?
 *
 * `/blog` sigue activa dentro de `/blog/:slug`: el usuario está leyendo un
 * artículo y el menú debe seguir señalando de dónde viene. La comparación es
 * por segmento completo, para que `/blog` no se active en un futuro
 * `/blogosfera`.
 *
 * Los destinos externos y los que aún no existen nunca están activos.
 */
export function esRutaActiva(href: string | undefined, ruta: string): boolean {
  if (!href || href.startsWith("http")) return false;
  if (href === "/") return ruta === "/";
  return ruta === href || ruta.startsWith(`${href}/`);
}

/** Un desplegable se marca activo cuando lo está cualquiera de sus destinos. */
export function esEntradaActiva(entrada: EntradaNav, ruta: string): boolean {
  if (entrada.destinos) {
    return entrada.destinos.some((destino) => esRutaActiva(destino.href, ruta));
  }
  return esRutaActiva(entrada.href, ruta);
}
