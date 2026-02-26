const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname);
const indexHtml = fs.readFileSync(path.join(BASE, 'index.html'), 'utf8');

// Config for each page (excluding devops — already done)
const pageConfig = [
    { file: 'aws.html', sectionId: 'content-aws', activeLink: 'aws', title: 'AWS', badge: 'AWS', lead: 'Core AWS services, Well-Architected Framework, migration, and solutions architecture topics.', gradient: '#f97316, #ef4444' },
    { file: 'architecture.html', sectionId: 'content-architecture', activeLink: 'architecture', title: 'Architecture', badge: 'Architecture', lead: 'Microservices, event-driven systems, three-tier, hybrid cloud, and system design trade-offs.', gradient: '#8b5cf6, #6366f1' },
    { file: 'kubernetes.html', sectionId: 'content-kubernetes', activeLink: 'kubernetes', title: 'Kubernetes &amp; EKS', badge: 'Kubernetes &amp; EKS', lead: 'EKS scaling, Karpenter, container lifecycle, and Kubernetes tech stack.', gradient: '#326ce5, #2563eb' },
    { file: 'genai.html', sectionId: 'content-genai', activeLink: 'genai', title: 'Gen AI', badge: 'Gen AI', lead: 'Layers, prompt engineering, RAG, fine-tuning, and multi-model invocation.', gradient: '#ec4899, #f43f5e' },
    { file: 'serverless.html', sectionId: 'content-serverless', activeLink: 'serverless', title: 'Serverless', badge: 'Serverless', lead: 'Lambda vs EC2, serverless web apps, and transforms.', gradient: '#f59e0b, #f97316' },
    { file: 'fundamentals.html', sectionId: 'content-fundamentals', activeLink: 'fundamentals', title: 'Fundamentals', badge: 'Fundamentals', lead: 'IP vs URL, what happens when you type a URL, and core concepts.', gradient: '#14b8a6, #06b6d4' },
    { file: 'reinvent.html', sectionId: 'content-reinvent', activeLink: 'reinvent', title: 'Re:Invent 2024', badge: 'Re:Invent 2024', lead: 'EKS Auto, Aurora DSQL, S3 Tables, and other AWS announcements.', gradient: '#f43f5e, #fb7185' },
    { file: 'streaming.html', sectionId: 'content-streaming', activeLink: 'streaming', title: 'Streaming', badge: 'Streaming', lead: 'Live streaming and live streaming with ads.', gradient: '#a855f7, #7c3aed' },
    { file: 'interview.html', sectionId: 'content-interview', activeLink: 'interview', title: 'Interview &amp; Career', badge: 'Interview &amp; Career', lead: 'STAR format, platform vs developer team, batch workloads, and career topics.', gradient: '#10b981, #059669' },
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

// Difficulty mapping for topics
const difficultyMap = {
    'aws-services': 'beginner', 'availability-zone': 'beginner', 'rpo-rto': 'beginner',
    'well-architected': 'intermediate', 'migration': 'intermediate', 'api-gateway-auth': 'intermediate',
    'serverless-webapp': 'beginner',
    'microservice-alb': 'intermediate', 'event-driven-basic': 'beginner', 'microservice-vs-event': 'intermediate',
    'event-driven-advanced': 'advanced', 'three-tier': 'beginner', 'multi-site-dr': 'advanced',
    'hybrid-cloud': 'intermediate', 'system-design-tradeoffs': 'advanced', 'top-designs': 'intermediate',
    'three-tier-microservice': 'intermediate', 'monolith-vs-microservice': 'beginner',
    'k8s-tools': 'beginner', 'scaling-ec2-lambda-eks': 'intermediate', 'eks-scaling': 'intermediate',
    'eks-karpenter': 'intermediate', 'eks-karpenter-advanced': 'advanced',
    'container-lifecycle': 'beginner', 'node-pod-container': 'beginner', 'karpenter-saves-money': 'intermediate',
    'eda-kubernetes': 'intermediate', 'eda-sns-sqs-k8s': 'advanced', 'eks-auto': 'intermediate',
    'docker-vs-k8s': 'beginner', 'pod-sidecar': 'intermediate', 'karpenter-binpack': 'advanced',
    'k8s-tech-stack': 'intermediate',
    'genai-layers': 'beginner', 'prompt-rag-finetuning': 'intermediate', 'rag-bedrock': 'intermediate',
    'genai-multi-model': 'advanced',
    'lambda-cheaper': 'beginner', 'serverless-webapp-sls': 'beginner', 'lambda-transform': 'intermediate',
    'ip-vs-url': 'beginner', 'what-happens-url': 'beginner',
    'eks-auto-reinvent': 'intermediate', 'aurora-dsql': 'advanced', 's3-tables': 'intermediate',
    'live-streaming': 'intermediate', 'live-streaming-ads': 'advanced',
    'star-format': 'beginner', 'platform-vs-developer': 'intermediate', 'batch-workloads': 'intermediate',
    'eventbridge-cross-account': 'advanced', 'microservice-tech-stack': 'intermediate',
    'principal-sa': 'advanced', 'experience': 'beginner', 'world-scale': 'advanced',
    'bootcamp': 'beginner', 'author': 'beginner', 'talks': 'beginner', 'linkedin': 'beginner',
};

function extractSection(html, sectionId) {
    const startTag = `<section id="${sectionId}"`;
    const startIdx = html.indexOf(startTag);
    if (startIdx === -1) return '';

    // Find the closing </section> tag — count nesting
    let depth = 0;
    let i = startIdx;
    while (i < html.length) {
        if (html.substring(i, i + 8) === '<section') { depth++; i += 8; }
        else if (html.substring(i, i + 10) === '</section>') {
            depth--;
            if (depth === 0) return html.substring(startIdx, i + 10);
            i += 10;
        }
        else { i++; }
    }
    return '';
}

function extractArticles(sectionHtml) {
    const articles = [];
    let searchFrom = 0;
    while (true) {
        const artStart = sectionHtml.indexOf('<article ', searchFrom);
        if (artStart === -1) break;
        // Find closing </article>
        let depth = 0;
        let i = artStart;
        while (i < sectionHtml.length) {
            if (sectionHtml.substring(i, i + 8) === '<article') { depth++; i += 8; }
            else if (sectionHtml.substring(i, i + 10) === '</article>') {
                depth--;
                if (depth === 0) {
                    const artHtml = sectionHtml.substring(artStart, i + 10);
                    // Extract id
                    const idMatch = artHtml.match(/id="([^"]+)"/);
                    const id = idMatch ? idMatch[1] : '';
                    // Extract h2
                    const h2Match = artHtml.match(/<h2>(.*?)<\/h2>/);
                    const title = h2Match ? h2Match[1] : '';
                    // Extract content (everything between first <article...> tag end and </article>)
                    const bodyStart = artHtml.indexOf('>') + 1;
                    const bodyContent = artHtml.substring(bodyStart, artHtml.length - 10);
                    articles.push({ id, title, bodyContent });
                    searchFrom = i + 10;
                    break;
                }
                i += 10;
            }
            else { i++; }
        }
        if (i >= sectionHtml.length) break;
    }
    return articles;
}

