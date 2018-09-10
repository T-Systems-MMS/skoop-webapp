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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SkillPriorityStatisticComponent } from './statistics/statistic/skill-priority-statistic.component';
import { SkillUsersReportComponent } from './reports/user-skill-priority-details-report/skill-users-report/skill-users-report.component';

// Services

@NgModule({
  declarations: [
    AppComponent,
    MySkillsNewComponent,
    MySkillsEditComponent,
    SkillPriorityStatisticComponent,
    routingComponents,
    PageNotFoundComponent,
    SkillUsersReportComponent,
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
    {
      provide: APP_INITIALIZER,
      useFactory: initAuthentication,
      deps: [OAuthModuleConfig, OAuthService],
      multi: true
    }
  ],
  entryComponents: [
    MySkillsNewComponent,
    MySkillsEditComponent
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
      oidc: true
    });
    oauthService.tokenValidationHandler = new JwksValidationHandler();
    return oauthService.loadDiscoveryDocumentAndLogin();
  };
}
