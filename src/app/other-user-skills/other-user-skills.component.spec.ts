import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserSkillsComponent } from './other-user-skills.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from '../app-material.module';
import { Component, Input } from '@angular/core';
import { UserSkillView } from '../shared/skill-card/user-skill-view';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { UserSkillsService } from '../user-skills/user-skills.service';
import { UsersService } from '../users/users.service';
import { UserSkill } from '../user-skills/user-skill';
import { User } from '../users/user';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ClipboardService } from 'ngx-clipboard';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({selector: 'app-skill-card', template: ''})
class SkillCardStubComponent {
  @Input() userSkill: UserSkillView;
}

const expectedSkills = [
  {
    skill: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      name: 'Angular'
    },
    currentLevel: 2,
    desiredLevel: 3,
    priority: 4
  },
  {
    skill: {
      id: '666808eb-b6bd-447d-8dce-3e0d66b17abc',
      name: 'Spring'
    },
    currentLevel: 2,
    desiredLevel: 3,
    priority: 4
  }
];

const user: User = {
  id: '1234567890',
  userName: 'testUser',
  firstName: 'Test',
  lastName: 'User'
};

describe('OtherUserSkillsComponent', () => {
  let component: OtherUserSkillsComponent;
  let fixture: ComponentFixture<OtherUserSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule,
        RouterTestingModule
      ],
      declarations: [OtherUserSkillsComponent, SkillCardStubComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: UserSkillsService, useValue: jasmine.createSpyObj('userSkillsService', {
            'getUserSkills': of<UserSkill[]>(expectedSkills)
          })
        },
        {
          provide: UsersService, useValue: jasmine.createSpyObj('userService', {
            'getUserById': of<User>(user)
          })
        },
        {
          provide: ClipboardService, useValue: jasmine.createSpyObj('clipboardService', {
            'copyFromContent': true
          })
        },
        {
          provide: PopupNotificationService,
          useValue: jasmine.createSpyObj('popupNotificationService', {'showSuccessMessage': of<void>()})
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected heading', () => {
    const heading: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(heading.textContent).toContain('Skill profile of Test User');
  });

  it('should pass expected skills into the child skill card component', () => {
    const skillCards = fixture.debugElement.queryAll(By.directive(SkillCardStubComponent));

    expect(skillCards.length).toBe(2);
    expect(skillCards[0].componentInstance.userSkill).toEqual(expectedSkills[0]);
    expect(skillCards[1].componentInstance.userSkill).toEqual(expectedSkills[1]);
  });

  it('should call clipboardService.copyFromContent', () => {
    component.copyToClipboard();
    const clipboardService: ClipboardService = TestBed.get(ClipboardService);
    expect(clipboardService.copyFromContent).toHaveBeenCalledWith(location.href);
  });
});
