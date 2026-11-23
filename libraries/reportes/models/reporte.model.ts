export type RegistroReporte = Record<string, unknown>;

export type FormatoColumna = (valor: unknown) => string;

export interface ColumnaConfig {
  clave: string;
  etiqueta?: string;
  visible?: boolean;
  filtro?: boolean;
  formato?: string;
}

export interface ConfigReporte {
  id: string;
  titulo?: string;
  endpoint?: string;
  visibles?: string[];
  filtros?: string[];
  buscador?: string | null;
  columnas?: ColumnaConfig[];
  configurable?: boolean;
  mensajeVacio?: string;
}

export interface ConfigReporteActual {
  visibles: string[];
  filtros: string[];
  buscador: string | null;
}

export type EstadoReporte = 'cargando' | 'listo' | 'error' | 'sin-datos' | 'sin-fuente';

export interface EventoReporte {
  reporteId: string;
}

export interface EventoCargado extends EventoReporte {
  total: number;
}

export interface EventoErrorCarga extends EventoReporte {
  mensaje: string;
  detalle?: unknown;
}

export interface EventoFilaSeleccionada extends EventoReporte {
  fila: RegistroReporte;
}

export interface EventoConfigCambiada extends EventoReporte {
  config: ConfigReporteActual;
}
