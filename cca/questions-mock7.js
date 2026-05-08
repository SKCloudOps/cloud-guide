// ============================================================================
// CCA-F Mock Exam 7 — Official-Style Bank
// 40 questions adapted from the official sample-questions set + domain practice
// questions. These hew very close to real-exam phrasing and answer style:
// concrete primitives, named flags, specific frontmatter keys, etc.
//
// To install:
//   1. Save this file as questions-mock7.js next to questions.js
//   2. In index.html and exam.html, add this line AFTER the existing scripts:
//        <script src="questions-mock7.js"></script>
//   That's it — Mock 7 will appear in the landing page automatically.
// ============================================================================

(function () {
  const MOCK_7 = {
    id: 7,
    title: "Mock Exam 7",
    subtitle: "Official-Style Bank · Concrete Primitives & Named Mechanisms",
    duration: 60,
    questions: [
      // =====================================================================
      // OFFICIAL SAMPLE QUESTIONS (sample-1 .. sample-12)
      // =====================================================================
      {
        id: "7-1",
        domain: "Agentic Architecture",
        type: "single",
        question: "Customer Support Resolution Agent. Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
        options: [
          "A. Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID.",
          "B. Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.",
          "C. Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details.",
          "D. Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type."
        ],
        correct: ["A"],
        explanation: {
          correct: "When a specific tool sequence is required for critical business logic (verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot.",
          incorrect: {
            "B": "Relies on probabilistic LLM compliance, which is insufficient when errors have financial consequences.",
            "C": "Few-shot examples reduce frequency but do not provide a guarantee.",
            "D": "Addresses tool availability rather than tool ordering, which is not the actual problem."
          }
        }
      },
      {
        id: "7-2",
        domain: "Tool Design & MCP",
        type: "single",
        question: "Customer Support Resolution Agent. Production logs show the agent frequently calls get_customer when users ask about orders (e.g., 'check my order #12345'), instead of calling lookup_order. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What's the most effective first step to improve tool selection reliability?",
        options: [
          "A. Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5–8 examples showing order-related queries routing to lookup_order.",
          "B. Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar alternatives.",
          "C. Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns.",
          "D. Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query."
        ],
        correct: ["B"],
        explanation: {
          correct: "Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, models lack the context to differentiate between similar tools. Option B directly addresses the root cause with a low-effort, high-leverage fix.",
          incorrect: {
            "A": "Few-shot examples add token overhead without fixing the underlying issue.",
            "C": "A routing layer is over-engineered and bypasses the LLM's natural language understanding.",
            "D": "Consolidating tools is a valid architectural choice but requires more effort than warranted when the immediate problem is inadequate descriptions."
          }
        }
      },
      {
        id: "7-3",
        domain: "Context Management",
        type: "single",
        question: "Customer Support Resolution Agent. Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
        options: [
          "A. Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.",
          "B. Have the agent self-report a confidence score (1–10) before each response and automatically route requests to humans when confidence falls below a threshold.",
          "C. Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.",
          "D. Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold."
        ],
        correct: ["A"],
        explanation: {
          correct: "Explicit escalation criteria with few-shot examples directly address the root cause: unclear decision boundaries. This is the proportionate first response before adding infrastructure.",
          incorrect: {
            "B": "LLM self-reported confidence is poorly calibrated — the agent is already incorrectly confident on hard cases.",
            "C": "Over-engineered: requires labeled data and ML infrastructure when prompt optimization hasn't been tried.",
            "D": "Solves a different problem entirely; sentiment doesn't correlate with case complexity, which is the actual issue."
          }
        }
      },
      {
        id: "7-4",
        domain: "Claude Code Configuration",
        type: "single",
        question: "Code Generation with Claude Code. You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?",
        options: [
          "A. In the .claude/commands/ directory in the project repository.",
          "B. In ~/.claude/commands/ in each developer's home directory.",
          "C. In the CLAUDE.md file at the project root.",
          "D. In a .claude/config.json file with a commands array."
        ],
        correct: ["A"],
        explanation: {
          correct: "Project-scoped custom slash commands belong in .claude/commands/ within the repository. They are version-controlled and automatically available to all developers on clone/pull.",
          incorrect: {
            "B": "~/.claude/commands/ is for personal commands not shared via version control.",
            "C": "CLAUDE.md is for project instructions and context, not command definitions.",
            "D": "Describes a configuration mechanism that doesn't exist in Claude Code."
          }
        }
      },
      {
        id: "7-5",
        domain: "Claude Code Configuration",
        type: "single",
        question: "Code Generation with Claude Code. You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
        options: [
          "A. Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.",
          "B. Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries.",
          "C. Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.",
          "D. Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation."
        ],
        correct: ["A"],
        explanation: {
          correct: "Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires.",
          incorrect: {
            "B": "Risks costly rework when dependencies are discovered late.",
            "C": "Assumes you already know the right structure without exploring the code.",
            "D": "Ignores that the complexity is already stated in the requirements, not something that might emerge later."
          }
        }
      },
      {
        id: "7-6",
        domain: "Claude Code Configuration",
        type: "single",
        question: "Code Generation with Claude Code. Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx). You want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?",
        options: [
          "A. Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths.",
          "B. Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies.",
          "C. Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files.",
          "D. Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions."
        ],
        correct: ["A"],
        explanation: {
          correct: ".claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location — essential for test files spread throughout the codebase.",
          incorrect: {
            "B": "Relies on inference rather than explicit matching, making it unreliable.",
            "C": "Skills require manual invocation or rely on Claude choosing to load them, contradicting the need for deterministic 'automatic' application based on file paths.",
            "D": "Can't easily handle files spread across many directories since CLAUDE.md files are directory-bound."
          }
        }
      },
      {
        id: "7-7",
        domain: "Agentic Architecture",
        type: "single",
        question: "Multi-Agent Research System. After running on 'impact of AI on creative industries,' each subagent completes successfully — search finds articles, document analysis summarizes correctly, synthesis produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. The coordinator's logs show it decomposed the topic into: 'AI in digital art creation,' 'AI in graphic design,' and 'AI in photography.' What is the most likely root cause?",
        options: [
          "A. The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents.",
          "B. The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic.",
          "C. The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.",
          "D. The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria."
        ],
        correct: ["B"],
        explanation: {
          correct: "The coordinator's logs reveal the root cause directly: it decomposed 'creative industries' into only visual arts subtasks, completely omitting music, writing, and film. The subagents executed their assigned tasks correctly — the problem is what they were assigned.",
          incorrect: {
            "A": "Blames a downstream agent that is working correctly within its assigned scope.",
            "C": "The search agent succeeded for the topics it was given; broadening its queries does not cover topics that were never assigned.",
            "D": "The document analysis agent only sees what the search agent produces; the issue is upstream of both."
          }
        }
      },
      {
        id: "7-8",
        domain: "Context Management",
        type: "single",
        question: "Multi-Agent Research System. The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?",
        options: [
          "A. Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.",
          "B. Implement automatic retry logic with exponential backoff within the subagent, returning a generic 'search unavailable' status only after all retries are exhausted.",
          "C. Catch the timeout within the subagent and return an empty result set marked as successful.",
          "D. Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow."
        ],
        correct: ["A"],
        explanation: {
          correct: "Structured error context gives the coordinator the information it needs to make intelligent recovery decisions — retry with a modified query, try an alternative approach, or proceed with partial results.",
          incorrect: {
            "B": "Generic status hides valuable context from the coordinator, preventing informed decisions.",
            "C": "Suppresses the error by marking failure as success, which prevents any recovery and risks incomplete research outputs.",
            "D": "Terminates the entire workflow unnecessarily when recovery strategies could succeed."
          }
        }
      },
      {
        id: "7-9",
        domain: "Tool Design & MCP",
        type: "single",
        question: "Multi-Agent Research System. The synthesis agent frequently needs to verify specific claims while combining findings. Currently it returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis with results. This adds 2–3 round trips per task and increases latency by 40%. Evaluation shows 85% of these verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining system reliability?",
        options: [
          "A. Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.",
          "B. Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once.",
          "C. Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator.",
          "D. Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify."
        ],
        correct: ["A"],
        explanation: {
          correct: "Applies the principle of least privilege: give the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving the existing coordination pattern for complex cases.",
          incorrect: {
            "B": "Batching creates blocking dependencies since synthesis steps may depend on earlier verified facts.",
            "C": "Over-provisions the synthesis agent, violating separation of concerns and increasing tool-selection error rate.",
            "D": "Relies on speculative caching that cannot reliably predict what the synthesis agent will need to verify."
          }
        }
      },
      {
        id: "7-10",
        domain: "Claude Code Configuration",
        type: "single",
        question: "Claude Code for CI. Your pipeline script runs claude \"Analyze this pull request for security issues\" but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach to run Claude Code in an automated pipeline?",
        options: [
          "A. Add the -p flag: claude -p \"Analyze this pull request for security issues\"",
          "B. Set the environment variable CLAUDE_HEADLESS=true before running the command.",
          "C. Redirect stdin from /dev/null: claude \"Analyze...\" < /dev/null",
          "D. Add the --batch flag: claude --batch \"Analyze...\""
        ],
        correct: ["A"],
        explanation: {
          correct: "The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input — exactly what CI/CD pipelines require.",
          incorrect: {
            "B": "CLAUDE_HEADLESS is not a real environment variable in Claude Code.",
            "C": "Unix workaround that doesn't properly address Claude Code's command syntax.",
            "D": "--batch is not a real Claude Code flag."
          }
        }
      },
      {
        id: "7-11",
        domain: "Prompt Engineering",
        type: "single",
        question: "Claude Code for CI. Your team wants to reduce API costs for automated analysis. Currently real-time Claude calls power two workflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for its 50% cost savings. How should you evaluate this proposal?",
        options: [
          "A. Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks.",
          "B. Switch both workflows to batch processing with status polling to check for completion.",
          "C. Keep real-time calls for both workflows to avoid batch result ordering issues.",
          "D. Switch both to batch processing with a timeout fallback to real-time if batches take too long."
        ],
        correct: ["A"],
        explanation: {
          correct: "The Message Batches API offers 50% cost savings but has processing times up to 24 hours with no guaranteed latency SLA. Unsuitable for blocking pre-merge checks where developers wait, but ideal for overnight batch jobs.",
          incorrect: {
            "B": "Relying on 'often faster' completion isn't acceptable for blocking workflows.",
            "C": "Misconception — batch results can be correlated using custom_id fields.",
            "D": "Adds unnecessary complexity when the simpler solution is matching each API to its appropriate use case."
          }
        }
      },
      {
        id: "7-12",
        domain: "Prompt Engineering",
        type: "single",
        question: "Claude Code for CI. A pull request modifies 14 files across the stock tracking module. Your single-pass review analyzing all files together produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback — flagging a pattern as problematic in one file while approving identical code elsewhere in the same PR. How should you restructure the review?",
        options: [
          "A. Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.",
          "B. Require developers to split large PRs into smaller submissions of 3–4 files before the automated review runs.",
          "C. Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass.",
          "D. Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs."
        ],
        correct: ["A"],
        explanation: {
          correct: "Splitting reviews into focused passes directly addresses the root cause: attention dilution when processing many files at once. File-by-file analysis ensures consistent depth, while a separate integration pass catches cross-file issues.",
          incorrect: {
            "B": "Shifts burden to developers without improving the system.",
            "C": "Misunderstands that larger context windows don't solve attention quality issues.",
            "D": "Would actually suppress detection of real bugs by requiring consensus on issues that may only be caught intermittently."
          }
        }
      },

      // =====================================================================
      // DOMAIN 1 — AGENTIC ARCHITECTURE (additional)
      // =====================================================================
      {
        id: "7-13",
        domain: "Agentic Architecture",
        type: "single",
        question: "You are implementing an agentic loop for a customer support agent. Which condition should primarily control whether the loop continues or terminates?",
        options: [
          "A. Check if the assistant's text response contains phrases like 'I'm done' or 'task complete'.",
          "B. Inspect the stop_reason field: continue when it's 'tool_use' and terminate when it's 'end_turn'.",
          "C. Set a maximum iteration count (e.g., 10) and terminate when the limit is reached.",
          "D. Parse the assistant's response for a JSON object containing a 'status': 'complete' field."
        ],
        correct: ["B"],
        explanation: {
          correct: "The agentic loop should use stop_reason to determine flow: 'tool_use' means Claude wants to call a tool (continue), 'end_turn' means Claude has finished (terminate).",
          incorrect: {
            "A": "Anti-pattern that relies on parsing natural language.",
            "C": "An iteration cap is a safety net, not the primary control mechanism.",
            "D": "Anti-pattern that relies on parsing text content for a status field."
          }
        }
      },
      {
        id: "7-14",
        domain: "Agentic Architecture",
        type: "single",
        question: "In a multi-agent research system, the coordinator decomposes 'renewable energy trends' into only 'solar panel efficiency' and 'wind turbine costs,' missing geothermal, hydroelectric, and hydrogen. Each subagent's research is thorough for its assigned topic. What should you fix?",
        options: [
          "A. Give the web search subagent broader search queries to find more diverse results.",
          "B. Add instructions to the synthesis agent to identify and flag coverage gaps.",
          "C. Improve the coordinator's task decomposition to ensure broader coverage of the topic domain.",
          "D. Add more subagents specialized in different energy types."
        ],
        correct: ["C"],
        explanation: {
          correct: "The root cause is the coordinator's too-narrow task decomposition. The subagents performed their assigned tasks correctly. The fix is at the coordinator level — it needs to decompose topics more broadly.",
          incorrect: {
            "A": "Tries to fix a downstream agent that isn't broken.",
            "B": "A flag from synthesis is a band-aid; the broader topics were never investigated to begin with.",
            "D": "Adds complexity without addressing the decomposition logic that decides which agents are even invoked."
          }
        }
      },
      {
        id: "7-15",
        domain: "Agentic Architecture",
        type: "single",
        question: "Your coordinator agent needs to pass web search results to a synthesis subagent. The synthesis agent needs to cite sources accurately. What's the best approach for passing this context?",
        options: [
          "A. Include the complete web search results directly in the synthesis subagent's prompt, with structured metadata (source URLs, document names, page numbers) separated from content.",
          "B. Rely on the subagent automatically inheriting the coordinator's conversation history containing the search results.",
          "C. Store search results in a shared database and give the synthesis agent database query tools.",
          "D. Pass only a summary of the search results to keep the synthesis agent's context small."
        ],
        correct: ["A"],
        explanation: {
          correct: "Context must be explicitly provided in the subagent's prompt since subagents don't inherit parent context. Structured data formats that separate content from metadata preserve attribution.",
          incorrect: {
            "B": "Subagents don't inherit coordinator history.",
            "C": "Adds unnecessary complexity for what is fundamentally a context-passing problem.",
            "D": "Loses the source details needed for accurate citations."
          }
        }
      },
      {
        id: "7-16",
        domain: "Agentic Architecture",
        type: "single",
        question: "Your customer support agent processes refunds. Business policy requires that refunds over $500 must be approved by a human. You've added this rule to the system prompt, but production logs show the agent occasionally processes $600+ refunds without escalation. What's the most reliable fix?",
        options: [
          "A. Add more prominent formatting to the $500 rule in the system prompt with bold text and capitalization.",
          "B. Add few-shot examples showing the agent escalating for high-value refunds.",
          "C. Implement a hook that intercepts process_refund tool calls and blocks any refund exceeding $500, redirecting to human escalation.",
          "D. Reduce the agent's max_tokens to force shorter responses that are more likely to follow rules."
        ],
        correct: ["C"],
        explanation: {
          correct: "When business rules require guaranteed compliance (financial thresholds), programmatic enforcement through hooks provides deterministic guarantees. Prompt-based approaches have a non-zero failure rate.",
          incorrect: {
            "A": "Formatting tricks improve adherence marginally but do not provide a guarantee.",
            "B": "Few-shots reduce frequency but do not make the rule unbreakable.",
            "D": "max_tokens has no relationship to rule compliance."
          }
        }
      },
      {
        id: "7-17",
        domain: "Agentic Architecture",
        type: "single",
        question: "You need to review a pull request that modifies 20 files. Which task decomposition strategy is most appropriate?",
        options: [
          "A. Dynamically generate subtasks based on what the agent discovers as it reads each file.",
          "B. Use prompt chaining: analyze each file individually for local issues, then run a cross-file integration pass.",
          "C. Analyze all 20 files in a single pass to maintain full context.",
          "D. Randomly split files into groups of 5 and review each group independently."
        ],
        correct: ["B"],
        explanation: {
          correct: "Prompt chaining is appropriate for predictable multi-aspect reviews. Analyzing files individually avoids attention dilution; a separate cross-file pass catches integration issues.",
          incorrect: {
            "A": "Dynamic decomposition is better for open-ended investigation, not structured reviews.",
            "C": "Causes attention dilution with 20 files.",
            "D": "Loses cross-file context within groups and randomly splits related files."
          }
        }
      },
      {
        id: "7-18",
        domain: "Agentic Architecture",
        type: "single",
        question: "A customer contacts your support agent with three issues: a missing delivery, a billing discrepancy, and a product defect. How should the agent handle this multi-concern request?",
        options: [
          "A. Ask the customer to submit each issue as a separate ticket for better tracking.",
          "B. Handle only the first issue mentioned and tell the customer to call back for the others.",
          "C. Decompose the request into distinct items, investigate each using shared context, then synthesize a unified resolution.",
          "D. Escalate immediately since multi-concern requests are too complex for autonomous resolution."
        ],
        correct: ["C"],
        explanation: {
          correct: "Decompose multi-concern requests into distinct items, investigate each in parallel using shared context (same customer ID, account info), then synthesize a unified resolution.",
          incorrect: {
            "A": "Provides poor service by pushing work onto the customer.",
            "B": "Ignores the other issues and provides poor service.",
            "D": "Escalates unnecessarily when the agent can handle each concern individually."
          }
        }
      },
      {
        id: "7-19",
        domain: "Agentic Architecture",
        type: "single",
        question: "You've been exploring a large codebase with Claude Code for 2 hours. You made significant code changes yesterday, but need to continue analysis today. The session has accumulated many tool results from files that have since changed. What's the best approach?",
        options: [
          "A. Resume the session with --resume and continue where you left off.",
          "B. Start a new session and paste in a structured summary of yesterday's key findings and the specific file changes made.",
          "C. Resume the session and re-read all files to refresh context.",
          "D. Use fork_session to create a new branch from yesterday's session."
        ],
        correct: ["B"],
        explanation: {
          correct: "When prior tool results are stale (files have changed since the session), starting a new session with injected summaries is more reliable than resuming with outdated context.",
          incorrect: {
            "A": "Would resume with stale tool results that no longer reflect the codebase.",
            "C": "Wastes context window re-reading everything; the stale results still contaminate context.",
            "D": "Creates a fork for exploring alternatives, not for handling stale context."
          }
        }
      },

      // =====================================================================
      // DOMAIN 2 — TOOL DESIGN & MCP (additional)
      // =====================================================================
      {
        id: "7-20",
        domain: "Tool Design & MCP",
        type: "single",
        question: "You have two MCP tools: analyze_content ('Analyzes content from various sources') and analyze_document ('Analyzes document content'). The agent frequently picks the wrong one. What's the best fix?",
        options: [
          "A. Rename them to clearly distinct names (e.g., extract_web_results and parse_pdf_document) and rewrite descriptions to explain specific purposes, inputs, and when to use each.",
          "B. Add a system prompt instruction: 'Use analyze_content for web content and analyze_document for PDFs.'",
          "C. Remove one tool and have the remaining tool handle both use cases.",
          "D. Add a tool_choice configuration to force the correct tool based on input patterns."
        ],
        correct: ["A"],
        explanation: {
          correct: "Ambiguous or overlapping tool descriptions cause misrouting. Renaming to clearly differentiated names and rewriting descriptions to specify purpose, inputs, outputs, and boundaries is the canonical fix.",
          incorrect: {
            "B": "A workaround that doesn't fix the root cause; the descriptions remain ambiguous.",
            "C": "Removes functionality unnecessarily.",
            "D": "Requires knowing the correct tool in advance, which defeats the purpose of tool selection."
          }
        }
      },
      {
        id: "7-21",
        domain: "Tool Design & MCP",
        type: "single",
        question: "Your MCP tool for database queries sometimes returns an error. Currently it returns { 'error': 'Operation failed' }. The agent keeps retrying even for non-retryable errors. How should you improve the error response?",
        options: [
          "A. Return structured error metadata with isError flag, errorCategory (transient/validation/business/permission), isRetryable boolean, and a human-readable description.",
          "B. Add a retry count to the error response so the agent knows how many times it has already retried.",
          "C. Return more detailed error messages in plain text so the agent can better understand what went wrong.",
          "D. Implement automatic retries within the MCP tool itself so the agent never sees errors."
        ],
        correct: ["A"],
        explanation: {
          correct: "Structured error responses with errorCategory and isRetryable allow the agent to make appropriate recovery decisions. Generic errors prevent distinguishing retryable transient errors from non-retryable business rule violations.",
          incorrect: {
            "B": "Doesn't tell the agent whether to retry — only how many times it has.",
            "C": "Plain text is better than generic but lacks the structured metadata for programmatic decisions.",
            "D": "Hides information from the agent and prevents agent-level recovery strategies."
          }
        }
      },
      {
        id: "7-22",
        domain: "Tool Design & MCP",
        type: "single",
        question: "Your multi-agent system has a synthesis agent that sometimes performs web searches instead of synthesizing findings. The synthesis agent has access to 12 tools including search tools, document loaders, and synthesis tools. What's the most likely cause and fix?",
        options: [
          "A. The synthesis agent has too many tools. Restrict its tool set to only synthesis-relevant tools, keeping search tools with the search agent.",
          "B. Add stronger instructions to the synthesis agent's prompt telling it not to use search tools.",
          "C. Increase the synthesis agent's max_tokens so it has more capacity to focus on synthesis.",
          "D. Use tool_choice: 'any' to force the agent to use synthesis tools only."
        ],
        correct: ["A"],
        explanation: {
          correct: "Having too many tools (12 vs recommended 4–5) degrades tool selection reliability. Agents with tools outside their specialization tend to misuse them. Scoped tool access — giving each agent only what it needs — is the fix.",
          incorrect: {
            "B": "A prompt-based workaround that doesn't address the underlying selection-surface problem.",
            "C": "max_tokens is unrelated to tool selection.",
            "D": "tool_choice can force a tool call but cannot restrict which tool is chosen."
          }
        }
      },
      {
        id: "7-23",
        domain: "Tool Design & MCP",
        type: "single",
        question: "Your team wants to share a Jira integration MCP server across the project while you personally experiment with a custom analytics MCP server. How should you configure these?",
        options: [
          "A. Put both in ~/.claude.json so they're always available.",
          "B. Put the Jira server in .mcp.json (project-level, version controlled) with environment variable expansion for tokens. Put the analytics server in ~/.claude.json (user-level).",
          "C. Put both in .mcp.json with your personal API keys.",
          "D. Create separate configuration files for each MCP server."
        ],
        correct: ["B"],
        explanation: {
          correct: "Shared team tooling belongs in project-level .mcp.json (version-controlled), using environment variable expansion (${JIRA_TOKEN}) for credentials. Personal/experimental servers belong in user-level ~/.claude.json.",
          incorrect: {
            "A": "Doesn't share with the team since user-level config isn't version-controlled.",
            "C": "Commits personal API keys to version control — a security violation.",
            "D": "Not how MCP server configuration works."
          }
        }
      },
      {
        id: "7-24",
        domain: "Tool Design & MCP",
        type: "single",
        question: "You need to find all files in a codebase that match the pattern '*.test.tsx' and then search for a specific function name within those test files. Which built-in tools should you use?",
        options: [
          "A. Use Bash with find and grep commands for both operations.",
          "B. Use Glob to find files matching **/*.test.tsx, then use Grep to search for the function name within those files.",
          "C. Use Read on every file in the repository and manually check for matches.",
          "D. Use Grep for both — it can find files by pattern and search content."
        ],
        correct: ["B"],
        explanation: {
          correct: "Glob is for file path pattern matching (finding files by name/extension). Grep is for content search (searching file contents for patterns). Each tool is used for its specific purpose.",
          incorrect: {
            "A": "Uses Bash when dedicated, faster, and more reliable tools exist.",
            "C": "Extremely inefficient — reads every file in the repo.",
            "D": "Grep searches content, not file names."
          }
        }
      },

      // =====================================================================
      // DOMAIN 3 — CLAUDE CODE CONFIGURATION (additional)
      // =====================================================================
      {
        id: "7-25",
        domain: "Claude Code Configuration",
        type: "single",
        question: "A new team member reports that Claude Code isn't following the testing conventions that other team members see. After investigation, you find the testing conventions are defined in ~/.claude/CLAUDE.md on other developers' machines. What's the issue?",
        options: [
          "A. The new team member needs to install a Claude Code plugin for testing conventions.",
          "B. The testing conventions are in user-level configuration (~/.claude/CLAUDE.md), which isn't shared via version control. They should be moved to project-level (.claude/CLAUDE.md or root CLAUDE.md).",
          "C. The new team member's Claude Code version is outdated and doesn't support CLAUDE.md.",
          "D. The CLAUDE.md file needs to be added to the .gitignore to prevent configuration conflicts."
        ],
        correct: ["B"],
        explanation: {
          correct: "User-level settings (~/.claude/CLAUDE.md) apply only to that user and aren't shared via version control. Team-wide conventions belong in project-level configuration which is version-controlled and available to everyone.",
          incorrect: {
            "A": "There is no such plugin requirement.",
            "C": "Not a version-compatibility issue — the conventions simply aren't shared.",
            "D": ".gitignore prevents version control, which is the opposite of what's needed."
          }
        }
      },
      {
        id: "7-26",
        domain: "Claude Code Configuration",
        type: "single",
        question: "You want to create a skill that performs comprehensive codebase analysis, which generates verbose output. You don't want this analysis to consume the main conversation's context window. What frontmatter option should you use?",
        options: [
          "A. allowed-tools: ['Read', 'Grep', 'Glob']",
          "B. context: fork",
          "C. argument-hint: 'path to analyze'",
          "D. max-context: 4096"
        ],
        correct: ["B"],
        explanation: {
          correct: "context: fork runs the skill in an isolated sub-agent, preventing verbose skill outputs from polluting the main conversation context.",
          incorrect: {
            "A": "Restricts tools but doesn't isolate context.",
            "C": "Prompts for parameters; no effect on context isolation.",
            "D": "Not a valid frontmatter option."
          }
        }
      },
      {
        id: "7-27",
        domain: "Claude Code Configuration",
        type: "single",
        question: "Your project has Terraform configurations in terraform/ and test files spread throughout the codebase (e.g., src/auth/auth.test.ts, src/api/routes.test.ts, lib/utils.test.ts). You want different conventions for Terraform files and test files. What's the best approach?",
        options: [
          "A. Create .claude/rules/ files with YAML frontmatter: one with paths: ['terraform/**/*'] for Terraform conventions, one with paths: ['**/*.test.*'] for test conventions.",
          "B. Place a CLAUDE.md in the terraform/ directory and a CLAUDE.md in each directory containing test files.",
          "C. Put all conventions in the root CLAUDE.md with headers like 'When editing Terraform files...' and 'When editing test files...'.",
          "D. Create separate skills for Terraform and testing that developers invoke manually."
        ],
        correct: ["A"],
        explanation: {
          correct: ".claude/rules/ files with YAML frontmatter glob patterns allow conditional rule loading based on file paths. Works perfectly for test files spread across many directories (**/*.test.*).",
          incorrect: {
            "B": "Would require CLAUDE.md files in every directory with tests.",
            "C": "Relies on inference rather than deterministic path matching.",
            "D": "Requires manual invocation instead of automatic application."
          }
        }
      },
      {
        id: "7-28",
        domain: "Claude Code Configuration",
        type: "single",
        question: "You're working with Claude Code to build a data migration script, but the output keeps formatting dates inconsistently. Detailed prose instructions haven't resolved the issue. What's the most effective next step?",
        options: [
          "A. Switch to a more capable model that better understands date formatting requirements.",
          "B. Provide 2–3 concrete input/output examples showing the exact date format transformations you expect.",
          "C. Add type annotations to all date variables in the existing code.",
          "D. Write a separate date formatting utility function and ask Claude to use it."
        ],
        correct: ["B"],
        explanation: {
          correct: "Concrete input/output examples are the most effective way to communicate expected transformations when prose descriptions are interpreted inconsistently. Core iterative refinement technique.",
          incorrect: {
            "A": "Unlikely to help with a formatting specification issue.",
            "C": "Addresses the code, not the communication gap with Claude.",
            "D": "Adds infrastructure rather than clarifying the specification."
          }
        }
      },
      {
        id: "7-29",
        domain: "Claude Code Configuration",
        type: "single",
        question: "Your CI pipeline runs Claude Code to review PRs. After developers push fixes addressing review comments and the review re-runs, it often duplicates the same comments from the first review plus new ones. How do you fix this?",
        options: [
          "A. Clear all previous review comments before running the new review.",
          "B. Include prior review findings in context and instruct Claude to report only new or still-unaddressed issues.",
          "C. Only run the review on newly changed files, ignoring files from the previous review.",
          "D. Use a different Claude session ID for each review run to avoid context contamination."
        ],
        correct: ["B"],
        explanation: {
          correct: "Including prior review findings in context and instructing Claude to report only new or still-unaddressed issues avoids duplicates while ensuring nothing is missed.",
          incorrect: {
            "A": "Loses review history and the audit trail.",
            "C": "Might miss issues in files that were changed to fix other files.",
            "D": "Doesn't address duplication — each fresh session would re-discover the same issues."
          }
        }
      },

      // =====================================================================
      // DOMAIN 4 — PROMPT ENGINEERING & STRUCTURED OUTPUT (additional)
      // =====================================================================
      {
        id: "7-30",
        domain: "Prompt Engineering",
        type: "single",
        question: "Your automated code review tool has a 'comment accuracy' category that produces 60% false positives, while the 'security vulnerability' and 'bug detection' categories have less than 5% false positive rates. Developers are starting to ignore ALL review findings. What should you do first?",
        options: [
          "A. Add a disclaimer to all review findings saying 'These are suggestions only — please verify.'",
          "B. Temporarily disable the high false-positive 'comment accuracy' category to restore developer trust, while improving its prompts separately.",
          "C. Add a confidence score to each finding and tell developers to only look at high-confidence ones.",
          "D. Switch to a more capable model that produces fewer false positives."
        ],
        correct: ["B"],
        explanation: {
          correct: "High false positive rates in one category undermine confidence in all categories. Temporarily disabling the problematic category restores trust in the accurate categories while you improve the failing category's prompts.",
          incorrect: {
            "A": "Doesn't fix the trust issue — disclaimers do not restore signal value.",
            "C": "Adds noise without fixing the root cause.",
            "D": "Doesn't address the category-specific prompt quality."
          }
        }
      },
      {
        id: "7-31",
        domain: "Prompt Engineering",
        type: "single",
        question: "Your extraction system handles varied document types: academic papers with inline citations, business reports with bibliographies, and government documents with embedded reference details. Output format is inconsistent across document types. What's the best fix?",
        options: [
          "A. Create separate extraction endpoints for each document type with specialized prompts.",
          "B. Add few-shot examples demonstrating correct extraction from each document type (inline citations, bibliographies, embedded details) showing the consistent output format for each.",
          "C. Add detailed instructions explaining every possible document format and how to handle each.",
          "D. Pre-process documents to normalize their format before sending to Claude."
        ],
        correct: ["B"],
        explanation: {
          correct: "Few-shot examples demonstrating correct handling of varied document structures are the most effective technique for consistently formatted output. They enable the model to generalize to novel patterns.",
          incorrect: {
            "A": "Adds unnecessary complexity and infrastructure.",
            "C": "Will produce inconsistent results without concrete examples.",
            "D": "Expensive and may lose information."
          }
        }
      },
      {
        id: "7-32",
        domain: "Prompt Engineering",
        type: "single",
        question: "You're building an extraction system that processes invoices. Some invoices don't have a 'purchase order number' field. When you make the PO number field required in your schema, the model sometimes fabricates PO numbers. What's the correct schema design?",
        options: [
          "A. Keep the field required but add a validation step to check if the PO number exists in your database.",
          "B. Make the PO number field optional (nullable) so the model can return null when the information isn't present in the source document.",
          "C. Remove the PO number field from the schema entirely.",
          "D. Add an instruction saying 'only include PO number if clearly visible in the document' while keeping the field required."
        ],
        correct: ["B"],
        explanation: {
          correct: "Schema fields should be optional (nullable) when source documents may not contain the information. This prevents the model from fabricating values to satisfy required fields.",
          incorrect: {
            "A": "Adds a downstream check but doesn't prevent fabrication at the source.",
            "C": "Loses the ability to extract PO numbers when they exist.",
            "D": "Contradictory — a required field must always have a value."
          }
        }
      },
      {
        id: "7-33",
        domain: "Prompt Engineering",
        type: "single",
        question: "You need to guarantee that Claude's response is a structured JSON object conforming to your schema, not a conversational text response. Which configuration achieves this?",
        options: [
          "A. Add 'You must respond in JSON format' to the system prompt.",
          "B. Set tool_choice: 'auto' and define the schema as a tool.",
          "C. Set tool_choice: 'any' with the schema defined as a tool, so the model must call a tool (returning structured output) rather than responding with text.",
          "D. Set max_tokens to a small number to force brief, structured responses."
        ],
        correct: ["C"],
        explanation: {
          correct: "tool_choice: 'any' guarantees the model calls a tool (returning structured JSON matching the schema) rather than returning conversational text.",
          incorrect: {
            "A": "Prompt-based approach that doesn't guarantee compliance.",
            "B": "'auto' allows the model to return text instead of calling the tool.",
            "D": "max_tokens has no relationship to output format."
          }
        }
      },
      {
        id: "7-34",
        domain: "Prompt Engineering",
        type: "single",
        question: "Your extraction pipeline validates output against a JSON schema. When validation fails, you retry the extraction. For some documents, retries consistently fail because the information simply doesn't exist in the source document. How should you handle this?",
        options: [
          "A. Increase the number of retries from 3 to 10 to give the model more chances.",
          "B. Identify when retries will be ineffective (information absent from source) versus when they will succeed (format mismatches), and only retry format errors.",
          "C. Switch to a larger model that can better extract information from documents.",
          "D. Remove the validation step to avoid retry loops."
        ],
        correct: ["B"],
        explanation: {
          correct: "Retries are ineffective when information is simply absent from the source. Distinguish resolvable errors (format mismatches) from unresolvable ones (missing information), only retrying the former.",
          incorrect: {
            "A": "Wastes resources on unresolvable cases.",
            "C": "Doesn't fix missing data — no model can extract what isn't there.",
            "D": "Removes quality assurance."
          }
        }
      },
      {
        id: "7-35",
        domain: "Prompt Engineering",
        type: "single",
        question: "Your pipeline processes 500 documents per week. Batch processing takes up to 24 hours. Your SLA requires all results within 30 hours of submission. How should you schedule batch submissions?",
        options: [
          "A. Submit all 500 documents once per week on Monday morning.",
          "B. Submit documents in 4-hour windows throughout the week to guarantee 30-hour SLA with 24-hour batch processing.",
          "C. Use the real-time API for all 500 documents to avoid batch delays.",
          "D. Submit all documents on Friday evening to have results by Monday."
        ],
        correct: ["B"],
        explanation: {
          correct: "With a 24-hour maximum processing window and a 30-hour SLA, submitting in 4-hour windows gives a safe margin (30 − 24 = 6 hours buffer).",
          incorrect: {
            "A": "Larger batches risk missing the SLA if processing takes the full 24 hours.",
            "C": "Loses the 50% cost savings.",
            "D": "Doesn't meet a rolling SLA requirement; documents arriving Monday wait until Friday."
          }
        }
      },
      {
        id: "7-36",
        domain: "Prompt Engineering",
        type: "single",
        question: "You generated code using Claude and want to verify its quality. You ask the same Claude session to review the code, but it says the code looks correct. A separate review by a colleague finds two bugs. Why did the self-review fail?",
        options: [
          "A. The context window was too small for effective review.",
          "B. The model retains reasoning context from generation, making it less likely to question its own decisions in the same session.",
          "C. The review prompt wasn't specific enough about what to check.",
          "D. The model needs extended thinking enabled for accurate reviews."
        ],
        correct: ["B"],
        explanation: {
          correct: "Self-review limitation: a model retains reasoning context from generation, making it less likely to question its own decisions in the same session. Independent review instances (without prior reasoning context) are more effective at catching subtle issues.",
          incorrect: {
            "A": "Context window size is unrelated to this structural bias.",
            "C": "Even with a perfect prompt, same-session review is biased toward defending prior reasoning.",
            "D": "Extended thinking helps with reasoning depth, not with self-review bias."
          }
        }
      },

      // =====================================================================
      // DOMAIN 5 — CONTEXT MANAGEMENT & RELIABILITY (additional)
      // =====================================================================
      {
        id: "7-37",
        domain: "Context Management",
        type: "single",
        question: "Your customer support agent handles multi-issue sessions. After resolving 3 issues, the agent starts referencing incorrect order amounts from earlier in the conversation. What's the best mitigation?",
        options: [
          "A. Limit sessions to one issue at a time.",
          "B. Extract and persist structured issue data (order IDs, amounts, statuses) into a separate 'case facts' context block that's included in each prompt.",
          "C. Increase the context window size to accommodate more conversation history.",
          "D. Summarize the entire conversation after each resolution and prepend it to the next message."
        ],
        correct: ["B"],
        explanation: {
          correct: "Progressive summarization risks condensing numerical values and dates into vague summaries. Extracting transactional facts into a persistent 'case facts' block preserves critical data outside summarized history.",
          incorrect: {
            "A": "Degrades customer experience.",
            "C": "Doesn't fix the 'lost in the middle' attention effect.",
            "D": "Risks losing specific numerical values through summarization."
          }
        }
      },
      {
        id: "7-38",
        domain: "Context Management",
        type: "single",
        question: "Your agent calls lookup_order which returns 40+ fields per order, but only 5 fields are relevant for the current task. These verbose tool results are consuming significant context tokens. What should you do?",
        options: [
          "A. Trim verbose tool outputs to only relevant fields before they accumulate in context.",
          "B. Use a larger context window model to accommodate the extra data.",
          "C. Ignore the extra fields and let the model figure out which ones are relevant.",
          "D. Modify the database query to return only 5 fields."
        ],
        correct: ["A"],
        explanation: {
          correct: "Tool results accumulate in context and consume tokens disproportionately to their relevance. Trimming to only relevant fields is the correct approach.",
          incorrect: {
            "B": "Wastes tokens on irrelevant data.",
            "C": "Doesn't address context consumption.",
            "D": "May not be feasible if different tasks need different field subsets."
          }
        }
      },
      {
        id: "7-39",
        domain: "Context Management",
        type: "single",
        question: "A customer says 'I want to speak to a manager' after your agent offers to resolve their straightforward billing issue (a clear duplicate charge). How should the agent respond?",
        options: [
          "A. Ignore the request and proceed to fix the billing issue since it's straightforward.",
          "B. Honor the customer's explicit request for a human agent immediately without first attempting investigation.",
          "C. Acknowledge the customer's frustration, explain that you can quickly resolve the duplicate charge, but escalate immediately if they reiterate their preference.",
          "D. Assess the customer's sentiment score before deciding whether to escalate."
        ],
        correct: ["C"],
        explanation: {
          correct: "Acknowledge frustration while offering resolution when the issue is within capability, but escalate only if the customer reiterates their preference. Balances respecting the customer with efficient resolution.",
          incorrect: {
            "A": "Ignores the customer's stated preference.",
            "B": "Escalates immediately for a straightforward issue without offering resolution.",
            "D": "Sentiment-based escalation is unreliable and not the standard pattern."
          }
        }
      },
      {
        id: "7-40",
        domain: "Context Management",
        type: "single",
        question: "A web search subagent fails with a timeout. It managed to find 3 out of 5 expected sources before the timeout. What should it return to the coordinator?",
        options: [
          "A. Return an empty result marked as successful to avoid disrupting the workflow.",
          "B. Throw an exception that terminates the entire research pipeline.",
          "C. Return a generic 'search unavailable' error status.",
          "D. Return structured error context: failure type (timeout), attempted query, the 3 partial results found, and potential alternative approaches."
        ],
        correct: ["D"],
        explanation: {
          correct: "Structured error context enables the coordinator to make intelligent recovery decisions — proceed with partial results, retry with a modified query, or try alternatives.",
          incorrect: {
            "A": "Silently suppresses the error (anti-pattern).",
            "B": "Terminates unnecessarily when partial results exist.",
            "C": "Hides valuable context from the coordinator."
          }
        }
      },
      {
        id: "7-41",
        domain: "Context Management",
        type: "single",
        question: "You've been exploring a large codebase for 45 minutes with Claude Code. You notice Claude's answers are becoming vague, referencing 'typical patterns' instead of the specific class names it discovered earlier. What's happening and what should you do?",
        options: [
          "A. The model is experiencing context degradation. Use /compact to reduce context and maintain scratchpad files recording key findings for reference.",
          "B. The model is rate-limited. Wait a few minutes and try again.",
          "C. The codebase is too large for the model to handle. Switch to a simpler project.",
          "D. The model's temperature is too high. Lower it for more precise answers."
        ],
        correct: ["A"],
        explanation: {
          correct: "Context degradation occurs in extended sessions. Using /compact reduces context usage, and scratchpad files persist key findings across context boundaries for reference.",
          incorrect: {
            "B": "Vague-answer patterns are not a rate-limit symptom.",
            "C": "Codebase size isn't the issue — context accumulation is.",
            "D": "Temperature isn't the cause; this is an attention/context-quality issue."
          }
        }
      },
      {
        id: "7-42",
        domain: "Context Management",
        type: "single",
        question: "Your extraction system reports 97% overall accuracy. Your manager wants to reduce human review to save costs. What should you verify before doing so?",
        options: [
          "A. That the 97% accuracy is consistent when measured by document type and field segment, not just in aggregate.",
          "B. That the model's confidence scores are above 95% for all extractions.",
          "C. That the system has processed at least 10,000 documents.",
          "D. That the error rate has been stable for the past month."
        ],
        correct: ["A"],
        explanation: {
          correct: "Aggregate accuracy may mask poor performance on specific document types or fields. You must validate accuracy by document type and field segment before reducing human review.",
          incorrect: {
            "B": "Self-reported confidence scores are unreliable.",
            "C": "Volume alone doesn't validate the metric's reliability across segments.",
            "D": "Stability of an aggregate metric still hides per-segment failures."
          }
        }
      },
      {
        id: "7-43",
        domain: "Context Management",
        type: "single",
        question: "Your research system synthesizes findings from multiple sources. Two credible sources report different statistics: Source A says 'market grew 15% in 2024' and Source B says 'market grew 22% in 2024.' How should the synthesis handle this?",
        options: [
          "A. Average the two values and report 'market grew 18.5%.'",
          "B. Use the more recent source's value.",
          "C. Annotate the conflict with source attribution, presenting both values with their sources and noting the discrepancy.",
          "D. Omit the statistic entirely since the sources disagree."
        ],
        correct: ["C"],
        explanation: {
          correct: "Conflicting statistics from credible sources should be annotated with source attribution rather than arbitrarily resolved. Preserve both values with their sources and note the discrepancy.",
          incorrect: {
            "A": "Arbitrarily resolves the conflict and creates a fabricated number.",
            "B": "Arbitrarily picks one source without justification.",
            "D": "Loses information that the user needs."
          }
        }
      },
      {
        id: "7-44",
        domain: "Context Management",
        type: "single",
        question: "Your customer support agent searches for customer 'John Smith' and the tool returns 4 matches with different account numbers. What should the agent do?",
        options: [
          "A. Select the most recently active account as the most likely match.",
          "B. Ask the customer for additional identifying information (email, phone, account number) to disambiguate.",
          "C. Process the request using the first result returned.",
          "D. Escalate to a human agent since multiple matches indicate a complex case."
        ],
        correct: ["B"],
        explanation: {
          correct: "When multiple customer matches are found, the agent should request additional identifiers to disambiguate rather than selecting based on heuristics.",
          incorrect: {
            "A": "Heuristic selection risks acting on the wrong account.",
            "C": "Same heuristic problem — 'first result' is not the right account.",
            "D": "Escalates unnecessarily when clarification can resolve the issue."
          }
        }
      }
    ]
  };

  // -------------------------------------------------------------------------
  // Append to global MOCK_EXAMS so the existing app.js picks it up
  // -------------------------------------------------------------------------
  if (typeof window !== 'undefined') {
    if (!Array.isArray(window.MOCK_EXAMS)) window.MOCK_EXAMS = [];
    if (!window.MOCK_EXAMS.find(m => m.id === MOCK_7.id)) {
      window.MOCK_EXAMS.push(MOCK_7);
    }
  }
})();
