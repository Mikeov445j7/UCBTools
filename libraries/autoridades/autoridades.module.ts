import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AsignarAutoridadComponent } from './asignar-autoridad/asignar-autoridad.component';
import { CampoComboComponent } from './campo-combo/campo-combo.component';
import { DetalleAutoridadComponent } from './detalle-autoridad/detalle-autoridad.component';
import { EditarAutoridadComponent } from './editar-autoridad/editar-autoridad.component';
import { ListaAutoridadesSedeComponent } from './lista-autoridades-sede/lista-autoridades-sede.component';
import { SelectorRegionalComponent } from './selector-regional/selector-regional.component';

@NgModule({
  declarations: [
    CampoComboComponent,
    SelectorRegionalComponent,
    ListaAutoridadesSedeComponent,
    DetalleAutoridadComponent,
    EditarAutoridadComponent,
    AsignarAutoridadComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  exports: [
    SelectorRegionalComponent,
    ListaAutoridadesSedeComponent,
    DetalleAutoridadComponent,
    EditarAutoridadComponent,
    AsignarAutoridadComponent,
  ],
})
export class AutoridadesModule {}
