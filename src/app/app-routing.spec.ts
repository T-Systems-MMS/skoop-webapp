import { RouterLinkWithHref } from '@angular/router';
import { TestBed, fakeAsync, async, ComponentFixture, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By, BrowserModule } from '@angular/platform-browser';
import { click, expectPathToBe, expectPathToNotBe } from './app-routing.helper';
import { UserIdentityService } from './shared/user-identity.service';
import { UserIdentity } from './shared/user-identity';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FormatCounterPipe } from './format-counter.pipe';

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

describe('Router: App', () => {
  let location: SpyLocation;
  let allLinkDes: DebugElement[];
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    spyOn(userIdentityServiceStub, 'getUserIdentity')
      .and.returnValue(of<UserIdentity>({
        userId: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester',
        roles: ['ROLE_USER'],
        notificationCount: 10
      }));

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'my-messages', component: AppComponent },
          { path: 'my-skills', component: AppComponent },
          { path: 'skills', component: AppComponent },
          { path: 'skills/:skillId/users', component: AppComponent },
          { path: 'user-profile', component: AppComponent },
          { path: '', redirectTo: 'my-skills', pathMatch: 'full' },
          { path: '**', component: AppComponent }
        ]),
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        BrowserModule,
        AppMaterialModule,
        HttpClientTestingModule,
        OAuthModule.forRoot()
      ],
      declarations: [
        AppComponent, FormatCounterPipe,
      ],
      providers: [
        { provide: UserIdentityService, useValue: userIdentityServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    const injector = fixture.debugElement.injector;
    location = injector.get(Location) as SpyLocation;

    allLinkDes = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    fixture.detectChanges();
  });

  it('all items takes me home', fakeAsync(() => {
    expectPathToBe(location, '', 'link should not have navigated yet');
    click(allLinkDes[0]);
    tick();
    expectPathToBe(location, '/my-messages');
    click(allLinkDes[3]);
    tick();
    expectPathToNotBe(location, '/my-messages', 'link should have navigated yet');
  }));
});
