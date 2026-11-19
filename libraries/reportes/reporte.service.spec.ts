import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject, of } from 'rxjs';

import { RegistroReporte, ResultadoReporte } from './reporte.model';
import { ReporteService } from './reporte.service';

describe('ReporteService', () => {
  let service: ReporteService;
  let http: HttpTestingController;
  let resultado!: ResultadoReporte;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ReporteService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify({ ignoreCancelled: true }));

  it('registra arrays, carga observables y trata respuestas vacías o inválidas', () => {
    service.registrarVarios([{ id: 'uno', fuente: of([{ nombre: 'Ana' }]) }, { id: 'dos', fuente: of([]) }]);
    service.resultado$('uno').subscribe(value => resultado = value);
    service.iniciar('uno');
    expect(resultado.estado).toBe('listo');
    expect(resultado.datos.length).toBe(1);
    service.resultado$('dos').subscribe(value => resultado = value);
    service.iniciar('dos');
    expect(resultado.estado).toBe('sin-datos');
    service.cambiarOrigen('dos', { fuente: of([null]) as unknown as Observable<RegistroReporte[]> });
    expect(resultado.estado).toBe('error');
    expect(resultado.mensajeError).toContain('formato');
  });

  it('informa configuración inexistente, sin fuente y fuentes simultáneas', () => {
    service.resultado$('ausente').subscribe(value => resultado = value);
    expect(resultado.mensajeError).toContain('configuración');
    service.registrar({ id: 'reporte' });
    service.resultado$('reporte').subscribe(value => resultado = value);
    service.iniciar('reporte');
    expect(resultado.estado).toBe('sin-fuente');
    service.cambiarOrigen('reporte', { endpoint: '/datos', fuente: of([]) });
    expect(resultado.estado).toBe('error');
    http.expectNone('/datos');
  });

  it('expone carga, mensajes HTTP seguros y reintento', () => {
    service.registrar({ id: 'http', endpoint: '/datos' });
    service.resultado$('http').subscribe(value => resultado = value);
    service.iniciar('http');
    expect(resultado.estado).toBe('cargando');
    http.expectOne('/datos').flush({ secreto: 'interno' }, { status: 403, statusText: 'Forbidden' });
    expect(resultado.estado).toBe('error');
    expect(resultado.mensajeError).toContain('permiso');
    expect(resultado.mensajeError).not.toContain('interno');
    service.cargar('http');
    http.expectOne('/datos').flush([{ nombre: 'Ana' }]);
    expect(resultado.estado).toBe('listo');
  });

  it('cancela solicitudes anteriores al cambiar de origen', () => {
    service.registrar({ id: 'http', endpoint: '/anterior' });
    service.resultado$('http').subscribe(value => resultado = value);
    service.iniciar('http');
    const anterior = http.expectOne('/anterior');
    const nueva = new Subject<RegistroReporte[]>();
    service.cambiarOrigen('http', { fuente: nueva });
    expect(anterior.cancelled).toBeTrue();
    nueva.next([{ nombre: 'Nuevo' }]);
    expect(resultado.datos[0]['nombre']).toBe('Nuevo');
  });

  it('rechaza URL con caracteres invisibles sin emitir solicitudes', () => {
    service.registrar({ id: 'url', endpoint: '/da\u200btos' });
    service.resultado$('url').subscribe(value => resultado = value);
    service.iniciar('url');
    expect(resultado.estado).toBe('error');
    http.expectNone('/da\u200btos');
  });

  for (const [codigo, mensaje] of [[0, 'conectar'], [401, 'autorizada'], [403, 'permiso'], [404, 'encontró'], [500, 'disponible']] as const) {
    it(`presenta un mensaje seguro para el error ${codigo}`, () => {
      service.registrar({ id: 'errores', endpoint: '/errores' });
      service.resultado$('errores').subscribe(value => resultado = value);
      service.iniciar('errores');
      const solicitud = http.expectOne('/errores');
      if (codigo === 0) solicitud.error(new ProgressEvent('error'));
      else solicitud.flush('detalle privado', { status: codigo, statusText: 'Error' });
      expect(resultado.mensajeError).toContain(mensaje);
      expect(resultado.mensajeError).not.toContain('detalle privado');
    });
  }
});
