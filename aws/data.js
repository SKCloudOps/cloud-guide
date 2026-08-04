window.interviewData = [
    {
        id: "compute_networking",
        title: "1. Core Compute & Networking",
        questions: [
            { id: 1, question: "Explain the difference between an Application Load Balancer and a Network Load Balancer.", answer: "<p>ALB operates at Layer 7 (HTTP/HTTPS), supports advanced routing based on URLs, headers, and methods, and is ideal for microservices and containers. NLB operates at Layer 4 (TCP/UDP), handles millions of requests per second at ultra-low latency, and is used for high-performance, non-HTTP workloads or when static IPs are required.</p>" },
            { id: 2, question: "How would you design a VPC spanning multiple regions?", answer: "<p>VPCs are region-bound. To span regions, you must create a separate VPC in each region and connect them using VPC Peering (for simple 1:1 connections) or AWS Transit Gateway (for scalable hub-and-spoke connectivity). You can also use AWS Cloud WAN for managed global networks.</p>" },
            { id: 3, question: "What is AWS Global Accelerator?", answer: "<p>Global Accelerator improves the availability and performance of applications with global users. It provides static IP addresses that act as a fixed entry point to applications in single or multiple regions, routing traffic through the AWS global network instead of the public internet to reduce latency.</p>" }
        ]
    },
    {
        id: "storage_databases",
        title: "2. Storage & Databases",
        questions: [
            { id: 4, question: "When would you choose Aurora Global Database over DynamoDB Global Tables?", answer: "<p>Choose Aurora Global Database when you have a strictly relational workload requiring complex SQL joins, ACID transactions, and sub-second cross-region replication (usually for DR or read-scaling). Choose DynamoDB Global Tables for massive scale, NoSQL workloads requiring single-digit millisecond latency for multi-region active-active writes.</p>" },
            { id: 5, question: "Explain S3 storage classes and lifecycle policies.", answer: "<p>S3 offers Standard (frequent access), Intelligent-Tiering (unknown access patterns), Standard-IA (infrequent access), One Zone-IA (recreatable data), Glacier Instant/Flexible/Deep Archive (archival). Lifecycle policies automatically transition objects between these classes or expire them based on age or versioning rules to optimize costs.</p>" }
        ]
    },
    {
        id: "security",
        title: "3. Security, Identity & Compliance",
        questions: [
            { id: 6, question: "How do you secure data at rest and in transit in AWS?", answer: "<p><strong>At Rest:</strong> Use AWS KMS (Key Management Service) to encrypt EBS volumes, S3 buckets, RDS databases, and DynamoDB. <strong>In Transit:</strong> Use TLS/SSL certificates managed by AWS Certificate Manager (ACM) attached to ALBs, CloudFront, or API Gateway. Ensure security groups and NACLs restrict access strictly.</p>" },
            { id: 7, question: "Explain IAM Roles vs Resource-based Policies.", answer: "<p>IAM Roles are identity-based policies attached to a principal (user, service, or resource) defining what they can do. Resource-based policies (like S3 Bucket Policies or KMS Key Policies) are attached directly to the resource, defining who can access it and what actions they can perform, enabling cross-account access easily.</p>" }
        ]
    },
    {
        id: "architecture",
        title: "4. Architecture & Design Patterns",
        questions: [
            { id: 8, question: "Design an event-driven architecture for order processing.", answer: "<p>Use Amazon API Gateway to receive orders, placing them on an SQS queue or EventBridge event bus. AWS Lambda or ECS workers consume the queue to process the order, storing state in DynamoDB. If a downstream service fails, messages are sent to a Dead Letter Queue (DLQ). Use SNS to fan-out notifications (e.g., email service, inventory update).</p>" },
            { id: 9, question: "How do you handle split-brain in a highly available architecture?", answer: "<p>Split-brain occurs when components in different AZs lose connectivity and both assume they are the primary. In AWS, this is handled by using a robust quorum mechanism (e.g., Route 53 health checks, or Zookeeper/etcd in custom setups) ensuring that an odd number of AZs are used for leader election to maintain consensus.</p>" }
        ]
    },
    {
        id: "migration",
        title: "5. Migration & Cost Optimization",
        questions: [
            { id: 10, question: "Explain the 6 R's of Cloud Migration.", answer: "<p>1. <strong>Rehost</strong> (Lift and shift). 2. <strong>Replatform</strong> (Lift, tinker, and shift - e.g., move to RDS). 3. <strong>Repurchase</strong> (Drop and shop - move to SaaS). 4. <strong>Refactor/Rearchitect</strong> (Rewrite for cloud native). 5. <strong>Retire</strong> (Decommission). 6. <strong>Retain</strong> (Do nothing for now).</p>" },
            { id: 11, question: "How would you optimize costs for a massive analytics workload?", answer: "<p>Use Spot Instances for stateless processing nodes (e.g., EMR task nodes). Store data in S3 Intelligent-Tiering instead of EBS. Use AWS Graviton processors for better price/performance. Leverage Compute Savings Plans for baseline workloads. Use AWS Glue/Athena for serverless querying instead of persistent clusters where possible.</p>" }
        ]
    }
];

// Generate placeholders for remaining questions up to 100
const allQuestionsFull = [
    ...Array.from({length: 100}, (_, i) => i + 1)
];

const titles = {
    1: "1. Core Compute & Networking",
    21: "2. Storage & Databases",
    41: "3. Security, Identity & Compliance",
    61: "4. Architecture & Design Patterns",
    81: "5. Migration & Cost Optimization"
};

const sectionIds = {
    1: "compute_networking",
    21: "storage_databases",
    41: "security",
    61: "architecture",
    81: "migration"
};

const fullData = [];
let currentSection = null;

for (let i = 1; i <= 100; i++) {
    if (titles[i]) {
        currentSection = {
            id: sectionIds[i],
            title: titles[i],
            questions: []
        };
        fullData.push(currentSection);
    }
    
    let existingAnswer = null;
    let existingQuestion = null;
    window.interviewData.forEach(section => {
        const found = section.questions.find(q => q.id === i);
        if (found) {
            existingAnswer = found.answer;
            existingQuestion = found.question;
        }
    });

    currentSection.questions.push({
        id: i,
        question: existingQuestion || `AWS Solutions Architect Question ${i}`,
        answer: existingAnswer || `<p class="placeholder-text"><em>Detailed architect-level answer for this question will be generated soon.</em></p>
        <p>To request this answer, contact the AI assistant to expand section <strong>${currentSection.title}</strong>.</p>`
    });
}

window.interviewData = fullData;
