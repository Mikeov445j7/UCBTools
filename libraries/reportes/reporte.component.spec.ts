import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteComponent } from './reporte.component';

describe('ReporteComponent', () => {
  let fixture: ComponentFixture<ReporteComponent>;
  let componente: ReporteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReporteComponent] }).compileComponents();
    fixture = TestBed.createComponent(ReporteComponent);
    componente = fixture.componentInstance;
    componente.datos = [
      { nombres: 'Ána', carrera: 'Sistemas', idSede: 'La Paz', edad: 0 },
      { nombres: 'Ana', carrera: 'Derecho', idSede: 'La Paz', edad: null },
      { nombres: 'Luis', carrera: 'Sistemas', idSede: 'Santa Cruz', extra: false },
    ];
    componente.config = { visibles: ['nombres', 'edad'], filtros: ['carrera', 'idSede'], buscador: 'nombres' };
    componente.ngOnChanges({ config: { currentValue: componente.config, previousValue: null, firstChange: true, isFirstChange: () => true } });
    fixture.detectChanges();
  });

  it('muestra las columnas configuradas y detecta atributos posteriores', () => {
    const encabezados = Array.from(fixture.nativeElement.querySelectorAll('.reporte__results thead th') as NodeListOf<HTMLElement>).map(el => el.textContent?.trim());
    expect(encabezados).toEqual(['Nombres', 'Edad']);
    expect(componente.columnas.map(columna => columna.clave)).toContain('extra');
    expect(fixture.nativeElement.textContent).toContain('—');
  });

  it('combina búsqueda sin acentos y filtros ocultos y permite limpiar', () => {
    componente.cambiarBusqueda(' ana ');
    componente.cambiarFiltro('carrera', 'string:Sistemas');
    componente.cambiarFiltro('idSede', 'string:La Paz');
    expect(componente.filasVisibles.length).toBe(1);
    componente.limpiarFiltros();
    expect(componente.filasVisibles.length).toBe(3);
  });

  it('actualiza columnas, filtros y buscador cuando cambia la configuración desde código', () => {
    fixture.componentRef.setInput('config', { visibles: ['carrera'], filtros: ['idSede'], buscador: 'carrera' });
    fixture.detectChanges();
    expect(componente.actual.visibles).toEqual(['carrera']);
    expect(componente.actual.filtros).toEqual(['idSede']);
    expect(componente.actual.buscador).toBe('carrera');
    expect(fixture.nativeElement.querySelectorAll('.reporte__results thead th').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.reporte__results thead th').textContent.trim()).toBe('Carrera');
  });

  it('identifica controles de forma independiente y no muestra configuración al usuario', () => {
    const otro = TestBed.createComponent(ReporteComponent).componentInstance;
    expect(otro.instancia).not.toBe(componente.instancia);
    expect(fixture.nativeElement.querySelector('.reporte__button')).toBeNull();
    expect(fixture.nativeElement.querySelector('.reporte__config-table')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Configurar');
    expect(fixture.nativeElement.querySelector('input[type="search"]')).not.toBeNull();
  });

  it('recupera las claves configuradas cuando vuelven a aparecer en los datos', () => {
    fixture.componentRef.setInput('datos', [{ nombres: 'Ana' }]);
    fixture.detectChanges();
    expect(componente.actual.filtros).toEqual([]);
    fixture.componentRef.setInput('datos', [{ nombres: 'Ana', carrera: 'Sistemas', idSede: 'La Paz', edad: 0 }]);
    fixture.detectChanges();
    expect(componente.actual.visibles).toEqual(['nombres', 'edad']);
    expect(componente.actual.filtros).toEqual(['carrera', 'idSede']);
  });

  it('utiliza sugerencias por encima del umbral y conserva el valor original del filtro', () => {
    componente.datos = Array.from({ length: 9 }, (_, i) => ({ nombre: `Registro ${i}`, sede: i }));
    componente.config = { filtros: ['sede'], formateadores: { sede: valor => `Sede ${valor}` } };
    componente.ngOnChanges({ config: { currentValue: componente.config, previousValue: null, firstChange: false, isFirstChange: () => false } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('datalist')).not.toBeNull();
    componente.cambiarFiltroTexto(componente.columnasFiltro[0], 'Sede 2');
    expect(componente.filasVisibles.length).toBe(1);
    expect(componente.filasVisibles[0]['sede']).toBe(2);
  });

  it('muestra todas las columnas cuando visibles está vacío', () => {
    componente.config = { visibles: [] };
    componente.ngOnChanges({ config: { currentValue: componente.config, previousValue: null, firstChange: false, isFirstChange: () => false } });
    expect(componente.actual.visibles).toEqual(['nombres', 'carrera', 'idSede', 'edad', 'extra']);
  });
});
