import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BuscadorPersonasModule } from '../../../libraries/buscador-personas';
import { TarjetaPerfilModule } from '../../../libraries/tarjeta-perfil';
import { TarjetaSeleccionModule } from '../../../libraries/tarjeta-seleccion';
import { TestsLeonardoComponent } from './tests-leonardo/tests-leonardo.component';

@NgModule({
  declarations: [TestsLeonardoComponent],
  imports: [
    CommonModule,
    BuscadorPersonasModule,
    TarjetaPerfilModule,
    TarjetaSeleccionModule,
  ],
  exports: [TestsLeonardoComponent],
})
export class TestsModule {}
