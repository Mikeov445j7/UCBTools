import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { MenuTarjetasComponent } from './menu-tarjetas.component';

@NgModule({
  declarations: [MenuTarjetasComponent],
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [MenuTarjetasComponent],
})
export class MenuTarjetasModule {}
