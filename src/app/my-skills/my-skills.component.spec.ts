import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserSkill } from '../user-skills/user-skill';
import { User } from '../users/user';
import { MySkillsComponent } from './my-skills.component';
import { MySkillsService } from './my-skills.service';
import { SkillCardComponent } from '../shared/skill-card/skill-card.component';

// Stub only those methods of the service which are used by the component.
const mySkillsServiceStub: Partial<MySkillsService> = {
  getCurrentUserSkills(): Observable<UserSkill[]> { return null; },
  getCurrentUserSkillCoaches(skillId: string): Observable<User[]> { return null; },
  deleteCurrentUserSkill(skillId: string): Observable<void> { return null; }
};

const initialUserSkills: UserSkill[] = [
  {
    skill: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      name: 'Angular',
      description: 'JavaScript Framework'
    },
    currentLevel: 2,
    desiredLevel: 3,
    priority: 4
  },
  {
    skill: {
      id: 'cfba09c9-9ca3-4ef8-aae2-f08ae31dca7a',
      name: 'Spring Boot',
      description: 'Java Application Framework'
    },
    currentLevel: 1,
    desiredLevel: 2,
    priority: 3
  }
];

describe('MySkillsComponent', () => {
  let component: MySkillsComponent;
  let fixture: ComponentFixture<MySkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [MySkillsComponent, SkillCardComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: MySkillsService, useValue: mySkillsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Spy on service methods used during component initialization.
    spyOn(TestBed.get(MySkillsService) as MySkillsService, 'getCurrentUserSkills')
      .and.returnValue(of<UserSkill[]>(initialUserSkills));

    fixture = TestBed.createComponent(MySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected heading', () => {
    const heading: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(heading.textContent).toContain('My skill profile');
  });

  it('should render the names of the current user skills', () => {
    const cardHeadings = fixture.debugElement.queryAll(By.css('.skoopCard__heading'));
    expect(cardHeadings.length).toBe(2);
    expect(cardHeadings[0].nativeElement.textContent).toBe('Angular');
    expect(cardHeadings[1].nativeElement.textContent).toBe('Spring Boot');
  });

  it('should render the levels and priorities of the current user skills', () => {
    const cards = fixture.debugElement.queryAll(By.css('.skoopCard'));
    expect(cards.length).toBe(2);

    expect(cards[0].query(By.css('.skoopCard__currentLevelValue')).nativeElement.textContent).toBe('2');
    expect(cards[0].query(By.css('.skoopCard__desiredLevelValue')).nativeElement.textContent).toBe('3');
    expect(cards[0].query(By.css('.skoopCard__priorityValue')).nativeElement.textContent).toBe('4');

    expect(cards[1].query(By.css('.skoopCard__currentLevelValue')).nativeElement.textContent).toBe('1');
    expect(cards[1].query(By.css('.skoopCard__desiredLevelValue')).nativeElement.textContent).toBe('2');
    expect(cards[1].query(By.css('.skoopCard__priorityValue')).nativeElement.textContent).toBe('3');
  });

  it('should initially render no coaches', () => {
    const coaches = fixture.debugElement.queryAll(By.css('.skoopCard__coaches'));
    expect(coaches.length).toBe(0);
  });

  it('should render the coaches for the corresponding skill', fakeAsync(() => {
    const testCoaches: User[] = [
      {
        id: 'dc3684c5-f45e-4c4c-b3e9-a6475617937e',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester'
      },
      {
        id: 'cceb1b3e-5550-450e-a733-a5a749878ef8',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing'
      }
    ];
    // Spy on service methods used during interaction with the component.
    spyOn(TestBed.get(MySkillsService) as MySkillsService, 'getCurrentUserSkillCoaches')
      .and.returnValue(of<User[]>(testCoaches));

    const card = fixture.debugElement.query(By.css('.skoopCard'));
    const findCoachesButton = card.query(By.css('.mySkillsCard__findCoachesButton'));
    expect(findCoachesButton).toBeDefined();
    (findCoachesButton.nativeElement as HTMLElement).click();

    tick();
    fixture.detectChanges();

    const coaches = card.query(By.css('.mySkillsCard__coaches'));
    expect(coaches).toBeDefined();
    expect(coaches.nativeElement.textContent).toContain('Toni Tester (tester)');
    expect(coaches.nativeElement.textContent).toContain('Tina Testing (testing)');
  }));
});
