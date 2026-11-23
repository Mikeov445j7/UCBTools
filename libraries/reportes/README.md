# Reportes

## Objetivo

Herramienta para mostrar reportes tabulares. Incluye:

- `<ucb-reporte>`: componente de presentación con tabla de columnas configurables, filtros por selección o por lista, buscador de texto, panel de configuración y selección de fila.
- `ReporteDatosService`: GET genérico de un endpoint y traducción de errores HTTP a mensajes legibles.
- `ReportePadre`: directiva abstracta con ganchos para páginas consumidoras.

Qué **no** hace:

- El componente no accede a la red: recibe `datos`, `cargando` y `error` por `@Input()`.
- No conoce el negocio ni define qué reportes existen: la configuración de cada reporte (`ConfigReporte`) la aporta la aplicación consumidora.

## Origen

Proviene de `sgt-multitools`:

| Origen (`sgt-multitools`) | Destino |
|---|---|
| `src/app/reportes/reporte/reporte.component.*` | `reporte.component.*` |
| `src/app/reportes/models/reporte.model.ts` | `models/reporte.model.ts` |
| `src/app/reportes/reporte-padre.ts` | `reporte-padre.ts` |
| `src/app/reportes/utils/reporte-config.ts` | `helpers/reporte-config.ts` |
| `src/app/reportes/utils/reporte-http.util.ts` | `services/reporte-datos.service.ts` |
| `projects/ui-marco/src/lib/utils/diccionario-columnas.ts` | `helpers/diccionario-columnas.ts` y `helpers/busqueda-difusa.ts` |
| `projects/ui-marco/src/lib/utils/humanizar.util.ts` | `helpers/humanizar.ts` |
| `projects/ui-marco/src/lib/utils/filtro-columnas.util.ts` | `helpers/filtro-columnas.ts` |
| `projects/ui-marco/src/lib/styles/_componentes.scss` (`.tabla-reporte`, `.boton`) | `reporte.component.scss` |
| `src/app/reportes/reportes.config.ts` | No migrado a la librería: la configuración de reportes pasa a `src/app/services/reporte.service.ts` de la aplicación |
| `src/app/test-componentes/*` | Demostración en `src/app/testAdrian/` |

Cambios respecto al original:

- El componente es de presentación: entradas `datos`, `cargando`, `error` y nueva salida `reintentar`. Se retiran `fuente` (Observable) y la carga por `config.endpoint` dentro del componente.
- `fuse.js` se reemplaza por una búsqueda difusa propia (algoritmo de Sellers, umbral 0.35) y `humanize-string` por una función propia. No se instalan paquetes.
- El valor vacío se muestra como `-` en lugar de `—`.
- Clases `reporte__*` en lugar de `rep__*`, `boton*` y `tabla-reporte`.
- Estilos con la paleta de la página de inicio de UCBTools.
- `ReportePadre` se conserva. `ReporteConfig` y los helpers son internos.
- Accesibilidad: etiquetas asociadas a sus controles, `caption` en tablas y `aria-live`.

## Estructura

```text
libraries/reportes/
├── index.ts
├── reportes.module.ts
├── reporte.component.ts
├── reporte.component.html
├── reporte.component.scss
├── reporte-padre.ts
├── README.md
├── models/
│   └── reporte.model.ts
├── helpers/
│   ├── busqueda-difusa.ts
│   ├── diccionario-columnas.ts
│   ├── filtro-columnas.ts
│   ├── humanizar.ts
│   └── reporte-config.ts
└── services/
    └── reporte-datos.service.ts
```

- `models/`: contratos públicos (configuración, estados y eventos).
- `helpers/`: funciones internas (diccionario de etiquetas, búsqueda difusa, humanización, detección de filtros, resolución de columnas). No se exportan.
- `services/`: acceso HTTP genérico de la herramienta.

## Creación (paso a paso)

Se siguió la Opción B (`NgModule`) de `libraries/README.md`:

1. Crear la carpeta `libraries/reportes/`.
2. Definir los contratos en `models/reporte.model.ts`.
3. Llevar a `helpers/` las funciones de etiquetas, formatos, filtros y resolución de columnas, sustituyendo `fuse.js` y `humanize-string` por código propio.
4. Crear `ReporteDatosService` en `services/` con la carga genérica y la traducción de errores.
5. Crear `ReporteComponent` con `standalone: false`, prefijo `ucb-` y `OnPush`.
6. Escribir la plantilla y el SCSS con clases BEM `reporte__*` y la paleta de la página de inicio.
7. Declarar y exportar el componente en `ReportesModule`, que importa `CommonModule`.
8. Publicar la API en `index.ts`.

## Publicación

`index.ts` exporta:

- Modelos de `models/reporte.model.ts`.
- `ReporteDatosService`.
- `ReportePadre`.
- `ReporteComponent`.
- `ReportesModule`.

No es un paquete npm: se consume con una ruta relativa a la carpeta de la librería. Desde un módulo en `src/app/<carpeta>/`:

```ts
import { ReportesModule } from '../../../libraries/reportes';

@NgModule({
  imports: [ReportesModule],
})
export class EjemploModule {}
```

## API

### Entradas

| Input | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `config` | `ConfigReporte` | `{ id: '' }` | Configuración del reporte. |
| `datos` | `RegistroReporte[] \| null` | `null` | Registros a mostrar. |
| `cargando` | `boolean` | `false` | Indica que los datos se están cargando. |
| `error` | `string \| null` | `null` | Mensaje de error a mostrar. |

### Salidas

