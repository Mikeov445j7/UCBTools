import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Sede } from './sede.model';

const SEDES_URL = 'https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes';

@Injectable({ providedIn: 'root' })
export class SedeService {
  constructor(private readonly http: HttpClient) {}

  obtenerSedes(): Observable<Sede[]> {
    return this.http.get<unknown>(SEDES_URL).pipe(
      map((response) => {
        if (!Array.isArray(response) || !response.every(esSede)) {
          throw new Error('El servicio de sedes devolvió una respuesta con formato inválido.');
        }

        return response;
      }),
    );
  }
}

function esSede(value: unknown): value is Sede {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const sede = value as Record<string, unknown>;

  return (
    typeof sede['idSede'] === 'number' &&
    Number.isInteger(sede['idSede']) &&
    typeof sede['sigla'] === 'string' &&
    typeof sede['nombre'] === 'string'
  );
}
