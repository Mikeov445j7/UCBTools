# CrudActas (`libraries/crud-actas`)

Librería Angular 18 (NgModule) institucional para consulta y visualización integral de Actas de Defensa de Titulación UCB.

## Selector
`ucb-gestion-actas`

## Componentes y Arquitectura
- **`GestionActasComponent`**: Orquesta la búsqueda reactiva de estudiantes (`ucb-combobox-estudiantes`), la visualización seleccionable de actas (`ucb-tarjeta-seleccion`) y el expediente detallado del acta (`ucb-tarjeta-perfil`).
- **`ActasService`**: Consume `Estudiante/GetEstudianteActas?ci=...` y `Actas/GetActa?idActa=...`.
- **`CrudActasModule`**: NgModule para importación limpia.

## Uso
```html
<ucb-gestion-actas></ucb-gestion-actas>
```
