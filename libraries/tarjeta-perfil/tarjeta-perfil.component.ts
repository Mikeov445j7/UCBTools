import { Component, Input } from '@angular/core';

import { PersonaPerfil, TarjetaDetalle, TarjetaSeccion } from './tarjeta-perfil.model';

@Component({
  selector: 'ucb-tarjeta-perfil',
  standalone: false,
  templateUrl: './tarjeta-perfil.component.html',
  styleUrls: ['./tarjeta-perfil.component.scss'],
})
export class TarjetaPerfilComponent {
  @Input() persona: PersonaPerfil | null = null;
  @Input() detalles: TarjetaDetalle[] = [];
  @Input() secciones: TarjetaSeccion[] = [];

  esValido(valor: unknown): boolean {
    if (valor === undefined || valor === null) {
      return false;
    }

    const texto = String(valor).trim();
    if (texto === '') {
      return false;
    }

    const mayus = texto.toUpperCase();
    return !(
      mayus.includes('FALTA') ||
      mayus.includes('SIN DEPARTAMENTO') ||
      mayus.includes('SIN CIUDAD') ||
      mayus.includes('SIN PAIS')
    );
  }

  obtenerIniciales(): string {
    const primera = (this.persona?.nombres ?? '').trim().slice(0, 1);
    const segunda = (this.persona?.primerApellido ?? '').trim().slice(0, 1);
    return `${primera}${segunda}`.toUpperCase() || '?';
  }
}
