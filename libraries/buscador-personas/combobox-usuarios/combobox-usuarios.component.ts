import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { ComboboxBaseDirective } from '../combobox-base.directive';
import { PersonaBusqueda } from '../persona-search.model';
import { PersonaSearchService } from '../persona-search.service';

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

  constructor(
    host: ElementRef<HTMLElement>,
    private readonly personaSearchService: PersonaSearchService
  ) {
    super(host);
  }

  override alEscribir(valor: string): void {
    super.alEscribir(valor);

    // Si el componente padre maneja terminoBuscado, no auto-consultamos
    if (this.terminoBuscado.observed) {
      return;
    }

    const nombre = valor?.trim();
    if (!nombre || nombre.length < this.longitudMinima) {
      this.resultados = [];
      this.cargando = false;
      this.error = null;
      return;
    }

    this.cargando = true;
    this.error = null;
    this.personaSearchService.buscarPersonas(nombre).subscribe({
      next: (res) => {
        this.resultados = res ?? [];
        this.cargando = false;
      },
      error: (err) => {
        this.resultados = [];
        this.cargando = false;
        this.error = 'Error al buscar personas/usuarios';
        console.error(err);
      },
    });
  }

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

