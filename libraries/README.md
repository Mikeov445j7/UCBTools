# Manual para crear y consumir librerías

Esta guía explica dónde ubicar una librería reutilizable, qué archivos crear, cómo publicar su API e importarla en una aplicación Angular. Incluye los dos estilos de integración: componentes standalone y componentes declarados en un `NgModule`.

## 1. Qué debe ser una librería

Una librería contiene una herramienta reutilizable, por ejemplo, un selector, una tabla o un generador de documentos. No debe implementar el proceso de negocio de una aplicación concreta.

- La librería define y mantiene su API reutilizable.
- La aplicación consumidora conecta esa API con sus pantallas y reglas de negocio.
- No importes componentes o servicios de `src/app/` dentro de `libraries/`.

En este repositorio las librerías viven directamente bajo `libraries/`. Actualmente se importan como código local del workspace; todavía no son paquetes npm publicados.

## 2. Dónde crearla y qué archivos usar

Crea una carpeta por herramienta, con un nombre descriptivo en minúsculas y kebab-case:

```text
libraries/
└── selector-ejemplo/
    ├── index.ts
    ├── ejemplo.model.ts                 # Si necesita contratos o tipos
    ├── ejemplo.service.ts                # Si ofrece acceso a datos compartido
    ├── selector-ejemplo.component.ts
    ├── selector-ejemplo.component.html
    ├── selector-ejemplo.component.scss
    └── README.md
```

Los archivos de modelo y servicio son opcionales: crea solo los que la herramienta necesite. Si no tiene interfaz, puede contener únicamente un servicio, modelos y su punto de entrada público.

| Archivo | Responsabilidad |
|---|---|
| `*.model.ts` | Tipos e interfaces que forman parte de la API. |
| `*.service.ts` | Acceso reutilizable a datos o lógica técnica de la herramienta. |
| `*.component.ts` | Selector, entradas, salidas e imports de Angular del componente. |
| `*.component.html` | Plantilla de la interfaz. |
| `*.component.scss` | Estilos encapsulados del componente. |
| `index.ts` | Punto de entrada: exporta solo la API que se permite consumir. |
| `README.md` | Propósito, configuración, API y ejemplo de uso. |

## 3. Elegir standalone o `NgModule`

Para librerías nuevas, usa standalone por defecto. Elige un `NgModule` cuando un consumidor o una necesidad de compatibilidad realmente lo requiera. No mezcles ambos estilos para declarar el mismo componente.

### Opción A: componente standalone (recomendada)

Marca el componente como standalone e importa en él los módulos de Angular que su plantilla utilice:

```ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ucb-selector-ejemplo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector-ejemplo.component.html',
  styleUrls: ['./selector-ejemplo.component.scss'],
})
export class SelectorEjemploComponent {
  @Input() titulo = '';
  @Output() seleccion = new EventEmitter<string>();
}
```

Importa únicamente lo que la plantilla usa; por ejemplo, `FormsModule` para directivas de formularios basados en plantilla. Expón el componente desde `index.ts`:

```ts
export * from './selector-ejemplo.component';
```

Un consumidor standalone agrega el componente a `imports`:

```ts
import { Component } from '@angular/core';

import { SelectorEjemploComponent } from '../../libraries/selector-ejemplo';

@Component({
  standalone: true,
  imports: [SelectorEjemploComponent],
  template: '<ucb-selector-ejemplo [titulo]="titulo" />',
})
export class PaginaComponent {
  titulo = 'Ejemplo';
}
```

En la aplicación actual, que usa `AppModule`, importa el componente standalone en `imports` del módulo. La pantalla consumidora sigue declarada en `declarations`:

```ts
import { SelectorEjemploComponent } from '../../libraries/selector-ejemplo';

@NgModule({
  declarations: [AppComponent, PaginaComponent],
  imports: [BrowserModule, SelectorEjemploComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

No agregues un componente standalone a `declarations`.

### Opción B: componente declarado en un `NgModule`

Usa esta opción para una librería que deba exponer un conjunto de componentes/directivas agrupados o integrarse con consumidores basados en módulos. El componente se declara en un módulo y se exporta desde ese módulo:

```ts
// selector-ejemplo.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ucb-selector-ejemplo',
  standalone: false,
  templateUrl: './selector-ejemplo.component.html',
  styleUrls: ['./selector-ejemplo.component.scss'],
})
export class SelectorEjemploComponent {
  @Input() titulo = '';
  @Output() seleccion = new EventEmitter<string>();
}
```

```ts
// selector-ejemplo.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectorEjemploComponent } from './selector-ejemplo.component';

