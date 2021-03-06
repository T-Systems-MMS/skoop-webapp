import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySkillsComponent } from './my-skills/my-skills.component';
import { SkillPriorityStatisticsComponent } from './statistics/skill-priority-statistics.component';
import { UserSkillPriorityReportsComponent } from './reports/user-skill-priority-report/user-skill-priority-reports.component';
import { SkillUsersComponent } from './skill-users/skill-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// tslint:disable-next-line:max-line-length
import { UserSkillPriorityDetailsReportComponent } from './reports/user-skill-priority-report/user-skill-priority-details-report.component';
import { SkillUsersReportComponent } from './reports/skill-users-report/skill-users-report.component';
import { SkillsComponent } from './skills/skills.component';
import { UserProfileComponent } from './users/user-profile.component';
import { SkillGroupsComponent } from './skill-groups/skill-groups.component';
import { ProjectsComponent } from './projects/projects.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { OtherUserProfilesComponent } from './other-user-profiles/other-user-profiles.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { OtherUserSkillsComponent } from './other-user-skills/other-user-skills.component';
import { CommunitiesComponent } from './communities/communities.component';
import { CommunityViewComponent } from './community-view/community-view.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { MySubordinatesComponent } from './my-subordinates/my-subordinates.component';
import { ProjectMembershipsComponent } from './project-memberships/project-memberships.component';
import { UserProfileSearchComponent } from './user-profile-search/user-profile-search.component';

export const routes: Routes = [
  { path: 'my-messages', component: MyMessagesComponent },
  { path: 'my-skills', component: MySkillsComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: 'my-subordinates', component: MySubordinatesComponent },
  { path: 'my-subordinates/:userId/project-memberships', component: ProjectMembershipsComponent },
  { path: 'statistics/skill-priority', component: SkillPriorityStatisticsComponent },
  {
    path: 'reports/skill-priority-reports',
    component: UserSkillPriorityReportsComponent,
    children: [
      {
        path: ':reportId',
        component: UserSkillPriorityDetailsReportComponent,
        children: [
          {
            path: 'users/:aggregationReportId',
            component: SkillUsersReportComponent
          }
        ]
      }
    ]
  },
  { path: 'skills', component: SkillsComponent },
  { path: 'groups', component: SkillGroupsComponent },
  { path: 'skills/:skillId/users', component: SkillUsersComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'users', component: OtherUserProfilesComponent },
  { path: 'users/:userId/skills', component: OtherUserSkillsComponent },
  { path: 'search-users', component: SearchUsersComponent },
  { path: 'user-profile-search', component: UserProfileSearchComponent },
  { path: 'communities', component: CommunitiesComponent },
  { path: 'communities/:communityId', component: CommunityViewComponent },
  { path: '', redirectTo: 'user-profile-search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

export const routingComponents = [
  MySkillsComponent,
  SkillPriorityStatisticsComponent,
  UserSkillPriorityReportsComponent,
  SkillUsersComponent,
  UserSkillPriorityDetailsReportComponent,
  SkillUsersReportComponent,
  SkillsComponent,
  SkillGroupsComponent,
  UserProfileComponent,
  PageNotFoundComponent,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
