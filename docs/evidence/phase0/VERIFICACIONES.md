# Verificaciones locales · Fase 0

Fecha: 11 de octubre de 2026. Entorno: Windows, Node 24.21.0, npm 11.19.0. Este reporte registra ejecuciones locales; no es evidencia de un pipeline ni de un despliegue en Vercel.

| Comprobación | Resultado | Evidencia observada |
| --- | --- | --- |
| `npm run build` | PASÓ, salida 0 | Build Next 15, repetido tras instalar PostCSS 8.5.29; dos rutas de aplicación estáticas y tres dinámicas. Manifiestos y BUILD_ID registrados en inventory.json. Se ejecutó con permiso por el fallo del aislamiento de Windows. |
| `npm run typecheck` | PASÓ, salida 0 | TypeScript estricto, incluido el nuevo script de inventario. No incluye verificación estricta de los scripts CJS existentes. |
| `npm run verify:structure` | PASÓ, salida 0 | 90 archivos y 248 imports internos; sin módulos ausentes ni ciclos de imports de ejecución. |
| `npm run verify:patients` | PASÓ, salida 0 | Límites de edad, filtros combinados, sexo desconocido, resultados vacíos y ordenamiento sin mutación. |
| `npm run verify:cards` | PASÓ, salida 0 | Siete diseños: exportar sin QR, QR separado, reactivar QR, valores anteriores y avisos de datos extensos. |
| `npm run verify:qr` | PASÓ, salida 0 | 315 exportaciones decodificadas; temas, marcos, patrones, esquinas y reversos de tarjetas. |
| `npm run inventory:phase0` | PASÓ, salida 0 | Snapshot actualizado con el hash del lockfile final; tres rutas dinámicas de Next y conteo Vercel sin verificar. |
| `npm run format:check` | PASÓ, salida 0 | Todos los archivos incluidos usan el formato Prettier. Los archivos de evidencia están excluidos para preservar sus reportes. |
| `npm audit --omit=dev --json` inicial | FALLÓ, salida 1 | 1 high y 1 moderate, 0 critical; PostCSS transitivo de Next. Se conserva el informe inicial. |
| `npm ci --ignore-scripts` con lockfile corregido | PASÓ, salida 0 | Instalación limpia: 97 paquetes. Se detuvo el servidor local para liberar un archivo nativo bloqueado por Windows. |
| `npm ls postcss` posterior | PASÓ, salida 0 | Next 15.5.27 y Tailwind resuelven PostCSS 8.5.29; override aplicado. |
| `npm audit --omit=dev --json` posterior | PASÓ, salida 0 | Cero vulnerabilidades reportadas, incluidos high y critical. No es una auditoría externa ni sustituye OSV/ZAP. |

Las auditorías se ejecutaron contra el registro oficial de npm con permiso, tras fallos DNS del entorno aislado. El hallazgo inicial se corrigió con un override acotado y lockfile para PostCSS 8.5.29, manteniendo Next 15. npm install/update conservaban la resolución antigua: se corrigió el registro del lockfile con los metadatos y la integridad verificados en npm, y se comprobó mediante instalación limpia. Typecheck, estructura, build y las 315 exportaciones QR se repitieron y pasaron después de la instalación. No se sustituye el build remoto por el local.

## Evidencia guardada

- [Inventario reproducible](inventory.json): versiones, hashes de licencias, hash del lockfile, BUILD_ID y clasificación de rutas.
- [Auditoría de dependencias de producción](npm-audit-production.json): reporte de npm, con los avisos y la propuesta automática de actualización.
- [Auditoría posterior a la corrección](npm-audit-production-postcss.json): salida 0 y cero vulnerabilidades reportadas.
- [Inventario y límites del alcance](../../FASE-0.md).

## Comprobaciones todavía no realizadas

Conteo real de funciones y build nativo de Sharp en Vercel, protección de previews aplicada, CI remoto, ZAP, gitleaks, cobertura, axe, MFA/autorización, cifrado de base de datos, verificación del PDF con qpdf, restauración y reversión. Tampoco se han creado cuentas, aceptado acuerdos de tratamiento ni autorizado datos reales.

No equiparar las tres rutas dinámicas de Next con tres funciones Vercel. Falta el artefacto del adaptador. La Fase 0 tiene pendientes y no se inicia la Fase 1.
