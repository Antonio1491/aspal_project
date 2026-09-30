import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { REGISTRO } from "./registro";
import type { Categoria } from "./tipos";

const RAIZ = resolve(import.meta.dirname, "..", "..", "..");
const SRC = join(RAIZ, "client", "src");
const posix = (ruta: string) => ruta.split(sep).join("/");

function recorrer(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const ruta = join(dir, entrada);
    return statSync(ruta).isDirectory() ? recorrer(ruta) : [ruta];
  });
}

const enDisco = recorrer(join(SRC, "components"))
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
  .map((f) => posix(relative(RAIZ, f)))
  .sort();

// El propio catálogo no cuenta como uso: si no, mantendría vivo lo que nadie
// más importa.
const fuentes = recorrer(SRC)
  .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => ({ ruta: posix(relative(RAIZ, f)), texto: readFileSync(f, "utf8") }))
  .filter(
    (f) =>
      !f.ruta.startsWith("client/src/catalogo/") &&
      f.ruta !== "client/src/pages/componentes.tsx",
  );

/** Quién importa el archivo: por alias `@/components/<carpeta>/<Nombre>` o relativo. */
function importadores(archivo: string): string[] {
  const nombre = basename(archivo, ".tsx");
  const carpeta = basename(dirname(archivo));
  const patron = new RegExp(
    `["'](?:@/components/${carpeta}/${nombre}|\\.\\.?/(?:${carpeta}/)?${nombre})["']`,
  );
  return fuentes
    .filter((f) => f.ruta !== archivo && patron.test(f.texto))
    .map((f) => f.ruta);
}

const CATEGORIAS_POR_CARPETA: Record<string, Categoria[]> = {
  layout: ["layout", "infraestructura"],
  institucional: ["institucional"],
  content: ["contenido"],
  forms: ["formularios"],
  ui: ["ui"],
  sections: ["legado"],
};

describe("registro del catálogo", () => {
  it("tiene una entrada por cada componente de client/src/components, y nada más", () => {
    expect(REGISTRO.map((e) => e.archivo).sort()).toEqual(enDisco);
  });

  it("usa ids únicos en kebab-case", () => {
    const ids = REGISTRO.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it("clasifica cada componente según su carpeta", () => {
    for (const e of REGISTRO) {
      const carpeta = basename(dirname(e.archivo));
      expect(CATEGORIAS_POR_CARPETA[carpeta], e.archivo).toContain(e.categoria);
    }
  });

  it("marca en uso lo que alguien importa y sin uso lo que no", () => {
    for (const e of REGISTRO) {
      const usado = importadores(e.archivo).length > 0;
      expect(
        e.estado,
        `${e.nombre}: ${usado ? "tiene importadores" : "nadie lo importa"}`,
      ).toBe(usado ? "en-uso" : "sin-uso");
    }
  });

  it("da una línea de import que apunta a su archivo", () => {
    for (const e of REGISTRO) {
      const modulo = `@/components/${basename(dirname(e.archivo))}/${basename(e.archivo, ".tsx")}`;
      expect(e.importar, e.nombre).toContain(`"${modulo}"`);
    }
  });

  it("no deja textos vacíos", () => {
    for (const e of REGISTRO) {
      for (const texto of [e.nombre, e.descripcion, e.usarCuando, e.props]) {
        expect(texto.trim(), e.id).not.toBe("");
      }
    }
  });
});
