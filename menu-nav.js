const fs = require('fs');
const path = require('path');

// New nav structure: 4 menu items, each with its own dropdown
const newNav = `            <nav class="sidebar-nav">
                <div class="nav-menu-item">
                    <div class="nav-menu-label">Infrastructure</div>
                    <div class="nav-menu-dropdown">
                        <a href="networking.html" class="sidebar-link">Networking &amp; VPC <span class="count">6</span></a>
                        <a href="security.html" class="sidebar-link">Security &amp; IAM <span class="count">6</span></a>
                        <a href="compute.html" class="sidebar-link">Compute <span class="count">5</span></a>
                        <a href="storage.html" class="sidebar-link">Storage <span class="count">5</span></a>
                    </div>
                </div>
                <div class="nav-menu-item">
                    <div class="nav-menu-label">Data &amp; Apps</div>
                    <div class="nav-menu-dropdown">
                        <a href="databases.html" class="sidebar-link">Databases <span class="count">5</span></a>
                        <a href="serverless.html" class="sidebar-link">Serverless <span class="count">3</span></a>
                        <a href="streaming.html" class="sidebar-link">Streaming <span class="count">2</span></a>
                        <a href="genai.html" class="sidebar-link">Gen AI <span class="count">4</span></a>
                    </div>
                </div>
                <div class="nav-menu-item">
                    <div class="nav-menu-label">Design &amp; Ops</div>
                    <div class="nav-menu-dropdown">
                        <a href="architecture.html" class="sidebar-link">Architecture <span class="count">11</span></a>
                        <a href="devops.html" class="sidebar-link">DevOps &amp; CI/CD <span class="count">5</span></a>
                        <a href="kubernetes.html" class="sidebar-link">Kubernetes &amp; EKS <span class="count">15</span></a>
                        <a href="cost.html" class="sidebar-link">Cost Optimization <span class="count">4</span></a>
                    </div>
                </div>
                <div class="nav-menu-item">
                    <div class="nav-menu-label">Foundations</div>
                    <div class="nav-menu-dropdown">
                        <a href="aws.html" class="sidebar-link">AWS Core <span class="count">7</span></a>
                        <a href="fundamentals.html" class="sidebar-link">Fundamentals <span class="count">2</span></a>
                        <a href="reinvent.html" class="sidebar-link">Re:Invent 2024 <span class="count">3</span></a>
                        <a href="interview.html" class="sidebar-link">Interview &amp; Career <span class="count">12</span></a>
                    </div>
                </div>
            </nav>`;

// Map page to its href for active state
const activeMap = {
    'networking.html': 'networking.html',
    'security.html': 'security.html',
    'compute.html': 'compute.html',
    'storage.html': 'storage.html',
    'databases.html': 'databases.html',
    'serverless.html': 'serverless.html',
    'streaming.html': 'streaming.html',
    'genai.html': 'genai.html',
    'architecture.html': 'architecture.html',
    'devops.html': 'devops.html',
    'kubernetes.html': 'kubernetes.html',
    'cost.html': 'cost.html',
    'aws.html': 'aws.html',
    'fundamentals.html': 'fundamentals.html',
    'reinvent.html': 'reinvent.html',
    'interview.html': 'interview.html',
    'index.html': 'aws.html'
};

const files = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.html') && f !== 'src.html');

console.log('Files to update:', files.length);

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace entire <nav class="sidebar-nav">...</nav> block
    const navRegex = /<nav class="sidebar-nav">[\s\S]*?<\/nav>/;
    const match = content.match(navRegex);

    if (!match) {
        console.log(`SKIP: ${file} - no sidebar-nav found`);
        return;
    }

    // Build page-specific nav
    let pageNav = newNav;
    const activeHref = activeMap[file];
    if (activeHref) {
        pageNav = pageNav.replace(
            `href="${activeHref}" class="sidebar-link"`,
            `href="${activeHref}" class="sidebar-link active"`
        );
    }

    content = content.replace(navRegex, pageNav);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`UPDATED: ${file}`);
});

console.log('Done!');
