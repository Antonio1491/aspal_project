import type { Demo } from "./tipos";

/** Demo de un componente por id. Los Tasks 4 y 5 la llenan. */
const DEMOS: Partial<Record<string, Demo>> = {};

export function demoDe(id: string): Demo | undefined {
  return DEMOS[id];
}
