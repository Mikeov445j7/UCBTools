# UCBTools

## Guía de arquitectura y organización de proyectos

### Objetivo

UCBTools constituye la base tecnológica para el desarrollo de sistemas institucionales de la Universidad Católica Boliviana.

Su propósito es centralizar herramientas reutilizables y establecer una estructura uniforme para los proyectos, evitando la duplicación de código, reduciendo los tiempos de desarrollo y favoreciendo la mantenibilidad a largo plazo.

## Principio fundamental

Un sistema institucional debe separar claramente las herramientas reutilizables de las funcionalidades propias del negocio.

### Herramientas

Son componentes o servicios reutilizables que pueden ser utilizados por varios sistemas institucionales. Pertenecen a UCBTools.

Ejemplos:

- Buscador de docentes.
- Buscador de estudiantes.
- Selector de sedes.
- Exportación a PDF o Excel.
- Componentes de tablas.
- Generación de reportes.
- Manejo de permisos.
- Catálogos institucionales.

### Funcionalidades

Son procesos y reglas de negocio propios de un sistema. Pertenecen al proyecto que implementa ese sistema.

Ejemplos:

- Registro de convenios.
- Gestión de titulación.
- Gestión de proyectos académicos.
- Activación de convenios internacionales.
- Movilidad estudiantil.

## Regla general

Antes de desarrollar un componente nuevo, se debe evaluar si puede reutilizarse en otro sistema institucional:

- Si es reutilizable e independiente del negocio, debe implementarse en UCBTools.
- Si responde a una necesidad específica del negocio, debe implementarse en el proyecto correspondiente.

## Organización de los repositorios

El repositorio de UCBTools organiza el framework y sus recursos compartidos:

```text
UCBTools/
├── src/
├── libraries/
├── templates/
├── docs/
└── tests/
```

Los sistemas que consumen UCBTools mantienen sus aplicaciones y funcionalidades de negocio en sus propios repositorios. En ellos, la carpeta `apps/` contiene las aplicaciones del sistema:

```text
ProyectoInstitucional/
└── apps/
    └── Convenios/
        ├── Convenios/
        ├── Instituciones/
        ├── Reportes/
        └── ActivacionConvenios/
```

Las funcionalidades de una aplicación pueden consumir las herramientas publicadas por UCBTools.

## Libraries

La carpeta `libraries/` de UCBTools contiene exclusivamente herramientas reutilizables. No debe contener funcionalidades de negocio.

Ejemplos permitidos:

- `BuscarDocente`
- `BuscarEstudiante`
- `SelectorSede`
- `GeneradorPDF`
- `TablaGenerica`
- `ExportadorExcel`
- `ValidadorCI`

Ejemplos no permitidos:

- `RegistrarConvenio`
- `AprobarTitulacion`
- `EnviarConvenio`
- `ActivarMovilidad`

Estos últimos representan procesos de negocio y deben permanecer en el sistema al que pertenecen.

### Ejemplo: Selector de sede

La primera biblioteca de ejemplo es `libraries/selector-sede/`. Obtiene las sedes del servicio institucional:

```text
GET https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes
```

El servicio devuelve una lista de objetos con `idSede`, `sigla` y `nombre`. El modelo TypeScript, el servicio HTTP y el tipado de la respuesta viven en la biblioteca. El componente standalone expone la selección como presentación; la aplicación consumidora coordina la solicitud, el estado de carga y los reintentos desde su servicio de aplicación y su pantalla.

Su estructura separa el contrato de datos, el acceso HTTP y la presentación:

```text
libraries/selector-sede/
├── index.ts
├── sede.model.ts
├── sede.service.ts
├── selector-sede.component.ts
├── selector-sede.component.html
├── selector-sede.component.scss
├── selector-sede.component.spec.ts
└── README.md
```

En Angular 18 se prefieren componentes standalone para las herramientas nuevas. Cada biblioteca no necesita su propio `NgModule`: se importa el componente standalone directamente. Se agrega un módulo solo cuando un requisito de compatibilidad lo justifique. El `index.ts` sirve como punto de entrada público y exporta únicamente la API que los consumidores deben usar.

Para crear una biblioteca nueva:

1. Crea una carpeta con un nombre que identifique la herramienta dentro de `libraries/`.
2. Separa los modelos, la integración con datos y la interfaz cuando corresponda.
3. Agrega pruebas para los comportamientos propios de la biblioteca.
4. Documenta el propósito, la API y la forma de uso en un `README.md` dentro de la biblioteca.
5. Mantén la biblioteca independiente de reglas de negocio y de aplicaciones consumidoras.

Para incorporar el selector en una aplicación Angular:

1. Configura el cliente HTTP (`provideHttpClient()` para una aplicación standalone o `HttpClientModule` para una aplicación basada en `NgModule`).
2. Desde un servicio de dominio en `src/app/services/`, consume el servicio HTTP expuesto por la biblioteca.
3. En el contexto que declara la pantalla, importa `SelectorSedeComponent` desde el punto de entrada de la biblioteca y pásale los datos y estados necesarios.
4. Maneja `sedeChange` para recibir `Sede | null`; el objeto incluye `idSede`, `sigla` y `nombre`. Maneja `reintentar` para pedir a la pantalla que vuelva a invocar el servicio de aplicación.

