# Selector de sede

Biblioteca Angular reutilizable que obtiene las sedes del servicio institucional de Trámites y ofrece un componente de presentación para seleccionarlas. El servicio HTTP permanece dentro de esta biblioteca; cada aplicación coordina su uso desde el servicio de dominio correspondiente.

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

## Integración en una aplicación Angular

El servicio de aplicación consume el servicio de la biblioteca:

```ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SedeService as SelectorSedeService, type Sede } from '@ucb/ucbtools/selector-sede';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  constructor(private readonly selectorSede: SelectorSedeService) {}

  obtenerSedes(): Observable<Sede[]> {
    return this.selectorSede.obtenerSedes();
  }
}
```

La pantalla llama a `CatalogoService`, administra el estado de carga y entrega los datos al componente visual:

```html
<ucb-selector-sede
  [sedes]="sedes"
  [sedeSeleccionada]="sedeSeleccionada"
  [cargando]="cargando"
  [error]="error"
  (sedeChange)="sedeSeleccionada = $event"
  (reintentar)="cargarSedes()"
/>
```

`SelectorSedeComponent` es de presentación: recibe `sedes`, `sedeSeleccionada`, `cargando` y `error`; emite `sedeChange` y `reintentar`. No hace solicitudes HTTP ni contiene reglas de negocio. La aplicación que consuma el servicio HTTP de la biblioteca debe configurar `provideHttpClient()` y el servidor de la API debe permitir solicitudes CORS desde su origen.

La aplicación de ejemplo de este repositorio demuestra esta separación en `src/app/services/catalogo.service.ts` y `src/app/app.component.ts`. Si el servicio falla o devuelve datos con formato inesperado, la pantalla muestra un error y permite volver a intentar.

El `index.ts` de la carpeta es el punto de entrada público de la biblioteca en este repositorio. La publicación del paquete y su nombre de importación para otros repositorios todavía deben configurarse.
