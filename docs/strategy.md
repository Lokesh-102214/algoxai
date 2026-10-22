<div align="center">

<img src="file:///C:/Users/Lalit/OneDrive/Desktop/Projects/algoxai/gemini-svg.svg" width="80" />

# AlgoXAI — Strategic Product Reframe
### *From Algorithm Visualizer Demo → Essential Developer Infrastructure*

**Document type:** Open-source product strategy & market positioning  
**Target audience:** Contributors, maintainers, potential adopters, and organisations  
**Version:** 1.0 — October 2026

</div>

---

> [!IMPORTANT]
> This document reframes AlgoXAI from a niche educational toy into a **broadly adoptable open-source tool** that solves real, daily problems for individual developers, engineering teams, and organisations. It is intended to guide the project's roadmap, README messaging, and contribution priorities.

---

## Table of Contents

1. [The Problem with Where We Are Today](#1-the-problem-with-where-we-are-today)
2. [Who Suffers — Audience Segments & Pain Points](#2-who-suffers--audience-segments--pain-points)
3. [The Competitive Landscape & Gaps](#3-the-competitive-landscape--gaps)
4. [The Reframe: AlgoXAI as Developer Infrastructure](#4-the-reframe-algoxai-as-developer-infrastructure)
5. [Six Core Use Cases for the General Market](#5-six-core-use-cases-for-the-general-market)
6. [The Engine-First Architecture Advantage](#6-the-engine-first-architecture-advantage)
7. [Positioning Statement & Taglines](#7-positioning-statement--taglines)
8. [Revised README Narrative](#8-revised-readme-narrative)
9. [Roadmap to Broaden Adoption](#9-roadmap-to-broaden-adoption)
10. [Contribution Priorities](#10-contribution-priorities)
11. [Success Metrics](#11-success-metrics)

---

## 1. The Problem with Where We Are Today

### The Current State

AlgoXAI today is a polished React application with a capable architecture: a clean dark UI, 3D visualizers backed by pure TypeScript algorithm engines, a dual ESM/UMD library build, 32 passing tests, and a GitHub CI/CD pipeline. Technically, the project is in good health.

But there is a positioning problem.

The current README describes AlgoXAI as:

> *"Interactive 3D algorithm visualizers backed by pure, tested engines you can reuse in your own tools."*

This is accurate — but it is also a description that applies to a dozen existing tools. It does not answer the question every developer and engineering manager asks before adopting anything: **"What real problem does this solve for me, today?"**

A tool that is useful only during exam revision or interview cramming is discarded the moment a developer gets hired. A tool genuinely useful at work, in code reviews, during onboarding, in technical talks, and in documentation gets embedded into team workflows and survives for years.

### The Root Diagnosis

| Symptom | Root Cause |
|---|---|
| Low adoption beyond students | Framed as education-only, not developer infrastructure |
| Not embedded in any workflow | No clear integration story with real dev tools |
| Hard to contribute to | No problem domain, only a feature list |
| Unclear value for organisations | No enterprise or team narrative |
| Competing with VisuAlgo, USFCA | Fighting on the wrong axis (breadth of animations) |

---

## 2. Who Suffers — Audience Segments & Pain Points

Understanding *who* is in pain and *why* is the prerequisite to building something people actually use.

### 2.1 The Junior Developer (0–2 years)

**Daily reality:** Reads code in a language they understand syntactically but doesn't yet have a mental model for *what the data is doing while the code runs.* Spends hours re-reading the same algorithm blog post, unable to connect the text description to the actual state changes.

**Specific pains:**
- "I read about BFS/DFS a hundred times. I still can't debug why my graph traversal is wrong."
- "I don't know when to use a BST vs a hash map — they look the same in code."
- "My senior shows me a whiteboard diagram once. I can never replay it."

**What AlgoXAI can be:** The tool they open alongside their IDE when they are stuck — not a study companion, but a debugging aid and mental model builder.

---

### 2.2 The Senior Developer / Tech Lead

**Daily reality:** Spends 15–20 hours per week explaining the same architectural concepts to junior members of the team. Draws the same diagrams in Miro or on a whiteboard. Those diagrams disappear after the meeting. The knowledge transfer fails to stick.

**Specific pains:**
- "I explain the same sorting/tree concepts repeatedly. I need a shareable, interactive version."
- "During code review I write five paragraphs explaining why a recursive solution creates a particular call stack. A visualizer would replace all of that."
- "We have a new engineer every month. I'm the onboarding department."

**What AlgoXAI can be:** The **shareable, interactive reference** that replaces ephemeral whiteboard diagrams. A link instead of a paragraph.

---

### 2.3 The Engineering Manager / CTO

**Daily reality:** Responsible for team velocity, onboarding speed, and technical quality. Watches senior engineers get buried in mentorship instead of shipping features. Pays for Confluence, Notion, and Miro — and none of them actually transfer algorithmic knowledge effectively.

**Specific pains:**
- "Onboarding a new backend engineer takes 6–8 weeks before they can touch core data structures without supervision."
- "We buy LeetCode team licenses for interview prep, not for team education."
- "We have no way to make algorithm concepts part of our living documentation."

**What AlgoXAI can be:** A **self-hosted, embeddable knowledge base** for engineering teams. Deployable in 5 minutes, embeddable in any internal docs site.

---

### 2.4 The Computer Science Educator / Bootcamp Instructor

**Daily reality:** Teaches 20–100 students at once. Existing tools are either proprietary (VisuAlgo), unmaintained, or require students to install desktop software. Interactive content has to be rebuilt for every cohort because tools break.

**Specific pains:**
- "VisuAlgo is great but I can't customise it, host it, or embed it in my own LMS."
- "Algorithm Visualizer lets me write code but the UX is too complex for beginners."
- "My students need something that works on their phone during lecture."

**What AlgoXAI can be:** The **open-source, self-hostable, embeddable** alternative to proprietary edu-tools — with a library API that educators can extend.

---

### 2.5 The OSS Library / Framework Maintainer

**Daily reality:** Publishes a data-structure-heavy library (a graph engine, a state machine library, a scheduler). Documentation is all prose and code examples. Users constantly open issues saying they don't understand the algorithm behind the library.

**Specific pains:**
- "My README has 2,000 words explaining how the topological sort works. Nobody reads it."
- "I want a visual 'explainer' in my docs but I'd have to build one from scratch."
- "Users open issues that are really just 'I don't understand your algorithm.' I need a visual FAQ."

**What AlgoXAI can be:** The **documentation layer** for algorithm-heavy libraries. Drop in a `<BSTVisualizer />` or embed a live trace into any docs site.

---

### 2.6 The Interview Candidate / Self-Taught Developer

**Daily reality:** Preparing for FAANG-style technical interviews. Uses LeetCode, NeetCode, and YouTube. Understands the final answer but cannot internalise the *why* — the step-by-step execution decision that makes an algorithm correct.

**Specific pains:**
- "I can copy a BFS solution but I fail when the interviewer asks me to modify it."
- "I need to *see* the algorithm running on my specific example, not a hardcoded demo."
- "Every visualizer I find only supports preset inputs."

**What AlgoXAI can be:** The tool where you paste *your* array or *your* graph and watch the algorithm solve *your* problem — building a generalisable mental model, not just memorising a pattern.

---

## 3. The Competitive Landscape & Gaps

### Existing Tools & Why They Fall Short

| Tool | Strength | Critical Gaps |
|---|---|---|
| **VisuAlgo** | Beautiful 2D animations, comprehensive coverage | Proprietary, no embedding, no custom code, no library API, desktop-only UX |
| **Algorithm Visualizer** | Code → visual execution | Steep learning curve, no 3D, no React component library, unmaintained |
| **USFCA Visualizations** | Clean academic demos | No API, no customisation, no embedding, 2D only |
| **LeetCode** | Practice platform | Not a visualizer — shows solutions, not execution |
| **Excalidraw / Miro** | Collaborative diagramming | Not interactive, not algorithm-aware, not reusable |
| **D3.js** | Maximum flexibility | Requires deep expertise, weeks of custom implementation per algorithm |

### Where AlgoXAI Wins — The Gaps Nobody Else Fills

```
         ┌──────────────────────────────────────────────────────────────┐
         │                  THE UNCONTESTED SPACE                       │
         │                                                              │
         │   Open Source  +  React Library API  +  3D Spatial         │
         │   +  Embeddable  +  TypeScript-first  +  Tested Engines     │
         │                                                              │
         │   → AlgoXAI is the ONLY tool that hits all six             │
         └──────────────────────────────────────────────────────────────┘
```

No existing tool is simultaneously:
1. **Open source** (fork, self-host, modify)
2. **A reusable React component library** (drop into any app)
3. **3D-capable** (spatial understanding for trees, graphs, recursion)
4. **Embeddable** (works in docs, wikis, internal portals)
5. **Backed by pure, tested algorithm engines** (use the logic without the UI)
6. **TypeScript-first** (type-safe, IDE-friendly, enterprise-grade)

---

## 4. The Reframe: AlgoXAI as Developer Infrastructure

### Old Frame (current): Educational Demo

```
AlgoXAI = "A website where you can watch algorithms animate"
Users = Students, interview preppers
Use frequency = A few times before an interview, then forgotten
Integration = None — it is a separate tab
Value = Entertainment / review aid
```

### New Frame: Developer Infrastructure

```
AlgoXAI = "An open-source engine + component library for making 
           algorithms observable, teachable, and embeddable"
Users = Developers, tech leads, educators, OSS maintainers, engineering orgs
Use frequency = Weekly — during onboarding, code review, documentation, debugging
Integration = Embedded in your docs site, internal wiki, or React app
Value = Accelerates onboarding, replaces 1,000-word explanations, reduces 
        senior-engineer mentorship tax
```

### The Analogy

> **Chart.js didn't just make charts pretty. It made data *observable* in any web app without rebuilding a charting engine from scratch.** AlgoXAI does the same for algorithms — makes them *observable, inspectable, and teachable* in any context without reinventing the visualisation layer.

---

## 5. Six Core Use Cases for the General Market

### Use Case 1: Engineering Team Onboarding Accelerator

**The problem:** New hires spend weeks building mental models for the data structures underlying a codebase. Senior engineers spend disproportionate time on whiteboard explanations.

**AlgoXAI's role:**  
Deploy AlgoXAI's visualizers into your team's internal documentation (Notion, Confluence, custom docs site). A new hire reading about the graph-based dependency resolver in your build system can click a live BST or BFS demo embedded directly in the doc — not a static diagram, a *running simulation*.

**How it works today:**
```bash
# Self-host in 5 minutes
git clone https://github.com/Lokesh-102214/algoxai.git
npm install && npm run build
# Deploy dist/ to any static host, Netlify, Vercel, or internal server
```

**Future (roadmap):** An `<AlgoXAI>` web component that works in any docs site without a React dependency.

---

### Use Case 2: Living Algorithm Documentation for OSS Libraries

**The problem:** Library maintainers write thousands of words explaining non-obvious algorithmic behaviour. Users still open issues saying "I don't understand how X works."

**AlgoXAI's role:**  
Import the algorithm engines directly. A library author writing docs for a custom topological sort can import `bfs()` or `bstInsertSteps()`, run the engine against their own data, and render the step trace — either as an interactive component or as a generated test/snapshot.

```ts
// In your library's documentation site (React)
import { GraphVisualizer, bfs } from 'algoxai';

// Show users exactly what YOUR graph algorithm does on THEIR input
const trace = bfs(userNodes, userEdges, startId, targetId);
```

---

### Use Case 3: Code Review Enhancement

**The problem:** Explaining recursive or tree-based logic in a PR comment requires either a long prose explanation or a one-time Excalidraw diagram that nobody revisits.

**AlgoXAI's role:**  
Link to a specific AlgoXAI visualizer state (URL with encoded input parameters) in a PR comment. The reviewer can interact with the exact data the PR operates on, observing each step.

**Future (roadmap):** Shareable permalinks with encoded state — paste a URL, see the algorithm running on the exact input from the PR.

---

### Use Case 4: Technical Interview Preparation (Generalised, Not Memorisation)

**The problem:** Candidates memorise patterns for known problems. They fail when the interviewer changes one constraint because the mental model is shallow.

**AlgoXAI's role:**  
Users enter *their own input arrays or graph structures* and watch the algorithm make decisions step by step. This builds a genuine mental model — the "why" of each comparison, swap, or traversal — that transfers to novel problems.

**Differentiation from LeetCode:** LeetCode tests. AlgoXAI explains. These are not competing — they are complementary. AlgoXAI is the tool you use *before* you go to LeetCode.

---

### Use Case 5: Classroom & Bootcamp Embedded Tool

**The problem:** Educators need interactive, customisable, self-hostable visualizers for their curriculum. Existing tools are proprietary, break with framework updates, or require server-side infrastructure.

**AlgoXAI's role:**  
- **Self-hostable:** Deploy on GitHub Pages, Netlify, or any server in minutes.
- **Embeddable:** Use `<iframe>` or the React component library directly in course material.
- **Extensible:** Add a new visualizer by adding a pure algorithm engine in `src/lib/algorithms/` and a renderer in `src/components/visualizers/`. No backend required.
- **Zero cost:** MIT license, no usage limits, no vendor lock-in.

---

### Use Case 6: Internal Developer Platform (IDP) Plugin

**The problem:** Organisations building Internal Developer Platforms (Backstage, custom portals) need components that make algorithmic knowledge observable within their existing tooling ecosystem.

**AlgoXAI's role:**  
The dual ESM/UMD build and TypeScript-first design means AlgoXAI components can be imported into any React-based internal portal. Engineering Backstage plugins, custom documentation sites, or internal training portals can embed live visualizers without any build system changes.

```ts
// In your Backstage plugin or internal portal
import { SortingVisualizer, BST3DVisualizer } from 'algoxai';
```

---

## 6. The Engine-First Architecture Advantage

This is AlgoXAI's most underappreciated technical differentiator.

### The Separation Principle

Every algorithm in AlgoXAI is implemented as two independent layers:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Pure Algorithm Engine                         │
│  ─────────────────────────────────────────────────────  │
│  • Plain TypeScript functions                           │
│  • Zero dependencies (no React, no Three.js)           │
│  • Returns immutable step arrays                        │
│  • Fully unit-tested (32 tests, 100% pass rate)        │
│  • Works in Node.js, browser, or any JS runtime        │
├─────────────────────────────────────────────────────────┤
│  LAYER 2: Renderer (Optional)                           │
│  ─────────────────────────────────────────────────────  │
│  • React components consuming step arrays               │
│  • 2D (Canvas/DOM) or 3D (Three.js / R3F)             │
│  • Replaceable — swap renderers without changing logic │
│  • Independent — engines work without renderers        │
└─────────────────────────────────────────────────────────┘
```

### Why This Architecture Matters for Organisations

**Testing:** You can unit-test algorithm correctness without a browser. CI passes in seconds, not minutes. `npm test` runs in a Node.js environment — no headless browser, no Playwright, no Cypress needed for the core logic.

**Custom rendering:** An organisation can use AlgoXAI's BST engine to power a completely custom visual (e.g., a 2D canvas renderer that matches their brand) without forking the algorithm logic.

**CLI tools and scripts:** The engines work in Node.js. A build script, a CLI tool, or a GitHub Action can import `bstInsertSteps()` and produce a textual or JSON trace without any UI.

**AI integration:** LLM-based tools can consume the step arrays (each step has a human-readable `description` field) to generate natural-language explanations of what the algorithm is doing at each point.

```ts
// Example: Generate a natural-language explanation from step traces
const steps = bstSearchSteps(tree, 42);
const explanation = steps.map(s => s.description).join('\n');
// "Compare 42 with 50 → go left"
// "Compare 42 with 30 → go right"
// "Compare 42 with 40 → go right"
// "Found 42!"
```

---

## 7. Positioning Statement & Taglines

### Primary Positioning Statement

> **AlgoXAI is an open-source algorithm engine and React component library that makes data structures observable, teachable, and embeddable — so developers understand algorithms at work, not just in theory.**

### Secondary (for organisations)

> **Give your engineering team a shared language for algorithmic thinking. AlgoXAI embeds into your docs, your internal portal, and your codebase — replacing static diagrams with interactive, replayable execution traces.**

### Tagline Options (pick one for the headline)

| Option | Best for |
|---|---|
| `"See algorithms think."` | Broad developer audience |
| `"From code to intuition."` | Bootcamp / education audience |
| `"The missing visual layer for your engineering docs."` | Teams / organisations |
| `"Observable algorithms for every developer."` | OSS / infrastructure audience |

---

## 8. Revised README Narrative

The current README leads with the product's features. The revised narrative leads with the **problem**, then introduces AlgoXAI as the solution.

### Structure of the revised README

```
1. HOOK — One sentence: what problem does this solve?
   "Algorithms are hard to debug because you can't see them."

2. PROOF OF VALUE — The two personas
   a) "If you're a developer" → embed in your docs, use the engines
   b) "If you're learning" → interact with your own inputs

3. 30-SECOND START — Working code in < 3 commands
   git clone → npm install → npm run dev

4. WHAT YOU GET — The catalogue (brief, scannable)
   Visualizers: BST 3D, Sorting, Graph, Hanoi
   Engines: BST, BFS/DFS, Sorting, Hanoi (pure TS, zero-dep)

5. EMBED OR EXTEND
   npm install algoxai
   import { BST3DVisualizer, bstInsertSteps } from 'algoxai'

6. WHY ALGOXAI OVER [X]
   Comparison table — honest, not arrogant

7. CONTRIBUTE
   The one-paragraph contribution invitation

8. LICENSE
```

---

## 9. Roadmap to Broaden Adoption

### Phase 1 — Foundation (Current State ✅)

- [x] 3D BST Visualizer with orbit controls
- [x] Sorting algorithms (Bubble, Selection, Insertion)
- [x] Graph traversal (BFS, DFS) on 2D canvas
- [x] Tower of Hanoi recursive decomposition
- [x] Pure TypeScript engines (separated from renderers)
- [x] Dual ESM/UMD library build
- [x] 32 passing unit tests
- [x] GitHub Actions CI (typecheck, test, build)
- [x] MIT license

---

### Phase 2 — Usability & Embeddability (Q4 2026 — Q1 2027)

> Goal: Make AlgoXAI something developers *embed into their workflow*, not just a website they visit.

**P2.1 — Shareable URL State**  
Every visualizer encodes its current state (algorithm, input data, current step) into the URL. Anyone can share a link that opens AlgoXAI at an exact algorithm step on specific data. Useful for PR comments, Slack/Teams messages, and documentation links.

**P2.2 — Web Component Build Target**  
Compile a `<algoxai-bst>` custom element that works in any HTML page, regardless of framework. This removes the React dependency for embedding in Confluence, Notion (via iframes), or vanilla JS apps.

**P2.3 — Custom Input Mode**  
Every visualizer accepts a URL parameter or a UI text field for custom arrays/graph edges. This is the feature that changes AlgoXAI from "a demo" to "my personal debugging tool."

```
/visualizations?algo=bst&input=[50,30,70,20,40]&step=3
```

**P2.4 — Pathfinding Visualizers**  
Dijkstra's shortest path and A* on a 3D grid — the most commonly requested algorithms in developer education. These have clear use cases in game development, routing, and networking teams.

**P2.5 — npm Publish**  
`npm publish --access public` — making `npm install algoxai` work. This unlocks the library use case for every Node.js/React developer.

---

### Phase 3 — Team & Organisation Features (Q2–Q3 2027)

> Goal: Give engineering teams tools to embed AlgoXAI into their knowledge management workflows.

**P3.1 — Backstage Plugin**  
An official `@algoxai/backstage-plugin` that adds an Algorithm Explorer page to any Backstage-based Internal Developer Portal.

**P3.2 — Markdown / MDX Component**  
A `<AlgoXAI algo="bst" input="[50,30,70]" />` MDX component that renders an interactive visualizer inline in any MDX-based docs site (Docusaurus, Nextra, Astro Starlight).

**P3.3 — Step Trace Export**  
Export a full algorithm execution as a JSON trace file. This enables:
- LLM prompts that include the execution trace for AI explanation
- Automated test fixture generation
- Offline playback without the UI

**P3.4 — Additional Algorithm Engines**  
Priority ordered by developer demand:

| Algorithm | Why It Matters for Developers |
|---|---|
| Dijkstra / A* | Game dev, routing, maps |
| Merge Sort / Quick Sort | Database internals, distributed sorting |
| Heap / Priority Queue | Task scheduling, OS concepts |
| Trie | Autocomplete, search indexing |
| Union-Find / Disjoint Sets | Network connectivity, Kruskal's MST |
| AVL / Red-Black Tree | Database index internals |
| Dynamic Programming (knapsack, LCS) | Interview prep, optimisation |

---

### Phase 4 — Ecosystem & Community (Q4 2027+)

**P4.1 — Plugin Architecture**  
A formal `AlgoXAIPlugin` interface so contributors can publish third-party algorithm visualizers as separate npm packages that integrate with AlgoXAI's renderer infrastructure.

**P4.2 — LLM Step Narration**  
An optional integration layer where each execution step is fed to a local or cloud LLM to produce a real-time natural-language explanation of *why* the algorithm made that decision. No UI clutter — just an expandable "Explain this step" panel.

**P4.3 — Accessibility (WCAG 2.2 AA)**  
Full keyboard navigation for all visualizers, ARIA live regions announcing each step, high-contrast mode, and reduced-motion support. This opens AlgoXAI to the widest possible audience and makes it viable for institutional adoption.

---

## 10. Contribution Priorities

If you want to contribute, here is where impact is highest, ordered by breadth of user benefit:

### High Impact (solve the biggest gaps)

1. **Custom Input UI** — Text field or JSON input on every visualizer. This single feature increases utility for every non-student use case.
2. **Shareable URL state** — Encode visualizer state in query params. Enables linking from PRs, docs, Slack.
3. **Dijkstra/A* engine + 2D visualizer** — Most commonly requested algorithm missing from the catalogue.
4. **npm publish** — Make `npm install algoxai` work. Opens the library to the entire npm ecosystem.

### Medium Impact (broaden the platform)

5. **MDX component** — `<AlgoXAI />` that works in Docusaurus, Nextra, Astro.
6. **Merge Sort + Quick Sort visualizers** — Core algorithms missing from the sorting suite.
7. **Heap / Priority Queue visualizer** — Highly relevant for systems and backend developers.
8. **Step trace JSON export** — Enables LLM integration and offline use.

### Community Impact (grow the ecosystem)

9. **Contribution guide** (`CONTRIBUTING.md`) — The "how to add a new algorithm in < 1 hour" guide.
10. **Architecture docs** (`ARCHITECTURE.md`) — Explains the engine/renderer boundary so contributors don't break it.
11. **Good First Issues** — Tag 5–10 well-scoped issues for newcomers.
12. **Algorithm request template** — A GitHub Issue template for requesting new visualizers.

---

## 11. Success Metrics

### Adoption Metrics (6-month targets)

| Metric | Current | Target (6 months) |
|---|---|---|
| GitHub Stars | — | 500+ |
| npm weekly downloads | 0 | 200+ |
| Open issues / PRs | — | Active (10+ contributors) |
| Visualizer count | 4 | 8+ |
| Algorithm engine count | 4 | 8+ |
| Test count | 32 | 80+ |

### Qualitative Signals of Real Adoption

These are harder to measure but more meaningful:

- **A developer links AlgoXAI in a PR comment** → Code review use case validated
- **An educator embeds AlgoXAI in course material** → Education integration validated
- **An OSS library imports AlgoXAI engines** → Library use case validated
- **An engineering team self-hosts AlgoXAI** → Organisation use case validated
- **Someone opens an issue requesting a specific algorithm** → Domain demand validated

### The North Star Metric

> **Number of developers who use AlgoXAI *at work* (not just during study)**

This is the metric that separates "educational demo" from "developer infrastructure." Every roadmap decision should be evaluated against this single question: *Does this feature make AlgoXAI more useful to a working developer?*

---

## Appendix A: Honest Competitor Comparison

| | AlgoXAI | VisuAlgo | Algorithm Visualizer | USFCA |
|---|---|---|---|---|
| Open Source | ✅ MIT | ❌ Proprietary | ✅ Open Source | ❌ Proprietary (free) |
| React Library | ✅ npm package | ❌ | ❌ | ❌ |
| 3D Visualizers | ✅ Three.js | ❌ 2D only | ❌ 2D only | ❌ 2D only |
| Self-hostable | ✅ Static build | ❌ | ✅ | ❌ |
| Custom Input | 🔲 Roadmap | ⚠️ Limited | ✅ | ⚠️ Limited |
| TypeScript Engines | ✅ Fully typed | ❌ | ❌ | ❌ |
| Embeddable | 🔲 Roadmap | ❌ | ❌ | ❌ iframe only |
| Algorithm Coverage | ⚠️ Growing (4) | ✅ Broad (30+) | ⚠️ Medium | ✅ Medium |
| Mobile UX | ⚠️ Improving | ❌ Desktop only | ❌ Desktop only | ⚠️ Limited |
| Tested Engines | ✅ 32 tests | ❌ | ❌ | ❌ |

> [!NOTE]
> AlgoXAI's weaker algorithm coverage is a temporary, solvable problem. Every other differentiator (open source, library API, 3D, TypeScript engines, testability) is an architectural advantage that competitors cannot acquire without a rewrite.

---

## Appendix B: The One-Paragraph Pitch

*For a conference talk, a Twitter/X thread, a product launch, or a README introduction:*

> Most developers learn algorithms from static text and pre-baked animations. When they sit down to debug a graph traversal or explain a tree insertion in a code review, those tools are gone. AlgoXAI is an open-source React component library and pure TypeScript algorithm engine that makes algorithms observable wherever you need them — embedded in your docs site, imported into your Node.js script, or dropped into your internal developer portal. Visualize a BST in 3D, share a URL that opens at a specific algorithm step, or import the engine without the UI to power your own visualizations. Free, MIT-licensed, self-hostable, and built for the developer who needs to understand algorithms at work — not just before an interview.

---

*Document maintained in the AlgoXAI repository. To propose changes, open a pull request against `docs/strategy.md`.*
