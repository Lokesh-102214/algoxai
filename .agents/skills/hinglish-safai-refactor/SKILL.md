---
name: hinglish-safai-refactor
description: >-
  Use this skill when the user asks to clean up code, refactor duplicate logic, remove dead code, or improve readability in Hinglish.
  Triggers on popular words: "safai karo", "clean karo", "refactor kardo", "dead code hatao",
  "duplicate logic nikalo", "clean code banao", "code chamkao", "simplify karo".
---

# Hinglish Safai & Refactor (Clean Code Skill)

Performs clean-up, refactoring, dead code elimination, and helper extraction without introducing regressions or breaking existing behaviors.

## Common Trigger Words & Phrases
- *"Code ki safai karo"*
- *"Is module ko refactor kardo, bohot messy hai"*
- *"Dead code aur unused imports hatao"*
- *"Duplicate logic extract karke ek helper bana do"*
- *"Code ko thoda clean aur readable banao"*

## Step-by-Step Procedure

1. **Audit the File:**
   - Use `read` to inspect the target file.
   - Identify:
     - Unused imports or variables.
     - Redundant console logs or commented-out blocks.
     - Repetitive calculations that violate DRY (Don't Repeat Yourself).
     - Overly nested conditionals that can use early returns / guard clauses.

2. **Extract & Simplify:**
   - Extract repeated blocks into pure, exported helper functions.
   - Convert deep callback pyramids to modern `async/await`.
   - Apply guard clauses to reduce nesting depth.

3. **Verify Zero Regressions:**
   - Execute existing tests via `bash` (`npm test` or `npm run harness:test`) to confirm that behavior is 100% identical.
   - Run type checks (`npm run typecheck` or `npx tsc --noEmit`).

4. **Summarize in Hinglish:**
   - List the exact cleanup actions taken:
     - *"Bhai code ki safai poori ho gayi: 3 unused imports hata diye, repeated distance calculation ko calculateDistance helper mein extract kar diya, aur early return guard clauses add kar diye. Saare tests green hain!"*
