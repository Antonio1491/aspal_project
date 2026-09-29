---
title: PR E1 de la Etapa 1 — Suscripción (API propia hacia Mailchimp), /unete y /eventos
type: feat
status: active
date: 2026-09-29
spec: docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md
parent: docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md
---

# PR E1 — Suscripción, /unete y /eventos: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cualquier persona pueda suscribirse gratis al boletín de ASPAL desde `/unete`, `/eventos` y el pie. Los datos van a Mailchimp con doble confirmación, a través de un endpoint propio que no guarda nada. El botón Únete de todo el sitio pasa a llevar a `/unete`.

**Architecture:** La lógica de suscripción vive en `shared/suscripcion/`, con el mismo patrón que `shared/wordpress/`:

- `tipos.ts` y `validacion.ts` son puros; los usan el cliente y el servidor, así que hay una sola validación.
- `mailchimp.ts` es solo del servidor: lee `process.env` y hace el `fetch` al proveedor.
- `rutas.ts` registra `POST /api/suscripcion`. Lo montan `server/index.ts` y `api/index.ts`.

El endpoint no persiste nada: valida, descarta en silencio a los bots (campo trampa) y hace un _upsert_ en la audiencia con `status_if_new: "pending"`. Así Mailchimp envía la doble confirmación y nunca reactiva a quien se dio de baja. En el cliente, `FormSuscripcion` tiene dos variantes: completa (`/unete`) y compacta (pie y `/eventos`).

**Tech Stack:** Express 4 (JSON), `node:crypto` (MD5 del correo, que Mailchimp usa como id del miembro), `fetch` nativo de Node 20, API de Marketing de Mailchimp v3 (`PUT /lists/{id}/members/{hash}` y `POST …/tags`), React 18, wouter, Vitest 3.

**Spec:** `docs/plans/2026-09-24-001-feat-etapa-1-institucional-plan.md`, §6.6, §6.7, §8 («Primera escritura del sitio»), RF-04, RF-05, RF-09, RF-12 y RF-14. Plan padre: `docs/plans/2026-09-29-001-feat-etapa-1-ejecucion-plan.md`. Copy: `ASPAL_Concepto_Nosotros_Web V1.docx` (Bloque 4 «Nuestra promesa» y Bloque 10 «Únete a la casa común»).

**Decisión D8, aprobada por Antonio el 29 sep 2026:** API propia hacia Mailchimp, sin guardar datos, con campo trampa y doble confirmación del proveedor. Sin límite por IP (plan padre, corrección 4).

## Global Constraints

- `CLAUDE.md` manda. UI, comentarios e identificadores en español.
- **Solo commits locales, nunca `git push`.** Rama de trabajo: `etapa1/e1-suscripcion`, desde `feat/etapa-1-institucional`. Vuelve a ella en el Task 6.
- Puertas antes de cada commit: `npm run check`, `npm run lint` (0 errores), `npm run format:check` y `npm test`. Al cerrar, además `npm run build` y el navegador a 375, 768, 1024 y 1440 px.
- Puerto de desarrollo 5001; producción local 5002.
- **El endpoint no guarda ni registra en logs datos personales.** Ni el correo ni el nombre salen en `console.*`; solo el código de estado del proveedor.
- **Nunca se revela si un correo ya estaba suscrito:** misma respuesta de éxito siempre.
- Las claves solo en variables de entorno: `MAILCHIMP_API_KEY` y `MAILCHIMP_AUDIENCE_ID`. Sin ellas, el endpoint responde **503**, no un éxito falso.
- Los fallos del proveedor se propagan como 5xx (502), igual que la política de WordPress en `CLAUDE.md`.
- No se inventa copy institucional. Lo que haya del Concepto NOSOTROS se usa literal; lo demás es microcopy de formulario o queda como `// PENDIENTE:`.
- El enlace al aviso de privacidad no existe todavía (Etapa 0): el consentimiento se redacta sin enlace y queda un `PENDIENTE`.
- `data-testid` en todo lo interactivo; objetivos ≥ 44 px; etiquetas visibles en todos los campos.

## Review Focus

1. **Un bot rellena el campo trampa.** Debe recibir el mismo 200 que una persona y no llegar a Mailchimp. Lo cubre el Task 3 (`rutas.test.ts`).
2. **Alguien se suscribe con un correo que ya estaba dado de alta o dado de baja.** La respuesta es idéntica, no se filtra el estado y no se reactiva a quien se dio de baja. Lo cubre el Task 2: `status_if_new`, nunca `status`, en `mailchimp.test.ts`.
3. **El despliegue no tiene las claves.** Debe responder 503 y el formulario debe mostrar el error con un camino alternativo (el correo de contacto), no un «¡Listo!» falso. Lo cubren el Task 2 y el Task 4 (`suscripcion.test.ts`, estado `error`).
4. **Correos con mayúsculas o espacios** (` Ana@Ejemplo.ORG`). Se normalizan antes de calcular el id MD5; si no, la misma persona tendría dos registros. Lo cubren el Task 1 y el Task 2.
5. **`api/index.ts` y `server/index.ts` divergen.** Si solo uno monta `/api/suscripcion`, el formulario funcionaría en local y fallaría en Vercel, justo el fallo histórico que dio origen a `shared/`. Lo cubre el Task 3, con un test que lee ambos archivos.

---

## Mapa de archivos

| Archivo                                                                      | Responsabilidad                                          | Task |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- | ---- |
| `shared/suscripcion/tipos.ts`                                                | `ORIGENES`, `PAISES`, tipos de entrada, salida y errores | 1    |
| `shared/suscripcion/validacion.ts` (+ test)                                  | `validarSuscripcion`, `esTrampa` (puras)                 | 1    |
| `shared/suscripcion/mailchimp.ts` (+ test)                                   | `suscribir`, `hashSuscriptor`; **solo servidor**         | 2    |
| `shared/suscripcion/rutas.ts` (+ test)                                       | `registrarRutasSuscripcion(app)`                         | 3    |
| `server/index.ts`, `api/index.ts`                                            | Montar las rutas (una línea cada uno)                    | 3    |
| `.env.example`, `CLAUDE.md`                                                  | Variables y fronteras de import                          | 3    |
| `client/src/lib/suscripcion.ts` (+ test)                                     | `enviarSuscripcion` (fetch a la API)                     | 4    |
| `client/src/components/forms/FormSuscripcion.tsx`                            | Formulario completo y compacto                           | 4    |
| `client/src/components/layout/Banda.tsx`, `HeroInstitucional.tsx`            | Bandas y hero de las páginas institucionales             | 5    |
| `client/src/pages/unete.tsx`, `eventos.tsx`                                  | Páginas                                                  | 5    |
| `rutas.ts`, `seo.ts`, `App.tsx`, `navegacion.ts`, `Header.tsx`, `Footer.tsx` | Rutas, SEO, menú, Únete → `/unete` y boletín en el pie   | 5    |
| `docs/architecture.md`                                                       | Endpoint y configuración de Mailchimp                    | 6    |

