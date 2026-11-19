import { TarjetaSeccion, TarjetaDetalle } from '../tarjeta-perfil';

export class NominacionMapper {
  private static crearDetalle(etiqueta: string, valor: unknown): TarjetaDetalle {
    const tieneDato = valor !== undefined && valor !== null && String(valor).trim() !== '';

    return {
      etiqueta,
      valor: tieneDato ? String(valor).trim() : 'Dato faltante',
      tieneDato
    };
  }

  static mapearSecciones(nom: Record<string, unknown>): TarjetaSeccion[] {
    if (!nom) return [];

    return [
      {
        titulo: 'Detalles del Título',
        icono: 'military_tech',
        detalles: [
          this.crearDetalle('ID Nominación', nom['id']),
          this.crearDetalle('Descripción', nom['descripcion']),
          this.crearDetalle('Provisión Nacional', nom['provisionNacional']),
          this.crearDetalle('Nombre Alterno', nom['nombreAlterno'])
        ]
      },
      {
        titulo: 'Datos Académicos',
        icono: 'school',
        detalles: [
          this.crearDetalle('Carrera', nom['nombreCarrera']),
          this.crearDetalle('Cód. Carrera', nom['codigoCarrera']),
          this.crearDetalle('Sede', nom['sede']),
          this.crearDetalle('ID Sede', nom['idSede']),
          this.crearDetalle('ID Subdepto', nom['idSubdepto'])
        ]
      },
      {
        titulo: 'Datos de Registro',
        icono: 'verified_user',
        detalles: [
          this.crearDetalle('Sexo (Cód)', nom['sexo']),
          this.crearDetalle('Usuario Registro', nom['usuarioRegistro'])
        ]
      }
    ];
  }
}
