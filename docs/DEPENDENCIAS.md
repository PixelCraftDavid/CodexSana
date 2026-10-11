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

La auditoría inicial detectó PostCSS 8.4.31 transitivo de Next.js, con severidad alta. Se conserva el [reporte inicial](evidence/phase0/npm-audit-production.json). No se ejecutó npm audit fix ni se cambió Next 15.

Se aplicó un override exclusivo de PostCSS bajo Next a 8.5.29, versión verificada en el registro oficial: licencia MIT e integridad coincidente con el lockfile. La dependencia de Tailwind ya estaba en esa versión. El lockfile necesitó corregir la resolución antigua porque npm install/update la conservaban; después `npm ci --ignore-scripts` pasó y `npm ls postcss` confirmó ambas copias en 8.5.29. La [auditoría posterior](evidence/phase0/npm-audit-production-postcss.json) terminó con código 0 y cero vulnerabilidades reportadas. Esto no sustituye OSV, ZAP ni una auditoría externa. La compatibilidad se comprueba mediante build y regresión QR en [verificaciones](evidence/phase0/VERIFICACIONES.md). [Aviso del mantenedor](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [releases oficiales](https://github.com/postcss/postcss/releases).

La lista directa no incluye todavía Drizzle, Zod, ESLint, auth, Vitest, Playwright ni herramientas de CI. Cada incorporación requiere revisión de licencia, mantenimiento y advisories conforme al encargo.
