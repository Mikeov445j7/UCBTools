import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Directive()
export abstract class ComboboxBaseDirective<T> implements OnInit, OnDestroy {
  @Input() resultados: T[] = [];
  @Input() placeholder = 'Buscar...';
  @Input() cargando = false;
  @Input() error: string | null = null;

  @Output() terminoBuscado = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  protected abstract readonly longitudMinima: number;

  private readonly searchSubject = new Subject<string>();
  private subscription?: Subscription;

  constructor(protected readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((termino) => termino.trim().length >= this.longitudMinima),
      )
      .subscribe((termino) => {
        this.terminoBuscado.emit(termino.trim());
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  alEscribir(valor: string): void {
    const limpio = valor.trim();
    if (limpio.length < this.longitudMinima) {
      this.resultados = [];
      this.searchSubject.next('');
      this.terminoBuscado.emit('');
      return;
    }

    this.searchSubject.next(limpio);
  }

  protected limpiarLuegoDeSeleccion(): void {
    this.resultados = [];
    this.searchSubject.next('');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  @HostListener('document:click', ['$event'])
  cerrarAlHacerClicAfuera(event: Event): void {
    if (this.resultados.length > 0 && !this.host.nativeElement.contains(event.target as Node)) {
      this.resultados = [];
    }
  }

  @HostListener('keydown.escape')
  cerrarConEscape(): void {
    this.resultados = [];
  }
}
