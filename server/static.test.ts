import express from "express";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveStatic } from "./static";

let servidor: Server;
let base: string;
let dist: string;

beforeAll(async () => {
  dist = mkdtempSync(join(tmpdir(), "aspal-dist-"));
  for (const [archivo, marca] of [
    ["index.html", "HOME"],
    ["blog.html", "BLOG"],
    ["spa.html", "SHELL"],
    ["404.html", "NO-ENCONTRADA"],
  ]) {
    writeFileSync(join(dist, archivo), `<html>${marca}</html>`);
  }
  const app = express();
  serveStatic(app, dist);
  await new Promise<void>((listo) => {
    servidor = app.listen(0, listo);
  });
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
});

afterAll(() => {
  servidor.close();
  rmSync(dist, { recursive: true, force: true });
});

async function pedir(ruta: string) {
  const respuesta = await fetch(`${base}${ruta}`, { redirect: "manual" });
  return { estado: respuesta.status, cuerpo: await respuesta.text() };
}

describe("serveStatic", () => {
  it("sirve la home prerenderizada", async () => {
    expect(await pedir("/")).toEqual({ estado: 200, cuerpo: "<html>HOME</html>" });
  });

  it("sirve cada ruta estática sin extensión", async () => {
    expect(await pedir("/blog")).toEqual({ estado: 200, cuerpo: "<html>BLOG</html>" });
  });

  it("redirige la barra final a la ruta sin barra, conservando la consulta", async () => {
    // Si no, /blog/ recibiría el 404.html pero wouter pintaría el blog en el
    // cliente: código y contenido se contradirían.
    const respuesta = await fetch(`${base}/blog/?origen=correo`, { redirect: "manual" });
    expect(respuesta.status).toBe(308);
    expect(respuesta.headers.get("location")).toBe("/blog?origen=correo");
  });

  it("sirve el shell a las rutas dinámicas, con 200", async () => {
    // Recargar un artículo no puede dar 404: el cliente lo carga desde la API.
    expect(await pedir("/blog/un-articulo")).toEqual({
      estado: 200,
      cuerpo: "<html>SHELL</html>",
    });
  });

  it("responde 404 de verdad, con la página 404, a lo que no existe", async () => {
    expect(await pedir("/no-existe")).toEqual({
      estado: 404,
      cuerpo: "<html>NO-ENCONTRADA</html>",
    });
    expect((await pedir("/blog/a/b")).estado).toBe(404);
  });
});
