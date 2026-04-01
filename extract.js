const fs = require('fs');

const content = fs.readFileSync('qa3.html', 'utf8');

// The array D is defined as `const D = [ ... ];`
// Let's extract it by finding `const D = [` and the corresponding closing bracket.
const startStr = "const D = [";
const startIndex = content.indexOf(startStr);
if (startIndex === -1) {
  console.error("Could not find const D = [");
  process.exit(1);
}

const afterStart = content.substring(startIndex + startStr.length - 1); // start with '['

let openBrackets = 0;
let endIndex = -1;
for (let i = 0; i < afterStart.length; i++) {
  if (afterStart[i] === '[') openBrackets++;
  if (afterStart[i] === ']') openBrackets--;
  
  if (openBrackets === 0) {
    endIndex = i + 1;
    break;
  }
}

if (endIndex === -1) {
  console.error("Could not find end of array D");
  process.exit(1);
}

const arrayStr = afterStart.substring(0, endIndex);
let D = [];
try {
  // Use eval or new Function to evaluate the JS array, since it contains backticks and JS syntax, not strict JSON.
  D = new Function("return " + arrayStr)();
} catch(e) {
  console.error("Failed to parse array D:", e);
  process.exit(1);
}

let md = "# DevOps Interview — Complete Knowledge Base\n\n";

for (const section of D) {
  md += `## ${section.icon} ${section.s}\n\n`;
  for (const item of section.items) {
    md += `### Q: ${item.q}\n\n`;
    
    // The answer is HTML, we can try to clean it up or just leave it since markdown supports HTML.
    // However, for best resulting PDF we should probably just keep it as HTML inside Markdown,
    // or better yet, convert it back to pure HTML with some basic styling and use md-to-pdf.
    
    // Just replace some custom classes with simpler ones
    let a = item.a;
    // We can just dump the HTML.
    md += `${a}\n\n---\n\n`;
  }
}

fs.writeFileSync('qa3.md', md);
console.log("Created qa3.md successfully.");
