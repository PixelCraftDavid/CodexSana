# Fase 0 · Inventario y decisiones

Revisión: 11 de octubre de 2026. Alcance: inventario local y decisiones; no implementación de las fases 1–10. El diseño aprobado se conserva.

## Decisiones del titular

- Vercel Hobby para pruebas, confirmado en el chat el 11 de octubre de 2026. No habilita actividad comercial. Antes de vender tarjetas, confirmar un plan comercial.
- Dominio definitivo pendiente por decisión del titular. Las primeras pruebas usarán un dominio del proyecto en Vercel. El primer intento de despliegue (commit c2e7b05) compiló, pero falló al buscar la salida `.next`; se preparó la corrección a `.next-production`. Todavía no hay despliegue exitoso ni dominio comprobado.
- Datos reales bloqueados hasta completar controles, revisión de privacidad, acuerdos con proveedores y auditoría. La aceptación de esos acuerdos por el titular sigue pendiente; no se ha realizado en su nombre.

## Rutas y exposición actual

| Ruta                    | Función                                               | Build local de Next.js |
| ----------------------- | ----------------------------------------------------- | ---------------------- |
| `/`                     | Panel de demostración; estado de pacientes en memoria | Estática               |
| `/conceptos`            | Entrada al estudio de diseños                         | Estática               |
| `/conceptos/[concept]`  | Talleres y selección por query `paciente`             | Dinámica               |
| `/ficha/[id]`           | Ficha base de demostración                            | Dinámica               |
| `/ficha/[id]/[concept]` | Ficha de demostración con tema                        | Dinámica               |

La carpeta es realmente `src/app/ficha/[id]/[concept]`: tres carpetas separadas. No hay nombre con una barra invertida literal que corregir. Next también genera `/_not-found`, infraestructura del framework, no una API de negocio.

**Conteo comprobado: 3 rutas dinámicas Next.js, 2 rutas de aplicación estáticas, 0 Route Handlers y 0 archivos de Server Actions. El número de funciones Vercel aún no está verificado.** No existe `.vercel/output` ni proyecto Vercel vinculado. Las rutas no se equiparan a funciones: el adaptador puede agruparlas. El gate futuro cuenta artefactos de funciones reales y falla si falta el artefacto o supera 10. No reportar cero ante un artefacto ausente.

No se introduce `generateStaticParams` para fichas futuras: los tokens revocables y datos sensibles necesitan resolución vigente, `no-store` y autorización; no deben producir páginas médicas estáticas. Los talleres podrán evaluarse por separado sin datos reales.

## Superficies que manejan datos

