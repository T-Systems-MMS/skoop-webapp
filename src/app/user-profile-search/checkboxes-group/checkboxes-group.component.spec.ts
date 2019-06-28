import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxesGroupComponent } from './checkboxes-group.component';

describe('CheckboxesGroupComponent', () => {
  let component: CheckboxesGroupComponent;
  let fixture: ComponentFixture<CheckboxesGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxesGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
