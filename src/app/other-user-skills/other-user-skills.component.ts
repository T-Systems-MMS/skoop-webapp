import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserSkillsService } from '../user-skills/user-skills.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserSkillView } from '../shared/skill-card/user-skill-view';
import { ClipboardService } from 'ngx-clipboard';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-other-user-skills',
  templateUrl: './other-user-skills.component.html',
  styleUrls: ['./other-user-skills.component.scss']
})
export class OtherUserSkillsComponent implements OnInit {

  userSkills: UserSkillView[] = [];
  user: User = null;
  errorMessage: string = null;

  constructor(private userSkillsService: UserSkillsService,
              private userService: UsersService,
              private clipboardService: ClipboardService,
              private popupNotificationService: PopupNotificationService,
              private activatedRoute: ActivatedRoute,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('userId')))
      .subscribe(userId => {
        this.loadUser(userId);
        this.loadUserSkills(userId);
      });
  }

  copyToClipboard() {
    if (this.clipboardService.copyFromContent(location.href)) {
      this.popupNotificationService.showSuccessMessage('The skills profile link was copied to clipboard successfully');
    }
  }

  private loadUser(userId: string) {
    this.userService.getUserById(userId)
      .subscribe(user => {
        this.user = user;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private loadUserSkills(userId: string) {
    this.userSkillsService.getUserSkills(userId)
      .pipe(map(userSkills => userSkills.map<UserSkillView>(userSkill => ({
        skill: {
          id: userSkill.skill.id,
          name: userSkill.skill.name
        },
        currentLevel: userSkill.currentLevel,
        desiredLevel: userSkill.desiredLevel,
        priority: userSkill.priority
      }))))
      .subscribe(userSkills => {
        this.userSkills = userSkills;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private handleErrorResponse(errorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
