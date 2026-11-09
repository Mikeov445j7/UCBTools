# UCBTools

UCBTools es un proyecto en etapa inicial para construir un framework que facilite el desarrollo rapido de sistemas de apoyo y herramientas.

## Guía de arquitectura

La [Guía de arquitectura y organización de proyectos](./GUIA-ARQUITECTURA.md) define las reglas para distinguir herramientas reutilizables de funcionalidades de negocio y sirve como referencia para UCBTools y los sistemas institucionales que lo consuman.

## Estado actual

La aplicacion contiene el scaffold inicial de Angular 18. El framework y sus componentes todavia no estan implementados; se espera que la estructura evolucione durante el desarrollo.

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
npm test -- --watch=false
```

Las pruebas usan Karma y requieren un navegador Chrome disponible.
