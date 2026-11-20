export interface Autoridad {
  id: number;
  idPersona: number;
  gradoAcad: string;
  nombreCompleto: string;
  nombreSgt: string | null;
  cargo: string;
  nombreSede: string;
  interino: number;
  idSede: number;
  idCargo: number;
  departamento: string;
  facultad: string;
  nombreCarrera: string;
  idDepto: number;
  idSubDepto: number;
  idFacultad: number;
}

export interface Cargo {
  id: number;
  descripcion: string;
  observaciones: string | null;
}

export interface Regional {
  idRegional: number;
  siglaRegional: string;
  nomRegional: string;
}

export interface DetalleAutoridad {
  etiqueta: string;
  valor: string;
}

export interface EdicionAutoridad {
  idAutoridad: number;
  nombreCompleto: string;
  gradoAcad: string | null;
  nombreSgt: string;
  idCargo: number | null;
  interino: boolean;
  nombreSede: string;
  facultad: string;
  departamento: string;
  nombreCarrera: string;
}

export interface AsignacionAutoridad {
  idAutoridad: number;
  nombreCompleto: string;
  gradoAcad: string | null;
  idCargo: number | null;
}
