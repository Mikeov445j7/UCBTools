import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TarjetaSeleccionComponent } from './tarjeta-seleccion.component';

@NgModule({
  declarations: [TarjetaSeleccionComponent],
  imports: [CommonModule],
  exports: [TarjetaSeleccionComponent],
})
export class TarjetaSeleccionModule {}
