# ADR 0001 · Stack y runtime

Fecha: 2026-10-11. Estado: decidido por el encargo; implementación parcial.

Conservar TypeScript, Next.js 15, React 19, Tailwind CSS 4, CSS propio, SVG propio, qrcode, lucide-react, PDFKit, Canvas y Web Share. Sharp y jsQR mantienen las verificaciones. No usar fotos de personas en la nueva versión.

Node: `24.x` en engines; `.node-version` registra 24.21.0, runtime local. Vercel soporta la familia 24, pero su build sigue pendiente. CI usará la versión fijada y `npm ci` con lockfile. El pin local no garantiza el parche que usa Vercel.

El script nuevo de inventario es TS estricto. Migrar los `.cjs` existentes o tiparlos con JSDoc y `checkJs`. Añadir ESLint de seguridad, commitlint y herramientas de gates después de revisar cada nueva dependencia. Centralizar tokens en `src/design/tokens` sin cambiar el aspecto aprobado. Aún existen colores SVG/CSS dispersos y no hay gate de lint aplicado.

Mover Sharp a dependencia de producción cuando existan exportaciones del servidor. Drizzle, Zod, auth y herramientas de pruebas están previstas en el encargo, pero no se instalaron en Fase 0.

Licencias y huellas: [inventario](../evidence/phase0/inventory.json). No declarar ausencia de vulnerabilidades a partir de una licencia permisiva.
