import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Bloque de código con botón de copiar. El aviso «Copiado» llega al lector de pantalla. */
export function CopiarCodigo({ codigo, testid }: { codigo: string; testid: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl bg-noche p-4 pr-24 text-sm text-noche-foreground">
        <code>{codigo}</code>
      </pre>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 min-h-9 bg-background"
        onClick={async () => {
          await navigator.clipboard?.writeText(codigo);
          setCopiado(true);
          window.setTimeout(() => setCopiado(false), 1500);
        }}
        data-testid={testid}
      >
        {copiado ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span aria-live="polite">{copiado ? "Copiado" : "Copiar"}</span>
      </Button>
    </div>
  );
}
