import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BuscadorPersonasModule } from '../buscador-personas';
import { TarjetaSeleccionModule } from '../tarjeta-seleccion';
import { TarjetaPerfilModule } from '../tarjeta-perfil';
import { GestionTitulacionesComponent } from './gestion-titulaciones.component';
import { TarjetaEditableTitulacionComponent } from './tarjeta-editable-titulacion.component';

@NgModule({
  declarations: [
    GestionTitulacionesComponent,
    TarjetaEditableTitulacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BuscadorPersonasModule,
    TarjetaSeleccionModule,
    TarjetaPerfilModule
  ],
  exports: [
    GestionTitulacionesComponent,
    TarjetaEditableTitulacionComponent
  ]
})
export class CrudTitulacionesModule {}
