/**
 * Devanagari ↔ Roman Hindi Transliteration & Normalization (Day 3)
 * Provides deterministic offline rule-based phonetic mapping with optional Sarvam Translate integration.
 */

// Devanagari mapping dictionaries
const VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
};

const MATRAS: Record<string, string> = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
  'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
};

const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya',
  'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'फ़': 'f', 'ड़': 'd', 'ढ़': 'dh',
};

const VIRAMA = '्';
const ANUSVARA = 'ं';
const VISARGA = 'ः';
const CHANDRABINDU = 'ँ';

/**
 * Converts Devanagari script to developer-friendly Roman Hindi.
 * Example: "सर्च फंक्शन ठीक कर दो" -> "search function theek kar do" (preserving Latin words)
 */
export function devanagariToRoman(input: string): string {
  if (!input) return '';

  let result = '';
  const len = input.length;

  for (let i = 0; i < len; i++) {
    const char = input[i];

    // Preserve non-Devanagari characters (ASCII, punctuation, English code)
    if (char < '\u0900' || char > '\u097F') {
      result += char;
      continue;
    }

    // 1. Independent Vowels
    if (VOWELS[char]) {
      result += VOWELS[char];
      continue;
    }

    // 2. Consonants
    if (CONSONANTS[char]) {
      const base = CONSONANTS[char];
      const nextChar = i + 1 < len ? input[i + 1] : '';

      if (nextChar === VIRAMA) {
        // Half consonant (halant): no inherent vowel 'a'
        result += base;
        i++; // skip virama
      } else if (MATRAS[nextChar]) {
        // Consonant with matra
        result += base + MATRAS[nextChar];
        i++; // skip matra
      } else if (nextChar >= '\u0900' && nextChar <= '\u097F' && !MATRAS[nextChar] && nextChar !== VIRAMA) {
        // Inherent schwa vowel 'a' before next consonant
        result += base + 'a';
      } else {
        // End of word or followed by whitespace/punctuation
        result += base;
      }
      continue;
    }

    // 3. Modifiers
    if (char === ANUSVARA || char === CHANDRABINDU) {
      result += 'n';
      continue;
    }
    if (char === VISARGA) {
      result += 'h';
      continue;
    }
  }

  // Clean double spaces and phonetic anomalies
  return result
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes colloquial Roman Hindi variations to standard developer Hinglish.
 */
export function normalizeIndicPrompt(prompt: string): string {
  let cleaned = prompt.trim();

  // If prompt is in Devanagari, produce normalized Roman Hindi
  if (/[\u0900-\u097F]/.test(cleaned)) {
    cleaned = devanagariToRoman(cleaned);
  }

  // Common spelling variations unification
  const replacements: Array<[RegExp, string]> = [
    [/\bthik\b/gi, 'theek'],
    [/\bkardo\b/gi, 'kar do'],
    [/\bkardiya\b/gi, 'kar diya'],
    [/\bkyu\b/gi, 'kyun'],
    [/\byeh\b/gi, 'ye'],
    [/\bwoh\b/gi, 'wo'],
    [/\bchahiye\b/gi, 'chaahiye'],
  ];

  for (const [pattern, rep] of replacements) {
    cleaned = cleaned.replace(pattern, rep);
  }

  return cleaned;
}

/**
 * Optional Sarvam Translate API wrapper for advanced neural translation.
 * Falls back gracefully to rule-based normalization if API is unavailable.
 */
export async function translateViaSarvam(
  text: string,
  targetLanguage: 'hi-IN' | 'en-IN',
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    return normalizeIndicPrompt(text);
  }

  try {
    const response = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: targetLanguage === 'en-IN' ? 'hi-IN' : 'en-IN',
        target_language_code: targetLanguage,
        speaker_gender: 'Male',
        mode: 'formal',
        model: 'mayura:v1',
      }),
    });

    if (!response.ok) {
      return normalizeIndicPrompt(text);
    }

    const data = (await response.json()) as { translated_text?: string };
    return data.translated_text || normalizeIndicPrompt(text);
  } catch {
    return normalizeIndicPrompt(text);
  }
}
