# Indic Coding Harness - Evaluation Scorecard

**Model:** `mock-sarvam-30b` | **Date:** 2026-10-23T16:54:54.412Z | **Tasks Evaluated:** 20 (Dual English & Hinglish)

## 1. High-Level Summary

| Metric | English Prompt | Hinglish Prompt | Delta (Hinglish Gap) |
| :--- | :--- | :--- | :--- |
| **Pass Rate** | **100%** (20/20) | **100%** (20/20) | **+0%** |
| **Avg Steps / Task** | 2.75 | 2.75 | 0.00 |
| **Avg Tool Errors** | 0 | 0 | 0.00 |
| **Avg Latency** | 6 ms | 6 ms | 0 ms |

## 2. Category Breakdown

| Category | English Pass Rate | Hinglish Pass Rate | Hinglish Gap |
| :--- | :--- | :--- | :--- |
| BUG FIX | 100% (5/5) | 100% (5/5) | +0% |
| REFACTOR | 100% (5/5) | 100% (5/5) | +0% |
| TEST WRITING | 100% (5/5) | 100% (5/5) | +0% |
| REPO QA | 100% (5/5) | 100% (5/5) | +0% |

## 3. Individual Task Outcomes

| Task ID | Title | Category | English | Hinglish | Feedback |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `bug_01` | Fix Off-by-One Loop Boundary | bug_fix | ✅ Pass | ✅ Pass | Completed successfully |
| `bug_02` | Fix Null Pointer in User Profile | bug_fix | ✅ Pass | ✅ Pass | Completed successfully |
| `bug_03` | Add Missing Await to Async Fetch | bug_fix | ✅ Pass | ✅ Pass | Completed successfully |
| `bug_04` | Inverted Boolean in Auth Guard | bug_fix | ✅ Pass | ✅ Pass | Completed successfully |
| `bug_05` | Prevent In-Place State Mutation | bug_fix | ✅ Pass | ✅ Pass | Completed successfully |
| `ref_01` | Extract Math Calculation Helper | refactor | ✅ Pass | ✅ Pass | Completed successfully |
| `ref_02` | Convert Callback to Async/Await | refactor | ✅ Pass | ✅ Pass | Completed successfully |
| `ref_03` | Optimize O(n^2) Lookup to O(n) Map | refactor | ✅ Pass | ✅ Pass | Completed successfully |
| `ref_04` | Extract Service Layer from Controller | refactor | ✅ Pass | ✅ Pass | Completed successfully |
| `ref_05` | Remove Dead Code & Unused Imports | refactor | ✅ Pass | ✅ Pass | Completed successfully |
| `test_01` | Unit Tests for Negative & Zero Inputs | test_writing | ✅ Pass | ✅ Pass | Completed successfully |
| `test_02` | Boundary Tests for Empty Array | test_writing | ✅ Pass | ✅ Pass | Completed successfully |
| `test_03` | Test Error Throwing on Invalid Type | test_writing | ✅ Pass | ✅ Pass | Completed successfully |
| `test_04` | Async Retry Handler Tests | test_writing | ✅ Pass | ✅ Pass | Completed successfully |
| `test_05` | Tree Structure Snapshot Test | test_writing | ✅ Pass | ✅ Pass | Completed successfully |
| `qa_01` | Explain Auth Guard Architecture | repo_qa | ✅ Pass | ✅ Pass | Completed successfully |
| `qa_02` | Identify Sorting Time Complexity | repo_qa | ✅ Pass | ✅ Pass | Completed successfully |
| `qa_03` | Locate Pathfinding Heuristic | repo_qa | ✅ Pass | ✅ Pass | Completed successfully |
| `qa_04` | Summarize 3D Scene Controls | repo_qa | ✅ Pass | ✅ Pass | Completed successfully |
| `qa_05` | Analyze Edge Case in Hanoi Engine | repo_qa | ✅ Pass | ✅ Pass | Completed successfully |
