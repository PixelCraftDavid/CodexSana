# CodexSana · Fichas de emergencia

La aplicación se llama **CodexSana** y las tarjetas **CodexSanaQR**. Las fichas públicas, tarjetas y exportaciones aclaran: «Datos reportados por el titular» y «No sustituye la valoración médica»; en fichas infantiles se menciona también al representante. Estos avisos describen el alcance del producto; no garantizan exención de responsabilidad legal.

## PDF protegido para descargar y compartir

En «Descargar tarjeta», selecciona PDF, copia y conserva la contraseña, descarga el archivo y pulsa «Compartir PDF protegido». El archivo incluye frente y reverso con QR, guías de corte y caras de 86 × 54 mm en A4. La Web Share API comparte el archivo en navegadores compatibles; si no está disponible, se indica descargarlo y adjuntarlo manualmente. La preparación ocurre antes del toque de compartir para conservar la activación requerida por el navegador.

`src/features/cards/lib/protected-pdf.ts` genera el PDF íntegramente en el navegador mediante PDFKit, con contraseña de apertura y cifrado AES-256 (`1.7ext3`). La contraseña usa `crypto.getRandomValues`: 24 caracteres independientes de un alfabeto de 64 símbolos, separados en cuatro grupos, sin nombre ni edad. Una clave de propietario distinta se genera para cada archivo. La contraseña solo vive en la ventana de exportación y no se incluye en el PDF ni en el mensaje de compartir. Cambiarla invalida el archivo preparado; debe descargarse de nuevo. Conserva la clave antes de cerrar la ventana y envíala por separado.

La protección corresponde al PDF: el QR y su ficha pública siguen accesibles sin contraseña para emergencias. PNG, SVG y la impresión directa no tienen contraseña. Los datos y las fichas nuevas siguen siendo temporales, como el resto del prototipo; el cambio no añade autenticación ni persistencia.

Primera entrega enfocada en **diseño y estructura visual**, realizada con Next.js (App Router), React, TypeScript y Tailwind CSS 4.

## Ver el diseño

```sh
npm install
npm run dev
```

- Panel: http://127.0.0.1:3000
- Ficha pública de muestra: http://127.0.0.1:3000/ficha/VT-001
- Navegación: Resumen, Pacientes y Tarjetas y QR.
- Concepto 01, Anatomical Dark: http://127.0.0.1:3000/conceptos/anatomico
- Concepto 02, Clinical: http://127.0.0.1:3000/conceptos/clinico
- Fichas públicas de los conceptos: `/ficha/VT-001/anatomico` y `/ficha/VT-001/clinico`.

## Estructura del proyecto

Consulta [ARCHITECTURE.md](ARCHITECTURE.md) para las responsabilidades de cada módulo. El panel separa Resumen, Pacientes y Tarjetas y QR. Las fichas se abren bajo demanda.

## Dirección de diseño

Marfil `#f7f8f5`, verde profundo `#274e41` y coral `#e56b51`. Tarjetas suaves, bordes de un píxel, ausencia de degradados, ritmo espacial de 8/16/24/32 px y tipografía con jerarquía clara. Las iniciales permiten mostrar pacientes sin depender de fotografías externas.

La ficha pública pone sangre y alergias antes de la identidad. Sigue con contactos y botones `tel:`, padecimientos y medicamentos. No aporta diagnósticos ni recomendaciones. El mismo componente se utiliza en la pantalla pública y dentro del teléfono de vista previa.

Las entradas usan `cubic-bezier(.22,1,.36,1)`, los botones responden al presionar con `scale(.97)` y el formulario entra lateralmente. `prefers-reduced-motion` reduce el movimiento. Los diálogos permiten Escape, contienen el foco y devuelven el foco al control de origen. Los formularios tienen etiquetas visibles y validación básica.

### Movimiento e identidad médica

`src/features/dashboard/components/medical-motion.tsx` incluye el corazón ilustrado en SVG, doble latido, flujo arterial, trazo de pulso y contadores. `src/features/dashboard/styles/medical-motion.css` define los movimientos y sus estados. No hay librerías nuevas de animación ni mediciones clínicas simuladas.

El dashboard separa el resumen ejecutivo y las gráficas, el directorio de pacientes y la biblioteca de tarjetas y QR. Las fichas y los formularios se abren bajo demanda. Incluye categorías Todos, Alergias y Padecimientos, accesos desde los contadores y orden alfabético. Las cifras corresponden a datos registrados, sin asignar niveles de gravedad médica.

Las gráficas muestran ingresos diarios ficticios, etapas de vida y sexo registrado. Los rangos administrativos son: niños 0–11, adolescentes 12–17, jóvenes 18–29, adultos 30–59 y adultos mayores desde 60 años. Cada categoría permite filtrar la tabla, combinando edad, sexo, búsqueda y datos clínicos. Las categorías vacías se muestran con cero.

