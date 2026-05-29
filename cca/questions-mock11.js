// ============================================================================
// CCA-F Mock Exam 11 — Advanced Orchestration & Real-World Tradeoffs
// 16 questions | D1 Agentic Architecture (5), D2 Tool Design & MCP (3),
//               D3 Claude Code (3), D4 Prompt Engineering (3), D5 Context (2)
// Format: matches Mock 10 exactly
// ============================================================================

(function () {
  const MOCK_11 = {
    id: 11,
    title: "Mock Exam 11",
    subtitle: "Advanced Orchestration & Real-World Tradeoffs",
    duration: 45,
    questions: [

      // ── D1: AGENTIC ARCHITECTURE (5 questions) ──────────────────────────────

      {
        "id": "11-1",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "Your financial compliance agent calls the Claude API and receives a response where stop_reason is 'tool_use'. The response content array contains both a text block ('I will check the transaction history now') and a tool_use block. Your current loop only processes the tool_use block and discards the text. Is this correct?",
        "options": [
          "A. No — the loop must parse the text block first to confirm Claude's intent, then decide whether to execute the tool.",
          "B. Yes — when stop_reason is 'tool_use', only tool_use blocks require action; text blocks in the same response are incidental and safe to discard for loop control purposes.",
          "C. No — receiving both text and a tool_use block in one response indicates an API error. Retry the request.",
          "D. No — the loop should extract key phrases from the text block and append them to the next user message before executing the tool."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "When stop_reason is 'tool_use', the loop control signal is unambiguous — execute the tool_use blocks and continue the loop. Claude often emits a brief reasoning text alongside a tool call (e.g., 'I will now look up the transaction'). This text is informational and does not change loop logic. The critical requirement is to append the FULL assistant response (including both the text block and the tool_use block) to the message history before the next API call — but the presence of text does not alter the stop_reason-driven control flow."
        }
      },

      {
        "id": "11-2",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "A coordinator agent dispatches a patent search subagent and a regulatory compliance subagent in parallel for a drug approval research task. The compliance subagent finishes in 8 minutes. The patent search subagent returns a rate-limit error after 2 minutes with isRetryable: true. The coordinator needs to complete the full report. What is the correct coordinator action?",
        "options": [
          "A. Abort the entire pipeline and ask the user to retry later since one subagent failed.",
          "B. Use the compliance results immediately, schedule a retry for the patent search subagent with exponential backoff, and merge the patent results into the report when they arrive.",
          "C. Re-run both subagents from scratch in a fresh coordinator session to ensure result consistency.",
          "D. Proceed with the report using only the compliance results and omit any mention of patent status."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Structured error context with isRetryable: true signals the coordinator to retry the failed subagent — not abort the entire pipeline. The compliance results are valid and immediately usable. The coordinator should use the compliance findings, retry the patent search (with backoff to respect the rate limit), and merge the results when they arrive. Option A discards valid work. Option C redundantly re-runs a successful subagent. Option D silently omits a required section, producing an incomplete report without disclosing the gap."
        }
      },

      {
        "id": "11-3",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "Your e-commerce support agent handles 800 tickets/day. A product manager proposes adding an auto-refund feature: if the agent's self-assessed confidence is above 90%, automatically issue a refund without human review. During the first week, three incorrect refunds are issued — each case the agent rated as 95% confident. What is the root cause and correct fix?",
        "options": [
          "A. The confidence threshold is too high at 90%; lower it to 75% so fewer edge cases slip through.",
          "B. LLM self-reported confidence is poorly calibrated — high confidence does not guarantee correctness. Move the refund eligibility check into the refund tool's code as a programmatic rule (e.g., order age < 30 days, amount < $150, item condition = unopened).",
          "C. Add more few-shot examples of correct refund decisions to improve the model's self-rating accuracy.",
          "D. Require the agent to explain its reasoning before each refund and add a prompt instruction to only rate 90%+ confidence when the explanation is complete."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Self-reported confidence from an LLM is not a reliable proxy for factual correctness — models routinely assign high confidence to wrong answers, especially on edge cases. The fix is to remove confidence-based auto-approval entirely and implement the eligibility rules deterministically inside the refund tool: if the order is within 30 days, under $150, and marked unopened, the tool approves automatically; otherwise it escalates. Option A moves the threshold without fixing the underlying calibration problem. Options C and D attempt to improve self-rating, which is an unreliable signal by design."
        }
      },

      {
        "id": "11-4",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "You are building a long-running competitive intelligence agent that runs weekly 4-hour research sessions. Each session builds on the previous week's findings. Midway through last week's session, the server restarted and the session was lost. This week, you want to continue from last week's checkpoint AND explore a speculative 'what if a competitor acquires Company X' scenario simultaneously, without the speculative analysis polluting the main research thread. Which combination of session features achieves this?",
        "options": [
          "A. Use --resume to continue last week's session, then use fork_session to branch a speculative analysis from the current point.",
          "B. Use fork_session on last week's checkpoint to create a continuation, then start a fully separate fresh session for the speculative scenario.",
          "C. Use --resume to restore the session and run both the continuation and speculative analysis as sequential prompts within the same thread.",
          "D. Start two fresh sessions — one with a summary of last week's findings injected as context, and one empty for the speculative scenario."
        ],
        "correct": ["A"],
        "explanation": {
          "correct": "--resume restores the exact conversation state of the interrupted session (the canonical main thread), picking up exactly where the restart cut off. Once resumed, fork_session creates an independent branch from the current state — the speculative scenario runs in the fork, inheriting all prior research context but diverging independently, so speculative findings never pollute the main thread. Option B's fork approach works for branching but loses the resume benefit; you'd need to start from the checkpoint, not the mid-session state. Option C runs both analyses in the same thread, causing cross-contamination. Option D loses the precise session state from the interrupted run."
        }
      },

      {
        "id": "11-5",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "A legal document review agent processes contracts. For ambiguous indemnification clauses, the agent currently picks the interpretation that appears more frequently in the document and proceeds. Your legal team reports 12% of reviewed contracts were processed with the wrong interpretation applied. What architectural change eliminates the heuristic selection?",
        "options": [
          "A. Add a confidence threshold: only apply an interpretation if the agent rates it above 80% confidence.",
          "B. When ambiguity is detected (multiple plausible interpretations), pause the agent and surface both interpretations to a human reviewer with explicit attribution, requiring a decision before the agent proceeds.",
          "C. Increase the number of times the agent re-reads the clause — majority vote across three passes determines the correct interpretation.",
          "D. Fine-tune the model on your firm's historical contract interpretations so it learns the correct mapping."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Heuristic selection (most frequent, highest confidence, majority vote) is always the wrong pattern when the data is genuinely ambiguous — none of these methods resolve the ambiguity, they just pick an answer faster. The correct approach is disambiguation: detect ambiguity, surface both interpretations with source attribution to a human, and pause until a decision is made. This matches the exam rule: 'always ask — never guess when multiple valid interpretations exist.' Options A and C use probabilistic signals to mask the ambiguity. Option D may improve accuracy on average but cannot guarantee no misinterpretation on novel clauses."
        }
      },

      // ── D2: TOOL DESIGN & MCP (3 questions) ────────────────────────────────

      {
        "id": "11-6",
        "domain": "Tool Design",
        "type": "single",
        "question": "Your agent has a 'search_orders' tool with the description: 'Search for orders.' Users report that when they ask 'Has my return for order #4821 been processed?', the agent calls search_orders but retrieves the original order instead of looking up the return status. A separate 'search_returns' tool exists with the description: 'Search returns.' What is the minimal change that fixes the misrouting?",
        "options": [
          "A. Add a system prompt rule: 'When the user mentions a return, always call search_returns first.'",
          "B. Rewrite both tool descriptions to include: trigger keywords, example user queries each tool handles, what it does NOT handle, and a redirect to the other tool for boundary cases.",
          "C. Merge search_orders and search_returns into a single 'search' tool and use an internal action parameter to distinguish queries.",
          "D. Add 10 few-shot examples showing correct tool selection before fixing the descriptions."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Tool descriptions are the primary routing mechanism — they are more influential than system prompt instructions or few-shot examples. The root cause is that both descriptions are minimal and overlapping. The fix is to expand each description: for search_orders, add 'Use for: original purchase history, shipment tracking, order status. Do NOT use for return or refund status — use search_returns instead.' The reverse for search_returns. This gives the model unambiguous selection criteria. Option A is a probabilistic workaround. Option C eliminates granularity. Option D adds cost without fixing the root cause description problem."
        }
      },

      {
        "id": "11-7",
        "domain": "Tool Design",
        "type": "single",
        "question": "Your team is setting up Claude Code for a new microservices project. The project has: (1) a shared Datadog MCP server for observability — all engineers need it; (2) a personal GitHub Copilot integration you use for local development; (3) a staging database MCP server only the backend team should access. Where should each be configured?",
        "options": [
          "A. All three in .mcp.json at the project root — everything in one place for consistency.",
          "B. Datadog in .mcp.json (team-shared); personal GitHub Copilot in ~/.claude.json (personal); staging DB in .mcp.json with access documented in README so only backend devs enable it.",
          "C. Datadog in .mcp.json; personal GitHub Copilot in ~/.claude.json; staging DB in a separate .mcp.json inside the backend/ subdirectory so only backend engineers encounter it.",
          "D. All three in ~/.claude.json — keeps them out of version control and avoids security concerns."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Datadog is team-wide → .mcp.json at the project root (version-controlled, all engineers receive it). Personal GitHub Copilot integration is personal → ~/.claude.json (not shared). The staging DB needs controlled access: placing it in a .mcp.json within the backend/ subdirectory scopes it to engineers working in that directory. Option B's README-only approach relies on engineers manually not enabling it — not a real access control. Option A exposes the personal tool and staging DB to all engineers. Option D removes all team sharing."
        }
      },

      {
        "id": "11-8",
        "domain": "Tool Design",
        "type": "single",
        "question": "You are designing an MCP server for a healthcare application. The server needs to: (A) expose patient vitals history for context during a consultation, (B) allow a nurse agent to update medication dosages, and (C) allow a scheduling agent to book follow-up appointments. How should these three capabilities be exposed?",
        "options": [
          "A. All three as MCP tools — tools handle both read and write operations uniformly.",
          "B. Patient vitals history as an MCP resource (read-only context); medication dosage update and appointment booking as MCP tools (side-effecting actions).",
          "C. All three as MCP resources — resources are safer and prevent accidental writes.",
          "D. Patient vitals as a tool (requires authentication to access), dosage update and scheduling as resources (agents can pull them on demand)."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "MCP distinguishes resources (read-only data sources the host fetches for context) from tools (callable actions with side effects). Patient vitals history is read-only context → MCP resource. Medication dosage updates and appointment bookings are side-effecting actions → MCP tools. This distinction matters: MCP clients render resources and tools differently in their UI, and tools require explicit model invocation. Option A ignores the resource/tool distinction. Option C incorrectly models side-effecting operations as read-only resources. Option D reverses the correct classification."
        }
      },

      // ── D3: CLAUDE CODE (3 questions) ───────────────────────────────────────

      {
        "id": "11-9",
        "domain": "Claude Code",
        "type": "single",
        "question": "Your team maintains a monorepo with React frontend (src/), Python backend (api/), and infrastructure-as-code (infra/). You want Claude Code to enforce: ESLint rules for all .tsx files, PEP 8 for all .py files, and Terraform formatting for .tf files — with no cross-contamination (Python rules shouldn't appear for frontend work). What is the correct configuration?",
        "options": [
          "A. Create a single CLAUDE.md at the project root listing all three rule sets and rely on Claude to apply the relevant ones per file.",
          "B. Create three separate rule files in .claude/rules/ — each with YAML frontmatter glob patterns scoping them to their respective file extensions: '*.tsx', '*.py', '*.tf'.",
          "C. Create three separate CLAUDE.md files — one in src/, one in api/, and one in infra/.",
          "D. Add all rules to a single .claude/rules/all-rules.md without glob frontmatter and add a system prompt note explaining which rules apply to which files."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": ".claude/rules/ files with YAML glob frontmatter (globs: ['*.tsx'], globs: ['*.py'], globs: ['*.tf']) apply each rule set only to matching files, regardless of directory. This prevents cross-contamination: editing a Python file won't surface ESLint rules. Option A relies on Claude's judgment to filter rules — probabilistic and inconsistent. Option C works for directory scoping but breaks for files of the same type in multiple directories. Option D without glob frontmatter applies all rules globally to all files, recreating the cross-contamination problem."
        }
      },

      {
        "id": "11-10",
        "domain": "Claude Code",
        "type": "single",
        "question": "You need to integrate Claude Code into a GitHub Actions workflow that runs on every pull request. The workflow should: read changed files, run the test suite, and post a review comment — but must never push commits, modify files, or call external APIs. Which configuration correctly enforces this?",
        "options": [
          "A. Add a system prompt: 'You are in read-only CI mode. Do not make any changes to the repository.'",
          "B. Use claude -p with allowedTools restricted to [\"Read\", \"Glob\", \"Grep\", \"Bash\"] where Bash is scoped to run tests only — explicitly excluding Write, Edit, and any external API tools.",
          "C. Run claude without -p in interactive mode and let the GitHub Actions runner prevent file writes via filesystem permissions.",
          "D. Use CLAUDE_HEADLESS=true and set allowedTools to read-only tools."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "The -p flag is the only documented mechanism for non-interactive (headless) Claude Code execution in CI. allowedTools restricts the available tool set: excluding Write and Edit prevents file modifications; scoping Bash to test commands prevents external API calls or deployments. This gives deterministic, auditable enforcement. Option A is a probabilistic system-prompt instruction that can be bypassed. Option C relies on filesystem permissions to catch what should be architected out — also doesn't prevent external API calls. Option D uses CLAUDE_HEADLESS=true which does not exist."
        }
      },

      {
        "id": "11-11",
        "domain": "Claude Code",
        "type": "single",
        "question": "An engineering lead wants all developers to receive updated API versioning standards when they clone the repository. They currently have the standards documented in their personal ~/.claude/CLAUDE.md. After sharing the file path with the team, new developers report Claude Code doesn't apply any of the versioning conventions. What is the problem?",
        "options": [
          "A. The ~/.claude/CLAUDE.md file requires manual activation with a Claude Code flag before it takes effect.",
          "B. ~/.claude/CLAUDE.md is user-scoped and personal — it is not shared via git and invisible to other developers. The standards must be placed in ./CLAUDE.md (project-level, committed to the repository) to be shared with the team.",
          "C. The file path syntax is wrong — personal CLAUDE.md files must be named .claude-personal.md to be distinguished from project-level files.",
          "D. The standards only apply if Claude Code is restarted after the file is updated."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "This is the most-tested Claude Code configuration concept: ~/.claude/CLAUDE.md is user-level configuration that exists only on the individual's machine. It is never committed to git and therefore never reaches other developers. Team standards must live in ./CLAUDE.md at the project root — this file is committed and shared via git, so all developers receive it automatically when they clone or pull the repository. Options A, C, and D describe behaviors that don't exist."
        }
      },

      // ── D4: PROMPT ENGINEERING (3 questions) ────────────────────────────────

      {
        "id": "11-12",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your customer escalation classifier must route tickets to one of five queues: Billing, Technical, Returns, Complaints, and General. The system uses tool_choice: 'auto' and defines a classify_ticket tool. In production, 8% of tickets receive a conversational response ('This seems like a billing issue, you should contact...') instead of a structured tool call. What change guarantees 0% text-response leakage?",
        "options": [
          "A. Add a system prompt instruction: 'Always use the classify_ticket tool. Never respond with text.'",
          "B. Add 20 few-shot examples where every example uses the tool, not text.",
          "C. Change tool_choice from 'auto' to 'any' — this forces the model to call a tool in every response, eliminating text-only responses.",
          "D. Switch to a larger model that more reliably follows tool-use instructions."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "tool_choice: 'auto' permits the model to choose between calling a tool or returning text — the 8% leakage is expected behavior with 'auto'. Changing to tool_choice: 'any' forces the model to always call a tool, making text-only responses structurally impossible. This is the only guaranteed mechanism for 100% structured output. Option A is a probabilistic prompt instruction — 'auto' still allows text. Option B improves compliance rate but can't eliminate the probability. Option D changes the model but not the fundamental permissiveness of 'auto'."
        }
      },

      {
        "id": "11-13",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your pipeline extracts key dates from financial reports: earnings_date, fiscal_year_end, and board_meeting_date. Testing shows that for quarterly reports (which only contain earnings_date), the model fabricates plausible-sounding dates for fiscal_year_end and board_meeting_date. The current schema marks all three fields as required strings. What is the most targeted fix?",
        "options": [
          "A. Add a system prompt: 'Only extract dates that are explicitly stated in the document. Do not infer or estimate.'",
          "B. Change all three fields to type: [\"string\", \"null\"] so the model can return null for dates not present in the document.",
          "C. Add a post-processing validation step that cross-references extracted dates against a known calendar database.",
          "D. Add a 'date_confidence' field (0-100) for each date and filter results below 85."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Required string fields force the model to provide a value — when the data doesn't exist in the document, fabrication is the only option available to satisfy the schema constraint. Making the fields nullable (type: ['string', 'null']) gives the model a valid way to represent absence: it returns null for dates not present rather than inventing them. Option A is a probabilistic instruction that doesn't change the required-field constraint. Option C adds downstream detection but doesn't prevent fabrication at the source. Option D's confidence filtering doesn't fix the schema-level problem."
        }
      },

      {
        "id": "11-14",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your content moderation pipeline processes 50,000 user posts per day. Each post needs to be classified as Safe, Review, or Remove. The pipeline is non-blocking — human moderators review the Remove queue each morning and Safe posts are published with a 1-hour delay. Your current real-time API spend is $4,800/month. A colleague suggests the Message Batches API. What is the correct analysis?",
        "options": [
          "A. Do not switch — the 24-hour processing window is too unpredictable for a content moderation use case where speed matters.",
          "B. Switch all classifications to the Batches API — the non-blocking nature of both queues and the 1-hour Safe publication delay easily fit within a 24-hour batch window, saving approximately $2,400/month.",
          "C. Switch only the Remove queue to the Batches API since those posts require human review anyway. Keep real-time for Safe and Review.",
          "D. Switch the Batches API for overnight low-traffic hours only and keep real-time for peak daytime hours."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Both workflows are non-blocking: Remove posts require human moderator review each morning (not instant action), and Safe posts have a 1-hour publication delay. Neither requires real-time API response. The 24-hour Batches API processing window easily covers both — batch posts hourly and results arrive well within the review window. The 50% cost savings would cut $4,800/month to ~$2,400/month. Option A incorrectly characterizes this as a blocking workflow. Option C introduces unnecessary complexity by splitting queues — all three classifications can batch. Option D adds operational complexity without benefit."
        }
      },

      // ── D5: CONTEXT MANAGEMENT (2 questions) ────────────────────────────────

      {
        "id": "11-15",
        "domain": "Context Management",
        "type": "single",
        "question": "A Claude Code security audit session has been running for 2 hours. You've discovered 23 vulnerabilities across 140 files. The context window is at 87% capacity. Claude's recent responses have started referencing 'common patterns in files of this type' rather than citing specific earlier findings. What should you do?",
        "options": [
          "A. Switch to a model with a larger context window to continue without interruption.",
          "B. Run /compact to reduce context window usage, and before compacting, write the 23 discovered vulnerabilities with exact file paths and line numbers to a scratchpad file so they survive the compression.",
          "C. Start a fresh session — at 87% capacity the context is too degraded to continue reliably.",
          "D. Add a system prompt reminder: 'Refer to specific findings from earlier in this session, not general patterns.'"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "The symptom ('typical patterns' instead of 'specific findings') is the hallmark of context window saturation — the model can no longer reliably attend to specific earlier findings because they're buried deep in the window. The correct two-step response: (1) write critical findings (vulnerability locations, exact file paths, line numbers) to a scratchpad file before they're lost, (2) run /compact to compress the conversation and free up window space. The scratchpad preserves critical findings outside the compression pipeline. Option A's larger window doesn't fix the attention degradation already occurring at 87%. Option C discards 2 hours of work unnecessarily. Option D is a probabilistic instruction that can't overcome attention degradation."
        }
      },

      {
        "id": "11-16",
        "domain": "Context Management",
        "type": "single",
        "question": "A customer contacts your support agent about a fraudulent charge of $247.83 on their account (Account #ACT-99142). During the 35-minute session, the agent resolves the fraud claim and processes a refund. Near the end of the session, the customer also asks about upgrading their subscription. When the agent discusses the upgrade pricing, it refers to 'your recent refund' but quotes the amount as '$274.38' — reversing the digits of the actual $247.83 refund. What is the most targeted architectural fix?",
        "options": [
          "A. Reduce summarization frequency so the original conversation is retained longer without compression.",
          "B. Store critical transactional facts (exact charge amount $247.83, account #ACT-99142, refund status, date) in a persistent case-facts JSON block that is included verbatim in every prompt, outside the summarization pipeline.",
          "C. Add a post-response validation step that compares any monetary amounts in Claude's response against the conversation history.",
          "D. Limit sessions to a single issue type to prevent numerical confusion across topics."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "The digit transposition ($247.83 → $274.38) is a classic progressive summarization loss symptom: exact numerical values get compressed into approximate representations in the session summary, and the model reconstructs them imprecisely. The fix is a persistent case-facts block — a structured JSON object containing exact values (amount: 247.83, account: 'ACT-99142', refund_status: 'approved') that is included verbatim in every prompt, bypassing the lossy summarization pipeline entirely. Option A slows the loss but doesn't prevent it. Option C detects errors after they occur but doesn't prevent fabrication. Option D degrades customer experience without fixing the architecture."
        }
      }

    ]
  };

  if (typeof window !== 'undefined') {
    if (!Array.isArray(window.MOCK_EXAMS)) window.MOCK_EXAMS = [];
    if (!window.MOCK_EXAMS.find(m => m.id === MOCK_11.id)) {
      window.MOCK_EXAMS.push(MOCK_11);
    }
  }
})();
