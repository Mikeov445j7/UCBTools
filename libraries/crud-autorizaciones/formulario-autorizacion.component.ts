import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutorizacionDto, SedeOption } from './autorizacion.model';

export const SEDES_UCB_DEFECTO: SedeOption[] = [
  { idRegional: 1, nomRegional: 'Sede La Paz', siglaRegional: 'LPZ' },
  { idRegional: 2, nomRegional: 'Sede Cochabamba', siglaRegional: 'CBB' },
  { idRegional: 3, nomRegional: 'Sede Santa Cruz', siglaRegional: 'SCZ' },
  { idRegional: 4, nomRegional: 'Sede Tarija', siglaRegional: 'TJA' }
];

@Component({
  selector: 'ucb-formulario-autorizacion',
  templateUrl: './formulario-autorizacion.component.html',
  styleUrls: ['./formulario-autorizacion.component.scss'],
  standalone: false
})
export class FormularioAutorizacionComponent implements OnInit, OnChanges {
  @Input() autorizacionAEditar: AutorizacionDto | null = null;
  @Input() idPersonaDefecto: number | null = null;
  @Input() sedes: SedeOption[] = SEDES_UCB_DEFECTO;

  @Output() guardar = new EventEmitter<AutorizacionDto>();
  @Output() cancelar = new EventEmitter<void>();

  formulario: FormGroup;
  esEdicion: boolean = false;
  sedeSeleccionadaTexto: string = '';

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      id: [0],
      idPersona: [null, [Validators.required, Validators.min(1)]],
      etapa: ['', Validators.required],
      rol: [null, Validators.required],
      idSede: [null, Validators.required],
      idDepartamento: [null],
      usuarioRegistro: ['']
    });
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autorizacionAEditar'] || changes['idPersonaDefecto']) {
      this.inicializarFormulario();
    }
  }

  private inicializarFormulario(): void {
    this.formulario.enable();

    if (this.autorizacionAEditar) {
      this.esEdicion = true;
      this.formulario.patchValue(this.autorizacionAEditar);
      this.formulario.get('idPersona')?.disable();

      if (this.autorizacionAEditar.idSede) {
        const encontrada = this.sedes.find(s => s.idRegional === Number(this.autorizacionAEditar?.idSede));
        this.sedeSeleccionadaTexto = encontrada ? encontrada.nomRegional : `ID: ${this.autorizacionAEditar.idSede}`;
      }
    } else {
      this.esEdicion = false;
      this.formulario.reset({
        id: 0,
        idPersona: this.idPersonaDefecto,
        idSede: null
      });
      this.formulario.get('idPersona')?.disable();
      this.sedeSeleccionadaTexto = '';
    }
  }

  onSedeChange(idSedeRaw: unknown): void {
    const idSede = Number(idSedeRaw);
    if (!idSede) return;

    this.formulario.get('idSede')?.setValue(idSede);
    this.formulario.markAsDirty();

    const encontrada = this.sedes.find(s => s.idRegional === idSede);
    this.sedeSeleccionadaTexto = encontrada ? encontrada.nomRegional : `ID: ${idSede}`;
  }

  enviarDatos(): void {
    if (this.formulario.valid) {
      this.guardar.emit(this.formulario.getRawValue() as AutorizacionDto);
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
