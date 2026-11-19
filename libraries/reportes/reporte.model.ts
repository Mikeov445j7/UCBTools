import { Observable } from 'rxjs';

export type RegistroReporte = Record<string, unknown>;
export type FormateadorReporte = (valor: unknown, registro: RegistroReporte) => string;

export interface ConfigReporte {
  id: string;
  titulo?: string;
  endpoint?: string;
  fuente?: Observable<RegistroReporte[]>;
  visibles?: string[];
  filtros?: string[];
  buscador?: string | null;
  mensajeVacio?: string;
  etiquetas?: Record<string, string>;
  formateadores?: Record<string, FormateadorReporte>;
  umbralSeleccion?: number;
}

export interface ConfigReporteActual {
  visibles: string[];
  filtros: string[];
  buscador: string | null;
}

export type EstadoReporte = 'cargando' | 'listo' | 'error' | 'sin-datos' | 'sin-fuente';

export interface ResultadoReporte {
  estado: EstadoReporte;
  datos: RegistroReporte[];
  mensajeError: string;
  config: ConfigReporte | null;
  detalle?: unknown;
}
