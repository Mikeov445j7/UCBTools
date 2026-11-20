import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { ElementoComboboxDinamico } from './combobox-dinamico.model';

let contadorInstancias = 0;

@Component({
  selector: 'ucb-combobox-dinamico',
  standalone: false,
  templateUrl: './combobox-dinamico.component.html',
  styleUrls: ['./combobox-dinamico.component.scss'],
})
export class ComboboxDinamicoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() resultados: ElementoComboboxDinamico[] = [];
  @Input() placeholder = 'Buscar...';
  @Input() etiqueta = '';
  @Input() keysTitulo: string[] = ['nombres', 'primerApellido', 'segundoApellido'];
  @Input() keySubtitulo = 'documentoIdentidad';
  @Input() prefijoSubtitulo = 'CI: ';

  @Output() terminoBuscado = new EventEmitter<string>();
  @Output() itemSeleccionado = new EventEmitter<ElementoComboboxDinamico>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  readonly idBase = `combobox-dinamico-${++contadorInstancias}`;
  indiceActivo = -1;
  abierto = false;

  private readonly searchSubject = new Subject<string>();
  private subscription?: Subscription;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get anuncio(): string {
    if (!this.abierto || this.resultados.length === 0) {
      return '';
    }
    const total = this.resultados.length;
    return total === 1 ? '1 resultado disponible' : `${total} resultados disponibles`;
  }

  ngOnInit(): void {
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((termino) => (termino ?? '').trim().length > 0),
      )
      .subscribe((termino) => this.terminoBuscado.emit(termino));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resultados']) {
      this.indiceActivo = -1;
      this.abierto = this.resultados.length > 0;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  alEscribir(event: Event): void {
    const termino = (event.target as HTMLInputElement).value;
    if (termino.trim() === '') {
      this.resultados = [];
      this.abierto = false;
      this.indiceActivo = -1;
      this.terminoBuscado.emit('');
    } else {
      this.searchSubject.next(termino);
    }
  }

  alTeclear(event: KeyboardEvent): void {
    const total = this.resultados.length;
    switch (event.key) {
      case 'ArrowDown':
        if (total) {
          event.preventDefault();
          this.abierto = true;
          this.indiceActivo = Math.min(total - 1, this.indiceActivo + 1);
          this.desplazarAlActivo();
        }
        break;
      case 'ArrowUp':
        if (total) {
          event.preventDefault();
          this.abierto = true;
          this.indiceActivo = Math.max(0, this.indiceActivo - 1);
          this.desplazarAlActivo();
        }
        break;
      case 'Enter': {
        const item = this.abierto ? this.resultados[this.indiceActivo] : undefined;
        if (item) {
          event.preventDefault();
          this.seleccionarItem(item);
        }
        break;
      }
      case 'Escape':
        if (this.abierto) {
          event.stopPropagation();
          this.cerrar();
        }
        break;
      case 'Tab':
        this.cerrar();
        break;
    }
  }

  seleccionarItem(item: ElementoComboboxDinamico): void {
    this.itemSeleccionado.emit(item);
    this.resultados = [];
    this.cerrar();
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  obtenerTitulo(item: ElementoComboboxDinamico): string {
    return this.keysTitulo
      .map((key) => item[key])
      .filter((valor) => valor)
      .map((valor) => String(valor))
      .join(' ');
  }

  obtenerSubtitulo(item: ElementoComboboxDinamico): string {
    const valor = item[this.keySubtitulo];
    return valor ? `${this.prefijoSubtitulo}${String(valor)}` : '';
  }

  @HostListener('document:click', ['$event.target'])
  alHacerClicEnDocumento(destino: EventTarget | null): void {
    if (!this.abierto) {
      return;
    }
    if (destino instanceof Node && this.elementRef.nativeElement.contains(destino)) {
      return;
    }
    this.cerrar();
  }

  private cerrar(): void {
    this.abierto = false;
    this.indiceActivo = -1;
  }

  private desplazarAlActivo(): void {
    setTimeout(() => {
      document.getElementById(`${this.idBase}-op-${this.indiceActivo}`)?.scrollIntoView({ block: 'nearest' });
    });
  }
}
