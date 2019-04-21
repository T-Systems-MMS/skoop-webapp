import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsNewComponent } from './memberships-new.component';

describe('MembershipsNewComponent', () => {
  let component: MembershipsNewComponent;
  let fixture: ComponentFixture<MembershipsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
