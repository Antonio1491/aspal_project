import { describe, expect, it } from "vitest";
import { INTRO_EQUIPO, PERFILES } from "./equipo";
import * as nosotros from "./nosotros";
import { PILARES } from "./pilares";

/** Todas las cadenas de un valor, recorriendo objetos y arrays (no funciones ni iconos). */
function cadenas(valor: unknown): string[] {
  if (typeof valor === "string") return [valor];
  if (Array.isArray(valor)) return valor.flatMap(cadenas);
  if (
    valor &&
    typeof valor === "object" &&
    !("$$typeof" in valor) &&
    !("render" in valor)
  ) {
    return Object.values(valor).flatMap(cadenas);
  }
  return [];
}

const todo = [
  ...cadenas(PILARES),
  ...cadenas(nosotros),
  ...cadenas(PERFILES),
  INTRO_EQUIPO,
];

describe("contenido institucional", () => {
  it("no tiene textos vacíos ni marcadores de relleno", () => {
    expect(todo.filter((t) => !t.trim())).toEqual([]);
    expect(todo.filter((t) => /\bTBD\b|lorem|^\[|\]$/i.test(t))).toEqual([]);
  });

  it("tiene los cuatro pilares con ids de ancla únicos", () => {
    const ids = PILARES.map((p) => p.id);
    expect(ids).toEqual(["comunidad", "conocimiento", "tecnologia", "datos"]);
    for (const id of ids) expect(id).toMatch(/^[a-z]+$/);
  });

  it.todo(
    "enlaza solo rutas internas que existen, y externos por https (se activa en el Task 4)",
  );
  // const enlaces = [
  //   ...PILARES.flatMap((p) => p.enlaces),
  //   ...nosotros.HACEN_POSIBLE.map((t) => t.enlace),
  // ];
  // for (const e of enlaces) {
  //   if (!e.href) continue;
  //   if (e.externo) expect(e.href, e.etiqueta).toMatch(/^https:\/\//);
  //   else if (!e.href.startsWith("#")) expect(esRutaConocida(e.href), e.href).toBe(true);
  // }

  it("respeta la estructura del Concepto NOSOTROS", () => {
    expect(nosotros.QUIENES_SOMOS).toHaveLength(3);
    expect(nosotros.DEFENDEMOS.map((d) => d.titulo)).toEqual([
      "Nuestra causa",
      "Nuestra propuesta de valor",
      "Nuestra promesa",
      "Nuestro compromiso",
    ]);
    expect(nosotros.APORTES).toHaveLength(7);
    expect(nosotros.RUTA.map((h) => h.anio)).toEqual([
      "2026",
      "Q1 2027",
      "Dic 2027",
      "Q4 2028",
      "2029",
      "2030",
    ]);
    expect(nosotros.HACEN_POSIBLE).toHaveLength(3);
    expect(PERFILES.map((p) => p.nombre)).toEqual([
      "Luis Romahn",
      "Patricia Hernández de Anda",
      "Antonio Góngora",
    ]);
  });

  it("usa el año de fundación en un solo lugar", () => {
    expect(nosotros.QUIENES_SOMOS[0]).toContain(`Nacimos en ${nosotros.ANIO_FUNDACION}`);
  });

  it("escribe el hashtag tal como lo trae el documento", () => {
    expect(nosotros.HASHTAG).toBe("#NingunDirectorDirigeSolo");
  });
});
