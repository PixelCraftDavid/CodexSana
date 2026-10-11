# CodexSana · Fichas de emergencia

Aplicación visual con Next.js, React, TypeScript y Tailwind CSS. Las tarjetas se llaman **CodexSanaQR**.

## Ejecutar

```sh
npm install
npm run dev
```

Abre [el dashboard](http://127.0.0.1:3000). La navegación separa:

- **Resumen:** indicadores, gráficas, últimas fichas y datos reportados.
- **Pacientes:** registro, edición, búsqueda y clasificación por edad, sexo e información.
- **Tarjetas y QR:** personalización, revisión, descarga y compartir.
- **Estudio de diseño:** conceptos médicos y personajes originales Miso, Mochi, Nori y Dr. Capi.

Nuevos diseños: [Nori, nutria bebé](http://127.0.0.1:3000/conceptos/nutria-perla) y [Dr. Capi, capibara con bata](http://127.0.0.1:3000/conceptos/capibara-salvia). Se pueden elegir en el formulario y en el taller de tarjetas.

## Organización

```text
src/
  app/                  Rutas de Next.js y entrada de estilos
  data/                 Datos ficticios de demostración
  features/
    dashboard/          Navegación, resumen, gráficas y estado de la sesión
    patients/           Formulario, directorio, tipos y filtros
    cards/              Personalización, tarjetas imprimibles y PDF protegido
    qr/                 Matrices QR, marcos, controles y exportaciones
    designs/            Temas, ilustraciones y talleres de diseño
    emergency/          Fichas públicas y llamadas de emergencia
  shared/               Interfaz común, diálogos, estilos base y enlaces
  types/                Declaraciones de paquetes externos
docs/                   Arquitectura y funciones
scripts/                Verificaciones reproducibles
design/                 Capturas actuales y archivo de diseños anteriores
```

Cada función tiene sus componentes, modelos y estilos junto a ella. `Dashboard` compone las vistas; `useDashboard` controla la sesión. Los datos de ejemplo están separados de los tipos del paciente.

Consulta [la arquitectura y reglas de mantenimiento](docs/ARCHITECTURE.md) y [las funciones del producto](docs/FEATURES.md).

## Comprobaciones

```sh
npm run typecheck
npm run build
npm run format:check
npm run verify:structure
npm run verify:patients
npm run verify:cards
npm run verify:qr
```

`npm run format` aplica el formato uniforme. Las verificaciones de tarjetas y QR usan datos ficticios y comprueban la lectura de los códigos exportados.

## Alcance actual

Es un prototipo con información ficticia. Los pacientes y las preferencias de tarjetas viven en memoria durante la sesión. Las rutas públicas cargan los perfiles de demostración; las fichas nuevas todavía necesitan persistencia para abrirse desde otro dispositivo. El control de acceso del administrador y la base de datos son trabajo pendiente.

Las fichas y tarjetas muestran **«Datos reportados por el titular»** y **«No sustituye la valoración médica»**. El PDF admite contraseña de apertura aleatoria con AES-256; PNG, SVG y la ficha pública accesible mediante QR no tienen esa contraseña.

## Preparación de producción por fases

El encargo de producción se trabaja una fase por sesión. Consulta el [inventario de Fase 0](docs/FASE-0.md), las [decisiones de arquitectura](docs/adr/README.md), las [licencias](docs/DEPENDENCIAS.md) y la [comprobación de plataformas](docs/PLATAFORMAS.md).

El titular confirmó Hobby para demostración sin actividad comercial; dominio definitivo pendiente. El proyecto se importó en Vercel: su primer build compiló, pero el despliegue falló por el directorio de salida. Se preparó la configuración explícita `.next-production`; falta verificar el nuevo intento. No hay datos reales autorizados. El build local tiene tres rutas dinámicas Next; el conteo de funciones Vercel todavía no está comprobado. Consulta los [pasos del primer despliegue de demostración](docs/DESPLIEGUE-DEMO.md).

La nueva versión excluirá fotografías de pacientes. Su eliminación está inventariada y aún pendiente de implementación. La configuración actual del PDF solicita cifrado; falta evidencia independiente de qpdf. No se declara el prototipo seguro ni apto para datos reales.

Node: `24.x` en engines, versión local `24.21.0` en `.node-version`. Reproduce el inventario después del build con `npm run inventory:phase0`. Usa el lockfile y `npm ci` en CI. El hallazgo inicial de PostCSS se corrigió con un override acotado a 8.5.29 manteniendo Next 15; la auditoría npm de producción posterior reporta cero vulnerabilidades. Los restantes gates de producción siguen pendientes.
