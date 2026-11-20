# Autoridades

## Objetivo

Conjunto de herramientas para consultar y presentar autoridades institucionales:

- `AutoridadesService`: acceso HTTP a los endpoints de autoridades, cargos y regionales.
- Cinco componentes de presentación agrupados en `AutoridadesModule`:
  - `<ucb-selector-regional>`: combo con búsqueda para elegir una regional.
  - `<ucb-lista-autoridades-sede>`: lista seleccionable de autoridades de una sede.
  - `<ucb-detalle-autoridad>`: modal de solo lectura con el detalle de una autoridad.
  - `<ucb-editar-autoridad>`: modal con el formulario de edición de una autoridad.
  - `<ucb-asignar-autoridad>`: modal para elegir una autoridad y ajustar nombre, grado y cargo.

Qué **no** hace:

- Los componentes **no acceden a la red** ni inyectan `AutoridadesService`: reciben datos y estados (`cargando`, `error`) por `@Input()` y comunican acciones por `@Output()`.
- No guarda ni edita en el servidor: el origen no tenía endpoints de alta ni de edición. Los formularios solo emiten el evento `guardar` con los datos; la aplicación decide qué hacer con ellos.

Los cinco componentes forman una sola librería porque comparten modelos (`Autoridad`, `Cargo`, `Regional`), el servicio y sus funciones auxiliares. Separarlos obligaría a duplicar todo eso.

## Origen

Proviene de `sgt-multitools/projects/ui-marco/src/lib/`:

| Origen | Destino |
|---|---|
| `services/autoridades.service.ts` | `services/autoridades.service.ts` (sin los métodos de subdepartamentos y carreras) |
| `models/autoridad.model.ts`, `models/cargo.model.ts` | `models/autoridad.model.ts` |
| `utils/valor-nulo.util.ts` | `utils/autoridad-formato.ts` (`formatearValor`) |
| `utils/cargo-variante.util.ts` | `utils/cargo-variante.ts` |
| `utils/grados-academicos.const.ts` | `utils/grados-academicos.ts` |
| `shared-components/editar-autoridad-modal/combo-local.ts` | `utils/combo-local.ts` (con `subtitulo`, `textoBusqueda` y `alSeleccionar`) |
| `shared-components/lista-autoridades-sede/*` | `lista-autoridades-sede/lista-autoridades-sede.component.*` |
| `shared-components/detalle-autoridad-modal/*` | `detalle-autoridad/detalle-autoridad.component.*` |
| `shared-components/editar-autoridad-modal/*` | `editar-autoridad/editar-autoridad.component.*` |
| `shared-components/modal-agregar-autoridad/*` | `asignar-autoridad/asignar-autoridad.component.*` (solo el flujo activo) |
| `sgt-multitools/projects/ui-combobox-regionales/.../combobox-api.service.ts` | `AutoridadesService.obtenerRegionales()` y `<ucb-selector-regional>` |

Cambios principales:

- Todos los componentes pasan a ser de presentación. La carga de datos que antes hacían por su cuenta (`cargar()`, `cargarCargos()`, `cargarAutoridades()`, `cargarDetalleAutoridad()`) ahora la coordina la pantalla mediante un servicio de aplicación.
- `DetalleAutoridadComponent` usa `visible` en lugar de depender de `idAutoridad !== null`.
- `ListaAutoridadesSedeComponent` usa `trackBy` por `id` (los nombres pueden repetirse).
- Las filas de información e identificadores, que se repetían en tres componentes, se centralizan en `armarInformacionAutoridad` y `armarIdentificadoresAutoridad`.
- `AsignarAutoridadComponent` usa tres instancias de `ComboLocal` en lugar de las implementaciones manuales del original.
- El método `guardar()` vacío del original se reemplaza por `enviar()`, que emite el `@Output() guardar` con los datos del formulario (el método no puede llamarse igual que la salida).
- No se migra el bloque oculto `mostrarCamposAnteriores` del modal de alta (sede, subdepartamento, departamento, facultad, carrera, nombre SGT e interino) ni los endpoints `Catalogos/GetSubDeptosSede` y `Catalogos/GetCarrerasDeptoSede`, porque era código inalcanzable.
- Los estilos usan la paleta de la página de inicio de UCBTools mediante el parcial interno `_autoridades-compartido.scss`.

