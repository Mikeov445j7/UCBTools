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

import { armarIdentificadoresAutoridad, armarInformacionAutoridad, formatearValor } from '../helpers/autoridad-formato';
import { AsignacionAutoridad, Autoridad, Cargo, DetalleAutoridad } from '../models/autoridad.model';
import { filtrarCargosPorVariante } from '../helpers/cargo-variante';
import { ComboLocal, OpcionCombo } from '../helpers/combo-local';
import { FocoModal } from '../helpers/foco-modal';
import { GRADOS_ACADEMICOS } from '../helpers/grados-academicos';
import { crearIdUnico } from '../helpers/identificador-unico';

interface FilaAsignacion extends DetalleAutoridad {
  esNombre?: boolean;
  esGrado?: boolean;
  esCargo?: boolean;
}

@Component({
  selector: 'ucb-asignar-autoridad',
  standalone: false,
  templateUrl: './asignar-autoridad.component.html',
  styleUrls: ['./asignar-autoridad.component.scss'],
})
export class AsignarAutoridadComponent implements OnChanges, OnDestroy {
  @Input() autoridades: Autoridad[] = [];
  @Input() cargandoAutoridades = false;
  @Input() errorAutoridades = false;
  @Input() detalle: Autoridad | null = null;
  @Input() cargandoDetalle = false;
  @Input() errorDetalle = false;
  @Input() cargos: Cargo[] = [];
  @Input() cargandoCargos = false;
  @Input() errorCargos = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() autoridadElegida = new EventEmitter<Autoridad | null>();
  @Output() reintentarAutoridades = new EventEmitter<void>();
  @Output() reintentarDetalle = new EventEmitter<void>();
  @Output() reintentarCargos = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<AsignacionAutoridad>();

  @ViewChild('dialogo')
  set dialogo(ref: ElementRef<HTMLElement> | undefined) {
    if (ref) {
      this.foco.activar(ref.nativeElement);
    }
  }

  readonly valor = formatearValor;
  readonly idBase = crearIdUnico('asignar-autoridad');
  readonly foco = new FocoModal();

  readonly form = new FormGroup({
    nombreCompleto: new FormControl('', { nonNullable: true }),
    gradoAcad: new FormControl<string | null>(null),
    idCargo: new FormControl<number | null>(null),
  });

  elegida: Autoridad | null = null;
  cargosDisponibles: Cargo[] = [];
  informacion: FilaAsignacion[] = [];
  identificadores: DetalleAutoridad[] = [];

  private huboEleccion = false;

  readonly comboAutoridad = new ComboLocal(
    `${this.idBase}-autoridad`,
    () => this.elegida?.id ?? null,
    (v) => {
      this.elegida = v === null ? null : this.autoridades.find((a) => a.id === v) ?? null;
    },
  );

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

  constructor() {
    this.comboAutoridad.alReintentar = () => this.reintentarAutoridades.emit();
    this.comboCargo.alReintentar = () => this.reintentarCargos.emit();
    this.comboAutoridad.alSeleccionar = (opcion) => this.alElegirAutoridad(opcion);
    this.prepararGrado(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autoridades']) {
      this.comboAutoridad.establecerOpciones(this.autoridades.map((a) => this.crearOpcionAutoridad(a)));
    }
    if (changes['cargandoAutoridades']) {
      this.comboAutoridad.cargando = this.cargandoAutoridades;
    }
    if (changes['errorAutoridades']) {
      this.comboAutoridad.error = this.errorAutoridades;
    }
    if (changes['cargandoCargos']) {
      this.comboCargo.cargando = this.cargandoCargos;
    }
    if (changes['errorCargos']) {
      this.comboCargo.error = this.errorCargos;
    }
    if (changes['cargos'] && !changes['detalle']) {
      this.actualizarCargosDisponibles();
    }
    if (changes['detalle']) {
      this.aplicarDetalle();
    }
  }

  ngOnDestroy(): void {
    this.foco.desactivar();
  }

  enviar(): void {
    const elegida = this.elegida;
    if (!elegida) {
      return;
    }
    const asignacion: AsignacionAutoridad = { idAutoridad: elegida.id, ...this.form.getRawValue() };
    this.guardar.emit(asignacion);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.cerrar.emit();
  }

  trackByEtiqueta(_: number, item: DetalleAutoridad): string {
    return item.etiqueta;
  }

  private alElegirAutoridad(opcion: OpcionCombo | null): void {
    if (opcion === null) {
      this.elegida = null;
      this.reiniciarFormulario();
      if (!this.huboEleccion) {
        return;
      }
      this.huboEleccion = false;
      this.autoridadElegida.emit(null);
      return;
    }
    this.huboEleccion = true;
    this.autoridadElegida.emit(this.elegida);
  }

  private crearOpcionAutoridad(a: Autoridad): OpcionCombo {
    return {
      valor: a.id,
      etiqueta: formatearValor(a.nombreCompleto),
      subtitulo: this.subtituloAutoridad(a),
      textoBusqueda: this.textoBusquedaAutoridad(a),
    };
  }

  private subtituloAutoridad(a: Autoridad): string {
    const contexto = [a.nombreCarrera, a.departamento, a.facultad].find((v) => formatearValor(v) !== '-');
    const partes = [a.cargo, contexto].filter((v) => formatearValor(v) !== '-');
    return partes.length ? partes.join(' · ') : 'Sin cargo registrado';
  }

  private textoBusquedaAutoridad(a: Autoridad): string {
    return [a.nombreCompleto, a.cargo, a.nombreCarrera, a.departamento, a.facultad]
      .filter((v) => formatearValor(v) !== '-')
      .join(' ')
      .toLowerCase();
  }

  private aplicarDetalle(): void {
    const d = this.detalle;
    if (!d) {
      this.reiniciarFormulario();
      return;
    }

    const nombre = formatearValor(d.nombreCompleto);
    this.form.controls.nombreCompleto.setValue(nombre === '-' ? '' : String(d.nombreCompleto));

    this.prepararGrado(d.gradoAcad);

    this.form.controls.idCargo.setValue(d.idCargo ?? null);
    this.comboCargo.textoRespaldo = d.cargo ?? '';
    this.actualizarCargosDisponibles();

    this.informacion = [
      { etiqueta: 'Nombre Completo', valor: nombre, esNombre: true },
      ...armarInformacionAutoridad(d).map((fila) => ({
        ...fila,
        esGrado: fila.etiqueta === 'Grado académico',
        esCargo: fila.etiqueta === 'Cargo',
      })),
    ];
    this.identificadores = armarIdentificadoresAutoridad(d);
  }

  private reiniciarFormulario(): void {
    this.form.controls.nombreCompleto.setValue('');
    this.form.controls.idCargo.setValue(null);
    this.comboCargo.textoRespaldo = '';
    this.prepararGrado(null);
    this.actualizarCargosDisponibles();
    this.informacion = [];
    this.identificadores = [];
  }

  private actualizarCargosDisponibles(): void {
    const grupo = filtrarCargosPorVariante(this.cargos, this.descripcionCargoActual());
    this.cargosDisponibles = grupo.length ? grupo : this.cargos;
    this.comboCargo.establecerOpciones(
      this.cargosDisponibles.map((c) => ({ valor: c.id, etiqueta: c.descripcion, titulo: c.observaciones })),
    );
  }

  private descripcionCargoActual(): string | null {
    const d = this.detalle;
    if (!d) {
      return null;
    }
    return this.cargos.find((c) => c.id === d.idCargo)?.descripcion ?? d.cargo ?? null;
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
}
