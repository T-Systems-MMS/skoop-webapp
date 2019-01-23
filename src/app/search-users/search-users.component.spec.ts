import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsersComponent } from './search-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { of } from 'rxjs';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { SearchUsersService } from './search-users.service';
import { AnonymousUserSkill } from './anonymous-user-skill';

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

describe('SearchUsersComponent', () => {
  let component: SearchUsersComponent;
  let fixture: ComponentFixture<SearchUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SearchUsersComponent],
      providers: [
        {
          provide: SkillsService, useValue: jasmine.createSpyObj('skillService', {
            'getAllSkills': of<Skill[]>(skills)
          })
        },
        {
          provide: SearchUsersService, useValue: jasmine.createSpyObj('searchService', {
            'search': of<AnonymousUserSkill[]>([])
          })
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
