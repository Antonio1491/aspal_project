# Marca: originales

Originales en alta de los logotipos de ASPAL y de sus aliados. **No se sirven en el sitio**:
viven aquí para quien necesite exportar otra versión.

- `aspal-logo-fondo-claro.png` (1500×429): sobre fondos claros. El sitio usa
  `client/src/assets/aspal-logo-fondo-claro.webp`, derivado de este a 420 px de
  ancho (tres veces el tamaño máximo al que se pinta).
- `aspal-logo-fondo-oscuro.png` (1500×429): sobre `bg-noche`. Hoy ninguna
  página lo usa. Si hace falta, se exporta a WebP igual que el claro:

  ```bash
  node -e "require('sharp')('docs/marca/aspal-logo-fondo-oscuro.png').resize({width:420}).webp({nearLossless:true,quality:60}).toFile('client/src/assets/aspal-logo-fondo-oscuro.webp')"
  ```

## Aliados

- `parksys-logo-fondo-oscuro.png` (1059×335): el original que entregó
  Parksys, con el texto en blanco. Sobre fondo claro el texto desaparece.
- `parksys-logo-fondo-claro.png`: derivado del anterior pasando el blanco a
  noche (`#112738`); la «P» verde queda intacta. Lo decidió ASPAL a falta de
  la versión oficial para fondo claro: si Parksys la entrega, sustituye a
  esta. El sitio usa `client/src/assets/logo-parksys-fondo-claro.webp`
  (760 px de ancho, tres veces el tamaño máximo al que se pinta):

  ```bash
  node -e "require('sharp')('docs/marca/parksys-logo-fondo-claro.png').resize({width:760}).webp({nearLossless:true,quality:60}).toFile('client/src/assets/logo-parksys-fondo-claro.webp')"
  ```
