import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  AsignacionAutoridad,
  Autoridad,
  Cargo,
  EdicionAutoridad,
  Regional,
} from '../../../libraries/autoridades';
import { ElementoComboboxDinamico } from '../../../libraries/combobox-dinamico';
import { MarcoSeccion } from '../../../libraries/marco-aplicacion';
import { MenuTarjetaItem } from '../../../libraries/menu-tarjetas';
import { AutoridadService } from '../services/autoridad.service';
import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-test-adrian',
  standalone: false,
  templateUrl: './test-adrian.component.html',
  styleUrls: ['./test-adrian.component.scss'],
})
export class TestAdrianComponent implements OnInit, OnDestroy {
  readonly tituloMarco = 'Marco de aplicación';
  readonly seccionesMarco: MarcoSeccion[] = [
    { id: 1, descripcion: 'Tests Adrian', ruta: '/test-adrian', icono: 'dashboard' },
  ];

  readonly itemsMenu: MenuTarjetaItem[] = [
    { id: 1, descripcion: 'Inicio', ruta: '/', icono: 'home' },
    { id: 2, descripcion: 'Tests Leonardo', ruta: '/tests-leonardo', icono: 'science' },
    { id: 3, descripcion: 'Tests Adrian', ruta: '/test-adrian', icono: 'dashboard' },
  ];

  resultadosPersonas: ElementoComboboxDinamico[] = [];
  personaSeleccionada: ElementoComboboxDinamico | null = null;

  regionales: Regional[] = [];
  cargandoRegionales = false;
  errorRegionales = false;
  regionalSeleccionada: Regional | null = null;

  autoridadesSede: Autoridad[] = [];
  cargandoAutoridadesSede = false;
  errorAutoridadesSede = false;

  idAutoridadSeleccionada: number | null = null;
  autoridadDetalle: Autoridad | null = null;
  cargandoDetalle = false;
  errorDetalle = false;

  autoridadEnEdicion: Autoridad | null = null;

  mostrarAsignar = false;
  todasLasAutoridades: Autoridad[] = [];
  cargandoTodasLasAutoridades = false;
  errorTodasLasAutoridades = false;
  autoridadAsignacion: Autoridad | null = null;
  detalleAsignacion: Autoridad | null = null;
  cargandoDetalleAsignacion = false;
  errorDetalleAsignacion = false;

  cargos: Cargo[] = [];
  cargandoCargos = false;
  errorCargos = false;

  private personasSub?: Subscription;
  private regionalesSub?: Subscription;
  private autoridadesSedeSub?: Subscription;
  private detalleSub?: Subscription;
  private todasLasAutoridadesSub?: Subscription;
  private detalleAsignacionSub?: Subscription;
  private cargosSub?: Subscription;

  constructor(
    private readonly autoridadService: AutoridadService,
    private readonly personaService: PersonaService,
  ) {}

  ngOnInit(): void {
    this.cargarRegionales();
  }

  ngOnDestroy(): void {
    this.personasSub?.unsubscribe();
    this.regionalesSub?.unsubscribe();
    this.autoridadesSedeSub?.unsubscribe();
    this.detalleSub?.unsubscribe();
    this.todasLasAutoridadesSub?.unsubscribe();
    this.detalleAsignacionSub?.unsubscribe();
    this.cargosSub?.unsubscribe();
  }

  get nombrePersonaSeleccionada(): string {
    const persona = this.personaSeleccionada;
    if (!persona) {
      return '';
    }
    return ['nombres', 'primerApellido', 'segundoApellido']
      .map((clave) => persona[clave])
      .filter((valor) => valor)
      .map((valor) => String(valor))
      .join(' ');
  }

  buscarPersonas(termino: string): void {
    this.personasSub?.unsubscribe();
    if (!termino.trim()) {
      this.resultadosPersonas = [];
      return;
    }
    this.personasSub = this.personaService.buscarPersonas(termino).subscribe({
      next: (lista) => {
        this.resultadosPersonas = Array.isArray(lista) ? lista : [];
      },
      error: () => {
        this.resultadosPersonas = [];
      },
    });
  }

  seleccionarPersona(item: ElementoComboboxDinamico): void {
    this.personaSeleccionada = item;
    this.resultadosPersonas = [];
  }

  cargarRegionales(): void {
    this.regionalesSub?.unsubscribe();
    this.cargandoRegionales = true;
    this.errorRegionales = false;
    this.regionalesSub = this.autoridadService.obtenerRegionales().subscribe({
      next: (lista) => {
        this.regionales = Array.isArray(lista) ? lista : [];
        this.cargandoRegionales = false;
      },
      error: () => {
        this.regionales = [];
        this.cargandoRegionales = false;
        this.errorRegionales = true;
      },
    });
  }

  alCambiarRegional(regional: Regional | null): void {
    this.regionalSeleccionada = regional;
    this.detalleSub?.unsubscribe();
    this.idAutoridadSeleccionada = null;
    this.autoridadDetalle = null;
    this.cargandoDetalle = false;
    this.errorDetalle = false;
    this.cargarAutoridadesSede();
  }

