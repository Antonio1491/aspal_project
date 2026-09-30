# Guía de diseño de ASPAL

Refleja lo que el código hace hoy. La versión anterior (Inter, morado,
glassmorphism) describía un sitio que ya no existe.

## Marca

- **Logotipo:** `client/src/assets/aspal-logo-fondo-claro.webp` sobre fondos
  claros. Para `bg-noche`, la versión de fondo oscuro; hoy ninguna página la
  usa y su original vive en `docs/marca/` (ver su README para exportarla).
  Nunca el de fondo claro sobre fondo oscuro.
- **Isotipo** (panal de 4 hexágonos): `Aspal-Icono_*.webp`. Es la silueta de
  perfil cuando falta la foto.
- **Motivo gráfico:** el hexágono del isotipo. `PatronPanal`
  (`components/layout/PatronPanal.tsx`), panal estático en miel sobre noche, en
  la columna visual del hero de la home; insignias hexagonales en el paso a
  paso del Mapa de Ruta y en las iniciales de «Voces de la red».
- **Ilustraciones:** familia plana en miel y noche con manchas azul claro
  (`client/src/assets/recurso-*.webp` y sus versiones ligeras de 480 px en
  `assets/ilustraciones/`). Una por pilar y la del webinar en Eventos. No
  mezclar con fotos dentro de la misma banda.
- **Fotos:** reales, de eventos y personas de la red. Ranuras preparadas en
  `content/institucional/inicio.ts` (`FOTO_HERO`, `TESTIMONIOS`); mientras
  estén vacías, la home no muestra huecos.
- **Nombre visible:** `NOMBRE_MARCA` de `client/src/lib/marca.ts`. No se escribe a mano.

## Color

Tokens en `client/src/index.css` (`:root`). Solo modo claro.

| Token                                     | Clase                               | Uso                                                                        |
| ----------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `--primary` pizarra `#233543`             | `bg-primary`, `text-primary`        | Títulos, botones de contorno, bandas institucionales                       |
| `--secondary` miel `#F9CC62`              | `<Button variant="secondary">`      | Únete (el único botón lleno de la cabecera), acentos, marca de ruta activa |
| `--brand-noche` `#112738` (azul del logo) | `bg-noche`, `text-noche-foreground` | Hero, banda CTA final, franja inferior del pie                             |
| `--miel-texto` `#8A6414`                  | `text-miel-texto`                   | Overlines y etiquetas sobre fondo claro                                    |
| `--fondo-suave` `#F7F8FA`                 | `bg-fondo-suave`                    | Bandas alternas                                                            |
| `--accent` `#FEF5E1`                      | `bg-accent`                         | Tarjetas destacadas                                                        |
| `--muted-foreground` `#576875`            | `text-muted-foreground`             | Texto secundario                                                           |

**Nunca** texto miel sobre blanco (1.5:1). Todo par nuevo de texto y fondo se
añade a `PARES` en `client/src/lib/tokens.test.ts`.

## Tipografía

Montserrat 400–800, servida desde el propio dominio
(`client/public/fuentes/montserrat-v31/`, fuente variable con licencia OFL;
`@font-face` y respaldo con sus medidas en `client/src/index.css`). Para
cambiar de versión, carpeta nueva (`montserrat-v32/`): se cachea un año como
inmutable. Escala:

| Nivel    | Tamaño   | Clases                                                               |
| -------- | -------- | -------------------------------------------------------------------- |
| H1       | 48–64 px | `text-5xl lg:text-6xl font-bold`                                     |
| H2       | 32–40 px | `text-3xl md:text-4xl font-bold`                                     |
| H3       | 24 px    | `text-2xl font-semibold`                                             |
| Cuerpo   | 18 px    | `text-lg` (el público tiene sesgo de edad alto)                      |
| Overline | 13 px    | `text-[13px] font-semibold uppercase tracking-wider text-miel-texto` |

