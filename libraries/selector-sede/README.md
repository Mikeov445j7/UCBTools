# Selector de sedes

## Objetivo

La librería `selector-sede` es la primera herramienta reutilizable del proyecto UCBTools. Su responsabilidad es ofrecer una interfaz para seleccionar una sede institucional sin mezclar reglas de negocio ni acceso HTTP con la presentación.

## Endpoint

La librería consulta el servicio institucional:

```text
https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes
```

## Estructura

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

## Responsabilidades

### Biblioteca

- Define el modelo `Sede`.
- Consume el endpoint institucional.
- Expone la API reutilizable a través de `SedeService`.
- Publica el componente standalone de presentación `SelectorSedeComponent`.
- Exporta las API públicas desde `index.ts`.

### Servicio de aplicación

- Se ubica en `src/app/services/catalogo.service.ts`.
- Coordina el consumo del servicio reutilizable.
- Traduce el resultado a la necesidad del sistema.

### Pantalla

- Se ubica en `src/app/pages/home/home.component.ts`.
- Recibe el arreglo de sedes, representa el estado y maneja la selección actual.

## Paso a paso de implementación

1. Crear la carpeta `libraries/selector-sede`.
2. Definir el contrato de datos en `sede.model.ts`.
3. Implementar `SedeService` con `HttpClient` y la llamada al endpoint.
4. Crear `SelectorSedeComponent` como componente standalone, con entradas y salidas.
5. Exportar el modelo, servicio y componente desde `index.ts`.
6. Crear un servicio de aplicación en `src/app/services/catalogo.service.ts`.
7. Crear la pantalla `HomeComponent` y su template.
8. Importar `SelectorSedeComponent` en el contexto consumidor (por ejemplo, en `imports` del `AppModule`).
9. Montar `<app-home></app-home>` en la app principal.

No se crea un `NgModule` dentro de esta librería: el componente standalone ya declara sus dependencias de presentación. Un módulo solo se justificaría por compatibilidad con consumidores antiguos que no puedan importar componentes standalone.

## Uso

El componente se usa de manera declarativa desde la pantalla:

```html
<ucb-selector-sede
  [sedes]="sedes"
  [sedeSeleccionada]="sedeSeleccionada"
  [cargando]="cargando"
  [error]="error"
  (sedeChange)="manejarCambioSede($event)"
  (reintentar)="cargarSedes()"
></ucb-selector-sede>
```

## Regla de arquitectura aplicada

La librería cumple la separación recomendada por la guía:

- el servicio HTTP vive en la librería;
- el componente visual no conoce la red;
- la pantalla y el servicio de aplicación gestionan el flujo del negocio.

Esto mantiene el proyecto orientado a reutilización y facilita la evolución a nuevas herramientas del mismo tipo.
