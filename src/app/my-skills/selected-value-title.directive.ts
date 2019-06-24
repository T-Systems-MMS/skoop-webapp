import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StepDescription } from './step-description';
import { MatSliderChange } from '@angular/material';

@Directive({
  selector: '[appSelectedValueTitle]'
})
export class SelectedValueTitleDirective implements OnChanges {

  @Input() stepDescription: StepDescription;
  @Input() initialValue = 0;
  private readonly element: ElementRef;

  constructor(el: ElementRef) {
    this.element = el;
  }

  @HostListener('change', ['$event'])
  onSelectSliderValue(event: MatSliderChange) {
    this.updateTitle(event.value);
  }


  ngOnChanges(changes: SimpleChanges): void {
    // description loaded
    if (changes['stepDescription'].currentValue) {
      this.updateTitle(this.initialValue);
    }
  }

  private updateTitle(step: number) {
    if (step === null) {
      return;
    }

    const title = this.stepDescription['step' + step];
    this.element.nativeElement.querySelector('.mat-slider-thumb').setAttribute('title', title);

    const stepLabel = this.element.nativeElement.querySelector('.mat-slider-thumb-label');
    if (stepLabel) {
      stepLabel.setAttribute('title', title);
    }
  }

}
