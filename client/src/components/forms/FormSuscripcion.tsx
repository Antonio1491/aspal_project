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
