const fs = require('fs');
const path = require('path');

// Files that need sidebar updates (old pages without new categories)
const files = [
    'aws.html',
    'architecture.html',
    'devops.html',
    'kubernetes.html',
    'genai.html',
    'serverless.html',
    'fundamentals.html',
    'reinvent.html',
    'streaming.html',
    'interview.html'
];

// The old sidebar pattern (regex to match it)
const oldNavRegex = /(<div class="sidebar-nav-label">Categories<\/div>\s*)([\s\S]*?)(<\/nav>)/;

// Generate new nav links, marking the active page
function generateNav(activeFile) {
    const categories = [
        { href: 'networking.html', label: 'Networking &amp; VPC', count: 6 },
        { href: 'security.html', label: 'Security &amp; IAM', count: 6 },
        { href: 'compute.html', label: 'Compute', count: 5 },
        { href: 'databases.html', label: 'Databases', count: 5 },
        { href: 'storage.html', label: 'Storage', count: 5 },
        { href: 'architecture.html', label: 'Architecture', count: 11 },
        { href: 'aws.html', label: 'AWS Core', count: 7 },
        { href: 'devops.html', label: 'DevOps &amp; CI/CD', count: 5 },
        { href: 'kubernetes.html', label: 'Kubernetes &amp; EKS', count: 15 },
        { href: 'serverless.html', label: 'Serverless', count: 3 },
        { href: 'genai.html', label: 'Gen AI', count: 4 },
        { href: 'cost.html', label: 'Cost Optimization', count: 4 },
        { href: 'fundamentals.html', label: 'Fundamentals', count: 2 },
        { href: 'reinvent.html', label: 'Re:Invent 2024', count: 3 },
        { href: 'streaming.html', label: 'Streaming', count: 2 },
        { href: 'interview.html', label: 'Interview &amp; Career', count: 12 },
    ];

    return categories.map(c => {
        const active = c.href === activeFile ? ' active' : '';
        return `        <a href="${c.href}" class="sidebar-link${active}">${c.label} <span class="count">${c.count}</span></a>`;
    }).join('\n');
}

const dir = __dirname;

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`SKIP: ${file} not found`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(oldNavRegex);
    if (!match) {
        console.log(`SKIP: ${file} - nav pattern not found`);
        return;
    }
    const newLinks = generateNav(file);
    const replacement = match[1] + '\n' + newLinks + '\n      ' + match[3];
    content = content.replace(oldNavRegex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`UPDATED: ${file}`);
});

console.log('Done!');
