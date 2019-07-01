import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue } from '../filter-value';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss']
})
export class FilterGroupComponent implements OnInit {

  @Input() values: string[];
  @Input() maxCountToShow = 5;
  /**
   * Emit selected filter values
   */
  @Output() selectionChanged: EventEmitter<FilterValue[]> = new EventEmitter();

  public countLimit = this.maxCountToShow;
  public filterValues: FilterValue[];
  private currentSelection: FilterValue[] = [];

  constructor() {
  }

  ngOnInit() {
    this.filterValues = this.values.map(item => {
      return {title: item, checked: false}
    });
  }

  onChange(event: MatCheckboxChange) {
    this.filterValues.find(value => value.title === event.source.id).checked = event.checked;

    this.currentSelection = this.filterValues.filter(item => item.checked);
    this.selectionChanged.emit(this.currentSelection);
  }

  showMoreItems() {
    this.countLimit = Number(this.countLimit) + this.maxCountToShow;
  }

  showLessItems() {
    this.countLimit = Number(this.countLimit) - this.maxCountToShow;
  }

}
