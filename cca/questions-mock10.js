// ============================================================================
// CCA-F Mock Exam 10 — Production Pipeline Reliability & Multi-Agent Design
// 16 questions | D1 Agentic Architecture, D2 Tool Design,
//               D3 Claude Code, D4 Prompt Engineering, D5 Context Management
// Format: matches Mock 7 / 8 / 9 exactly
// ============================================================================

(function () {
  const MOCK_10 = {
    id: 10,
    title: "Mock Exam 10",
    subtitle: "Production Pipeline Reliability & Multi-Agent Design",
    duration: 45,
    questions: [
      {
        "id": "10-1",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "Your multi-agent research pipeline completes in 18 minutes. Logs show the coordinator dispatches three subagents sequentially: first web search, then document analysis, then synthesis. The web search and document analysis tasks are independent — neither depends on the other's output. Which change would most reduce total runtime?",
        "options": [
          "A. Replace the three subagents with a single larger model that can handle all tasks in one context window.",
          "B. Emit both the web search and document analysis Task() calls in the same coordinator response turn so they execute in parallel, then pass their combined results to the synthesis subagent.",
          "C. Increase the coordinator's max_tokens so it can plan all three tasks simultaneously before dispatching any.",
          "D. Switch the order to document analysis first, then web search, to reduce average wait time."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Parallel execution requires emitting multiple Task() calls in a single coordinator response turn — not sequentially across turns. Since web search and document analysis are independent, running them in parallel roughly halves the time for those two phases. Options A and C don't address the sequential dispatch problem. Option D changes order but not concurrency."
        }
      },
      {
        "id": "10-2",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "A document analysis subagent successfully processes 47 of 50 documents, then hits a rate limit on the 48th. The subagent has already extracted structured summaries from all 47 completed documents. What should it return to the coordinator?",
        "options": [
          "A. Return an empty result set marked as successful to avoid disrupting the coordinator's flow.",
          "B. Raise an exception that propagates up and terminates the entire pipeline.",
          "C. Retry the failed document in a tight loop until the rate limit clears, then return all 50 results.",
          "D. Return structured error context: failure type (rate limit), the 47 partial results already completed, the 3 unprocessed document IDs, and isRetryable: true."
        ],
        "correct": ["D"],
        "explanation": {
          "correct": "Structured error context lets the coordinator make intelligent recovery decisions — it can use the 47 partial results immediately, schedule a retry for the 3 remaining documents, or escalate. Option A silently loses information. Option B discards 47 completed results unnecessarily. Option C tight-loop retrying from the subagent worsens rate limit pressure and hides the failure from the coordinator."
        }
      },
      {
        "id": "10-3",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "A coordinator agent decomposes 'analyze global supply chain risks' into subtasks: 'shipping delays in Asia', 'port congestion in Europe', and 'freight cost trends in North America'. The final report completely omits raw material shortages, geopolitical tariff risks, and last-mile delivery failures. Each subagent completed its assigned task successfully. What is the root cause?",
        "options": [
          "A. The synthesis agent failed to identify gaps in the findings it received.",
          "B. The subagents used search queries that were too narrow and missed relevant sources.",
          "C. The coordinator's task decomposition did not cover the full domain — it only assigned three of the six major supply chain risk categories.",
          "D. The context window was too small to hold findings from all risk categories simultaneously."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Coverage gaps always trace back to the coordinator's decomposition logic. The subagents executed correctly within their assigned scopes. The problem is upstream: the coordinator didn't assign subtasks for raw material shortages, tariff risks, or last-mile failures. Options A and B incorrectly blame downstream agents that performed correctly. Option D misdiagnoses the cause as a context limitation."
        }
      },
      {
        "id": "10-4",
        "domain": "Agentic Architecture",
        "type": "single",
        "question": "You used Claude Code to explore a payment service codebase for 3 hours yesterday. During that session Claude discovered that the payment processor uses a custom retry library. Overnight, the team refactored the retry logic entirely. Today you need to continue the security audit. What is the best approach?",
        "options": [
          "A. Resume yesterday's session with --resume so Claude can continue from where it left off with full context.",
          "B. Fork yesterday's session and re-read only the refactored files to update the retry-related findings.",
          "C. Start a fresh session, inject a structured summary of yesterday's key findings, and note that the retry library was refactored (so Claude will re-read it rather than relying on stale tool results).",
          "D. Resume the session and re-read every file in the codebase to ensure all context is current."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "When code has changed since the session, prior tool results are stale and actively misleading. A fresh session with an injected structured summary preserves the valuable insights from yesterday while preventing Claude from reasoning on outdated retry logic. Option A resumes with stale context. Option B forks but retains the stale context for everything else. Option D wastes the entire context window re-reading unchanged files."
        }
      },
      {
        "id": "10-5",
        "domain": "Tool Design",
        "type": "single",
        "question": "Your agent has two tools: search_products (description: 'Search for products') and search_inventory (description: 'Search inventory'). Production logs show the agent calls search_products when users ask about stock levels 34% of the time. Both tools accept similar query strings. What is the highest-leverage first fix?",
        "options": [
          "A. Add a system prompt instruction: 'Always use search_inventory for stock and availability questions.'",
          "B. Expand each tool description to include: specific input formats, example queries it handles, explicit use-case boundaries, and a 'Do NOT use for X — use Y instead' statement.",
          "C. Merge both tools into a unified search tool that internally routes based on query content.",
          "D. Add 5-8 few-shot examples showing correct tool selection before fixing the descriptions."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Tool descriptions are the primary routing mechanism — more influential than system prompt instructions or few-shot examples. Minimal, overlapping descriptions cause misrouting. Expanding each description with input formats, example queries, and explicit boundaries (e.g., 'Do NOT use for stock queries — use search_inventory') fixes the root cause. Option A is a probabilistic workaround. Option C is over-engineered for a description problem. Option D adds cost without fixing the root cause."
        }
      },
      {
        "id": "10-6",
        "domain": "Tool Design",
        "type": "single",
        "question": "Your multi-agent pipeline has a synthesis agent with access to 14 tools: 8 search tools, 3 document loaders, and 3 synthesis-specific tools. You observe the synthesis agent frequently calls search tools instead of synthesizing findings provided by the coordinator. What is the most likely cause and correct fix?",
        "options": [
          "A. The synthesis agent's system prompt doesn't explicitly prohibit search tool use. Add a rule: 'Never use search tools.'",
          "B. The search tool descriptions are more detailed than the synthesis tools, biasing selection. Improve the synthesis tool descriptions.",
          "C. Having 14 tools degrades tool selection reliability. Restrict the synthesis agent's available tools to only the 3 synthesis-specific tools using allowedTools scoping.",
          "D. The coordinator is not passing enough context, causing the synthesis agent to fall back to search."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Agents given access to tools outside their role tend to misuse them, and performance degrades when an agent has more than 4-5 tools simultaneously. The correct fix is least-privilege tool scoping: restrict the synthesis agent to only the tools it needs. Option A is a probabilistic prompt-based fix. Option B addresses descriptions but not the fundamental over-provisioning. Option D may be a contributing factor but the primary issue is tool quantity and scope."
        }
      },
      {
        "id": "10-7",
        "domain": "Tool Design",
        "type": "single",
        "question": "Your team wants to add a Slack MCP server for team notifications and a PostgreSQL MCP server for production database queries. The Slack server should be available to all developers. The PostgreSQL server should only be available to you personally for exploratory queries during development. How should you configure these?",
        "options": [
          "A. Put both in .mcp.json in the project root with each developer's credentials hardcoded.",
          "B. Put both in ~/.claude.json so they're always available on your machine only.",
          "C. Put the Slack server in .mcp.json (version controlled, team-shared) with ${SLACK_TOKEN} environment variable expansion. Put the PostgreSQL server in ~/.claude.json (user-level, not shared).",
          "D. Create two separate .mcp.json files — one for Slack in the root and one for PostgreSQL in your home directory."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Project-scoped .mcp.json is version controlled and shared with the team — correct for the Slack server. User-level ~/.claude.json is not shared and stays on your machine — correct for the personal PostgreSQL exploratory server. Credentials must always use environment variable expansion (${SLACK_TOKEN}) not hardcoded values. Option A commits credentials to git. Option B makes both servers personal only. Option D doesn't match how MCP configuration scoping works."
        }
      },
      {
        "id": "10-8",
        "domain": "Claude Code",
        "type": "single",
        "question": "Your team's .claude/rules/api-endpoints.md convention file applies to all files in the api/ directory. A new engineer reports that when they work on frontend components in src/components/, the API endpoint conventions are also being applied, causing irrelevant suggestions. What is wrong and how do you fix it?",
        "options": [
          "A. The new engineer has an outdated version of Claude Code that doesn't support path-scoped rules. Update their installation.",
          "B. The rule file is missing YAML frontmatter with a glob pattern. Add 'globs: [\"api/**/*\"]' to the frontmatter so rules only activate for files matching that path.",
          "C. Move the rule file from .claude/rules/ into the api/ directory as a local CLAUDE.md.",
          "D. Add a negative instruction to the rule file: 'Do not apply these rules to frontend components.'"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Without YAML frontmatter specifying a glob pattern, rule files apply globally to all files. Adding 'globs: [\"api/**/*\"]' restricts activation to only files matching that path pattern. Option A incorrectly blames the installation. Option C would work but loses the structured .claude/rules/ organization and limits to a single directory (doesn't handle api/ files in subdirectories cleanly). Option D adds a probabilistic instruction instead of fixing the root cause."
        }
      },
      {
        "id": "10-9",
        "domain": "Claude Code",
        "type": "single",
        "question": "A developer creates a /deploy skill for deploying microservices. After running it, other developers report their next Claude Code sessions are confused about which services have been deployed because the deployment output floods the main conversation context. What frontmatter option resolves this without changing the skill's functionality?",
        "options": [
          "A. allowed-tools: [\"Bash\"] — restricts which tools the skill can use.",
          "B. argument-hint: 'service name and environment' — prompts for missing arguments before execution.",
          "C. context: fork — runs the skill in an isolated subagent so verbose deployment output doesn't accumulate in the main conversation context.",
          "D. max-tokens: 2048 — limits the output length of the skill."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Context pollution from verbose skill output is exactly what context: fork solves. It runs the skill in an isolated subagent; only the final result returns to the main conversation, keeping the main context clean. Option A restricts tools but doesn't isolate context. Option B prompts for arguments, unrelated to the context flooding issue. Option D doesn't exist as a valid frontmatter option."
        }
      },
      {
        "id": "10-10",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your invoice extraction pipeline processes 3,000 invoices per week. The system is non-blocking — finance teams review extracted data each Monday morning for the previous week's invoices. Your current real-time API costs are $2,400/month. Your manager asks you to evaluate switching to the Message Batches API. What is the correct assessment?",
        "options": [
          "A. Do not switch — the Batches API has unpredictable latency that could cause finance teams to miss Monday reviews.",
          "B. Switch — the Batches API offers 50% cost savings and the weekly batch processing easily fits within the 24-hour processing window, making it an ideal non-blocking batch workload.",
          "C. Switch only if Anthropic guarantees results within 8 hours for your batch size.",
          "D. Keep real-time for speed; the $2,400/month cost is acceptable for the reliability guarantee."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "This is a perfect batch candidate: the workflow is non-blocking (finance reviews Monday morning, not immediately), the volume is predictable, and the 24-hour processing window comfortably fits a weekly batch submitted by Sunday evening. The 50% cost savings would reduce costs to ~$1,200/month. Option A incorrectly treats this as a blocking workflow. Option C adds an unnecessary SLA requirement for a workflow with ample time buffer. Option D foregoes savings without justification."
        }
      },
      {
        "id": "10-11",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "You're building a contract analysis system. Contracts sometimes include an arbitration clause and sometimes don't. Your schema has 'arbitration_clause' as a required string field. In testing, the model fabricates placeholder text like 'Standard arbitration applies' for contracts that contain no arbitration clause. What schema change prevents fabrication?",
        "options": [
          "A. Add an instruction to the system prompt: 'Only extract the arbitration clause if it is explicitly present in the document.'",
          "B. Add a post-processing step that checks extracted clauses against a known-valid clause database.",
          "C. Make the field optional and nullable: type: [\"string\", \"null\"], so the model can return null when no clause is present.",
          "D. Add an 'arbitration_clause_confidence' field (0-100) and filter results below 80."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Required schema fields force the model to provide a value — when the data doesn't exist in the source, the model fabricates plausible-sounding content. Making the field nullable gives the model a valid way to represent absence (null) without fabricating. Option A is a probabilistic prompt instruction that doesn't fix the schema-level requirement. Option B adds downstream checking but doesn't prevent fabrication. Option D adds complexity and still doesn't fix the required field problem."
        }
      },
      {
        "id": "10-12",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your data extraction pipeline intermittently returns conversational responses like 'I found the following information...' instead of a structured JSON object, breaking your downstream parsing. You've tried adding 'Always respond in JSON format' to the system prompt but the issue persists. What is the most reliable fix?",
        "options": [
          "A. Add more explicit JSON formatting instructions and examples to the system prompt.",
          "B. Implement retry logic that detects non-JSON responses and re-prompts with stronger formatting instructions.",
          "C. Set tool_choice: \"any\" and define your output schema as a tool — this guarantees the model outputs a structured tool call rather than conversational text.",
          "D. Switch to a more instruction-following model variant."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "System prompt JSON instructions are probabilistic — the model can still produce text responses. tool_choice: \"any\" forces the model to call a tool (producing structured JSON matching your schema) rather than responding with text. This is the only guaranteed mechanism for structured output. Options A and B improve compliance rate but don't eliminate the probability of text responses. Option D changes the model but doesn't address the fundamental probabilistic nature of prompt-based instructions."
        }
      },
      {
        "id": "10-13",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your pipeline extracts shipping addresses from order confirmation emails. For domestic orders, extraction succeeds consistently. For international orders with non-standard address formats (e.g., Japanese prefecture-city-ward structure), the extraction fails schema validation and retries 3 times before giving up. Each retry produces the same invalid output. What is the most effective fix?",
        "options": [
          "A. Increase the retry limit from 3 to 8 to give the model more attempts to produce valid output.",
          "B. Identify that retries fail because the schema doesn't accommodate international address structures — add flexible address fields (address_line_1, address_line_2, city, administrative_region, postal_code, country) rather than a US-centric schema.",
          "C. Add few-shot examples of US domestic addresses to improve the model's address extraction accuracy.",
          "D. Pre-process international emails through a translation step before extraction."
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "When retries consistently fail, the error is unresolvable with the current schema — the data exists but the schema can't represent it. International addresses don't fit US-centric schemas (state, zip, street). The fix is schema redesign to accommodate multiple address formats. Option A wastes API calls on an unresolvable schema mismatch. Option C adds US examples, worsening international bias. Option D adds complexity and translation errors without fixing the schema."
        }
      },
      {
        "id": "10-14",
        "domain": "Context Management",
        "type": "single",
        "question": "Your synthesis agent receives a 68,000-token input: aggregated findings from 12 research subagents. The final synthesis report is missing critical findings about market regulatory changes, which were covered in subagents 5 and 6 — positioned in the middle of the input. Switching to a model with a larger context window didn't help. What should you change?",
        "options": [
          "A. Reduce the number of subagents from 12 to 6 so each agent's output is smaller.",
          "B. Implement rotating order so each subagent's output appears first on alternating runs.",
          "C. Place a 'Key Findings Summary' block at the top of the synthesis input containing the most important findings from all subagents, then organize detailed outputs with explicit section headers.",
          "D. Stream subagent results to the synthesis agent as they complete rather than batching all inputs together."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Lost-in-the-middle is an attention phenomenon, not a context size limitation — larger windows don't fix it. Models reliably attend to content at the beginning and end of long inputs. Placing key findings at the top ensures critical regulatory findings get reliable attention, while section headers anchor attention throughout the detailed body. Option A reduces coverage. Option B rotates order but doesn't address the fundamental attention pattern. Option D addresses latency, not attention quality."
        }
      },
      {
        "id": "10-15",
        "domain": "Context Management",
        "type": "single",
        "question": "A customer contacts your support agent about three issues over a 45-minute session: a missing delivery ($89.99 order), a billing overcharge ($23.50), and a defective product (Order #ORD-4471). After resolving the first two issues, the agent references the wrong order amount when discussing the product defect. What architecture change prevents this?",
        "options": [
          "A. Limit support sessions to one issue at a time to prevent context mixing.",
          "B. Increase the context window to retain the full conversation history without compression.",
          "C. Extract critical transactional facts (order IDs, amounts, issue types) into a persistent case-facts block that is included verbatim in every prompt, outside the summarization pipeline.",
          "D. Summarize the resolved issues more aggressively to free up context for the active issue."
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Progressive summarization compresses old conversation turns but loses exact numerical values — $89.99 becomes 'a missing delivery issue' and $23.50 becomes 'a billing concern'. A persistent case-facts block (structured JSON with exact amounts, order IDs, timestamps) is included verbatim in every prompt, preserving critical data outside the lossy summarization pipeline. Option A degrades customer experience unnecessarily. Option B doesn't fix the lossy compression problem. Option D makes it worse — more aggressive summarization loses more numerical precision."
        }
      },
      {
        "id": "10-16",
        "domain": "Context Management",
        "type": "single",
        "question": "A market research report cites two authoritative sources with conflicting data: the IMF estimates global AI investment at $340 billion in 2024, while a Goldman Sachs report estimates $280 billion for the same period. Your synthesis agent must include investment figures in its final report. What is the correct approach?",
        "options": [
          "A. Average the two figures and report '$310 billion' as the consensus estimate.",
          "B. Use the more authoritative source (IMF) and report only its figure.",
          "C. Omit the investment figure entirely since the sources disagree and including conflicting data would confuse readers.",
          "D. Present both figures with source attribution and explicitly note the discrepancy: 'Investment estimates vary by source: IMF reports $340B while Goldman Sachs reports $280B for 2024.'"
        ],
        "correct": ["D"],
        "explanation": {
          "correct": "When credible sources conflict, the correct approach is to preserve both data points with attribution and flag the discrepancy — letting the reader assess. Option A fabricates a number neither source supports. Option B arbitrarily resolves a genuine methodological disagreement (IMF and Goldman Sachs use different measurement criteria). Option C loses information from both sources; preserving the conflict with context is more useful than omission."
        }
      }
    ]
  };

  if (typeof window !== 'undefined') {
    if (!Array.isArray(window.MOCK_EXAMS)) window.MOCK_EXAMS = [];
    if (!window.MOCK_EXAMS.find(m => m.id === MOCK_10.id)) {
      window.MOCK_EXAMS.push(MOCK_10);
    }
  }
})();
