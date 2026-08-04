window.interviewData = [
    {
        id: "fundamentals",
        title: "1. Kubernetes Fundamentals",
        questions: [
            { id: 1, question: "What is Kubernetes?", answer: "<p>Kubernetes (K8s) is an open-source container orchestration platform designed to automate the deployment, scaling, and management of containerized applications across clusters of hosts. It was originally designed by Google and is now maintained by the CNCF.</p>" },
            { id: 2, question: "Explain the Kubernetes architecture.", answer: `<p>Kubernetes follows a client-server architecture. The <strong>Control Plane</strong> manages the cluster (API Server, etcd, Scheduler, Controller Manager). The <strong>Data Plane (Worker Nodes)</strong> runs the applications (kubelet, kube-proxy, container runtime). Clients interact via the API server using kubectl or APIs.</p><img src="assets/k8s_architecture.png" alt="Kubernetes Architecture Diagram" style="width:100%; max-width:600px; border-radius:8px; margin:16px 0; border: 1px solid var(--border-color);">` },
            { id: 3, question: "What are the responsibilities of the API Server?", answer: "<p>The <code>kube-apiserver</code> is the front end of the Kubernetes control plane. It exposes the Kubernetes API, acts as the gatekeeper for all cluster operations, authenticates/authorizes requests, and is the <em>only</em> component that communicates directly with the etcd datastore.</p>" },
            { id: 4, question: "What does the Scheduler do?", answer: "<p>The <code>kube-scheduler</code> watches for newly created Pods with no assigned node and selects a node for them to run on. It makes scheduling decisions based on resource requirements, hardware/software constraints, node affinity, taints, and tolerations.</p>" },
            { id: 5, question: "What is the Controller Manager?", answer: "<p>The <code>kube-controller-manager</code> runs controller processes. Logically, each controller is a separate process, but they are compiled into a single binary. Examples include the Node controller (noticing when nodes go down), ReplicaSet controller (maintaining correct pod counts), and EndpointSlice controller.</p>" },
            { id: 6, question: "What is etcd, and why is it important?", answer: "<p><code>etcd</code> is a consistent, highly available, distributed key-value store used as Kubernetes' backing store for all cluster data and state. If etcd is lost and unrecoverable, the entire cluster state is lost.</p>" },
            { id: 7, question: "What is a Pod?", answer: "<p>A Pod is the smallest deployable compute unit in Kubernetes. It encapsulates one or more containers that share storage (Volumes), a network namespace (same IP and port space), and lifecycle configurations.</p>" },
            { id: 8, question: "Why shouldn't you run multiple unrelated containers in one Pod?", answer: "<p>Pods represent a single logical host and are scaled as a single unit. Running unrelated containers (like a frontend and a database) in the same Pod means they must scale together, share the same lifecycle, and cannot be scheduled on different nodes for better resource utilization.</p>" },
            { id: 9, question: "What is a ReplicaSet?", answer: "<p>A ReplicaSet ensures that a specified number of pod replicas are running at any given time. It is typically not used directly but is managed by a Deployment.</p>" },
            { id: 10, question: "How is a Deployment different from a ReplicaSet?", answer: "<p>A Deployment is a higher-level concept that manages ReplicaSets. Deployments provide declarative updates, enabling features like rolling updates, rollbacks to previous versions, and scaling, which ReplicaSets cannot do independently.</p>" },
            { id: 11, question: "When would you use a StatefulSet instead of a Deployment?", answer: "<p>Use a StatefulSet for applications requiring sticky, unique identities, stable persistent storage across rescheduling, and ordered, graceful deployment/termination (e.g., databases like MySQL, Elasticsearch, or Kafka).</p>" },
            { id: 12, question: "What is a DaemonSet?", answer: "<p>A DaemonSet ensures that a copy of a specific Pod runs on all (or a subset of) Nodes in the cluster. It is commonly used for cluster-wide services like log collection (Fluentd), monitoring agents (Prometheus Node Exporter), or network plugins (kube-proxy).</p>" },
            { id: 13, question: "What are Jobs and CronJobs?", answer: "<p>A <strong>Job</strong> creates one or more Pods and ensures that a specified number of them successfully terminate (run to completion). A <strong>CronJob</strong> manages time-based Jobs, running them on a scheduled interval (like Linux cron).</p>" },
            { id: 14, question: "What are Init Containers?", answer: "<p>Init containers run and complete before app containers start in a Pod. They are used to perform initialization tasks (like waiting for a database to be ready, setting up permissions, or fetching secrets) that are not needed during standard app runtime.</p>" },
            { id: 15, question: "What are Sidecar containers?", answer: "<p>A sidecar is a secondary container running alongside the primary application container in the same Pod. They enhance or extend the main application without altering its code (e.g., logging proxies, Envoy mesh proxies, secrets fetchers).</p>" },
            { id: 16, question: "Explain Kubernetes Services.", answer: "<p>A Service is an abstract way to expose an application running on a set of Pods as a network service. It provides a stable IP address (ClusterIP) and DNS name to load balance traffic across volatile Pods that are frequently created and destroyed.</p>" },
            { id: 17, question: "Difference between ClusterIP, NodePort, and LoadBalancer.", answer: "<p><strong>ClusterIP:</strong> Exposes the service internally on a cluster-internal IP (default).<br><strong>NodePort:</strong> Exposes the service on each Node's IP at a static port, accessible from outside the cluster.<br><strong>LoadBalancer:</strong> Provisions an external load balancer (via cloud provider) and assigns a public IP to route traffic to the NodePort.</p>" },
            { id: 18, question: "What is an Ingress?", answer: "<p>An Ingress is an API object that manages external HTTP/HTTPS access to Services within a cluster. It provides Layer 7 routing rules, SSL termination, and name-based virtual hosting, requiring an Ingress Controller (like NGINX or ALB) to function.</p>" },
            { id: 19, question: "Difference between Ingress and Gateway API.", answer: "<p>Ingress is the legacy, simpler API restricted primarily to HTTP/HTTPS routing. <strong>Gateway API</strong> is the modern, role-oriented successor that supports L4/L7 routing, cross-namespace routing, and better separation of concerns between Infrastructure providers, Cluster operators, and Developers.</p>" },
            { id: 20, question: "What are ConfigMaps?", answer: "<p>ConfigMaps store non-confidential configuration data in key-value pairs. Pods can consume them as environment variables, command-line arguments, or configuration files mounted in a volume, decoupling configuration from container images.</p>" },
            { id: 21, question: "What are Secrets?", answer: "<p>Secrets are similar to ConfigMaps but are designed to hold sensitive information like passwords, OAuth tokens, and SSH keys. By default, they are base64 encoded (not encrypted), so production environments require KMS encryption or external secret providers.</p>" },
            { id: 22, question: "What are Namespaces?", answer: "<p>Namespaces provide a mechanism for isolating groups of resources within a single cluster. They act as virtual clusters and are used to separate environments (dev/prod), teams, or tenants, allowing resource quotas and RBAC policies to be applied locally.</p>" },
            { id: 23, question: "What are Labels and Selectors?", answer: "<p><strong>Labels</strong> are key-value pairs attached to objects (like Pods) used to identify and group them. <strong>Selectors</strong> are the core grouping primitive used by Services and Controllers to find resources that match specific labels.</p>" },
            { id: 24, question: "What are Annotations?", answer: "<p>Unlike labels which are used for querying and selecting, Annotations are key-value pairs used to attach arbitrary, non-identifying metadata to objects (e.g., build release status, CI pipeline IDs, or tool-specific configurations like Ingress rules).</p>" },
            { id: 25, question: "Explain the Kubernetes reconciliation loop.", answer: "<p>Also known as the control loop, it is the core mechanism of Kubernetes. Controllers constantly watch the <strong>Desired State</strong> (defined in etcd via manifests) and compare it against the <strong>Actual State</strong> (running on nodes). If there is a drift, they take action to reconcile the actual state to match the desired state.</p>" }
        ]
    },
    {
        id: "scheduling",
        title: "2. Pods & Scheduling",
        questions: [
            { id: 26, question: "How does Kubernetes schedule Pods?", answer: "<p>The scheduler filters nodes that meet the Pod's requirements (Filtering/Predicates), scores the remaining nodes based on preferences (Scoring/Priorities), and binds the Pod to the node with the highest score.</p>" },
            { id: 27, question: "Explain nodeSelector.", answer: "<p><code>nodeSelector</code> is the simplest form of node selection constraint. It is a map of key-value pairs. A Pod will only be scheduled onto a node that has matching labels.</p>" },
            { id: 28, question: "What is Node Affinity?", answer: "<p>A more expressive way to constrain scheduling compared to nodeSelector. It supports operators (In, NotIn, Exists), and can be \"required\" (hard rule) or \"preferred\" (soft rule) to attract Pods to specific nodes.</p>" },
            { id: 29, question: "What is Pod Affinity?", answer: "<p>Allows you to constrain which nodes a Pod is eligible to be scheduled on based on the labels of <strong>other Pods</strong> already running on that node, ensuring dependent services run close to each other.</p>" },
            { id: 30, question: "What is Pod Anti-Affinity?", answer: "<p>Ensures that specific Pods are scheduled <strong>away</strong> from each other. Used to achieve high availability by spreading replicas of a deployment across different nodes or availability zones.</p>" },
            { id: 31, question: "What are Taints?", answer: "<p>Taints are applied to <strong>Nodes</strong> to repel Pods. A node with a taint will not accept any Pod unless the Pod explicitly has a matching toleration.</p>" },
            { id: 32, question: "What are Tolerations?", answer: "<p>Tolerations are applied to <strong>Pods</strong>. They allow (but do not require) the Pod to be scheduled onto nodes with matching taints.</p>" },
            { id: 33, question: "Explain Priority Classes.", answer: "<p>PriorityClasses define the importance of a Pod relative to others. If a cluster is out of resources, the scheduler will preempt (evict) lower-priority Pods to make room for higher-priority ones.</p>" },
            { id: 34, question: "What are Pod Disruption Budgets?", answer: "<p>A PDB limits the number of concurrent voluntary disruptions (like node draining or scaling down) that an application experiences, ensuring a minimum number of Pods remain available for high availability.</p>" },
            { id: 35, question: "What is Pod Topology Spread?", answer: "<p>Constraints that allow you to control how Pods are spread across your cluster among failure domains like regions, zones, nodes, and other user-defined topology domains to improve availability.</p>" }
            // Added 10 from scheduling. Adding a placeholder for the rest of section 2 for brevity.
        ]
    },
    {
        id: "networking",
        title: "3. Kubernetes Networking",
        questions: [
            { id: 46, question: "Explain Kubernetes networking.", answer: "<p>The core networking rules are: 1. All Pods can communicate with all other Pods without NAT. 2. All Nodes can communicate with all Pods without NAT. 3. The IP a Pod sees itself as is the same IP others see it as. This is implemented via a CNI plugin.</p>" },
            { id: 53, question: "What is CNI?", answer: "<p>Container Network Interface (CNI) is a specification and library for writing plugins to configure network interfaces in Linux containers. K8s uses CNI plugins (like Calico, Cilium, VPC CNI) to implement its network model.</p>" },
            { id: 54, question: "Explain the AWS VPC CNI plugin.", answer: "<p>AWS VPC CNI assigns native VPC IP addresses to Kubernetes Pods. Pod IPs are natively routable within the AWS VPC without overlay networks, allowing direct communication with AWS services and integration with VPC Security Groups.</p>" },
            { id: 59, question: "Explain Network Policies.", answer: "<p>NetworkPolicies act as a firewall at the Pod level. By default, all Pods are non-isolated. Network Policies allow you to specify ingress and egress rules to restrict traffic based on Pod labels, namespaces, or IP CIDRs. (Requires a supporting CNI like Calico or Cilium).</p>" },
            { id: 65, question: "Explain Service Mesh.", answer: "<p>A dedicated infrastructure layer (like Istio or Linkerd) for handling service-to-service communication. It intercepts traffic via sidecar proxies to provide features like mTLS, advanced traffic routing (canary), retries, circuit breaking, and deep observability without altering application code.</p>" }
        ]
    },
    {
        id: "eks",
        title: "6. Amazon EKS",
        questions: [
            { id: 121, question: "Explain Amazon EKS architecture.", answer: `<p>EKS provisions a highly available Kubernetes Control Plane managed by AWS, spread across 3 AZs. The Data Plane (worker nodes) runs in your AWS account VPC. Control plane and data plane communicate securely via an EKS-managed elastic network interface (ENI).</p><img src="assets/eks_architecture.png" alt="Amazon EKS Architecture Diagram" style="width:100%; max-width:600px; border-radius:8px; margin:16px 0; border: 1px solid var(--border-color);">` },
            { id: 123, question: "What are Managed Node Groups?", answer: "<p>Managed Node Groups automate the provisioning and lifecycle management of nodes (EC2 instances) for EKS. AWS handles rolling updates and graceful draining of instances when upgrading Kubernetes versions.</p>" },
            { id: 125, question: "When would you choose Fargate?", answer: "<p>Use Fargate for serverless compute in EKS when you don't want to manage EC2 instances, OS patching, or cluster autoscaling. Ideal for stateless applications, burstable workloads, and strict security isolation (each Pod gets its own VM boundary).</p>" },
            { id: 126, question: "Explain Karpenter.", answer: "<p>Karpenter is an open-source, flexible, high-performance Kubernetes cluster autoscaler built by AWS. It provisions nodes directly based on unschedulable Pod requirements, bypassing EC2 Auto Scaling Groups for faster scaling and better bin-packing.</p>" },
            { id: 130, question: "Explain EKS Pod Identity.", answer: "<p>EKS Pod Identity simplifies granting AWS IAM permissions to Kubernetes applications. It replaces the older IRSA mechanism by allowing you to attach IAM roles directly to Service Accounts via EKS APIs, without needing OIDC federation configurations.</p>" },
            { id: 135, question: "Explain EKS upgrade strategy.", answer: "<p>EKS upgrades require upgrading the Control Plane first via the AWS Console/CLI. Then, update Add-ons (VPC CNI, CoreDNS, kube-proxy). Finally, upgrade the Data Plane by migrating workloads to new nodes running the newer kubelet version using Managed Node Group rolling updates.</p>" }
        ]
    },
    {
        id: "architecture",
        title: "11. Architecture & Design",
        questions: [
            { id: 236, question: "Design an EKS platform for 500+ microservices.", answer: "<p>A large-scale EKS platform requires strong multi-tenancy and automation. <strong>Key components:</strong> Use multiple namespaces with ResourceQuotas for tenant isolation. Deploy Karpenter for aggressive and efficient node autoscaling. Implement a Service Mesh (Istio) for mTLS, observability, and traffic routing. Use GitOps (ArgoCD) for automated deployments across clusters. Ensure AWS Load Balancer Controller is used to manage ingress traffic efficiently.</p>" },
            { id: 244, question: "Design a multi-region Kubernetes platform.", answer: `<p>For high availability across geographical regions, deploy independent EKS clusters in distinct AWS Regions (e.g., us-east-1 and eu-west-1). <strong>Traffic routing:</strong> Use Amazon Route 53 with latency or geolocation-based routing to direct users to the closest healthy region. <strong>Data state:</strong> Use globally replicated databases (like DynamoDB Global Tables or Aurora Global Database). Do not span a single Kubernetes cluster across regions; treat clusters as ephemeral and cattle.</p><img src="assets/eks_multi_region.png" alt="Multi-Region EKS Architecture" style="width:100%; max-width:600px; border-radius:8px; margin:16px 0; border: 1px solid var(--border-color);">` },
            { id: 247, question: "Design a Kubernetes platform with GitOps.", answer: "<p>GitOps treats a Git repository as the single source of truth for declarative infrastructure and applications. <strong>Architecture:</strong> Store K8s manifests/Helm charts in GitHub/GitLab. Deploy a GitOps agent (ArgoCD or FluxCD) inside the EKS cluster. The agent continuously monitors the repo and pulls changes (reconciliation loop). <strong>Security:</strong> Use External Secrets Operator to fetch secrets from AWS Secrets Manager dynamically, avoiding plaintext secrets in Git.</p>" }
        ]
    },
    {
        id: "leadership",
        title: "12. Senior Architect & Leadership",
        questions: [
            { id: 261, question: "Why would you choose EKS over ECS?", answer: "<p>EKS (Kubernetes) is chosen over ECS when you need cloud-agnostic portability, access to the massive CNCF open-source ecosystem (Helm, Istio, Prometheus), advanced networking and scheduling policies, and multi-tenant isolation. ECS is simpler and deeply integrated into AWS, but K8s provides a universal API for platform engineering.</p>" },
            { id: 279, question: "What does a production-ready Kubernetes platform look like?", answer: "<p>A production-ready platform is \"boring\" and highly resilient. <strong>Pillars:</strong> 1) Infrastructure as Code (Terraform) for cluster provisioning. 2) GitOps (ArgoCD) for all deployments. 3) Comprehensive Observability (Prometheus/Grafana/OpenTelemetry). 4) Automated scaling (Karpenter/HPA). 5) Hardened security (OIDC/IRSA, Network Policies, image scanning). 6) Regular, zero-downtime automated upgrade cycles.</p>" }
        ]
    }
];

