import { Cargo } from '../models/autoridad.model';

function neutralizarPalabra(palabra: string): string {
  if (palabra === 'JEFA') {
    return 'JEFE';
  }
  if (palabra === 'PRESIDENTA') {
    return 'PRESIDENTE';
  }
  if (palabra.length > 4 && palabra.endsWith('ORA')) {
    return palabra.slice(0, -1);
  }
  if (palabra.length > 3 && palabra.endsWith('A')) {
    return palabra.slice(0, -1) + 'O';
  }
  return palabra;
}

export function claveCargo(descripcion: string | null | undefined): string {
  if (!descripcion) {
    return '';
  }
  return descripcion
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\(\s*[AO]\s*\)/g, '')
    .replace(/\/\s*[AO]\b/g, '')
    .replace(/[^A-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(neutralizarPalabra)
    .join(' ');
}

export function filtrarCargosPorVariante(cargos: Cargo[], cargoActual: string | null | undefined): Cargo[] {
  const clave = claveCargo(cargoActual);
  if (!clave) {
    return [];
  }
  return cargos.filter((c) => claveCargo(c.descripcion) === clave);
}