El sexo es opcional y se captura durante el registro o la edición: femenino, masculino, intersexual o no registrado. Los seis perfiles originales no contienen este dato y se muestran como no registrados; no se deduce de sus nombres. Modificar edad o sexo recalcula las gráficas y filtros inmediatamente.

El botón superior pausa las animaciones y guarda solo esa preferencia en el navegador. Las preferencias de movimiento reducido eliminan las animaciones. La ficha de emergencia conserva los datos esenciales visibles inmediatamente; su pulso decorativo aparece una vez y los botones para llamar se animan al interactuar. Los diálogos tienen entrada y salida; pausar o reducir el movimiento evita estas transiciones.

## Interacciones incluidas

Búsqueda por nombre/ID, filtro por alergias, selección de paciente, vista pública completa, formulario con vista previa de foto y hasta dos contactos, descarga de QR real en SVG/PNG, Web Share API con alternativa de copiar enlace y estados de confirmación.

### Dos conceptos y QR personalizados

`src/features/emergency/components/emergency-concepts.tsx` contiene ambas fichas funcionales en TypeScript; `src/features/designs/components/anatomical-art.tsx` incluye los SVG anatómicos; `src/features/designs/styles/concepts.css` mantiene los dos sistemas visuales. Anatomical Dark combina carbón, serif editorial, datos monoespaciados y alertas rojas. Clinical combina papel clínico, tipografía pesada, azul plasma y etiquetas de laboratorio. Sangre y alergias preceden al nombre en ambos; las fichas públicas incluyen un botón fijo para llamar al primer contacto y acciones grandes para los demás contactos.

`src/features/designs/components/concept-lab.tsx` permite revisar los conceptos uno por uno, seleccionar una de las seis fichas ficticias, repetir la carga simulada y personalizar el QR. `src/features/qr/lib/custom-qr.ts` genera SVG y exporta PNG: tres tintas oscuras sobre blanco, puntos o cuadrados y un marco CodexSana opcional. Conserva todos los módulos, las marcas de posición, margen de cuatro módulos y corrección H. No tapa datos con logotipos. El QR apunta a la ficha y al concepto elegidos; conserva la URL local del prototipo. Su lectura física impresa debe verificarse en dispositivos antes de un despliegue real.

La espera de 900 ms pertenece únicamente al laboratorio de diseño. La ficha pública muestra sus datos en cuanto están disponibles. Los `loading.tsx` de las rutas muestran un esqueleto estructural durante la navegación, con scanline en el concepto clínico. La transición de desenfoque dura 220 ms. El contenido de la simulación es inerte mientras carga y el esqueleto anuncia su estado; el movimiento reducido desactiva latidos, pulso, escaneo y transiciones.

El mapa de pecho solo ilustra el dato explícito «Asma» del perfil ficticio de Sofía; los demás perfiles no reciben zonas ni diagnósticos inferidos. El corazón del concepto clínico es decorativo. El botón sobre la ilustración permite pausar su movimiento.

`src/features/emergency/components/share-emergency.tsx` llama a `navigator.share` directamente desde el toque del usuario. Comparte el enlace, sin incluir datos médicos en el texto. En móviles compatibles la persona puede elegir WhatsApp u otra aplicación en la hoja nativa. Cancelar no muestra un error; cuando la API no existe o falla, ofrece copiar el enlace. Esta API requiere un contexto seguro y soporte del navegador. La hoja de iOS/Android no se ha verificado en un dispositivo físico en esta entrega.

### Diseños infantiles originales: Miso, Mochi, Nori y Dr. Capi

Los conceptos infantiles originales están en `/conceptos/michi-sol` (Miso, gatito miel con gafas de sol y gorrito de león dorado) y `/conceptos/michi-luna` (Mochi, gatito crema con lentes redondos, libro y gorrito de osito de algodón). Conservan sus rostros y cuerpos originales: Miso sentado saluda con una patita y Mochi sostiene un libro. Los gorritos enmarcan sus caras. Ambos están disponibles para cualquier perfil infantil. Usan paletas de papel, miel y melocotón, o menta y rosa apagado, y mascotas dibujadas en SVG específicamente para CodexSana.

Nori, una nutria exploradora de ojos brillantes y bigotes largos, con gorrito de ranita, impermeable melocotón y jeringa ilustrada entre ambas patitas, está en `/conceptos/nutria-perla`. Dr. Capi, un capibara kawaii de cara frontal, hocico corto, mejillas suaves y postura sentada, con bata de solapas cortas y mangas con puños, estetoscopio azul tinta y detalles albaricoque, está en `/conceptos/capibara-salvia`. Ambos son personajes originales y se ofrecen para cualquier paciente, sin asignarlos por sexo. Las fichas públicas usan composiciones propias: Nori combina un panel de identidad con ondas; Dr. Capi coloca el personaje a la izquierda y el nombre con tipografía editorial a la derecha. Sangre y alergias siempre preceden a la identidad y los contactos.

