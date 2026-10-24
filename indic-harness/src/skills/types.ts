/**
 * Hinglish Custom Skill Definitions
 */

export type SkillCategory =
  | 'debugging'
  | 'explanation'
  | 'refactoring'
  | 'optimization'
  | 'planning'
  | 'testing';

export interface HinglishSkill {
  id: string;
  name: string;
  hindiTitle: string;
  description: string;
  category: SkillCategory;
  triggerKeywords: string[];
  runbook: string[];
  examplePhrases: string[];
}
