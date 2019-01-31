import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCardComponent } from './skill-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from '../app-material.module';
import { UserSkillView } from './user-skill-view';
import { By } from '@angular/platform-browser';

const expectedSkill = {
  skill: {
    id: '12345',
    name: 'Java'
  },
  currentLevel: 1,
  desiredLevel: 2,
  priority: 3
} as UserSkillView;

describe('SkillCardComponent', () => {
  let component: SkillCardComponent;
  let fixture: ComponentFixture<SkillCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [ SkillCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillCardComponent);
    component = fixture.componentInstance;
    component.userSkill = expectedSkill;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the name of skills', () => {
    const skillName: HTMLElement = fixture.debugElement.query(By.css('.mySkillsCard__heading')).nativeElement;
    expect(skillName.textContent).toBe(expectedSkill.skill.name);
  });
});
