import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../shared/manager.service';
import { Observable, of } from 'rxjs';
import { User } from '../users/user';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {

  manager$: Observable<User> = of();

  constructor(private managerService: ManagerService) { }

  ngOnInit() {
    this.manager$ = this.managerService.getUserManager();
  }

}
