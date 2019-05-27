import { Component, Input, OnInit } from '@angular/core';
import { UserProject } from '../../user-projects/user-project';

@Component({
  selector: 'app-user-project-card',
  templateUrl: './user-project-card.component.html',
  styleUrls: ['./user-project-card.component.scss']
})
export class UserProjectCardComponent implements OnInit {

  @Input() userProject: UserProject;

  constructor() { }

  ngOnInit() {
  }

}
