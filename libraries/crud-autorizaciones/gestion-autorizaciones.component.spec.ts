import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GestionAutorizacionesComponent } from './gestion-autorizaciones.component';
import { CrudAutorizacionesModule } from './crud-autorizaciones.module';

describe('GestionAutorizacionesComponent', () => {
  let component: GestionAutorizacionesComponent;
  let fixture: ComponentFixture<GestionAutorizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CrudAutorizacionesModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionAutorizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch view to crear and reset temporal state', () => {
    component.cambiarVista('crear');
    expect(component.vistaActual).toBe('crear');
    expect(component.autorizacionAEditarTemporal).toBeNull();
  });
});
