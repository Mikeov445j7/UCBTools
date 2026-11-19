import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GestionTitulacionesComponent } from './gestion-titulaciones.component';
import { CrudTitulacionesModule } from './crud-titulaciones.module';

describe('GestionTitulacionesComponent', () => {
  let component: GestionTitulacionesComponent;
  let fixture: ComponentFixture<GestionTitulacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CrudTitulacionesModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionTitulacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset student and items on null selection', () => {
    component.recibirEstudiante(null);
    expect(component.estudianteSeleccionado).toBeNull();
    expect(component.titulaciones.length).toBe(0);
  });
});
