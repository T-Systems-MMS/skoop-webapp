import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySkillsComponent } from './my-skills/my-skills.component';
import { SkillPriorityStatisticsComponent } from './statistics/skill-priority-statistics.component';
import { UserSkillPriorityReportsComponent } from './reports/user-skill-priority-reports.component';
import { SkillUsersComponent } from './skill-users/skill-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserSkillPriorityDetailsReportComponent } from './reports/user-skill-priority-details-report/user-skill-priority-details-report.component';
import { SkillUsersReportComponent } from './reports/user-skill-priority-details-report/skill-users-report/skill-users-report.component';
import { SkillsComponent } from './skills/skills.component';
import { UserProfileComponent } from './users/user-profile.component';

export const routes: Routes = [
  { path: 'my-skills', component: MySkillsComponent },
  { path: 'statistics/skill-priority', component: SkillPriorityStatisticsComponent },
  {
    path: 'report/skill-priority-report',
    component: UserSkillPriorityReportsComponent,
    children: [
      {
        path: ':reportId',
        component: UserSkillPriorityDetailsReportComponent,
        children: [
          {
            path: 'users/:userSkillPriorityAggregationReportId',
            component: SkillUsersReportComponent
          }
        ]
      }
    ]
  },
  { path: 'skills', component: SkillsComponent },
  { path: 'skills/:skillId/users', component: SkillUsersComponent },
  { path: 'users', component: UserProfileComponent },
  { path: '', redirectTo: 'my-skills', pathMatch: 'full' },
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
  UserProfileComponent,
  PageNotFoundComponent,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
