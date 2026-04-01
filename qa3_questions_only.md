# DevOps Interview — Questions Only

## ⚡ ⚡ Architect Compendium

1. **What is the fundamental difference between High Availability and Disaster Recovery?**
2. **Walk me through a production-grade 3-tier Highly Available architecture.**
3. **Define RTO and RPO. Compare all 4 DR strategies.**
4. **Contrast Monolithic vs. Microservices. Explain Event-Driven Architecture.**
5. **Compare SQL vs. NoSQL from a Solutions Architect perspective.**
6. **Strategic GenAI use cases. Explain MCP. Differentiate A2A, MCP, and RAG.**
7. **Continuous Delivery vs. Deployment. Senior-level pipeline. CI/CD vs. GitOps.**
8. **Why EKS? HPA vs. Cluster Autoscaler vs. Karpenter. DaemonSets and Sidecars.**
9. **Lambda cold starts, scaling, security. SQS vs. SNS vs. EventBridge.**
10. **Interview strategy: The 'Question Behind the Question' and critical mistakes.**

## ⭐ STAR Interview Deep Dives

1. **How can you make your application scalable for a big traffic day?**
2. **What is an AI agent?**
3. **How do you achieve disaster recovery for your cloud application? (STAR)**
4. **How do you secure your application on the cloud? (STAR)**
5. **Describe an architecture you designed. (STAR)**
6. **Biggest challenge faced during designing your application on the cloud. (STAR)**
7. **How do you pick one service versus another? (STAR)**
8. **What is your favorite AWS service? How will you improve it?**
9. **What is AWS Service X? (Handling unknown services)**
10. **AWS Services Cheat Sheet — Services to know cold**

## ▶ Video Quick-Reference

1. **Scalability for big traffic day (Quick Reference)**
2. **AI agent definition (Quick Reference)**
3. **Disaster recovery strategies (Quick Reference)**
4. **Cloud security (Quick Reference)**
5. **Describe a system YOU designed (Quick Reference)**
6. **Biggest cloud design challenge (Quick Reference)**
7. **Picking one service over another (Quick Reference)**
8. **Favorite AWS service + improvements (Quick Reference)**
9. **Handling unknown AWS services (Quick Reference)**

## ☁ AWS Architecture & Core Compute

1. **How would you architect a fully available and fault-tolerant application on AWS?**
2. **Are you sure about that?**
3. **Have you worked with hybrid networking in AWS?**
4. **Why do you think it is so?**
5. **Have you worked with disaster recovery?**
6. **What DR solution would you design?**
7. **How to design for both regions active at once with separate access control?**
8. **Have you worked with the Well-Architected Framework?**
9. **List all pillars and summarize each?**
10. **Challenges with open source?**
11. **Will you still go through all iterations?**
12. **How ensure devs don't overwrite each other's work?**
13. **Info on enterprise workspaces?**
14. **How much of your work is driven by AI?**
15. **Do you use Cursor or Claude?**
16. **Fetch all EC2 across all accounts and regions?**
17. **EC2 within a specific OU?**
18. **What does 3/3 status check mean?**
19. **Share AMI with child accounts?**
20. **Shared AMI instance launches and terminates?**
21. **Diagnose shared AMI issues?**
22. **3-tier architecture steps?**
23. **Get PID?**
24. **Check system performance?**
25. **Full permissions?**
26. **Soft vs hard link?**
27. **Open firewall?**
28. **netstat -ntlp?**
29. **How do you implement DR in AWS?**
30. **What is RTO and RPO?**
31. **How do you design multi-region architecture?**
32. **How do you control AWS costs at scale?**
33. **What is AWS Well-Architected Framework?**
34. **How do you operate AWS for enterprise workloads?**
35. **How do you optimize EC2 cost in AWS?**
36. **What is Vertex AI in GCP and where would you use it?**
37. **How would you deploy GPU workloads on AWS?**
38. **Spot vs On-Demand vs Reserved - when to use each**
39. **S3 costs tripled - how to investigate and fix**
40. **Your entire production workload runs in a single AWS region, and management asks you to design a multi-region disaster recovery strategy with minimal downtime. How would you approach it?**
41. **Your cluster is facing high resource utilization. How will you optimize it?**
42. **What is Azure App Service?**
43. **How do you switch between deployment slots in Azure App Service?**

## 🌐 AWS Networking & Load Balancing

