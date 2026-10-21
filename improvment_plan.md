# Master Prompt: Transform AlgoXAI into a Professional, AI-Native Education Startup

## Role and Objective

Act as a senior product strategist, startup advisor, UX/UI designer, frontend architect, AI engineer, and growth-focused product manager.

Your task is to thoroughly audit my existing website and codebase, then create a detailed, phased implementation plan to transform **AlgoXAI, branded in the application as CPMaster**, into a polished, credible, differentiated AI education startup.

The website should serve two purposes:

1. **Product:** Deliver an exceptional learning experience for competitive programmers and students learning computer science algorithms and mathematical reasoning.
2. **Business:** Present a credible early-stage startup with a clear value proposition, compelling product demonstration, professional design, transparent roadmap, and measurable user value.

We are preparing the startup for external evaluation, partnerships, early users, and an application to the Claude Startups program. Improve the product and its presentation in ways that demonstrate real utility, technical credibility, and a thoughtful use of AI.

Do not optimize for superficial appearances or attempt to manipulate reviewers. Prioritize genuine product quality, working features, demonstrable Claude integration, real usage evidence, and a clear business narrative.

**Important: Begin with an audit and planning document. Do not modify source files until the audit, architecture assessment, and implementation plan are complete.**

---

# 1. Existing Project Context

The project is an existing React and TypeScript single-page application.

### Current technology stack

- Frontend: React 18, TypeScript, Vite 5
- Styling: Tailwind CSS, shadcn/ui, Radix UI, Lucide React
- Data fetching: TanStack React Query v5
- Backend: Supabase
- Database: PostgreSQL with Row Level Security
- Serverless backend: Supabase Edge Functions using Deno
- AI: Google Gemini through the existing Lovable AI Gateway
- Visualizations: HTML5 Canvas, Recharts, Mermaid.js
- Code rendering: Highlight.js and react-markdown

### Current architecture

The project includes the following major routes and modules:

- HomePage.tsx — landing page, hero, statistics, topic catalog
- AlgorithmPage.tsx — algorithm explanations and code examples
- VisualizationPage.tsx — interactive algorithm visualizations
- AIDashboardPage.tsx — multi-agent AI dashboard
- LearningHubPage.tsx — diagnostic quiz and personalized roadmap
- PracticePage.tsx — competitive-programming problem directory
- ProductivityPage.tsx — code review and progress analytics
- CalendarPage.tsx — contest calendar
- CommunityPage.tsx — developer discussion feed
- ProfilePage.tsx — rating-inspired profile and progress
- AIAssistant.tsx — floating AI assistant
- AICodePanel.tsx — code inspection and suggestions
- ArchitectureExplainer.tsx — architecture analysis and Mermaid diagrams
- CodeEditor.tsx — C++ code preview and simulated runner
- useAIChat.ts — server-sent event streaming client

Supabase Edge Functions:

- ai-orchestrator
- agent-concept-explainer
- agent-code-analyzer
- agent-debugging-assistant

The orchestrator classifies requests and routes them to specialist agents. Agent responses are streamed through server-sent events.

Existing database tables include:

- ai_chat_history
- user_topic_progress
- learning_paths
- ai_sessions

The existing database uses RLS policies to isolate user data.

These details are provided as an initial reference. Verify the actual repository, dependencies, implementations, migrations, environment variables, and deployed behavior before making architectural assumptions.

---

# 2. First Task: Conduct a Thorough Codebase Audit

Before proposing changes, inspect the actual application.

Examine:

1. Application routing, navigation, page layouts, and reusable components.
2. Current landing page, typography, color system, spacing, responsiveness, and visual consistency.
3. Authentication, onboarding, user profiles, and persistence.
4. Supabase tables, migrations, RLS policies, and Edge Functions.
5. AI orchestration, provider integration, streaming, errors, and usage tracking.
6. Learning Hub diagnostic logic and roadmap generation.
7. Practice problem sources, filtering, rating handling, and external integrations.
8. Algorithm visualizers and code-editor execution limitations.
9. Contest calendar and rating/profile implementation.
10. Accessibility, SEO, loading states, empty states, mobile behavior, and error handling.
11. Existing tests, build scripts, type checking, deployment configuration, and security concerns.

