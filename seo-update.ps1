$base = "https://skcloudops.github.io/cloud-guide"
$today = "2026-03-06"
$orgName = "SKCloudOps"
$siteName = "Cloud Interview Guide"

# Per-page metadata: title, breadcrumb group, og-image asset, article tags, teaches, about array, schema type
$pages = @{
  "architecture.html" = @{
    pageTitle    = "Cloud Architecture Patterns Guide"
    group        = "Architecture & Ops"
    groupUrl     = "$base/"
    image        = "$base/assets/architecture-top-3-designs.png"
    imageAlt     = "Cloud Architecture Patterns - Three-Tier, Microservices, Event-Driven"
    articleTags  = "cloud architecture,microservices,event-driven architecture,three-tier,disaster recovery,system design"
    teaches      = "Cloud architecture patterns including three-tier, microservices, event-driven, serverless, and disaster recovery"
    about        = '"Cloud Architecture","Microservices","Event-Driven Architecture","AWS Well-Architected","Disaster Recovery"'
    schemaType   = "TechArticle"
    description  = "Deep dive into cloud architecture patterns for solutions architect interviews. Three-tier, microservices, event-driven, serverless architectures, disaster recovery strategies, and system design trade-offs."
  }
  "aws.html" = @{
    pageTitle    = "AWS Core Services Guide"
    group        = "Foundations"
    groupUrl     = "$base/"
    image        = "$base/assets/aws-well-architected.png"
    imageAlt     = "AWS Well-Architected Framework Overview"
    articleTags  = "AWS Well-Architected,AWS migration 7Rs,AWS global infrastructure,AWS solutions architect"
    teaches      = "AWS Well-Architected Framework pillars, migration strategies (7 Rs), global infrastructure, and API Gateway authentication"
    about        = '"AWS","Well-Architected Framework","Cloud Migration","AWS Global Infrastructure"'
    schemaType   = "TechArticle"
    description  = "Core AWS services guide for solutions architect interviews. AWS Well-Architected Framework, migration strategies (7 Rs), global infrastructure, API Gateway authentication, and serverless patterns."
  }
  "compute.html" = @{
    pageTitle    = "AWS Compute Services Guide"
    group        = "Infrastructure"
    groupUrl     = "$base/"
    image        = "$base/assets/compute-overview.png"
    imageAlt     = "AWS Compute Services - EC2, ECS, EKS, Lambda Overview"
    articleTags  = "AWS EC2,Auto Scaling,AWS Lambda,ECS,EKS,container orchestration"
    teaches      = "EC2 instance types, Auto Scaling strategies, load balancers, ECS vs EKS, Lambda compute"
    about        = '"AWS EC2","Auto Scaling","AWS Lambda","Amazon ECS","Amazon EKS","Load Balancing"'
    schemaType   = "TechArticle"
    description  = "Complete AWS compute services guide for architect interviews. EC2 instance families, Auto Scaling groups, load balancing, ECS vs EKS container orchestration, and Lambda compute patterns."
  }
  "cost.html" = @{
    pageTitle    = "AWS Cost Optimization Guide"
    group        = "Architecture & Ops"
    groupUrl     = "$base/"
    image        = "$base/assets/aws-well-architected.png"
    imageAlt     = "AWS Cost Optimization - Reserved Instances, Savings Plans, FinOps"
    articleTags  = "AWS cost optimization,Reserved Instances,Savings Plans,FinOps,right-sizing,Spot Instances"
    teaches      = "AWS pricing models, Reserved Instances vs Savings Plans, Spot Instance strategies, right-sizing, FinOps governance"
    about        = '"AWS Cost Optimization","FinOps","Reserved Instances","AWS Savings Plans","Cloud Economics"'
    schemaType   = "TechArticle"
    description  = "Master AWS cost optimization for architect interviews. Pricing models (On-Demand, Reserved, Spot, Savings Plans), right-sizing strategies, FinOps governance, and cost-efficient architecture patterns."
  }
  "databases.html" = @{
    pageTitle    = "AWS Database Services Guide"
    group        = "App Services"
    groupUrl     = "$base/"
    image        = "$base/assets/databases-overview.png"
    imageAlt     = "AWS Database Services - RDS, Aurora, DynamoDB, ElastiCache"
    articleTags  = "AWS RDS,Aurora,DynamoDB,ElastiCache,Redis,database migration,NoSQL"
    teaches      = "RDS vs Aurora differences, DynamoDB design patterns, ElastiCache caching strategies, database migration with DMS"
    about        = '"Amazon RDS","Amazon Aurora","Amazon DynamoDB","ElastiCache","Database Migration","NoSQL"'
    schemaType   = "TechArticle"
    description  = "Complete guide to AWS database services for architect interviews. RDS vs Aurora comparison, DynamoDB design patterns, caching strategies with ElastiCache, and database migration with DMS."
  }
  "devops.html" = @{
    pageTitle    = "DevOps & CI/CD Guide"
    group        = "Architecture & Ops"
    groupUrl     = "$base/"
    image        = "$base/assets/devops-architecture.png"
    imageAlt     = "DevOps and CI/CD Pipeline Architecture"
    articleTags  = "DevOps,CI/CD pipeline,GitOps,DevSecOps,Git workflow,AWS CodePipeline,infrastructure as code"
    teaches      = "CI vs CD principles, pipeline architecture, Git branching strategies, GitOps with ArgoCD, DevSecOps practices"
    about        = '"DevOps","CI/CD","GitOps","DevSecOps","Infrastructure as Code","AWS CodePipeline"'
    schemaType   = "TechArticle"
    description  = "Enterprise DevOps and CI/CD guide for architect interviews. CI vs CD deep dive, pipeline architecture, Git workflow strategies, GitOps principles, and DevSecOps implementation."
  }
  "fundamentals.html" = @{
    pageTitle    = "Cloud Computing Fundamentals"
    group        = "Foundations"
    groupUrl     = "$base/"
    image        = "$base/assets/fundamentals-ip-vs-url.png"
    imageAlt     = "Cloud Computing Fundamentals - Networking, DNS, HTTP"
    articleTags  = "cloud fundamentals,DNS,HTTP,IP addressing,networking basics,TCP/IP,load balancing"
    teaches      = "Networking fundamentals, DNS resolution, HTTP protocols, IP addressing, and foundational cloud concepts"
    about        = '"Cloud Computing","DNS","HTTP","Networking","IP Addressing","TCP/IP"'
    schemaType   = "TechArticle"
    description  = "Essential cloud computing fundamentals for architect interviews. Networking basics, DNS resolution, HTTP protocols, IP addressing, and foundational concepts every cloud architect must know."
  }
  "genai.html" = @{
    pageTitle    = "Generative AI on AWS Guide"
    group        = "App Services"
    groupUrl     = "$base/"
    image        = "$base/assets/aws-serverless-webapp.png"
    imageAlt     = "Generative AI on AWS - Bedrock, SageMaker, RAG Architecture"
    articleTags  = "AWS Bedrock,SageMaker,generative AI,RAG,prompt engineering,LLM,enterprise AI"
    teaches      = "Amazon Bedrock capabilities, SageMaker for ML, RAG architecture patterns, prompt engineering techniques"
    about        = '"Amazon Bedrock","Amazon SageMaker","Generative AI","RAG Architecture","Prompt Engineering","LLM"'
    schemaType   = "TechArticle"
    description  = "Generative AI on AWS guide for architect interviews. Amazon Bedrock, SageMaker, RAG architecture patterns, prompt engineering, and enterprise AI implementation strategies."
  }
  "interview.html" = @{
    pageTitle    = "Cloud Architect Interview Questions & Career Guide"
    group        = "Foundations"
    groupUrl     = "$base/"
    image        = "$base/assets/architecture-top-3-designs.png"
    imageAlt     = "Cloud Architect Interview Preparation - Behavioral and Technical Questions"
    articleTags  = "cloud architect interview,STAR method,system design,behavioral questions,salary negotiation,career path"
    teaches      = "Behavioral interview techniques with STAR method, technical scenario walkthroughs, system design approaches, salary negotiation strategies"
    about        = '"Cloud Architect","Interview Preparation","STAR Method","System Design","Career Development"'
    schemaType   = "TechArticle"
    description  = "Complete cloud architect interview preparation. Behavioral questions (STAR method), technical scenario walkthroughs, system design approaches, salary negotiation, and career advancement strategies."
  }
  "kubernetes.html" = @{
    pageTitle    = "Kubernetes & EKS Guide"
    group        = "Architecture & Ops"
    groupUrl     = "$base/"
    image        = "$base/assets/compute-overview.png"
    imageAlt     = "Kubernetes and Amazon EKS Architecture - Networking, Scaling, RBAC"
    articleTags  = "Kubernetes,Amazon EKS,K8s architecture,HPA,VPA,KEDA,service mesh,Kubernetes RBAC"
    teaches      = "Kubernetes architecture, pod networking, HPA/VPA/KEDA autoscaling, service mesh, RBAC, EKS production patterns"
    about        = '"Kubernetes","Amazon EKS","Container Orchestration","Service Mesh","Autoscaling","RBAC"'
    schemaType   = "TechArticle"
    description  = "Complete Kubernetes and Amazon EKS guide for architect interviews. K8s architecture, pod networking, service mesh, autoscaling (HPA/VPA/KEDA), RBAC, and production best practices."
  }
  "networking.html" = @{
    pageTitle    = "AWS Networking & VPC Guide"
    group        = "Infrastructure"
    groupUrl     = "$base/"
    image        = "$base/assets/networking-vpc-design.png"
    imageAlt     = "AWS Networking and VPC Design - Subnets, Security Groups, Route 53"
    articleTags  = "AWS VPC,subnets,security groups,NACLs,Route 53,Transit Gateway,VPN,Direct Connect"
    teaches      = "VPC design, subnet architecture, security groups vs NACLs, Route 53 routing policies, hybrid connectivity"
    about        = '"Amazon VPC","AWS Networking","Route 53","Transit Gateway","Security Groups","Direct Connect"'
    schemaType   = "TechArticle"
    description  = "Comprehensive AWS networking and VPC guide for solutions architect interviews. VPC design patterns, subnet architecture, security groups vs NACLs, Route 53 routing, and hybrid connectivity."
  }
  "reinvent.html" = @{
    pageTitle    = "AWS re:Invent 2024 Highlights"
    group        = "Foundations"
    groupUrl     = "$base/"
    image        = "$base/assets/aws-global-infrastructure.png"
    imageAlt     = "AWS re:Invent 2024 - New Services and Announcements"
    articleTags  = "AWS re:Invent 2024,AWS new services,AWS announcements,cloud architecture trends"
    teaches      = "Key AWS re:Invent 2024 service launches, feature updates, and strategic architecture implications"
    about        = '"AWS re:Invent","AWS New Services","Cloud Computing Trends","AWS 2024"'
    schemaType   = "TechArticle"
    description  = "Key AWS re:Invent 2024 announcements for architect interviews. New services, feature updates, and strategic insights that impact cloud architecture decisions."
  }
  "security.html" = @{
    pageTitle    = "AWS Security & IAM Guide"
    group        = "Infrastructure"
    groupUrl     = "$base/"
    image        = "$base/assets/security-iam-overview.png"
    imageAlt     = "AWS Security and IAM Overview - Policies, KMS, WAF, GuardDuty"
    articleTags  = "AWS IAM,KMS,WAF,GuardDuty,AWS Security Hub,zero trust,encryption,IAM policies"
    teaches      = "IAM policies and roles, KMS encryption, WAF and Shield protection, GuardDuty threat detection, zero trust architecture"
    about        = '"AWS IAM","AWS KMS","AWS WAF","Amazon GuardDuty","Cloud Security","Zero Trust"'
    schemaType   = "TechArticle"
    description  = "Complete AWS security and IAM guide for architect interviews. IAM policies, KMS encryption, WAF and Shield, GuardDuty threat detection, and zero trust security architecture."
  }
  "serverless.html" = @{
    pageTitle    = "AWS Serverless Guide"
    group        = "App Services"
    groupUrl     = "$base/"
    image        = "$base/assets/aws-serverless-webapp.png"
    imageAlt     = "AWS Serverless Architecture - Lambda, API Gateway, Step Functions"
    articleTags  = "AWS Lambda,API Gateway,Step Functions,EventBridge,serverless architecture,cold start,concurrency"
    teaches      = "Lambda internals and performance, API Gateway patterns, Step Functions orchestration, EventBridge routing, serverless design patterns"
    about        = '"AWS Lambda","Amazon API Gateway","AWS Step Functions","Amazon EventBridge","Serverless Architecture"'
    schemaType   = "TechArticle"
    description  = "Serverless architecture guide for AWS architect interviews. Lambda internals, Step Functions orchestration, EventBridge event routing, cold starts, concurrency, VPC, and serverless design patterns."
  }
  "storage.html" = @{
    pageTitle    = "AWS Storage Services Guide"
    group        = "Infrastructure"
    groupUrl     = "$base/"
    image        = "$base/assets/architecture-top-3-designs.png"
    imageAlt     = "AWS Storage Services - S3, EBS, EFS, FSx Comparison"
    articleTags  = "AWS S3,EBS,EFS,FSx,S3 storage classes,AWS Backup,data transfer,Storage Gateway"
    teaches      = "S3 storage classes and lifecycle policies, EBS vs EFS vs FSx selection, data transfer solutions, backup strategies"
    about        = '"Amazon S3","Amazon EBS","Amazon EFS","AWS FSx","AWS Backup","Cloud Storage"'
    schemaType   = "TechArticle"
    description  = "Master AWS storage for architect interviews. S3 storage classes and lifecycle, EBS vs EFS vs FSx comparison, data transfer solutions, and backup & disaster recovery strategies."
  }
  "streaming.html" = @{
    pageTitle    = "AWS Streaming & Analytics Guide"
    group        = "App Services"
    groupUrl     = "$base/"
    image        = "$base/assets/architecture-eda-advanced.png"
    imageAlt     = "AWS Streaming - Kinesis, MSK Kafka, Real-Time Analytics"
    articleTags  = "AWS Kinesis,Amazon MSK,Kafka,real-time streaming,event-driven architecture,data streaming"
    teaches      = "Kinesis Data Streams vs MSK, real-time processing patterns, event-driven streaming architectures"
    about        = '"Amazon Kinesis","Amazon MSK","Apache Kafka","Real-Time Streaming","Event-Driven Architecture"'
    schemaType   = "TechArticle"
    description  = "AWS streaming and real-time analytics guide for architect interviews. Kinesis Data Streams, MSK (Kafka), event-driven patterns, and real-time data processing architectures."
  }
}

