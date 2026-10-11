# Dependencias directas y licencias

Inventario local del 11 de octubre de 2026. Versiones instaladas contrastadas con package-lock.json; archivos de licencia localizados y SHA-256 registrados en [evidencia](evidence/phase0/inventory.json). No equivale a revisión jurídica ni auditoría de seguridad.

| Dependencia          | Versión instalada | Uso        | Licencia   |
| -------------------- | ----------------- | ---------- | ---------- |
| lucide-react         | 0.468.0           | Producción | ISC        |
| next                 | 15.5.27           | Producción | MIT        |
| pdfkit               | 0.20.2            | Producción | MIT        |
| qrcode               | 1.5.4             | Producción | MIT        |
| react                | 19.3.0            | Producción | MIT        |
| react-dom            | 19.3.0            | Producción | MIT        |
| @tailwindcss/postcss | 4.3.3             | Desarrollo | MIT        |
| @types/node          | 22.20.5           | Desarrollo | MIT        |
| @types/pdfkit        | 0.17.6            | Desarrollo | MIT        |
| @types/qrcode        | 1.5.6             | Desarrollo | MIT        |
| @types/react         | 19.3.0            | Desarrollo | MIT        |
| @types/react-dom     | 19.3.0            | Desarrollo | MIT        |
| jsqr                 | 1.4.0             | Desarrollo | Apache-2.0 |
| prettier             | 3.9.10            | Desarrollo | MIT        |
| sharp                | 0.35.5            | Desarrollo | Apache-2.0 |
| tailwindcss          | 4.3.3             | Desarrollo | MIT        |
| typescript           | 5.9.3             | Desarrollo | Apache-2.0 |

No se instalaron herramientas nuevas en esta fase. Los paquetes indicados como desarrollo siguen así en el manifiesto: Sharp tendrá que pasar a producción cuando se use en el servidor. Conservar licencias y avisos al distribuir; revisar también dependencias transitivas y artefactos del bundle en CI.

La auditoría npm de producción detecta PostCSS transitivo de Next.js. Next fija 8.4.31; la auditoría agrupa cuatro avisos y reporta severidad alta. El fix automático propone Next 16, incompatible con el stack solicitado. No se ejecutó npm audit fix ni se cambió Next.

Alternativa a evaluar dentro de Next 15: override acotado de PostCSS a una versión parcheada (el aviso GHSA-fxqj-rqcc-2cmp indica 8.5.23). Antes de aplicarlo, revisar licencia MIT y releases oficiales, regenerar el lockfile, probar build Next/Tailwind y repetir npm audit. No se considera resuelto sin esas pruebas. [Aviso del mantenedor](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).

La lista directa no incluye todavía Drizzle, Zod, ESLint, auth, Vitest, Playwright ni herramientas de CI. Cada incorporación requiere revisión de licencia, mantenimiento y advisories conforme al encargo.
