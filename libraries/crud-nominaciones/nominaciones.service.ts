import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NominacionDto } from './nominacion.model';

@Injectable({
  providedIn: 'root'
})
export class NominacionesService {
  private readonly baseUrl = 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Nominaciones';

  constructor(private http: HttpClient) {}

  getAllNominaciones(): Observable<NominacionDto[]> {
    return this.http.get<NominacionDto[]>(`${this.baseUrl}/GetAllNominacionesTitulo`);
  }

  getNominacionesTitulo(id: number | string): Observable<NominacionDto | NominacionDto[]> {
    return this.http.get<NominacionDto | NominacionDto[]>(`${this.baseUrl}/GetNominacionesTitulo?id=${id}`);
  }

  getNominacion(idSubDepto: number | string, sexo: number | string): Observable<NominacionDto | NominacionDto[]> {
    return this.http.get<NominacionDto | NominacionDto[]>(`${this.baseUrl}/GetNominacion?idSubDepto=${idSubDepto}&sexo=${sexo}`);
  }

  getNominacionesSubdepto(idSubDepto: number | string): Observable<NominacionDto[]> {
    return this.http.get<NominacionDto[]>(`${this.baseUrl}/GetNominacionesSubdepto?idSubDepto=${idSubDepto}`);
  }

  getNominacionesSede(idSede: number | string): Observable<NominacionDto[]> {
    return this.http.get<NominacionDto[]>(`${this.baseUrl}/GetNominacionesSede?idSede=${idSede}`);
  }

  addNominacion(nominacion: NominacionDto): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/AddNominacion`, nominacion);
  }

  updNominacion(datosActualizados: unknown): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/UPDNominacion`, datosActualizados);
  }

  delNominacion(id: number | string): Observable<unknown> {
    const url = `${this.baseUrl}/DelNominacion?idNominacion=${id}`;
    const body = { id };
    return this.http.post<unknown>(url, body);
  }
}