$faviconTag  = '  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">'
$themeColor  = '  <meta name="theme-color" content="#0f172a">'

foreach ($file in $pages.Keys) {
  $path = "c:\Sathish\me-new\cloud-guide\$file"
  $p    = $pages[$file]
  $url  = "$base/$file"

  $c = Get-Content $path -Raw

  # 1. Fix og:image to use real asset
  $oldImage = 'https://skcloudops.github.io/cloud-guide/assets/og-image.png'
  $c = $c -replace [regex]::Escape($oldImage), $p.image

  # 2. Add og:image:alt after the last og:image meta
  if ($c -notmatch 'og:image:alt') {
    $c = $c -replace '(<meta property="og:image"[^/]*/?>)', "`$1`n    <meta property=`"og:image:alt`" content=`"$($p.imageAlt)`" />"
  }

  # 3. Add Twitter image:alt
  if ($c -notmatch 'twitter:image:alt') {
    $c = $c -replace '(<meta name="twitter:image"[^/]*/?>)', "`$1`n    <meta name=`"twitter:image:alt`" content=`"$($p.imageAlt)`" />"
  }

  # 4. Add article:section and article:tag after og:type
  if ($c -notmatch 'article:section') {
    $c = $c -replace '(<meta property="og:type"[^/]*/?>)', "`$1`n    <meta property=`"article:section`" content=`"$($p.group)`" />`n    <meta property=`"article:tag`" content=`"$($p.articleTags)`" />"
  }

  # 5. Add favicon + theme-color before </head>
  if ($c -notmatch 'rel="icon"') {
    $c = $c -replace '(</head>)', "$faviconTag`n$themeColor`n`$1"
  }

  # 6. Add JSON-LD structured data before </head>
  if ($c -notmatch 'application/ld\+json') {
    $aboutItems = ($p.about -split '","' | ForEach-Object {
      $name = $_ -replace '^"', '' -replace '"$', ''
      "    {`"@type`":`"Thing`",`"name`":`"$name`"}"
    }) -join ",`n"

    $jsonld = @"
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "$($p.schemaType)",
        "headline": "$($p.pageTitle)",
        "description": "$($p.description)",
        "url": "$url",
        "image": "$($p.image)",
        "author": {"@type": "Organization", "name": "$orgName", "url": "$base/"},
        "publisher": {
          "@type": "Organization",
          "name": "$orgName",
          "url": "$base/",
          "logo": {"@type": "ImageObject", "url": "$base/assets/favicon.svg"}
        },
        "dateModified": "$today",
        "inLanguage": "en-US",
        "teaches": "$($p.teaches)",
        "educationalLevel": "Intermediate",
        "about": [
$aboutItems
        ],
        "isPartOf": {"@type": "WebSite", "name": "$siteName", "url": "$base/"}
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "$siteName", "item": "$base/"},
          {"@type": "ListItem", "position": 2, "name": "$($p.group)", "item": "$base/"},
          {"@type": "ListItem", "position": 3, "name": "$($p.pageTitle)", "item": "$url"}
        ]
      }
    ]
  }
  </script>
"@
    $c = $c -replace '(</head>)', "$jsonld`$1"
  }

  Set-Content $path $c -NoNewline
  Write-Host "Updated: $file"
}

Write-Host "`nAll content pages updated."
