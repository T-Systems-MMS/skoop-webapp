import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue } from '../filter-value';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss']
})
export class FilterGroupComponent implements OnInit {

  @Input() values: FilterValue[];
  @Input() maxCountToShow = 5;
  @Output() selectionChanged: EventEmitter<void> = new EventEmitter();

  public countLimit = this.maxCountToShow;

  constructor() {
  }

  ngOnInit() {
  }

  onChange() {
    this.selectionChanged.emit();
  }

  showMoreItems() {
    this.countLimit = Number(this.countLimit) + this.maxCountToShow;
  }

  showLessItems() {
    this.countLimit = Number(this.countLimit) - this.maxCountToShow;
  }

}
