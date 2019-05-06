import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillUsersComponent } from './skill-users.component';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { SkillUsersService } from './skill-users.service';
import { SkillUser } from './skill-user';
import { SkillUserView } from './skill-user.component';

@Component({ selector: 'app-skill-user', template: '' })
class SkillUserStubComponent {
  @Input('skillUser')
  public skillUser: SkillUserView;
}

const skillsServiceStub: Partial<SkillsService> = {
  getSkill(skillId: string): Observable<Skill> { return null; }
};

const skillUsersServiceStub: Partial<SkillUsersService> = {
  getSkillUsers(skillId: string, minPriority?: number): Observable<SkillUser[]> { return null; }
};

describe('SkillUsersComponent', () => {
  let component: SkillUsersComponent;
  let fixture: ComponentFixture<SkillUsersComponent>;

  beforeEach(async(() => {
    spyOn(skillsServiceStub, 'getSkill').and.returnValue(of<Skill>({
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      name: 'Angular',
      description: 'JavaScript Framework'
    }));
    spyOn(skillUsersServiceStub, 'getSkillUsers').and.returnValue(of<SkillUser[]>([{
      user: {
        id: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.com'
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
        SkillUsersComponent,
        SkillUserStubComponent
      ],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkillsService, useValue: skillsServiceStub },
        { provide: SkillUsersService, useValue: skillUsersServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
