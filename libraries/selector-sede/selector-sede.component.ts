import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Sede } from './sede.model';
import { SedeService } from './sede.service';

@Component({
  selector: 'ucb-selector-sede',
  standalone: true,
  templateUrl: './selector-sede.component.html',
  styleUrl: './selector-sede.component.scss',
})
export class SelectorSedeComponent implements OnInit {
  @Output() sedeChange = new EventEmitter<Sede | null>();

  sedes: Sede[] = [];
  sedeSeleccionada: Sede | null = null;
  cargando = false;
  error: string | null = null;

  constructor(
    private readonly sedeService: SedeService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSedes();
    }
  }

  cargarSedes(): void {
    this.cargando = true;
    this.error = null;

    this.sedeService.obtenerSedes().subscribe({
      next: (sedes) => {
        this.sedes = sedes;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las sedes. Intenta nuevamente.';
        this.cargando = false;
      },
    });
  }

  seleccionarSede(event: Event): void {
    const idSeleccionado = Number((event.target as HTMLSelectElement).value);
    this.sedeSeleccionada = this.sedes.find((sede) => sede.idSede === idSeleccionado) ?? null;
    this.sedeChange.emit(this.sedeSeleccionada);
  }
}
