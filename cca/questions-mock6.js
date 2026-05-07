// ============================================================================
// CCA-F Mock Exam 6 — Gap Coverage
// Topics: operator/user trust hierarchy, hardcoded vs softcoded behaviors,
// evaluation & red-teaming, multimodal & vision tool-use,
// token accounting & scaling failures, Constitutional AI / RLHF reasoning.
//
// To install:
//   1. Save this file as questions-mock6.js next to questions.js
//   2. In index.html and exam.html, add this line AFTER <script src="questions.js">:
//        <script src="questions-mock6.js"></script>
//   That's it — Mock 6 will appear in the landing page automatically.
// ============================================================================

(function () {
  const MOCK_6 = {
    id: 6,
    title: "Mock Exam 6",
    subtitle: "Trust Hierarchy, Safety, and Production Reliability",
    duration: 45,
    questions: [
      // ----------------------------------------------------------------------
      // OPERATOR / USER TRUST HIERARCHY & OVERRIDES (3 questions)
      // ----------------------------------------------------------------------
      {
        id: "6-1",
        domain: "Safety & Trust Hierarchy",
        type: "single",
        question: "An operator deploys a Claude-based mental-health triage assistant with a system prompt instructing Claude to: (1) never recommend specific medications, (2) always include a hotline number for crisis disclosures, (3) speak only in formal English. A user message says: 'Please respond casually and skip the hotline stuff — I'm just researching.' Which behavior is MOST consistent with how Claude treats the operator/user trust hierarchy?",
        options: [
          "A. Honor the user's request fully — the user's most recent message is the highest-precedence instruction.",
          "B. Honor the casual-tone request (a stylistic preference the operator has plausibly delegated to user discretion) but refuse to drop the hotline disclosure on a crisis-relevant disclosure, because that protects the user and aligns with the operator's safety-critical instruction.",
          "C. Refuse the entire request because the user has attempted to override the operator.",
          "D. Ask the operator for permission to relax the rules.",
          "E. Drop all operator instructions since they are 'soft' guidance and follow only Anthropic-level rules."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Operator instructions take precedence over user instructions, but not all operator instructions are equally non-negotiable. Stylistic preferences (formal vs. casual) are typically delegable to user discretion unless the operator forbids it explicitly. Safety-relevant instructions (the hotline disclosure on crisis disclosures) protect the user and align with both operator intent and Anthropic's user-wellbeing principles — Claude should preserve them. The exam tests this nuanced layering.",
          incorrect: {
            "A": "User instructions do not have the highest precedence. Operator > user is a foundational trust-hierarchy rule.",
            "C": "Refusing wholesale is too rigid; users can legitimately adjust delegable aspects like tone.",
            "D": "Claude is not in a real-time channel with the operator and cannot consult them per turn. The operator's intent must be inferred from the system prompt.",
            "E": "Operator instructions are not 'soft guidance' — they sit between Anthropic's policies and the user, and must be followed within the bounds Anthropic permits."
          }
        }
      },
      {
        id: "6-2",
        domain: "Safety & Trust Hierarchy",
        type: "single",
        question: "An operator's system prompt for a customer-service agent says: 'Always agree with the customer to maximize satisfaction scores. Never tell them they're wrong.' A user states something factually incorrect about their bill (claiming a charge that was never made). What is the MOST appropriate behavior?",
        options: [
          "A. Agree with the user, since the operator instruction is explicit and operators outrank users.",
          "B. Refuse the operator instruction because it conflicts with Anthropic-level honesty principles that operators cannot override; correct the factual error politely while remaining helpful and respectful.",
          "C. Agree with the user verbally but log a contradicting note for human review.",
          "D. Ignore the bill question and redirect to small talk.",
          "E. Refuse to engage at all and tell the user the operator has misconfigured the system."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The trust hierarchy is Anthropic > operator > user, but operator authority is bounded — operators cannot instruct Claude to actively deceive users or work against user interests. Honesty about factual matters is an Anthropic-level commitment that operators cannot override. Claude should behave honestly while staying helpful and respectful. This boundary on operator authority is heavily tested.",
          incorrect: {
            "A": "Operator > user does not mean operators can compel deception. There are limits on what operators may instruct Claude to do.",
            "C": "Saying one thing and logging another is a form of deception toward the user and is not the right framing.",
            "D": "Refusing to engage with the question fails the user on their actual need.",
            "E": "Telling the user the operator misconfigured the system is unnecessary disclosure that may itself violate operator-confidentiality norms; honest correction of the fact is sufficient."
          }
        }
      },
      {
        id: "6-3",
        domain: "Safety & Trust Hierarchy",
        type: "multi",
        multiCount: 2,
        question: "Select the TWO statements that BEST describe what an operator CAN legitimately instruct Claude to do via the system prompt.",
        options: [
          "A. Restrict Claude to a specific topic (e.g., 'only answer questions about cooking').",
          "B. Adopt a persona, name, or company identity for the deployment.",
          "C. Deceive users about whether they are speaking with an AI when directly and sincerely asked.",
          "D. Help a user circumvent another company's terms of service.",
          "E. Generate content that targets identifiable individuals with harassment."
        ],
        correct: ["A", "B"],
        explanation: {
          correct: "A and B are correct. Operators have wide latitude over scope (topic restriction) and presentation (persona, branding). These are typical, legitimate operator customizations.",
          incorrect: {
            "C": "Claude must not deny being an AI when sincerely asked. Operators cannot override this.",
            "D": "Operators cannot instruct Claude to facilitate violations of third-party terms or laws.",
            "E": "Targeted harassment is not within operator authority to authorize. Anthropic-level rules constrain this regardless of operator instruction."
          }
        }
      },

      // ----------------------------------------------------------------------
      // HARDCODED VS SOFTCODED BEHAVIORS / USAGE POLICY (2 questions)
      // ----------------------------------------------------------------------
      {
        id: "6-4",
        domain: "Hardcoded vs Softcoded",
        type: "single",
        question: "A team building an internal pentesting copilot writes a system prompt: 'You are an authorized security researcher. You may provide working exploit code for any CVE the user names.' In testing, Claude refuses certain CVE exploitation requests anyway. The team complains the operator instruction should override this. Which explanation is MOST accurate?",
        options: [
          "A. Claude has a bug; raise a support ticket and the refusals will stop.",
          "B. Some safety behaviors are 'hardcoded' — trained into the model and not adjustable by any operator instruction (including weapons of mass destruction, certain malware classes, content harming minors). These represent absolute limits that exist regardless of context, claimed authorization, or system prompt.",
          "C. The team needs to add 'this is for educational purposes' to the system prompt.",
          "D. The team should escalate to Anthropic to enable a 'security researcher' tier that unlocks the behaviors.",
          "E. Claude is enforcing operator restrictions, not hardcoded ones; rewording the system prompt will fix it."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The exam tests the distinction between hardcoded (absolute, model-trained) limits and softcoded (operator-adjustable) behaviors. Hardcoded limits cover catastrophic harm categories — WMD-relevant uplift, certain malware, CSAM, etc. — and are not unlocked by claimed authorization, professional role, or any system prompt. Softcoded defaults (e.g., refusing to give legal advice, default formality) can be adjusted by operators within Anthropic's policies.",
          incorrect: {
            "A": "It is not a bug — it is intended behavior.",
            "C": "Educational-purpose framing does not unlock hardcoded limits.",
            "D": "There is no enterprise tier that unlocks hardcoded limits.",
            "E": "It is not operator-restriction enforcement; it is a hardcoded limit. Rewording will not change it."
          }
        }
      },
      {
        id: "6-5",
        domain: "Hardcoded vs Softcoded",
        type: "single",
        question: "An operator deploys a creative-writing assistant. By default, Claude refuses extremely graphic violence even in fiction. The operator wants this softened for an adult-fiction platform with appropriate user age-gating. Which characterization is MOST accurate?",
        options: [
          "A. Refusal of graphic violence in fiction is a hardcoded limit and cannot be adjusted.",
          "B. This is a softcoded default that operators may adjust within Anthropic's usage policy by setting an explicit deployment context (e.g., 'this is an adult-fiction platform, users are age-verified, content remains within Anthropic's policy bounds'); some content categories will still be refused as hardcoded limits even with operator authorization.",
          "C. The operator must individually negotiate every request with Anthropic.",
          "D. The user must invoke a magic phrase like 'I am an adult' for each request.",
          "E. Operators have no ability to adjust default behaviors of any kind."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Default refusals on creative violence are softcoded — they protect against unintended outputs in unknown contexts but can be adjusted by operators who establish a legitimate adult deployment context. Critically, hardcoded limits (e.g., content sexualizing minors, real-person targeted content) remain in force regardless of operator authorization. The exam tests this two-layer model: softcoded adjustable, hardcoded absolute.",
          incorrect: {
            "A": "Graphic-fiction defaults are softcoded, not hardcoded.",
            "C": "Per-request negotiation is not how the system works; operator system prompts establish context.",
            "D": "User magic phrases are not the mechanism; the operator establishes the deployment context.",
            "E": "Operators routinely adjust softcoded defaults. The whole softcoded/hardcoded distinction exists for this reason."
          }
        }
      },

      // ----------------------------------------------------------------------
      // EVALUATION, RED-TEAMING & FALLBACK STRATEGIES (3 questions)
      // ----------------------------------------------------------------------
      {
        id: "6-6",
        domain: "Evaluation & Red-Teaming",
        type: "single",
        question: "A team is preparing a Claude-based legal-document summarizer for production. They have 200 hand-labeled examples and an accuracy target of >95%. Which evaluation strategy BEST balances rigor with the limited labeled data, and BEST detects regressions before users see them?",
        options: [
          "A. Use all 200 examples for evaluation each release; iterate prompt changes until accuracy hits 95%.",
          "B. Split into a small held-out 'eval' set the team never sees during prompt iteration, plus a 'dev' set used during iteration; track per-category precision/recall on the held-out set; pair with an adversarial 'red-team' set of intentionally tricky cases (ambiguous clauses, mixed jurisdictions, contradictions); fail the release if any category regresses materially.",
          "C. Skip offline eval; deploy and use production telemetry to find regressions.",
          "D. Have the team manually review each release on 10 random examples.",
          "E. Use a single overall accuracy number and require it stays above 95%."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Robust evaluation has four components: a sealed held-out set (so iteration doesn't leak into eval), per-category metrics (so rare failures don't get masked by aggregate accuracy), a red-team set (adversarial cases that probe known weak points), and regression alerting at the category level. Without a held-out set, every iteration risks overfitting to the eval set; without a red-team set, you optimize for the easy distribution; without per-category tracking, swaps between categories can leave overall numbers flat while real harm occurs.",
          incorrect: {
            "A": "Iterating on the same eval set causes evaluation overfitting; the 95% number stops being meaningful as a generalization estimate.",
            "C": "Production telemetry lacks ground truth and lags real harm. It is a complement to offline eval, not a replacement.",
            "D": "Spot checks on small random samples are too noisy and unsystematic for a 95% target.",
            "E": "A single number can hide major per-category regressions, especially with imbalanced data."
          }
        }
      },
      {
        id: "6-7",
        domain: "Evaluation & Red-Teaming",
        type: "single",
        question: "A team deploys a customer-facing agent. They want a fallback strategy for the case where Claude produces low-confidence or potentially harmful output. Which architecture BEST balances reliability and user experience?",
        options: [
          "A. Send all responses through a human review queue before delivery.",
          "B. Use a tiered fallback: (i) pre-flight input filters that block clearly out-of-policy requests; (ii) for the agent's response, a deterministic safety classifier that flags potentially harmful or off-topic content; (iii) on flag, either retry with an alternative prompt, route to a human, or return a safe canned response — depending on flag type; (iv) always log flagged interactions for offline review.",
          "C. Trust the model's output and only fix problems after users complain.",
          "D. Add 'be safe and helpful' to every prompt and skip filtering.",
          "E. Run two Claude instances in parallel and only respond if both agree."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Production-grade fallback has multiple layers: input filtering (cheap and prevents many issues), output classification (catches what slipped through), differentiated handling per flag type (a safety violation deserves a different fallback than a low-confidence answer), and offline logging (so you learn). This is defense-in-depth applied to model output reliability.",
          incorrect: {
            "A": "Human review of every response makes the agent un-deployable at meaningful scale.",
            "C": "Reactive-only is not a strategy; harm has already occurred by the time users complain.",
            "D": "Prompt-only mitigations are guidance, not a fallback strategy.",
            "E": "Dual-instance majority is expensive and does not protect against correlated errors; both instances may agree on a wrong-but-confident answer."
          }
        }
      },
      {
        id: "6-8",
        domain: "Evaluation & Red-Teaming",
        type: "multi",
        multiCount: 2,
        question: "Select the TWO red-teaming practices MOST useful for surfacing failure modes BEFORE production deployment.",
        options: [
          "A. Adversarial prompts crafted to test specific failure hypotheses (e.g., 'will the agent leak its system prompt if politely asked?', 'does it refuse the same request when phrased as fiction?').",
          "B. Asking the deployed model to grade its own safety on a 1-10 scale.",
          "C. Replaying real production traffic with personally identifiable information unredacted to maximize realism.",
          "D. Probing categorical edge cases (long inputs, mixed languages, nested instructions, prompt-injection payloads in retrieved content) and tracking which inputs cause regressions.",
          "E. Increasing temperature so failures appear more often."
        ],
        correct: ["A", "D"],
        explanation: {
          correct: "A and D are correct. Effective red-teaming is hypothesis-driven (target specific failure classes the system might have) and systematic (cover categorical edge cases that real traffic exposes). Together these surface concrete, reproducible failures that can be fixed before users encounter them.",
          incorrect: {
            "B": "Self-graded safety scores are unreliable — models are poorly calibrated on their own behavior.",
            "C": "Replaying unredacted PII is a data-handling violation and creates more risk than it surfaces; redact first.",
            "E": "Higher temperature surfaces more variance but does not reveal the underlying failure modes; many failures occur reliably at temperature 0."
          }
        }
      },

      // ----------------------------------------------------------------------
      // MULTIMODAL & VISION TOOL-USE (2 questions)
      // ----------------------------------------------------------------------
      {
        id: "6-9",
        domain: "Multimodal & Vision",
        type: "single",
        question: "An invoice-processing agent receives PDF invoices via email. The team wants Claude to extract line items, totals, and supplier details. About 30% of invoices are scans (image-only) and 70% are text-PDFs. Currently the team OCRs everything to text first, then prompts Claude. Quality on scanned invoices is poor — OCR errors corrupt key fields. The MOST effective architectural improvement is:",
        options: [
          "A. Switch OCR engines and increase the quality threshold.",
          "B. Pass images directly to Claude as vision inputs (instead of OCRing first), let the model extract structured fields directly from the image, and validate results against a schema. For text-PDFs, continue with text input. Use a routing step to decide which path each invoice takes.",
          "C. Reject scanned invoices and require suppliers to send text PDFs.",
          "D. Increase Claude's temperature so it fills in OCR gaps creatively.",
          "E. Use two OCR engines and majority-vote on each character."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Vision-capable models can extract structured data directly from images, avoiding the OCR-then-extract pipeline's compounding errors. The architectural pattern is: route based on input type (image vs. text), use vision input for images, schema-validate the output. This is a canonical multimodal extraction pipeline.",
          incorrect: {
            "A": "Better OCR helps marginally but the OCR-then-extract architecture still compounds errors.",
            "C": "Refusing legitimate input is not an architectural fix.",
            "D": "Higher temperature makes the model fabricate to fill gaps — exactly the wrong direction.",
            "E": "Character-level OCR consensus does not solve the fundamental problem (lost layout context, misread tabular structure) and adds cost."
          }
        }
      },
      {
        id: "6-10",
        domain: "Multimodal & Vision",
        type: "single",
        question: "A radiology-adjacent app sends medical images to Claude with the prompt 'describe any abnormalities and recommend a diagnosis.' Compliance flags the deployment. Which architectural / policy change is MOST appropriate?",
        options: [
          "A. Add 'this is medical' to the system prompt and proceed.",
          "B. Restrict the agent's role to descriptive observation and summarization (e.g., 'describe what is visible in the image'), explicitly avoid diagnostic recommendations, ensure outputs always refer the user to a qualified clinician, and design the deployment so a human medical professional remains the decision-maker. Add disclaimers and operator-side rate-limits/access controls appropriate for the regulated context.",
          "C. Have Claude recommend a diagnosis but require the user to type 'I accept liability' first.",
          "D. Run Claude's diagnosis through a second Claude instance for verification.",
          "E. Disable the deployment entirely."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. The architectural answer in regulated/high-stakes domains is to scope the agent's role to what it can do safely (description, summarization, surfacing relevant prior cases) and keep the actual decision with a qualified human. Disclaimers, access controls, and not crossing into diagnostic claims are all consistent with Anthropic's guidance on high-stakes deployments.",
          incorrect: {
            "A": "Tagging the prompt does not address the substantive issue: Claude making diagnostic recommendations without medical authority.",
            "C": "User-clicked liability waivers do not transfer responsibility appropriately and are not a substitute for sound clinical workflow.",
            "D": "A second Claude instance verifying a diagnosis does not produce clinical authority — it just doubles the same kind of system.",
            "E": "Disabling entirely forfeits legitimate value; bounded deployment is preferable to outright refusal."
          }
        }
      },

      // ----------------------------------------------------------------------
      // TOKEN ACCOUNTING & SCALING FAILURES (2 questions)
      // ----------------------------------------------------------------------
      {
        id: "6-11",
        domain: "Token Accounting & Scale",
        type: "single",
        question: "A B2B chatbot's average conversation has 25 turns. Engineers notice that on the 18th–25th turns, latency spikes from 1.5s to 9s and costs quadruple. Each user message is short (~50 tokens). What is the MOST LIKELY root cause and BEST fix?",
        options: [
          "A. The user is typing too slowly; add a server-side timeout.",
          "B. Conversation history grows linearly with each turn — by turn 20, the model is processing the full history (system prompt + 20 prior turns + tool results) on every call, which is the latency and cost driver. Fix: implement context compaction (structured summary of older turns), preserve recent turns verbatim, and pin the system prompt; optionally enable prompt caching for the stable prefix.",
          "C. The model is hallucinating, which slows generation; lower temperature.",
          "D. Network latency increases with conversation length; switch CDNs.",
          "E. Add max_tokens limits to cap output size."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. This is the canonical 'app breaking at scale' pattern. Conversation tokens accumulate; every turn re-processes the entire history. Linear input growth produces the observed latency / cost curve. The fix is structured context management: compaction of old turns, verbatim retention of recent turns, system-prompt pinning, and prompt caching on the stable prefix.",
          incorrect: {
            "A": "User typing speed has no relation to model latency or cost.",
            "C": "Hallucination does not produce 6× latency; the cause is input token growth.",
            "D": "Network latency is roughly constant; this scales with input size.",
            "E": "Output limits don't address the input-cost driver."
          }
        }
      },
      {
        id: "6-12",
        domain: "Token Accounting & Scale",
        type: "single",
        question: "A team observes that a particular customer's traffic causes hard rate-limit failures during peak hours. They use a single API key for all customers. Which architectural change BEST addresses both fairness across customers AND graceful handling under load?",
        options: [
          "A. Buy a higher rate-limit tier and call it solved.",
          "B. Implement per-customer quotas and a request queue with backpressure: requests exceeding a customer's quota are queued or fail with a structured 'rate-limited' error the agent layer can handle. Track usage per customer for billing/alerting. Independently, request appropriate organization-level rate limits with Anthropic. Use exponential backoff for retries on 429 responses, but only at the orchestration layer — never tight-loop retry from the agent itself.",
          "C. Have the agent retry rate-limited calls in a tight loop until success.",
          "D. Drop requests randomly when limits approach.",
          "E. Disable rate-limit handling and let the platform deal with it."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Multi-tenant rate-limit handling has three components: per-customer quotas (so one customer can't starve others), structured propagation of rate-limit signals (so the orchestration layer can decide what to do), and disciplined backoff at the orchestration layer (not from the agent loop, which would compound retries). This is the standard reliability pattern for shared API budgets.",
          incorrect: {
            "A": "Higher tier without per-customer fairness still allows one customer to starve others.",
            "C": "Tight-loop retries from the agent worsen rate-limit pressure and waste tokens.",
            "D": "Random drops are unfair and unobservable to the affected customer.",
            "E": "Ignoring rate limits causes user-visible failures with no mitigation."
          }
        }
      },

      // ----------------------------------------------------------------------
      // CONSTITUTIONAL AI / RLHF REASONING IN SCENARIOS (3 questions)
      // ----------------------------------------------------------------------
      {
        id: "6-13",
        domain: "Constitutional AI & Training",
        type: "single",
        question: "A developer is debugging why Claude consistently refuses a request that seems benign (asking for a list of common household chemicals that should not be mixed, framed as a kitchen-safety concern). The developer wonders if a different prompt could 'unlock' the response. Which framing is MOST architecturally sound?",
        options: [
          "A. Try jailbreak-style prompts until one works; the model is over-cautious by default.",
          "B. Recognize that Claude's refusals reflect trained-in dispositions (from Constitutional AI / RLHF) calibrated against expected harms and benefits across many users; the right path is not to bypass via prompt, but to provide clear deployment context (operator system prompt establishing audience and purpose) so the model's response is appropriately calibrated. If the deployment context cannot justify the response, the refusal is likely correct.",
          "C. Fine-tune a custom model that doesn't refuse.",
          "D. Add ten apologies before the request to soften Claude's stance.",
          "E. Always rephrase requests as fiction to bypass safety."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. Constitutional AI / RLHF instill dispositions that reflect safety-utility trade-offs aggregated across many possible users. A particular user's benign intent does not change those priors, but a deployment context (operator prompt) can. The right architectural move is to establish appropriate deployment context, not to circumvent. If no deployment context can justify the response, the refusal is signaling a real concern.",
          incorrect: {
            "A": "Jailbreak-bypass framing misunderstands what trained refusals are; it also encourages adversarial habits.",
            "C": "Fine-tuning to remove safety properties is not a recommended or supported direction in Anthropic's deployment model.",
            "D": "Politeness manipulation is not a reliable or principled path.",
            "E": "Fiction framing for safety bypass is a known anti-pattern; Claude is trained to be skeptical of it."
          }
        }
      },
      {
        id: "6-14",
        domain: "Constitutional AI & Training",
        type: "single",
        question: "A team observes that two semantically equivalent prompts produce noticeably different responses — one is helpful, the other is refused. They are debating whether this is a model bug or expected behavior. Which is MOST accurate?",
        options: [
          "A. It is a model bug and should be reported.",
          "B. Trained model behavior is sensitive to surface features (phrasing, framing, context cues) because RLHF training rewards/penalizes patterns that go beyond strict semantics. Different phrasings can legitimately push the model into different response distributions. The correct response is to (i) treat the more conservative behavior as the default, (ii) use system prompts to establish stable context, and (iii) build evals that probe phrasing variance to detect when it matters.",
          "C. The model is broken and should not be deployed.",
          "D. Always use the prompt that gets the helpful response.",
          "E. Phrasing sensitivity has no architectural implications."
        ],
        correct: ["B"],
        explanation: {
          correct: "B is correct. RLHF-trained models are not strict semantic functions — surface features carry signal because training data and reward models reflect them. Production architectures should expect this and (a) default to the more conservative behavior in ambiguous cases, (b) establish stable deployment context to reduce variance, and (c) measure phrasing sensitivity in evals so the team knows where it matters.",
          incorrect: {
            "A": "Phrasing sensitivity is expected behavior of RLHF-trained models, not a bug.",
            "C": "Phrasing variance is a known property of all current production LLMs; it does not preclude deployment when handled properly.",
            "D": "Always picking the more permissive phrasing is reverse-engineering the safety system, which is the opposite of responsible architecture.",
            "E": "It does have architectural implications — eval design and prompt stability are downstream of it."
          }
        }
      },
      {
        id: "6-15",
        domain: "Safety & Trust Hierarchy",
        type: "multi",
        multiCount: 3,
        question: "Capstone scenario. You are architecting a Claude-based agent for a financial-advisory firm. Regulated industry, sensitive user data, customer-facing. Select the THREE architectural choices that BEST reflect responsible-deployment principles.",
        options: [
          "A. Use a clear operator system prompt establishing the deployment context, allowed scope (e.g., 'general informational responses about products; never personalized investment advice'), and required disclosures.",
          "B. Implement a tiered safety architecture: input filters → agent → output classifier → human-in-the-loop for any output flagged as personalized advice or containing PII; log everything for audit.",
          "C. Trust the model to handle compliance correctly because Constitutional AI training will catch issues.",
          "D. Define an evaluation harness with regulator-relevant scenarios (suitability, disclosure, conflict-of-interest situations) and run it on every prompt or model change before rollout.",
          "E. Provide users a 'pro mode' that disables safety filters in exchange for accepting a click-through disclaimer."
        ],
        correct: ["A", "B", "D"],
        explanation: {
          correct: "A, B, and D are correct. Together they form the canonical responsible-deployment stack for regulated domains: (A) operator-level scope and disclosure, (B) layered runtime safety with human-in-the-loop for high-risk outputs and full audit logging, (D) regulator-aligned evaluation that runs on every change. This is exactly the 'Solutions Architect deploying Claude responsibly' lens the exam tests.",
          incorrect: {
            "C": "Constitutional AI is part of the safety story but is not a substitute for deployment-level controls; relying on training alone is not responsible production architecture in regulated domains.",
            "E": "User-disabled safety filters are not a legitimate pattern in regulated, customer-facing deployments. Click-through disclaimers do not transfer regulatory responsibility."
          }
        }
      }
    ]
  };

  // -------------------------------------------------------------------------
  // Append to the global MOCK_EXAMS list so the existing app.js picks it up
  // -------------------------------------------------------------------------
  if (typeof window !== 'undefined') {
    if (!Array.isArray(window.MOCK_EXAMS)) {
      window.MOCK_EXAMS = [];
    }
    // Prevent duplicate registration if this file is included twice
    if (!window.MOCK_EXAMS.find(m => m.id === MOCK_6.id)) {
      window.MOCK_EXAMS.push(MOCK_6);
    }
  }
})();
