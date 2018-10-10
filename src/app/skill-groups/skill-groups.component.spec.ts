import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { Observable, of } from 'rxjs';
import { SkillGroupsComponent } from './skill-groups.component';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroup } from './skill-group';

const skillGroupsServiceStub: Partial<SkillGroupsService> = {
  createSkillGroup(name: string, description: string):
    Observable<SkillGroup> { return null; },
  getAllSkillGroups():
    Observable<SkillGroup[]> { return null; },
};

describe('SkillGroupsComponent', () => {
  let component: SkillGroupsComponent;
  let fixture: ComponentFixture<SkillGroupsComponent>;

  beforeEach(async(() => {
    spyOn(skillGroupsServiceStub, 'getAllSkillGroups')
      .and.returnValue(of<SkillGroup[]>([
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        {
          id: 'c9b80869-c6bd-327d-u9ce-ye0d66b17129',
          name: 'Spring Boot',
          description: 'A Java Framework'
        }
      ]));
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SkillGroupsComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkillGroupsService, useValue: skillGroupsServiceStub },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
