const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname);

// Page definitions: filename, title, badge, lead, topics array
const pages = [
    {
        file: 'aws.html',
        activeLink: 'aws',
        title: 'AWS',
        badge: 'AWS',
        lead: 'Core AWS services, Well-Architected Framework, migration, and solutions architecture topics.',
        gradient: '#f97316, #ef4444',
        topics: [
            { id: 'aws-services', title: 'AWS Services for Interviews', diff: 'beginner', time: '~3 min', kw: 'aws services compute storage database network security migration' },
            { id: 'availability-zone', title: 'Availability Zone & Data Center', diff: 'beginner', time: '~1 min', kw: 'availability zone data center AZ high availability' },
            { id: 'rpo-rto', title: 'RPO vs RTO', diff: 'beginner', time: '~2 min', kw: 'rpo rto recovery point time objective disaster recovery' },
            { id: 'well-architected', title: 'AWS Well Architected Framework', diff: 'intermediate', time: '~3 min', kw: 'well architected framework pillars security reliability operational excellence' },
            { id: 'migration', title: 'AWS Migration Tools', diff: 'intermediate', time: '~3 min', kw: 'migration 7rs rehost replatform refactor dms mgn' },
            { id: 'api-gateway-auth', title: 'API Gateway Auth', diff: 'intermediate', time: '~2 min', kw: 'api gateway auth iam cognito lambda authorizer' },
            { id: 'serverless-webapp', title: 'Serverless Web Application', diff: 'beginner', time: '~2 min', kw: 'serverless web application s3 cloudfront lambda dynamodb cognito' },
        ]
    },
    {
        file: 'architecture.html',
        activeLink: 'architecture',
        title: 'Architecture',
        badge: 'Architecture',
        lead: 'Microservices, event-driven systems, three-tier, hybrid cloud, and system design trade-offs.',
        gradient: '#8b5cf6, #6366f1',
        topics: [
            { id: 'microservice-alb', title: 'Microservice with ALB', diff: 'intermediate', time: '~2 min', kw: 'microservice alb load balancer path routing target group' },
            { id: 'event-driven-basic', title: 'Event Driven Architecture (Basic)', diff: 'beginner', time: '~2 min', kw: 'event driven architecture eda sqs lambda api gateway' },
            { id: 'microservice-vs-event', title: 'Microservice vs Event Driven', diff: 'intermediate', time: '~3 min', kw: 'microservice vs event driven sync async comparison' },
            { id: 'event-driven-advanced', title: 'Event Driven Architectures (Advanced)', diff: 'advanced', time: '~3 min', kw: 'event driven advanced eventbridge rules sns fan-out' },
            { id: 'three-tier', title: 'Three-Tier Architecture', diff: 'beginner', time: '~3 min', kw: 'three tier presentation application database layer' },
            { id: 'multi-site-dr', title: 'Multi-site Active Active DR', diff: 'advanced', time: '~2 min', kw: 'multi site active active dr disaster recovery route53' },
            { id: 'hybrid-cloud', title: 'Hybrid Cloud Architecture', diff: 'intermediate', time: '~2 min', kw: 'hybrid cloud direct connect vpn outposts' },
            { id: 'system-design-tradeoffs', title: 'System Design Trade-Offs', diff: 'advanced', time: '~3 min', kw: 'system design tradeoffs cap theorem consistency availability' },
            { id: 'top-designs', title: 'Top 3 Popular Design', diff: 'intermediate', time: '~2 min', kw: 'top popular design patterns interview' },
            { id: 'three-tier-microservice', title: 'Three Tier with Microservice', diff: 'intermediate', time: '~2 min', kw: 'three tier microservice combined pattern' },
            { id: 'monolith-vs-microservice', title: 'Monolith vs Microservice', diff: 'beginner', time: '~2 min', kw: 'monolith vs microservice comparison deployment scaling' },
        ]
    },
    {
        file: 'kubernetes.html',
        activeLink: 'kubernetes',
        title: 'Kubernetes & EKS',
        badge: 'Kubernetes & EKS',
        lead: 'EKS scaling, Karpenter, container lifecycle, and Kubernetes tech stack.',
        gradient: '#326ce5, #2563eb',
        topics: [
            { id: 'k8s-tools', title: 'Kubernetes Tools Landscape', diff: 'beginner', time: '~2 min', kw: 'kubernetes tools landscape ecosystem prometheus grafana' },
            { id: 'scaling-ec2-lambda-eks', title: 'Scaling EC2 vs Lambda vs EKS', diff: 'intermediate', time: '~3 min', kw: 'scaling ec2 lambda eks comparison' },
            { id: 'eks-scaling', title: 'Kubernetes (EKS) Scaling', diff: 'intermediate', time: '~3 min', kw: 'eks scaling hpa vpa keda karpenter cluster autoscaler' },
            { id: 'eks-karpenter', title: 'EKS Upgrade With Karpenter', diff: 'intermediate', time: '~2 min', kw: 'eks upgrade karpenter drift detection ami' },
            { id: 'eks-karpenter-advanced', title: 'EKS Upgrade With Karpenter - Advanced', diff: 'advanced', time: '~3 min', kw: 'karpenter advanced consolidation expiration nodepool' },
            { id: 'container-lifecycle', title: 'Container Lifecycle - Local to Cloud', diff: 'beginner', time: '~2 min', kw: 'container lifecycle docker build push deploy ecr' },
            { id: 'node-pod-container', title: 'Node Pod Container Relationship', diff: 'beginner', time: '~2 min', kw: 'node pod container relationship hierarchy cluster' },
            { id: 'karpenter-saves-money', title: 'How Karpenter Saves Money', diff: 'intermediate', time: '~2 min', kw: 'karpenter saves money cost right sizing bin packing spot' },
            { id: 'eda-kubernetes', title: 'EDA with Kubernetes', diff: 'intermediate', time: '~2 min', kw: 'eda event driven kubernetes keda consumer pods' },
            { id: 'eda-sns-sqs-k8s', title: 'EDA with SNS, SQS, Kubernetes', diff: 'advanced', time: '~2 min', kw: 'eda sns sqs kubernetes fan out filtering' },
            { id: 'eks-auto', title: 'EKS Auto (Re:Invent 2024)', diff: 'intermediate', time: '~2 min', kw: 'eks auto reinvent managed compute networking storage' },
            { id: 'docker-vs-k8s', title: 'Docker vs Kubernetes', diff: 'beginner', time: '~2 min', kw: 'docker vs kubernetes runtime orchestrator comparison' },
            { id: 'pod-sidecar', title: 'Pod Container Sidecar', diff: 'intermediate', time: '~2 min', kw: 'pod sidecar pattern logging proxy envoy istio' },
            { id: 'karpenter-binpack', title: 'Karpenter Bin Pack Granular Control', diff: 'advanced', time: '~2 min', kw: 'karpenter bin pack granular consolidation topology' },
            { id: 'k8s-tech-stack', title: 'Kubernetes Tech Stack', diff: 'intermediate', time: '~2 min', kw: 'kubernetes tech stack ingress service mesh cicd observability' },
        ]
    },
    {
        file: 'genai.html',
        activeLink: 'genai',
        title: 'Gen AI',
        badge: 'Gen AI',
        lead: 'Layers, prompt engineering, RAG, fine-tuning, and multi-model invocation.',
        gradient: '#ec4899, #f43f5e',
        topics: [
            { id: 'genai-layers', title: 'Gen AI Layers', diff: 'beginner', time: '~2 min', kw: 'gen ai layers infrastructure model application bedrock sagemaker' },
            { id: 'prompt-rag-finetuning', title: 'Prompt Engineering vs RAG vs Fine Tuning', diff: 'intermediate', time: '~3 min', kw: 'prompt engineering rag fine tuning comparison' },
            { id: 'rag-bedrock', title: 'RAG with Bedrock', diff: 'intermediate', time: '~3 min', kw: 'rag bedrock retrieval augmented generation vector db embeddings' },
            { id: 'genai-multi-model', title: 'Gen AI Multi Model Invocation', diff: 'advanced', time: '~2 min', kw: 'multi model invocation routing fallback ensemble' },
        ]
    },
    {
        file: 'serverless.html',
        activeLink: 'serverless',
        title: 'Serverless',
        badge: 'Serverless',
        lead: 'Lambda vs EC2, serverless web apps, and transforms.',
        gradient: '#f59e0b, #f97316',
        topics: [
            { id: 'lambda-cheaper', title: 'Lambda Cheaper Than EC2?', diff: 'beginner', time: '~2 min', kw: 'lambda cheaper ec2 cost comparison tco' },
            { id: 'serverless-webapp', title: 'Serverless Web Application', diff: 'beginner', time: '~2 min', kw: 'serverless web application architecture s3 cloudfront' },
            { id: 'lambda-transform', title: 'Lambda Transform', diff: 'intermediate', time: '~2 min', kw: 'lambda transform data pipeline firehose s3 event' },
        ]
    },
    {
        file: 'fundamentals.html',
        activeLink: 'fundamentals',
        title: 'Fundamentals',
        badge: 'Fundamentals',
        lead: 'IP vs URL, what happens when you type a URL, and core concepts.',
        gradient: '#14b8a6, #06b6d4',
        topics: [
            { id: 'ip-vs-url', title: 'IP Address vs URL', diff: 'beginner', time: '~2 min', kw: 'ip address url dns load balancer' },
            { id: 'what-happens-url', title: 'What Happens When You Type a URL', diff: 'beginner', time: '~3 min', kw: 'url dns tcp tls http browser rendering' },
        ]
    },
    {
        file: 'reinvent.html',
        activeLink: 'reinvent',
        title: 'Re:Invent 2024',
        badge: 'Re:Invent 2024',
        lead: 'EKS Auto, Aurora DSQL, S3 Tables, and other AWS announcements.',
        gradient: '#f43f5e, #fb7185',
        topics: [
            { id: 'eks-auto', title: 'EKS Auto (Re:Invent 2024)', diff: 'intermediate', time: '~2 min', kw: 'eks auto reinvent 2024 managed kubernetes' },
            { id: 'aurora-dsql', title: 'Aurora DSQL (Re:Invent 2024)', diff: 'advanced', time: '~2 min', kw: 'aurora dsql distributed sql multi region postgresql' },
            { id: 's3-tables', title: 'S3 Tables (Re:Invent 2024)', diff: 'intermediate', time: '~2 min', kw: 's3 tables iceberg analytics data lakehouse' },
        ]
    },
    {
        file: 'streaming.html',
        activeLink: 'streaming',
        title: 'Streaming',
        badge: 'Streaming',
        lead: 'Live streaming and live streaming with ads.',
        gradient: '#a855f7, #7c3aed',
        topics: [
            { id: 'live-streaming', title: 'Live Streaming', diff: 'intermediate', time: '~2 min', kw: 'live streaming medialive mediapackage cloudfront ivs' },
            { id: 'live-streaming-ads', title: 'Live Streaming with Ads', diff: 'advanced', time: '~2 min', kw: 'live streaming ads ssai mediatailor scte' },
        ]
    },
    {
        file: 'interview.html',
        activeLink: 'interview',
        title: 'Interview & Career',
        badge: 'Interview & Career',
        lead: 'STAR format, platform vs developer team, batch workloads, and career topics.',
        gradient: '#10b981, #059669',
        topics: [
            { id: 'star-format', title: 'STAR Interview Format', diff: 'beginner', time: '~2 min', kw: 'star format situation task action result behavioral' },
            { id: 'platform-vs-developer', title: 'Platform vs Developer Team', diff: 'intermediate', time: '~2 min', kw: 'platform developer team infrastructure cicd' },
            { id: 'batch-workloads', title: 'Running Batch Workloads on AWS', diff: 'intermediate', time: '~2 min', kw: 'batch workloads lambda step functions fargate emr' },
            { id: 'eventbridge-cross-account', title: 'EventBridge Cross Account', diff: 'advanced', time: '~2 min', kw: 'eventbridge cross account event routing multi account' },
            { id: 'microservice-tech-stack', title: 'Microservice Tech Stack', diff: 'intermediate', time: '~2 min', kw: 'microservice tech stack api gateway compute observability' },
            { id: 'principal-sa', title: 'Principal SA (6+ Years)', diff: 'advanced', time: '~1 min', kw: 'principal solutions architect leadership' },
            { id: 'experience', title: '20+ Years of IT Experience', diff: 'beginner', time: '~1 min', kw: 'experience career data center cloud native' },
            { id: 'world-scale', title: 'World-scale Implementations', diff: 'advanced', time: '~1 min', kw: 'world scale global multi region implementations' },
            { id: 'bootcamp', title: 'SA Bootcamp', diff: 'beginner', time: '~1 min', kw: 'sa bootcamp training certification' },
            { id: 'author', title: 'Bestselling Author', diff: 'beginner', time: '~1 min', kw: 'author courses students learning' },
            { id: 'talks', title: 'Conference Talks', diff: 'beginner', time: '~1 min', kw: 'conference talks reinvent summits kubecon' },
            { id: 'linkedin', title: 'LinkedIn Top Voice', diff: 'beginner', time: '~1 min', kw: 'linkedin top voice systems design community' },
        ]
    },
];