`SelectorSedeComponent` es puramente visual: recibe `sedes`, `sedeSeleccionada`, `cargando` y `error`, y emite la sede seleccionada o la solicitud de reintento. No accede directamente a la red. El servicio HTTP de sedes permanece en `libraries/selector-sede/`; no se duplica como servicio de negocio en cada sistema consumidor.

La app de UCBTools demuestra esta separación con `src/app/services/catalogo.service.ts` y `src/app/pages/home/`. El detalle de uso también está en [`libraries/selector-sede/README.md`](./libraries/selector-sede/README.md). El `index.ts` es el punto de entrada público de la biblioteca en este repositorio. Esta integración es una demostración dentro del repositorio: la publicación del paquete y su nombre de importación para consumidores externos aún deben configurarse. Cuando estén disponibles, las aplicaciones deben consumir la biblioteca publicada, no copiar su implementación. El servidor del servicio debe permitir solicitudes CORS desde el origen del consumidor.

## Dirección de dependencias

La dirección de dependencia entre aplicaciones institucionales y UCBTools debe ser siempre:

```text
Aplicación institucional
        ↓
      UCBTools
```

UCBTools no debe depender de una aplicación ni conocer funcionalidades específicas de un sistema.

## Organización de servicios

### Objetivo

Esta sección define los **servicios de aplicación**, es decir, los servicios propios de cada sistema institucional. Están dirigidos al negocio de esa aplicación y actúan como capa orquestadora entre sus pantallas, su lógica funcional y las herramientas de UCBTools.

No define ni reemplaza los servicios internos que forman parte de una herramienta reutilizable. El servicio que consulta los datos necesarios para `SelectorSedeComponent`, por ejemplo, pertenece a `libraries/selector-sede/`; no es un servicio de negocio de cada aplicación consumidora.

Las reglas de negocio propias permanecen en la aplicación institucional. UCBTools no debe depender de esos servicios ni incorporar reglas exclusivas de un sistema.

### Estructura de la aplicación

Cada aplicación debe tener una única carpeta `services/`, que será el único lugar autorizado para los servicios de aplicación. En una aplicación Angular, la estructura de referencia bajo `src/` es:

```text
src/
└── app/
    ├── pages/
    ├── components/
    ├── models/
    ├── interfaces/
    ├── services/
    ├── guards/
    └── layouts/
```

Los archivos de arranque y configuración propios de Angular, como `app.component.ts`, `app.config.ts` y `app.routes.ts`, pueden permanecer directamente en `src/app/`.

No se deben crear carpetas `services/` dentro de módulos o dominios funcionales, páginas ni componentes. Los siguientes ejemplos son incorrectos:

```text
src/app/convenios/services/
src/app/instituciones/services/
src/app/pages/convenios/services/
src/app/components/institucion/services/
```

La carpeta `helpers/` no es obligatoria. Solo puede existir dentro de `src/app/` cuando contenga funciones auxiliares con un propósito concreto, responsabilidad y uso documentados; no se debe crear vacía ni usar para lógica de negocio que corresponda a un servicio.

### Agrupación por dominio

Los servicios se agrupan por dominio funcional, no por componente visual, módulo ni acción individual. Cada archivo reúne las operaciones de negocio relacionadas con ese dominio y puede coordinar varias herramientas de UCBTools.

Ejemplos de archivos válidos en `src/app/services/`:

- `persona.service.ts`
- `institucion.service.ts`
- `documento.service.ts`
- `reporte.service.ts`
- `catalogo.service.ts`
- `usuario.service.ts`
- `seguridad.service.ts`

No se deben crear archivos de servicio por operación o herramienta:

- `buscar-persona.service.ts`
- `buscar-docente.service.ts`
- `buscar-estudiante.service.ts`
- `buscar-por-ci.service.ts`
- `generar-pdf.service.ts`
- `exportar-excel.service.ts`

### Responsabilidades por dominio

Cuando varias operaciones pertenecen al mismo dominio, deben mantenerse en el mismo servicio. Por ejemplo, `persona.service.ts` puede ofrecer `buscarPersona()`, `buscarDocente()`, `buscarEstudiante()`, `buscarPorCI()`, `buscarPorNombre()`, `buscarPorCorreo()` y `obtenerDatosAcademicos()`.

`institucion.service.ts` puede agrupar `buscarInstitucion()`, `buscarUniversidad()`, `buscarPorPais()`, `obtenerConvenios()` y `obtenerContactos()`.

`documento.service.ts` puede agrupar `generarPdf()`, `generarWord()`, `imprimirDocumento()`, `descargarDocumento()` y `obtenerPlantilla()`. La capacidad técnica reutilizable de generar un formato puede delegarse a una herramienta de UCBTools; el servicio de aplicación coordina su uso para el flujo de negocio.

