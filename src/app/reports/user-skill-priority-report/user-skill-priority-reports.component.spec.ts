import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSkillPriorityReportsComponent } from './user-skill-priority-reports.component';
import { Observable, of } from 'rxjs';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { UserSkillPriorityReportMetaData } from './user-skill-priority-report-meta-data';
import { RouterTestingModule } from '@angular/router/testing';

const userSkillPriorityReportsServiceStub: Partial<UserSkillPriorityReportsService> = {
  createReport():
    Observable<UserSkillPriorityReportMetaData> { return null; },
  getReports():
    Observable<UserSkillPriorityReportMetaData[]> { return null; },
};

describe('UserSkillPriorityReportsComponent', () => {
  let component: UserSkillPriorityReportsComponent;
  let fixture: ComponentFixture<UserSkillPriorityReportsComponent>;

  beforeEach(async(() => {
    spyOn(userSkillPriorityReportsServiceStub, 'getReports')
      .and.returnValue(of<UserSkillPriorityReportMetaData[]>([
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          date: new Date('2018-09-25T12:00:00Z'),
          skillCount: 2
        },
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          date: new Date('2018-09-26T12:00:00Z'),
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
