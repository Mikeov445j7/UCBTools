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

El servicio devuelve una lista de objetos con `idSede`, `sigla` y `nombre`. La biblioteca comprueba el formato de la respuesta, presenta el estado de carga y permite volver a intentar si la solicitud falla.

Su estructura separa el contrato de datos, el acceso HTTP y la presentación:

```text
libraries/selector-sede/
├── index.ts
├── sede.model.ts
├── sede.service.ts
├── selector-sede.component.ts
├── selector-sede.component.html
├── selector-sede.component.scss
├── sede.service.spec.ts
└── README.md
```

Para crear una biblioteca nueva:

1. Crea una carpeta con un nombre que identifique la herramienta dentro de `libraries/`.
2. Separa los modelos, la integración con datos y la interfaz cuando corresponda.
3. Agrega pruebas para los comportamientos propios de la biblioteca.
4. Documenta el propósito, la API y la forma de uso en un `README.md` dentro de la biblioteca.
5. Mantén la biblioteca independiente de reglas de negocio y de aplicaciones consumidoras.

Para incorporar el selector en una aplicación Angular standalone:

1. Configura `provideHttpClient()` en los proveedores de la aplicación.
2. Importa `SelectorSedeComponent` desde el punto de entrada de la biblioteca en el componente consumidor.
3. Usa `<ucb-selector-sede (sedeChange)="sede = $event" />` en su plantilla.
4. Consume el valor emitido como `Sede | null`; el objeto incluye `idSede`, `sigla` y `nombre`.

La app de UCBTools utiliza este componente como demostración en `src/app/app.component.*`. El detalle de uso también está en [`libraries/selector-sede/README.md`](./libraries/selector-sede/README.md). El `index.ts` es el punto de entrada público de la biblioteca en este repositorio. Esta integración es una demostración dentro del repositorio: la publicación del paquete y su nombre de importación para consumidores externos aún deben configurarse. Cuando estén disponibles, las aplicaciones deben consumir la biblioteca publicada, no copiar su implementación. El servidor del servicio debe permitir solicitudes CORS desde el origen del consumidor.

## Dirección de dependencias

La dirección de dependencia debe ser siempre:

```text
Aplicación institucional
        ↓
      UCBTools
```

UCBTools no debe depender de una aplicación ni conocer funcionalidades específicas de un sistema.

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
- `Helpers`
- `Misc`
- `Common`
- `Varios`
- `Otros`
- `Temporal`

Cada elemento debe ubicarse en una carpeta cuyo nombre y responsabilidad sean explícitos.

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
