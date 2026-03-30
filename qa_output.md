**Q: How can you make your application scalable for a big traffic day?**
◆ Framework: Plan ahead, scale at every layer 
-  Pre-warm ALBs  via AWS Support request for known traffic spikes 
-  Auto Scaling Groups:  set min/desired > 1; use Warm Pools for pre-initialized
                      EC2 instances 
-  Scheduled Scaling  when traffic time is predictable (e.g., a product launch
                      window) 
-  Lightweight AMIs  reduce provisioning time during burst scale-out 
-  RDS Proxy  for connection pooling — prevents DB overload during traffic surges 
-  AWS Countdown:  Simulate and validate parameters with your account team 
-  Limits:  Check and raise soft account limits; consider
                      multi-region/multi-account for extreme scale 
 ★ STAR Answer — Enterprise Pharma Mobile CI/CD  Situation  Mobile CI/CD pipeline faced burst load during global release windows — multiple teams
                          triggering iOS and Android builds simultaneously, coinciding with quarterly pharma compliance
                          deadlines.  Task  Ensure the self-hosted macOS runner fleet and supporting AWS infrastructure didn't become
                          bottlenecks on high-traffic release days, while meeting GxP audit requirements.  Action  Designed a dynamic runner scaling strategy using GitHub Actions runner groups with
                          concurrency limits and queue-aware autoscaling. Fastlane's parallel lane execution combined
                          with dependency caching on S3 flattened burst demand. Deployed Kubernetes HPA tied to custom
                          metrics (queue depth). Implemented scheduled scaling policies so infrastructure was pre-warmed
                          before traffic arrived.  Result  iOS build time dropped from 45→15 min. Release cycles compressed from 2 days→15 min.
                          Developer NPS reached +45. Zero degradation on peak release days.

**Q: What is an AI agent?**
◆ Definition & Key Properties 
-  Definition:  A software program that autonomously chooses the best sequence of
                      actions to complete a goal — distinguishing it from simple conditional workflows or standalone
                      LLMs. 
-  Reasoning Engine:  Uses an LLM to decide which tools to invoke and in what order 
-  Feedback Loop:  Perceives context, acts, observes results, and iterates
                      continuously 
-  AWS Implementation:  Lambda or EC2 for execution, Amazon Bedrock for the LLM,
                      MCP for tool integration 
 ★ STAR Answer — AutoDocs (SKCloudOps)  Situation  While building AutoDocs under SKCloudOps, contributors kept confusing it with a simple API
                          wrapper. Needed a concrete architectural distinction.  Task  Define what made AutoDocs an agent — and design it so the agentic behavior was opt-in, not
                          mandatory.  Action  Built a dual-engine architecture: heuristic default requiring no API key, and an AI opt-in
                          mode activating the full agent loop (perception → reasoning → action → feedback). The agent
                          reads a git diff, the LLM decides which files need documentation, generates and writes it
                          back, then evaluates quality and iterates.  Result  Shipped with 91% statement coverage across 86 tests. The dual-engine pattern became a design
                          reference for the AI CI/CD Guardian action. Cited as a key differentiator in the GitHub
                          Marketplace listing.

**Q: How do you achieve disaster recovery for your cloud application?**
◆ Framework: RTO/RPO drives strategy selection  Strategy  RTO  RPO  Best For  Backup & Restore  Hours  Hours  Non-critical / cost-sensitive  Pilot Light  Min–Hours  Minutes  Core services always on  Warm Standby  Minutes  Seconds  Business-critical apps  Multi-site Active-Active  Near zero  Near zero  Enterprise critical / pharma 
 ★ STAR Answer — Enterprise Pharma DevSecOps Pipeline  Situation  Pharma GxP compliance required the DevSecOps pipeline — Vault clusters, GitHub OIDC
                          federation, artifact storage — to meet strict RTO/RPO targets. A pipeline outage during a
                          regulated release window would trigger audit findings.  Task  Design DR for the CI/CD platform without static credentials or manual recovery runbooks.  Action  Implemented Warm Standby: Vault clusters replicated across two AWS regions with automated
                          unsealing via AWS KMS. GitHub OIDC federation meant no long-lived secrets. Terraform state in
                          S3 with versioning and cross-region replication. Recovery was a  terraform apply  ,
                          not a runbook.  Result  Recovery became automated and auditable. Zero static credentials meant no credential-leak
                          exposure during failover. Architecture referenced in pharma compliance documentation as the DR
                          standard.

