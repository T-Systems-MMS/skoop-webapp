import { Component, Input, OnInit } from '@angular/core';
import { UserSkillView } from './user-skill-view';

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss']
})
export class SkillCardComponent implements OnInit {

  @Input() userSkill: UserSkillView;

  constructor() { }

  ngOnInit() {
  }

}
