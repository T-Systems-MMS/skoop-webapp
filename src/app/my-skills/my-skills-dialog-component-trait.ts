import { StepDescription } from './step-description';

export abstract class MySkillsDialogComponentTrait {

  protected resolveStepsDescription(description: StepDescription): string {
    return `0 - ${description.step0}
1 - ${description.step1}
2 - ${description.step2}
3 - ${description.step3}
4 - ${description.step4}`;
  }
}
