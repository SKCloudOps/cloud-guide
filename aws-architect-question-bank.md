# Senior AWS Solutions Architect — Interview Question Bank

**Questions only. No answers.** Organized by topic.

Covers the networking, security, IAM, multi-account, and architecture questions
commonly asked at Amazon, Microsoft, Capital One, JPMorgan, Deloitte, Cognizant,
and Takeda.

**Total: 750 questions across 30 topics.**

| # | Topic | Count |
|---|-------|-------|
| 1 | VPC Fundamentals | 25 |
| 2 | VPC Peering | 30 |
| 3 | Transit Gateway | 30 |
| 4 | AWS PrivateLink | 25 |
| 5 | Cross-Account IAM | 30 |
| 6 | Route Tables | 25 |
| 7 | Security Groups & NACLs | 25 |
| 8 | Route 53 & DNS | 25 |
| 9 | Hybrid Networking | 20 |
| 10 | NAT Gateway & Internet Connectivity | 20 |
| 11 | Load Balancers | 25 |
| 12 | API Gateway | 20 |
| 13 | Lambda Networking | 20 |
| 14 | EKS Networking | 40 |
| 15 | ECS & Fargate | 25 |
| 16 | RDS & Aurora | 25 |
| 17 | S3 & Storage | 25 |
| 18 | CloudFront & Edge | 20 |
| 19 | Organizations, Control Tower & Landing Zone | 25 |
| 20 | Security Services | 30 |
| 21 | Observability | 25 |
| 22 | Disaster Recovery & Resiliency | 25 |
| 23 | Terraform & IaC | 30 |
| 24 | CI/CD & DevOps on AWS | 25 |
| 25 | Messaging & Event-Driven | 25 |
| 26 | Cost Optimization & FinOps | 20 |
| 27 | AI/ML & GenAI Architecture | 25 |
| 28 | Migration & Modernization | 20 |
| 29 | Real-World Design Scenarios | 30 |
| 30 | Architect Behavioral & Leadership | 15 |

---

# 1. VPC Fundamentals (25 Questions)

1. What is a VPC?
2. How does a VPC work internally?
3. Explain the AWS VPC router.
4. What is the difference between public and private subnets?
5. How does subnet routing work?
6. How does AWS determine the route for a packet?
7. What is the local route?
8. What is CIDR and why is it important?
9. How do you design CIDR blocks for enterprise environments?
10. What happens if CIDRs overlap?
11. Explain Elastic Network Interfaces (ENIs).
12. How does DHCP work inside a VPC?
13. What is the VPC DNS Resolver?
14. Explain VPC DNS Hostnames.
15. Explain VPC DNS Resolution.
16. What is the default route table?
17. What is the main route table?
18. How many route tables can a VPC have?
19. What are secondary CIDR blocks?
20. How does AWS allocate private IP addresses?
21. Explain IPv6 in a VPC.
22. What are VPC quotas?
23. How do you troubleshoot VPC connectivity?
24. Explain packet flow inside a VPC.
25. Design a production-ready VPC.

---

# 2. VPC Peering (30 Questions)

1. What is VPC Peering?
2. How does VPC Peering work?
3. Explain the packet flow.
4. How do route tables work with peering?
5. Why are security groups required?
6. Why are NACLs still evaluated?
7. Why can't overlapping CIDRs peer?
8. Can VPC Peering span AWS accounts?
9. Can it span Regions?
10. What is cross-region peering?
11. What is transitive routing?
12. Why doesn't peering support transitive routing?
13. Can one VPC peer with multiple VPCs?
14. How many peerings are supported?
15. How do you troubleshoot peering?
16. Explain DNS over peering.
17. Can Route 53 resolve private names over peering?
18. How do security groups work across peering?
19. How do you monitor peering traffic?
20. Can Lambda use peering?
21. Can ECS use peering?
22. Can EKS use peering?
23. Can RDS communicate over peering?
24. What happens if routes are missing?
25. What if SGs are incorrect?
26. Explain longest prefix matching.
27. Why doesn't Internet traffic cross peering?
28. Compare peering with Transit Gateway.
29. Compare peering with PrivateLink.
30. Design a production architecture using peering.

---

