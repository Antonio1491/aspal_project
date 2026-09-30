import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contraste as contrasteHsl, PARES } from "./contraste";

/**
 * Los contrastes de la paleta (plan de la Etapa 1, §4), comprobados contra los
 * valores reales de index.css. Si alguien ajusta un token y rompe AA, falla
 * aquí y no en una auditoría con axe al final.
 */
const css = readFileSync(resolve(import.meta.dirname, "..", "index.css"), "utf8");
const raiz = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

function token(nombre: string): [number, number, number] {
  const m = raiz.match(
    new RegExp(`--${nombre}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%;`),
  );
  if (!m) throw new Error(`Falta el token --${nombre} en :root`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

const contraste = (t: string, f: string) => contrasteHsl(token(t), token(f));

describe("contraste de la paleta", () => {
  it.each(PARES)("%s sobre %s cumple AA (4.5:1)", (texto, fondo) => {
    expect(contraste(texto, fondo)).toBeGreaterThanOrEqual(4.5);
  });

  it("el miel no sirve como texto sobre blanco", () => {
    // Por eso existe --miel-texto. Si este test falla, alguien oscureció el
    // miel de marca: el botón Únete cambiaría de color.
    expect(contraste("secondary", "background")).toBeLessThan(3);
  });
});