## Componentes y espaciado

Catálogo vivo con demos y código: `/componentes` (fuente:
`client/src/catalogo/registro.ts`). Clases compartidas:
`client/src/lib/clases.ts`.

- Botones: primario `variant="secondary"` (miel, texto pizarra); secundario
  `variant="outline"`; sobre `bg-noche`, contorno blanco. Objetivo táctil de 44 px mínimo (`min-h-11`).
- Tarjetas: `rounded-2xl`, borde sutil y `hover-elevate`. Sin glassmorphism.
- Bandas: `py-16 md:py-24`, contenedor `max-w-7xl mx-auto px-4 md:px-8`, ritmo
  blanco → `bg-fondo-suave` → `bg-noche`.
- Iconos: Lucide, de línea, en pizarra, siempre con `aria-hidden` y junto a su
  texto. Pilares: Users (Comunidad), BookOpen (Conocimiento), Cpu (Tecnología), BarChart3 (Datos).
- Secciones sin construir: `<Proximamente />`, nunca un enlace a ningún sitio.

## Navegación

- Fuente única: `client/src/lib/navegacion.ts`. Cabecera, panel móvil, pie y
  404 leen de ahí; ningún componente declara enlaces propios.
- Cinco rubros (Acerca de · Recursos · Eventos · Membresía · Comunidad) y el
  botón Únete, el único botón lleno de la cabecera. Recursos es un mega-menú
  de cuatro grupos (Aprende · Certifícate · Participa · Conecta).
- Un destino sin página no lleva `href` y se muestra «Próximamente». Al crear
  su página, se le pone `href` en el mismo PR (el test de enlaces muertos lo
  exige). Dentro de cada lista, los vivos van arriba.
- Externos: ↗, pestaña nueva, texto `sr-only` «(se abre en otra pestaña)» y
  evento `salida_plataforma`.
- Menú completo desde `xl` (1280 px): a 1024 no cabían los cinco rubros; por debajo, panel móvil con un acordeón por rubro y Únete fijo abajo.
- Teclado en el mega-menú: flechas, Inicio y Fin (`lib/teclado.ts`); Radix da
  Enter/Espacio para abrir y Escape para cerrar.
- Pie: solo destinos vivos por columna; si un rubro no tiene ninguno, una sola
  marca «Próximamente». Sin animaciones de entrada.

## Contenido institucional

- El copy de Nosotros, ¿Qué hacemos? y Nuestro equipo vive en
  `client/src/content/institucional/` y es literal del documento «Concepto
  NOSOTROS». Cambiar un texto = editar ese módulo; las páginas no llevan copy.
- `contenido.test.ts` rechaza textos vacíos, marcadores de relleno y enlaces a
  rutas que no existen.
- Datos pendientes (año de fundación D7, fotos, LinkedIn, Consejo, logo de
  Parksys, Dossier) van como `PENDIENTE` en el módulo, nunca inventados.
- Componentes de estas páginas: `components/institucional/` (SubnavSeccion,
  PilarCard, PerfilCard, TarjetaCompromiso, RutaTimeline, MuroAliados).
- Anclas: las secciones enlazables llevan `id` y `scroll-mt-32`; `ScrollRestoration` lleva al ancla cuando la URL trae `#`.

## Movimiento

- Todo framer-motion respeta `MotionConfig reducedMotion="user"` (App.tsx).
- **En páginas nuevas se anima solo el desplazamiento (`y`), nunca la
  opacidad del contenido:** el HTML prerenderizado mostraría texto invisible a
  buscadores y a quien no ejecuta JavaScript.
- Sin sliders automáticos ni animaciones infinitas en páginas institucionales.

## Fotografía

Rostros reales de directivos latinoamericanos en eventos; retratos del equipo
con el mismo fondo y la misma luz. Sin fotos de stock ni mockups de dashboard
(esos viven solo en `/plataforma`).
