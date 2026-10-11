# Primer despliegue de demostración en Vercel

Repositorio: https://github.com/PixelCraftDavid/CodexSana. El titular confirmó que tiene sesión iniciada en Vercel. No hay evidencia de un despliegue completado todavía.

Usar únicamente datos ficticios. Esta versión no tiene autenticación del administrador ni persistencia; las fichas nuevas no se resuelven desde otro dispositivo. El despliegue no habilita ventas ni tratamiento de datos reales.

## Preparación

Antes de desplegar, comprobar la corrección de PostCSS con auditoría de producción y build. Subir el commit que contiene el lockfile corregido y `vercel.json`; importar un commit anterior conserva el hallazgo.

`vercel.json` fija Next.js, instalación con `npm ci` y build con `npm run build`. La salida se detecta mediante el adaptador de Next, incluida la configuración `distDir`; no usar un preset estático ni forzar `out`. Node 24.x se declara en package.json. El build real de Vercel, incluido Sharp, sigue pendiente.

## Importación

1. En el espacio personal Hobby, abrir Add New → Project.
2. Importar PixelCraftDavid/CodexSana. Si no aparece, Configure GitHub App y autorizar solo este repositorio.
3. Nombre sugerido del proyecto: codexsana. Raíz del repositorio; framework Next.js; Node 24.x. Mantener Output Directory sin override. No se necesitan variables propias para este prototipo.
4. Tras las comprobaciones locales, pulsar Deploy y conservar la URL, el SHA del commit, los logs y la salida del build.
5. Revisar Deployment Protection: activar protección de previews con Vercel Authentication si está disponible en la cuenta. Verificar su funcionamiento; no confundirla con autenticación dentro de la app.

Las instrucciones de importación y configuración se verificaron con [Git en Vercel](https://vercel.com/docs/git) y [configuración del build](https://vercel.com/docs/builds/configure-a-build).

## Verificación después del despliegue

- Abrir dashboard, talleres y fichas de muestra desde escritorio y móvil.
- Probar descargas PNG/SVG/PDF y QR con un perfil ficticio existente. Generar el QR desde el origen desplegado; un QR generado en localhost sigue apuntando a localhost.
- Comprobar que el dominio de destino funciona desde el teléfono. Si una URL está protegida, el visitante necesitará acceso Vercel; no utilizarla para tarjetas reales de emergencia.
- Guardar evidencia del build y contar funciones efectivas del adaptador, con límite interno de 10. Las tres rutas Next dinámicas locales no prueban ese conteo.

Utilizar la dirección estable del proyecto para pruebas, evitando enlaces efímeros de un commit para tarjetas que deban durar. Dominio definitivo pendiente. No se cierra la Fase 0 sin resolver sus pendientes ni se inicia automáticamente la Fase 1.
