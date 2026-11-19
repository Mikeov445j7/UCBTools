export interface TarjetaDetalle {
  etiqueta: string;
  valor: string | number | null | undefined;
  tieneDato: boolean;
}

export interface TarjetaSeccion {
  titulo: string;
  icono?: string;
  detalles: TarjetaDetalle[];
}

export interface PersonaPerfil {
  nombres?: string | null;
  primerApellido?: string | null;
  segundoApellido?: string | null;
  tercerApellido?: string | null;
  nombreCarrera?: string | null;
  [clave: string]: unknown;
}