For every major feature, classify its current state as:

- Fully implemented and verified
- Implemented but not verified
- Partially implemented
- UI mockup or simulated behavior
- Missing
- Broken or insecure

Do not assume that a component is functional simply because its file exists.

Identify duplicated functionality, architectural weaknesses, unnecessary dependencies, broken navigation, incomplete flows, and opportunities to reuse existing components.

**Audit deliverable:** Produce a prioritized list of existing strengths, defects, technical debt, missing capabilities, and proposed improvements. Reference actual files and functions wherever possible.

---

# 3. Product Positioning and Brand Strategy

Evaluate whether AlgoXAI should be positioned as:

"An AI-native personalized learning platform for competitive programming, computer science, and mathematical reasoning."

Develop a clear positioning strategy around the following differentiators:

- Personalized skill assessment and learning roadmaps
- Rating-aware competitive-programming practice
- Interactive visual explanations of algorithms
- AI-powered concept tutoring, code review, and debugging
- Competitive programming and mathematics contests
- Long-term skill development supported by measurable progress

The product must not look like a generic AI chatbot wrapped around a collection of coding problems.

It should communicate that AlgoXAI helps learners identify weaknesses, understand concepts, practice at an appropriate difficulty, and improve through a continuous learning loop.

Evaluate the relationship between the following names:

- AlgoXAI — proposed primary startup brand
- CPMaster — existing in-app brand
- MathForces — proposed mathematics contest and practice experience

Recommend a coherent naming architecture. Prefer one primary platform with integrated learning tracks rather than multiple disconnected products unless the audit identifies a compelling reason to separate them.

Develop:

- One-sentence value proposition
- Target user segments and initial ideal customer profile
- Primary user problem
- Product differentiation
- Homepage messaging
- Product narrative
- Early-stage business positioning
- Short and long-term product vision

Avoid unsupported claims about market leadership, customer counts, performance, or product-market fit.

---

# 4. Redesign the Public Website as a Professional Startup Website

Design a polished, conversion-focused public-facing experience while preserving the existing application.

The public website should explain the company and its product, while the authenticated application should remain focused on learning and daily usage.

## Proposed public pages

### A. Home

Create a high-quality startup landing page with:

1. A clear navigation bar and consistent branding.
2. A compelling hero section with a specific user benefit.
3. Primary CTA: Start Learning or Try AlgoXAI.
4. Secondary CTA: Explore the Platform.
5. A real, interactive product preview or screenshot of the learning dashboard.
6. A concise explanation of the personalized learning loop.
7. Product modules presented as an integrated system.
8. A real demonstration of adaptive practice or AI-assisted debugging.
9. Verified product capabilities and genuine usage metrics, if available.
10. A clear final CTA.

Suggested messaging direction:

"Learn smarter. Practice at your level. Master algorithms and mathematical reasoning."

Treat this as a starting point, not mandatory copy. Recommend stronger alternatives if supported by the product strategy.

### B. Product

Explain the product through distinct modules:

- Adaptive Learning Hub
- Rating-Aware Practice
- AI Tutor and Debugging Assistant
- Interactive Algorithm Visualizations
- MathForces Mathematics Challenges
- Contest Tracking and Performance Analytics

Show how the modules work together instead of presenting an unconnected feature checklist.

### C. How It Works

Demonstrate the learning cycle:

1. Assess current skills.
2. Identify topic-level weaknesses.
3. Generate a personalized roadmap.
4. Recommend suitable problems.
5. Explain concepts and debug mistakes.
6. Measure progress and adjust recommendations.

Make this visual and understandable to a student, parent, educator, or potential partner.

### D. Technology and AI

Explain the actual technical architecture and responsible AI design.

Present the existing React, TypeScript, Supabase, and multi-agent architecture accurately.

Where relevant, explain how Claude is used, what each AI component does, and how the product measures its effectiveness.

Never claim that Claude powers a feature until it has actually been integrated and verified.

### E. About

Communicate:

