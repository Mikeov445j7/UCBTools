import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import { ReporteContainerComponent } from './reporte-container.component';
import { RegistroReporte } from './reporte.model';
import { ReporteService } from './reporte.service';

@Component({ standalone: true, imports: [ReporteContainerComponent], template: '<ucb-reporte-container reporteId="a"></ucb-reporte-container><ucb-reporte-container reporteId="b"></ucb-reporte-container>' })
class DosReportesComponent {}

describe('ReporteContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HttpClientTestingModule, ReporteContainerComponent, DosReportesComponent] }).compileComponents();
  });

  it('muestra carga y después renderiza datos sin mezclar instancias', () => {
    const servicio = TestBed.inject(ReporteService);
    const fuente = new Subject<RegistroReporte[]>();
    servicio.registrarVarios([{ id: 'a', titulo: 'Primero', fuente }, { id: 'b', titulo: 'Segundo', fuente: of([{ nombres: 'Luis' }]) }]);
    const fixture = TestBed.createComponent(DosReportesComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cargando reporte');
    expect(fixture.nativeElement.textContent).toContain('Segundo');
    fuente.next([{ nombres: 'Ana' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Primero');
    expect(fixture.nativeElement.textContent).toContain('Ana');
    expect(fixture.nativeElement.querySelectorAll('ucb-reporte').length).toBe(2);
  });

  it('muestra errores seguros y permite reintentar', () => {
    const servicio = TestBed.inject(ReporteService);
    servicio.registrar({ id: 'error', endpoint: 'javascript:alert(1)' });
    const fixture = TestBed.createComponent(ReporteContainerComponent);
    fixture.componentRef.setInput('reporteId', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('dirección del reporte no es válida');
    spyOn(servicio, 'cargar');
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(servicio.cargar).toHaveBeenCalledWith('error');
  });
});
