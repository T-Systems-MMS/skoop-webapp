import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue } from '../filter-value';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss']
})
export class FilterGroupComponent implements OnInit {

  @Input() values: FilterValue[];
  @Input() maxCountToShow = 5;
  /**
   * Emit selected filter values
   */
  @Output() selectionChanged: EventEmitter<FilterValue[]> = new EventEmitter();

  public countLimit = this.maxCountToShow;
  private currentSelection: FilterValue[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  onChange(event: MatCheckboxChange) {
    if (event.checked) {
      const filterValue: FilterValue = {
        title: event.source.id,
        checked: event.checked
      };

      this.currentSelection.push(filterValue);
    } else {
      const index = this.currentSelection.findIndex(value => value.title === event.source.id);
      if (index > -1) {
        this.currentSelection.splice(index, 1);
      }
    }

    this.selectionChanged.emit(this.currentSelection);
  }

  showMoreItems() {
    this.countLimit = Number(this.countLimit) + this.maxCountToShow;
  }

  showLessItems() {
    this.countLimit = Number(this.countLimit) - this.maxCountToShow;
  }

}
