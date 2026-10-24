---
name: hinglish-theek-kardo
description: >-
  Use this skill when the user asks to fix bugs, solve errors, or repair failing code in Hinglish.
  Triggers on popular words: "theek kardo", "fix karo", "error aa raha hai", "crash ho raha hai",
  "fat gaya", "chal nahi raha", "lafda ho gaya", "bug solve karo", "issue fix karo".
---

# Hinglish Theek Kardo (Bug Fixer Skill)

Guides the agent through diagnosing, repairing, and verifying software bugs when requested via colloquial Hinglish prompts.

## Common Trigger Words & Phrases
- *"Bhai ye error theek kardo"*
- *"Code fat gaya, crash ho raha hai"*
- *"Search function chal nahi raha"*
- *"Tests fail ho rahe hain, fix karo"*
- *"Null check ka lafda hai, theek kardo"*

## Step-by-Step Procedure

1. **Locate & Read the Offending Code:**
   - Check the stack trace or user description for filename and line number.
   - Use `read` to inspect the target file and 10–20 surrounding lines. Do not guess the file contents.

2. **Diagnose the Root Cause:**
   - Look for standard failure modes:
     - Off-by-one loop boundaries (`<` vs `<=`, `length - 1`).
     - Null / undefined property accesses (missing optional chaining `?.`).
     - Async functions returning unawaited promises.
     - Inverted boolean conditions or comparison operator typos.
     - In-place state or array mutation.

3. **Apply Fail-Safe Edits:**
   - Use `edit` with exact string replacement.
   - Include 1–2 surrounding lines in `old_string` to guarantee uniqueness.

4. **Verify via Tests:**
   - Run the test suite using `bash` (e.g. `npm test` or `npm run harness:test`).
   - If tests fail, inspect the new failure message and self-correct.

5. **Explain the Solution in Hinglish:**
   - Keep code identifiers and variable names in strict English.
   - Explain the root cause and fix in natural developer Hinglish:
     - *"Bhai problem ye thi ki loop last element check nahi kar raha tha (off-by-one). Maine boundary condition update kar di hai aur saare tests pass ho rahe hain."*
