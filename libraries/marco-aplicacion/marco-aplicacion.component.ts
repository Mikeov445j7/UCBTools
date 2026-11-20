import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { MarcoSeccion } from './marco-aplicacion.model';

@Component({
  selector: 'ucb-marco-aplicacion',
  standalone: false,
  templateUrl: './marco-aplicacion.component.html',
  styleUrls: ['./marco-aplicacion.component.scss'],
})
export class MarcoAplicacionComponent implements OnInit, OnDestroy {
  @Input() titulo = 'Sistema';
  @Input() secciones: MarcoSeccion[] = [];
  @Input() rutaInicio = '/';
  @Input() esPrincipal = true;

  readonly anioActual = new Date().getFullYear();
  enInicio = true;

  private sub?: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.actualizarEstado();
    this.sub = this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => this.actualizarEstado());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get seccionActual(): MarcoSeccion | undefined {
    return this.secciones.find((seccion) => seccion.ruta === this.router.url);
  }

  private actualizarEstado(): void {
    this.enInicio = this.router.url === this.rutaInicio;
  }
}
