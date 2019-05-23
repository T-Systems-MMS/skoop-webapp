import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubordinatesComponent } from './my-subordinates.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ManagerService } from '../shared/manager.service';

const subordinates = [
  {
    id: '111285af-df9d-4e61-8e56-1b9895b36321',
    userName: 'user1',
    firstName: 'Name1',
    lastName: 'Surname1',
    email: 'user1@mail.com',
    phoneNumber: '1234567890'
  },
  {
    id: '323285af-df9d-4e61-8e56-1b9895b36541',
    userName: 'user2',
    firstName: 'Name2',
    lastName: 'Surname2',
    email: 'user2@mail.com',
    phoneNumber: '9876543221'
  }
];

describe('MySubordinatesComponent', () => {
  let component: MySubordinatesComponent;
  let fixture: ComponentFixture<MySubordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatMomentDateModule
      ],
      declarations: [ MySubordinatesComponent ],
      providers: [
        {
          provide: ManagerService,
          useValue: jasmine.createSpyObj('managerService', {'getSubordinates': of(subordinates)})
        },
        GlobalErrorHandlerService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySubordinatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fill subordinates content if there are subordinates for the current user', () => {
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.my-subordinates-wrapper'));
    expect(content).not.toBeNull();
  });

  it('should not fill subordinates content if there are subordinates for the current user', () => {
    const managerService = TestBed.get(ManagerService);
    managerService.getSubordinates = jasmine.createSpy().and.returnValue(of([]));

    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.my-subordinates-wrapper'));
    expect(content).toBeNull();
  });
});