`companion-art.ts` comparte los SVG originales entre pantalla, QR y tarjetas. `companion-design-lab.tsx` muestra los nuevos talleres y `companion-emergency-card.tsx` las fichas públicas. `kids-qr-studio.tsx` y `kids-theme-nav.tsx` son compartidos por los cuatro personajes. Los frentes impresos se generan en `companion-card-front.ts`, con utilidades SVG comunes en `card-svg.ts`. Hay pestañeos, saludo y movimientos suaves de cola/jeringa; la pausa y el movimiento reducido los desactivan. La carga simulada solo aparece en el laboratorio y la ruta pública usa la carga real de Next.js.

`src/features/designs/lib/cat-art.ts` comparte las ilustraciones entre la ficha y los QR exportados. `src/features/designs/components/kids-design-lab.tsx` incluye el taller; `kids-emergency-card.tsx` las fichas y esqueletos; `kids-art.tsx` los SVG; `src/features/designs/styles/kids.css` los diseños responsivos, movimientos de cola, gafas, ojos y soles, con pausa y movimiento reducido. Sangre y alergias preceden a la identidad; la llamada principal permanece fija abajo. La carga simulada solo pertenece al taller.

Los perfiles son ficticios: Leo Mendoza (`VT-K01`, 7 años) y Emma Rivera (`VT-K02`, 9 años), separados del panel. Las fichas son `/ficha/VT-K01/michi-sol` y `/ficha/VT-K02/michi-luna`. Las direcciones de los temas anteriores redirigen a estas nuevas versiones, para conservar los enlaces ya entregados.

`src/features/qr/lib/kids-qr.ts` permite elegir gatito o símbolo, patrón, tinta y nombre, y descargar PNG/SVG. La decoración queda fuera de la matriz y su margen de cuatro módulos; conserva corrección H y escapa el nombre al generar SVG. Compartir usa Web Share API con alternativa de copiar enlace. Los QR todavía apuntan al servidor local y requieren verificar su lectura impresa antes del despliegue.

## Alcance de esta entrega

Es un prototipo visual local con datos ficticios. Los seis perfiles de muestra tienen rutas públicas navegables. Crear o editar fichas cambia solo la memoria del panel durante la sesión; la vista previa refleja estos cambios. Las rutas públicas independientes todavía usan los perfiles originales y necesitan almacenamiento para reflejar cambios o abrir nuevas fichas. Los ingresos usan ventas ficticias explícitamente rotuladas; no hay cobros.

La siguiente etapa requiere acceso de administrador con autorización en servidor, persistencia de pacientes/fotos, identificadores públicos no predecibles, consentimiento para datos visibles, ciclo de actualización/revocación y registro de ventas. La navegación privada es solo visual en esta entrega.

Una web no agrega por sí sola una ficha a la pantalla de bloqueo. En la implementación final se puede entregar una imagen descargable para configurar como fondo o un acceso compatible con el dispositivo. El QR generado aquí apunta al servidor local y no es una URL pública de producción.

Las habilidades llamadas «Taste Skill», «Impeccable Design» y «Emil Kowalski Design» no estaban instaladas. Se aplicaron los principios proporcionados por el usuario sin afirmar que esas habilidades fueron activadas.

### Tarjetas físicas con frente y reverso

«Personalizar tarjeta» abre un taller asociado al paciente desde la lista, la biblioteca QR o el formulario. Permite elegir los siete diseños, personaje o símbolo infantil, patrón y tinta del QR, nombre impreso y borde decorativo. `Patient.cardStyle` almacena estas preferencias en memoria durante la sesión. «Cancelar» las descarta; «Aplicar diseño» actualiza el paciente existente o el borrador del formulario, que se confirma al guardar la ficha. El taller conserva los campos médicos, contiene el foco y permite Escape sin cerrar el formulario de fondo.

El taller y la descarga comparten `CardPreview` y `createCardFaces`; el panel, el enlace para compartir y las descargas usan las mismas preferencias. Los datos y personalizaciones todavía no se conservan al recargar ni se almacenan en servidor. Las rutas públicas independientes reflejan los perfiles de muestra y el tema de la URL; la decoración impresa corresponde a la tarjeta, no modifica los datos médicos de la ficha pública.

El formulario permite elegir CodexSana, Anatomical, Clínico, Miso, Mochi, Nori o Dr. Capi mediante miniaturas y radios accesibles. `Patient.design` conserva la elección durante la sesión y al editar; el panel muestra el nombre del diseño, la ficha correspondiente y su tarjeta. Los enlaces y QR incluyen el tema seleccionado. Las fichas públicas aceptan los perfiles originales del panel y los infantiles de muestra; los laboratorios infantiles usan los perfiles pediátricos de demostración. Las fichas nuevas y los cambios de datos siguen requiriendo persistencia para funcionar al escanear fuera del panel.

