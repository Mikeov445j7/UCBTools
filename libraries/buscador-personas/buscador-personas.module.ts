import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComboboxEstudiantesComponent } from './combobox-estudiantes/combobox-estudiantes.component';
import { ComboboxUsuariosComponent } from './combobox-usuarios/combobox-usuarios.component';

@NgModule({
  declarations: [
    ComboboxUsuariosComponent,
    ComboboxEstudiantesComponent,
  ],
  imports: [CommonModule],
  exports: [
    ComboboxUsuariosComponent,
    ComboboxEstudiantesComponent,
  ],
})
export class BuscadorPersonasModule {}
