const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.html') && f !== 'src.html');

console.log('Removing sidebar-footer from', files.length, 'files');

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('sidebar-footer')) {
        console.log(`SKIP: ${file}`);
        return;
    }

    // Remove sidebar-footer block (handles nested divs)
    // Match: <div class="sidebar-footer">...progressFill...</div></div></div>
    const regex = /\s*<div class="sidebar-footer">[\s\S]*?<div class="sidebar-progress-text"[^>]*>[^<]*<\/div>\s*<\/div>/g;
    content = content.replace(regex, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`REMOVED: ${file}`);
});

console.log('Done!');
