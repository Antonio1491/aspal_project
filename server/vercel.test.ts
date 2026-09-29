import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { RUTAS_DINAMICAS } from "../client/src/lib/rutas";

interface Reescritura {
  source: string;
  destination: string;
}

const config = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "..", "vercel.json"), "utf8"),
) as { cleanUrls?: boolean; trailingSlash?: boolean; rewrites: Reescritura[] };

describe("vercel.json", () => {
  it("no tiene un rewrite comodín que convierta todo en 200", () => {
    // Era `{ "source": "/(.*)", "destination": "/" }`: cualquier dirección
    // inexistente respondía 200 con la home (RF-11).
    const comodines = config.rewrites.filter(
      (r) => r.destination === "/" || r.destination === "/index.html",
    );
    expect(comodines).toEqual([]);
  });

  it("sirve las rutas estáticas sin extensión", () => {
    expect(config.cleanUrls).toBe(true);
  });

  it("redirige la barra final, igual que Express", () => {
    expect(config.trailingSlash).toBe(false);
  });

  it("manda cada ruta dinámica al shell", () => {
    for (const ruta of RUTAS_DINAMICAS) {
      expect(config.rewrites).toContainEqual({ source: ruta, destination: "/spa.html" });
    }
  });

  it("mantiene la API en la función serverless", () => {
    expect(config.rewrites).toContainEqual({ source: "/api/(.*)", destination: "/api" });
  });
});
