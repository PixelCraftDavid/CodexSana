# Primer intento remoto · Vercel

Fuente: log compartido por el titular el 11 de octubre de 2026. Commit: c2e7b05, rama main, repositorio PixelCraftDavid/CodexSana. No es una captura del pipeline de GitHub ni un despliegue exitoso.

- Región del build: iad1; máquina de dos cores y 8 GB.
- Vercel CLI 62.7.0, instalación mediante npm ci: 98 paquetes, cero vulnerabilidades reportadas.
- Next.js 15.5.27 compiló y generó las páginas; dos rutas de aplicación estáticas y tres dinámicas, además de /_not-found.
- Resultado final: error. El adaptador buscó /vercel/path0/.next, pero el distDir de producción es .next-production.

Corrección preparada: outputDirectory explícito .next-production en vercel.json. La comprobación del nuevo despliegue y el conteo de funciones reales siguen pendientes. El log no demuestra que se hayan probado exportaciones Sharp ni las fichas en un navegador público.

Verificación local posterior: npm run build terminó con código 0. Una comprobación de configuración confirmó que outputDirectory coincide con el distDir de producción y que el preset sigue siendo nextjs. La validación del adaptador Vercel requiere el nuevo despliegue.