---

### Task 1: Tipos y validación compartidos

**Files:**

- Create: `shared/suscripcion/tipos.ts`, `shared/suscripcion/validacion.ts`, `shared/suscripcion/validacion.test.ts`

**Interfaces:**

- Produces:
  - `ORIGENES = ["unete", "home", "footer", "eventos"] as const`, `type OrigenSuscripcion`
  - `PAISES: readonly string[]` (LATAM + España + Portugal + «Otro»)
  - `type CampoSuscripcion = "correo" | "nombre" | "pais" | "organizacion" | "cargo" | "consentimiento" | "origen"`
  - `type ErroresSuscripcion = Partial<Record<CampoSuscripcion, string>>`
  - `interface SuscripcionValida { correo: string; nombre?: string; pais?: string; organizacion?: string; cargo?: string; origen: OrigenSuscripcion }`
  - `type ResultadoValidacion = { ok: true; datos: SuscripcionValida } | { ok: false; errores: ErroresSuscripcion }`
  - `validarSuscripcion(entrada: unknown): ResultadoValidacion`
  - `esTrampa(entrada: unknown): boolean`: `true` si `sitioWeb` trae texto
  - `CAMPO_TRAMPA = "sitioWeb"`

- [ ] **Step 1: Test**

`shared/suscripcion/validacion.test.ts`:

```ts
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
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run shared/suscripcion/validacion.test.ts`
Expected: FAIL. No resuelve `./tipos` ni `./validacion`.

- [ ] **Step 3: `tipos.ts`**

```ts
/**
 * Tipos de la suscripción al boletín. Puros: los importan el cliente (para
 * validar antes de enviar) y el servidor (para validar lo que llega).
 */

/** Desde dónde se suscribe la persona. Se guarda como etiqueta en Mailchimp. */
export const ORIGENES = ["unete", "home", "footer", "eventos"] as const;
export type OrigenSuscripcion = (typeof ORIGENES)[number];

/** Países del selector (§6.6 del plan): LATAM, España, Portugal y «Otro». */
export const PAISES: readonly string[] = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Portugal",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro",
];

/** Campo oculto que solo rellenan los bots. */
export const CAMPO_TRAMPA = "sitioWeb";

export type CampoSuscripcion =
  "correo" | "nombre" | "pais" | "organizacion" | "cargo" | "consentimiento" | "origen";

export type ErroresSuscripcion = Partial<Record<CampoSuscripcion, string>>;

export interface SuscripcionValida {
  correo: string;
  nombre?: string;
  pais?: string;
  organizacion?: string;
  cargo?: string;
  origen: OrigenSuscripcion;
}

export type ResultadoValidacion =
  { ok: true; datos: SuscripcionValida } | { ok: false; errores: ErroresSuscripcion };
```

- [ ] **Step 4: `validacion.ts`**

```ts
/**
 * Validación única de la suscripción: la misma en el navegador (para avisar
 * antes de enviar) y en el servidor (que nunca confía en el navegador).
 */
import {
  CAMPO_TRAMPA,
  ORIGENES,
  PAISES,
  type ErroresSuscripcion,
  type OrigenSuscripcion,
  type ResultadoValidacion,
  type SuscripcionValida,
} from "./tipos";

/** Suficiente para descartar erratas evidentes; la verdad la da la doble confirmación. */
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LARGO_MAXIMO = { nombre: 100, organizacion: 150, cargo: 100 } as const;

function texto(valor: unknown, maximo: number): string | undefined {
  if (typeof valor !== "string") return undefined;
  const limpio = valor.trim().replace(/\s+/g, " ");
  return limpio ? limpio.slice(0, maximo) : undefined;
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export function esTrampa(entrada: unknown): boolean {
  return esObjeto(entrada) && Boolean(texto(entrada[CAMPO_TRAMPA], 500));
}

export function validarSuscripcion(entrada: unknown): ResultadoValidacion {
  const e = esObjeto(entrada) ? entrada : {};
  const errores: ErroresSuscripcion = {};

  const origen = (ORIGENES as readonly unknown[]).includes(e.origen)
    ? (e.origen as OrigenSuscripcion)
    : undefined;
  if (!origen) errores.origen = "Origen no válido.";

  const correo = typeof e.correo === "string" ? e.correo.trim().toLowerCase() : "";
  if (!correo) errores.correo = "Escribe tu correo.";
  else if (!CORREO.test(correo)) errores.correo = "Ese correo no parece válido.";

  const nombre = texto(e.nombre, LARGO_MAXIMO.nombre);
  const pais = texto(e.pais, 60);
  if (pais && !PAISES.includes(pais)) errores.pais = "Elige un país de la lista.";

  // /unete es el alta completa: ahí nombre y país son obligatorios.
  if (origen === "unete") {
    if (!nombre) errores.nombre = "Escribe tu nombre.";
    if (!pais) errores.pais = errores.pais ?? "Elige tu país.";
  }

  if (e.consentimiento !== true) {
    errores.consentimiento = "Necesitamos tu autorización para escribirte.";
  }

  if (Object.keys(errores).length > 0 || !origen) return { ok: false, errores };

  const datos: SuscripcionValida = { correo, origen };
  if (nombre) datos.nombre = nombre;
  if (pais) datos.pais = pais;
  const organizacion = texto(e.organizacion, LARGO_MAXIMO.organizacion);
  if (organizacion) datos.organizacion = organizacion;
  const cargo = texto(e.cargo, LARGO_MAXIMO.cargo);
  if (cargo) datos.cargo = cargo;
  return { ok: true, datos };
}
```

- [ ] **Step 5: Comprobar que pasa**

