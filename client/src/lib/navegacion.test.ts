import { describe, expect, it } from "vitest";
import {
  COMUNIDAD,
  NAVEGACION,
  URL_LOGIN,
  URL_REGISTRO,
  esEntradaActiva,
  esRutaActiva,
  type DestinoNav,
} from "./navegacion";

const destinos: DestinoNav[] = NAVEGACION.flatMap((e) => e.destinos ?? []);

describe("esRutaActiva", () => {
  it("marca la ruta exacta", () => {
    expect(esRutaActiva("/blog", "/blog")).toBe(true);
  });

  it("mantiene /blog activa mientras se lee un artículo", () => {
    expect(esRutaActiva("/blog", "/blog/el-poder-del-podcasting")).toBe(true);
  });

  it("compara por segmento, no por prefijo de texto", () => {
    // El fallo clásico de startsWith: /blog no debe activarse en /blogosfera.
    expect(esRutaActiva("/blog", "/blogosfera")).toBe(false);
  });

  it("no marca una ruta distinta", () => {
    expect(esRutaActiva("/blog", "/podcast")).toBe(false);
  });

  it("solo activa la raíz en la raíz exacta", () => {
    expect(esRutaActiva("/", "/")).toBe(true);
    expect(esRutaActiva("/", "/blog")).toBe(false);
  });

  it("nunca marca un destino externo", () => {
    expect(esRutaActiva(`${COMUNIDAD}/comunidad/`, "/")).toBe(false);
  });

  it("nunca marca un destino que todavía no existe", () => {
    expect(esRutaActiva(undefined, "/blog")).toBe(false);
  });
});

describe("esEntradaActiva", () => {
  const aprende = NAVEGACION.find((e) => e.etiqueta === "Aprende")!;
  const comunidad = NAVEGACION.find((e) => e.etiqueta === "Comunidad")!;

  it("marca el desplegable cuando lo está uno de sus destinos", () => {
    expect(esEntradaActiva(aprende, "/blog/un-articulo")).toBe(true);
    expect(esEntradaActiva(aprende, "/podcast")).toBe(true);
  });

  it("no marca el desplegable fuera de sus destinos", () => {
    expect(esEntradaActiva(aprende, "/")).toBe(false);
  });

  it("no marca un desplegable que solo tiene destinos externos o pendientes", () => {
    // Comunidad apunta entera fuera del sitio: nunca puede ser la ruta actual.
    expect(esEntradaActiva(comunidad, "/blog")).toBe(false);
    expect(esEntradaActiva(comunidad, "/")).toBe(false);
  });
});

describe("catálogo de navegación", () => {
  it("no repite ningún data-testid", () => {
    const ids = [...NAVEGACION.map((e) => e.testid), ...destinos.map((d) => d.testid)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("da descripción a todos los destinos", () => {
    const sinDescripcion = destinos.filter((d) => !d.descripcion.trim());
    expect(sinDescripcion).toEqual([]);
  });

  it("da icono a toda entrada y todo destino", () => {
    // Los iconos de lucide son `forwardRef`: objetos, no funciones. Basta con
    // comprobar que hay algo renderizable.
    const sinIcono = [...NAVEGACION, ...destinos].filter((e) => !e.icono);
    expect(sinIcono.map((e) => e.etiqueta)).toEqual([]);
  });

  it("no repite icono dentro de un mismo desplegable", () => {
    // Dos destinos con el mismo icono en la misma lista no distinguen nada:
    // el icono deja de aportar y solo añade ruido visual.
    for (const entrada of NAVEGACION) {
      const iconos = (entrada.destinos ?? []).map((d) => d.icono);
      expect(new Set(iconos).size, `iconos repetidos en "${entrada.etiqueta}"`).toBe(
        iconos.length,
      );
    }
  });

  it("marca como externo todo destino que salga del sitio, y solo esos", () => {
    for (const destino of destinos) {
      expect(Boolean(destino.externo)).toBe(Boolean(destino.href?.startsWith("http")));
    }
  });

  it("apunta el registro y el login al subdominio de comunidad", () => {
    // La URL del Hero apuntaba al dominio sin `comunidad.` y servía un
    // documento vacío. Este test es el que impide que vuelva a pasar.
    expect(URL_REGISTRO).toBe(`${COMUNIDAD}/register/membresia-basica/`);
    expect(URL_LOGIN).toBe(`${COMUNIDAD}/login/`);
    expect(COMUNIDAD).toContain("comunidad.");
  });
});
