import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { SkillPriorityStatisticsComponent } from './skill-priority-statistics.component';
import { StatisticsService } from './statistics.service';
import { UserSkillPriorityAggregation } from './user-skill-priority-aggregation';

const statisticsServiceStub: Partial<StatisticsService> = {
  getTopPrioritizedSkills(): Observable<UserSkillPriorityAggregation[]> { return null; }
};

describe('SkillPriorityStatisticsComponent', () => {
  let component: SkillPriorityStatisticsComponent;
  let fixture: ComponentFixture<SkillPriorityStatisticsComponent>;

  beforeEach(async(() => {
    spyOn(statisticsServiceStub, 'getTopPrioritizedSkills')
      .and.returnValue(of<UserSkillPriorityAggregation[]>([{
        skill: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        averagePriority: 2.5,
        maximumPriority: 3.0,
        userCount: 2
      }]));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [SkillPriorityStatisticsComponent],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillPriorityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected heading', () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Skill priority statistics');
  });
});