# 3. Transit Gateway (30 Questions)

1. What is Transit Gateway?
2. Why was Transit Gateway introduced?
3. Explain Transit Gateway routing.
4. Explain attachments.
5. Explain TGW route tables.
6. Explain TGW propagation.
7. Explain TGW association.
8. Explain appliance mode.
9. Explain multicast support.
10. Explain packet flow.
11. Can TGW connect multiple accounts?
12. Can TGW connect on-prem?
13. Explain Direct Connect Gateway.
14. Explain VPN attachments.
15. Explain VPC attachments.
16. Can TGW connect Regions?
17. Explain TGW peering.
18. Compare TGW vs Peering.
19. Compare TGW vs Cloud WAN.
20. Troubleshoot TGW connectivity.
21. Explain blackhole routes.
22. Explain ECMP.
23. Explain TGW quotas.
24. Explain TGW security.
25. Explain inspection VPC.
26. Explain centralized networking.
27. Explain shared services VPC.
28. Explain RAM sharing.
29. Design enterprise networking using TGW.
30. Explain packet flow from EC2 to EC2 via TGW.

---

# 4. AWS PrivateLink (25 Questions)

1. What is AWS PrivateLink?
2. Why use PrivateLink?
3. Explain Endpoint Services.
4. Explain Interface Endpoints.
5. Explain Gateway Endpoints.
6. Explain packet flow.
7. Can PrivateLink work across accounts?
8. Can PrivateLink work across Regions?
9. Compare PrivateLink vs Peering.
10. Compare PrivateLink vs TGW.
11. Explain NLB requirement.
12. Can ALB be used?
13. Explain DNS behavior.
14. Explain Endpoint Policies.
15. Explain Private DNS.
16. Explain security.
17. Explain costs.
18. Troubleshoot PrivateLink.
19. Explain SaaS architecture.
20. Explain consumer/provider model.
21. Can Lambda use PrivateLink?
22. Can EKS use PrivateLink?
23. Explain API exposure using PrivateLink.
24. Design secure service sharing.
25. Explain packet flow.

---

# 5. Cross-Account IAM (30 Questions)

1. What is cross-account access?
2. What is AssumeRole?
3. Explain STS.
4. Explain Trust Policies.
5. Explain Permission Policies.
6. Explain IAM Roles.
7. Explain IAM Users.
8. Explain temporary credentials.
9. Explain External ID.
10. Explain confused deputy.
11. Explain session duration.
12. Explain role chaining.
13. Explain permission boundaries.
14. Explain SCP.
15. Explain cross-account S3.
16. Explain cross-account KMS.
17. Explain cross-account Secrets Manager.
18. Explain cross-account DynamoDB.
19. Explain cross-account Lambda.
20. Explain cross-account ECS.
21. Explain cross-account EKS.
22. Troubleshoot AssumeRole.
23. Explain CloudTrail auditing.
24. Explain least privilege.
25. Explain IAM Identity Center.
26. Explain federation.
27. Explain IAM Access Analyzer.
28. Explain credential rotation.
29. Compare AssumeRole vs bucket policy.
30. Design secure cross-account architecture.

---

# 6. Route Tables (25 Questions)

1. Explain route tables.
2. Explain longest prefix match.
3. Explain default route.
4. Explain local route.
5. Explain propagated routes.
6. Explain static routes.
7. Explain blackhole routes.
8. Explain TGW routes.
9. Explain VPN routes.
10. Explain Direct Connect routes.
11. Explain NAT routes.
12. Explain IGW routes.
13. Explain egress-only gateway.
14. Explain asymmetric routing.
15. Troubleshoot routing.
16. Explain packet flow.
17. Explain subnet association.
18. Explain multiple route tables.
19. Explain route priority.
20. Explain propagation.
21. Explain inspection routing.
22. Explain centralized routing.
23. Explain service insertion.
24. Explain route limits.
25. Design enterprise routing.

---

# 7. Security Groups & NACLs (25 Questions)

