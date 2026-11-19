import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';

import { ResultadoReporte } from './reporte.model';
import { ReporteComponent } from './reporte.component';
import { ReporteService } from './reporte.service';

@Component({
  selector: 'ucb-reporte-container',
  standalone: true,
  imports: [CommonModule, ReporteComponent],
  template: `
    <ng-container *ngIf="resultado$ | async as resultado">
      <div *ngIf="resultado.estado === 'cargando'" role="status" class="estado">Cargando reporte…</div>
      <div *ngIf="resultado.estado === 'error' || resultado.estado === 'sin-fuente'" class="estado" role="alert">
        <p>{{ resultado.mensajeError }}</p><button *ngIf="resultado.config" type="button" (click)="reintentar()">Reintentar</button>
      </div>
      <div *ngIf="resultado.estado === 'sin-datos'" role="status" class="estado">{{ resultado.config?.mensajeVacio || 'No existen registros disponibles.' }} <button type="button" (click)="reintentar()">Actualizar</button></div>
      <ng-container *ngIf="resultado.estado === 'listo'">
        <button class="actualizar" type="button" (click)="reintentar()">Actualizar datos</button>
        <ucb-reporte [datos]="resultado.datos" [config]="resultado.config || {}"></ucb-reporte>
      </ng-container>
    </ng-container>`,
  styles: [`.estado { padding: 1rem; border: 1px solid #d9dee7; border-radius: 5px; color: #334155; background: #fff; } button { cursor: pointer; font: inherit; font-size: .875rem; font-weight: 600; color: #152b55; background: #fff; border: 1px solid #aab6c8; border-radius: 4px; padding: .55rem .8rem; } button:hover { background: #e4eaf3; } button:focus-visible { outline: 3px solid #4285d4; outline-offset: 2px; } .actualizar { display: block; margin: 0 0 .75rem auto; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteContainerComponent implements OnChanges, OnDestroy {
  @Input() reporteId = '';
  @Output() readonly errorCarga = new EventEmitter<{ mensaje: string; detalle?: unknown }>();
  @Output() readonly cargado = new EventEmitter<number>();
  resultado$: Observable<ResultadoReporte> = of({ estado: 'sin-fuente', datos: [], mensajeError: '', config: null });
  private eventos?: Subscription;

  constructor(private readonly reportes: ReporteService) {}

  ngOnChanges(): void {
    this.eventos?.unsubscribe();
    this.resultado$ = this.reportes.resultado$(this.reporteId);
    this.eventos = this.resultado$.subscribe(resultado => {
      if (resultado.estado === 'error') this.errorCarga.emit({ mensaje: resultado.mensajeError, detalle: resultado.detalle });
      if (resultado.estado === 'listo' || resultado.estado === 'sin-datos') this.cargado.emit(resultado.datos.length);
    });
    this.reportes.iniciar(this.reporteId);
  }
  ngOnDestroy(): void { this.eventos?.unsubscribe(); }
  reintentar(): void { this.reportes.cargar(this.reporteId); }
}
