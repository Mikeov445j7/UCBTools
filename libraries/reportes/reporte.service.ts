import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';

import { ConfigReporte, RegistroReporte, ResultadoReporte } from './reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly configs = new Map<string, ConfigReporte>();
  private readonly estados = new Map<string, BehaviorSubject<ResultadoReporte>>();
  private readonly cargas = new Map<string, Subscription>();
  private readonly generaciones = new Map<string, number>();

  constructor(private readonly http: HttpClient) {}

  registrar(config: ConfigReporte): void {
    if (!config.id.trim()) throw new Error('El reporte requiere un identificador.');
    this.cancelar(config.id);
    this.configs.set(config.id, { ...config });
    const resultado: ResultadoReporte = { estado: 'sin-fuente', datos: [], mensajeError: '', config: { ...config } };
    const estado = this.estados.get(config.id);
    if (estado) estado.next(resultado); else this.estados.set(config.id, new BehaviorSubject(resultado));
  }

  registrarVarios(configs: ConfigReporte[]): void { configs.forEach(config => this.registrar(config)); }
  obtenerConfig(id: string): ConfigReporte | undefined { return this.configs.get(id); }

  resultado$(id: string): Observable<ResultadoReporte> {
    return this.estados.get(id)?.asObservable() ?? of({ estado: 'error', datos: [], mensajeError: 'No existe la configuración del reporte.', config: null });
  }

  iniciar(id: string): void {
    const estado = this.estados.get(id)?.value.estado;
    if (estado === 'sin-fuente') this.cargar(id);
  }

  cargar(id: string): void {
    const config = this.configs.get(id);
    const estado = this.estados.get(id);
    if (!config || !estado) return;
    this.cancelar(id);
    const generacion = this.generaciones.get(id)!;
    const endpoint = config.endpoint?.trim();
    if (endpoint && config.fuente) {
      estado.next({ estado: 'error', datos: [], mensajeError: 'Configure un endpoint o una fuente, no ambos.', config });
      return;
    }
    if (!endpoint && !config.fuente) {
      estado.next({ estado: 'sin-fuente', datos: [], mensajeError: 'El reporte no tiene una fuente de datos.', config });
      return;
    }
    if (endpoint && !this.urlValida(endpoint)) {
      estado.next({ estado: 'error', datos: [], mensajeError: 'La dirección del reporte no es válida.', config });
      return;
    }
    estado.next({ estado: 'cargando', datos: [], mensajeError: '', config });
    const fuente: Observable<unknown> = config.fuente ?? this.http.get<unknown>(endpoint!);
    const carga = fuente.subscribe({
      next: respuesta => {
        if (this.generaciones.get(id) !== generacion) return;
        if (!Array.isArray(respuesta) || !respuesta.every(item => item !== null && typeof item === 'object' && !Array.isArray(item))) {
          estado.next({ estado: 'error', datos: [], mensajeError: 'La respuesta del reporte no tiene el formato esperado.', config });
          return;
        }
        const datos = respuesta as RegistroReporte[];
        estado.next({ estado: datos.length ? 'listo' : 'sin-datos', datos, mensajeError: '', config });
      },
      error: error => {
        if (this.generaciones.get(id) === generacion) estado.next({ estado: 'error', datos: [], mensajeError: this.mensajeError(error), config, detalle: error });
      },
      complete: () => {
        if (this.generaciones.get(id) === generacion && estado.value.estado === 'cargando') {
          estado.next({ estado: 'sin-datos', datos: [], mensajeError: '', config });
        }
      },
    });
    this.cargas.set(id, carga);
  }

  cambiarOrigen(id: string, origen: { endpoint?: string; fuente?: Observable<RegistroReporte[]> }, cambios: Partial<ConfigReporte> = {}): void {
    const config = this.configs.get(id);
    if (!config) return;
    this.configs.set(id, { ...config, ...cambios, id, endpoint: origen.endpoint, fuente: origen.fuente });
    this.cargar(id);
  }

  private cancelar(id: string): void {
    this.generaciones.set(id, (this.generaciones.get(id) ?? 0) + 1);
    this.cargas.get(id)?.unsubscribe();
    this.cargas.delete(id);
  }

  private urlValida(endpoint: string): boolean {
    if (/[\u0000-\u0020\u007f\u200b-\u200d\ufeff]/.test(endpoint)) return false;
    try { const url = new URL(endpoint, 'http://localhost'); return url.protocol === 'http:' || url.protocol === 'https:'; } catch { return false; }
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No se pudo conectar con el servicio.';
      if (error.status === 401) return 'La sesión no está autorizada para consultar este reporte.';
      if (error.status === 403) return 'No tienes permiso para consultar este reporte.';
      if (error.status === 404) return 'No se encontró el servicio del reporte.';
      if (error.status >= 500) return 'El servicio del reporte no está disponible.';
    }
    return 'No fue posible cargar el reporte.';
  }
}
