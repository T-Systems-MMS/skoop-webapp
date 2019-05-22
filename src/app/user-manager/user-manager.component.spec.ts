import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerComponent } from './user-manager.component';
import { ManagerService } from './manager.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const manager = {
  id: '323285af-df9d-4e61-8e56-1b9895b36541',
  userName: 'manager',
  firstName: 'Name',
  lastName: 'Surname',
  email: 'manager@mail.com',
  phoneNumber: '1234567890'
};

describe('UserManagerComponent', () => {
  let component: UserManagerComponent;
  let fixture: ComponentFixture<UserManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagerComponent ],
      providers: [
        {
          provide: ManagerService,
          useValue: jasmine.createSpyObj('managerService', {'getUserManager': of(manager)})
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fill manager content if there is manager for the current user', () => {
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.manager-content'));
    expect(content).not.toBeNull();
  });

  it('should not fill manager content if there is no manager for the current user', () => {
    const managerService = TestBed.get(ManagerService);
    managerService.getUserManager = jasmine.createSpy().and.returnValue(null);

    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.manager-content'));
    expect(content).toBeNull();
  });
});
