import { LayoutModule } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { AppMaterialModule } from '../app-material.module';
import { SkillPriorityStatisticsComponent } from './skill-priority-statistics.component';
import { StatisticsService } from './statistics.service';
import { UserSkillPriorityAggregation } from './user-skill-priority-aggregation';
import { UserSkillPriorityAggregationView } from './user-skill-priority-aggregation-view';

// Stub only those methods of the service which are used by the component.
const statisticsServiceStub: Partial<StatisticsService> = {
  getTopPrioritizedSkills(): Observable<UserSkillPriorityAggregation[]> { return null; }
};

const aggregations: UserSkillPriorityAggregation[] = [
  {
    skill: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      name: 'Angular',
      description: 'JavaScript Framework'
    },
    averagePriority: 3.5,
    maximumPriority: 4.0,
    userCount: 2
  },
  {
    skill: {
      id: 'c9b80869-c6bd-327d-u9ce-ye0d66b17129',
      name: 'Spring Boot',
      description: 'Java Framework'
    },
    averagePriority: 2.5,
    maximumPriority: 3.0,
    userCount: 4
  }
];

// Stub the child components.
@Component({
  selector: 'app-skill-priority-statistic-card',
  template: `
    <div class="skillPriorityStatisticCard">
      <h2>{{ rank }}. {{ aggregation.skill.name }}</h2>
      <p class="average">{{ aggregation.averagePriority | number:'1.1-1' }}</p>
      <p class="maximum">{{ aggregation.maximumPriority | number:'1.1-1' }}</p>
      <p class="users">{{ aggregation.userCount }}</p>
    </div>`
})
class SkillPriorityStatisticCardStubComponent {
  @Input()
  public aggregation: UserSkillPriorityAggregationView;
  @Input()
  public rank: number;
}

describe('SkillPriorityStatisticsComponent', () => {
  let component: SkillPriorityStatisticsComponent;
  let fixture: ComponentFixture<SkillPriorityStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [
        SkillPriorityStatisticsComponent,
        SkillPriorityStatisticCardStubComponent
      ],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Spy on service methods used during component initialization.
    spyOn(TestBed.get(StatisticsService) as StatisticsService, 'getTopPrioritizedSkills')
      .and.returnValue(of<UserSkillPriorityAggregation[]>(aggregations));

    fixture = TestBed.createComponent(SkillPriorityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the expected heading', () => {
    const heading: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(heading.textContent).toBe('Skill Priority Statistics');
  });

  it('should load the aggregations during initialization', () => {
    const statisticsService = TestBed.get(StatisticsService) as StatisticsService;
    expect(statisticsService.getTopPrioritizedSkills).toHaveBeenCalled();
  });

  it('should render a statistic card for each aggregation', () => {
    const cards = fixture.debugElement.queryAll(By.css('.skillPriorityStatisticCard'));
    expect(cards.length).toBe(2);
  });

  it('should pass the aggregation values to the child components', () => {
    const cards = fixture.debugElement.queryAll(By.css('.skillPriorityStatisticCard'));

    expect(cards[0].query(By.css('h2')).nativeElement.textContent).toBe('1. Angular');
    expect(cards[0].query(By.css('.average')).nativeElement.textContent).toBe('3.5');
    expect(cards[0].query(By.css('.maximum')).nativeElement.textContent).toBe('4.0');
    expect(cards[0].query(By.css('.users')).nativeElement.textContent).toBe('2');

    expect(cards[1].query(By.css('h2')).nativeElement.textContent).toBe('2. Spring Boot');
    expect(cards[1].query(By.css('.average')).nativeElement.textContent).toBe('2.5');
    expect(cards[1].query(By.css('.maximum')).nativeElement.textContent).toBe('3.0');
    expect(cards[1].query(By.css('.users')).nativeElement.textContent).toBe('4');
  });
});
