import { TarjetaDetalle, TarjetaSeccion } from '../tarjeta-perfil';
import { EstudianteCompleto } from './persona-search.model';

export class EstudianteMapper {
  private static evaluarDato(valor: unknown): boolean {
    if (valor === undefined || valor === null || String(valor).trim() === '') {
      return false;
    }

    const valStr = String(valor).toUpperCase();
    return !(
      valStr.includes('FALTA') ||
      valStr.includes('SIN DEPARTAMENTO') ||
      valStr.includes('SIN CIUDAD') ||
      valStr.includes('SIN PAIS')
    );
  }

  private static prepararValor(valor: unknown): string {
    if (!this.evaluarDato(valor)) {
      if (valor === undefined || valor === null || String(valor).trim() === '') {
        return 'Dato faltante';
      }
      return String(valor);
    }

    return String(valor).trim();
  }

  private static crearDetalle(etiqueta: string, valor: unknown): TarjetaDetalle {
    return {
      etiqueta,
      valor: this.prepararValor(valor),
      tieneDato: this.evaluarDato(valor),
    };
  }

  static mapearSeccionesCompletas(est: EstudianteCompleto | null | undefined): TarjetaSeccion[] {
    if (!est) {
      return [];
    }

    return [
      {
        titulo: 'Identidad y Documentos',
        detalles: [
          this.crearDetalle('Doc. Identidad', est.documentoIdentidad),
          this.crearDetalle('Expedido En', est.expedidoEn),
          this.crearDetalle('Depto. Expedición', est.nomDeptoExp),
          this.crearDetalle('Tipo Doc.', est.tipoDoc),
          this.crearDetalle('Abreviación', est.abreviacioDoc),
          this.crearDetalle('Cód. Tipo Doc.', est.tipoDocumento),
          this.crearDetalle('Val. Domi. CI', est.valDomiCI),
        ],
      },
      {
        titulo: 'Nacimiento y Origen',
        detalles: [
          this.crearDetalle('Nacionalidad', est.nacionalidad),
          this.crearDetalle('Nacido En', est.nacidoEn),
          this.crearDetalle('País Nacimiento', est.paisNac),
          this.crearDetalle('Departamento', est.bolDepartamento),
          this.crearDetalle('Provincia', est.nombreProvincia),
          this.crearDetalle('Municipio', est.municipio),
          this.crearDetalle('Ciudad', est.ciudadNacimiento),
        ],
      },
      {
        titulo: 'Contacto y Ubicación',
        detalles: [
          this.crearDetalle('Dirección', est.direccion),
          this.crearDetalle('Nro. Celular', est.numeroCelular),
          this.crearDetalle('Nro. Domicilio', est.numeroDomicilio),
          this.crearDetalle('Email', est.email),
        ],
      },
      {
        titulo: 'Datos Académicos',
        detalles: [
          this.crearDetalle('Facultad', est.nombreFacultad),
          this.crearDetalle('Carrera', est.nombreCarrera),
          this.crearDetalle('Nombre Detallado', est.nombreDetallado),
          this.crearDetalle('Sigla Carrera', est.siglaCarrera),
          this.crearDetalle('Regional', est.nomRegional),
          this.crearDetalle('Sigla Regional', est.siglaRegional),
          this.crearDetalle('Grado Académico', est.gradoAcadSubdepto),
          this.crearDetalle('Tipo SubDepto.', est.tipoSubD),
        ],
      },
      {
        titulo: 'Trámite y Defensa',
        detalles: [
          this.crearDetalle('ID Trámite', est.idTramite),
          this.crearDetalle('ID Acta', est.idActa),
          this.crearDetalle('Fecha de Defensa', est.fechaDefensa),
        ],
      },
    ];
  }

  static esNombreValido(valor: unknown): boolean {
    return this.evaluarDato(valor);
  }
}
