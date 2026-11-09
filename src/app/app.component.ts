import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CatalogoService } from './services/catalogo.service';
import { SelectorSedeComponent, type Sede } from '../../libraries/selector-sede';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectorSedeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'UCBTools';
  sedes: Sede[] = [];
  sedeSeleccionada: Sede | null = null;
  cargando = false;
  error: string | null = null;

  constructor(
    private readonly catalogoService: CatalogoService,
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

    this.catalogoService.obtenerSedes().subscribe({
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
}
