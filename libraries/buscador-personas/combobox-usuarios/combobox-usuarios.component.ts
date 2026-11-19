import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ComboboxBaseDirective } from '../combobox-base.directive';
import { PersonaBusqueda } from '../persona-search.model';

@Component({
  selector: 'ucb-combobox-usuarios',
  standalone: false,
  templateUrl: './combobox-usuarios.component.html',
  styleUrls: ['./combobox-usuarios.component.scss'],
})
export class ComboboxUsuariosComponent extends ComboboxBaseDirective<PersonaBusqueda> {
  @Input() override placeholder = 'Buscar usuario por nombre...';
  @Output() usuarioSeleccionado = new EventEmitter<PersonaBusqueda>();

  protected override readonly longitudMinima = 3;

  seleccionar(item: PersonaBusqueda): void {
    this.limpiarLuegoDeSeleccion();
    this.usuarioSeleccionado.emit(item);
  }

  obtenerSubtitulo(item: PersonaBusqueda): string {
    const descripcion = item.descripcion?.trim();
    if (descripcion) {
      return descripcion;
    }

    return item.documentoIdentidad ? `CI: ${item.documentoIdentidad}` : '';
  }
}
