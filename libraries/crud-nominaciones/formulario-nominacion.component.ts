import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NominacionDto, NominacionUpdPayload } from './nominacion.model';

@Component({
  selector: 'ucb-formulario-nominacion',
  templateUrl: './formulario-nominacion.component.html',
  styleUrls: ['./formulario-nominacion.component.scss'],
  standalone: false
})
export class FormularioNominacionComponent implements OnInit, OnChanges {
  @Input() nominacionAEditar: NominacionDto | null = null;
  @Input() idSubdeptoDefecto: number | null = null;

  @Output() guardar = new EventEmitter<NominacionDto | NominacionUpdPayload>();
  @Output() cancelar = new EventEmitter<void>();

  formulario: FormGroup;
  esEdicion: boolean = false;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      id: [0],
      descripcion: ['', Validators.required],
      provisionNacional: ['', Validators.required],
      idSubdepto: [null, [Validators.required, Validators.min(1)]],
      idSede: [null, Validators.required],
      sexo: [null, Validators.required],
      usuarioRegistro: [''],
      codigoCarrera: ['', Validators.required],
      nombreAlterno: [''],
      sede: [''],
      nombreCarrera: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nominacionAEditar'] || changes['idSubdeptoDefecto']) {
      this.inicializarFormulario();
    }
  }

  private inicializarFormulario(): void {
    this.formulario.enable();

    if (this.nominacionAEditar) {
      this.esEdicion = true;
      this.formulario.patchValue(this.nominacionAEditar);

      const camposBloqueados = [
        'nombreAlterno', 'nombreCarrera', 'sede',
        'idSede', 'idSubdepto', 'sexo', 'usuarioRegistro'
      ];

      camposBloqueados.forEach(campo => {
        this.formulario.get(campo)?.disable();
      });
    } else {
      this.esEdicion = false;
      this.formulario.reset({
        id: 0,
        idSubdepto: this.idSubdeptoDefecto
      });

      this.formulario.get('idSubdepto')?.disable();
    }
  }

  enviarDatos(): void {
    if (this.formulario.valid) {
      if (this.esEdicion) {
        const payload: NominacionUpdPayload = {
          id: Number(this.formulario.get('id')?.value),
          descripcion: String(this.formulario.get('descripcion')?.value ?? ''),
          provisionNacional: String(this.formulario.get('provisionNacional')?.value ?? ''),
          codigoCarrera: String(this.formulario.get('codigoCarrera')?.value ?? '')
        };
        this.guardar.emit(payload);
      } else {
        this.guardar.emit(this.formulario.getRawValue() as NominacionDto);
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
