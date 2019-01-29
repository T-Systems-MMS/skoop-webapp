import { Component, OnInit } from '@angular/core';
import { UserSkillView } from '../my-skills/my-skills-edit.component';
import { UserSkillsService } from '../user-skills/user-skills.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';

@Component({
  selector: 'app-other-user-skills',
  templateUrl: './other-user-skills.component.html',
  styleUrls: ['./other-user-skills.component.scss']
})
export class OtherUserSkillsComponent implements OnInit {

  userSkills: UserSkillView[] = [];
  user: User = null;

  constructor(private userSkillsService: UserSkillsService,
              private userService: UsersService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('userId')))
      .subscribe(userId => {
        this.loadUser(userId);
        this.loadUserSkills(userId);
      });

  }

  private loadUserSkills(userId: string) {
    this.userSkillsService.getUserSkills(userId)
      .subscribe(userSkills => {
        this.userSkills = userSkills;
      })
  }

  private loadUser(userId: string) {
    this.userService.getUserById(userId)
      .subscribe(user => {
        this.user = user;
      })
  }

}
