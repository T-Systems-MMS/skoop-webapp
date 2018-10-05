import { Component, OnInit, Input } from '@angular/core';
import { SkillUserView } from './skill-users.component';

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
