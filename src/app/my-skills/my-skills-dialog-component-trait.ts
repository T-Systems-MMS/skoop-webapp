import { MatSlider } from '@angular/material';
import { StepDescription } from './step-description';

export abstract class MySkillsDialogComponentTrait {

  protected updateLabel(slider: MatSlider, description: StepDescription, step: number) {
    if (step === null) {
      return;
    }

    const title = description['step' + step];
    slider._elementRef.nativeElement.querySelector('.mat-slider-thumb').setAttribute('title', title);

    const stepLabel = slider._elementRef.nativeElement.querySelector('.mat-slider-thumb-label');
    if (stepLabel) {
      stepLabel.setAttribute('title', title);
    }
  }
  
  protected getLabelHint(description: StepDescription): string {
    return '0 - ' + description.step0 + '\n' +
      '1 - ' + description.step1 + '\n' +
      '2 - ' + description.step2 + '\n' +
      '3 - ' + description.step3 + '\n' +
      '4 - ' + description.step4;
  }
}
