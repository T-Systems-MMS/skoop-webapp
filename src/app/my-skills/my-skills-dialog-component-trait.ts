import { StepDescription } from './step-description';

export abstract class MySkillsDialogComponentTrait {

  protected getLabelHint(description: StepDescription): string {
    return '0 - ' + description.step0 + '\n' +
      '1 - ' + description.step1 + '\n' +
      '2 - ' + description.step2 + '\n' +
      '3 - ' + description.step3 + '\n' +
      '4 - ' + description.step4;
  }
}
