# Verificaciones locales · Fase 0

Fecha: 11 de octubre de 2026. Entorno: Windows, Node 24.21.0, npm 11.19.0. Este reporte registra ejecuciones locales; no es evidencia de un pipeline ni de un despliegue en Vercel.

| Comprobación | Resultado | Evidencia observada |
| --- | --- | --- |
| `npm run build` | PASÓ, salida 0 | Build Next 15; dos rutas de aplicación estáticas y tres dinámicas. Manifiestos y BUILD_ID registrados en inventory.json. Se repitió con permiso tras un fallo del aislamiento de Windows. |
| `npm run typecheck` | PASÓ, salida 0 | TypeScript estricto, incluido el nuevo script de inventario. No incluye verificación estricta de los scripts CJS existentes. |
| `npm run verify:structure` | PASÓ, salida 0 | 90 archivos y 248 imports internos; sin módulos ausentes ni ciclos de imports de ejecución. |
| `npm run verify:patients` | PASÓ, salida 0 | Límites de edad, filtros combinados, sexo desconocido, resultados vacíos y ordenamiento sin mutación. |
| `npm run verify:cards` | PASÓ, salida 0 | Siete diseños: exportar sin QR, QR separado, reactivar QR, valores anteriores y avisos de datos extensos. |
| `npm run verify:qr` | PASÓ, salida 0 | 315 exportaciones decodificadas; temas, marcos, patrones, esquinas y reversos de tarjetas. |
| `npm run inventory:phase0` | PASÓ, salida 0 | Snapshot actualizado con el hash del lockfile final; tres rutas dinámicas de Next y conteo Vercel sin verificar. |
| `npm run format:check` | PASÓ, salida 0 | Todos los archivos incluidos usan el formato Prettier. Los archivos de evidencia están excluidos para preservar sus reportes. |
| `npm audit --omit=dev --json` | FALLÓ, salida 1 | 1 high y 1 moderate, 0 critical; PostCSS transitivo de Next. Informe JSON adjunto. No se aplicó el cambio automático a Next 16. |

La auditoría se ejecutó contra el registro oficial de npm con permiso, después de un fallo DNS del entorno aislado. El hallazgo alto bloquea el avance. La alternativa compatible con Next 15 requiere evaluar un override acotado, regenerar el lockfile y repetir auditoría y build; aún no se ha aplicado.

## Evidencia guardada

- [Inventario reproducible](inventory.json): versiones, hashes de licencias, hash del lockfile, BUILD_ID y clasificación de rutas.
- [Auditoría de dependencias de producción](npm-audit-production.json): reporte de npm, con los avisos y la propuesta automática de actualización.
- [Inventario y límites del alcance](../../FASE-0.md).

## Comprobaciones todavía no realizadas

Conteo real de funciones y build nativo de Sharp en Vercel, protección de previews aplicada, CI remoto, ZAP, gitleaks, cobertura, axe, MFA/autorización, cifrado de base de datos, verificación del PDF con qpdf, restauración y reversión. Tampoco se han creado cuentas, aceptado acuerdos de tratamiento ni autorizado datos reales.

No equiparar las tres rutas dinámicas de Next con tres funciones Vercel. Falta el artefacto del adaptador. La Fase 0 tiene pendientes y no se inicia la Fase 1.
