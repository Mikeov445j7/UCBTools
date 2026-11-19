import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActaResumen, ActaDetalle } from './acta.model';

@Injectable({
  providedIn: 'root'
})
export class ActasService {
  private readonly baseUrl = 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de actas del estudiante por su C.I.
   */
  getEstudianteActas(ci: string): Observable<ActaResumen[]> {
    const url = `${this.baseUrl}/Estudiante/GetEstudianteActas?ci=${encodeURIComponent(ci.trim())}`;
    return this.http.get<ActaResumen[]>(url).pipe(
      tap(res => console.log('[GET ESTUDIANTE ACTAS SUCCESS] Respuesta:', res))
    );
  }

  /**
   * Obtiene el detalle completo de un acta específica por su idActa
   */
  getActaDetalle(idActa: number): Observable<ActaDetalle[]> {
    const url = `${this.baseUrl}/Actas/GetActa?idActa=${idActa}`;
    return this.http.get<ActaDetalle[]>(url).pipe(
      tap(res => console.log('[GET ACTA DETALLE SUCCESS] Respuesta:', res))
    );
  }
}
