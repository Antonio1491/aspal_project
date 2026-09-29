/**
 * Función serverless de Vercel. Solo hace el wiring de Express: la lógica de
 * WordPress y los endpoints viven en `shared/wordpress/`, compartidos con el
 * servidor de desarrollo.
 */
import express, { type NextFunction, type Request, type Response } from "express";
import { registerApiRoutes } from "../shared/wordpress/routes";
import { registrarRutasSuscripcion } from "../shared/suscripcion/rutas";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

registerApiRoutes(app);
registrarRutasSuscripcion(app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
