import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutorizacionDto } from './autorizacion.model';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionesService {
  private readonly baseUrl = 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Autorizacion';

  constructor(private http: HttpClient) {}

  /**
   * Trae autorizaciones por idPersona
   */
  getAutorizacion(idPersona: number): Observable<AutorizacionDto[]> {
    const url = `${this.baseUrl}/GetAutorizacion?idPersona=${idPersona}`;
    return this.http.get<AutorizacionDto[]>(url);
  }

  /**
   * Búsqueda de username
   */
  getUsername(busq: string): Observable<unknown> {
    const url = `${this.baseUrl}/GetUsername?busq=${encodeURIComponent(busq.trim())}`;
    return this.http.get<unknown>(url);
  }

  /**
   * Trae todas las autorizaciones
   */
  getAllAutorizaciones(): Observable<AutorizacionDto[]> {
    const url = `${this.baseUrl}/GetAllAutorizaciones`;
    return this.http.get<AutorizacionDto[]>(url);
  }

  /**
   * Crea una nueva autorización
   */
  addAutorizacion(datos: AutorizacionDto): Observable<unknown> {
    const url = `${this.baseUrl}/AddAutorizacion`;
    return this.http.post<unknown>(url, datos);
  }

  /**
   * Actualiza autorización por id e idp (POST según contrato swagger)
   */
  updAutorizacion(id: number, idp: number): Observable<unknown> {
    const url = `${this.baseUrl}/UPDAutorizacion?id=${id}&idp=${idp}`;
    return this.http.post<unknown>(url, {});
  }

  /**
   * Elimina autorización por idAutorizacion (POST según contrato swagger)
   */
  delAutorizacion(idAutorizacion: number): Observable<unknown> {
    const url = `${this.baseUrl}/DelAutorizacion?idAutorizacion=${idAutorizacion}`;
    return this.http.post<unknown>(url, {});
  }
}
