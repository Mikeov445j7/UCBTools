import { FormateadorReporte, RegistroReporte } from './reporte.model';

export const DICCIONARIO_COLUMNAS: Readonly<Record<string, string>> = {
  id: 'ID', descripcion: 'Descripción', provisionnacional: 'Provisión Nacional',
  idsubdepto: 'Subdepartamento', idsubdepartamento: 'Subdepartamento', idsede: 'Sede',
  sede: 'Sede', sexo: 'Sexo', estadoregistro: 'Estado', usuarioregistro: 'Usuario que Registró',
  fecharegistro: 'Fecha de Registro', nombres: 'Nombres', primerapellido: 'Primer Apellido',
  segundoapellido: 'Segundo Apellido', documentoidentidad: 'Documento de Identidad',
  ci: 'Carnet de Identidad', email: 'Correo Electrónico', telefono: 'Teléfono', celular: 'Celular',
  direccion: 'Dirección', carrera: 'Carrera', facultad: 'Facultad', regional: 'Regional',
  nacionalidad: 'Nacionalidad', fechanacimiento: 'Fecha de Nacimiento',
  codigocarrera: 'Código de Carrera', nombrealterno: 'Nombre Alterno', nombrecarrera: 'Nombre de la Carrera',
};

export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
    .replace(/[\s_-]+/g, '');
}

function distancia(a: string, b: string): number {
  let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const actual = [i + 1];
    for (let j = 0; j < b.length; j++) {
      actual.push(Math.min(actual[j] + 1, anterior[j + 1] + 1, anterior[j] + (a[i] === b[j] ? 0 : 1)));
    }
    anterior = actual;
  }
  return anterior[b.length];
}

export function resolverEtiquetaColumna(clave: string, manuales: Record<string, string> = {}): string {
  if (Object.prototype.hasOwnProperty.call(manuales, clave)) return manuales[clave];
  const normalizada = normalizarTexto(clave);
  if (Object.prototype.hasOwnProperty.call(DICCIONARIO_COLUMNAS, normalizada)) return DICCIONARIO_COLUMNAS[normalizada];
  // Solo se acepta una corrección inequívoca de un carácter en claves suficientemente largas.
  if (normalizada.length >= 7) {
    const candidatos = Object.keys(DICCIONARIO_COLUMNAS).filter(k => Math.abs(k.length - normalizada.length) <= 1 && distancia(k, normalizada) === 1);
    if (candidatos.length === 1) return DICCIONARIO_COLUMNAS[candidatos[0]];
  }
  return clave.replace(/([a-záéíóúñ])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim()
    .split(/\s+/).map(p => /^(id|ci|api|url)$/i.test(p) ? p.toUpperCase() : p.charAt(0).toLocaleUpperCase('es') + p.slice(1)).join(' ');
}

export function detectarColumnas(datos: RegistroReporte[]): string[] {
  return Array.from(new Set(datos.flatMap(registro => Object.keys(registro))));
}

export const FORMATEADORES_INSTITUCIONALES: Readonly<Record<string, FormateadorReporte>> = {
  sexo: valor => [1, '1', 'M'].includes(valor as string | number) ? 'Masculino' : [2, '2', 'F'].includes(valor as string | number) ? 'Femenino' : String(valor),
  estadoRegistro: valor => [1, '1', true].includes(valor as string | number | boolean) ? 'Activo' : [0, '0', false].includes(valor as string | number | boolean) ? 'Inactivo' : String(valor),
};

export function presentarValor(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return '—';
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(valor)) {
    const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(valor);
    const fecha = new Date(soloFecha ? `${valor}T00:00:00Z` : valor);
    if (!Number.isNaN(fecha.getTime())) {
      if (soloFecha && fecha.toISOString().slice(0, 10) !== valor) return valor;
      return fecha.toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: '2-digit', ...(soloFecha ? { timeZone: 'UTC' } : {}) });
    }
  }
  if (typeof valor === 'object') {
    try { return JSON.stringify(valor) ?? String(valor); } catch { return String(valor); }
  }
  return String(valor);
}

export function claveValor(valor: unknown): string {
  return `${typeof valor}:${presentarValorCrudo(valor)}`;
}

function presentarValorCrudo(valor: unknown): string {
  if (valor !== null && typeof valor === 'object') {
    try { return JSON.stringify(valor) ?? String(valor); } catch { return String(valor); }
  }
  return String(valor);
}
