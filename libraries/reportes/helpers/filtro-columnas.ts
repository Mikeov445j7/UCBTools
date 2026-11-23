import { RegistroReporte } from '../models/reporte.model';

export type TipoFiltro = 'seleccion' | 'lista';

export interface DefinicionFiltro {
  clave: string;
  tipo: TipoFiltro;
  opciones: unknown[];
}

const UMBRAL_SELECCION = 8;

export function obtenerValoresUnicos(datos: RegistroReporte[], clave: string): unknown[] {
  const mapa = new Map<string, unknown>();
  for (const fila of datos) {
    const valor = fila[clave];
    if (valor !== null && valor !== undefined && valor !== '') {
      mapa.set(String(valor), valor);
    }
  }
  return Array.from(mapa.values());
}

export function detectarDefinicionFiltro(datos: RegistroReporte[], clave: string): DefinicionFiltro {
  const opciones = obtenerValoresUnicos(datos, clave);
  return {
    clave,
    tipo: opciones.length <= UMBRAL_SELECCION ? 'seleccion' : 'lista',
    opciones,
  };
}
