# ADR 0006 · Fuente oficial de exportaciones

Fecha: 2026-10-11. Estado: regla definida; generación de servidor pendiente de fase 6.

| Destino                               | Fuente                                                            |
| ------------------------------------- | ----------------------------------------------------------------- |
| PDF imprimible protegido              | Servidor, PDFKit                                                  |
| PNG de alta resolución para impresión | Servidor, Sharp                                                   |
| Preview y PNG de descarga rápida      | Canvas del navegador; no oficial para impresión                   |
| SVG descargable                       | Composición SVG compartida generada en servidor tras autorización |

Usar una sola composición tipada de tarjeta, sin duplicar campos ni reglas de desborde. Si difieren los resultados, el del servidor es la fuente oficial. Las variantes de preview se etiquetan; no exportar silenciosamente un archivo no oficial como si fuera el oficial. El QR de producción se genera en servidor, conservando la regresión de 315 casos.

La contraseña del PDF se generará en servidor con crypto seguro, nunca derivada de datos del titular. Se entregará una vez a la sesión administrativa reautenticada, sin logs ni almacenamiento permanente. La clave temporal necesariamente llega al administrador para comunicarla por separado; las claves maestras nunca lo hacen.

Verificar cifrado con `qpdf --show-encryption`, rechazo sin clave y lectura con clave. Registrar evidencia sin contraseña ni datos reales. No declarar AES-256 a partir de `pdfVersion` solamente. Actualmente PDFKit corre en navegador; no se ha migrado ni verificado con qpdf en esta fase.

Auditar cada exportación, sin incluir datos médicos en logs técnicos. Web Share futura comparte enlaces por confirmación explícita; PDF no se comparte por defecto. La nueva tarjeta no usa fotos de personas; conservar SVG originales requeridos por el diseño, salvo cambio visual solicitado por el titular. Revisar ambigüedad del encargo «solo texto, datos y QR» antes de quitar mascotas aprobadas.
