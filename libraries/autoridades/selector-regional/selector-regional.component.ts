import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Regional } from '../models/autoridad.model';
import { ComboLocal, OpcionCombo } from '../helpers/combo-local';
import { crearIdUnico } from '../helpers/identificador-unico';

@Component({
  selector: 'ucb-selector-regional',
  standalone: false,
  templateUrl: './selector-regional.component.html',
  styleUrls: ['./selector-regional.component.scss'],
})
export class SelectorRegionalComponent implements OnChanges {
  @Input() regionales: Regional[] = [];
  @Input() idSeleccionado: number | null = null;
  @Input() cargando = false;
  @Input() error = false;
  @Input() placeholder = 'Seleccione una regional...';
  @Input() etiqueta = 'Regional';
  @Input() ocultarEtiqueta = true;

  @Output() regionalChange = new EventEmitter<Regional | null>();
  @Output() reintentar = new EventEmitter<void>();

  private seleccion: number | null = null;
  private ultimoEmitido: number | null = null;

  readonly combo = new ComboLocal(
    crearIdUnico('selector-regional'),
    () => this.seleccion,
    (valor) => {
      this.seleccion = valor === null ? null : Number(valor);
    },
  );

  constructor() {
    this.combo.alReintentar = () => this.reintentar.emit();
    this.combo.alSeleccionar = (opcion) => this.emitirSeleccion(opcion);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSeleccionado']) {
      this.seleccion = this.idSeleccionado;
      this.ultimoEmitido = this.idSeleccionado;
    }
    if (changes['regionales']) {
      this.combo.establecerOpciones(this.regionales.map((r) => this.crearOpcion(r)));
    } else if (changes['idSeleccionado'] && !this.combo.abierto) {
      this.combo.sincronizarTexto();
    }
    if (changes['cargando']) {
      this.combo.cargando = this.cargando;
    }
    if (changes['error']) {
      this.combo.error = this.error;
    }
  }

  private crearOpcion(regional: Regional): OpcionCombo {
    return {
      valor: regional.idRegional,
      etiqueta: regional.nomRegional,
      subtitulo: 'Sigla: ' + regional.siglaRegional,
      textoBusqueda: regional.nomRegional + ' ' + regional.siglaRegional,
    };
  }

  private emitirSeleccion(opcion: OpcionCombo | null): void {
    const id = opcion === null ? null : Number(opcion.valor);
    if (id === this.ultimoEmitido) {
      return;
    }
    this.ultimoEmitido = id;
    const regional = id === null ? null : this.regionales.find((r) => r.idRegional === id) ?? null;
    this.regionalChange.emit(regional);
  }
}