Run: `npx vitest run shared/suscripcion/validacion.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 6: Puertas y commit**

```bash
npx prettier --write shared/suscripcion/
npm run check && npm run lint && npm run format:check && npm test
git add shared/suscripcion/
git commit -m "Añadir la validación compartida de la suscripción al boletín"
```

---

### Task 2: Cliente de Mailchimp (solo servidor)

**Files:**

- Create: `shared/suscripcion/mailchimp.ts`, `shared/suscripcion/mailchimp.test.ts`

**Interfaces:**

- Consumes: `SuscripcionValida` (Task 1).
- Produces:
  - `class SuscripcionNoConfigurada extends Error`
  - `class ErrorProveedor extends Error { estado: number }`
  - `hashSuscriptor(correo: string): string` (MD5 en hex del correo en minúsculas)
  - `suscribir(datos: SuscripcionValida): Promise<void>`: lanza una de las dos clases si falla

- [ ] **Step 1: Test**

`shared/suscripcion/mailchimp.test.ts`:

```ts
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
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run shared/suscripcion/mailchimp.test.ts`
Expected: FAIL. No resuelve `./mailchimp`.

- [ ] **Step 3: `mailchimp.ts`**

```ts
/**
 * Alta en la audiencia de Mailchimp (decisión D8 del plan de la Etapa 1).
 *
 * MÓDULO SOLO-SERVIDOR: lee `process.env`. El cliente React no debe
 * importarlo; usa `/api/suscripcion`.
 *
 * No guarda nada: el dato vive solo en Mailchimp. Hace un upsert con
 * `status_if_new: "pending"`: a quien es nuevo, Mailchimp le envía la doble
 * confirmación; a quien ya estaba (suscrito o dado de baja) no le cambia el
 * estado. Por eso la respuesta es la misma en todos los casos y el endpoint
 * no revela quién está en la lista.
 *
 * La audiencia necesita tres campos de texto además de FNAME: PAIS, ORG y
 * CARGO (ver docs/architecture.md).
 */
import { createHash } from "node:crypto";
import type { SuscripcionValida } from "./tipos";

export class SuscripcionNoConfigurada extends Error {
  constructor(motivo = "Faltan MAILCHIMP_API_KEY o MAILCHIMP_AUDIENCE_ID") {
    super(motivo);
    this.name = "SuscripcionNoConfigurada";
  }
}

export class ErrorProveedor extends Error {
  constructor(
    public estado: number,
    operacion: string,
  ) {
    // Sin datos personales en el mensaje: acaba en los logs.
    super(`Mailchimp respondió ${estado} al ${operacion}`);
    this.name = "ErrorProveedor";
  }
}

function configuracion() {
  const clave = process.env.MAILCHIMP_API_KEY;
  const audiencia = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!clave || !audiencia) throw new SuscripcionNoConfigurada();
  // La clave termina en el centro de datos de la cuenta: "…-us21".
  const centro = clave.split("-")[1];
  if (!centro)
    throw new SuscripcionNoConfigurada(
      "La clave de Mailchimp no indica su centro de datos",
    );
  return {
    base: `https://${centro}.api.mailchimp.com/3.0/lists/${audiencia}`,
    cabeceras: {
      Authorization: `Basic ${Buffer.from(`aspal:${clave}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  };
}

/** Mailchimp identifica al miembro por el MD5 de su correo en minúsculas. */
export function hashSuscriptor(correo: string): string {
  return createHash("md5").update(correo.toLowerCase()).digest("hex");
}

function camposFusion(datos: SuscripcionValida): Record<string, string> {
  const campos: Record<string, string> = {};
  if (datos.nombre) campos.FNAME = datos.nombre;
  if (datos.pais) campos.PAIS = datos.pais;
  if (datos.organizacion) campos.ORG = datos.organizacion;
  if (datos.cargo) campos.CARGO = datos.cargo;
  return campos;
}

export async function suscribir(datos: SuscripcionValida): Promise<void> {
  const { base, cabeceras } = configuracion();
  const miembro = `${base}/members/${hashSuscriptor(datos.correo)}`;

  const alta = await fetch(miembro, {
    method: "PUT",
    headers: cabeceras,
    body: JSON.stringify({
      email_address: datos.correo,
      status_if_new: "pending",
      merge_fields: camposFusion(datos),
    }),
  });
  if (!alta.ok) throw new ErrorProveedor(alta.status, "registrar el miembro");

  const etiqueta = await fetch(`${miembro}/tags`, {
    method: "POST",
    headers: cabeceras,
    body: JSON.stringify({
      tags: [{ name: `origen:${datos.origen}`, status: "active" }],
    }),
  });
  if (!etiqueta.ok) throw new ErrorProveedor(etiqueta.status, "etiquetar el miembro");
}
```

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run shared/suscripcion/mailchimp.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Puertas y commit**

```bash
npx prettier --write shared/suscripcion/
npm run check && npm run lint && npm run format:check && npm test
git add shared/suscripcion/mailchimp.ts shared/suscripcion/mailchimp.test.ts
git commit -m "Añadir el alta en Mailchimp con doble confirmación, sin guardar datos"
```

---

### Task 3: `POST /api/suscripcion` en ambos entornos

**Files:**

- Create: `shared/suscripcion/rutas.ts`, `shared/suscripcion/rutas.test.ts`
- Modify: `server/index.ts`, `api/index.ts` (una importación y una llamada cada uno)
- Modify: `.env.example`, `CLAUDE.md`

**Interfaces:**

- Consumes: `validarSuscripcion`, `esTrampa` (Task 1); `suscribir`, `SuscripcionNoConfigurada` (Task 2).
- Produces: `registrarRutasSuscripcion(app: Express): void`. Contrato HTTP de `POST /api/suscripcion` (JSON):
  - 200 `{ ok: true }`: alta enviada, o bot silenciado
  - 400 `{ ok: false, errores: ErroresSuscripcion }`
  - 503 `{ ok: false, error: "no_configurada" }`
  - 502 `{ ok: false, error: "proveedor" }`

- [ ] **Step 1: Test**

`shared/suscripcion/rutas.test.ts`:

```ts
import express from "express";
import { readFileSync } from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { resolve } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./mailchimp", async (original) => ({
  ...(await original<typeof import("./mailchimp")>()),
  suscribir: vi.fn(),
}));

const { suscribir, SuscripcionNoConfigurada, ErrorProveedor } =
  await import("./mailchimp");
const { registrarRutasSuscripcion } = await import("./rutas");

let servidor: Server;
let base: string;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  registrarRutasSuscripcion(app);
  await new Promise<void>((listo) => {
    servidor = app.listen(0, listo);
  });
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
});

afterAll(() => servidor.close());

