import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skill-user',
  templateUrl: './skill-user.component.html',
  styleUrls: ['./skill-user.component.scss']
})
export class SkillUserComponent implements OnInit {

  @Input('skillUser')
  public skillUser: SkillUserView;

  constructor() { }

  ngOnInit() {
  }

}

export interface SkillUserView {
  user: {
    userName: string;
    firstName?: string;
    lastName?: string;
  };
  currentLevel: number;
  desiredLevel: number;
  priority: number;
}