**Q: How do you secure your application on the cloud?**
◆ Framework: Defense in Depth — every layer 
-  Edge:  AWS WAF — protect against SQL injection, XSS, DDoS 
-  Auth:  Amazon Cognito for user auth; OIDC/JWT for machine identity 
-  Transit:  SSL/TLS everywhere; custom certificates via ACM; API Gateway enforces
                      HTTPS 
-  Compute:  IAM roles with least privilege; Amazon Inspector for Lambda
                      vulnerability scanning 
-  Secrets:  AWS Secrets Manager or HashiCorp Vault; never environment variables 
-  Data at rest:  KMS encryption for RDS, S3, EBS 
-  Audit:  CloudTrail, GuardDuty, Security Hub for continuous posture monitoring 
 ★ STAR Answer — Enterprise Pharma Zero-Static-Credentials
                      Architecture  Situation  Both Enterprise Pharma (pharma, GxP) and Societe Generale (financial services) required
                          zero-tolerance security postures. The legacy approach used static AWS access keys in CI/CD
                          pipelines.  Task  Eliminate all static credentials from the CI/CD pipeline while maintaining developer
                          velocity and meeting compliance.  Action  Designed Vault + GitHub OIDC zero-static-credentials architecture. Every pipeline
                          authenticated via short-lived OIDC tokens. IAM roles followed least-privilege via Terraform
                          policy-as-code. Built the AI CI/CD Guardian GitHub Action with 42 heuristic patterns across 16
                          build systems to detect credential leaks.  Result  Passed pharma compliance audits with zero static-credential findings.
                          Zero-static-credentials pattern became a reusable GitHub Actions template. New service
                          onboarding dropped from 2 weeks→2 hours.

**Q: Describe an architecture you designed.**
◆ Interviewer's goal: business problem understanding + deep-dive
                    readiness 
-  Pick a  real system  — be prepared to answer: How does it scale? How is it
                      secured? What would you do differently? 
-  The interviewer will  probe the edges  of your design with follow-up questions 
 ★ STAR Answer — Enterprise Pharma Mobile CI/CD Platform  Situation  Mobile teams at Enterprise Pharma were releasing iOS apps manually — Xcode builds on
                          developer laptops, two-day release cycles, no audit trail, no GxP compliance.  Task  Design and deliver an end-to-end mobile CI/CD platform meeting pharma compliance,
                          eliminating manual steps, scaling across global teams.  Action  Architected a self-hosted macOS runner fleet on GitHub Actions with Fastlane orchestrating
                          build/test/sign/deploy. Vault + GitHub OIDC for secrets — Apple certificates fetched at
                          runtime. Build artifacts versioned in S3. Branch protection, multi-party approvals, structured
                          logs to Splunk for GxP audit trail. RDS Proxy for the metadata service.  Result  Release cycle: 2 days→15 min. Build time: 45→15 min. Onboarding: 2 weeks→2 hours. Developer
                          NPS: +45. Became the standard mobile delivery platform at Enterprise Pharma.

**Q: Biggest challenge faced during designing your application on the
                  cloud.**
◆ Two strong angles: Scaling or Cost 
-  Scaling:  When standard Auto Scaling can't react fast enough — Warm Pools and
                      pre-warming solve this 
