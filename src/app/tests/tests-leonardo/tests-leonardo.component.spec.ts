import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TestsLeonardoComponent } from './tests-leonardo.component';
import { TestsModule } from '../tests.module';

describe('TestsLeonardoComponent', () => {
  let fixture: ComponentFixture<TestsLeonardoComponent>;
  let component: TestsLeonardoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule, TestsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestsLeonardoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente con suite Angular Material', () => {
    expect(component).toBeTruthy();
  });

  it('debe registrar y limpiar eventos en la consola en vivo', () => {
    component.registrarEvento('test-comp', '@Output() testEvent', { ok: true });
    expect(component.registroEventos.length).toBe(1);
    expect(component.registroEventos[0]?.componente).toBe('test-comp');

    component.limpiarConsola();
    expect(component.registroEventos.length).toBe(0);
  });
});
