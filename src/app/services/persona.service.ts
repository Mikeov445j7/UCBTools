import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  EstudianteCarrera,
  EstudianteCompleto,
  EstudianteMapper,
  PersonaBusqueda,
  PersonaSearchService,
} from '../../../libraries/buscador-personas';
import { TarjetaSeccion } from '../../../libraries/tarjeta-perfil';

export interface PerfilEstudianteCompleto {
  estudiante: EstudianteCompleto | EstudianteCarrera;
  secciones: TarjetaSeccion[];
}

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  constructor(private readonly personaSearchService: PersonaSearchService) {}

  buscarPersonas(termino: string): Observable<PersonaBusqueda[]> {
    return this.personaSearchService.buscarPersonas(termino);
  }

  buscarEstudiantesPorCI(ci: string): Observable<EstudianteCarrera[]> {
    return this.personaSearchService.buscarEstudiantesPorCI(ci);
  }

  obtenerPerfilCompletoEstudiante(
    estudianteBasico: EstudianteCarrera,
  ): Observable<PerfilEstudianteCompleto> {
    const id = estudianteBasico.idPersona ?? estudianteBasico.IdPersona;
    if (id === undefined || id === null) {
      return new Observable<PerfilEstudianteCompleto>((subscriber) => {
        subscriber.next({
          estudiante: estudianteBasico,
          secciones: EstudianteMapper.mapearSeccionesCompletas(estudianteBasico),
        });
        subscriber.complete();
      });
    }

    return this.personaSearchService.getEstudianteDatosCompletos(id).pipe(
      map((datos) => {
        const estCompleto = Array.isArray(datos) && datos.length > 0 ? datos[0] : null;
        const estudiante = estCompleto ?? estudianteBasico;
        return {
          estudiante,
          secciones: EstudianteMapper.mapearSeccionesCompletas(estudiante),
        };
      }),
    );
  }
}