const sidebarLinks = [
    { href: 'aws.html', label: 'AWS', count: 7, key: 'aws' },
    { href: 'architecture.html', label: 'Architecture', count: 11, key: 'architecture' },
    { href: 'devops.html', label: 'DevOps &amp; CI/CD', count: 5, key: 'devops' },
    { href: 'kubernetes.html', label: 'Kubernetes &amp; EKS', count: 15, key: 'kubernetes' },
    { href: 'genai.html', label: 'Gen AI', count: 4, key: 'genai' },
    { href: 'serverless.html', label: 'Serverless', count: 3, key: 'serverless' },
    { href: 'fundamentals.html', label: 'Fundamentals', count: 2, key: 'fundamentals' },
    { href: 'reinvent.html', label: 'Re:Invent 2024', count: 3, key: 'reinvent' },
    { href: 'streaming.html', label: 'Streaming', count: 2, key: 'streaming' },
    { href: 'interview.html', label: 'Interview &amp; Career', count: 12, key: 'interview' },
];

const checkSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';

function buildSidebarHTML(activeKey) {
    return sidebarLinks.map(l =>
        `        <a href="${l.href}" class="sidebar-link${l.key === activeKey ? ' active' : ''}">${l.label} <span class="count">${l.count}</span></a>`
    ).join('\n');
}

