import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TipoBadgeTarjeta } from './tarjeta-seleccion.model';

@Component({
  selector: 'ucb-tarjeta-seleccion',
  standalone: false,
  templateUrl: './tarjeta-seleccion.component.html',
  styleUrls: ['./tarjeta-seleccion.component.scss'],
})
export class TarjetaSeleccionComponent {
  @Input() seleccionada = false;
  @Input() inactiva = false;
  @Input() textoCinta = '✓ SELECCIONADO';

  @Input() tagIzquierdo = '';
  @Input() tagDerecho = '';

  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() subtituloCursiva = false;

  @Input() metaPrincipalEtiqueta = 'Defensa:';
  @Input() metaPrincipalValor = 'Sin fecha';
  @Input() metaSecundarioIzquierda = '';
  @Input() badgeDerecha = '';
  @Input() tipoBadge: TipoBadgeTarjeta = 'amarillo';

  @Output() seleccionar = new EventEmitter<void>();

  onClickTarjeta(): void {
    this.seleccionar.emit();
  }
}
