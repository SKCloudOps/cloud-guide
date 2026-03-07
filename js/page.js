(function () {
    'use strict';

    // === Multi-menu Dropdowns ===
    var menuItems = document.querySelectorAll('.nav-menu-item');
    menuItems.forEach(function (item) {
        var label = item.querySelector('.nav-menu-label');
        if (!label) return;
        label.addEventListener('click', function (e) {
            e.stopPropagation();
            var wasOpen = item.classList.contains('open');
            // Close all menus first
            menuItems.forEach(function (m) { m.classList.remove('open'); });
            if (!wasOpen) item.classList.add('open');
        });
    });
    document.addEventListener('click', function (e) {
        // Don't close when clicking inside sidebar (for vertical layout)
        if (document.getElementById('sidebar') && document.getElementById('sidebar').contains(e.target)) return;
        menuItems.forEach(function (m) { m.classList.remove('open'); });
    });
    // Auto-expand section containing active page link
    var activeLink = document.querySelector('.sidebar-link.active');
    if (activeLink) {
        var parentItem = activeLink.closest('.nav-menu-item');
        if (parentItem) parentItem.classList.add('open');
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') menuItems.forEach(function (m) { m.classList.remove('open'); });
    });

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

    // === Sidebar Toggle (mobile: expand/collapse top nav) ===
    if (toggle) {
        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
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

    // Default: all topic cards collapsed. Click TOC to open one.
    topicCards.forEach(function (card) {
        card.classList.add('collapsed');
        var h = card.querySelector('.topic-card-header');
        if (h) h.setAttribute('aria-expanded', 'false');
    });

    // TOC click: open only that topic (no scroll), with animation
    tocLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var sectionId = link.getAttribute('data-section');
            if (!sectionId) return;
            e.preventDefault();
            topicCards.forEach(function (card) {
                if (card.id === sectionId) {
                    card.classList.remove('collapsed');
                    var h = card.querySelector('.topic-card-header');
                    if (h) h.setAttribute('aria-expanded', 'true');
                } else {
                    card.classList.add('collapsed');
                    var h = card.querySelector('.topic-card-header');
                    if (h) h.setAttribute('aria-expanded', 'false');
                }
            });
            tocLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
            // Scroll the opened topic to the top after expand animation finishes
            var targetCard = document.getElementById(sectionId);
            if (targetCard) {
                var scrollMargin = 24;
                setTimeout(function () {
                    var rect = targetCard.getBoundingClientRect();
                    var top = (window.pageYOffset || document.documentElement.scrollTop) + rect.top - scrollMargin;
                    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                }, 450);
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

    // === Interview Question Accordion (keyboard) ===
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            var el = document.activeElement;
            if (el && el.classList.contains('iq-question')) {
                e.preventDefault();
                el.click();
            }
        }
    });

    // === Sort topics by difficulty: Beginner → Intermediate → Advanced ===
    (function sortByDifficulty() {
        if (!topicCards.length) return;
        var order = { beginner: 0, intermediate: 1, advanced: 2 };
        var container = topicCards[0].parentNode;
        var cards = Array.prototype.slice.call(topicCards);

        cards.sort(function (a, b) {
            var da = order[a.getAttribute('data-difficulty')] !== undefined ? order[a.getAttribute('data-difficulty')] : 99;
            var db = order[b.getAttribute('data-difficulty')] !== undefined ? order[b.getAttribute('data-difficulty')] : 99;
            return da - db;
        });

        // Re-insert cards in sorted order (non-card siblings stay in place)
        cards.forEach(function (card) { container.appendChild(card); });

        // Re-order TOC links to match
        if (tocLinks.length) {
            var tocContainer = tocLinks[0].parentNode;
            var cardIndexMap = {};
            cards.forEach(function (card, i) { cardIndexMap[card.id] = i; });
            var links = Array.prototype.slice.call(tocLinks);
            links.sort(function (a, b) {
                var ia = cardIndexMap[a.getAttribute('data-section')];
                var ib = cardIndexMap[b.getAttribute('data-section')];
                return (ia !== undefined ? ia : 99) - (ib !== undefined ? ib : 99);
            });
            links.forEach(function (link) { tocContainer.appendChild(link); });
        }
    })();

    updateProgress();
    setTimeout(updateTocHighlight, 100);
})();
