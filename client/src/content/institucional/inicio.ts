/**
 * Textos propios de la home (§6.1). Hero, pilares, aliados y cierre reutilizan
 * los de `nosotros.ts` y `pilares.ts`; aquí solo va lo que no existe en otro
 * sitio.
 */
import { ETAPAS } from "./mapa-ruta";
import { PILARES } from "./pilares";

export interface Cifra {
  valor: string;
  etiqueta: string;
}

const PASOS = ETAPAS.reduce((total, etapa) => total + etapa.pasos.length, 0);

/**
 * Solo cifras que el sitio respalda: los 15+ países salen de Nosotros (Quiénes
 * somos); pilares, etapas y pasos se cuentan; los 1,000 líderes son la meta
 * 2030 de la Ruta y se rotulan como meta.
 * PENDIENTE (CG): la §6.1 pedía «22 organizaciones analizadas», pero ningún
 * documento del repo da esa cifra. Entra cuando la CG diga de dónde sale.
 */
export const CIFRAS: Cifra[] = [
  { valor: "15+", etiqueta: "países con líderes, invitados y aliados de la red" },
  {
    valor: String(PILARES.length),
    etiqueta: "pilares: Comunidad, Conocimiento, Tecnología y Datos",
  },
  {
    valor: String(ETAPAS.length),
    etiqueta: `etapas y ${PASOS} pasos en el Mapa de Ruta`,
  },
  { valor: "1,000", etiqueta: "líderes formados: nuestra meta al 2030" },
];

/**
 * Eventos «Próximamente». Lo comparten /eventos y la home.
 * PENDIENTE (D10): pre-anuncio del Encuentro Latinoamericano CDMX 2027.
 */
export const TEXTO_EVENTOS =
  "Estamos preparando el calendario de eventos y los webinars mensuales de ASPAL.";
