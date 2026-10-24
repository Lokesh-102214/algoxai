---
name: hinglish-chalao-jaanch
description: >-
  Use this skill when the user asks to run tests, verify changes, or check if the build passes in Hinglish.
  Triggers on popular words: "tests chalao", "chalao aur dekho", "jaanch karo", "verify karo",
  "check karo", "sab theek hai?", "build pass ho raha hai?", "chalake dikhao".
---

# Hinglish Chalao & Jaanch (Test & Verification Skill)

Runs the project test suite, analyzes failures, and confirms that build and unit tests pass cleanly.

## Common Trigger Words & Phrases
- *"Tests chalao aur dekho sab theek hai ya nahi"*
- *"Check karo build pass ho raha hai?"*
- *"Code ko verify karo aur jaanch lo"*
- *"Chalake dikhao ek baar"*
- *"Sab tests green hain kya?"*

## Step-by-Step Procedure

1. **Identify the Project Test Runner:**
   - Check `package.json` for scripts (`test`, `harness:test`, `typecheck`).
   - Run the appropriate test command via `bash`:
     - `npm run harness:test` (for harness tests)
     - `npm test` or `npx vitest run` (for project unit tests)
     - `npm run typecheck` (for TypeScript verification)

2. **Analyze Test Output:**
   - **All Pass:** Confirm total test files and assertions passed.
   - **Failures:** Extract the failing file, line number, expected vs received values, and stack trace.

3. **Auto-Diagnose Failures:**
   - If tests fail, do NOT leave the codebase broken.
   - Immediately invoke the `hinglish-theek-kardo` workflow to repair the broken assertion.
   - Re-run the tests until 100% green.

4. **Report Status in Hinglish:**
   - Provide a clear, confidence-inspiring summary:
     - *"Bhai jaanch complete ho gayi! Saare 49 tests pass ho gaye hain (100% pass rate). TypeScript compiler check bhi bilkul clean hai. Sab badhiya chal raha hai!"*