-  Cost:  Unexpected AWS bills — CloudWatch Insights, Compute Optimizer, Spot
                      Instances, Cost Explorer 
 ★ STAR Answer — Vault + OIDC Bootstrap Problem  Situation  Integrating Vault into GitHub Actions where runners were ephemeral presented a
                          chicken-and-egg problem: how authenticate a runner to Vault without a pre-placed credential?
                          Static credentials were off the table due to compliance.  Task  Solve the runner authentication bootstrap without introducing any static secrets —
                          auditable, least-privilege, and reusable across teams.  Action  Designed a three-hop trust chain: GitHub Actions OIDC JWT → AWS STS AssumeRole (no static
                          keys) → Vault AWS auth backend fetches short-lived Vault token. IAM trust policy scoped to
                          specific repos, branches, and environments. Every hop logged — GitHub audit log, CloudTrail,
                          Vault audit log.  Result  Zero static credentials in the pipeline. Three-hop trust chain became a reusable composite
                          action, adopted by 6 teams in 3 months. Cited as a resolved finding in GxP compliance audit.

**Q: How do you pick one service versus another?**
◆ Framework: Requirements-first, then trade-off analysis 
-  Always  ask for requirements  before recommending: traffic volume, latency SLA,
                      security needs, cost constraints, uptime  Decision  Choose A when…  Choose B when…  API GW vs ALB  External API, auth, rate limiting  Internal microservice traffic, WebSockets, gRPC  Serverless vs EC2  Unpredictable burst, short-lived tasks  Long-running, stateful, GPU, dedicated compute  EventBridge vs SQS/SNS  Event routing across services/accounts  Point-to-point queuing, fan-out pub/sub  EKS vs ECS vs Fargate  K8s portability, complex workloads  Simpler container ops; Fargate removes nodes 
 ★ STAR Answer — Transit Gateway vs VPC Peering  Situation  Needed to connect multiple VPCs across AWS accounts — shared services, dev, staging, prod —
                          with centralized security inspection required by pharma compliance.  Task  Recommend the right multi-VPC connectivity model that scales, supports centralized audit,
                          and avoids unmanageable operational overhead.  Action  Evaluated VPC Peering vs Transit Gateway across four axes: operational complexity (N² vs
                          hub-and-spoke), routing (non-transitive vs centralized), cost at scale, and compliance
                          auditability (TGW integrates with Network Firewall for single inspection choke point).  Result  Standardized on Transit Gateway with shared services VPC. Security team got a single Network
                          Firewall inspection point. Cross-account complexity reduced from N² peering to centralized
                          routing table updates.

**Q: What is your favorite AWS service? How will you improve it?**
◆ Answer: IAM OIDC Federation / Roles Anywhere 
-  Why:  It represents a philosophy — workload identity derived from verifiable
                      context rather than a secret you possess. This single capability unlocked the entire
                      zero-static-credentials architecture across Vault, GitHub Actions, and AWS. 
-  Improvement 1:  Richer claim mapping — allow custom OIDC claims to map directly
                      to IAM condition keys, enabling finer-grained policy without Lambda authorizers 
-  Improvement 2:  Claim-level CloudTrail attribution — surface originating OIDC
                      claims in CloudTrail for complete audit chains 
-  Improvement 3:  Cross-provider claim normalization — standardized claim schema
                      for GitHub Actions, GitLab, Buildkite so platform teams can write portable IAM policies

**Q: What is AWS Service X? (Handling unknown services)**
◆ Framework: Definition → Properties → Composition 
-  Example — Lambda:  “AWS Lambda is a serverless compute service that runs
                      code without provisioning servers. It scales automatically, is highly available, and you pay only
                      for compute time consumed.” 
-  Composition:  Integrates with API Gateway (HTTP trigger), SQS (queue consumer),
                      EventBridge (event-driven), S3 (object events), and Vault via OIDC for secrets 
-  When you don't know:  Be transparent. Reason from first principles — What
                      problem space? What pricing model? How does it compose with IAM, CloudWatch, and VPC?

**Q: AWS Services Cheat Sheet — Services to know cold**
◆ Structured definition pattern for each service  Service  One-line Definition  API Gateway  Managed service to create, publish, and secure REST/HTTP/WebSocket APIs at scale  ALB  Layer 7 load balancer routing HTTP/HTTPS traffic by path, host, or headers to targets  Transit Gateway  Hub-and-spoke network transit hub connecting VPCs and on-premises networks at scale  EKS  Managed Kubernetes control plane — run K8s without managing etcd or control plane nodes  Bedrock  Fully managed service to build generative AI applications using foundation models via API  EventBridge  Serverless event bus routing events between AWS services, SaaS, and custom applications  RDS Proxy  Managed database proxy that pools and shares connections to reduce RDS/Aurora load  Secrets Manager  Managed secrets storage with automatic rotation for RDS, Redshift, and custom secrets  Inspector  Automated vulnerability scanning for EC2, Lambda, and container images  GuardDuty  Managed threat detection using ML to analyze CloudTrail, VPC Flow Logs, and DNS logs

