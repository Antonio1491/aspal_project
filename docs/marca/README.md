# Marca: originales

Originales en alta de los logotipos de ASPAL. **No se sirven en el sitio**:
viven aquí para quien necesite exportar otra versión.

- `aspal-logo-fondo-claro.png` (1500×429): sobre fondos claros. El sitio usa
  `client/src/assets/aspal-logo-fondo-claro.webp`, derivado de este a 420 px de
  ancho (tres veces el tamaño máximo al que se pinta).
- `aspal-logo-fondo-oscuro.png` (1500×429): sobre `bg-noche`. Hoy ninguna
  página lo usa. Si hace falta, se exporta a WebP igual que el claro:

  ```bash
  node -e "require('sharp')('docs/marca/aspal-logo-fondo-oscuro.png').resize({width:420}).webp({nearLossless:true,quality:60}).toFile('client/src/assets/aspal-logo-fondo-oscuro.webp')"
  ```
