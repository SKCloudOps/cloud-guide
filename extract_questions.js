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

const afterStart = content.substring(startIndex + startStr.length - 1);

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
  D = new Function("return " + arrayStr)();
} catch(e) {
  console.error("Failed to parse array D:", e);
  process.exit(1);
}

let md = "# DevOps Interview — Questions Only\n\n";

for (const section of D) {
  // Ignore self introduction questions
  if (section.id === 'intro') {
    continue;
  }

  md += `## ${section.icon} ${section.s}\n\n`;
  let idx = 1;
  for (const item of section.items) {
    md += `${idx}. **${item.q}**\n`;
    idx++;
  }
  md += "\n";
}

fs.writeFileSync('qa3_questions_only.md', md);
console.log("Created qa3_questions_only.md successfully.");