function buildTocHTML(topics) {
    return topics.map(t =>
        `            <a href="#${t.id}" class="toc-link" data-section="${t.id}"><span class="toc-dot"></span>${t.title}</a>`
    ).join('\n');
}

function buildTopicCards(topics) {
    return topics.map(t => `
          <article id="${t.id}" class="topic-card" data-difficulty="${t.diff}" data-keywords="${t.kw}">
            <div class="topic-card-header" tabindex="0" role="button" aria-expanded="true">
              <div class="topic-meta">
                <span class="difficulty-badge ${t.diff}">${t.diff.charAt(0).toUpperCase() + t.diff.slice(1)}</span>
                <span class="read-time">${t.time}</span>
              </div>
              <h2>${t.title}</h2>
              <button class="review-btn" title="Mark as reviewed" aria-label="Mark ${t.title} as reviewed">${checkSvg}</button>
              <span class="expand-icon" aria-hidden="true"></span>
            </div>
            <div class="topic-card-body">
              <div class="topic-body">
                <p>Detailed content available in the <a href="index.html#${t.id}">main guide</a>. Click to view the full breakdown with diagrams and explanations.</p>
              </div>
            </div>
          </article>`).join('\n');
}

function totalReadTime(topics) {
    let sum = 0;
    topics.forEach(t => { const m = t.time.match(/(\d+)/); if (m) sum += parseInt(m[1]); });
    return '~' + sum;
}