## Estructura

```text
libraries/autoridades/
├── index.ts
├── autoridades.module.ts
├── _autoridades-compartido.scss
├── README.md
├── models/
│   └── autoridad.model.ts
├── services/
│   └── autoridades.service.ts
├── utils/
│   ├── autoridad-formato.ts
│   ├── cargo-variante.ts
│   ├── combo-local.ts
│   ├── foco-modal.ts
│   ├── grados-academicos.ts
│   └── identificador-unico.ts
├── campo-combo/
│   └── campo-combo.component.ts / .html / .scss
├── selector-regional/
│   └── selector-regional.component.ts / .html / .scss
├── lista-autoridades-sede/
│   └── lista-autoridades-sede.component.ts / .html / .scss
├── detalle-autoridad/
│   └── detalle-autoridad.component.ts / .html / .scss
├── editar-autoridad/
│   └── editar-autoridad.component.ts / .html / .scss
└── asignar-autoridad/
    └── asignar-autoridad.component.ts / .html / .scss
```

Organización:

| Carpeta o archivo | Contenido |
|---|---|
| `models/` | Contratos de datos (`Autoridad`, `Cargo`, `Regional`, `DetalleAutoridad`, `EdicionAutoridad`, `AsignacionAutoridad`). |
| `services/` | `AutoridadesService`, el único punto de acceso HTTP de la librería. |
| `utils/` | Funciones auxiliares internas: formato de valores, variantes de cargo, grados académicos, estado de los combos, foco de los modales e identificadores únicos. |
| `<componente>/` | Una carpeta por componente con sus archivos `.ts`, `.html` y `.scss`. |
| Raíz | Archivos que no pertenecen a un solo grupo: `index.ts` (API pública), `autoridades.module.ts`, el parcial SCSS compartido por todos los componentes y este README. |

Los componentes importan modelos y utilidades con rutas relativas a su carpeta (`../models/autoridad.model`, `../utils/combo-local`) y el parcial SCSS con `@use '../autoridades-compartido' as ac;`. Los consumidores siguen importando solo desde la carpeta de la librería (`libraries/autoridades`), así que la reorganización no cambia la API pública.

Los archivos de `utils/`, `_autoridades-compartido.scss` y `CampoComboComponent` (`ucb-campo-combo`) son **internos**: no se exportan en `index.ts`. `CampoComboComponent` se declara en `AutoridadesModule` pero no se exporta; lo usan el selector de regional y los modales de edición y asignación para dibujar los combos con búsqueda.

## Creación (paso a paso)

Se siguió la Opción B (`NgModule`) de `libraries/README.md`:

1. Crear la carpeta `libraries/autoridades/`.
2. Definir los contratos en `models/autoridad.model.ts`, incluida una copia propia de `Regional` (la librería es autosuficiente).
3. Implementar `AutoridadesService` en `services/autoridades.service.ts` (`providedIn: 'root'`) con `HttpClient`, `HttpParams` y una única `baseUrl`.
4. Copiar las funciones auxiliares a archivos de nombre descriptivo dentro de `utils/` (`autoridad-formato.ts`, `cargo-variante.ts`, `grados-academicos.ts`) y extender `ComboLocal` en `utils/combo-local.ts`.
5. Crear el parcial SCSS interno `_autoridades-compartido.scss` con mixins (`foco-visible`, `solo-lectores`, `overlay-modal`, `modal`, `encabezado-modal`, `campo`, `input`, `etiqueta`, `combo`, `switch`, `badges`, `grid-datos`, `pie-botones`, `estados`). Cada componente lo incluye con `@use '../autoridades-compartido' as ac;`.
6. Crear los cinco componentes, cada uno en su propia carpeta, con `standalone: false`, prefijo `ucb-`, sin inyectar el servicio.
7. Declararlos y exportarlos en `AutoridadesModule`, que importa `CommonModule`, `ReactiveFormsModule` y `MatIconModule`.
8. Publicar la API en `index.ts`.

## Publicación

`index.ts` exporta:

