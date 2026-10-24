/**
 * Hinglish Skills Registry (Custom Skills for Popular Hinglish Words)
 * Matches colloquial developer prompts to structured action runbooks.
 */

import { HinglishSkill } from './types';

export const BUILTIN_HINGLISH_SKILLS: HinglishSkill[] = [
  {
    id: 'theek-kardo',
    name: 'Theek Kardo',
    hindiTitle: 'ठीक कर दो (Bug Fixer)',
    category: 'debugging',
    description: 'Diagnoses errors, finds root causes, applies fail-safe edits, and verifies fixes with unit tests.',
    triggerKeywords: [
      'theek kardo', 'theek karo', 'fix karo', 'error aa raha hai',
      'crash ho raha hai', 'fat gaya', 'chal nahi raha', 'lafda ho gaya',
      'bug hatao', 'issue fix karo', 'sahi kardo', 'sahi karo'
    ],
    examplePhrases: [
      'Bhai search.ts mein loop error theek kardo',
      'Code fat gaya, null pointer crash ho raha hai',
      'Ye function chal nahi raha, fix karo',
    ],
    runbook: [
      'Inspect error stack trace and locate target file via read or grep.',
      'Diagnose root cause (null pointer, off-by-one, missing await, inverted logic).',
      'Apply exact-string fail-safe edit with surrounding context lines.',
      'Run unit tests to verify fix.',
      'Explain the fix in natural developer Hinglish while keeping code in English.',
    ],
  },
  {
    id: 'samjhao',
    name: 'Samjhao',
    hindiTitle: 'समझाओ (Code Walkthrough)',
    category: 'explanation',
    description: 'Walks through complex algorithms, functions, and architecture in clear Hinglish analogies.',
    triggerKeywords: [
      'samjhao', 'flow batao', 'kya kar raha hai', 'kaise kaam karta hai',
      'architecture samjhao', 'logic explain karo', 'explain kardo', 'kya lafda hai',
      'matlab batao', 'kaise chal raha hai'
    ],
    examplePhrases: [
      'Bhai ye binary search code samjhao',
      'Is module ka flow batao step-by-step',
      'A* pathfinding algorithm kaise kaam karta hai?',
    ],
    runbook: [
      'Read target file and trace imports and helper functions.',
      'Deconstruct inputs, core transformations, side effects, and outputs.',
      'Structure explanation into Mukhya Kaam, Step-by-Step Flow, and Complexity.',
      'Use intuitive developer Hinglish while preserving English technical terms.',
    ],
  },
  {
    id: 'safai-refactor',
    name: 'Safai & Refactor',
    hindiTitle: 'सफ़ाई और रिफैक्टर (Clean Code)',
    category: 'refactoring',
    description: 'Cleans up duplicate logic, extracts reusable helpers, and removes dead code without breaking behaviors.',
    triggerKeywords: [
      'safai karo', 'clean karo', 'refactor kardo', 'refactor karo',
      'dead code hatao', 'duplicate logic nikalo', 'clean code banao',
      'code chamkao', 'simplify karo', 'safai kardo'
    ],
    examplePhrases: [
      'Code ki safai karo aur dead imports hatao',
      'Duplicate distance calculation ko helper mein extract karke refactor kardo',
      'Is controller ko clean aur readable bana do',
    ],
    runbook: [
      'Audit target file for unused variables, console logs, and repetitive logic.',
      'Extract duplicate operations into pure helper functions.',
      'Simplify nested if-else ladders into early return guard clauses.',
      'Run test suite to verify zero regressions.',
      'List all cleanups clearly in Hinglish summary.',
    ],
  },
  {
    id: 'jugaad-optimizer',
    name: 'Jugaad Optimizer',
    hindiTitle: 'जुगाड़ ऑप्टिमाइज़र (Performance Tuning)',
    category: 'optimization',
    description: 'Speeds up bottlenecks, reduces algorithmic complexity, and optimizes memory usage.',
    triggerKeywords: [
      'jugaad lagao', 'fast karo', 'optimize kardo', 'optimize karo',
      'slow chal raha hai', 'speed badhao', 'latency kam karo',
      'memory bachaao', 'hang ho raha hai', 'fast banao'
    ],
    examplePhrases: [
      'Isko fast karo, lookup mein bohot time lag raha hai',
      'Kuch jugaad lagao taaki animation lag na kare',
      'Memory consumption kam karo aur loop optimize kardo',
    ],
    runbook: [
      'Detect quadratic loops O(n^2) or exponential recursion.',
      'Replace linear searches with O(1) Map/Set lookup structures.',
      'Introduce memoization or batching where appropriate.',
      'Verify that edge cases still produce identical outputs.',
      'Explain the algorithmic speedup in conversational Hinglish.',
    ],
  },
  {
    id: 'yojana-planner',
    name: 'Yojana Planner',
    hindiTitle: 'योजना प्लानर (Strategic Planning)',
    category: 'planning',
    description: 'Explores the codebase in read-only mode and formulates a disciplined step-by-step checklist before coding.',
    triggerKeywords: [
      'yojana banao', 'plan karo', 'pehle socho', 'steps batao',
      'roadmap banao', 'architecture design karo', 'kaise implement karein',
      'pehle plan banao', 'socho kaise karein'
    ],
    examplePhrases: [
      'Bhai pehle yojana banao, seedha edit mat karo',
      'Is feature ka implementation roadmap kya hoga?',
      'Pehle socho aur step-by-step task checklist banao',
    ],
    runbook: [
      'Engage Plan Mode to lock destructive tools (write, edit, bash).',
      'Explore affected directories using glob and grep.',
      'Formulate an ordered checklist using the todo tool.',
      'Present the plan to the user in Hinglish and wait for approval (/karo).',
    ],
  },
  {
    id: 'chalao-jaanch',
    name: 'Chalao & Jaanch',
    hindiTitle: 'चलाओ और जाँचो (Test & Verify)',
    category: 'testing',
    description: 'Runs test runner and linters, diagnoses any failures, and ensures 100% green pass rate.',
    triggerKeywords: [
      'tests chalao', 'chalao aur dekho', 'jaanch karo', 'verify karo',
      'check karo', 'sab theek hai', 'build pass ho raha hai',
      'chalake dikhao', 'test run karo', 'sab green hai'
    ],
    examplePhrases: [
      'Tests chalao aur dekho sab pass ho raha hai ya nahi',
      'Check karo build aur unit tests green hain?',
      'Code verify karo aur chalake dikhao',
    ],
    runbook: [
      'Execute the test suite via bash (npm test or npm run harness:test).',
      'Parse output for test failures or compiler type errors.',
      'If failures occur, immediately trigger diagnosis and fix.',
      'Confirm 100% green status and report results in Hinglish.',
    ],
  },
];

export class HinglishSkillRegistry {
  private skills: Map<string, HinglishSkill> = new Map();

  constructor(customSkills: HinglishSkill[] = BUILTIN_HINGLISH_SKILLS) {
    for (const skill of customSkills) {
      this.skills.set(skill.id, skill);
    }
  }

  public getAll(): HinglishSkill[] {
    return Array.from(this.skills.values());
  }

  public get(id: string): HinglishSkill | undefined {
    return this.skills.get(id);
  }

  /**
   * Matches user prompt against skill trigger keywords.
   */
  public matchSkill(prompt: string): HinglishSkill | null {
    const lower = prompt.toLowerCase();

    for (const skill of this.skills.values()) {
      for (const keyword of skill.triggerKeywords) {
        if (lower.includes(keyword)) {
          return skill;
        }
      }
    }

    return null;
  }
}
