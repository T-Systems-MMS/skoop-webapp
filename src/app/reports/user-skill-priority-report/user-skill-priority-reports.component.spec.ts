import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { UserSkillPriorityReportsComponent } from './user-skill-priority-reports.component';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';
import { UserSkillPriorityReportSimple } from './user-skill-priority-report-simple';

const userSkillPriorityReportsServiceStub: Partial<UserSkillPriorityReportsService> = {
  createReport(): Observable<UserSkillPriorityReportSimple> { return null; },
  getReports(): Observable<UserSkillPriorityReportSimple[]> { return null; },
};

describe('UserSkillPriorityReportsComponent', () => {
  let component: UserSkillPriorityReportsComponent;
  let fixture: ComponentFixture<UserSkillPriorityReportsComponent>;

  beforeEach(async(() => {
    spyOn(userSkillPriorityReportsServiceStub, 'getReports')
      .and.returnValue(of<UserSkillPriorityReportSimple[]>([
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          date: '2018-09-25T12:00:00Z',
          skillCount: 2
        },
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          date: '2018-09-26T12:00:00Z',
          skillCount: 3
        }
      ]));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [UserSkillPriorityReportsComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: UserSkillPriorityReportsService, useValue: userSkillPriorityReportsServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSkillPriorityReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
