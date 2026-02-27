const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.html') && f !== 'src.html');

console.log('Removing sidebar-footer from', files.length, 'files');

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the entire sidebar-footer div block
    const footerRegex = /\s*<div class="sidebar-footer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*(?=\s*<\/aside>)/;
    const match = content.match(footerRegex);
    if (match) {
        content = content.replace(footerRegex, '\n        ');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`REMOVED: ${file}`);
    } else {
        console.log(`SKIP: ${file} - no sidebar-footer found`);
    }
});

console.log('Done!');
