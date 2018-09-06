import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillUsersReportComponent } from './skill-users-report.component';

describe('SkillUsersReportComponent', () => {
  let component: SkillUsersReportComponent;
  let fixture: ComponentFixture<SkillUsersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillUsersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillUsersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
