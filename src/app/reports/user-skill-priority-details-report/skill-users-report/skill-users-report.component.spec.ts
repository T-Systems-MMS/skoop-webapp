import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../../../app-material.module';
import { SkillUsersReportComponent } from './skill-users-report.component';
import { SkillUserView } from '../../../skill-users/skill-users.component';
import { UserSkillPriorityReportsService } from '../../user-skill-priority-reports.service';
import { UserSkillPriorityReportResponse } from '../../user-skill-priority-report-response';
import { UserSkillPriorityReportDetailsResponse } from '../../user-skill-priority-report-details-response';
import { SkillUser } from '../../../user-skills/skill-user';
import { Skill } from '../../../skills/skill';
import { GlobalErrorHandlerService } from '../../../error/global-error-handler.service';

@Component({ selector: 'app-skill-user', template: '' })
class SkillUserStubComponent {
  @Input('skillUser')
  public skillUser: SkillUserView;
}

const userSkillPriorityReportsServiceStub: Partial<UserSkillPriorityReportsService> = {
  getReports(): Observable<UserSkillPriorityReportResponse[]> { return null; },
  getUserSkillPriorityReportDetails(reportId: string): Observable<UserSkillPriorityReportDetailsResponse[]> { return null; },
  getUserSkillReportById(userSkillReportId: string): Observable<SkillUser[]> { return null; },
  getSkill(skillId: string): Observable<Skill> { return null; },
  getSkillName(skillName: string): Observable<any> { return null; }
};

describe('SkillUsersReportComponent', () => {
  let component: SkillUsersReportComponent;
  let fixture: ComponentFixture<SkillUsersReportComponent>;

  beforeEach(async(() => {
    spyOn(userSkillPriorityReportsServiceStub, 'getSkill').and.returnValue(of<Skill>({
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      name: 'Angular',
      description: 'JavaScript Framework'
    }));
    spyOn(userSkillPriorityReportsServiceStub, 'getSkillName').and.returnValue(of<any>(
      'Angular'
    ));
    spyOn(userSkillPriorityReportsServiceStub, 'getUserSkillReportById').and.returnValue(of<SkillUser[]>([{
      user: {
        id: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@myskills.com'
      },
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    }]));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [
        SkillUsersReportComponent,
        SkillUserStubComponent
      ],
      providers: [
        GlobalErrorHandlerService,
        { provide: UserSkillPriorityReportsService, useValue: userSkillPriorityReportsServiceStub }
      ]
    }).compileComponents();
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
