# ADR 0003 · PostgreSQL en Neon

Fecha: 2026-10-11. Estado: definido por el encargo; sin provisionamiento.

Usar Neon PostgreSQL y Drizzle, con migraciones revisadas y planes escritos de reversión. Región deseada: São Paulo, `aws-sa-east-1`; confirmar al crear el proyecto. Proyectos separados para producción y pruebas. Las previews ramifican únicamente datos ficticios del proyecto de pruebas.

Roles separados: aplicación DML limitado, migraciones DDL y lectura de analítica. Ningún rol operativo debe conectarse como propietario. Cifrar campos sensibles con AES-256-GCM a nivel de aplicación y claves versionadas externas a PostgreSQL. Conexión TLS con validación de certificado/hostname; verificar que el driver seleccionado soporte la política solicitada.

Modelar personas, fichas, contactos, tokens, consultas, tarjetas, entregas, consentimientos, auditoría y ventas en efectivo. No CURP por defecto ni fotos. Los registros de consulta deberán diseñarse considerando que un hash de origen puede seguir siendo un identificador seudónimo; no declararlo anónimo automáticamente.

Free no dispone de IP Allow según docs actuales. Riesgo sin aceptar; documentarlo en STRIDE antes de datos reales. Ventana de restore limitada: plan de exportación cifrada y restauración real pendiente. No usar la rama de producción en CI. [Plataformas](../PLATAFORMAS.md).