1. Difference between SG and NACL.
2. Stateful vs Stateless.
3. Packet flow.
4. Rule evaluation.
5. Default behavior.
6. Ephemeral ports.
7. Inbound vs outbound.
8. SG referencing.
9. Cross-account SG.
10. Cross-VPC SG.
11. NACL troubleshooting.
12. SG troubleshooting.
13. Least privilege.
14. Default SG.
15. Bastion access.
16. ALB security.
17. RDS security.
18. EKS security.
19. ECS security.
20. Lambda ENIs.
21. VPC endpoints.
22. Firewall integration.
23. Inspection VPC.
24. Zero Trust networking.
25. Enterprise security design.

---

# 8. Route 53 & DNS (25 Questions)

1. How does DNS work?
2. Public vs Private Hosted Zones.
3. Route 53 Resolver.
4. Resolver Endpoints.
5. Conditional Forwarding.
6. DNS over Peering.
7. DNS over TGW.
8. Split-horizon DNS.
9. Alias Records.
10. Health Checks.
11. Failover Routing.
12. Weighted Routing.
13. Geolocation Routing.
14. Latency Routing.
15. Multi-value Routing.
16. DNSSEC.
17. Resolver Rules.
18. Hybrid DNS.
19. On-prem DNS.
20. PrivateLink DNS.
21. Troubleshooting DNS.
22. DNS packet flow.
23. DNS caching.
24. Enterprise DNS.
25. Design global DNS.

---

# 9. Hybrid Networking (20 Questions)

1. Site-to-Site VPN.
2. Direct Connect.
3. DX Gateway.
4. Transit VIF.
5. Private VIF.
6. Public VIF.
7. BGP.
8. Route propagation.
9. Failover.
10. Redundancy.
11. Active/Active.
12. Active/Passive.
13. VPN over DX.
14. TGW integration.
15. Packet flow.
16. MTU.
17. Asymmetric routing.
18. Troubleshooting.
19. Security.
20. Enterprise hybrid design.

---

# 10. NAT Gateway & Internet Connectivity (20 Questions)

1. NAT Gateway.
2. NAT Instance.
3. Internet Gateway.
4. Egress-only Gateway.
5. Public subnet.
6. Private subnet.
7. Outbound packet flow.
8. Inbound packet flow.
9. Source NAT.
10. Destination NAT.
11. NAT scaling.
12. NAT HA.
13. NAT costs.
14. Troubleshooting.
15. Lambda internet access.
16. ECS internet access.
17. EKS internet access.
18. Private API access.
19. Enterprise outbound architecture.
20. Cost optimization.

---

# 11. Load Balancers (25 Questions)

1. ALB vs NLB vs GWLB.
2. Listener rules.
3. Target groups.
4. Health checks.
5. Cross-zone load balancing.
6. Sticky sessions.
7. TLS termination.
8. End-to-end encryption.
9. Private ALB.
10. Internet-facing ALB.
11. NLB IP mode.
12. Lambda targets.
13. ECS integration.
14. EKS integration.
15. PrivateLink with NLB.
16. WAF integration.
17. CloudFront integration.
18. Packet flow.
19. Troubleshooting 502.
20. Troubleshooting 504.
21. SSL issues.
22. Scaling.
23. Logging.
24. Enterprise architecture.
25. Multi-region load balancing.

---

# 12. API Gateway (20 Questions)

1. REST vs HTTP API.
2. Private API.
3. VPC Link.
4. Lambda Proxy.
5. Custom Authorizer.
6. Cognito Authorizer.
7. IAM Authorization.
8. Resource Policy.
9. Usage Plans.
10. API Keys.
11. Caching.
12. Throttling.
13. WAF.
14. Logging.
15. Monitoring.
16. Multi-account API.
17. Cross-account API.
18. Private integrations.
19. Packet flow.
20. Enterprise API architecture.

---

# 13. Lambda Networking (20 Questions)

1. Lambda inside VPC.
2. ENIs.
3. NAT Gateway requirement.
4. VPC endpoints.
5. Internet access.
6. Cross-account access.
7. Cross-VPC access.
8. RDS connectivity.
9. Secrets Manager.
10. DNS.
11. Cold starts.
12. Security.
13. IAM.
14. Packet flow.
15. Troubleshooting.
16. Scaling.
17. Concurrency.
18. Cost.
19. Best practices.
20. Enterprise design.

---

