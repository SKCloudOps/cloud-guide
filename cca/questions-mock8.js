// ============================================================================
// CCA-F Mock Exam 8 — New Question Bank
// ============================================================================

(function () {
  const MOCK_8 = {
    id: 8,
    title: "Mock Exam 8",
    subtitle: "Agentic Architecture & Tool Design (Extended)",
    duration: 60,
    questions: [
      {
            "id": "8-1",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Production metrics show that Claude repeatedly calls the same three tools (get_customer, get_account_status, get_recent_orders) sequentially for every support ticket, causing high latency. How should you optimize this?",
            "options": [
                  "A. Create composite tools like get_customer_with_orders that bundle common lookup combinations into single calls",
                  "B. Implement speculative execution that automatically calls likely-needed tools alongside any requested tool, returning all results regardless of what was requested",
                  "C. Increase max_tokens to give Claude more space to plan ahead and naturally batch its tool requests",
                  "D. Prompt Claude to batch tool requests per turn, and return all tool results together before the next API call"
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Modern LLMs like Claude are designed to output multiple tool-use blocks simultaneously. Updating the system prompt to explicitly request batched tool calls addresses the sequential behavior and minimizes round-trips without over-engineering the API schema or wasting tokens."
            }
      },
      {
            "id": "8-2",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
            "options": [
                  "A. Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold.",
                  "B. Have the agent self-report a confidence score (1-10) before each response and automatically route requests to humans when confidence falls below a threshold.",
                  "C. Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.",
                  "D. Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Providing clear guardrails and few-shot examples helps the agent recognize standard patterns versus policy exceptions. This reduces subjective errors in judgment more effectively than sentiment or self-reported confidence, which can be unreliable."
            }
      },
      {
            "id": "8-3",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "After calling get_customer and lookup_order, the agent has retrieved all available system data but faces uncertainty. Which situation represents the most appropriate trigger for calling escalate_to_human?",
            "options": [
                  "A. The customer requests a price match against a competitor. Your policies allow adjustments for price drops on your own site within 14 days but are silent on competitor pricing.",
                  "B. The customer wants to cancel an order that shipped yesterday, with delivery scheduled for tomorrow. The agent should escalate because the customer might change their mind once they receive the package.",
                  "C. The customer claims they never received their order, but tracking shows it was delivered and signed for at their address three days ago. The agent should escalate because presenting contradictory evidence might damage the customer relationship.",
                  "D. The customer's message mentions both a billing question and a product return. The agent should escalate so a human can coordinate handling both issues in a single interaction."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "This represents a genuine policy gap where rules are silent. Agents should not fabricate policy and must escalate for human judgment. Answer C is incorrect because presenting factual tracking data is a standard procedure, not an operational need for intervention."
            }
      },
      {
            "id": "8-4",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "Production logs reveal a consistent pattern: when customers include 'account' in messages, the agent calls get_customer first 78% of the time. When they don't, it calls lookup_order first 93% of the time. The tool descriptions are unambiguous. What is the most likely root cause?",
            "options": [
                  "A. The system prompt contains keyword-sensitive instructions that steer behavior based on terms like 'account'.",
                  "B. The model requires more training data on multi-concept messages and should be fine-tuned.",
                  "C. The tool descriptions need additional negative examples specifying when NOT to use each tool.",
                  "D. The model's base training creates associations between 'account' and customer operations that override tool descriptions."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "The systematic, keyword-triggered pattern suggests explicit routing logic in the system prompt is reacting to specific words, creating unintended behavioral steering despite clear tool descriptions."
            }
      },
      {
            "id": "8-5",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "The agent misinterprets data from MCP tools: Unix timestamps, ISO 8601 dates, and numeric status codes. Some tools are third-party and cannot be modified. What's the most maintainable approach to normalize data formats?",
            "options": [
                  "A. Add detailed format documentation to your system prompt explaining each tool's data conventions.",
                  "B. Modify tools you control to return human-readable formats; create wrapper tools for third-party tools.",
                  "C. Create a normalize_data tool that the agent calls after each data retrieval to transform values.",
                  "D. Use a PostToolUse hook to intercept tool results and apply formatting transformations before agent processing."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Standardizing at the tool level via wrappers ensures the agent always receives clean, consistent data without bloating the system prompt or adding extra model turns for normalization."
            }
      },
      {
            "id": "8-6",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "Tool selection accuracy drops to 58% for multi-concern requests. The agent addresses only one concern or mixes up parameters. What's the most effective approach to improve reliability?",
            "options": [
                  "A. Implement response validation that automatically re-prompts the agent for missed concerns.",
                  "B. Implement a preprocessing layer that decomposes multi-concern messages into individual requests, processes them independently, then combines results.",
                  "C. Consolidate related tools into fewer, more general-purpose tools.",
                  "D. Add few-shot examples to your prompt demonstrating the correct reasoning for multi-concern requests."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Decomposition ensures each concern receives full attention and prevents parameter bleeding, providing higher reliability than prompting or validation alone."
            }
      },
      {
            "id": "8-7",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "Progressive summarization causes the agent to lose track of specific numerical values stated earlier in the conversation. What's the most effective fix?",
            "options": [
                  "A. Increase the summarization threshold from 70% to 85% capacity.",
                  "B. Revise the summarization prompt to explicitly preserve all numerical values and dates verbatim.",
                  "C. Extract transactional facts into a persistent 'case facts' block included in each prompt, outside the summarized history.",
                  "D. Store full history externally and implement retrieval (RAG) to search it when needed."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "Maintaining a persistent 'state' or 'case facts' block ensures critical variables are never lost to the lossy nature of summarization, providing a reliable source of truth."
            }
      },
      {
            "id": "8-8",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "The agent frequently calls get_customer when users ask about order status, even though lookup_order is more appropriate. What should you examine first?",
            "options": [
                  "A. Review tool descriptions to ensure they clearly distinguish each tool's purpose.",
                  "B. Implement a pre-processing classifier that detects order queries and routes directly.",
                  "C. Add few-shot examples covering every possible order-related query pattern.",
                  "D. Reduce the number of available tools to simplify selection."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "Tool descriptions are the primary mechanism Claude uses for selection. Refining them to be clearly differentiated is the most high-leverage first step."
            }
      },
      {
            "id": "8-9",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "The agent provides accurate resolutions for complex cases but inconsistently explains reasoning or misses next steps. Gaps vary by case. How can you improve quality without human review?",
            "options": [
                  "A. Increase the model tier from Haiku to Sonnet for complex cases.",
                  "B. Implement few-shot examples showing complete resolutions for five common case types.",
                  "C. Add a self-critique step where the agent evaluates its draft response for completeness against specific criteria.",
                  "D. Add a confirmation step where the agent asks 'Does this fully address your concern?'"
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "The Evaluator-Optimizer pattern (self-critique) allows the agent to dynamically catch omissions tailored to the specific case, which static few-shots cannot do for highly variable gaps."
            }
      },
      {
            "id": "8-10",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "What determines the decision to continue or stop an agentic loop after an API call to Claude?",
            "options": [
                  "A. Parse Claude's response text for completion phrases like 'I've completed'.",
                  "B. Check the stop_reason field\u2014continue if 'tool_use' and stop if 'end_turn'.",
                  "C. Check whether the response includes any assistant text content.",
                  "D. Set a maximum iteration count and stop when reached regardless of signals."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "The stop_reason field is the explicit, structured signal provided by the API for loop control. 'tool_use' indicates an execution is required, while 'end_turn' indicates completion."
            }
      },
      {
            "id": "8-11",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "You want to add few-shot examples to improve tool selection for ambiguous requests. Which approach is most effective?",
            "options": [
                  "A. Add 4-6 examples targeting ambiguous scenarios, showing reasoning for why one tool was chosen over others.",
                  "B. Add explicit 'use when' and 'do not use when' guidelines in each tool's description.",
                  "C. Add 10-15 examples of clear, unambiguous requests for each tool.",
                  "D. Add examples grouped by tool\u2014all get_customer scenarios together, then all lookup_order."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "Worked examples demonstrating the 'why' (reasoning) help the model learn the boundary between similar tools in a way that isolated grouping or declarative rules cannot."
            }
      },
      {
            "id": "8-12",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "The agent calls get_customer instead of lookup_order for requests like 'check my order #12345'. Both have minimal descriptions. What is the most effective first step?",
            "options": [
                  "A. Expand each tool's description to include input formats, example queries, and boundaries.",
                  "B. Add few-shot examples showing order-related queries routing to lookup_order.",
                  "C. Implement a routing layer that parses user input before each turn.",
                  "D. Consolidate both tools into a single lookup_entity tool."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "Minimal descriptions are the root cause of selection ambiguity. Expanding them to provide semantic boundaries is the highest leverage first step."
            }
      },
      {
            "id": "8-13",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "The agent sometimes skips get_customer and calls lookup_order using only a name, causing incorrect refunds. What change most effectively addresses this?",
            "options": [
                  "A. Add few-shot examples showing the agent always calling get_customer first.",
                  "B. Enhance the system prompt to state that customer verification is mandatory.",
                  "C. Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified ID.",
                  "D. Implement a routing classifier that enables only a subset of tools appropriate for the request."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "High-stakes operations (security/financial) should use programmatic guardrails to enforce execution order rather than relying on probabilistic prompt instructions."
            }
      },
      {
            "id": "8-14",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "For complex requests, the agent averages 12+ tool calls and often investigates concerns sequentially with redundant data gathering. What is the most effective change?",
            "options": [
                  "A. Add few-shot examples demonstrating ideal tool sequences for billing scenarios.",
                  "B. Decompose the request into distinct concerns, investigate each in parallel using shared context, then synthesize.",
                  "C. Add explicit verification gates between steps requiring checkpoints.",
                  "D. Reduce the number of tools by consolidating them into a single investigate_issue tool."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Parallel decomposition eliminates redundant work and prevents sequential errors by allowing each sub-task to be processed independently with shared foundational context."
            }
      },
      {
            "id": "8-15",
            "domain": "Customer Support Resolution Agent",
            "type": "single",
            "question": "When get_customer returns multiple matches, Claude picks the most recent order, leading to wrong account selection 15% of the time. How should you address this?",
            "options": [
                  "A. Modify get_customer to return only a single match based on a ranking algorithm.",
                  "B. Add few-shot examples showing how to infer the correct customer from conversational context.",
                  "C. Implement a confidence scoring system that proceeds automatically above 85% confidence.",
                  "D. Instruct Claude to ask for an additional identifier (email, phone) when multiple matches are returned."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "For account identification, disambiguation is the only safe approach. Instructing the agent to pause and ask for clarification ensures deterministic accuracy over probabilistic guessing."
            }
      },
      {
            "id": "8-16",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "What's the most effective approach to reduce overhead while maintaining system reliability when the synthesis agent needs to verify specific claims?",
            "options": [
                  "A. Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator.",
                  "B. Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.",
                  "C. Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify.",
                  "D. Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-17",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Production logs reveal requests to 'analyze the quarterly report I uploaded' are routed to the web search agent 45% of the time. How should you address this misrouting?",
            "options": [
                  "A. Add few-shot examples to the coordinator's prompt showing correct routing.",
                  "B. Expand the document analysis tool's description to include example use cases like 'Use for uploaded PDFs' while leaving the web search tool unchanged.",
                  "C. Rename the web search tool to extract_web_results and update its description to 'processes and returns information retrieved from web searches and URLs.'",
                  "D. Add a pre-routing classifier that determines whether the user is referencing uploaded files or web content."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-18",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Two credible sources contain directly conflicting statistics. What's the most effective way for the document analysis agent to handle this?",
            "options": [
                  "A. Include both figures in the analysis output without flagging them as conflicting.",
                  "B. Apply source credibility heuristics to select the most likely accurate figure and include a footnote.",
                  "C. Halt analysis and escalate to the coordinator immediately, asking it to determine which source is authoritative.",
                  "D. Complete the document analysis with both figures included, explicitly annotate the conflict with source attribution, and let the coordinator decide how to reconcile."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-19",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "What is the main advantage of keeping the coordinator as the central hub for all subagent communication?",
            "options": [
                  "A. Subagents operate with isolated memory, and direct communication would require complex serialization.",
                  "B. Routing through the coordinator enables automatic retry logic that direct agent-to-agent calls cannot support.",
                  "C. The coordinator batches multiple subagent requests together, reducing the total number of API calls.",
                  "D. The coordinator can observe all interactions, handle errors consistently, and decide what information each subagent should receive."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-20",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Which error propagation approach best enables intelligent recovery when a web search subagent times out?",
            "options": [
                  "A. Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow.",
                  "B. Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.",
                  "C. Catch the timeout within the subagent and return an empty result set marked as successful.",
                  "D. Implement automatic retry logic with exponential backoff within the subagent, returning a generic 'search unavailable' status after exhaustion."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-21",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "The final reports cover only visual arts, missing music and film, because the coordinator decomposed the task too narrowly. What is the most likely root cause?",
            "options": [
                  "A. The synthesis agent lacks instructions for identifying coverage gaps.",
                  "B. The document analysis agent is filtering out sources related to non-visual industries.",
                  "C. The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains.",
                  "D. The web search agent's queries are not comprehensive enough."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-22",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "The document analysis agent uses fetch_url to conduct ad-hoc web searches instead of just loading documents. What's the most effective fix?",
            "options": [
                  "A. Implement filtering that blocks fetch_url calls to known search engine domains.",
                  "B. Replace fetch_url with a load_document tool that validates URLs point to document formats.",
                  "C. Add instructions to the document analysis agent's prompt clarifying it should only load document URLs.",
                  "D. Remove fetch_url from the document analysis agent and route all URL loading through the coordinator."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-23",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "The web search and document analysis agents are investigating the same subtopics, resulting in overlap. What's the most effective way to address this?",
            "options": [
                  "A. Allow both to complete, then have the coordinator deduplicate findings.",
                  "B. Implement a shared state mechanism where agents log their current focus area.",
                  "C. Convert to sequential execution where document analysis runs only after web search completes.",
                  "D. Have the coordinator explicitly partition the research space before delegation, assigning distinct subtopics or source types to each agent."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-24",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Some search categories timed out while others succeeded. What's the most effective error propagation strategy for the synthesis subagent?",
            "options": [
                  "A. Return an error to the coordinator indicating incomplete upstream data.",
                  "B. Proceed with synthesis using only the successful sources without indicating unavailable data.",
                  "C. Structure the synthesis output with coverage annotations indicating well-supported findings versus gaps due to unavailable sources.",
                  "D. Have the synthesis subagent request a retry of timed-out sources before proceeding."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-25",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "The synthesis agent omits critical findings in the middle of a 75K token input. How should you restructure the aggregated input?",
            "options": [
                  "A. Stream subagent results to the synthesis agent incrementally.",
                  "B. Implement rotation that alternates which subagent's results appear first.",
                  "C. Summarize all subagent outputs to under 20K tokens total before aggregation.",
                  "D. Place a key findings summary at the beginning of the aggregated input and organize detailed results with explicit section headers."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-26",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Document analysis encounters corrupted/password-protected PDFs. What's the most effective architectural improvement to handle this?",
            "options": [
                  "A. Configure the subagent to always return partial results with success status, embedding error details in metadata.",
                  "B. Have the coordinator validate all documents before dispatching to the subagent.",
                  "C. Have the subagent implement local recovery for transient failures and only propagate errors it cannot resolve to the coordinator.",
                  "D. Create a dedicated error-handling agent that monitors failures via a shared queue."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-27",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "A search returned '0 results' for one category and a 'Timeout' for another. What approach enables the best recovery decisions?",
            "options": [
                  "A. Have the subagent retry transient failures internally and only report persistent errors.",
                  "B. Aggregate outcomes into a single success rate metric.",
                  "C. Report both the timeout and '0 results' as failures requiring coordinator intervention.",
                  "D. Distinguish access failures (timeout) needing retry decisions from valid empty results ('0 results') representing successful queries."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-28",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Total input tokens (155K) exceed the synthesis agent's optimal range (50K). What's the most effective solution?",
            "options": [
                  "A. Store findings in a vector database and give the synthesis agent retrieval tools.",
                  "B. Add an intermediate summarization agent to condense findings.",
                  "C. Have the synthesis agent process findings in sequential batches.",
                  "D. Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-29",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "A document analysis subagent encounters a corrupted PDF. What is the most effective way to handle this failure?",
            "options": [
                  "A. Automatically retry parsing the document three times.",
                  "B. Return the error with context to the coordinator agent, letting it decide how to proceed.",
                  "C. Throw an exception that terminates the entire research workflow.",
                  "D. Silently skip the corrupted document and continue processing other files."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-30",
            "domain": "Agentic Architecture",
            "type": "single",
            "question": "Web search and document analysis have completed. What is the appropriate next step for producing an integrated research output?",
            "options": [
                  "A. The coordinator passes both sets of findings to the synthesis agent for unified integration.",
                  "B. The document analysis agent requests the web search results and merges them internally.",
                  "C. Each agent directly sends its findings to the report generation agent.",
                  "D. The coordinator concatenates the raw outputs from both agents and returns them as the final result."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "Correct choice."
            }
      },
      {
            "id": "8-31",
            "domain": "Claude Code",
            "type": "single",
            "question": "Your team created an /analyze-codebase skill that performs comprehensive analysis After running it, Claude becomes less responsive and loses track of the original task What is the most effective way to address this while preserving capability?",
            "options": [
                  "A. Add model: haiku to the frontmatter to use a faster model",
                  "B. Add context: fork to the skill frontmatter so it runs in an isolated subagent",
                  "C. Split the skill into three smaller skills that generate less output",
                  "D. Add instructions to compress all outputs into a brief summary"
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Using context: fork runs the skill in an isolated sub-agent, preventing massive amounts of data from polluting the main conversation's context window."
            }
      },
      {
            "id": "8-32",
            "domain": "Personal Skill Overrides",
            "type": "single",
            "question": "A developer wants to customize a shared /commit skill for their personal workflow without affecting teammates. What should you recommend?",
            "options": [
                  "A. Create a personal version at ~/.claude/skills/commit/SKILL.md with the same name.",
                  "B. Create a personal version in ~/.claude/skills/ with a different name like /my-commit.",
                  "C. Set override: true in the personal skill's frontmatter.",
                  "D. Add username-based conditional logic to the project skill's frontmatter."
            ],
            "correct": [
                  "A"
            ],
            "explanation": {
                  "correct": "Claude Code prioritizes skills in the user's home directory (~/.claude/skills/) over those in the project directory, allowing for seamless personal overrides."
            }
      },
      {
            "id": "8-33",
            "domain": "Context Management in Phased Tasks",
            "type": "single",
            "question": "You are adding error handling wrappers to a 120-file codebase. Phase 1 (discovery) generates verbose output that fills the context window rapidly. What is the most effective approach to maintain implementation consistency?",
            "options": [
                  "A. Continue in the main conversation using /compact periodically.",
                  "B. Use the Explore subagent for Phase 1 to isolate verbose output and return a summary, then continue in the main conversation.",
                  "C. Switch to headless mode with --continue, passing explicit context summaries.",
                  "D. Define patterns in CLAUDE.md and process files in batches across multiple sessions."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Subagents operate in their own context. The Explore subagent can handle verbose discovery and return a distilled summary, keeping the main context window clean for high-level design."
            }
      },
      {
            "id": "8-34",
            "domain": "Skill Security and Configuration",
            "type": "single",
            "question": "A /migration skill has issues with poor naming (missing arguments), context pollution (old schema data), and accidental destructive cleanup. Which configuration addresses all three?",
            "options": [
                  "A. Include validation instructions in SKILL.md and prompts to ignore prior context.",
                  "B. Split into /migration-create and /migration-apply with different allowed-tools scopes.",
                  "C. Add argument-hint for parameters, use context: fork to isolate execution, and restrict allowed-tools to file write operations.",
                  "D. Use positional parameters $1 and $2, and use explicit schema file references via @ syntax."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "This approach uses 'argument-hint' for validation, 'context: fork' for a clean slate, and 'allowed-tools' for least-privilege security."
            }
      },
      {
            "id": "8-35",
            "domain": "Instruction Hierarchy and Shared Memory",
            "type": "single",
            "question": "New team members report Claude isn't following a 'comprehensive error handling' guideline that original developers say works fine. What is the most likely cause?",
            "options": [
                  "A. Claude Code builds per-user preference models that new users haven't trained yet.",
                  "B. Claude Code caches CLAUDE.md contents, so new users have a different cached version.",
                  "C. The new developer's local ~/.claude/CLAUDE.md has conflicting instructions.",
                  "D. The guideline exists in original developers' user-level (~/.claude/CLAUDE.md) files instead of the project's CLAUDE.md."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": "User-level files stay local. For institutional knowledge to be shared, it must be committed to the project-level CLAUDE.md."
            }
      },
      {
            "id": "8-36",
            "domain": "MCP Server Configuration",
            "type": "single",
            "question": "You want to add a GitHub MCP server for the team where everyone has their own personal access token. How do you configure this without committing credentials?",
            "options": [
                  "A. Create an MCP server wrapper that reads from a .env file.",
                  "B. Add to project-scoped .mcp.json with environment variable expansion (${GITHUB_TOKEN}).",
                  "C. Have each developer configure it in user scope with claude mcp add --scope user.",
                  "D. Configure in project scope with a placeholder and have developers override it locally."
            ],
            "correct": [
                  "B"
            ],
            "explanation": {
                  "correct": "Environment variable expansion ensures consistent tooling across the team while keeping sensitive personal tokens secure and local."
            }
      },
      {
            "id": "8-37",
            "domain": "Modularizing Project Memory",
            "type": "single",
            "question": "A CLAUDE.md file has grown over 500 lines and is hard to manage. What approach supports organizing these into focused, topic-specific modules?",
            "options": [
                  "A. Define a .claude/config.yaml file to map patterns to sections in CLAUDE.md.",
                  "B. Split instructions into README.md files in subdirectories.",
                  "C. Create multiple CLAUDE.md files at different directory levels.",
                  "D. Create separate markdown files in .claude/rules/, each covering one topic (e.g., testing.md)."
            ],
            "correct": [
                  "D"
            ],
            "explanation": {
                  "correct": ".claude/rules/ allows for modularized instructions that can be conditionally applied using glob patterns in YAML frontmatter."
            }
      },
      {
            "id": "8-38",
            "domain": "Large-Scale Architectural Changes",
            "type": "single",
            "question": "You need to restructure a monolithic application into microservices involving dozens of files. Which approach should you take?",
            "options": [
                  "A. Start with direct execution and make changes incrementally.",
                  "B. Use direct execution with comprehensive upfront instructions.",
                  "C. Enter plan mode to explore the codebase and design an approach before making changes.",
                  "D. Begin in direct execution and only switch to plan mode if you encounter complexity."
            ],
            "correct": [
                  "C"
            ],
            "explanation": {
                  "correct": "Plan mode is essential for high-stakes architectural changes as it allows Claude to analyze dependencies and propose a strategy before any files are modified."
            }
      }
]
  };

  // Append to global MOCK_EXAMS so the existing app.js picks it up
  if (typeof window !== 'undefined') {
    if (!Array.isArray(window.MOCK_EXAMS)) window.MOCK_EXAMS = [];
    if (!window.MOCK_EXAMS.find(m => m.id === MOCK_8.id)) {
      window.MOCK_EXAMS.push(MOCK_8);
    }
  }
})();
