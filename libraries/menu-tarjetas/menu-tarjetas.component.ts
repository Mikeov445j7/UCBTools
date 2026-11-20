import { Component, Input } from '@angular/core';

import { MenuTarjetaItem } from './menu-tarjetas.model';

@Component({
  selector: 'ucb-menu-tarjetas',
  standalone: false,
  templateUrl: './menu-tarjetas.component.html',
  styleUrls: ['./menu-tarjetas.component.scss'],
})
export class MenuTarjetasComponent {
  @Input() items: MenuTarjetaItem[] = [];
  @Input() etiqueta = 'Menú de opciones';

  trackById(_: number, item: MenuTarjetaItem): number | string {
    return item.id;
  }
}
