import { Component } from '@angular/core';
import { TarjetaSeccion } from '../tarjeta-perfil';
import { ActasService } from './actas.service';
import { ActaResumen, ActaDetalle, DetalleItem, TribunalItem } from './acta.model';

@Component({
  selector: 'ucb-gestion-actas',
  templateUrl: './gestion-actas.component.html',
  styleUrls: ['./gestion-actas.component.scss'],
  standalone: false
})
export class GestionActasComponent {
  estudianteSeleccionado: Record<string, unknown> | null = null;
  ciActual: string = '';

  actas: ActaResumen[] = [];
  actaResumenSeleccionada: ActaResumen | null = null;
  actaDetalleCompleta: ActaDetalle | null = null;
  indiceSeleccionado: number | null = null;

  seccionesTarjeta: TarjetaSeccion[] = [];

  cargandoLista: boolean = false;
  cargandoDetalle: boolean = false;
  mensajeError: string = '';

  constructor(private actasService: ActasService) {}

  recibirEstudiante(estudiante: unknown): void {
    this.mensajeError = '';
    this.actas = [];
    this.cerrarDetalle();

    if (!estudiante || typeof estudiante !== 'object') {
      this.estudianteSeleccionado = null;
      this.ciActual = '';
      return;
    }

    const est = estudiante as Record<string, unknown>;
    this.estudianteSeleccionado = est;
    const ci = est['documentoIdentidad'] || est['ci'] || est['carnet'];

    if (!ci) {
      this.mensajeError = 'El estudiante seleccionado no cuenta con un número de C.I. válido.';
      return;
    }

    this.ciActual = String(ci);
    this.cargarActasPorCi(this.ciActual);
  }

  cargarActasPorCi(ci: string): void {
    this.cargandoLista = true;

    this.actasService.getEstudianteActas(ci).subscribe({
      next: (datos) => {
        this.cargandoLista = false;
        const lista = Array.isArray(datos) ? datos : (datos ? [datos] : []);
        this.actas = lista;

        if (this.actas.length === 0) {
          this.mensajeError = `No se encontraron actas registradas para el C.I. ${ci}.`;
        }
      },
      error: (err) => {
        this.cargandoLista = false;
        console.error('[ERROR ACTAS] Error al cargar la lista de actas:', err);
        this.mensajeError = 'Ocurrió un error al consultar las actas del estudiante.';
      }
    });
  }

  seleccionarActa(actaResumen: ActaResumen, index: number): void {
    this.indiceSeleccionado = index;
    this.actaResumenSeleccionada = actaResumen;
    this.actaDetalleCompleta = null;
    this.seccionesTarjeta = [];

    const idActa = actaResumen.id || actaResumen.idActa;
    if (!idActa) {
      this.mensajeError = 'El acta seleccionada no tiene un identificador válido.';
      return;
    }

    this.cargandoDetalle = true;

    this.actasService.getActaDetalle(Number(idActa)).subscribe({
      next: (respuesta) => {
        this.cargandoDetalle = false;
        const detalle = Array.isArray(respuesta) ? respuesta[0] : respuesta;

        if (!detalle) {
          this.mensajeError = 'No se encontraron detalles para el acta seleccionada.';
          return;
        }

        const est = this.estudianteSeleccionado || {};
        this.actaDetalleCompleta = {
          ...est,
          ...actaResumen,
          ...detalle,
          nombres: actaResumen.nombres || String(est['nombres'] ?? ''),
          primerApellido: actaResumen.primerApellido || String(est['primerApellido'] ?? ''),
          segundoApellido: actaResumen.segundoApellido || String(est['segundoApellido'] ?? ''),
          nombreCarrera: actaResumen.nombreCarrera || 'Titulación'
        };

        this.construirSeccionesTarjeta(this.actaDetalleCompleta);
      },
      error: (err) => {
        this.cargandoDetalle = false;
        console.error('[ERROR DETALLE ACTA] Falló la consulta de GetActa:', err);
        this.mensajeError = 'Error al obtener el detalle del acta seleccionada.';
      }
    });
  }

