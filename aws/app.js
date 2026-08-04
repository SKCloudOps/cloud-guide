document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navMenu = document.getElementById('navMenu');
    const questionsContainer = document.getElementById('questionsContainer');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const introSection = document.getElementById('introSection');
    
    let activeSectionId = null;

    // Initialize Theme
    const initTheme = () => {
        const savedTheme = localStorage.getItem('aws_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    };

    const updateThemeIcon = (theme) => {
        const sun = document.querySelector('.sun-icon');
        const moon = document.querySelector('.moon-icon');
        if (theme === 'dark') {
            sun.style.display = 'block';
            moon.style.display = 'none';
        } else {
            sun.style.display = 'none';
            moon.style.display = 'block';
        }
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('aws_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Render Navigation
    const renderNav = () => {
        if (!window.interviewData) return;
        
        navMenu.innerHTML = '';
        window.interviewData.forEach((section, index) => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.dataset.id = section.id;
            
            navItem.innerHTML = `
                <span>${section.title}</span>
                <span class="nav-count">${section.questions.length}</span>
            `;
            
            navItem.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                navItem.classList.add('active');
                activeSectionId = section.id;
                renderQuestions(section.id);
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                }
                searchInput.value = ''; // clear search when navigating
                
                // Hide intro section when a category is selected
                if(introSection) introSection.style.display = 'none';
            });
            
            navMenu.appendChild(navItem);
        });

        // Auto-select the first section on initial load
        if (window.interviewData.length > 0 && !activeSectionId) {
            const firstNav = navMenu.querySelector('.nav-item');
            if (firstNav) {
                firstNav.click();
            }
        }
    };

    // Highlight text helper
    const highlightText = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    // Render Questions
    const renderQuestions = (sectionId = null, searchTerm = '') => {
        if (!window.interviewData) return;
        
        questionsContainer.innerHTML = '';
        let hasResults = false;
        
        const sectionsToRender = sectionId 
            ? window.interviewData.filter(s => s.id === sectionId)
            : window.interviewData;

        sectionsToRender.forEach(section => {
            const matchedQuestions = section.questions.filter(q => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                return q.question.toLowerCase().includes(searchLower) || 
                       q.answer.toLowerCase().includes(searchLower);
            });

            if (matchedQuestions.length === 0) return;
            hasResults = true;

            const sectionEl = document.createElement('div');
            sectionEl.className = 'section-container';
            
            // Only show section title if searching globally or it's a specific section
            if (!sectionId || searchTerm) {
                const titleEl = document.createElement('h2');
                titleEl.className = 'section-title';
                titleEl.textContent = section.title;
                sectionEl.appendChild(titleEl);
            }

            matchedQuestions.forEach(q => {
                const card = document.createElement('div');
                card.className = 'qna-card';
                
                // If searching, auto-expand cards
                if (searchTerm) card.classList.add('expanded');

                card.innerHTML = `
                    <button class="question-btn">
                        <span class="question-text">${q.id}. ${highlightText(q.question, searchTerm)}</span>
                        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="answer-content">
                        ${highlightText(q.answer, searchTerm)}
                    </div>
                `;

                const btn = card.querySelector('.question-btn');
                btn.addEventListener('click', () => {
                    card.classList.toggle('expanded');
                });

                sectionEl.appendChild(card);
            });

            questionsContainer.appendChild(sectionEl);
        });

        noResults.style.display = hasResults ? 'none' : 'block';
    };

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim();
        if (term) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            activeSectionId = null;
            if(introSection) introSection.style.display = 'none';
            renderQuestions(null, term);
        } else {
            // Restore previous state if search is cleared
            if (activeSectionId) {
                document.querySelector(\`.nav-item[data-id="\${activeSectionId}"]\`)?.classList.add('active');
                renderQuestions(activeSectionId);
            } else {
                questionsContainer.innerHTML = '';
                if(introSection) introSection.style.display = 'block';
            }
            noResults.style.display = 'none';
        }
    });

    // Initialize
    initTheme();
    renderNav();
});
