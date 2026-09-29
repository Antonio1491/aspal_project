import logoLight from "@assets/ASPAL-para fondo claro_1763675327795.png";
import logoDark from "@assets/ASPAL-para fondo oscuro_1763675345456.png";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  NAVEGACION,
  destinosDe,
  esDesplegable,
  URL_LOGIN,
  URL_REGISTRO,
  esEntradaActiva,
  esRutaActiva,
  type DestinoNav,
  type EntradaNav,
} from "@/lib/navegacion";
import { Proximamente } from "@/components/layout/Proximamente";
import { registrarEvento } from "@/lib/analitica";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";

/** Un destino dentro de un desplegable de escritorio. */
function DestinoEscritorio({ destino, ruta }: { destino: DestinoNav; ruta: string }) {
  const activo = esRutaActiva(destino.href, ruta);

  const Icono = destino.icono;

  const contenido = (
    <div className="flex gap-3">
      {/* Decorativo: siempre acompaña a la etiqueta, nunca la sustituye.
          Sin recuadro de fondo: el amarillo es del CTA y de la marca de ruta
          activa, y repetirlo en cada fila del menú le quitaba significado. */}
      <Icono
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          destino.href ? "text-foreground" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-sm leading-none",
              destino.href
                ? "font-medium text-foreground"
                : "font-medium text-muted-foreground",
            )}
          >
            {destino.etiqueta}
          </span>
          {destino.externo && (
            <ArrowUpRight
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          {!destino.href && <Proximamente className="ml-auto" />}
        </div>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {destino.descripcion}
        </p>
      </div>
    </div>
  );

  // Sin `href` la sección no existe: se anuncia, pero no se finge navegable.
  if (!destino.href) {
    return (
      <li>
        <div
          className="cursor-default rounded-md p-3 opacity-70"
          aria-disabled="true"
          data-testid={destino.testid}
        >
          {contenido}
        </div>
      </li>
    );
  }

  // Hover y activo dicen cosas distintas —"apuntas a esto" y "aquí estás"—, así
  // que no pueden compartir tratamiento. El hover usa `hover-elevate`, el
  // sistema neutro de la casa. El activo lleva la barra amarilla, el mismo
  // idioma que el subrayado de la barra superior. El `--accent` que había antes
  // tiene exactamente la luminosidad del panel (94%): teñía sin resaltar.
  const clases = cn(
    "hover-elevate block rounded-md p-3 no-underline outline-none transition-colors",
    "focus-visible:ring-1 focus-visible:ring-ring",
    activo && "bg-foreground/5 shadow-[inset_3px_0_0_0_hsl(var(--secondary))]",
  );

  return (
    <li>
      {destino.externo ? (
        <a
          href={destino.href}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
          data-testid={destino.testid}
        >
          {contenido}
        </a>
      ) : (
        <Link
          href={destino.href}
          className={clases}
          aria-current={activo ? "page" : undefined}
          data-testid={destino.testid}
        >
          {contenido}
        </Link>
      )}
    </li>
  );
}

