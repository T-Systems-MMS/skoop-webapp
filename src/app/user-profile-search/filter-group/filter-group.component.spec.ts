import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGroupComponent } from './filter-group.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { By } from '@angular/platform-browser';
import { MatCheckbox } from '@angular/material';

const filterValues: string[] = [
  'filter1',
  'filter2',
  'filter3',
  'filter4',
  'filter5',
  'filter6',
  'filter7'
];

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let fixture: ComponentFixture<FilterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        FormsModule,
        AppMaterialModule
      ],
      declarations: [ FilterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGroupComponent);
    component = fixture.componentInstance;
    component.values = filterValues;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display only @maxCountToShow checkboxes, link should have text "Show all"', () => {
    const checkboxes = fixture.debugElement.queryAll(By.directive(MatCheckbox));
    expect(checkboxes.length).toBe(component.maxCountToShow);

    const linkElem = fixture.debugElement.query(By.css('a'));
    expect(linkElem).toBeDefined();
    expect(linkElem.nativeElement.text).toBe('Show all');
  });

  it('should emit selectionChanged event with current selection', () => {
    const spy = spyOn(component.selectionChanged, 'emit');
    const checkbox = fixture.debugElement.nativeElement.querySelector('mat-checkbox label');
    checkbox.click();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith([{title: filterValues[0], checked: true}]);
  });

  it('should emit selectionChanged event with empty array', () => {
    const spy = spyOn(component.selectionChanged, 'emit');
    const checkbox = fixture.debugElement.nativeElement.querySelector('mat-checkbox label');
    // check and uncheck value
    checkbox.click();
    checkbox.click();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should display all checkboxes, link should have text "Show less" when "Show all" clicked', () => {
    let linkElem = fixture.debugElement.query(By.css('a'));
    linkElem.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const checkboxes = fixture.debugElement.queryAll(By.directive(MatCheckbox));
    expect(checkboxes.length).toBe(filterValues.length);

    linkElem = fixture.debugElement.query(By.css('a'));
    expect(linkElem).toBeDefined();
    expect(linkElem.nativeElement.text).toBe('Show less');
  });

  it('should display only @maxCountToShow checkboxes, link should have text "Show all when "Show less" clicked', () => {
    let linkElem = fixture.debugElement.query(By.css('a'));
    linkElem.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    linkElem = fixture.debugElement.query(By.css('a'));
    linkElem.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const checkboxes = fixture.debugElement.queryAll(By.directive(MatCheckbox));
    expect(checkboxes.length).toBe(component.maxCountToShow);

    linkElem = fixture.debugElement.query(By.css('a'));
    expect(linkElem).toBeDefined();
    expect(linkElem.nativeElement.text).toBe('Show all');
  });

  it('should not display "Show all"/"Show less" link when filter count is less than @maxCountToShow', () => {
    component.values = ['filter1'];
    fixture.detectChanges();

    const linkElem = fixture.debugElement.query(By.css('a'));
    expect(linkElem).toBeNull();
  });
});
