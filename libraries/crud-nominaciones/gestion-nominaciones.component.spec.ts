import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GestionNominacionesComponent } from './gestion-nominaciones.component';
import { CrudNominacionesModule } from './crud-nominaciones.module';

describe('GestionNominacionesComponent', () => {
  let component: GestionNominacionesComponent;
  let fixture: ComponentFixture<GestionNominacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CrudNominacionesModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionNominacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch view to crear and reset temporal state', () => {
    component.cambiarVista('crear');
    expect(component.vistaActual).toBe('crear');
    expect(component.nominacionAEditarTemporal).toBeNull();
  });
});
