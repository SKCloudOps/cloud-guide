const fs = require('fs');
const path = require('path');

// All HTML files
const files = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.html') && f !== 'src.html');

console.log('Files to update:', files);

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Wrap sidebar links in a nav-dropdown div if not already wrapped
    if (content.includes('nav-dropdown')) {
        console.log(`SKIP: ${file} - already has nav-dropdown`);
        return;
    }

    // Pattern: find the nav-label and all sidebar-links before </nav>
    // We need to wrap sidebar-links in <div class="nav-dropdown">...</div>
    const navPattern = /(<div class="sidebar-nav-label">Categories<\/div>\s*\n)([\s\S]*?)(\s*<\/nav>)/;
    const match = content.match(navPattern);
    if (!match) {
        console.log(`SKIP: ${file} - nav pattern not found`);
        return;
    }

    const links = match[2];
    const replacement = match[1] + '        <div class="nav-dropdown">\n' + links + '\n        </div>' + match[3];
    content = content.replace(navPattern, replacement);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`UPDATED: ${file}`);
});

console.log('Done!');
