import { Directive } from '@angular/core';

import {
  ConfigReporte,
  EventoCargado,
  EventoConfigCambiada,
  EventoErrorCarga,
  EventoFilaSeleccionada,
} from './models/reporte.model';

@Directive()
export abstract class ReportePadre {
  abstract config: ConfigReporte;

  onCargado(_evento: EventoCargado): void {}

  onFilaSeleccionada(_evento: EventoFilaSeleccionada): void {}

  onConfigCambiada(_evento: EventoConfigCambiada): void {}

  onErrorCarga(_evento: EventoErrorCarga): void {}
}
