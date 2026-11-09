# Selector de sede

Componente Angular reutilizable que obtiene las sedes del servicio institucional de Trámites y emite la sede seleccionada.

## Servicio

```text
GET https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes
```

Respuesta esperada:

```json
[
  {
    "idSede": 140,
    "sigla": "SRE",
    "nombre": "SEDE LA PLATA - SUCRE"
  }
]
```

## Uso en una aplicación Angular

Importa el componente standalone en el componente que lo utilizará y escucha el evento `sedeChange`:

```ts
import { Component } from '@angular/core';
import { SelectorSedeComponent, Sede } from './libraries/selector-sede';

@Component({
  standalone: true,
  imports: [SelectorSedeComponent],
  template: `
    <ucb-selector-sede (sedeChange)="sede = $event" />
    @if (sede) {
      <p>Sede seleccionada: {{ sede.nombre }} ({{ sede.idSede }})</p>
    }
  `,
})
export class MiFormularioComponent {
  sede: Sede | null = null;
}
```

La aplicación debe configurar `provideHttpClient()` en sus proveedores. El servidor de la API debe permitir solicitudes CORS desde el origen de la aplicación.

El componente no solicita datos durante SSR; carga las sedes en el navegador. Si el servicio no está disponible o devuelve datos con formato inesperado, se muestra un error y una opción para volver a intentar.

El `index.ts` de la carpeta es el punto de entrada público de la biblioteca en este repositorio. La publicación del paquete y su nombre de importación para otros repositorios todavía deben configurarse.
