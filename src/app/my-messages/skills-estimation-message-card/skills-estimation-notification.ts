import { AbstractNotification } from '../abstract-notification';
import { SkillView } from '../../shared/skill-card/skill-view';

export interface SkillsEstimationNotification extends AbstractNotification {

  skills: SkillView[]
}
