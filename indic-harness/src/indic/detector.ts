/**
 * Language Detector for Indic Coding Harness (Day 3)
 * Distinguishes between English, Roman Hinglish, and Devanagari Hindi.
 */

import { LanguageDetectionResult } from '../types';

// Common Hinglish developer vocabulary, verb roots, and functional particles
const HINGLISH_KEYWORDS = new Set([
  'kardo', 'karna', 'karo', 'karta', 'karte', 'karti',
  'bhai', 'yaar', 'theek', 'chal', 'chalao', 'raha', 'rahe', 'rahi',
  'hai', 'hain', 'ho', 'hoga', 'hogi', 'hoge',
  'nahi', 'mat', 'kya', 'kyun', 'kyu', 'kaise', 'kab', 'kaha',
  'aur', 'ya', 'par', 'lekin', 'magar',
  'isko', 'usko', 'ye', 'yeh', 'wo', 'woh',
  'pehle', 'baad', 'andar', 'baahar', 'upar', 'neeche',
  'mein', 'se', 'ko', 'ka', 'ki', 'ke', 'ne',
  'daalo', 'hatao', 'badlo', 'likho', 'padho', 'dekho', 'khojo', 'batao',
  'thoda', 'zyada', 'poora', 'sahi', 'galat', 'achha', 'accha',
  'aata', 'aati', 'aate', 'aagaya', 'aagaye', 'chalega', 'chalegi'
]);

export function detectLanguage(text: string): LanguageDetectionResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      detected: 'english',
      confidence: 1.0,
      hasDevanagari: false,
      hasIndicPhonetics: false,
      sampleTokens: [],
    };
  }

  // 1. Check for Devanagari Unicode characters (\u0900 - \u097F)
  const devanagariMatches = trimmed.match(/[\u0900-\u097F]/g) || [];
  const totalLetters = trimmed.replace(/[^a-zA-Z\u0900-\u097F]/g, '').length || 1;
  const devanagariRatio = devanagariMatches.length / totalLetters;

  if (devanagariMatches.length > 0 && devanagariRatio > 0.15) {
    return {
      detected: 'devanagari',
      confidence: Number(Math.min(1.0, devanagariRatio * 1.5).toFixed(2)),
      hasDevanagari: true,
      hasIndicPhonetics: false,
      sampleTokens: devanagariMatches.slice(0, 5),
    };
  }

  // 2. Tokenize Roman words and check against Hinglish corpus
  const cleanTokens = trimmed
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  if (cleanTokens.length === 0) {
    return {
      detected: 'english',
      confidence: 0.8,
      hasDevanagari: false,
      hasIndicPhonetics: false,
      sampleTokens: [],
    };
  }

  const matchedHinglishTokens = cleanTokens.filter((token) => HINGLISH_KEYWORDS.has(token));
  const hinglishRatio = matchedHinglishTokens.length / cleanTokens.length;

  // If at least 1 keyword for short queries or >= 12% keyword density
  const isHinglish =
    matchedHinglishTokens.length >= 2 ||
    (cleanTokens.length <= 4 && matchedHinglishTokens.length >= 1) ||
    hinglishRatio >= 0.12;

  if (isHinglish) {
    const confidence = Math.min(1.0, Math.max(0.65, hinglishRatio * 2.5));
    return {
      detected: 'hinglish',
      confidence: Number(confidence.toFixed(2)),
      hasDevanagari: false,
      hasIndicPhonetics: true,
      sampleTokens: Array.from(new Set(matchedHinglishTokens)).slice(0, 5),
    };
  }

  // 3. Default to English
  return {
    detected: 'english',
    confidence: Number(Math.max(0.7, 1.0 - hinglishRatio).toFixed(2)),
    hasDevanagari: false,
    hasIndicPhonetics: false,
    sampleTokens: [],
  };
}
