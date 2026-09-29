import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ErrorProveedor,
  SuscripcionNoConfigurada,
  hashSuscriptor,
  suscribir,
} from "./mailchimp";

const fetchMock = vi.fn();
const datos = {
  correo: "ana@ejemplo.org",
  nombre: "Ana López",
  pais: "México",
  organizacion: "Colegio de Arquitectos",
  cargo: "Directora",
  origen: "unete" as const,
};

function respuesta(status = 200) {
  return { ok: status < 400, status, json: async () => ({}) } as Response;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("MAILCHIMP_API_KEY", "abc123-us21");
  vi.stubEnv("MAILCHIMP_AUDIENCE_ID", "lista01");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("hashSuscriptor", () => {
  it("es el MD5 del correo en minúsculas, como pide Mailchimp", () => {
    expect(hashSuscriptor("Ana@Ejemplo.org")).toBe(hashSuscriptor("ana@ejemplo.org"));
    expect(hashSuscriptor("ana@ejemplo.org")).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("suscribir", () => {
  it("hace upsert del miembro con doble confirmación y lo etiqueta por origen", async () => {
    fetchMock.mockResolvedValue(respuesta());
    await suscribir(datos);

    const hash = hashSuscriptor(datos.correo);
    const [urlMiembro, miembro] = fetchMock.mock.calls[0];
    expect(urlMiembro).toBe(
      `https://us21.api.mailchimp.com/3.0/lists/lista01/members/${hash}`,
    );
    expect(miembro.method).toBe("PUT");
    const cuerpo = JSON.parse(miembro.body);
    expect(cuerpo).toEqual({
      email_address: "ana@ejemplo.org",
      status_if_new: "pending",
      merge_fields: {
        FNAME: "Ana López",
        PAIS: "México",
        ORG: "Colegio de Arquitectos",
        CARGO: "Directora",
      },
    });
    // Nunca `status`: reactivaría a quien se dio de baja.
    expect(cuerpo).not.toHaveProperty("status");
    expect(miembro.headers.Authorization).toMatch(/^Basic /);

    const [urlEtiquetas, etiquetas] = fetchMock.mock.calls[1];
    expect(urlEtiquetas).toBe(
      `https://us21.api.mailchimp.com/3.0/lists/lista01/members/${hash}/tags`,
    );
    expect(JSON.parse(etiquetas.body)).toEqual({
      tags: [{ name: "origen:unete", status: "active" }],
    });
  });

  it("no manda campos vacíos", async () => {
    fetchMock.mockResolvedValue(respuesta());
    await suscribir({ correo: "ana@ejemplo.org", origen: "footer" });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).merge_fields).toEqual({});
  });

  it("sin claves configuradas lanza SuscripcionNoConfigurada y no llama a nadie", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "");
    await expect(suscribir(datos)).rejects.toBeInstanceOf(SuscripcionNoConfigurada);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("una clave sin centro de datos cuenta como no configurada", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "abc123");
    await expect(suscribir(datos)).rejects.toBeInstanceOf(SuscripcionNoConfigurada);
  });

  it("propaga el fallo del proveedor con su código", async () => {
    fetchMock.mockResolvedValueOnce(respuesta(400));
    const error = await suscribir(datos).catch((e) => e);
    expect(error).toBeInstanceOf(ErrorProveedor);
    expect(error.estado).toBe(400);
    expect(error.message).not.toContain("ana@ejemplo.org");
  });

  it("también falla si no se puede etiquetar", async () => {
    fetchMock.mockResolvedValueOnce(respuesta()).mockResolvedValueOnce(respuesta(500));
    await expect(suscribir(datos)).rejects.toBeInstanceOf(ErrorProveedor);
  });
});
