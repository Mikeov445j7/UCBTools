import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Sede } from './sede.model';

@Component({
  selector: 'ucb-selector-sede',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector-sede.component.html',
  styleUrls: ['./selector-sede.component.scss'],
})
export class SelectorSedeComponent {
  @Input() sedes: Sede[] = [];
  @Input() sedeSeleccionada: Sede | null = null;
  @Input() cargando = false;
  @Input() error: string | null = null;

  @Output() sedeChange = new EventEmitter<Sede | null>();
  @Output() reintentar = new EventEmitter<void>();

  seleccionarSede(sede: Sede | null): void {
    this.sedeChange.emit(sede);
  }

  intentarOtraVez(): void {
    this.reintentar.emit();
  }
}
