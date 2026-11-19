import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ActualizarTitulacionPayload, TramiteCompletoDto } from './titulacion.model';

@Injectable({
  providedIn: 'root'
})
export class TitulacionesService {
  private readonly baseUrl = 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Tramites';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de trámites/titulaciones completos de un estudiante por su CI
   */
  getTramitesPorCi(ci: string): Observable<TramiteCompletoDto[]> {
    const url = `${this.baseUrl}/GetTramiteCompletoCi?ci=${encodeURIComponent(ci.trim())}`;
    return this.http.get<TramiteCompletoDto[]>(url).pipe(
      tap(res => console.log('[GET TITULACIONES SUCCESS] Respuesta:', res))
    );
  }

  /**
   * Envía o simula la actualización de datos de titulación
   */
  actualizarTitulacion(payload: ActualizarTitulacionPayload): Observable<unknown> {
    const url = `${this.baseUrl}/UpdTramite`;
    console.log('[UPD TITULACION] Disparando actualización a:', url, 'Payload:', payload);

    // Simulación institucional hasta que backend despliegue el endpoint de guardado:
    return of({ ok: true, mensaje: 'Simulación de actualización exitosa', data: payload }).pipe(delay(300));
  }
}
