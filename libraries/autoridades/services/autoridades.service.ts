import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Autoridad, Cargo, Regional } from '../models/autoridad.model';

@Injectable({ providedIn: 'root' })
export class AutoridadesService {
  private readonly baseUrl = 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api';

  constructor(private readonly http: HttpClient) {}

  obtenerRegionales(): Observable<Regional[]> {
    return this.http.get<Regional[]>(`${this.baseUrl}/Catalogos/GetRegionales`);
  }

  obtenerAutoridadesPorSede(idSede: number): Observable<Autoridad[]> {
    const params = new HttpParams().set('idSede', idSede);
    return this.http.get<Autoridad[]>(`${this.baseUrl}/Autoridades/GetAutoridadesSede`, { params });
  }

  obtenerAutoridadPorId(idAutoridad: number): Observable<Autoridad> {
    const params = new HttpParams().set('idAutoridad', idAutoridad);
    return this.http
      .get<Autoridad[] | Autoridad>(`${this.baseUrl}/Autoridades/GetAutoridad`, { params })
      .pipe(
        map((res) => {
          const autoridad = Array.isArray(res) ? res[0] : res;
          if (!autoridad) {
            throw new Error('No se encontró la autoridad solicitada.');
          }
          return autoridad;
        }),
      );
  }

  obtenerCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.baseUrl}/Autoridades/GetAllCargosAutoridades`);
  }

  obtenerTodasLasAutoridades(): Observable<Autoridad[]> {
    return this.http.get<Autoridad[]>(`${this.baseUrl}/Autoridades/GetAllAutoridad`);
  }
}