- Modelos: `Autoridad`, `Cargo`, `Regional`, `DetalleAutoridad`, `EdicionAutoridad`, `AsignacionAutoridad`.
- Servicio: `AutoridadesService`.
- Componentes: `SelectorRegionalComponent`, `ListaAutoridadesSedeComponent`, `DetalleAutoridadComponent`, `EditarAutoridadComponent`, `AsignarAutoridadComponent`.
- Módulo: `AutoridadesModule`.

No es un paquete npm: se consume con una ruta relativa a la carpeta de la librería. Desde `src/app/<carpeta>/`:

```ts
import { Autoridad, AutoridadesModule, Regional } from '../../../libraries/autoridades';
```

La aplicación debe registrar `HttpClientModule` (o `provideHttpClient()`) una sola vez; UCBTools ya lo hace en `AppModule`. La librería está registrada en el índice de `libraries/README.md`.

## API

### Servicio `AutoridadesService`

Base: `https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api`

| Método | Endpoint | Retorno |
|---|---|---|
| `obtenerRegionales()` | `GET /Catalogos/GetRegionales` | `Observable<Regional[]>` |
| `obtenerAutoridadesPorSede(idSede)` | `GET /Autoridades/GetAutoridadesSede?idSede=` | `Observable<Autoridad[]>` |
| `obtenerAutoridadPorId(idAutoridad)` | `GET /Autoridades/GetAutoridad?idAutoridad=` | `Observable<Autoridad>` (toma el primer elemento si llega un arreglo; lanza `Error` si no hay resultado) |
| `obtenerCargos()` | `GET /Autoridades/GetAllCargosAutoridades` | `Observable<Cargo[]>` |
| `obtenerTodasLasAutoridades()` | `GET /Autoridades/GetAllAutoridad` | `Observable<Autoridad[]>` |

### `<ucb-selector-regional>`

| Input | Tipo | Defecto |
|---|---|---|
| `regionales` | `Regional[]` | `[]` |
| `idSeleccionado` | `number \| null` | `null` |
| `cargando` | `boolean` | `false` |
| `error` | `boolean` | `false` |
| `placeholder` | `string` | `'Seleccione una regional...'` |
| `etiqueta` | `string` | `'Regional'` |
| `ocultarEtiqueta` | `boolean` | `true` (la etiqueta existe solo para lectores de pantalla) |

| Output | Tipo | Cuándo |
|---|---|---|
| `regionalChange` | `Regional \| null` | Al elegir una regional o vaciar el campo. |
| `reintentar` | `void` | Al pulsar Reintentar tras un error. |

### `<ucb-lista-autoridades-sede>`

| Input | Tipo | Defecto |
|---|---|---|
| `autoridades` | `Autoridad[]` | `[]` |
| `idSede` | `number \| null` | `null` |
| `cargando` | `boolean` | `false` |
| `error` | `boolean` | `false` |
| `etiqueta` | `string` | `'Autoridades de la sede'` (nombre accesible de la lista) |

| Output | Tipo | Cuándo |
|---|---|---|
| `autoridadSeleccionada` | `number` (id) | Al activar el botón de una autoridad (clic, Enter o Espacio). |
| `reintentar` | `void` | Al pulsar Reintentar tras un error. |

### `<ucb-detalle-autoridad>`

| Input | Tipo | Defecto |
|---|---|---|
| `visible` | `boolean` | `false` |
| `autoridad` | `Autoridad \| null` | `null` |
| `cargando` | `boolean` | `false` |
| `error` | `boolean` | `false` |

| Output | Tipo | Cuándo |
|---|---|---|
| `cerrar` | `void` | Botón cerrar, clic en el fondo o Escape (solo si está visible). |
| `reintentar` | `void` | Al pulsar Reintentar tras un error. |

### `<ucb-editar-autoridad>`

| Input | Tipo | Defecto |
|---|---|---|
| `autoridad` | `Autoridad \| null` | `null` |
| `cargos` | `Cargo[]` | `[]` |
| `cargandoCargos` | `boolean` | `false` |
| `errorCargos` | `boolean` | `false` |

| Output | Tipo | Cuándo |
|---|---|---|
| `cerrar` | `void` | Cancelar, botón cerrar, clic en el fondo o Escape. |
| `guardar` | `EdicionAutoridad` | Al enviar el formulario. |
| `reintentarCargos` | `void` | Reintentar dentro del combo de cargos. |

