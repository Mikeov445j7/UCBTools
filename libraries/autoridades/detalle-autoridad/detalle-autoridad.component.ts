import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { armarIdentificadoresAutoridad, armarInformacionAutoridad, formatearValor } from '../helpers/autoridad-formato';
import { Autoridad, DetalleAutoridad } from '../models/autoridad.model';
import { FocoModal } from '../helpers/foco-modal';
import { crearIdUnico } from '../helpers/identificador-unico';

@Component({
  selector: 'ucb-detalle-autoridad',
  standalone: false,
  templateUrl: './detalle-autoridad.component.html',
  styleUrls: ['./detalle-autoridad.component.scss'],
})
export class DetalleAutoridadComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() autoridad: Autoridad | null = null;
  @Input() cargando = false;
  @Input() error = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() reintentar = new EventEmitter<void>();

  @ViewChild('dialogo')
  set dialogo(ref: ElementRef<HTMLElement> | undefined) {
    if (ref) {
      this.foco.activar(ref.nativeElement);
    } else {
      this.foco.desactivar();
    }
  }

  informacion: DetalleAutoridad[] = [];
  identificadores: DetalleAutoridad[] = [];

  readonly valor = formatearValor;
  readonly idTitulo = crearIdUnico('detalle-autoridad-titulo');
  readonly foco = new FocoModal();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autoridad']) {
      this.informacion = this.autoridad ? armarInformacionAutoridad(this.autoridad) : [];
      this.identificadores = this.autoridad ? armarIdentificadoresAutoridad(this.autoridad) : [];
    }
  }

  ngOnDestroy(): void {
    this.foco.desactivar();
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    if (this.visible) {
      this.cerrar.emit();
    }
  }

  trackByEtiqueta(_: number, item: DetalleAutoridad): string {
    return item.etiqueta;
  }
}
