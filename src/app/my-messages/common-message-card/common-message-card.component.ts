import { Component, Input, OnInit } from '@angular/core';
import { AbstractNotification } from '../abstract-notification';

@Component({
  selector: 'app-common-message-card',
  templateUrl: './common-message-card.component.html',
  styleUrls: ['./common-message-card.component.scss']
})
export class CommonMessageCardComponent implements OnInit {

  @Input() notification: AbstractNotification;

  constructor() { }

  ngOnInit() {
  }

}
