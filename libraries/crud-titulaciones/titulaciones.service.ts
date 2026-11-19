import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<TramiteCompletoDto[]>(url);
  }

  /**
   * Actualiza los datos de titulación.
   */
  actualizarTitulacion(payload: ActualizarTitulacionPayload): Observable<unknown> {
    const url = `${this.baseUrl}/UpdTramite`;
    return this.http.post<unknown>(url, payload);
  }
}
