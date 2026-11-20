import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { formatearValor } from '../helpers/autoridad-formato';
import { Autoridad } from '../models/autoridad.model';

@Component({
  selector: 'ucb-lista-autoridades-sede',
  standalone: false,
  templateUrl: './lista-autoridades-sede.component.html',
  styleUrls: ['./lista-autoridades-sede.component.scss'],
})
export class ListaAutoridadesSedeComponent implements OnChanges {
  @Input() autoridades: Autoridad[] = [];
  @Input() idSede: number | null = null;
  @Input() cargando = false;
  @Input() error = false;
  @Input() etiqueta = 'Autoridades de la sede';

  @Output() autoridadSeleccionada = new EventEmitter<number>();
  @Output() reintentar = new EventEmitter<void>();

  seleccionada: Autoridad | null = null;

  readonly valor = formatearValor;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autoridades']) {
      this.seleccionada = null;
    }
  }

  seleccionar(item: Autoridad): void {
    this.seleccionada = item;
    this.autoridadSeleccionada.emit(item.id);
  }

  trackById(_: number, item: Autoridad): number {
    return item.id;
  }
}
