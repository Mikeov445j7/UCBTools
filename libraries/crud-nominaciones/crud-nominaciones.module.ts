import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BuscadorPersonasModule } from '../buscador-personas';
import { TarjetaPerfilModule } from '../tarjeta-perfil';
import { GestionNominacionesComponent } from './gestion-nominaciones.component';
import { FormularioNominacionComponent } from './formulario-nominacion.component';

@NgModule({
  declarations: [
    GestionNominacionesComponent,
    FormularioNominacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BuscadorPersonasModule,
    TarjetaPerfilModule
  ],
  exports: [
    GestionNominacionesComponent,
    FormularioNominacionComponent
  ]
})
export class CrudNominacionesModule {}
