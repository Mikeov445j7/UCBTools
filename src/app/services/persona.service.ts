import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  EstudianteCarrera,
  EstudianteCompleto,
  EstudianteMapper,
  PersonaBusqueda,
  PersonaSearchService,
} from '../../../libraries/buscador-personas';
import { TarjetaDetalle, TarjetaSeccion } from '../../../libraries/tarjeta-perfil';

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

  obtenerEstudianteCompleto(idPersona: number): Observable<EstudianteCompleto | null> {
    return this.personaSearchService.getEstudianteDatosCompletos(idPersona).pipe(
      map((datos) => (Array.isArray(datos) && datos.length > 0 ? (datos[0] as EstudianteCompleto) : null))
    );
  }

  armarSeccionesEstudianteCompleto(est: EstudianteCompleto): TarjetaSeccion[] {
    return EstudianteMapper.mapearSeccionesCompletas(est);
  }

  armarDetallesUsuario(usuario: PersonaBusqueda): TarjetaDetalle[] {
    const ci = usuario.documentoIdentidad || usuario.ci || 'Sin documento';
    const usr = usuario.usuario || usuario.username || 'No registrado';
    const tipo = usuario.tipoPersona || 'Personal Administrativo / Docente';

    return [
      { etiqueta: 'ID Persona', valor: String(usuario.idPersona ?? usuario.id ?? 'S/N'), tieneDato: !!(usuario.idPersona ?? usuario.id) },
      { etiqueta: 'C.I. / Documento', valor: String(ci), tieneDato: !!(usuario.documentoIdentidad || usuario.ci) },
      { etiqueta: 'Usuario / Cuenta', valor: String(usr), tieneDato: !!(usuario.usuario || usuario.username) },
      { etiqueta: 'Tipo de Persona', valor: String(tipo), tieneDato: true },
    ];
  }

  armarDetallesEstudianteSimple(est: EstudianteCarrera): TarjetaDetalle[] {
    const ci = est.documentoIdentidad || est.ci || 'Sin C.I.';
    const carrera = est.nombreCarrera || 'Carrera no especificada';
    const regional = est.nomRegional || 'Sede UCB';
    const cod = est.codigoCarrera !== undefined && est.codigoCarrera !== null ? String(est.codigoCarrera) : 'S/C';

    return [
      { etiqueta: 'C.I. Documento', valor: String(ci), tieneDato: !!(est.documentoIdentidad || est.ci) },
      { etiqueta: 'Carrera', valor: String(carrera), tieneDato: !!est.nombreCarrera },
      { etiqueta: 'Sede Regional', valor: String(regional), tieneDato: !!est.nomRegional },
      { etiqueta: 'Código Carrera', valor: String(cod), tieneDato: cod !== 'S/C' },
    ];
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
        const estCompleto = Array.isArray(datos) && datos.length > 0 ? (datos[0] as EstudianteCompleto) : null;
        const estudiante = estCompleto ?? estudianteBasico;
        return {
          estudiante,
          secciones: EstudianteMapper.mapearSeccionesCompletas(estudiante),
        };
      }),
    );
  }
}
