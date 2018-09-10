import { Component, OnInit, Input } from '@angular/core';
import { UserSkillPriorityAggregationView } from '../skill-priority-statistics.component';

@Component({
  selector: 'app-skill-priority-statistic',
  templateUrl: './skill-priority-statistic.component.html',
  styleUrls: ['./skill-priority-statistic.component.scss']
})
export class SkillPriorityStatisticComponent implements OnInit {

  @Input('skillStatistic')
  public skillStatistic: UserSkillPriorityAggregationView;
  @Input()
  public rank: number;

  constructor() { }

  ngOnInit() {
  }

}
