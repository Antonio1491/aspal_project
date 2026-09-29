import { describe, expect, it } from "vitest";
import { PAISES } from "./tipos";
import { esTrampa, validarSuscripcion } from "./validacion";

const completa = {
  correo: "ana@ejemplo.org",
  nombre: "Ana López",
  pais: "México",
  organizacion: "Colegio de Arquitectos",
  cargo: "Directora",
  consentimiento: true,
  origen: "unete",
};

describe("validarSuscripcion", () => {
  it("acepta una suscripción completa desde /unete", () => {
    expect(validarSuscripcion(completa)).toEqual({
      ok: true,
      datos: {
        correo: "ana@ejemplo.org",
        nombre: "Ana López",
        pais: "México",
        organizacion: "Colegio de Arquitectos",
        cargo: "Directora",
        origen: "unete",
      },
    });
  });

  it("normaliza el correo: sin espacios y en minúsculas", () => {
    const r = validarSuscripcion({ ...completa, correo: "  Ana@Ejemplo.ORG " });
    expect(r.ok && r.datos.correo).toBe("ana@ejemplo.org");
  });

  it("en el pie basta el correo y el consentimiento", () => {
    const r = validarSuscripcion({
      correo: "ana@ejemplo.org",
      consentimiento: true,
      origen: "footer",
    });
    expect(r).toEqual({
      ok: true,
      datos: { correo: "ana@ejemplo.org", origen: "footer" },
    });
  });

  it("en /unete exige nombre y país", () => {
    const r = validarSuscripcion({ ...completa, nombre: " ", pais: "" });
    expect(r.ok).toBe(false);
    expect(!r.ok && Object.keys(r.errores).sort()).toEqual(["nombre", "pais"]);
  });

  it("rechaza un correo mal formado o vacío", () => {
    for (const correo of ["", "ana", "ana@", "ana@ejemplo", "ana @ejemplo.org"]) {
      const r = validarSuscripcion({ ...completa, correo });
      expect(!r.ok && r.errores.correo, correo).toBeTruthy();
    }
  });

  it("exige el consentimiento explícito (true, no un texto)", () => {
    for (const consentimiento of [false, "true", undefined]) {
      const r = validarSuscripcion({ ...completa, consentimiento });
      expect(!r.ok && r.errores.consentimiento).toBeTruthy();
    }
  });

  it("solo admite países de la lista y orígenes conocidos", () => {
    const pais = validarSuscripcion({ ...completa, pais: "Narnia" });
    expect(!pais.ok && pais.errores.pais).toBeTruthy();
    const origen = validarSuscripcion({ ...completa, origen: "spam" });
    expect(!origen.ok && origen.errores.origen).toBeTruthy();
    expect(PAISES).toContain("España");
    expect(PAISES).toContain("Otro");
  });

  it("recorta los textos largos en lugar de rechazarlos", () => {
    const r = validarSuscripcion({ ...completa, cargo: "x".repeat(500) });
    expect(r.ok && r.datos.cargo?.length).toBe(100);
  });

  it("no revienta con una entrada que no es un objeto", () => {
    for (const entrada of [null, undefined, "hola", 42, []]) {
      expect(validarSuscripcion(entrada).ok).toBe(false);
    }
  });

  it("rechaza un correo más largo que 254 caracteres", () => {
    const correoLargo = "a".repeat(300) + "@ejemplo.org";
    const r = validarSuscripcion({ ...completa, correo: correoLargo });
    expect(!r.ok && r.errores.correo).toBeTruthy();
  });

  it("rechaza caracteres de control en el correo", () => {
    const correoConControl = "a@b.co\u0000x";
    const r = validarSuscripcion({ ...completa, correo: correoConControl });
    expect(!r.ok && r.errores.correo).toBeTruthy();
  });

  it("valida un correo con patrón de ReDoS en menos de 50 ms", () => {
    const correoReDoS = "a@" + ".".repeat(50000) + "@";
    const inicio = performance.now();
    const r = validarSuscripcion({ ...completa, correo: correoReDoS });
    const duracion = performance.now() - inicio;
    expect(!r.ok && r.errores.correo).toBeTruthy();
    expect(duracion).toBeLessThan(50);
  });
});

describe("esTrampa", () => {
  it("detecta el campo oculto relleno", () => {
    expect(esTrampa({ ...completa, sitioWeb: "https://spam.example" })).toBe(true);
  });

  it("deja pasar a las personas", () => {
    expect(esTrampa(completa)).toBe(false);
    expect(esTrampa({ ...completa, sitioWeb: "" })).toBe(false);
    expect(esTrampa(null)).toBe(false);
  });
});