**Q: How can you make your application scalable for a big traffic day?**
-  Load Balancers:  Pre-warm the load balancers by submitting a support request to
                      AWS to handle sudden spikes. 
-  Auto Scaling Groups:  Ensure minimum and desired instance counts are greater
                      than one. Use scheduled scaling if the traffic time is known, and implement a Warm Pool of
                      pre-initialized EC2 instances for faster scaling. 
-  Optimization:  Use lightweight AMIs for faster provisioning. Use a database
                      proxy like RDS Proxy to manage connection pooling and reduce latency. 
-  Preparation:  Run AWS Countdown with your account team to simulate traffic and
                      adjust parameters. Check and raise soft account limits, or use multiple regions/accounts for
                      extreme traffic.

**Q: What is an AI agent?**
-  Definition:  An AI agent is a software program that autonomously and
                      independently chooses the best actions to complete a task, distinguishing it from simple
                      conditional workflows or standalone LLMs. 
-  Functionality:  It uses an LLM to determine which tools to invoke, in what
                      order, and how many times to interact with systems (e.g., fetching logs, searching documentation,
                      fixing issues) to achieve a goal. 
-  Implementation:  Examples include deploying agentic code on AWS Lambda or EC2,
                      using Amazon Bedrock for the LLM, and interacting with tools using MCP.

**Q: How do you achieve disaster recovery for your cloud application?**
-  Strategy Selection:  The strategy depends on the Recovery Time Objective (RTO)
                      and Recovery Point Objective (RPO). 
-  AWS DR Strategies: 
-  Backup & Restore (highest RTO/RPO) 
-  Pilot Light 
-  Warm Standby 
-  Multi-site Active-Active (lowest RTO/RPO, ideal for enterprise critical applications despite
                          higher cost)

**Q: How do you secure your application on the cloud?**
-  Defense in Depth:  Implement security at every layer. 
-  Authentication & Encryption:  Use Amazon Cognito for user authentication and
                      ensure data is encrypted in transit using SSL/TLS (e.g., via API Gateway custom certificates in
                      ACM). 
-  Edge Protection:  Use AWS WAF to protect endpoints from common attacks like SQL
                      injection or cross-site scripting. 
-  Application Security:  Use Amazon Inspector to scan Lambda code for
                      vulnerabilities and attach IAM roles to Lambda with least privilege permissions. 
-  Data Protection:  Store secrets in Secrets Manager and use KMS for data at rest
                      encryption in databases.

**Q: Describe a system YOU designed.**
-  Focus:  Choose a project you actually implemented, even if small. Raj highlights
                      a microservices design using Apigee as the API Gateway integrated with AWS Lambda when AWS API
                      Gateway was not approved. 
-  Interviewer Goal:  The interviewer is looking for your understanding of the
                      business problem, how you worked backwards from it, and your ability to answer deep-dive follow-up
                      questions about scalability and security.

**Q: Biggest challenge faced during designing your application on the
                  cloud.**
-  Example 1 – Scaling:  Designing for high-scale, high-burst traffic that standard
                      Auto Scaling could not handle, requiring the implementation of warm pools and pre-warming. 
-  Example 2 – Cost Optimization:  Managing higher-than-expected AWS bills by using
                      CloudWatch Insights, Compute Optimizer, Spot Instances for interruptible workloads, and AWS Cost
                      Explorer.

**Q: How do you pick one service versus another?**
-  Requirements Driven:  You must ask the interviewer for specific system
                      requirements regarding traffic volume, latency, security needs, cost constraints, and uptime. 
-  Comparisons:  Be prepared to contrast API Gateway vs. Load Balancer, Serverless
                      vs. EC2, EventBridge vs. SQS/SNS, and various container services (EKS, ECS, Fargate).

