import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserSkill } from '../user-skills/user-skill';
import { UserSkillsService } from '../user-skills/user-skills.service';
import { UserIdentityService } from '../shared/user-identity.service';
import { User } from '../users/user';

@Injectable({
  providedIn: 'root'
})
export class MySkillsService {

  constructor(private userSkillsService: UserSkillsService,
    private userIdentityService: UserIdentityService) { }

  getCurrentUserSkills(): Observable<UserSkill[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userSkillsService.getUserSkills(userIdentity.userId)));
  }

  getCurrentUserSkillCoaches(skillId: string): Observable<User[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userSkillsService.getUserSkillCoaches(userIdentity.userId, skillId)));
  }

  getCurrentUserSkillSuggestions(search: string): Observable<string[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userSkillsService.getUserSkillSuggestions(userIdentity.userId, search)));
  }

  createCurrentUserSkill(skillName: string, currentLevel: number, desiredLevel: number, priority: number): Observable<UserSkill> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userSkillsService.createUserSkill(
        userIdentity.userId, skillName, currentLevel, desiredLevel, priority)));
  }

  updateCurrentUserSkill(skillId: string, currentLevel: number, desiredLevel: number, priority: number): Observable<UserSkill> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userSkillsService.updateUserSkill(
        userIdentity.userId, skillId, currentLevel, desiredLevel, priority)));
  }

  deleteCurrentUserSkill(skillId: string): Observable<void> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userSkillsService.deleteUserSkill(userIdentity.userId, skillId)));
  }
}