1. **How would you make a subnet public or private?**
2. **Internet Gateway is attached to a subnet or a VPC?**
3. **Where are the outgoing rules for a private subnet needing internet?**
4. **List all choices to connect on-prem to AWS?**
5. **Any other networking options?**
6. **Why do you need Transit Gateway when we have VPC Peering?**
7. **How is Transit Gateway beneficial vs VPC Peering?**
8. **Types of load balancers and when to use each?**
9. **API Gateway vs ALB — when to use each?**
10. **CloudFormation template for EC2 + ALB?**
11. **VPC peering with overlapping CIDRs?**
12. **What is VPC endpoint (Interface vs Gateway)?**
13. **How does PrivateLink work?**
14. **What is hybrid connectivity in AWS?**
15. **Difference between Direct Connect and VPN?**
16. **How does ALB handle millions of requests?**
17. **What is connection draining (deregistration delay)?**
18. **Difference between Security Group vs NACL**
19. **Explain end-to-end request flow: 👉 Internet → AWS → Application**
20. **What are the types of Load Balancers in AWS and how do they work?**
21. **Security Groups vs NACLs - and the follow-up question 80% miss**
22. **VPC Peering vs Transit Gateway decision framework**
23. **Why does AWS reserve 5 IP addresses in every subnet, and what are they used for?**

## 🔒 AWS IAM & Security

1. **Security best practices across each area?**
2. **Bare minimum to keep cloud secure?**
3. **How to extend access without compromising security?**
4. **Do you know what service that is?**
5. **Have you worked with cross-account KMS?**
6. **How do you facilitate that connectivity?**
7. **What configuration is required?**
8. **Do you take care of Docker image security?**
9. **Are K8s Secrets really secrets?**
10. **How to make K8s Secrets more secure?**
11. **Where are secrets stored?**
12. **How ensure secrets aren't exposed?**
13. **Multi-account IAM role via CloudFormation?**
14. **Managing secrets in Ansible?**
15. **Securely run playbooks with secrets?**
16. **How does AWS IAM evaluate policies?**
17. **What is policy evaluation logic order?**
18. **Difference between identity-based and resource-based policies?**
19. **How does AWS STS work internally?**
20. **How do you implement cross-account access securely?**
21. **What is AWS Organizations and SCP?**
22. **How do Service Control Policies work?**
23. **How do you enforce security guardrails in AWS?**
24. **How do you secure S3 buckets at scale?**
25. **How do you prevent data exfiltration from S3?**
26. **What is AWS Shield vs WAF?**
27. **How does AWS WAF protect applications?**
28. **How do you detect compromised IAM credentials?**
29. **How would you restrict pod-to-pod communication using Calico Network Policies?**
30. **How do you secure AWS credentials in production environments?**
31. **How do you implement least privilege access across environments?**
32. **What are OWASP Top 10 aligned security rules?**

## ☸ Kubernetes & Containers