# 14. EKS Networking (40 Questions)

1. AWS VPC CNI.
2. IP allocation.
3. Pod networking.
4. Service networking.
5. CoreDNS.
6. kube-proxy.
7. Ingress.
8. AWS Load Balancer Controller.
9. IRSA.
10. Pod Identity.
11. Network Policies.
12. Calico.
13. Security Groups for Pods.
14. Private clusters.
15. Public clusters.
16. Cluster Endpoint.
17. Endpoint access.
18. Cross-account EKS.
19. Cross-VPC EKS.
20. Multi-cluster.
21. Multi-region.
22. Node Groups.
23. Fargate.
24. EFS.
25. EBS.
26. Service Mesh.
27. Istio.
28. App Mesh.
29. ExternalDNS.
30. Cluster Autoscaler.
31. Karpenter.
32. Packet flow.
33. Troubleshooting.
34. Pod-to-Pod communication.
35. Pod-to-RDS.
36. Pod-to-S3.
37. Pod-to-Lambda.
38. Enterprise architecture.
39. Security.
40. High availability.

---

# 15. ECS & Fargate (25 Questions)

1. ECS vs EKS — when do you choose which?
2. EC2 launch type vs Fargate launch type.
3. Explain task definitions.
4. Explain the ECS agent.
5. Explain ECS services vs standalone tasks.
6. Explain awsvpc network mode.
7. Compare bridge, host, and awsvpc modes.
8. How does Fargate allocate ENIs?
9. Explain task role vs task execution role.
10. Explain ECS service discovery (Cloud Map).
11. Explain ECS Service Connect.
12. Explain ALB integration with dynamic port mapping.
13. Explain ECS capacity providers.
14. Explain ECS cluster auto scaling.
15. Explain service auto scaling and target tracking.
16. Explain rolling, blue/green, and canary deployments on ECS.
17. Explain circuit breaker and deployment rollback.
18. How do you pull images from a private ECR across accounts?
19. Explain ECS logging with awslogs and FireLens.
20. How does Fargate reach the internet without a public IP?
21. Explain secrets injection from Secrets Manager and SSM.
22. Explain ECS Exec and its security implications.
23. Troubleshoot a task stuck in PENDING.
24. Explain ECS cost optimization (Spot, Graviton, right-sizing).
25. Design an enterprise multi-account ECS platform.

---

# 16. RDS & Aurora (25 Questions)

1. Explain RDS Multi-AZ vs Read Replicas.
2. Explain Multi-AZ DB cluster (three-node) vs Multi-AZ instance.
3. Explain Aurora storage architecture.
4. Explain the Aurora writer and reader endpoints.
5. Explain Aurora custom endpoints.
6. Explain Aurora failover behavior and timing.
7. Explain Aurora Global Database.
8. Explain Aurora Serverless v2 scaling.
9. Explain RDS Proxy and when it is required.
10. Explain connection pooling and connection storms.
11. Explain backups, snapshots, and PITR.
12. Explain cross-region and cross-account snapshot sharing.
13. Explain encryption at rest and KMS key rotation.
14. Explain encryption in transit and certificate rotation.
15. Explain IAM database authentication.
16. Explain parameter groups and option groups.
17. Explain the maintenance window and how you manage patching at scale.
18. Explain blue/green deployments for RDS.
19. Explain Performance Insights and Enhanced Monitoring.
20. Troubleshoot high replica lag.
21. Troubleshoot connection exhaustion from Lambda.
22. Explain RDS in private subnets and access patterns.
23. Compare Aurora vs RDS vs DynamoDB for a given workload.
24. Explain database migration with DMS and SCT.
25. Design a highly available, multi-region database tier.

---

# 17. S3 & Storage (25 Questions)

