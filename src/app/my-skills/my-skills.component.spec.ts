import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { MySkillsComponent } from './my-skills.component';
import { MySkillsService } from './my-skills.service';
import { UserSkill } from '../user-skills/user-skill';

const mySkillsServiceStub: Partial<MySkillsService> = {
  getCurrentUserSkills(): Observable<UserSkill[]> { return null; }
};

describe('MySkillsComponent', () => {
  let component: MySkillsComponent;
  let fixture: ComponentFixture<MySkillsComponent>;

  beforeEach(async(() => {
    spyOn(mySkillsServiceStub, 'getCurrentUserSkills')
      .and.returnValue(of<UserSkill[]>([{
        skill: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        currentLevel: 2,
        desiredLevel: 3,
        priority: 4
      }]));
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [MySkillsComponent],
      providers: [
        { provide: MySkillsService, useValue: mySkillsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected heading', () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('My skill profile');
  });
});
