import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GestionActasComponent } from './gestion-actas.component';
import { CrudActasModule } from './crud-actas.module';

describe('GestionActasComponent', () => {
  let component: GestionActasComponent;
  let fixture: ComponentFixture<GestionActasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CrudActasModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state when null student is received', () => {
    component.recibirEstudiante(null);
    expect(component.estudianteSeleccionado).toBeNull();
    expect(component.actas.length).toBe(0);
  });
});
