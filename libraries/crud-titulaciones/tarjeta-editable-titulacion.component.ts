import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TarjetaSeccion, TarjetaDetalle } from '../tarjeta-perfil';
import { ActualizarTitulacionPayload, TramiteCompletoDto } from './titulacion.model';

@Component({
  selector: 'ucb-tarjeta-editable-titulacion',
  templateUrl: './tarjeta-editable-titulacion.component.html',
  styleUrls: ['./tarjeta-editable-titulacion.component.scss'],
  standalone: false
})
export class TarjetaEditableTitulacionComponent implements OnInit, OnChanges {
  @Input() titulacion: TramiteCompletoDto | null = null;
  @Input() guardando: boolean = false;

  @Output() guardar = new EventEmitter<ActualizarTitulacionPayload>();
  @Output() cerrar = new EventEmitter<void>();

  formulario!: FormGroup;
  seccionesTarjeta: TarjetaSeccion[] = [];

  constructor(private fb: FormBuilder) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['titulacion'] && this.formulario) {
      this.cargarDatos();
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      id: [{ value: null, disabled: true }],
      idActa: [{ value: null, disabled: true }],
      idPersona: [{ value: null, disabled: true }],
      fechaSolicitud: [{ value: '', disabled: true }],
      fechaRegistro: [{ value: '', disabled: true }],
      fechaUltModificacion: [{ value: '', disabled: true }],

      tallerGrado: [null],
      notaTaller: [null],
      planEstudios: [null],
      actasDefensa: [null],
      resolucion: [null],
      solCompleta: [null],
      estadoTramite: [null],
      estadoRegistro: [null],
      habilitado: [null],
      anulado: [null],
      cartonAnulado: [null],
      usuarioRegistro: [''],
      timeline: [''],
      observaciones: ['']
    });
  }

  private cargarDatos(): void {
    if (!this.titulacion) return;

    this.armarSeccionesTarjeta();

    const t = this.titulacion;
    this.formulario.patchValue({
      id: t.idTramite ?? t.id ?? null,
      idActa: t.idActa ?? null,
      idPersona: t.idPersona ?? null,
      fechaSolicitud: t.fechaSolicitud ?? t.fechaDefensa ?? '',
      fechaRegistro: t.fechaRegistro ?? '',
      fechaUltModificacion: t.fechaUltModificacion ?? '',

      tallerGrado: t.tallerGrado ?? null,
      notaTaller: t.notaTaller ?? null,
      planEstudios: t.planEstudios ?? null,
      actasDefensa: t.actasDefensa ?? null,
      observaciones: t.observaciones ?? '',
      habilitado: t.habilitado ?? null,
      resolucion: t.resolucion ?? null,
      solCompleta: t.solCompleta ?? null,
      estadoRegistro: t.estadoRegistro ?? null,
      usuarioRegistro: t.usuarioRegistro ?? '',
      estadoTramite: t.estadoTramite ?? null,
      timeline: t.timeline ?? '',
      anulado: t.anulado ?? null,
      cartonAnulado: t.cartonAnulado ?? null
    });

    this.formulario.markAsPristine();
  }

  esValido(valor: unknown): boolean {
    if (valor === null || valor === undefined) return false;
    const str = String(valor).trim();
    if (str === '') return false;

    const upper = str.toUpperCase();
    return !(upper.startsWith('SIN ') || upper === 'SD' || upper === 'S/D' || upper === 'NULL' || upper === 'N/A');
  }

  private crearDetalle(etiqueta: string, valorCrudo: unknown, textoFaltante: string = 'Sin dato'): TarjetaDetalle {
    const tieneDato = this.esValido(valorCrudo);
    const tieneTexto = valorCrudo !== null && valorCrudo !== undefined && String(valorCrudo).trim() !== '';
    return {
      etiqueta,
      valor: tieneDato ? String(valorCrudo) : (tieneTexto ? String(valorCrudo) : textoFaltante),
      tieneDato
    };
  }

  private armarSeccionesTarjeta(): void {
    if (!this.titulacion) return;
    const t = this.titulacion;
    const sexoTexto = t['sexo'] === 1 ? 'MASCULINO (1)' : (t['sexo'] === 2 ? 'FEMENINO (2)' : t['sexo']);

    this.seccionesTarjeta = [
      {
        titulo: 'Datos Académicos y Defensa',
        icono: 'school',
        detalles: [
          this.crearDetalle('Carrera', t.nombreCarrera),
          this.crearDetalle('Sigla', t.siglaCarrera),
          this.crearDetalle('Facultad', t.nomFacultad || t.nombreFacultad),
          this.crearDetalle('Sede', t.nomRegional),
          this.crearDetalle('Cód. Regional', t.regional),
          this.crearDetalle('Fecha Defensa', t.fechaDefensa, 'Sin fecha'),
          this.crearDetalle('Estado Trámite', t.estadoTramite)
        ]
      },
      {
        titulo: 'Identificación y Datos',
        icono: 'badge',
        detalles: [
          this.crearDetalle('Documento', t.documentoIdentidad),
          this.crearDetalle('Tipo Doc.', `${t['tipoDoc'] || ''} (${t['abreviacioDoc'] || ''})`.trim()),
          this.crearDetalle('Expedido en', t['expedidoEn']),
          this.crearDetalle('Fecha Nac.', t['fechaNac']),
          this.crearDetalle('Sexo', sexoTexto)
        ]
      },
      {
        titulo: 'Contacto',
        icono: 'contact_mail',
        detalles: [
          this.crearDetalle('País Nacimiento', t['nacidoEn']),
          this.crearDetalle('Celular', t['numeroCelular']),
          this.crearDetalle('Email', t['email']),
          this.crearDetalle('Dirección', t['direccion'])
        ]
      }
    ];
  }

  faltaValorControl(controlName: string): boolean {
    const ctrl = this.formulario.get(controlName);
    if (!ctrl) return false;
    return !this.esValido(ctrl.value);
  }

  enviar(): void {
    const raw = this.formulario.getRawValue();
    const fechaIso = new Date().toISOString();

    const payload: ActualizarTitulacionPayload = {
      id: Number(raw.id ?? 0),
      idActa: Number(raw.idActa ?? 0),
      idPersona: Number(raw.idPersona ?? 0),
      tallerGrado: Number(raw.tallerGrado ?? 0),
      notaTaller: Number(raw.notaTaller ?? 0),
      planEstudios: Number(raw.planEstudios ?? 0),
      actasDefensa: Number(raw.actasDefensa ?? 0),
      observaciones: String(raw.observaciones ?? ''),
      habilitado: Number(raw.habilitado ?? 0),
      resolucion: Number(raw.resolucion ?? 0),
      solCompleta: Number(raw.solCompleta ?? 0),
      fechaSolicitud: String(raw.fechaSolicitud || fechaIso),
      fechaUltModificacion: String(raw.fechaUltModificacion || fechaIso),
      estadoRegistro: Number(raw.estadoRegistro ?? 0),
      fechaRegistro: String(raw.fechaRegistro || fechaIso),
      usuarioRegistro: String(raw.usuarioRegistro ?? ''),
      estadoTramite: Number(raw.estadoTramite ?? 0),
      timeline: String(raw.timeline ?? ''),
      anulado: Number(raw.anulado ?? 0),
      cartonAnulado: Number(raw.cartonAnulado ?? 0)
    };

    this.guardar.emit(payload);
  }
}
