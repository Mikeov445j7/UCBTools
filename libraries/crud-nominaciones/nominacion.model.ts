export interface NominacionDto {
  id: number;
  descripcion: string;
  provisionNacional: string;
  idSubdepto: number;
  idSede: number;
  sexo: number;
  usuarioRegistro?: string;
  codigoCarrera: string | number;
  nombreAlterno?: string;
  sede?: string;
  nombreCarrera: string;
  [key: string]: unknown;
}

export interface NominacionUpdPayload {
  id: number;
  descripcion: string;
  provisionNacional: string;
  codigoCarrera: string;
  [key: string]: unknown;
}
