import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sede } from '../../../libraries/selector-sede';
import { SedeService } from '../../../libraries/selector-sede/sede.service';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  constructor(private readonly sedeService: SedeService) {}

  obtenerSedes(): Observable<Sede[]> {
    return this.sedeService.obtenerSedes();
  }
}
