import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

// Migrated Institutional Libraries
import { BuscadorPersonasModule } from '../../../libraries/buscador-personas';
import { TarjetaPerfilModule } from '../../../libraries/tarjeta-perfil';
import { TarjetaSeleccionModule } from '../../../libraries/tarjeta-seleccion';
import { CrudActasModule } from '../../../libraries/crud-actas';
import { CrudNominacionesModule } from '../../../libraries/crud-nominaciones';
import { CrudTitulacionesModule } from '../../../libraries/crud-titulaciones';
import { CrudAutorizacionesModule } from '../../../libraries/crud-autorizaciones';

import { TestsLeonardoComponent } from './tests-leonardo/tests-leonardo.component';

@NgModule({
  declarations: [TestsLeonardoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    BuscadorPersonasModule,
    TarjetaPerfilModule,
    TarjetaSeleccionModule,
    CrudActasModule,
    CrudNominacionesModule,
    CrudTitulacionesModule,
    CrudAutorizacionesModule
  ],
  exports: [TestsLeonardoComponent]
})
export class TestsModule {}
