---
name: hinglish-yojana-planner
description: >-
  Use this skill when the user asks to plan a feature, formulate steps, or design an architecture before coding in Hinglish.
  Triggers on popular words: "yojana banao", "plan karo", "pehle socho", "steps batao",
  "roadmap banao", "architecture design karo", "kaise implement karein".
---

# Hinglish Yojana Planner (Strategic Planning Skill)

Explores the codebase in read-only mode and formulates a disciplined, step-by-step implementation plan before modifying any files.

## Common Trigger Words & Phrases
- *"Bhai pehle yojana banao, seedha code mat likho"*
- *"Is feature ka implementation plan batao"*
- *"Pehle socho kaise karna hai aur steps list karo"*
- *"Architecture plan kya hoga is task ke liye?"*
- *"Kaise karein isko step-by-step?"*

## Step-by-Step Procedure

1. **Enable Plan Mode:**
   - Keep operations strictly read-only (`read`, `grep`, `glob`, `todo`).
   - Do NOT run `write` or `edit` until the plan is approved.

2. **Explore the Codebase:**
   - Use `glob` to locate affected modules.
   - Use `grep` to find existing interfaces, models, and shared utilities.
   - Inspect existing tests to understand expected behavior.

3. **Formulate the Step-by-Step Yojana:**
   - Create an ordered task list using the `todo` tool (`action: "add"`).
   - Divide into discrete phases:
     1. Interface & type definitions.
     2. Core logic implementation.
     3. Integration & error handling.
     4. Unit test coverage.

4. **Present Plan & Seek Approval:**
   - Present the checklist to the user in Hinglish:
     - *"Bhai maine codebase dekh liya hai. Ye rahi hamari implementation yojana:*
       *1. [ ] types.ts mein naye interfaces define karna.*
       *2. [ ] core function implement karna.*
       *3. [ ] unit tests likhna aur verify karna.*
       *Agar plan sahi lage toh batao ya /karo bolo, fir main execution start karta hoon."*
