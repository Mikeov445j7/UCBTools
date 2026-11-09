import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SedeService } from '../../../libraries/selector-sede/sede.service';
import { CatalogoService } from './catalogo.service';

describe('CatalogoService', () => {
  it('obtiene las sedes mediante el servicio de la biblioteca UCBTools', () => {
    const sedes = [{ idSede: 20, sigla: 'CBB', nombre: 'SEDE COCHABAMBA' }];
    const sedes$ = of(sedes);
    const obtenerSedes = jasmine.createSpy().and.returnValue(sedes$);

    TestBed.configureTestingModule({
      providers: [
        CatalogoService,
        {
          provide: SedeService,
          useValue: { obtenerSedes },
        },
      ],
    });

    const service = TestBed.inject(CatalogoService);

    expect(service.obtenerSedes()).toBe(sedes$);
    expect(obtenerSedes).toHaveBeenCalled();
  });
});