1. Explain the S3 consistency model.
2. Explain S3 storage classes and their trade-offs.
3. Explain Intelligent-Tiering.
4. Explain lifecycle policies.
5. Explain versioning and MFA delete.
6. Explain S3 Object Lock and compliance mode.
7. Explain bucket policies vs IAM policies vs ACLs.
8. Explain Block Public Access.
9. Explain S3 Access Points and Multi-Region Access Points.
10. Explain SSE-S3, SSE-KMS, SSE-C, and DSSE-KMS.
11. Explain S3 Bucket Keys and why they matter for cost.
12. Explain cross-account bucket access patterns.
13. Explain Cross-Region Replication and Same-Region Replication.
14. Explain replication of encrypted objects.
15. Explain presigned URLs and their risks.
16. Explain S3 Gateway Endpoints vs Interface Endpoints.
17. Explain S3 event notifications and EventBridge integration.
18. Explain S3 request rate performance and prefix design.
19. Explain multipart upload and Transfer Acceleration.
20. Explain S3 Batch Operations.
21. Explain S3 Inventory and Storage Lens.
22. Compare EBS, EFS, FSx, and S3 for a workload.
23. Explain EBS volume types and gp3 tuning.
24. Explain EFS performance and throughput modes.
25. Design a secure, compliant data lake storage layer.

---

# 18. CloudFront & Edge (20 Questions)

1. Explain how CloudFront works.
2. Explain origins and origin groups.
3. Explain cache behaviors and precedence.
4. Explain cache keys and cache policies.
5. Explain origin request policies.
6. Explain response headers policies.
7. Explain TTLs and invalidations.
8. Explain Origin Access Control (OAC) vs the legacy OAI.
9. Explain signed URLs and signed cookies.
10. Explain field-level encryption.
11. Explain CloudFront with WAF and Shield.
12. Explain Lambda@Edge vs CloudFront Functions.
13. Explain origin shield.
14. Explain custom error responses.
15. Explain CloudFront logging and real-time logs.
16. Explain CloudFront with a private ALB origin.
17. Explain Global Accelerator vs CloudFront.
18. Troubleshoot a 403 from CloudFront.
19. Explain multi-origin and multi-region failover at the edge.
20. Design a global content delivery architecture.

---

# 19. Organizations, Control Tower & Landing Zone (25 Questions)

1. Explain AWS Organizations.
2. Explain OUs and OU design strategy.
3. Explain Service Control Policies.
4. Explain SCP evaluation logic with IAM policies.
5. Explain Resource Control Policies.
6. Explain declarative policies.
7. Explain the management account and why you don't run workloads in it.
8. Explain delegated administrator accounts.
9. Explain consolidated billing.
10. Explain AWS Control Tower.
11. Explain landing zone design.
12. Explain guardrails — preventive, detective, proactive.
13. Explain Account Factory and AFT.
14. Explain the log archive and audit accounts.
15. Explain centralized CloudTrail with an organization trail.
16. Explain AWS Config aggregators and conformance packs.
17. Explain AWS RAM and resource sharing.
18. Explain IAM Identity Center permission sets.
19. Explain account vending and automation.
20. Explain tagging strategy and tag policies.
21. Explain backup policies at the organization level.
22. Explain how you enforce region restriction.
23. Explain account closure and decommissioning.
24. Compare Control Tower vs a custom landing zone.
25. Design a multi-account enterprise landing zone.

---

# 20. Security Services (30 Questions)

1. Explain KMS keys — AWS managed, customer managed, and AWS owned.
2. Explain key policies vs IAM policies vs grants.
3. Explain envelope encryption.
4. Explain multi-Region KMS keys.
5. Explain key rotation — automatic vs manual.
6. Explain CloudHSM and when it is required.
7. Explain Secrets Manager vs Parameter Store.
8. Explain secret rotation with Lambda.
9. Explain ACM and certificate renewal.
10. Explain ACM Private CA.
11. Explain GuardDuty and its finding types.
12. Explain GuardDuty Malware Protection and Runtime Monitoring.
13. Explain Amazon Inspector.
14. Explain Amazon Macie.
15. Explain Security Hub and standards.
16. Explain Detective.
17. Explain AWS WAF rule groups and managed rules.
18. Explain WAF rate-based rules and bot control.
19. Explain Shield Standard vs Shield Advanced.
20. Explain AWS Network Firewall.
21. Explain Route 53 Resolver DNS Firewall.
22. Explain VPC Flow Logs and how you analyze them.
23. Explain CloudTrail data events vs management events.
24. Explain CloudTrail Lake.
25. Explain AWS Config rules and remediation.
26. Explain Systems Manager Patch Manager at scale.
27. Explain incident response on AWS.
28. Explain compliance frameworks (PCI-DSS, HIPAA, SOC 2) on AWS.
29. Explain data classification and DLP on AWS.
30. Design a defense-in-depth security architecture.