- The problem we are solving
- Why we are building AlgoXAI
- Our approach to personalized learning
- Our long-term vision
- The team's real background and experience, where verified

Do not fabricate founders, advisors, institutional affiliations, awards, partnerships, or testimonials.

### F. Contact and Feedback

Add appropriate contact, feedback, and collaboration options.

Use real contact information or clearly marked configuration placeholders. Do not invent email addresses.

### G. Legal and Trust Pages

Assess the need for:

- Privacy policy
- Terms of service
- AI usage disclosures
- Data deletion and account controls
- Contact information
- Appropriate educational disclaimers

Do not present generated legal text as reviewed legal advice.

---

# 5. Visual Design Direction

Create a distinctive, modern, technically sophisticated design.

The aesthetic should combine the clarity of a premium developer tool with the approachability of an excellent educational platform.

Design principles:

- Strong visual hierarchy
- Excellent typography
- Generous whitespace
- Consistent spacing and layout grids
- Restrained, intentional color palette
- High-quality product screenshots and diagrams
- Subtle animations with meaningful purpose
- Accessible contrast and readable code
- Responsive layouts across desktop, tablet, and mobile
- Consistent component behavior and interaction states

Avoid:

- Generic AI-generated landing-page aesthetics
- Excessive gradients, glows, glassmorphism, and floating cards
- Unnecessary animations
- Large decorative sections that obscure the product
- Fake dashboards or invented statistics
- Repeated feature cards with nearly identical layouts
- Overloaded navigation
- Unnecessary redesign of functioning application screens

Define design tokens for colors, typography, spacing, borders, radii, shadows, and interaction states.

Recommend a design system that can be implemented using the existing Tailwind and shadcn/ui stack.

Provide wireframe-level descriptions for desktop and mobile versions of each major page.

---

# 6. Feature Assessment: Rating-Aware Codeforces Practice

Evaluate and plan a real adaptive practice system that recommends questions based on the learner's current abilities.

The system should consider:

- Current Codeforces rating, when available and authorized
- Target rating
- Problem difficulty
- Topic-level mastery
- Recently solved problems
- Failed attempts and repeated mistakes
- Recent practice consistency
- Learning objectives and preferred practice duration

Potential workflow:

1. User connects or provides a Codeforces handle.
2. The system retrieves available public rating and submission information through an appropriate integration.
3. The platform estimates current proficiency.
4. It recommends an appropriate set of problems.
5. It records attempts and updates topic-level mastery.
6. It adjusts subsequent recommendations.

Define a transparent recommendation strategy rather than using unexplained AI-generated difficulty scores.

Consider a combination of:

- Rating-distance filtering
- Topic relevance
- Weakness prioritization
- Problem novelty
- Success probability
- Learning progression

Include an option for a user to practice a particular topic or target rating.

Assess whether the existing schema can support the feature. Propose additional tables or fields only where needed.

Clearly distinguish between external platform ratings, internal topic mastery, and any estimated skill score.

Address API availability, caching, rate limits, duplicate problems, stale data, attribution, and graceful degradation when external services are unavailable.

Do not assume that external platforms provide APIs or permissions for every desired operation.

---

# 7. Feature Assessment: MathForces

Evaluate the feasibility and strategic value of introducing MathForces as an integrated mathematics learning and competition experience.

The proposed experience includes:

- Topic-based mathematics problem collections
- Number theory, combinatorics, algebra, probability, geometry, inequalities, and discrete mathematics
- Difficulty-based practice
- Timed rated mathematics contests
- Contest standings and leaderboards
- Personal rating history
- Post-contest explanations and solution discussions
- AI-assisted mathematical tutoring
- Personalized mathematics learning paths

Evaluate whether these capabilities should be part of the existing application or developed as a separate product.

Important requirements:

1. Design a mathematics-specific rating system independently of Codeforces ratings.
2. Define how contest participation, problem difficulty, scoring, tie-breaking, and rating updates work.
3. Consider established rating approaches, including Elo-style systems, without assuming that a particular formula is automatically suitable.
4. Start with a reliable curated problem bank and original or appropriately licensed questions.
5. Support mathematical notation and readable equation rendering.
6. Require explicit contest rules and fair-play safeguards.
7. Prevent the AI tutor from exposing contest solutions during active contests.
8. Design appropriate submission, answer-validation, and contest-timing logic.
9. Distinguish an actual rated contest engine from a mock contest or static leaderboard.

