import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Environment configuration
import { environment } from '../environments/environment';

// Layout modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app-material.module';

// Routing module
import { AppRoutingModule, routingComponents } from './app-routing.module';

// Authentication module
import { OAuthModule, OAuthModuleConfig, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

// Components
import { AppComponent } from './app.component';
import { MySkillsNewComponent } from './my-skills/my-skills-new.component';
import { MySkillsEditComponent } from './my-skills/my-skills-edit.component';
import { SkillPriorityStatisticCardComponent } from './statistics/skill-priority-statistic-card.component';
import { GlobalErrorHandlerService } from './error/global-error-handler.service';
import { SkillsNewComponent } from './skills/skills-new.component';
import { SkillsEditComponent } from './skills/skills-edit.component';
import { DeleteConfirmationDialogComponent } from './shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SkillUserComponent } from './skill-users/skill-user.component';
import { SkillGroupsEditComponent } from './skill-groups/skill-groups-edit.component';
import { SkillGroupsNewComponent } from './skill-groups/skill-groups-new.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsNewComponent } from './projects/projects-new.component';
import { ProjectsEditComponent } from './projects/projects-edit.component';
import { ProjectsFilterPipe } from './projects/projects-filter.pipe';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { MyProjectsNewComponent } from './my-projects/my-projects-new.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MyProjectsEditComponent } from './my-projects/my-projects-edit.component';
import { OtherUserProfilesComponent } from './other-user-profiles/other-user-profiles.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { SkillCardComponent } from './shared/skill-card/skill-card.component';
import { OtherUserSkillsComponent } from './other-user-skills/other-user-skills.component';
import { CommunitiesComponent } from './communities/communities.component';
import { CommunitiesNewComponent } from './communities/communities-new.component';
import { CommunitiesEditComponent } from './communities/communities-edit.component';
import { CommunitiesFilterPipe } from './communities/communities-filter.pipe';
import { ClosedCommunityConfirmDialogComponent } from './communities/closed-community-confirm-dialog.component';
import { CommunityViewComponent } from './community-view/community-view.component';
import { SearchUserFormComponent } from './search-users/search-user-form/search-user-form.component';
import { SearchUserResultsComponent } from './search-users/search-user-results/search-user-results.component';
import { FormatCounterPipe } from './format-counter.pipe';
import { InfoDialogComponent } from './shared/info-dialog/info-dialog.component';
import { RecommendedCommunitiesComponent } from './recommended-communities/recommended-communities.component';
import { CommunityCardComponent } from './shared/community-card/community-card.component';
import { CommunityInvitationDialogComponent } from './community-view/community-invitation-dialog.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { TestimonialsNewComponent } from './testimonials/testimonials-new.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';

export const CUSTOM_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    SkillUserComponent,
    MySkillsNewComponent,
    MySkillsEditComponent,
    SkillPriorityStatisticCardComponent,
    SkillsNewComponent,
    SkillsEditComponent,
    DeleteConfirmationDialogComponent,
    SkillGroupsNewComponent,
    SkillGroupsEditComponent,
    ProjectsComponent,
    ProjectsNewComponent,
    ProjectsEditComponent,
    ProjectsFilterPipe,
    MyProjectsComponent,
    MyProjectsNewComponent,
    MyProjectsEditComponent,
    OtherUserProfilesComponent,
    SearchUsersComponent,
    SkillCardComponent,
    OtherUserSkillsComponent,
    CommunitiesComponent,
    CommunitiesNewComponent,
    CommunitiesEditComponent,
    CommunitiesFilterPipe,
    ClosedCommunityConfirmDialogComponent,
    CommunityViewComponent,
    SearchUserFormComponent,
    SearchUserResultsComponent,
    FormatCounterPipe,
    InfoDialogComponent,
    RecommendedCommunitiesComponent,
    CommunityCardComponent,
    CommunityInvitationDialogComponent,
    MyMessagesComponent,
    TestimonialsNewComponent,
    TestimonialsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot({
      resourceServer: {
        sendAccessToken: true
      }
    })
  ],
  providers: [
    GlobalErrorHandlerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAuthentication,
      deps: [OAuthModuleConfig, OAuthService],
      multi: true
    },
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS}
  ],
  entryComponents: [
    DeleteConfirmationDialogComponent,
    MySkillsNewComponent,
    MySkillsEditComponent,
    SkillsNewComponent,
    SkillsEditComponent,
    SkillGroupsNewComponent,
    SkillGroupsEditComponent,
    ProjectsNewComponent,
    ProjectsEditComponent,
    MyProjectsNewComponent,
    MyProjectsEditComponent,
    CommunitiesNewComponent,
    CommunitiesEditComponent,
    ClosedCommunityConfirmDialogComponent,
    InfoDialogComponent,
    CommunityInvitationDialogComponent,
    TestimonialsNewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initAuthentication(moduleConfig: OAuthModuleConfig, oauthService: OAuthService): Function {
  return () => {
    // IMPORTANT: Dynamic environment value for allowed URLs cannot be set in @NgModule decorator!
    moduleConfig.resourceServer.allowedUrls = [environment.serverApiUrl];
    oauthService.configure({
      issuer: environment.authentication.issuer,
      clientId: environment.authentication.clientId,
      scope: environment.authentication.scope,
      redirectUri: environment.authentication.redirectUri ? environment.authentication.redirectUri : window.location.origin + '/',
      silentRefreshRedirectUri: environment.authentication.silentRefreshRedirectUri,
      oidc: true,
      requireHttps: environment.authentication.requireHttps
    });
    oauthService.tokenValidationHandler = new JwksValidationHandler();
    oauthService.setupAutomaticSilentRefresh();
    return oauthService.loadDiscoveryDocumentAndLogin();
  };
}
