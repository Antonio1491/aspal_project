# Guía de diseño de ASPAL

Refleja lo que el código hace hoy. La versión anterior (Inter, morado,
glassmorphism) describía un sitio que ya no existe.

## Marca

- **Logotipo:** `client/src/assets/ASPAL-para fondo claro_*.png` sobre fondos
  claros; `ASPAL-para fondo oscuro_*.png` sobre `bg-noche`. Nunca el de fondo
  claro sobre fondo oscuro.
- **Isotipo** (panal de 4 hexágonos): `Aspal-Icono_*.png`. Es la silueta de
  perfil cuando falta la foto.
- **Motivo gráfico:** `HexagonNetwork` (`components/sections/CommunityGraphics.tsx`),
  semitransparente, en el hero, en la banda «Únete a la casa común» y en la Ruta
  2026–2030.
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

Montserrat 400–800 (Google Fonts, `client/index.html`). Escala:

| Nivel    | Tamaño   | Clases                                                               |
| -------- | -------- | -------------------------------------------------------------------- |
| H1       | 48–64 px | `text-5xl lg:text-6xl font-bold`                                     |
| H2       | 32–40 px | `text-3xl md:text-4xl font-bold`                                     |
| H3       | 24 px    | `text-2xl font-semibold`                                             |
| Cuerpo   | 18 px    | `text-lg` (el público tiene sesgo de edad alto)                      |
| Overline | 13 px    | `text-[13px] font-semibold uppercase tracking-wider text-miel-texto` |

## Componentes y espaciado

- Botones: primario `variant="secondary"` (miel, texto pizarra); secundario
  `variant="outline"`; sobre `bg-noche`, contorno blanco. Objetivo táctil de 44 px mínimo (`min-h-11`).
- Tarjetas: `rounded-2xl`, borde sutil y `hover-elevate`. Sin glassmorphism.
- Bandas: `py-16 md:py-24`, contenedor `max-w-7xl mx-auto px-4 md:px-8`, ritmo
  blanco → `bg-fondo-suave` → `bg-noche`.
- Iconos: Lucide, de línea, en pizarra, siempre con `aria-hidden` y junto a su
  texto. Pilares: Users (Comunidad), BookOpen (Conocimiento), Cpu (Tecnología), BarChart3 (Datos).
- Secciones sin construir: `<Proximamente />`, nunca un enlace a ningún sitio.

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
