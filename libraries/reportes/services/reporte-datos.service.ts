import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { RegistroReporte } from '../models/reporte.model';

@Injectable({
  providedIn: 'root',
})
export class ReporteDatosService {
  constructor(private readonly http: HttpClient) {}

  obtenerDatos(
    endpoint: string | null | undefined,
  ): Observable<RegistroReporte[]> {
    const url = this.limpiarUrl(endpoint);
    if (!url) {
      return throwError(() => new Error('El endpoint del reporte está vacío.'));
    }
    return this.http.get<RegistroReporte[]>(url);
  }

  describirError(error: unknown): string {
    const estado =
      error instanceof HttpErrorResponse ? error.status : undefined;

    switch (estado) {
      case 0:
        return 'No hay conexión con el servicio. Revisa tu red o intenta más tarde.';
      case 401:
      case 403:
        return 'No tienes autorización para ver esta información.';
      case 404:
        return 'El servicio solicitado no existe o no está disponible.';
      default:
        return estado !== undefined && estado >= 500
          ? 'El servicio presentó un problema. Intenta nuevamente en unos minutos.'
          : 'No se pudo cargar la información.';
    }
  }

  private limpiarUrl(url: string | null | undefined): string {
    return (url ?? '').replace(/[\u200B-\u200D\uFEFF\s]/g, '');
  }
}
