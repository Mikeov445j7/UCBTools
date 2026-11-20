# Marco de aplicación

## Objetivo

Componente de presentación (`<ucb-marco-aplicacion>`) que dibuja el marco visual de un sistema: cabecera con el título y la sección actual, enlace "Volver al menú", área de contenido y pie de página.

Qué **no** hace:

- No define rutas ni impone un `<router-outlet>`: el consumidor proyecta su contenido con `ng-content` (incluido su propio `<router-outlet>`, si lo necesita).
- No accede a la red.

## Origen

Proviene de `sgt-multitools/projects/ui-marco/src/lib/`:

- `ui-marco/ui-marco.component.{ts,html,scss}` (`UiMarcoComponent`, selector `lib-ui-marco`).
- `models/menu-item.model.ts` (`MenuItem`).

Cambios respecto al original:

| Original | UCBTools |
|---|---|
| `@Input() menu: MenuItem[]` | `@Input() secciones: MarcoSeccion[]` |
| Inicio fijo en `'/'` | `@Input() rutaInicio = '/'`, usado para `enInicio` y para el enlace "Volver al menú" |
| `<router-outlet>` dentro de `<main>` | `<ng-content>` dentro de `<main>` |
| Variables `--ui-marco-*`, cabecera azul y franja dorada con `::after` | Cabecera y pie claros (`#f8fafc` con borde `#dfe7f1`), sección actual como pastilla `#e0f2fe` y enlace "Volver al menú" con estilo de opción del selector de sede |

## Estructura

```text
libraries/marco-aplicacion/
├── index.ts
├── marco-aplicacion.model.ts
├── marco-aplicacion.component.ts
├── marco-aplicacion.component.html
├── marco-aplicacion.component.scss
├── marco-aplicacion.module.ts
└── README.md
```

## Creación (paso a paso)

Se siguió la Opción B (`NgModule`) de `libraries/README.md`:

1. Crear la carpeta `libraries/marco-aplicacion/`.
2. Definir el contrato `MarcoSeccion` en `marco-aplicacion.model.ts`.
3. Crear `MarcoAplicacionComponent` con `standalone: false`, prefijo `ucb-` y las entradas `titulo`, `secciones` y `rutaInicio`.
4. Suscribirse a `Router.events` (solo `NavigationEnd`) para recalcular `enInicio`, y liberar la suscripción en `ngOnDestroy`.
5. Reemplazar `<router-outlet>` por `<ng-content>` en la plantilla.
6. Escribir los estilos locales con la paleta del selector de sede de la página de inicio (sin hojas globales nuevas ni fuentes externas).
7. Declarar y exportar el componente en `MarcoAplicacionModule`, que importa `CommonModule`, `RouterModule` y `MatIconModule`.
8. Publicar la API en `index.ts`.

## Publicación

`index.ts` exporta:

- `MarcoSeccion` (modelo).
- `MarcoAplicacionComponent`.
- `MarcoAplicacionModule`.

No es un paquete npm: se consume con una ruta relativa a la carpeta de la librería. Desde un módulo en `src/app/<carpeta>/`:

```ts
import { MarcoAplicacionModule, MarcoSeccion } from '../../../libraries/marco-aplicacion';

@NgModule({
  imports: [MarcoAplicacionModule],
})
export class EjemploModule {}
```

La librería está registrada en el índice de `libraries/README.md`.

## API

### Entradas

| Input | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `titulo` | `string` | `'Sistema'` | Título de la cabecera y del pie. |
| `secciones` | `MarcoSeccion[]` | `[]` | Secciones conocidas; la que coincide con `router.url` se muestra junto al título. |
| `rutaInicio` | `string` | `'/'` | Ruta considerada inicio. En ella se ocultan la sección y el enlace "Volver al menú". |
| `esPrincipal` | `boolean` | `true` | Indica si el marco es la estructura principal de la página. Con `true` usa las regiones `banner`, `main` y `contentinfo`; con `false` (marco incrustado dentro de otra página) no las declara, para no duplicar regiones. |

### Salidas

No tiene.

### Modelo

```ts
export interface MarcoSeccion {
  id: number | string;
  descripcion: string;
  ruta: string;
  icono: string;
}
```

## Uso

```html
<ucb-marco-aplicacion titulo="Sistema de Titulaciones" [secciones]="secciones" rutaInicio="/">
  <router-outlet></router-outlet>
</ucb-marco-aplicacion>
```

El host ocupa `100vh`. Para usarlo dentro de una página, el consumidor puede limitar su altura desde su propio SCSS.

## Estilos

- Tipografía: la del cuerpo de la página de inicio de UCBTools (heredada de `src/styles.scss`). La librería no declara ni descarga fuentes; los íconos usan la fuente Material Icons que `src/index.html` ya cargaba antes de la migración.
- Colores: la misma paleta del selector de sede de la página de inicio (blanco, `#f8fafc`, grises `#dfe7f1`/`#e2e8f0`/`#475569`, texto `#0f172a` y azules claros `#e0f2fe`/`#dbeafe`/`#93c5fd`/`#3b82f6`/`#2563eb`). No se usan amarillos ni el azul institucional oscuro.

## Responsividad

- En pantallas de hasta 650 px la cabecera se apila, el título puede ocupar varias líneas y el enlace "Volver al menú" ocupa todo el ancho.
- La altura usa `100dvh` (con `100vh` de respaldo) para no quedar oculta tras las barras del navegador móvil.

## Accesibilidad

- El título del sistema se muestra como texto de marca, no como `<h1>`: el `<h1>` corresponde al contenido proyectado de cada pantalla.
- La sección actual se anuncia como "sección actual: ..."; la barra separadora es decorativa (`aria-hidden`).
- Los íconos de Material son decorativos (`aria-hidden="true"`).
- El enlace "Volver al menú" tiene foco visible (contorno `#2563eb`) y un área táctil mínima de 44 px.
- Con `esPrincipal = false` no se crean regiones `banner`/`main`/`contentinfo` repetidas.
- Se respeta `prefers-reduced-motion`.

## Dependencias

- `@angular/common` (`CommonModule`)
- `@angular/router` (`RouterModule`)
- `@angular/material/icon` (`MatIconModule`)

No depende de ninguna otra librería de `libraries/` ni de `src/app/`.
