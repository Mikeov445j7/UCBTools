# Buscador de Personas y Estudiantes

## Objetivo

Librería reutilizable (`BuscadorPersonasModule`) que encapsula el acceso HTTP a las consultas institucionales de personas y estudiantes y expone dos componentes visuales desacoplados basados en `NgModule` (`standalone: false`):

- `<ucb-combobox-usuarios>`: buscador orientado a docentes, autoridades y usuarios (`longitudMinima = 3`).
- `<ucb-combobox-estudiantes>`: buscador orientado a estudiantes por C.I. (`longitudMinima = 1`).

## Endpoints encapsulados en `PersonaSearchService`

- `GET https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Autoridades/GetPersona?busq=...`
- `GET https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Estudiante/GetEstudianteCarrera?ci=...`
- `GET https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Estudiante/GetEstudianteDatosCompletosConTodo?idPersona=...`

## Integración (`NgModule`)

```ts
import { BuscadorPersonasModule } from '../../libraries/buscador-personas';

@NgModule({
  imports: [BuscadorPersonasModule],
})
export class EjemploModule {}
```

Los componentes visuales no realizan peticiones HTTP directas: reciben `resultados`, `cargando` y `error` por `@Input()` y emiten `terminoBuscado` junto con el evento de selección correspondiente.
