// ============================================================================
// CCA-F Mock Exams — App
// Handles two pages:
//   .page-landing  → renders the mock cards from window.MOCK_EXAMS
//   .page-exam     → loads ?mock=N, runs the exam state machine, scores, reviews
// ============================================================================

(function () {
  "use strict";

  const exams = (typeof window !== "undefined" && window.MOCK_EXAMS) || [];

  // -----------------------------------------------
  // Helpers
  // -----------------------------------------------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);

  // Pull just the letter from an option label like "A. Some text"
  const letterOf = (optionLabel) => optionLabel.trim().charAt(0);

  // Strip the leading "A. " from option text for re-display
  const stripLetter = (optionLabel) => optionLabel.replace(/^[A-E][.)]\s*/, "");

  const arraysEqualAsSets = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
  };

  // -----------------------------------------------
  // PAGE: LANDING
  // -----------------------------------------------
  function initLanding() {
    const grid = $("#mocks-grid");
    if (!grid) return;

    grid.innerHTML = exams.map((mock) => {
      const total = mock.questions.length;
      const single = mock.questions.filter(q => q.type === "single").length;
      const multi = total - single;
      const num = String(mock.id).padStart(2, "0");

      return `
        <div class="mock-card">
          <span class="mock-card-num">Mock ${num}</span>
          <h3 class="mock-card-title">${escapeHtml(mock.title)}</h3>
          <p class="mock-card-subtitle">${escapeHtml(mock.subtitle)}</p>
          <div class="mock-card-stats">
            <span class="mock-card-stat"><strong>${total}</strong> questions</span>
            <span class="mock-card-stat"><strong>${single}</strong> single</span>
            ${multi > 0 ? `<span class="mock-card-stat"><strong>${multi}</strong> multi</span>` : ""}
          </div>
          <div class="mock-card-actions" style="margin-top: 1.5rem; display: flex; gap: 0.8rem;">
            <a href="exam.html?mock=${mock.id}" class="btn btn-primary btn-small" style="text-decoration:none;">Start Exam</a>
            <a href="answers.html?mock=${mock.id}" class="btn btn-ghost btn-small" style="text-decoration:none;">View Answers</a>
          </div>
        </div>
      `;
    }).join("");
  }

  // -----------------------------------------------
  // PAGE: EXAM
  // -----------------------------------------------
  function initExam() {
    const examMain = $("main.exam-main");
    if (!examMain) return;

    // Parse ?mock=N
    const params = new URLSearchParams(window.location.search);
    const mockId = parseInt(params.get("mock"), 10);
    const mock = exams.find((m) => m.id === mockId);

    if (!mock) {
      $("#quiz-view").style.display = "none";
      $("#error-view").style.display = "block";
      return;
    }

    // ----- State -----
    const state = {
      mock,
      currentIndex: 0,
      answers: {},          // questionId -> array of letters
      submitted: false,
    };

    // ----- Header -----
    const num = String(mock.id).padStart(2, "0");
    $("#exam-eyebrow").textContent = `Mock ${num}`;
    $("#exam-title").textContent = mock.title;
    document.title = `${mock.title} · CCA-F`;
    $("#progress-total").textContent = mock.questions.length;

    // ----- Render question -----
    function renderQuestion() {
      const q = mock.questions[state.currentIndex];
      const card = $("#question-card");
      const selected = state.answers[q.id] || [];

      const isMulti = q.type === "multi";
      const indicatorClass = isMulti ? "q-option-indicator-check" : "q-option-indicator-radio";
      const badgeType = isMulti
        ? `<span class="badge badge-multi">Multi-select · pick ${q.multiCount}</span>`
        : `<span class="badge badge-single">Single answer</span>`;

      const optionsHtml = q.options.map((opt) => {
        const letter = letterOf(opt);
        const text = stripLetter(opt);
        const isSelected = selected.includes(letter);
        return `
          <div class="q-option ${isSelected ? "selected" : ""}" data-letter="${letter}">
            <span class="q-option-indicator ${indicatorClass}"></span>
            <span class="q-option-letter">${letter}</span>
            <span class="q-option-text">${escapeHtml(text)}</span>
          </div>
        `;
      }).join("");

      card.innerHTML = `
        <div class="q-header">
          <span class="q-number">Question ${state.currentIndex + 1} of ${mock.questions.length}</span>
          <div class="q-badges">
            <span class="badge badge-domain">${escapeHtml(q.domain)}</span>
            ${badgeType}
          </div>
        </div>
        <div class="q-stem">${escapeHtml(q.question)}</div>
        ${isMulti ? `<div class="q-instruction">Select exactly ${q.multiCount} option${q.multiCount > 1 ? "s" : ""}.</div>` : ""}
        <div class="q-options">${optionsHtml}</div>
      `;

      // Attach option click handlers
      $$(".q-option", card).forEach((el) => {
        el.addEventListener("click", () => {
          const letter = el.dataset.letter;
          handleOptionClick(q, letter);
        });
      });

      // Update progress
      $("#progress-current").textContent = state.currentIndex + 1;
      const pct = ((state.currentIndex + 1) / mock.questions.length) * 100;
      $("#progress-fill").style.width = pct + "%";

      // Update nav buttons
      $("#btn-prev").disabled = state.currentIndex === 0;

      const isLast = state.currentIndex === mock.questions.length - 1;
      if (isLast) {
        $("#btn-next").style.display = "none";
        $("#btn-submit").style.display = "inline-flex";
      } else {
        $("#btn-next").style.display = "inline-flex";
        $("#btn-submit").style.display = "none";
      }

      // Disable Clear if nothing selected
      $("#btn-clear").disabled = !selected.length;

      renderPager();

      // Scroll to top of card on navigation
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // ----- Option click logic -----
    function handleOptionClick(q, letter) {
      const current = state.answers[q.id] || [];
      let next;

      if (q.type === "single") {
        next = current.includes(letter) ? [] : [letter];
      } else {
        // multi: toggle, but cap at multiCount
        if (current.includes(letter)) {
          next = current.filter((x) => x !== letter);
        } else {
          if (current.length >= q.multiCount) {
            // Replace the oldest selection so the user can change picks
            next = [...current.slice(1), letter];
          } else {
            next = [...current, letter];
          }
        }
      }

      state.answers[q.id] = next;
      renderQuestion();
    }

    // ----- Pager -----
    function renderPager() {
      const pager = $("#question-pager");
      pager.innerHTML = mock.questions.map((q, i) => {
        const answered = (state.answers[q.id] || []).length > 0;
        const isCurrent = i === state.currentIndex;
        const cls = ["pager-dot"];
        if (answered) cls.push("answered");
        if (isCurrent) cls.push("current");
        return `<button class="${cls.join(" ")}" data-idx="${i}">${i + 1}</button>`;
      }).join("");

      $$(".pager-dot", pager).forEach((el) => {
        el.addEventListener("click", () => {
          state.currentIndex = parseInt(el.dataset.idx, 10);
          renderQuestion();
        });
      });
    }

    // ----- Nav button handlers -----
    $("#btn-prev").addEventListener("click", () => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuestion();
      }
    });

    $("#btn-next").addEventListener("click", () => {
      if (state.currentIndex < mock.questions.length - 1) {
        state.currentIndex++;
        renderQuestion();
      }
    });

    $("#btn-clear").addEventListener("click", () => {
      const q = mock.questions[state.currentIndex];
      delete state.answers[q.id];
      renderQuestion();
    });

    $("#btn-submit").addEventListener("click", () => {
      // Confirm if any unanswered
      const unanswered = mock.questions.filter(q => !(state.answers[q.id] || []).length);
      if (unanswered.length > 0) {
        const ok = confirm(
          `${unanswered.length} question${unanswered.length > 1 ? "s are" : " is"} unanswered. ` +
          `Submit anyway? Unanswered questions count as incorrect.`
        );
        if (!ok) return;
      }
      submitExam();
    });

    // ----- Submit & score -----
    function submitExam() {
      state.submitted = true;

      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;
      const domainStats = {};

      mock.questions.forEach((q) => {
        const userAns = state.answers[q.id] || [];
        const isUnanswered = userAns.length === 0;
        const isCorrect = !isUnanswered && arraysEqualAsSets(userAns, q.correct);

        if (isUnanswered) unansweredCount++;
        else if (isCorrect) correctCount++;
        else incorrectCount++;

        if (!domainStats[q.domain]) {
          domainStats[q.domain] = { correct: 0, total: 0 };
        }
        domainStats[q.domain].total++;
        if (isCorrect) domainStats[q.domain].correct++;
      });

      const total = mock.questions.length;
      const pct = Math.round((correctCount / total) * 100);
      const passing = pct >= 72;

      // Headline
      const pctEl = $("#result-pct");
      pctEl.textContent = pct + "%";
      pctEl.classList.add(passing ? "passing" : "failing");

      $("#result-correct").textContent = `${correctCount} / ${total}`;
      $("#result-incorrect").textContent = incorrectCount;
      $("#result-unanswered").textContent = unansweredCount;
      $("#result-pass").textContent = passing ? "Passed" : "Not yet";

      // Domain bars
      const domainBarsEl = $("#domain-bars");
      domainBarsEl.innerHTML = Object.entries(domainStats).map(([domain, s]) => {
        const dpct = Math.round((s.correct / s.total) * 100);
        const dpassing = dpct >= 72;
        return `
          <div class="domain-row">
            <div class="domain-row-name">${escapeHtml(domain)}</div>
            <div class="domain-row-stats">
              <span>${s.correct}/${s.total}</span>
              <div class="domain-row-bar">
                <div class="domain-row-fill ${dpassing ? "passing" : ""}" style="width:${dpct}%"></div>
              </div>
              <span>${dpct}%</span>
            </div>
          </div>
        `;
      }).join("");

      // Review list
      const reviewListEl = $("#review-list");
      reviewListEl.innerHTML = mock.questions.map((q, i) => {
        const userAns = state.answers[q.id] || [];
        const isUnanswered = userAns.length === 0;
        const isCorrect = !isUnanswered && arraysEqualAsSets(userAns, q.correct);

        let statusClass, statusText;
        if (isUnanswered) {
          statusClass = "review-status-skipped";
          statusText = "Skipped";
        } else if (isCorrect) {
          statusClass = "review-status-correct";
          statusText = "Correct";
        } else {
          statusClass = "review-status-incorrect";
          statusText = "Incorrect";
        }

        const optionsHtml = q.options.map((opt) => {
          const letter = letterOf(opt);
          const text = stripLetter(opt);
          const isCorrectAnswer = q.correct.includes(letter);
          const isUserPick = userAns.includes(letter);

          let cls = "review-option";
          let tag = "";

          if (isCorrectAnswer) {
            cls += " correct";
            tag = `<span class="review-option-tag">Correct${q.correct.length > 1 ? " ✓" : ""}</span>`;
          }
          if (isUserPick && !isCorrectAnswer) {
            cls += " user-incorrect";
            tag = `<span class="review-option-tag">Your pick</span>`;
          }
          if (isUserPick && isCorrectAnswer) {
            tag = `<span class="review-option-tag">Your pick · Correct</span>`;
          }

          return `
            <div class="${cls}">
              <span class="review-option-letter">${letter}</span>
              <span class="review-option-text">${escapeHtml(text)}</span>
              ${tag}
            </div>
          `;
        }).join("");

        // Build incorrect-explanations rows
        const incorrectRows = Object.entries(q.explanation.incorrect || {}).map(([letter, text]) => `
          <div class="explanation-incorrect-row">
            <span class="explanation-incorrect-letter">${letter}</span>
            <span>${escapeHtml(text)}</span>
          </div>
        `).join("");

        return `
          <article class="review-item">
            <div class="review-item-header">
              <span class="review-item-num">Question ${i + 1} · ${escapeHtml(q.domain)}</span>
              <span class="review-status ${statusClass}">${statusText}</span>
            </div>
            <div class="review-stem">${escapeHtml(q.question)}</div>
            <div class="review-options">${optionsHtml}</div>
            <div class="explanation">
              <div class="explanation-title">Why the correct answer wins</div>
              <div class="explanation-correct">${escapeHtml(q.explanation.correct)}</div>
              <div class="explanation-incorrect-title">Why each distractor falls short</div>
              ${incorrectRows}
            </div>
          </article>
        `;
      }).join("");

      // Switch views
      $("#quiz-view").style.display = "none";
      $("#results-view").style.display = "block";
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // ----- Retry -----
    $("#btn-retry").addEventListener("click", () => {
      state.currentIndex = 0;
      state.answers = {};
      state.submitted = false;
      $("#result-pct").classList.remove("passing", "failing");
      $("#results-view").style.display = "none";
      $("#quiz-view").style.display = "block";
      renderQuestion();
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    // ----- Initial render -----
    renderQuestion();

    if (params.get("view") === "answers") {
      submitExam();
    }
  }

  // -----------------------------------------------
  // Answers Page Boot
  // -----------------------------------------------
  function initAnswers() {
    const params = new URLSearchParams(window.location.search);
    const mockId = parseInt(params.get("mock"), 10);
    const mock = exams.find((m) => m.id === mockId);

    if (!mock) {
      document.getElementById("answers-view").innerHTML = "<h2>Mock not found</h2><p><a href='index.html'>Back to list</a></p>";
      return;
    }

    document.title = `Answers: ${mock.title} · CCA-F`;
    const num = String(mock.id).padStart(2, "0");
    const eyebrow = $("#exam-eyebrow");
    if (eyebrow) eyebrow.textContent = `Mock ${num} Answers`;
    const titleEl = $("#exam-title");
    if (titleEl) titleEl.textContent = mock.title;

    const listEl = $("#review-list");
    if (!listEl) return;

    // Track which questions have been revealed
    const revealed = {};

    function revealCard(article, q) {
      if (revealed[q.id]) return;
      revealed[q.id] = true;

      // Show the explanation panel
      const expEl = article.querySelector(".explanation");
      if (expEl) expEl.style.display = "block";

      // Colour the options: correct = green, wrong-picked = red
      article.querySelectorAll(".ans-option").forEach((optEl) => {
        const letter = optEl.dataset.letter;
        const isCorrect = q.correct.includes(letter);
        const isSelected = optEl.classList.contains("ans-selected");
        if (isCorrect) {
          optEl.classList.add("ans-correct");
          optEl.querySelector(".ans-tag").textContent = "✓ Correct";
        } else if (isSelected) {
          optEl.classList.add("ans-wrong");
          optEl.querySelector(".ans-tag").textContent = "✗ Wrong";
        }
        optEl.classList.remove("ans-selected");
      });

      // Disable + update button
      const btn = article.querySelector(".btn-reveal");
      if (btn) {
        btn.textContent = "Answer Revealed";
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "default";
      }
      const hint = article.querySelector(".ans-hint");
      if (hint) hint.style.display = "none";
    }

    // Build HTML
    listEl.innerHTML = mock.questions.map((q, i) => {
      const isMulti = q.type === "multi";
      const indicatorCls = isMulti ? "ans-check" : "ans-radio";
      const badgeHtml = isMulti
        ? `<span class="badge badge-multi">Multi-select · pick ${q.multiCount}</span>`
        : `<span class="badge badge-single">Single answer</span>`;

      const optionsHtml = q.options.map((opt) => {
        const letter = letterOf(opt);
        const text = stripLetter(opt);
        return `<div class="ans-option" data-letter="${letter}">
          <span class="ans-indicator ${indicatorCls}"></span>
          <span class="ans-letter">${letter}</span>
          <span class="ans-text">${escapeHtml(text)}</span>
          <span class="ans-tag"></span>
        </div>`;
      }).join("");

      const incorrectRows = Object.entries(q.explanation.incorrect || {}).map(([letter, text]) =>
        `<div class="explanation-incorrect-row">
          <span class="explanation-incorrect-letter">${letter}</span>
          <span>${escapeHtml(text)}</span>
        </div>`
      ).join("");

      return `
        <article class="review-item" data-qid="${escapeHtml(String(q.id))}">
          <div class="review-item-header">
            <span class="review-item-num">Q${i + 1} &middot; ${escapeHtml(q.domain)}</span>
            ${badgeHtml}
          </div>
          <div class="review-stem">${escapeHtml(q.question)}</div>
          ${isMulti ? `<div class="q-instruction">Select ${q.multiCount} options</div>` : ""}
          <div class="ans-options-wrap">${optionsHtml}</div>
          <div class="ans-footer">
            <button class="btn btn-reveal">Reveal Answer</button>
            <span class="ans-hint">or pick an option to auto-reveal</span>
          </div>
          <div class="explanation" style="display:none;">
            <div class="explanation-title">Why the correct answer wins</div>
            <div class="explanation-correct">${escapeHtml(q.explanation.correct)}</div>
            ${incorrectRows ? `<div class="explanation-incorrect-title">Why each distractor falls short</div>${incorrectRows}` : ""}
          </div>
        </article>`;
    }).join("");

    // Wire interactions after DOM is ready
    mock.questions.forEach((q) => {
      const article = listEl.querySelector(`article[data-qid="${q.id}"]`);
      if (!article) return;

      article.querySelectorAll(".ans-option").forEach((optEl) => {
        optEl.addEventListener("click", () => {
          if (revealed[q.id]) return;
          if (q.type === "single") {
            article.querySelectorAll(".ans-option").forEach(o => o.classList.remove("ans-selected"));
          }
          optEl.classList.toggle("ans-selected");
          revealCard(article, q);
        });
      });

      const btn = article.querySelector(".btn-reveal");
      if (btn) btn.addEventListener("click", () => revealCard(article, q));
    });
  }

  // -----------------------------------------------
  // Boot
  // -----------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("page-landing")) {
      initLanding();
    } else if (document.body.classList.contains("page-exam")) {
      initExam();
    } else if (document.body.classList.contains("page-answers")) {
      initAnswers();
    }
  });
})();
