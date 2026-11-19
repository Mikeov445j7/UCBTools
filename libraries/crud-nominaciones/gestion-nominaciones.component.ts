import { Component } from '@angular/core';
import { TarjetaSeccion } from '../tarjeta-perfil';
import { NominacionesService } from './nominaciones.service';
import { NominacionDto, NominacionUpdPayload } from './nominacion.model';
import { NominacionMapper } from './nominacion.mapper';

@Component({
  selector: 'ucb-gestion-nominaciones',
  templateUrl: './gestion-nominaciones.component.html',
  styleUrls: ['./gestion-nominaciones.component.scss'],
  standalone: false
})
export class GestionNominacionesComponent {
  vistaActual: 'buscar' | 'crear' | 'editar' = 'buscar';
  nominacionesEncontradas: { raw: Record<string, unknown>; secciones: TarjetaSeccion[] }[] = [];

  buscando: boolean = false;
  mensajeAlerta: string = '';
  nominacionAEditarTemporal: NominacionDto | null = null;
  idSubdeptoActual: number | null = null;

  constructor(private nominacionesService: NominacionesService) {}

  cambiarVista(nuevaVista: 'buscar' | 'crear' | 'editar'): void {
    this.vistaActual = nuevaVista;
    this.mensajeAlerta = '';

    if (nuevaVista === 'crear') {
      this.nominacionAEditarTemporal = null;
    }
  }

  recibirEstudiante(estudiante: unknown): void {
    this.nominacionesEncontradas = [];
    this.mensajeAlerta = '';
    this.idSubdeptoActual = null;

    if (!estudiante || typeof estudiante !== 'object') return;

    const est = estudiante as Record<string, unknown>;
    const idSubDepto = est['idSubdepartamento'] ?? est['idSubdepto'];

    if (idSubDepto != null) {
      this.idSubdeptoActual = Number(idSubDepto);
      this.buscando = true;

      this.nominacionesService.getNominacionesSubdepto(this.idSubdeptoActual).subscribe({
        next: (datos) => {
          this.buscando = false;

          if (!datos) {
            this.mensajeAlerta = 'No se encontraron nominaciones para el subdepartamento de este estudiante.';
            return;
          }

          const arregloDatos = Array.isArray(datos) ? datos : [datos];

          if (arregloDatos.length > 0) {
            this.nominacionesEncontradas = arregloDatos.map(nom => ({
              raw: { ...est, ...nom } as Record<string, unknown>,
              secciones: NominacionMapper.mapearSecciones(nom as unknown as Record<string, unknown>)
            }));
          } else {
            this.mensajeAlerta = 'No se encontraron nominaciones para el subdepartamento de este estudiante.';
          }
        },
        error: (err) => {
          this.buscando = false;
          console.error('[ERROR NOMINACIONES] Falló al traer nominaciones:', err);
          this.mensajeAlerta = 'Ocurrió un error al consultar las nominaciones del estudiante.';
        }
      });
    } else {
      this.mensajeAlerta = 'El estudiante seleccionado no cuenta con un ID de Subdepartamento.';
    }
  }

  prepararEdicion(nominacion: Record<string, unknown>): void {
    this.nominacionAEditarTemporal = nominacion as unknown as NominacionDto;
    this.cambiarVista('editar');
  }

  guardarNominacionAPI(datos: NominacionDto | NominacionUpdPayload): void {
    const dto = datos as NominacionDto;
    this.nominacionesService.addNominacion(dto).subscribe({
      next: () => {
        this.mensajeAlerta = '✅ Nominación creada correctamente.';
        this.cambiarVista('buscar');
      },
      error: (err) => {
        console.error('[ERROR CREAR NOMINACION]', err);
        this.mensajeAlerta = '❌ Ocurrió un error al guardar la nominación en el servidor.';
      }
    });
  }

  actualizarNominacionAPI(datosEditados: NominacionDto | NominacionUpdPayload): void {
    this.nominacionesService.updNominacion(datosEditados).subscribe({
      next: () => {
        this.mensajeAlerta = '✅ Nominación actualizada correctamente.';

        const idx = this.nominacionesEncontradas.findIndex(n => n.raw['id'] === datosEditados.id);
        if (idx !== -1) {
          const rawActualizado = { ...this.nominacionesEncontradas[idx].raw, ...datosEditados };
          this.nominacionesEncontradas[idx] = {
            raw: rawActualizado,
            secciones: NominacionMapper.mapearSecciones(rawActualizado)
          };
        }

        this.cambiarVista('buscar');
      },
      error: (err) => {
        console.error('[ERROR ACTUALIZAR NOMINACION]', err);
        this.mensajeAlerta = '❌ Ocurrió un error al actualizar la nominación.';
      }
    });
  }

  eliminarNominacionAPI(id: number | string): void {
    this.nominacionesService.delNominacion(id).subscribe({
      next: () => {
        this.mensajeAlerta = '✅ Nominación eliminada correctamente.';
        this.nominacionesEncontradas = this.nominacionesEncontradas.filter(n => n.raw['id'] !== id);
      },
      error: (err) => {
        console.error('[ERROR ELIMINAR NOMINACION]', err);
        this.mensajeAlerta = '❌ Ocurrió un error al eliminar la nominación.';
      }
    });
  }
}
