import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { SedeService } from './sede.service';

describe('SedeService', () => {
  let service: SedeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SedeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('obtiene y valida la lista de sedes del servicio institucional', () => {
    const sedes = [
      { idSede: 140, sigla: 'SRE', nombre: 'SEDE LA PLATA - SUCRE' },
      { idSede: 10, sigla: 'LPZ', nombre: 'SEDE LA PAZ' },
    ];

    service.obtenerSedes().subscribe((resultado) => {
      expect(resultado).toEqual(sedes);
    });

    const request = httpTestingController.expectOne(
      'https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes',
    );
    expect(request.request.method).toBe('GET');
    request.flush(sedes);
  });

  it('rechaza respuestas con formato inválido', () => {
    let error: unknown;

    service.obtenerSedes().subscribe({
      error: (responseError: unknown) => {
        error = responseError;
      },
    });

    const request = httpTestingController.expectOne(
      'https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes',
    );
    request.flush([{ idSede: '10', sigla: 'LPZ', nombre: 'SEDE LA PAZ' }]);

    expect(error).toEqual(
      jasmine.objectContaining({
        message: 'El servicio de sedes devolvió una respuesta con formato inválido.',
      }),
    );
  });
});
