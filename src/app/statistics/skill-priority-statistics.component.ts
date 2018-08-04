import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-skill-priority-statistics',
  templateUrl: './skill-priority-statistics.component.html',
  styleUrls: ['./skill-priority-statistics.component.scss']
})
export class SkillPriorityStatisticsComponent implements OnInit {
  skillStatistics: UserSkillPriorityAggregationView[] = [];

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.loadSkillStatistics();
  }

  private loadSkillStatistics(): void {
    this.statisticsService.getTopPrioritizedSkills()
      .pipe(map(skillStatistics => skillStatistics.map<UserSkillPriorityAggregationView>(skillStatistic => ({
        skill: {
          id: skillStatistic.skill.id,
          name: skillStatistic.skill.name
        },
        averagePriority: skillStatistic.averagePriority,
        maximumPriority: skillStatistic.maximumPriority,
        userCount: skillStatistic.userCount
      }))))
      .subscribe(skillStatistics => this.skillStatistics = skillStatistics);
  }
}

interface UserSkillPriorityAggregationView {
  skill: SkillView;
  averagePriority: number;
  maximumPriority: number;
  userCount: number;
}

interface SkillView {
  id: string;
  name: string;
}