### `<ucb-asignar-autoridad>`

| Input | Tipo | Defecto |
|---|---|---|
| `autoridades` | `Autoridad[]` | `[]` |
| `cargandoAutoridades` / `errorAutoridades` | `boolean` | `false` |
| `detalle` | `Autoridad \| null` | `null` |
| `cargandoDetalle` / `errorDetalle` | `boolean` | `false` |
| `cargos` | `Cargo[]` | `[]` |
| `cargandoCargos` / `errorCargos` | `boolean` | `false` |

| Output | Tipo | Cuándo |
|---|---|---|
| `cerrar` | `void` | Cancelar, botón cerrar, clic en el fondo o Escape. |
| `autoridadElegida` | `Autoridad \| null` | Al elegir una autoridad (la pantalla debe cargar su detalle) o vaciar el campo. |
| `reintentarAutoridades` | `void` | Reintentar en el combo de autoridades. |
| `reintentarDetalle` | `void` | Reintentar al fallar el detalle. |
| `reintentarCargos` | `void` | Reintentar en el combo de cargos. |
| `guardar` | `AsignacionAutoridad` | Al enviar el formulario con una autoridad elegida. |

Los cargos ofrecidos se filtran por la variante del cargo actual (por ejemplo, "Director" y "Directora"). Si no hay coincidencias, se ofrecen todos.

### Modelos

```ts
export interface Autoridad {
  id: number;
  idPersona: number;
  gradoAcad: string;
  nombreCompleto: string;
  nombreSgt: string | null;
  cargo: string;
  nombreSede: string;
  interino: number;
  idSede: number;
  idCargo: number;
  departamento: string;
  facultad: string;
  nombreCarrera: string;
  idDepto: number;
  idSubDepto: number;
  idFacultad: number;
}

export interface Cargo { id: number; descripcion: string; observaciones: string | null; }
export interface Regional { idRegional: number; siglaRegional: string; nomRegional: string; }
export interface DetalleAutoridad { etiqueta: string; valor: string; }

export interface EdicionAutoridad {
  idAutoridad: number;
  nombreCompleto: string;
  gradoAcad: string | null;
  nombreSgt: string;
  idCargo: number | null;
  interino: boolean;
  nombreSede: string;
  facultad: string;
  departamento: string;
  nombreCarrera: string;
}

export interface AsignacionAutoridad {
  idAutoridad: number;
  nombreCompleto: string;
  gradoAcad: string | null;
  idCargo: number | null;
}
```

## Uso

La dirección de dependencias es **pantalla → servicio de aplicación → servicio de la librería**. La pantalla usa directamente los componentes visuales.

### Servicio de aplicación (`src/app/services/autoridad.service.ts`)

```ts
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Autoridad, AutoridadesService, Cargo, Regional } from '../../../libraries/autoridades';

@Injectable({ providedIn: 'root' })
export class AutoridadService {
  constructor(private readonly autoridadesService: AutoridadesService) {}

  obtenerRegionales(): Observable<Regional[]> {
    return this.autoridadesService.obtenerRegionales();
  }

  obtenerAutoridadesPorSede(idSede: number): Observable<Autoridad[]> {
    return this.autoridadesService
      .obtenerAutoridadesPorSede(idSede)
      .pipe(map((lista) => (Array.isArray(lista) ? lista : [])));
  }

  obtenerAutoridad(idAutoridad: number): Observable<Autoridad> {
    return this.autoridadesService.obtenerAutoridadPorId(idAutoridad);
  }

  obtenerCargos(): Observable<Cargo[]> {
    return this.autoridadesService.obtenerCargos();
  }
}
```

### Pantalla

