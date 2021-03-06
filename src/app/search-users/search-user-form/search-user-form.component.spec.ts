import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserFormComponent } from './search-user-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { SkillsService } from '../../skills/skills.service';
import { of } from 'rxjs';
import { Skill } from '../../skills/skill';
import { SearchUsersService } from './search-users.service';
import { AnonymousUserSkill } from '../anonymous-user-skill';

const skills = [
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
];

const anonymousUserSkills: AnonymousUserSkill[] = [
  {
    userReferenceId: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
    skills: [
      {
        skillName: 'Spring',
        currentLevel: 2
      },
      {
        skillName: 'Angular',
        currentLevel: 2
      }
    ]
  },
  {
    userReferenceId: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
    skills: [
      {
        skillName: 'Spring',
        currentLevel: 4
      },
      {
        skillName: 'Angular',
        currentLevel: 3
      }
    ]
  }
];

describe('SearchUserFormComponent', () => {
  let component: SearchUserFormComponent;
  let fixture: ComponentFixture<SearchUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ SearchUserFormComponent ],
      providers: [
        {
          provide: SkillsService, useValue: jasmine.createSpyObj('skillService', {
            'getAllSkills': of<Skill[]>(skills)
          })
        },
        {
          provide: SearchUsersService, useValue: jasmine.createSpyObj('searchService', {
            'search': of<AnonymousUserSkill[]>(anonymousUserSkills)
          })
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark duplicated controls', () => {
    // add additional fields for test
    component.addCriteria();
    component.addCriteria();
    component.addCriteria();
    component.addCriteria();

    // 1 and 3 are duplicated
    component.form.setValue({
      criteriaList: [
        {
          skill: null,
          level: 0
        },
        {
          skill: skills[0].id,
          level: 2
        },
        {
          skill: skills[1].id,
          level: 2
        },
        {
          skill: skills[0].id,
          level: 2
        },
        {
          skill: null,
          level: 0
        }
      ]
    });

    component.checkDuplicates();
    expect(component.criteriaList.at(0).hasError('isDuplicated')).toBeFalsy();
    expect(component.criteriaList.at(1).hasError('isDuplicated')).toBeTruthy();
    expect(component.criteriaList.at(2).hasError('isDuplicated')).toBeFalsy();
    expect(component.criteriaList.at(3).hasError('isDuplicated')).toBeTruthy();
    expect(component.criteriaList.at(4).hasError('isDuplicated')).toBeFalsy();
  });

  it('should send a search request', async(() => {
    component.addCriteria(); // add control for second criteria
    component.form.setValue({
      criteriaList: [
        {
          skill: skills[0].id,
          level: 2
        },
        {
          skill: skills[1].id,
          level: 2
        }
      ]
    });
    component.search();
    const searchService: SearchUsersService = TestBed.get(SearchUsersService);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(searchService.search).toHaveBeenCalledWith([`${skills[0].id}+2`, `${skills[1].id}+2`]);
    });
  }));
});
