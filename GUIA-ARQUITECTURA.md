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
