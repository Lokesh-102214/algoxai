import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ReadTool } from '../src/tools/read';
import { WriteTool } from '../src/tools/write';
import { EditTool } from '../src/tools/edit';
import { BashTool } from '../src/tools/bash';
import { GrepTool } from '../src/tools/grep';
import { GlobTool } from '../src/tools/glob';
import { TodoTool } from '../src/tools/todo';
import { ExecutionContext } from '../src/tools/base';

describe('Minimal Toolset (Claude Code Style)', () => {
  let tempDir: string;
  let context: ExecutionContext;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness_tool_test_'));
    context = { workspaceRoot: tempDir, toolCallId: 'test_call_1' };
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  describe('read Tool', () => {
    const readTool = new ReadTool();

    it('reads an existing file with line numbers', async () => {
      const filePath = path.join(tempDir, 'sample.txt');
      fs.writeFileSync(filePath, 'Line One\nLine Two\nLine Three\n');

      const res = await readTool.execute({ path: 'sample.txt' }, context);
      expect(res.is_error).toBe(false);
      expect(res.content).toContain('1: Line One');
      expect(res.content).toContain('2: Line Two');
      expect(res.content).toContain('3: Line Three');
    });

    it('supports start_line and line_count pagination', async () => {
      const filePath = path.join(tempDir, 'numbers.txt');
      fs.writeFileSync(filePath, '10\n20\n30\n40\n50\n');

      const res = await readTool.execute({ path: 'numbers.txt', start_line: 2, line_count: 2 }, context);
      expect(res.is_error).toBe(false);
      expect(res.content).toContain('2: 20');
      expect(res.content).toContain('3: 30');
      expect(res.content).not.toContain('1: 10');
      expect(res.content).not.toContain('4: 40');
    });

    it('returns error for non-existent file', async () => {
      const res = await readTool.execute({ path: 'ghost.txt' }, context);
      expect(res.is_error).toBe(true);
      expect(res.content).toContain('File does not exist');
    });

    it('blocks directory escape', async () => {
      const res = await readTool.execute({ path: '../../etc/passwd' }, context);
      expect(res.is_error).toBe(true);
      expect(res.content).toContain('outside workspace');
    });
  });

  describe('write Tool', () => {
    const writeTool = new WriteTool();

    it('creates nested directories and writes content', async () => {
      const res = await writeTool.execute(
        { path: 'nested/dir/app.ts', content: 'console.log("hello world");' },
        context
      );
      expect(res.is_error).toBe(false);

      const written = fs.readFileSync(path.join(tempDir, 'nested/dir/app.ts'), 'utf-8');
      expect(written).toBe('console.log("hello world");');
    });

    it('fails when path is empty', async () => {
      const res = await writeTool.execute({ path: '', content: 'data' }, context);
      expect(res.is_error).toBe(true);
    });
  });

  describe('edit Tool (Fail-safe exact-string replacement)', () => {
    const editTool = new EditTool();

    it('replaces a uniquely matching string', async () => {
      const filePath = path.join(tempDir, 'calc.ts');
      fs.writeFileSync(filePath, 'function add(a, b) {\n  return a - b; // bug\n}\n');

      const res = await editTool.execute(
        {
          path: 'calc.ts',
          old_string: '  return a - b; // bug',
          new_string: '  return a + b; // fixed',
        },
        context
      );

      expect(res.is_error).toBe(false);
      const updated = fs.readFileSync(filePath, 'utf-8');
      expect(updated).toContain('return a + b; // fixed');
    });

    it('fails safely if old_string is not found', async () => {
      const filePath = path.join(tempDir, 'sample.ts');
      fs.writeFileSync(filePath, 'const x = 10;\n');

      const res = await editTool.execute(
        {
          path: 'sample.ts',
          old_string: 'const y = 20;',
          new_string: 'const y = 30;',
        },
        context
      );

      expect(res.is_error).toBe(true);
      expect(res.content).toContain('was not found in');
    });

    it('fails safely if old_string matches more than once without replace_all', async () => {
      const filePath = path.join(tempDir, 'multi.ts');
      fs.writeFileSync(filePath, 'const a = 1;\nconst a = 1;\n');

      const res = await editTool.execute(
        {
          path: 'multi.ts',
          old_string: 'const a = 1;',
          new_string: 'const a = 2;',
        },
        context
      );

      expect(res.is_error).toBe(true);
      expect(res.content).toContain('matches 2 occurrences');
      expect(res.content).toContain('surrounding context lines');
    });

    it('allows multi-occurrence replacement when replace_all is true', async () => {
      const filePath = path.join(tempDir, 'multi.ts');
      fs.writeFileSync(filePath, 'foo\nbar\nfoo\n');

      const res = await editTool.execute(
        {
          path: 'multi.ts',
          old_string: 'foo',
          new_string: 'baz',
          replace_all: true,
        },
        context
      );

      expect(res.is_error).toBe(false);
      const updated = fs.readFileSync(filePath, 'utf-8');
      expect(updated).toBe('baz\nbar\nbaz\n');
    });
  });

  describe('bash Tool (Security & Blocklist)', () => {
    const bashTool = new BashTool();

    it('executes a safe command and returns stdout', async () => {
      const res = await bashTool.execute({ command: 'node -e "console.log(12345)"' }, context);
      expect(res.is_error).toBe(false);
      expect(res.content).toContain('12345');
    });

    it('blocks dangerous rm -rf commands', async () => {
      const res = await bashTool.execute({ command: 'rm -rf /' }, context);
      expect(res.is_error).toBe(true);
      expect(res.content).toContain('Security violation');
    });

    it('blocks fork bombs and mkfs', async () => {
      const res1 = await bashTool.execute({ command: ':(){ :|:& };:' }, context);
      expect(res1.is_error).toBe(true);

      const res2 = await bashTool.execute({ command: 'mkfs.ext4 /dev/sda1' }, context);
      expect(res2.is_error).toBe(true);
    });
  });

  describe('grep Tool', () => {
    const grepTool = new GrepTool();

    it('finds pattern matches with line numbers and file names', async () => {
      fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'hello world\nalpha beta\n');
      fs.writeFileSync(path.join(tempDir, 'file2.txt'), 'another hello\n');

      const res = await grepTool.execute({ pattern: 'hello' }, context);
      expect(res.is_error).toBe(false);
      expect(res.content).toContain('file1.txt:1: hello world');
      expect(res.content).toContain('file2.txt:1: another hello');
    });

    it('reports no matches cleanly', async () => {
      fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'just text\n');
      const res = await grepTool.execute({ pattern: 'unicorn' }, context);
      expect(res.is_error).toBe(false);
      expect(res.content).toContain('No matches found');
    });
  });

  describe('glob Tool', () => {
    const globTool = new GlobTool();

    it('finds matching files by extension pattern', async () => {
      fs.writeFileSync(path.join(tempDir, 'test1.ts'), '// test');
      fs.writeFileSync(path.join(tempDir, 'test2.ts'), '// test');
      fs.writeFileSync(path.join(tempDir, 'notes.md'), '# notes');

      const res = await globTool.execute({ pattern: '*.ts' }, context);
      expect(res.is_error).toBe(false);
      expect(res.content).toContain('test1.ts');
      expect(res.content).toContain('test2.ts');
      expect(res.content).not.toContain('notes.md');
    });
  });

  describe('todo Tool', () => {
    const todoTool = new TodoTool();

    it('tracks task checklist across actions', async () => {
      await todoTool.execute({ action: 'add', task: 'Implement edit tool' }, context);
      await todoTool.execute({ action: 'add', task: 'Write unit tests' }, context);

      let listRes = await todoTool.execute({ action: 'list' }, context);
      expect(listRes.content).toContain('#1: Implement edit tool (pending)');
      expect(listRes.content).toContain('#2: Write unit tests (pending)');

      await todoTool.execute({ action: 'complete', task_id: 1 }, context);
      listRes = await todoTool.execute({ action: 'list' }, context);
      expect(listRes.content).toContain('#1: Implement edit tool (completed)');

      await todoTool.execute({ action: 'clear' }, context);
      listRes = await todoTool.execute({ action: 'list' }, context);
      expect(listRes.content).toContain('empty');
    });
  });
});
