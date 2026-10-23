# Indic Coding Harness: 7-Day Plan (Hinglish)

Claude Code-style coding harness, Sarvam aur doosre Indic LLMs ke liye. Date: 23 Oct 2026.

## Reality check

Claude Code open source nahi hai, aur "reverse engineered" repos (leaked ya decompiled source) copyright/DMCA risk ke saath aate hain. Isliye clean-room approach lo: Claude Code ke publicly documented behaviour (tools, permissions, subagents, CLAUDE.md, MCP, compaction) ko ek Apache-2.0 harness ke upar replicate karo. Scratch se banane ki zarurat nahi hai.

## Day 0: Decisions

**Base harness:** opencode ya Qwen Code. Dono open-source hain aur OpenAI-compatible endpoint support karte hain. Codex CLI mein bhi custom model\_provider config.toml se set ho jaata hai. Recommendation: opencode (TypeScript, plugin-friendly) ya Qwen Code (Gemini CLI ka fork, simple codebase). Scratch design tab karo jab in dono mein tool-loop ya prompt layer modify karna impossible lage.

**Model:** Sarvam ka current chat lineup sarvam-30b (64K context) aur sarvam-105b (128K context) hai; sarvam-m deprecated hai. Pricing ek aggregator ke hisaab se Sarvam-30B ke liye $0.30 input/output per million tokens hai (official page se confirm karo). Ek comparison mein coding score GLM-4.6 ka 48.8 aur Sarvam 30B ka 45.3 hai, par ye directional estimate hai.

**Architecture (hybrid):**

- Hinglish user input → Sarvam (intent + Hinglish samajhna, final explanation)
- Coding/tool-calling core → Sarvam-105B, aur A/B ke liye Qwen3-Coder ya GLM
- Hinglish mein reply

Kyunki Indic LLMs ka tool-calling aur long-horizon coding abhi frontier models se kamzor hai, aur function calling/tool use ko production mein endpoint par validate karna zaroori hai.

## Day 1: Setup aur baseline

- opencode fork karo, build chalao, aur ek OpenAI-compatible provider add karo jo `https://api.sarvam.ai/v1` ko point kare.
- Pehle raw API test karo: tool-calling JSON schema follow karta hai ya nahi, streaming, aur auth header sahi hai ya nahi (docs mein `api-subscription-key` ka mention hai, verify karo).
- 20 tasks ka mini eval set banao (bug fix, refactor, test likhna, repo Q&A), Hinglish aur English dono versions mein. Ye poore week ka scoreboard hoga.
- Sarvam-30B, Sarvam-105B aur ek English-first coding model ka baseline nikaalo.

## Day 2: Core agent loop aur tools

Claude Code jaisa minimal toolset:

- `read`, `write`, `edit` (exact-string replace, line-range nahi), `bash`, `grep`, `glob`, `todo`.
- Edit tool ko fail-safe banao: unique match na mile to clear error return kare. Weak models yahin sabse zyada atakte hain.
- Tool descriptions chhote aur example-heavy rakho. Indic models long schemas pe confuse hote hain.
- Tool-call repair layer: malformed JSON ko retry/auto-fix karo (1-2 retries).

## Day 3: Hinglish layer

- System prompt English mein rakho (zyada reliable), par output rule: "User ki language mein jawab do, code/identifiers English mein."
- Language detect karo aur Hinglish/Hindi/Devanagari ke liye alag prompt variants banao.
- Optional: Sarvam-Translate ya transliteration API se Devanagari ↔ Roman Hindi normalization.
- Slash commands ke Hinglish aliases, jaise `/yojana` ya `/plan`.
- Eval: Hinglish prompts pe success rate English se kitna gir raha hai, ye number nikaalo.

## Day 4: Context management aur memory

- 64K/128K window hai to compaction zaroori hai. Old tool outputs truncate karo, phir summarize.
- `CLAUDE.md` jaisa project file (`BHARAT.md` ya `AGENTS.md`), jo startup pe load ho.
- Repo map: tree-sitter se symbols ka compact index, taaki model blind grep na kare.
- Plan mode: pehle read-only exploration, phir approval ke baad edits.

## Day 5: Safety, permissions aur MCP

- Permission system: allow/ask/deny rules, bash command allowlist, aur dangerous patterns (`rm -rf`, `curl | sh`) pe hard block.
- Sandbox mein bash chalao (Docker ya bubblewrap). Agent-security eval project ke prompt-injection test cases apne harness pe chalao.
- MCP client support (opencode mein already hai, bas verify karo).
- Hooks: pre/post tool-use scripts.

## Day 6: Subagents aur quality

- `task` tool: alag context mein search/explore subagent, sirf summary wapas aaye.
- Model routing: chhote kaam (grep summarize, translation) Sarvam-30B ko, planning/edits 105B ya coding model ko.
- Failure analysis: eval ke fail cases ko category mein baanto (bad tool JSON, wrong edit, loop, language confusion) aur prompts/tools us hisaab se fix karo.
- Gaps bharne ke liye few-shot examples ya chhota SFT/LoRA dataset (tool-call traces) plan karo; ye Day 7 ke baad ka kaam hai.

## Day 7: Evaluate, polish, release

- Final eval: 20 tasks ko 50 tak badhao, SWE-bench-lite ke 20-30 instances daalo, aur 3 model configs ka comparison table banao (success %, cost, steps, Hinglish gap).
- Telemetry/logging: har session ka trace JSONL mein save karo; ye future fine-tuning data banega.
- README Hinglish + English mein, demo GIF, `npm i -g` ya `uvx` install path.
- GitHub pe release, aur Sarvam/Indic AI communities mein share karo.

## Risks

- **Sarvam tool-calling weak nikli:** hybrid mode pe shift karo (Sarvam sirf language layer, core English coding model).
- **Context overflow:** compaction Day 4 se pehle bhi basic form mein daal do.
- **Other Indic models** (Krutrim, BharatGen Param, etc.): openly available coding-capable checkpoints abhi confirm nahi hain, isliye Day 1 mein HF pe check karo. Provider abstraction se unhe baad mein swap kar sakte ho.
