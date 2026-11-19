import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BuscadorPersonasModule } from '../buscador-personas';
import { TarjetaPerfilModule } from '../tarjeta-perfil';
import { GestionAutorizacionesComponent } from './gestion-autorizaciones.component';
import { FormularioAutorizacionComponent } from './formulario-autorizacion.component';

@NgModule({
  declarations: [
    GestionAutorizacionesComponent,
    FormularioAutorizacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BuscadorPersonasModule,
    TarjetaPerfilModule
  ],
  exports: [
    GestionAutorizacionesComponent,
    FormularioAutorizacionComponent
  ]
})
export class CrudAutorizacionesModule {}
