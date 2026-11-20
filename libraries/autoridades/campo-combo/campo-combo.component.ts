import { Component, ElementRef, HostListener, Input } from '@angular/core';

import { ComboLocal } from '../helpers/combo-local';

@Component({
  selector: 'ucb-campo-combo',
  standalone: false,
  templateUrl: './campo-combo.component.html',
  styleUrls: ['./campo-combo.component.scss'],
})
export class CampoComboComponent {
  @Input({ required: true }) combo!: ComboLocal;
  @Input() etiqueta = '';
  @Input() ocultarEtiqueta = false;
  @Input() placeholder = '';
  @Input() ariaToggle = 'Mostrar opciones';
  @Input() mensajeCargando = 'Cargando opciones...';
  @Input() mensajeError = 'No se pudieron cargar las opciones.';

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get anuncio(): string {
    if (this.combo.cargando) {
      return this.mensajeCargando;
    }
    if (!this.combo.abierto) {
      return '';
    }
    const total = this.combo.filtradas.length;
    if (total === 0) {
      return 'Sin resultados';
    }
    return total === 1 ? '1 opción disponible' : `${total} opciones disponibles`;
  }

  alternar(input: HTMLInputElement): void {
    if (this.combo.abierto) {
      this.combo.cerrar();
    } else {
      this.combo.abrir();
      input.focus();
    }
  }

  @HostListener('document:click', ['$event.target'])
  alHacerClicEnDocumento(destino: EventTarget | null): void {
    if (!this.combo.abierto) {
      return;
    }
    if (destino instanceof Node && this.elementRef.nativeElement.contains(destino)) {
      return;
    }
    this.combo.cerrar();
  }
}