function generatePage(pg) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pg.title} | Cloud Interview Guide</title>
  <meta name="description" content="${pg.lead}" />
  <link rel="stylesheet" href="css/styles.css" />
  <link rel="stylesheet" href="css/devops.css" />
</head>
<body>
  <div class="app-layout">
    <aside class="sidebar" id="sidebar" role="navigation" aria-label="Categories">
      <div class="sidebar-header">
        <a class="sidebar-logo" href="index.html">Cloud Interview Guide</a>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-nav-label">Categories</div>
${buildSidebarHTML(pg.activeLink)}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-progress-label">Study Progress</div>
        <div class="sidebar-progress-bar"><div class="sidebar-progress-fill" id="progressFill"></div></div>
        <div class="sidebar-progress-text" id="progressText">0 / ${pg.topics.length} reviewed</div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" aria-hidden="true"></div>
    <main class="content-area" role="main">
      <div class="topbar">
        <div class="topbar-inner">
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" id="searchInput" placeholder="Search topics…" autocomplete="off" />
          </div>
          <div class="difficulty-filters">
            <button class="filter-chip active" data-filter="all">All</button>
            <button class="filter-chip" data-filter="beginner">🟢 Beginner</button>
            <button class="filter-chip" data-filter="intermediate">🟡 Intermediate</button>
            <button class="filter-chip" data-filter="advanced">🔴 Advanced</button>
          </div>
        </div>
      </div>
      <div class="content-split">
        <aside class="toc-sidebar" id="tocSidebar">
          <div class="toc-title">In This Section</div>
          <nav class="toc-nav" id="tocNav">
${buildTocHTML(pg.topics)}
          </nav>
          <div class="toc-keyboard-hint">
            <kbd>↑</kbd><kbd>↓</kbd> Navigate &nbsp; <kbd>Ctrl+K</kbd> Search
          </div>
        </aside>
        <div class="content-panel">
          <header class="page-hero">
            <div class="hero-badge" style="background:linear-gradient(135deg,${pg.gradient})">${pg.badge}</div>
            <h1>${pg.title} Interview Guide</h1>
            <p class="hero-lead">${pg.lead}</p>
            <div class="hero-stats">
              <div class="stat"><span class="stat-number">${pg.topics.length}</span><span class="stat-label">Topics</span></div>
              <div class="stat"><span class="stat-number">${totalReadTime(pg.topics)}</span><span class="stat-label">Min Read</span></div>
            </div>
          </header>
${buildTopicCards(pg.topics)}
        </div>
      </div>
    </main>
  </div>
  <button type="button" class="sidebar-toggle" id="sidebarToggle" aria-label="Open menu">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
  </button>
  <button type="button" class="scroll-top-btn" id="scrollTopBtn" aria-label="Scroll to top" title="Back to top">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
  </button>
  <script src="js/page.js"></script>
</body>
</html>`;
    const outPath = path.join(BASE, pg.file);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('✅ Generated: ' + pg.file);
}

pages.forEach(generatePage);
console.log('\n🎉 All pages generated!');
