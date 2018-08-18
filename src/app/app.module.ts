import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Environment configuration
import { environment } from '../environments/environment';

// Layout modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app-material.module';

// Routing module
import { AppRoutingModule } from './app-routing.module';

// Authentication module
import { OAuthModule, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

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
    ReactiveFormsModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.serverApiUrl],
        sendAccessToken: true
      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initAuthentication,
      deps: [OAuthService],
      multi: true
    },
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

export function initAuthentication(oauthService: OAuthService): Function {
  return () => {
    oauthService.configure({
      issuer: environment.authentication.issuer,
      clientId: environment.authentication.clientId,
      scope: environment.authentication.scope,
      redirectUri: environment.authentication.redirectUri ? environment.authentication.redirectUri : window.location.origin + '/',
      oidc: true
    });
    oauthService.tokenValidationHandler = new JwksValidationHandler();
    return oauthService.loadDiscoveryDocumentAndLogin();
  };
}
