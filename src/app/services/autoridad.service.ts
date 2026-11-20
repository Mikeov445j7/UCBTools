import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Autoridad, AutoridadesService, Cargo, Regional } from '../../../libraries/autoridades';

@Injectable({
  providedIn: 'root',
})
export class AutoridadService {
  constructor(private readonly autoridadesService: AutoridadesService) {}

  obtenerRegionales(): Observable<Regional[]> {
    return this.autoridadesService.obtenerRegionales();
  }

  obtenerAutoridadesPorSede(idSede: number): Observable<Autoridad[]> {
    return this.autoridadesService
      .obtenerAutoridadesPorSede(idSede)
      .pipe(map((lista) => (Array.isArray(lista) ? lista : [])));
  }

  obtenerAutoridad(idAutoridad: number): Observable<Autoridad> {
    return this.autoridadesService.obtenerAutoridadPorId(idAutoridad);
  }

  obtenerCargos(): Observable<Cargo[]> {
    return this.autoridadesService.obtenerCargos();
  }

  obtenerTodasLasAutoridades(): Observable<Autoridad[]> {
    return this.autoridadesService
      .obtenerTodasLasAutoridades()
      .pipe(map((lista) => (Array.isArray(lista) ? lista : [])));
  }
}
