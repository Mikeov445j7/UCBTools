import { PersonaPerfil } from '../tarjeta-perfil';

export interface PersonaBusqueda extends PersonaPerfil {
  idPersona?: number;
  id?: number;
  idUsuario?: number;
  documentoIdentidad?: string | null;
  descripcion?: string | null;
}

export interface EstudianteCarrera extends PersonaPerfil {
  idPersona?: number;
  IdPersona?: number;
  documentoIdentidad?: string | null;
  ci?: string | null;
  carnet?: string | null;
  idSubdepartamento?: number;
  idSubdepto?: number;
}

export interface EstudianteCompleto extends EstudianteCarrera {
  expedidoEn?: string | null;
  nomDeptoExp?: string | null;
  tipoDoc?: string | null;
  abreviacioDoc?: string | null;
  tipoDocumento?: string | number | null;
  valDomiCI?: string | number | boolean | null;
  nacionalidad?: string | null;
  nacidoEn?: string | null;
  paisNac?: string | null;
  bolDepartamento?: string | null;
  nombreProvincia?: string | null;
  municipio?: string | null;
  ciudadNacimiento?: string | null;
  direccion?: string | null;
  numeroCelular?: string | null;
  numeroDomicilio?: string | null;
  email?: string | null;
  nombreFacultad?: string | null;
  nombreDetallado?: string | null;
  siglaCarrera?: string | null;
  nomRegional?: string | null;
  siglaRegional?: string | null;
  gradoAcadSubdepto?: string | null;
  tipoSubD?: string | null;
  idTramite?: number | null;
  idActa?: number | null;
  fechaDefensa?: string | null;
}