  cargarAutoridadesSede(): void {
    this.autoridadesSedeSub?.unsubscribe();
    this.autoridadesSede = [];
    this.errorAutoridadesSede = false;

    const regional = this.regionalSeleccionada;
    if (!regional) {
      this.cargandoAutoridadesSede = false;
      return;
    }

    this.cargandoAutoridadesSede = true;
    this.autoridadesSedeSub = this.autoridadService.obtenerAutoridadesPorSede(regional.idRegional).subscribe({
      next: (lista) => {
        this.autoridadesSede = lista;
        this.cargandoAutoridadesSede = false;
      },
      error: () => {
        this.autoridadesSede = [];
        this.cargandoAutoridadesSede = false;
        this.errorAutoridadesSede = true;
      },
    });
  }

  alSeleccionarAutoridad(idAutoridad: number): void {
    this.idAutoridadSeleccionada = idAutoridad;
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.detalleSub?.unsubscribe();
    this.autoridadDetalle = null;
    this.errorDetalle = false;

    const idAutoridad = this.idAutoridadSeleccionada;
    if (idAutoridad === null) {
      this.cargandoDetalle = false;
      return;
    }

    this.cargandoDetalle = true;
    this.detalleSub = this.autoridadService.obtenerAutoridad(idAutoridad).subscribe({
      next: (autoridad) => {
        this.autoridadDetalle = autoridad;
        this.cargandoDetalle = false;
      },
      error: () => {
        this.cargandoDetalle = false;
        this.errorDetalle = true;
      },
    });
  }

  cerrarDetalle(): void {
    this.idAutoridadSeleccionada = null;
  }

  editarAutoridad(): void {
    const autoridad = this.autoridadDetalle;
    if (!autoridad) {
      return;
    }
    this.idAutoridadSeleccionada = null;
    this.autoridadEnEdicion = autoridad;
    if (this.cargos.length === 0 && !this.cargandoCargos) {
      this.cargarCargos();
    }
  }

  cerrarEdicion(): void {
    this.idAutoridadSeleccionada = this.autoridadEnEdicion?.id ?? null;
    this.autoridadEnEdicion = null;
  }

  guardarEdicion(_: EdicionAutoridad): void {
    this.autoridadEnEdicion = null;
  }

  abrirAsignar(): void {
    this.mostrarAsignar = true;
    this.cargarTodasLasAutoridades();
    if (this.cargos.length === 0 && !this.cargandoCargos) {
      this.cargarCargos();
    }
  }

  cerrarAsignar(): void {
    this.mostrarAsignar = false;
    this.todasLasAutoridadesSub?.unsubscribe();
    this.detalleAsignacionSub?.unsubscribe();
    this.todasLasAutoridades = [];
    this.cargandoTodasLasAutoridades = false;
    this.errorTodasLasAutoridades = false;
    this.autoridadAsignacion = null;
    this.detalleAsignacion = null;
    this.cargandoDetalleAsignacion = false;
    this.errorDetalleAsignacion = false;
  }

  guardarAsignacion(_: AsignacionAutoridad): void {
    this.cerrarAsignar();
  }

  cargarTodasLasAutoridades(): void {
    this.todasLasAutoridadesSub?.unsubscribe();
    this.cargandoTodasLasAutoridades = true;
    this.errorTodasLasAutoridades = false;
    this.todasLasAutoridadesSub = this.autoridadService.obtenerTodasLasAutoridades().subscribe({
      next: (lista) => {
        this.todasLasAutoridades = lista;
        this.cargandoTodasLasAutoridades = false;
      },
      error: () => {
        this.todasLasAutoridades = [];
        this.cargandoTodasLasAutoridades = false;
        this.errorTodasLasAutoridades = true;
      },
    });
  }

  cargarDetalleAsignacion(autoridad: Autoridad | null): void {
    this.detalleAsignacionSub?.unsubscribe();
    this.autoridadAsignacion = autoridad;
    this.detalleAsignacion = null;
    this.errorDetalleAsignacion = false;

    if (!autoridad) {
      this.cargandoDetalleAsignacion = false;
      return;
    }

    this.cargandoDetalleAsignacion = true;
    this.detalleAsignacionSub = this.autoridadService.obtenerAutoridad(autoridad.id).subscribe({
      next: (detalle) => {
        this.detalleAsignacion = detalle;
        this.cargandoDetalleAsignacion = false;
      },
      error: () => {
        this.cargandoDetalleAsignacion = false;
        this.errorDetalleAsignacion = true;
      },
    });
  }

  reintentarDetalleAsignacion(): void {
    this.cargarDetalleAsignacion(this.autoridadAsignacion);
  }

  cargarCargos(): void {
    this.cargosSub?.unsubscribe();
    this.cargandoCargos = true;
    this.errorCargos = false;
    this.cargosSub = this.autoridadService.obtenerCargos().subscribe({
      next: (lista) => {
        this.cargos = Array.isArray(lista) ? lista : [];
        this.cargandoCargos = false;
      },
      error: () => {
        this.cargos = [];
        this.cargandoCargos = false;
        this.errorCargos = true;
      },
    });
  }
}
