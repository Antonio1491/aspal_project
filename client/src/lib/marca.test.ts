import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTACTO, NOMBRE_COMPLETO, NOMBRE_MARCA, REDES } from "./marca";

const indexHtml = readFileSync(
  resolve(import.meta.dirname, "..", "..", "index.html"),
  "utf8",
);

describe("marca", () => {
  it("el título de index.html usa el nombre de marca", () => {
    // Llegó a haber tres nombres distintos en el título, el pie y los
    // documentos. index.html no puede importar TypeScript: este test es lo que
    // impide que vuelva a divergir.
    const titulo = indexHtml.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
    expect(titulo).toContain(NOMBRE_COMPLETO);
  });

  it("compone el nombre visible a partir de sus partes", () => {
    expect(NOMBRE_MARCA).toBe(`ASPAL — ${NOMBRE_COMPLETO}`);
  });

  it("enlaza todas las redes por https y sin repetir data-testid", () => {
    for (const red of REDES) expect(red.href, red.nombre).toMatch(/^https:\/\//);
    const ids = REDES.map((r) => r.testid);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tiene un correo y un teléfono accionables", () => {
    expect(CONTACTO.correo).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
    expect(CONTACTO.telefono.replace(/\s/g, "")).toMatch(/^\+\d{10,13}$/);
  });
});
