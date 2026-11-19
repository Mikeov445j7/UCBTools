import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorPersonasModule } from '../buscador-personas';
import { TarjetaSeleccionModule } from '../tarjeta-seleccion';
import { TarjetaPerfilModule } from '../tarjeta-perfil';
import { GestionActasComponent } from './gestion-actas.component';

@NgModule({
  declarations: [
    GestionActasComponent
  ],
  imports: [
    CommonModule,
    BuscadorPersonasModule,
    TarjetaSeleccionModule,
    TarjetaPerfilModule
  ],
  exports: [
    GestionActasComponent
  ]
})
export class CrudActasModule {}