@NgModule({
  declarations: [SelectorEjemploComponent],
  imports: [CommonModule],
  exports: [SelectorEjemploComponent],
})
export class SelectorEjemploModule {}
```

En este estilo, declara el componente únicamente en `declarations` de su propio módulo. Exportarlo desde el módulo permite que sus consumidores usen su selector.

Publica el módulo —y los tipos o servicios que también formen parte de la API— desde `index.ts`:

```ts
export * from './ejemplo.model';
export * from './ejemplo.service';
export * from './selector-ejemplo.component';
export * from './selector-ejemplo.module';
```

Un consumidor basado en módulos importa el módulo de la librería:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SelectorEjemploModule } from '../../libraries/selector-ejemplo';

@NgModule({
  declarations: [AppComponent, PaginaComponent],
  imports: [BrowserModule, SelectorEjemploModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Un componente standalone también puede agregar un módulo Angular a su arreglo `imports`; en ese caso se consumen los componentes que el módulo exporta:

```ts
import { Component } from '@angular/core';

import { SelectorEjemploModule } from '../../libraries/selector-ejemplo';

@Component({
  standalone: true,
  imports: [SelectorEjemploModule],
  template: '<ucb-selector-ejemplo [titulo]="titulo" />',
})
export class PaginaComponent {
  titulo = 'Ejemplo';
}
```

## 4. Exportar e importar la API pública

El `index.ts` es el punto de entrada público. Exporta únicamente lo que los consumidores necesitan:

```ts
// libraries/selector-ejemplo/index.ts
export * from './ejemplo.model';
export * from './ejemplo.service';
export * from './selector-ejemplo.component';
export * from './selector-ejemplo.module'; // Solo si la librería usa NgModule.
```

Importa desde la carpeta pública de la librería, no desde archivos internos:

```ts
import {
  Ejemplo,
  EjemploService,
  SelectorEjemploComponent,
} from '../../libraries/selector-ejemplo';
```

La ruta relativa depende de la ubicación del archivo consumidor. Sigue el estilo actual del repositorio; no agregues alias de TypeScript sin configurar y validar ese cambio para todo el proyecto.

## 5. Servicios e integración HTTP

Cuando la herramienta necesite un servicio reutilizable, publícalo desde `index.ts`. Para servicios singleton disponibles en la aplicación, sigue el patrón Angular `providedIn: 'root'`:

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EjemploService {
  constructor(private readonly http: HttpClient) {}
}
```

La aplicación consumidora debe registrar el cliente HTTP una vez en su configuración raíz. En la aplicación actual basada en módulos ya se usa `HttpClientModule` en `AppModule`. Para una aplicación standalone se configura `provideHttpClient()` en sus proveedores de arranque.

Mantén la interfaz separada del flujo de negocio: el componente recibe datos y estados mediante `@Input()` y comunica acciones con `@Output()`. La pantalla o el servicio de aplicación consumidor coordina cuándo cargar, guardar o transformar datos.

## 6. Ejemplo real del repositorio

`selector-sede` es la referencia implementada:

- Componente standalone: `libraries/selector-sede/selector-sede.component.ts`.
- Modelo y servicio: `libraries/selector-sede/sede.model.ts` y `libraries/selector-sede/sede.service.ts`.
- API pública: `libraries/selector-sede/index.ts`.
- Integración en el módulo de la app: `src/app/app.module.ts`.
- Ejemplo de consumo del selector: `src/app/pages/home/home.component.html`.

La importación actual en `AppModule` es:

```ts
import { SelectorSedeComponent } from '../../libraries/selector-sede';
```

Al ser standalone, el componente va en `imports` de `AppModule`, no en `declarations`.

## 7. Verificación durante el desarrollo

Durante el trabajo cotidiano, verifica errores de compilación desde la consola:

```powershell
npm run build
```

No ejecutes specs ni Karma para cada cambio. Deja su ejecución para la etapa de preparación para producción, de acuerdo con el flujo de trabajo del equipo. Si la compilación falla, corrige el error antes de continuar.

## 8. Lista de comprobación

- [ ] La carpeta está en `libraries/<nombre-descriptivo>/`.
- [ ] La herramienta no depende de pantallas ni reglas de negocio de `src/app/`.
- [ ] Se eligió standalone o `NgModule` según la necesidad del consumidor.
- [ ] Los componentes standalone están en `imports`, no en `declarations`.
- [ ] Los componentes no standalone están declarados y exportados por su módulo.
- [ ] `index.ts` exporta la API pública necesaria.
- [ ] La documentación de la librería explica su configuración y uso.
- [ ] `npm run build` finaliza sin errores.
