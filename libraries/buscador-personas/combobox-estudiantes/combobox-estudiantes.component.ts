import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { ComboboxBaseDirective } from '../combobox-base.directive';
import { EstudianteCarrera } from '../persona-search.model';
import { PersonaSearchService } from '../persona-search.service';

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

  constructor(
    host: ElementRef<HTMLElement>,
    private readonly personaSearchService: PersonaSearchService
  ) {
    super(host);
  }

  override alEscribir(valor: string): void {
    super.alEscribir(valor);

    // Si el padre no está manejando manualmente terminoBuscado, se auto-gestiona la búsqueda como en sgt-multitools
    if (this.terminoBuscado.observed) {
      return;
    }

    const ci = valor?.trim() || '';
    if (!ci) {
      this.resultados = [];
      this.cargando = false;
      this.error = null;
      return;
    }

    this.cargando = true;
    this.error = null;
    this.personaSearchService.buscarEstudiantesPorCI(ci).subscribe({
      next: (res) => {
        this.resultados = res ?? [];
        this.cargando = false;
      },
      error: (err) => {
        this.resultados = [];
        this.cargando = false;
        this.error = 'Error al consultar estudiante por CI';
        console.error(err);
      },
    });
  }

  seleccionar(item: EstudianteCarrera): void {
    this.limpiarLuegoDeSeleccion();
    this.estudianteSeleccionado.emit(item);
  }
}