**Q: What is your favorite AWS service? How will you improve it?**
-  Approach:  Pick a service you have used extensively. Improve it by researching
                      the public AWS Roadmap on GitHub and selecting a highly-voted, requested feature to discuss.

**Q: What is AWS service X?**
-  Approach:  Start with the official definition, then explain its key properties. 
-  Example (Lambda):  “AWS Lambda is a serverless compute service that lets
                      you run your code without provisioning or managing any servers… It scales automatically, is highly
                      available, and you pay only for what you use.”

**Q: What is the fundamental difference between High Availability and Disaster
                  Recovery?**
◆ The most mis-answered foundational question  Dimension  High Availability (HA)  Disaster Recovery (DR)  Scope  Within a single Region (cross-AZ)  Across different geographic Regions  Primary Goal  Minimize downtime during AZ failure  Restore service after a Region-wide event  AWS Examples  Multi-AZ EC2, Application Load Balancers  Route 53 Health Checks, S3 Cross-Region Replication 
-  Bad Answer:  "HA means the app stays up; DR is when it falls back to another
                      region." This conflates the two concepts entirely. 
-  Delightful Answer:  HA is scoped to  AZs within one region  . DR
                      is scoped to  different geographic regions  . Confusing them signals you haven't
                      operated at enterprise scale. 
-  The "So What?" Layer:  A total AZ failure is handled by HA — no human
                      intervention needed. A total regional failure requires DR — a deliberate architectural and
                      operational strategy.

**Q: Walk me through a production-grade 3-tier Highly Available
                  architecture.**
◆ Layer-by-layer HA walkthrough — the "delightful" answer format 
-  External ALB:  Routes traffic across multiple AZs. Inherently HA — no single
                      point of failure. 
-  Web / App Tier (EC2 in ASG):  A single EC2 instance resides in one AZ and is a
                      SPOF. Deploy across ≥2 AZs inside an Auto Scaling Group. If one AZ fails, traffic re-routes to
                      instances in surviving AZs automatically. 
-  Internal ALB:  Decouples the web and app tiers; distributes internal traffic
                      across healthy AZs — identical HA properties to the external ALB. 
-  Data Tier (Amazon DynamoDB):  A regional service that automatically replicates
                      data across three AZs. AZ failure is fully transparent to application code. 
-  So What?  This design ensures a complete data-center failure is a  non-event  for end users — business continuity with zero manual intervention.

**Q: Define RTO and RPO. What units are they measured in? Compare all 4 DR
                  strategies.**
◆ The "trap question" — RPO is always measured in TIME, not data
                    volume 
-  RTO (Recovery Time Objective):  Max acceptable time the application can be
                      offline. Measured in  minutes, hours, or days  . 
-  RPO (Recovery Point Objective):  Max acceptable data loss, expressed as a point
                      in  time  . A common mistake: measuring RPO in megabytes. Wrong. It's always time.  Strategy  RTO / RPO  How It Works  Backup & Restore  Hours / Days  Data backed up to S3; restored to new region after disaster. Highest RTO/RPO, lowest cost.  Pilot Light  Minutes / Hours  Core data (DB) is live and replicated; app servers are "off" (AMIs) until disaster triggers
                          provisioning.  Warm Standby  Minutes / Minutes  Scaled-down full environment always running in DR region. Scale up on activation.  Multi-site Active-Active  Real-time / Real-time  Full traffic in two+ regions simultaneously. Instant synchronous/asynchronous replication.
                          Highest cost, zero RTO/RPO.

**Q: Contrast Monolithic vs. Microservices. Illustrate a real Microservices
                  flow and explain Event-Driven Architecture.**
◆ Show fault isolation and EDA asynchrony — not just definitions 
-  Monolith:  Single tightly coupled unit. One component fails → redeploy
                      everything. No independent scaling. 
-  Microservices:  Independent services, independently deployed, independently
                      scaled, polyglot by design. 
