/**
 * Alta en la audiencia de Mailchimp (decisión D8 del plan de la Etapa 1).
 *
 * MÓDULO SOLO-SERVIDOR: lee `process.env`. El cliente React no debe
 * importarlo; usa `/api/suscripcion`.
 *
 * No guarda nada: el dato vive solo en Mailchimp. Hace un upsert con
 * `status_if_new: "pending"`: a quien es nuevo, Mailchimp le envía la doble
 * confirmación; a quien ya estaba (suscrito o dado de baja) no le cambia el
 * estado. Por eso la respuesta es la misma en todos los casos y el endpoint
 * no revela quién está en la lista.
 *
 * La audiencia necesita tres campos de texto además de FNAME: PAIS, ORG y
 * CARGO (ver docs/architecture.md).
 */
import { createHash } from "node:crypto";
import type { SuscripcionValida } from "./tipos";

export class SuscripcionNoConfigurada extends Error {
  constructor(motivo = "Faltan MAILCHIMP_API_KEY o MAILCHIMP_AUDIENCE_ID") {
    super(motivo);
    this.name = "SuscripcionNoConfigurada";
  }
}

export class ErrorProveedor extends Error {
  constructor(
    public estado: number,
    operacion: string,
  ) {
    // Sin datos personales en el mensaje: acaba en los logs.
    super(`Mailchimp respondió ${estado} al ${operacion}`);
    this.name = "ErrorProveedor";
  }
}

function configuracion() {
  const clave = process.env.MAILCHIMP_API_KEY;
  const audiencia = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!clave || !audiencia) throw new SuscripcionNoConfigurada();
  // La clave termina en el centro de datos de la cuenta: "…-us21".
  const centro = clave.split("-")[1];
  if (!centro)
    throw new SuscripcionNoConfigurada(
      "La clave de Mailchimp no indica su centro de datos",
    );
  return {
    base: `https://${centro}.api.mailchimp.com/3.0/lists/${audiencia}`,
    cabeceras: {
      Authorization: `Basic ${Buffer.from(`aspal:${clave}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  };
}

/** Mailchimp identifica al miembro por el MD5 de su correo en minúsculas. */
export function hashSuscriptor(correo: string): string {
  return createHash("md5").update(correo.toLowerCase()).digest("hex");
}

function camposFusion(datos: SuscripcionValida): Record<string, string> {
  const campos: Record<string, string> = {};
  if (datos.nombre) campos.FNAME = datos.nombre;
  if (datos.pais) campos.PAIS = datos.pais;
  if (datos.organizacion) campos.ORG = datos.organizacion;
  if (datos.cargo) campos.CARGO = datos.cargo;
  return campos;
}

export async function suscribir(datos: SuscripcionValida): Promise<void> {
  const { base, cabeceras } = configuracion();
  const miembro = `${base}/members/${hashSuscriptor(datos.correo)}`;

  const alta = await fetch(miembro, {
    method: "PUT",
    headers: cabeceras,
    body: JSON.stringify({
      email_address: datos.correo,
      status_if_new: "pending",
      merge_fields: camposFusion(datos),
    }),
  });
  if (!alta.ok) throw new ErrorProveedor(alta.status, "registrar el miembro");

  const etiqueta = await fetch(`${miembro}/tags`, {
    method: "POST",
    headers: cabeceras,
    body: JSON.stringify({
      tags: [{ name: `origen:${datos.origen}`, status: "active" }],
    }),
  });
  if (!etiqueta.ok) throw new ErrorProveedor(etiqueta.status, "etiquetar el miembro");
}
