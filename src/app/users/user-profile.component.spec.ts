import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule} from '@angular/forms';
import { of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { UserProfileComponent } from './user-profile.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UsersService } from './users.service';
import { User } from './user';
import { UserRequest } from './user-request';
import { ENTER } from '@angular/cdk/keycodes';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-testimonials',
  template: ''
})
class TestimonialsStubComponent {
}

@Component({
  selector: 'app-publications',
  template: ''
})
class PublicationsStubComponent {
}

@Component({
  selector: 'app-memberships',
  template: ''
})
class MembershipsStubComponent {
}

@Component({
  selector: 'app-permissions',
  template: ''
})
class PermissionsStubComponent {
  @Input() savingInProgress = false;
}
@Component({
  selector: 'app-user-manager',
  template: ''
})
class ManagerStubComponent {
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [
        UserProfileComponent,
        TestimonialsStubComponent,
        PublicationsStubComponent,
        MembershipsStubComponent,
        PermissionsStubComponent,
        ManagerStubComponent
      ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('userService', {
            'getUser': of<User>(
              {
                id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
                userName: 'tester',
                firstName: 'Toni',
                lastName: 'Tester',
                email: 'toni.tester@skoop.io',
                academicDegree: 'academic degree',
                positionProfile: 'position profile',
                summary: 'summary',
                industrySectors: ['sector1', 'sector2', 'sector3'],
                specializations: ['specialization1', 'specialization2', 'specialization3'],
                certificates: ['certificate1', 'certificate2', 'certificate3'],
                languages: ['language1', 'language2', 'language2']
              }
            ),
            'updateUser': of<User>(
              {
                id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
                userName: 'tester',
                firstName: 'Toni',
                lastName: 'Tester',
                email: 'toni.tester@skoop.io'
              }
            )
          })
        },
        {
          provide: PopupNotificationService,
          useValue: jasmine.createSpyObj('popupNotificationService', {'showSuccessMessage': of<void>()})
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.errorMessage).toBeNull();
  });

  it('should render "User profile" as heading', () => {
    const heading: DebugElement = fixture.debugElement.query(By.css('h1'));
    expect(heading.nativeElement.innerText).toBe('User profile');
  });

  it('should initialize the user profile form', () => {
    expect(component.userForm.get('firstName').value).toBe('Toni');
    expect(component.userForm.get('lastName').value).toBe('Tester');
    expect(component.userForm.get('userName').value).toBe('tester');
    expect(component.userForm.get('email').value).toBe('toni.tester@skoop.io');
    expect(component.userForm.get('academicDegree').value).toBe('academic degree');
    expect(component.userForm.get('positionProfile').value).toBe('position profile');
    expect(component.userForm.get('summary').value).toBe('summary');
    expect(component.userForm.get('industrySectors').value).toEqual(['sector1', 'sector2', 'sector3']);
    expect(component.userForm.get('specializations').value).toEqual(['specialization1', 'specialization2', 'specialization3']);
    expect(component.userForm.get('certificates').value).toEqual(['certificate1', 'certificate2', 'certificate3']);
    expect(component.userForm.get('languages').value).toEqual(['language1', 'language2', 'language2']);
  });

  it('should update the user profile form', async(() => {
    component.saveUserDetails();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userForm.get('firstName').value).toBe('Toni');
      expect(component.userForm.get('lastName').value).toBe('Tester');
      expect(component.userForm.get('userName').value).toBe('tester');
      expect(component.userForm.get('email').value).toBe('toni.tester@skoop.io');

      const expectedRequestData: UserRequest = {
        userName: 'tester',
        academicDegree: 'academic degree',
        positionProfile: 'position profile',
        summary: 'summary',
        industrySectors: ['sector1', 'sector2', 'sector3'],
        specializations: ['specialization1', 'specialization2', 'specialization3'],
        certificates: ['certificate1', 'certificate2', 'certificate3'],
        languages: ['language1', 'language2', 'language2']
      };

      const userService: UsersService = TestBed.get(UsersService) as UsersService;
      expect(userService.updateUser).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should add new elem to the language array', () => {
    const value = 'new language';
    expect(component.languagesArray.indexOf(value)).toBe(-1);

    const languageDebugElement = fixture.debugElement.query(By.css('#languageChipList'));
    const inputNativeElement = languageDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(component.languagesArray.indexOf(value)).not.toBe(-1);
  });

  it('should not add a duplicate elem to the language array', () => {
    const expectedSize = component.languagesArray.length;
    const value = component.languagesArray[0];
    const pushSpy = spyOn(component.languagesArray, 'push');

    const languageDebugElement = fixture.debugElement.query(By.css('#languageChipList'));
    const inputNativeElement = languageDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(pushSpy).not.toHaveBeenCalled();
    // size wasn't changed
    expect(component.languagesArray.length).toBe(expectedSize);
  });

  it('should remove elem from the language array', () => {
    const valueForRemoving = component.languagesArray[0];
    component.removeElem(0, component.languagesArray);
    expect(component.languagesArray.indexOf(valueForRemoving)).toBe(-1);
  });

});
