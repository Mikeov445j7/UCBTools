import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaSeleccionComponent } from './tarjeta-seleccion.component';
import { TarjetaSeleccionModule } from './tarjeta-seleccion.module';

describe('TarjetaSeleccionComponent', () => {
  let fixture: ComponentFixture<TarjetaSeleccionComponent>;
  let component: TarjetaSeleccionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaSeleccionModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaSeleccionComponent);
    component = fixture.componentInstance;
    component.titulo = 'Ingeniería de Sistemas';
    fixture.detectChanges();
  });

  it('debe emitir el evento seleccionar al hacer clic', () => {
    spyOn(component.seleccionar, 'emit');
    const card = fixture.nativeElement.querySelector('.tarjeta-seleccion') as HTMLElement;
    card.click();

    expect(component.seleccionar.emit).toHaveBeenCalled();
  });
});