Recommend a minimum viable implementation that is useful without creating excessive engineering overhead.

Do not attempt to clone another platform's branding, proprietary problem content, or user interface.

---

# 8. Learning Hub Improvements

Evaluate the existing five-question diagnostic assessment and personalized roadmap.

Recommend how to improve it without overengineering the first release.

Potential improvements:

- Topic-level diagnostic confidence
- More representative question selection
- Difficulty adaptation
- Clear explanations for incorrect answers
- Prerequisite-aware roadmaps
- Recommended practice sets
- Mastery reassessment
- Roadmap progress tracking
- Recommendations based on recent mistakes
- Separate competitive-programming and mathematics skill profiles

Explain how recommendations are calculated and when they are updated.

Avoid presenting a five-question diagnostic as a scientifically validated assessment. Communicate uncertainty appropriately and propose validation experiments.

---

# 9. Claude Integration Strategy

This section is essential.

The current application uses Gemini through the Lovable AI Gateway. Assess a secure and practical path to integrate Anthropic Claude into the existing architecture.

Do not simply replace Gemini with Claude throughout the codebase without evaluating cost, latency, quality, reliability, and migration risk.

## Proposed AI capabilities

Evaluate Claude for:

- Concept explanations with structured learning objectives
- Step-by-step debugging and root-cause analysis
- Code review and complexity analysis
- Adaptive tutoring based on learner context
- Mathematical reasoning and solution verification
- Personalized feedback after practice sessions
- Learning-roadmap recommendations
- Explanations of algorithm visualization steps

Identify which capabilities genuinely benefit from Claude and which should remain deterministic or use existing services.

## Architecture requirements

Assess whether the existing orchestrator should support a provider abstraction.

Consider a design such as:

- AI orchestrator: classifies intent and chooses a workflow.
- Concept tutor: explains concepts and develops learning scaffolds.
- Code reviewer: analyzes correctness, complexity, and code quality.
- Debugging assistant: identifies root causes and proposes fixes.
- Math tutor: guides reasoning and verifies mathematical steps.
- Learning planner: proposes recommendations using structured skill data.

These are proposed responsibilities, not a requirement to create a separate agent for every task.

Use the simplest architecture that delivers reliable value.

## Secure implementation

Claude API calls must be made server-side through an appropriate Supabase Edge Function or another approved backend service.

Requirements:

- Store API keys in server-side secrets.
- Never expose provider credentials in the frontend bundle.
- Validate and constrain user inputs.
- Enforce authentication and authorization.
- Apply rate limits and reasonable token limits.
- Track usage, latency, failures, and estimated cost.
- Preserve or deliberately improve the current SSE streaming behavior.
- Handle timeouts, retries, provider errors, and cancellation.
- Prevent prompt injection from untrusted problem statements, source code, or external content from triggering unauthorized actions.
- Avoid logging secrets or unnecessary sensitive user data.
- Preserve existing RLS protections.
- Add automated tests for authorization and failure cases.

Use the first-party Claude API through the Claude Console if the goal is to use Claude Startup program API credits. Verify the current program terms and integration requirements before committing to the implementation.

Do not claim that using Claude automatically qualifies the startup for any program or benefit.

## Evaluation

Design an experiment comparing the existing AI provider with Claude on a defined set of representative tasks.

Measure:

- Correctness
- Helpfulness of explanations
- Debugging success
- User acceptance of suggested fixes
- Mathematical answer accuracy
- Latency
- Cost per completed task
- Error and fallback rates

Specify a reproducible evaluation dataset and a human-review procedure for tasks where correctness is difficult to determine automatically.

Define explicit success thresholds before rollout. Do not invent benchmark results.

---

# 10. Product Analytics, Traction, and Growth

Recommend a privacy-conscious product analytics plan that helps us understand whether learners benefit from the platform.

