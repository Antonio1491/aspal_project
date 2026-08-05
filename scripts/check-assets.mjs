#!/usr/bin/env node
/**
 * Verifica que todo import `@assets/...` apunte a un archivo que existe.
 *
 * Hace falta porque ni `tsc` ni `vite build` lo detectan: sin una entrada en
 * `paths` del tsconfig, TypeScript resuelve estos imports con la declaración
 * comodín `declare module '*.png'` de vite/client, que acepta cualquier ruta
 * termine donde termine. Un asset borrado o mal escrito pasa las dos puertas en
 * verde y solo se manifiesta como imagen rota en el navegador.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "client", "src");
const ASSETS = join(SRC, "assets");

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sources = walk(SRC).filter((f) => /\.(ts|tsx)$/.test(f));
const missing = [];

for (const file of sources) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(/["']@assets\/([^"']+)["']/g)) {
    const asset = join(ASSETS, match[1]);
    try {
      statSync(asset);
    } catch {
      missing.push({ file: relative(ROOT, file), asset: match[1] });
    }
  }
}

if (missing.length > 0) {
  console.error(`✗ ${missing.length} asset(s) referenciado(s) que no existe(n):\n`);
  for (const { file, asset } of missing) {
    console.error(`  ${file}`);
    console.error(`    @assets/${asset}`);
  }
  process.exit(1);
}

console.log(`✓ assets: todas las referencias @assets/ resuelven (${sources.length} archivos revisados)`);