  cerrarDetalle(): void {
    this.indiceSeleccionado = null;
    this.actaResumenSeleccionada = null;
    this.actaDetalleCompleta = null;
    this.seccionesTarjeta = [];
  }

  limpiarTexto(texto: unknown): string {
    if (texto === null || texto === undefined) return '';
    return String(texto)
      .replace(/^["'\\]+|["'\\]+$/g, '')
      .replace(/\\"/g, '"')
      .trim();
  }

  formatearFechaHora(fechaIso: unknown): { texto: string; valido: boolean } {
    if (!fechaIso || String(fechaIso).trim() === '') {
      return { texto: 'Sin fecha registrada', valido: false };
    }

    const str = String(fechaIso).trim();
    const fecha = new Date(str);

    if (isNaN(fecha.getTime())) {
      return { texto: str, valido: true };
    }

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return {
      texto: `${dia}/${mes}/${anio} — ${horas}:${minutos} hrs`,
      valido: true
    };
  }

  private parsearTribunales(tribunalesRaw: unknown): DetalleItem[] {
    if (!tribunalesRaw) {
      return [{ etiqueta: 'Tribunales', valor: 'Sin tribunales registrados', tieneDato: false }];
    }

    try {
      const lista: TribunalItem[] = typeof tribunalesRaw === 'string' ? JSON.parse(tribunalesRaw) : tribunalesRaw;

      if (!Array.isArray(lista) || lista.length === 0) {
        return [{ etiqueta: 'Tribunales', valor: 'Lista de tribunales vacía', tieneDato: false }];
      }

      return lista.map((trib: TribunalItem, idx: number) => {
        const nombreLimpio = this.limpiarTexto(trib.nombre) || 'Sin nombre';
        const cargoLimpio = String(trib.cargo || '')
          .replace(/<\/?br\s*\/?>/gi, ' | ')
          .replace(/\s*\|\s*$/g, '')
          .trim();

        const etiqueta = `Tribunal #${idx + 1} ${trib.idCargo ? '(Cód. ' + trib.idCargo + ')' : ''}`;
        const valor = cargoLimpio ? `${nombreLimpio} — ${cargoLimpio}` : nombreLimpio;

        return {
          etiqueta,
          valor,
          tieneDato: true
        };
      });
    } catch {
      const textoLimpio = String(tribunalesRaw).replace(/<\/?br\s*\/?>/gi, ' ');
      return [{ etiqueta: 'Tribunales', valor: textoLimpio, tieneDato: true }];
    }
  }

  private esValido(valor: unknown): boolean {
    if (valor === null || valor === undefined) return false;
    const str = String(valor).trim();
    if (str === '') return false;
    const upper = str.toUpperCase();
    return !(upper === 'NULL' || upper === 'N/A' || upper === 'SIN DATO' || upper === 'SD');
  }

  private crearItem(etiqueta: string, valorCrudo: unknown, textoFaltante: string = 'Sin dato registrado'): DetalleItem {
    const limpio = this.limpiarTexto(valorCrudo);
    const tieneDato = this.esValido(limpio);
    return {
      etiqueta,
      valor: tieneDato ? limpio : textoFaltante,
      tieneDato
    };
  }

  private construirSeccionesTarjeta(d: ActaDetalle): void {
    const fechaDef = this.formatearFechaHora(d.fechaDefensa);
    const fechaHora = this.formatearFechaHora(d.fechaHora);
    const fechaReg = this.formatearFechaHora(d.fechaRegistro);

    const itemsTribunales = this.parsearTribunales(d.tribunales);

    const tieneTutor = d.idTutor !== null && d.idTutor !== undefined && Number(d.idTutor) > 0;
    const itemTutor: DetalleItem = {
      etiqueta: 'Tutor Asignado',
      valor: tieneTutor ? `ID Tutor: ${d.idTutor} (Cargo: ${d.cargoTutor ?? 'N/A'})` : 'Sin tutor asignado (0)',
      tieneDato: tieneTutor
    };

    const usuarioReg = d.usuarioRegistro
      ? (String(d.usuarioRegistro).endsWith('@ucb.edu.bo') ? d.usuarioRegistro : `${d.usuarioRegistro}@ucb.edu.bo`)
      : null;

    this.seccionesTarjeta = [
      {
        titulo: 'Trabajo de Grado y Defensa',
        icono: 'menu_book',
        detalles: [
          this.crearItem('Título del Trabajo / Tesis', d.nombreTesis, 'Sin título registrado'),
          this.crearItem('Modalidad de Titulación', d.modalidad || (d.idModalidad ? `Cód. Modalidad: ${d.idModalidad}` : null), 'Sin modalidad'),
          this.crearItem('Número de Tesis / Acta', d.numeroTesis ? `N° ${d.numeroTesis}` : null, 'Sin número'),
          {
            etiqueta: 'Calificación / Nota',
            valor: d.nota !== null && d.nota !== undefined ? `${d.nota} / 100 pts.` : 'Sin calificación',
            tieneDato: d.nota !== null && d.nota !== undefined
          },
          this.crearItem('Observaciones / Mención', d.observaciones, 'Sin observaciones'),
          this.crearItem('Área de Investigación', d.area, 'Sin área registrada'),
          this.crearItem('Lugar de Defensa', d.lugarDefensa, 'Sin lugar asignado'),
          {
            etiqueta: 'Fecha de Defensa',
            valor: fechaDef.texto,
            tieneDato: fechaDef.valido
          },
          {
            etiqueta: 'Fecha y Hora Programada',
            valor: fechaHora.texto,
            tieneDato: fechaHora.valido
          },
          this.crearItem('Hora Manual (horam)', d.horam, 'No especificada')
        ]
      },
      {
        titulo: 'Tribunales Examinadores y Tutoría',
        icono: 'groups',
        detalles: [
          ...itemsTribunales,
          itemTutor,
          {
            etiqueta: 'Parámetros de Tribunales',
            valor: `T1: ${d.tribunal1 ?? '-'} (Cargo ${d.cargoTrib1 ?? '-'}) | T2: ${d.tribunal2 ?? '-'} (Cargo ${d.cargoTrib2 ?? '-'}) | T3: ${d.tribunal3 ?? '-'} (Cargo ${d.cargoTrib3 ?? '-'})`,
            tieneDato: !!(d.tribunal1 || d.tribunal2 || d.tribunal3)
          }
        ]
      },
      {
        titulo: 'Información Académica y Sede',
        icono: 'school',
        detalles: [
          this.crearItem('Carrera / Programa', d.nombreCarrera),
          this.crearItem('Sigla del Programa', d.sigla),
          this.crearItem('Escuela / Departamento', d.nombre),
          this.crearItem('Facultad / Unidad', d.nombreFacultad),
          this.crearItem('Sede / Regional', d.nomRegional ? `${d.nomRegional} (Cód. ${d.regional})` : null),
          this.crearItem('C.I. Estudiante', d.documentoIdentidad)
        ]
      },
      {
        titulo: 'Auditoría y Control de Registro',
        icono: 'verified_user',
        detalles: [
          this.crearItem('Código de Acta', d.id),
          this.crearItem('Periodo Académico', d.idPeriodo),
          {
            etiqueta: 'Estado del Registro',
            valor: d.estadoRegistro === 1 ? 'ACTIVO / VIGENTE (1)' : `Estado: ${d.estadoRegistro ?? 'N/A'}`,
            tieneDato: d.estadoRegistro === 1
          },
          this.crearItem('Usuario de Registro', usuarioReg, 'No registrado'),
          {
            etiqueta: 'Fecha de Registro',
            valor: fechaReg.texto,
            tieneDato: fechaReg.valido
          }
        ]
      }
    ];
  }
}