/** Una entrada de primer nivel del menú de escritorio. */
function EntradaEscritorio({ entrada, ruta }: { entrada: EntradaNav; ruta: string }) {
  const activa = esEntradaActiva(entrada, ruta);

  // El subrayado acompaña al cambio de peso tipográfico: el color nunca es el
  // único canal que indica dónde estás.
  const subrayado = (
    <span
      className={cn(
        "absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-secondary transition-opacity",
        activa ? "opacity-100" : "opacity-0",
      )}
      aria-hidden="true"
    />
  );

  if (!esDesplegable(entrada)) {
    return (
      <NavigationMenuItem>
        <div
          className={cn(
            navigationMenuTriggerStyle(),
            "relative cursor-default gap-2 bg-transparent text-muted-foreground hover:bg-transparent",
          )}
          aria-disabled="true"
          data-testid={entrada.testid}
        >
          {entrada.etiqueta}
          <Proximamente />
          {subrayado}
        </div>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "relative bg-transparent",
          activa && "font-semibold text-foreground",
        )}
        data-testid={entrada.testid}
      >
        {entrada.etiqueta}
        {subrayado}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* 380px: cabe "Directorio de la Industria" junto a su marca de
            Próximamente sin partir la etiqueta en dos líneas. */}
        <ul className="grid w-[380px] gap-1 p-2">
          {destinosDe(entrada).map((destino) => (
            <DestinoEscritorio key={destino.testid} destino={destino} ruta={ruta} />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

/** Un destino dentro del panel móvil. */
function DestinoMovil({ destino, ruta }: { destino: DestinoNav; ruta: string }) {
  const activo = esRutaActiva(destino.href, ruta);
  const Icono = destino.icono;
  const clases =
    "hover-elevate flex min-h-11 items-center gap-3 rounded-md px-3 text-base text-muted-foreground hover:text-foreground";
  const icono = <Icono className="h-4 w-4 shrink-0" aria-hidden="true" />;

  if (!destino.href) {
    return (
      <div
        className={cn(clases, "opacity-70")}
        aria-disabled="true"
        data-testid={`mobile-${destino.testid}`}
      >
        {icono}
        {destino.etiqueta}
        <Proximamente className="ml-auto" />
      </div>
    );
  }

  if (destino.externo) {
    return (
      <a
        href={destino.href}
        target="_blank"
        rel="noopener noreferrer"
        className={clases}
        data-testid={`mobile-${destino.testid}`}
      >
        {icono}
        {destino.etiqueta}
        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link
      href={destino.href}
      className={cn(
        clases,
        activo &&
          "bg-foreground/5 font-semibold text-foreground shadow-[inset_3px_0_0_0_hsl(var(--secondary))]",
      )}
      aria-current={activo ? "page" : undefined}
      data-testid={`mobile-${destino.testid}`}
    >
      {icono}
      {destino.etiqueta}
    </Link>
  );
}

/**
 * Panel móvil a pantalla completa.
 *
 * Va en un portal porque el `backdrop-filter` de la cabecera crea un bloque
 * contenedor: un `fixed` descendiente se posicionaría contra la cabecera, no
 * contra la ventana.
 */
function PanelMovil({
  abierto,
  onCerrar,
  ruta,
}: {
  abierto: boolean;
  onCerrar: () => void;
  ruta: string;
}) {
  const [montado, setMontado] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMontado(true), []);

  // Bloquea el scroll del cuerpo mientras el panel cubre la pantalla.
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  // Escape cierra, y el foco queda atrapado dentro del panel.
  useEffect(() => {
    if (!abierto) return;
    const enfocadoAntes = document.activeElement as HTMLElement | null;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        onCerrar();
        return;
      }
      if (evento.key !== "Tab" || !panelRef.current) return;

      const enfocables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (enfocables.length === 0) return;

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPulsar);
    return () => {
      document.removeEventListener("keydown", alPulsar);
      enfocadoAntes?.focus();
    };
  }, [abierto, onCerrar]);

  if (!montado) return null;

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          ref={panelRef}
          id="menu-movil"
          className="fixed inset-0 z-[100] flex flex-col bg-background lg:hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <span className="text-sm font-semibold text-foreground">Menú</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCerrar}
              aria-label="Cerrar menú"
              data-testid="button-mobile-close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Principal">
            {NAVEGACION.map((entrada) =>
              esDesplegable(entrada) ? (
                <GrupoMovil key={entrada.testid} entrada={entrada} ruta={ruta} />
              ) : (
                <div
                  key={entrada.testid}
                  className="flex min-h-11 items-center gap-3 py-2 text-base font-medium text-muted-foreground opacity-70"
                  aria-disabled="true"
                  data-testid={`mobile-${entrada.testid}`}
                >
                  <entrada.icono className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {entrada.etiqueta}
                  <Proximamente className="ml-auto" />
                </div>
              ),
            )}
          </nav>

          {/* Únete queda fijo abajo, al alcance del pulgar. */}
          <div className="shrink-0 space-y-2 border-t border-border p-4">
            <Button variant="ghost" className="min-h-11 w-full" asChild>
              <a href={URL_LOGIN} data-testid="button-mobile-login">
                Iniciar sesión
              </a>
            </Button>
            <Button
              variant="secondary"
              className="min-h-11 w-full"
              asChild
              data-testid="button-mobile-registro"
            >
              <a
                href={URL_REGISTRO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("click_unete", { origen: "menu_movil" })}
              >
                <UserPlus className="h-4 w-4" />
                Únete
              </a>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function GrupoMovil({ entrada, ruta }: { entrada: EntradaNav; ruta: string }) {
  const [abierto, setAbierto] = useState(() => esEntradaActiva(entrada, ruta));

  return (
    <Collapsible open={abierto} onOpenChange={setAbierto}>
      <CollapsibleTrigger
        className="flex min-h-11 w-full items-center gap-3 py-2 text-base font-medium text-foreground"
        data-testid={`mobile-${entrada.testid}`}
      >
        <entrada.icono className="h-4 w-4 shrink-0" aria-hidden="true" />
        {entrada.etiqueta}
        <ChevronDown
          className={cn("ml-auto h-4 w-4 transition-transform", abierto && "rotate-180")}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pb-2 pl-1">
        {destinosDe(entrada).map((destino) => (
          <DestinoMovil key={destino.testid} destino={destino} ruta={ruta} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Header() {
  const [ruta] = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [compacto, setCompacto] = useState(false);

  // El panel debe cerrarse al navegar. Antes se quedaba abierto encima de la
  // página nueva.
  useEffect(() => setMenuAbierto(false), [ruta]);

  useEffect(() => {
    const alScroll = () => setCompacto(window.scrollY > 32);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // Al cruzar a escritorio el panel debe cerrarse. Si no, `lg:hidden` le pone
  // `display: none` a mitad de la animación de salida, framer-motion nunca
  // recibe el fin de la animación y el nodo se queda montado: al girar la
  // tablet de vuelta a vertical reaparecería un panel invisible tapando la
  // página. Es el caso de una tablet rotando, no un caso de laboratorio.
  useEffect(() => {
    const escritorio = window.matchMedia("(min-width: 1024px)");
    const alCambiar = (evento: MediaQueryListEvent | MediaQueryList) => {
      if (evento.matches) setMenuAbierto(false);
    };
    alCambiar(escritorio);
    escritorio.addEventListener("change", alCambiar);
    return () => escritorio.removeEventListener("change", alCambiar);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div
          className={cn(
            "flex items-center justify-between transition-[height] duration-200",
            compacto ? "h-16" : "h-16 md:h-20",
          )}
        >
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="flex shrink-0 items-center" data-testid="link-logo">
              <img
                src={logoLight}
                alt="Aspal — ir al inicio"
                className={cn(
                  "w-auto transition-[height] duration-200 dark:hidden",
                  compacto ? "h-8" : "h-8 md:h-10",
                )}
                data-testid="img-logo-light"
              />
              <img
                src={logoDark}
                alt="Aspal — ir al inicio"
                className={cn(
                  "hidden w-auto transition-[height] duration-200 dark:block",
                  compacto ? "h-8" : "h-8 md:h-10",
                )}
                data-testid="img-logo-dark"
              />
            </Link>
          </div>

          {/* Navegación de escritorio, ópticamente centrada entre los laterales.
              Desde `lg` (1024px), no `md`: a 768px el menú y las acciones no
              caben, el logo se aplastaba a ancho 0 y Únete quedaba cortado. */}
          <NavigationMenu className="hidden lg:flex" aria-label="Principal">
            <NavigationMenuList>
              {NAVEGACION.map((entrada) => (
                <EntradaEscritorio key={entrada.testid} entrada={entrada} ruta={ruta} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Acciones: un solo botón lleno en toda la cabecera */}
          <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
            <Button variant="ghost" asChild data-testid="button-login">
              <a href={URL_LOGIN}>Iniciar sesión</a>
            </Button>
            <Button variant="secondary" asChild data-testid="button-registro">
              <a
                href={URL_REGISTRO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("click_unete", { origen: "header" })}
              >
                <UserPlus className="h-4 w-4" />
                Únete
              </a>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuAbierto(true)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label="Abrir menú"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <PanelMovil
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        ruta={ruta}
      />
    </header>
  );
}
