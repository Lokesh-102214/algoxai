/**
 * Indic Coding Harness - Configuration Manager
 */

import * as fs from 'fs';
import * as path from 'path';

export interface HarnessConfig {
  sarvamApiKey?: string;
  sarvamBaseUrl: string;
  sarvamModel: string;
  openaiApiKey?: string;
  openaiBaseUrl: string;
  openaiModel: string;
  defaultProvider: 'sarvam' | 'openai' | 'mock';
  workspaceRoot: string;
  maxSteps: number;
  verbose: boolean;
  language: 'hinglish' | 'english' | 'hindi';
}

/**
 * Loads .env file if present in workspace root or current directory
 */
export function loadEnvFiles(startDir: string = process.cwd()): void {
  const possiblePaths = [
    path.join(startDir, '.env'),
    path.join(startDir, '..', '.env'),
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {
        // Ignore file read error
      }
    }
  }
}

export function getConfig(): HarnessConfig {
  loadEnvFiles();

  return {
    sarvamApiKey: process.env.SARVAM_API_KEY || process.env.SARVAM_SUBSCRIPTION_KEY || '',
    sarvamBaseUrl: process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai/v1',
    sarvamModel: process.env.SARVAM_MODEL || 'sarvam-30b',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    openaiModel: process.env.OPENAI_MODEL || 'qwen-2.5-coder-32b',
    defaultProvider: (process.env.HARNESS_PROVIDER as 'sarvam' | 'openai' | 'mock') || 'sarvam',
    workspaceRoot: process.env.HARNESS_WORKSPACE || process.cwd(),
    maxSteps: Number(process.env.HARNESS_MAX_STEPS) || 25,
    verbose: process.env.HARNESS_VERBOSE === 'true',
    language: (process.env.HARNESS_LANG as 'hinglish' | 'english' | 'hindi') || 'hinglish',
  };
}
