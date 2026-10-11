# ADR 0005 · Acceso público por token revocable

Fecha: 2026-10-11. Estado: definido por el encargo; todavía hay IDs secuenciales públicos.

Ruta prevista: `/e/[token]`. Generar 32 bytes aleatorios (256 bits) en servidor, codificar como base64url y guardar únicamente SHA-256 en PostgreSQL. El ID administrativo no formará parte del enlace público. Revocar y reemplazar con efecto inmediato. Inexistente y revocado reciben respuesta equivalente.

El QR contiene solo el enlace. El token es una credencial de acceso por posesión: aparece necesariamente en el QR y en la barra de direcciones. La prohibición de secretos en cliente se aplica a claves maestras, credenciales administrativas y tokens de proveedores; no se puede ocultar al lector el token público que debe utilizar. Protegerlo de logs, analítica, referrers y cachés, con `no-store`, `noindex` y `no-referrer`.

Guardar solo hash impide reconstruir un enlace para reimpresión tras perder el original. Mantener el token únicamente en memoria durante su creación; una reemisión posterior rota el token y advierte que los QR anteriores quedan inválidos. No almacenar el token en claro para facilitar reimpresión. El flujo de entrega/rotación debe verificarse en fase 5.

El titular decide los datos públicos mediante consentimiento registrado. Un token impredecible limita enumeración, pero no vuelve privada una ficha cuyo enlace se comparte.
