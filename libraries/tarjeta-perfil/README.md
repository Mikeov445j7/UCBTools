# Tarjeta de Perfil

## Objetivo

Componente visual reutilizable (`<ucb-tarjeta-perfil>`) para mostrar la ficha de una persona o estudiante mediante una lista simple de detalles o secciones categorizadas, resaltando automáticamente datos faltantes o inconsistentes.

## Estructura

```text
libraries/tarjeta-perfil/
├── index.ts
├── tarjeta-perfil.model.ts
├── tarjeta-perfil.component.ts
├── tarjeta-perfil.component.html
├── tarjeta-perfil.component.scss
├── tarjeta-perfil.module.ts
└── README.md
```

## Integración (`NgModule`)

Importa `TarjetaPerfilModule` en el `NgModule` consumidor:

```ts
import { TarjetaPerfilModule } from '../../libraries/tarjeta-perfil';

@NgModule({
  imports: [TarjetaPerfilModule],
})
export class EjemploModule {}
```

## Uso

```html
<ucb-tarjeta-perfil
  [persona]="personaSeleccionada"
  [detalles]="detallesSimples"
  [secciones]="seccionesTarjeta"
></ucb-tarjeta-perfil>
```

### Entradas

- `persona`: objeto de persona o perfil (`PersonaPerfil | null`).
- `detalles`: arreglo `TarjetaDetalle[]` para vista simple (se muestra cuando `secciones` está vacío).
- `secciones`: arreglo `TarjetaSeccion[]` para vista agrupada por bloques.
