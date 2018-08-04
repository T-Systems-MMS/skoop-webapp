import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySkillsComponent } from './my-skills/my-skills.component';
import { SkillPriorityStatisticsComponent } from './statistics/skill-priority-statistics.component';
import { SkillUsersComponent } from './skill-users/skill-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'my-skills', component: MySkillsComponent },
  { path: 'statistics/skill-priority', component: SkillPriorityStatisticsComponent },
  { path: 'skills/:skillId/users', component: SkillUsersComponent },
  { path: '', redirectTo: '/my-skills', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
