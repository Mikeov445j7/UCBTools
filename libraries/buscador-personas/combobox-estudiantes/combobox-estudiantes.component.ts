import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ComboboxBaseDirective } from '../combobox-base.directive';
import { EstudianteCarrera } from '../persona-search.model';

@Component({
  selector: 'ucb-combobox-estudiantes',
  standalone: false,
  templateUrl: './combobox-estudiantes.component.html',
  styleUrls: ['./combobox-estudiantes.component.scss'],
})
export class ComboboxEstudiantesComponent extends ComboboxBaseDirective<EstudianteCarrera> {
  @Input() override placeholder = 'Buscar estudiante por CI...';
  @Output() estudianteSeleccionado = new EventEmitter<EstudianteCarrera>();

  protected override readonly longitudMinima = 1;

  seleccionar(item: EstudianteCarrera): void {
    this.limpiarLuegoDeSeleccion();
    this.estudianteSeleccionado.emit(item);
  }
}
