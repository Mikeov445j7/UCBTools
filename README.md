# UCBTools

UCBTools es un proyecto en etapa inicial para construir un framework que facilite el desarrollo rapido de sistemas de apoyo y herramientas.

## Guía de arquitectura

La [Guía de arquitectura y organización de proyectos](./GUIA-ARQUITECTURA.md) define las reglas para distinguir herramientas reutilizables de funcionalidades de negocio y sirve como referencia para UCBTools y los sistemas institucionales que lo consuman.

## Ejemplo de biblioteca

El [Selector de sede](./libraries/selector-sede/README.md) demuestra cómo implementar y consumir una herramienta reutilizable conectada a un servicio institucional.

## Primera librería: selector de sedes

Este repositorio ya incluye una primera implementación de librería reutilizable para la selección de sedes institucionales. El flujo completo es:

1. Se define el contrato de datos en `libraries/selector-sede/sede.model.ts`.
2. La librería encapsula la integración HTTP en `libraries/selector-sede/sede.service.ts` usando el endpoint institucional:
   `https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes`
3. El componente visual standalone `SelectorSedeComponent` queda en la librería y solo recibe entradas y emite eventos. No usa HTTP ni lógica de negocio.
4. Un servicio de aplicación en `src/app/services/catalogo.service.ts` coordina la operación para la pantalla.
5. La pantalla `src/app/pages/home/home.component.ts` consume la librería y expone el estado actual de la selección al usuario.
6. La interfaz se presenta a través de `app.component.html`, con el componente home montado como punto de entrada.

La estructura de trabajo resultante sigue la guía de arquitectura del proyecto:

```text
UCBVANTools/
├── libraries/
│   └── selector-sede/
│       ├── index.ts
│       ├── sede.model.ts
│       ├── sede.service.ts
│       ├── selector-sede.component.ts
│       ├── selector-sede.component.html
│       ├── selector-sede.component.scss
│       ├── selector-sede.component.spec.ts
│       └── README.md
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── home/
│   │   │       ├── home.component.ts
│   │   │       ├── home.component.html
│   │   │       └── home.component.scss
│   │   ├── services/
│   │   │   └── catalogo.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/                       # Imágenes y otros recursos estáticos
│   ├── environments/
│   │   ├── environment.ts            # Configuración base/producción
│   │   ├── environment.development.ts
│   │   └── environment.production.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── public/                           # Archivos servidos desde la raíz, como favicon.ico
├── GUIA-ARQUITECTURA.md
├── README.md
├── package.json
└── angular.json
```

## Estado actual

El proyecto usa Angular 18 y contiene una primera herramienta reutilizable de ejemplo: el selector de sedes. Las librerías se implementan con componentes standalone cuando aplica; cada librería no necesita un `NgModule` propio. El framework y la publicación de paquetes aún están en evolución.

## Requisitos

- Node.js en una version compatible con Angular 18 (Node 18 o 20).
- npm.

## Desarrollo

```bash
npm ci
npm start
```

La aplicacion de desarrollo estara disponible en `http://localhost:4200/`.

## Validacion

```bash
npm run build
```

Durante el desarrollo se verifica la compilación desde la consola. Las pruebas (specs/Karma) se dejan para la etapa de preparación para producción.

## Entornos y recursos estáticos

- `src/environments/environment.ts` es la configuración base; Angular la sustituye según la configuración de compilación.
- `src/environments/environment.development.ts` se usa al compilar con `--configuration development`.
- `src/environments/environment.production.ts` se usa en la compilación de producción predeterminada.
- `src/assets/` contiene imágenes, iconos y otros recursos de la aplicación; se acceden desde la aplicación con rutas como `assets/imagenes/logo.svg`.
- `public/` se conserva para archivos que deben copiarse a la raíz del sitio, como `favicon.ico`.

Los archivos de environment se incluyen en el código del navegador; no guardes contraseñas, claves privadas ni secretos en ellos.