```html
<ucb-selector-regional
  [regionales]="regionales"
  [cargando]="cargandoRegionales"
  [error]="errorRegionales"
  (regionalChange)="alCambiarRegional($event)"
  (reintentar)="cargarRegionales()"
></ucb-selector-regional>

<ucb-lista-autoridades-sede
  [autoridades]="autoridadesSede"
  [idSede]="regionalSeleccionada?.idRegional ?? null"
  [cargando]="cargandoAutoridadesSede"
  [error]="errorAutoridadesSede"
  (autoridadSeleccionada)="cargarDetalle($event)"
  (reintentar)="cargarAutoridadesSede()"
></ucb-lista-autoridades-sede>

<ucb-detalle-autoridad
  [visible]="idAutoridadSeleccionada !== null"
  [autoridad]="autoridadDetalle"
  [cargando]="cargandoDetalle"
  [error]="errorDetalle"
  (cerrar)="cerrarDetalle()"
  (reintentar)="cargarDetalle(idAutoridadSeleccionada)"
></ucb-detalle-autoridad>

<ucb-editar-autoridad
  *ngIf="autoridadEnEdicion"
  [autoridad]="autoridadEnEdicion"
  [cargos]="cargos"
  [cargandoCargos]="cargandoCargos"
  [errorCargos]="errorCargos"
  (cerrar)="cerrarEdicion()"
  (guardar)="guardarEdicion($event)"
  (reintentarCargos)="cargarCargos()"
></ucb-editar-autoridad>
```

La demostración completa está en `src/app/testAdrian/`.

## Estilos

- Tipografía: la del cuerpo de la página de inicio de UCBTools (heredada de `src/styles.scss`). La librería no declara ni descarga fuentes; los íconos usan la fuente Material Icons que `src/index.html` ya cargaba antes de la migración.
- Colores: la misma paleta del selector de sede de la página de inicio (blanco, `#f8fafc`, grises `#dfe7f1`/`#e2e8f0`/`#475569`, texto `#0f172a` y azules claros `#e0f2fe`/`#dbeafe`/`#93c5fd`/`#3b82f6`/`#2563eb`). No se usan amarillos ni el azul institucional oscuro.

## Responsividad

- Hasta 640 px los modales se muestran como hoja inferior a ancho completo (`92dvh` de alto máximo), con encabezado y cuerpo más compactos y los botones del pie en dos columnas.
- Las grillas de datos usan `minmax(min(220px, 100%), 1fr)`, por lo que pasan a una columna sin desbordar.
- Las listas desplegables de los combos tienen una altura máxima de `min(16rem, 40vh)`.

## Accesibilidad

- **Modales** (`detalle`, `editar`, `asignar`): `role="dialog"`, `aria-modal="true"` y nombre accesible por su título `<h2>` (con texto de respaldo mientras carga). Al abrirse mueven el foco al diálogo, mantienen el foco dentro con Tab/Mayús+Tab y, al cerrarse, lo devuelven al elemento que los abrió (`utils/foco-modal.ts`). Escape cierra el modal, salvo cuando hay una lista desplegada, que se cierra primero.
- **Combos** (`ucb-campo-combo`): patrón ARIA *combobox* con `<label for>`, `aria-expanded`, `aria-controls`, `aria-activedescendant` y `role="listbox"` nombrado por su etiqueta. Los mensajes de carga y "sin resultados" quedan fuera del `listbox`; el error y su botón Reintentar se muestran debajo del campo (alcanzables con Tab) y una región `role="status"` anuncia cuántas opciones hay.
- **Identificadores únicos** por instancia (`utils/identificador-unico.ts`) para títulos, etiquetas y opciones, evitando `id` repetidos si un componente se usa más de una vez.
- **Lista de autoridades**: lista de botones nativos (`aria-haspopup="dialog"`, `aria-current` en la elegida) con nombre accesible; la carga y el resultado se anuncian con `aria-live`, y los errores con `role="alert"`.
- **Datos de solo lectura** como listas de descripción (`<dl>`, `<dt>`, `<dd>`).
- **Interruptor "Interino"**: `role="switch"` con etiqueta; el texto "Sí/No" visible es decorativo para no duplicar el estado.
- **Contraste**: borde de campos `#3b82f6` y pista del interruptor apagado `#475569` (al menos 3:1, WCAG 1.4.11); foco visible con contorno `#2563eb`; botones de cierre de 44 px.
- Botones de cierre con `aria-label="Cerrar"` y la `×` decorativa; íconos de Material decorativos; se respeta `prefers-reduced-motion`.

## Dependencias

- `@angular/common` (`CommonModule`) y `@angular/common/http` (`HttpClient`)
- `@angular/forms` (`ReactiveFormsModule`)
- `@angular/material/icon` (`MatIconModule`)
- `rxjs`

No depende de ninguna otra librería de `libraries/` ni de `src/app/`.