---

# 21. Observability (25 Questions)

1. Explain the three pillars of observability.
2. Explain CloudWatch metrics, namespaces, and dimensions.
3. Explain custom metrics and the Embedded Metric Format.
4. Explain high-resolution metrics.
5. Explain CloudWatch Logs, log groups, and streams.
6. Explain Logs Insights queries.
7. Explain metric filters and anomaly detection.
8. Explain CloudWatch Alarms and composite alarms.
9. Explain cross-account, cross-region observability.
10. Explain the CloudWatch agent vs the OpenTelemetry collector.
11. Explain AWS Distro for OpenTelemetry.
12. Explain X-Ray tracing and sampling rules.
13. Explain distributed tracing across services.
14. Explain Container Insights.
15. Explain Lambda Insights.
16. Explain Application Signals and SLOs.
17. Explain synthetic monitoring with CloudWatch Synthetics.
18. Explain RUM.
19. Explain centralized logging architecture.
20. Explain log retention and archival strategy.
21. Explain Amazon OpenSearch Service for log analytics.
22. Explain Amazon Managed Grafana and Managed Prometheus.
23. Explain alerting strategy and alert fatigue.
24. Explain SLIs, SLOs, and error budgets.
25. Design enterprise observability across 200 accounts.

---

# 22. Disaster Recovery & Resiliency (25 Questions)

1. Define RTO and RPO.
2. Explain the four DR strategies.
3. Explain backup and restore.
4. Explain pilot light.
5. Explain warm standby.
6. Explain multi-site active/active.
7. Explain how you choose a DR strategy for a workload.
8. Explain AWS Backup and backup vaults.
9. Explain vault lock and immutable backups.
10. Explain cross-region backup copy.
11. Explain AWS Elastic Disaster Recovery.
12. Explain Route 53 ARC (Application Recovery Controller).
13. Explain routing controls and readiness checks.
14. Explain cell-based architecture.
15. Explain the bulkhead pattern.
16. Explain static stability.
17. Explain graceful degradation.
18. Explain circuit breakers and retries with backoff and jitter.
19. Explain idempotency in distributed systems.
20. Explain data replication trade-offs across regions.
21. Explain split-brain and how you avoid it.
22. Explain chaos engineering and AWS FIS.
23. Explain DR testing and game days.
24. Explain the Resilience Hub.
25. Design a multi-region DR architecture with a 15-minute RTO.

---

# 23. Terraform & IaC (30 Questions)

1. Explain Infrastructure as Code and its benefits.
2. Compare Terraform, CloudFormation, and CDK.
3. Explain Terraform state.
4. Explain remote state with S3 and DynamoDB locking.
5. Explain S3 native state locking.
6. Explain state isolation strategies.
7. Explain workspaces and their limits.
8. Explain modules and module composition.
9. Explain module versioning and registries.
10. Explain providers and provider aliasing.
11. Explain multi-account, multi-region provider setup.
12. Explain `count` vs `for_each`.
13. Explain `depends_on` and implicit dependencies.
14. Explain lifecycle meta-arguments.
15. Explain `terraform import` and import blocks.
16. Explain `moved` blocks and refactoring safely.
17. Explain data sources.
18. Explain locals, variables, and outputs.
19. Explain sensitive values and secret handling.
20. Explain drift detection and remediation.
21. Explain plan/apply in CI/CD pipelines.
22. Explain policy as code with Sentinel or OPA.
23. Explain `tflint`, `tfsec`, `checkov`, and `terraform-docs`.
24. Explain Terragrunt and when it helps.
25. Explain blast radius reduction in Terraform layouts.
26. Explain how you handle a corrupted or lost state file.
27. Explain how you manage 200 accounts with Terraform.
28. Explain CloudFormation StackSets.
29. Explain CDK constructs and when you'd choose CDK.
30. Design an enterprise IaC platform and workflow.

---

# 24. CI/CD & DevOps on AWS (25 Questions)

