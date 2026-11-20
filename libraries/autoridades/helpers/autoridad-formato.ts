import { Autoridad, DetalleAutoridad } from '../models/autoridad.model';

export function formatearValor(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return '-';
  }
  const limpio = String(valor).trim();
  if (!limpio || limpio.toUpperCase() === '[NULO]') {
    return '-';
  }
  return limpio;
}

export function armarInformacionAutoridad(a: Autoridad): DetalleAutoridad[] {
  return [
    { etiqueta: 'Grado académico', valor: formatearValor(a.gradoAcad) },
    { etiqueta: 'Nombre SGT', valor: formatearValor(a.nombreSgt) },
    { etiqueta: 'Cargo', valor: formatearValor(a.cargo) },
    { etiqueta: 'Interino', valor: a.interino ? 'Sí' : 'No' },
    { etiqueta: 'Sede', valor: formatearValor(a.nombreSede) },
    { etiqueta: 'Facultad', valor: formatearValor(a.facultad) },
    { etiqueta: 'Departamento', valor: formatearValor(a.departamento) },
    { etiqueta: 'Carrera', valor: formatearValor(a.nombreCarrera) },
  ];
}

export function armarIdentificadoresAutoridad(a: Autoridad): DetalleAutoridad[] {
  return [
    { etiqueta: 'ID', valor: formatearValor(a.id) },
    { etiqueta: 'ID persona', valor: formatearValor(a.idPersona) },
    { etiqueta: 'ID sede', valor: formatearValor(a.idSede) },
    { etiqueta: 'ID cargo', valor: formatearValor(a.idCargo) },
    { etiqueta: 'ID facultad', valor: formatearValor(a.idFacultad) },
    { etiqueta: 'ID departamento', valor: formatearValor(a.idDepto) },
    { etiqueta: 'ID subdepartamento', valor: formatearValor(a.idSubDepto) },
  ];
}
