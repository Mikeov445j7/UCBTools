import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Sede, SedeService } from '../../../libraries/selector-sede';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  constructor(private readonly sedeService: SedeService) {}

  obtenerSedes(): Observable<Sede[]> {
    return this.sedeService.getSedes();
  }
}
