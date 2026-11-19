import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsLeonardoComponent } from './tests-leonardo.component';
import { TestsModule } from '../tests.module';

describe('TestsLeonardoComponent', () => {
  let fixture: ComponentFixture<TestsLeonardoComponent>;
  let component: TestsLeonardoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestsLeonardoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente en modo NgModule', () => {
    expect(component).toBeTruthy();
    expect(component.tabActiva).toBe('buscadores');
  });
});
