# Reportes dinámicos

Librería Angular 18 para registrar fuentes de datos y presentar tablas configurables. El contenedor gestiona estados; `ReporteComponent` es visual y no hace solicitudes HTTP. La aplicación coordina sus casos de uso y registra los reportes mediante su servicio de dominio. No hay paquete npm publicado: importa desde `libraries/reportes`.

## Integración

Configura `HttpClientModule` en el módulo raíz de una app basada en NgModule, o `provideHttpClient()` si es standalone. Importa `ReporteContainerComponent` en `imports` del módulo o componente consumidor; no lo declares en `declarations`.

```typescript
import { of } from 'rxjs';
import { ConfigReporte, ReporteService, FORMATEADORES_INSTITUCIONALES } from '../../../libraries/reportes';

const reportes: ConfigReporte[] = [{
  id: 'estudiantes', titulo: 'Estudiantes',
  fuente: of([{ nombres: 'Ana', carrera: 'Sistemas', idSede: 'La Paz', sexo: 'F' }]),
  visibles: ['nombres', 'carrera', 'idSede', 'sexo'],
  filtros: ['carrera', 'idSede'], buscador: 'nombres',
  etiquetas: { idSede: 'Campus' },
  formateadores: { sexo: FORMATEADORES_INSTITUCIONALES['sexo'] },
  umbralSeleccion: 8,
}];

// En un servicio de dominio de la aplicación:
constructor(private readonly reportes: ReporteService) {}
inicializar(): void { this.reportes.registrarVarios(reportes); }
```

```html
<ucb-reporte-container reporteId="estudiantes"
  (cargado)="manejarCarga($event)"
  (errorCarga)="manejarError($event)">
</ucb-reporte-container>
```

Registra las configuraciones antes de renderizar sus contenedores. `registrar` acepta una configuración; `registrarVarios` acepta un array. Cada `id` identifica un reporte. El contenedor lo inicia automáticamente; `cargar(id)` actualiza y `cambiarOrigen(id, origen, cambios?)` reemplaza la fuente y puede cambiar configuración:

```typescript
this.reportes.cambiarOrigen('estudiantes', { endpoint: '/api/estudiantes' }, { filtros: ['carrera'] });
// O bien: { fuente: miServicio.obtenerEstudiantes() }
```

Usa una sola fuente: `endpoint` HTTP(S) o relativo, o `fuente` observable de `Record<string, unknown>[]`. Las respuestas con otra estructura deben transformarse en el servicio consumidor. Una dirección con espacios internos o caracteres invisibles se rechaza. Las cargas anteriores se cancelan al cambiar el origen.

El desarrollador define `visibles`, `filtros` y `buscador` en el arreglo de configuración de la aplicación, usando las claves originales de la API. El usuario puede usar los filtros y el buscador configurados, pero no cambiar la definición del reporte desde la interfaz. Si `visibles` está ausente o vacío se muestran todas las claves detectadas. `filtros` y `buscador` son opcionales. Los filtros se combinan con AND; a partir de nueve opciones se usa una lista de sugerencias. El umbral se ajusta con `umbralSeleccion`.

Las etiquetas manuales tienen prioridad sobre `DICCIONARIO_COLUMNAS`, sus coincidencias aproximadas inequívocas y la humanización. Para una etiqueta específica utiliza `etiquetas`; para ampliar las equivalencias compartidas, agrega la clave normalizada y su etiqueta a `DICCIONARIO_COLUMNAS` en la librería. Los formateadores son funciones por clave `(valor, registro) => string`; proporciona uno en `formateadores` para una convención de API particular. Los ejemplos institucionales de sexo y estado son optativos. Fechas ISO y valores vacíos se presentan automáticamente.

`errorCarga` aporta mensaje y detalle para manejo de aplicación, pero el detalle no se muestra en la interfaz. `cargado` emite la cantidad de registros recibidos. Las instancias se aíslan por identificador y por controles visuales.

El ejemplo ejecutable se encuentra en `src/app/components/pruebas-octavio/`: el reporte de nominaciones consulta el endpoint institucional y el ejemplo de carreras usa datos locales. El endpoint debe estar disponible y permitir CORS desde el origen de la aplicación. Validar con `npm run build` y `npm test -- --watch=false` con Chrome disponible.
