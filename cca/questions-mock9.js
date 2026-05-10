// ============================================================================
// CCA-F Mock Exam 9 — CI Code Review Scenario
// 16 questions covering D3 Claude Code Config, D4 Prompt Engineering
// ============================================================================

(function () {
  const MOCK_9 = {
    id: 9,
    title: "Mock Exam 9",
    subtitle: "CI Code Review — Automated PR Analysis Patterns",
    duration: 45,
    questions: [
      {
        "id": "9-1",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your automated code review averages 15 findings per pull request, with developers reporting a 40% false positive rate. The bottleneck is investigation time: developers must click into each finding to read Claude's reasoning before deciding whether to address or dismiss it. Your CLAUDE.md already contains comprehensive rules for acceptable patterns, and stakeholders have rejected any approach that filters findings before developer review. What change would best address the investigation time bottleneck?",
        "options": [
          "A. Add a post-processor that analyzes finding patterns and automatically suppresses those matching historical false positive signatures",
          "B. Require Claude to include its reasoning and confidence assessment inline with each finding",
          "C. Configure Claude to only surface findings it assesses as high confidence, filtering out uncertain flags before developers see them",
          "D. Categorize findings as 'blocking issues' versus 'suggestions' with tiered review requirements"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "The bottleneck is investigation time caused by developers having to open each finding separately to read reasoning. Including reasoning inline eliminates that click-through overhead without filtering. Option A violates the stakeholder constraint against pre-filtering. Option C also violates the no-filtering constraint. Option D adds categorization but doesn't reduce the per-finding investigation overhead."
        }
      },
      {
        "id": "9-2",
        "domain": "Claude Code",
        "type": "single",
        "question": "Your CI pipeline runs the Claude Code CLI (with --print mode) using CLAUDE.md to provide project context for code reviews. Developers want each finding automatically posted as a separate inline PR comment with structured data. What's the most effective approach?",
        "options": [
          "A. Keep the narrative review format but add a summarization step that uses Claude to generate a structured JSON summary",
          "B. Use CLI flags --output-format json and --json-schema to enforce structured findings, then parse output to post inline comments via the GitHub API",
          "C. Include explicit formatting instructions in your review prompt requiring parseable templates",
          "D. Add a 'Review Output Format' section to CLAUDE.md with examples"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "CLI flags that enforce a structured output schema give the most reliable machine-parseable results for downstream GitHub API calls. Option A adds unnecessary latency and cost with a second Claude call. Options C and D rely on prompt-based formatting instructions, which are probabilistic — the model may not follow them precisely enough for reliable automated parsing."
        }
      },
      {
        "id": "9-3",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your automated reviews identify valid issues but developers report the feedback isn't actionable. Findings are vague and inconsistent. What prompting technique would most reliably produce consistently actionable feedback?",
        "options": [
          "A. Add 3-4 few-shot examples showing the exact format you want",
          "B. Further refine the instructions with more explicit requirements",
          "C. Expand the context window to include more surrounding code",
          "D. Implement a two-pass approach where one prompt identifies issues and another generates fixes"
        ],
        "correct": ["A"],
        "explanation": {
          "correct": "Few-shot examples are the most effective technique for teaching consistent output format and style. When findings are vague and inconsistent despite detailed instructions, concrete worked examples showing ideal feedback give the model a precise target to follow. Option B (more instructions) often produces the same inconsistency. Option C addresses context scope, not output quality. Option D adds complexity without addressing the root cause of vague outputs."
        }
      },
      {
        "id": "9-4",
        "domain": "Claude Code",
        "type": "single",
        "question": "After an initial automated review generates findings, developers push new commits. The next review run duplicates comments on already-fixed code. What's the most effective solution?",
        "options": [
          "A. Restrict the review scope to only files modified in the most recent push",
          "B. Run reviews only on initial PR creation and final pre-merge state",
          "C. Add a post-processing filter removing findings matching previous issue descriptions",
          "D. Include prior review findings in context and instruct Claude to report only new or unresolved issues"
        ],
        "correct": ["D"],
        "explanation": {
          "correct": "Including prior review context and explicitly instructing Claude to report only new or unresolved issues is the most complete solution — it avoids duplicates while ensuring previously found issues that weren't addressed still surface. Option A misses persistent issues in unchanged files. Option B reduces coverage. Option C string-matching is brittle and misses rephrased but equivalent issues."
        }
      },
      {
        "id": "9-5",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "A pull request modifies 14 files across a module. Single-pass review produces inconsistent and contradictory feedback — identical patterns flagged as problematic in one file but approved in another. How should you restructure the review?",
        "options": [
          "A. Switch to a higher-tier model with a larger context window",
          "B. Split into focused passes: analyze each file individually, then run a separate integration-focused pass",
          "C. Run three independent review passes and keep overlapping findings only",
          "D. Require developers to split PRs into smaller submissions"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Splitting reviews into focused passes directly addresses attention dilution. File-by-file analysis produces consistent depth; the separate integration pass catches cross-file issues without the middle-content attention penalty. Option A misunderstands the issue — window size doesn't fix attention quality. Option C consensus filtering suppresses real bugs caught only intermittently. Option D shifts burden to developers without improving the system."
        }
      },
      {
        "id": "9-6",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your code review component works iteratively with tool calling — Claude reads files, analyzes them, then reads more based on findings. What is the primary technical constraint when considering batch processing for this workflow?",
        "options": [
          "A. Batch latency is too slow for PR feedback",
          "B. Batch processing lacks correlation identifiers for matching requests to results",
          "C. The asynchronous model prevents executing tools mid-request and returning results for Claude to continue analysis",
          "D. The batch API doesn't support tool definitions in requests"
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "The Message Batches API is fundamentally asynchronous — once a batch is submitted, Claude processes it offline and you retrieve results later. This architecture cannot support the real-time tool execution loop required for agentic code review, where Claude calls a tool, receives the result, and continues reasoning. This is not a latency concern — it's a fundamental architectural incompatibility. Option B is false — batch results use custom_id for correlation. Option D is also false — tool definitions are supported."
        }
      },
      {
        "id": "9-7",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your CI pipeline includes a pre-merge blocking review (developers must wait for results before merging) and an overnight deep analysis mode (results reviewed next morning). Which mode should use the Message Batches API?",
        "options": [
          "A. Pre-merge commit hook only",
          "B. Both modes",
          "C. Deep analysis only",
          "D. Neither mode"
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Deep analysis runs overnight with no immediate latency requirement — a perfect batch candidate capturing the 50% cost savings. The pre-merge blocking review requires results before developers can merge; the Batches API's up-to-24-hour processing window makes it completely unsuitable here. Any unpredictable delay blocks the development workflow."
        }
      },
      {
        "id": "9-8",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your CI/CD system performs: (1) PR style checks — developers wait for results before merging, (2) weekly security audits — scheduled with no urgency, (3) nightly test generation — results needed by start of next business day. Which API approach correctly matches workflow requirements?",
        "options": [
          "A. Use Message Batches API for all tasks",
          "B. Use synchronous calls for all tasks",
          "C. Use synchronous calls for PR checks and nightly generation; use Message Batches only for weekly audits",
          "D. Use synchronous calls for PR checks; use Message Batches for weekly audits and nightly test generation"
        ],
        "correct": ["D"],
        "explanation": {
          "correct": "PR style checks are blocking (developers wait) — synchronous only. Weekly security audits have no immediate latency requirement — ideal batch candidate with 50% cost savings. Nightly test generation runs on a schedule with results needed by morning — batch fits within the 24h window. Option C incorrectly keeps nightly generation synchronous, missing cost savings. Options A and B fail to match API characteristics to workflow requirements."
        }
      },
      {
        "id": "9-9",
        "domain": "Claude Code",
        "type": "single",
        "question": "Your pipeline script runs the claude command but the CI job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct flag to enable non-interactive headless mode?",
        "options": [
          "A. Add the -p flag",
          "B. Add the --batch flag",
          "C. Redirect stdin from /dev/null",
          "D. Set CLAUDE_HEADLESS=true"
        ],
        "correct": ["A"],
        "explanation": {
          "correct": "The -p (--print) flag is the documented mechanism for non-interactive headless operation. It processes the prompt, writes output to stdout, and exits cleanly without waiting for user input. Option B (--batch) does not exist in Claude Code. Option C is a Unix workaround that doesn't properly address Claude Code's interactive mode. Option D references an environment variable that does not exist in Claude Code."
        }
      },
      {
        "id": "9-10",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Claude-generated code suggestions frequently contain subtle issues that only another reviewer catches. The same Claude session that generated the code also reviewed it and found no problems. Which approach addresses this self-review limitation?",
        "options": [
          "A. Add explicit self-review instructions telling Claude to be critical of its own output",
          "B. Include comprehensive tests and documentation in context before requesting review",
          "C. Have a second independent Claude instance review the changes without seeing the generator's reasoning",
          "D. Enable extended thinking mode for the review step"
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "Self-review fails because the model retains its generation reasoning — it knows why it wrote code a certain way and is less likely to question those decisions. An independent Claude instance reviewing without that prior reasoning context approaches the code fresh and catches issues the generator would rationalize away. Options A and B don't address the reasoning-retention root cause. Option D doesn't solve the fundamental problem of reasoning context contamination."
        }
      },
      {
        "id": "9-11",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your review checks comments and docstrings but flags acceptable comments as misleading while missing actually misleading ones. The current instruction is 'flag comments that could mislead developers.' What change addresses the root cause?",
        "options": [
          "A. Filter TODO/FIXME patterns before analysis to reduce noise",
          "B. Include git blame data to understand comment age and author context",
          "C. Specify explicit criteria: flag comments only when the claimed behavior contradicts actual code behavior",
          "D. Add few-shot examples of misleading comments to calibrate the model"
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "The root cause is imprecise review criteria — 'could mislead' is subjective and interpreted inconsistently. Explicit behavioral criteria ('flag when claimed behavior contradicts actual code') gives the model a precise, testable standard. Option A pre-filters valid content. Option B adds irrelevant data for this use case. Option D (few-shots) helps but doesn't fix the missing explicit criteria that is the root cause of the problem."
        }
      },
      {
        "id": "9-12",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your automated review system shows inconsistent severity ratings — the same type of issue gets rated Critical in one PR and Low in another. What's the most effective way to improve severity consistency?",
        "options": [
          "A. Request reasoning for each severity assignment so you can audit the logic",
          "B. Include explicit severity criteria in the prompt with concrete examples for each level",
          "C. Add a CLAUDE.md mapping issue types to default severities",
          "D. Rate severity relative to other issues in the same PR rather than absolute standards"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "Inconsistent severity ratings indicate the model lacks a clear severity framework. Explicit criteria with concrete examples (e.g., 'Critical: causes data loss or security breach; High: breaks functionality; Medium: degrades performance') gives the model a precise rubric to apply consistently. Option A adds reasoning visibility but not consistency. Option C helps but CLAUDE.md rules are less targeted than prompt-level criteria. Option D introduces relative rating which adds instability across PRs."
        }
      },
      {
        "id": "9-13",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Analysis of your review system shows: style and documentation categories have 60%+ false positive rates, while security and bug detection have less than 5%. Developers have started ignoring ALL review findings because they don't trust the system. What approach best restores developer trust?",
        "options": [
          "A. Keep all categories but display confidence scores so developers can filter themselves",
          "B. Reduce strictness uniformly across all categories to lower false positives overall",
          "C. Keep all categories enabled while improving prompts for the high false positive categories",
          "D. Temporarily disable high false positive categories and retain only high-precision categories"
        ],
        "correct": ["D"],
        "explanation": {
          "correct": "When one category's false positive rate poisons trust in all findings, the correct response is surgical: disable the problematic category temporarily to restore trust in the accurate categories, then improve that category's prompts offline. Option A adds noise — developers still see the bad findings. Option B degrades the accurate categories unnecessarily. Option C keeps the trust damage ongoing while improvements are made."
        }
      },
      {
        "id": "9-14",
        "domain": "Prompt Engineering",
        "type": "single",
        "question": "Your automated review generates test suggestions, but 60% of suggestions duplicate existing tests in the codebase. Developers find this wastes their time. What change most effectively reduces duplicates?",
        "options": [
          "A. Include the existing test file in context when requesting test suggestions",
          "B. Reduce the number of requested suggestions from 10 to 5 per review",
          "C. Implement post-processing that matches suggestion keywords against existing test names",
          "D. Restrict suggestions to only edge cases and error conditions"
        ],
        "correct": ["A"],
        "explanation": {
          "correct": "The model generates duplicates because it doesn't know what already exists. Providing the existing test file as context lets Claude see exactly what's already covered and generate only genuinely new tests. Option B reduces quantity but not duplication rate. Option C adds post-processing complexity without addressing the root cause — the model still generates duplicates, you just filter them later. Option D narrows scope but still doesn't prevent duplicates within that scope."
        }
      },
      {
        "id": "9-15",
        "domain": "Claude Code",
        "type": "single",
        "question": "You've found that including 2-3 full exemplar endpoint implementations as context significantly improves consistency when generating new API endpoints. However, this context is only useful for creating new endpoints — not for bug fixes, code reviews, or other API directory work. What's the most efficient configuration approach?",
        "options": [
          "A. Reference the exemplar endpoints manually in each endpoint generation request",
          "B. Add the exemplar endpoint code to CLAUDE.md so it's always available",
          "C. Create a skill referencing the exemplar endpoints and invoke it on-demand when generating endpoints",
          "D. Configure path-specific rules in .claude/rules/api/ that auto-load the exemplars"
        ],
        "correct": ["C"],
        "explanation": {
          "correct": "A skill that bundles the exemplar context and is invoked only when generating new endpoints is the precise fit: the context is available when needed and absent otherwise. Option A (manual reference each time) is error-prone and inconsistent across team members. Option B (CLAUDE.md) loads the exemplar context for ALL work in the project — bug fixes, reviews, etc. — wasting tokens on irrelevant operations. Option D (path rules) auto-applies to every file operation in the path, same over-inclusion problem as B."
        }
      },
      {
        "id": "9-16",
        "domain": "Claude Code",
        "type": "single",
        "question": "Your team created a /migration skill that generates database migration files. Three problems have emerged: (1) developers forget required arguments causing malformed migrations, (2) prior conversation context bleeds in causing schema confusion, (3) the skill occasionally runs DROP statements from previous sessions. Which configuration best addresses all three problems?",
        "options": [
          "A. Use positional parameters and explicit schema file references via @ syntax",
          "B. Add argument-hint frontmatter, use context: fork, and restrict allowed-tools",
          "C. Add validation instructions in SKILL.md and explicit prompts to ignore prior context",
          "D. Split into separate /migration-create and /migration-apply skills with different scopes"
        ],
        "correct": ["B"],
        "explanation": {
          "correct": "The three issues map directly to three skill configuration options: (1) argument-hint frontmatter prompts for required parameters before skill executes, preventing missing arguments; (2) context: fork runs the skill in an isolated subagent, preventing context bleeding from prior conversations; (3) allowed-tools restriction limits which tools and Bash commands the skill can invoke, blocking DROP/destructive operations. Each option addresses exactly one of the three problems, and they combine cleanly."
        }
      }
    ]
  };

  // Append to global MOCK_EXAMS so the existing app.js picks it up
  if (typeof window !== 'undefined') {
    if (!Array.isArray(window.MOCK_EXAMS)) window.MOCK_EXAMS = [];
    if (!window.MOCK_EXAMS.find(m => m.id === MOCK_9.id)) {
      window.MOCK_EXAMS.push(MOCK_9);
    }
  }
})();