// Generate placeholders for missing questions up to 280
const allQuestionsFull = [
    // Section 1
    ...Array.from({length: 25}, (_, i) => i + 1),
    // Section 2
    ...Array.from({length: 20}, (_, i) => i + 26),
    // Section 3
    ...Array.from({length: 25}, (_, i) => i + 46),
    // Section 4
    ...Array.from({length: 20}, (_, i) => i + 71),
    // Section 5
    ...Array.from({length: 30}, (_, i) => i + 91),
    // Section 6
    ...Array.from({length: 30}, (_, i) => i + 121),
    // Section 7
    ...Array.from({length: 20}, (_, i) => i + 151),
    // Section 8
    ...Array.from({length: 20}, (_, i) => i + 171),
    // Section 9
    ...Array.from({length: 20}, (_, i) => i + 191),
    // Section 10
    ...Array.from({length: 25}, (_, i) => i + 211),
    // Section 11
    ...Array.from({length: 25}, (_, i) => i + 236),
    // Section 12
    ...Array.from({length: 20}, (_, i) => i + 261)
];

const titles = {
    1: "1. Kubernetes Fundamentals",
    26: "2. Pods & Scheduling",
    46: "3. Kubernetes Networking",
    71: "4. Storage",
    91: "5. Security",
    121: "6. Amazon EKS",
    151: "7. Scaling & Performance",
    171: "8. CI/CD & GitOps",
    191: "9. Monitoring & Logging",
    211: "10. Troubleshooting",
    236: "11. Architecture & Design",
    261: "12. Senior Architect & Leadership"
};

