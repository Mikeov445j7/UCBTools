import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoridadesModule } from '../../../libraries/autoridades';
import { ComboboxDinamicoModule } from '../../../libraries/combobox-dinamico';
import { MarcoAplicacionModule } from '../../../libraries/marco-aplicacion';
import { MenuTarjetasModule } from '../../../libraries/menu-tarjetas';
import { TestAdrianComponent } from './test-adrian.component';

@NgModule({
  declarations: [TestAdrianComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TestAdrianComponent }]),
    MarcoAplicacionModule,
    MenuTarjetasModule,
    ComboboxDinamicoModule,
    AutoridadesModule,
  ],
})
export class TestAdrianModule {}
