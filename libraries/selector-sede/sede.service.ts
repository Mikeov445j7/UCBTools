import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Sede } from './sede.model';

@Injectable({
  providedIn: 'root',
})
export class SedeService {
  private readonly endpoint = 'https://snc.ucb.edu.bo/snc-back/api/Tramites/getSedes';

  constructor(private readonly http: HttpClient) {}

  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.endpoint);
  }
}
