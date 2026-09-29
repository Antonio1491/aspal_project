/**
 * `POST /api/suscripcion`: la primera escritura del sitio (decisión D8).
 *
 * Lo montan `server/index.ts` y `api/index.ts`, igual que las rutas de
 * WordPress. No guarda nada y no escribe datos personales en los logs.
 */
import type { Express, Request, Response } from "express";
import { SuscripcionNoConfigurada, suscribir } from "./mailchimp";
import { esTrampa, validarSuscripcion } from "./validacion";

export function registrarRutasSuscripcion(app: Express): void {
  app.post("/api/suscripcion", async (req: Request, res: Response) => {
    const entrada: unknown = req.body;

    // Al bot se le responde como a una persona: si notara la diferencia,
    // aprendería a no rellenar el campo trampa.
    if (esTrampa(entrada)) {
      res.json({ ok: true });
      return;
    }

    const resultado = validarSuscripcion(entrada);
    if (!resultado.ok) {
      res.status(400).json({ ok: false, errores: resultado.errores });
      return;
    }

    try {
      await suscribir(resultado.datos);
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof SuscripcionNoConfigurada) {
        console.error(`Suscripción no configurada: ${error.message}`);
        res.status(503).json({ ok: false, error: "no_configurada" });
        return;
      }
      console.error(
        "Suscripción: fallo del proveedor:",
        error instanceof Error ? error.message : "desconocido",
      );
      res.status(502).json({ ok: false, error: "proveedor" });
    }
  });
}