-  Real Flow — store.com (ALB Path-Based Routing): 
-  store.com/browse  → EC2 + DynamoDB (Python) 
-  store.com/purchase  → EKS + Aurora (Go) — isolated for high integrity 
-  store.com/return  → Lambda (serverless, spiky traffic) 
-  If /browse crashes, /purchase and revenue remain unaffected. That's fault isolation. 
-  EDA — Bad Answer:  "API Gateway → Lambda → DynamoDB." That is  synchronous  , not event-driven. 
-  EDA — Delightful:  API Gateway →  SQS  → Lambda → DynamoDB. SQS
                      decouples producer from consumer. Lambda consumes at its own rate. Benefits: independent scaling,
                      built-in retry, no wasted idle capacity.  Trait  Synchronous  EDA (Asynchronous)  Scaling  All layers must match  Components scale independently  Retries  Hard-coded in client  Built-in queue retry  Cost  Over-provision for spikes  Pay only for events processed

**Q: Compare SQL vs. NoSQL databases from a Solutions Architect
                  perspective.**
◆ Distinguish by schema approach and consistency model — not just
                    "relational vs. not"  Property  SQL (Relational)  NoSQL (Non-relational)  Schema  Schema-on-write — rigid, predefined  Schema-on-read — flexible, evolving  Consistency  ACID transactions  Eventual consistency (configurable)  Scaling  Vertical primary  Horizontal by design  Best For  Complex joins, financial transactions  High-throughput, low-latency, variable structure  AWS Examples  Amazon Aurora, RDS  Amazon DynamoDB 
-  Architect's Rule:  Never say "NoSQL is better." Choose based on access patterns.
                      If you need ACID joins, SQL wins. If you need single-digit millisecond reads at millions of RPS,
                      DynamoDB wins.

**Q: What are the strategic GenAI use cases? Explain MCP and differentiate
                  A2A, MCP, and RAG.**
◆ Categorize GenAI use cases — "chatbots" alone is a junior
                    answer 
-  Customer Experience:  Agentic assistants that take action on behalf of users
                      (not just answer questions). 
-  Productivity:  Content creation, automated report generation, search
                      summarization — measurable ROI. 
-  Cutting Edge (MCP):  Automated cost analysis, code-quality evaluation against
                      architectural best practices — agents acting autonomously on cloud infrastructure. 
-  Model Context Protocol (MCP):  A standardized JSON-RPC protocol enabling LLMs to
                      interact with tools and data sources without custom-coding every integration. 
-  Pre-MCP:  Manually define every API URL, header, and payload per tool. 
-  MCP:  MCP Server exposes tool schemas. MCP Client (e.g., VS Code) discovers
                          tools dynamically. LLM chooses which tool to invoke based on purpose — no brittle hard-coded
                          logic. 
-  Key Innovation:  Dynamic Discovery — the protocol feeds tool purpose and
                          schema to the LLM at runtime.  Protocol  What It Does  A2A  Agent-to-Agent communication (orchestration between agents)  MCP  Standardized protocol connecting agents/LLMs to tools and data  RAG  Retrieval-Augmented Generation — grounding LLM responses in external data without retraining

**Q: Continuous Delivery vs. Deployment. Describe a senior-level DevOps
                  pipeline. Contrast Traditional CI/CD vs. GitOps.**
◆ Know the human-button distinction and the push vs. pull model 
-  Continuous Delivery:  Code is always in a deployable state; a  manual
                        trigger  pushes to production. 
-  Continuous Deployment:  Every passing build auto-deploys to production. Zero
                      human intervention. 
-  Senior-Level Pipeline (Source → Build → Test → Deploy): 
-  IaC:  Non-negotiable — Terraform ensures environment consistency across
                          accounts. 
-  Automated Unit Testing:  AWS CodeBuild catches logic errors before staging. 
-  DevSecOps:  Shift security left — secret scanning and vulnerability
                          assessment are pipeline gates, not post-deployment audits. 
-  Multi-Account Strategy:  Dev → Test → Prod isolation minimizes blast radius
                          of any failure.  Model  Traditional CI/CD  GitOps  Direction  Push — tool pushes config to environment  Pull — controller in cluster pulls from Git  Truth Source  CI/CD tool state  Git repository (declarative)  Controller  Jenkins, GitHub Actions, Harness  ArgoCD, Flux  Drift Detection  Manual or scheduled  Continuous, automatic reconciliation

