import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Layout modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app-material.module';

// Routing module
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { MySkillsComponent } from './my-skills/my-skills.component';
import { MySkillsNewComponent } from './my-skills/my-skills-new.component';
import { MySkillsEditComponent } from './my-skills/my-skills-edit.component';
import { SkillPriorityStatisticsComponent } from './statistics/skill-priority-statistics.component';
import { SkillUsersComponent } from './skill-users/skill-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Services
import { UserIdentityService } from './shared/user-identity.service';
import { MySkillsService } from './my-skills/my-skills.service';
import { StatisticsService } from './statistics/statistics.service';

@NgModule({
  declarations: [
    AppComponent,
    MySkillsComponent,
    MySkillsNewComponent,
    MySkillsEditComponent,
    SkillPriorityStatisticsComponent,
    SkillUsersComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    AppMaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    UserIdentityService,
    MySkillsService,
    StatisticsService
  ],
  entryComponents: [
    MySkillsNewComponent,
    MySkillsEditComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
