import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  EstudianteCarrera,
  EstudianteCompleto,
  PersonaBusqueda,
} from './persona-search.model';

@Injectable({
  providedIn: 'root',
})
export class PersonaSearchService {
  private readonly baseUrl = 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api';

  constructor(private readonly http: HttpClient) {}

  buscarPersonas(termino: string): Observable<PersonaBusqueda[]> {
    const terminoMayusculas = (termino ?? '').trim().toUpperCase();
    if (terminoMayusculas.length === 0) {
      return of([]);
    }

    const url = `${this.baseUrl}/Autoridades/GetPersona?busq=${encodeURIComponent(terminoMayusculas)}`;
    return this.http.get<PersonaBusqueda[]>(url);
  }

  buscarEstudiantesPorCI(ci: string): Observable<EstudianteCarrera[]> {
    const ciLimpio = (ci ?? '').trim();
    if (!ciLimpio || isNaN(Number(ciLimpio))) {
      return of([]);
    }

    const url = `${this.baseUrl}/Estudiante/GetEstudianteCarrera?ci=${encodeURIComponent(ciLimpio)}`;
    return this.http.get<EstudianteCarrera[]>(url);
  }

  getEstudianteDatosCompletos(idPersona: number | string): Observable<EstudianteCompleto[]> {
    const idLimpio = idPersona !== null && idPersona !== undefined ? String(idPersona).trim() : '';
    if (!idLimpio) {
      return of([]);
    }

    const url = `${this.baseUrl}/Estudiante/GetEstudianteDatosCompletosConTodo?idPersona=${encodeURIComponent(idLimpio)}`;
    return this.http.get<EstudianteCompleto[]>(url);
  }
}
