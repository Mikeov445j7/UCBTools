import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaPerfilComponent } from './tarjeta-perfil.component';
import { TarjetaPerfilModule } from './tarjeta-perfil.module';

describe('TarjetaPerfilComponent', () => {
  let fixture: ComponentFixture<TarjetaPerfilComponent>;
  let component: TarjetaPerfilComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaPerfilModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaPerfilComponent);
    component = fixture.componentInstance;
  });

  it('debe calcular las iniciales correctamente', () => {
    component.persona = {
      nombres: 'Valeria',
      primerApellido: 'Mendoza',
      segundoApellido: 'Torres',
    };
    fixture.detectChanges();

    expect(component.obtenerIniciales()).toBe('VM');
  });

  it('debe marcar como inválidos los textos con FALTA o SIN CIUDAD', () => {
    expect(component.esValido('FALTA SEGUNDO_APELLIDO')).toBeFalse();
    expect(component.esValido('SIN CIUDAD')).toBeFalse();
    expect(component.esValido('TORRES')).toBeTrue();
  });
});
