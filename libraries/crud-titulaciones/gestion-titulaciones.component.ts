import { Component } from '@angular/core';
import { TitulacionesService } from './titulaciones.service';
import { ActualizarTitulacionPayload, TramiteCompletoDto } from './titulacion.model';

@Component({
  selector: 'ucb-gestion-titulaciones',
  templateUrl: './gestion-titulaciones.component.html',
  styleUrls: ['./gestion-titulaciones.component.scss'],
  standalone: false
})
export class GestionTitulacionesComponent {
  estudianteSeleccionado: Record<string, unknown> | null = null;
  ciActual: string = '';

  titulaciones: TramiteCompletoDto[] = [];
  titulacionSeleccionada: TramiteCompletoDto | null = null;
  indiceSeleccionado: number | null = null;

  cargandoLista: boolean = false;
  guardandoFormulario: boolean = false;
  mensajeError: string = '';

  constructor(private titulacionesService: TitulacionesService) {}

  recibirEstudiante(estudiante: unknown): void {
    this.mensajeError = '';
    this.titulaciones = [];
    this.titulacionSeleccionada = null;
    this.indiceSeleccionado = null;

    if (!estudiante || typeof estudiante !== 'object') {
      this.estudianteSeleccionado = null;
      this.ciActual = '';
      return;
    }

    const est = estudiante as Record<string, unknown>;
    this.estudianteSeleccionado = est;
    const ci = est['documentoIdentidad'] || est['ci'] || est['carnet'];

    if (!ci) {
      this.mensajeError = 'El estudiante seleccionado no tiene un número de C.I. válido.';
      return;
    }

    this.ciActual = String(ci);
    this.cargarTitulaciones(this.ciActual);
  }

  cargarTitulaciones(ci: string): void {
    this.cargandoLista = true;

    this.titulacionesService.getTramitesPorCi(ci).subscribe({
      next: (datos) => {
        this.cargandoLista = false;
        const lista = Array.isArray(datos) ? datos : (datos ? [datos] : []);
        this.titulaciones = lista;

        if (this.titulaciones.length === 0) {
          this.mensajeError = `No se encontraron titulaciones registradas para el C.I. ${ci}.`;
        }
      },
      error: (err) => {
        this.cargandoLista = false;
        console.error('[ERROR API TITULACIONES] Falló la carga de titulaciones:', err);
        this.mensajeError = 'Ocurrió un error al consultar las titulaciones del estudiante.';
      }
    });
  }

  seleccionarTitulacion(titulacion: TramiteCompletoDto, index: number): void {
    this.indiceSeleccionado = index;
    this.titulacionSeleccionada = { ...titulacion };
  }

  procesarActualizacion(payload: ActualizarTitulacionPayload): void {
    this.guardandoFormulario = true;
    this.titulacionesService.actualizarTitulacion(payload).subscribe({
      next: () => {
        this.guardandoFormulario = false;
        this.mensajeError = '✅ Datos de titulación actualizados correctamente.';

        if (this.indiceSeleccionado !== null && this.titulaciones[this.indiceSeleccionado]) {
          Object.assign(this.titulaciones[this.indiceSeleccionado], payload);
          this.titulacionSeleccionada = { ...this.titulaciones[this.indiceSeleccionado] };
        }
      },
      error: (err) => {
        this.guardandoFormulario = false;
        console.error('[ERROR UPD TITULACION]', err);
        this.mensajeError = '❌ Error al intentar actualizar la titulación.';
      }
    });
  }

  cerrarPanelDerecho(): void {
    this.titulacionSeleccionada = null;
    this.indiceSeleccionado = null;
  }
}
