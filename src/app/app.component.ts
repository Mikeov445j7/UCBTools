import { Component } from '@angular/core';
import { SelectorSedeComponent, type Sede } from '../../libraries/selector-sede';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectorSedeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'UCBTools';
  sedeSeleccionada: Sede | null = null;
}