// Also extract figure/diagram that appears before articles (hero diagram)
function extractHeroDiagram(sectionHtml) {
    // Look for figure with topic-diagram class before first article
    const firstArt = sectionHtml.indexOf('<article ');
    if (firstArt === -1) return '';
    const beforeArticles = sectionHtml.substring(0, firstArt);
    const figMatch = beforeArticles.match(/<figure[\s\S]*?<\/figure>/);
    return figMatch ? figMatch[0] : '';
}

const checkSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';

function buildSidebar(activeKey) {
    return sidebarLinks.map(l =>
        `        <a href="${l.href}" class="sidebar-link${l.key === activeKey ? ' active' : ''}">${l.label} <span class="count">${l.count}</span></a>`
    ).join('\n');
}

function buildTocLinks(articles) {
    return articles.map(a =>
        `            <a href="#${a.id}" class="toc-link" data-section="${a.id}"><span class="toc-dot"></span>${a.title.replace(/<[^>]+>/g, '')}</a>`
    ).join('\n');
}

function buildTopicCards(articles) {
    return articles.map(a => {
        const diff = difficultyMap[a.id] || 'beginner';
        const diffLabel = diff.charAt(0).toUpperCase() + diff.slice(1);
        const plainTitle = a.title.replace(/<[^>]+>/g, '');
        // The bodyContent already contains h2 and everything — we need to strip the h2 since we put it in the header
        let content = a.bodyContent;
        // Remove the h2 from the start of content
        content = content.replace(/<h2>[\s\S]*?<\/h2>/, '').trim();

        return `
          <article id="${a.id}" class="topic-card" data-difficulty="${diff}">
            <div class="topic-card-header" tabindex="0" role="button" aria-expanded="true">
              <div class="topic-meta">
                <span class="difficulty-badge ${diff}">${diffLabel}</span>
              </div>
              <h2>${a.title}</h2>
              <button class="review-btn" title="Mark as reviewed" aria-label="Mark ${plainTitle} as reviewed">${checkSvg}</button>
              <span class="expand-icon" aria-hidden="true"></span>
            </div>
            <div class="topic-card-body">
              ${content}
            </div>
          </article>`;
    }).join('\n');
}

function generatePage(pg) {
    const sectionHtml = extractSection(indexHtml, pg.sectionId);
    if (!sectionHtml) {
        console.log('⚠️  Section not found: ' + pg.sectionId);
        return;
    }

    const articles = extractArticles(sectionHtml);
    const heroDiagram = extractHeroDiagram(sectionHtml);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pg.title} | Cloud Interview Guide</title>
  <meta name="description" content="${pg.lead.replace(/&amp;/g, '&')}" />
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
${buildSidebar(pg.activeLink)}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-progress-label">Study Progress</div>
        <div class="sidebar-progress-bar"><div class="sidebar-progress-fill" id="progressFill"></div></div>
        <div class="sidebar-progress-text" id="progressText">0 / ${articles.length} reviewed</div>
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
${buildTocLinks(articles)}
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
              <div class="stat"><span class="stat-number">${articles.length}</span><span class="stat-label">Topics</span></div>
            </div>
          </header>
${heroDiagram ? `          <figure class="hero-diagram">\n            ${heroDiagram.replace(/<figure[^>]*>/, '').replace(/<\/figure>/, '').trim()}\n          </figure>\n` : ''}
${buildTopicCards(articles)}
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

    fs.writeFileSync(path.join(BASE, pg.file), html, 'utf8');
    console.log(`✅ ${pg.file} — ${articles.length} articles migrated`);
}

pageConfig.forEach(generatePage);
console.log('\n🎉 All content migrated from index.html!');
