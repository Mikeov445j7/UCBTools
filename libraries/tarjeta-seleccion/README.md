# Tarjeta de Selección

## Objetivo

Componente visual reutilizable (`<ucb-tarjeta-seleccion>`) para representar ítems seleccionables en listados maestro-detalle (con cinta de selección activa, tags superior izquierdo/derecho, subtítulo opcional en cursiva y badge de estado en variantes `amarillo`, `verde` y `azul`).

## Estructura

```text
libraries/tarjeta-seleccion/
├── index.ts
├── tarjeta-seleccion.model.ts
├── tarjeta-seleccion.component.ts
├── tarjeta-seleccion.component.html
├── tarjeta-seleccion.component.scss
├── tarjeta-seleccion.module.ts
└── README.md
```

## Integración (`NgModule`)

```ts
import { TarjetaSeleccionModule } from '../../libraries/tarjeta-seleccion';

@NgModule({
  imports: [TarjetaSeleccionModule],
})
export class EjemploModule {}
```

## Uso

```html
<ucb-tarjeta-seleccion
  [seleccionada]="indiceSeleccionado === i"
  [inactiva]="indiceSeleccionado !== null && indiceSeleccionado !== i"
  tagIzquierdo="SIS · N° 102"
  tagDerecho="LA PAZ"
  titulo="Ingeniería de Sistemas"
  subtitulo="Sistema de Gestión Académica"
  [subtituloCursiva]="true"
  metaPrincipalEtiqueta="Defensa:"
  metaPrincipalValor="15/10/2026"
  metaSecundarioIzquierda="📍 Virtual"
  badgeDerecha="Nota: 95 pts."
  tipoBadge="verde"
  (seleccionar)="seleccionar(i)"
></ucb-tarjeta-seleccion>
```
