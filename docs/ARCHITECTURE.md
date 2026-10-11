# Arquitectura de CodexSana

## Responsabilidades

| Ubicación                                   | Responsabilidad                                             | Modificar aquí cuando…                           |
| ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `src/app`                                   | Rutas y composición de Next.js                              | cambie una URL o la metadata                     |
| `features/dashboard/components`             | Shell, resumen, gráficas y diálogos del panel               | cambie la navegación o la distribución del panel |
| `features/dashboard/model/use-dashboard.ts` | Estado de la sesión y acciones del administrador            | cambie el flujo de registro, edición o entrega   |
| `features/patients/components`              | Campos del formulario, filtros y directorio                 | cambie la captura o presentación de pacientes    |
| `features/patients/model`                   | Tipos, clasificación y reglas de filtrado                   | cambien rangos o criterios administrativos       |
| `features/cards/components`                 | Taller, vista de ambos lados y descarga                     | cambie la experiencia de personalizar o imprimir |
| `features/cards/lib`                        | SVG imprimible y cifrado del PDF                            | cambie el archivo exportado                      |
| `features/qr/lib`                           | Matriz escaneable y decoración externa                      | cambien módulos, ojos, marcos o tintas           |
| `features/designs`                          | Temas e ilustraciones originales                            | se añada un diseño                               |
| `features/emergency`                        | Información pública prioritaria y llamadas                  | cambie la ficha que se abre en una emergencia    |
| `src/shared`                                | Marca, avatar, diálogo accesible, enlaces y estilos comunes | cambie una pieza usada por varias funciones      |
| `src/data`                                  | Perfiles ficticios                                          | cambien ejemplos de demostración                 |

## Flujo del dashboard

`app/page.tsx` monta `Dashboard`. El hook `useDashboard` mantiene los pacientes y controla las acciones. Los componentes de vista reciben datos y callbacks explícitos.

El resumen no monta el directorio ni una ficha telefónica persistente. Un clic en una gráfica abre Pacientes con el filtro correspondiente. La ficha pública se abre en un diálogo; Tarjetas y QR ofrece la entrega en su propio espacio.

El formulario se divide en campos de identidad, foto, información médica y contactos. `read-patient-form.ts` transforma el formulario nativo en un paciente; el taller edita un borrador y solo aplica las preferencias cuando se confirma.

## Reglas para mantener el orden

- Conserva los nombres de archivos en `kebab-case` y los componentes en `PascalCase`.
- Usa rutas relativas dentro de una función y `@/…` para cruzar a otra función.
- Importa tipos desde `model`; los modelos no deben depender de datos de demostración ni de componentes.
- Mantén `app` centrado en rutas. Añade la lógica y los componentes en su función correspondiente.
- No dupliques la generación del QR: usa `createPatientQR`. La opción sin QR pertenece a la tarjeta impresa y no elimina el acceso a un QR independiente.
- Mantén la decoración fuera del QR y conserva la zona blanca de lectura.
- Los estilos se importan una sola vez desde `app/globals.css`. El orden está explícito y los estilos viven junto a cada función.
- Respeta movimiento reducido, foco de teclado, Escape y devolución del foco en los diálogos.
- Ejecuta `npm run format` y las comprobaciones apropiadas antes de entregar cambios.

## Evidencia visual

- `design/dashboard`: capturas del dashboard actual.
- `design/cards`: muestras imprimibles generadas por `verify:cards`.
- `design/qr`: evidencia de códigos QR.
- `design/archive`: capturas e imágenes conservadas de las versiones anteriores.

Las herramientas temporales usadas para reorganizar el proyecto no forman parte del código de la aplicación.

## Límite de la sesión

No hay autenticación ni base de datos. `useDashboard` almacena las modificaciones en memoria. El único dato guardado en `localStorage` es la preferencia opcional de movimiento; su clave anterior se conserva por compatibilidad. Las rutas y los identificadores existentes se mantienen para conservar los enlaces de demostración.
