import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNotificationComponent } from './todo-notification.component';

describe('TodoNotificationComponent', () => {
  let component: TodoNotificationComponent;
  let fixture: ComponentFixture<TodoNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