Descargar desde el dashboard, los conceptos adultos y los infantiles abre `CardExportDialog`. La tarjeta gira en 3D al tocarla o usar los controles Frente/Reverso, con alternativa inmediata para movimiento reducido. El diálogo nativo contiene el foco, permite Escape, bloquea el fondo y devuelve el foco al botón de origen.

`src/features/cards/lib/printable-card.ts` adapta siete identidades: CodexSana, Anatomical, Clínico, Miso, Mochi, Nori y Dr. Capi. La cara principal contiene nombre, edad, sangre y arte temático. El reverso muestra sangre, alergias, hasta dos contactos y el QR completo con su margen de cuatro módulos y corrección H. Los datos provienen del paciente seleccionado. Campos demasiado largos remiten explícitamente a la ficha completa en vez de solaparse. Los SVG escapan texto del usuario.

La descarga PNG contiene los dos lados sin espejo en 2280 × 912 px, con guías de corte; el SVG conserva medidas físicas de 190 × 76 mm para una hoja con dos tarjetas de 86 × 54 mm. «Ver hoja» muestra la composición. «Imprimir» abre el diálogo del navegador y `src/features/cards/styles/cards.css` imprime exclusivamente el frente y el reverso en A4 a tamaño real, con guías, ocultando controles y fondo. Se recortan y unen espalda con espalda; no es un ajuste automático de impresión dúplex. El QR sigue usando la dirección local del prototipo; su lectura en papel debe comprobarse antes de entregar una tarjeta real.

### Taller de QR inspirado en marcos gráficos

El personalizador del dashboard, formulario y laboratorios comparte cuatro marcos: Etiqueta, Contorno, Sello circular y Pasaporte. Incluye tres patrones (puntos, cuadrados y redondeados), tres estilos de esquina, tinta principal y un acento por diseño. El mensaje del marco admite 34 caracteres y se escapa al generar SVG. Miso y Mochi conservan sus gatitos originales y huellitas; los diseños adultos usan un emblema de corazón.

«Descargar solo el QR» exporta el arte completo en PNG o SVG. «Descargar tarjeta / dos caras» mantiene frente y reverso, con PDF protegido. La tinta, patrón y esquinas llegan también al QR del reverso; el marco y mensaje personalizan el QR independiente. Las ilustraciones permanecen fuera de la matriz y del margen blanco de cuatro módulos. Los patrones de sincronización y alineación mantienen sus cuadrados originales, con corrección H.

`npm run verify:qr` rasteriza y decodifica 315 exportaciones con sharp/jsQR: siete identidades, cuatro marcos, tres patrones, tres esquinas y los reversos de tarjetas. Verifica el enlace exacto a 570 px para arte completo y 280 px para QR del reverso. El centro de la opción «Con punto» es un cuadrado muy suavizado para conservar su ancho en las líneas de escaneo; un círculo completo no pasó todas las pruebas. Estas comprobaciones digitales no reemplazan la validación con cámaras y tarjetas impresas.

### Tarjeta con QR o sin QR

El formulario y «Personalizar tarjeta» permiten elegir «Con QR» (predeterminado) o «Sin QR». La preferencia `Patient.cardStyle.includeQR` se mantiene durante la sesión, al editar y al aplicar el diseño. Las fichas anteriores conservan QR por defecto. La elección afecta a la tarjeta física; el QR independiente y la ficha pública siguen disponibles por separado.

Los siete diseños tienen un reverso sin QR: alergias a todo el ancho, hasta dos contactos en columnas con teléfonos grandes, padecimientos y medicamentos reportados. El frente y la hoja de impresión omiten instrucciones de escaneo en esta modalidad. Los textos demasiado extensos remiten a consultar al titular y generan avisos visibles en el resumen previo a imprimir; no se presentan como información completa. El resumen enumera diseño, formato y datos de ambos lados.

En la ventana de descarga se puede cambiar el formato para ese archivo. PNG, SVG, PDF protegido y la impresión comparten la misma composición. Un cambio de formato invalida el PDF preparado para que no se comparta la versión anterior. Las descargas añaden `con-qr` o `sin-qr` al nombre del archivo. La contraseña aleatoria sigue protegiendo el PDF; los formatos PNG/SVG no tienen contraseña.

`npm run verify:cards` rasteriza los siete diseños, comprueba la ausencia de QR en la tarjeta sin código, los datos esenciales y avisos, la descarga independiente de QR y el retorno a la versión con QR. Incluye perfiles anteriores, texto escapado y datos demasiado extensos. El prototipo sigue sin persistencia en servidor ni autenticación de administrador; esas capacidades corresponden a la siguiente etapa.
