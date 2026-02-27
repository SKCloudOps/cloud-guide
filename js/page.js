(function () {
    'use strict';

    // === Dropdown Menu ===
    var navEl = document.querySelector('.sidebar-nav');
    var navLabel = document.querySelector('.sidebar-nav-label');
    if (navEl && navLabel) {
        navLabel.addEventListener('click', function (e) {
            e.stopPropagation();
            navEl.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
            if (!navEl.contains(e.target)) navEl.classList.remove('open');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') navEl.classList.remove('open');
        });
    }

    // === DOM Elements ===
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var toggle = document.getElementById('sidebarToggle');
    var searchInput = document.getElementById('searchInput');
    var filterChips = document.querySelectorAll('.filter-chip');
    var topicCards = document.querySelectorAll('.topic-card');
    var tocLinks = document.querySelectorAll('.toc-link');
    var scrollTopBtn = document.getElementById('scrollTopBtn');
    var progressFill = document.getElementById('progressFill');
    var progressText = document.getElementById('progressText');

    // Determine storage key from page name
    var pageName = (window.location.pathname.split('/').pop() || 'page').replace('.html', '');
    var STORAGE_KEY = pageName + '_reviewed';
    var activeFilter = 'all';

    // === Sidebar Toggle ===
    var appLayout = document.querySelector('.app-layout');
    var SIDEBAR_PREF = 'sidebar_collapsed';

    // Restore sidebar state from localStorage
    try {
        if (localStorage.getItem(SIDEBAR_PREF) === 'true') {
            appLayout && appLayout.classList.add('sidebar-collapsed');
        }
    } catch (e) { }

    function isMobile() { return window.innerWidth <= 900; }

    if (toggle) {
        toggle.addEventListener('click', function () {
            if (isMobile()) {
                // Mobile: open/close sidebar overlay
                sidebar.classList.toggle('open');
                overlay.classList.toggle('visible');
            } else {
                // Desktop: collapse/expand sidebar
                appLayout.classList.toggle('sidebar-collapsed');
                try {
                    localStorage.setItem(SIDEBAR_PREF, appLayout.classList.contains('sidebar-collapsed'));
                } catch (e) { }
            }
        });
    }
    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        });
    }

    // === LocalStorage helpers ===
    function getReviewed() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
    }
    function saveReviewed(arr) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) { }
    }

    function updateProgress() {
        var reviewed = getReviewed();
        var total = topicCards.length;
        var count = 0;
        topicCards.forEach(function (card) {
            var isReviewed = reviewed.indexOf(card.id) !== -1;
            card.classList.toggle('reviewed', isReviewed);
            if (isReviewed) count++;
        });
        tocLinks.forEach(function (link) {
            link.classList.toggle('reviewed', reviewed.indexOf(link.getAttribute('data-section')) !== -1);
        });
        if (progressFill) progressFill.style.width = (total > 0 ? (count / total * 100) : 0) + '%';
        if (progressText) progressText.textContent = count + ' / ' + total + ' reviewed';
    }

    // === Review Button ===
    document.querySelectorAll('.review-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var card = btn.closest('.topic-card');
            if (!card) return;
            var reviewed = getReviewed();
            var idx = reviewed.indexOf(card.id);
            if (idx === -1) reviewed.push(card.id); else reviewed.splice(idx, 1);
            saveReviewed(reviewed);
            updateProgress();
        });
    });

    // === Expand / Collapse ===
    document.querySelectorAll('.topic-card-header').forEach(function (header) {
        header.addEventListener('click', function (e) {
            if (e.target.closest('.review-btn')) return;
            var card = header.closest('.topic-card');
            card.classList.toggle('collapsed');
            header.setAttribute('aria-expanded', !card.classList.contains('collapsed'));
        });
        header.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (e.target.closest('.review-btn')) return;
                var card = header.closest('.topic-card');
                card.classList.toggle('collapsed');
                header.setAttribute('aria-expanded', !card.classList.contains('collapsed'));
            }
        });
    });

    // === Search ===
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filterTopics(searchInput.value.toLowerCase().trim(), activeFilter);
        });
    }

    // === Filter Chips ===
    filterChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            filterChips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-filter');
            filterTopics(searchInput ? searchInput.value.toLowerCase().trim() : '', activeFilter);
        });
    });

    function filterTopics(query, difficulty) {
        topicCards.forEach(function (card) {
            var keywords = (card.getAttribute('data-keywords') || '') + ' ' +
                (card.querySelector('h2') ? card.querySelector('h2').textContent.toLowerCase() : '');
            var cardDiff = card.getAttribute('data-difficulty') || '';
            card.classList.toggle('hidden', !((!query || keywords.indexOf(query) !== -1) && (difficulty === 'all' || cardDiff === difficulty)));
        });
    }

    // === TOC Highlight ===
    function updateTocHighlight() {
        var currentId = null;
        topicCards.forEach(function (card) {
            if (card.classList.contains('hidden')) return;
            if (card.getBoundingClientRect().top <= 150) currentId = card.id;
        });
        tocLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === currentId);
        });
    }
    window.addEventListener('scroll', updateTocHighlight, { passive: true });

    // === Scroll to top ===
    window.addEventListener('scroll', function () {
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', (window.pageYOffset || document.documentElement.scrollTop) > 400);
    }, { passive: true });
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Ctrl+K search
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (searchInput) searchInput.focus(); }
    });

    updateProgress();
    setTimeout(updateTocHighlight, 100);
})();
