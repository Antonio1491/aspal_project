import type { ErroresSuscripcion } from "@shared/suscripcion/tipos";

export type RespuestaEnvio =
  | { estado: "exito" }
  | { estado: "invalido"; errores: ErroresSuscripcion }
  | { estado: "error" };

/**
 * Envía la suscripción a `/api/suscripcion`. Nunca lanza: traduce cada
 * respuesta a un estado que el formulario sabe pintar. 503 (sin configurar) y
 * 502 (proveedor caído) son error, jamás éxito.
 */
export async function enviarSuscripcion(
  datos: Record<string, unknown>,
): Promise<RespuestaEnvio> {
  try {
    const respuesta = await fetch("/api/suscripcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (respuesta.ok) return { estado: "exito" };
    if (respuesta.status === 400) {
      const cuerpo = (await respuesta.json().catch(() => ({}))) as {
        errores?: ErroresSuscripcion;
      };
      return { estado: "invalido", errores: cuerpo.errores ?? {} };
    }
    return { estado: "error" };
  } catch {
    return { estado: "error" };
  }
}
