# Plataformas · verificación de Fase 0

Consultado el 11 de octubre de 2026. Estas fuentes describen productos; no prueban la configuración ni los contratos de la cuenta del titular.

## Vercel

- Hobby queda para demostración personal no comercial, confirmado por el titular. La venta de tarjetas necesita un plan comercial antes de empezar. [Hobby](https://vercel.com/docs/plans/hobby).
- La tabla actual publica funciones por despliegue como dependientes del framework. No se trata «12» como límite universal de Next.js. El proyecto mantiene **≤10** como gate interno solicitado. Rutas Next y funciones físicas no son equivalentes. [Límites](https://vercel.com/docs/limits).
- Hobby dispone de Vercel Authentication; la protección Standard está disponible en todos los planes. Password Protection no está disponible en Hobby. Configuración efectiva pendiente; las previews solo usarán información ficticia. [Deployment Protection](https://vercel.com/docs/deployment-protection).
- Node 24 está soportado. El entorno local usa 24.21.0; fijar la misma versión de CI y comprobar la variante 24.x gestionada por Vercel con Sharp antes de certificar el build. [Node](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
- Los logs de ejecución en Hobby se retienen una hora según la documentación actual. No equivalen a auditoría durable de la aplicación. Logs de build tienen otra retención; ninguno debe contener secretos o datos médicos. [Límites y logs](https://vercel.com/docs/limits).
- Se usará HTTPS administrado por la plataforma; no se abre un puerto público propio. Dominio pendiente y proyecto aún sin vincular. No se ha confirmado consumo mensual de la cuenta.
- Existe un DPA publicado. Su revisión y aplicabilidad contractual son decisión del titular y de su asesor; no se concluye ausencia de DPA solo por estar en Hobby, ni aceptación por consultar el enlace. [DPA](https://vercel.com/legal/dpa).

## Neon

Las páginas de docs respondieron con error al lector; se revisó el repositorio oficial `neondatabase/website` como fuente primaria alternativa.

- São Paulo figura como región PostgreSQL `aws-sa-east-1`. Selección real pendiente de fase 2; no se elegirá otra región silenciosamente. [Regiones oficiales](https://github.com/neondatabase/website/blob/main/content/docs/introduction/regions.md).
- Free tiene 10 ramas por proyecto, 1 GB de PostgreSQL por proyecto, historia de restauración de 6 horas y un snapshot manual; no ofrece backups programados. Esto exige plan de respaldo y prueba de restauración antes de datos reales. [Planes oficiales](https://github.com/neondatabase/website/blob/main/content/docs/introduction/plans.md).
- IP Allow requiere Scale. No se simula en Free. TLS con validación completa, roles mínimos, credenciales de alta entropía y rotación son requisitos por implementar; no se consideran compensación ya aplicada. Riesgo para modelar y aceptar expresamente en fase 1. [IP Allow](https://github.com/neondatabase/website/blob/main/content/docs/introduction/ip-allow.md).
- Los términos vigentes remiten al acuerdo Databricks y modifican disposiciones del DPA. No se conserva la afirmación absoluta «Free no tiene DPA»: hay que revisar el contrato aplicable y documentar la aceptación del titular antes de datos reales. [Términos](https://neon.com/platform-terms).
- Desarrollo/previews y producción estarán en proyectos separados. Una preview creará una rama efímera **del proyecto de pruebas con datos ficticios**, nunca de producción ni de una rama con datos reales. Las ramas comparten infraestructura del proyecto y no sustituyen aislamiento de credenciales.

## Límites de esta comprobación

No hay cuenta o proyecto vinculado verificable en este workspace. No se crearon cuentas, aceptaron términos, contrataron planes, desplegaron previews, crearon bases ni probaron restauraciones. Las cifras de proveedor deben revisarse de nuevo al provisionar y antes de actividad comercial.
