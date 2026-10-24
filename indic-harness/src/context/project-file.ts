/**
 * Project Instructions File Discovery (Day 4)
 * Loads BHARAT.md, AGENTS.md, or CLAUDE.md from the workspace root on startup.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ProjectFileResult {
  found: boolean;
  filename?: string;
  filePath?: string;
  content?: string;
}

const CANDIDATE_FILENAMES = ['BHARAT.md', 'AGENTS.md', 'CLAUDE.md'];

/**
 * Searches the workspace root for custom project instruction files.
 */
export function loadProjectInstructions(workspaceRoot: string): ProjectFileResult {
  for (const name of CANDIDATE_FILENAMES) {
    const candidatePath = path.join(workspaceRoot, name);
    if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
      try {
        const rawContent = fs.readFileSync(candidatePath, 'utf-8');
        // Truncate to first 250 lines if file is overly large
        const lines = rawContent.split(/\r?\n/);
        const truncatedContent = lines.slice(0, 250).join('\n');

        return {
          found: true,
          filename: name,
          filePath: candidatePath,
          content: truncatedContent,
        };
      } catch {
        // Fall through to next candidate
      }
    }
  }

  return { found: false };
}

/**
 * Generates an initial BHARAT.md template for an Indic-first development workflow.
 */
export function scaffoldBharatMd(workspaceRoot: string): string {
  const template = `# BHARAT.md - Project Agent Guidelines

## 🇮🇳 Project Overview
This project uses the Indic Coding Harness with Sarvam AI.
Engineers interact in conversational developer Hinglish or English; code identifiers, types, and git commits must remain standard English.

## 🛠️ Build & Test Commands
- **Test:** \`npm test\` or \`npm run harness:test\`
- **Typecheck:** \`npm run typecheck\`
- **Build:** \`npm run build\`

## 🔒 Code Standards & Invariants
1. Do not mutate state in-place.
2. Keep edits localized and minimal.
3. Always verify changes by running unit tests.
`;

  const targetPath = path.join(workspaceRoot, 'BHARAT.md');
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, template, 'utf-8');
  }
  return targetPath;
}
