import { DEMOS_PROPIOS } from "./demos-propios";
import type { Demo } from "./tipos";

/** Demo de un componente por id. El Task 5 añade las de shadcn/ui. */
const DEMOS: Partial<Record<string, Demo>> = { ...DEMOS_PROPIOS };

export function demoDe(id: string): Demo | undefined {
  return DEMOS[id];
}
