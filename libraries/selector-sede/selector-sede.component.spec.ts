import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorSedeComponent } from './selector-sede.component';

describe('SelectorSedeComponent', () => {
  let fixture: ComponentFixture<SelectorSedeComponent>;
  let component: SelectorSedeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorSedeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorSedeComponent);
    component = fixture.componentInstance;
    component.sedes = [
      { idSede: 10, sigla: 'LPZ', nombre: 'SEDE LA PAZ' },
      { idSede: 20, sigla: 'CBB', nombre: 'SEDE COCHABAMBA' },
    ];
    component.sedeSeleccionada = component.sedes[0];
    fixture.detectChanges();
  });

  it('debe renderizar las sedes disponibles', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.selector-sede__option');
    expect(buttons.length).toBe(3);
  });

  it('debe emitir la sede seleccionada', () => {
    spyOn(component.sedeChange, 'emit');
    component.seleccionarSede(component.sedes[1]);
    expect(component.sedeChange.emit).toHaveBeenCalledWith(component.sedes[1]);
  });
});
