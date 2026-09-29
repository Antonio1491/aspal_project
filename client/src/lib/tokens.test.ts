import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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

function hslARgb([h, s, l]: [number, number, number]): number[] {
  const sat = s / 100;
  const lum = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lum, 1 - lum);
  const f = (n: number) =>
    lum - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function luminancia(rgb: number[]): number {
  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(texto: string, fondo: string): number {
  const a = luminancia(hslARgb(token(texto)));
  const b = luminancia(hslARgb(token(fondo)));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// [texto, fondo]: todo par que el diseño usa para texto normal. AA exige 4.5.
const PARES: [string, string][] = [
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["brand-noche-foreground", "brand-noche"],
  ["secondary", "brand-noche"],
  ["miel-texto", "background"],
  ["primary", "fondo-suave"],
  ["muted-foreground", "fondo-suave"],
  ["muted-foreground", "background"],
  ["primary", "accent"],
];

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
