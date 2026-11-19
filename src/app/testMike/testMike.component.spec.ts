/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestMikeComponent } from './testMike.component';

describe('TestMikeComponent', () => {
  let component: TestMikeComponent;
  let fixture: ComponentFixture<TestMikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
