import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StatisticsService } from './statistics.service';
import { UserSkillPriorityAggregationView } from './user-skill-priority-aggregation-view';

@Component({
  selector: 'app-skill-priority-statistics',
  templateUrl: './skill-priority-statistics.component.html',
  styleUrls: ['./skill-priority-statistics.component.scss']
})
export class SkillPriorityStatisticsComponent implements OnInit {
  aggregations: UserSkillPriorityAggregationView[] = [];

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.loadSkillStatistics();
  }

  private loadSkillStatistics(): void {
    this.statisticsService.getTopPrioritizedSkills()
      .pipe(map(aggregations => aggregations.map<UserSkillPriorityAggregationView>(aggregation => ({
        skill: {
          id: aggregation.skill.id,
          name: aggregation.skill.name
        },
        averagePriority: aggregation.averagePriority,
        maximumPriority: aggregation.maximumPriority,
        userCount: aggregation.userCount
      }))))
      .subscribe(aggregations => this.aggregations = aggregations);
      // TODO: Add error handling to display error message in case of failure.
  }
}
