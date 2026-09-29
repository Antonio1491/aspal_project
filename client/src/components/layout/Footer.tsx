import logoLight from "@assets/ASPAL-para fondo claro_1763675327795.png";
import logoDark from "@assets/ASPAL-para fondo oscuro_1763675345456.png";
import { Proximamente } from "@/components/layout/Proximamente";
import { Button } from "@/components/ui/button";
import {
  NAVEGACION,
  URL_REGISTRO,
  type DestinoNav,
  type EntradaNav,
} from "@/lib/navegacion";
import { registrarEvento } from "@/lib/analitica";
import { CONTACTO, NOMBRE_MARCA, REDES } from "@/lib/marca";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const elemento = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

/** Un dato de contacto que se puede accionar: escribir, llamar o ubicar. */
function Contacto({
  icono: Icono,
  href,
  children,
  testid,
}: {
  icono: LucideIcon;
  href?: string;
  children: React.ReactNode;
  testid: string;
}) {
  const contenido = (
    <>
      <Icono className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="break-all">{children}</span>
    </>
  );

  if (!href) {
    return (
      <li
        className="flex min-h-11 items-start gap-2 py-2 text-sm text-muted-foreground"
        data-testid={testid}
      >
        {contenido}
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        className="flex min-h-11 items-start gap-2 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        data-testid={testid}
      >
        {contenido}
      </a>
    </li>
  );
}

/** Un destino del pie. Sin `href` se anuncia, pero no se enlaza. */
function DestinoPie({ destino }: { destino: DestinoNav }) {
  const clases =
    "flex min-h-11 items-center gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-primary";

  if (!destino.href) {
    return (
      <li>
        <div
          className={cn(clases, "opacity-70")}
          aria-disabled="true"
          data-testid={`footer-${destino.testid}`}
        >
          {destino.etiqueta}
          <Proximamente />
        </div>
      </li>
    );
  }

  return (
    <li>
      {destino.externo ? (
        <a
          href={destino.href}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
          data-testid={`footer-${destino.testid}`}
        >
          {destino.etiqueta}
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      ) : (
        <Link
          href={destino.href}
          className={clases}
          data-testid={`footer-${destino.testid}`}
        >
          {destino.etiqueta}
        </Link>
      )}
    </li>
  );
}

function ColumnaNav({ entrada }: { entrada: EntradaNav }) {
  return (
    <motion.div variants={elemento}>
      <h3
        className="font-semibold text-foreground"
        data-testid={`footer-${entrada.testid}`}
      >
        {entrada.etiqueta}
      </h3>
      <ul className="mt-2">
        {entrada.destinos?.map((destino) => (
          <DestinoPie key={destino.testid} destino={destino} />
        ))}
      </ul>
    </motion.div>
  );
}

export default function Footer() {
  // Las columnas de navegación salen de `navegacion.ts`, la misma fuente que
  // pinta la cabecera. Antes el pie declaraba su propia taxonomía —Inicio,
  // Servicios, Casos de éxito, Testimonios— que no coincidía con la del menú y
  // cuyas once anclas no existían en ninguna página. Heredándola no puede
  // volver a divergir ni a apuntar al vacío.
  const columnas = NAVEGACION.filter((entrada) => entrada.destinos?.length);

  return (
    <footer className="border-t border-border bg-muted/30" data-testid="footer">
      <h2 className="sr-only">Pie de página</h2>
      <div className="container mx-auto px-4 py-16 md:px-8">
        <motion.div
          className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
          variants={contenedor}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Marca */}
          <motion.div variants={elemento}>
            <img
              src={logoLight}
              alt="Aspal"
              className="h-8 w-auto dark:hidden"
              data-testid="img-footer-logo-light"
            />
            <img
              src={logoDark}
              alt="Aspal"
              className="hidden h-8 w-auto dark:block"
              data-testid="img-footer-logo-dark"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Conectamos a las asociaciones profesionales de América Latina: formación,
              comunidad y recursos para quienes las dirigen.
            </p>
            <div className="mt-4 flex gap-1">
              {REDES.map((red) => (
                <Button
                  key={red.testid}
                  size="icon"
                  variant="ghost"
                  className="h-11 w-11"
                  asChild
                  data-testid={red.testid}
                >
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ASPAL en ${red.nombre}`}
                  >
                    <red.icono className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
              ))}
            </div>
          </motion.div>

          {columnas.map((entrada) => (
            <ColumnaNav key={entrada.testid} entrada={entrada} />
          ))}

          {/* Contacto */}
          <motion.div variants={elemento}>
            <h3
              className="font-semibold text-foreground"
              data-testid="text-footer-contact-title"
            >
              Contacto
            </h3>
            <ul className="mt-2">
              <Contacto
                icono={Mail}
                href={`mailto:${CONTACTO.correo}`}
                testid="text-contact-email"
              >
                {CONTACTO.correo}
              </Contacto>
              <Contacto
                icono={Phone}
                href={`tel:${CONTACTO.telefono.replace(/\s/g, "")}`}
                testid="text-contact-phone"
              >
                {CONTACTO.telefono}
              </Contacto>
              <Contacto icono={MapPin} testid="text-contact-address">
                {CONTACTO.ciudad}
              </Contacto>
            </ul>

            {/* El pie es el final del recorrido: quien llega hasta aquí leyendo
                merece encontrar la conversión sin tener que volver arriba. */}
            <Button variant="secondary" className="mt-4 min-h-11 w-full" asChild>
              <a
                href={URL_REGISTRO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("click_unete", { origen: "footer" })}
                data-testid="button-footer-registro"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Únete a ASPAL
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 border-t border-border pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © {new Date().getFullYear()} {NOMBRE_MARCA}. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