beforeEach(() => {
  vi.mocked(suscribir).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

async function enviar(cuerpo: unknown) {
  const r = await fetch(`${base}/api/suscripcion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  return { estado: r.status, cuerpo: await r.json() };
}

const valida = { correo: "ana@ejemplo.org", consentimiento: true, origen: "footer" };

describe("POST /api/suscripcion", () => {
  it("da de alta y responde ok", async () => {
    vi.mocked(suscribir).mockResolvedValue();
    expect(await enviar(valida)).toEqual({ estado: 200, cuerpo: { ok: true } });
    expect(suscribir).toHaveBeenCalledWith({
      correo: "ana@ejemplo.org",
      origen: "footer",
    });
  });

  it("devuelve los errores de validación sin llamar al proveedor", async () => {
    const r = await enviar({ ...valida, correo: "no-es-correo" });
    expect(r.estado).toBe(400);
    expect(r.cuerpo.errores.correo).toBeTruthy();
    expect(suscribir).not.toHaveBeenCalled();
  });

  it("a un bot le responde lo mismo que a una persona y no lo registra", async () => {
    const r = await enviar({ ...valida, sitioWeb: "https://spam.example" });
    expect(r).toEqual({ estado: 200, cuerpo: { ok: true } });
    expect(suscribir).not.toHaveBeenCalled();
  });

  it("sin configuración responde 503, nunca un éxito falso", async () => {
    vi.mocked(suscribir).mockRejectedValue(new SuscripcionNoConfigurada());
    expect(await enviar(valida)).toEqual({
      estado: 503,
      cuerpo: { ok: false, error: "no_configurada" },
    });
  });

  it("un fallo del proveedor sale como 502 sin datos personales en el log", async () => {
    vi.mocked(suscribir).mockRejectedValue(
      new ErrorProveedor(500, "registrar el miembro"),
    );
    expect(await enviar(valida)).toEqual({
      estado: 502,
      cuerpo: { ok: false, error: "proveedor" },
    });
    const logs = vi.mocked(console.error).mock.calls.flat().map(String).join(" ");
    expect(logs).not.toContain("ana@ejemplo.org");
  });
});

describe("montaje", () => {
  it("lo registran tanto el servidor como la función de Vercel", () => {
    // api/ y server/ divergieron una vez; por eso existe shared/. Este test
    // impide que el formulario funcione en local y falle en producción.
    const raiz = resolve(import.meta.dirname, "..", "..");
    for (const archivo of ["server/index.ts", "api/index.ts"]) {
      const codigo = readFileSync(resolve(raiz, archivo), "utf8");
      expect(codigo, archivo).toContain("registrarRutasSuscripcion(app)");
    }
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run shared/suscripcion/rutas.test.ts`
Expected: FAIL. No resuelve `./rutas`.

- [ ] **Step 3: `rutas.ts`**

```ts
/**
 * `POST /api/suscripcion`: la primera escritura del sitio (decisión D8).
 *
 * Lo montan `server/index.ts` y `api/index.ts`, igual que las rutas de
 * WordPress. No guarda nada y no escribe datos personales en los logs.
 */
import type { Express, Request, Response } from "express";
import { SuscripcionNoConfigurada, suscribir } from "./mailchimp";
import { esTrampa, validarSuscripcion } from "./validacion";

export function registrarRutasSuscripcion(app: Express): void {
  app.post("/api/suscripcion", async (req: Request, res: Response) => {
    const entrada: unknown = req.body;

    // Al bot se le responde como a una persona: si notara la diferencia,
    // aprendería a no rellenar el campo trampa.
    if (esTrampa(entrada)) {
      res.json({ ok: true });
      return;
    }

    const resultado = validarSuscripcion(entrada);
    if (!resultado.ok) {
      res.status(400).json({ ok: false, errores: resultado.errores });
      return;
    }

    try {
      await suscribir(resultado.datos);
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof SuscripcionNoConfigurada) {
        console.error(`Suscripción no configurada: ${error.message}`);
        res.status(503).json({ ok: false, error: "no_configurada" });
        return;
      }
      console.error(
        "Suscripción: fallo del proveedor:",
        error instanceof Error ? error.message : "desconocido",
      );
      res.status(502).json({ ok: false, error: "proveedor" });
    }
  });
}
```

- [ ] **Step 4: Montarlo**

En `server/index.ts` y en `api/index.ts`, junto al import de `registerApiRoutes`:

```ts
import { registrarRutasSuscripcion } from "../shared/suscripcion/rutas";
```

y justo después de `registerApiRoutes(app);`:

```ts
registrarRutasSuscripcion(app);
```

(en `server/index.ts` va con la sangría del bloque `async`).

- [ ] **Step 5: `.env.example` y `CLAUDE.md`**

Añade al final de `.env.example`:

```bash

# Suscripción al boletín (POST /api/suscripcion → Mailchimp). Sin estas dos
# variables el endpoint responde 503. La clave termina en el centro de datos
# de la cuenta (p. ej. "…-us21"). En Vercel: Settings → Environment Variables.
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=
```

En `CLAUDE.md`:

- En «Qué es esto», cambia «**No hay base de datos, sesiones, autenticación ni estado de servidor.**» por «**No hay base de datos, sesiones, autenticación ni estado de servidor.** La única escritura es `POST /api/suscripcion`, que delega en Mailchimp y no guarda nada (decisión D8).».
- En la tabla «Fronteras de import», la fila de `client/src/**` pasa a: `@shared/wordpress/types` y `@shared/suscripcion/{tipos,validacion}` — **solo módulos puros**. Añade debajo de la tabla: «`shared/suscripcion/mailchimp.ts` es solo-servidor, igual que `client.ts`.».

- [ ] **Step 6: Comprobar que pasa**

Run: `npx vitest run shared/suscripcion/`
Expected: PASS: 11 + 7 + 6 tests.

- [ ] **Step 7: Puertas y commit**

```bash
npx prettier --write shared/suscripcion/ server/index.ts api/index.ts .env.example CLAUDE.md
npm run check && npm run lint && npm run format:check && npm test
git add shared/suscripcion/rutas.ts shared/suscripcion/rutas.test.ts server/index.ts api/index.ts .env.example CLAUDE.md
git commit -m "Publicar POST /api/suscripcion en el servidor y en Vercel"
```

Con `PORT=5001 npm run dev`, `curl -s -X POST localhost:5001/api/suscripcion -H "Content-Type: application/json" -d '{"correo":"a@b.co","consentimiento":true,"origen":"footer"}'` debe responder `{"ok":false,"error":"no_configurada"}` con código 503: no hay claves en local.

---

### Task 4: Envío desde el cliente y `FormSuscripcion`

**Files:**

- Create: `client/src/lib/suscripcion.ts`, `client/src/lib/suscripcion.test.ts`
- Create: `client/src/components/forms/FormSuscripcion.tsx`

**Interfaces:**

- Consumes: `validarSuscripcion`, `ORIGENES`, `PAISES`, `CAMPO_TRAMPA`, `ErroresSuscripcion`, `OrigenSuscripcion` de `@shared/suscripcion/…` (Task 1); `registrarEvento` de `@/lib/analitica`; `CONTACTO` de `@/lib/marca`; `Input` y `Button` de shadcn.
- Produces:
  - `type RespuestaEnvio = { estado: "exito" } | { estado: "invalido"; errores: ErroresSuscripcion } | { estado: "error" }`
  - `enviarSuscripcion(datos: Record<string, unknown>): Promise<RespuestaEnvio>`
  - `FormSuscripcion({ origen, variante, tono }: { origen: OrigenSuscripcion; variante: "completo" | "compacto"; tono?: "claro" | "noche" })`
  - `data-testid`: `form-suscripcion-<origen>`, `input-suscripcion-<campo>`, `checkbox-suscripcion-consentimiento`, `button-suscripcion-enviar`, `text-suscripcion-exito`, `text-suscripcion-error` y `error-suscripcion-<campo>`

- [ ] **Step 1: Test del envío**

`client/src/lib/suscripcion.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enviarSuscripcion } from "./suscripcion";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const respuesta = (status: number, cuerpo: unknown) =>
  ({ ok: status < 400, status, json: async () => cuerpo }) as Response;

describe("enviarSuscripcion", () => {
  it("envía JSON a /api/suscripcion y reporta éxito", async () => {
    fetchMock.mockResolvedValue(respuesta(200, { ok: true }));
    expect(await enviarSuscripcion({ correo: "a@b.co" })).toEqual({ estado: "exito" });
    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/suscripcion");
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body)).toEqual({ correo: "a@b.co" });
  });

  it("devuelve los errores de campo del servidor", async () => {
    fetchMock.mockResolvedValue(
      respuesta(400, { ok: false, errores: { correo: "Mal" } }),
    );
    expect(await enviarSuscripcion({})).toEqual({
      estado: "invalido",
      errores: { correo: "Mal" },
    });
  });

  it("trata 503 y 502 como error, nunca como éxito", async () => {
    for (const status of [502, 503, 500]) {
      fetchMock.mockResolvedValueOnce(respuesta(status, { ok: false }));
      expect(await enviarSuscripcion({}), String(status)).toEqual({ estado: "error" });
    }
  });

  it("sobrevive a la red caída y a un cuerpo que no es JSON", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    expect(await enviarSuscripcion({})).toEqual({ estado: "error" });
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => {
        throw new SyntaxError("x");
      },
    } as unknown as Response);
    expect(await enviarSuscripcion({})).toEqual({ estado: "invalido", errores: {} });
  });
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npx vitest run client/src/lib/suscripcion.test.ts`
Expected: FAIL. No resuelve `./suscripcion`.

- [ ] **Step 3: `client/src/lib/suscripcion.ts`**

```ts
import type { ErroresSuscripcion } from "@shared/suscripcion/tipos";

export type RespuestaEnvio =
  | { estado: "exito" }
  | { estado: "invalido"; errores: ErroresSuscripcion }
  | { estado: "error" };

/**
 * Envía la suscripción a `/api/suscripcion`. Nunca lanza: traduce cada
 * respuesta a un estado que el formulario sabe pintar. 503 (sin configurar) y
 * 502 (proveedor caído) son error, jamás éxito.
 */
export async function enviarSuscripcion(
  datos: Record<string, unknown>,
): Promise<RespuestaEnvio> {
  try {
    const respuesta = await fetch("/api/suscripcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (respuesta.ok) return { estado: "exito" };
    if (respuesta.status === 400) {
      const cuerpo = (await respuesta.json().catch(() => ({}))) as {
        errores?: ErroresSuscripcion;
      };
      return { estado: "invalido", errores: cuerpo.errores ?? {} };
    }
    return { estado: "error" };
  } catch {
    return { estado: "error" };
  }
}
```

- [ ] **Step 4: Comprobar que pasa**

Run: `npx vitest run client/src/lib/suscripcion.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: `FormSuscripcion.tsx`**

`client/src/components/forms/FormSuscripcion.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registrarEvento } from "@/lib/analitica";
import { CONTACTO } from "@/lib/marca";
import { enviarSuscripcion } from "@/lib/suscripcion";
import { cn } from "@/lib/utils";
import {
  CAMPO_TRAMPA,
  PAISES,
  type CampoSuscripcion,
  type ErroresSuscripcion,
  type OrigenSuscripcion,
} from "@shared/suscripcion/tipos";
import { validarSuscripcion } from "@shared/suscripcion/validacion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";

type Estado = "inactivo" | "enviando" | "exito" | "error";

interface Props {
  origen: OrigenSuscripcion;
  /** Completo: el alta de /unete. Compacto: solo correo (pie, /eventos). */
  variante: "completo" | "compacto";
  /** Sobre bandas noche el texto va en claro. */
  tono?: "claro" | "noche";
}

/**
 * Formulario de suscripción al boletín (RF-05). Valida con la misma función
 * que el servidor, envía a /api/suscripcion y distingue enviando, éxito y
 * error. El éxito explica la doble confirmación: sin ese aviso, quien no abre
 * el correo nunca queda suscrito y no sabe por qué.
 */
export function FormSuscripcion({ origen, variante, tono = "claro" }: Props) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [errores, setErrores] = useState<ErroresSuscripcion>({});
  const completo = variante === "completo";
  const oscuro = tono === "noche";

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const datos = {
      correo: formulario.get("correo"),
      nombre: formulario.get("nombre") ?? undefined,
      pais: formulario.get("pais") ?? undefined,
      organizacion: formulario.get("organizacion") ?? undefined,
      cargo: formulario.get("cargo") ?? undefined,
      consentimiento: formulario.get("consentimiento") === "si",
      origen,
      [CAMPO_TRAMPA]: formulario.get(CAMPO_TRAMPA) ?? "",
    };

    const local = validarSuscripcion(datos);
    if (!local.ok) {
      setErrores(local.errores);
      enfocarPrimerError(local.errores);
      return;
    }

    setErrores({});
    setEstado("enviando");
    const respuesta = await enviarSuscripcion(datos);
    if (respuesta.estado === "exito") {
      setEstado("exito");
      registrarEvento("signup_suscriptor", { origen });
    } else if (respuesta.estado === "invalido") {
      setEstado("inactivo");
      setErrores(respuesta.errores);
      enfocarPrimerError(respuesta.errores);
    } else {
      setEstado("error");
    }
  }

  function enfocarPrimerError(lista: ErroresSuscripcion) {
    const primero = Object.keys(lista)[0];
    if (!primero) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
  }

  if (estado === "exito") {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-2xl p-5",
          oscuro ? "bg-white/10 text-white" : "bg-accent text-foreground",
        )}
        data-testid="text-suscripcion-exito"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-base">
          ¡Listo! Te enviamos un correo para confirmar tu suscripción. Ábrelo y pulsa el
          botón de confirmación; sin ese paso no podemos escribirte.
        </p>
      </div>
    );
  }

  const etiqueta = cn(
    "block text-sm font-medium",
    oscuro ? "text-white" : "text-foreground",
  );
  const ayudaError = "mt-1 text-sm font-medium text-destructive";
  const campo = (nombre: CampoSuscripcion) => ({
    id: `${id}-${nombre}`,
    name: nombre,
    "aria-invalid": errores[nombre] ? true : undefined,
    "aria-describedby": errores[nombre] ? `${id}-${nombre}-error` : undefined,
    "data-testid": `input-suscripcion-${nombre}`,
  });
  const error = (nombre: CampoSuscripcion) =>
    errores[nombre] ? (
      <p
        id={`${id}-${nombre}-error`}
        className={cn(ayudaError, oscuro && "text-secondary")}
        data-testid={`error-suscripcion-${nombre}`}
      >
        {errores[nombre]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      onSubmit={alEnviar}
      noValidate
      className="space-y-4"
      aria-busy={estado === "enviando"}
      data-testid={`form-suscripcion-${origen}`}
    >
      {completo && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-nombre`} className={etiqueta}>
              Nombre
            </label>
            <Input {...campo("nombre")} autoComplete="name" className="mt-1 min-h-11" />
            {error("nombre")}
          </div>
          <div>
            <label htmlFor={`${id}-pais`} className={etiqueta}>
              País
            </label>
            <select
              {...campo("pais")}
              defaultValue=""
              className="mt-1 flex min-h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Elige tu país
              </option>
              {PAISES.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
            {error("pais")}
          </div>
          <div>
            <label htmlFor={`${id}-organizacion`} className={etiqueta}>
              Organización <span className="font-normal opacity-80">(opcional)</span>
            </label>
            <Input
              {...campo("organizacion")}
              autoComplete="organization"
              className="mt-1 min-h-11"
            />
          </div>
          <div>
            <label htmlFor={`${id}-cargo`} className={etiqueta}>
              Cargo <span className="font-normal opacity-80">(opcional)</span>
            </label>
            <Input
              {...campo("cargo")}
              autoComplete="organization-title"
              className="mt-1 min-h-11"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${id}-correo`} className={etiqueta}>
          Correo electrónico
        </label>
        <Input
          {...campo("correo")}
          type="email"
          autoComplete="email"
          inputMode="email"
          className="mt-1 min-h-11"
        />
        {error("correo")}
      </div>

      {/* Campo trampa: invisible y fuera del orden de tabulación. Solo lo
          rellenan los bots. */}
      <div
        aria-hidden="true"
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${id}-${CAMPO_TRAMPA}`}>No rellenes este campo</label>
        <input
          id={`${id}-${CAMPO_TRAMPA}`}
          name={CAMPO_TRAMPA}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          className={cn(
            "flex min-h-11 items-start gap-3 text-sm",
            oscuro ? "text-white" : "text-foreground",
          )}
        >
          <input
            type="checkbox"
            name="consentimiento"
            value="si"
            className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
            aria-invalid={errores.consentimiento ? true : undefined}
            aria-describedby={
              errores.consentimiento ? `${id}-consentimiento-error` : undefined
            }
            data-testid="checkbox-suscripcion-consentimiento"
          />
          {/* PENDIENTE (Etapa 0): enlazar el aviso de privacidad cuando exista
              /aviso-privacidad. Texto a revisar por la Coordinación. */}
          <span>
            Acepto que ASPAL use mis datos para enviarme su boletín. Puedo darme de baja
            en cualquier momento desde el propio correo.
          </span>
        </label>
        {error("consentimiento")}
      </div>

      {estado === "error" && (
        <p
          role="alert"
          className={cn(ayudaError, oscuro && "text-secondary")}
          data-testid="text-suscripcion-error"
        >
          No pudimos completar tu registro. Inténtalo de nuevo en unos minutos o
          escríbenos a{" "}
          <a href={`mailto:${CONTACTO.correo}`} className="underline underline-offset-4">
            {CONTACTO.correo}
          </a>
          .
        </p>
      )}

      <Button
        type="submit"
        variant="secondary"
        className="min-h-11 w-full px-6 sm:w-auto"
        disabled={estado === "enviando"}
        data-testid="button-suscripcion-enviar"
      >
        {estado === "enviando" && <Loader2 className="animate-spin" aria-hidden="true" />}
        {estado === "enviando" ? "Enviando…" : completo ? "Unirme gratis" : "Suscribirme"}
      </Button>
    </form>
  );
}
```

(Prettier reparte las líneas largas; el resultado formateado es el correcto.)

- [ ] **Step 6: Puertas y commit**

```bash
npx prettier --write client/src/lib/suscripcion.ts client/src/lib/suscripcion.test.ts client/src/components/forms/FormSuscripcion.tsx
npm run check && npm run lint && npm run format:check && npm test
git add client/src/lib/suscripcion.ts client/src/lib/suscripcion.test.ts client/src/components/forms/FormSuscripcion.tsx
git commit -m "Añadir el formulario de suscripción con validación compartida y estados de envío"
```

---

### Task 5: Páginas `/unete` y `/eventos`, el menú y el pie

**Files:**

- Create: `client/src/components/layout/Banda.tsx`, `client/src/components/layout/HeroInstitucional.tsx`
- Create: `client/src/pages/unete.tsx`, `client/src/pages/eventos.tsx`
- Modify: `client/src/lib/rutas.ts` (`"/unete"`, `"/eventos"`), `client/src/lib/seo.ts` (sus dos entradas), `client/src/App.tsx` (`PAGINAS`)
- Modify: `client/src/lib/navegacion.ts` (href de «Únete gratis» y de «Eventos»)
- Modify: `client/src/components/layout/Header.tsx` y `Footer.tsx` (Únete → `/unete`; boletín en el pie)
- Modify: `client/src/lib/rutas.test.ts` si enumera rutas (no lo hace: usa `RUTAS_ESTATICAS`)

**Interfaces:**

- Consumes: `FormSuscripcion` (Task 4); `URL_REGISTRO`, `registrarEvento`, `AvisoPestanaNueva`.
- Produces:
  - `Banda({ tono, id, className, children }: { tono?: "blanco" | "suave" | "noche"; id?: string; className?: string; children: ReactNode })`
  - `HeroInstitucional({ overline, titulo, children }: { overline: string; titulo: string; children?: ReactNode })`
  - Las rutas `/unete` y `/eventos` con su SEO. El PR E2 reutiliza `Banda` y `HeroInstitucional`.

- [ ] **Step 1: `Banda` y `HeroInstitucional`**

`client/src/components/layout/Banda.tsx`:

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const FONDOS = {
  blanco: "bg-background text-foreground",
  suave: "bg-fondo-suave text-foreground",
  noche: "bg-noche text-noche-foreground",
} as const;

/**
 * Banda horizontal de las páginas institucionales (guía de diseño: ritmo
 * blanco → suave → noche, 64 px en móvil y 96 px en escritorio).
 */
export function Banda({
  tono = "blanco",
  id,
  className,
  children,
}: {
  tono?: keyof typeof FONDOS;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", FONDOS[tono], className)}>
      <div className="container mx-auto max-w-7xl px-4 md:px-8">{children}</div>
    </section>
  );
}
```

`client/src/components/layout/HeroInstitucional.tsx`:

```tsx
import { Banda } from "@/components/layout/Banda";
import type { ReactNode } from "react";

/**
 * Hero de las páginas institucionales: banda noche, overline miel y un único
 * H1. Sin animaciones de opacidad: se prerenderiza.
 */
export function HeroInstitucional({
  overline,
  titulo,
  children,
}: {
  overline: string;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <Banda tono="noche">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-secondary">
        {overline}
      </p>
      <h1
        className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        data-testid="text-hero-titulo"
      >
        {titulo}
      </h1>
      {children && <div className="mt-6 max-w-2xl text-lg text-white/85">{children}</div>}
    </Banda>
  );
}
```

`text-white/85` sobre noche mantiene holgadamente AA (blanco puro sobre noche da 15.3:1).

- [ ] **Step 2: Rutas, SEO y páginas**

En `client/src/lib/rutas.ts`: `RUTAS_ESTATICAS = ["/", "/blog", "/podcast", "/plataforma", "/unete", "/eventos"] as const`.

En `client/src/lib/seo.ts`, dentro de `SEO`:

```ts
  "/unete": {
    titulo: "Únete a la casa común · ASPAL",
    descripcion:
      "Únete a la red en español que profesionaliza el sector asociativo de América Latina: suscripción gratuita o membresía.",
    indexable: true,
  },
  "/eventos": {
    titulo: "Eventos · ASPAL",
    descripcion:
      "Calendario de eventos y webinars de ASPAL para el sector asociativo de América Latina. Muy pronto.",
    indexable: true,
  },
```

En `client/src/App.tsx`: importa `Unete from "@/pages/unete"` y `Eventos from "@/pages/eventos"`, y añade `"/unete": Unete, "/eventos": Eventos` a `PAGINAS`.

`client/src/pages/unete.tsx`:

```tsx
import { FormSuscripcion } from "@/components/forms/FormSuscripcion";
import { AvisoPestanaNueva } from "@/components/layout/AvisoPestanaNueva";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";
import { Button } from "@/components/ui/button";
import { registrarEvento } from "@/lib/analitica";
import { URL_REGISTRO } from "@/lib/navegacion";
import { ArrowUpRight, BadgeCheck, Mail } from "lucide-react";

/**
 * Únete (§6.6 del plan de la Etapa 1): dos caminos lado a lado, suscriptor
 * gratuito (formulario propio) y membresía básica (plataforma de comunidad).
 * El copy de la cabecera y de «Qué recibes» sale literal del Concepto NOSOTROS
 * (Bloques 10 y 4).
 */
export default function Unete() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroInstitucional
          overline="#NingunDirectorDirigeSolo"
          titulo="Únete a la casa común"
        >
          <p>
            Si diriges o formas parte del equipo de una asociación, sociedad, colegio o
            federación profesional en América Latina, esta es tu casa.
          </p>
        </HeroInstitucional>

        <Banda tono="suave">
          <div className="grid gap-8 lg:grid-cols-5">
            <div
              className="rounded-2xl border border-border bg-background p-6 md:p-8 lg:col-span-3"
              data-testid="card-unete-gratis"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Suscriptor gratuito
                </h2>
              </div>
              <p className="mt-2 text-lg text-muted-foreground">
                Sin costo. Recibe el boletín de ASPAL en tu correo.
              </p>
              <div className="mt-6">
                <FormSuscripcion origen="unete" variante="completo" />
              </div>
            </div>

            <div
              className="flex flex-col rounded-2xl border border-border bg-background p-6 md:p-8 lg:col-span-2"
              data-testid="card-unete-membresia"
            >
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Membresía básica
                </h2>
              </div>
              <p className="mt-2 text-lg text-muted-foreground">
                Accede a la plataforma de comunidad de ASPAL.
              </p>
              {/* PENDIENTE (Etapa 3): niveles profesional y grupal con precios. */}
              <p className="mt-4 text-base text-muted-foreground">
                Próximamente: membresías profesional y grupal.
              </p>
              <Button
                variant="outline"
                className="mt-auto min-h-11 self-start px-6"
                asChild
              >
                <a
                  href={URL_REGISTRO}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    registrarEvento("salida_plataforma", {
                      destino: URL_REGISTRO,
                      origen: "unete",
                    })
                  }
                  data-testid="button-unete-membresia"
                >
                  Ir a la membresía básica
                  <ArrowUpRight aria-hidden="true" />
                  <AvisoPestanaNueva />
                </a>
              </Button>
            </div>
          </div>
        </Banda>

        <Banda>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Qué recibes al unirte
          </h2>
          <p
            className="mt-4 max-w-3xl text-lg text-muted-foreground"
            data-testid="text-unete-promesa"
          >
            Al unirte a ASPAL dejas de dirigir tu asociación solo. Encuentras un
            directorio de colegas, una biblioteca curada, una plataforma tecnológica lista
            para usar y datos reales del sector para decidir con evidencia.
          </p>
          {/* PENDIENTE: 3 preguntas frecuentes (§6.6). No están en el Concepto
              NOSOTROS; las redacta la Coordinación. */}
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

`client/src/pages/eventos.tsx`:

```tsx
import { FormSuscripcion } from "@/components/forms/FormSuscripcion";
import { Banda } from "@/components/layout/Banda";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeroInstitucional } from "@/components/layout/HeroInstitucional";

/**
 * Eventos, en modo «Próximamente» con captura (RF-09). Texto genérico: el
 * pre-anuncio del Encuentro CDMX 2027 espera la decisión 10 del DG.
 * PENDIENTE (Etapa 3): calendario de eventos y webinars.
 */
export default function Eventos() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroInstitucional overline="Próximamente" titulo="Eventos">
          <p>
            Estamos preparando el calendario de eventos y los webinars mensuales de ASPAL.
            Déjanos tu correo y te avisamos en cuanto abramos inscripciones.
          </p>
        </HeroInstitucional>
        <Banda tono="suave">
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-background p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-foreground">Avísame</h2>
            <div className="mt-6">
              <FormSuscripcion origen="eventos" variante="compacto" />
            </div>
          </div>
        </Banda>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Menú: `/unete` y `/eventos` pasan a vivos**

En `client/src/lib/navegacion.ts`:

- En «Eventos», quita el comentario `PENDIENTE (PR E)` y añade `href: "/eventos",`.
- En «Únete gratis», quita el comentario `PENDIENTE (PR E): /unete.` y añade `href: "/unete",`. Sigue detrás de «Membresía básica»: los dos son vivos.

Ejecuta `npx vitest run client/src/lib/navegacion.test.ts`. Tienen que pasar los tests de enlaces muertos (ahora `/unete` y `/eventos` existen) y el de vivos antes que pendientes. El test «nunca marca un rubro que solo apunta fuera o que no existe aún» usaba Eventos con `/eventos`: cámbialo para que compruebe que Eventos **sí** está activo en `/eventos` (`toBe(true)`) y que Comunidad no lo está en `/blog`.

- [ ] **Step 4: Únete → `/unete` en todo el sitio (D2)**

En `Header.tsx`, los botones `button-registro` (escritorio) y `button-mobile-registro` (panel) pasan de `<a href={URL_REGISTRO} target="_blank" …>` a:

```tsx
<Link href="/unete" onClick={() => registrarEvento("click_unete", { origen: "header" })}>
  <UserPlus className="h-4 w-4" />
  Únete
</Link>
```

(con `origen: "menu_movil"` en el panel). Quita su `AvisoPestanaNueva`: ya no abren pestaña. Si `URL_REGISTRO` queda sin uso en `Header.tsx`, quítalo del import.

En `Footer.tsx`:

- El botón «Únete a ASPAL» pasa igualmente a `<Link href="/unete" …>`, sin `target` ni aviso.
- Añade el boletín como primera fila del contenedor, antes del grid:

```tsx
<div className="mb-12 grid gap-6 border-b border-border pb-12 lg:grid-cols-2 lg:items-end">
  <div>
    <h3
      className="text-xl font-semibold text-foreground"
      data-testid="text-footer-boletin"
    >
      Recibe el boletín de ASPAL
    </h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Novedades del sector asociativo de América Latina, en tu correo.
    </p>
  </div>
  <FormSuscripcion origen="footer" variante="compacto" />
</div>
```

(importa `FormSuscripcion`; quita del comentario de cabecera del pie el `PENDIENTE (PR E)` del boletín).

- [ ] **Step 5: Puertas, build y comprobaciones**

```bash
npx prettier --write client/src
npm run check && npm run lint && npm run format:check && npm test && npm run build
grep -o "<title>[^<]*</title>" dist/public/unete.html dist/public/eventos.html
grep -c "<h1" dist/public/unete.html dist/public/eventos.html
grep -c "unete\|eventos" dist/public/sitemap.xml
```

Expected: verde. Prerender de 6 rutas. Los títulos de `SEO`. Un `<h1` en cada página. Ambas URLs en el sitemap.

- [ ] **Step 6: Commit**

```bash
git add client/src
git commit -m "Publicar /unete y /eventos con suscripción, y llevar Únete a /unete en todo el sitio"
```

- [ ] **Step 7: Verificación en navegador (la hace el controlador)**

En `/unete`, `/eventos` y el pie, a 375, 768, 1024 y 1440 px:

- Enviar vacío muestra los errores junto a cada campo y el foco va al primero.
- Con datos válidos y sin claves en local, aparece el mensaje de error con el correo de contacto (503).
- Tabulando no se llega al campo trampa.
- Únete, en la cabecera, el panel y el pie, lleva a `/unete` y registra `click_unete`.
- Eventos ya no es «Próximamente» en el menú.

---

### Task 6: Documentar y cerrar el PR E1

**Files:**

- Modify: `docs/architecture.md`

- [ ] **Step 1: `docs/architecture.md`**

Añade una sección «Suscripción al boletín» tras la de WordPress:

```markdown
## Suscripción al boletín

`POST /api/suscripcion` (lógica en `shared/suscripcion/`, montada en
`server/index.ts` y `api/index.ts`). Es la única escritura del sitio y no
guarda nada: valida con `validacion.ts` (la misma función que usa el
formulario), descarta en silencio a los bots (campo trampa `sitioWeb`) y hace
un upsert en Mailchimp con `status_if_new: "pending"`, que dispara la doble
confirmación y no reactiva a quien se dio de baja. Etiqueta al miembro con
`origen:<unete|home|footer|eventos>`.

Configuración (Vercel → Settings → Environment Variables):

- `MAILCHIMP_API_KEY`: termina en el centro de datos (`…-us21`).
- `MAILCHIMP_AUDIENCE_ID`: id de la audiencia.
- En la audiencia: campos de texto `PAIS`, `ORG` y `CARGO` (además de `FNAME`)
  y la doble confirmación activada.

Respuestas: 200 `{ok:true}` · 400 con `errores` por campo · 503 sin
configuración · 502 si falla Mailchimp. Nunca registra datos personales en
los logs.
```

- [ ] **Step 2: Puertas completas, build y commit**

```bash
npx prettier --write docs/architecture.md
npm run check && npm run lint && npm run format:check && npm test && npm run build
git add docs/architecture.md
git commit -m "Documentar la suscripción al boletín y su configuración en Mailchimp"
```

- [ ] **Step 3: Integración (la hace el controlador, tras la revisión final)**

```bash
git switch feat/etapa-1-institucional
git merge --no-ff etapa1/e1-suscripcion -m "PR E1: suscripción con Mailchimp, /unete y /eventos"
```

---

## Qué queda fuera y a quién le toca

- **Las claves de Mailchimp y la configuración de la audiencia** (campos PAIS, ORG, CARGO y doble confirmación): las pone en Vercel quien administre la cuenta. Sin ellas, el formulario muestra el error y el correo de contacto. Probar el alta de verdad exige un preview con claves.
- **El aviso de privacidad** (Etapa 0): el consentimiento queda sin enlace y con `PENDIENTE`. **Conviene que lo revise quien lleve lo legal antes de publicar.**
- **Las 3 preguntas frecuentes de `/unete`**: no están en el Concepto NOSOTROS; las redacta la Coordinación.
- **El formulario de la home** (`origen: "home"`) llega con la home institucional, en el PR F.
- **PR E2**: `/nosotros` (10 bloques), `/que-hacemos` (4 pilares) y `/nuestro-equipo`, con el copy del Concepto NOSOTROS, reutilizando `Banda` y `HeroInstitucional`.
