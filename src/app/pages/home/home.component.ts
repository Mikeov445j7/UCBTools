import { Component, OnInit } from '@angular/core';

import { Sede } from '../../../../libraries/selector-sede';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sedes: Sede[] = [];
  sedeSeleccionada: Sede | null = null;
  cargando = false;
  error: string | null = null;

  constructor(private readonly catalogoService: CatalogoService) {}

  ngOnInit(): void {
    this.cargarSedes();
  }

  cargarSedes(): void {
    this.cargando = true;
    this.error = null;

    this.catalogoService.obtenerSedes().subscribe({
      next: (sedes) => {
        this.sedes = sedes;
        this.cargando = false;

        if (!this.sedeSeleccionada && sedes.length > 0) {
          this.sedeSeleccionada = sedes[0];
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudieron cargar las sedes del servicio institucional.';
      },
    });
  }

  manejarCambioSede(sede: Sede | null): void {
    this.sedeSeleccionada = sede;
  }
}