Measure meaningful events such as:

- Landing-page visit
- Signup completed
- Diagnostic assessment completed
- Learning roadmap generated
- First problem attempted
- First problem solved
- AI tutoring session completed
- Recommended problem accepted
- Weekly learning session
- Contest participation
- Returning learner
- Feedback submitted

Define activation, retention, engagement, and learning-progress metrics.

Potential metrics include:

- Visitor-to-signup conversion
- Signup-to-first-learning-session conversion
- Assessment completion rate
- First-week retention
- Weekly active learners
- Problems attempted and solved
- Learning-path completion
- AI-assisted debugging success
- Recommendation acceptance rate
- Cost per AI-assisted learning session

Avoid vanity metrics without a clear decision-making purpose.

Use privacy-conscious event collection, consent where required, and data minimization.

Recommend a small initial dashboard rather than an unnecessarily complex analytics platform.

Include a plan for gathering genuine feedback from early students and validating which features create the most value.

Never manufacture users, usage numbers, reviews, retention, or testimonials.

---

# 11. Technical Architecture and Data Model

Evaluate the existing architecture before proposing changes.

Keep React, TypeScript, Vite, Supabase, and the current UI stack unless there is a concrete technical reason to change them.

Assess whether the database should support additional entities such as:

- User skill profiles
- Topic mastery records
- Problem recommendation history
- External platform connections
- Mathematics problem bank
- Contest definitions
- Contest participation
- Contest submissions
- Mathematics rating history
- AI usage and evaluation records
- User feedback

These are candidate entities, not mandatory migrations.

For each proposed database change, document:

- Purpose
- Relationships
- Key constraints and indexes
- Required RLS policies
- Migration strategy
- Backward compatibility
- Data-retention considerations
- Test requirements

Do not store external API credentials in ordinary user profile tables.

Use database transactions or equivalent consistency safeguards for contest scoring, rating updates, and submission handling where required.

Avoid duplicating data that can be derived reliably from existing records.

---

# 12. SEO, Performance, Accessibility, and Reliability

Evaluate:

- Page titles and metadata
- Social-sharing previews
- Sitemap and robots directives
- Search-friendly public content
- Semantic HTML
- Keyboard navigation
- Screen-reader support
- Color contrast
- Image optimization
- Code splitting
- Lazy loading
- Bundle size
- Database query efficiency
- Caching
- Loading and empty states
- Mobile performance
- Error boundaries
- Authentication and authorization failures

Assess whether the existing Vite SPA is sufficient or whether public marketing pages would benefit from a different rendering approach. Do not migrate frameworks without a compelling reason.

Set measurable performance and accessibility goals, and specify how they will be tested.

---

# 13. Application Readiness for Claude Startups

Create a checklist for presenting AlgoXAI as a genuine early-stage, AI-native company.

Focus on evidence rather than promotional claims.

Assess the following:

- A professional, accessible public website
- A clear company and product description
- A working, demonstrable core product
- A clear explanation of why AI is necessary
- A real Claude integration where justified
- Measurable quality and cost evaluation
- Authentic founder and company information
- A clear product roadmap
- Evidence of user discovery and feedback
- Real traction metrics, if available
- A professional company email and domain, if available
- Accurate privacy and security disclosures
- A concise product demo and screenshots
- An honest description of current limitations

Distinguish between:

1. Requirements explicitly stated by the current program.
2. Factors that Anthropic has publicly identified as relevant to evaluation.
3. General best practices that may strengthen a startup.
4. Unknown or unverified selection criteria.

Do not claim to know the private review rubric or guarantee acceptance.

Identify eligibility questions that must be verified before investing significant time in application-specific work.

---

# 14. Implementation Prioritization

Organize the work into four phases.

## Phase 0 — Audit and foundations

- Codebase and product audit
- Positioning and information architecture
- UX flows and design system
- Security and integration assessment
- Baseline performance and quality measurements

## Phase 1 — Professional website and core learning experience

- Public landing page and company pages
- Navigation and responsive design
- Onboarding improvements
- Learning Hub improvements
- Rating-aware practice MVP
- Product analytics foundations

