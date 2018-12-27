import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '../app-material.module';
import { SkillPriorityStatisticCardComponent } from './skill-priority-statistic-card.component';
import { UserSkillPriorityAggregationView } from './user-skill-priority-aggregation-view';

const aggregation: UserSkillPriorityAggregationView = {
  skill: {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    name: 'Angular'
  },
  averagePriority: 3.5,
  maximumPriority: 4.0,
  userCount: 2
};

describe('SkillPriorityStatisticCardComponent', () => {
  let component: SkillPriorityStatisticCardComponent;
  let fixture: ComponentFixture<SkillPriorityStatisticCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule,
        RouterTestingModule
      ],
      declarations: [SkillPriorityStatisticCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillPriorityStatisticCardComponent);
    component = fixture.componentInstance;
    component.aggregation = aggregation;
    component.rank = 1;
    fixture.detectChanges();
  });

  it('should render the skill name prefixed by rank', () => {
    const skillName = fixture.debugElement.query(By.css('.skillPriorityStatisticCard__skillName'));
    expect(skillName.nativeElement.textContent).toBe('1. Angular');
  });

  it('should render the average priority', () => {
    const averagePriority = fixture.debugElement.query(By.css(
      '.skillPriorityStatisticCard__averagePriority .skillPriorityStatisticCard__levelValue'));
    expect(averagePriority.nativeElement.textContent).toBe('3.5');
  });

  it('should render the maximum priority', () => {
    const maximumPriority = fixture.debugElement.query(By.css(
      '.skillPriorityStatisticCard__maximumPriority .skillPriorityStatisticCard__levelValue'));
    expect(maximumPriority.nativeElement.textContent).toBe('4.0');
  });

  it('should render the user count', () => {
    const userCount = fixture.debugElement.query(By.css(
      '.skillPriorityStatisticCard__userCount .skillPriorityStatisticCard__levelValue'));
    expect(userCount.nativeElement.textContent).toBe('2');
  });
});