1. **Any specific reason you'd use EKS and not ECS?**
2. **Why do you think ECS won't be a good choice in that scenario?**
3. **Don't you think ECS also provides that kind of stuff which EKS does?**
4. **Scenario where ECS will be better suited compared to EKS?**
5. **Which one is cheaper — EKS or ECS?**
6. **Why is ECS cheaper?**
7. **Do you create Docker images or get them from developers?**
8. **Docker best practices for image creation?**
9. **Where do you host Docker images?**
10. **How do you control number of images in ECR?**
11. **Practices to ensure ECR images aren't orphaned?**
12. **How ensure Docker image works same on dev machine and EKS?**
13. **How ensure developer scans locally AND pipeline has control?**
14. **How to reduce Docker image size?**
15. **How do you update EKS clusters?**
16. **How to ensure zero downtime during EKS upgrade?**
17. **If application stops working, what are next steps?**
18. **Have you worked with stateful applications on K8s?**
19. **Why deploy it on Kubernetes?**
20. **But you didn't question them — as DevOps you should push back?**
21. **Does K8s support blue-green deployment?**
22. **Kubernetes best practices?**
23. **K8s troubleshooting scenarios?**
24. **Why do you need Ingress?**
25. **How is Ingress different from Services?**
26. **What tool for deploying applications?**
27. **Only ArgoCD or Helm + ArgoCD?**
28. **Why add Helm complexity?**
29. **Experience with probes?**
30. **How are probes different from each other?**
31. **Why are probes needed?**
32. **What are ECS and ECR?**
33. **How to create and push Docker images to ECR?**
34. **Optimize a 450MB Docker image?**
35. **Docker vs Kubernetes in orchestration?**
36. **What is a pod in Kubernetes?**
37. **Container vs Pod?**
38. **Load balancing in Kubernetes?**
39. **What is HPA (Horizontal Pod Autoscaler)?**
40. **Explain the Docker commands used inside a Dockerfile**
41. **What is Pod Intent in Kubernetes?**
42. **How does Rollback Deployment work internally?**
43. **Difference between HPA, KEDA, and Karpenter?**
44. **Why do we still need HPA if Karpenter is being used?**
45. **How does Service A communicate with Service B inside Kubernetes?**
46. **How does a pod securely connect to S3 without hardcoding credentials?**
47. **How do you implement RBAC policies in Kubernetes?**
48. **What are multiple tainted nodes in Kubernetes and when are they used?**
49. **If I want to run two applications in the same EKS cluster but keep them isolated, how would you design it?**
50. **What are dedicated nodes in Kubernetes?**
51. **What is a CSI Driver (Container Storage Interface)?**
52. **Which Storage Classes are commonly used in Kubernetes?**
53. **What would you do if Amazon EKS runs out of IP addresses? How can you resolve it?**
54. **What is an IngressClass in Kubernetes, and which ingress controller is typically used with Amazon EKS?**
55. **If you have 4 microservices, would you deploy them in 4 separate pods or in a single pod? Why?**
56. **CrashLoopBackOff on EKS - step-by-step investigation**
57. **Pods in one Kubernetes namespace can communicate internally, but pods in another namespace cannot reach them even though services are exposed. How would you troubleshoot this networking issue?**
58. **Your CI/CD pipeline successfully builds and deploys a container image, but the Kubernetes deployment keeps pulling the old image version. What could be causing this?**
59. **Your application is under heavy traffic but Kubernetes HPA is not scaling pods even though CPU usage is above the configured threshold. How would you debug this?**
60. **New worker nodes are successfully joining an EKS cluster, but pods remain stuck in Pending state. What could be the possible reasons?**
61. **A pod is in CrashLoopBackOff state. How will you troubleshoot step by step?**
62. **Your application is not accessible via Ingress. What could be the issue?**
63. **Pods are not getting scheduled on nodes. What will you check?**
64. **One node in the cluster is NotReady. How do you investigate and fix it?**
65. **Application inside pod is slow despite sufficient resources. Where will you debug?**
66. **You need to scale applications automatically. How does HPA work internally?**
67. **Config changes are made, but pods are not picking up updates. Why?**
68. **You need to secure your Kubernetes cluster. What best practices will you follow?**
69. **Difference between RUN, CMD, and ENTRYPOINT?**
70. **How do you pass environment variables to containers?**
71. **Difference between ARG and ENV?**
72. **What is a multi-stage Docker build?**
73. **How do you reduce Docker image size?**
74. **How does Docker build cache work?**
75. **How do you optimize Dockerfile for CI/CD speed?**
76. **How do you handle secrets in Docker builds?**
77. **How do you debug a container that exits immediately?**
78. **What are Dockerfile security best practices?**
79. **What is the purpose of .dockerignore?**
80. **Why is COPY . . risky in CI/CD pipelines?**
81. **How do you ensure deterministic Docker builds?**
82. **Explain Docker architecture.**
83. **Write a basic Dockerfile.**
84. **If a Docker image is built and you manually install missing packages inside a container, how will you convert it into a new Docker image?**
85. **Difference between CMD, ENTRYPOINT, and RUN in Docker.**
86. **What is kubeconfig in Kubernetes?**
87. **How do you handle secrets in Kubernetes?**
88. **How do you manage environment variables in Kubernetes?**
89. **How do you fetch secrets from Azure Key Vault and use them in Kubernetes?**
90. **What is Ingress and how do you use it?**

## 🏗 Infrastructure as Code & CI/CD

