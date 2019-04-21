import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsEditComponent } from './memberships-edit.component';

describe('MembershipsEditComponent', () => {
  let component: MembershipsEditComponent;
  let fixture: ComponentFixture<MembershipsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
