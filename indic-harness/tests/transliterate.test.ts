import { describe, it, expect } from 'vitest';
import { devanagariToRoman, normalizeIndicPrompt } from '../src/indic/transliterate';

describe('Devanagari Transliteration & Normalization (Day 3)', () => {
  it('transliterates Devanagari words to readable Roman Hindi', () => {
    const devanagari = 'नमस्ते दुनिया';
    const roman = devanagariToRoman(devanagari);
    expect(roman.toLowerCase()).toContain('namaste');
  });

  it('preserves embedded English words and file paths in Devanagari sentences', () => {
    const input = 'src/search.ts में लूप को ठीक कर दो';
    const roman = devanagariToRoman(input);
    expect(roman).toContain('src/search.ts');
    expect(roman.toLowerCase()).toContain('theek');
  });

  it('normalizes colloquial Roman Hindi variations', () => {
    const input = 'bhai yeh bug thik kardo kyu ho raha hai';
    const normalized = normalizeIndicPrompt(input);
    expect(normalized).toContain('ye');
    expect(normalized).toContain('theek');
    expect(normalized).toContain('kar do');
    expect(normalized).toContain('kyun');
  });
});
