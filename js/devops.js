(function () {
  'use strict';

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

  var STORAGE_KEY = 'devops_reviewed';
  var activeFilter = 'all';

  // === Sidebar Toggle (Mobile) ===
  if (toggle) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('visible');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    });
  }

  // === Load reviewed state from localStorage ===
  function getReviewed() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) { return []; }
  }
  function saveReviewed(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function updateProgress() {
    var reviewed = getReviewed();
    var total = topicCards.length;
    var count = 0;

    topicCards.forEach(function (card) {
      var id = card.id;
      var isReviewed = reviewed.indexOf(id) !== -1;
      card.classList.toggle('reviewed', isReviewed);
      if (isReviewed) count++;
    });

    tocLinks.forEach(function (link) {
      var section = link.getAttribute('data-section');
      link.classList.toggle('reviewed', reviewed.indexOf(section) !== -1);
    });

    if (progressFill) {
      progressFill.style.width = (total > 0 ? (count / total * 100) : 0) + '%';
    }
    if (progressText) {
      progressText.textContent = count + ' / ' + total + ' reviewed';
    }
  }

  // === Review Button Click ===
  document.querySelectorAll('.review-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.topic-card');
      if (!card) return;
      var id = card.id;
      var reviewed = getReviewed();
      var idx = reviewed.indexOf(id);
      if (idx === -1) {
        reviewed.push(id);
      } else {
        reviewed.splice(idx, 1);
      }
      saveReviewed(reviewed);
      updateProgress();
    });
  });

  // === Expand / Collapse Topic Cards ===
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
      var query = searchInput.value.toLowerCase().trim();
      filterTopics(query, activeFilter);
    });
  }

  // === Filter Chips ===
  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filterTopics(query, activeFilter);
    });
  });

  function filterTopics(query, difficulty) {
    topicCards.forEach(function (card) {
      var keywords = (card.getAttribute('data-keywords') || '') + ' ' +
                     (card.querySelector('h2') ? card.querySelector('h2').textContent.toLowerCase() : '');
      var cardDifficulty = card.getAttribute('data-difficulty') || '';
      var matchesSearch = !query || keywords.indexOf(query) !== -1;
      var matchesFilter = difficulty === 'all' || cardDifficulty === difficulty;
      card.classList.toggle('hidden', !(matchesSearch && matchesFilter));
    });
  }

  // === Sticky TOC Highlight ===
  function updateTocHighlight() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var currentId = null;

    topicCards.forEach(function (card) {
      if (card.classList.contains('hidden')) return;
      var rect = card.getBoundingClientRect();
      if (rect.top <= 150) {
        currentId = card.id;
      }
    });

    tocLinks.forEach(function (link) {
      var section = link.getAttribute('data-section');
      link.classList.toggle('active', section === currentId);
    });
  }

  window.addEventListener('scroll', updateTocHighlight, { passive: true });
  window.addEventListener('scroll', function () {
    if (scrollTopBtn) {
      var show = (window.pageYOffset || document.documentElement.scrollTop) > 400;
      scrollTopBtn.classList.toggle('visible', show);
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === Keyboard Navigation ===
  document.addEventListener('keydown', function (e) {
    // Cmd/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  // === Initialize ===
  updateProgress();
  setTimeout(updateTocHighlight, 100);

})();
