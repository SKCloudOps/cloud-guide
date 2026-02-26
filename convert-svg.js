const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Find all SVG files in assets
const svgs = fs.readdirSync(assetsDir).filter(f => f.endsWith('.svg'));
console.log('Found SVGs:', svgs);

(async () => {
    for (const svg of svgs) {
        const input = path.join(assetsDir, svg);
        const output = path.join(assetsDir, svg.replace('.svg', '.png'));
        try {
            await sharp(input, { density: 300 })
                .png()
                .toFile(output);
            console.log(`✓ ${svg} → ${svg.replace('.svg', '.png')}`);
        } catch (err) {
            console.error(`✗ ${svg}: ${err.message}`);
        }
    }
    console.log('Done!');
})();