## Phase 2 — AI differentiation and MathForces MVP

- Claude integration behind a secure backend
- Provider comparison and quality evaluation
- Improved AI tutoring and debugging
- Mathematics problem bank
- Mathematics practice and contest MVP
- Rating and progress tracking

## Phase 3 — Validation and launch readiness

- User testing and feedback
- Performance and security testing
- Retention and activation analysis
- Documentation and demo preparation
- Application-readiness checklist
- Next-stage roadmap based on evidence

Reorder these phases when the repository audit identifies dependencies or higher-impact opportunities.

For each task, provide:

- Priority: P0, P1, P2, or P3
- User problem addressed
- Business rationale
- Proposed implementation
- Files and modules likely to change
- Dependencies
- Estimated engineering effort
- Risks
- Acceptance criteria
- Verification method
- Measurable success metric

Separate essential work from optional enhancements. Prefer small, testable increments over a large rewrite.

---

# 15. Required Deliverables

Before writing or editing application code, produce the following documents.

### Deliverable A: Existing Product Audit

Document the actual state of the website, including functional capabilities, incomplete features, technical debt, security concerns, and major opportunities.

### Deliverable B: Product and Brand Strategy

Explain the positioning, target audience, product narrative, feature priorities, and relationship between AlgoXAI, CPMaster, and MathForces.

### Deliverable C: Website Information Architecture

Provide a sitemap, navigation structure, page objectives, primary CTAs, and desktop/mobile wireframe descriptions.

### Deliverable D: Design System Specification

Define the visual direction, design tokens, reusable components, responsive behavior, accessibility standards, and interaction patterns.

### Deliverable E: Technical Implementation Plan

Map proposed changes to actual repository files, database entities, Edge Functions, frontend components, and external integrations.

### Deliverable F: Claude Integration and Evaluation Plan

Describe the architecture, security boundaries, provider migration strategy, evaluation methodology, rollout strategy, and cost controls.

### Deliverable G: Feature Specifications

Write implementation-ready specifications for rating-aware practice, the improved Learning Hub, and MathForces.

### Deliverable H: Prioritized Roadmap

Provide a dependency-aware task list with priorities, effort estimates, acceptance criteria, and testing requirements.

### Deliverable I: Launch and Application Readiness

Define the evidence, metrics, documentation, product demonstrations, and outstanding eligibility questions required for a credible early-stage startup presentation.

### Deliverable J: Risk Register

Identify product, technical, security, cost, external dependency, scope, and adoption risks, with proposed mitigations.

---

# 16. Execution Rules

Follow these rules throughout the audit and planning process:

1. Inspect the real repository instead of relying exclusively on this description.
2. Do not replace the application with a template or rebuild functioning features unnecessarily.
3. Do not change the current stack without a documented reason.
4. Do not implement fake interactions, mock metrics, or nonfunctional CTAs.
5. Do not fabricate traction, customers, testimonials, partnerships, or AI capabilities.
6. Do not expose API keys or weaken existing RLS policies.
7. Do not create database migrations until their requirements and rollback implications are understood.
8. Do not assume external platform APIs, permissions, or data availability.
9. Distinguish simulated functionality from production-ready functionality.
10. Prefer deterministic logic for ratings, contest scoring, and measurable skill calculations where appropriate.
11. Use AI where it provides a defensible user benefit.
12. Define tests and acceptance criteria for every critical change.
13. Preserve existing functionality and data compatibility.
14. Do not begin implementing the plan until I have reviewed and approved the audit and roadmap.

## Final Instruction

Start by exploring the repository and identifying the actual state of the application.

Then produce the audit, strategic recommendations, architecture assessment, and prioritized implementation plan.

Conclude with:

- The five highest-impact changes to implement first.
- The features that should be postponed.
- The recommended product architecture and brand structure.
- The most defensible Claude integration use case.
- The smallest meaningful MVP that can be validated with real learners.
- The exact commands and tests to run before implementation and after each phase.

Your objective is to turn the existing AlgoXAI codebase into a coherent, reliable, differentiated education startup—not merely a visually impressive website.