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

    // === Database Services Animation ===
    (function initDatabaseAnimation() {
        var panel = document.querySelector('.db-animation-panel');
        if (!panel) return;

        var tabs = panel.querySelectorAll('.db-service-tab');
        var serviceName = document.getElementById('dbAnimationService');
        var serviceUse = document.getElementById('dbAnimationUse');
        var serviceWhy = document.getElementById('dbAnimationWhy');
        var servicePhrase = document.getElementById('dbAnimationPhrase');
        var serviceOrder = ['aurora', 'dynamodb', 'elasticache', 'redshift', 'documentdb', 'neptune'];
        var activeService = 'aurora';
        var serviceDetails = {
            aurora: {
                name: 'Aurora / RDS',
                use: 'You need SQL joins, relational constraints, and transactional writes.',
                why: 'Managed relational database with Multi-AZ, backups, read replicas, and Aurora\'s distributed storage option.',
                phrase: 'Start with Aurora for production MySQL/PostgreSQL when consistency and relational modeling matter.'
            },
            dynamodb: {
                name: 'DynamoDB',
                use: 'You know the access patterns and need single-digit millisecond reads or writes at massive scale.',
                why: 'Serverless key-value and document store with on-demand capacity, global tables, TTL, streams, and predictable latency.',
                phrase: 'Choose DynamoDB when the access pattern is simple, high-volume, and can be modeled around partition keys.'
            },
            elasticache: {
                name: 'ElastiCache',
                use: 'The database is correct but hot reads, sessions, counters, or leaderboards need sub-millisecond response.',
                why: 'Redis or Memcached keeps frequently accessed data in memory so the primary database handles fewer repeated reads.',
                phrase: 'Add ElastiCache as a cache-aside layer when latency and read pressure are the bottlenecks.'
            },
            redshift: {
                name: 'Redshift',
                use: 'Analysts need joins, aggregations, and dashboards across large historical datasets.',
                why: 'Columnar MPP warehouse optimized for OLAP queries, compression, spectrum access, and BI workloads.',
                phrase: 'Pick Redshift for analytics, not transactional app reads; it is built for scan-heavy reporting.'
            },
            documentdb: {
                name: 'DocumentDB',
                use: 'Records have flexible JSON-like structure and the team wants MongoDB-compatible APIs.',
                why: 'Managed document database for evolving schemas, nested attributes, and application-owned document models.',
                phrase: 'Use DocumentDB when flexible document shape matters more than joins or relational integrity.'
            },
            neptune: {
                name: 'Neptune',
                use: 'The question is about relationships: paths, recommendations, fraud rings, dependencies, or knowledge graphs.',
                why: 'Purpose-built graph database supporting Gremlin and openCypher for fast traversal across connected data.',
                phrase: 'Choose Neptune when the relationships are the data model, not just a few foreign keys.'
            }
        };

        function setActiveService(service) {
            var details = serviceDetails[service];
            if (!details) return;
            activeService = service;
            // Highlight matching SVG row; dim all others
            panel.querySelectorAll('.db-row').forEach(function (row) {
                var isActive = row.getAttribute('data-for') === service;
                row.classList.toggle('db-active', isActive);
                row.classList.toggle('db-dim', !isActive);
            });
            tabs.forEach(function (tab) {
                var selected = tab.getAttribute('data-db-service') === service;
                tab.classList.toggle('active', selected);
                tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            });
            if (serviceName) serviceName.textContent = details.name;
            if (serviceUse) serviceUse.textContent = details.use;
            if (serviceWhy) serviceWhy.textContent = details.why;
            if (servicePhrase) servicePhrase.textContent = details.phrase;
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                setActiveService(tab.getAttribute('data-db-service'));
            });
        });

        setActiveService(activeService);
    })();

    // === Serverless Services Animation ===
    (function initServerlessAnimation() {
        var panel = document.querySelector('.sls-animation-panel');
        if (!panel) return;

        var tabs = panel.querySelectorAll('.sls-service-tab');
        var serviceName = document.getElementById('slsAnimationService');
        var serviceUse = document.getElementById('slsAnimationUse');
        var serviceWhy = document.getElementById('slsAnimationWhy');
        var servicePhrase = document.getElementById('slsAnimationPhrase');
        var slsHighlight = {
            lambda:        { nodes: ['sls-ng-client', 'sls-ng-apigateway', 'sls-ng-lambda'], edges: ['sls-e-apigw', 'sls-e-lambda', 'sls-e-sqs', 'sls-e-sns', 'sls-e-eventbridge', 'sls-e-stepfunctions'] },
            apigateway:    { nodes: ['sls-ng-client', 'sls-ng-apigateway'], edges: ['sls-e-apigw'] },
            sqs:           { nodes: ['sls-ng-client', 'sls-ng-apigateway', 'sls-ng-lambda', 'sls-ng-sqs'], edges: ['sls-e-apigw', 'sls-e-lambda', 'sls-e-sqs'] },
            sns:           { nodes: ['sls-ng-client', 'sls-ng-apigateway', 'sls-ng-lambda', 'sls-ng-sns'], edges: ['sls-e-apigw', 'sls-e-lambda', 'sls-e-sns'] },
            eventbridge:   { nodes: ['sls-ng-client', 'sls-ng-apigateway', 'sls-ng-lambda', 'sls-ng-eventbridge'], edges: ['sls-e-apigw', 'sls-e-lambda', 'sls-e-eventbridge'] },
            stepfunctions: { nodes: ['sls-ng-client', 'sls-ng-apigateway', 'sls-ng-lambda', 'sls-ng-stepfunctions'], edges: ['sls-e-apigw', 'sls-e-lambda', 'sls-e-stepfunctions'] },
            fargate:       { nodes: ['sls-ng-client', 'sls-ng-apigateway', 'sls-ng-fargate'], edges: ['sls-e-apigw', 'sls-e-fargate'] }
        };
        var serviceDetails = {
            lambda: {
                name: 'Lambda',
                use: 'You need short-lived event-driven code with no servers to manage.',
                why: 'Lambda scales per invocation and charges only for requests and duration.',
                phrase: 'Choose Lambda for bursty, stateless work under 15 minutes.'
            },
            apigateway: {
                name: 'API Gateway',
                use: 'Clients need a secure HTTP, REST, or WebSocket front door for backend services.',
                why: 'API Gateway handles routing, auth integration, throttling, request validation, and custom domains.',
                phrase: 'Put API Gateway in front when the serverless workload starts with an external API call.'
            },
            stepfunctions: {
                name: 'Step Functions',
                use: 'A process has multiple steps, retries, approvals, branching, or long-running coordination.',
                why: 'State machines make orchestration explicit instead of hiding workflow state inside Lambda code.',
                phrase: 'Use Step Functions when the business process is more important than any single function.'
            },
            eventbridge: {
                name: 'EventBridge',
                use: 'Services need to publish and react to events without tight coupling.',
                why: 'EventBridge routes events by rules, supports SaaS sources, archive/replay, and cross-account patterns.',
                phrase: 'Choose EventBridge for event-driven integration and domain event routing.'
            },
            sqs: {
                name: 'SQS',
                use: 'Producers and consumers run at different speeds and need durable buffering.',
                why: 'SQS absorbs spikes, retries failed work, and protects downstream systems from overload.',
                phrase: 'Use SQS when reliability and back-pressure matter more than instant fan-out.'
            },
            sns: {
                name: 'SNS',
                use: 'One event must notify many subscribers at the same time.',
                why: 'SNS fan-out sends messages to queues, functions, HTTP endpoints, email, or mobile push targets.',
                phrase: 'Use SNS for pub/sub broadcast; pair it with SQS when subscribers need durability.'
            },
            fargate: {
                name: 'Fargate',
                use: 'The workload is containerized, longer-running, or needs more control than Lambda limits allow.',
                why: 'Fargate runs containers without managing EC2 hosts while supporting custom runtimes and steady services.',
                phrase: 'Choose Fargate when serverless operations are desired but the unit of work is a container.'
            }
        };

        function setActiveService(service) {
            var details = serviceDetails[service];
            if (!details) return;
            var hl = slsHighlight[service] || { nodes: [], edges: [] };
            // Highlight nodes on the active path; dim others
            panel.querySelectorAll('.sls-ng').forEach(function (g) {
                var active = hl.nodes.some(function (cls) { return g.classList.contains(cls); });
                g.classList.toggle('sls-active', active);
                g.classList.toggle('sls-dim', !active);
            });
            // Draw active edges; hide others
            panel.querySelectorAll('.sls-edge').forEach(function (line) {
                var active = hl.edges.some(function (cls) { return line.classList.contains(cls); });
                line.classList.toggle('sls-edge-active', active);
            });
            tabs.forEach(function (tab) {
                var selected = tab.getAttribute('data-sls-service') === service;
                tab.classList.toggle('active', selected);
                tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            });
            if (serviceName) serviceName.textContent = details.name;
            if (serviceUse) serviceUse.textContent = details.use;
            if (serviceWhy) serviceWhy.textContent = details.why;
            if (servicePhrase) servicePhrase.textContent = details.phrase;
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                setActiveService(tab.getAttribute('data-sls-service'));
            });
        });

        setActiveService('lambda');
    })();

    // === Security Flow Animation ===
    (function initSecurityFlowAnimation() {
        var panel = document.querySelector('.sec-flow-panel');
        if (!panel) return;

        var tabs = panel.querySelectorAll('.sec-flow-tab');
        var stepName = document.getElementById('secFlowStep');
        var stepWhat = document.getElementById('secFlowWhat');
        var stepServices = document.getElementById('secFlowServices');
        var stepPhrase = document.getElementById('secFlowPhrase');
        var stepOrder = ['edge', 'identity', 'network', 'data', 'detect', 'respond'];
        var stepDetails = {
            edge: {
                name: 'Edge protection',
                what: 'CloudFront, AWS WAF, and Shield evaluate incoming traffic before it reaches the application.',
                services: 'AWS WAF, Shield, CloudFront, Route 53, AWS Firewall Manager.',
                phrase: 'Start at the edge: block known bad patterns early and reduce load before IAM or app code runs.'
            },
            identity: {
                name: 'IAM decision',
                what: 'AWS evaluates authentication, identity policies, resource policies, permission boundaries, SCPs, and explicit denies.',
                services: 'IAM, IAM Identity Center, STS, Organizations SCPs, resource-based policies.',
                phrase: 'Every AWS action is an API call; authorization is the center of the security model.'
            },
            network: {
                name: 'Network guardrails',
                what: 'Traffic is constrained by VPC routing, security groups, NACLs, private endpoints, and firewall inspection.',
                services: 'VPC, Security Groups, NACLs, VPC Endpoints, Network Firewall, Transit Gateway.',
                phrase: 'Use network controls as blast-radius guardrails, not as a replacement for IAM least privilege.'
            },
            data: {
                name: 'Data protection',
                what: 'Sensitive data is encrypted, keys are governed, and secrets are retrieved without hard-coding credentials.',
                services: 'KMS, CloudHSM, Secrets Manager, ACM, S3 Block Public Access, Macie.',
                phrase: 'Protect data with encryption, key policy design, rotation, and clear ownership of secrets.'
            },
            detect: {
                name: 'Detection',
                what: 'Activity logs and findings are analyzed for risky configuration, anomalous behavior, and known threat patterns.',
                services: 'CloudTrail, CloudWatch, GuardDuty, Config, Inspector, Security Hub.',
                phrase: 'Assume prevention will miss something; centralize logs and findings so detection is fast.'
            },
            respond: {
                name: 'Response',
                what: 'Findings trigger notifications, tickets, automated isolation, key rotation, or rollback workflows.',
                services: 'EventBridge, Security Hub, Systems Manager Automation, Lambda, SNS, Incident Manager.',
                phrase: 'A strong answer closes the loop: detect, prioritize, notify, remediate, and preserve evidence.'
            }
        };

        function setActiveStep(step) {
            var details = stepDetails[step];
            if (!details) return;
            var activeIdx = stepOrder.indexOf(step);
            // Mark pipeline stages as passed / active / waiting
            panel.querySelectorAll('.sec-stage').forEach(function (g, i) {
                g.classList.remove('sec-passed', 'sec-active', 'sec-waiting');
                if (i < activeIdx) g.classList.add('sec-passed');
                else if (i === activeIdx) g.classList.add('sec-active');
                else g.classList.add('sec-waiting');
            });
            // Color connecting arrows accordingly
            panel.querySelectorAll('.sec-arr').forEach(function (arr) {
                arr.classList.remove('sec-arr-passed', 'sec-arr-active');
            });
            stepOrder.forEach(function (s, i) {
                var arr = panel.querySelector('.sec-arr-' + s);
                if (!arr) return;
                if (i < activeIdx) arr.classList.add('sec-arr-passed');
                else if (i === activeIdx) arr.classList.add('sec-arr-active');
            });
            tabs.forEach(function (tab) {
                var selected = tab.getAttribute('data-sec-step') === step;
                tab.classList.toggle('active', selected);
                tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            });
            if (stepName) stepName.textContent = details.name;
            if (stepWhat) stepWhat.textContent = details.what;
            if (stepServices) stepServices.textContent = details.services;
            if (stepPhrase) stepPhrase.textContent = details.phrase;
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                setActiveStep(tab.getAttribute('data-sec-step'));
            });
        });

        setActiveStep('edge');
    })();

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