### Responsabilidades y límites

Un servicio de aplicación debe:

- Centralizar operaciones relacionadas con un mismo dominio funcional.
- Coordinar las llamadas a las APIs que requiere el dominio.
- Transformar datos para los casos de uso de la aplicación.
- Orquestar herramientas reutilizables de UCBTools.
- Exponer métodos claros para que la interfaz consuma las operaciones de negocio.

Un servicio de aplicación no debe:

- Contener lógica visual, implementar vistas o definir estilos.
- Manipular directamente elementos gráficos o componentes visuales.
- Crear dependencias circulares con otros servicios.
- Trasladar a UCBTools reglas propias de la aplicación.

Los servicios propios de una biblioteca de UCBTools se mantienen dentro de esa biblioteca, junto con la capacidad reutilizable que implementan. No se trasladan a `src/app/services/` de cada sistema consumidor. A su vez, un servicio de aplicación no pertenece a `libraries/`, porque conoce y coordina necesidades del negocio de su sistema.

### Dependencias entre pantallas, servicios y herramientas

Las operaciones y los flujos de negocio deben seguir esta dirección:

```text
Pantalla
   ↓
Servicio de aplicación (dominio del negocio)
   ↓
Herramientas UCBTools
```

Para operaciones de negocio, la pantalla consume el servicio de aplicación; este consume las herramientas necesarias. La herramienta nunca depende de la pantalla ni del servicio de aplicación que la utiliza.

Los componentes puramente visuales de UCBTools pueden importarse directamente en una pantalla para presentarlos y enlazar sus entradas y eventos. Por ejemplo, una pantalla puede mostrar `SelectorSedeComponent`. Este uso de presentación no cambia la ubicación del servicio interno de la biblioteca ni permite omitir el servicio de aplicación al coordinar un flujo de negocio.

```text
Pantalla ──→ componente visual UCBTools (presentación)
Pantalla ──→ servicio de aplicación ──→ herramientas/servicios internos de UCBTools (operaciones)
```

> Una herramienta resuelve una capacidad técnica. Un servicio agrupa herramientas relacionadas para resolver una necesidad funcional.

## Identificación de una herramienta

Un componente debe considerarse una herramienta cuando sea reutilizable, independiente del negocio y pueda servir a más de un sistema.

Ejemplos:

- `BuscadorDocente` puede usarse en Convenios, Titulación, Movilidad y Recursos Humanos; por tanto, es una herramienta.
- `SelectorInstitucion` puede usarse en Convenios, Internacionalización y Movilidad; por tanto, es una herramienta.
- `GeneradorPDF` puede servir a cualquier sistema; por tanto, es una herramienta.

## Identificación de una funcionalidad

Una funcionalidad representa una necesidad específica del negocio de un sistema.

Ejemplos:

- El registro de convenios pertenece al Sistema de Convenios.
- La defensa de tesis pertenece al Sistema de Titulación.
- La asignación de tribunal pertenece al Sistema de Titulación.

## Regla de crecimiento

Cuando una funcionalidad equivalente vuelva a desarrollarse en otro sistema, se debe evaluar su migración a una librería común:

1. Primera implementación: se desarrolla en el proyecto correspondiente.
2. Segunda implementación: se evalúa si corresponde convertirla en una herramienta reutilizable.
3. Tercera implementación: su incorporación a UCBTools es obligatoria.

La migración debe preservar la separación entre la herramienta genérica y las reglas de negocio particulares de cada sistema.

## Carpetas prohibidas

No se deben crear carpetas genéricas sin un propósito y una responsabilidad claramente definidos, como:

- `Utils`
- `Misc`
- `Common`
- `Varios`
- `Otros`
- `Temporal`

En las aplicaciones, `helpers/` solo se permite para funciones auxiliares de propósito concreto y documentado, según la estructura de referencia de esta guía. No se debe usar como carpeta genérica para lógica que corresponda a un servicio de dominio, una biblioteca de UCBTools u otra ubicación definida.

## Responsabilidades de los proyectos institucionales

Los sistemas institucionales deben concentrarse en:

- Casos de uso.
- Flujos de negocio.
- Reglas funcionales.
- Pantallas.
- Procesos institucionales.

No deben volver a implementar herramientas que ya existen en UCBTools.

## Responsabilidades de UCBTools

UCBTools debe proporcionar herramientas reutilizables, tales como:

- Componentes visuales.
- Buscadores y selectores.
- Reportes y exportaciones.
- Validaciones.
- Capacidades de seguridad.
- Generación y manejo de documentos.
- Catálogos institucionales.
- Otros componentes independientes del negocio y reutilizables entre sistemas.

## Resultado esperado

Al crear un nuevo sistema, los desarrolladores deben poder concentrarse en construir procesos institucionales, en lugar de volver a resolver problemas ya atendidos.

Cada sistema debe mantener sus funcionalidades de negocio en una estructura de aplicaciones clara y consumir las herramientas estándar provistas por UCBTools, preservando la separación entre infraestructura reutilizable y negocio.
