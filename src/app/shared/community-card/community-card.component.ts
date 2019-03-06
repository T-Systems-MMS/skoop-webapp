import { Component, Input, OnInit } from '@angular/core';
import { CommunityResponse } from '../../communities/community-response';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent implements OnInit {

  @Input() community: CommunityResponse;

  constructor() { }

  ngOnInit() {
  }

}
