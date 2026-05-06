// ============================================================================
// CCA-F Mock Exam Question Bank
// 5 mocks × 15 scenario-based questions each
// Domains weighted to mirror the real exam:
//   Agentic Architecture & Orchestration (27%)
//   Claude Code Configuration & Workflows (20%)
//   Prompt Engineering & Structured Output (20%)
//   Tool Design & MCP Integration (18%)
//   Context Management & Reliability (15%)
// ============================================================================

const MOCK_EXAMS = [
  // ==========================================================================
  // MOCK EXAM 1
  // ==========================================================================
  {
    id: 1,
    title: "Mock Exam 1",
    subtitle: "Foundations of Production Architecture",
    duration: 45,
    questions: [
      {
        id: "1-1",
        domain: "Agentic Architecture",
        type: "single",
        question: "A fintech company is deploying a Claude-based agent that reconciles trade settlements. The agent calls 12 internal tools, each returning JSON of varying sizes (some up to 40KB). After 6–8 tool calls, engineers observe that Claude starts ignoring constraints from the initial system prompt (e.g., 'never auto-approve trades over $1M'). Latency has also tripled. Which architectural change BEST addresses both the constraint-drift and the latency problem with the least operational complexity?",
        options: [
          "A. Increase the context window by switching to the largest available model and adding the constraints again as the final user message before each tool call.",
          "B. Decompose the agent into a coordinator that delegates each reconciliation subtask to a fresh subagent, returning only a structured summary to the coordinator.",
          "C. Move all 12 tools behind a single MCP server and enable response caching so repeated calls are served from cache.",
          "D. Add a hook that re-injects the system prompt into the conversation after every tool result.",
          "E. Switch to a smaller, faster model and rely on stricter JSON schema validation to enforce the constraints."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The symptoms — constraint drift after many tool calls and ballooning latency — both point to context dilution: large tool results crowd out the system prompt's salience and inflate token usage. A coordinator/subagent pattern isolates each subtask in a fresh context, returns only a compact summary to the parent, and is the canonical Anthropic pattern for this exact failure mode.",
          incorrect: {
            "A": "A larger context window does not fix attention dilution; constraints remain buried under tool noise. Re-stating the constraints in a user message helps marginally but does not address latency, which is driven by token volume.",
            "C": "Caching helps for repeated identical calls but trade reconciliation calls are typically unique. It does nothing for context dilution, which is the actual root cause.",
            "D": "Re-injecting the system prompt grows the context further, worsening latency, and can create contradictory instructions when tool results disagree with the constraint.",
            "E": "A smaller model is more, not less, susceptible to constraint drift in long contexts. Schema validation only checks output shape, not semantic compliance with policy constraints like dollar thresholds."
          }
        }
      },
      {
        id: "1-2",
        domain: "Tool Design & MCP",
        type: "single",
        question: "You are designing an MCP server for a healthcare scheduling system. Claude must choose between three tools: `find_provider_by_specialty`, `find_provider_by_insurance`, and `find_provider_by_location`. In testing, Claude routinely calls the wrong tool — for example, calling `find_provider_by_specialty` when the user's query implied insurance was the binding constraint. What is the MOST effective fix?",
        options: [
          "A. Reduce the number of tools to one (`find_provider`) accepting all three filters as optional parameters, and make the tool description explicit about when each parameter is required.",
          "B. Add few-shot examples to the system prompt showing correct tool selection for various user phrasings.",
          "C. Rename the tools with numeric prefixes (`1_find_by_specialty`, etc.) so Claude evaluates them in priority order.",
          "D. Add a router subagent whose only job is to select the correct tool based on the user query.",
          "E. Move the three tools into separate MCP servers so each is loaded only when relevant context is detected."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. When tools have overlapping purposes, Claude must reason about which is 'most relevant' — a known source of misrouting. Consolidating to one tool with optional, well-described parameters eliminates the selection problem entirely and lets Claude express intent through arguments instead of tool choice. This is the canonical MCP design pattern: prefer one expressive tool over many narrow ones with overlapping semantics.",
          incorrect: {
            "B": "Few-shot examples treat the symptom, not the cause. The tools themselves are ambiguous; no amount of prompting fully fixes a poorly-bounded tool surface. Few-shots also don't generalize to phrasings outside the examples.",
            "C": "Numeric prefixes do not establish priority — Claude does not interpret tool names as ordered. This adds noise to the tool surface.",
            "D": "A router subagent adds latency and a failure point for what is fundamentally a tool design problem. The correct architectural move is to fix the surface, not to add machinery to compensate.",
            "E": "Splitting across MCP servers does not change which tools Claude sees at decision time, and dynamic loading based on 'detected context' creates a chicken-and-egg problem."
          }
        }
      },
      {
        id: "1-3",
        domain: "Prompt Engineering",
        type: "single",
        question: "A legal-tech startup uses Claude to extract 14 fields from contracts into structured JSON. About 4% of outputs fail validation — usually a single field returned as `null` when it should be a string, or an enum value that's slightly off (e.g., 'Net 30' vs 'NET_30'). The team currently retries the entire prompt on validation failure. Which approach will MOST reduce both the failure rate AND the cost of failures?",
        options: [
          "A. Switch to a stricter JSON schema with `additionalProperties: false` and more enum constraints, then retry the full prompt on failure.",
          "B. On validation failure, send a follow-up message containing the validator's error and ask Claude to repair only the offending fields, keeping the rest of the prior output.",
          "C. Increase temperature to 0 and add 'Output valid JSON only' three times to the system prompt.",
          "D. Run two parallel completions and accept whichever passes validation; if both fail, retry both.",
          "E. Move the extraction to a fine-tuned smaller model trained on validated examples."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The failure profile — small, localized errors in 1–2 fields — is precisely what targeted repair loops are designed for. Sending only the validator error and asking Claude to fix the named fields is dramatically cheaper than re-running a 14-field extraction, and has higher success rates because the model now has the exact failure signal. This validation-retry-with-error-context pattern is a core CCA-F structured-output technique.",
          incorrect: {
            "A": "A stricter schema may catch more errors but does not reduce the rate at which they occur, and full re-runs remain expensive. This addresses detection, not cost or success rate of recovery.",
            "C": "Temperature 0 is already typical for extraction; repeated instructions are noise. Neither addresses the localized-error failure mode.",
            "D": "Parallel completions roughly double cost on every request to win back a 4% failure tail — terrible economics. It also doesn't help when both completions make correlated errors on hard cases.",
            "E": "Fine-tuning is a heavyweight solution to a 4% problem solvable at the prompt layer. It also locks the team to a model and dataset that will drift as contract templates evolve."
          }
        }
      },
      {
        id: "1-4",
        domain: "Context Management",
        type: "single",
        question: "A research-assistant agent runs multi-hour sessions, performing literature search, summarization, and drafting. After ~90 minutes the agent begins citing papers it never actually retrieved — fabricated authors, plausible-but-wrong years. Logs show the conversation has grown to ~150K tokens, mostly tool results. The team must stop the hallucinations without losing the user's research thread. The BEST mitigation is:",
        options: [
          "A. Truncate the oldest 50% of messages whenever context exceeds 100K tokens.",
          "B. Periodically summarize tool results into a compact 'research notes' artifact, then drop the raw tool results from the active context while keeping the artifact.",
          "C. Lower the model temperature to 0 to reduce creative deviations.",
          "D. Add a system instruction: 'Never cite a paper you have not retrieved in this conversation.'",
          "E. Switch to a model with a larger context window so all tool results fit comfortably."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The hallucinations are a symptom of attention dilution at extreme context lengths — the model loses ability to distinguish 'actually retrieved' from 'plausible' as the haystack grows. The right pattern is structured compaction: distill verified retrieval results into a curated artifact, then carry the artifact (compact, high-signal) instead of raw tool dumps. This preserves the research thread while restoring attention.",
          incorrect: {
            "A": "Naive truncation drops verified citations and user instructions indiscriminately, often making hallucinations worse because the agent no longer 'sees' which papers were actually retrieved.",
            "C": "Hallucination here is not a temperature artifact — it's a context-attention failure. Lowering temperature does not restore lost evidence.",
            "D": "Pure instruction-following degrades as context grows; this is the exact regime where system prompt salience drops. The instruction will be ignored at the moment it matters most.",
            "E": "Larger context windows do not eliminate attention dilution; they often worsen it. Anthropic guidance specifically warns against treating bigger context as a fix for what is a context-curation problem."
          }
        }
      },
      {
        id: "1-5",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A platform team manages a monorepo with three services: a Python ML service, a TypeScript frontend, and a Go gateway. Engineers complain that Claude Code applies Python conventions when editing the Go service and uses the wrong test runner for the frontend. The team currently has one root-level `CLAUDE.md` with sections for each service. The MOST effective fix is to:",
        options: [
          "A. Make the root `CLAUDE.md` longer and more explicit about which conventions apply to which directories.",
          "B. Move per-service rules into `CLAUDE.md` files inside each service directory, keeping only repo-wide rules in the root.",
          "C. Replace `CLAUDE.md` entirely with a `.claude/rules/` directory containing path-scoped rule files using YAML frontmatter globs.",
          "D. Use `.gitignore` to hide irrelevant service directories when working in a particular service.",
          "E. Create three separate Claude Code projects, one per service, each with its own `CLAUDE.md`."
        ],
        correct: ["C"],
        explanation: {
          correct: "C is correct. The `.claude/rules/` directory with path-scoped rule files (YAML frontmatter with glob patterns) is the recommended modern approach for monorepos with heterogeneous services. Each rule file activates only when files matching its glob are touched, which means Claude sees only the conventions relevant to its current edit — eliminating cross-service contamination without bloating any one file.",
          incorrect: {
            "A": "A larger root CLAUDE.md compounds the problem: all rules are always in context, increasing noise and the chance Claude pulls a Python convention into Go work.",
            "B": "Nested CLAUDE.md files help, but Claude Code still loads parent CLAUDE.md content. Without path-scoping, you still get cross-contamination, and rules don't deactivate when working outside that subtree.",
            "D": "`.gitignore` controls version control, not what Claude Code sees in context. This conflates two unrelated mechanisms.",
            "E": "Splitting the monorepo defeats the purpose of having a monorepo and prevents cross-service refactors. It's also operationally heavy for a problem solvable with rule scoping."
          }
        }
      },
      {
        id: "1-6",
        domain: "Agentic Architecture",
        type: "multi",
        multiCount: 2,
        question: "A customer-support agent must decide when to escalate to a human. The team is debating which signals are RELIABLE escalation triggers. Select the TWO most reliable signals (per Anthropic's exam-relevant guidance).",
        options: [
          "A. The user explicitly requests a human.",
          "B. The agent's confidence score (self-reported) drops below a threshold.",
          "C. A required tool returns an error the agent cannot recover from after one structured retry.",
          "D. The conversation has exceeded a fixed message count (e.g., 20 turns).",
          "E. The agent has used the word 'sorry' more than three times."
        ],
        correct: ["A", "C"],
        explanation: {
          correct: "A and C are correct. Explicit user requests for escalation are the gold-standard trigger — they are unambiguous and respect user agency. Unrecoverable tool failures are also reliable: they represent a deterministic boundary the agent demonstrably cannot cross. Both are observable, externally verifiable signals.",
          incorrect: {
            "B": "Self-reported confidence is unreliable. Models are poorly calibrated on their own uncertainty, especially on tasks they're confidently wrong about. The exam specifically tests this distractor.",
            "D": "Turn count is a proxy, not a signal. Long conversations may be productive (deep technical issue) or unproductive (model loop) — counting turns conflates the two.",
            "E": "Apology frequency is a behavioral artifact, not a reliable failure signal. Polite agents apologize routinely; impolite users may produce many apologies on simple tasks."
          }
        }
      },
      {
        id: "1-7",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP tool `execute_sql` lets Claude run read-only queries against a production replica. A new requirement: Claude must NEVER run queries against tables containing PII (e.g., `users`, `payments`). Three options are proposed. Which is the SAFEST and most maintainable?",
        options: [
          "A. Add a rule to the system prompt: 'Never query tables named users or payments.'",
          "B. Have the MCP server itself parse incoming SQL, reject queries that reference forbidden tables, and return a structured error explaining the policy.",
          "C. Add a hook that scans Claude's tool_use blocks before execution and aborts the call if forbidden table names appear.",
          "D. Create a database role with no SELECT permission on PII tables and use that role for all `execute_sql` calls.",
          "E. Train Claude on examples where it correctly refuses to query PII tables."
        ],
        correct: ["D"],
        explanation: {
          correct: "D is correct. Defense should sit at the strongest enforcement boundary available. A database-level role enforces the rule with cryptographic certainty — no parser bug, prompt-injection, or model misbehavior can bypass it. This is the principle of least privilege applied correctly: enforce in the system that owns the resource.",
          incorrect: {
            "A": "System-prompt rules can be circumvented by prompt injection in tool results, ambiguous user phrasing, or simple model error. They are guidance, not enforcement.",
            "B": "Server-side SQL parsing is brittle: SQL is hard to parse correctly, identifiers can be aliased, joins can pull PII transitively. It will eventually fail open.",
            "C": "Hook-level string matching has the same brittleness as B and runs in the orchestration layer rather than the data layer — a weaker boundary.",
            "E": "Models cannot be 'trained' to refuse via examples in a deployment context, and even fine-tuned refusals are circumventable. Refusal is not enforcement."
          }
        }
      },
      {
        id: "1-8",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team uses Claude to generate weekly executive summaries from 30+ source documents. Outputs are inconsistent in length, tone, and structure week-to-week. Which combination of techniques will produce the MOST consistent results?",
        options: [
          "A. Lower temperature to 0 and increase max_tokens.",
          "B. Provide an explicit output schema (sections, length per section), 2–3 high-quality few-shot examples of past acceptable summaries, and a final 'success criteria' checklist the model is told to verify before finalizing.",
          "C. Generate three candidates per week and pick the one closest to last week's length.",
          "D. Ask Claude to first write the summary, then critique it, then rewrite it — all in one prompt.",
          "E. Switch to streaming output so reviewers can stop generation when length is appropriate."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Consistency across long-form generations comes from three reinforcing levers: explicit structure (schema), demonstrated targets (few-shot exemplars), and self-verification (explicit success criteria). Together these constrain shape, tone, and quality. This is the standard CCA-F pattern for repeatable structured generation.",
          incorrect: {
            "A": "Temperature 0 reduces variance per-call but does nothing about week-to-week drift caused by varying input documents. Bigger max_tokens enables longer outputs but does not constrain length.",
            "C": "Picking by length proxies for quality; the team will quickly converge on long, structurally identical, but substantively shallow summaries.",
            "D": "Single-prompt critique-rewrite loops degrade because the critique runs in the same context that generated the draft — the model is biased toward defending its own output. Multi-pass review with independent context is more effective.",
            "E": "Streaming is a UX feature, not a consistency mechanism. Stopping generation manually defeats the goal of automated consistency."
          }
        }
      },
      {
        id: "1-9",
        domain: "Context Management",
        type: "single",
        question: "A multi-agent research pipeline has 4 specialist subagents whose outputs are synthesized by a coordinator. The coordinator's final report sometimes contains claims none of the subagents made. Investigation shows each subagent passes a free-form text summary upward. The MOST effective architectural fix is:",
        options: [
          "A. Have each subagent return a structured object with explicit fields including `claims[]` (each with a `source_id`) and `confidence`. The coordinator may only use claims that appear in at least one subagent's output.",
          "B. Increase the coordinator's temperature to 0.",
          "C. Have the coordinator ask each subagent follow-up questions to verify ambiguous statements.",
          "D. Add a final 'fact-check' subagent that runs a web search on every coordinator claim.",
          "E. Reduce the number of subagents from 4 to 2 to reduce synthesis complexity."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Synthesis hallucinations arise when a coordinator interpolates between free-form inputs. Structured outputs with explicit claim-to-source provenance turn synthesis into composition: the coordinator can only assemble claims that exist, with attribution preserved end-to-end. This is the canonical multi-agent provenance pattern.",
          incorrect: {
            "B": "Temperature 0 reduces randomness but does not prevent the coordinator from inventing reasonable-sounding bridges between subagent outputs. Hallucinations here are structural, not stochastic.",
            "C": "Follow-up questions add latency and create their own hallucination surface (subagents may agree with leading questions). It also doesn't constrain what the coordinator may write.",
            "D": "A fact-checker is a band-aid: it catches some hallucinations after they're produced but does not prevent them, and web search is a noisy ground truth.",
            "E": "Fewer subagents reduces synthesis surface but at the cost of coverage. The hallucination problem isn't caused by having 4 subagents; it's caused by unstructured handoff."
          }
        }
      },
      {
        id: "1-10",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A team wants to run Claude Code in a CI pipeline to perform automated PR reviews. The pipeline must: (1) run non-interactively, (2) post a single review comment, (3) exit non-zero if Claude flags critical issues so the merge is blocked. Which combination is MOST appropriate?",
        options: [
          "A. Run Claude Code in interactive mode and use `expect` scripts to drive it.",
          "B. Run Claude Code with the `-p` (print) flag passing the review prompt, parse the structured output, and have the wrapper script set the exit code based on parsed severity.",
          "C. Use plan mode in CI, then have a human approve the plan before merging.",
          "D. Spawn Claude Code with `--watch` so it monitors the PR and posts comments as files change.",
          "E. Use Claude Code's web UI in a headless browser session controlled by the CI runner."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The `-p`/print flag is the documented mechanism for non-interactive, single-shot Claude Code execution — the entire point is CI-suitability. Pairing it with a wrapper that interprets the structured output (and sets exit codes accordingly) is the canonical CI/CD pattern.",
          incorrect: {
            "A": "Driving an interactive REPL with `expect` is fragile, vendor-specific, and explicitly unnecessary given the print flag exists.",
            "C": "Plan mode is for human-in-the-loop authoring, not automated CI. Requiring human approval per PR defeats the automation goal.",
            "D": "`--watch` is for local development against changing files; it does not match CI's run-once-and-exit model.",
            "E": "Browser automation against a UI is the most fragile possible integration and is not a supported deployment pattern."
          }
        }
      },
      {
        id: "1-11",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP tool `send_email` is deployed in a customer-success agent. Logs show Claude occasionally calls `send_email` with the body field containing template placeholders like `{{customer_name}}` instead of resolved values. The team wants the strongest guarantee that these unresolved templates never reach customers. The BEST mitigation is:",
        options: [
          "A. Add a sentence to the tool description: 'Always resolve all template placeholders before calling.'",
          "B. Have the MCP server reject any `send_email` call whose body contains unresolved `{{...}}` patterns, returning a structured error.",
          "C. Pre-process Claude's tool_use input with a hook that silently substitutes any remaining placeholders with empty strings.",
          "D. Switch to a model with stronger instruction-following.",
          "E. Add five few-shot examples to the system prompt showing correctly-resolved emails."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Server-side validation with a structured error is the right boundary: the tool refuses to perform the unsafe action, returns an error Claude can reason about, and Claude self-corrects on retry. This is the standard MCP error-propagation pattern — fail closed at the boundary, communicate the failure back through a typed error.",
          incorrect: {
            "A": "Tool description guidance helps but is not enforcement; placeholders will still occasionally slip through.",
            "C": "Silent substitution is the worst option: it makes failures invisible, sends emails reading 'Hi ,' to real customers, and gives Claude no signal to improve.",
            "D": "Stronger instruction-following reduces frequency but does not provide a guarantee. The bar here is 'never reaches customers,' which requires enforcement.",
            "E": "Few-shots reduce frequency but do not provide hard guarantees. They also bloat the system prompt over time as edge cases accumulate."
          }
        }
      },
      {
        id: "1-12",
        domain: "Prompt Engineering",
        type: "single",
        question: "An extraction prompt asks Claude to pull `invoice_total` (number, required) and `discount_code` (string, optional) from emails. About 8% of invoices have no discount code. Outputs sometimes return `\"discount_code\": \"\"`, sometimes `\"discount_code\": \"none\"`, sometimes the field is omitted. Downstream code crashes on the first two. The MOST robust fix is:",
        options: [
          "A. Add 'Use empty string when no discount applies' to the prompt.",
          "B. Define the field as nullable in the schema (`discount_code: string | null`), explicitly instruct the model to return `null` (not empty string, not 'none') when absent, and add one few-shot example demonstrating an absent code returning `null`.",
          "C. Make the field required and instruct the model to fabricate a placeholder when none exists.",
          "D. Strip the field downstream when it equals empty string or 'none'.",
          "E. Run two extractions and union their outputs."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The fix has three reinforcing parts: a typed nullable schema (so absence has a canonical representation), an explicit instruction naming the wrong values to avoid, and a single demonstrative example. Together these eliminate the ambiguity at the source. CCA-F structured-output guidance specifically calls out nullable representation as a high-leverage fix.",
          incorrect: {
            "A": "Empty string is a worse choice than null because it's truthy in many languages and conflates 'no discount' with 'discount code is the empty string.'",
            "C": "Fabricating placeholders introduces invalid data downstream and creates a class of bugs much worse than the current one.",
            "D": "Downstream sanitization treats the symptom; the root cause (model uncertainty about how to represent absence) remains, and 'none' may not be the only string that appears.",
            "E": "Two extractions doubles cost without improving the canonical-representation problem."
          }
        }
      },
      {
        id: "1-13",
        domain: "Context Management",
        type: "single",
        question: "A long-running coding agent sometimes loses track of decisions made earlier ('we agreed to use Postgres'). The team is considering four options. Which is the MOST exam-aligned best practice?",
        options: [
          "A. Pin the original user request and any explicit user decisions to a persistent system-prompt section that is preserved across context compaction.",
          "B. Periodically ask the user to re-state their preferences.",
          "C. Have the agent self-summarize every 10 turns and replace prior context with the summary.",
          "D. Increase the model's reasoning budget so it 'thinks harder' about earlier turns.",
          "E. Switch to a model with extended context."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Decisions and constraints have a different lifecycle than transient tool results: they should be preserved in a stable, prominent section that survives any compaction strategy. Pinning user-stated decisions to the system prompt is the canonical approach for durable cross-turn memory of intent.",
          incorrect: {
            "B": "Burdening the user defeats the agent's value proposition and produces an inconsistent UX.",
            "C": "Pure self-summarization is lossy in non-uniform ways — agents tend to drop facts they don't currently consider relevant, which are often the very facts that matter later.",
            "D": "Reasoning budget is per-turn compute, not memory. It does not retrieve information that has fallen out of attention.",
            "E": "Bigger context is not memory and does not prevent attention dilution. This is a recurring CCA-F distractor."
          }
        }
      },
      {
        id: "1-14",
        domain: "Agentic Architecture",
        type: "single",
        question: "A team is choosing between two patterns for a content-moderation pipeline: (1) a single agent that classifies, explains, and decides; (2) a generator agent that classifies + explains, plus a separate independent reviewer agent (no shared context) that audits a sample of decisions. The team observes that pattern (1) has a 12% false-negative rate on edge-case content. They believe (2) will help. Why is the independent reviewer pattern likely to outperform a self-review prompt added to pattern (1)?",
        options: [
          "A. The reviewer model is larger and more capable.",
          "B. A model retains reasoning context from generation in the same session, making it less likely to question its own decisions; an independent instance evaluates the output without that prior reasoning bias.",
          "C. The reviewer runs at lower temperature, producing stricter judgments.",
          "D. Two agents always outperform one due to ensemble effects.",
          "E. The reviewer has access to additional training data the generator lacks."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. This is a CCA-F-tested principle: a model in the same session that produced a decision is biased toward defending that decision because it carries the generative reasoning context. An independent instance — fresh context, no prior commitments — is materially better at catching subtle errors. This is the basis of the multi-instance review architecture pattern.",
          incorrect: {
            "A": "Capability is not the differentiator; the same model in independent instances still outperforms self-review.",
            "C": "Temperature is irrelevant to the structural advantage of independent context.",
            "D": "'Ensembles always win' is folklore, not a principle. Independent context is the actual mechanism.",
            "E": "There is no additional training data; both instances are the same model."
          }
        }
      },
      {
        id: "1-15",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A senior engineer wants Claude Code to: (a) propose changes for review before editing any file in `infra/`, but (b) edit files in `src/` directly without confirmation. The team currently uses a global setting to require confirmation for all edits. Which approach BEST encodes this policy?",
        options: [
          "A. Add a path-scoped rule file in `.claude/rules/` whose frontmatter targets `infra/**` and instructs Claude to use plan mode there; keep direct execution as the default.",
          "B. Maintain two separate Claude Code sessions, one per directory, with different settings.",
          "C. Add `# Always confirm` as a comment at the top of every file in `infra/`.",
          "D. Move the `infra/` directory outside the repository.",
          "E. Globally enable plan mode for all sessions."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Path-scoped rules with glob frontmatter are the documented mechanism for encoding behavior that varies by directory. Plan mode for `infra/**`, direct execution elsewhere, expressed declaratively in version-controlled rule files — exactly the pattern the exam tests.",
          incorrect: {
            "B": "Session juggling is operationally fragile and breaks for cross-directory changes (e.g., a refactor that touches both src/ and infra/).",
            "C": "Comments in source files are not a Claude Code policy mechanism. Claude does not interpret comments as configuration.",
            "D": "Reorganizing the repo to encode a behavioral preference is an inappropriate use of repo structure.",
            "E": "Globally enabling plan mode regresses on the team's desire for direct execution in `src/`."
          }
        }
      }
    ]
  },

  // ==========================================================================
  // MOCK EXAM 2
  // ==========================================================================
  {
    id: 2,
    title: "Mock Exam 2",
    subtitle: "Multi-Agent Systems & Production Reliability",
    duration: 45,
    questions: [
      {
        id: "2-1",
        domain: "Agentic Architecture",
        type: "single",
        question: "An e-commerce company runs a coordinator agent that delegates to three subagents: pricing, inventory, and fraud. The coordinator currently passes the full user message to each subagent. As traffic grows, costs are dominated by subagent token usage, even though many subagents only need a small slice of the user message. The MOST cost-effective restructuring is:",
        options: [
          "A. Cache the full user message at the coordinator and reference it by ID in subagent calls.",
          "B. Have the coordinator extract a minimal task-specific brief for each subagent (only the fields/context that subagent needs) and pass only that.",
          "C. Switch all subagents to a smaller model.",
          "D. Run all three subagents in parallel to reduce wall-clock time.",
          "E. Eliminate subagents and have the coordinator handle everything in one prompt."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Task decomposition implies context decomposition: each subagent should receive only what it needs. The coordinator's role includes producing focused briefs. This is the canonical hub-and-spoke pattern — the hub curates context per spoke, never broadcasts the whole user message.",
          incorrect: {
            "A": "Anthropic prompt caching applies to repeated identical prefixes, not to a coordinator-internal 'reference by ID.' Subagents still receive the full content as tokens.",
            "C": "Smaller models reduce per-token cost but do not reduce the token volume — the actual problem.",
            "D": "Parallelism reduces latency, not cost. It can even increase cost if subagents now redundantly process more context.",
            "E": "Collapsing to one prompt loses the isolation benefit of fresh subagent contexts and does not necessarily reduce cost on complex tasks."
          }
        }
      },
      {
        id: "2-2",
        domain: "Tool Design & MCP",
        type: "single",
        question: "A finance agent has 25 tools across 4 MCP servers. The agent frequently calls `get_account_balance` when it should call `get_pending_transactions` (the user actually wants to know what's about to clear). Tool descriptions are short ('Get account balance' / 'Get pending transactions'). The MOST effective fix is to:",
        options: [
          "A. Rewrite tool descriptions to be longer, including (i) when to use the tool, (ii) when NOT to use it, and (iii) a one-line example user query.",
          "B. Add a system-prompt rule: 'When in doubt, call get_pending_transactions first.'",
          "C. Reduce the number of tools to 5 by merging related ones.",
          "D. Add a router model in front of the agent to pre-classify the user query.",
          "E. Order the tools alphabetically so the model evaluates them consistently."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Tool descriptions are the model's primary signal for selection; CCA-F materials emphasize that tool descriptions are more important than most teams realize. The 'when to use / when not to use / example' pattern gives the model decisive evidence at selection time and disambiguates overlapping tools.",
          incorrect: {
            "B": "A blanket 'when in doubt' rule biases all queries — the model will over-call get_pending_transactions on queries where balance is actually correct.",
            "C": "Merging tools may help if their interfaces overlap, but get_account_balance and get_pending_transactions are distinct concepts. Hiding the distinction would harm correct routing.",
            "D": "An external router adds a hop and introduces its own classification errors. The model is the natural router given good descriptions.",
            "E": "Tool order is not a selection priority signal."
          }
        }
      },
      {
        id: "2-3",
        domain: "Prompt Engineering",
        type: "single",
        question: "A medical-coding application asks Claude to suggest ICD-10 codes for clinical notes. The model occasionally suggests confidently wrong codes. The team has a list of 100 historical mis-codes the model produced. Which approach is MOST likely to reduce future mis-codes?",
        options: [
          "A. Add the 100 mis-codes as 'never produce these' negative examples in the system prompt.",
          "B. Sample 10–15 of the mis-codes that share a common error pattern, convert each into a corrective example showing the correct code with reasoning, and add them as few-shots.",
          "C. Increase max_tokens so the model can produce more verbose justifications.",
          "D. Lower temperature to 0 and re-run the failing cases.",
          "E. Add 'be careful' to the system prompt."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Few-shots are most effective when they (a) cover the actual failure mode and (b) demonstrate correct reasoning, not just correct answers. Curating a small, representative, corrective set is far more effective than dumping all 100 errors. CCA-F prompt engineering emphasizes positive demonstrations of correct reasoning over long lists of negatives.",
          incorrect: {
            "A": "Long lists of negative examples consume tokens, may suggest those wrong codes by mere mention, and don't teach the underlying correct reasoning.",
            "C": "Verbose output ≠ correct output. The model can produce confident, lengthy, wrong reasoning.",
            "D": "Temperature 0 reduces variance but does not change the model's beliefs about which code applies.",
            "E": "Vague exhortations have negligible effect on calibration."
          }
        }
      },
      {
        id: "2-4",
        domain: "Context Management",
        type: "single",
        question: "An agent processes a 200-page legal contract by chunking it and asking Claude per-chunk questions. The synthesis step (combining per-chunk findings) sometimes contradicts itself — e.g., reporting both 'the contract is governed by NY law' and 'governed by Delaware law' from different chunks. The BEST architectural fix is:",
        options: [
          "A. Increase chunk overlap from 10% to 50%.",
          "B. Add a final cross-chunk integration pass whose job is exclusively to reconcile contradictions, with each finding tagged by source chunk and quote.",
          "C. Process the entire contract in one prompt to avoid chunk boundaries.",
          "D. Use a vector database to retrieve only the most relevant chunks per question.",
          "E. Re-run the per-chunk pass three times and majority-vote."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Per-chunk passes capture local detail well but cannot resolve cross-chunk conflicts because no single pass sees both sides. A dedicated integration pass — explicitly designed to surface and reconcile contradictions, with provenance — is the canonical multi-pass review architecture for this exact failure mode.",
          incorrect: {
            "A": "More overlap reduces some boundary errors but does not give any single pass enough scope to resolve contradictions across distant sections.",
            "C": "Long-context single-pass on 200 pages risks attention dilution and is the regime where contradictions of this kind originate.",
            "D": "Retrieval helps for question-answering but does not produce a coherent synthesis across the whole contract.",
            "E": "Majority voting on per-chunk passes does not reconcile across chunks; it just reduces stochastic noise within each."
          }
        }
      },
      {
        id: "2-5",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A developer creates a custom slash command `/release-notes` that should: (1) run only in branches matching `release/*`, (2) read the last 10 commits, and (3) produce a CHANGELOG.md update. They want the command to fail fast outside release branches. Where should this branch-scoping logic live?",
        options: [
          "A. Inside the slash command's prompt: 'Only proceed if on a release/* branch.'",
          "B. As a precondition in the slash command's script/configuration that checks the branch via git and exits with an error before invoking Claude.",
          "C. As a hook that intercepts Claude's tool calls and aborts if branch is wrong.",
          "D. As a CLAUDE.md instruction in the repo root.",
          "E. As a CI-only command, not a slash command."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Preconditions that are deterministic (a `git` check) belong in the deterministic layer — the script invoking Claude — not in the prompt. Failing fast before any model call saves cost, prevents partial side effects, and gives the developer a clear error. Putting this in the prompt would make it probabilistic.",
          incorrect: {
            "A": "Prompt-based branch checks are unreliable: the model may proceed anyway, or hallucinate that the branch is correct.",
            "C": "Hooks are for governing tool use during execution; using them for an upstream precondition is the wrong layer.",
            "D": "CLAUDE.md is for repo-wide context, not slash-command preconditions.",
            "E": "CI-only deprives developers of the local workflow value of the slash command."
          }
        }
      },
      {
        id: "2-6",
        domain: "Agentic Architecture",
        type: "single",
        question: "A multi-agent pipeline has Coordinator → (Subagent A, Subagent B, Subagent C) → Coordinator. Subagent B occasionally crashes (network error). Currently the coordinator retries the entire pipeline, including A and C, on any subagent failure. The MOST efficient and reliable error-handling pattern is:",
        options: [
          "A. Have each subagent return a structured result (`status`, `data`, `error`); the coordinator retries only the failed subagent up to N times, with exponential backoff, before propagating a structured error upward.",
          "B. Have the coordinator catch all exceptions and return a generic 'something went wrong' to the user.",
          "C. Run all three subagents twice in parallel and use whichever pair agrees.",
          "D. Combine A, B, and C into one subagent so there is only one retry point.",
          "E. Have the coordinator silently drop B's output if it fails and proceed with A and C."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Structured error propagation — each subagent returns a typed result with status and error fields, the coordinator retries only the failing branch, and propagates a structured error upward when retries are exhausted — is the canonical reliability pattern. It minimizes wasted work and preserves observability.",
          incorrect: {
            "B": "Generic error swallowing destroys observability and the user's ability to recover.",
            "C": "Running everything twice doubles cost to mitigate a localized failure.",
            "D": "Collapsing subagents loses the architectural benefits of decomposition for an unrelated reason (one of them is flaky).",
            "E": "Silently dropping output produces results that omit B's contribution without any signal — a recipe for hidden correctness bugs."
          }
        }
      },
      {
        id: "2-7",
        domain: "Tool Design & MCP",
        type: "single",
        question: "A travel-booking agent has a `book_flight` tool that returns either a confirmation or a structured error. After deploying, you notice that on certain error types (e.g., 'price changed'), Claude immediately retries with the same arguments and fails again. What is the BEST way to make Claude handle 'price changed' errors correctly?",
        options: [
          "A. Add an error-handling instruction to the system prompt: 'If a tool returns price_changed, ask the user to confirm the new price before retrying.'",
          "B. Have the MCP server's structured error include both the new price AND machine-readable guidance like `next_action: 'confirm_with_user'` and `details: { new_price, old_price }` — making the correct next step explicit in the error itself.",
          "C. Disable retries entirely and let the user re-issue the request.",
          "D. Have the tool silently re-quote and book at the new price up to a $10 difference.",
          "E. Add a delay between retries."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Well-designed MCP errors are not just diagnostics — they carry actionable signals. By including a machine-readable next_action and the relevant data, the error itself shapes Claude's next step toward the correct behavior. This is structured-error-as-control-flow and is a CCA-F-emphasized pattern.",
          incorrect: {
            "A": "System prompt instructions are weaker than typed signals embedded in the error itself; they're easily overlooked when the error appears mid-conversation.",
            "C": "Disabling retries throws away legitimate retry cases (transient errors).",
            "D": "Silent auto-confirmation up to $10 is a policy decision that belongs to the user, not a hardcoded server choice. It also creates surprise charges.",
            "E": "Delays don't address why Claude is retrying with stale arguments."
          }
        }
      },
      {
        id: "2-8",
        domain: "Prompt Engineering",
        type: "single",
        question: "A document-summarization service must support outputs in 6 languages. Outputs in the user's language are inconsistent in length compared to English outputs (often shorter and missing key sections). The team's prompt is in English with the instruction 'respond in the user's preferred language.' The MOST effective fix is:",
        options: [
          "A. Translate the entire system prompt into each target language and select the right one per request.",
          "B. Keep the English system prompt but add per-language length and structural targets (e.g., 'in Japanese, target 800–1000 characters covering sections X, Y, Z'), plus one language-specific few-shot per language.",
          "C. Generate in English first, then ask Claude to translate to the target language.",
          "D. Lower temperature for non-English requests.",
          "E. Restrict the service to English only."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Length and structural drift across languages comes from English instructions implicitly anchoring on English token economics and stylistic norms. Per-language targets and one exemplar per language re-anchor the model in each language's natural structure. This is the right granularity — explicit, measurable, demonstrated.",
          incorrect: {
            "A": "Translating the entire system prompt is heavy maintenance, and translation drift over time creates inconsistency — the very thing the team is trying to fix.",
            "C": "Generate-then-translate produces stilted output that reads as translated, not native, and doubles latency/cost.",
            "D": "Temperature does not address structural targets across languages.",
            "E": "Removing the requirement is not a fix; it's a retreat."
          }
        }
      },
      {
        id: "2-9",
        domain: "Context Management",
        type: "single",
        question: "An agent runs a complex multi-hour task and must be resumable across machine restarts. Which set of state MUST be persisted to enable correct resumption (assume tool results are deterministic and re-callable)?",
        options: [
          "A. Only the original user request.",
          "B. The original user request, the full message history including all assistant tool_use and tool_result blocks, any user-provided decisions or preferences, and the active task plan.",
          "C. Only the most recent assistant message.",
          "D. The user request and a final 'state summary' produced by the agent.",
          "E. Nothing — re-prompting from the original request will reproduce the agent's behavior."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Correct resumption requires reconstructing the assistant's reasoning state. That includes the user request (intent), the full message history (so the assistant doesn't repeat or contradict prior steps), explicit user decisions (durable constraints), and the active plan (so progress is preserved). This is the canonical session-resumption checklist.",
          incorrect: {
            "A": "The original request alone loses all in-flight progress and decisions.",
            "C": "The most recent message alone is insufficient — the assistant won't know what's already been done.",
            "D": "A self-summary is lossy and may omit decisions the assistant doesn't currently consider relevant. Summaries are useful but not a substitute for history.",
            "E": "Re-prompting from scratch is not deterministic; the agent may take a different path or repeat completed side-effecting work."
          }
        }
      },
      {
        id: "2-10",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A team wants to share team-wide conventions (linting rules, preferred libraries, code style) but also allow individual developers to layer in personal preferences (e.g., 'I prefer verbose comments'). Which configuration approach BEST supports both, with the team conventions taking precedence over personal preferences when they conflict?",
        options: [
          "A. A single committed `CLAUDE.md` and tell developers to manually edit it locally without committing changes.",
          "B. A committed team `CLAUDE.md` for shared conventions plus a user-level (uncommitted, per-developer) configuration; conflicts resolve in favor of team rules per Claude Code's hierarchy.",
          "C. Separate Claude Code installations per developer with isolated settings.",
          "D. Encode all preferences in environment variables.",
          "E. Disallow personal preferences; everyone uses the team rules unmodified."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Claude Code supports a hierarchy: project-level CLAUDE.md (committed, team) and user-level configuration (per-developer). The hierarchy is the documented mechanism for layering shared and personal context, and team rules take precedence when they conflict — which is the desired behavior.",
          incorrect: {
            "A": "Manual local edits to a shared file is a recipe for accidental commits and inconsistent local state.",
            "C": "Separate installations don't share conventions and defeat the team-wide goal.",
            "D": "Environment variables are not the configured Claude Code mechanism for preferences and don't compose hierarchically.",
            "E": "Banning personal preferences sacrifices developer ergonomics for no architectural benefit."
          }
        }
      },
      {
        id: "2-11",
        domain: "Agentic Architecture",
        type: "multi",
        multiCount: 2,
        question: "A team is choosing between (a) running an agentic loop directly via the Claude API and (b) using the Claude Agent SDK. Select the TWO statements that BEST justify choosing the Agent SDK for a production deployment.",
        options: [
          "A. The SDK provides built-in primitives for agentic loops, hooks, and tool orchestration that you would otherwise have to build and maintain.",
          "B. The SDK uses a proprietary model that is unavailable through the standard API.",
          "C. The SDK provides standardized patterns for context management and session state that match Anthropic's recommended architecture, reducing the surface area for production failures.",
          "D. The SDK is required for using MCP servers; raw API users cannot connect to MCP.",
          "E. The SDK is significantly cheaper per token than the API."
        ],
        correct: ["A", "C"],
        explanation: {
          correct: "A and C are correct. The Agent SDK encodes Anthropic's recommended patterns for agentic loops, hooks, and session/context management. Adopting it shifts production failure-prone code from your team to a maintained library and aligns the deployment with documented best practices.",
          incorrect: {
            "B": "The SDK uses the same models available via the API — there is no SDK-exclusive model.",
            "D": "MCP works with raw API integrations; the SDK is not a prerequisite.",
            "E": "Token pricing is determined by the model, not the SDK."
          }
        }
      },
      {
        id: "2-12",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP server exposes `create_ticket(title, description, priority)`. The team wants `priority` to be one of: 'low', 'medium', 'high', 'critical'. Currently it's typed as `string`, and Claude occasionally sends 'urgent' or 'P1'. What is the MOST robust fix?",
        options: [
          "A. Add a system-prompt rule listing the valid priorities.",
          "B. Type `priority` as an enum in the MCP tool's input schema with the four valid values; the server rejects any other value with a structured error naming the allowed set.",
          "C. Have the MCP server map common synonyms ('urgent'→'high', 'P1'→'critical') silently.",
          "D. Drop the priority field entirely and have Claude infer it.",
          "E. Lower model temperature to 0."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The right place to constrain enum values is the input schema itself. Schema enums are surfaced to Claude at tool-selection time (so the model knows valid values up front) AND enforced at the boundary (so invalid values are rejected with a clear error). Belt-and-suspenders, by design.",
          incorrect: {
            "A": "Prompt rules are guidance, not enforcement; the constraint should be encoded in the tool surface.",
            "C": "Silent synonym mapping seems helpful but creates surprises: 'urgent' could mean high or critical depending on context, and the model never learns the canonical vocabulary.",
            "D": "Removing priority loses semantic information that downstream systems likely need.",
            "E": "Temperature 0 reduces variance but Claude already 'knows' (incorrectly) that 'urgent' is a reasonable English priority."
          }
        }
      },
      {
        id: "2-13",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team has a 4000-token system prompt. They want to use prompt caching to reduce cost and latency for repeated requests with the same system prompt but varying user messages. Which structural choice MOST affects cache hit rate?",
        options: [
          "A. Putting the user message before the system prompt to maximize variation at the start.",
          "B. Keeping the cacheable static content (system prompt, tool definitions, few-shots) at the start of the request, in a stable order, and putting the variable user content last.",
          "C. Compressing the system prompt to under 1000 tokens so caching is unnecessary.",
          "D. Adding a timestamp to the system prompt to ensure each request is unique.",
          "E. Re-ordering the few-shots randomly each request to balance which examples Claude attends to."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Prompt caching matches on prefix: stable content must come first, in a consistent order, with variable content trailing. Anything that perturbs the prefix (different ordering, timestamps, randomized few-shots) breaks the cache.",
          incorrect: {
            "A": "Putting the variable content first guarantees zero cache hits.",
            "C": "Compressing reduces absolute cost but forfeits the much larger cache savings on repeated calls.",
            "D": "Timestamps in the prefix break cache identity. This is a classic anti-pattern.",
            "E": "Random reordering of few-shots also breaks the prefix."
          }
        }
      },
      {
        id: "2-14",
        domain: "Context Management",
        type: "single",
        question: "An agent is asked to refactor a 50-file codebase. Strategy A: load all 50 files into context up front. Strategy B: load only the current file and pull others on demand via a `read_file` tool. The team is debating which is 'safer'. Which statement is MOST accurate?",
        options: [
          "A. Strategy A is always safer because Claude has full information.",
          "B. Strategy B is generally preferred because it keeps the active context focused on relevant files, reducing attention dilution and cost; the trade-off is that Claude must reason about which files to fetch, which is what tool descriptions and codebase navigation prompts address.",
          "C. Strategy A and B have identical reliability profiles.",
          "D. Strategy B is only viable if the codebase has fewer than 10 files.",
          "E. Strategy A guarantees that cross-file refactors will be correct."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Eager loading degrades attention and inflates cost; lazy loading via tools keeps each turn focused. The trade-off — that Claude must navigate intelligently — is exactly what the tool-design and context-curation domains of the exam emphasize. There is no full-information guarantee; even with all files loaded, attention dilution can cause cross-file errors.",
          incorrect: {
            "A": "More context ≠ better reasoning; this is the recurring distractor.",
            "C": "Reliability profiles differ markedly.",
            "D": "Codebase size threshold is heuristic at best; the principle applies broadly.",
            "E": "All-files-loaded does not guarantee correctness; cross-file refactors fail in long contexts due to attention dilution."
          }
        }
      },
      {
        id: "2-15",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A platform team is rolling out Claude Code to 200 engineers across 10 teams. Each team has its own preferred test runner, lint config, and PR conventions. Leadership wants centralized governance (security rules, no-PII rules, mandated review patterns) but team autonomy on style. The BEST architectural approach is:",
        options: [
          "A. A single, monolithic root CLAUDE.md owned by the platform team with all 10 teams' conventions in it.",
          "B. A repo-root or organization-level CLAUDE.md owning security/PII/review rules, with per-team CLAUDE.md (or `.claude/rules/`) under each team's directory holding style and tooling preferences. Hierarchy ensures security rules cannot be overridden.",
          "C. No centralized rules; each team manages its own configuration entirely.",
          "D. Block Claude Code in 9 teams; let only the platform team use it.",
          "E. Run a separate Claude Code service per team behind a feature flag."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The hierarchy of CLAUDE.md / `.claude/rules/` exists precisely for this case: organization-level rules for non-negotiable governance, team-level rules for autonomy. Hierarchy means security rules apply everywhere; team rules apply only in their scope.",
          incorrect: {
            "A": "A monolith violates separation of concerns and becomes a coordination bottleneck for every minor change.",
            "C": "No centralized rules forfeits security governance.",
            "D": "Blocking adoption is a non-solution.",
            "E": "Multiple services for what is fundamentally a configuration problem is operational overkill."
          }
        }
      }
    ]
  },

  // ==========================================================================
  // MOCK EXAM 3
  // ==========================================================================
  {
    id: 3,
    title: "Mock Exam 3",
    subtitle: "Tool Design, MCP Integration, and Safety",
    duration: 45,
    questions: [
      {
        id: "3-1",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP server for a hospital system exposes a `get_patient_record` tool. The team must support clinical staff (full record access), billing staff (financial fields only), and a patient-facing chatbot (limited fields). What is the BEST architectural approach?",
        options: [
          "A. A single tool that accepts a `role` parameter; the server uses it to scope returned fields.",
          "B. Three distinct MCP servers (clinical, billing, patient) — each authenticated separately, each exposing only the tool surface and field set its role is authorized to access. Authorization is enforced at the server, not via a parameter.",
          "C. One server with one tool; let Claude redact fields based on a system prompt describing the user's role.",
          "D. One server with one tool returning all fields; downstream consumers filter what they show.",
          "E. Disable the tool for non-clinical roles."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Authorization belongs at the server boundary, enforced by authenticated identity — not via a role parameter the model could omit or misstate. Three separate MCP servers (or one server gating on authenticated identity, not a parameter) ensures each consumer can only see fields they're entitled to, with cryptographic certainty.",
          incorrect: {
            "A": "A role parameter makes the model the gatekeeper of access control — a categorically wrong placement of authorization logic.",
            "C": "Prompt-driven redaction is not enforcement; a single prompt-injection or model error leaks PHI.",
            "D": "Returning all fields and filtering downstream means PHI flowed through a path it shouldn't have, and any logging/caching at intermediate layers may persist it.",
            "E": "Disabling for non-clinical roles eliminates legitimate use cases (billing, patient self-service) instead of enabling them safely."
          }
        }
      },
      {
        id: "3-2",
        domain: "Agentic Architecture",
        type: "single",
        question: "A research agent calls a `web_search` tool that returns 10 results per call. The agent often issues 4–6 nearly-identical searches before settling on an answer. Which combination MOST reduces wasted calls without harming output quality?",
        options: [
          "A. Lower max_tokens.",
          "B. (i) Tool description: instruct the model to first synthesize what it knows and what it needs, before searching; (ii) Have the tool include in its result a `query_history` echo so Claude sees its own prior queries; (iii) Add a planning step in the agent loop where the model writes the search plan before issuing the first query.",
          "C. Cache identical search queries server-side.",
          "D. Replace web_search with a vector database.",
          "E. Reduce the model's reasoning budget to encourage decisiveness."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The failure is exploratory thrashing — the model isn't planning before acting. The fix combines (i) instruction at the tool surface, (ii) state visibility (the model can see what it already searched), and (iii) an explicit plan step. These three together eliminate redundant calls because the model now thinks before searching and remembers what it searched.",
          incorrect: {
            "A": "Lower max_tokens truncates outputs; it does not affect the number of tool calls.",
            "C": "Server-side caching hides the cost from billing but does not address why the model is over-searching, and may mask the underlying problem.",
            "D": "Switching tools sidesteps the question; the agent will thrash on a vector DB too if not given a plan.",
            "E": "Less reasoning budget makes thrashing worse, not better."
          }
        }
      },
      {
        id: "3-3",
        domain: "Prompt Engineering",
        type: "single",
        question: "A code-review agent must classify each finding as one of: `nit`, `suggestion`, `must-fix`, `block`. In production, ~15% of `must-fix` findings are actually `nit`-grade. The team wants to reduce false `must-fix` calls without losing real ones. The MOST effective change is:",
        options: [
          "A. Add definitions for each label with concrete inclusion/exclusion criteria, and add 2–3 few-shots per label including borderline cases that should NOT be that label.",
          "B. Drop the four labels and use a 1–10 severity scale.",
          "C. Add an instruction: 'Be conservative with must-fix.'",
          "D. Run the classifier twice and accept the lower severity.",
          "E. Increase temperature to add diversity."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. False positives in classification typically reflect under-specified label boundaries. The fix is explicit definitions plus exclusion criteria and borderline negative examples — these are the cases the model is currently mis-handling. CCA-F prompt-engineering guidance emphasizes this exclusion-criteria pattern for label disambiguation.",
          incorrect: {
            "B": "Replacing categorical labels with a continuous scale changes the problem rather than solving it; downstream consumers likely need the categories.",
            "C": "Vague 'be conservative' shifts the rate uniformly without teaching the model where the line should be.",
            "D": "Run-twice-take-min biases all calls downward, including ones that genuinely should be must-fix.",
            "E": "Higher temperature increases variance but does not improve calibration."
          }
        }
      },
      {
        id: "3-4",
        domain: "Tool Design & MCP",
        type: "single",
        question: "Two teams are integrating Claude with the same Jira instance. Team A defines its own MCP server with custom tools (`get_my_tickets`, `update_my_ticket`). Team B uses an existing community Jira MCP server. The director asks why two integrations exist. What is the BEST consolidation strategy?",
        options: [
          "A. Merge both into a single shared MCP server, expose a clean superset of tools, and let each team configure which tools are exposed via tool descriptions/authorization. Standardize on one server to avoid drift.",
          "B. Keep both — diversity reduces single-point-of-failure risk.",
          "C. Have Team A's tools call Team B's tools internally so there's a chain of MCP servers.",
          "D. Migrate everything to direct Jira REST API calls and delete both MCP servers.",
          "E. Use the larger of the two by line count."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Two MCP servers for the same backing system is duplication, not redundancy. Consolidation onto one well-designed server with a clean tool surface (and authorization gating who sees what) is the standard architectural answer: a single, owned interface, agreed conventions, easier governance.",
          incorrect: {
            "B": "Diversity-as-redundancy is the wrong framing for an MCP layer; redundancy belongs at the underlying Jira availability layer, not duplicated client integrations.",
            "C": "Chained MCP servers add latency and a failure mode for no benefit.",
            "D": "Going back to raw REST throws away the standardization benefits of MCP.",
            "E": "Line count is not a quality metric."
          }
        }
      },
      {
        id: "3-5",
        domain: "Context Management",
        type: "single",
        question: "An agent needs to operate over a 1.2M-token document. The model's context window is 200K. Which architectural pattern is MOST appropriate?",
        options: [
          "A. Truncate the document to 200K and proceed.",
          "B. Build a retrieval layer (chunking + vector index + retrieval at query time), pair it with multi-pass review for synthesis, and have the agent cite specific chunks for every claim.",
          "C. Wait for a model with a 1.5M-token context window.",
          "D. Run 6 parallel agents on different 200K slices and merge outputs by string concatenation.",
          "E. Compress the document by removing every other sentence."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. For documents that exceed the context window, retrieval + multi-pass synthesis is the standard architecture. Chunking + retrieval keeps each pass focused; multi-pass synthesis reconciles cross-chunk findings; chunk-cited claims preserve provenance. This combines context management, structured output, and reliability primitives.",
          incorrect: {
            "A": "Truncation discards potentially critical content with no awareness of relevance.",
            "C": "Waiting is not an architectural answer.",
            "D": "Concatenation does not reconcile cross-slice contradictions and loses cross-references.",
            "E": "Lossy compression by sampling sentences destroys structure and meaning unpredictably."
          }
        }
      },
      {
        id: "3-6",
        domain: "Prompt Engineering",
        type: "single",
        question: "An extraction pipeline must produce strictly valid JSON against a schema. The team's current prompt is: 'Extract the following fields and return JSON.' About 2% of outputs include a leading 'Sure! Here's the JSON:' line that breaks the parser. The MOST robust fix is:",
        options: [
          "A. Strip non-JSON content with a regex downstream.",
          "B. Use the model's tool-use / structured-output mechanism (e.g., declaring an output tool with a JSON schema) so the response is enforced JSON, not free text the model formats as JSON.",
          "C. Add 'DO NOT include any preamble' five times in the system prompt.",
          "D. Lower temperature to 0.",
          "E. Switch to XML output and parse XML."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Enforced structured output via the API's tool-use / response-format mechanism guarantees JSON shape — the model cannot accidentally prepend prose. This is the canonical structured-output reliability pattern; relying on prompt-only constraints leaves a long tail of formatting errors.",
          incorrect: {
            "A": "Regex stripping is brittle; the model might include comments, code fences, or trailing prose that the regex misses.",
            "C": "Repetition in prompts has diminishing and sometimes negative returns.",
            "D": "Temperature 0 reduces but does not eliminate the prepend behavior.",
            "E": "Switching format does not solve the underlying issue (model adds prose around any output) and trades a JSON parser for an XML parser."
          }
        }
      },
      {
        id: "3-7",
        domain: "Agentic Architecture",
        type: "single",
        question: "A coding agent is given access to a `run_shell` tool. The team is debating safety guardrails. Which approach offers the STRONGEST guarantee that destructive commands (e.g., `rm -rf /`, `git push --force`) cannot be executed accidentally?",
        options: [
          "A. A system-prompt rule listing destructive command patterns to avoid.",
          "B. A hook that intercepts every tool_use of `run_shell`, runs a deny-list check, and requires explicit user confirmation for any matched command before forwarding to execution.",
          "C. Have the model self-check by adding 'verify command safety before running.'",
          "D. Only allow `run_shell` after the model writes a one-paragraph plan.",
          "E. Reduce model temperature to 0."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Pre-execution hooks are the canonical CCA-F mechanism for governing tool calls. They sit between the model's intent (tool_use block) and execution, allowing deterministic deny-list checks and human-in-the-loop confirmation for the dangerous subset. This gives a real guarantee — not a prompt-level wish.",
          incorrect: {
            "A": "Prompts are guidance; safety boundaries should be enforcement.",
            "C": "Self-check happens in the same context as the unsafe intent and is unreliable.",
            "D": "A plan paragraph helps with reasoning quality but does not prevent execution of destructive commands.",
            "E": "Temperature is unrelated to destructive-command frequency."
          }
        }
      },
      {
        id: "3-8",
        domain: "Tool Design & MCP",
        type: "single",
        question: "A `search_internal_docs` MCP tool returns up to 50 results per call. Each result has a `title`, `snippet`, `url`, and `full_text`. Currently the tool returns all fields for all results, averaging 80KB per call. Costs and latency are climbing. Which redesign is MOST aligned with MCP best practices?",
        options: [
          "A. Reduce the result count cap from 50 to 10.",
          "B. Split into two tools: `search_internal_docs` (returns title, snippet, url, doc_id only — small, cheap) and `read_doc(doc_id)` (returns full_text on demand). The model retrieves snippets first, fetches full text only for relevant ones.",
          "C. Compress the response with gzip.",
          "D. Add a `fields` parameter to the existing tool letting the model request specific fields.",
          "E. Cache the response for 1 hour."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The progressive-disclosure tool pattern — cheap discovery tool plus expensive fetch tool — is the canonical MCP design for large/expensive payloads. It mirrors how humans browse: skim, then drill. It also keeps the agent's context lean and is cost-proportional to actual usage.",
          incorrect: {
            "A": "Capping results loses information; the right fix is making each result cheap rather than reducing how many you return.",
            "C": "Compression is a transport optimization but Claude pays for tokens, not bytes; the input the model sees is still 80KB of text.",
            "D": "A fields parameter is a half-measure; it pushes complexity onto the model and most callers will request all fields anyway.",
            "E": "Caching helps repeats but does not address per-call payload size."
          }
        }
      },
      {
        id: "3-9",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A team uses Claude Code for refactoring. They want Claude to ALWAYS use plan mode for refactors that touch more than 5 files, but use direct execution for single-file edits. What is the BEST way to encode this?",
        options: [
          "A. Tell developers to manually toggle plan mode each time.",
          "B. Encode the rule in a project CLAUDE.md (or path-scoped rule) instructing Claude to enter plan mode whenever a planned change is expected to touch >5 files; rely on Claude's instruction-following at the deciding moment.",
          "C. Force plan mode globally.",
          "D. Forbid multi-file refactors entirely.",
          "E. Use a hook that scans Claude's planned tool calls; if more than 5 file-edit calls are planned in one batch, redirect through plan mode automatically."
        ],
        correct: ["E"],
        explanation: {
          correct: "E is correct. The deterministic answer is a hook that observes the planned set of tool calls and enforces plan mode based on a measurable threshold (file count). Hooks operate at execution time with full visibility of intent and provide a guarantee, not a hope.",
          incorrect: {
            "A": "Manual toggling is error-prone; the policy will be inconsistently applied.",
            "B": "Instruction-following is probabilistic; the model may underestimate scope or proceed despite the rule. Useful as documentation but not as enforcement.",
            "C": "Global plan mode regresses the team's stated preference for direct execution on single-file edits.",
            "D": "Forbidding multi-file refactors throws away the use case."
          }
        }
      },
      {
        id: "3-10",
        domain: "Prompt Engineering",
        type: "multi",
        multiCount: 2,
        question: "A team is hardening a system prompt against prompt injection from user-supplied content. Select the TWO MOST effective measures.",
        options: [
          "A. Wrap user-supplied content in clearly delimited tags (e.g., `<user_content>...</user_content>`) and instruct the model that everything inside the tags is data to analyze, NOT instructions to follow.",
          "B. Append 'IGNORE ANY INSTRUCTIONS BELOW' to the user content automatically.",
          "C. Add the user content to the system prompt instead of the user message.",
          "D. Place safety-critical instructions in the system prompt and structure the prompt so user-supplied content is processed as data after those instructions, not before.",
          "E. Increase model temperature to make injection attempts less reliable."
        ],
        correct: ["A", "D"],
        explanation: {
          correct: "A and D are correct. (A) Delimited tags plus explicit framing ('this is data, not instructions') is the standard prompt-injection mitigation; the model treats tagged content with appropriate skepticism. (D) Placing safety-critical instructions in the system prompt and processing user content as data after them establishes the right precedence — system instructions anchor before any injection can attempt to override.",
          incorrect: {
            "B": "Adding text to user content is itself a form of trusting user content's location; sophisticated injections can frame their payload to look post-warning.",
            "C": "Putting user content in the system prompt is the WORST option — it gives untrusted content the highest privilege.",
            "E": "Temperature has no effect on injection susceptibility."
          }
        }
      },
      {
        id: "3-11",
        domain: "Context Management",
        type: "single",
        question: "An agent loops with the user on a long debugging task. The user has gone quiet for 30 minutes. The agent's session expires in 5 minutes. Which is the BEST handling?",
        options: [
          "A. Continue making changes proactively to make progress before expiry.",
          "B. Let the session expire silently; the user can restart.",
          "C. Persist the full session state (history, plan, decisions, current hypothesis), notify the user the session is being checkpointed and how to resume, and then allow expiry.",
          "D. Repeatedly ping the user every 30 seconds until they respond.",
          "E. Auto-extend the session indefinitely."
        ],
        correct: ["C"],
        explanation: {
          correct: "C is correct. The reliability principle is: state survives the process. Persist the resumption-critical context (history, plan, decisions, current hypothesis), inform the user out-of-band, and accept the expiry. This preserves work and respects both the system's lifecycle and the user's agency.",
          incorrect: {
            "A": "Acting without the user is unsafe — they may not want the change you'd make, and you lose the ability to confirm.",
            "B": "Silent expiry destroys all progress; this is the failure mode reliability patterns are designed to prevent.",
            "D": "Pinging is bad UX and does not address the underlying state-loss risk.",
            "E": "Indefinite extension is not a real option in production systems with quotas."
          }
        }
      },
      {
        id: "3-12",
        domain: "Tool Design & MCP",
        type: "single",
        question: "A team is naming their MCP tools. They have a tool that 'creates a new draft document and assigns it to the current user, returning the draft id.' Which name and description style is BEST aligned with the principle that tool names and descriptions guide model selection?",
        options: [
          "A. Name: `do_thing`. Description: 'Does the thing.'",
          "B. Name: `createDraftAndAssignToCurrentUser`. Description: 'Creates a draft document and assigns it to the calling user. Use when the user wants to start a new document. Do NOT use for existing documents — use update_draft for those. Returns: { draft_id: string }.'",
          "C. Name: `cr8DftAssign`. Description: 'Creates draft, assigns.'",
          "D. Name: `tool_42`. Description: 'See internal docs.'",
          "E. Name: `create`. Description: 'For drafts.'"
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Verbose, intention-revealing names plus descriptions covering when to use, when NOT to use, and the return shape — that is the documented best practice for MCP tool design. Tool descriptions are arguably the highest-leverage surface for routing accuracy.",
          incorrect: {
            "A": "Generic names provide no selection signal.",
            "C": "Compressed names obscure intent and slow model reasoning.",
            "D": "Numeric names + 'see docs' fail because the model sees only what's in-context.",
            "E": "Single-word names with under-specified descriptions cause selection collisions."
          }
        }
      },
      {
        id: "3-13",
        domain: "Agentic Architecture",
        type: "single",
        question: "A multi-agent pipeline produces a final report. Each subagent provides its findings AND a self-reported confidence (0–1). The coordinator currently averages confidences across subagents and presents that as 'system confidence.' Why is this approach problematic?",
        options: [
          "A. Averaging is mathematically incorrect; it should be multiplied.",
          "B. Self-reported model confidence is poorly calibrated; averaging poorly-calibrated numbers does not produce a meaningful overall confidence and may falsely reassure users. A better approach is to present the underlying claims with provenance and let downstream consumers reason about reliability.",
          "C. Averaging is fine if all subagents use the same model.",
          "D. The coordinator should pass confidence through unchanged from a single 'lead' subagent.",
          "E. Confidence should be reported as a percentage instead of a 0–1 value."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. CCA-F materials emphasize that model self-reported confidence is unreliable. Averaging unreliable numbers compounds the problem — it produces a precise-looking 'system confidence' that can be confidently wrong. The right pattern is provenance: surface the actual claims with their sources, and let consumers (or a calibrated downstream component) reason about reliability.",
          incorrect: {
            "A": "Multiplication is not better; the problem is the inputs, not the operator.",
            "C": "Same-model averaging compounds the same calibration errors.",
            "D": "Passing through one subagent's confidence drops information from the others and is still poorly calibrated.",
            "E": "Units don't fix calibration."
          }
        }
      },
      {
        id: "3-14",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A team uses Claude Code Skills to encode reusable workflows. They have a `release-notes` skill with a SKILL.md frontmatter description. The skill is being incorrectly triggered for non-release tasks (e.g., regular PRs). The MOST effective fix is:",
        options: [
          "A. Delete the skill.",
          "B. Sharpen the SKILL.md frontmatter description so it explicitly states when the skill applies and includes anti-triggers (e.g., 'Do NOT use this skill for regular PRs, hotfixes, or non-release branches').",
          "C. Rename the skill to make it longer.",
          "D. Move the skill into a different directory.",
          "E. Lower the model's temperature."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Skill triggering is governed by the SKILL.md frontmatter description, which the model uses to decide whether the skill applies. Sharpening the description with explicit positive and negative criteria is the canonical fix for over-triggering. This is directly tested in the CCA-F.",
          incorrect: {
            "A": "Deletion abandons the use case.",
            "C": "Rename does not change the trigger surface; the description does.",
            "D": "Directory moves don't change skill triggering semantics.",
            "E": "Temperature does not control skill selection."
          }
        }
      },
      {
        id: "3-15",
        domain: "Prompt Engineering",
        type: "single",
        question: "A few-shot prompt has 8 examples spanning 3 categories. In production, outputs disproportionately mimic the 4th example (which happens to be the longest and most detailed). What is the BEST mitigation?",
        options: [
          "A. Rewrite the 4th example to be shorter and more uniform with the others; ensure examples are balanced across categories and similar in length and structure; verify with held-out evaluations.",
          "B. Add 'do not copy any specific example' to the prompt.",
          "C. Remove all few-shot examples.",
          "D. Reorder the examples randomly each request.",
          "E. Add 20 more examples so no single one dominates."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. Few-shot influence is roughly proportional to example salience: length, specificity, and position. When one example dominates, the fix is to balance length/structure, ensure category balance, and validate with evals. This is the standard CCA-F few-shot construction discipline.",
          incorrect: {
            "B": "Instruction-level disclaimers do not override demonstration-driven priors.",
            "C": "Removing examples may regress quality; the issue is balance, not presence.",
            "D": "Random reordering breaks prompt caching and does not solve the salience imbalance.",
            "E": "More examples can amplify the imbalance if the new examples are also uneven."
          }
        }
      }
    ]
  },

  // ==========================================================================
  // MOCK EXAM 4
  // ==========================================================================
  {
    id: 4,
    title: "Mock Exam 4",
    subtitle: "Cost, Scale, and Evaluation",
    duration: 45,
    questions: [
      {
        id: "4-1",
        domain: "Agentic Architecture",
        type: "single",
        question: "A customer-service agent handles 50K conversations/day. Average conversation length is 12 turns. Cost analysis shows 60% of token spend is on tool results (mostly knowledge-base lookups returning long passages). The team must reduce cost by ~40% without harming quality. Which combination is MOST likely to achieve this?",
        options: [
          "A. Switch all conversations to a smaller, cheaper model.",
          "B. (i) Restructure the knowledge-base tool to return short relevance-ranked snippets with a `read_more(doc_id)` follow-up tool; (ii) enable prompt caching for the system prompt and tool definitions; (iii) compact older turns of long conversations into a structured summary while preserving recent turns verbatim.",
          "C. Truncate every tool result to the first 500 characters.",
          "D. Run conversations only during off-peak hours.",
          "E. Raise temperature to encourage shorter, more decisive answers."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Three reinforcing levers, each targeting a different cost driver: (i) progressive-disclosure tools cut average tool result size, (ii) prompt caching reduces per-call cost on the static prefix, (iii) selective compaction of older turns reduces the carried-context tax in long conversations. Together they typically yield 30–50% reductions without quality loss.",
          incorrect: {
            "A": "Smaller models often regress quality on multi-turn customer service; the problem is volume, not per-token cost.",
            "C": "Blind truncation drops critical information unpredictably.",
            "D": "Time shifting doesn't change unit cost.",
            "E": "Temperature does not directly control output length and is not a cost lever."
          }
        }
      },
      {
        id: "4-2",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team builds an evaluation harness for a customer-intent classifier. They have 1000 labeled examples. Which evaluation design BEST detects regressions when the prompt changes?",
        options: [
          "A. Run all 1000 examples on every change and check overall accuracy.",
          "B. (i) Hold out a stratified test set covering all intent categories; (ii) track per-category precision/recall, not just overall accuracy; (iii) include adversarial / edge-case examples that previously failed; (iv) require regression alerts when ANY category drops by more than a threshold.",
          "C. Run the harness once at launch and rely on production telemetry thereafter.",
          "D. Test only on the failing examples from the last bug report.",
          "E. Use a single accuracy number and require it to be ≥95%."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Robust evaluation harnesses (a) stratify so minority categories aren't masked by majority accuracy, (b) track per-category metrics (a swap of failures between two intents can leave overall accuracy flat), (c) lock in adversarial coverage so old bugs don't return, and (d) trigger on per-category regressions, not just aggregate. This is canonical evaluation discipline.",
          incorrect: {
            "A": "Overall accuracy can hide category-level regressions, especially for imbalanced data.",
            "C": "Production telemetry is lagging and lacks ground truth labels; you'll discover regressions after they impact users.",
            "D": "Testing only known failures fails to catch new regressions.",
            "E": "A single number with a single threshold misses the structure of failures."
          }
        }
      },
      {
        id: "4-3",
        domain: "Tool Design & MCP",
        type: "single",
        question: "A `send_invoice` MCP tool is called many times per day. Engineering wants to add idempotency so retries don't double-send invoices. Which approach is MOST aligned with API design best practices and CCA-F principles?",
        options: [
          "A. Have Claude check whether an invoice was sent before each call.",
          "B. Add an `idempotency_key` parameter to the tool. The MCP server uses the key to deduplicate; on a duplicate, returns the prior result rather than re-sending. Document this in the tool description.",
          "C. Add a 5-second debounce in the MCP server.",
          "D. Have the orchestration layer track which invoices have been sent.",
          "E. Disable retries entirely."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Idempotency keys are the standard mechanism — the caller (Claude) supplies a key per logical operation, the server deduplicates, retries become safe. Documenting it in the tool description teaches Claude to generate appropriate keys. This is straight from API design best practices and applies directly to MCP tools.",
          incorrect: {
            "A": "Pre-call checks have race conditions and add latency; idempotency at the server is the durable answer.",
            "C": "Debounce only catches near-simultaneous duplicates and breaks legitimate rapid-sequence sends.",
            "D": "Tracking in the orchestration layer is brittle and duplicates state; the server already knows what it sent.",
            "E": "Disabling retries makes legitimate transient failures user-visible."
          }
        }
      },
      {
        id: "4-4",
        domain: "Agentic Architecture",
        type: "single",
        question: "A team is choosing between (a) a single 'monolith' agent with 30 tools and (b) a coordinator that delegates to 5 specialist subagents (each with 6 tools). Both have similar accuracy on benchmarks. Which factor BEST argues for the subagent architecture?",
        options: [
          "A. Subagents always run faster.",
          "B. With 30 tools in one prompt, tool selection accuracy degrades as Claude must distinguish among many overlapping descriptions; subagent delegation gives each agent a smaller, focused tool surface, which improves selection reliability and isolates failures by domain.",
          "C. Subagents are always cheaper.",
          "D. Monoliths cannot use MCP.",
          "E. Subagents work without prompt caching, monoliths do not."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Tool-selection accuracy degrades with surface size; subagent decomposition trades a coordinator hop for sharper per-agent tool surfaces. Plus, isolated failure domains: a tooling bug in one subagent doesn't poison others. This is the canonical tradeoff CCA-F materials describe.",
          incorrect: {
            "A": "Subagents add coordinator overhead; latency depends on parallelism, not architecture alone.",
            "C": "Subagents may be cheaper or more expensive depending on the workload; cost is not the universal advantage.",
            "D": "Monoliths can use MCP perfectly fine.",
            "E": "Both can use prompt caching."
          }
        }
      },
      {
        id: "4-5",
        domain: "Context Management",
        type: "single",
        question: "An agent has an 8-step plan it created at the start of a session. Three steps in, the user adds a new constraint that invalidates step 7. The agent ignores the constraint and proceeds to fail at step 7. The MOST effective architectural fix is:",
        options: [
          "A. Tell the user not to change requirements mid-session.",
          "B. Have the agent re-evaluate the remaining plan whenever a user message contains a new constraint or preference, and explicitly update or replace affected steps before continuing.",
          "C. Disable user messages mid-execution.",
          "D. Use a smaller model with less commitment to its plans.",
          "E. Reduce reasoning budget so the model does less planning up front."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Plans are hypotheses, not commitments. The fix is plan reflection: on receiving new information (especially user constraints), the agent re-validates remaining steps and edits the plan. This is durable in the face of changing requirements and is a core CCA-F reliability pattern.",
          incorrect: {
            "A": "Constraining users is not a system fix.",
            "C": "Blocking mid-execution input destroys the interactive value of agents.",
            "D": "Less commitment doesn't address the inability to update plans on new info.",
            "E": "Less planning produces worse outcomes overall."
          }
        }
      },
      {
        id: "4-6",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A senior engineer wants Claude Code to follow team conventions captured in three sources: a 1500-line internal style guide, a 200-line team CLAUDE.md, and 50 relevant ADRs (Architecture Decision Records). They put all three concatenated into the team CLAUDE.md. Quality drops. Why?",
        options: [
          "A. Claude Code does not support files larger than 1000 lines.",
          "B. Inflating CLAUDE.md with low-relevance content (most of the style guide and ADRs do not apply to most edits) wastes context and dilutes the high-signal team conventions; the better pattern is a focused CLAUDE.md plus path-scoped rule files (or skill files) that activate only when relevant.",
          "C. CLAUDE.md must be under 100 lines for Claude Code to parse it.",
          "D. The team CLAUDE.md should always go before the style guide alphabetically.",
          "E. Claude Code requires all rules to be expressed as YAML."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The principle is high signal-to-noise context. Most of any large style guide / ADR set is irrelevant to any specific edit. Stuffing it all into CLAUDE.md guarantees attention dilution. The recommended pattern: a focused CLAUDE.md, path-scoped rules for directory-specific conventions, and skills for workflow-specific knowledge.",
          incorrect: {
            "A": "There's no fixed size limit causing this; the issue is signal density.",
            "C": "There is no 100-line cap.",
            "D": "Ordering does not change the dilution problem.",
            "E": "CLAUDE.md is markdown, not YAML."
          }
        }
      },
      {
        id: "4-7",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP server returns rich tool descriptions to Claude. The team is debating whether to put compliance rules ('this tool may not be used for EU residents without GDPR consent') in the tool description or enforce them server-side. Which is the BEST allocation?",
        options: [
          "A. Put compliance rules ONLY in the tool description.",
          "B. Enforce compliance rules server-side (authoritative, deterministic, auditable). Mention in the tool description that the tool will refuse certain calls so Claude avoids fruitless attempts and surfaces the right context to users.",
          "C. Put compliance rules ONLY server-side and remove any mention from descriptions.",
          "D. Have Claude generate compliance attestations as part of every tool call.",
          "E. Compliance is the user's responsibility; do not encode it anywhere."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Compliance must be enforced where it cannot be bypassed — server-side. But describing the rule in the tool description avoids wasted calls and gives Claude the context to ask the right preconditions of the user. Both layers play different roles: enforcement vs guidance.",
          incorrect: {
            "A": "Description-only enforcement is not enforcement.",
            "C": "Hiding the rule from description means Claude makes calls that always fail and cannot explain why proactively.",
            "D": "Self-attestations are not enforcement and add token cost.",
            "E": "User responsibility for system-mandated compliance is a non-answer."
          }
        }
      },
      {
        id: "4-8",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team migrates from one model version to another. The same prompts produce slightly different outputs. Which evaluation step is MOST important BEFORE rolling out the new model to production?",
        options: [
          "A. Just deploy and watch error rates.",
          "B. Run the existing evaluation harness on the new model, compare per-category metrics, identify regressions, and write fixes (prompt updates, examples, or schema tightening) before rollout. Treat the model swap as a code change.",
          "C. Trust that newer models are always better.",
          "D. Re-train the model on team data.",
          "E. Wait for community reports of issues."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Model swaps are software changes and deserve software-change rigor. Running the eval harness, identifying per-category regressions, and patching them at the prompt layer before rollout is the canonical reliability practice. Without this, surprising regressions hit production.",
          incorrect: {
            "A": "Production telemetry lags real harm.",
            "C": "Newer ≠ uniformly better on every prompt; per-task regressions are common.",
            "D": "Re-training (fine-tuning) is overkill and may not even be available for the new model.",
            "E": "Crowdsourcing your QA from the community is not a strategy."
          }
        }
      },
      {
        id: "4-9",
        domain: "Agentic Architecture",
        type: "single",
        question: "A coding agent's loop currently is: read → plan → execute all → verify. In production, ~20% of runs fail verification because some early step had a side effect that invalidated later steps. The MOST effective restructuring is:",
        options: [
          "A. Lengthen the planning phase.",
          "B. Restructure the loop to: read → plan → execute one step → re-plan if state changed materially → continue. Make the loop incremental rather than all-at-once.",
          "C. Verify before execution rather than after.",
          "D. Skip verification.",
          "E. Run all steps in parallel."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. All-at-once execution presumes the world doesn't change underfoot. Incremental loops (execute → observe → re-plan if needed → continue) tolerate state drift, side effects, and surprise, which are normal in real systems. This is the canonical robust agent loop.",
          incorrect: {
            "A": "More planning up front does not anticipate state drift mid-execution.",
            "C": "Pre-verification checks the world before changes; it doesn't help with mid-execution drift.",
            "D": "Skipping verification eliminates the alarm but not the failure.",
            "E": "Parallelism on dependent steps causes more, not fewer, side-effect collisions."
          }
        }
      },
      {
        id: "4-10",
        domain: "Context Management",
        type: "multi",
        multiCount: 2,
        question: "A long-running agent must compact older context to stay within budget. Select the TWO compaction strategies BEST aligned with CCA-F best practices.",
        options: [
          "A. Replace old tool results with structured summaries that preserve key facts (decisions, IDs, dates, outcomes).",
          "B. Replace old user messages with paraphrased summaries to save tokens.",
          "C. Pin the original user request and any explicit user decisions; compact only intermediate tool noise around them.",
          "D. Truncate everything older than 30 minutes by wall-clock time.",
          "E. Drop the system prompt after the first 10 turns since the model 'remembers' it."
        ],
        correct: ["A", "C"],
        explanation: {
          correct: "A and C are correct. Compaction should target high-volume, low-signal regions (tool noise) and produce structured summaries that preserve actionable facts. Critical durable signals — original user intent and explicit decisions — must be pinned, not summarized. Together these maintain task fidelity through compaction.",
          incorrect: {
            "B": "Paraphrasing user messages is dangerous; explicit user wording often carries constraints (\"only PostgreSQL\") that paraphrasing dilutes.",
            "D": "Wall-clock truncation is a poor proxy for relevance; recent noise is dropped while older critical decisions survive (or vice versa).",
            "E": "The model does not 'remember' the system prompt without it being in context; dropping it causes immediate behavior drift."
          }
        }
      },
      {
        id: "4-11",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP server's tool returns paginated results: page 1 of 10. Currently the tool's response is `{ results: [...], page: 1 }`. The agent often forgets to fetch subsequent pages. What is the MOST effective fix?",
        options: [
          "A. Return all pages in a single call regardless of size.",
          "B. Include in the response a structured `pagination` object with `next_page_token`, `total_pages`, `total_results`, and a clear `has_more: true` flag — and document in the tool description that the agent should call again with `next_page_token` when `has_more` is true.",
          "C. Have the server email the agent the remaining pages.",
          "D. Refuse calls that would require pagination.",
          "E. Add a 'be thorough' instruction to the system prompt."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Pagination metadata that is structured, explicit, and self-describing (next_page_token, has_more, totals) plus tool-description guidance produces an interface the model can navigate reliably. The pattern mirrors well-designed REST APIs — make the next action obvious from the response.",
          incorrect: {
            "A": "Returning all pages defeats the purpose of pagination and inflates context.",
            "C": "Email is not a tool-call channel.",
            "D": "Refusing legitimate calls is worse than handling them.",
            "E": "Vague exhortations don't address the structural cause: the agent doesn't see clearly that more exists."
          }
        }
      },
      {
        id: "4-12",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team uses few-shot prompting for a sentiment classifier. Their current prompt has 5 positive examples, 5 negative, and 0 neutral. Production sees 'neutral' inputs classified as positive ~70% of the time. The MOST principled fix is:",
        options: [
          "A. Add 5 neutral examples and re-evaluate.",
          "B. Increase the model temperature so 'neutral' becomes more likely.",
          "C. Tell the model 'never output positive unless very confident.'",
          "D. Drop neutral as a class.",
          "E. Re-label production neutral examples as positive."
        ],
        correct: ["A"],
        explanation: {
          correct: "A is correct. The classifier has never been shown what 'neutral' looks like, so it picks the closer of the two demonstrated classes. Adding balanced neutral examples is the obvious, principled fix. This pattern — 'few-shots define the label space the model perceives' — is a CCA-F prompt-engineering staple.",
          incorrect: {
            "B": "Temperature does not introduce a class the model has never seen demonstrated.",
            "C": "Conservatism prompts skew the rate uniformly without teaching the boundary.",
            "D": "Dropping neutral abandons a real category.",
            "E": "Re-labeling is data malpractice."
          }
        }
      },
      {
        id: "4-13",
        domain: "Agentic Architecture",
        type: "single",
        question: "An agent occasionally enters infinite loops (calls the same tool with the same arguments repeatedly until budget is exhausted). The MOST robust mitigation is:",
        options: [
          "A. Increase the budget so loops complete.",
          "B. Add a deterministic loop guard at the orchestration layer that detects repeated identical (tool, args) pairs within a window and either escalates to a human, asks the model to revise its approach with the loop history surfaced as context, or aborts with a structured error.",
          "C. Tell the model not to loop in the system prompt.",
          "D. Lower temperature.",
          "E. Use a smaller model."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Loops are a deterministic phenomenon and deserve a deterministic guard. A loop detector at the orchestration layer with a defined response policy (revise / escalate / abort) is reliable, observable, and standard. Prompt-only solutions are unreliable in the regime where loops occur.",
          incorrect: {
            "A": "More budget makes the loop more expensive, not less likely.",
            "C": "Self-instruction to avoid loops is not enforced; loops happen because the model believes the next call will succeed.",
            "D": "Temperature does not address the structural issue.",
            "E": "Smaller models loop too."
          }
        }
      },
      {
        id: "4-14",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A team uses a custom slash command `/scan-secrets` that runs a static-analysis tool and asks Claude to triage the findings. They want the slash command to: (a) be available globally for all engineers, (b) be versioned with the team's repo so it evolves with the codebase, (c) not conflict with other teams' slash commands of the same name. The BEST configuration is:",
        options: [
          "A. Define the slash command in each engineer's user-level config.",
          "B. Define the slash command in the repo's `.claude/commands/` (or equivalent project-scoped location), so it ships with the repo, evolves with it, and is naturally scoped to the repo (no cross-team naming conflict at the project level).",
          "C. Define it as a global Claude Code command via the CLI.",
          "D. Email the slash command definition to every engineer.",
          "E. Define it three times in three different repos."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Project-scoped slash commands (committed in the repo) achieve all three goals: shipped with the repo (versioned), available to anyone with the repo (effectively global for the team), and naturally namespaced to the repo (no cross-repo conflict). This is the documented project-scoping pattern.",
          incorrect: {
            "A": "User-level config does not version with the repo and requires per-engineer setup.",
            "C": "Truly global commands risk cross-team conflicts and don't version with code.",
            "D": "Email is not configuration.",
            "E": "Triplicating definitions creates drift."
          }
        }
      },
      {
        id: "4-15",
        domain: "Context Management",
        type: "single",
        question: "An agent must process events streaming in real-time (e.g., support tickets arriving every few seconds). Each event may relate to a previous one (same customer, same product). Which architecture BEST handles cross-event context without unbounded growth?",
        options: [
          "A. One long-running session per agent that accumulates every event forever.",
          "B. A per-customer session keyed by customer_id; events for that customer go into that session, with periodic compaction to a structured customer summary, and a session lifecycle (e.g., idle timeout with persisted state for resumption).",
          "C. A fresh session per event with no cross-event memory.",
          "D. One session per agent process, restarting nightly.",
          "E. A single session per support team, accumulating every customer's events."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The natural sharding key is customer_id — events about the same customer share useful context, events about different customers don't. Per-customer sessions with compaction and lifecycle rules give cross-event memory where relevant, prevent unbounded growth, and persist state for resumption. This is the canonical streaming-context architecture.",
          incorrect: {
            "A": "Unbounded accumulation breaks at scale.",
            "C": "No memory loses cross-event signal that's the whole reason events relate.",
            "D": "Process-scoped sessions don't reflect the natural event grouping.",
            "E": "Mixing all customers conflates contexts and creates privacy/correctness risks."
          }
        }
      }
    ]
  },

  // ==========================================================================
  // MOCK EXAM 5
  // ==========================================================================
  {
    id: 5,
    title: "Mock Exam 5",
    subtitle: "Capstone: Real-World Architecture Scenarios",
    duration: 45,
    questions: [
      {
        id: "5-1",
        domain: "Agentic Architecture",
        type: "single",
        question: "You are architecting an agentic system for a law firm that drafts, reviews, and files legal motions. Requirements: (1) every motion must be reviewed by an independent process before filing, (2) all filings must be auditable end-to-end, (3) the system must escalate to a partner for any motion that affects a client's rights materially. Which architecture BEST satisfies all three?",
        options: [
          "A. A single agent with strong system prompt instructions covering review, audit logging, and escalation.",
          "B. A drafter subagent → an independent reviewer subagent (fresh context, no shared session) → an audit logger that records all messages and tool calls with provenance → a deterministic policy hook that flags motions matching defined 'material rights' criteria for partner escalation before filing.",
          "C. A drafter agent with a self-review loop and a partner-notification email at the end.",
          "D. Three drafters in parallel; majority vote selects the filing.",
          "E. A single agent that writes both the motion and the audit log."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The three requirements map cleanly to three patterns: independent reviewer (fresh context), audit logging at the orchestration layer (so it's tamper-evident and outside the agent's narrative), and a deterministic policy hook for escalation (rights determinations are too important to leave to a model's discretion). This is exactly the 'safety-critical multi-agent + hooks + provenance' pattern CCA-F stresses.",
          incorrect: {
            "A": "A single agent with prompt instructions cannot meet 'independent review' (same context bias) or guaranteed escalation (instruction-following is probabilistic).",
            "C": "Self-review in the same session is structurally biased; partner email at the end is post-filing.",
            "D": "Voting among drafters does not provide independent review and does not meet audit / escalation requirements.",
            "E": "Self-audit is exactly the conflict of interest the requirement is trying to avoid."
          }
        }
      },
      {
        id: "5-2",
        domain: "Tool Design & MCP",
        type: "single",
        question: "You are designing an MCP server for an internal-tools platform. 8 different agents (built by different teams) will use it. Each team wants slightly different tool surfaces. The platform team wants ONE MCP server, not 8. Which approach BEST balances these constraints?",
        options: [
          "A. Build 8 MCP servers, one per team.",
          "B. Build one MCP server with a comprehensive tool surface; expose tool subsets per agent via authenticated configuration (each agent's identity determines which tools are visible). Centrally evolve the tool implementations, decentrally choose tool exposure.",
          "C. Build one MCP server with all tools visible to all agents.",
          "D. Build 8 MCP clients but no MCP server.",
          "E. Have each team fork the platform server and modify locally."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. One server, central implementation, identity-scoped exposure: this gives the platform team consolidation and governance, while each agent gets the focused tool surface that maximizes its tool-selection accuracy. It is the canonical MCP multi-tenant pattern.",
          incorrect: {
            "A": "8 servers duplicate effort and drift.",
            "C": "Exposing all tools to all agents floods each agent's context, harming tool selection.",
            "D": "Without a server, there is nothing to consolidate.",
            "E": "Forks guarantee drift and undermine the consolidation goal."
          }
        }
      },
      {
        id: "5-3",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team is rolling out an agent that summarizes financial earnings calls. Compliance requires that NO claim in the summary lacks a verbatim quote from the source transcript. Which prompt+architecture approach BEST guarantees this?",
        options: [
          "A. Add 'cite a quote for every claim' to the prompt.",
          "B. Define the output schema as `{ claims: [{ statement: string, evidence_quote: string, transcript_offset: int }] }` enforced via structured output, and add a deterministic post-processing check that every `evidence_quote` appears verbatim in the source transcript; reject and retry the targeted claims that fail verification.",
          "C. Increase the model's reasoning budget so it produces more thorough citations.",
          "D. Lower temperature to 0 and trust the model.",
          "E. Have a second model spot-check 10% of summaries."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Compliance requires a guarantee, which means deterministic verification. Structured output forces the schema; verbatim verification confirms each quote actually exists in the transcript. Targeted retries on failed claims (rather than full regeneration) are efficient and on-pattern. This is the canonical 'structured output + validation loop + provenance' compliance architecture.",
          incorrect: {
            "A": "Prompt-only is guidance; compliance demands enforcement.",
            "C": "More reasoning does not guarantee verbatim accuracy.",
            "D": "Temperature 0 reduces variance but allows the model to fabricate plausible quotes.",
            "E": "10% sampling is sub-compliance for a 100% requirement."
          }
        }
      },
      {
        id: "5-4",
        domain: "Context Management",
        type: "single",
        question: "An agent platform serves 1000 concurrent users. Each user's session may last hours. A node restart for a routine deploy takes ~2 minutes and currently kills all 1000 sessions, requiring users to start over. Which architectural property is the ROOT cause?",
        options: [
          "A. The orchestrator runs as a single process.",
          "B. Session state is held only in process memory, with no durable persistence; on restart, state is lost and resumption is impossible. The fix is to externalize session state (history, plan, decisions) to durable storage on every step boundary so any node can resume any session.",
          "C. The model's context window is too small.",
          "D. The deploy process is too slow.",
          "E. Users have not enabled session persistence in their settings."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The architectural root cause is in-memory session state. Externalizing state (history, plan, decisions) to durable storage at step boundaries enables resumption from any node — the canonical reliability pattern for long-running stateful agents.",
          incorrect: {
            "A": "Process count doesn't change the in-memory problem; even multi-process designs lose state if state is in-process.",
            "C": "Context window size is unrelated to durability.",
            "D": "Faster deploys reduce blast radius but don't fix the durability gap.",
            "E": "There is no such user-settings feature; durability is a system property."
          }
        }
      },
      {
        id: "5-5",
        domain: "Agentic Architecture",
        type: "multi",
        multiCount: 3,
        question: "Select the THREE architectural choices that BEST mitigate cascading failures in a multi-agent system.",
        options: [
          "A. Structured error propagation with typed error fields (each subagent returns status/data/error rather than mixing them).",
          "B. Bounded retries with exponential backoff at the coordinator, on a per-subagent basis.",
          "C. Letting any subagent loop indefinitely as long as it 'thinks it's making progress.'",
          "D. A circuit breaker pattern that disables a flaky subagent for a window after consecutive failures.",
          "E. Increasing all subagents' reasoning budgets uniformly."
        ],
        correct: ["A", "B", "D"],
        explanation: {
          correct: "A, B, and D are correct. (A) Structured errors let the coordinator make informed retry/fail decisions instead of guessing from free-form text. (B) Bounded retries with backoff prevent transient failures from collapsing the system or being silently masked. (D) Circuit breakers stop a flaky subagent from poisoning every request — a standard distributed-systems pattern that applies directly to agent orchestration.",
          incorrect: {
            "C": "Unbounded loops are a cascading-failure cause, not a mitigation.",
            "E": "Reasoning budget does not address fault isolation; uniformly more thinking spends more on every failure."
          }
        }
      },
      {
        id: "5-6",
        domain: "Claude Code Configuration",
        type: "single",
        question: "An organization has hundreds of repos. Leadership wants ONE source of truth for security-critical Claude Code rules (no committing secrets, mandatory dependency review on lockfile changes, etc.). The BEST architectural approach is:",
        options: [
          "A. Manually copy the rules into every repo's CLAUDE.md.",
          "B. Use organization-level / shared configuration (an enterprise-managed CLAUDE.md or rule set) that is inherited by all repos; per-repo rules layer on top but cannot override the security-critical org-level rules. Audit periodically for compliance.",
          "C. Send a quarterly email reminding teams of the rules.",
          "D. Have a single 'rules repo' and tell teams to copy from it.",
          "E. Disable Claude Code in repos that haven't certified compliance."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Org-level / inherited configuration is the documented mechanism for enforcing non-negotiable rules across many repos. Combined with the override hierarchy (org-level wins over repo-level for protected rules), this gives one source of truth with per-repo flexibility on style/tooling.",
          incorrect: {
            "A": "Manual copying drifts immediately.",
            "C": "Email is not a control.",
            "D": "Copy-from-this-repo guarantees drift the moment the source changes.",
            "E": "Blocking adoption is not a fix."
          }
        }
      },
      {
        id: "5-7",
        domain: "Tool Design & MCP",
        type: "single",
        question: "An MCP tool `delete_record(record_id, confirm: bool = false)` requires `confirm=true` to actually delete. In testing, Claude sometimes calls it with `confirm=true` on its own initiative. The team wants to GUARANTEE that human-in-the-loop confirmation is required for deletes. The BEST architectural fix is:",
        options: [
          "A. Add a system-prompt rule: 'Never set confirm=true without explicit user approval.'",
          "B. Remove the `confirm` parameter from the model-facing tool. The tool, when called, queues a deletion request and returns a `confirmation_token`. A separate non-model-callable code path (with human UI confirmation) consumes the token to perform the delete.",
          "C. Default `confirm` to `true` so the model doesn't have to set it.",
          "D. Reduce model temperature.",
          "E. Add a hook that sets confirm=false unconditionally."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. If a parameter is the entire safety boundary, exposing it to the model violates least privilege. The architectural fix is to take the boundary out of the model's reach — the model can request a delete (returning a token), but execution requires a human-driven non-model path. This is dual-control as architecture, not as instruction.",
          incorrect: {
            "A": "System-prompt rules are bypassable; the requirement is a guarantee.",
            "C": "Defaulting to true makes deletes easier, not safer.",
            "D": "Temperature is unrelated.",
            "E": "Hardcoding confirm=false breaks the legitimate path entirely."
          }
        }
      },
      {
        id: "5-8",
        domain: "Prompt Engineering",
        type: "single",
        question: "A team's prompt produces structured JSON. They notice that when the input is unusually long (e.g., a long support thread), JSON quality degrades — fields get omitted or truncated mid-string. The MOST effective remediation is:",
        options: [
          "A. Increase max_tokens unconditionally.",
          "B. (i) Detect long inputs and route them through a pre-summarization step that reduces input length while preserving extraction-relevant signal; (ii) verify max_tokens is generous enough that JSON is never cut mid-field; (iii) on schema validation failure, retry only the missing/truncated fields with the relevant input slice.",
          "C. Split the input into halves and run two extractions, then merge.",
          "D. Switch to plain text output.",
          "E. Increase temperature so the model produces more diverse outputs."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Two failure modes are at play (input too long → degraded extraction; output truncated → invalid JSON), and the answer addresses both: pre-summarize to shrink input load, ensure max_tokens prevents truncation, and add targeted-retry recovery. This is composed structured-output reliability.",
          incorrect: {
            "A": "Max_tokens helps with truncation but not with input-driven extraction degradation.",
            "C": "Naive halving may split context (e.g., a customer's issue described across both halves), producing incoherent merges.",
            "D": "Plain text loses the schema benefit.",
            "E": "Temperature does not improve extraction quality on long inputs."
          }
        }
      },
      {
        id: "5-9",
        domain: "Context Management",
        type: "single",
        question: "An agent is supposed to follow a strict workflow: gather inputs → propose plan → wait for user approval → execute. In production, the agent occasionally executes immediately after proposing the plan, skipping approval. The MOST robust fix is:",
        options: [
          "A. Add 'wait for approval' three times in the system prompt.",
          "B. Encode the workflow as state in the orchestration layer: after the model produces a plan, the system enters an 'awaiting_approval' state and refuses to dispatch any execution-affecting tool calls until the user explicitly approves; the model literally cannot skip the gate.",
          "C. Lower the model's temperature.",
          "D. Use a smaller model that's less likely to act on its own initiative.",
          "E. Trust the model's ability to follow instructions."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Workflow gates are deterministic state. Encoding them in the orchestration layer (with the system gating tool dispatch) makes skipping impossible regardless of model behavior. This is workflow-as-state-machine and is the canonical CCA-F reliability pattern for human-in-the-loop steps.",
          incorrect: {
            "A": "Repeating instructions is not enforcement.",
            "C": "Temperature does not control workflow adherence.",
            "D": "Model size does not guarantee workflow compliance.",
            "E": "Trust is not a control."
          }
        }
      },
      {
        id: "5-10",
        domain: "Agentic Architecture",
        type: "single",
        question: "A multi-agent research system has 5 subagents. Currently each subagent calls the same `web_search` tool independently, producing significant duplicate searches across subagents. The MOST effective architectural change is:",
        options: [
          "A. Replace all 5 subagents with one larger agent.",
          "B. Hoist `web_search` to the coordinator level; subagents request searches from the coordinator, which deduplicates against an in-session search cache and returns shared results to all subagents needing them.",
          "C. Make each subagent's tool descriptions warn against duplicate searches.",
          "D. Have each subagent log its searches to a file other subagents can read.",
          "E. Increase reasoning budget so subagents avoid duplicates on their own."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Shared resources (search results, fetched pages) belong at the coordinator level so they can be deduplicated and shared. The pattern: subagents declare what they need; coordinator fulfills with caching. This is hub-and-spoke applied to retrieval economics.",
          incorrect: {
            "A": "Collapsing subagents loses the decomposition benefits.",
            "C": "Tool description warnings won't prevent duplicates across independent subagent contexts.",
            "D": "File-based ad-hoc IPC is a fragile substitute for proper coordinator-level coordination.",
            "E": "Subagents in independent contexts cannot see each other's searches; reasoning budget cannot fix that."
          }
        }
      },
      {
        id: "5-11",
        domain: "Tool Design & MCP",
        type: "multi",
        multiCount: 2,
        question: "Select the TWO statements that BEST describe principles of clean MCP tool design.",
        options: [
          "A. Tool descriptions should specify when to use the tool, when NOT to use it, and the return shape.",
          "B. Tools should accept and return free-form text whenever possible to maximize flexibility.",
          "C. Errors should be structured and actionable, including next-step guidance where appropriate.",
          "D. The number of tools should be maximized so the model has the widest possible surface to choose from.",
          "E. Tool authorization should be enforced via parameters the model passes."
        ],
        correct: ["A", "C"],
        explanation: {
          correct: "A and C are correct. (A) Rich descriptions are the highest-leverage signal for tool selection. (C) Structured, actionable errors turn failures into recoverable signals; this is core MCP design.",
          incorrect: {
            "B": "Free-form text everywhere defeats schema validation and downstream parsing reliability.",
            "D": "Maximum tools degrades selection accuracy; well-bounded surfaces outperform.",
            "E": "Authorization belongs at the server boundary, enforced by authenticated identity, not by trusting parameters from the model."
          }
        }
      },
      {
        id: "5-12",
        domain: "Prompt Engineering",
        type: "single",
        question: "A prompt asks Claude to extract entities, relationships, and a summary in one structured output. As input length grows, the summary degrades faster than entities/relationships. The team is debating whether to keep one prompt or split. The MOST architecturally sound choice is:",
        options: [
          "A. Keep one prompt to minimize calls.",
          "B. Split into two: an extraction prompt that returns entities and relationships (deterministic, schema-validated), and a summarization prompt that takes the extracted entities/relationships PLUS the original input as guidance. This decouples failure modes and lets each be tuned independently.",
          "C. Always split into N prompts, one per output field.",
          "D. Increase max_tokens to give the summary more room.",
          "E. Lower temperature to 0."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Different output types degrade at different rates; bundling them couples their failure modes. Splitting at the natural seam (extraction vs. summarization) lets each be evaluated, prompted, and tuned independently — and the summary can leverage extraction output as a structured prior. This is task decomposition applied at the prompt level.",
          incorrect: {
            "A": "Single-prompt economy doesn't justify entangled failure modes.",
            "C": "Max splitting (one prompt per field) over-fragments and loses cross-field coherence.",
            "D": "Tokens-room is rarely the cause of summary degradation on long inputs; attention dilution is.",
            "E": "Temperature does not address the differential degradation."
          }
        }
      },
      {
        id: "5-13",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A senior engineer wants Claude Code to behave differently in two situations: (1) on `main` branch, Claude must always use plan mode and must never run destructive shell commands; (2) on feature branches, Claude may execute directly with normal restrictions. Which combination is MOST appropriate?",
        options: [
          "A. A single CLAUDE.md describing both cases.",
          "B. Pre-execution hooks that read the current git branch: on `main`, force plan mode and apply a strict deny-list for destructive commands; on feature branches, apply the default policy. Hooks operate deterministically per branch state.",
          "C. Trust the model to remember and apply branch-specific rules.",
          "D. Block Claude Code on `main` entirely.",
          "E. Use environment variables set manually before each session."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Branch-conditional behavior is deterministic state, naturally enforced via pre-execution hooks. Hooks see the actual git branch and apply the right policy. This combines plan mode + deny-list at exactly the right enforcement layer.",
          incorrect: {
            "A": "Documentation is not enforcement; the model may forget or misclassify.",
            "C": "Trusting the model for safety-critical branch-specific rules is brittle.",
            "D": "Blocking entirely sacrifices the use case.",
            "E": "Manual env vars are error-prone and not auditable."
          }
        }
      },
      {
        id: "5-14",
        domain: "Context Management",
        type: "single",
        question: "An organization runs a multi-tenant agent platform. A bug in tenant isolation could leak Tenant A's context into Tenant B's session. Which architectural property MOST reduces the blast radius if such a bug occurs?",
        options: [
          "A. A single shared context store with tenant_id filtering at read time.",
          "B. Strict per-tenant isolation at every layer: separate context stores (or tenant-keyed encryption with per-tenant keys), separate MCP server credentials per tenant, separate logging, separate caches. Defense-in-depth means no single bug can leak across tenants.",
          "C. Trust application-level tenant_id checks in code reviews.",
          "D. Shared infrastructure with audit logs that detect leaks after the fact.",
          "E. A single global cache for performance, scoped by URL only."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Tenant isolation is a defense-in-depth property: it must be true at storage, network, identity, logging, and caching layers. A single shared layer with tenant_id filtering creates a single bug surface for catastrophic cross-tenant leaks. The exam tests architectural defense-in-depth thinking.",
          incorrect: {
            "A": "Filtering-at-read is one layer; one bug bypasses it.",
            "C": "Code review is not a runtime control.",
            "D": "Detection-after-the-fact does not prevent the leak.",
            "E": "Shared caches with weak scoping are a classic cross-tenant leak vector."
          }
        }
      },
      {
        id: "5-15",
        domain: "Agentic Architecture",
        type: "single",
        question: "Final scenario. You inherit a Claude-based agent with the following symptoms: (i) constraint drift after long tool sequences, (ii) occasional cross-subagent claim contamination in synthesis, (iii) tool selection errors when the surface exceeds ~20 tools, (iv) lost progress on node restarts, (v) inconsistent JSON outputs at high input lengths. You must propose a single architectural overhaul plan. Which set of changes BEST addresses ALL FIVE root causes?",
        options: [
          "A. Switch to a larger model and increase context window.",
          "B. (i) Coordinator/subagent decomposition with focused subagent contexts; (ii) structured outputs with explicit claim-to-source provenance for all subagent-to-coordinator handoffs; (iii) per-subagent tool surfaces sized for accuracy (smaller, sharper) plus rich tool descriptions; (iv) externalized session state at step boundaries for resumption; (v) structured-output enforcement with targeted-retry validation loops.",
          "C. Lower temperature to 0 system-wide and add 'be careful' to all prompts.",
          "D. Replace the entire agent with a deterministic state machine.",
          "E. Disable all subagents and use a monolithic agent."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Each symptom maps to a known CCA-F architectural pattern, and B applies all five: (i) constraint drift → decomposition for fresh contexts; (ii) cross-agent contamination → structured provenance; (iii) selection errors → per-agent focused tool surfaces; (iv) lost progress → externalized state; (v) JSON inconsistency → enforced structured output + validation loops. This is the integrated capstone answer.",
          incorrect: {
            "A": "Bigger context tackles none of these correctly and exacerbates several.",
            "C": "Temperature and exhortation address none of the structural causes.",
            "D": "A deterministic state machine throws away the agentic value; the solution is to architect agentic systems correctly, not eliminate them.",
            "E": "Monoliths worsen (i) and (iii) and don't help others."
          }
        }
      }
    ]
  }
];

// Make available globally for the simple browser site
if (typeof window !== 'undefined') {
  window.MOCK_EXAMS = MOCK_EXAMS;
}
