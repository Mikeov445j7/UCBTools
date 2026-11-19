import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TitulacionesService } from './titulaciones.service';
import { ActualizarTitulacionPayload } from './titulacion.model';

describe('TitulacionesService', () => {
  let service: TitulacionesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TitulacionesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TitulacionesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('sends updates to the API with the provided payload', () => {
    const payload: ActualizarTitulacionPayload = {
      id: 1,
      idActa: 2,
      idPersona: 3,
      tallerGrado: 1,
      notaTaller: 90,
      planEstudios: 1,
      actasDefensa: 1,
      observaciones: '',
      habilitado: 1,
      resolucion: 0,
      solCompleta: 1,
      fechaSolicitud: '2026-01-01',
      fechaUltModificacion: '2026-01-01',
      estadoRegistro: 1,
      fechaRegistro: '2026-01-01',
      usuarioRegistro: 'test',
      estadoTramite: 1,
      timeline: '',
      anulado: 0,
      cartonAnulado: 0,
    };

    let response: unknown;
    service.actualizarTitulacion(payload).subscribe((result) => {
      response = result;
    });

    const request = httpTestingController.expectOne(
      'https://titulaciones.ucb.edu.bo/ApiTitulacionOficial/api/Tramites/UpdTramite',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ ok: true });

    expect(response).toEqual({ ok: true });
  });
});
