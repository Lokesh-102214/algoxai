import { describe, it, expect } from 'vitest';
import { detectLanguage } from '../src/indic/detector';

describe('Language Detector (Day 3)', () => {
  it('identifies pure English prompts', () => {
    const res = detectLanguage('Please refactor the binary search function to prevent off-by-one errors.');
    expect(res.detected).toBe('english');
    expect(res.hasDevanagari).toBe(false);
    expect(res.hasIndicPhonetics).toBe(false);
  });

  it('identifies developer Hinglish prompts', () => {
    const res = detectLanguage('Bhai search.ts mein loop ka boundary error theek kardo, tests fail ho rahe hain.');
    expect(res.detected).toBe('hinglish');
    expect(res.hasIndicPhonetics).toBe(true);
    expect(res.hasDevanagari).toBe(false);
    expect(res.sampleTokens).toContain('bhai');
  });

  it('identifies short Hinglish commands', () => {
    const res = detectLanguage('isko sahi karo');
    expect(res.detected).toBe('hinglish');
    expect(res.hasIndicPhonetics).toBe(true);
  });

  it('identifies Devanagari Hindi prompts', () => {
    const res = detectLanguage('सर्च फंक्शन में बग है, इसको सही कर दो।');
    expect(res.detected).toBe('devanagari');
    expect(res.hasDevanagari).toBe(true);
  });

  it('handles empty input gracefully', () => {
    const res = detectLanguage('   ');
    expect(res.detected).toBe('english');
    expect(res.confidence).toBe(1.0);
  });
});