1. Explain a modern CI/CD pipeline for a containerized app.
2. Explain CodePipeline, CodeBuild, and CodeDeploy.
3. Compare CodePipeline with GitHub Actions and GitLab CI.
4. Explain OIDC federation from GitHub Actions to AWS.
5. Explain why OIDC is preferred over long-lived access keys.
6. Explain cross-account deployment pipelines.
7. Explain artifact management with ECR and CodeArtifact.
8. Explain image signing and provenance.
9. Explain container image scanning in the pipeline.
10. Explain SAST, DAST, and SCA placement in a pipeline.
11. Explain secrets management in pipelines.
12. Explain blue/green deployment with CodeDeploy.
13. Explain canary deployments and automatic rollback.
14. Explain feature flags.
15. Explain database migrations in a CD pipeline.
16. Explain environment promotion strategy.
17. Explain GitOps and ArgoCD or Flux on EKS.
18. Explain trunk-based development vs GitFlow.
19. Explain pipeline approval gates and separation of duties.
20. Explain immutable infrastructure and golden AMIs with Image Builder.
21. Explain deployment strategies for Lambda with aliases and weights.
22. Explain DORA metrics.
23. Troubleshoot a failing deployment with no rollback.
24. Explain supply chain security (SLSA, SBOM).
25. Design an enterprise CI/CD platform for 50 teams.

---

# 25. Messaging & Event-Driven Architecture (25 Questions)

1. Compare SQS, SNS, EventBridge, and Kinesis.
2. Explain SQS standard vs FIFO.
3. Explain visibility timeout.
4. Explain dead-letter queues and redrive.
5. Explain long polling vs short polling.
6. Explain SQS message deduplication and group IDs.
7. Explain SNS fanout patterns.
8. Explain SNS FIFO topics.
9. Explain SNS message filtering.
10. Explain EventBridge buses, rules, and targets.
11. Explain EventBridge schema registry.
12. Explain EventBridge Pipes.
13. Explain EventBridge Scheduler.
14. Explain cross-account event buses.
15. Explain Kinesis Data Streams shards and partition keys.
16. Explain enhanced fan-out.
17. Explain Kinesis vs MSK.
18. Explain MSK Serverless and MSK Connect.
19. Explain exactly-once vs at-least-once delivery.
20. Explain idempotent consumers.
21. Explain ordering guarantees across these services.
22. Explain backpressure and poison-pill handling.
23. Explain Step Functions standard vs express workflows.
24. Explain saga patterns and compensating transactions.
25. Design an enterprise event-driven architecture.

---

# 26. Cost Optimization & FinOps (20 Questions)

1. Explain the AWS pricing models.
2. Explain Savings Plans vs Reserved Instances.
3. Explain Compute Savings Plans vs EC2 Instance Savings Plans.
4. Explain Spot Instances and interruption handling.
5. Explain Graviton migration and its economics.
6. Explain right-sizing methodology.
7. Explain Compute Optimizer.
8. Explain Cost Explorer and CUR.
9. Explain cost allocation tags.
10. Explain showback and chargeback.
11. Explain AWS Budgets and anomaly detection.
12. Explain data transfer costs and how to reduce them.
13. Explain NAT Gateway cost optimization.
14. Explain S3 cost optimization levers.
15. Explain storage tiering strategy.
16. Explain the cost impact of over-provisioned Lambda memory.
17. Explain the cost of cross-AZ traffic.
18. Explain how you find and kill idle resources.
19. Explain FinOps operating model and team structure.
20. Design a cost governance program for a large enterprise.

---

# 27. AI/ML & GenAI Architecture (25 Questions)

