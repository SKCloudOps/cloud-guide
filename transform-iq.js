const fs = require('fs');
const path = require('path');

const files = [
  'aws.html','architecture.html','networking.html','security.html',
  'compute.html','storage.html','databases.html','kubernetes.html',
  'devops.html','serverless.html','streaming.html','genai.html',
  'cost.html','fundamentals.html','reinvent.html'
];

const chevronSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
const answerIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>';

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Find the old ol block
  const olRegex = /<ol class="interview-questions-list">([\s\S]*?)<\/ol>/;
  const olMatch = html.match(olRegex);
  if (!olMatch) {
    console.log(`SKIP: ${file} — no interview-questions-list found`);
    return;
  }

  const olContent = olMatch[1];

  // Extract each <li>...</li>
  const liRegex = /<li>([\s\S]*?)<\/li>/g;
  const items = [];
  let m;
  while ((m = liRegex.exec(olContent)) !== null) {
    const raw = m[1].trim();
    // Split question text from hint
    const hintMatch = raw.match(/<span class="iq-hint">([\s\S]*?)<\/span>/);
    let question, hint;
    if (hintMatch) {
      hint = hintMatch[1].replace(/^Hint:\s*/i, '').trim();
      question = raw.substring(0, raw.indexOf('<span class="iq-hint">')).trim();
    } else {
      question = raw;
      hint = '';
    }
    items.push({ question, hint });
  }

  if (items.length === 0) {
    console.log(`SKIP: ${file} — no li items found`);
    return;
  }

  // Build new HTML
  let newHtml = `<div class="iq-controls">
                                    <button type="button" class="iq-ctrl-btn" onclick="this.closest('.topic-body').querySelectorAll('.iq-item').forEach(i=>i.classList.add('open'))">Show All Answers</button>
                                    <button type="button" class="iq-ctrl-btn" onclick="this.closest('.topic-body').querySelectorAll('.iq-item').forEach(i=>i.classList.remove('open'))">Hide All</button>
                                </div>
                                <ol class="iq-list">\n`;

  items.forEach(item => {
    newHtml += `                                    <li class="iq-item">
                                        <div class="iq-question" tabindex="0" role="button" aria-expanded="false" onclick="this.parentElement.classList.toggle('open');this.setAttribute('aria-expanded',this.parentElement.classList.contains('open'))">
                                            <span class="iq-num"></span>
                                            <span class="iq-text">${item.question}</span>
                                            <span class="iq-toggle">${chevronSvg}</span>
                                        </div>
                                        <div class="iq-answer">
                                            <div class="iq-answer-inner">
                                                <div class="iq-answer-label">${answerIcon} Answer Guide</div>
                                                <div class="iq-answer-text">${item.hint}</div>
                                            </div>
                                        </div>
                                    </li>\n`;
  });

  newHtml += `                                </ol>`;

  html = html.replace(olRegex, newHtml);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`OK: ${file} — ${items.length} questions transformed`);
});

console.log('\nDone.');
