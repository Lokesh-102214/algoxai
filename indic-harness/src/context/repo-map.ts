/**
 * Repo Map: Compact Codebase Symbol Indexer (Day 4)
 * Extracts exported functions, classes, interfaces, and types to give the model
 * upfront structural awareness without needing blind grep iterations.
 */

import * as fs from 'fs';
import * as path from 'path';
import { FileSymbolIndex, RepoSymbol } from '../types';

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo', '.system_generated'
]);

const SUPPORTED_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.py']);

/**
 * Extracts declared and exported symbols from file source code using regex patterns.
 */
export function extractSymbolsFromSource(content: string): RepoSymbol[] {
  const symbols: RepoSymbol[] = [];
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) continue;

    // 1. Exported or declared functions
    const fnMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)/);
    if (fnMatch) {
      symbols.push({ name: fnMatch[1], kind: 'function', line: i + 1 });
      continue;
    }

    // 2. Exported or declared classes
    const classMatch = line.match(/(?:export\s+)?(?:abstract\s+)?class\s+([a-zA-Z0-9_]+)/);
    if (classMatch) {
      symbols.push({ name: classMatch[1], kind: 'class', line: i + 1 });
      continue;
    }

    // 3. Exported or declared interfaces
    const ifaceMatch = line.match(/(?:export\s+)?interface\s+([a-zA-Z0-9_]+)/);
    if (ifaceMatch) {
      symbols.push({ name: ifaceMatch[1], kind: 'interface', line: i + 1 });
      continue;
    }

    // 4. Exported types
    const typeMatch = line.match(/(?:export\s+)?type\s+([a-zA-Z0-9_]+)\s*=/);
    if (typeMatch) {
      symbols.push({ name: typeMatch[1], kind: 'type', line: i + 1 });
      continue;
    }

    // 5. Exported const / let arrow functions or constants
    const constFnMatch = line.match(/export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/);
    if (constFnMatch) {
      symbols.push({ name: constFnMatch[1], kind: 'function', line: i + 1 });
      continue;
    }

    // 6. Python def / class
    const pyMatch = line.match(/^(?:def|class)\s+([a-zA-Z0-9_]+)/);
    if (pyMatch) {
      symbols.push({
        name: pyMatch[1],
        kind: line.startsWith('class') ? 'class' : 'function',
        line: i + 1,
      });
      continue;
    }
  }

  return symbols;
}

/**
 * Recursively scans directory and builds symbol map for the repository.
 */
export function buildRepoMap(
  workspaceRoot: string,
  maxFiles = 60,
  maxSymbolsPerFile = 8
): { index: FileSymbolIndex[]; formattedText: string } {
  const index: FileSymbolIndex[] = [];

  function walk(currentDir: string): void {
    if (index.length >= maxFiles) return;

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (index.length >= maxFiles) break;

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (SUPPORTED_EXTS.has(ext) && !entry.name.endsWith('.d.ts')) {
          try {
            const relPath = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');
            const content = fs.readFileSync(fullPath, 'utf-8');
            const symbols = extractSymbolsFromSource(content).slice(0, maxSymbolsPerFile);

            if (symbols.length > 0) {
              index.push({ path: relPath, symbols });
            }
          } catch {
            // Skip unreadable files
          }
        }
      }
    }
  }

  walk(workspaceRoot);

  // Format into a compact string for LLM context injection
  const lines: string[] = ['<repo_map>'];
  for (const item of index) {
    const symbolStr = item.symbols.map((s) => `${s.kind === 'function' ? 'fn' : s.kind} ${s.name}`).join(', ');
    lines.push(`  ${item.path}: ${symbolStr}`);
  }
  lines.push('</repo_map>');

  return {
    index,
    formattedText: lines.join('\n'),
  };
}