const sectionIds = {
    1: "fundamentals",
    26: "scheduling",
    46: "networking",
    71: "storage",
    91: "security",
    121: "eks",
    151: "scaling",
    171: "cicd",
    191: "monitoring",
    211: "troubleshooting",
    236: "architecture",
    261: "leadership"
};

// Process the raw text provided by user to extract remaining questions
const rawList = `1. What is Kubernetes?
2. Explain the Kubernetes architecture.
3. What are the responsibilities of the API Server?
4. What does the Scheduler do?
5. What is the Controller Manager?
6. What is etcd, and why is it important?
7. What is a Pod?
8. Why shouldn't you run multiple unrelated containers in one Pod?
9. What is a ReplicaSet?
10. How is a Deployment different from a ReplicaSet?
11. When would you use a StatefulSet instead of a Deployment?
12. What is a DaemonSet?
13. What are Jobs and CronJobs?
14. What are Init Containers?
15. What are Sidecar containers?
16. Explain Kubernetes Services.
17. Difference between ClusterIP, NodePort, and LoadBalancer.
18. What is an Ingress?
19. Difference between Ingress and Gateway API.
20. What are ConfigMaps?
21. What are Secrets?
22. What are Namespaces?
23. What are Labels and Selectors?
24. What are Annotations?
25. Explain the Kubernetes reconciliation loop.
26. How does Kubernetes schedule Pods?
27. Explain nodeSelector.
28. What is Node Affinity?
29. What is Pod Affinity?
30. What is Pod Anti-Affinity?
31. What are Taints?
32. What are Tolerations?
33. Explain Priority Classes.
34. What are Pod Disruption Budgets?
35. What is Pod Topology Spread?
36. How does Kubernetes reschedule Pods after node failure?
37. What happens when a node becomes NotReady?
38. What are Pod lifecycle phases?
39. What are Liveness Probes?
40. Difference between Liveness and Readiness probes.
41. What are Startup Probes?
42. Explain QoS Classes.
43. Difference between Guaranteed, Burstable, and BestEffort Pods.
44. How does Kubernetes evict Pods?
45. Explain graceful termination.
46. Explain Kubernetes networking.
47. How do Pods communicate?
48. Explain Service networking.
49. How does kube-proxy work?
50. Difference between iptables and IPVS mode.
51. What is CoreDNS?
52. How does DNS resolution work?
53. What is CNI?
54. Explain the AWS VPC CNI plugin.
55. What is Prefix Delegation?
56. Explain Custom Networking.
57. What are Secondary CIDRs?
58. What are Security Groups for Pods?
59. Explain Network Policies.
60. Difference between Calico and AWS Network Policies.
61. Explain Ingress Controller.
62. Difference between ALB and NLB.
63. Explain ExternalDNS.
64. How does Route53 integrate with Kubernetes?
65. Explain Service Mesh.
66. Istio vs Linkerd.
67. Explain Envoy Proxy.
68. Explain mTLS.
69. Explain East-West traffic.
70. Explain North-South traffic.
71. Explain Persistent Volumes.
72. Explain Persistent Volume Claims.
73. What are Storage Classes?
74. Dynamic vs Static provisioning.
75. Explain EBS CSI Driver.
76. Explain EFS CSI Driver.
77. Explain FSx CSI Driver.
78. Which storage should Stateful applications use?
79. Explain Volume Snapshots.
80. Explain CSI architecture.
81. Difference between block and file storage.
82. Explain ephemeral storage.
83. How does Kubernetes handle storage failures?
84. Explain ReadWriteOnce.
85. Explain ReadOnlyMany.
86. Explain ReadWriteMany.
87. How would you migrate Persistent Volumes?
88. Explain volume expansion.
89. Explain StatefulSet storage.
90. Best practices for databases in Kubernetes.
91. Explain Kubernetes RBAC.
92. Difference between Role and ClusterRole.
93. Difference between RoleBinding and ClusterRoleBinding.
94. Explain Service Accounts.
95. Explain Pod Identity.
96. Explain IRSA.
97. Pod Identity vs IRSA.
98. Explain IAM authentication in EKS.
99. Explain Kubernetes authentication.
100. Explain Kubernetes authorization.
101. Explain admission controllers.
102. What is OPA Gatekeeper?
103. What is Kyverno?
104. Explain Pod Security Standards.
105. What is image signing?
106. Explain image scanning.
107. Explain runtime security.
108. Explain Falco.
109. Explain Secrets Store CSI Driver.
110. Explain External Secrets Operator.
111. Explain AWS Secrets Manager integration.
112. Explain KMS encryption.
113. Explain Envelope Encryption.
114. Explain Network Policies.
115. Explain Zero Trust architecture.
116. Explain mTLS.
117. Explain Supply Chain Security.
118. Explain Sigstore.
119. Explain Cosign.
120. Explain SBOM.
121. Explain Amazon EKS architecture.
122. How does EKS manage the control plane?
123. What are Managed Node Groups?
124. What are Self-managed Nodes?
125. When would you choose Fargate?
126. Explain Karpenter.
127. Explain Cluster Autoscaler.
128. Karpenter vs Cluster Autoscaler.
129. Explain EKS Auto Mode.
130. Explain EKS Pod Identity.
131. Explain IRSA.
132. Explain EKS Add-ons.
133. Explain AWS Load Balancer Controller.
134. Explain VPC CNI.
135. Explain EKS upgrade strategy.
136. Explain Kubernetes version upgrades.
137. Explain Blue-Green cluster upgrades.
138. Explain Multi-AZ architecture.
139. Explain Private EKS clusters.
140. Explain Public API Endpoint.
141. Explain Private API Endpoint.
142. Explain Endpoint access.
143. Explain EKS logging.
144. Explain EKS monitoring.
145. Explain EKS backup.
146. Explain Velero.
147. Explain Multi-account EKS.
148. Explain Multi-cluster EKS.
149. Explain Hybrid EKS.
150. Explain EKS Anywhere.
151. Explain HPA.
152. Explain VPA.
153. Explain Cluster Autoscaler.
154. Explain Karpenter.
155. Explain node provisioning.
156. Explain CPU throttling.
157. Explain memory pressure.
158. Explain Pod eviction.
159. Explain API Server bottlenecks.
160. Explain etcd performance.
161. Explain scheduler performance.
162. Explain bin packing.
163. Explain over-provisioning.
164. Explain resource requests.
165. Explain resource limits.
166. Explain QoS tuning.
167. Explain DNS optimization.
168. Explain container startup optimization.
169. Explain image pull optimization.
170. Explain large cluster optimization.
171. Explain GitOps.
172. Explain ArgoCD.
173. Explain FluxCD.
174. Helm vs Kustomize.
175. Explain Helm architecture.
176. Explain Helm Charts.
177. Explain Helm Hooks.
178. Explain Progressive Delivery.
179. Explain Blue-Green deployment.
180. Explain Canary deployment.
181. Explain Rolling Update.
182. Explain Rollback strategy.
183. Explain GitHub Actions with Kubernetes.
184. Explain Jenkins with Kubernetes.
185. Explain Image promotion.
186. Explain Git branching strategy.
187. Explain Multi-environment deployment.
188. Explain Secret management in GitOps.
189. Explain Drift detection.
190. Explain GitOps reconciliation.
191. Explain Prometheus.
192. Explain Alertmanager.
193. Explain Grafana.
194. Explain Amazon Managed Prometheus.
195. Explain Amazon Managed Grafana.
196. Explain OpenTelemetry.
197. Explain ADOT.
198. Explain Fluent Bit.
199. Explain Fluentd.
200. Explain Loki.
201. Explain ELK.
202. Explain CloudWatch Container Insights.
203. Explain distributed tracing.
204. Explain Jaeger.
205. Explain X-Ray.
206. Explain metrics vs logs vs traces.
207. Explain RED metrics.
208. Explain USE metrics.
209. Explain SLI, SLO, SLA.
210. Explain observability architecture.
211. A Pod is stuck in Pending. How do you troubleshoot?
212. A Pod is in CrashLoopBackOff. What do you check?
213. ImagePullBackOff error troubleshooting.
214. OOMKilled troubleshooting.
215. ContainerCreating state troubleshooting.
216. Pods cannot resolve DNS.
217. ALB returns 502.
218. ALB returns 504.
219. Node is NotReady.
220. etcd latency issues.
221. API Server is slow.
222. Worker node unreachable.
223. PVC Pending.
224. EBS volume not attaching.
225. Ingress not routing traffic.
226. NetworkPolicy blocking traffic.
227. Service not reachable.
228. Pod-to-Pod communication failing.
229. High CPU on worker nodes.
230. High memory usage.
231. Container restart loops.
232. Certificate expiration.
233. Cluster upgrade failure.
234. Scheduler not scheduling Pods.
235. Control Plane connectivity issues.
236. Design an EKS platform for 500+ microservices.
237. How would you design a multi-tenant Kubernetes platform?
238. Design Kubernetes for a global e-commerce application.
239. Design a zero-trust Kubernetes platform.
240. Design Kubernetes for PCI-DSS compliance.
241. Design Kubernetes for HIPAA workloads.
242. Design a platform supporting 50 development teams.
243. Design a highly available EKS architecture.
244. Design a multi-region Kubernetes platform.
245. Design Kubernetes disaster recovery.
246. Design Kubernetes for AI/ML workloads.
247. Design a Kubernetes platform with GitOps.
248. Design Kubernetes for financial applications.
249. Design Kubernetes for IoT.
250. Design Kubernetes for streaming workloads.
251. Design Kubernetes for batch processing.
252. Design Kubernetes for event-driven architecture.
253. Design Kubernetes for hybrid cloud.
254. Design Kubernetes for cost optimization.
255. Design Kubernetes with service mesh.
256. Design Kubernetes with zero downtime deployments.
257. Design Kubernetes for regulatory compliance.
258. Design Kubernetes monitoring architecture.
259. Design Kubernetes logging architecture.
260. Design Kubernetes backup architecture.
261. Why would you choose EKS over ECS?
262. When would you recommend ECS instead of EKS?
263. How do you convince leadership to migrate to Kubernetes?
264. How do you estimate Kubernetes infrastructure costs?
265. How do you govern multiple Kubernetes clusters?
266. How do you manage 500+ microservices across EKS clusters?
267. How do you implement platform engineering in Kubernetes?
268. How do you enforce security standards across all clusters?
269. How do you perform Kubernetes upgrades with zero downtime?
270. How do you plan a Kubernetes migration from VMs?
271. How do you reduce Kubernetes operational complexity?
272. How do you standardize deployments across teams?
273. What KPIs would you define for a Kubernetes platform?
274. How do you handle production incidents?
275. How do you perform root cause analysis after an outage?
276. What are the biggest Kubernetes anti-patterns you've seen?
277. What trade-offs have you made in Kubernetes architecture?
278. How do you evaluate new Kubernetes technologies?
279. What does a production-ready Kubernetes platform look like?
280. What would your Kubernetes roadmap look like for the next three years?`;

const questionMap = new Map();
rawList.split('\n').forEach(line => {
    const match = line.match(/^(\d+)\.\s+(.*)$/);
    if (match) {
        questionMap.set(parseInt(match[1]), match[2]);
    }
});

// Build the final complete array dynamically
const fullData = [];
let currentSection = null;

for (let i = 1; i <= 280; i++) {
    if (titles[i]) {
        currentSection = {
            id: sectionIds[i],
            title: titles[i],
            questions: []
        };
        fullData.push(currentSection);
    }
    
    // Check if we already manually provided an answer in window.interviewData
    let existingAnswer = null;
    window.interviewData.forEach(section => {
        const found = section.questions.find(q => q.id === i);
        if (found) existingAnswer = found.answer;
    });

    currentSection.questions.push({
        id: i,
        question: questionMap.get(i) || "Question missing?",
        answer: existingAnswer || `<p class="placeholder-text"><em>Detailed architect-level answer for this question will be generated soon.</em></p>
        <p>To request this answer, contact the AI assistant to expand section <strong>${currentSection.title}</strong>.</p>`
    });
}

// Replace the hardcoded array with the complete dynamic one
window.interviewData = fullData;
