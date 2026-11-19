import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { ConfigReporte, FORMATEADORES_INSTITUCIONALES, ReporteService } from '../../../libraries/reportes';

// Cada objeto define desde código una tabla reutilizable para la aplicación.
export const REPORTES: ConfigReporte[] = [
  {
    id: 'reporte-demo',
    titulo: 'Nominaciones de título',
    endpoint: 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Nominaciones/GetAllNominacionesTitulo',
    visibles: ['provisionNacional', 'idSubdepto', 'idSede', 'sexo', 'fechaRegistro'],
    filtros: ['idSede', 'sexo'],
    buscador: 'provisionNacional',
    mensajeVacio: 'No existen nominaciones disponibles.',
    etiquetas: { idSubdepto: 'ID Subdepartamento', idSede: 'ID Sede' },
    formateadores: { sexo: FORMATEADORES_INSTITUCIONALES['sexo'] },
  },
  {
    id: 'reporte-carreras',
    titulo: 'Carreras',
    fuente: of([
      { nombreCarrera: 'Ingeniería de Sistemas', facultad: 'Ingeniería', regional: 'La Paz' },
      { nombreCarrera: 'Derecho', facultad: 'Ciencias Sociales', regional: 'Cochabamba' },
    ]),
    filtros: ['regional'],
    buscador: 'nombreCarrera',
  },
];

@Injectable({ providedIn: 'root' })
export class ReportesDemoService {
  constructor(private readonly reportes: ReporteService) {}

  registrar(): void { this.reportes.registrarVarios(REPORTES); }
}
