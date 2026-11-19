import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BuscadorPersonasModule } from '../buscador-personas.module';
import { ComboboxUsuariosComponent } from './combobox-usuarios.component';

describe('ComboboxUsuariosComponent', () => {
  let fixture: ComponentFixture<ComboboxUsuariosComponent>;
  let component: ComboboxUsuariosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorPersonasModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ComboboxUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe emitir terminoBuscado luego de 300ms cuando hay al menos 3 caracteres', fakeAsync(() => {
    spyOn(component.terminoBuscado, 'emit');
    component.alEscribir('OROZ');
    tick(300);

    expect(component.terminoBuscado.emit).toHaveBeenCalledWith('OROZ');
  }));

  it('debe emitir usuarioSeleccionado y limpiar resultados', () => {
    spyOn(component.usuarioSeleccionado, 'emit');
    const usuario = { idPersona: 1, nombres: 'MIGUEL', primerApellido: 'OROZCO', documentoIdentidad: '123' };
    component.resultados = [usuario];
    component.seleccionar(usuario);

    expect(component.usuarioSeleccionado.emit).toHaveBeenCalledWith(usuario);
    expect(component.resultados.length).toBe(0);
  });
});
