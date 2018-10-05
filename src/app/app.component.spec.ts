import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { UserIdentityService } from './shared/user-identity.service';
import { UserIdentity } from './shared/user-identity';

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    spyOn(userIdentityServiceStub, 'getUserIdentity')
      .and.returnValue(of<UserIdentity>({
        userId: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester',
        roles: ['ROLE_USER']
      }));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        AppMaterialModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: UserIdentityService, useValue: userIdentityServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should fetch an observable for the user identity', async(() => {
    expect(component.userIdentity$).toBeDefined();
    expect(userIdentityServiceStub.getUserIdentity).toHaveBeenCalled();
  }));

  it('should render the app name in the sidenav toolbar', async(() => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('.sidenav-toolbar').textContent).toContain('MySkills');
  }));

  it('should render the user name in the toolbar', async(() => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('.page-header-username').textContent).toContain('tester');
  }));
});