| Output | Tipo | Descripción |
|---|---|---|
| `cargado` | `EventoCargado` | Se emite cuando llegan datos (con registros o vacíos). |
| `errorCarga` | `EventoErrorCarga` | Se emite cuando `error` recibe un mensaje. |
| `filaSeleccionada` | `EventoFilaSeleccionada` | Clic o Enter sobre una fila. |
| `configCambiada` | `EventoConfigCambiada` | Cambios en columnas visibles, filtros o buscador desde el panel. |
| `reintentar` | `void` | Botones Reintentar y Actualizar. |

### Modelos

```ts
export type RegistroReporte = Record<string, unknown>;

export interface ColumnaConfig {
  clave: string;
  etiqueta?: string;
  visible?: boolean;
  filtro?: boolean;
  formato?: string;
}

export interface ConfigReporte {
  id: string;
  titulo?: string;
  endpoint?: string;
  visibles?: string[];
  filtros?: string[];
  buscador?: string | null;
  columnas?: ColumnaConfig[];
  configurable?: boolean;
  mensajeVacio?: string;
}
```

También se exportan `ConfigReporteActual`, `EstadoReporte`, `FormatoColumna`, `EventoReporte`, `EventoCargado`, `EventoErrorCarga`, `EventoFilaSeleccionada` y `EventoConfigCambiada`.

### Estados

| Estado | Regla de cálculo |
|---|---|
| `error` | `error` tiene valor |
| `cargando` | `cargando` es verdadero |
| `sin-fuente` | `datos` no es un arreglo |
| `sin-datos` | `datos` es un arreglo vacío |
| `listo` | `datos` tiene registros |

Se evalúan en ese orden.

### Servicio

| Método | Descripción |
|---|---|
| `obtenerDatos(endpoint)` | GET del endpoint. Falla si la URL queda vacía tras limpiar espacios y caracteres invisibles. |
| `describirError(error)` | Mensaje legible según el estado HTTP (0, 401, 403, 404, 5xx u otro). |

## Uso

Servicio de aplicación (en `src/app/services/reporte.service.ts`), que aporta la configuración de cada reporte con `obtenerConfiguracion(id)` y delega el HTTP a la librería:

```ts
obtenerDatos(config: ConfigReporte): Observable<RegistroReporte[]> {
  return this.reporteDatosService.obtenerDatos(config.endpoint);
}
```

Pantalla:

```html
<ucb-reporte
  [config]="configReporte"
  [datos]="datosReporte"
  [cargando]="cargandoReporte"
  [error]="errorReporte"
  (reintentar)="cargarReporte()"
  (filaSeleccionada)="alSeleccionarFila($event)"
></ucb-reporte>
```

```ts
cargarReporte(): void {
  this.cargandoReporte = true;
  this.errorReporte = null;
  this.reporteService.obtenerDatos(this.configReporte).subscribe({
    next: (lista) => {
      this.datosReporte = lista;
      this.cargandoReporte = false;
    },
    error: (error: unknown) => {
      this.datosReporte = null;
      this.cargandoReporte = false;
      this.errorReporte = this.reporteService.describirError(error);
    },
  });
}
```

Con `ReportePadre`, una página puede sobrescribir solo los ganchos que necesite:

```ts
export class PaginaReporte extends ReportePadre {
  config: ConfigReporte = { id: 'nominaciones' };

  override onFilaSeleccionada(evento: EventoFilaSeleccionada): void {
    this.detalle = evento.fila;
  }
}
```

## Resolución de columnas

- Etiqueta: primero la manual (`config.columnas[].etiqueta`), luego el diccionario (coincidencia exacta o difusa) y por último la humanización automática de la clave.
- Visibilidad: `columnas` tiene prioridad sobre `visibles`. Si ninguna columna queda visible se muestran todas.
- Filtros: de tipo `seleccion` (lista desplegable) cuando la columna tiene 8 valores únicos o menos, y de tipo `lista` (campo con sugerencias) cuando tiene más.
- Formatos: `sexo` (Masculino/Femenino), `estadoregistro` (Activo/Inactivo) y fechas ISO con formato `es-BO`.
- Los valores nulos o vacíos se muestran como `-`.

## Estilos

- Tipografía heredada del cuerpo de la página (`src/styles.scss`). La librería no declara fuentes.
- Colores de la paleta de la página de inicio: texto `#0f172a`, secundario `#475569`, acento y foco `#2563eb`, paneles `#f8fafc` con borde `#dfe7f1`, azules claros `#dbeafe`, `#93c5fd` y `#e0f2fe`, y estado de error `#fef2f2`, `#fecaca`, `#991b1b`. No se usan amarillos ni el azul institucional oscuro.
- Todos los estilos son locales en `reporte.component.scss`.

## Responsividad

Hasta 640 px la cabecera pasa a columna, los campos y botones ocupan todo el ancho y la tabla reduce tipografía y espaciado. La tabla tiene desplazamiento propio con cabecera fija.

## Accesibilidad

- Las etiquetas de los filtros y del buscador están asociadas a sus controles con `for` e `id`.
- Las tablas llevan `caption` visible solo para lectores de pantalla y `scope="col"` en los encabezados.
- Los estados se anuncian con `aria-live="polite"` y los errores con `role="alert"`.
- Las filas son enfocables, se seleccionan con Enter y tienen foco visible.
- El botón de configuración usa `aria-expanded` y `aria-controls`.
- Se respeta `prefers-reduced-motion` en el indicador de carga.

## Dependencias

- `@angular/core`
- `@angular/common` (`CommonModule`)
- `@angular/common/http` (`HttpClient`; `HttpClientModule` lo aporta la aplicación)
- `rxjs`

No depende de ninguna otra librería de `libraries/` ni de `src/app/`.