1. Explain Amazon Bedrock.
2. Explain Bedrock model choice and evaluation.
3. Explain Bedrock Knowledge Bases.
4. Explain Bedrock Agents.
5. Explain Bedrock Guardrails.
6. Explain provisioned throughput vs on-demand for Bedrock.
7. Explain Bedrock with PrivateLink and VPC endpoints.
8. Explain RAG architecture end to end.
9. Explain chunking strategy and its impact on retrieval.
10. Explain embedding models and dimensionality.
11. Compare vector stores — OpenSearch, Aurora pgvector, Kendra.
12. Explain hybrid search.
13. Explain reranking.
14. Explain evaluation of a RAG system.
15. Explain prompt injection and how you defend against it.
16. Explain data privacy and residency for GenAI workloads.
17. Explain SageMaker training vs inference architecture.
18. Explain SageMaker endpoints — real-time, serverless, async, batch.
19. Explain multi-model endpoints.
20. Explain the MLOps lifecycle on AWS.
21. Explain feature stores.
22. Explain model monitoring and drift detection.
23. Explain GPU capacity planning and cost control.
24. Explain agentic architectures and tool use.
25. Design an enterprise GenAI platform with governance.

---

# 28. Migration & Modernization (20 Questions)

1. Explain the 7 Rs of migration.
2. Explain the migration phases — assess, mobilize, migrate.
3. Explain Migration Evaluator and Application Discovery Service.
4. Explain the Migration Hub.
5. Explain Application Migration Service (MGN).
6. Explain DMS for homogeneous and heterogeneous migrations.
7. Explain DataSync, Snowball, and Transfer Family.
8. Explain wave planning and dependency mapping.
9. Explain cutover strategy and rollback planning.
10. Explain the strangler fig pattern.
11. Explain monolith to microservices decomposition.
12. Explain domain-driven design in a modernization context.
13. Explain containerization of legacy workloads.
14. Explain mainframe modernization options.
15. Explain VMware Cloud on AWS and hybrid landing spots.
16. Explain license mobility and BYOL considerations.
17. Explain data gravity and how it shapes migration order.
18. Explain how you build a migration business case.
19. Explain common migration failure modes.
20. Design a migration plan for 500 applications.

---

# 29. Real-World Design Scenarios (30 Questions)

1. Design a multi-region, active-active web application.
2. Design a secure multi-account landing zone for a regulated bank.
3. Design a centralized egress and inspection architecture.
4. Design a shared services VPC serving 100 spoke VPCs.
5. Design hybrid connectivity for a company with 30 branch offices.
6. Design a zero-trust network architecture on AWS.
7. Design a PCI-DSS compliant cardholder data environment.
8. Design a HIPAA compliant healthcare data platform.
9. Design a data lake with fine-grained access control.
10. Design a real-time streaming analytics pipeline.
11. Design a serverless API handling 50,000 requests per second.
12. Design a multi-tenant SaaS platform with tenant isolation.
13. Design an EKS platform serving 40 engineering teams.
14. Design a global CDN and edge strategy for a media company.
15. Design a DR plan for a tier-0 trading system.
16. Design a batch processing platform for nightly ETL.
17. Design a machine learning inference platform at scale.
18. Design a centralized logging and SIEM integration.
19. Design a secrets management architecture across accounts.
20. Design a cost-optimized dev/test environment strategy.
21. Design an IoT ingestion platform for 1 million devices.
22. Design a mobile backend with offline sync.
23. Design a legacy Oracle to Aurora PostgreSQL migration.
24. Design a private SaaS integration using PrivateLink.
25. Design a partner data exchange architecture.
26. Design an internal developer platform on AWS.
27. Design a compliance evidence collection pipeline.
28. Design an architecture that survives a full AZ failure.
29. Design an architecture that survives a full region failure.
30. Walk through how you would review and improve an existing architecture.

---

# 30. Architect Behavioral & Leadership (15 Questions)

1. Tell me about the most complex architecture you have designed.
2. Describe a time you disagreed with a technical decision and how you handled it.
3. Describe an architecture decision you got wrong and what you learned.
4. How do you handle a stakeholder pushing an unrealistic timeline?
5. How do you balance speed of delivery against long-term architecture quality?
6. How do you influence teams you have no authority over?
7. Describe how you run an architecture review.
8. How do you document architecture decisions?
9. How do you handle technical debt in an enterprise portfolio?
10. Describe a time you had to say no to a business request.
11. How do you keep your architecture knowledge current?
12. How do you mentor engineers into architects?
13. Describe a production incident you led the response to.
14. How do you build consensus across competing teams?
15. How do you measure whether an architecture is successful?

---

**End of question bank — 750 questions across 30 topics.**
