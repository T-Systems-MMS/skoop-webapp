import { Component, Input } from '@angular/core';
import { UserSkillPriorityAggregationView } from './user-skill-priority-aggregation-view';

/**
 * Component which displays the statistic values of a single skill priority aggregation as a card.
 */
@Component({
  selector: 'app-skill-priority-statistic-card',
  templateUrl: './skill-priority-statistic-card.component.html',
  styleUrls: ['./skill-priority-statistic-card.component.scss']
})
export class SkillPriorityStatisticCardComponent {
  @Input()
  public aggregation: UserSkillPriorityAggregationView;
  @Input()
  public rank: number;
}
