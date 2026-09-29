/** Tarjeta de «Lo que defendemos» (Bloque 4). */
export function TarjetaCompromiso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <article className="h-full rounded-2xl border border-border bg-background p-6 md:p-8">
      <h3 className="text-xl font-bold text-foreground">{titulo}</h3>
      <p className="mt-3 text-lg text-muted-foreground">{texto}</p>
    </article>
  );
}
