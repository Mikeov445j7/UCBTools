# Combobox dinámico

## Objetivo

Componente de presentación (`<ucb-combobox-dinamico>`) de búsqueda con autocompletado genérico. Emite el término escrito (con `debounceTime` de 300 ms) y muestra los resultados que recibe, construyendo el título y el subtítulo de cada fila a partir de claves configurables del objeto.

Qué **no** hace:

- No busca por sí mismo ni accede a la red: el consumidor escucha `terminoBuscado`, consulta su servicio de aplicación y devuelve los datos por `resultados`.
- No conoce la forma de los objetos: solo lee las claves que se le indican.

## Origen

Proviene de `sgt-multitools/projects/ui-marco/src/lib/shared-components/combobox-dinamico/combobox-dinamico.component.{ts,html,scss}` (`ComboboxDinamicoComponent`, selector `lib-combobox-dinamico`). En sgt-multitools no lo usaba ninguna plantilla; era una herramienta genérica exportada.

Cambios respecto al original:

| Original | UCBTools |
|---|---|
| `any` en entradas, salidas y métodos | Tipo `ElementoComboboxDinamico = Record<string, unknown>` |
| `alEscribir(event: any)` | `alEscribir(event: Event)` leyendo `HTMLInputElement.value` |
| `item.id` en la plantilla | `item['id']` (requisito de `noPropertyAccessFromIndexSignature`) |
| Clases sin prefijo y tokens de sgt | Clases BEM `combobox-dinamico__*` y estilo de campo/opción de la página de inicio de UCBTools |

La API pública (entradas y salidas) se mantiene igual.

## Estructura

```text
libraries/combobox-dinamico/
├── index.ts
├── combobox-dinamico.model.ts
├── combobox-dinamico.component.ts
├── combobox-dinamico.component.html
├── combobox-dinamico.component.scss
├── combobox-dinamico.module.ts
└── README.md
```

## Creación (paso a paso)

Se siguió la Opción B (`NgModule`) de `libraries/README.md`:

1. Crear la carpeta `libraries/combobox-dinamico/`.
2. Definir el tipo `ElementoComboboxDinamico` en `combobox-dinamico.model.ts`.
3. Crear `ComboboxDinamicoComponent` con `standalone: false`, prefijo `ucb-`, y la misma API de entradas y salidas que el original, tipada.
4. Conservar la lógica de `Subject` + `debounceTime(300)` + `distinctUntilChanged()` + filtro de término vacío, y liberar la suscripción en `ngOnDestroy`.
5. Escribir estilos locales con los valores de la página de inicio.
6. Declarar y exportar el componente en `ComboboxDinamicoModule`, que importa `CommonModule`.
7. Publicar la API en `index.ts`.

## Publicación

`index.ts` exporta:

- `ElementoComboboxDinamico` (tipo).
- `ComboboxDinamicoComponent`.
- `ComboboxDinamicoModule`.

No es un paquete npm: se consume con una ruta relativa a la carpeta de la librería. Desde un módulo en `src/app/<carpeta>/`:

```ts
import { ComboboxDinamicoModule } from '../../../libraries/combobox-dinamico';

@NgModule({
  imports: [ComboboxDinamicoModule],
})
export class EjemploModule {}
```

La librería está registrada en el índice de `libraries/README.md`.

## API

### Entradas

| Input | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `resultados` | `ElementoComboboxDinamico[]` | `[]` | Elementos a mostrar en la lista desplegable. |
| `placeholder` | `string` | `'Buscar...'` | Texto de ayuda del campo. |
| `etiqueta` | `string` | `''` | Etiqueta visible del campo. Si está vacía, se usa `placeholder` como etiqueta oculta para lectores de pantalla. |
| `keysTitulo` | `string[]` | `['nombres', 'primerApellido', 'segundoApellido']` | Claves cuyos valores (no vacíos) se unen con espacio para formar el título. |
| `keySubtitulo` | `string` | `'documentoIdentidad'` | Clave del valor del subtítulo. |
| `prefijoSubtitulo` | `string` | `'CI: '` | Prefijo del subtítulo. |

### Salidas

| Output | Tipo | Descripción |
|---|---|---|
| `terminoBuscado` | `string` | Término escrito tras 300 ms sin cambios. Emite `''` cuando el campo queda vacío. |
| `itemSeleccionado` | `ElementoComboboxDinamico` | Elemento elegido. Después de emitir, el componente vacía la lista y el campo. |

### Modelo

```ts
export type ElementoComboboxDinamico = Record<string, unknown>;
```

## Uso

```html
<ucb-combobox-dinamico
  etiqueta="Buscar persona"
  placeholder="Buscar persona por nombre..."
  [resultados]="resultadosPersonas"
  (terminoBuscado)="buscarPersonas($event)"
  (itemSeleccionado)="seleccionarPersona($event)"
></ucb-combobox-dinamico>
```

```ts
buscarPersonas(termino: string): void {
  if (!termino) {
    this.resultadosPersonas = [];
    return;
  }
  this.personaService.buscarPersonas(termino).subscribe({
    next: (lista) => (this.resultadosPersonas = lista),
    error: () => (this.resultadosPersonas = []),
  });
}
```

## Estilos

- Tipografía: la del cuerpo de la página de inicio de UCBTools (heredada de `src/styles.scss`). La librería no declara ni descarga fuentes; los íconos usan la fuente Material Icons que `src/index.html` ya cargaba antes de la migración.
- Colores: la misma paleta del selector de sede de la página de inicio (blanco, `#f8fafc`, grises `#dfe7f1`/`#e2e8f0`/`#475569`, texto `#0f172a` y azules claros `#e0f2fe`/`#dbeafe`/`#93c5fd`/`#3b82f6`/`#2563eb`). No se usan amarillos ni el azul institucional oscuro.

## Responsividad

El campo ocupa el 100 % del ancho disponible y la lista desplegable tiene una altura máxima de `min(320px, 50vh)` para no cubrir toda la pantalla en móviles.

## Accesibilidad

Implementa el patrón ARIA *combobox* con lista emergente:

- El campo tiene una etiqueta asociada (`<label for>`), `role="combobox"`, `aria-expanded`, `aria-controls` y `aria-activedescendant`.
- Los resultados son `role="listbox"`/`role="option"` con identificadores únicos por instancia.
- Teclado: flechas arriba/abajo recorren los resultados, Enter selecciona, Escape cierra y Tab cierra y continúa.
- Una región `role="status"` oculta anuncia cuántos resultados hay disponibles.
- La búsqueda se dispara con el evento `input` (no con `keyup`), así las teclas de navegación no relanzan la búsqueda.
- La lista se cierra al hacer clic fuera del componente.
- El borde del campo y el contorno de foco tienen contraste suficiente (WCAG 1.4.11 y 2.4.7).

## Dependencias

- `@angular/common` (`CommonModule`)
- `rxjs`

No depende de ninguna otra librería de `libraries/` ni de `src/app/`.
