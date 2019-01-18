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
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { ProjectsFilterPipe } from './projects/projects-filter.pipe';

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
    NewProjectComponent,
    EditProjectComponent,
    ProjectsFilterPipe,
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
    }
  ],
  entryComponents: [
    DeleteConfirmationDialogComponent,
    MySkillsNewComponent,
    MySkillsEditComponent,
    SkillsNewComponent,
    SkillsEditComponent,
    SkillGroupsNewComponent,
    SkillGroupsEditComponent,
    NewProjectComponent,
    EditProjectComponent,
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
