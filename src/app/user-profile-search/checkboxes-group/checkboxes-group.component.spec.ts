import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxesGroupComponent } from './checkboxes-group.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { FilterValue } from '../filter-value';
import { By } from '@angular/platform-browser';
import { MatCheckbox } from '@angular/material';

const filterValues: FilterValue[] = [
  {
    title: 'filter1',
    checked: false
  },
  {
    title: 'filter2',
    checked: false
  },
  {
    title: 'filter3',
    checked: false
  },
  {
    title: 'filter4',
    checked: false
  },
  {
    title: 'filter5',
    checked: false
  },
  {
    title: 'filter6',
    checked: false
  },
  {
    title: 'filter7',
    checked: false
  }
];

describe('CheckboxesGroupComponent', () => {
  let component: CheckboxesGroupComponent;
  let fixture: ComponentFixture<CheckboxesGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        FormsModule,
        AppMaterialModule
      ],
      declarations: [ CheckboxesGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxesGroupComponent);
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

  it('should emit selectionChanged event', () => {
    const spy = spyOn(component.selectionChanged, 'emit');
    const checkbox = fixture.debugElement.query(By.directive(MatCheckbox));
    checkbox.nativeElement.value = true;
    checkbox.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
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
    component.values = [
      {
        title: 'filter1',
        checked: false
      }
    ];
    fixture.detectChanges();

    const linkElem = fixture.debugElement.query(By.css('a'));
    expect(linkElem).toBeNull();
  });
});
