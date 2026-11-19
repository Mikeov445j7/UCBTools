# CrudAutorizaciones (`libraries/crud-autorizaciones`)

Librería Angular 18 (NgModule) institucional para la gestión, auditoría y asignación de autorizaciones y roles UCB.

## Componentes
- `ucb-gestion-autorizaciones`: Vistas de búsqueda de usuario, visualización de autorizaciones activas y mantenimiento.
- `ucb-formulario-autorizacion`: Formulario reactivo para alta y modificación de roles, con selector de sede desacoplado.

## Servicio
- `AutorizacionesService`: 6 endpoints de consulta y mutación con `ApiTitulacionOficial/api/Autorizacion`.

## Uso
```html
<ucb-gestion-autorizaciones></ucb-gestion-autorizaciones>
```
