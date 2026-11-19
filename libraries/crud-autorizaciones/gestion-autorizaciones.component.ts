import { Component } from '@angular/core';
import { TarjetaSeccion, TarjetaDetalle } from '../tarjeta-perfil';
import { AutorizacionesService } from './autorizaciones.service';
import { AutorizacionDto } from './autorizacion.model';

@Component({
  selector: 'ucb-gestion-autorizaciones',
  templateUrl: './gestion-autorizaciones.component.html',
  styleUrls: ['./gestion-autorizaciones.component.scss'],
  standalone: false
})
export class GestionAutorizacionesComponent {
  vistaActual: 'buscar' | 'crear' | 'editar' = 'buscar';
  autorizacionesEncontradas: { raw: Record<string, unknown>; secciones: TarjetaSeccion[] }[] = [];

  buscando: boolean = false;
  mensajeAlerta: string = '';
  autorizacionAEditarTemporal: AutorizacionDto | null = null;
  idPersonaActual: number | null = null;

  constructor(private autorizacionesService: AutorizacionesService) {}

  cambiarVista(nuevaVista: 'buscar' | 'crear' | 'editar'): void {
    this.vistaActual = nuevaVista;
    this.mensajeAlerta = '';
    if (nuevaVista === 'crear') {
      this.autorizacionAEditarTemporal = null;
    }
  }

  recibirUsuario(usuario: unknown): void {
    this.autorizacionesEncontradas = [];
    this.idPersonaActual = null;
    this.mensajeAlerta = '';

    if (!usuario || typeof usuario !== 'object') return;

    const usr = usuario as Record<string, unknown>;
    const id = usr['idPersona'] || usr['id'] || usr['idUsuario'];

    if (!id) {
      this.mensajeAlerta = 'El usuario seleccionado no cuenta con un ID válido.';
      return;
    }

    this.idPersonaActual = Number(id);
    this.buscando = true;

    this.autorizacionesService.getAutorizacion(this.idPersonaActual).subscribe({
      next: (datos) => {
        this.buscando = false;
        const arregloDatos: AutorizacionDto[] = Array.isArray(datos) ? datos : (datos ? [datos] : []);

        if (arregloDatos.length > 0) {
          this.autorizacionesEncontradas = arregloDatos.map(aut => {
            const tieneEtapa = aut.etapa !== null && aut.etapa !== undefined && String(aut.etapa).trim() !== '';
            const etapaFormateada = tieneEtapa
              ? (aut.etapa.endsWith('@ucb.edu.bo') ? aut.etapa : `${aut.etapa}@ucb.edu.bo`)
              : 'Sin etapa asignada';

            const personaCompleta: Record<string, unknown> = {
              ...usr,
              ...aut,
              nombres: usr['nombres'] || usr['nombre'] || '',
              primerApellido: usr['primerApellido'] || usr['apellidos'] || '',
              segundoApellido: usr['segundoApellido'] || '',
              tercerApellido: usr['tercerApellido'] || '',
              nombreCarrera: null
            };

            const crearItem = (etiqueta: string, valor: unknown, textoFaltante: string = 'Sin registrar'): TarjetaDetalle => {
              const existe = valor !== null && valor !== undefined && String(valor).trim() !== '';
              return {
                etiqueta,
                valor: existe ? String(valor) : textoFaltante,
                tieneDato: existe
              };
            };

            const secciones: TarjetaSeccion[] = [
              {
                titulo: 'Datos de Autorización',
                icono: 'shield',
                detalles: [
                  crearItem('ID Autorización', aut.id, 'Falta ID'),
                  crearItem('ID Persona', aut.idPersona, 'Falta ID Persona'),
                  {
                    etiqueta: 'Etapa / Cuenta',
                    valor: etapaFormateada,
                    tieneDato: tieneEtapa
                  },
                  crearItem('Rol Asignado', aut.rol, 'Sin rol')
                ]
              },
              {
                titulo: 'Ubicación y Auditoría',
                icono: 'domain',
                detalles: [
                  crearItem('ID Sede', aut.idSede, 'Sin sede'),
                  crearItem('ID Departamento', aut.idDepartamento, 'Sin departamento'),
                  crearItem('C.I. / Documento', usr['documentoIdentidad'] || usr['ci'], 'Sin documento'),
                  crearItem('Usuario Registro', aut.usuarioRegistro, 'No registrado')
                ]
              }
            ];

            return {
              raw: personaCompleta,
              secciones
            };
          });
        } else {
          this.mensajeAlerta = 'Este usuario no tiene autorizaciones registradas.';
        }
      },
      error: (err) => {
        this.buscando = false;
        console.error('[ERROR AUTORIZACIONES]', err);
        this.mensajeAlerta = 'Ocurrió un error al consultar las autorizaciones en el servidor.';
      }
    });
  }

  prepararEdicion(autRaw: Record<string, unknown>): void {
    this.autorizacionAEditarTemporal = autRaw as unknown as AutorizacionDto;
    this.cambiarVista('editar');
  }

  guardarAPI(datos: AutorizacionDto): void {
    this.autorizacionesService.addAutorizacion(datos).subscribe({
      next: () => {
        this.mensajeAlerta = '✅ Autorización creada correctamente.';
        this.cambiarVista('buscar');
      },
      error: (err) => {
        console.error('[ERROR CREAR AUTORIZACION]', err);
        this.mensajeAlerta = '❌ Error al guardar la autorización.';
      }
    });
  }

  actualizarAPI(datos: AutorizacionDto): void {
    this.autorizacionesService.updAutorizacion(datos.id, datos.idPersona).subscribe({
      next: () => {
        this.mensajeAlerta = '✅ Autorización actualizada correctamente.';
        const index = this.autorizacionesEncontradas.findIndex(a => a.raw['id'] === datos.id);
        if (index !== -1) {
          const rawActualizado = { ...this.autorizacionesEncontradas[index].raw, ...datos };
          this.recibirUsuario(rawActualizado);
        }
        this.cambiarVista('buscar');
      },
      error: (err) => {
        console.error('[ERROR ACTUALIZAR AUTORIZACION]', err);
        this.mensajeAlerta = '❌ Error al actualizar la autorización.';
      }
    });
  }

  eliminarAPI(id: number | unknown): void {
    const numId = Number(id);
    if (!numId) return;

    this.autorizacionesService.delAutorizacion(numId).subscribe({
      next: () => {
        this.mensajeAlerta = '✅ Autorización eliminada correctamente.';
        this.autorizacionesEncontradas = this.autorizacionesEncontradas.filter(a => a.raw['id'] !== numId);
      },
      error: (err) => {
        console.error('[ERROR ELIMINAR AUTORIZACION]', err);
        this.mensajeAlerta = '❌ Error al eliminar la autorización.';
      }
    });
  }
}
