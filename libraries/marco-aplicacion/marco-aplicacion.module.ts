import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { MarcoAplicacionComponent } from './marco-aplicacion.component';

@NgModule({
  declarations: [MarcoAplicacionComponent],
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [MarcoAplicacionComponent],
})
export class MarcoAplicacionModule {}
