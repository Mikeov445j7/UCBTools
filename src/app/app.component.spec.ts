import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CatalogoService } from './services/catalogo.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: CatalogoService,
          useValue: {
            obtenerSedes: () =>
              of([{ idSede: 20, sigla: 'CBB', nombre: 'SEDE COCHABAMBA' }]),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'UCBTools' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('UCBTools');
  });

  it('should render the sede selector example', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('UCBTools');
    expect(compiled.querySelector('ucb-selector-sede')).not.toBeNull();
    expect(compiled.querySelector('option[value="20"]')?.textContent).toContain('SEDE COCHABAMBA');
  });

  it('should display the selected sede', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.value = '20';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.selection')?.textContent).toContain(
      'SEDE COCHABAMBA',
    );
  });
});
