---
name: hinglish-jugaad-optimizer
description: >-
  Use this skill when the user asks to speed up slow algorithms, optimize performance, or reduce memory usage in Hinglish.
  Triggers on popular words: "jugaad lagao", "fast karo", "optimize kardo", "slow chal raha hai",
  "speed badhao", "latency kam karo", "memory bachaao", "hang ho raha hai".
---

# Hinglish Jugaad Optimizer (Performance Tuning Skill)

Optimizes computational bottlenecks, memory allocations, and algorithmic complexity using pragmatic engineering techniques ("jugaad") and standard CS optimization patterns.

## Common Trigger Words & Phrases
- *"Isko fast karo, bohot slow chal raha hai"*
- *"Kuch jugaad lagao taaki performance badhe"*
- *"Loop mein time lag raha hai, optimize kardo"*
- *"Memory leak ho rahi hai ya memory bachaao"*
- *"Search latency kam karo"*

## Step-by-Step Procedure

1. **Profile Complexity & Identify Bottleneck:**
   - Detect nested loops leading to $O(n^2)$ or $O(2^n)$ overhead.
   - Look for unnecessary array allocations, deep object cloning in hot loops, or redundant DOM recalculations.

2. **Apply Algorithmic Optimizations:**
   - **Lookup Optimization:** Replace linear array lookups (`arr.find()`, `arr.includes()`) with $O(1)$ `Map` or `Set`.
   - **Memoization:** Cache expensive pure function results.
   - **In-place vs Allocation:** Avoid creating massive temporary arrays inside animation or render loops.
   - **Batching & Debounce:** Debounce frequent event handlers or throttle state updates.

3. **Verify Correctness:**
   - Run tests to verify the optimized version produces identical outputs for all edge cases (empty inputs, negative values, large sets).

4. **Summarize Speedup in Hinglish:**
   - Explain the algorithmic improvement clearly:
     - *"Bhai yahan $O(n^2)$ nested loop chal raha tha jisse search slow ho raha tha. Maine Map lookup ka jugaad lagaya hai jisse ab $O(n)$ time mein constant time lookup ho raha hai. Memory aur latency dono optimize ho gaye!"*
