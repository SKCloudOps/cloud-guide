const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://skcloudops.github.io/cloud-guide';

// SEO data for each page
const seoData = {
    'index.html': {
        title: 'Cloud Interview Guide | Solutions Architect Preparation for AWS, Azure & GCP',
        description: 'Comprehensive cloud architect interview preparation covering 16 domains: AWS services, architecture patterns, Kubernetes, DevOps, security, networking, databases, serverless, and more. 100+ curated topics for Solutions Architect roles.',
        keywords: 'cloud interview guide, AWS solutions architect, cloud architect interview preparation, AWS interview questions, cloud computing study guide, solutions architect preparation, AWS certification, cloud engineering interview',
        canonical: '',
        ogType: 'website',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Cloud Interview Guide",
            "url": BASE_URL,
            "description": "Comprehensive cloud architect interview preparation hub covering 16 domains with 100+ curated topics.",
            "potentialAction": {
                "@type": "SearchAction",
                "target": BASE_URL + "/?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
    },
    'compute.html': {
        title: 'AWS Compute Services Guide | EC2, ECS, EKS, Lambda, Auto Scaling - Interview Prep',
        description: 'Master AWS compute services for architect interviews. Deep dive into EC2 instance types, ECS vs EKS vs Lambda decision framework, Auto Scaling policies, ALB vs NLB comparison, and placement groups.',
        keywords: 'AWS EC2 instance types, ECS vs EKS vs Lambda, AWS Auto Scaling, ALB vs NLB, placement groups, AWS compute services, Fargate, App Runner, Graviton',
        canonical: 'compute.html'
    },
    'databases.html': {
        title: 'AWS Database Services Guide | RDS, Aurora, DynamoDB, ElastiCache - Interview Prep',
        description: 'Complete guide to AWS database services for architect interviews. RDS vs Aurora comparison, DynamoDB design patterns, caching strategies with ElastiCache, and database migration with DMS.',
        keywords: 'AWS RDS vs Aurora, DynamoDB design patterns, ElastiCache Redis, AWS database migration DMS, NoSQL vs SQL AWS, database selection, AWS architect interview',
        canonical: 'databases.html'
    },
    'networking.html': {
        title: 'AWS Networking & VPC Guide | Subnets, Security Groups, Route 53 - Interview Prep',
        description: 'Expert-level AWS networking guide for architect interviews. VPC design, public vs private subnets, Security Groups vs NACLs, hybrid connectivity with Direct Connect, Route 53 routing, and PrivateLink.',
        keywords: 'AWS VPC design, Security Groups vs NACLs, AWS Direct Connect, Route 53, AWS PrivateLink, VPC peering, Transit Gateway, hybrid cloud networking',
        canonical: 'networking.html'
    },
    'security.html': {
        title: 'AWS Security & IAM Guide | Policies, KMS, WAF, GuardDuty - Interview Prep',
        description: 'Comprehensive AWS security guide for architect interviews. IAM policies and roles, cross-account access, KMS encryption, WAF & Shield, GuardDuty threat detection, and Zero Trust architecture.',
        keywords: 'AWS IAM policies, KMS encryption, AWS WAF Shield, GuardDuty, AWS security interview questions, Zero Trust AWS, cross-account access, AWS security best practices',
        canonical: 'security.html'
    },
    'storage.html': {
        title: 'AWS Storage Services Guide | S3, EBS, EFS, FSx - Interview Prep',
        description: 'Master AWS storage for architect interviews. S3 storage classes and lifecycle, EBS vs EFS vs FSx comparison, data transfer solutions, and backup & disaster recovery strategies.',
        keywords: 'AWS S3 storage classes, EBS vs EFS vs FSx, AWS Storage Gateway, S3 lifecycle policies, AWS Backup, data transfer, AWS storage interview questions',
        canonical: 'storage.html'
    },
    'architecture.html': {
        title: 'Cloud Architecture Patterns Guide | Three-Tier, Microservices, Event-Driven - Interview Prep',
        description: 'Deep dive into cloud architecture patterns for solutions architect interviews. Three-tier, microservices, event-driven, serverless architectures, disaster recovery strategies, and system design trade-offs.',
        keywords: 'cloud architecture patterns, microservices vs monolith, event-driven architecture, AWS Well-Architected, disaster recovery, system design interview, three-tier architecture',
        canonical: 'architecture.html'
    },
    'devops.html': {
        title: 'DevOps & CI/CD Guide | Pipeline Design, GitOps, DevSecOps - Interview Prep',
        description: 'Enterprise DevOps and CI/CD guide for architect interviews. CI vs CD deep dive, pipeline architecture, Git workflow strategies, GitOps principles, and DevSecOps implementation.',
        keywords: 'DevOps interview questions, CI/CD pipeline design, GitOps, DevSecOps, Git workflow strategies, AWS CodePipeline, continuous deployment, infrastructure as code',
        canonical: 'devops.html'
    },
    'kubernetes.html': {
        title: 'Kubernetes & EKS Guide | Architecture, Networking, Scaling - Interview Prep',
        description: 'Complete Kubernetes and Amazon EKS guide for architect interviews. K8s architecture, pod networking, service mesh, autoscaling (HPA/VPA/KEDA), RBAC, and production best practices.',
        keywords: 'Kubernetes interview questions, Amazon EKS, K8s architecture, pod networking, HPA VPA KEDA, service mesh, Kubernetes RBAC, EKS Auto Mode',
        canonical: 'kubernetes.html'
    },
    'serverless.html': {
        title: 'AWS Serverless Guide | Lambda, API Gateway, Step Functions - Interview Prep',
        description: 'Serverless architecture guide for AWS architect interviews. Lambda best practices, API Gateway authentication, Step Functions orchestration, and serverless design patterns.',
        keywords: 'AWS Lambda interview questions, API Gateway, Step Functions, serverless architecture, serverless design patterns, Lambda cold start, event-driven serverless',
        canonical: 'serverless.html'
    },
    'genai.html': {
        title: 'Generative AI on AWS Guide | Bedrock, SageMaker, RAG Patterns - Interview Prep',
        description: 'Generative AI on AWS guide for architect interviews. Amazon Bedrock, SageMaker, RAG architecture patterns, prompt engineering, and enterprise AI implementation strategies.',
        keywords: 'AWS Bedrock, SageMaker, Generative AI architecture, RAG pattern, prompt engineering, AI interview questions, enterprise AI, LLM deployment AWS',
        canonical: 'genai.html'
    },
    'cost.html': {
        title: 'AWS Cost Optimization Guide | Pricing Models, FinOps, Right-Sizing - Interview Prep',
        description: 'Master AWS cost optimization for architect interviews. Pricing models (On-Demand, Reserved, Spot, Savings Plans), right-sizing strategies, FinOps governance, and cost-efficient architecture patterns.',
        keywords: 'AWS cost optimization, Reserved Instances vs Savings Plans, AWS Spot Instances, FinOps, right-sizing, AWS Cost Explorer, cost-efficient architecture, cloud economics',
        canonical: 'cost.html'
    },
    'aws.html': {
        title: 'AWS Core Services Guide | Well-Architected, Migration, Global Infrastructure - Interview Prep',
        description: 'Core AWS services guide for solutions architect interviews. AWS Well-Architected Framework, migration strategies (7 Rs), global infrastructure, API Gateway authentication, and serverless patterns.',
        keywords: 'AWS Well-Architected Framework, AWS migration 7 Rs, AWS global infrastructure, API Gateway authentication, AWS solutions architect, core AWS services',
        canonical: 'aws.html'
    },
    'interview.html': {
        title: 'Cloud Architect Interview Questions & Career Guide | Behavioral & Technical Prep',
        description: 'Complete cloud architect interview preparation. Behavioral questions (STAR method), technical scenario walkthroughs, system design approaches, salary negotiation, and career advancement strategies.',
        keywords: 'cloud architect interview questions, STAR method, system design interview, solutions architect behavioral questions, cloud salary negotiation, architect career path',
        canonical: 'interview.html'
    },
    'fundamentals.html': {
        title: 'Cloud Computing Fundamentals | Networking, DNS, HTTP - Interview Prep',
        description: 'Essential cloud computing fundamentals for architect interviews. Networking basics, DNS resolution, HTTP protocols, IP addressing, and foundational concepts every cloud architect must know.',
        keywords: 'cloud computing fundamentals, DNS resolution, HTTP protocol, IP addressing, networking basics, cloud architect fundamentals, TCP/IP, load balancing basics',
        canonical: 'fundamentals.html'
    },
    'reinvent.html': {
        title: 'AWS re:Invent 2024 Highlights | New Services & Announcements - Interview Prep',
        description: 'Key AWS re:Invent 2024 announcements for architect interviews. New services, feature updates, and strategic insights that impact cloud architecture decisions.',
        keywords: 'AWS re:Invent 2024, AWS new services 2024, AWS announcements, re:Invent highlights, AWS roadmap, cloud architecture trends 2024',
        canonical: 'reinvent.html'
    },
    'streaming.html': {
        title: 'AWS Streaming & Analytics Guide | Kinesis, MSK, Event-Driven - Interview Prep',
        description: 'AWS streaming and real-time analytics guide for architect interviews. Kinesis Data Streams, MSK (Kafka), event-driven patterns, and real-time data processing architectures.',
        keywords: 'AWS Kinesis, Amazon MSK, real-time streaming, event-driven architecture, Kafka on AWS, data streaming, real-time analytics AWS',
        canonical: 'streaming.html'
    }
};

const files = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.html') && f !== 'src.html');

console.log('SEO update for', files.length, 'files');

files.forEach(file => {
    const data = seoData[file];
    if (!data) {
        console.log(`SKIP: ${file} - no SEO data`);
        return;
    }

    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const canonical = data.canonical ? `${BASE_URL}/${data.canonical}` : BASE_URL;

    // Build meta tags to inject
    const seoTags = `
    <meta name="keywords" content="${data.keywords}" />
    <meta name="author" content="SKCloudOps" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph -->
    <meta property="og:type" content="${data.ogType || 'article'}" />
    <meta property="og:title" content="${data.title}" />
    <meta property="og:description" content="${data.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Cloud Interview Guide" />
    <meta property="og:image" content="${BASE_URL}/assets/og-image.png" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${data.title}" />
    <meta name="twitter:description" content="${data.description}" />
    <meta name="twitter:image" content="${BASE_URL}/assets/og-image.png" />`;

    // Update <title>
    content = content.replace(/<title>[^<]*<\/title>/, `<title>${data.title}</title>`);

    // Update meta description
    if (content.includes('meta name="description"')) {
        content = content.replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${data.description}" />`
        );
    } else {
        // Add description after title
        content = content.replace('</title>', `</title>\n    <meta name="description" content="${data.description}" />`);
    }

    // Inject SEO tags before </head> (only if not already done)
    if (!content.includes('og:title')) {
        content = content.replace('</head>', `${seoTags}\n</head>`);
    }

    // Add JSON-LD schema for index page
    if (file === 'index.html' && data.schema && !content.includes('schema.org')) {
        const schemaTag = `\n    <script type="application/ld+json">${JSON.stringify(data.schema, null, 2)}</script>`;
        content = content.replace('</head>', `${schemaTag}\n</head>`);
    }

    // Add lang attribute if missing
    if (!content.includes('lang="en"')) {
        content = content.replace('<html>', '<html lang="en">');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`SEO: ${file}`);
});

console.log('\nDone! All pages updated with SEO meta tags.');
