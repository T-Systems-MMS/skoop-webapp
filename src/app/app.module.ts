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
import { SkillSelectInputComponent } from './shared/skill-select-input/skill-select-input.component';
import { TestimonialsEditComponent } from './testimonials/testimonials-edit.component';
import { PublicationsComponent } from './publications/publications.component';
import { PublicationsNewComponent } from './publications/publications-new.component';
import { PublicationsEditComponent } from './publications/publications-edit.component';
import { MembershipsComponent } from './memberships/memberships.component';
import { MembershipsNewComponent } from './memberships/memberships-new.component';
import { MembershipsEditComponent } from './memberships/memberships-edit.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AuthorizedUsersSelectComponent } from './permissions/authorized-users-select/authorized-users-select.component';
import { WelcomeMessageCardComponent } from './my-messages/welcome-message-card/welcome-message-card.component';
import { MessageCardComponent } from './my-messages/message-card/message-card.component';
import { CommunityDeletedMessageCardComponent } from './my-messages/community-deleted-message-card/community-deleted-message-card.component';
import { CommunityChangedMessageCardComponent } from './my-messages/community-changed-message-card/community-changed-message-card.component';
import { CommunityLeftMessageCardComponent } from './my-messages/community-left-message-card/community-left-message-card.component';
import { CommunityKickOutMessageCardComponent } from './my-messages/community-kick-out-message-card/community-kick-out-message-card.component';
import { CommunityRoleChangedMessageCardComponent } from './my-messages/community-role-changed-message-card/community-role-changed-message-card.component';
import { CommunityAcceptanceMessageCardComponent } from './my-messages/community-acceptance-message-card/community-acceptance-message-card.component';
import { CommunityInvitationMessageCardComponent } from './my-messages/community-invitation-message-card/community-invitation-message-card.component';
import { CommunityJoinRequestMessageCardComponent } from './my-messages/community-join-request-message-card/community-join-request-message-card.component';
import { SkillsEstimationMessageCardComponent } from './my-messages/skills-estimation-message-card/skills-estimation-message-card.component';
import { MySubordinatesComponent } from './my-subordinates/my-subordinates.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserProjectCardComponent } from './shared/user-project-card/user-project-card.component';
import { ProjectMembershipsComponent } from './project-memberships/project-memberships.component';
import { ApproveProjectMessageCardComponent } from './my-messages/approve-project-message-card/approve-project-message-card.component';

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
    SkillSelectInputComponent,
    TestimonialsEditComponent,
    PublicationsComponent,
    PublicationsNewComponent,
    PublicationsEditComponent,
    MembershipsComponent,
    MembershipsNewComponent,
    MembershipsEditComponent,
    PermissionsComponent,
    AuthorizedUsersSelectComponent,
    WelcomeMessageCardComponent,
    MessageCardComponent,
    CommunityDeletedMessageCardComponent,
    CommunityChangedMessageCardComponent,
    CommunityLeftMessageCardComponent,
    CommunityKickOutMessageCardComponent,
    CommunityRoleChangedMessageCardComponent,
    CommunityAcceptanceMessageCardComponent,
    CommunityInvitationMessageCardComponent,
    CommunityJoinRequestMessageCardComponent,
    SkillsEstimationMessageCardComponent,
    UserManagerComponent,
    MySubordinatesComponent,
    UserProjectCardComponent,
    ProjectMembershipsComponent,
    ApproveProjectMessageCardComponent
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
    TestimonialsNewComponent,
    TestimonialsEditComponent,
    PublicationsNewComponent,
    PublicationsEditComponent,
    MembershipsNewComponent,
    MembershipsEditComponent
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
      redirectUri: window.location.href,
      silentRefreshRedirectUri: environment.authentication.silentRefreshRedirectUri,
      oidc: true,
      requireHttps: environment.authentication.requireHttps,
      postLogoutRedirectUri: window.location.origin + '/',
    });
    oauthService.tokenValidationHandler = new JwksValidationHandler();
    oauthService.setupAutomaticSilentRefresh();
    return oauthService.loadDiscoveryDocumentAndLogin();
  };
}
