# CrudTitulaciones (`libraries/crud-titulaciones`)

Librería Angular 18 (NgModule) institucional para la gestión y actualización en línea de expedientes de titulación y trámites académicos UCB.

## Componentes
- `ucb-gestion-titulaciones`: Vista de búsqueda, selección y edición dinámica en split-screen.
- `ucb-tarjeta-editable-titulacion`: Tarjeta editable que combina el perfil de titulación con formulario reactivo de auditoría y parámetros académicos.

## Servicio
- `TitulacionesService`: Consume `Tramites/GetTramiteCompletoCi?ci=...` y `UpdTramite`.

## Uso
```html
<ucb-gestion-titulaciones></ucb-gestion-titulaciones>
```
