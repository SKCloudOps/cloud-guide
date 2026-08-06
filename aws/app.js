document.addEventListener('DOMContentLoaded', function() {
    var navMenu = document.getElementById('navMenu');
    var questionsContainer = document.getElementById('questionsContainer');
    var searchInput = document.getElementById('searchInput');
    var noResults = document.getElementById('noResults');
    var themeToggle = document.getElementById('themeToggle');
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var sidebar = document.querySelector('.sidebar');
    var introSection = document.getElementById('introSection');

    var activeSectionId = null;

    // Initialize Theme
    function initTheme() {
        var savedTheme = localStorage.getItem('aws_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function updateThemeIcon(theme) {
        var sun = document.querySelector('.sun-icon');
        var moon = document.querySelector('.moon-icon');
        if (theme === 'dark') {
            if (sun) sun.style.display = 'block';
            if (moon) moon.style.display = 'none';
        } else {
            if (sun) sun.style.display = 'none';
            if (moon) moon.style.display = 'block';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var currentTheme = document.documentElement.getAttribute('data-theme');
            var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('aws_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && sidebar &&
            !sidebar.contains(e.target) &&
            mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Render Navigation
    function renderNav() {
        if (!window.interviewData || !navMenu) return;

        navMenu.innerHTML = '';
        window.interviewData.forEach(function(section) {
            var navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.setAttribute('data-id', section.id);

            var titleSpan = document.createElement('span');
            titleSpan.textContent = section.title;

            var countSpan = document.createElement('span');
            countSpan.className = 'nav-count';
            countSpan.textContent = section.questions.length;

            navItem.appendChild(titleSpan);
            navItem.appendChild(countSpan);

            navItem.addEventListener('click', function() {
                document.querySelectorAll('.nav-item').forEach(function(el) {
                    el.classList.remove('active');
                });
                navItem.classList.add('active');
                activeSectionId = section.id;
                renderQuestions(section.id, '');
                if (window.innerWidth <= 1024 && sidebar) {
                    sidebar.classList.remove('open');
                }
                if (searchInput) searchInput.value = '';
                if (introSection) introSection.style.display = 'none';
            });

            navMenu.appendChild(navItem);
        });

        // Auto-select the first section on load
        if (window.interviewData.length > 0) {
            var firstNav = navMenu.querySelector('.nav-item');
            if (firstNav) {
                firstNav.click();
            }
        }
    }

    // Highlight matching search text
    function highlightText(text, term) {
        if (!term) return text;
        try {
            var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var regex = new RegExp('(' + escaped + ')', 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        } catch(e) {
            return text;
        }
    }

    // Render Questions
    function renderQuestions(sectionId, searchTerm) {
        if (!window.interviewData || !questionsContainer) return;

        questionsContainer.innerHTML = '';
        var hasResults = false;

        var sectionsToRender = sectionId
            ? window.interviewData.filter(function(s) { return s.id === sectionId; })
            : window.interviewData;

        sectionsToRender.forEach(function(section) {
            var matchedQuestions = section.questions.filter(function(q) {
                if (!searchTerm) return true;
                var lower = searchTerm.toLowerCase();
                return q.question.toLowerCase().indexOf(lower) !== -1 ||
                       q.answer.toLowerCase().indexOf(lower) !== -1;
            });

            if (matchedQuestions.length === 0) return;
            hasResults = true;

            var sectionEl = document.createElement('div');
            sectionEl.className = 'section-container';

            if (!sectionId || searchTerm) {
                var titleEl = document.createElement('h2');
                titleEl.className = 'section-title';
                titleEl.textContent = section.title;
                sectionEl.appendChild(titleEl);
            }

            matchedQuestions.forEach(function(q) {
                var card = document.createElement('div');
                card.className = 'qna-card expanded';

                var questionHeader = document.createElement('div');
                questionHeader.className = 'question-btn';

                var qText = document.createElement('span');
                qText.className = 'question-text';
                qText.innerHTML = q.id + '. ' + highlightText(q.question, searchTerm);

                questionHeader.appendChild(qText);

                var answerDiv = document.createElement('div');
                answerDiv.className = 'answer-content';
                answerDiv.innerHTML = highlightText(q.answer, searchTerm);

                card.appendChild(questionHeader);
                card.appendChild(answerDiv);
                sectionEl.appendChild(card);
            });

            questionsContainer.appendChild(sectionEl);
        });

        if (noResults) {
            noResults.style.display = hasResults ? 'none' : 'block';
        }
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            var term = e.target.value.trim();
            if (term) {
                document.querySelectorAll('.nav-item').forEach(function(el) {
                    el.classList.remove('active');
                });
                activeSectionId = null;
                if (introSection) introSection.style.display = 'none';
                renderQuestions(null, term);
            } else {
                if (activeSectionId) {
                    var activeNavItem = navMenu.querySelector('.nav-item[data-id="' + activeSectionId + '"]');
                    if (activeNavItem) activeNavItem.classList.add('active');
                    renderQuestions(activeSectionId, '');
                } else {
                    questionsContainer.innerHTML = '';
                    if (introSection) introSection.style.display = 'block';
                }
                if (noResults) noResults.style.display = 'none';
            }
        });
    }

    // Initialize
    initTheme();
    renderNav();
});
