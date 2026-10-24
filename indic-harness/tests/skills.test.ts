import { describe, it, expect } from 'vitest';
import { HinglishSkillRegistry, BUILTIN_HINGLISH_SKILLS } from '../src/skills';
import { AgentLoop } from '../src/agent/loop';
import { MockProvider } from '../src/providers/mock';
import { ToolRegistry } from '../src/tools';
import { AgentConfig } from '../src/types';

describe('Custom Hinglish Developer Skills Registry', () => {
  const registry = new HinglishSkillRegistry();

  it('contains all 6 essential developer skills based on popular Hinglish words', () => {
    const all = registry.getAll();
    expect(all.length).toBe(6);

    const ids = all.map((s) => s.id);
    expect(ids).toContain('theek-kardo');
    expect(ids).toContain('samjhao');
    expect(ids).toContain('safai-refactor');
    expect(ids).toContain('jugaad-optimizer');
    expect(ids).toContain('yojana-planner');
    expect(ids).toContain('chalao-jaanch');
  });

  describe('Keyword & Popular Phrase Matching', () => {
    it('matches "theek kardo" to the bug fixing skill', () => {
      const match = registry.matchSkill('Bhai search.ts mein loop ka boundary error theek kardo');
      expect(match).toBeDefined();
      expect(match?.id).toBe('theek-kardo');
    });

    it('matches "fat gaya" and "crash ho raha hai" to the bug fixing skill', () => {
      const match = registry.matchSkill('Null pointer ki wajah se code fat gaya');
      expect(match).toBeDefined();
      expect(match?.id).toBe('theek-kardo');
    });

    it('matches "samjhao" and "flow batao" to the explanation skill', () => {
      const match = registry.matchSkill('Is binary search function ka flow batao aur code samjhao');
      expect(match).toBeDefined();
      expect(match?.id).toBe('samjhao');
    });

    it('matches "safai karo" and "dead code hatao" to the refactor skill', () => {
      const match = registry.matchSkill('Controller se dead code hatao aur code ki safai karo');
      expect(match).toBeDefined();
      expect(match?.id).toBe('safai-refactor');
    });

    it('matches "jugaad lagao" and "fast karo" to the optimizer skill', () => {
      const match = registry.matchSkill('Lookup bohot slow chal raha hai, kuch jugaad lagao aur fast karo');
      expect(match).toBeDefined();
      expect(match?.id).toBe('jugaad-optimizer');
    });

    it('matches "yojana banao" and "pehle socho" to the planning skill', () => {
      const match = registry.matchSkill('Bhai pehle yojana banao, seedha edit mat karo');
      expect(match).toBeDefined();
      expect(match?.id).toBe('yojana-planner');
    });

    it('matches "tests chalao" and "verify karo" to the testing skill', () => {
      const match = registry.matchSkill('Tests chalao aur check karo sab pass hai ya nahi');
      expect(match).toBeDefined();
      expect(match?.id).toBe('chalao-jaanch');
    });

    it('returns null for queries with no matching Hinglish skill keywords', () => {
      const match = registry.matchSkill('What is the weather in Mumbai?');
      expect(match).toBeNull();
    });
  });

  describe('AgentLoop Skill Activation', () => {
    it('triggers skill activation event when prompt matches a Hinglish skill', async () => {
      const mockProvider = new MockProvider();
      mockProvider.enqueue({ content: 'Maine bug theek kar diya hai.' });

      const config: AgentConfig = {
        provider: mockProvider,
        model: 'mock-sarvam-30b',
        workspaceRoot: '.',
        maxSteps: 3,
        verbose: false,
        language: 'hinglish',
      };

      const loop = new AgentLoop(config, new ToolRegistry());
      let activatedSkillName = '';

      const result = await loop.run('Bhai ye error theek kardo', (event) => {
        if (event.type === 'skill_activation' && event.skill) {
          activatedSkillName = event.skill.name;
        }
      });

      expect(activatedSkillName).toBe('Theek Kardo');
      expect(result.matchedSkill?.id).toBe('theek-kardo');
    });
  });
});
