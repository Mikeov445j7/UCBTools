export interface AutorizacionDto {
  id: number;
  idPersona: number;
  etapa: string;
  rol: number;
  idSede: number;
  idDepartamento?: number | null;
  usuarioRegistro?: string;
  [key: string]: unknown;
}

export interface SedeOption {
  idRegional: number;
  nomRegional: string;
  siglaRegional: string;
}
