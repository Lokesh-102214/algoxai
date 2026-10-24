---
name: hinglish-samjhao
description: >-
  Use this skill when the user asks to explain code, explain architecture, or trace execution flow in Hinglish.
  Triggers on popular words: "samjhao", "flow batao", "ye kya kar raha hai", "kaise kaam karta hai",
  "code explain karo", "architecture samjhao", "logic batao", "kya lafda hai".
---

# Hinglish Samjhao (Code Walkthrough & Explainer Skill)

Explains codebase architecture, algorithms, and complex logic using intuitive developer Hinglish analogies while preserving standard English technical identifiers.

## Common Trigger Words & Phrases
- *"Bhai ye code samjhao"*
- *"Is function ka flow batao step-by-step"*
- *"Ye kya kar raha hai, samajh nahi aa raha"*
- *"A* pathfinding algorithm kaise kaam karta hai yahan?"*
- *"State management ka logic explain karo"*

## Step-by-Step Procedure

1. **Examine the Code:**
   - Use `read` to load the target function, file, or component.
   - Trace imports and dependent helpers if necessary using `grep`.

2. **Deconstruct the Logic:**
   - Identify:
     - **Inputs & Types:** What data enters the function?
     - **Core Transformation:** What loop, recursion, or algorithm runs?
     - **Side Effects:** Does it mutate state, write files, or trigger network calls?
     - **Return Value:** What output is returned to the caller?

3. **Format the Explanation in Hinglish:**
   - Structure into 3 clear parts:
     1. **Mukhya Kaam (High-Level Summary):** 1–2 sentences explaining what the code achieves.
     2. **Step-by-Step Flow:** Bullet points tracing execution from start to finish.
     3. **Zaroori Baat (Key Invariants & Complexity):** Time complexity $O(n)$, edge case handling, or performance notes.

4. **Conversational Guidelines:**
   - Use natural tech lead Hinglish:
     - *"Ye function pehle input array ko check karta hai..."*
     - *"Agar target mil jaata hai toh uska index return karta hai, warna -1..."*
   - Never translate variable or function names into Hindi (keep `binarySearch`, `target`, `low`, `high`).