| Módulo / archivos principales                       | Datos y responsabilidad actuales                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/data/demo-patients.ts`, `demo-pediatric.ts`    | Seis perfiles generales y dos pediátricos ficticios; incluidos en la aplicación                            |
| `patients/model/patient.ts`, `read-patient-form.ts` | Nombre, edad, sexo opcional, sangre, alergias, padecimientos, medicamentos, contactos, foto y preferencias |
| `patients/components/patient-form*.tsx`             | Captura y validación nativa de navegador; no validación en servidor                                        |
| `dashboard/model/use-dashboard.ts`                  | Crear, editar, filtrar, compartir y personalizar en memoria; IDs `VT-…` secuenciales                       |
| `emergency/components/*.tsx`, `app/ficha/**`        | Presentación pública, llamadas `tel:` y compartir enlaces; perfiles de muestra, sin autorización           |
| `cards/components/*`, `cards/lib/*`                 | Taller, revisión, archivos con datos, PDF y contraseña temporal                                            |
| `qr/lib/*`, `qr/components/*`                       | Enlace en la matriz, decoración y exportaciones; texto personalizado escapado                              |
| `shared/ui/ui.tsx`, `patient-url.ts`                | Avatar, iniciales, foto si existe y enlaces derivados del origen del navegador                             |
| `designs/*`                                         | Temas, ilustraciones SVG propias y laboratorios; no diagnósticos                                           |

El inventario completo de archivos por módulo, licencias y huellas de licencia está en [inventory.json](evidence/phase0/inventory.json). No se imprimen valores de variables de entorno ni datos médicos en ese inventario.

### Fotos: restos que deben eliminarse

1. `patients/model/patient.ts`: propiedad `photo`.
2. `patients/components/patient-form-fields.tsx`: `PhotoUpload`, entrada de archivos, MIME/tamaño, FileReader y preview.
3. `patients/components/patient-form.tsx`: estado, errores, importación y montaje de PhotoUpload.
4. `patients/lib/read-patient-form.ts`: contexto y copia de la foto al registro.
5. `shared/ui/ui.tsx`: rama `<img src={patient.photo}>`.
6. `patients/styles/patient-form.css` y `dashboard/styles/medical-motion.css`: estilos de carga y preview.

**La eliminación aún no está implementada.** Esta fase inventaría lo que se retirará al implementar la nueva versión sin fotos. No llamar a la versión actual conforme con esa restricción. Mantener iniciales, SVG propios y acceso a los datos esenciales; no eliminar los FileReader/canvas usados para exportar archivos, que no son fotografías de pacientes.

### Pagos

No se encontró integración de Stripe, PayPal, Mercado Pago, pasarela ni checkout en `src` o dependencias directas. No hubo nada que eliminar. Los ingresos actuales son ficticios. La futura entidad ventas registrará efectivo, folio, fecha, monto, concepto y cliente; no procesa tarjetas.

## Variables y almacenamiento

| Variable / almacenamiento | Estado                                                                           |
| ------------------------- | -------------------------------------------------------------------------------- |
| `NODE_ENV`                | Framework; selecciona `.next` o `.next-production`                               |
| `QR_SHARP_MODULE`         | Override de módulo solo en el script de verificación; no se usa en la aplicación |
| `NEXT_PUBLIC_*` propios   | Ninguno localizado en el código actual                                           |
| `.env*` de proyecto       | Ningún archivo encontrado; el patrón está excluido de Git                        |
| `localStorage`            | Solo preferencia de animación `vitalia-motion-paused`                            |
| Pacientes y fotos         | Estado React en memoria; sin base de datos                                       |

En fases siguientes, definir por entorno los nombres de variables para conexiones de roles de aplicación/migración/lectura, versión de claves de cifrado, origen público confirmado y autenticación. No crear secretos en archivos de ejemplo ni elegir una librería de auth sin revisión. Los tokens públicos viajan por diseño en el QR; credenciales administrativas y claves nunca llegan al cliente.

## Dependencias y calidad

[DEPENDENCIAS.md](DEPENDENCIAS.md) registra las 17 dependencias directas, versiones instaladas, alcance y licencias. `package-lock.json` existe. No se añadió ninguna dependencia externa. Node se fija a `24.x` en engines; `.node-version` registra `24.21.0`, versión usada localmente. Vercel soporta Node 24, pero su build nativo con Sharp no está validado todavía.

El nuevo `scripts/inventory-phase0.ts` es TypeScript y entra en el typecheck estricto. Los cuatro scripts `.cjs` existentes todavía requieren migración o JSDoc con `checkJs`; no afirmar que el gate sin `any` cubre esos scripts. No hay ESLint, commitlint, CI, SAST, ZAP, SBOM ni cobertura automática configurados aún. El snapshot enumera archivos de más de 300 líneas; los límites de función y complejidad todavía no están medidos por lint.

En el inventario inicial no existía `.git`. El titular inicializó el repositorio y configuró el remoto `PixelCraftDavid/CodexSana`; ahora la rama local es `main`. El log del primer intento Vercel confirma la importación de main y la compilación, pero termina con error de directorio de salida. Esto no demuestra protección de ramas, escaneo de historial ni CI remoto en verde. [Evidencia del intento remoto](evidence/phase0/vercel-build-c2e7b05.md).

## Evidencia y pendientes

- Build Next local: terminó con código 0; manifiestos y BUILD_ID usados por el inventario. El aislamiento de Windows dio acceso denegado; se repitió el mismo build con permiso y funcionó.
- Pruebas, auditoría y sus resultados: [reporte de verificaciones](evidence/phase0/VERIFICACIONES.md).
- Conteo Vercel, protección realmente activada en la cuenta y build de Vercel: pendientes de conexión y artefactos reales; disponibilidad documentada no equivale a configuración aplicada.
- Región/roles/rama y restauración Neon: pendientes de crear y validar en la fase 2. No se aceptó ningún riesgo de infraestructura en nombre del titular.
- PDF: la configuración solicita cifrado; verificación independiente con qpdf pendiente de fase 6.
- Revisiones legal y externa de seguridad: pendientes. No se declara apto para datos reales.

## Plan de fases y condición de avance

| Fase | Entrega                        | Evidencia requerida                                            |
| ---- | ------------------------------ | -------------------------------------------------------------- |
| 0    | Inventario, licencias y ADRs   | Build local y pendientes explícitos de proveedor               |
| 1    | STRIDE y casos de abuso        | Controles trazables y riesgos revisados por el titular         |
| 2    | Neon, Drizzle, roles y cifrado | Integración, migración/reversión y restauración probadas       |
| 3    | Admin único, MFA y sesiones    | Pruebas de autorización, CSRF y límites compartidos            |
| 4    | Contratos y casos de uso       | Validación en servidor y denegación por recurso                |
| 5    | `/e/[token]`, revocación y QR  | Cabeceras, revocación y regresión QR                           |
| 6    | Exportaciones oficiales        | qpdf, auditoría de exportación y lectura QR                    |
| 7    | Frontend conservado, sin fotos | CSP y axe; fotos ausentes de captura/modelos/vistas            |
| 8    | Suite completa                 | Cobertura ≥85 % del dominio/servicios y controles por endpoint |
| 9    | CI/CD y entornos               | Gates, conteo real ≤10, scans y aprobación de producción       |
| 10   | Auditoría                      | Reportes ZAP, revisión externa y excepciones vigentes          |

No avanzar automáticamente a otra fase. Los hallazgos rojos se resuelven en la fase actual; los checks no ejecutables se mantienen pendientes, nunca se sustituyen por éxito. La validación de conteo Vercel falta para cerrar íntegramente la Fase 0 según el encargo.
