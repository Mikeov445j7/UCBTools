import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigReporte, RegistroReporte, ReporteDatosService } from '../../../libraries/reportes';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private readonly reportes: ConfigReporte[] = [
    {
      id: 'nominaciones',
      titulo: 'Nominaciones de Título',
      endpoint: 'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Nominaciones/GetAllNominacionesTitulo',
      visibles: ['descripcion', 'provisionNacional', 'idSede', 'sexo', 'fechaRegistro'],
      filtros: ['sexo', 'idSede', 'descripcion'],
      buscador: 'descripcion',
    },
  ];

  constructor(private readonly reporteDatosService: ReporteDatosService) {}

  obtenerConfiguracion(id: string): ConfigReporte {
    const config = this.reportes.find((reporte) => reporte.id === id);
    if (!config) {
      throw new Error(`El reporte ${id} no está registrado.`);
    }
    return config;
  }

  obtenerDatos(config: ConfigReporte): Observable<RegistroReporte[]> {
    return this.reporteDatosService.obtenerDatos(config.endpoint);
  }

  describirError(error: unknown): string {
    return this.reporteDatosService.describirError(error);
  }
}
