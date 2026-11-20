import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { armarIdentificadoresAutoridad, formatearValor } from '../helpers/autoridad-formato';
import { Autoridad, Cargo, DetalleAutoridad, EdicionAutoridad } from '../models/autoridad.model';
import { ComboLocal, OpcionCombo } from '../helpers/combo-local';
import { FocoModal } from '../helpers/foco-modal';
import { GRADOS_ACADEMICOS } from '../helpers/grados-academicos';
import { crearIdUnico } from '../helpers/identificador-unico';

interface CampoTexto {
  control: 'nombreSgt' | 'nombreSede' | 'facultad' | 'departamento' | 'nombreCarrera';
  etiqueta: string;
  placeholder: string;
}

@Component({
  selector: 'ucb-editar-autoridad',
  standalone: false,
  templateUrl: './editar-autoridad.component.html',
  styleUrls: ['./editar-autoridad.component.scss'],
})
export class EditarAutoridadComponent implements OnChanges, OnDestroy {
  @Input() autoridad: Autoridad | null = null;
  @Input() cargos: Cargo[] = [];
  @Input() cargandoCargos = false;
  @Input() errorCargos = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<EdicionAutoridad>();
  @Output() reintentarCargos = new EventEmitter<void>();

  @ViewChild('dialogo')
  set dialogo(ref: ElementRef<HTMLElement> | undefined) {
    if (ref) {
      this.foco.activar(ref.nativeElement);
    }
  }

  readonly valor = formatearValor;
  readonly idBase = crearIdUnico('editar-autoridad');
  readonly foco = new FocoModal();

  readonly campoNombreSgt: CampoTexto = {
    control: 'nombreSgt',
    etiqueta: 'Nombre SGT',
    placeholder: 'Nombre en el SGT',
  };

  readonly camposUbicacion: CampoTexto[] = [
    { control: 'nombreSede', etiqueta: 'Sede', placeholder: 'Nombre de la sede' },
    { control: 'facultad', etiqueta: 'Facultad', placeholder: 'Nombre de la facultad' },
    { control: 'departamento', etiqueta: 'Departamento', placeholder: 'Nombre del departamento' },
    { control: 'nombreCarrera', etiqueta: 'Carrera', placeholder: 'Nombre de la carrera' },
  ];

  readonly form = new FormGroup({
    nombreCompleto: new FormControl('', { nonNullable: true }),
    gradoAcad: new FormControl<string | null>(null),
    nombreSgt: new FormControl('', { nonNullable: true }),
    idCargo: new FormControl<number | null>(null),
    interino: new FormControl(false, { nonNullable: true }),
    nombreSede: new FormControl('', { nonNullable: true }),
    facultad: new FormControl('', { nonNullable: true }),
    departamento: new FormControl('', { nonNullable: true }),
    nombreCarrera: new FormControl('', { nonNullable: true }),
  });

  readonly comboGrado = new ComboLocal(
    `${this.idBase}-grado`,
    () => this.form.controls.gradoAcad.value,
    (v) => this.form.controls.gradoAcad.setValue(v as string | null),
  );

  readonly comboCargo = new ComboLocal(
    `${this.idBase}-cargo`,
    () => this.form.controls.idCargo.value,
    (v) => this.form.controls.idCargo.setValue(v as number | null),
  );

  identificadores: DetalleAutoridad[] = [];

  constructor() {
    this.comboCargo.alReintentar = () => this.reintentarCargos.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cargos']) {
      this.comboCargo.establecerOpciones(
        this.cargos.map((c) => ({ valor: c.id, etiqueta: c.descripcion, titulo: c.observaciones })),
      );
    }
    if (changes['cargandoCargos']) {
      this.comboCargo.cargando = this.cargandoCargos;
    }
    if (changes['errorCargos']) {
      this.comboCargo.error = this.errorCargos;
    }
    if (changes['autoridad']) {
      this.cargarFormulario();
    }
  }

  ngOnDestroy(): void {
    this.foco.desactivar();
  }

  enviar(): void {
    const autoridad = this.autoridad;
    if (!autoridad) {
      return;
    }
    const edicion: EdicionAutoridad = { idAutoridad: autoridad.id, ...this.form.getRawValue() };
    this.guardar.emit(edicion);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.cerrar.emit();
  }

  trackByEtiqueta(_: number, item: DetalleAutoridad): string {
    return item.etiqueta;
  }

  private cargarFormulario(): void {
    const a = this.autoridad;
    if (!a) {
      this.identificadores = [];
      return;
    }

    this.form.setValue({
      nombreCompleto: this.textoLimpio(a.nombreCompleto),
      gradoAcad: null,
      nombreSgt: this.textoLimpio(a.nombreSgt),
      idCargo: a.idCargo ?? null,
      interino: !!a.interino,
      nombreSede: this.textoLimpio(a.nombreSede),
      facultad: this.textoLimpio(a.facultad),
      departamento: this.textoLimpio(a.departamento),
      nombreCarrera: this.textoLimpio(a.nombreCarrera),
    });

    this.prepararGrado(a.gradoAcad);

    this.comboCargo.textoRespaldo = this.textoLimpio(a.cargo);
    this.comboCargo.sincronizarTexto();

    this.identificadores = armarIdentificadoresAutoridad(a);
  }

  private prepararGrado(gradoActual: string | null | undefined): void {
    const opciones: OpcionCombo[] = GRADOS_ACADEMICOS.map((g) => ({
      valor: g,
      etiqueta: this.normalizar(g) || 'Sin grado',
    }));

    let seleccionado: string | null = null;
    if (gradoActual !== null && gradoActual !== undefined) {
      const buscado = this.normalizar(gradoActual);
      const coincidencia = opciones.find((o) => this.normalizar(String(o.valor)) === buscado);
      if (coincidencia) {
        seleccionado = String(coincidencia.valor);
      } else {
        opciones.push({ valor: gradoActual, etiqueta: buscado });
        seleccionado = gradoActual;
      }
    }

    this.form.controls.gradoAcad.setValue(seleccionado);
    this.comboGrado.establecerOpciones(opciones);
  }

  private normalizar(texto: string): string {
    return texto.replace(/\s+/g, ' ').trim();
  }

  private textoLimpio(valor: string | null | undefined): string {
    const limpio = formatearValor(valor);
    return limpio === '-' ? '' : limpio;
  }
}
