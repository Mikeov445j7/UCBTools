# Menú de tarjetas

## Objetivo

Componente de presentación (`<ucb-menu-tarjetas>`) que muestra una grilla de tarjetas navegables, cada una con un ícono de Material, un texto y un tooltip. Cada tarjeta enlaza a su ruta con `routerLink`.

Qué **no** hace:

- No decide qué opciones mostrar ni consulta permisos: recibe la lista por `@Input()`.
- No accede a la red.

## Origen

Proviene de `sgt-multitools/projects/ui-marco/src/lib/`:

- `shared-components/menu/menu.component.{ts,html,scss}` (`MenuComponent`, selector `lib-menu`).
- `models/menu-item.model.ts` (`MenuItem`).
- `styles/_mixins.scss` (solo la animación `fade-in-pop`).
- `styles/_componentes.scss` (solo `.tarjeta` y `.tarjeta--interactiva`).

Cambios respecto al original:

| Original | UCBTools |
|---|---|
| Modelo `MenuItem` | Modelo propio `MenuTarjetaItem` (la librería es autosuficiente) |
| Clases globales `tarjeta tarjeta--interactiva menu-card` | Clase local `menu-tarjetas__tarjeta` |
| `menu-grid` | `menu-tarjetas__grid` |
| `@use '../../styles/mixins'` y keyframes `popIn` | Keyframes locales `menuTarjetasEntrada` con los mismos valores |
| Sin `trackBy` | `trackBy` por `id` |
| Colores de `.tarjeta` de sgt | Estilo "opción" de la página de inicio de UCBTools (fondo blanco, borde `#dbeafe`, radio `12px`) |

## Estructura

```text
libraries/menu-tarjetas/
├── index.ts
├── menu-tarjetas.model.ts
├── menu-tarjetas.component.ts
├── menu-tarjetas.component.html
├── menu-tarjetas.component.scss
├── menu-tarjetas.module.ts
└── README.md
```

## Creación (paso a paso)

Se siguió la Opción B (`NgModule`) de `libraries/README.md`:

1. Crear la carpeta `libraries/menu-tarjetas/`.
2. Definir el contrato `MenuTarjetaItem` en `menu-tarjetas.model.ts`.
3. Crear `MenuTarjetasComponent` con `standalone: false`, prefijo `ucb-` y la entrada `items`.
4. Copiar la plantilla original sustituyendo las clases globales por clases BEM locales y agregar `trackBy`.
5. Llevar al SCSS del componente la grilla, el tooltip, la animación escalonada, los breakpoints y `prefers-reduced-motion`, usando la paleta del selector de sede de la página de inicio.
6. Declarar y exportar el componente en `MenuTarjetasModule`, que importa `CommonModule`, `RouterModule` y `MatIconModule`.
7. Publicar la API en `index.ts`.

## Publicación

`index.ts` exporta:

- `MenuTarjetaItem` (modelo).
- `MenuTarjetasComponent`.
- `MenuTarjetasModule`.

No es un paquete npm: se consume con una ruta relativa a la carpeta de la librería. Desde un módulo en `src/app/<carpeta>/`:

```ts
import { MenuTarjetaItem, MenuTarjetasModule } from '../../../libraries/menu-tarjetas';

@NgModule({
  imports: [MenuTarjetasModule],
})
export class EjemploModule {}
```

La librería está registrada en el índice de `libraries/README.md`.

## API

### Entradas

| Input | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `items` | `MenuTarjetaItem[]` | `[]` | Opciones del menú. |
| `etiqueta` | `string` | `'Menú de opciones'` | Nombre accesible de la región de navegación (`<nav aria-label>`). |

### Salidas

No tiene. La navegación se realiza con `routerLink`.

### Modelo

```ts
export interface MenuTarjetaItem {
  id: number | string;
  descripcion: string;
  ruta: string;
  icono: string;
}
```

`icono` es el nombre de ligadura de Material Icons (por ejemplo, `home`, `people`, `settings`).

## Uso

```html
<ucb-menu-tarjetas [items]="itemsMenu" etiqueta="Menú principal"></ucb-menu-tarjetas>
```

```ts
itemsMenu: MenuTarjetaItem[] = [
  { id: 1, descripcion: 'Inicio', ruta: '/', icono: 'home' },
  { id: 2, descripcion: 'Autoridades', ruta: '/autoridades', icono: 'groups' },
];
```

## Estilos

- Tipografía: la del cuerpo de la página de inicio de UCBTools (heredada de `src/styles.scss`). La librería no declara ni descarga fuentes; los íconos usan la fuente Material Icons que `src/index.html` ya cargaba antes de la migración.
- Colores: la misma paleta del selector de sede de la página de inicio (blanco, `#f8fafc`, grises `#dfe7f1`/`#e2e8f0`/`#475569`, texto `#0f172a` y azules claros `#e0f2fe`/`#dbeafe`/`#93c5fd`/`#3b82f6`/`#2563eb`). No se usan amarillos ni el azul institucional oscuro.

## Responsividad

- Más de 900 px: tantas columnas como quepan (mínimo 200 px).
- Hasta 900 px: 3 columnas; hasta 560 px: 3 columnas compactas con texto pequeño y sin tooltip (en táctil no hay hover y el tooltip podría desbordar la pantalla); hasta 360 px: 2 columnas.
- El tooltip tiene ancho máximo `min(220px, 80vw)` y admite varias líneas.

## Accesibilidad

- Las tarjetas se agrupan en `<nav>` con nombre accesible y en una lista (`<ul>`/`<li>`), de modo que los lectores de pantalla anuncian la cantidad de opciones.
- El nombre de cada enlace es su texto visible, que se mantiene visible también en móviles.
- La tarjeta de la ruta actual se marca con `aria-current="page"` y un estilo de selección.
- El foco del teclado tiene contorno visible y muestra el mismo realce y tooltip que el hover.
- Los íconos son decorativos y se respeta `prefers-reduced-motion`.

## Dependencias

- `@angular/common` (`CommonModule`)
- `@angular/router` (`RouterModule`)
- `@angular/material/icon` (`MatIconModule`)

No depende de ninguna otra librería de `libraries/` ni de `src/app/`.
