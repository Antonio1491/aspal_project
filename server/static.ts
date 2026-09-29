import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { RUTAS_DINAMICAS } from "../client/src/lib/rutas";

/**
 * Sirve el build en producción con las mismas reglas que `vercel.json`:
 *
 * - `/` y cada ruta estática → su HTML prerenderizado (`blog.html` responde a `/blog`)
 * - rutas dinámicas (`/blog/:slug`) → `spa.html`, el shell que carga el cliente
 * - todo lo demás → `404.html` con **código 404**
 *
 * Antes cualquier dirección caía en `index.html` con 200: para un buscador, el
 * sitio tenía infinitas páginas iguales a la home.
 */
export function serveStatic(
  app: Express,
  distPath = path.resolve(import.meta.dirname, "public"),
) {
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Como `trailingSlash: false` en Vercel: `/blog/` redirige a `/blog`.
  app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith("/")) {
      const consulta = req.url.slice(req.path.length);
      res.redirect(308, req.path.replace(/\/+$/, "") + consulta);
      return;
    }
    next();
  });

  // Sin redirect: si no, /assets -> 301 /assets/ y la barra final -> 308 /assets, en bucle.
  app.use(express.static(distPath, { extensions: ["html"], redirect: false }));

  for (const ruta of RUTAS_DINAMICAS) {
    app.get(ruta, (_req, res) => {
      res.sendFile(path.resolve(distPath, "spa.html"));
    });
  }

  app.use("*", (_req, res) => {
    res.status(404).sendFile(path.resolve(distPath, "404.html"));
  });
}