1. **Have you worked with IaC?**
2. **When CloudFormation vs Terraform?**
3. **Will you still choose Terraform?**
4. **How would you architect a Terraform directory structure?**
5. **Open source or enterprise Terraform?**
6. **Do you write locally and deploy directly to prod?**
7. **How to rollback infrastructure with Terraform?**
8. **Ansible in real projects?**
9. **How did you deploy SSL?**
10. **How do you design zero-downtime deployments in AWS?**
11. **What is blue-green deployment in AWS?**
12. **What is canary deployment?**
13. **Explain a Terraform folder structure you have used in projects**
14. **How will you create 5 EC2 instances with different IAM roles and instance types using Terraform?**
15. **How do you handle Terraform versioning in a project?**
16. **You want to delete only an EC2 instance from Terraform — which argument/command will you use?**
17. **Which deployment strategies have you implemented? (Rolling, Blue-Green, Canary, etc.)**
18. **What is a Terraform module and why do we use it?**
19. **What is the difference between data block and resource block in Kubernetes/Terraform?**
20. **Which CI/CD pipeline have you used (Declarative / Scripted) and why?**
21. **You created an S3 bucket using Terraform, now you want to manage it manually from AWS Console.**
22. **What is Canary Deployment and how do you implement it in Kubernetes?**
23. **What are Terraform Workspaces and when should you use them?**
24. **How does Terraform state management work internally?**
25. **What is terraform import and in which real-world scenario is it used?**
26. **How would you design a secure CI/CD pipeline for production?**
27. **How do you handle secret management in pipelines?**
28. **Secrets management in CI/CD - what disqualifies you instantly**
29. **Is a Webhook inbound or outbound, and how does it work in CI/CD systems?**
30. **How do you integrate GitHub Actions with AWS for CI/CD pipelines?**
31. **A manual change was made to an AWS resource in production causing Terraform drift, and the next terraform apply wants to recreate the resource. How would you reconcile the infrastructure without downtime?**
32. **Multiple Terraform modules across repositories depend on each other and a deployment fails due to dependency conflicts. How would you design a reliable deployment strategy?**
33. **You need to deploy a new version of a critical microservice in production without any downtime. Which deployment strategies would you implement?**
34. **Your deployment is not updating properly (rolling update stuck). What could be wrong?**
35. **If Terraform state file has older entries and infra was created manually, how will you add it to Terraform?**
36. **If there are 1000+ changes to be managed in Terraform state, how will you handle it?**

## 🗄 Databases & Storage

1. **Have you hosted a website on S3?**
2. **What configurations for publicly available S3 website?**
3. **Anything else?**
4. **What is a parameter group in Amazon RDS?**
5. **RDS can't connect to S3?**
6. **Configure Grafana dashboards?**

## 📊 Observability, DevOps & Operations

1. **Anything apart from that?**
2. **Any connectivity failures you resolved?**
3. **Any long-standing issue?**
4. **What would you implement to optimize cloud costs?**
5. **Is Trusted Advisor free?**
6. **Will you still use Spot for batch jobs?**
7. **What if that instance type isn't available in that region?**
8. **Steps to investigate and remediate an issue?**
9. **Grafana dashboard types in DevOps?**
10. **Email alerts from Grafana?**
11. **Common alert conditions?**
12. **What is AWS Config and why is it used?**
13. **What is AWS GuardDuty?**
14. **How do you set up an alert policy in GKE if any pod crashes?**
15. **What is AWS Systems Manager (SSM)? How can you deploy or manage applications on EC2 using SSM?**
16. **What is MLOps, and which tools are commonly used in MLOps pipelines?**
17. **How to debug high CPU on EC2 like a senior engineer**
18. **A vulnerable dependency was detected in a Docker image after deployment. What steps would you take to mitigate the risk and secure the CI/CD pipeline?**
19. **Users report intermittent failures across microservices, but logs from individual services look normal. How would you identify the root cause?**

## 🐧 Linux, Scripting & Git

1. **What is Node Exporter?**
2. **What is PM2?**
3. **Kill a PM2 process?**
4. **Check running nodes?**
5. **Kill a process in Linux?**
6. **chmod 555?**
7. **Check open ports?**
8. **Cron job?**
9. **Clear cache?**
10. **Resolve merge conflicts?**
11. **Switch to a new branch?**
12. **Which branching strategy have you used in your project and why?**
13. **Explain the booting process of Linux.**
14. **What are services in Linux?**
15. **How do you check open ports in Linux?**
16. **Explain the Linux file system structure.**
17. **Command to check OS version in Linux?**

## 🔥 Real-World Scenarios

1. **Your Jenkins pipeline build is successful, but deployment is failing. What will you check?**
2. **A Kubernetes pod is in CrashLoopBackOff. How will you debug it?**
3. **Terraform infrastructure has drifted due to manual changes. What’s your approach?**
4. **EC2 CPU suddenly spikes in AWS. What steps will you take?**
5. **Docker container works locally but fails in production. Why?**
6. **How do you ensure zero downtime deployments?**
7. **How do you securely manage secrets in production?**

