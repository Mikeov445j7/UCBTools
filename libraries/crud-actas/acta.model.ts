export interface DetalleItem {
  etiqueta: string;
  valor: string;
  tieneDato: boolean;
}

export interface ActaResumen {
  id: number;
  idActa?: number;
  idPersona?: number;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  documentoIdentidad?: string;
  sigla?: string;
  numeroTesis?: string | number;
  nomRegional?: string;
  regional?: number;
  nombreCarrera?: string;
  nombreTesis?: string;
  fechaDefensa?: string;
  lugarDefensa?: string;
  nota?: number;
  modalidad?: string;
  idModalidad?: number;
  [key: string]: unknown;
}

export interface ActaDetalle extends ActaResumen {
  area?: string;
  fechaHora?: string;
  horam?: string;
  fechaRegistro?: string;
  usuarioRegistro?: string;
  idPeriodo?: number | string;
  estadoRegistro?: number;
  tribunales?: string | TribunalItem[];
  idTutor?: number | string;
  cargoTutor?: string;
  nombreFacultad?: string;
  nombre?: string;
  tribunal1?: string;
  cargoTrib1?: string;
  tribunal2?: string;
  cargoTrib2?: string;
  tribunal3?: string;
  cargoTrib3?: string;
  observaciones?: string;
}

export interface TribunalItem {
  nombre?: string;
  cargo?: string;
  idCargo?: number | string;
}
