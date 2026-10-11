# ADR 0004 · Admin único y MFA

Fecha: 2026-10-11. Estado: controles requeridos; proveedor/librería pendiente de revisión.

No hay auth actualmente. El panel de demostración no constituye una zona privada. No desarrollar una implementación casera de passkeys, TOTP o sesiones como sustituto de una librería revisada.

Requisitos: un administrador, passkey preferida, TOTP de respaldo, sesiones en PostgreSQL, cookie `__Host-` con Secure/HttpOnly/SameSite=Strict, rotación y expiración absoluta y por inactividad. Denegar por defecto en cada recurso y mutación; validar origen y CSRF; limitar intentos usando almacenamiento compartido. Reautenticación para exportar, borrar, revocar y cambiar contactos.

Seleccionar librería en fase 3 con licencia, mantenimiento, advisories y evidencia de revisión/auditoría comprobables. Si no existe una auditoría pública verificable, comunicar esa carencia y pedir decisión; no inventar certificaciones. Recuperación de MFA y alta del administrador deben diseñarse sin puerta trasera.

La revocación por el titular requiere verificar su identidad y autoridad sin añadir cuentas de clientes por suposición. Hasta definir ese flujo, el administrador gestiona la petición del titular con evidencia.
