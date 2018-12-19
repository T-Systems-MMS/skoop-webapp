import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { UserIdentity } from './shared/user-identity';
import { UserIdentityService } from './shared/user-identity.service';

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

const testUserIdentity: UserIdentity = {
  userId: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@myskills.io',
  roles: ['ROLE_USER']
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
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
    spyOn(TestBed.get(UserIdentityService) as UserIdentityService, 'getUserIdentity')
      .and.returnValue(of<UserIdentity>(testUserIdentity));

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch an observable for the user identity', () => {
    expect(component.userIdentity$).toBeDefined();
    const userIdentityService = TestBed.get(UserIdentityService) as UserIdentityService;
    expect(userIdentityService.getUserIdentity).toHaveBeenCalled();
  });

  it('should render the app name in the toolbar', () => {
    const title = fixture.debugElement.query(By.css('.toolbar__title'));
    expect(title.nativeElement.textContent).toContain('MySkills');
  });

  it('should render the user name in the toolbar', () => {
    const username = fixture.debugElement.query(By.css('.toolbar__username'));
    expect(username.nativeElement.textContent).toBe('tester');
  });
});
