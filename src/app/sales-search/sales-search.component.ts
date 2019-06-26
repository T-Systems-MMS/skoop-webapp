import { Component, OnInit } from '@angular/core';
import { SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [SPACE];
  terms: string[] = [];

  constructor() { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // allow to add space between double quotes
    if (value.startsWith('"') && (value.length === 1  || !value.endsWith('"'))) {
      input.value = value + ' ';
      return;
    }

    // Add term
    if (this.canBeAdded(value)) {
      this.terms.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(index: number): void {
    if (index >= 0) {
      this.terms.splice(index, 1);
    }
  }

  search() {
  }

  private canBeAdded(term): boolean {
    const valueLowerCase = (term.startsWith('"') && term.endsWith('"'))
      ? (term.substr(1, term.length - 2) || '').trim().toLowerCase()
      : (term || '').trim().toLowerCase();

    if (!valueLowerCase) {
      return false;
    }

    return this.terms.find(item =>
      (item.startsWith('"') && item.endsWith('"'))
      ? item.substr(1, item.length - 2).toLowerCase() === valueLowerCase
      : item.toLowerCase() === valueLowerCase) == null;
  }

}
