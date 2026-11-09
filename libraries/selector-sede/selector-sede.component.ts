import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sede } from './sede.model';

@Component({
  selector: 'ucb-selector-sede',
  standalone: true,
  templateUrl: './selector-sede.component.html',
  styleUrl: './selector-sede.component.scss',
})
export class SelectorSedeComponent {
  @Input() sedes: Sede[] = [];
  @Input() sedeSeleccionada: Sede | null = null;
  @Input() cargando = false;
  @Input() error: string | null = null;

  @Output() sedeChange = new EventEmitter<Sede | null>();
  @Output() reintentar = new EventEmitter<void>();

  seleccionarSede(event: Event): void {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    const idSeleccionado = valorSeleccionado ? Number(valorSeleccionado) : null;
    const sede = this.sedes.find((item) => item.idSede === idSeleccionado) ?? null;
    this.sedeChange.emit(sede);
  }
}
