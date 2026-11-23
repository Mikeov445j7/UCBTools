import { FormatoColumna } from '../models/reporte.model';
import { buscarMejorCoincidencia } from './busqueda-difusa';

export const DICCIONARIO_COLUMNAS: Record<string, string> = {
  id: 'ID',
  descripcion: 'Descripción',
  provisionnacional: 'Provisión Nacional',
  idsubdepto: 'Subdepartamento',
  idsubdepartamento: 'Subdepartamento',
  idsede: 'Sede',
  sede: 'Sede',
  sexo: 'Sexo',
  estadoregistro: 'Estado',
  usuarioregistro: 'Usuario que Registró',
  fecharegistro: 'Fecha de Registro',
  nombres: 'Nombres',
  primerapellido: 'Primer Apellido',
  segundoapellido: 'Segundo Apellido',
  documentoidentidad: 'Documento de Identidad',
  ci: 'Carnet de Identidad',
  email: 'Correo Electrónico',
  telefono: 'Teléfono',
  celular: 'Celular',
  direccion: 'Dirección',
  carrera: 'Carrera',
  facultad: 'Facultad',
  regional: 'Regional',
  nacionalidad: 'Nacionalidad',
  fechanacimiento: 'Fecha de Nacimiento',
  codigocarrera: 'Código de Carrera',
  nombrealterno: 'Nombre Alterno',
  nombrecarrera: 'Nombre de la Carrera',
};

const CLAVES_DICCIONARIO: readonly string[] = Object.keys(DICCIONARIO_COLUMNAS);

const REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}(T|\s|$)/;

export function normalizarClave(texto: string): string {
  return texto.toLowerCase().replace(/[\s_-]/g, '');
}

export function buscarEnDiccionario(clave: string): string | null {
  const claveNormalizada = normalizarClave(clave);

  const exacta: string | undefined = DICCIONARIO_COLUMNAS[claveNormalizada];
  if (exacta) {
    return exacta;
  }

  const aproximada = buscarMejorCoincidencia(claveNormalizada, CLAVES_DICCIONARIO);
  return aproximada ? DICCIONARIO_COLUMNAS[aproximada] : null;
}

export const FORMATOS_COLUMNAS: Record<string, FormatoColumna> = {
  sexo: (valor) =>
    valor === 1 || valor === '1' || valor === 'M'
      ? 'Masculino'
      : valor === 2 || valor === '2' || valor === 'F'
        ? 'Femenino'
        : String(valor),
  estadoregistro: (valor) =>
    valor === 1 || valor === '1' || valor === true
      ? 'Activo'
      : valor === 0 || valor === '0' || valor === false
        ? 'Inactivo'
        : String(valor),
};

export function formatoPorClave(clave: string, valorEjemplo?: unknown): FormatoColumna | null {
  const normalizada = normalizarClave(clave);

  const definido: FormatoColumna | undefined = FORMATOS_COLUMNAS[normalizada];
  if (definido) {
    return definido;
  }

  if (typeof valorEjemplo === 'string' && REGEX_FECHA_ISO.test(valorEjemplo)) {
    return (valor) => {
      const fecha = new Date(String(valor));
      return isNaN(fecha.getTime())
        ? String(valor)
        : fecha.toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: '2-digit' });
    };
  }

  return null;
}