**Q: Why EKS? Explain HPA vs. Cluster Autoscaler vs. Karpenter. Define
                  DaemonSets and Sidecars.**
◆ Three layers of scaling, and when each kicks in 
-  Why EKS:  AWS manages the control plane (API server, etcd) across multiple AZs.
                      Managing this yourself is the hardest part of Kubernetes operations — EKS eliminates it.  Scaler  What It Scales  Trigger  Notes  HPA  Pods  CPU / Memory / custom metrics  Horizontal Pod Autoscaler — doesn't add nodes  Cluster Autoscaler  Nodes (via ASG)  Pending pods with no room  Works with EC2 Auto Scaling Groups  Karpenter  Nodes (directly)  Pending pods with no room  Bypasses ASGs; provisions right-sized, right-typed node instantly. Faster + cheaper. 
-  DaemonSet:  Ensures one pod per node. Use for cluster-wide agents — log
                      collectors (Fluent Bit), monitoring agents (Prometheus node-exporter). 
-  Sidecar:  Runs alongside the app container in the same pod. Use for pod-specific
                      concerns — service mesh proxy (Envoy), localized log offloading. 
-  Monitoring Stack to name:  Prometheus + Grafana for metrics; Fluent Bit /
                      CloudWatch Container Insights / ELK for logs. Not naming your stack is a red flag.

**Q: Lambda cold starts, scaling, and security. Differentiate SQS vs. SNS vs.
                  EventBridge.**
◆ CPU is indirect, cold starts are solvable, messaging services
                    are distinct tools 
-  Cold Start:  Latency when AWS provisions a new execution environment. Mitigate
                      with  Provisioned Concurrency  (keeps environments warm) or Custom Container
                      Images. 
-  Scaling CPU:  You cannot set Lambda CPU directly. Increase  memory
                        allocation  — AWS scales CPU proportionally. More memory = faster execution = lower cost
                      in pay-per-ms model. 
-  Lambda vs. Fargate:  Lambda scales instantly for burst; Fargate scales slower
                      (node provisioning) but handles tasks exceeding Lambda's 15-minute limit. 
-  Security best practices:  Least-privilege IAM role per function; KMS for
                      environment variable encryption; VPC integration for private resource access.  Service  Pattern  Use Case  SQS  Queue — point-to-point  One producer, one consumer. Decoupling, backpressure, retry.  SNS  Pub/sub topic — fan-out  One producer, many consumers. Broadcast notifications.  EventBridge  Event bus — content-based routing  Filter and route events from AWS services, SaaS, and custom apps with rules.

**Q: Interview strategy: The "Question Behind the Question" and critical
                  mistakes to avoid.**
◆ The "So What?" layer separates architects from engineers 
-  Trait 1 — The Question Behind the Question:  When asked "What is RPO?", the real
                      test is whether you know it's measured in  time  , not data volume. Pivot to the underlying
                      principle, not the dictionary definition. 
-  Trait 2 — System Design Pivot:  When asked "What is SQS?", don't just say "It's
                      a queue." Explain how you used SQS to decouple an ordering system and absorb a 10x Black Friday
                      traffic spike without dropping a single order. That's the delight factor. 
-  Trait 3 — Big Picture Thinking:  Show how services interact to solve a business
                      problem. Walk through flows, not definitions. 
-  ❌ Rambling:  Five minutes on a VPC question signals inability to communicate
                      with executives. Use the  3-2-1 trick  : 3 points, 2 minutes, 1 clear summary. 
-  ❌ Generic answers:  "I would use the best practices" is not an answer. Name the
                      service, the trade-off, and the operational consequence. 
-  ❌ Jumping to solutions:  Always ask for requirements first — RTO, RPO, budget,
                      scale, compliance constraints. Skipping this is a junior mistake. 
-  ❌ Calling a service "the best":  A Principal Architect selects services based on
                      specific system requirements — cost, latency, scale — never on preference.

