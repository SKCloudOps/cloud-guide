import React, { useState } from 'react';

// ── Full Interview Guide Tab ──────────────────────────────────────────────────
const GuideTab = ({ categories, allQuestions }) => {
  const [openSection, setOpenSection] = useState(null);
  const [openQ, setOpenQ] = useState(null);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const catOrder = ['platform','mobile','kubernetes','cicd','terraform','behavioral','system','aws','devsecops','observability','stakeholder','career'];

  const filteredCats = catOrder.map(key => {
    const cat = categories[key];
    if (!cat) return null;
    const qs = cat.questions.filter(q => {
      const matchSearch = !search || q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase());
      const matchLevel = filterLevel === 'All' || q.level === filterLevel;
      return matchSearch && matchLevel;
    });
    return { key, ...cat, questions: qs };
  }).filter(c => c && c.questions.length > 0);

  const totalVisible = filteredCats.reduce((s, c) => s + c.questions.length, 0);

  const levelColor = (level) => ({
    'Senior': { bg: '#fef3c7', text: '#92400e' },
    'Mid-Senior': { bg: '#e0e7ff', text: '#3730a3' },
    'All': { bg: '#f0fdf4', text: '#166534' },
  }[level] || { bg: '#f1f5f9', text: '#475569' });

  const formatGuideAnswer = (text) => {
    return text.split('\n').map((line, i) => {
      const s = line.trim();
      if (!s) return <div key={i} style={{ height: '10px' }} />;
      if (/^\*\*[^*]+:\*\*$/.test(s)) {
        return <div key={i} style={{ fontWeight: '700', color: '#1d4ed8', fontSize: '14px', marginTop: '18px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.replace(/\*\*/g, '')}</div>;
      }
      if (s.startsWith('## ')) return <div key={i} style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '15px', marginTop: '20px', marginBottom: '8px' }}>{s.slice(3)}</div>;
      if (s.startsWith('### ')) return <div key={i} style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginTop: '14px', marginBottom: '5px' }}>{s.slice(4)}</div>;
      if (s.startsWith('• ') || s.startsWith('- ')) {
        return <div key={i} style={{ display: 'flex', gap: '10px', marginTop: '5px', paddingLeft: '8px' }}>
          <span style={{ color: '#3b82f6', fontWeight: '700', flexShrink: 0 }}>•</span>
          <span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7' }}>{s.slice(2)}</span>
        </div>;
      }
      if (/^\d+\.\s/.test(s)) {
        const n = s.match(/^\d+/)[0];
        return <div key={i} style={{ display: 'flex', gap: '10px', marginTop: '5px', paddingLeft: '8px' }}>
          <span style={{ color: '#3b82f6', fontWeight: '700', flexShrink: 0, minWidth: '18px' }}>{n}.</span>
          <span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7' }}>{s.replace(/^\d+\.\s/, '')}</span>
        </div>;
      }
      // inline bold
      const parts = s.split(/\*\*([^*]+)\*\*/g);
      return <div key={i} style={{ color: '#374151', fontSize: '14px', lineHeight: '1.75', marginTop: '5px' }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
      </div>;
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Guide Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        borderRadius: '12px',
        padding: '28px 32px',
        marginBottom: '24px',
        color: 'white',
      }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700' }}>📋 Complete Interview Reference Guide</h2>
        <p style={{ margin: '0 0 20px', opacity: 0.8, fontSize: '14px' }}>All {allQuestions.length} questions across {catOrder.filter(k => categories[k]).length} categories — searchable, filterable, printable</p>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            placeholder="🔍  Search questions and answers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: '240px', padding: '10px 16px',
              borderRadius: '8px', border: 'none', fontSize: '14px',
              background: 'rgba(255,255,255,0.12)', color: 'white', outline: 'none',
            }}
          />
          {['All', 'Senior', 'Mid-Senior'].map(l => (
            <button key={l} onClick={() => setFilterLevel(l)} style={{
              padding: '10px 18px', borderRadius: '8px', border: 'none',
              background: filterLevel === l ? '#3b82f6' : 'rgba(255,255,255,0.1)',
              color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>
        {(search || filterLevel !== 'All') && (
          <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.8 }}>
            Showing {totalVisible} of {allQuestions.length} questions
          </div>
        )}
      </div>

      {/* Category Sections */}
      {filteredCats.map(cat => (
        <div key={cat.key} style={{ marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Section Header */}
          <div
            onClick={() => setOpenSection(openSection === cat.key ? null : cat.key)}
            style={{
              background: openSection === cat.key ? 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' : '#1e293b',
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>{cat.icon}</span>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>{cat.title}</div>
                <div style={{ color: '#93c5fd', fontSize: '12px', marginTop: '2px' }}>
                  {cat.questions.length} question{cat.questions.length !== 1 ? 's' : ''}
                  {search || filterLevel !== 'All' ? ' matching' : ''}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Progress pills */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Senior','Mid-Senior','All'].map(lv => {
                  const count = cat.questions.filter(q => q.level === lv).length;
                  if (!count) return null;
                  const lc = levelColor(lv);
                  return <span key={lv} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: lc.bg, color: lc.text, fontWeight: '600' }}>{count} {lv}</span>;
                })}
              </div>
              <span style={{ color: '#93c5fd', fontSize: '16px', transform: openSection === cat.key ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
            </div>
          </div>

          {/* Questions */}
          {openSection === cat.key && (
            <div style={{ background: 'white' }}>
              {cat.questions.map((item, idx) => (
                <div key={item.id} style={{ borderBottom: idx < cat.questions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  {/* Question row */}
                  <div
                    onClick={() => setOpenQ(openQ === item.id ? null : item.id)}
                    style={{
                      padding: '14px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      background: openQ === item.id ? '#f8fafc' : 'white',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                      background: '#eff6ff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#2563eb',
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontWeight: '700',
                          background: levelColor(item.level).bg, color: levelColor(item.level).text,
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>{item.level}</span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', lineHeight: '1.5' }}>{item.q}</div>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0, marginTop: '6px', transform: openQ === item.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                  </div>

                  {/* Answer + Tips */}
                  {openQ === item.id && (
                    <div style={{ padding: '0 20px 20px 62px', background: '#fafafa' }}>
                      {/* Answer */}
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '0 12px 12px 0', padding: '20px 24px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Sample Answer</div>
                        {formatGuideAnswer(item.a)}
                      </div>
                      {/* Tips */}
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '18px 22px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚡ Pro Tips</div>
                        {item.tips.map((tip, i) => (
                          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '7px' }}>
                            <span style={{ color: '#f59e0b', fontWeight: '700', flexShrink: 0, fontSize: '16px' }}>›</span>
                            <span style={{ fontSize: '13.5px', color: '#78350f', lineHeight: '1.7' }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {filteredCats.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '16px' }}>
          No questions match your search. Try a different term.
        </div>
      )}

      {/* Guide footer */}
      <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
        💪 {allQuestions.length} questions covered · Platform Engineering + Mobile CI/CD is a rare and valuable combination
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const InterviewPrep = () => {
  const [activeCategory, setActiveCategory] = useState('platform');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [activeTab, setActiveTab] = useState('questions');

  const toggleComplete = (id) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedQuestions(newCompleted);
  };

  // Simple markdown-like parser for formatting
  const formatAnswer = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let inCodeBlock = false;
    let codeContent = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {listItems.map((item, i) => (
              <li key={i} style={{ marginBottom: '4px', lineHeight: '1.6' }}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      // Code block handling
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${elements.length}`} style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '12px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              overflow: 'auto',
              margin: '12px 0',
              fontFamily: 'Monaco, Consolas, monospace',
            }}>
              {codeContent.join('\n')}
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${index}`} style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '16px 0 8px' }}>
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} style={{ fontSize: '15px', fontWeight: '600', color: '#1e40af', margin: '16px 0 8px' }}>
            {line.replace('## ', '')}
          </h3>
        );
        return;
      }

      // Bold headers (like **Section:**)
      if (line.match(/^\*\*[^*]+:\*\*$/)) {
        flushList();
        const headerText = line.replace(/\*\*/g, '');
        elements.push(
          <div key={`header-${index}`} style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#3b82f6', 
            margin: '14px 0 6px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {headerText}
          </div>
        );
        return;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        flushList();
        const content = line.replace(/^\d+\.\s/, '');
        const formatted = content.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
        listItems.push(formatted);
        return;
      }

      // Bullet points
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().replace(/^[•-]\s/, '');
        const formatted = content.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
        listItems.push(formatted);
        return;
      }

      // Empty lines
      if (line.trim() === '') {
        flushList();
        return;
      }

      // Regular paragraphs
      flushList();
      const formatted = line.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
      elements.push(
        <p key={`p-${index}`} style={{ margin: '8px 0', lineHeight: '1.7' }}>
          {formatted}
        </p>
      );
    });

    flushList();
    return elements;
  };

  const categories = {
    platform: {
      title: 'Platform Engineering Core',
      icon: '🏗️',
      questions: [
        {
          id: 'plat1',
          level: 'Senior',
          q: 'What is Platform Engineering and how does it differ from DevOps?',
          a: `**Platform Engineering Definition:**

Platform Engineering is the discipline of designing and building toolchains and workflows that enable self-service capabilities for software engineering organizations. It focuses on building Internal Developer Platforms (IDPs).

**Key Differences from DevOps:**

• DevOps focuses on culture and practices; Platform Engineering focuses on product-minded infrastructure
• DevOps serves Ops + Dev collaboration; Platform Engineering treats developers as customers
• DevOps outputs processes and automation; Platform Engineering outputs self-service platforms
• DevOps measures deployment frequency; Platform Engineering measures developer productivity

**Platform Engineering Principles:**

• Product Thinking: Treat platform as an internal product
• Self-Service: Developers provision without tickets
• Golden Paths: Opinionated, paved roads for common tasks
• Abstraction: Hide complexity, expose simplicity
• Developer Experience (DevEx): Measure and optimize DX

**My Platform Engineering Experience:**

• Built self-service CI/CD pipelines (GitHub Actions + Harness)
• Created golden paths for containerized deployments to EKS
• Implemented developer portal concepts with standardized templates
• Reduced onboarding time for new services from weeks to hours
• Eliminated ticket-based infrastructure requests for common patterns
• Owned mobile platform engineering for iOS and Android builds`,
          tips: [
            'Emphasize "product mindset" for internal tools',
            'Know the CNCF Platform Engineering whitepaper',
            'Mention Team Topologies concepts',
            'Discuss developer experience metrics'
          ]
        },
        {
          id: 'plat2',
          level: 'Senior',
          q: 'How would you design an Internal Developer Platform (IDP)?',
          a: `**IDP Architecture Layers:**

**1. Developer Interface Layer:**
• Developer Portal (Backstage, Port, Cortex)
• Service Catalog with templates
• Documentation hub
• Self-service UI for provisioning

**2. Integration & Orchestration Layer:**
• CI/CD pipelines (GitHub Actions, Harness)
• GitOps controllers (ArgoCD, Flux)
• Workflow automation
• API gateway for platform services

**3. Platform Capabilities Layer:**
• Infrastructure provisioning (Terraform, Crossplane)
• Container orchestration (Kubernetes/EKS)
• Observability stack (Prometheus, Grafana, ELK)
• Security & compliance automation
• Mobile build infrastructure (Mac runners, Fastlane)

**4. Infrastructure Layer:**
• Cloud providers (AWS, GCP, Azure)
• Networking & connectivity
• Storage & databases
• Identity & access management

**My Implementation Approach:**

• Started with CI/CD standardization (GitHub Actions)
• Added self-service Kubernetes deployments via Helm templates
• Integrated secrets management (Vault) seamlessly
• Created reusable Terraform modules for common infra
• Built observability as default for all services
• Established mobile build platform for enterprise apps

**Key Success Metrics:**
• Time to first deployment for new services
• Developer satisfaction scores (NPS)
• Platform adoption rate
• Reduction in support tickets`,
          tips: [
            'Draw the layered architecture',
            'Emphasize starting small and iterating',
            'Discuss build vs buy decisions',
            'Mention measuring developer productivity'
          ]
        },
        {
          id: 'plat3',
          level: 'Senior',
          q: 'Explain "Golden Paths" and how you would implement them.',
          a: `**Golden Path Definition:**

A Golden Path is a pre-built, opinionated, and supported way for developers to accomplish common tasks. It's the "paved road" that makes the right thing the easy thing.

**Characteristics of Good Golden Paths:**

• Opinionated but not restrictive: Defaults that work for 80% of cases
• Self-service: No tickets or approvals for standard paths
• Well-documented: Clear guidance and examples
• Maintained: Regular updates and support
• Observable: Built-in monitoring and logging

**Golden Paths I Implemented:**

**New Backend Service Creation:**
Developer runs a template and gets:
• GitHub repo created with CI/CD
• Dockerfile + Helm chart
• Dev/Staging/Prod environments
• Monitoring dashboards
• Secrets management configured
• Documentation generated

**Mobile App Release Path:**
Developer triggers release and gets:
• Automated version bumping
• iOS build with proper signing
• Android build with keystore management
• TestFlight/Play Store deployment
• Release notes generation
• Slack notifications

**Database Provisioning:**
• Self-service RDS creation via Terraform modules
• Automatic backup configuration
• Secrets injected via Vault
• Monitoring pre-configured

**Governance Approach:**
• Golden paths are the default, not mandatory
• Teams can deviate with justification
• Platform team reviews and learns from deviations
• Successful patterns become new golden paths`,
          tips: [
            'Give concrete examples from your experience',
            'Discuss the balance between flexibility and standardization',
            'Mention how you handle edge cases',
            'Talk about measuring golden path adoption'
          ]
        },
        {
          id: 'plat4',
          level: 'Senior',
          q: 'How do you measure Platform Engineering success?',
          a: `**Developer Productivity Metrics (DORA+):**

**1. DORA Metrics:**
• Deployment Frequency: How often code reaches production
• Lead Time for Changes: Commit to production time
• Change Failure Rate: Percentage of deployments causing issues
• Mean Time to Recovery: Time to restore service

**2. Platform-Specific Metrics:**

**Developer Experience:**
• Time to first deployment (new service)
• Onboarding time for new developers
• Developer satisfaction (NPS surveys)
• Self-service adoption rate

**Platform Health:**
• Platform availability/uptime
• Build/deploy success rate
• Time to provision infrastructure
• Support ticket volume (should decrease)

**Mobile Platform Metrics:**
• iOS/Android build success rate
• Time from commit to TestFlight
• Code signing success rate
• Release cycle time

**Business Impact:**
• Engineering time saved
• Cost per deployment
• Time to market for features

**My Measured Results:**

• Reduced new service onboarding: 2 weeks to 2 hours
• CI/CD reliability: 95% to 99.5%
• Self-service adoption: 85% of deployments
• Support tickets reduced by 60%
• Developer NPS: +45
• Mobile build time: 45 min to 15 min (iOS)`,
          tips: [
            'Know DORA metrics inside out',
            'Have specific numbers from your experience',
            'Discuss qualitative + quantitative measures',
            'Mention continuous improvement based on metrics'
          ]
        },
        {
          id: 'plat5',
          level: 'Senior',
          q: 'How do you handle platform adoption and change management?',
          a: `**Platform Adoption Strategy:**

**1. Product Mindset:**
• Treat developers as customers
• Regular user research and feedback
• Roadmap based on developer needs
• Marketing internal capabilities

**2. Adoption Tactics:**

**Early Adopter Program:**
• Identify 2-3 willing teams
• Co-develop features with them
• Use their success as case studies
• Build internal champions

**Documentation & Enablement:**
• Comprehensive getting started guides
• Video tutorials and workshops
• Office hours for support
• Slack channel for quick help

**Gradual Migration:**
• Run old and new systems in parallel
• Provide migration tooling
• Set realistic timelines
• Celebrate migrations

**3. My Change Management Example (Jenkins to GitHub Actions):**

**Communication:**
• Explained benefits clearly (30% faster builds)
• Addressed concerns proactively
• Regular updates on progress

**Support:**
• Hands-on migration assistance
• Templates for common patterns
• Dedicated Slack channel

**Incentives:**
• Early adopters got priority support
• Gamification of migration progress
• Recognition for teams who migrated

**Results:**
• 60+ pipelines migrated
• Zero forced migrations
• High developer satisfaction
• Natural deprecation of Jenkins`,
          tips: [
            'Emphasize empathy for developers',
            'Share specific change management examples',
            'Discuss handling resistance',
            'Mention building internal champions'
          ]
        },
        {
          id: 'plat6',
          level: 'Mid-Senior',
          q: 'What is Platform as a Product? How do you apply product thinking?',
          a: `**Platform as a Product Philosophy:**

Treating your internal platform like a product means applying product management principles: understanding users, building roadmaps, measuring success, and iterating.

**Key Principles:**

**1. Know Your Users:**
• Conduct developer interviews
• Shadow developers to understand pain points
• Create developer personas
• Map developer journeys

**2. Define Value Proposition:**
• What problems does the platform solve?
• What's the alternative (DIY, tickets)?
• Quantify time/cost savings

**3. Build a Roadmap:**
• Prioritize based on impact
• Balance quick wins with strategic features
• Communicate roadmap transparently
• Accept feature requests, prioritize ruthlessly

**4. Measure & Iterate:**
• Track adoption metrics
• Gather continuous feedback
• A/B test new features
• Deprecate unused features

**My Product Approach:**

**User Research:**
• Monthly developer surveys
• Quarterly roadmap reviews with stakeholders
• Feature request tracking in backlog

**Communication:**
• Platform newsletter (monthly)
• Demo days for new features
• Transparent roadmap

**Iteration Example:**
1. Heard feedback: "Mobile releases take too long"
2. Researched: Average 2 days for iOS release
3. Built: Automated Fastlane pipeline with signing
4. Measured: Reduced to 15 minutes
5. Iterated: Added Android, then automated versioning`,
          tips: [
            'Show product management skills',
            'Discuss user research methods',
            'Mention roadmap prioritization',
            'Talk about feature lifecycle'
          ]
        },
        {
          id: 'plat7',
          level: 'Senior',
          q: 'How do you handle platform versioning and backward compatibility?',
          a: `**Why Versioning Matters for Platforms:**

When your platform serves 50+ teams, a breaking change can cause widespread disruption. Versioning and backward compatibility are non-negotiable.

**Versioning Strategy:**

**Semantic Versioning for Platform APIs:**
• MAJOR: Breaking changes (e.g., new required fields in Helm values)
• MINOR: New features, backward compatible
• PATCH: Bug fixes, no API changes

**Deprecation Policy:**
• Announce deprecation at least one quarter ahead
• Run old and new versions in parallel during migration window
• Provide migration tooling and guides
• Hard deprecation only after >95% adoption of new version

**Practical Examples:**

**Helm Chart Versioning:**
Chart 1.x: supports old values schema
Chart 2.0: new required fields — teams get 2 sprints to migrate
Chart 1.x maintained with security patches during transition

**GitHub Actions Reusable Workflow Versioning:**
• Tag releases: v1, v2, v3
• Teams pin to major version: uses: company/platform/.github/workflows/deploy.yml@v2
• v1 maintained in parallel until <5% usage

**Breaking Change Communication:**
1. Announce in platform newsletter
2. Post in #platform-updates Slack with migration guide
3. Direct ping to affected team leads
4. Office hours dedicated to migration support
5. Set migration deadline with reminders

**Automated Migration Tooling:**
Where possible, provide scripts to auto-migrate configs:
• Helm values migration script
• Terraform module upgrade helper
• Pipeline template converter

**Result:**
• Zero production incidents from platform upgrades
• Team trust in platform stability
• Predictable upgrade cadence (quarterly major versions)`,
          tips: [
            'Show empathy for downstream teams when you break things',
            'Discuss parallel-running strategy during migrations',
            'Mention communication lead time is as important as technical work',
            'Talk about measuring migration adoption'
          ]
        },
        {
          id: 'plat8',
          level: 'Senior',
          q: 'How do you build a service catalog for an Internal Developer Platform?',
          a: `**Service Catalog Purpose:**

A service catalog gives developers a single place to discover, understand, and manage all services, APIs, and resources in the organization. It reduces "who owns X?" friction.

**What I Include in a Service Catalog:**

**Service Metadata:**
• Owner (team, on-call contact)
• Tier (business-critical, standard, experimental)
• Dependencies (upstream and downstream services)
• Tech stack (language, framework, database)
• Deployment target (EKS cluster, region, environment)
• SLO status (availability, latency)
• Documentation link, runbook link

**Backstage as the Implementation:**

**catalog-info.yaml per service (in repo):**
Component spec with name, type (service), owner, lifecycle (production/experimental), system, links to dashboard and runbook, tags for language and framework.

**Integrations:**
• GitHub: auto-import repos with catalog-info.yaml
• PagerDuty: show current on-call per service
• ArgoCD: deployment status per service
• Prometheus: SLO status pulled into catalog

**Discovery Features:**
• Search by team, tech stack, tier
• Dependency graph visualization
• API catalog (OpenAPI specs)
• Resource catalog (S3 buckets, databases, queues owned by service)

**My Implementation Journey:**
1. Started with manual catalog (spreadsheet) to validate value
2. Built lightweight YAML-based catalog in Confluence
3. Migrated to Backstage for self-service and integrations
4. Teams now register services themselves via PR to catalog repo

**Adoption:**
• Required for all new services (golden path includes catalog-info.yaml)
• Existing services onboarded gradually (50% in first quarter)
• Developer NPS comment: "Finally know who owns what"`,
          tips: [
            'Know Backstage architecture: plugins, catalog, scaffolder',
            'Discuss software templates vs service catalog difference',
            'Mention the "single pane of glass" value prop',
            'Talk about making catalog self-service, not a platform burden'
          ]
        },
        {
          id: 'plat9',
          level: 'Senior',
          q: 'Describe how you implement developer self-service for infrastructure provisioning.',
          a: `**Self-Service Philosophy:**

If a developer needs to open a ticket to get a database, they wait days and the platform team is a bottleneck. Self-service eliminates both problems.

**Self-Service Patterns I've Used:**

**1. PR-Based Terraform (GitOps IaC):**
Developer creates a PR adding a Terraform config file. CI runs plan and posts cost estimate to PR. Platform review only for non-standard patterns. Merge triggers apply. Full audit trail in Git.

**2. Backstage Software Templates (Scaffolder):**
Developer opens portal, selects "New RDS Database" template. Fills form: name, size, environment. Template creates GitHub PR with Terraform config. Automated pipeline provisions within 15 minutes.

**3. Kubernetes-Native with Crossplane:**
Developer applies a Kubernetes CR (custom resource) for a database. Crossplane controller provisions RDS in AWS automatically. Credentials injected into namespace secret. Truly declarative and self-service.

**What I Made Self-Service:**
• RDS PostgreSQL databases (3 sizes: small/medium/large)
• S3 buckets (with standard policies, versioning, encryption)
• SQS queues (standard and FIFO)
• Kubernetes namespaces (with quotas and RBAC)
• CI/CD pipelines (via GitHub Actions templates)
• DNS records (via External DNS annotations)

**Guardrails Built In:**
• Maximum sizes enforced per environment (no prod-size in dev)
• Mandatory tags injected automatically
• Cost estimate shown before provisioning
• Auto-delete for dev resources after 30 days

**Results:**
• Database provisioning: 3 days → 15 minutes
• Zero platform tickets for standard resources
• Teams provision ~20 self-service resources per week
• Platform team freed for higher-value work`,
          tips: [
            'Discuss Crossplane as Kubernetes-native alternative to Terraform',
            'Mention Backstage Scaffolder for portal-based self-service',
            'Talk about guardrails that make self-service safe',
            'Quantify the time saved per request'
          ]
        },
        {
          id: 'plat10',
          level: 'Senior',
          q: 'How do you approach platform documentation and developer onboarding?',
          a: `**Documentation as a Product:**

Bad docs = support tickets. Great docs = self-sufficient developers. I treat documentation with the same rigor as code.

**Documentation Structure I Use:**

**Docs-as-Code:**
• All docs in Git (markdown)
• Versioned alongside platform releases
• PRs for docs changes (review and merge)
• Rendered via MkDocs/Docusaurus or Backstage TechDocs

**Documentation Types:**

**Getting Started (15-minute goal):**
Developer reads this and deploys their first service within 15 minutes. Step-by-step, no assumptions.

**How-To Guides:**
• "How to add a new environment variable"
• "How to set up a database for my service"
• "How to debug a failing pipeline"
Short, task-focused, copy-paste friendly.

**Reference:**
• All Helm values documented with types, defaults, examples
• Reusable workflow inputs and outputs
• Terraform module variables

**Explanations (The Why):**
• Why we chose GitHub Actions over Jenkins
• How our secrets management works
• Why we use Helm chart library pattern

**Developer Onboarding Program:**

Day 1 checklist (automated via Backstage):
• Access provisioned (GitHub, AWS, Vault, EKS)
• Local dev environment setup guide
• Platform overview video (15 min)
• First PR deployed through platform

Week 1:
• Shadow on-call engineer for one day
• Complete platform self-paced modules
• Deploy a test service end-to-end

**Quality Signals:**
• Track support tickets about documented topics (signal docs failed)
• "Was this helpful?" rating on every doc page
• Analytics: most-viewed, least-viewed, dead-end pages
• Quarterly doc review sprint (delete stale content)

**Result:**
• New developer time-to-first-deployment: 2 weeks → 4 hours
• Documentation-related tickets down 60%
• Most common feedback: "Docs are actually useful"`,
          tips: [
            'Discuss docs-as-code workflow',
            'Mention Diátaxis documentation framework (tutorial/how-to/reference/explanation)',
            'Talk about measuring documentation quality',
            'Show documentation is a first-class deliverable, not an afterthought'
          ]
        },
        {
          id: 'plat11',
          level: 'Senior',
          q: 'How do you handle platform incidents — when the platform itself breaks?',
          a: `**Platform Incidents Are High-Impact:**

When the CI/CD platform breaks, 50+ teams can't deploy. When the secrets backend is down, pipelines fail everywhere. Platform incidents have a blast radius that amplifies.

**Preparation:**

**High Availability Architecture:**
• Vault: 3-node HA cluster with Raft storage
• ArgoCD: multi-replica, HA mode
• GitHub Actions: self-hosted runners with redundancy (minimum 3 runners per pool)
• Nexus/Artifactory: HA with replication

**Fallback Mechanisms:**
• Runners: if self-hosted down, fallback to GitHub-hosted (with limited secrets)
• Vault: if Vault down, services use cached credentials (short-term)
• Artifactory: if down, docker pull from ECR directly
• ArgoCD: GitOps state preserved in Git — redeploy recoverable

**Incident Response Specifics for Platform:**

**Communication Priority:**
Platform incidents get immediate broad communication — every team is potentially affected.

In #engineering-announcements within 5 minutes:
"PLATFORM INCIDENT: GitHub Actions self-hosted runners are down. Impact: all CI/CD pipelines blocked. We are investigating. ETA: 30 min. Workaround: use GitHub-hosted runners by removing runs-on: self-hosted."

**Triage Process:**
1. Is this total outage or partial? (which runners/regions affected)
2. Can teams work around it? Communicate workaround immediately
3. Root cause category: infra, config, dependency, capacity
4. Remediate: fix or failover

**Post-Incident:**
• RCA document shared org-wide within 48 hours
• Extra transparency because platform failures affect everyone
• Action items to improve resilience

**Proactive Measures:**
• Platform health status page (internal StatusPage)
• Synthetic monitoring: fake pipeline that runs every 5 min
• Runner health checks with auto-restart on failure

**Result:**
• Platform availability: 99.95%
• Mean time to communicate: < 5 minutes
• No platform incident lasting > 2 hours in last 12 months`,
          tips: [
            'Show awareness that platform incidents have outsized impact',
            'Discuss fallback mechanisms proactively designed',
            'Emphasize fast, broad communication',
            'Mention synthetic monitoring as early warning'
          ]
        },
        {
          id: 'plat12',
          level: 'Mid-Senior',
          q: 'How do you evaluate and decide when to build vs buy for platform capabilities?',
          a: `**Build vs Buy Framework:**

This is a recurring decision in platform engineering. Getting it wrong wastes months of engineering time or creates unnecessary vendor lock-in.

**Factors I Evaluate:**

**1. Core vs Context:**
• Core: unique differentiator for your business? Build.
• Context: commodity capability? Buy or use open source.
• Secrets management is context → use Vault, not custom tool
• Your Helm chart standards are core → build in-house

**2. Total Cost of Ownership:**
Build cost: Engineering time × months + ongoing maintenance + documentation + on-call burden.
Buy cost: License fee + integration time + vendor lock-in risk.

Often build looks "free" because it's internal headcount. It isn't.

**3. Operational Burden:**
• Will you be on-call for this?
• What's the upgrade cadence?
• What's the security patching story?

**4. Community and Longevity:**
• Open source: active community? CNCF graduation status?
• Vendor: financially stable? Acquisition risk?

**5. Customization Needs:**
• If you need 80% of a tool's features as-is → buy
• If you'd spend 6 months customizing → consider build

**Real Decisions I've Made:**

Buy/Use: Vault (secrets), ArgoCD (GitOps), Backstage (portal), Prometheus (metrics), Grafana (dashboards) — all strong open source with active communities.

Build: Internal Helm library charts, GitHub Actions reusable workflows, Terraform module library, custom Fastlane lanes — these are specific to our context.

**Anti-Pattern I Avoid:**
Building a custom secrets manager, custom CI/CD engine, or custom container registry — solved problems with better open source solutions.

**Decision Template:**
Scorecard with weights for: core vs context, TCO, operational burden, customization needed, community health. Scores drive transparent decisions.`,
          tips: [
            'Always include total cost of build including maintenance',
            'Discuss CNCF landscape as source of vetted tools',
            'Mention avoiding NIH (Not Invented Here) syndrome',
            'Show structured decision-making, not gut feel'
          ]
        },
        {
          id: 'plat13',
          level: 'Senior',
          q: 'How do you implement developer portals with Backstage?',
          a: `**Backstage Architecture:**

Backstage is a CNCF project (Spotify-origin) for building internal developer portals. Core components:

**Core Plugins:**
• Software Catalog: inventory of all services, APIs, resources
• Software Templates (Scaffolder): self-service project creation
• TechDocs: docs-as-code rendered in the portal
• Search: unified search across catalog and docs

**My Backstage Implementation Plan:**

**Phase 1: Catalog (Month 1)**
• Deploy Backstage with GitHub integration
• Auto-discover services via catalog-info.yaml in repos
• Show owner, tier, on-call, links per service
• Import existing services via bulk catalog import

**Phase 2: TechDocs (Month 2)**
• Migrate platform docs from Confluence to TechDocs
• mkdocs.yml in each service repo for service-specific docs
• Auto-build and publish on merge

**Phase 3: Scaffolder (Month 3)**
• Software templates for: new backend service, new React app, new mobile app
• Template creates: GitHub repo, CI/CD pipeline, Helm chart, catalog entry, initial docs
• One-click new service from zero to deployed

**Phase 4: Plugins (Month 4+)**
• PagerDuty plugin: on-call info per service
• ArgoCD plugin: deployment status per service
• GitHub Actions plugin: pipeline status per service
• Cost insights: Kubecost data per service

**Customization:**
• Custom home page with team-specific views
• Custom plugins for internal tools (ServiceNow integration)
• Theme to match company branding

**Adoption Strategy:**
• Soft launch: catalog only, low friction to join
• Add value progressively: portal becomes more useful over time
• Gamification: "service score" based on catalog completeness, docs, SLOs

**Result:**
• 90% of services registered in catalog
• New service bootstrapping: 2 weeks → 30 minutes
• Documentation discoverability dramatically improved`,
          tips: [
            'Know Backstage plugin ecosystem',
            'Discuss catalog-info.yaml schema',
            'Mention Backstage operator for Kubernetes-native deployment',
            'Talk about keeping portal adoption organic'
          ]
        },
        {
          id: 'plat14',
          level: 'Senior',
          q: 'How do you manage platform team toil and avoid burnout?',
          a: `**Toil Defined (SRE Concept):**

Toil is manual, repetitive work that doesn't improve the system: manually approving access requests, manually fixing flaky pipelines, fielding the same Slack questions repeatedly.

**Toil I've Identified and Eliminated:**

**Manual Access Requests:**
Before: Developer opens Jira ticket → platform team grants AWS/GitHub access manually.
After: Self-service access portal using IAM Identity Center + automated group assignment via HR system sync. Zero manual steps.

**Pipeline Fixes for Known Issues:**
Before: Developer pings platform team for flaky runner issue.
After: Auto-heal script: runner health check every 5 min, auto-restart on failure, auto-re-queue flaky jobs.

**Secret Rotation Requests:**
Before: Developer asks platform team to rotate secret.
After: Vault dynamic secrets + automated rotation. Developers never ask.

**Certificate Renewal:**
Before: Calendar reminder, manual renewal, potential expiry.
After: cert-manager with Let's Encrypt / internal CA. Auto-renews at 80% lifetime.

**Toil Measurement:**
• Track time spent on toil in weekly retrospective (estimate %)
• Target: toil <20% of team time (SRE recommendation)
• Prioritize toil elimination based on frequency × time cost

**Team Health Practices:**
• On-call rotation with reasonable coverage (not same person every week)
• After-hours pages only for true P1s (strict alert tuning)
• Incident review: was this page necessary? If not, fix the alert
• Quarterly "toil sprints" to eliminate top 3 sources of toil
• Blameless culture: no shame for incidents or mistakes

**Result:**
• Toil reduced from ~40% to ~15% of team time
• On-call pages reduced 60%
• Team retention improved — no burnout attrition in 2 years`,
          tips: [
            'Know the SRE definition of toil',
            'Discuss toil measurement and tracking',
            'Mention sustainable on-call practices',
            'Show investment in team health is platform investment'
          ]
        },
        {
          id: 'plat15',
          level: 'Mid-Senior',
          q: 'What is Team Topologies and how does it influence platform design?',
          a: `**Team Topologies Overview:**

Team Topologies (Matthew Skelton & Manuel Pais) is a model for organizing teams to minimize cognitive load and optimize for fast flow of value.

**Four Team Types:**

**1. Stream-Aligned Teams:**
• Deliver value directly to customers
• Own a product domain end-to-end
• Should be fast-moving, low dependencies

**2. Platform Teams:**
• Provide internal services to stream-aligned teams
• Reduce cognitive load: teams use platform, not build it
• This is us — the platform engineering team

**3. Enabling Teams:**
• Temporary: help stream-aligned teams adopt new practices
• Don't own ongoing services
• Example: DevOps transformation team, security champions

**4. Complicated-Subsystem Teams:**
• Handle genuinely complex technical domains
• ML platform team, data engineering

**Interaction Modes:**
• X-as-a-Service: stream-aligned consumes platform (most of our interactions)
• Collaboration: temporary close working (migration period)
• Facilitation: enabling team helps stream-aligned adopt new practices

**How This Shapes My Platform Design:**

**Cognitive Load Principle:**
Platform must reduce, not increase, developer cognitive load. If our platform requires a developer to understand 20 new concepts, we've failed. Abstract complexity, expose simplicity.

**X-as-a-Service Model:**
• Platform provides CI/CD-as-a-service, secrets-as-a-service, infrastructure-as-a-service
• Stream-aligned teams consume via well-defined interfaces (YAML config, Helm values, API)
• Minimal back-and-forth; self-service is the default

**Team API Concept:**
Our team has a clear "API": office hours schedule, request process, on-call contact, roadmap. Teams know exactly how to interact with us.

**Conway's Law Application:**
Architecture mirrors org structure. If teams are siloed, APIs will be siloed. Platform team enables loosely-coupled microservices by providing shared infrastructure.`,
          tips: [
            'Know Team Topologies book concepts',
            'Discuss cognitive load as design principle',
            'Explain X-as-a-service interaction mode',
            'Connect Conway\'s Law to platform architecture decisions'
          ]
        },
        {
          id: 'plat16',
          level: 'Senior',
          q: 'How do you handle multi-cloud or hybrid cloud strategy in platform engineering?',
          a: `**My Experience:**

Primary cloud is AWS at Enterprise Pharma, but platform design considered hybrid (on-prem to cloud migration) and portability.

**Why Multi-Cloud Comes Up:**
• Vendor lock-in risk mitigation
• Regulatory requirements (data residency)
• M&A: acquired company uses different cloud
• Best-of-breed services (Azure AD, GCP BigQuery)

**Portability Strategy I Apply:**

**Abstraction Layers:**
• Kubernetes everywhere (EKS/GKE/AKS — same workload manifests)
• Terraform with provider abstraction (modules hide cloud-specific details)
• OpenTelemetry for observability (vendor-neutral)
• Vault for secrets (not AWS Secrets Manager — portable)
• GitHub Actions (not CodePipeline — portable)

**What I Don't Abstract:**
• IAM: AWS IAM is deeply specific, not worth abstracting
• Networking: VPC design is cloud-specific
• Managed services: RDS, SQS used directly (acceptable lock-in for operational benefit)

**Hybrid Cloud (My Actual Experience):**
• On-prem Jenkins → GitHub Actions (cloud-agnostic)
• On-prem Artifactory → JFrog Cloud (vendor-managed)
• On-prem VMs → AWS EKS (lift and modernize)
• Connected via Direct Connect during migration

**Kubernetes as the Unifier:**
Same Helm charts, same GitOps (ArgoCD), same monitoring stack deployed to any cluster — on-prem or cloud. This is the most practical multi-cloud strategy.

**Multi-Cloud Reality Check:**
True multi-cloud is expensive to operate. Most organizations should: pick a primary cloud, design for portability, avoid deep proprietary service lock-in, and accept that some lock-in (managed databases, queues) is worth the operational benefit.`,
          tips: [
            'Be honest that multi-cloud adds operational complexity',
            'Discuss Kubernetes as the practical portability layer',
            'Mention which services have acceptable vs problematic lock-in',
            'Connect to real business drivers for multi-cloud'
          ]
        },
        {
          id: 'plat17',
          level: 'Senior',
          q: 'How do you approach FinOps and cost ownership as a platform engineer?',
          a: `**FinOps in Platform Context:**

Platform engineers control the infrastructure. We have both the visibility and the levers to optimize cloud spend. FinOps is a shared responsibility — platform provides tools, teams own their costs.

**Cost Visibility Infrastructure I Built:**

**Tagging Strategy:**
Every resource tagged with: team, service, environment, cost-center. Terraform modules enforce tagging via variables — no tag, no apply.

**Showback Dashboards:**
• AWS Cost Explorer with tag-based grouping
• Grafana dashboard pulling AWS Cost and Usage Report
• Per-team cloud spend visible to team leads
• Kubecost for container-level cost attribution in EKS

**Cost Anomaly Detection:**
AWS Cost Anomaly Detection with per-service budgets. Alert to team lead when spend exceeds 120% of 30-day average.

**Cost Optimization Levers:**

**Platform-Level (I Control):**
• Spot instances for CI/CD runners (70-80% savings)
• Scheduled scaling: dev/staging EKS nodes scale to zero nights/weekends
• S3 intelligent tiering for artifact storage
• Reserved Instances for stable production workloads (1-year commits)
• NAT Gateway optimization (consolidated dev AZs)

**Team-Level (I Enable):**
• Right-sizing recommendations surfaced in developer portal
• Compute Optimizer integrated with Backstage
• Idle resource reports emailed to team leads weekly
• Self-service instance rightsizing (no ticket needed)

**FinOps Culture:**
• Monthly engineering cost review (15 min, all team leads)
• Celebrate cost wins: "#platform-updates: Team X reduced spend 20% by rightsizing their RDS"
• Unit economics: cost per deployment, cost per test run tracked

**Result:**
• 30%+ reduction in overall cloud spend
• Teams self-identify and fix waste (empowered, not policed)
• Cloud cost growth flat despite 40% more services deployed`,
          tips: [
            'Know FinOps Foundation maturity model (crawl/walk/run)',
            'Discuss showback vs chargeback approaches',
            'Mention Kubecost for container cost visibility',
            'Show cost optimization is continuous, not one-time'
          ]
        },
        {
          id: 'plat18',
          level: 'Senior',
          q: 'How do you ensure platform reliability and implement SRE practices?',
          a: `**SRE Principles Applied to Platform:**

Google's SRE practices apply directly to running an internal platform. Your developers are your users. Platform reliability = their productivity.

**Key SRE Practices I Apply:**

**1. Service Level Objectives:**
• Platform CI/CD availability: 99.9% (8.7 hours downtime/year)
• Pipeline success rate: 99.5%
• Secret retrieval latency: p99 < 200ms
• Infrastructure provisioning time: < 15 minutes

**2. Error Budgets:**
Error budget = 1 - SLO. When budget is spent, we stop new features and fix reliability. This creates a structured conversation with stakeholders.

**3. Toil Reduction:**
Track toil weekly. Target: < 20% of team time. Anything above triggers automation sprint.

**4. Eliminating Single Points of Failure:**
• Vault: 3-node HA Raft cluster
• ArgoCD: multi-replica
• GitHub Actions runners: minimum 3 per pool, auto-scale
• Monitoring: Prometheus federation, Grafana HA mode

**5. Blameless Post-Mortems:**
Every P1 gets a post-mortem. Focus: what failed in the system, not who made a mistake. Action items improve the system.

**6. Capacity Planning:**
• Monthly trend review: runner utilization, Vault request rate, EKS node capacity
• Proactive scaling before constraints hit
• Load testing new platform capabilities before rollout

**7. On-Call Health:**
• Rotation covers all hours without overburdening any person
• Alert tuning: every page must be actionable
• Monthly on-call review: were all pages valid?

**Reliability Metrics Tracked:**
• Platform availability per component
• Alert volume and page rate
• On-call burden (hours engaged per rotation)
• Post-mortem action item closure rate

**Result:**
• Platform availability maintained at 99.95%
• On-call burden reduced to < 3 hours per rotation on average
• Post-mortem action item closure: 90% within 2 weeks`,
          tips: [
            'Know SRE concepts: SLO, error budget, toil, blameless PM',
            'Discuss how you balance reliability vs feature velocity',
            'Mention on-call health as a reliability metric',
            'Show SRE is culture + process, not just tooling'
          ]
        },
        {
          id: 'plat19',
          level: 'Mid-Senior',
          q: 'How do you handle onboarding new teams onto the platform?',
          a: `**Onboarding Philosophy:**

First impression of the platform is critical. A bad onboarding experience creates a skeptic. A great one creates an advocate.

**Structured Onboarding Program:**

**Pre-Onboarding (Before Team Joins Platform):**
• Access provisioned before day one: GitHub org, AWS SSO, Vault, EKS
• Welcome kit sent: quick-start guide, Slack channels to join, office hours schedule
• Designated platform buddy for first 2 weeks

**Week 1: Foundations**
• 1-hour platform walkthrough (live, with their team)
• Cover: CI/CD pipeline, secrets, deployment, monitoring
• Deploy a "hello world" service together — hands on
• Review their existing architecture to identify integration points

**Week 2-4: Migration/Adoption**
• Platform team assists with first real service migration
• Pair programming on pipeline config
• Answer questions in dedicated onboarding Slack thread

**Onboarding Automation:**
• GitHub Actions: new repo created from template, pipeline auto-configured
• Backstage Scaffolder: one-form creates repo, pipeline, namespace, monitoring
• Automated access: PR merged → access granted via IaC

**Feedback Collection:**
• End of week 1: "Was the platform tour useful?" (5-min survey)
• End of month 1: NPS survey specific to onboarding experience
• Results feed directly into onboarding improvement

**Onboarding Metrics:**
• Time from "team wants to join" to "first deployment" target: < 5 business days
• Onboarding NPS tracked separately from general platform NPS
• Support tickets during first month (leading indicator of onboarding gaps)

**Result:**
• Onboarding time: 3 weeks → 4 days
• Onboarding NPS: +55 (highest of any platform metric)
• Zero teams "gave up" on platform during onboarding`,
          tips: [
            'Show empathy for the "first week" experience',
            'Discuss automation of access provisioning',
            'Mention dedicated support during onboarding window',
            'Measure onboarding separately from general platform satisfaction'
          ]
        },
        {
          id: 'plat20',
          level: 'Senior',
          q: 'How do you approach disaster recovery planning for the platform itself?',
          a: `**Platform DR Philosophy:**

The platform is infrastructure for other infrastructure. If CI/CD goes down, no one can deploy. If secrets backend fails, all services that restart will fail. Platform DR is critical.

**RTO/RPO Targets for Platform Components:**

Component → RTO → RPO
• Vault (secrets): 15 min → near-zero (Raft replication)
• GitHub Actions runners: 5 min → N/A (stateless)
• ArgoCD: 30 min → near-zero (Git is source of truth)
• Artifactory: 60 min → 4 hours (replicated to S3)
• EKS control plane: AWS-managed → AWS-managed

**DR Strategies per Component:**

**Vault HA:**
• 3-node Raft cluster across 3 AZs
• Auto-failover on leader failure
• Regular snapshots to S3 (every 15 min)
• Restoration tested quarterly

**GitHub Actions Runners:**
• Stateless → just restart
• Auto-scaling group with multi-AZ placement
• Fallback to GitHub-hosted runners if all self-hosted fail (documented runbook)

**ArgoCD:**
• All state in Git (GitOps) — Git is the recovery source
• Multi-replica deployment
• If totally lost: redeploy ArgoCD, re-sync from Git within 30 minutes

**Artifactory:**
• Active-passive HA
• Artifacts replicated to S3 (backup)
• If cloud instance fails: restore from S3 backup to new instance

**DR Testing:**
• Annual platform DR drill (tabletop + actual failover)
• Quarterly component-level failover tests (Vault leader kill)
• Results documented, gaps addressed

**Runbook Library:**
Every platform component has a break-glass runbook:
• Symptoms checklist
• Step-by-step recovery
• Fallback options
• Escalation contacts

**Result:**
• Platform outage during DR drill: recovered Vault in 8 minutes
• ArgoCD recovery test: 22 minutes to full sync from scratch
• Teams trust platform will recover quickly from failures`,
          tips: [
            'Know RTO vs RPO definitions clearly',
            'Discuss GitOps as natural DR for deployment state',
            'Mention testing DR — untested DR plans are fiction',
            'Talk about communication during platform DR events'
          ]
        }
      ]
    },
    mobile: {
      title: 'Mobile Platform Engineering',
      icon: '📱',
      questions: [
        {
          id: 'mob1',
          level: 'Senior',
          q: 'Describe your approach to building a mobile CI/CD platform.',
          a: `**Mobile CI/CD Platform Architecture:**

**Infrastructure Components:**

• GitHub-hosted macOS runners for iOS builds (migrated from dedicated Mac server)
• Linux runners for Android builds
• Secure credential storage (Vault)
• Artifact management (S3, Artifactory)
• Distribution platforms (TestFlight, Firebase App Distribution)

**My Implementation — Infrastructure Evolution:**

**Migration: Dedicated Mac Server → GitHub-Hosted Runners**
• Eliminated dedicated on-prem Mac build server
• Moved to GitHub-hosted macos-latest runners
• Zero Xcode version management — GitHub maintains runner images
• No more maintenance windows for OS or toolchain updates
• Stateless builds: clean runner every execution

**iOS Pipeline Components:**
• Fastlane for automation
• Certificate and profile management (match)
• Xcode CLI for archive and export
• Automatic TestFlight deployment
• App Store Connect API integration

**Android Pipeline Components:**
• Gradle with build variants
• Keystore management via Vault
• Multiple build flavors (debug/release/staging)
• Play Store deployment (internal/production tracks)

**Platform Features Delivered:**

• One-click release process
• Environment-specific configurations
• Automated version management
• Release notes generation
• Slack notifications for build status
• Build caching for performance

**Results Achieved:**
• iOS build time: 45 min to 15 min
• Android build time: 30 min to 10 min
• Release cycle: 2 days to 15 minutes
• Zero manual code signing steps
• 99% build success rate`,
          tips: [
            'Know iOS code signing deeply',
            'Discuss infrastructure choices',
            'Mention caching strategies',
            'Talk about security considerations'
          ]
        },
        {
          id: 'mob2',
          level: 'Senior',
          q: 'How do you handle iOS code signing in CI/CD?',
          a: `**iOS Code Signing Challenges:**

• Certificates expire and need rotation
• Provisioning profiles per app/environment
• Team vs individual certificates
• CI machines need access to credentials
• Security of private keys

**My Solution: Fastlane Match + Vault**

**Architecture:**
• Certificates stored in private Git repo (encrypted)
• Fastlane Match syncs certificates to CI
• Vault stores encryption passphrase
• GitHub Actions retrieves at build time

**Implementation Steps:**

**1. Initial Setup:**
• Create App Store Connect API key
• Initialize match with git storage
• Generate certificates for development, adhoc, appstore
• Create provisioning profiles per app

**2. CI Pipeline Integration:**

The workflow authenticates to Vault, retrieves certificates using match, builds and archives with Xcode, then uploads to TestFlight.

**3. Profile Management:**
• Separate profiles per environment
• Wildcard profiles for development
• Explicit app IDs for production
• Automatic renewal before expiry

**Security Practices:**

• Match passphrase in Vault (never in code)
• Keychain created fresh per build
• Keychain deleted after build
• API keys rotated quarterly
• Access logged and audited

**Handling Multiple Apps:**

• Shared certificates across apps
• Per-app provisioning profiles
• Match lanes per app/environment
• Consistent naming conventions

**Results:**
• Zero manual certificate management
• Developers never touch Keychain
• Automatic profile regeneration
• Consistent signing across team`,
          tips: [
            'Know match, cert, sigh commands',
            'Discuss App Store Connect API',
            'Mention enterprise vs App Store signing',
            'Talk about certificate rotation'
          ]
        },
        {
          id: 'mob3',
          level: 'Senior',
          q: 'Explain your experience with Fastlane automation.',
          a: `**Fastlane Overview:**

Fastlane is the automation backbone of mobile CI/CD. I've used it extensively for both iOS and Android.

**Lanes I've Implemented:**

**iOS Lanes:**

• build_development: Local dev builds
• build_staging: Staging environment with staging profile
• build_production: Production archive for App Store
• deploy_testflight: Build + upload to TestFlight
• deploy_appstore: Full App Store submission
• refresh_profiles: Regenerate provisioning profiles
• bump_version: Increment version and build numbers

**Android Lanes:**

• build_debug: Debug APK for testing
• build_release: Signed release APK/AAB
• deploy_internal: Upload to internal test track
• deploy_production: Production release
• bump_version: Version code management

**Key Fastlane Actions Used:**

• match: Certificate and profile management
• gym: iOS build automation
• pilot: TestFlight uploads
• deliver: App Store submissions
• gradle: Android build execution
• supply: Play Store uploads
• slack: Notifications

**Advanced Configurations:**

**Environment Management:**
Using .env files for different configurations - development, staging, and production - each with appropriate App IDs, profiles, and bundle identifiers.

**Version Management:**
Automated increment of build numbers using CI build numbers, ensuring unique versions for every build.

**Error Handling:**
Implemented error blocks with Slack notifications for build failures, including branch, commit, and error details.

**Integration with GitHub Actions:**

• Fastlane runs inside GitHub Actions workflows
• Secrets injected from Vault
• Artifacts uploaded to S3
• Status reported to PR checks`,
          tips: [
            'Know common Fastlane actions well',
            'Discuss Fastfile organization',
            'Mention plugin ecosystem',
            'Talk about debugging failures'
          ]
        },
        {
          id: 'mob4',
          level: 'Senior',
          q: 'How do you manage mobile app environments and configurations?',
          a: `**Environment Strategy:**

Separate configurations for Development, Staging, and Production environments, each with different API endpoints, feature flags, and app identifiers.

**iOS Environment Management:**

**Using Xcode Configurations:**
• Debug, Staging, Release configurations
• Per-configuration bundle IDs
• Environment-specific Info.plist values
• Separate entitlements files

**Build Schemes:**
• MyApp-Dev: Development configuration
• MyApp-Staging: Staging configuration
• MyApp-Production: Release configuration

**Configuration Files:**
Separate config files per environment containing API base URLs, analytics keys, feature flags, and log levels.

**Android Environment Management:**

**Product Flavors in Gradle:**
Defined development, staging, and production flavors with different application ID suffixes, app names, and build config fields for API URLs.

**Flavor Dimensions:**
• Environment: dev, staging, prod
• Distribution: internal, external
• Combined: devInternal, prodExternal, etc.

**Secrets Management:**

**Per-Environment Secrets in Vault:**
• API keys per environment
• Third-party service credentials
• Analytics tokens
• Push notification keys

**Injection at Build Time:**
Secrets retrieved from Vault during CI/CD and injected into build configurations, never stored in source code.

**Feature Flags:**

• LaunchDarkly or similar for runtime flags
• Build-time flags for environment differences
• Gradual rollout capabilities
• Kill switches for problematic features`,
          tips: [
            'Discuss Xcode configurations vs targets',
            'Know Android flavor dimensions',
            'Mention secrets injection',
            'Talk about feature flag strategies'
          ]
        },
        {
          id: 'mob5',
          level: 'Senior',
          q: 'How do you handle mobile release management and versioning?',
          a: `**Versioning Strategy:**

**Semantic Versioning:**
• MAJOR.MINOR.PATCH format (e.g., 2.5.3)
• Major: Breaking changes, major features
• Minor: New features, backward compatible
• Patch: Bug fixes, small improvements

**Build Numbers:**
• Auto-incremented from CI
• Unique per build
• Used for TestFlight/Play Store identification

**Automated Version Management:**

**iOS (using agvtool):**
Fastlane lane increments build number using CI build number and optionally bumps marketing version.

**Android (Gradle):**
Version code derived from CI build number, version name follows semantic versioning pattern.

**Release Process:**

**1. Feature Complete:**
• Create release branch (release/2.5.0)
• Lock new features
• QA testing begins

**2. Release Candidate:**
• Build RC from release branch
• Deploy to TestFlight/Internal track
• Stakeholder review

**3. Production Release:**
• Merge release to main
• Tag version (v2.5.0)
• Automated App Store/Play Store submission
• Release notes generated from commits

**4. Hotfix Process:**
• Branch from production tag
• Fix, test, release
• Cherry-pick to main

**Release Automation:**

• GitHub Release triggers production build
• Changelog generated from PR titles
• Screenshots updated if needed
• Phased rollout (10%, 50%, 100%)
• Monitoring for crash spikes`,
          tips: [
            'Know App Store review process',
            'Discuss rollback strategies',
            'Mention phased rollouts',
            'Talk about release monitoring'
          ]
        },
        {
          id: 'mob6',
          level: 'Mid-Senior',
          q: 'How do you optimize mobile build times?',
          a: `**Build Time Optimization Strategies:**

**Caching Layers:**

**1. Dependency Caching:**
• CocoaPods cache (saves 5+ minutes)
• node_modules cache (for React Native)
• Gradle dependencies cache
• SPM package cache

**2. Build Caching:**
• Xcode Derived Data caching
• Gradle build cache
• Incremental builds where possible

**3. Docker Layer Caching:**
• For Android builds in containers
• Pre-built base images with SDK

**GitHub Actions Caching Example:**

Cache CocoaPods using hash of Podfile.lock as key, restore from previous builds if exact match not found.

**Xcode Optimizations:**

• Parallel builds enabled
• Whole module optimization for release only
• Debug builds with incremental compilation
• Remove unused frameworks
• Modularize large codebases

**Android Optimizations:**

Gradle configuration with parallel execution, build cache enabled, increased JVM heap size, and configuration caching.

**Infrastructure Optimizations:**

• Dedicated Mac hardware (not VMs)
• M1/M2 chips (2-3x faster than Intel)
• SSD storage for builds
• Adequate RAM (16GB minimum)
• Parallel test execution

**My Results:**

Before optimization:
• iOS: 45 minutes
• Android: 30 minutes

After optimization:
• iOS: 15 minutes (67% reduction)
• Android: 10 minutes (67% reduction)

**Techniques Used:**
• Aggressive caching strategy
• M1 Mac Mini runners
• Modular architecture
• Parallel job execution`,
          tips: [
            'Know specific caching mechanisms',
            'Discuss hardware considerations',
            'Mention measurement approach',
            'Talk about trade-offs'
          ]
        },
        {
          id: 'mob7',
          level: 'Senior',
          q: 'How do you handle React Native or cross-platform mobile CI/CD?',
          a: `**React Native CI/CD Challenges:**

• Dual platform builds (iOS + Android)
• JavaScript bundle + native code
• Native module dependencies
• Environment configuration
• Larger dependency trees

**My React Native Pipeline Architecture:**

**Parallel Build Strategy:**

Two parallel jobs: iOS build on self-hosted macOS runner, Android build on Ubuntu runner, both depending on a common JavaScript test job.

**JavaScript Layer:**
• Jest tests before native builds
• ESLint and TypeScript checks
• Bundle size monitoring
• Dependency vulnerability scanning

**iOS-Specific Steps:**
• CocoaPods install (with cache)
• Metro bundler for JS
• Xcode archive with Fastlane
• TestFlight deployment

**Android-Specific Steps:**
• Gradle build with React Native
• Hermes compilation (if enabled)
• APK/AAB generation
• Play Store deployment

**Caching Strategy:**

• node_modules cached by yarn.lock hash
• Pods cached by Podfile.lock hash
• Gradle cached by gradle files hash
• Metro bundler cache

**Environment Configuration:**

Using react-native-config for environment variables, with separate .env files per environment injected at build time.

**Mendix Mobile (My Experience):**

• Custom build scripts for Mendix native mobile
• Integration with Mendix deployment API
• Native template management
• OTA update configuration

**Performance Results:**
• Combined build time: 25 minutes (parallel)
• Individual iOS: 15 minutes
• Individual Android: 12 minutes
• 99% build success rate`,
          tips: [
            'Know React Native build process',
            'Discuss Hermes vs JSC',
            'Mention OTA updates',
            'Talk about native module handling'
          ]
        },
        {
          id: 'mob8',
          level: 'Senior',
          q: 'How do you manage multiple iOS provisioning profiles and certificates at scale?',
          a: `**The Scaling Problem:**

10 apps × 3 environments × 3 profile types = 90+ provisioning profiles. Manual management is a nightmare. Scale requires automation.

**Fastlane Match — The Solution:**

Match manages all certificates and profiles in a single encrypted Git repo. Every CI machine and developer gets exactly what it needs automatically.

**Repository Structure:**
certs/ repo contains:
• Certificates/ — development, distribution certs (p12)
• Profiles/ — per app, per environment profiles
• README with passphrase storage location (Vault, never in repo)

**Match Types:**
• match(type: "development") — for local development
• match(type: "adhoc") — for internal distribution (Firebase)
• match(type: "appstore") — for App Store Connect/TestFlight
• match(type: "enterprise") — for enterprise in-house distribution

**Multi-App Strategy:**

Separate Matchfile per app or shared with app_identifier array:
Multiple app identifiers in one match call — generates profiles for all apps in one command. CI uses readonly: true to never modify (only create/update on demand).

**Certificate Rotation Process:**
• Certificates expire every 1 year (distribution) or 1 year (development)
• Alert 60 days before expiry via scheduled Fastlane job
• match(force_for_new_certificates: true) regenerates automatically
• All CI machines pick up new cert on next build (no manual distribution)

**App Store Connect API (Modern Approach):**
• Replace username/password with API key (more stable, no 2FA issues)
• Key stored in Vault, injected at build time
• Works reliably in headless CI environments

**Security:**
• Match passphrase in Vault (rotated annually)
• Separate certs repo per environment (prod certs access restricted)
• Audit log: who cloned certs repo and when`,
          tips: [
            'Know match storage backends: git, S3, Google Cloud',
            'Discuss readonly mode for CI vs write access for cert managers',
            'Mention App Store Connect API key vs Apple ID/password',
            'Talk about enterprise vs App Store distribution difference'
          ]
        },
        {
          id: 'mob9',
          level: 'Senior',
          q: 'How do you handle mobile app distribution — TestFlight, Firebase, and enterprise?',
          a: `**Distribution Channels:**

Different stages of development need different distribution paths.

**Development / Daily Builds:**
• Firebase App Distribution (iOS + Android)
• Fast, no review, immediate availability
• Distribute to QA team by email or group
• Automated via Fastlane firebase_app_distribution action

**Internal Staging / Beta:**
• iOS: TestFlight internal testing (< 100 testers, immediate)
• Android: Internal test track (same-day)
• No review required
• Used for QA sign-off and stakeholder previews

**External Beta (Select Users):**
• iOS: TestFlight external testing (up to 10,000 testers, requires Beta App Review)
• Android: Open/Closed testing tracks
• Used for wider beta programs

**Production:**
• App Store / Google Play
• Full review process (1-7 days for iOS)
• Phased rollout: 1% → 10% → 50% → 100%
• Monitor crash rate at each phase before proceeding

**My Automation Pipeline:**

Fastlane lanes I maintain:
• distribute_firebase: builds debug/internal build → Firebase upload → notifies Slack with install link
• distribute_testflight: builds release → TestFlight upload → marks for internal testing → notifies QA channel
• distribute_production: builds release → App Store Connect submission → attaches release notes

**Release Notes Automation:**
• Git commit messages since last release formatted into release notes
• Template with feature list + bug fixes
• Injected into TestFlight "What to Test" and App Store "What's New"

**Enterprise Distribution (Enterprise Pharma Use Case):**
• Mendix apps distributed via MDM (Mobile Device Management)
• IPA hosted on internal S3
• MDM pushes to managed devices automatically
• No App Store dependency

**Monitoring After Release:**
• Crashlytics crash-free rate monitored hourly post-release
• If crash rate > 0.5% increase: halt phased rollout, evaluate hotfix`,
          tips: [
            'Know Apple review timelines and expedited review option',
            'Discuss phased rollout monitoring strategy',
            'Mention MDM distribution for enterprise apps',
            'Talk about rollback strategy (App Store has no true rollback)'
          ]
        },
        {
          id: 'mob10',
          level: 'Senior',
          q: 'How do you implement mobile security in CI/CD pipelines?',
          a: `**Mobile Security Concerns:**

Mobile apps ship to devices outside your control. Security must be built into the build process, not added later.

**Dependency Security:**

iOS:
• CocoaPods/SPM: audit dependencies for known CVEs
• Bundle audit equivalent: cocoapods-check or manual Dependabot
• Lock Podfile.lock — only update deliberately with review

Android:
• Gradle dependency check plugin for CVE scanning
• dependencyCheck task integrated in CI
• OWASP Dependency-Check reports on every build

**Static Analysis in CI:**

iOS:
• SwiftLint: code style and potential bugs
• Xcode Analyze: built-in static analyzer (run with -analyze flag)
• SonarQube for security-specific rules

Android:
• Lint: Android Studio's built-in (runs in CI with ./gradlew lint)
• Detekt for Kotlin static analysis
• Firebase App Check integration for API abuse prevention

**Secrets Detection:**
• Pre-commit hooks: detect-secrets scans for hardcoded API keys, tokens
• CI scan: Trufflehog on every PR — blocks merge if secrets found
• Common violations caught: API keys in Info.plist, hardcoded URLs with credentials

**Binary Hardening:**
iOS: Enabled in Xcode build settings:
• Position Independent Executable (PIE)
• Stack canaries
• ARC (automatic reference counting)
• Bitcode (where applicable)

Android: ProGuard/R8 for:
• Code minification (harder to reverse-engineer)
• Obfuscation (renames classes/methods)
• Debug symbols stripped in release builds

**Certificate and Key Protection:**
• Private keys never in source control
• Keystore stored in Vault, checked out at build time only
• Keystore password dynamic via Vault (rotated annually)
• iOS private key (p12) password in Vault

**OWASP Mobile Top 10 Awareness:**
• Insecure data storage: no sensitive data in shared preferences unencrypted
• Insecure communication: certificate pinning for critical APIs
• Insufficient authentication: biometric + token refresh patterns`,
          tips: [
            'Know OWASP Mobile Top 10',
            'Discuss certificate pinning trade-offs (maintenance burden)',
            'Mention ProGuard/R8 for Android obfuscation',
            'Talk about secrets scanning as mandatory CI gate'
          ]
        },
        {
          id: 'mob11',
          level: 'Senior',
          q: 'How do you handle mobile app performance testing in CI/CD?',
          a: `**Performance Testing Types for Mobile:**

**1. Unit/Integration Tests (Every PR):**
• XCTest for iOS, JUnit for Android
• Fast, no device needed, run on simulator/emulator
• Cover business logic, network layer, data processing

**2. UI Tests (Nightly / Pre-Release):**
• XCUITest for iOS, Espresso for Android
• Run on real devices or cloud device farm
• Test critical user journeys: login, checkout, key screens
• Slower — not on every PR, too expensive

**3. Performance Tests:**
• App startup time (measure via Instruments/Android Profiler)
• Screen rendering frame rate
• Network request latency from app perspective
• Memory usage over time (leak detection)

**Device Farm Integration:**

AWS Device Farm or Firebase Test Lab:
• Upload IPA/APK after build
• Run UI test suite on 5-10 real device/OS combinations
• Results posted to GitHub PR as check
• Screenshots and video on failure

**My Fastlane Integration:**

scan action runs XCTest suite. Results reported to GitHub. Device farm tests triggered for main branch merges. Performance baselines tracked over time.

**Performance Regression Detection:**
• Baseline established for: startup time, key screen transitions
• CI job compares current build vs baseline
• If startup time increases > 500ms: fail and alert
• Tracked in Grafana dashboard per build

**Monkey Testing:**
• Android: UI Automator Monkey for random input testing
• iOS: UIInterruptionMonitor for unexpected dialogs
• Run weekly on release builds

**Accessibility Testing:**
• Automated: XCTest accessibility APIs, Espresso AccessibilityChecks
• Ensures screen reader compatibility
• Part of release checklist`,
          tips: [
            'Know XCUITest vs XCTest difference',
            'Discuss device farm options (AWS Device Farm, BrowserStack, Firebase)',
            'Mention performance regression detection strategy',
            'Talk about trade-off of running UI tests on every PR vs nightly'
          ]
        },
        {
          id: 'mob12',
          level: 'Senior',
          q: 'Explain how Mendix mobile application builds and deployments work.',
          a: `**Mendix Native Mobile Overview:**

Mendix is a low-code platform. Native mobile apps are built on React Native under the hood but managed through Mendix Studio Pro.

**Build Architecture:**

**Mendix Native Template:**
• Mendix provides a React Native template
• Custom native modules added to template
• Customizations live in template repo (separate from Mendix app)
• Template versioned and updated with Mendix releases

**Build Process:**

**iOS Build:**
1. Mendix generates JavaScript bundle from app model
2. CI checks out native template
3. CocoaPods install for native dependencies
4. Xcode build with Fastlane (same as standard iOS)
5. IPA signed and distributed

**Android Build:**
1. Same JS bundle generation
2. Gradle build with React Native dependencies
3. APK/AAB signed and distributed

**My CI/CD Implementation:**

GitHub Actions workflow:
• Trigger: Mendix deployment webhook (app model updated)
• Pull latest native template
• Inject environment-specific configuration
• Build iOS on Mac self-hosted runner
• Build Android on Linux runner
• Distribute via TestFlight / MDM

**Challenges Specific to Mendix:**

**Native Template Upgrades:**
• Mendix releases new templates with each version
• Must test template upgrade before applying to production apps
• Breaking changes in templates require custom code migration

**Over-The-Air Updates:**
• Mendix supports OTA JS bundle updates (no App Store re-submission)
• Used for minor logic fixes
• Native code changes still require full build + App Store review

**Version Alignment:**
• Mendix Studio Pro version must match native template version
• CI enforces version compatibility check

**Enterprise Distribution:**
• Mendix apps often distributed via MDM (not App Store)
• IPA hosted on S3, MDM pushes to managed iPads
• Useful for field apps, clinical trial apps (pharma context)`,
          tips: [
            'Know Mendix native mobile vs hybrid distinction',
            'Discuss OTA update limitations (native code still needs store review)',
            'Mention native template management as unique challenge',
            'Connect to your actual Enterprise Pharma experience'
          ]
        },
        {
          id: 'mob13',
          level: 'Senior',
          q: 'How do you implement over-the-air (OTA) updates for mobile apps?',
          a: `**OTA Update Purpose:**

Fix bugs and push JavaScript-layer updates without going through App Store review. Critical for rapid response to production issues.

**OTA Update Tools:**

**Microsoft App Center CodePush (React Native):**
• Pushes JS bundle updates to devices
• Mandatory vs optional update modes
• Rollback on crash spike detection
• Per-deployment key for environment targeting

**Expo Updates (Expo-managed RN):**
• Similar to CodePush
• Tighter Expo ecosystem integration

**Mendix OTA:**
• Built into Mendix platform
• Pushes model + JS updates
• Configured per environment

**What CAN Be Updated OTA:**
• JavaScript business logic
• React Native component changes
• API endpoint changes (in JS layer)
• Bug fixes that don't touch native code

**What CANNOT Be Updated OTA:**
• Native module changes (new permissions, new native libraries)
• iOS Info.plist changes
• Android AndroidManifest.xml changes
• App icon, splash screen
• Push notification setup changes

**CI/CD Integration:**

Hotfix workflow with OTA:
• Developer merges hotfix branch
• CI builds JS bundle only (fast: ~2 minutes)
• CodePush release to staging — QA validates
• Promote to production: mandatory update
• Monitor crash rate via Crashlytics

**Safety Mechanisms:**
• Crash threshold: if crash rate > 1% post-update, CodePush auto-rollback
• Staged rollout: 5% → 25% → 100% over 24 hours
• Version targeting: update only app versions ≥ X

**My Experience:**
Used Mendix OTA at Enterprise Pharma for clinical app updates. Allowed business logic fixes to reach field devices within 30 minutes vs 3-5 day App Store review cycle.`,
          tips: [
            'Know OTA update limitations clearly (native code = no OTA)',
            'Discuss CodePush vs Expo Updates',
            'Mention safety mechanisms (auto-rollback, staged rollout)',
            'Connect to your Mendix/Enterprise Pharma experience'
          ]
        },
        {
          id: 'mob14',
          level: 'Senior',
          q: 'How do you manage mobile app dependencies and keep them updated?',
          a: `**Dependency Management Platforms:**

**iOS:**
• CocoaPods: most widely used, Ruby-based
• Swift Package Manager (SPM): Apple-native, growing adoption
• Carthage: pre-built frameworks, less common now

**Android:**
• Gradle with Maven Central / JCenter (deprecated → Maven Central)
• Version catalogs (libs.versions.toml) — modern Gradle approach

**Dependency Update Strategy:**

**Automated Detection:**
• Dependabot (GitHub): opens PRs for outdated dependencies automatically
• Renovate: more configurable, groups related updates

**Update Cadence:**
• Patch updates: auto-merge if tests pass (low risk)
• Minor updates: PR created, run test suite, team reviews
• Major updates: planned sprint, manual testing required

**React Native Specific:**
• RN upgrades are high-risk (breaking native changes)
• Use React Native Upgrade Helper for migration guide
• Test on both iOS and Android before merging
• Upgrade RN versions quarterly at most

**Lockfile Discipline:**
• Podfile.lock and yarn.lock committed to repo
• Changes in lockfile reviewed as part of PR
• Reproducible builds: same lockfile = same output

**CocoaPods Best Practices:**

CDN source instead of master repo (faster installs).
Explicit version pinning for critical dependencies.
Cache Pods in CI with Podfile.lock hash key.

**Vulnerability Response:**

If Dependabot alerts CRITICAL vulnerability:
1. Auto-PR created with fix
2. CI runs full test suite
3. If passing: auto-merge to branch
4. Deploy through environments as normal
5. Patch in production within 72-hour SLA

**Dependency Audit Schedule:**
• Weekly: Dependabot alerts reviewed
• Monthly: Major version upgrade candidates reviewed
• Quarterly: Full dependency audit and cleanup (remove unused)`,
          tips: [
            'Know CocoaPods vs SPM trade-offs',
            'Discuss Renovate vs Dependabot',
            'Mention lockfile importance for reproducibility',
            'Talk about React Native upgrade strategy (high risk)'
          ]
        },
        {
          id: 'mob15',
          level: 'Mid-Senior',
          q: 'How do you handle mobile environment configuration and feature flags?',
          a: `**Environment Configuration:**

Mobile apps need different configs per environment: different API URLs, analytics keys, feature toggles.

**iOS: Xcode Configuration Files (.xcconfig)**

Three config files: Debug.xcconfig, Staging.xcconfig, Release.xcconfig each defining API_BASE_URL and other environment-specific values. Info.plist reads these variables. Code reads from bundle: Bundle.main.infoDictionary.

**Android: Build Variants + Product Flavors**

Gradle defines dev, staging, prod flavors each with applicationIdSuffix and buildConfigField for API URL. Code reads BuildConfig.API_BASE_URL.

**React Native: react-native-config**

.env files per environment (.env.development, .env.staging, .env.production). Loaded at build time via --envfile flag. Accessed in code via Config.API_BASE_URL.

**Feature Flags:**

**Build-Time Flags:**
Baked into the build. Good for: features not ready for any user, debugging tools (show only in dev builds).

**Runtime Flags (Preferred for Flexibility):**

Firebase Remote Config:
• Flags fetched from Firebase at app launch
• Cached locally for offline use
• Updated without app release
• A/B testing built in

LaunchDarkly:
• More powerful targeting (by user ID, device, geography)
• Percentage rollouts
• Kill switches for problematic features
• Audit trail of flag changes

**My Workflow for New Features:**

1. Feature built behind flag (feature_new_checkout: false by default)
2. Deploy to production with flag off (safe)
3. Enable for internal team first (20 users)
4. Enable for 5% of users (watch metrics)
5. Full rollout (flag on by default)
6. Eventually remove flag from code (cleanup sprint)

**Emergency Kill Switch:**
Every major feature has a kill switch flag. If post-release bug found: disable flag remotely in 30 seconds vs 3-day App Store hotfix.`,
          tips: [
            'Know Xcode configurations vs targets distinction',
            'Discuss feature flag lifecycle (create → rollout → cleanup)',
            'Mention Firebase Remote Config vs LaunchDarkly trade-offs',
            'Talk about kill switches as a safety pattern'
          ]
        },
        {
          id: 'mob16',
          level: 'Mid-Senior',
          q: 'How do you set up and maintain Mac CI runner infrastructure?',
          a: `**Mac Runner Infrastructure — My Migration Story:**

At Enterprise Pharma I led the full evolution of iOS build infrastructure, from a single dedicated Mac server to GitHub-hosted runners.

**Phase 1: Dedicated Mac Build Server (Starting Point)**
• Single on-premises Mac server handling all iOS builds
• Pain points: Xcode updates required manual testing and maintenance windows, OS patching caused build breakages, single point of failure, platform team spending hours/month on upkeep
• Xcode version lock-in meant we couldn't easily test against newer SDKs

**Phase 2: Self-Hosted Mac Mini Fleet**
• Added Mac Mini M1/M2 runners registered via GitHub Actions
• Better: redundancy across 3 runners, runner groups for prod vs dev isolation
• Still painful: Xcode updates across the fleet, disk space management, cache cleanup, runner health monitoring, launchd service management
• Hardware procurement added weeks to scaling decisions

**Phase 3: GitHub-Hosted macOS Runners (Current)**
• Migrated all enterprise iOS CI/CD to GitHub-hosted macos-latest / macos-14 runners
• Instant availability — no provisioning, no maintenance windows
• Xcode is always current: GitHub maintains and updates runner images automatically
• Stateless per build: clean environment every run, no cross-build pollution
• Scaling is infinite and instant — no hardware orders
• Eliminated ~4 hours/month of runner maintenance from platform backlog

**What the Migration Required:**
• Change runs-on from self-hosted to macos-latest in workflow YAML (trivial)
• Vault OIDC secrets injection unchanged — security posture identical
• Fastlane match and code signing unchanged
• Added dependency caching (CocoaPods, node_modules) to offset clean-state cost
• Build times remained comparable after caching was tuned

**Business Value:**
• Zero Xcode version drift across team
• No more emergency maintenance windows before App Store submissions
• Platform team freed from runner ops entirely
• Reproducible builds by default (stateless runners)

**When Self-Hosted Still Makes Sense:**
• Extremely high build volume where per-minute cost dominates
• Pinning a legacy Xcode version for old app targets
• Air-gapped or strict compliance environments`,
          tips: [
            'Know M1/M2 vs Intel build time difference (2-3x faster)',
            'Discuss Xcode version management (multiple Xcode versions needed)',
            'Mention runner group isolation for security',
            'Talk about runner disk management (Xcode = massive disk usage)'
          ]
        },
        {
          id: 'mob17',
          level: 'Mid-Senior',
          q: 'How do you automate App Store and Play Store submissions?',
          a: `**App Store Submission Automation (iOS):**

**Fastlane deliver / pilot:**

deliver submits to App Store Connect. Inputs: IPA file, metadata (release notes, keywords, screenshots), submission options (reject previous build if submitted), version and build number.

**App Store Connect API:**
• Modern alternative to Apple ID + password
• More stable (no 2FA issues in CI)
• API key stored in Vault, mounted as file at build time
• Required for automated submissions

**Metadata Management:**
• Release notes in fastlane/metadata/en-US/release_notes.txt
• Screenshots in fastlane/screenshots/
• Updated in repo, automatically uploaded with each submission

**Review Automation:**
• Compliance responses automated (encryption export compliance: standard)
• Age rating set declaratively
• App review information pre-filled (demo account if needed)

**Play Store Submission (Android):**

supply action uploads AAB with service account credentials from Vault, rolls out to internal track initially.

**Track Promotion:**
After internal QA: promote from internal → production. Set 20% rollout, monitor, increase manually or via automation.

**Google Play Service Account:**
• Service account JSON in Vault
• Permissions: manage production releases (scoped to app)
• Injected at build time as temp file

**Release Management:**

Combined release workflow:
1. Trigger: git tag v2.5.0
2. Build iOS + Android in parallel
3. App Store: submit to TestFlight (internal testing)
4. Play Store: upload to internal track
5. Notify stakeholders with build numbers + links
6. After QA sign-off: promote to App Store review / Play production

**Rollout Monitoring:**
• Check App Store release status via App Store Connect API hourly
• Alert when review approved (ready to release)
• Monitor crash rate post-release`,
          tips: [
            'Know App Store Connect API setup',
            'Discuss Google Play Service Account permissions',
            'Mention phased rollout automation',
            'Talk about compliance automation (encryption export)'
          ]
        },
        {
          id: 'mob18',
          level: 'Mid-Senior',
          q: 'How do you handle Gradle build complexity in Android CI?',
          a: `**Gradle Complexity Sources:**

• Multiple build types (debug, release)
• Multiple product flavors (dev, staging, prod)
• Build variant matrix (debug-dev, release-prod, etc.)
• Slow build times in CI
• Dependency resolution inconsistencies

**Build Variant Management:**

Gradle config defining buildTypes (debug, release with minification and ProGuard) and productFlavors (development, staging, production with applicationIdSuffix and buildConfigFields). generateVersionCode function computes version from CI build number.

**Performance Optimization:**

gradle.properties in CI environment:
• Parallel execution enabled
• Build caching on
• Increased JVM heap for CI machines
• Configuration cache enabled (Gradle 7+)
• File system watching disabled for CI (avoids stale cache issues)

**CI-Specific Configuration:**

.ci.gradle file with no-daemon settings (fresh per run), offline mode after first dependency fetch, and test logging configuration.

**Dependency Caching:**

Cache Gradle user home using hash of all build.gradle and gradle.properties files. Restores full cache on match, partial on partial match.

**Build Output Management:**
• APK/AAB artifacts uploaded to S3 post-build
• Naming convention: appname-flavor-buildtype-version-buildnumber
• Retention: 30 days for dev builds, indefinite for release

**Common CI Issues I've Solved:**
• Heap OOM: increased org.gradle.jvmargs
• Daemon contamination: --no-daemon in CI
• Stale dependencies: --refresh-dependencies for snapshot deps
• Signing issues: Vault keystore checkout before build task`,
          tips: [
            'Know Gradle configuration cache benefits',
            'Discuss build variant naming conventions',
            'Mention ProGuard/R8 configuration',
            'Talk about dependency resolution strategies'
          ]
        },
        {
          id: 'mob19',
          level: 'Senior',
          q: 'How do you build a mobile platform strategy for an enterprise with multiple apps?',
          a: `**Enterprise Mobile Platform Challenges:**

Multiple apps mean: duplicated build infrastructure, inconsistent signing practices, different dependency versions, siloed knowledge.

**Centralized Mobile Platform Model:**

**Shared Infrastructure:**
• Centralized Mac runner fleet (shared across all app teams)
• Runner groups per security tier (prod builds vs dev builds)
• Centralized Vault for all certificates and keystores
• Shared Artifactory for iOS frameworks and Android AARs

**Shared Tooling:**
• Common Fastlane lanes in shared gem (published to internal RubyGems)
• Shared GitHub Actions reusable workflows for mobile
• Common linting rules (SwiftLint config, detekt config)
• Shared testing utilities

**Standardization via Golden Paths:**

iOS Golden Path: New iOS app gets pre-configured project with: standard Podfile, shared Fastlane, standard CI workflow, signing via match, standard monitoring setup.

Android Golden Path: New Android app gets: standard Gradle setup, shared Fastlane, standard CI workflow, Vault keystore integration, ProGuard config.

**Platform Team Responsibilities:**
• Own and maintain Mac runner fleet
• Own certificate and keystore management
• Maintain shared Fastlane library
• Define build standards and enforce via templates
• Provide on-call support for build issues

**App Team Responsibilities:**
• Business logic and app-specific configurations
• Customizing lanes within platform constraints
• App-specific test suites
• Release decisions

**Governance:**
• New native module requests reviewed by platform team
• Breaking template changes require migration window
• Monthly mobile platform sync across all app teams

**Results at Enterprise Pharma:**
• 3 apps (React Native, 2 Mendix) on shared platform
• One team manages all mobile infrastructure
• Consistent build times, signing, and distribution across all apps
• Shared Mac fleet: 3 runners serving all apps efficiently`,
          tips: [
            'Discuss centralization vs autonomy balance',
            'Mention shared library approach for Fastlane',
            'Talk about runner fleet sizing for multiple apps',
            'Connect to your actual multi-app Enterprise Pharma experience'
          ]
        },
        {
          id: 'mob20',
          level: 'Senior',
          q: 'What is your approach to mobile app quality gates in CI/CD?',
          a: `**Quality Gates Philosophy:**

Quality gates are checkpoints in the pipeline that enforce standards before code progresses. Block fast, fail loud, fix forward.

**My Quality Gates by Stage:**

**Stage 1: Pre-Build (Every PR)**
• Lint: SwiftLint (iOS), Detekt/Lint (Android), ESLint (RN) — zero error tolerance
• Unit Tests: minimum 80% coverage, all tests must pass
• Secrets Scan: Trufflehog — blocks on any secret detected
• Dependency Check: CVE scan, blocks on CRITICAL findings
• Code Review: minimum 1 approved reviewer

**Stage 2: Build**
• Build must succeed: no warnings-as-errors exceptions in prod
• Binary size check: alert if IPA > 100MB increase vs baseline
• Compile-time analysis: Xcode Analyze, no analyzer warnings

**Stage 3: Post-Build Testing**
• UI Tests: critical user journeys must pass
• Accessibility checks: automated WCAG basic validation
• Performance baseline: startup time within 10% of baseline

**Stage 4: Pre-Release**
• Manual QA sign-off (for production releases)
• Stakeholder demo approval (for major features)
• App Store metadata review

**Stage 5: Post-Release Monitoring (Quality in Production)**
• Crash-free rate > 99.5% (auto-pause rollout if violated)
• ANR rate < 0.2% (Android specific)
• App rating: alert if drops below 4.0 stars

**Gate Configuration:**

GitHub branch protection:
• Required status checks: lint, test, build, security-scan all green
• PRs blocked from merge if any gate fails
• No bypass allowed for main branch

**Reporting:**
• All gate results posted as PR checks
• Weekly quality report: trend of gate failures by category
• Monthly: review gate thresholds (too strict = friction, too loose = bugs)

**Result:**
• Production crash rate maintained < 0.1%
• Zero secrets in production code in last 12 months
• Build success rate: 99%+ after gate tuning`,
          tips: [
            'Know GitHub branch protection required status checks',
            'Discuss gate failure handling (fast feedback to developer)',
            'Mention balancing strictness vs developer friction',
            'Talk about quality metrics in production as gate extension'
          ]
        }
      ]
    },
    kubernetes: {
      title: 'Kubernetes Platform',
      icon: '⎈',
      questions: [
        {
          id: 'k8s1',
          level: 'Senior',
          q: 'How do you build a Kubernetes platform for developers?',
          a: `**Kubernetes Platform Layers:**

**1. Cluster Infrastructure:**
• Managed Kubernetes (EKS/GKE/AKS)
• Multi-cluster strategy (dev/staging/prod)
• Network architecture (VPC, CNI)
• Node group management

**2. Platform Services:**
• Ingress controller (NGINX/ALB)
• Service mesh (optional: Istio/Linkerd)
• Certificate management (cert-manager)
• External DNS for automatic records
• Secrets management (External Secrets + Vault)

**3. Developer Experience:**
• Namespace provisioning (self-service)
• Helm chart library
• GitOps deployments (ArgoCD/Flux)
• Resource quotas and limits

**4. Observability:**
• Prometheus + Grafana
• Logging (Fluent Bit + ELK)
• Tracing (Jaeger/Tempo)
• Cost visibility (Kubecost)

**Platform Abstraction I Built:**

Simplified application manifest that developers write, where the platform handles Deployment, Service, Ingress creation, HPA configuration, Pod disruption budgets, Network policies, Service mesh sidecar, and Monitoring setup.

**Results:**
• Developers write 10 lines vs 200+ lines of YAML
• Consistent security and compliance
• Easy platform-wide updates`,
          tips: [
            'Discuss abstraction levels',
            'Mention multi-tenancy strategies',
            'Talk about resource management',
            'Share developer feedback'
          ]
        },
        {
          id: 'k8s2',
          level: 'Senior',
          q: 'Explain GitOps and how you implement it for platform engineering.',
          a: `**GitOps Principles:**

• Git as single source of truth
• Declarative desired state
• Automated reconciliation
• Continuous verification

**GitOps Architecture:**

Git Repository (Desired State) flows to GitOps Controller (ArgoCD/Flux), which syncs to Kubernetes Cluster (Actual State), with Continuous Reconciliation maintaining alignment.

**Repository Structure:**

• apps/ folder with base manifests and environment overlays (dev/staging/prod)
• platform/ folder with monitoring, ingress, security components
• clusters/ folder with cluster-specific configurations

**ArgoCD App of Apps Pattern:**

Application definition that watches a gitops repo path for changes and automatically syncs with prune and self-heal enabled.

**Developer Workflow:**

1. Developer merges code, CI builds image
2. CI updates image tag in gitops repo
3. ArgoCD detects change
4. ArgoCD syncs to cluster
5. Developer sees deployment in portal

**Platform Benefits:**
• Audit trail for all changes
• Easy rollbacks (git revert)
• Consistent environments
• Drift detection and correction

**My Implementation:**
• ArgoCD for application deployments
• App of Apps pattern for management
• Helm + Kustomize for templating
• Sealed Secrets for sensitive data
• Image Updater for automated promotions`,
          tips: [
            'Know ArgoCD and Flux differences',
            'Discuss repository strategies',
            'Mention secrets handling in GitOps',
            'Talk about multi-cluster GitOps'
          ]
        },
        {
          id: 'k8s3',
          level: 'Senior',
          q: 'How do you handle multi-tenancy in a Kubernetes platform?',
          a: `**Multi-Tenancy Models:**

**1. Namespace-based (Soft Multi-tenancy):**
• Shared cluster, isolated namespaces
• RBAC for access control
• Resource quotas per namespace
• Network policies for isolation

**2. Cluster-based (Hard Multi-tenancy):**
• Dedicated clusters per tenant/env
• Complete isolation
• Higher cost, easier security

**3. Hybrid:**
• Prod: dedicated clusters
• Non-prod: shared with namespaces

**Namespace-based Implementation:**

For each team namespace, create ResourceQuota with CPU, memory, and pod limits, plus NetworkPolicy with default deny rules.

**RBAC per Team:**

RoleBinding that grants namespace-admin ClusterRole to the team's group within their namespace.

**Platform Features:**
• Self-service namespace requests
• Automatic quota assignment
• Network policy templates
• Cost tracking per namespace
• Compliance scanning per tenant

**Security Considerations:**
• Pod Security Standards enforcement
• No privileged containers
• Image pull from approved registries only
• Secrets encryption at rest`,
          tips: [
            'Know namespace vs cluster isolation trade-offs',
            'Discuss Hierarchical Namespaces',
            'Mention cost allocation strategies',
            'Talk about noisy neighbor problems'
          ]
        },
        {
          id: 'k8s4',
          level: 'Senior',
          q: 'How do you manage Helm charts at scale for a platform?',
          a: `**Helm Chart Strategy:**

**Chart Library Architecture:**

• library/ folder with common shared templates
• platform/ folder with ingress-nginx, prometheus, argocd charts
• application/ folder with golden path charts: web-service, api-service, worker, cronjob

**Common Library Chart Pattern:**

Base deployment template that other charts include, providing consistent labels, selectors, and configurations.

**Application Charts (use library):**

Chart.yaml declares dependency on common chart, then templates simply include the common deployment.

**Values Schema Validation:**

JSON schema enforcing required fields, valid enum values for size presets, and proper types for all configuration options.

**Chart Management:**
• Semantic versioning
• ChartMuseum or OCI registry
• Automated testing (helm unittest)
• Documentation generation (helm-docs)
• Deprecation policy

**Developer Experience:**
• Simple values files
• Sensible defaults
• Environment overlays
• One-line deployments`,
          tips: [
            'Discuss library charts pattern',
            'Mention chart testing strategies',
            'Talk about versioning and upgrades',
            'Share simplification examples'
          ]
        },
        {
          id: 'k8s5',
          level: 'Mid-Senior',
          q: 'How do you implement Kubernetes security for a platform?',
          a: `**Security Layers:**

**1. Cluster Security:**
• Private API server (no public access)
• OIDC authentication (no static tokens)
• Audit logging enabled
• Regular security patches
• CIS benchmark compliance

**2. Workload Security:**

Pod Security Standards enforced at namespace level with restricted profile for enforce, audit, and warn modes.

Security Context enforced by platform: runAsNonRoot, readOnlyRootFilesystem, allowPrivilegeEscalation false, drop all capabilities.

**3. Network Security:**
• Default deny network policies
• Service mesh mTLS (optional)
• Egress controls
• Ingress WAF

**4. Supply Chain Security:**
• Image scanning in CI (Trivy, Snyk)
• Signed images (Cosign)
• Allowed registries only
• SBOM generation

**5. Secrets Security:**
• External Secrets Operator + Vault
• No Kubernetes secrets directly
• Automatic rotation
• Audit logging

**6. Policy Enforcement:**

Kyverno ClusterPolicy requiring team labels on all Deployments, with enforcement action.

**Platform Security Features:**
• Automatic security context injection
• Policy enforcement at admission
• Compliance dashboards
• Security scorecards per service`,
          tips: [
            'Know Pod Security Standards levels',
            'Discuss policy engines (OPA, Kyverno)',
            'Mention supply chain security',
            'Talk about compliance automation'
          ]
        },
        {
          id: 'k8s6',
          level: 'Senior',
          q: 'How do you handle Kubernetes upgrades with zero downtime?',
          a: `**Kubernetes Upgrade Strategy:**

EKS upgrades are inevitable — AWS deprecates versions. Safe upgrades require planning, testing, and a disciplined process.

**Pre-Upgrade Checklist:**

1. Review EKS release notes for breaking changes
2. Check API deprecations: kubectl convert -f manifests/ —output-version (target)
3. Validate add-on compatibility: AWS LBC, CoreDNS, VPC CNI, Cluster Autoscaler
4. Review Helm chart compatibility
5. Check node AMI availability for new version

**Upgrade Sequence:**

Dev cluster first (validate everything works)
→ Staging cluster (1 week soak time)
→ Production cluster (after staging validation)

**Production Upgrade Process:**

Step 1: Control plane upgrade (AWS-managed, minimal risk)
• Apply via eksctl or Terraform
• API server briefly unavailable (< 30 seconds) — running pods unaffected

Step 2: Managed node group upgrade (rolling)
• New nodes launched with new AMI
• Old nodes cordoned and drained one at a time
• PodDisruptionBudgets ensure zero downtime per service
• Monitor pod rescheduling in real time

Step 3: Add-on updates
• CoreDNS, kube-proxy, VPC CNI updated to compatible versions
• AWS Load Balancer Controller, Cluster Autoscaler updated

**PodDisruptionBudget (Required for Zero Downtime):**
PDB for each deployment specifying minAvailable of at least 1. Drain will wait for replacement before evicting.

**Monitoring During Upgrade:**
• Grafana: pod restart rate, pending pods, node count
• Alert on pending pods > 5 minutes
• Error rate monitoring per service during drain

**Rollback:**
• Control plane: EKS doesn't support downgrade (major risk)
• Node groups: keep old launch template version, revert node group
• Prevention: always test in dev/staging, have rollback node group ready

**Result:**
• 3 EKS upgrades completed with zero production incidents
• Average upgrade duration: 2 hours for production cluster
• Automated compatibility checks reduced pre-upgrade work by 50%`,
          tips: [
            'Know EKS version support lifecycle (14 months standard)',
            'Discuss PodDisruptionBudget as critical prerequisite',
            'Mention add-on version alignment',
            'Talk about API deprecation detection tooling (pluto)'
          ]
        },
        {
          id: 'k8s7',
          level: 'Senior',
          q: 'Explain Kubernetes networking — Services, Ingress, and CNI.',
          a: `**Kubernetes Networking Model:**

Every pod gets its own IP. Pods can communicate directly with any other pod in the cluster. Services provide stable endpoints for dynamic pod sets.

**Service Types:**

**ClusterIP (Default):**
• Internal-only stable IP
• DNS: service-name.namespace.svc.cluster.local
• Use for service-to-service communication

**NodePort:**
• Exposes service on each node's IP:port
• Rarely used in production (security exposure)

**LoadBalancer:**
• Provisions cloud load balancer (NLB on AWS)
• Used for external traffic entry
• AWS Load Balancer Controller manages NLB lifecycle

**ExternalName:**
• DNS alias to external endpoint
• No proxying, just CNAME

**Ingress (Layer 7):**

NGINX Ingress Controller or AWS ALB Ingress Controller.
Ingress rules define host-based and path-based routing to services.
Annotations configure SSL, rate limiting, WAF.

**ALB Ingress (My Choice on EKS):**
• Provisions native AWS ALB per Ingress (or shared)
• IP mode: routes directly to pod IPs (no NodePort hop)
• WAF integration via annotation
• Cert Manager for TLS

**CNI (Container Network Interface):**

**AWS VPC CNI (My Production Choice):**
• Each pod gets a real VPC IP address
• No overlay network — native VPC routing
• Benefits: VPC Flow Logs see pod-level traffic, Security Groups per pod
• Drawback: IP exhaustion risk in dense clusters (need secondary CIDR)

**Calico:**
• Overlay or BGP mode
• Network policy enforcement (works with AWS CNI)
• Better for network policy granularity

**CoreDNS:**
• Cluster DNS server
• Service discovery via DNS
• NodeLocal DNSCache: run DNS cache on each node (reduces API server load)
• Tuning needed for high-throughput clusters (ndots:5 default causes many lookups)`,
          tips: [
            'Know all Service types and when to use each',
            'Discuss ALB vs NGINX ingress trade-offs',
            'Explain VPC CNI IP exhaustion problem and solutions',
            'Mention ndots tuning for DNS performance'
          ]
        },
        {
          id: 'k8s8',
          level: 'Senior',
          q: 'How do you implement autoscaling in Kubernetes?',
          a: `**Three Autoscaling Dimensions:**

**1. Horizontal Pod Autoscaler (HPA) — Scale pods:**
• Scales deployment replica count based on metrics
• Default: CPU and memory utilization
• Custom: Prometheus metrics via KEDA or custom.metrics.k8s.io
• Scale up fast, scale down slowly (stabilization window)

HPA targeting 60% CPU utilization, min 2, max 20 replicas.

**2. Vertical Pod Autoscaler (VPA) — Right-size pods:**
• Adjusts CPU/memory requests and limits
• Modes: Off (recommend only), Auto (restart pods with new sizing)
• Useful for: initial sizing, batch jobs
• Conflict with HPA: use VPA for requests only, HPA for scaling

**3. Cluster Autoscaler — Scale nodes:**
• Adds nodes when pods are unschedulable
• Removes underutilized nodes
• Configured per node group with min/max limits

**Karpenter (Modern Cluster Autoscaler Alternative):**
• Faster scaling (seconds vs minutes)
• Just-in-time node provisioning
• Spot instance flexibility
• Instance type selection from multiple families
• Native to EKS, managed by AWS now

**KEDA (Kubernetes Event-Driven Autoscaling):**
• Scale on any event: queue depth, Prometheus metric, cron
• Scale to zero (no traffic = 0 pods)
• Perfect for batch/event-driven workloads

KEDA ScaledObject scaling deployment based on SQS queue length, min 0, max 30 replicas.

**My Scaling Strategy per Workload Type:**

• Web APIs: HPA on CPU/RPS, Cluster Autoscaler on nodes
• Batch jobs: KEDA on queue depth, scale to zero
• Data processing: VPA for right-sizing, KEDA for event-driven
• Stateful (DB): Manual scaling only, no autoscaling

**Scaling Safeguards:**
• PodDisruptionBudgets: prevent scale-down from causing outage
• Stabilization windows: prevent thrashing
• Scale-down delay: wait 5 minutes before removing nodes`,
          tips: [
            'Know HPA vs VPA conflict and how to resolve',
            'Explain Karpenter advantages over Cluster Autoscaler',
            'Discuss KEDA for event-driven and scale-to-zero',
            'Mention PDB interaction with scale-down'
          ]
        },
        {
          id: 'k8s9',
          level: 'Senior',
          q: 'How do you manage persistent storage in Kubernetes?',
          a: `**Storage Concepts:**

**PersistentVolume (PV):** Cluster-level storage resource
**PersistentVolumeClaim (PVC):** Pod's request for storage
**StorageClass:** Dynamic provisioning template

**Storage Classes on EKS:**

**gp3 (Default, General Purpose):**
• SSD-backed EBS
• Configurable IOPS and throughput
• Good for: databases, application storage

**io2 Block Express:**
• High performance, high durability
• Use for: high-IOPS databases (PostgreSQL, MySQL)

**EFS (Elastic File System):**
• Shared across pods and nodes (ReadWriteMany)
• Use for: shared file storage, content management
• Performance: lower IOPS than EBS

**FSx for Lustre:**
• High-performance parallel filesystem
• Use for: ML training, HPC workloads

**Dynamic Provisioning:**

StorageClass with gp3 type, xfs filesystem, WaitForFirstConsumer binding (schedules pod before provisioning volume in correct AZ).

PVC referencing that StorageClass — volume provisioned automatically.

**StatefulSet Storage Pattern:**
StatefulSet with volumeClaimTemplate creates PVC per pod replica. Each replica gets its own dedicated EBS volume. Volumes survive pod rescheduling.

**Backup Strategy:**
• Velero: Kubernetes-native backup and restore
• Snapshots EBS volumes, backs up Kubernetes objects
• Scheduled daily backups
• Cross-region backup for DR

**Challenges I've Solved:**
• AZ pinning: gp3 EBS is AZ-specific — use WaitForFirstConsumer to align pod and volume AZ
• Volume expansion: supported with gp3, just edit PVC size (online expansion)
• Performance: tune gp3 IOPS and throughput via StorageClass parameters`,
          tips: [
            'Know EBS vs EFS vs EFS CSI driver',
            'Discuss ReadWriteOnce vs ReadWriteMany',
            'Mention Velero for backup',
            'Talk about StatefulSet volume claim templates'
          ]
        },
        {
          id: 'k8s10',
          level: 'Senior',
          q: 'How do you troubleshoot Kubernetes issues in production?',
          a: `**Troubleshooting Framework:**

Start with symptoms (what users see), work back to cause (what changed or failed).

**Common Scenarios and My Approach:**

**Pods Not Starting (Pending/CrashLoopBackOff):**

kubectl describe pod — first command always:
• Events section: "Insufficient cpu" → resource quota or node capacity
• Events: "Failed to pull image" → registry access, image tag issue
• Events: "MountVolume failed" → PVC not bound, wrong AZ

kubectl logs —previous: crash reason in previous container logs.

**Pod Stuck in Pending:**
• kubectl describe pod: "0/5 nodes available: 5 Insufficient memory"
• Check node capacity: kubectl describe nodes | grep -A 5 Allocated
• Check node group scaling: is cluster autoscaler working?
• Check resource requests: are requests realistic?

**Service Not Reachable:**
• kubectl get endpoints service-name: if empty, pod labels don't match selector
• kubectl exec into pod, curl service DNS: isolate network vs DNS
• Check NetworkPolicy: default deny might be blocking
• kubectl port-forward: bypass Service to test pod directly

**High Memory / OOMKilled:**
• kubectl top pods: find memory consumers
• kubectl describe pod: OOMKilled in last state
• Check if limit is set too low vs actual usage
• VPA recommendation: kubectl get vpa

**etcd Issues:**
• API server slow or timing out
• Check etcd size: should be < 8GB
• Check etcd peer latency
• Compaction needed if etcd has grown large

**Production Troubleshooting Discipline:**
1. Don't make changes without understanding root cause first
2. One change at a time
3. Capture state before changing (kubectl get all -n namespace > before.yaml)
4. Alert team before impactful changes
5. Document what you found and what you changed

**My Toolkit:**
• kubectl, k9s (visual TUI), stern (multi-pod log tailing)
• kubectl-debug for ephemeral debug containers
• Grafana for timeline correlation
• Kibana for log search`,
          tips: [
            'Walk through your systematic troubleshooting process',
            'Know kubectl commands cold: describe, logs, exec, top',
            'Discuss k9s as productivity tool in interviews',
            'Mention the importance of not making blind changes'
          ]
        },
        {
          id: 'k8s11',
          level: 'Senior',
          q: 'How do you implement resource management and quotas in Kubernetes?',
          a: `**Why Resource Management Matters:**

Without resource limits: one misbehaving pod can starve the entire node. Without quotas: one team can consume the entire cluster.

**Resource Requests vs Limits:**

**Requests:** Guaranteed resources. Used for scheduling decisions.
**Limits:** Maximum resources. Exceeded CPU = throttled. Exceeded memory = OOMKilled.

**Best Practices:**
• Always set both requests and limits
• Limits should be reasonable ceiling (not 10x requests)
• CPU: over-provision requests is safe (compressible)
• Memory: under-setting limits causes OOMKill, set conservatively high

**LimitRange (Per Namespace Defaults):**

LimitRange sets default CPU request of 100m and limit of 500m, default memory request of 128Mi and limit of 512Mi. Also enforces max limits to prevent runaway containers.

**ResourceQuota (Per Namespace Cap):**

ResourceQuota limits namespace to: 20 CPU cores total, 40Gi memory total, 100 pods, 10 LoadBalancer services, 50 PVCs.

**Quota by Priority:**

QoS Classes (determined by request/limit relationship):
• Guaranteed: request == limit (highest priority, last to be evicted)
• Burstable: request < limit
• BestEffort: no request or limit (first to be evicted)

**PriorityClass for Critical Workloads:**

PriorityClass with value 1000000 for platform-critical pods. Pod spec references priorityClassName. Kubernetes will evict lower priority pods to schedule high priority ones.

**Vertical Pod Autoscaler for Right-Sizing:**
Deploy VPA in recommendation mode initially. kubectl get vpa — shows recommended values. Apply as request baseline. Prevents over-provisioning.

**My Governance Process:**
• Initial namespace quota: small (requires justification to increase)
• Monthly utilization review: flag teams consistently at quota
• Over-provisioned quotas reclaimed (use it or lose it)`,
          tips: [
            'Know QoS classes and eviction priority',
            'Discuss LimitRange as safety net for missing limits',
            'Mention VPA for right-sizing discovery',
            'Talk about quota governance process'
          ]
        },
        {
          id: 'k8s12',
          level: 'Senior',
          q: 'How do you implement service mesh and when do you need it?',
          a: `**What Service Mesh Provides:**

• mTLS: encrypted, authenticated service-to-service traffic
• Traffic management: canary, circuit breaking, retries
• Observability: automatic traces and metrics per service call
• Policy: fine-grained access control between services

**When You DON'T Need a Service Mesh:**

• Fewer than 20 services: overhead not justified
• Simple traffic patterns: no need for advanced routing
• Team doesn't have operational capacity to run mesh
• mTLS not required by compliance (most cases)

**When You DO Need One:**

• Compliance requires encrypted internal traffic (zero-trust)
• Complex canary/traffic splitting requirements
• Need automatic distributed tracing without code changes
• Fine-grained service-to-service authorization policies

**Istio vs Linkerd (My Evaluation):**

**Istio:**
• Feature-rich: traffic management, security, observability
• More complex: steep learning curve, higher resource overhead
• Good for: complex requirements, large scale

**Linkerd:**
• Simpler, lighter weight
• Excellent mTLS and observability out of the box
• Less feature-rich for traffic management
• Good for: mTLS + observability without complexity

**Cilium (eBPF-based):**
• Kernel-level networking, very low overhead
• Network policy enforcement
• Service mesh capabilities via eBPF (no sidecar)
• Growing adoption, modern approach

**My Experience:**
Evaluated Istio at Enterprise Pharma for zero-trust internal traffic. Decided against it: compliance did not require encrypted internal traffic (already in private VPC), complexity not justified, team capacity limited. Used Kubernetes Network Policies instead for traffic isolation — 80% of the value at 10% of the complexity.

**If I Implemented a Mesh:**
Start with Linkerd: simpler operations, automatic mTLS, excellent observability. Add Istio only if traffic management complexity requires it.`,
          tips: [
            'Be honest about service mesh complexity vs value',
            'Know Cilium as modern alternative (eBPF)',
            'Discuss what problems specifically require a service mesh',
            'Show you can say "we didn\'t need it" and explain why'
          ]
        },
        {
          id: 'k8s13',
          level: 'Mid-Senior',
          q: 'How do you implement Kubernetes RBAC for a multi-team environment?',
          a: `**RBAC Concepts:**

• Role: permissions within a namespace
• ClusterRole: permissions cluster-wide or reusable
• RoleBinding: binds Role to user/group in a namespace
• ClusterRoleBinding: binds ClusterRole cluster-wide

**Team-Based RBAC Model:**

**Roles I Define:**

**developer Role (per namespace):**
Allows get/list/watch on pods, deployments, services, configmaps, ingresses. Allows create/update on deployments (for restarting). No delete on production resources.

**devops Role (per namespace):**
Full access within namespace: get/list/watch/create/update/delete on most resources. Excludes: Roles, RoleBindings (prevent privilege escalation).

**Platform Admin ClusterRole:**
Full cluster access for platform team only.

**Binding to AD Groups (AWS SSO + EKS):**

aws-auth configmap in kube-system maps IAM role ARN to Kubernetes username and groups. RoleBinding then binds Kubernetes group to Role in namespace.

**Service Account RBAC:**

Least privilege per service account:
• Application SA: read-only ConfigMaps and Secrets (only what it needs)
• CI SA: deploy permissions only
• Monitoring SA: read-only cluster-wide

**Audit and Review:**
• kubectl auth can-i command to verify permissions
• Monthly: review ClusterRoleBindings (widest scope)
• Alert on new ClusterAdmin bindings (high risk)
• RBAC visualization tools (rbac-lookup, rakkess)

**Common Mistakes I Avoid:**
• Giving cluster-admin to application service accounts
• Using default service account (always create dedicated)
• Namespace-wide wildcard permissions
• Forgetting to bind groups, not individual users (group membership managed in AD)`,
          tips: [
            'Know Role vs ClusterRole distinction',
            'Discuss RBAC for service accounts separately from humans',
            'Mention aws-auth configmap for EKS specifically',
            'Talk about periodic RBAC audit process'
          ]
        },
        {
          id: 'k8s14',
          level: 'Senior',
          q: 'How do you handle stateful applications in Kubernetes?',
          a: `**Stateful vs Stateless:**

Stateless apps: any pod is interchangeable, can restart anywhere. Stateful apps: each instance has identity, persistent data, specific startup/shutdown order.

**StatefulSet Features:**

• Stable, unique pod names: postgres-0, postgres-1, postgres-2
• Stable network identity: postgres-0.postgres.namespace.svc.cluster.local
• Ordered deployment: 0 starts and becomes ready before 1
• Ordered scaling: scale down from highest index
• Per-pod PersistentVolumeClaims: postgres-0 always gets its volume

**When to Use StatefulSet vs External Managed Service:**

**Use StatefulSet for:**
• Stateful middleware: message queues, Elasticsearch clusters
• Development/non-critical databases
• Workloads requiring Kubernetes-native management

**Use External Managed Service (RDS, ElastiCache) for:**
• Production databases: operational simplicity >> Kubernetes benefits
• Compliance requirements: managed service easier to audit
• High availability without deep Kubernetes expertise

**My Production Approach:**
Production databases on RDS (managed). Elasticsearch on StatefulSet (EKS) for log storage — volume and query patterns better suited to self-managed.

**Elasticsearch StatefulSet Pattern:**

3-replica StatefulSet with anti-affinity rules preventing multiple replicas on same node. Each pod gets its own EBS volume via volumeClaimTemplate. TopologySpreadConstraints spread across AZs. PodDisruptionBudget ensures minimum 2 available during disruptions.

**Headless Service for StatefulSet:**
Headless service (clusterIP: None) enables direct pod DNS resolution — elasticsearch-0.elasticsearch.logging.svc.cluster.local routes to specific pod for cluster formation.

**Operations:**
• Scale up: add replica, it joins cluster and syncs data
• Scale down: drain data from highest-index replica first
• Upgrade: rolling update with partition strategy`,
          tips: [
            'Know when NOT to use StatefulSet (use managed services)',
            'Discuss headless service role in StatefulSet DNS',
            'Mention PodDisruptionBudget for safe scaling',
            'Talk about operator pattern for complex stateful apps'
          ]
        },
        {
          id: 'k8s15',
          level: 'Senior',
          q: 'What are Kubernetes operators and when have you used them?',
          a: `**Operator Pattern:**

An operator is a Kubernetes controller that extends the API with custom resources (CRDs) and encodes operational knowledge for complex applications.

**Core Concepts:**

• CRD (Custom Resource Definition): defines new Kubernetes object type
• Custom Resource (CR): instance of a CRD
• Controller: watches CRs, reconciles actual vs desired state
• Operator = CRD + Controller + operational knowledge

**Operators I've Used:**

**External Secrets Operator:**
ExternalSecret CR pulls secrets from Vault and syncs to Kubernetes Secret automatically. Refreshes on interval. No manual secret management. This is production-critical — all our services use it.

**Cert-Manager:**
Certificate CR requests TLS cert from Let's Encrypt or internal CA. Cert-manager controller handles ACME challenge, cert renewal, secret creation. Eliminates all manual cert management.

**Prometheus Operator (via kube-prometheus-stack):**
ServiceMonitor CR discovers services to scrape — no Prometheus config editing. PrometheusRule CR defines alerts as code. Platform team writes ServiceMonitors, not Prometheus configs.

**AWS Load Balancer Controller:**
Ingress CR provisions AWS ALB automatically. Manages listener rules, target groups, WAF associations. Declarative networking.

**Crossplane (Evaluated):**
RDSInstance CR provisions actual AWS RDS. True infrastructure-as-Kubernetes-resource. Evaluated for self-service database provisioning — powerful but operational complexity was high for our team maturity.

**When to Use vs Not Use:**

Use: Automates complex operational tasks that would otherwise require runbooks. Has an active community. Solves a real pain point.

Avoid: Building your own operator for simple tasks. Operators add operational complexity (another controller, another CRD to manage).`,
          tips: [
            'Know External Secrets Operator deeply — very common',
            'Discuss cert-manager as standard platform component',
            'Explain when you would build vs use existing operator',
            'Mention operator-sdk or Kubebuilder if asked about building'
          ]
        },
        {
          id: 'k8s16',
          level: 'Mid-Senior',
          q: 'How do you implement health checks and readiness in Kubernetes?',
          a: `**Three Probe Types:**

**livenessProbe:**
• Purpose: Is this container alive? If not, restart it.
• Failure action: Container killed and restarted
• Use case: Detect deadlocks or infinite loops
• Risk: Set too aggressive → restart loops (worse than the bug)

**readinessProbe:**
• Purpose: Is this container ready to serve traffic?
• Failure action: Removed from Service endpoints (no traffic)
• Use case: Slow startup, database connection warming, cache loading
• Most important probe for zero-downtime deployments

**startupProbe:**
• Purpose: Give slow-starting containers time without triggering liveness
• Failure action: Container killed after failureThreshold × periodSeconds
• Use case: Java apps, apps loading large datasets

**Probe Configuration Best Practices:**

HTTP probe on /health/ready endpoint. StartupProbe gives 5 minutes (30 × 10s) for startup. ReadinessProbe checks every 10 seconds, fails after 3 consecutive failures. LivenessProbe only after startupProbe passes, fails after 3 checks.

**Health Endpoint Design:**

/health/live (liveness): Returns 200 if process is alive. Simple — no dependency checks.
/health/ready (readiness): Returns 200 only if database connected, cache warm, external dependencies reachable.

**Why Separate Liveness from Readiness:**

If database is down: readiness fails (stop sending traffic) but liveness succeeds (don't restart — restart won't fix DB). Restarting during DB outage causes cascading restart loops.

**Rolling Deployment Safety:**

With readinessProbe: Kubernetes waits for new pod to pass readiness before removing old pod from endpoints. maxUnavailable: 0 ensures zero disruption.

**My Debugging Pattern:**
kubectl describe pod — events show probe failures and reasons.
kubectl exec curl pod-ip:port/health/ready — test probe directly.`,
          tips: [
            'Distinguish liveness vs readiness purpose clearly',
            'Explain startupProbe benefit for slow-starting apps',
            'Discuss what to check in readiness vs liveness endpoints',
            'Mention maxUnavailable and maxSurge interaction with readiness'
          ]
        },
        {
          id: 'k8s17',
          level: 'Senior',
          q: 'How do you implement pod scheduling, affinity, and topology constraints?',
          a: `**Scheduling Control Mechanisms:**

**Node Selector (Simple):**
nodeSelector: disktype: ssd — schedule only on nodes with this label. Simple but inflexible.

**Node Affinity (Flexible):**
requiredDuringSchedulingIgnoredDuringExecution: hard requirement.
preferredDuringSchedulingIgnoredDuringExecution: soft preference.

Node affinity requiring node in us-east-1a or us-east-1b AZ, and preferring spot instances.

**Pod Anti-Affinity (Spread Replicas):**

Prefer to schedule pods of same app on different nodes (hostname topology key). Required: never schedule two replicas on same node (hard anti-affinity for HA).

**Taints and Tolerations (Node Specialization):**

Taint node: kubectl taint nodes gpu-node-1 gpu=true:NoSchedule
Only pods with matching toleration can schedule on that node.
My use: Mac runners for iOS builds are tainted "macos=true:NoSchedule" — only iOS build pods tolerate it.

**TopologySpreadConstraints (Modern, Preferred):**

Spread pods across zones with maxSkew of 1 using zone topology key. WhenUnsatisfiable: DoNotSchedule ensures hard enforcement. Ensures no zone has more than 1 extra pod vs other zones.

**My Production Use Cases:**

• High-availability: pod anti-affinity across nodes + topology spread across AZs
• GPU/specialized nodes: taints ensure only specific workloads consume expensive resources
• Spot instances: prefer spot, tolerate on-demand for guaranteed capacity
• Mac runners: tainted for iOS exclusivity

**Scheduling Priority:**
PriorityClass for platform-critical components — if cluster is under pressure, platform control plane pods evict lower-priority application pods.`,
          tips: [
            'Know difference between affinity and anti-affinity',
            'Discuss TopologySpreadConstraints as modern alternative to anti-affinity',
            'Explain taints and tolerations with concrete example',
            'Mention PriorityClass for critical workloads'
          ]
        },
        {
          id: 'k8s18',
          level: 'Senior',
          q: 'How do you implement Kubernetes cost optimization?',
          a: `**Kubernetes Cost Drivers:**

• Right-sizing: pods requesting too much → wasted node capacity
• Idle resources: nodes with low utilization
• Over-provisioned node groups: too many on-demand nodes
• Storage: unused PVCs accumulating
• Data transfer: cross-AZ traffic (EKS pod-to-pod across AZs)

**Visibility Tools:**

**Kubecost:**
• Cost per namespace, deployment, pod
• Efficiency score (actual usage vs requested)
• Idle cost by node and cluster
• Savings recommendations
• Integrated into Backstage developer portal

**AWS Cost and Usage Report + Athena:**
• Tag-based allocation to teams
• Node-level cost breakdown
• Spot vs on-demand split

**Right-Sizing Process:**

VPA in recommendation mode — run for 1 week, collect data.
kubectl get vpa: shows recommended requests per container.
Apply gradually: start with non-prod, validate, then prod.

Target: actual usage / request ratio of 60-70%. Below 40% = over-provisioned.

**Node Optimization:**

**Spot Instances for Non-Critical:**
• Dev/staging node groups: 100% spot (massive savings)
• Production: mixed — spot for stateless, on-demand for stateful/critical
• Karpenter: automatically picks cheapest available spot instance type

**Scheduled Scaling:**
• Dev/staging clusters: scale to 0 nodes evenings and weekends
• CronJob or Karpenter NodePool with scheduled scaling
• Saves 60-70% on non-prod compute

**PVC Cleanup:**
• Alert on PVCs not mounted to any pod for > 7 days
• Monthly cleanup of orphaned PVCs
• StorageClass reclaim policy: Delete (not Retain) for ephemeral storage

**Data Transfer Optimization:**
• Service topology hints: prefer same-AZ routing when possible
• Topology-aware routing annotation on Services
• Reduces cross-AZ data transfer charges (significant in EKS)

**Results:**
• 40% cost reduction on EKS after right-sizing + spot adoption
• Dev cluster cost reduced 65% with scheduled scaling`,
          tips: [
            'Know Kubecost as the go-to K8s cost tool',
            'Discuss spot instance strategies for EKS',
            'Mention scheduled scaling for non-prod',
            'Talk about cross-AZ data transfer cost (often overlooked)'
          ]
        },
        {
          id: 'k8s19',
          level: 'Senior',
          q: 'How do you implement configuration management in Kubernetes?',
          a: `**Configuration Types:**

• ConfigMaps: non-sensitive configuration data
• Secrets: sensitive data (credentials, keys, tokens)
• External configuration: Vault, AWS Parameter Store, AWS Secrets Manager

**ConfigMap Best Practices:**

Separate ConfigMaps by concern: app-config (app settings), db-config (database URLs), feature-flags (runtime flags).

Mount as volume (preferred for large configs) or environment variables (simple key-value).

Volume mount: changes to ConfigMap reflected in pod within 60 seconds without restart. Environment variable: requires pod restart for changes.

**Secret Management Strategy:**

**Never store sensitive data in ConfigMaps.**

**Option 1: Kubernetes Secrets (Basic):**
• Base64 encoded (not encrypted by default — enable envelope encryption)
• Enable KMS encryption for etcd secrets
• Acceptable for non-critical secrets in small environments

**Option 2: External Secrets Operator + Vault (My Production Approach):**
ExternalSecret CR pulls from Vault path, refreshes every hour, syncs to Kubernetes Secret automatically. Application reads standard Kubernetes Secret — no Vault SDK needed in app.

**Option 3: Vault Agent Injector:**
Sidecar injects secrets as files into pod. App reads from filesystem. No Kubernetes Secret created (more secure).

**Configuration Versioning:**
• ConfigMaps in GitOps repo (version controlled)
• Changes via PR (reviewed, audited)
• Kustomize: overlay per environment without duplication

**Immutable ConfigMaps:**
Mark as immutable: true for configuration that shouldn't change without pod restart. Kubernetes refuses updates — prevents accidental live changes.

**Reloading Configurations:**
• Stakater Reloader: watches ConfigMap/Secret, rolls deployment automatically
• Eliminates need for manual pod restarts after config changes`,
          tips: [
            'Know difference between volume mount vs env var for ConfigMap',
            'Discuss External Secrets Operator as production pattern',
            'Mention Kustomize for environment-specific configuration',
            'Talk about Reloader for automatic pod restart on config change'
          ]
        },
        {
          id: 'k8s20',
          level: 'Senior',
          q: 'How do you implement observability natively in Kubernetes workloads?',
          a: `**Observability-by-Default Platform Standard:**

Every workload deployed through our platform gets observability automatically — no extra work from development teams.

**Automatic Metrics Collection:**

ServiceMonitor CR auto-configured per deployment via platform Helm chart:
ServiceMonitor with matchLabels selecting the service, scraping /metrics endpoint every 30 seconds.

Platform Helm chart creates ServiceMonitor automatically if metrics: enabled: true in values.

**Standard Metrics Endpoint:**

Every service must expose /metrics in Prometheus format. Platform enforces via readiness check pattern. Application libraries: prom-client (Node.js), prometheus-client (Python), micrometer (Java).

**Pre-Built Dashboards:**

Platform provides standard Grafana dashboards out of the box:
• Request rate, error rate, latency (RED method) per service
• Resource usage: CPU, memory, pod count
• JVM metrics (for Java services): heap, GC, threads
• Node.js metrics: event loop lag, heap

Teams can add custom dashboards alongside standard ones.

**Alerting Templates:**

PrometheusRule deployed per namespace with standard alerts:
• Pod restart rate > 5 in 10 minutes
• Container OOMKilled
• Error rate > 1% for 5 minutes
• High latency: p99 > 1 second

Teams customize thresholds via Helm values.

**Log Standards:**

Platform enforces structured logging via admission webhook:
• JSON format required
• Required fields: timestamp, level, service, trace_id
• Non-compliant pods flagged in compliance dashboard

**Distributed Tracing:**

OpenTelemetry collector deployed as DaemonSet. Services auto-instrumented via admission webhook (Java agent injection). Traces forwarded to Tempo backend, viewable in Grafana.

**Result:**
• 100% of platform-deployed services have metrics and alerts
• Zero observability configuration required from developers
• MTTR reduced 60% (faster finding root cause)`,
          tips: [
            'Discuss observability as platform responsibility',
            'Know ServiceMonitor vs PodMonitor difference',
            'Mention OpenTelemetry collector DaemonSet pattern',
            'Talk about standard dashboards vs custom dashboards'
          ]
        }
      ]
    },
    cicd: {
      title: 'CI/CD & Automation',
      icon: '🔄',
      questions: [
        {
          id: 'cicd1',
          level: 'Senior',
          q: 'How do you design CI/CD pipelines as a platform capability?',
          a: `**Pipeline as Platform Service:**

**Design Principles:**
• Self-service pipeline creation
• Standardized stages with flexibility
• Security built-in by default
• Observable and debuggable

**Pipeline Architecture:**

Reusable Workflows (Platform-owned) provide common functionality to Service Pipelines (Team-owned config), which deploy through GitOps/Harness.

**GitHub Actions Implementation:**

**Reusable Workflow (Platform-owned):**
Workflow_call trigger with inputs for service_name and environment, calling separate build, security-scan, and deploy workflows.

**Service Pipeline (Developer-owned):**
Simple config referencing company/platform reusable workflow with just service name and environment parameters.

**Pipeline Stages (Built into platform):**

1. Build: Compile, unit tests
2. Security: SAST, dependency scan, container scan
3. Package: Docker build, push to registry
4. Deploy: GitOps update or direct deploy
5. Verify: Smoke tests, deployment verification
6. Notify: Slack, portal update

**Platform Features:**
• Automatic secret injection (Vault OIDC)
• Build caching for performance
• Parallel execution
• Deployment approvals
• Rollback capabilities

**Results:**
• 60+ pipelines using shared workflows
• 30% faster builds
• Consistent security scanning
• Self-service for developers`,
          tips: [
            'Emphasize reusability and standardization',
            'Discuss customization options',
            'Mention security integration',
            'Talk about pipeline metrics'
          ]
        },
        {
          id: 'cicd2',
          level: 'Senior',
          q: 'How do you implement progressive delivery (canary, blue-green)?',
          a: `**Progressive Delivery Strategies:**

**1. Canary Deployments:**
Load balancer splits traffic between v1 (90%) and v2 (10%), monitors metrics, then gradually increases or rolls back.

**2. Blue-Green Deployments:**
Router switches between Blue (current) and Green (new), enabling instant switch and rollback.

**Implementation with Harness:**

**Canary Pipeline Stages:**

Canary stage deploys single instance, runs verification with Prometheus metrics for 10 minutes, then cleans up canary. Primary stage follows with rolling deployment.

**Verification Metrics:**
• Error rate (less than baseline + 5%)
• Latency (p99 less than baseline + 10%)
• Throughput (stable)
• Custom business metrics

**Feature Flags Integration:**

Runtime feature flags enabling gradual rollout to users based on targeting rules, independent of deployment.

**Platform Capabilities:**
• Automated canary analysis
• One-click rollback
• Deployment verification
• Feature flag management
• Traffic shifting controls

**My Implementation:**
• Harness for canary to EKS
• Prometheus metrics for verification
• Automatic rollback on failure
• 10% to 50% to 100% progression
• Slack notifications at each stage`,
          tips: [
            'Know canary vs blue-green trade-offs',
            'Discuss verification strategies',
            'Mention feature flags integration',
            'Talk about rollback procedures'
          ]
        },
        {
          id: 'cicd3',
          level: 'Senior',
          q: 'How do you handle secrets in CI/CD pipelines securely?',
          a: `**Secrets Management Architecture:**

**Principle: No Static Secrets**
• Dynamic, short-lived credentials
• Just-in-time secret access
• Complete audit trail

**Implementation: Vault + GitHub OIDC**

**Architecture Flow:**
GitHub Actions sends JWT token to HashiCorp Vault, which validates claims and returns dynamic secrets that are injected into pipeline execution.

**Vault Configuration:**

JWT auth backend configured for GitHub OIDC. Role binds to specific repository and branch with short-lived tokens and appropriate policies.

**GitHub Actions Usage:**

Vault action retrieves secrets using JWT auth method, mapping secret paths to environment variables for database passwords, AWS credentials, etc.

**Secret Types Managed:**
• Static secrets: API keys, tokens (KV engine)
• Dynamic AWS: IAM credentials (AWS engine)
• Dynamic DB: Database passwords (Database engine)
• Certificates: TLS certs (PKI engine)

**Platform Features:**
• Centralized secret management
• Automatic rotation
• Audit logging for compliance
• Self-service secret creation
• Emergency access procedures

**Security Practices:**
• Secrets never in logs (masked)
• Short TTL for all credentials
• Least privilege per pipeline
• Regular access reviews`,
          tips: [
            'Know Vault auth methods well',
            'Discuss OIDC vs AppRole',
            'Mention secret rotation',
            'Talk about emergency access'
          ]
        },
        {
          id: 'cicd4',
          level: 'Senior',
          q: 'Describe your experience migrating from Jenkins to GitHub Actions.',
          a: `**Migration Overview:**

Led enterprise-wide migration of 60+ pipelines.

**Assessment & Planning:**

• Audited all Jenkinsfiles and shared libraries
• Categorized by complexity (simple/medium/complex)
• Created migration priority based on business criticality

**Technical Migration:**

• Converted Groovy pipelines to YAML workflows
• Replaced shared libraries with reusable workflows and composite actions
• Migrated from Jenkins credentials to GitHub Secrets + Vault

**Infrastructure Setup:**

• Set up self-hosted runners (Mac for iOS builds, Linux for general)
• Implemented runner groups for security isolation
• Configured OIDC with HashiCorp Vault

**Change Management:**

• Pilot with 2-3 willing teams first
• Created comprehensive documentation and training
• Parallel running during 2-week transition period
• Office hours for developer support

**Challenges & Solutions:**

**Groovy to YAML:** Created mapping guides and examples for common patterns.

**Shared Libraries:** Converted to composite actions and reusable workflows.

**Complex Pipelines:** Worked directly with teams on migration, documented edge cases.

**Secrets Migration:** Implemented Vault OIDC, no static credentials needed.

**Results:**
• 30% reduction in average build time
• Improved developer self-service
• Better visibility with GitHub's native PR integration
• Eliminated Jenkins infrastructure maintenance
• Zero production incidents during migration`,
          tips: [
            'Emphasize change management alongside technical',
            'Discuss how you handled resistance',
            'Know GitHub Actions syntax well',
            'Mention cost comparison if asked'
          ]
        },
        {
          id: 'cicd5',
          level: 'Senior',
          q: 'How do you build reusable GitHub Actions workflows for an organization?',
          a: `**Reusable Workflow Architecture:**

Platform team owns reusable workflows. Development teams consume them with minimal configuration.

**Three Reusability Patterns:**

**1. Reusable Workflows (workflow_call):**
Entire workflow callable from other workflows. Supports inputs and secrets. Versioned via tags.

Platform workflow triggered by workflow_call with inputs for service_name, environment, run_tests, and secrets for AWS_ROLE_ARN and VAULT_ADDR.

**2. Composite Actions:**
Reusable steps within a single job. Lighter than full workflow. Good for: setup steps, notification steps, utility logic.

**3. JavaScript/Docker Actions:**
Published to Marketplace or private registry. Complex logic in proper programming language. Good for: complex integrations, reusable tools.

**Organization Structure:**

.github/ repository in GitHub org:
• workflows/ — reusable workflow templates
• actions/ — composite actions
• CODEOWNERS — platform team owns everything

**Versioning Strategy:**

Tag releases: v1.0.0, v1.1.0, v2.0.0
Branches: v1, v2 (major version branches)
Teams pin to major: @v1 (gets patch/minor updates automatically)

**Input/Output Design:**

Well-designed inputs:
• service_name: string, required
• environment: enum (dev/staging/prod), required
• docker_tag: string, default \${{ github.sha }}
• run_integration_tests: boolean, default true
• notification_channel: string, optional

**Security Considerations:**
• Secrets passed explicitly, not inherited
• Caller workflow must be approved to use reusable workflow
• Separate required workflows for security gates (can't be bypassed)

**My Reusable Workflow Library:**
• build-and-push.yml: Docker build, scan, push to ECR
• deploy-eks.yml: Helm upgrade to EKS via Harness
• deploy-ios.yml: iOS build via Fastlane
• deploy-android.yml: Android build and Play Store upload
• security-scan.yml: Trivy, Snyk, secrets detection
• notify.yml: Slack notification with job status`,
          tips: [
            'Know workflow_call vs composite action use cases',
            'Discuss versioning strategy for shared workflows',
            'Mention required workflows for enforcing security gates',
            'Talk about secrets handling in reusable workflows'
          ]
        },
        {
          id: 'cicd6',
          level: 'Senior',
          q: 'How do you implement deployment strategies — rolling, blue-green, canary in practice?',
          a: `**Deployment Strategies Compared:**

**Rolling Update (Default Kubernetes):**
Gradually replaces old pods with new ones. maxSurge: 1 (one extra pod during update), maxUnavailable: 0 (never remove old until new is ready). Simple, built-in, but no easy instant rollback.

**Blue-Green:**
Two identical environments. Switch traffic all at once (DNS or load balancer). Instant rollback: just switch back. Requires 2x infrastructure.

**Canary:**
Route small % of traffic to new version. Gradually increase if metrics are good. Most risk-tolerant but most complex to implement correctly.

**My Implementation at Enterprise Pharma:**

**Kubernetes Rolling (Most Services):**
Default strategy with maxUnavailable: 0. ReadinessProbe prevents traffic to non-ready pods. Automated rollback via Harness if error rate spikes.

**Harness Canary Pipeline:**
Stage 1 (Canary): Deploy 1 new pod, verify Prometheus metrics (error rate, latency) for 10 minutes.
Stage 2 (Primary): If Stage 1 passes, rolling deploy to all pods.
Harness automatically rolls back if metrics breach thresholds.

**ALB Weighted Target Groups (Blue-Green):**
Two target groups (blue: current, green: new). ALB listener rule: 90% blue, 10% green during testing. Switch: 0% blue, 100% green. Instant rollback: reverse weights.

**Feature Flags as Deployment Strategy:**
For risky features: deploy behind flag (all users on new code but feature disabled). Gradually enable via LaunchDarkly. True zero-risk deployment.

**When to Use Which:**
• High-frequency, low-risk: rolling (fast, simple)
• High-risk API changes: canary (validate with real traffic)
• Database schema changes: blue-green (instant rollback if needed)
• User-visible features: feature flags (decouple deploy from release)`,
          tips: [
            'Know the difference between deploy and release',
            'Discuss Harness vs ArgoCD Rollouts for canary',
            'Mention feature flags as a deployment strategy',
            'Talk about database migration in context of blue-green'
          ]
        },
        {
          id: 'cicd7',
          level: 'Senior',
          q: 'How do you handle database migrations in CI/CD pipelines?',
          a: `**Database Migration Challenges:**

• Migrations must run before new code deploys (or simultaneously)
• Migrations must be backward compatible (old code runs against new schema)
• Failed migration must not leave database in broken state
• Zero-downtime requirements complicate irreversible migrations

**Migration Tools:**

• Flyway / Liquibase: Java ecosystem, versioned SQL migrations
• Alembic: Python/SQLAlchemy migrations
• Prisma Migrate: Node.js ORM migrations
• Raw SQL with versioning: simple, explicit

**CI/CD Integration Patterns:**

**Pattern 1: Kubernetes Job (My Preferred):**
Migration Job runs before new deployment. Pipeline waits for Job completion. If migration fails, deployment stops. New deployment only starts after successful migration.

GitHub Actions step: run migration Job, wait for completion, fail pipeline if Job fails, then proceed to deploy new app version.

**Pattern 2: Init Container:**
Migration runs as init container in same pod as application. Application container doesn't start until migration succeeds. Simple but couples migration to each pod startup (runs N times for N replicas).

**Pattern 3: Application Startup (Not Recommended):**
Application runs migration on startup. Risk: multiple instances race on startup. Hard to control. Avoid in production.

**Zero-Downtime Migration Rules (Expand/Contract Pattern):**

**Expand Phase (safe to deploy with old code):**
• Add new column (nullable, no default)
• Add new index (concurrent)
• Add new table

**Migrate Phase:**
• Backfill data in new column
• Dual-write in application code

**Contract Phase (safe only after all instances updated):**
• Remove old column
• Remove old table

**My Process:**
Expand migration deployed → new code runs alongside old code (both work with expanded schema) → old code retired → contract migration deployed.`,
          tips: [
            'Know expand/contract pattern for zero-downtime migrations',
            'Discuss Kubernetes Job vs init container approach',
            'Mention backward-compatible migration requirement',
            'Talk about rollback strategy for failed migrations'
          ]
        },
        {
          id: 'cicd8',
          level: 'Senior',
          q: 'How do you implement pipeline security scanning and compliance gates?',
          a: `**Security as a Non-Negotiable Gate:**

Security scanning must block deployments, not just report. Every pipeline has mandatory security stages.

**Scanning Categories and Tools:**

**SAST (Static Application Security Testing):**
• Semgrep: fast, rule-based, supports many languages
• CodeQL: GitHub-native, deeper analysis (slower)
• Configured per language: Python rules, JavaScript rules, Groovy rules
• Zero high/critical findings allowed to merge

**SCA (Software Composition Analysis):**
• Snyk: dependency vulnerability scanning with fix PRs
• OWASP Dependency Check: open source alternative
• npm audit / pip-audit / bundler-audit: language-native
• Block on CRITICAL findings, alert on HIGH

**Container Scanning:**
• Trivy: fast, comprehensive (OS + app dependencies)
• Integrated at build time (scan before push)
• ECR Inspector: continuous scanning post-push
• Base image policy: deny unless on approved list

**IaC Scanning:**
• Checkov: Terraform, CloudFormation, Kubernetes manifests
• tflint: Terraform-specific linting
• Integrated into terraform plan workflow

**Secrets Detection:**
• Gitleaks: scan git history and new commits
• Trufflehog: deep entropy-based detection
• Pre-commit hook + CI enforcement (defense in depth)

**Pipeline Implementation:**

Sequential security stages in GitHub Actions:
1. secrets-scan: Gitleaks — fails on any finding
2. sast: Semgrep — fails on high/critical
3. dependency-scan: Snyk — fails on critical
4. build: Docker build
5. container-scan: Trivy — fails on critical
6. deploy: only if all above pass

**Compliance Gate:**
Required workflows (GitHub organization setting) — teams cannot skip or modify security stages. Even platform team changes go through review.

**Exception Process:**
Security exception requires: CISO approval, Jira ticket, expiry date, mitigating control documented. Tracked in compliance dashboard.`,
          tips: [
            'Know SAST vs DAST vs SCA definitions',
            'Discuss required workflows as enforcement mechanism',
            'Mention exceptions process (security can\'t be absolute "no")',
            'Talk about false positive handling in scanning tools'
          ]
        },
        {
          id: 'cicd9',
          level: 'Senior',
          q: 'How do you implement pipeline observability and metrics?',
          a: `**Why Pipeline Observability:**

If you can't measure your CI/CD platform, you can't improve it. Pipeline metrics drive platform decisions.

**Key Pipeline Metrics I Track:**

**DORA Metrics:**
• Deployment Frequency: how often code reaches production
• Lead Time for Changes: PR opened to production deployment
• Change Failure Rate: deployments causing incidents / total deployments
• Mean Time to Recovery: time from incident to resolution

**Pipeline Health Metrics:**
• Pipeline success rate per workflow (target > 99%)
• Build duration per workflow (track trends)
• Queue time (runner availability indicator)
• Flaky test rate (tests failing intermittently)

**Platform Efficiency:**
• Self-service adoption (% pipelines using platform templates)
• Secrets injection success rate
• Cache hit rate (build performance)
• Runner utilization per pool

**Data Collection:**

GitHub Actions → CloudWatch:
Custom action posts job metrics to CloudWatch at end of each workflow. Metrics: job_duration, job_status, runner_type, workflow_name.

**Grafana Dashboards:**

Dashboard views:
• Deployment frequency by team/service (calendar heatmap)
• Build duration trend over 30 days per workflow
• Success/failure rate by workflow
• Runner queue depth and availability
• Lead time funnel: commit → PR → merge → deploy → production

**Alerting on Pipeline Health:**
• Success rate drops below 95%: alert platform on-call
• Build duration increases 50% vs 7-day average: alert + investigate
• Queue time > 10 minutes: scale runners or investigate

**Monthly Platform Health Report:**
Share DORA metrics with engineering leadership. Show trends. Identify teams with low deployment frequency (coaching opportunity). Celebrate improvements.`,
          tips: [
            'Know DORA metrics and how to measure them',
            'Discuss build metrics collection from GitHub Actions',
            'Mention flaky test tracking as quality metric',
            'Talk about using metrics to drive platform improvements'
          ]
        },
        {
          id: 'cicd10',
          level: 'Senior',
          q: 'How do you handle multi-environment promotion in CI/CD?',
          a: `**Environment Promotion Philosophy:**

Code should flow through environments in one direction: dev → staging → production. Each environment validates different concerns.

**Environment Purposes:**

**Dev/Integration:**
• Fast feedback: every PR, every merge
• Automated tests: unit, integration
• No manual approval
• Data: synthetic, anonymized

**Staging:**
• Production-like environment
• Full integration testing
• Performance testing
• Stakeholder UAT
• Manual approval for some changes
• Data: anonymized copy of prod

**Production:**
• Real users, real data
• Change approval required (ServiceNow ticket)
• Deployment during maintenance windows for risky changes
• Monitoring spike post-deployment

**Promotion Strategies:**

**1. Push-based (GitHub Actions Direct):**
Separate workflow files per environment. Merge to main → auto-deploy to dev. Workflow dispatch or tag → staging deploy. Approved release → production deploy.

**2. Pull-based GitOps (My Preferred):**
CI updates image tag in gitops repo for each environment. ArgoCD detects change and syncs. Promotion = PR to update production image tag (reviewed and approved).

**3. Harness Pipeline Stages:**
Single pipeline with multiple stages. Each stage is an environment. Manual approval gate between staging and production. Automatic rollback on failure.

**Approval Workflow:**

GitHub Environments with required reviewers:
• Production environment: requires 2 approvals (team lead + platform)
• Linked to ServiceNow change request via comment
• Deployment log captured for audit

**Automated Promotion Criteria:**
Before auto-promoting dev → staging:
• All tests passing
• Security scan clean
• Code coverage above threshold
• No open critical bugs linked to this version

**Production Freeze:**
• Change freeze periods: major holidays, quarter-end
• Emergency deployments: expedited approval process documented`,
          tips: [
            'Discuss push vs pull-based promotion',
            'Know GitHub Environments and required reviewers',
            'Mention change freeze periods and emergency process',
            'Talk about linking deployments to change tickets'
          ]
        },
        {
          id: 'cicd11',
          level: 'Senior',
          q: 'How do you implement testing strategies in CI/CD pipelines?',
          a: `**Test Pyramid in CI/CD:**

Unit tests (many, fast) → Integration tests (medium) → E2E tests (few, slow). Invest most in unit tests, least in E2E.

**Test Execution by Stage:**

**On Every PR:**
• Unit tests: must run in < 5 minutes, all must pass
• Lint: code style, type checking
• Security scan: quick secrets and SAST
• Build: compile and package
Cost: fast feedback loop is critical

**On Merge to Main:**
• Integration tests: database, API contracts, service interactions
• Contract tests: Pact or similar (service contract verification)
• Performance baseline: no regression vs last merge

**Nightly / Pre-Release:**
• E2E tests: full user journeys in staging environment
• Load tests: ensure no performance regression
• Chaos tests: verify resilience

**Test Parallelization:**

GitHub Actions matrix strategy:
Matrix of test suites running in parallel (unit-auth, unit-payment, unit-notifications, integration). All must pass. Total time: max(individual suite times).

**Flaky Test Management:**

Flaky tests destroy CI/CD trust. My approach:
• Track flaky tests in dedicated dashboard
• Quarantine: move flaky tests to non-blocking job (still visible)
• Fix or delete within 1 sprint of quarantine
• Zero tolerance for known flaky tests in blocking gates

**Contract Testing (API Between Services):**

Pact: consumer defines contract, provider verifies. Broken contract caught before deployment, not in production.

**Test Data Management:**
• Factories/fixtures for unit tests (no real databases)
• Separate test database per CI run (docker-compose or TestContainers)
• Data anonymization for staging integration tests
• Seed data scripts for E2E environments`,
          tips: [
            'Know test pyramid and where to invest',
            'Discuss flaky test impact and management',
            'Mention contract testing for microservices',
            'Talk about TestContainers for integration testing'
          ]
        },
        {
          id: 'cicd12',
          level: 'Senior',
          q: 'How do you implement artifact management in a CI/CD platform?',
          a: `**Artifact Types:**

• Docker images: application containers
• Helm charts: Kubernetes deployment packages
• NPM packages: JavaScript libraries
• Maven/Gradle JARs: Java libraries
• Python packages: wheels and eggs
• iOS IPAs, Android APKs/AABs: mobile artifacts

**Artifact Registry Strategy:**

**ECR (AWS Elastic Container Registry) — Docker Images:**
• Private registry, IAM-authenticated
• Image scanning integrated (ECR Inspector)
• Immutable tags (no overwriting production tags)
• Lifecycle policies: delete untagged after 7 days, keep last 30 tagged
• Cross-account access via resource policy

**JFrog Artifactory — Everything Else:**
• Helm chart repository
• NPM/Maven/PyPI proxy + private hosting
• Universal repository for binaries
• Migrated on-prem to cloud at Enterprise Pharma (zero downtime)

**Artifact Naming Convention:**

Docker image: {registry}/{service-name}:{git-sha}-{timestamp}
Helm chart: {repo}/{chart-name}:{semver}
Artifact immutability: production artifacts never overwritten (append-only)

**Artifact Promotion:**

Same artifact promoted through environments (not rebuilt per environment):
• Dev: build + push to ECR (tag: sha)
• Staging: promote same image (add tag: staging-{sha})
• Production: promote same image (add tag: prod-{sha}, latest)

**Ensures:** prod runs exactly what was tested in staging.

**Signing and Verification:**
• Docker images signed with Cosign after build
• Signature stored in ECR
• Admission controller verifies signature before EKS deploy
• Unsigned images rejected in production

**Retention and Cleanup:**
• Development images: 30-day retention
• Release images: 1-year minimum
• Audit trail: which image deployed where and when`,
          tips: [
            'Know ECR lifecycle policies',
            'Discuss artifact promotion vs rebuild per environment',
            'Mention image signing with Cosign',
            'Talk about your JFrog Artifactory migration experience'
          ]
        },
        {
          id: 'cicd13',
          level: 'Mid-Senior',
          q: 'How do you handle CI/CD for microservices — independent deployability?',
          a: `**Independent Deployability Principle:**

Each microservice should be deployable independently, without coordinating with other teams. This is the core value of microservices architecture.

**What Enables Independent Deployability:**

**1. Independent CI/CD Pipelines:**
Each service has its own pipeline. Deploying service A doesn't require service B to be deployed. No shared deployment lock.

**2. Backward-Compatible APIs:**
Services never break their clients. API versioning: add endpoints, never remove/modify existing ones without deprecation period.

**3. Consumer-Driven Contract Testing:**
Pact tests verify service API compatibility automatically. If service A changes in a breaking way, service B's contract test fails before deployment.

**4. Feature Flags for Coordinated Features:**
New cross-service features deployed behind flags. Both services deployed independently. Feature enabled after both are deployed.

**Pipeline Structure per Service:**

Each service repo has its own GitHub Actions workflow. Trigger: push to main in that service repo. No dependencies on other service pipelines.

**Shared Platform Libraries (Platform Team Responsibility):**

Services depend on shared platform libraries (logging, auth, tracing). Library updates via semantic versioning. Services opt in to updates via Dependabot PRs (not forced updates).

**Deployment Dependency Management:**

When services genuinely depend (new feature requires both service A and B):
• Deploy service B first (backward compatible)
• Deploy service A with feature flag off
• Enable feature flag after both deployed
• Never require synchronized deployment

**Monitoring Independent Deployments:**
• Grafana: deployment events overlaid on metrics
• If service A deployment causes downstream errors in service B → visible immediately
• Each service has independent health and error rate monitoring`,
          tips: [
            'Connect independent deployability to Conway\'s Law',
            'Discuss contract testing as key enabler',
            'Mention feature flags for cross-service coordination',
            'Talk about how platform supports this (templates, independent pipelines)'
          ]
        },
        {
          id: 'cicd14',
          level: 'Senior',
          q: 'How do you implement rollback strategies in CI/CD?',
          a: `**Rollback Philosophy:**

Rolling forward (fixing forward) is often better than rolling back. But rollback must always be possible and fast when needed.

**Rollback Strategies:**

**1. GitOps Rollback (My Primary Approach):**
Production image tag is in Git. Rollback = revert the image tag commit.
git revert HEAD~1 in gitops repo → ArgoCD detects change → deploys previous image within 2 minutes.
Benefits: simple, auditable, same process as forward deployment.

**2. Kubernetes Rolling Undo:**
kubectl rollout undo deployment/service-name
Kubernetes reverts to previous ReplicaSet.
Fast (seconds) but only goes back one revision.

**3. Harness Pipeline Rollback:**
Harness automatically rolls back on deployment failure (configurable).
Rollback triggers: deployment health check failure, error rate spike, manual trigger.
Rollback runs same pipeline in reverse — cleaner than kubectl undo.

**4. Blue-Green Switch:**
If blue-green strategy used: switch ALB weights back to blue instantly.
True instant rollback (< 1 minute).

**What Makes Rollback Safe:**

**Database migrations:** Must be backward compatible. New code deploys without breaking old schema. Old code can run against new schema.

**Immutable artifacts:** Rolled-back deployment runs exact same image that was tested before — not a rebuild.

**Feature flags:** For risky features, rollback = disable flag. No code change, instant, granular.

**Rollback Decision Tree:**
Incident detected → Is it deployment-related? Check deployment timeline in Grafana. → Yes → Assess: fix-forward or rollback? → Fix-forward if: bug is known and fix is simple. → Rollback if: root cause unknown, user impact severe.

**Rollback SLA:**
• Rollback triggered: within 5 minutes of decision
• Production restored: within 15 minutes
• Post-mortem: within 48 hours`,
          tips: [
            'Discuss GitOps rollback as simplest and safest approach',
            'Know kubectl rollout undo limitations (one revision)',
            'Mention database backward compatibility as rollback prerequisite',
            'Talk about rollback decision criteria (when to roll back vs fix forward)'
          ]
        },
        {
          id: 'cicd15',
          level: 'Mid-Senior',
          q: 'How do you handle CI/CD pipeline performance optimization?',
          a: `**Pipeline Speed Matters:**

Slow pipelines = slow developer feedback = slow delivery. Every minute saved × 50 developers × 10 runs/day = significant productivity gain.

**Optimization Techniques:**

**1. Caching:**

Dependency caching is highest ROI:
• Node modules: cache by yarn.lock/package-lock hash (saves 2-3 min)
• pip packages: cache by requirements hash (saves 1-2 min)
• Maven/Gradle: cache ~/.m2 or ~/.gradle (saves 3-5 min)
• Docker layers: layer caching via registry or GitHub Actions cache (saves 2-4 min)
• Go modules: cache GOPATH (saves 1-2 min)

**2. Parallelization:**

GitHub Actions matrix: run test suites in parallel.
Parallel jobs: lint, security scan, unit tests all run simultaneously.
Before: sequential 15 min. After: parallel 6 min.

**3. Conditional Execution:**

Skip unchanged service builds in monorepos:
paths filter in workflow trigger — only run iOS workflow if iOS/ files changed.

**4. Test Optimization:**

• Run slowest tests last (fail fast)
• Cache test results for unchanged code (Jest --cache, pytest-cache)
• Flaky test quarantine (don't wait for known-flaky tests)
• Shard test suite: split 1000 tests across 4 runners

**5. Runner Optimization:**

• Self-hosted runners near your AWS region (reduce data transfer)
• Larger runner size for compute-heavy jobs (build vs test different sizes)
• Pre-loaded dependencies on custom runner image

**6. Docker Build Optimization:**

• Multi-stage builds: only ship what's needed
• Layer order: dependencies before code (cache-friendly)
• BuildKit with cache-to/cache-from ECR
• .dockerignore: exclude tests, docs from build context

**My Results:**

Average pipeline time: 45 min → 15 min (67% reduction)
• Caching: -10 min
• Parallelization: -12 min
• Conditional builds: -5 min (monorepo)
• Docker optimization: -3 min`,
          tips: [
            'Have specific time numbers for each optimization',
            'Discuss caching as highest ROI optimization',
            'Mention test parallelization strategy',
            'Talk about measuring pipeline time as platform metric'
          ]
        },
        {
          id: 'cicd16',
          level: 'Senior',
          q: 'How do you implement continuous deployment vs continuous delivery?',
          a: `**Definitions:**

**Continuous Integration (CI):** Code integrated into shared repo frequently, with automated builds and tests.

**Continuous Delivery (CD):** Software always in a releasable state. Deployment to production is a business decision, not a technical one. Manual trigger for production.

**Continuous Deployment:** Every change that passes tests automatically deploys to production. No manual step.

**What I Implement and Why:**

**Dev environment:** Continuous Deployment — every merge to main deploys automatically. Fast feedback, low risk.

**Staging:** Continuous Deployment (with delay) — after dev soak period. Automated but slightly gated.

**Production:** Continuous Delivery (not Deployment) — releasable at any time, but human decision to release.

**Why Not Full Continuous Deployment to Production at Enterprise Pharma:**
• Pharmaceutical industry: change control requirements mandate human approval
• Business stakeholders need to control feature timing (marketing, training)
• Risk tolerance: some changes need stakeholder review before user exposure

**When Full Continuous Deployment Makes Sense:**
• High-trust teams with excellent monitoring
• Mature testing (high coverage, comprehensive E2E)
• Feature flags for all user-visible changes
• Excellent observability and fast rollback
• Organizational culture supports it

**Progressive Stages Toward CD:**

Stage 1 (Now): Manual deployment trigger, automated testing.
Stage 2: Auto-deploy to staging, manual production.
Stage 3: Auto-deploy everything with feature flags and strong monitoring.
Stage 4 (Full CD): Auto-deploy to production, rely on monitoring + auto-rollback.

**Key Enablers for Moving Toward CD:**
• Comprehensive test coverage
• Canary deployments with auto-rollback
• Feature flags decoupling deploy from release
• Excellent monitoring and MTTR < 5 min
• Blameless culture (safe to fail fast)`,
          tips: [
            'Distinguish CI/CD/Continuous Deployment clearly',
            'Discuss why not every organization should do full CD',
            'Mention regulated industries as legitimate reason for approval gates',
            'Talk about the enablers needed to safely do continuous deployment'
          ]
        },
        {
          id: 'cicd17',
          level: 'Senior',
          q: 'How do you handle Harness CD for enterprise deployments?',
          a: `**Harness at Enterprise Pharma:**

Used Harness as the CD layer on top of GitHub Actions CI. GitHub Actions: build, test, push image. Harness: deploy to EKS, manage environments, canary analysis.

**Why Harness vs GitHub Actions for CD:**

• Visual pipeline editor: non-engineers can understand deployment flow
• Advanced deployment strategies: canary with automated verification built-in
• Environment management: approvals, freeze windows, governance
• Deployment tracking: what version is where, who deployed, when
• CV (Continuous Verification): ML-based deployment verification against metrics

**Harness Pipeline Structure:**

Pipeline with stages:
1. Build (GitHub Actions trigger or artifact input)
2. Deploy Dev: rolling strategy, auto-approve
3. Deploy Staging: rolling strategy, manual approval, 1-hour verification
4. Deploy Production: canary strategy, change ticket validation, ML verification

**Harness Canary Workflow:**

Canary stage: deploy 10% of pods with new image. Continuous Verification: compare error rate and latency vs baseline for 15 minutes. If metrics stable: proceed to primary rollout. If metrics breach: automatic rollback to previous version.

**Secrets and Configuration in Harness:**

• Harness Secrets Manager integrated with HashiCorp Vault
• Connectors: GitHub, AWS, EKS configured once, reused across pipelines
• Service variables: environment-specific values managed in Harness

**Triggers:**

• Webhook: GitHub Actions on successful push triggers Harness pipeline
• Artifact: new image in ECR triggers deployment pipeline
• Scheduled: nightly deploy to staging from latest main

**Governance:**

• Deployment freeze windows configured for quarterly close
• Required approval from 2 reviewers for production
• Change ticket validation: ServiceNow ticket must be approved before deploy
• RBAC: developers can trigger dev/staging, not production`,
          tips: [
            'Connect Harness to your actual Enterprise Pharma experience',
            'Discuss Harness CV (Continuous Verification) as differentiator',
            'Know Harness vs Argo Rollouts comparison',
            'Mention change ticket integration for enterprise compliance'
          ]
        },
        {
          id: 'cicd18',
          level: 'Mid-Senior',
          q: 'How do you build and publish internal shared libraries through CI/CD?',
          a: `**Internal Library Use Cases:**

• Shared logging library (structured JSON, trace ID injection)
• Auth middleware (token validation, RBAC)
• Internal HTTP client (with retry, circuit breaker)
• React component library (design system)
• Terraform modules (infrastructure patterns)

**Package Registry Options:**

**GitHub Packages:** Native GitHub integration, simple setup, per-org packages.
**JFrog Artifactory:** More mature, proxies public registries, all package types.
**AWS CodeArtifact:** AWS-native, IAM-authenticated, good for AWS shops.

**My Setup (Artifactory at Enterprise Pharma):**

npm, PyPI, Maven repositories configured in Artifactory.
All developers configured to pull from Artifactory (which proxies NPM, PyPI, Maven Central).
Internal packages published to Artifactory under @pharma-internal scope.

**CI/CD Pipeline for Library:**

On PR: lint, test, build.
On merge to main: build, publish to Artifactory as SNAPSHOT/prerelease version.
On release tag (v1.2.3): build, publish as stable release, update changelog, create GitHub Release.

**Semantic Versioning Automation:**

Semantic-release or conventional commits determine next version automatically based on commit message types: feat → minor bump, fix → patch bump, BREAKING CHANGE → major bump.

**Consumer Update Process:**

Dependabot monitors internal packages in consuming repos.
PR opened automatically when new version released.
Consuming team reviews, runs tests, merges.

**Documentation:**

Every library has:
• README with quick start
• API reference (auto-generated from JSDoc/docstrings)
• Changelog (auto-generated from conventional commits)
• Migration guide for major versions

**Governance:**
• Breaking changes require RFC (request for comment) process
• Major versions: 3-month deprecation of old version
• Maintainers: platform team + designated contributors from consuming teams`,
          tips: [
            'Discuss semantic-release for automated versioning',
            'Know GitHub Packages vs Artifactory vs CodeArtifact',
            'Mention Dependabot for consuming library updates',
            'Talk about breaking change governance'
          ]
        },
        {
          id: 'cicd19',
          level: 'Senior',
          q: 'How do you implement pipeline-as-code best practices?',
          a: `**Pipeline-as-Code Principles:**

Pipelines are code. They should be versioned, reviewed, tested, and maintained with the same rigor as application code.

**Best Practices I Follow:**

**1. Pipelines in the Same Repo as Application:**
• Application team owns their pipeline
• Pipeline changes reviewed in same PR as code changes
• Visibility: every developer can see how CI works

**2. DRY (Don't Repeat Yourself):**
• Reusable workflows for common patterns (platform-owned)
• Composite actions for reusable steps
• Variables and inputs for parameterization
• No copy-paste pipelines across repos

**3. Readable and Maintainable:**
• Clear job names: build-and-test, security-scan, deploy-staging
• Comments explaining non-obvious steps
• Logical job organization with dependencies explicit
• Consistent naming conventions org-wide

**4. Tested Pipelines:**
• act: run GitHub Actions locally for development
• Test changes in branch before merging
• Platform team has test workflows for shared templates
• Staged rollout of pipeline template changes

**5. Secret Management:**
• No hardcoded secrets (ever)
• Vault OIDC for dynamic credentials
• Reference secrets via \${{ secrets.NAME }} or Vault paths
• Secret rotation doesn't require pipeline changes

**6. Idempotent:**
• Running pipeline twice produces same result
• No side effects that accumulate
• Safe to re-run failed pipelines

**7. Fail Fast:**
• Quick checks (lint, format) run first
• Expensive checks (E2E tests) run last
• Developer gets feedback within 2 minutes on common failures

**8. Observability:**
• Job names clearly indicate what failed
• Error messages actionable (not just "step failed")
• Pipeline duration tracked and alerted on regression

**Anti-Patterns I Eliminate:**
• Hardcoded branch names
• Direct shell scripts inline (use actions or scripts in repo)
• Ignoring exit codes (set -e equivalent)
• Non-reproducible builds (always pin versions)`,
          tips: [
            'Discuss DRY principle applied to pipelines',
            'Mention act for local pipeline testing',
            'Talk about idempotency as key property',
            'Show you treat pipelines as first-class code'
          ]
        },
        {
          id: 'cicd20',
          level: 'Senior',
          q: 'How do you handle CI/CD for a monorepo architecture?',
          a: `**Monorepo CI/CD Challenges:**

• Building everything on every commit is slow and wasteful
• Need to identify what changed and build only affected services
• Coordinated versioning and releases
• Shared code changes may affect many services

**Affected Service Detection:**

**GitHub Actions path filters:**

Each service workflow has path filters — only triggers when relevant files change. Service A only builds when packages/service-a or packages/shared-lib changes.

**NX / Turborepo for Smart Builds:**

NX affected command: only builds and tests packages affected by changes. Understands dependency graph — if shared-lib changes, all dependent services rebuild. Remote caching: cache build outputs, skip if input unchanged.

**Dependency Graph Example:**

shared-lib is dependency of service-a, service-b, service-c.
Change to shared-lib: NX runs builds and tests for all three.
Change to service-a only: NX runs only service-a pipeline.

**Independent Deployment from Monorepo:**

Each service still deploys independently despite living in same repo.
Deployment triggered by service-specific Docker image change (not code push).
ArgoCD watches image tags — service deploys when its image tag changes.

**Version Management:**

Independent versioning per package (not monorepo-wide version).
Changesets (by Atlassian): tracks which packages changed, manages changelog, bumps versions correctly.

**My Monorepo Structure:**

Root package.json with workspaces. apps/ for deployable services. packages/ for shared libraries. CI configured per app with path filters. Shared libraries published to internal registry on change.

**Trade-offs:**

Pro: code sharing, atomic cross-service changes, single CI configuration.
Con: slower CI if affected detection not implemented, complex tooling, repo size management.`,
          tips: [
            'Know NX and Turborepo as monorepo build tools',
            'Discuss affected detection as critical for monorepo CI performance',
            'Mention Changesets for version management',
            'Talk about maintaining independent deployability in monorepos'
          ]
        }
      ]
    },
    terraform: {
      title: 'Infrastructure as Code',
      icon: '📦',
      questions: [
        {
          id: 'tf1',
          level: 'Senior',
          q: 'How do you design Terraform modules for a platform?',
          a: `**Module Design Philosophy:**

• Opinionated defaults: Work out of the box
• Escape hatches: Allow customization when needed
• Composable: Modules work together
• Versioned: Semantic versioning for stability

**Module Structure:**

modules/ directory containing vpc/, eks/, rds/, and common/tags/ subdirectories. Each module has main.tf, variables.tf, outputs.tf, versions.tf, README.md, and examples/ folder.

**Module Design Pattern:**

**Tiered Complexity Variables:**

Basic variable like "name" is required. "size" variable has enum validation limiting to small/medium/large. Advanced "node_config" variable is optional and overrides size preset if provided.

**Implementation Logic:**

Local size_presets map defines instance types and scaling for small/medium/large. Config uses override if provided, otherwise uses preset.

**Module Registry:**
• Private registry (Terraform Cloud/Enterprise)
• Versioned releases
• Documentation auto-generated
• Usage examples required

**Consumption:**

Simple module call specifying source, version constraint, name, and size preset.

**Governance:**
• Mandatory tags via module
• Cost estimation before apply
• Security scanning (Checkov)
• Approval workflows for production`,
          tips: [
            'Discuss abstraction levels',
            'Mention testing strategies',
            'Talk about versioning policy',
            'Share real module examples'
          ]
        },
        {
          id: 'tf2',
          level: 'Senior',
          q: 'How do you implement self-service infrastructure with Terraform?',
          a: `**Self-Service Architecture:**

**Option 1: PR-based Workflow**

Developer creates PR, Terraform plan runs automatically, Platform reviews if required, Merge triggers Apply.

**Option 2: Atlantis/Terraform Cloud**

PR comment "atlantis plan" runs plan and posts to PR. Comment "atlantis apply" runs apply.

**Option 3: Self-Service Portal**

Developer fills form, Portal creates PR/workspace, Automated provisioning runs.

**Implementation Example (GitHub Actions):**

**Service Repository:**
Team maintains main.tf calling company/rds module with name, environment, and size parameters.

**Automated Pipeline:**
On pull_request to infrastructure paths, runs terraform plan. On push to main, runs terraform apply.

**Guardrails:**
• OPA/Sentinel policies
• Cost limits per team
• Approved resource types
• Mandatory tagging
• Compliance checks

**Platform Benefits:**
• No tickets for standard requests
• Minutes instead of days
• Consistent, compliant infrastructure
• Full audit trail
• Developer empowerment`,
          tips: [
            'Compare different approaches',
            'Discuss policy enforcement',
            'Mention approval workflows',
            'Talk about cost controls'
          ]
        },
        {
          id: 'tf3',
          level: 'Mid-Senior',
          q: 'How do you handle Terraform state management?',
          a: `**Remote Backend Setup:**

S3 backend configuration with bucket, key path including environment and component, region, DynamoDB table for locking, and encryption enabled.

**Best Practices:**

• S3 versioning for state history
• KMS encryption for sensitive data
• DynamoDB for state locking (prevents concurrent runs)
• Separate state per environment/component

**State Operations:**

• terraform state list: View resources
• terraform state mv: Refactor without destroy
• terraform import: Bring existing resources
• terraform state rm: Remove from state (careful!)

**Disaster Recovery:**

• S3 versioning allows rollback
• Regular state backups to separate bucket
• Document manual recovery procedures

**Common Issues & Solutions:**

• State lock stuck: Check DynamoDB, force-unlock if needed
• Resource drift: Regular plan to detect
• Large state files: Split into smaller components

**Security:**

• State contains sensitive data, treat as secret
• IAM policies restrict state access
• Never commit state to Git`,
          tips: [
            'Know state file structure',
            'Discuss sensitive data handling',
            'Mention state migration procedures',
            'Be ready for troubleshooting scenarios'
          ]
        },
        {
          id: 'tf4',
          level: 'Mid-Senior',
          q: 'How do you implement policy as code for infrastructure?',
          a: `**Policy as Code Tools:**

**1. Sentinel (HashiCorp):**
Policy rule checking that no resource changes create IAM users.

**2. OPA/Conftest (Open Source):**
Rego policy denying S3 buckets without versioning enabled, with helpful error messages.

**3. Checkov (Security Scanning):**
CLI scan against terraform directory with terraform framework.

**Policy Categories:**

**Security Policies:**
• No public S3 buckets
• Encryption required at rest
• No IAM users (use roles)
• Approved AMIs only
• Security groups restrict ingress

**Compliance Policies:**
• Mandatory tags (owner, cost-center, environment)
• Approved regions only
• Data classification labels
• Logging enabled

**Cost Policies:**
• Maximum instance size per environment
• Reserved instance requirements for prod
• Storage class restrictions
• Resource limits per team

**Implementation Pipeline:**

Jobs for validate (terraform validate, tflint), security (checkov), policy (conftest), and cost (infracost) running in sequence.

**Governance:**
• Policies in version control
• PR review for policy changes
• Exceptions documented
• Regular policy audits`,
          tips: [
            'Know OPA Rego syntax',
            'Discuss policy categories',
            'Mention exception handling',
            'Talk about policy testing'
          ]
        },
        {
          id: 'tf5',
          level: 'Senior',
          q: 'How do you test Terraform code?',
          a: `**Why Test Terraform:**

Infrastructure bugs are expensive. A wrong security group rule or misconfigured IAM policy can cause outages or security incidents. Testing catches issues before they reach production.

**Testing Levels:**

**1. Static Analysis (Fastest, No Cloud):**

terraform validate: checks syntax and configuration validity.
tflint: provider-specific linting (invalid instance types, deprecated arguments).
Checkov/tfsec: security and compliance scanning.
infracost: cost estimation before apply.

All run in CI on every PR — feedback in < 2 minutes.

**2. Unit Tests with Terratest (Go):**

Go test that creates Terraform resources in test AWS account, validates they were created correctly, destroys at end.
Tests: VPC CIDR correct, subnets in correct AZs, security groups have expected rules.
Runtime: 5-15 minutes (actual cloud resources provisioned).

**3. Integration Tests:**

Test module combinations: VPC + EKS cluster together.
Verify cross-module outputs/inputs work correctly.
Run in dedicated CI AWS account with budget alerts.

**4. Contract Tests (Module Interface):**

Test that module outputs conform to expected schema.
Consuming modules depend on outputs — changes validated automatically.

**Test Organization:**

tests/ directory with unit/ and integration/ subdirectories. Separate test for each module. Run unit tests on every PR, integration tests nightly.

**Terratest Best Practices:**

• Unique resource naming per test run (prevent conflicts)
• defer terraform.Destroy() at start (cleanup even on failure)
• Retry logic for eventual consistency
• Test in parallel across modules (faster CI)
• Use test-specific small instance sizes (cost control)

**Result:**
• Terraform bugs caught before staging: 80% of infrastructure issues
• Reduced production infrastructure incidents by 60%
• Confident module refactoring with test safety net`,
          tips: [
            'Know Terratest as the standard Go testing framework',
            'Discuss the different testing levels and when to use each',
            'Mention test AWS account management',
            'Talk about cost control in Terraform tests (destroy after test)'
          ]
        },
        {
          id: 'tf6',
          level: 'Senior',
          q: 'How do you manage Terraform workspaces and environments?',
          a: `**Workspace Strategies:**

**Option 1: Terraform Workspaces (Built-in):**

terraform workspace new staging creates isolated state per workspace. Same configuration, different workspace = different state.

Pros: simple, built-in. Cons: same configuration for all environments (can't have different module versions). Risk: easy to accidentally apply to wrong workspace.

**Option 2: Directory-per-Environment (My Preferred):**

environments/ directory with dev/, staging/, prod/ each having main.tf, variables.tf, terraform.tfvars, backend.tf. Each environment is completely independent configuration.

Pros: environments can diverge, explicit, no accidental cross-environment apply. Cons: more directory structure, DRY violations if not managed with modules.

**Option 3: Terragrunt:**

Terragrunt wraps Terraform with DRY configuration management.
Root terragrunt.hcl defines shared configuration. Environment-level terragrunt.hcl defines environment-specific values. Module version pinned per environment.

Benefits: DRY, dependency management between modules, remote state configured centrally.

**My Implementation (Directory-per-Environment):**

environments/prod/main.tf calls same modules as staging but with:
• Different instance sizes
• Different replica counts
• Different retention periods
• Different security group rules

**Environment Promotion:**

Terraform changes tested in dev first. Code reviewed and merged. Same module version promoted to staging via PR. After staging validation, same change promoted to prod.

Module versions pinned in consuming configuration — explicit control of what version runs where.

**Preventing Cross-Environment Accidents:**
• Backend configurations are environment-specific (separate S3 buckets and state keys)
• CI runs only plan for PRs (never apply without approval)
• Production workspace requires separate approval and explicit confirmation`,
          tips: [
            'Discuss directory-per-environment vs workspaces trade-offs',
            'Know Terragrunt as DRY solution for multi-environment',
            'Mention backend isolation between environments',
            'Talk about promotion strategy and version pinning'
          ]
        },
        {
          id: 'tf7',
          level: 'Senior',
          q: 'How do you handle Terraform drift detection and remediation?',
          a: `**What is Drift:**

Drift occurs when actual infrastructure differs from Terraform state. Causes: manual changes in console, external automation, resource replacement by cloud provider.

**Drift Detection:**

**Method 1: terraform plan (Manual):**
Running plan shows drift as changes to make. But only works if you remember to run it and review carefully.

**Method 2: Scheduled Plan in CI:**

GitHub Actions cron workflow runs terraform plan nightly for all environments. Outputs diff to GitHub job summary. Creates Jira ticket if non-empty plan. Alerts Slack channel.

**Method 3: Terraform Cloud / Enterprise Drift Detection:**
Built-in drift detection with notifications. More comprehensive — covers all managed resources.

**Drift Remediation Strategies:**

**Option 1: Import and reconcile:**
Someone manually created a security group → terraform import → add to Terraform config → future changes via code only.

**Option 2: Destroy and recreate:**
Drifted resource is diverged significantly → destroy manually → apply via Terraform. Only if safe to recreate (no data loss).

**Option 3: Accept drift:**
Rare. Some resources are deliberately managed outside Terraform (excluded from state via lifecycle ignore_changes). Document why.

**Preventing Drift:**

• AWS Config rule: alert on manual IAM changes
• CloudTrail alert: changes not tagged with terraform = drift
• SCP: deny console resource creation in prod (only Terraform allowed)
• Culture: educate teams "nothing in prod without PR"

**Lifecycle Ignore Changes:**

lifecycle block with ignore_changes on desired_count for ECS service (autoscaler manages this — don't want Terraform to reset it).`,
          tips: [
            'Discuss scheduled plan as automated drift detection',
            'Know lifecycle ignore_changes for legitimate drift cases',
            'Mention AWS Config for complementary drift detection',
            'Talk about organizational controls to prevent drift'
          ]
        },
        {
          id: 'tf8',
          level: 'Senior',
          q: 'How do you implement Terraform for EKS cluster management?',
          a: `**EKS Terraform Architecture:**

Managing EKS with Terraform requires coordination between multiple providers and careful dependency management.

**Module Structure:**

EKS configuration calling eks module with cluster name, version, VPC and subnet IDs. Managed node groups with instance types, scaling config. Addons with EBS CSI driver, CoreDNS, kube-proxy, VPC CNI. OIDC provider enabled for IRSA. Cluster security group rules.

**IRSA Setup in Terraform:**

OIDC provider created from cluster's OIDC issuer URL. IAM role with trust policy allowing specific service account to assume it. Permissions policy attached to role. Module outputs role ARN for use in Kubernetes service account annotation.

**AWS Auth ConfigMap Management:**

Map IAM roles to Kubernetes RBAC groups. Platform team role maps to system:masters. Developer role maps to developers group. Managed via aws_auth module in Terraform.

**Add-on Management:**

EKS addons (CoreDNS, VPC CNI, EBS CSI) managed as Terraform resources. Version pinned to tested version. Updated separately from cluster upgrade (careful sequencing).

**Challenges I've Solved:**

**Node Group Update:**
Node groups can't be updated in place. Strategy: create new node group, drain old, delete old. Terraform blue-green for node groups using lifecycle create_before_destroy.

**IRSA Chicken-and-Egg:**
OIDC provider needed before IRSA roles, which need before EKS add-ons needing service accounts. Terraform dependency graph handles this via depends_on.

**EKS Module Versions:**
Using community AWS EKS Terraform module. Pin module version to tested release. Upgrade module version separately, test in dev, promote.

**State Management:**
EKS cluster state separate from application state. Blast radius control: cluster change doesn't affect application deployments.`,
          tips: [
            'Know the terraform-aws-eks community module',
            'Discuss IRSA setup as Terraform-Kubernetes integration',
            'Mention aws_auth management in Terraform',
            'Talk about cluster vs workload state separation'
          ]
        },
        {
          id: 'tf9',
          level: 'Senior',
          q: 'How do you handle Terraform module versioning and updates?',
          a: `**Module Version Strategy:**

Modules without version constraints are a liability — a module update can break production unexpectedly. Always pin versions.

**Semantic Versioning for Modules:**

v1.0.0: Initial stable release
v1.1.0: New optional features (backward compatible)
v1.2.0: More optional features
v2.0.0: Breaking changes (required input renamed, output removed)

**Version Pinning in Consumers:**

Module source with exact version constraint (e.g., ~> 1.2 allows 1.2.x but not 2.0). This is the standard approach — allows patch updates, blocks breaking changes.

**Module Update Process:**

1. Module team makes change + increments version + documents in CHANGELOG
2. Tags release in Git (v1.3.0)
3. Module published to private registry
4. Dependabot or Renovate opens PRs in consuming repos with version update
5. Consuming team reviews, tests in dev, promotes

**Breaking Change Process (Major Version):**

1. Major version released alongside old version (maintained in parallel)
2. Migration guide published
3. 1-quarter migration window: old version gets security fixes only
4. Office hours offered for migration support
5. Announcement via platform newsletter and Slack

**Testing Before Releasing Module Update:**

Terratest for modules. Before releasing v1.3.0:
• Run module unit tests
• Deploy to test environment via CI
• Run integration tests
• If all pass: tag and release

**Renovate for Auto-Update PRs:**

Renovate configured for Terraform module updates. Opens PRs with version bumps. CI runs plan on PR to catch issues. Team reviews and merges.

**Module Registry:**

Private Terraform registry (Terraform Cloud or GitLab Packages).
Browse, search, and consume modules.
Each module page shows inputs, outputs, examples, and version history.`,
          tips: [
            'Discuss ~> constraint for flexible but safe pinning',
            'Know semantic versioning for modules',
            'Mention Renovate for automated version bump PRs',
            'Talk about parallel version maintenance during breaking changes'
          ]
        },
        {
          id: 'tf10',
          level: 'Senior',
          q: 'How do you implement Terraform for networking — VPCs, subnets, and routing?',
          a: `**VPC Architecture I Build:**

Well-architected VPC with public, private, and data subnets across 3 Availability Zones.

**CIDR Planning:**

VPC: 10.0.0.0/16 (65,536 IPs — plenty of room)
Public subnets: /24 each (250 IPs per AZ) — for NAT Gateways, NLBs
Private subnets: /20 each (4,094 IPs per AZ) — for EC2, EKS nodes
Data subnets: /24 each (250 IPs) — for RDS, ElastiCache

**Terraform VPC Module (AWS Community Module):**

VPC module with CIDR, AZs (3), private and public subnet CIDRs, NAT gateway enabled (single NAT for cost, one per AZ for HA prod), public subnet tags for ELB, private subnet tags for internal ELB. EKS-specific tags on subnets for cluster discovery.

**Secondary CIDR for EKS Pod IPs:**

EKS pods with VPC CNI consume a lot of IPs. Add secondary CIDR for pods. aws_vpc_ipv4_cidr_block_association adds 100.64.0.0/16 to VPC. Configure VPC CNI to use this range for pod IPs.

**Route Table Management:**

Private route tables: 0.0.0.0/0 → NAT Gateway (per AZ).
Public route tables: 0.0.0.0/0 → Internet Gateway.
Data subnet tables: no internet route (isolated).

**VPC Peering / Transit Gateway:**

For multi-account: aws_vpc_peering_connection or aws_ec2_transit_gateway.
Peering: simple, direct, good for 2-3 VPCs.
Transit Gateway: hub-and-spoke, better for many VPCs, supports route table policies.

**Flow Logs:**

VPC Flow Logs to S3 (with lifecycle to Glacier after 30 days). Enables security investigation and cost analysis.`,
          tips: [
            'Know the terraform-aws-vpc community module',
            'Discuss secondary CIDR for EKS pod IPs',
            'Mention Transit Gateway vs peering trade-offs',
            'Talk about subnet tagging for EKS cluster discovery'
          ]
        },
        {
          id: 'tf11',
          level: 'Senior',
          q: 'How do you manage sensitive data in Terraform — database passwords, keys?',
          a: `**The Challenge:**

Terraform creates resources that need credentials (RDS passwords, API keys). These can end up in: plan output, state file, CI logs. All are risks.

**Sensitive Variables:**

Mark variables as sensitive: true. Terraform redacts them from plan output and logs. Still stored in state — need state encryption.

**State Encryption:**

S3 backend with KMS encryption: encrypt = true, kms_key_id = aws_kms_key.terraform.arn. State file encrypted at rest. Access requires both S3 permission and KMS decrypt permission.

**Random Password Generation:**

Use random_password resource — Terraform generates a random 16-char password. Never appears in code. Stored in state (encrypted). Output is also marked sensitive.

Store in Vault via vault_kv_secret_v2 resource — Terraform creates the secret, Vault stores it, applications use Vault to retrieve it.

**Avoiding State Storage of Secrets:**

For database passwords: generate with random_password, store in Vault or Secrets Manager, inject into RDS as parameter. Application uses Vault, never reads from Terraform state.

**CI/CD Secret Handling:**

AWS credentials for Terraform: via OIDC (no static keys in CI).
Vault token for Terraform: via OIDC Vault auth method.
Never log plan output that contains sensitive variables.

**AWS Secrets Manager Integration:**

aws_secretsmanager_secret and aws_secretsmanager_secret_version resources create secret. ECS/Lambda reads from Secrets Manager at runtime. No password in Terraform state — reference passes ARN, not value.

**Audit:**

terraform state pull | jq '.resources[].instances[].attributes | select(.password?)' — check for sensitive values in state. Remediate by moving to external secret store.`,
          tips: [
            'Mark sensitive variables with sensitive = true',
            'Discuss state encryption as mandatory for sensitive configs',
            'Know random_password and Vault integration pattern',
            'Mention audit process for identifying sensitive state data'
          ]
        },
        {
          id: 'tf12',
          level: 'Mid-Senior',
          q: 'How do you use Terraform data sources and locals effectively?',
          a: `**Data Sources — Reading Existing Infrastructure:**

Data sources read existing resources without managing them. Essential for referencing resources created outside Terraform or in other state files.

**Common Data Sources I Use:**

aws_caller_identity: get current AWS account ID (for ARN construction).
aws_region: current region (avoids hardcoding).
aws_vpc: look up existing VPC by tag.
aws_subnets: look up subnets by VPC and tags.
aws_ssm_parameter: read configuration from Parameter Store.
aws_secretsmanager_secret_version: read secret value.
terraform_remote_state: read outputs from another Terraform state.

**Remote State as Data Source:**

Network state outputs (VPC ID, subnet IDs) referenced in EKS state via terraform_remote_state. EKS state outputs (cluster endpoint, OIDC URL) referenced in app state. Clean separation without tight coupling.

**Locals — Computed Values and DRY:**

locals block computes common_tags (merging module tags with environment-specific tags), constructs bucket name from inputs, and computes environment-specific parameters.

**Locals for Environment-Specific Config:**

Local map keyed by environment with different instance types and replication counts per environment. Access via local.env_config[var.environment].instance_class.

**Computed ARNs:**

Local constructs ARN from data source account ID, region, and variables — avoids hardcoding and works across accounts/regions.

**Dynamic Blocks with Locals:**

Local list of security group rules → dynamic ingress block creates rules from the list. Much cleaner than repeating ingress blocks.`,
          tips: [
            'Know terraform_remote_state as dependency pattern',
            'Discuss locals for DRY configuration (common tags pattern)',
            'Mention dynamic blocks with locals for lists of rules',
            'Talk about data sources for reading non-Terraform resources'
          ]
        },
        {
          id: 'tf13',
          level: 'Senior',
          q: 'How do you implement Terraform for RDS and database infrastructure?',
          a: `**RDS Terraform Architecture:**

Production RDS requires: Multi-AZ, encryption, automated backups, enhanced monitoring, parameter groups, option groups.

**RDS Module Parameters:**

RDS module inputs: identifier, engine (postgres), engine version, instance class, storage, multi-AZ, encrypted, KMS key, DB name, username, password from Vault, backup retention, maintenance window, deletion protection, enhanced monitoring IAM role, enabled CloudWatch logs, parameter group, subnet group, VPC security group.

**Subnet Group:**

DB subnet group with data-tier subnets (no internet route). RDS placed only in data subnets.

**Parameter Group:**

Custom parameter group for PostgreSQL with: log_min_duration_statement (500ms), shared_preload_libraries (pg_stat_statements), auto_vacuum and checkpoint tuning.

**Security Group:**

RDS security group allows port 5432 only from EKS node security group. No direct internet access ever. Ingress from application SG only.

**Read Replica:**

Separate aws_db_instance with replicate_source_db pointing to primary identifier. In different AZ from primary. Used for read-heavy workloads and as failover candidate.

**Snapshot Before Destroy:**

final_snapshot_identifier set to prevent accidental data loss on destroy. lifecycle prevent_destroy = true for production. Must explicitly remove lifecycle rule to destroy.

**Secrets:**

Password from random_password, stored in Vault via Terraform. Application reads from Vault. Terraform state has encrypted password (sensitive = true).`,
          tips: [
            'Discuss multi-AZ vs read replica difference',
            'Know prevent_destroy lifecycle for production databases',
            'Mention parameter group as key for performance tuning',
            'Talk about subnet group placement in data-only subnets'
          ]
        },
        {
          id: 'tf14',
          level: 'Mid-Senior',
          q: 'How do you implement Terraform outputs and share state between configurations?',
          a: `**Outputs — Exporting Values:**

Outputs make Terraform-created values available to other configurations or users.

**Output Best Practices:**

Mark sensitive outputs (like passwords) with sensitive = true. Include description for every output. Group related outputs in consistent naming.

Outputs: cluster_endpoint (cluster URL), cluster_name, node_group_role_arn, oidc_provider_arn (for IRSA), cluster_security_group_id.

**State Sharing Patterns:**

**Pattern 1: terraform_remote_state (Direct):**

Remote state data source reads outputs from another state. Network config (VPC IDs, subnet IDs) consumed by EKS config. EKS config consumed by app config. Clean hierarchy but tight coupling (output names are interface contract).

**Pattern 2: SSM Parameter Store (Loose Coupling):**

Network state writes VPC ID to SSM. EKS state reads VPC ID from SSM. No direct Terraform dependency. Can change underlying implementation without breaking consumers.

**Pattern 3: Tags + Data Sources:**

VPC tagged with Name = "prod-vpc". EKS looks up VPC by tag. No state dependency at all. Most flexible but relies on consistent tagging.

**Output Versioning:**

Outputs are an API. Changing output names breaks consumers. If must rename: add new output with new name first, update consumers, then remove old. Same as API backward compatibility.

**Documenting Outputs:**

Every output must have description. Module README includes all outputs with types and examples. Generated by terraform-docs automatically.

**Output Aggregation Module:**

"Glue" module that reads from multiple remote states and outputs combined values. Single source of truth for cross-cutting values (account ID, VPC ID, cluster name).`,
          tips: [
            'Discuss remote_state vs SSM vs tags for sharing values',
            'Know that outputs are an API contract — treat them carefully',
            'Mention terraform-docs for output documentation generation',
            'Talk about aggregation patterns for complex multi-state setups'
          ]
        },
        {
          id: 'tf15',
          level: 'Senior',
          q: 'How do you implement Terraform at scale with a large team?',
          a: `**Scaling Challenges:**

As team grows: state conflicts, slow plan/apply times, inconsistent module usage, unclear ownership.

**Organizational Structure:**

**Module Repository:** platform-team/terraform-modules — versioned, tested, documented modules.
**Infrastructure Repository:** Per-team or per-domain — consumes modules.
**CODEOWNERS:** Platform team owns module repo. Teams own their infrastructure repo.

**State Management at Scale:**

One state file per logical unit:
• network/ — VPC, subnets, Transit Gateway
• security/ — KMS keys, IAM roles (shared)
• eks/ — Kubernetes cluster
• rds/ — databases
• apps/service-a/ — application-specific resources

Never one state for everything — slow plans, high blast radius, contention.

**Terraform Cloud / Enterprise:**

• Remote execution: plans/applies run in Terraform Cloud (no local AWS credentials needed)
• Remote state: managed, secure, versioned
• Policy enforcement: Sentinel policies
• Team access control: workspace-level RBAC
• Run triggers: apply in network triggers plan in eks automatically
• Audit log: who ran what and when

**Self-Service Process:**

Teams create new directory in infrastructure repo following conventions.
PR opens → platform team reviews for module usage and compliance.
After merge: Terraform Cloud runs plan automatically.
Manual apply: team lead approves in Terraform Cloud UI.

**Concurrency Controls:**

Only one apply per workspace at a time (Terraform Cloud enforces).
Queue: subsequent runs wait for current to complete.
No manual coordination needed.

**Cost Governance:**

infracost comment on every PR: estimated cost change.
Policy: if monthly cost increase > $500, requires platform approval.
Dashboard: per-team monthly cloud spend from Terraform tags.

**Training Program:**
• Terraform 101: internal workshop for all engineers
• Module documentation: self-service consumption
• Office hours: platform team available for IaC questions`,
          tips: [
            'Discuss state decomposition strategy for scale',
            'Know Terraform Cloud features for enterprise',
            'Mention infracost for cost visibility in PRs',
            'Talk about onboarding new engineers to Terraform'
          ]
        },
        {
          id: 'tf16',
          level: 'Senior',
          q: 'How do you handle Terraform provider management and upgrades?',
          a: `**Provider Version Management:**

Providers are the interface between Terraform and cloud APIs. Outdated providers miss new features and have bugs. Uncontrolled updates cause surprises.

**Provider Version Constraints:**

required_providers block with AWS provider source and version ~> 5.0 (allows 5.x, blocks 6.0). Kubernetes and Helm providers similarly constrained. required_version for Terraform itself.

**Lock File:**

terraform.lock.hcl records exact provider version hashes. Committed to Git — ensures reproducible plans across team. Never edit manually.

**Upgrade Process:**

1. Consult provider changelog: what changed in new version?
2. Update version constraint in required_providers
3. terraform providers lock -platform=linux_amd64 -platform=darwin_arm64 (update lock file)
4. terraform init -upgrade
5. Run full test suite in dev
6. Review any plan differences after upgrade
7. Promote through environments

**Multi-Platform Lock File:**

If team uses Mac (arm64) and CI uses Linux (amd64), must lock both platforms. Lock file includes hashes for multiple platforms.

**Provider Aliases (Multiple Configurations):**

Multiple AWS provider configurations with alias for deploying to multiple regions or accounts in same Terraform config. Resources reference provider = aws.us_west via provider argument.

**Custom Provider Development:**

For internal APIs (ServiceNow, internal tools): can build custom provider.
Terraform Plugin Framework (Go) for modern providers.
Published to private registry.

**Deprecation Handling:**

Provider deprecations announced in changelogs. Plan output shows deprecated resource warnings. Fix before deprecated resources are removed (check provider upgrade guide).`,
          tips: [
            'Know terraform.lock.hcl purpose and multi-platform locking',
            'Discuss provider alias for multi-region/multi-account configs',
            'Mention changelogs as essential reading before upgrades',
            'Talk about provider upgrade process step by step'
          ]
        },
        {
          id: 'tf17',
          level: 'Mid-Senior',
          q: 'How do you implement Terraform for IAM and security configurations?',
          a: `**IAM in Terraform — Core Resources:**

**IAM Roles (Primary Pattern):**

IAM role for ECS task execution with trust policy allowing ecs-tasks to assume it. Separate policy document grants ECR pull and CloudWatch logging. Additional data-access policy attached for S3 read on specific prefix only.

**Instance Profiles:**

Instance profile wrapping IAM role for EC2. EC2 instance references instance profile name.

**OIDC Trust for GitHub Actions:**

OIDC provider for GitHub token.actions.githubusercontent.com. Role trust policy conditions: token must match specific repo and branch (not any repo in org). Role has ECR push and EKS deploy permissions only.

**Least Privilege Automation:**

Use aws_iam_policy_document data source (not inline JSON) for all policies — validates syntax, readable, version-controlled.

Policy analysis: aws_iam_access_analyzer_analyzer resource creates analyzer. Findings from analyzer: external access, unused permissions.

**Service Control Policies (via AWS Organizations):**

SCP preventing leaving AWS Organizations, disabling CloudTrail, creating IAM users in production accounts. Applied to prod OU in Organizations. Terraform manages the SCP and attachment.

**Permission Boundaries:**

Boundary policy allowing core services (EC2, ECS, EKS, S3) but denying IAM wildcard and Organizations actions. Attached to all developer-created roles via permissions_boundary attribute. Prevents privilege escalation even if developer has iam:PassRole.

**Audit:**

Run aws iam get-account-authorization-details → analyze for overly permissive policies. Terraform tracks all IAM resources — drift alerts if manual changes detected.`,
          tips: [
            'Know aws_iam_policy_document vs inline policy',
            'Discuss permission boundaries as defense against privilege escalation',
            'Mention OIDC trust for CI/CD (no static keys)',
            'Talk about SCP management via Terraform'
          ]
        },
        {
          id: 'tf18',
          level: 'Mid-Senior',
          q: 'How do you approach Terraform refactoring and state manipulation?',
          a: `**Why Refactoring is Risky:**

Moving resources in Terraform code without proper state migration = Terraform thinks the old resource was deleted and a new one needs to be created. For databases or production resources, this causes downtime or data loss.

**Safe Refactoring Techniques:**

**1. terraform state mv (Rename in State):**

Moving resource to new name or module path.
terraform state mv aws_instance.web_server aws_instance.api_server — renames in state, code update must match.
For modules: terraform state mv aws_instance.server module.compute.aws_instance.server.

**2. moved Block (Declarative, Terraform 1.1+):**

Add moved block to configuration:
moved { from = aws_instance.old_name to = aws_instance.new_name }
terraform plan shows "resource moved" not destroy+create.
Remove moved block after apply (or keep for documentation).

**3. terraform import (Adopt Existing Resources):**

Resource exists but not in Terraform state.
terraform import aws_s3_bucket.artifacts my-bucket-name — adds to state.
Then write matching Terraform config.
Useful for: manually created resources, migrations from other IaC tools.

**4. Refactoring Module Hierarchy:**

Moving resource from root to module:
terraform state mv aws_vpc.main module.network.aws_vpc.main
Then update code to use module.
Plan should show no changes if state and code align.

**Dangerous Operations — Always Test First:**

terraform state rm — removes resource from state without destroying it. Use for: excluding resources from management, before importing to different state.

Scenario: remove old load balancer from state (it will be managed elsewhere).
Always verify with terraform plan after state operations.

**Process:**

1. Backup state: terraform state pull > backup.tfstate
2. Make state change
3. terraform plan: verify no unexpected changes
4. If plan is clean: commit code changes
5. Apply`,
          tips: [
            'Know moved block as the modern preferred approach',
            'Discuss when to use terraform state mv vs moved block',
            'Mention state backup before any manipulation',
            'Talk about verification with plan after state changes'
          ]
        },
        {
          id: 'tf19',
          level: 'Senior',
          q: 'How do you implement Terraform with Atlantis for team collaboration?',
          a: `**Atlantis Overview:**

Atlantis is a self-hosted pull request automation for Terraform. Runs plan on PR open, apply on approval and comment. Brings Terraform workflow into GitHub PRs.

**Why Atlantis:**

• All Terraform activity visible in PR comments
• Plan output reviewable before apply
• No local Terraform needed by developers (server-side execution)
• Apply locks prevent concurrent modifications
• Audit trail in GitHub PR comments

**Atlantis Setup:**

Deployed as EKS deployment with GitHub webhook. Webhook secret for security. GitHub App for PR integration. AWS credentials via IRSA (no static keys).

**atlantis.yaml Configuration:**

Project-level configuration in repo root defining workflow per directory. Custom workflow: init, plan, policy check steps defined. Automerge: merge PR when all checks pass (optional).

**Developer Workflow:**

1. Developer opens PR with Terraform changes
2. Atlantis runs plan automatically, comments result
3. Team reviews plan in PR
4. Reviewer comments: atlantis apply
5. Atlantis applies, comments result
6. If success: PR merged (or auto-merged)

**Locking:**

Atlantis locks the workspace during apply. Other PRs can plan but not apply until current apply completes. Prevents state conflicts.

**Plan Storage:**

Plans stored on Atlantis server until applied. Apply uses stored plan (not re-planned). Ensures what was reviewed is what runs.

**Atlantis vs Terraform Cloud:**

Atlantis: self-hosted, GitHub-native, no cost per run.
Terraform Cloud: fully managed, policy enforcement (Sentinel), better for enterprise governance.
My choice: Atlantis for cost-conscious setups, Terraform Cloud for enterprise needs.`,
          tips: [
            'Know Atlantis as GitHub-native alternative to Terraform Cloud',
            'Discuss plan locking mechanism',
            'Mention atlantis.yaml project configuration',
            'Compare Atlantis vs Terraform Cloud trade-offs'
          ]
        },
        {
          id: 'tf20',
          level: 'Senior',
          q: 'How do you implement Terraform for multi-region deployments?',
          a: `**Multi-Region Use Cases:**

• Disaster recovery: failover region
• Data residency: keep EU data in EU
• Latency: serve users from nearest region
• Compliance: some regulations require data in-country

**Provider Aliasing for Multi-Region:**

Multiple AWS provider blocks with different regions. Resources reference provider = aws.eu_west_1 explicitly. Shared resources (IAM, Route53) use default provider (us-east-1).

**Multi-Region Module Pattern:**

Module accepts region as variable and uses configured provider. Caller creates providers for each region and passes them to module. Same module code, different region providers.

**State Strategy:**

Separate state per region:
backend S3 with key including region in path (terraform/us-east-1/eks.tfstate and terraform/eu-west-1/eks.tfstate). Different state files prevent cross-region conflicts.

**Route 53 Global DNS:**

Route 53 is global but managed in one region. Latency-based routing: alias records pointing to ELB in each region. Health checks: Route 53 fails over automatically if region ELB unhealthy.

**Data Replication:**

S3 Cross-Region Replication: aws_s3_bucket_replication_configuration with destination bucket in second region. RDS: cross-region read replica for read workloads and DR.

**DR Automation:**

Terraform workspace or variable: primary vs dr mode.
In DR mode: promote read replica to standalone, update Route 53 weights, scale up DR region resources.
Tested annually via DR drill.

**Cost Consideration:**

Multi-region doubles infrastructure cost. Active-passive DR: most resources scaled to minimum in passive region. Scale up only during failover. Significant cost saving vs active-active.`,
          tips: [
            'Know provider aliasing for multi-region',
            'Discuss state file separation per region',
            'Mention Route 53 health-check-based failover',
            'Talk about active-passive vs active-active DR cost trade-off'
          ]
        }
      ]
    },
    behavioral: {
      title: 'Behavioral & Leadership',
      icon: '👥',
      questions: [
        {
          id: 'beh1',
          level: 'All',
          q: 'Tell me about a time you built a platform capability from scratch.',
          a: `**Situation:**

Developers were spending days getting CI/CD pipelines set up for new services. Each team had their own approach, leading to inconsistency, security gaps, and maintenance burden. Mobile teams especially struggled with iOS code signing complexity.

**Task:**

Design and implement a self-service CI/CD platform that would reduce onboarding time while ensuring security and consistency across 60+ services, including mobile applications.

**Action:**

**1. Discovery Phase:**
• Interviewed 10+ development teams
• Mapped existing pipeline patterns
• Identified pain points (secrets, caching, mobile signing)
• Defined success metrics

**2. Design Phase:**
• Created reusable GitHub Actions workflows
• Designed Vault OIDC integration for secrets
• Built golden path templates
• Established mobile build infrastructure with Mac runners

**3. Implementation:**
• Piloted with 3 willing teams
• Iterated based on feedback
• Created comprehensive documentation
• Conducted training sessions

**4. Rollout:**
• Gradual migration from Jenkins
• Office hours for support
• Metrics dashboard for adoption tracking

**Result:**

• Onboarding time: 2 weeks to 2 hours
• 60+ pipelines migrated
• 30% faster build times
• 99.5% pipeline reliability
• Zero secrets exposed in logs
• Mobile build time: 45 min to 15 min
• Developers became advocates

**Key Learning:**

Building the platform is 30% of the work. Developer experience, documentation, and adoption strategy are 70%.`,
          tips: [
            'Use STAR format consistently',
            'Emphasize user research',
            'Quantify results',
            'Show iterative approach'
          ]
        },
        {
          id: 'beh2',
          level: 'All',
          q: 'How do you handle resistance from developers when introducing new platform tools?',
          a: `**Situation:**

During the Jenkins to GitHub Actions migration, several senior developers were resistant. They had invested years in Jenkins expertise and were skeptical about the change.

**Task:**

Win over skeptical developers while maintaining migration momentum.

**Action:**

**1. Empathy First:**
• Acknowledged their expertise and concerns
• Understood the real worries (learning curve, job security)
• Respected their time investment in Jenkins

**2. Demonstrated Value:**
• Built pipeline for their project showing improvements
• Showed 30% faster builds with concrete data
• Highlighted features Jenkins couldn't match

**3. Involved Them:**
• Asked for input on workflow design
• Made them reviewers of platform templates
• Incorporated their feedback visibly

**4. Made Migration Easy:**
• Created migration guides with their use cases
• Offered pair programming sessions
• Maintained Jenkins access during transition

**5. Celebrated Successes:**
• Highlighted their team's successful migration
• Asked them to share learnings with others
• Recognized their expertise publicly

**Result:**

• Skeptics became champions
• One resistant developer now maintains our reusable workflows
• Zero forced migrations
• Organic adoption reached 100%

**Key Learning:**

Resistance often comes from fear of irrelevance. Make experts part of the solution, and their influence becomes your adoption accelerator.`,
          tips: [
            'Show empathy for resistance',
            'Demonstrate concrete value',
            'Discuss co-creation strategies',
            'Mention turning skeptics into advocates'
          ]
        },
        {
          id: 'beh3',
          level: 'All',
          q: 'Tell me about your experience mentoring team members.',
          a: `**Situation:**

At Societe Generale, as Dev Chapter Lead, I managed a team of 6+ developers with varying experience levels, including 2 junior developers new to Angular and Node.js.

**Task:**

Improve team capabilities while maintaining delivery commitments.

**Action:**

**1. Structured Learning:**
• Weekly knowledge sharing sessions
• Pair programming on complex features
• Code review focused on learning, not criticism

**2. Individual Development:**
• Regular 1:1s for career discussions
• Identified strengths and growth areas
• Created personalized learning paths

**3. Gradual Responsibility:**
• Started with small features
• Increased complexity over time
• Celebrated wins and learned from failures

**4. Technical Excellence:**
• Established coding standards
• Introduced testing practices
• Encouraged documentation

**Result:**

• 2 junior developers promoted within 18 months
• Team velocity increased 40%
• Reduced defect rate by 35%
• Knowledge retention improved (team stayed together)

**Key Learning:**

Investing in people pays dividends. Creating a psychologically safe environment where people can ask questions and make mistakes is crucial for growth.`,
          tips: [
            'Share specific examples',
            'Show genuine care for team development',
            'Discuss measurement of success',
            'Mention long-term relationships'
          ]
        },
        {
          id: 'beh4',
          level: 'All',
          q: 'Describe how you measure and improve developer experience.',
          a: `**Situation:**

We had built platform capabilities but lacked systematic understanding of developer satisfaction and friction points.

**Task:**

Establish developer experience measurement program and use insights to drive improvements.

**Action:**

**1. Established Metrics:**

Quantitative: Time to first deployment, Build/deploy success rates, Mean time to resolve platform issues, Self-service adoption percentage, Support ticket volume.

Qualitative: Quarterly developer surveys (NPS), User interviews (monthly), Feedback channel monitoring (Slack), Platform office hours attendance.

**2. Built Measurement Infrastructure:**
• Grafana dashboards for DORA metrics
• Automated satisfaction surveys
• Feedback collection in portal
• Analytics on documentation usage

**3. Acted on Insights:**

Survey Finding: "Database provisioning is too slow"
Action: Built self-service RDS module
Result: 3 days to 15 minutes

Interview Finding: "Mobile releases are painful"
Action: Automated Fastlane pipelines with signing
Result: 2 days to 15 minutes

Ticket Analysis: High volume for secrets issues
Action: Improved Vault documentation + examples
Result: 40% reduction in secrets tickets

**4. Closed Feedback Loop:**
• Published quarterly "Platform Health" report
• Showed impact of developer feedback
• Roadmap influenced by NPS comments

**Result:**
• Developer NPS: +15 to +45
• Support tickets reduced 60%
• Platform adoption: 65% to 95%
• "You actually listened" became common feedback`,
          tips: [
            'Discuss specific metrics tracked',
            'Show qualitative + quantitative',
            'Give examples of acting on feedback',
            'Mention feedback loops'
          ]
        },
        {
          id: 'beh5',
          level: 'All',
          q: 'How do you prioritize platform work?',
          a: `**Framework I Use:**

**1. Categorize Work:**

Keep the Lights On (KTLO): Security patches, Bug fixes, On-call toil reduction, Infrastructure maintenance.

Developer Requests: Feature requests from teams, Pain point resolutions, Integration requests.

Platform Improvements: Performance optimization, New capabilities, Technical debt reduction.

**2. Prioritization Matrix:**

High Impact + Low Effort: Do First
Low Impact + Low Effort: Quick Wins
High Impact + High Effort: Plan Carefully
Low Impact + High Effort: Reconsider

**3. Input Gathering:**
• Developer surveys (quarterly)
• Support ticket analysis (monthly)
• Stakeholder input (quarterly roadmap reviews)
• Strategic alignment with engineering leadership

**4. My Process:**

Monthly Planning: Review developer feedback and tickets, Assess KTLO burden, Identify high-impact opportunities, Balance quick wins with strategic work.

Quarterly Roadmap: 50% Developer-requested features, 30% Platform improvements, 20% KTLO/tech debt.

**5. Example Decisions:**

Request: Add support for Scala builds
Analysis: Impact 1 team (low), Effort medium
Decision: Provide guidance instead of platform support

Request: Self-service database provisioning
Analysis: Impact 20+ teams (high), Effort high, ROI saves 3 days per request times 50 requests/year
Decision: Prioritize for next quarter`,
          tips: [
            'Share your framework',
            'Discuss stakeholder balance',
            'Give specific examples',
            'Mention communication practices'
          ]
        },
        {
          id: 'beh6',
          level: 'All',
          q: 'How do you stay current with Platform Engineering trends?',
          a: `**Information Sources:**

**Industry Resources:**
• CNCF Platform Engineering materials
• Platform Engineering community (platformengineering.org)
• Team Topologies materials
• ThoughtWorks Tech Radar

**Technical Content:**
• KubeCon/CloudNativeCon talks
• HashiConf sessions
• Backstage community calls
• DevOps/Platform Engineering podcasts

**Community:**
• Platform Engineering Slack workspace
• Local meetups (DevOps Days, KUGs)
• LinkedIn thought leaders

**Hands-On Learning:**
• Personal AWS account experiments
• Side projects with new tools
• Certification preparation
• Contributing to open source

**Recent Learnings Applied:**

1. Backstage: Learned developer portal patterns, Evaluated for our platform, Influenced roadmap discussions.

2. Crossplane: Learned Kubernetes-native IaC, Prototype for self-service, Alternative to Terraform considered.

3. GitHub Actions OIDC: Learned when feature launched, Applied to Vault integration, Eliminated static credentials.

**Time Management:**
• 3-4 hours/week dedicated to learning
• Follow key newsletters (CNCF, DevOps Weekly)
• Attend 2-3 conferences/year
• Monthly team learning sessions`,
          tips: [
            'Show genuine curiosity',
            'Mention specific resources',
            'Discuss recent learnings',
            'Talk about sharing knowledge'
          ]
        },
        {
          id: 'beh7',
          level: 'All',
          q: 'Tell me about a time you had to make a difficult trade-off between speed and quality.',
          a: `**Situation:**

During a critical pharma product launch at Enterprise Pharma, business stakeholders requested a mobile app release be expedited by 2 weeks. The release had passed QA but our standard security scanning revealed 3 HIGH severity vulnerabilities in a third-party library.

**The Trade-off:**

Option A: Delay release 2 weeks (fix vulnerabilities properly). Risk: miss product launch window, significant business and revenue impact.
Option B: Release now, remediate post-launch. Risk: potential security exposure in a healthcare-adjacent application.

**My Approach:**

**1. Understand the actual risk:**
Investigated the vulnerabilities: all 3 were in a feature we didn't expose in our app (file upload functionality). Runtime exploitation in our context: extremely low probability. Not a zero risk, but an informed risk.

**2. Involve the right people:**
Looped in CISO and security team. Presented technical analysis. Didn't make the call unilaterally — this was a business and risk decision.

**3. Propose a structured path:**
• Release with a documented exception (time-bounded, 2 weeks to fix)
• Enhanced monitoring for the affected library
• Jira ticket with P2 priority for remediation
• CISO sign-off documented

**4. Execute the remediation:**
Library updated within 10 days of release. Vulnerability closed before exception window.

**Result:**
• Product launched on time (significant business value)
• No security incidents
• Exception documented properly for audit
• Process improved: vulnerability triage now faster (risk-based, not binary block)

**Key Learning:**
Security is risk management, not risk elimination. The right answer isn't always "block the release" — it's informed decision-making with the right stakeholders.`,
          tips: [
            'Show you escalated appropriately (CISO involved)',
            'Demonstrate risk analysis, not gut feeling',
            'Discuss that you followed through on remediation',
            'Acknowledge the genuine tension (no perfect answer)'
          ]
        },
        {
          id: 'beh8',
          level: 'All',
          q: 'Describe a time you had to deliver bad news to a stakeholder or leadership.',
          a: `**Situation:**

A critical ECS Fargate migration I was leading was 3 weeks behind schedule. The stakeholder — a VP who had committed to a board-level timeline — expected a status update. I knew this would cause a significant schedule change.

**Why it was hard:**
The VP had already communicated the timeline upward. A 3-week slip meant renegotiating commitments at the board level.

**My Approach:**

**1. Don't delay the conversation:**
As soon as I confirmed the slip, I requested an urgent 30-minute call — not email, not Slack. Bad news delivered promptly allows more options for recovery.

**2. Came with data, not just problems:**

Prepared in advance:
• Root cause: discovered undocumented cross-account dependencies requiring additional IAM work
• How much: 3 weeks (not "I'm not sure")
• What I've tried: accelerated dependency mapping, brought in additional engineer
• Options: (a) 3-week slip with full quality, (b) 1-week slip with reduced scope, (c) parallel track with extra headcount

**3. Owned it without blame:**
"I should have uncovered these dependencies in the pre-migration assessment. That's on me. Here's how we're going to solve it."

**4. Gave them choices, not just a problem:**
Presented 3 options with trade-offs. Let the VP make the call. The decision was option (b) — 1-week slip with reduced scope, then phase 2 for the rest.

**Result:**
• VP appreciated early warning (could renegotiate before board meeting)
• Migration delivered on revised timeline
• Relationship with VP strengthened — cited as example of how to handle project risk
• Pre-migration assessment checklist updated to prevent recurrence`,
          tips: [
            'Emphasize delivering bad news early (options remain)',
            'Show you came with analysis and options, not just a problem',
            'Demonstrate ownership without excessive self-flagellation',
            'Mention follow-through and what you improved afterwards'
          ]
        },
        {
          id: 'beh9',
          level: 'All',
          q: 'Tell me about a time you took ownership of a problem outside your role.',
          a: `**Situation:**

During a production incident at Enterprise Pharma, a data pipeline failure was causing drug supply chain reports to be delayed. It was a business-critical system but technically "owned" by the data engineering team. The data engineering on-call was unavailable (timezone issue) and the delay was escalating.

**What I did:**

The incident was affecting pipelines I had helped migrate — AWS Glue jobs I understood technically. Even though it wasn't my escalation, I stepped in.

**Step 1: Assess quickly:**
Reviewed CloudWatch logs. Identified Glue job failure due to IAM permission change that hadn't propagated correctly — something I had done 2 days prior (the migration).

**Step 2: Own the cause:**
I had caused this (indirectly) by not verifying all IAM propagation during migration validation. I didn't wait for permission — I worked on the fix.

**Step 3: Execute the fix:**
Updated the IAM policy, restarted the Glue jobs. Within 90 minutes of the incident escalation, pipeline was restored.

**Step 4: Communicate proactively:**
Notified data engineering team of root cause, what I fixed, and recommended their team validate the rest of the migration. Wrote the incident RCA.

**Result:**
• Business report delay: 90 minutes total
• Data engineering team grateful — their on-call was truly unreachable
• Post-incident: I proactively added a migration validation step to prevent this class of issue
• Leadership cited this as model incident response behavior

**Key Learning:**

Ownership means caring about outcomes, not defending boundaries. When you see something that needs doing and you have the ability to help, help. Document it so the right people can learn.`,
          tips: [
            'Show you acted quickly and decisively',
            'Demonstrate ownership of the root cause (you caused it)',
            'Mention that you communicated back to the actual owners',
            'Talk about systemic fix, not just the one-time fix'
          ]
        },
        {
          id: 'beh10',
          level: 'All',
          q: 'How do you handle working with teams in different time zones?',
          a: `**My Context:**

At Global IT Consultancy/Enterprise Pharma: I coordinate between India-based teams and US-based stakeholders (Bannockburn, IL). 11.5-hour time difference — very limited overlap.

**Practices I've Established:**

**1. Async-First Communication:**
• Detailed written communication — not "can we hop on a call?"
• Jira tickets with full context (screenshots, error logs, expected behavior)
• Loom videos for complex walkthroughs (async visual communication)
• Decisions documented in Confluence — not just Slack

**2. Designed for Handoffs:**
End-of-day status update sent to US stakeholders (becomes their morning briefing):
• What was completed today
• What's blocked and why
• What's needed from US team
• What they can expect tomorrow

US team sends morning brief that becomes India team's start-of-day context.

**3. Scheduled Overlap Time:**
One or two overlap hours (8-10am IST / 9:30-11:30pm CST) reserved for calls requiring real-time discussion. Used sparingly for high-priority decisions only.

**4. Empowered Local Decision-Making:**
Reduced unnecessary approval dependencies. India team empowered to make decisions within scope rather than waiting 11 hours for US approval.

**5. CI/CD for Time Zone Independence:**
Good CI/CD reduces the need for synchronous deployment coordination. Deployments happen via pipeline, not via "I need to be on a call while you deploy."

**Result:**
• Jenkins-to-GitHub Actions migration coordinated across teams with no colocation
• 60+ pipeline migrations with asynchronous coordination
• Stakeholder feedback: "most organized distributed team I've worked with"

**Tools I Use:**
Confluence (async docs), Loom (video walkthroughs), Jira (status visibility), shared Slack channels with bot notifications.`,
          tips: [
            'Show async-first mindset (not "schedule a call for everything")',
            'Discuss structured handoff practices',
            'Mention empowering teams to decide without waiting for approval',
            'Talk about CI/CD as enabler of timezone independence'
          ]
        },
        {
          id: 'beh11',
          level: 'All',
          q: 'Tell me about a time you had to learn a new technology quickly.',
          a: `**Situation:**

When Harness was selected as the CD platform at Enterprise Pharma, I had 3 weeks before the first migration was expected to be complete. I had zero prior Harness experience.

**My Rapid Learning Approach:**

**Week 1: Foundation**
• Completed Harness University (free online courses): CD fundamentals, pipeline concepts
• Set up personal Harness account with free tier to experiment
• Read documentation on Harness-specific concepts: Services, Environments, Infrastructure, Pipelines
• Identified the specific features we needed: EKS deployment, canary strategy, Vault integration

**Week 2: Hands-On in Non-Production**
• Built first Harness pipeline for a non-critical dev service
• Deliberately tried to break things to understand error states
• Joined Harness Slack community — found answers to 4 specific questions
• Paired with Harness TAM (technical account manager) for 2-hour session on our specific use case

**Week 3: First Production-Ready Pipeline**
• Migrated first service to Harness with canary strategy
• Documented every configuration decision (future reference for team)
• Invited team members to shadow and learn in parallel

**What Made It Work:**
• Time-boxed the learning (3 weeks, not open-ended)
• Focused only on what we needed (EKS + canary + Vault — not all features)
• Hands-on from day 2 (not just reading docs)
• Accepted help (community, TAM, not just solo)

**Result:**
• First pipeline live on schedule
• Documented enough that team could replicate independently
• Within 6 weeks, team had migrated 15 pipelines
• I became the internal Harness expert for the team

**Key Learning:**
Rapid learning requires focus (not trying to learn everything), hands-on practice early, and not being afraid to ask for help.`,
          tips: [
            'Show time-boxed, structured learning (not just "I figured it out")',
            'Mention hands-on early in the learning process',
            'Discuss using community resources (Slack, forums, TAMs)',
            'Connect to the business outcome (pipeline live on schedule)'
          ]
        },
        {
          id: 'beh12',
          level: 'All',
          q: 'Describe how you handle a high-pressure production incident.',
          a: `**My Incident Response Behavior:**

Incidents are high-stakes, time-pressured, and involve multiple people. How you behave under pressure defines your reliability.

**A Real Example:**

3:00 AM alert: GitHub Actions self-hosted runners all offline. CI/CD for 20+ teams completely blocked. My on-call rotation.

**What I Did:**

**3:00 AM — First 5 minutes:**
• Acknowledged alert (PagerDuty)
• Opened incident channel: "GitHub Actions runners are offline. I'm investigating. Will update in 10 min."
• No panic — methodical assessment

**3:05 AM — Diagnosis:**
• SSH to runner hosts: unreachable
• AWS console: Auto Scaling Group showed instances in "InService" but unreachable
• EC2 Status checks: passing
• Checked CloudWatch: runner agent process not running (OOM kill — disk full)

**3:15 AM — Fix:**
• Identified cause: disk full from Xcode caches (iOS builds)
• Disk cleanup script on each runner
• Runner agent restarted on each host
• Tested: test pipeline ran successfully

**3:30 AM — Communication:**
• Posted in #engineering-announcements: "Runners are restored. Cause: disk exhaustion from iOS build caches. All pipelines can resume."

**Morning — Root Cause:**
• Added disk monitoring alert (alert at 70%, not just when full)
• Added automated cache cleanup cron (weekly Xcode derived data purge)
• Updated runner setup documentation

**Behavior Under Pressure:**

• I don't jump to solutions before understanding the problem
• I communicate status even when I don't have the answer yet
• I fix the symptom, then the root cause (two separate steps)
• I don't sacrifice long-term fixes for short-term relief
• I document what I did — my future self and teammates benefit`,
          tips: [
            'Walk through your incident response process step by step',
            'Show communication as first priority (not just fixing)',
            'Demonstrate fix-then-prevent thinking',
            'Talk about remaining calm and methodical (not reactive)'
          ]
        },
        {
          id: 'beh13',
          level: 'All',
          q: 'How do you give and receive feedback effectively?',
          a: `**My Feedback Philosophy:**

Feedback given or received poorly is worse than no feedback. Both require skill.

**Giving Feedback:**

**When:**
• Timely: within 48 hours of the event, not weeks later
• Private: never in front of peers (for critical feedback)
• Regular: not just when something goes wrong

**How (SBI Framework — Situation, Behavior, Impact):**

"In today's architecture review [situation], when you dismissed the security concern without investigation [behavior], it made the security team feel their input wasn't valued and left a potential risk unaddressed [impact]."

Not: "You're not good at listening to security concerns."

**Positive Feedback:**

Give specific, public positive feedback generously:
"Puja's documentation of the Vault migration was exceptional — I've seen 3 developers use it this week without support tickets. That's the standard we should aim for."

**Receiving Feedback:**

**My Default Response:**
"Thank you. Can you help me understand more about [specific part]?"
Not defensive. Not immediately apologetic. Curious.

**Process:**
1. Listen fully (don't formulate response while they're talking)
2. Clarify what I don't understand
3. Take time to reflect (don't commit to action immediately)
4. Follow up: "I thought about what you said, and here's what I'm going to change"

**Real Example — Receiving Hard Feedback:**

A Enterprise Pharma architect told me my technical documentation was "too complex for the audience." My initial reaction: defensive. I took a day to reflect, reviewed the docs through their lens, realized they were right — I had written for experts, not for the developers who needed to use it.

Rewrote the docs, got positive feedback from the developer audience. Went back to architect: "You were right, thank you for saying it directly."

**Creating Feedback Culture:**
• Ask for feedback explicitly: "What would make this better?"
• Model receiving it well — teams watch how you handle it`,
          tips: [
            'Know SBI or similar feedback frameworks',
            'Show intellectual humility in receiving feedback',
            'Mention creating psychological safety for feedback',
            'Give a real example where feedback changed your behavior'
          ]
        },
        {
          id: 'beh14',
          level: 'All',
          q: 'Tell me about your greatest professional failure and what you learned.',
          a: `**Situation:**

Early in my platform engineering work at Enterprise Pharma, I ran a Terraform apply in the production environment that destroyed and recreated a load balancer. Result: 45 minutes of downtime for an external-facing API during business hours.

**What Happened:**

I was refactoring a Terraform module that managed the load balancer. During the refactor, I changed the resource name (effectively a delete + create in Terraform). I reviewed the plan — it showed "destroy" and "create." I thought: they're just resource renaming, the actual infrastructure is the same.

I was wrong. Terraform deleted the existing load balancer, created a new one, and the 45 minutes was DNS propagation + health check re-establishment time.

**Why it Failed:**

• I didn't fully understand the impact of resource renaming in Terraform (at the time)
• I didn't test the approach in staging with the same live conditions
• I didn't consult a second person on a high-risk change
• I proceeded during business hours instead of a maintenance window

**The Impact:**

45 minutes of customer-facing downtime. Incident report. Stakeholder notification. Post-mortem with VP-level visibility.

**What I Did:**

Owned it fully in the post-mortem — no blame-shifting. Presented root cause, immediate fix, and preventive measures.

**What Changed:**

• Learned terraform state mv and moved block to handle resource renaming
• Created policy: production Terraform changes require peer review
• Added rule: destroy operations in prod require CISO and VP approval
• Implemented Atlantis: plan visible to multiple reviewers before apply
• Introduced change windows for infrastructure changes

**What I Learned:**

Knowing the tool isn't enough. Knowing the blast radius matters more. "It looks the same" is not the same as "it is the same."`,
          tips: [
            'Be genuinely honest — interviewers respect real failure stories',
            'Show you owned it (no blame on tools, team, circumstances)',
            'Focus significant time on what you learned and what changed',
            'Pick a failure that led to systemic improvement, not just personal lesson'
          ]
        },
        {
          id: 'beh15',
          level: 'All',
          q: 'How do you manage your own workload and avoid overcommitment?',
          a: `**The Platform Engineer Overcommitment Trap:**

Platform teams are often seen as "can you just quickly..." targets. Everyone's requests feel urgent. Without discipline, you're reactive, burned out, and delivering nothing well.

**My System:**

**1. Capacity Visibility:**

Maintain a personal Kanban board (Jira or Notion):
• In Progress: max 3 items at a time
• This Week: committed work
• Requested: intake queue (not committed)
• Blocked: waiting on others

When someone asks for something new: "Let me check my capacity and get back to you by EOD." Not a reflexive yes.

**2. Weekly Planning:**

Every Monday: 30 minutes to review in-progress, committed work, and team sprint. Confirm my commitments are realistic. Identify conflicts early.

**3. The "No" That Works:**

Instead of: "No, I'm too busy."
I say: "I can't get to this until [specific date]. If that doesn't work for you, who else on the team can help? Or let's discuss reprioritizing [current commitment]."

**4. Identifying Energy Patterns:**

I do deep technical work in the morning (high focus). Meetings and collaboration in the afternoon. Never schedule interruption-heavy meetings before 10am.

**5. Async Defaults:**

Reduce meeting load by defaulting to async. Before scheduling a meeting: "Can this be answered in a Slack message or Confluence comment?" Often yes.

**6. Recognizing Overcommitment Signs:**

• Working evenings more than 2x per week
• Quality of deliverables dropping
• Skipping learning time
• Feeling behind on everything

When I see these: I pause, have an honest conversation with my manager, and reprioritize explicitly.

**Result:**
• High quality deliverables with sustainable pace
• Team can rely on my commitments
• Manager never surprised by slips — I communicate early`,
          tips: [
            'Show systematic approach, not just "I work hard"',
            'Discuss how you say no constructively',
            'Mention communication when you are overloaded',
            'Talk about sustainable pace as a team responsibility, not weakness'
          ]
        },
        {
          id: 'beh16',
          level: 'All',
          q: 'Tell me about a cross-functional project you led from start to finish.',
          a: `**Project: Enterprise Mobile CI/CD Platform Build**

**Scope:** Build centralized mobile CI/CD platform for 3 mobile apps (React Native, 2 Mendix) across multiple teams.

**Stakeholders:**
• 3 mobile app development teams (6-8 developers each)
• Security team (certificate and signing approval)
• Infrastructure team (Mac hardware procurement)
• IT/MDM team (enterprise app distribution)
• VP Engineering (budget and timeline approval)

**Phase 1: Discovery (3 weeks)**

Stakeholder interviews: what are current mobile build pain points? Key findings: 2 days to release, manual code signing failures 30% of the time, no standard process.

**Phase 2: Design (2 weeks)**

Proposed architecture: shared Mac runner fleet, centralized Vault for certificates, Fastlane lanes, GitHub Actions workflows. Presented to security team for approval. Presented to VP for budget (3 Mac Minis: ~$2,400).

**Phase 3: Infrastructure (3 weeks)**

Procured and configured Mac Minis. Set up GitHub Actions runner fleet. Integrated Vault for certificate storage.

**Phase 4: Pipeline Build (4 weeks)**

Built iOS and Android pipelines. Worked with first mobile team (pilot) to test and refine. Iterative — rebuilt signing flow twice before it was reliable.

**Phase 5: Rollout (4 weeks)**

Migrated 3 teams in sequence. Office hours for support. Documentation in Confluence.

**Challenges:**
• IT blocked hardware purchase for 2 weeks (procurement process) — resolved by escalating to VP
• Security team required 3 rounds of review for certificate storage approach
• One app team resistant — pair-programmed their first pipeline together

**Results:**
• Release cycle: 2 days → 15 minutes
• Build success rate: ~70% → 99%
• All 3 teams live within 3 months of project start
• $0 additional tooling cost (GitHub Actions + existing Vault)`,
          tips: [
            'Walk through the phases clearly (not just "I built a thing")',
            'Show you navigated multiple stakeholders with different concerns',
            'Mention specific blockers and how you resolved them',
            'Quantify the outcome (time, cost, quality)'
          ]
        },
        {
          id: 'beh17',
          level: 'All',
          q: 'How do you approach technical documentation as a platform engineer?',
          a: `**Documentation Philosophy:**

Good documentation is a platform feature, not a nice-to-have. Bad docs = support tickets. No docs = platform no one uses.

**Types of Docs I Produce:**

**1. Getting Started Guide:**
Goal: developer deploys first service within 15 minutes. No assumptions. Every step explicit. Tested by asking a new team member to follow it cold.

**2. How-To Guides:**
Specific tasks: "How to add a new secret to Vault," "How to debug a failing pipeline," "How to scale your Kubernetes deployment."
Short. Searchable. Copy-paste friendly.

**3. Architecture Decision Records (ADRs):**
Documents why we made key decisions — GitHub Actions vs Jenkins, Vault vs AWS Secrets Manager. Future platform engineers understand the context. Saves the "why did we do this?" question in 2 years.

**4. Runbooks:**
Linked directly from every alert. "This alert fired. Here's how to investigate and resolve."
Written for on-call engineer at 3am — simple, sequential, no assumptions about context.

**5. Platform Changelog:**
What changed and when. Teams can understand what was released, what was fixed.

**My Documentation Process:**

Write it during development (not after). If I can't explain it in writing, I don't understand it well enough. Every PR that changes behavior gets a docs update in the same PR.

**Quality Signals:**

• Track docs-related support tickets (failing docs show up as tickets)
• "Was this helpful?" rating on every doc page
• Time-to-first-deployment for new developers (proxy for docs quality)

**Tools:**
• Backstage TechDocs: docs-as-code, in Git, rendered in portal
• Confluence: decision documents, project records
• Runbooks in Confluence linked from PagerDuty alerts

**Anti-Pattern I Fight:**

"We'll write the docs after the feature is stable." Stability never comes. The feature is only finished when the docs are done.`,
          tips: [
            'Show docs are part of the definition of done for you',
            'Discuss ADRs as decision documentation practice',
            'Mention runbooks linked to alerts specifically',
            'Talk about measuring documentation quality'
          ]
        },
        {
          id: 'beh18',
          level: 'All',
          q: 'Tell me about your experience with agile and how you work within development teams.',
          a: `**My Agile Experience:**

Platform engineering within a broader agile organization. Platform team runs its own sprints while serving multiple stream-aligned teams.

**How Platform Team Works Agile:**

**Sprint Planning:**
2-week sprints. Backlog refined weekly. Prioritized by: team demand, strategic roadmap, toil reduction. Capacity reserved: 70% planned work, 30% unplanned (support, incidents, ad-hoc requests).

**Ceremonies I Run/Participate In:**
• Sprint Planning: commit to realistic scope
• Daily Standup: 15 min, async-friendly (Slack post if remote)
• Sprint Review: demo new platform features to stakeholders
• Retrospective: blameless process improvement

**Working With Stream-Aligned Teams:**

Platform team attends consuming team's sprint reviews quarterly — stay connected to their reality. When doing migrations, temporarily embed in the team's sprint cadence. Don't impose our sprint on their sprint — work to their rhythm.

**Estimation Approach:**

Story points for internal platform features. T-shirt sizing (S/M/L/XL) for service requests. If I can't estimate it in 15 minutes, it needs to be broken down more.

**Handling Interruptions:**

20-30% unplanned buffer is essential for platform teams. When unplanned work exceeds buffer: explicit trade-off conversation with stakeholders.

**Technical Debt in Agile:**

Allocated 20% of every sprint for technical debt. Not let accumulate. Documented in backlog with business impact. Not invisible to stakeholders.

**What I've Learned from Agile:**

Working software over comprehensive documentation — but for platform teams, documentation IS the working software for our users. Adapting the principle: useful docs over perfect docs.`,
          tips: [
            'Discuss how platform teams adapt agile for their specific context',
            'Mention capacity reserved for unplanned work (realistic)',
            'Talk about technical debt management explicitly',
            'Show you engage with consuming teams, not just your own sprint'
          ]
        },
        {
          id: 'beh19',
          level: 'All',
          q: 'How do you approach performance reviews and career development conversations?',
          a: `**As an Individual Contributor:**

**Self-Advocacy:**
I document accomplishments throughout the year — not just at review time. Specific, quantified: "Migrated 60+ Jenkins pipelines to GitHub Actions, reducing average build time 30%, enabling self-service for 20+ development teams."

I don't wait for my manager to notice impact. I share updates proactively in 1:1s.

**Setting Development Goals:**

Not: "I want to learn Kubernetes." That's a wish.
Instead: "I want to design and deploy the EKS platform for our staging environment by Q2, which will develop my cluster architecture skills and directly support team priorities."

Specific, measurable, time-bound, connected to business value.

**Asking for Stretch Opportunities:**

"I'd like to lead the mobile platform migration project. Here's how I think I can approach it, and here's what support I'd need." Not waiting to be assigned interesting work.

**Handling Difficult Review Feedback:**

If I disagree with feedback: "Can you give me a specific example where you saw this?" Then listen. If still disagree after examples: "I see it differently because [X]. Can we discuss this more?" Not accepting unfair feedback silently, not reacting defensively.

**As a Chapter Lead (Societe Generale):**

**For Team Members:**

Monthly 1:1s with structured agenda: personal wellbeing, project challenges, career development.

Development plans co-created, not assigned. I ask: "Where do you want to be in 2 years? What's the gap? How can I help close it?"

Stretch assignments: increasing responsibility, not just more work. Recognize publicly, address growth areas privately.

**Promotion Advocacy:**

If a team member is ready for promotion, I build the case proactively: documented accomplishments, peer feedback, examples of behavior at next level. I don't wait for them to ask.`,
          tips: [
            'Show you are proactive about your own development',
            'Discuss how you document accomplishments for reviews',
            'Mention how you gave development opportunities to your team',
            'Talk about handling disagreement in review feedback'
          ]
        },
        {
          id: 'beh20',
          level: 'All',
          q: 'Why do you want to move into Platform Engineering, and what is your career vision?',
          a: `**My Journey to Platform Engineering:**

I didn't set out to be a platform engineer — I became one by seeing the need.

As a full-stack developer at Societe Generale, I watched teams spend days on infrastructure setup for every new feature. I started automating: build scripts, deployment pipelines, environment setup. When the improvement was 10x, I knew this was where I could add more value than in application code.

At Enterprise Pharma, I had the opportunity to formalize this: designing the CI/CD platform, the mobile build infrastructure, the Kubernetes platform. The feedback from developers — "you saved me a week" — is more satisfying than any feature I shipped as a developer.

**Why Platform Engineering Specifically:**

I operate at the intersection of two things I love: deep technical work and enabling people. Building a platform that allows 200 developers to move faster is a 200x multiplier. Feature work is additive; platform work is multiplicative.

I also genuinely enjoy the product mindset — treating developers as customers, measuring satisfaction, iterating based on feedback. It combines engineering with empathy in a way that I find uniquely engaging.

**Career Vision:**

Near-term: Lead a platform engineering team end-to-end — own the roadmap, the technical direction, and the team culture. Build a platform that developers genuinely love (not just tolerate).

Mid-term: Contribute to the broader platform engineering community — open source tooling, conference talks, writing. The field is maturing and needs practitioners who've built real things to share what works.

Long-term: Move into a Principal/Staff Engineer or Engineering Director role where I can shape how entire organizations think about developer productivity and platform engineering as a discipline.

**What Drives Me:**

The gap between "developer experience most teams have" and "developer experience that's possible" is enormous. I want to close that gap.`,
          tips: [
            'Be authentic about your journey — interviewers detect rehearsed answers',
            'Connect your full-stack background as a strength (you understand your users)',
            'Show ambition but ground it in what you can do now',
            'Mention the multiplier effect of platform work (this resonates with hiring managers)'
          ]
        }
      ]
    },
    system: {
      title: 'System Design',
      icon: '📐',
      questions: [
        {
          id: 'sys1',
          level: 'Senior',
          q: 'Design an Internal Developer Platform from scratch.',
          a: `**Requirements Clarification:**

• 200 developers, 50+ services
• AWS cloud, Kubernetes (EKS)
• Need: service catalog, CI/CD, self-service infra
• Mobile apps: iOS and Android
• Timeline: 6 months to initial value

**Architecture Overview:**

Developer Portal (Backstage) at the top, containing Service Catalog, Templates, Docs, and Integrations.

Below that: GitHub Repos, CI/CD (GitHub Actions), and GitOps (ArgoCD).

Kubernetes (EKS) layer with Platform Services: Ingress (NGINX), Service Mesh (optional), Monitoring (Prometheus/Grafana), Logging (Fluent Bit to ELK), Secrets (External Secrets + Vault).

Infrastructure (AWS) at the bottom: VPC, EKS, RDS, S3, Route53, all managed via Terraform.

Parallel Mobile Build Infrastructure: Mac runners for iOS, Linux runners for Android, Fastlane automation, TestFlight/Play Store deployment.

**Phase 1: Foundation (Month 1-2)**
• GitHub org setup with branch protection
• EKS cluster with platform services
• GitHub Actions + reusable workflows
• Vault for secrets management
• Mac runners for mobile builds

**Phase 2: Developer Experience (Month 3-4)**
• Backstage deployment
• Service catalog population
• Software templates (3-4 golden paths)
• Documentation hub
• Mobile CI/CD golden paths

**Phase 3: Self-Service (Month 5-6)**
• Terraform modules for common infra
• Self-service database provisioning
• Monitoring-as-code
• Developer onboarding automation

**Key Design Decisions:**
• GitOps for all deployments (ArgoCD)
• No tickets for golden path resources
• Security built into templates
• Observability as default

**Success Metrics:**
• Time to first deployment less than 2 hours
• Self-service adoption greater than 80%
• Developer NPS greater than +40
• Mobile release cycle less than 1 hour`,
          tips: [
            'Draw architecture diagram',
            'Discuss phased approach',
            'Mention specific tools',
            'Talk about success metrics'
          ]
        },
        {
          id: 'sys2',
          level: 'Senior',
          q: 'Design a mobile CI/CD platform for enterprise.',
          a: `**Requirements:**

• 10+ mobile applications (iOS + Android)
• React Native and native apps
• Multiple environments (dev/staging/prod)
• Compliance requirements (app signing, audit)
• Fast iteration with stable releases

**Architecture:**

**Infrastructure Layer:**

macOS Runners: GitHub-hosted macos-latest (migrated from dedicated Mac server), zero Xcode maintenance, stateless per build.

Linux Runners: Android builds, General CI tasks, Auto-scaling capability.

**Secrets Management:**

HashiCorp Vault storing iOS certificates and profiles, Android keystores, API keys per environment, App Store Connect credentials.

**CI/CD Pipeline:**

Source (GitHub) triggers Build (GitHub Actions), which runs Security (scans), then Package (IPA/APK/AAB), then Deploy (TestFlight/Play Store), then Notify (Slack).

**iOS Pipeline Components:**

• Fastlane Match for certificate management
• Xcode CLI for builds
• Automatic provisioning profile management
• TestFlight deployment
• App Store Connect API for submission

**Android Pipeline Components:**

• Gradle with product flavors
• Keystore management via Vault
• Multiple build variants
• Play Store deployment (internal/production)

**Environment Strategy:**

Development: Debug builds, Internal distribution, Frequent updates.
Staging: Release-like builds, TestFlight/Internal track, QA testing.
Production: Signed release builds, App Store/Play Store, Phased rollout.

**Automation Features:**

• Automatic version bumping
• Release notes from commits
• Screenshot automation (optional)
• Phased rollout controls
• Rollback capabilities

**Results Expected:**
• Build time under 20 minutes
• Release cycle under 1 hour (from trigger)
• 99% build success rate
• Zero manual signing steps`,
          tips: [
            'Discuss infrastructure choices',
            'Mention code signing strategy',
            'Talk about environment management',
            'Cover compliance requirements'
          ]
        },
        {
          id: 'sys3',
          level: 'Senior',
          q: 'Design a GitOps-based deployment platform.',
          a: `**Architecture:**

**Git Repositories:**

App Repos (source code) and GitOps Repo (deployment manifests) as sources of truth.

**CI/CD Flow:**

CI Pipeline (GitHub Actions) builds, tests, pushes images, and updates GitOps repo. ArgoCD (GitOps Controller) watches GitOps repo, syncs to cluster, handles drift detection and self-healing. Kubernetes Clusters (dev, staging, prod) receive deployments.

**Repository Structure:**

gitops/ with apps/ containing base/ and overlays/ (dev/staging/prod), platform/ containing monitoring/ingress/argocd, and clusters/ containing dev/staging/prod configurations.

**ArgoCD Configuration:**

App of Apps pattern with Application watching gitops repo path, automatic sync enabled with prune and self-heal.

**CI Pipeline Image Update:**

After build, clone gitops repo, update image tag using kustomize, commit and push change.

**Promotion Flow:**

dev (auto-deploy) to staging (auto-deploy) to prod (manual approval).

**Key Features:**

• Image Updater for automated promotions
• Sync windows for prod deployments
• RBAC for environment access
• Notifications to Slack
• Diff preview in PRs

**Platform Benefits:**
• Audit trail for all changes
• Easy rollbacks (git revert)
• Consistent environments
• Drift detection and correction
• Developer self-service`,
          tips: [
            'Draw the flow clearly',
            'Discuss repository strategies',
            'Mention promotion workflows',
            'Talk about rollback process'
          ]
        },
        {
          id: 'sys4',
          level: 'Senior',
          q: 'Design a secrets management system for a large enterprise.',
          a: `**Requirements:**
• 100+ services, 20+ teams
• Multiple clouds (AWS primary, Azure secondary)
• Regulatory compliance (audit logs, rotation)
• Developer self-service (no tickets for standard secrets)
• High availability (secrets are critical path)

**Architecture:**

**Core: HashiCorp Vault Enterprise**

Three-node Raft cluster across 3 AZs.
Primary region: us-east-1. DR replica in us-west-2 (performance replication).
Load balancer in front (NLB for static IPs).

**Secret Engines:**

KV v2: static secrets (API keys, tokens) — versioned, audit logged.
AWS: dynamic IAM credentials (15-minute TTL).
Database: dynamic PostgreSQL credentials (1-hour TTL, unique per instance).
PKI: internal CA for service TLS certificates (auto-renewed).
Transit: encryption-as-a-service (encrypt data without exposing key).

**Authentication Methods:**

AWS Auth: EC2 instances and EKS pods authenticate via IAM role.
Kubernetes Auth: EKS pods via service account JWT.
OIDC: GitHub Actions, humans via SSO.
AppRole: non-cloud workloads with SecretID.

**Self-Service for Developers:**

Vault UI + CLI for authorized users.
Backstage plugin: browse secrets you have access to.
Self-service secret creation within team namespace (no platform ticket).
Auto-rotation configured by default.

**Access Control Structure:**

Namespace per team (/teams/mobile, /teams/backend).
Admin policy for team leads.
Read policy for CI/CD pipelines.
Write policy restricted (most secrets created by platform team initially, then maintained by team).

**Audit and Compliance:**

All Vault operations logged (audit device to S3).
CloudTrail complements for AWS-side operations.
Quarterly access review: unused AppRoles auto-revoked.
Alert: same secret accessed > 100x/hour (anomaly detection).

**DR / HA:**

Primary cluster fails → Vault auto-elects new leader (Raft).
Region fails → Promote DR replica to primary (manual, < 15 min).
Secret retrieval cached in app for 5 minutes (resilience to short Vault outage).

**Developer Experience:**
• External Secrets Operator: secrets in Kubernetes without Vault SDK
• Vault Agent: sidecar injection for non-Kubernetes workloads
• 5-minute onboarding for new team`,
          tips: [
            'Start with requirements before jumping to solution',
            'Know Vault secret engines cold (KV, AWS, Database, PKI)',
            'Discuss auth method selection per use case',
            'Talk about DR and what happens when Vault is down'
          ]
        },
        {
          id: 'sys5',
          level: 'Senior',
          q: 'Design a container image pipeline — build, scan, sign, and distribute.',
          a: `**Requirements:**
• 50+ services, multiple languages
• Security: no unscanned or unsigned images in production
• Speed: feedback within 10 minutes
• Compliance: audit trail per image

**Pipeline Architecture:**

**Stage 1: Build**
Developer merges to main → GitHub Actions triggered.
Docker BuildKit with cache-to/cache-from ECR (layer caching).
Multi-stage Dockerfile: build stage + minimal runtime stage.
Tags: {service}:{sha} and {service}:latest.

**Stage 2: Scan**
Trivy: OS and application dependency CVE scan.
Exit code 1 if CRITICAL finding → pipeline fails, no push.
HIGH findings: create Jira ticket, allow push with warning.
Hadolint: Dockerfile best practices lint.
Secrets scan: Trufflehog on build context.

**Stage 3: Push to Registry**
ECR (AWS Elastic Container Registry).
Tag immutability: enabled. No overwriting sha-tagged images.
Cross-region replication: us-east-1 → us-west-2 (DR).

**Stage 4: Sign**
Cosign (Sigstore) signs image with keyless signing (OIDC-based, no static keys).
Signature stored alongside image in ECR.
Signature attestation: includes scan results (SBOM, CVE scan output).

**Stage 5: Promote**
ArgoCD Image Updater: detects new sha tag in ECR, opens PR in gitops repo.
GitOps review → merge → ArgoCD syncs to dev.
After dev validation: promote sha tag to staging, then prod.

**Stage 6: Admission Control**
Kyverno ClusterPolicy: deny pods using images without valid Cosign signature.
Policy: images must come from approved ECR registry.
Unsigned image = pod rejected before scheduling.

**Audit Trail:**
• GitHub: who built, what commit, what PR
• Trivy results: stored in S3 per sha tag
• Cosign attestation: scan results embedded in signature
• ECR: pull log per image per time

**SBOM:**
Syft generates SBOM per image. Grype scans SBOM against CVE database. SBOM stored in ECR as attestation.`,
          tips: [
            'Know Cosign/Sigstore for keyless signing',
            'Discuss SBOM as supply chain security requirement',
            'Mention Kyverno admission control for enforcement',
            'Talk about ECR tag immutability as critical control'
          ]
        },
        {
          id: 'sys6',
          level: 'Senior',
          q: 'Design a multi-tenant Kubernetes platform for 500 developers.',
          a: `**Scale Considerations:**
• 500 developers, 100+ teams
• 200+ services across microservices landscape
• Mixed workloads: web APIs, batch jobs, ML workloads
• Multiple environments: dev, staging, prod

**Cluster Strategy:**

**Dev:** Shared cluster — all 500 developers, namespace per team.
**Staging:** Shared cluster — same, slightly larger.
**Production:** Multiple clusters by domain (isolation by business criticality):
• prod-core: business-critical APIs (high SLA)
• prod-standard: general services
• prod-ml: GPU workloads (specialized nodes)

**Tenant Isolation (Namespace per Team):**

ResourceQuota: CPU, memory, pod count limits per team.
LimitRange: default requests/limits for pods without explicit values.
NetworkPolicy: default deny all ingress. Explicit allow from ingress controller and within namespace.
RBAC: team-admin role per namespace, bound to AD group.

**Self-Service Namespace Provisioning:**

Team requests via Backstage form → Terraform applies namespace with standard quota → RBAC bound to team's GitHub group → onboarding email with Kubeconfig.

**Node Pool Strategy:**

General pool: standard compute for most workloads (spot + on-demand mix).
Memory pool: memory-optimized for caches and in-memory DBs.
GPU pool: for ML training (tainted, only GPU-tolerating pods).
System pool: for platform components (on-demand, separate from workload).

**Platform Components (Separate from Tenant Namespaces):**

platform-system namespace: ArgoCD, Vault agent, External Secrets Operator, Cluster Autoscaler, Karpenter.
monitoring namespace: Prometheus, Grafana, AlertManager.
ingress namespace: NGINX or AWS Load Balancer Controller.

**Cost Showback:**
Kubecost deployed, per-namespace cost visible to team leads. Monthly email report per team.

**Cluster Upgrade Strategy:**
Upgrade dev → staging → prod (one cluster per week). Karpenter manages nodes — node upgrades via rolling replacement.

**Access:**
kubectl access via AWS SSO, EKS access entry. No direct kubeconfig distribution. Short-lived tokens.`,
          tips: [
            'Discuss cluster topology decision (shared vs dedicated)',
            'Show namespace isolation mechanisms layered together',
            'Mention self-service namespace provisioning',
            'Talk about cost visibility at team level'
          ]
        },
        {
          id: 'sys7',
          level: 'Senior',
          q: 'Design a platform observability system for 200+ microservices.',
          a: `**Requirements:**
• 200+ services, 50+ teams
• Single pane of glass (one place to see everything)
• Developer self-service (teams own their dashboards)
• SLO tracking per service
• Alerting with runbooks

**Three Pillars Architecture:**

**Metrics — Prometheus Federation:**
Per-cluster Prometheus: scrapes all services, stores 15-day retention.
Federation Prometheus: aggregates cluster-level metrics, 30-day retention.
Grafana: unified dashboard with datasource per cluster + federation.
Thanos (if scale requires): global query across multiple Prometheus instances, long-term S3 storage.

**Logs — ELK Stack:**
Fluent Bit DaemonSet: lightweight collector per node.
Elasticsearch cluster: 3-node HA, hot-warm-cold ILM.
Kibana: log search and visualization.
Log routing: structured JSON required. Fluent Bit parses and routes by namespace/team.

**Traces — OpenTelemetry:**
OTel Collector DaemonSet: receives traces from apps (OTLP protocol).
Tempo (or Jaeger): trace storage and query.
Grafana Tempo datasource: trace-to-log and trace-to-metric correlation.

**Auto-Instrumentation:**
OTel Operator injects auto-instrumentation sidecar for Java, Python, Node.js.
No code change required from service teams.
Manual SDK for custom spans.

**Observability as Default (Platform Enforced):**

Helm chart includes ServiceMonitor by default (service auto-scraped).
Pre-built RED method dashboard provisioned per service.
Default alerts: pod restarts, error rate, latency — tunable via values.

**SLO Management:**

Pyrra or Sloth: SLO config-as-code. Define SLI, SLO target → auto-generates Prometheus recording rules and alerts.

**Developer Portal Integration:**

Backstage plugin shows per-service: current SLO status, error budget remaining, deployment history, recent alerts, links to Grafana/Kibana.

**Cost:**
EBS for Elasticsearch: gp3, sized by retention. S3 for Thanos long-term. Per-team log volume dashboard: self-aware cost management.`,
          tips: [
            'Draw the three pillars and how they connect',
            'Discuss auto-instrumentation for zero developer effort',
            'Mention Thanos for multi-cluster Prometheus scaling',
            'Talk about SLO tooling (Pyrra, Sloth, Grafana SLO)'
          ]
        },
        {
          id: 'sys8',
          level: 'Senior',
          q: 'Design a zero-trust security architecture for a cloud-native platform.',
          a: `**Zero-Trust Principles:**
• Never trust, always verify
• Least privilege access
• Assume breach
• Verify explicitly (every request authenticated and authorized)
• Encrypt everything in transit and at rest

**Identity Layer:**

**Human Identity:**
AWS IAM Identity Center (SSO) + SAML federation with corporate AD.
Short-lived credentials (8-hour sessions).
MFA required for all access.
Access reviewed quarterly.

**Workload Identity:**
EKS: IRSA (IAM Roles for Service Accounts) — pod identity via JWT.
GitHub Actions: OIDC — no static credentials.
EC2: Instance Profiles — no access keys on instances.
Cross-account: role assumption with conditions.

**Network Layer:**

Private API server: EKS control plane not publicly accessible.
VPC: all workloads in private subnets.
Ingress: WAF + ALB for external traffic.
Default deny network policies in Kubernetes (explicit allow list).
Service mesh mTLS for internal service traffic (if compliance requires encrypted east-west).

**Application Layer:**

Mutual TLS between services (cert-manager + Vault PKI).
Authorization: OPA/Kyverno for Kubernetes resource access.
API gateway: authentication at edge (JWT validation before reaching services).

**Secrets:**
Vault with dynamic secrets (no long-lived credentials).
Secrets never in environment variables unencrypted.
External Secrets Operator syncs to Kubernetes Secrets (encrypted in etcd via KMS).

**Supply Chain:**
Signed container images (Cosign).
Admission controller: reject unsigned or unscanned images.
SBOM per release.

**Audit:**
CloudTrail: all AWS API calls.
Kubernetes audit log: all API server actions.
Vault audit log: all secret access.
Centralized SIEM: correlation and anomaly detection.

**Verification:**
Kyverno: policy enforcement at admission time.
AWS Config: continuous compliance checking.
GuardDuty: ML-based threat detection.

**Result: Defense in Depth**
Even if one layer is compromised: attacker faces multiple additional controls.`,
          tips: [
            'Frame around the zero-trust principles explicitly',
            'Discuss each layer: identity, network, application, data',
            'Mention explicit verification at every hop (not just perimeter)',
            'Talk about what "assume breach" means operationally'
          ]
        },
        {
          id: 'sys9',
          level: 'Senior',
          q: 'Design a disaster recovery system for a cloud-native platform.',
          a: `**RPO and RTO Targets:**

Tier 1 (business-critical): RPO 1 hour, RTO 30 minutes.
Tier 2 (important): RPO 4 hours, RTO 2 hours.
Tier 3 (standard): RPO 24 hours, RTO 8 hours.

**Architecture: Active-Passive Multi-Region**

Primary region: us-east-1. DR region: us-west-2.

**Data Replication:**

RDS: cross-region read replica in us-west-2 (near-zero RPO for database).
S3: cross-region replication (automatic, async).
ElastiCache: no replication (rebuilt from application or DB on failover).
EBS: AWS Backup with cross-region copy (daily snapshots).

**Application State:**

Kubernetes workloads: stateless → no data replication needed.
GitOps state: Git is the source of truth. ArgoCD reinstalled in DR region can sync from Git.
Secrets: Vault performance replication to DR region (near-zero RPO).

**Infrastructure in DR Region (Warm Standby):**

VPC, subnets, IAM: pre-created (Terraform applied in both regions).
EKS cluster: running but at minimum capacity (2-node cluster).
RDS: read replica ready to promote.
Not running: full application workload (cost saving).

**Failover Process:**

1. Decision: declare DR (by VP Engineering + CISO).
2. RDS promotion: promote read replica to standalone (< 5 minutes).
3. EKS scale-up: scale node groups to production capacity (5-10 minutes via Karpenter).
4. ArgoCD sync: deploy all applications from GitOps repo (10-15 minutes).
5. Route 53 failover: health check triggers automatic DNS switch to DR region (< 5 minutes DNS TTL).
6. Validate: smoke tests, stakeholder notification.

**Total RTO: approximately 30 minutes.**

**DR Testing:**

Annual full DR drill: execute failover, validate everything, failback.
Quarterly component tests: RDS promotion, EKS restore from scratch, Vault DR promotion.
All tests documented, gaps addressed.

**Runbooks:**
Detailed, step-by-step runbooks linked from DR plan.
Each runbook tested annually.
Accessible offline (S3 pre-signed URL + printed copy).`,
          tips: [
            'Start with RPO/RTO requirements before architecture',
            'Discuss warm standby vs cold standby vs active-active trade-offs',
            'Emphasize DR testing as critical (untested = fiction)',
            'Know Route 53 health check failover mechanism'
          ]
        },
        {
          id: 'sys10',
          level: 'Senior',
          q: 'Design a developer portal using Backstage for 300+ developers.',
          a: `**Portal Goals:**
• Service catalog: every service discoverable
• Self-service: new services bootstrapped in < 30 minutes
• Docs: single home for all technical documentation
• Status: current health and deployment state per service

**Backstage Deployment Architecture:**

EKS deployment (3 replicas for HA).
PostgreSQL RDS as Backstage backend database.
GitHub OAuth for authentication.
Ingress via ALB with corporate SSO.

**Catalog Sources (Auto-Discovery):**

GitHub integration: scans org for catalog-info.yaml files.
Any repo with this file is auto-added to catalog.
Schedule: refreshes every 10 minutes.

**catalog-info.yaml Standard:**

Component spec required fields: name, type, owner, system, lifecycle, links, tags. Platform enforces via PR linter — PRs to repos without catalog-info.yaml get automated comment reminder.

**Software Templates (Scaffolder):**

Templates for: new backend service, new React app, new iOS/Android app, new data pipeline.

Template actions per scaffold:
1. Create GitHub repo from skeleton
2. Configure CI/CD workflow
3. Register in catalog automatically
4. Create Kubernetes namespace
5. Add to monitoring dashboards
6. Create initial Jira project

Developer experience: 10-minute form → production-ready repo.

**Plugins Integrated:**

• GitHub Actions: pipeline status per service
• ArgoCD: deployment status and sync state
• PagerDuty: on-call schedule and active incidents
• Grafana: SLO dashboard embedded per service
• SonarQube: code quality metrics
• Cost Insights: monthly spend per service (Kubecost)
• TechDocs: documentation rendered from repo markdown

**TechDocs Setup:**

Each repo has docs/ folder with mkdocs.yml.
TechDocs CI: builds and publishes to S3 on merge.
Backstage reads from S3.
Search indexes all docs — unified search across catalog + docs.

**Adoption Strategy:**

Phase 1: Catalog only (fill in catalog-info.yaml, see your service).
Phase 2: TechDocs (move docs from Confluence).
Phase 3: Scaffolder (new services only via portal).
Service Completeness Score: gamification driving adoption.`,
          tips: [
            'Know Backstage plugin ecosystem broadly',
            'Discuss scaffolder templates as killer feature for adoption',
            'Mention catalog-info.yaml as the registration mechanism',
            'Talk about phased adoption strategy'
          ]
        },
        {
          id: 'sys11',
          level: 'Senior',
          q: 'Design a CI/CD platform that handles 1,000 pipeline runs per day.',
          a: `**Scale Requirements:**
• 1,000 runs/day = ~42/hour = ~1 per 90 seconds
• Peak: likely 3-5x average = 150-200 concurrent runs possible
• Mix: 70% Linux (backend), 20% macOS (iOS), 10% Windows (legacy)
• SLA: builds start within 2 minutes of trigger

**GitHub Actions Infrastructure:**

**Linux Runner Fleet:**
AWS Auto Scaling Group (Spot Instances): m5.xlarge, 4 CPU / 16GB.
Min: 20 runners (baseline). Max: 150 runners (peak).
Scale-out: add runner when queue > 5 waiting jobs.
Scale-in: remove idle runners after 5 minutes.
Actions Runner Controller (ARC): Kubernetes-native runner scaling on EKS.

**macOS Runner Fleet:**
Mac Mini M2 fleet (physical): 10 runners.
Handles ~200 iOS builds/day (600 minutes capacity at 15 min/build).
Scale via additional Mac Minis during peak (Mac Stadium as overflow).

**Runner Images:**
Custom AMI with dependencies pre-installed (Docker, toolchains, runners).
Image pipeline: weekly rebuild, Packer-built, scanned before use.
Startup time: < 30 seconds to first job (pre-warmed dependencies).

**Artifact Storage:**
Docker images: ECR (per-image lifecycle policy).
Build artifacts: S3 with 30-day lifecycle.
Test results: S3 + GitHub Artifacts (7-day retention).

**Caching Strategy:**
S3-backed cache (GitHub Actions S3 cache action).
Shared dependency cache across all runners.
Cache hit rate target: > 80%.

**Observability:**
CloudWatch: runner utilization, queue depth, job duration.
Grafana dashboard: live runner health, queue trends, build success rate.
Alert: queue depth > 20 for > 5 minutes → scale-out triggered.

**Cost Optimization:**
Linux Spot Instances: 70-80% cost reduction vs on-demand.
Auto-scaling: pay only for runners during active builds.
iOS runners: physical (no cloud alternative), justified by volume.

**Monthly Cost Estimate (at 1,000/day):**
Linux runners (spot): ~$800/month.
Mac Minis (amortized): ~$300/month.
S3/ECR storage: ~$200/month.
Total: ~$1,300/month for CI/CD infrastructure.`,
          tips: [
            'Start with scale math (1,000/day → concurrency estimate)',
            'Discuss Actions Runner Controller for Kubernetes-native scaling',
            'Know Spot Instance trade-offs for CI (restartable workloads)',
            'Provide cost estimate — this impresses interviewers'
          ]
        },
        {
          id: 'sys12',
          level: 'Senior',
          q: 'Design a self-service database provisioning system.',
          a: `**Goal:**
Developer requests a database and has it within 15 minutes — no ticket, no platform team involvement for standard requests.

**Architecture Options (Compared):**

**Option 1: Backstage Scaffolder + Terraform PR**
Developer fills form in portal → Scaffolder creates PR in IaC repo → CI runs plan with cost estimate → Developer approves → Apply creates RDS.
Pros: Familiar workflow (GitHub PR), auditable.
Cons: Manual step (approve and merge), 15-30 minutes.

**Option 2: Crossplane (My Recommended for Kubernetes Teams)**
Developer applies Kubernetes CR → Crossplane controller provisions RDS automatically → Connection details in namespace Secret.
Pros: Truly self-service, no PR needed, Kubernetes-native.
Cons: Learning curve for Crossplane, more complex setup.

**Option 3: Custom API + Terraform**
Internal API accepts request → Triggers Terraform run (Terraform Cloud API) → Notifies via Slack.
Pros: Fully automated, custom UX.
Cons: Engineering effort to build and maintain.

**My Design (Crossplane):**

**CRD:** PostgreSQLDatabase custom resource with spec: name, size (small/medium/large), environment, owner (team).

**Crossplane Composition:** maps PostgreSQLDatabase to actual AWS RDS instance with appropriate instance class, storage, Multi-AZ, backup retention, encryption, subnet group.

**Outputs:** connection details written to Kubernetes Secret in requesting namespace automatically.

**Guardrails:**
• Size limits per environment (no prod-xl in dev)
• Auto-delete dev databases after 30 days (TTL controller)
• Mandatory tags injected (team, cost-center)
• Cost estimate shown before provisioning (Infracost API)
• Quota: maximum 3 databases per team per environment

**Self-Service Namespace Catalog:**
Backstage shows all databases owned by team. Status: available, creating, deleting. Links to connection details.

**Result:**
• Provisioning time: 3 days (ticket) → 12 minutes (self-service)
• Zero platform team involvement for standard sizes
• Full audit trail (Kubernetes events, CloudTrail)`,
          tips: [
            'Compare multiple approaches before recommending one',
            'Know Crossplane as Kubernetes-native IaC alternative',
            'Discuss guardrails (quotas, size limits, TTL)',
            'Talk about the connection details delivery mechanism'
          ]
        },
        {
          id: 'sys13',
          level: 'Senior',
          q: 'Design a feature flag system for enterprise mobile and backend services.',
          a: `**Requirements:**
• Mobile apps (iOS/Android) + backend services
• Gradual rollout (1% → 100%)
• Instant kill switch
• A/B testing capability
• Developer self-service
• Audit trail (regulated environment)

**Architecture:**

**Feature Flag Service (LaunchDarkly or self-hosted Flagsmith/Unleash):**

LaunchDarkly SaaS: minimal ops, rich targeting, reliable.
Self-hosted Unleash: more control, no per-seat cost, runs in EKS.

**Flag Structure:**

Flag types: boolean (on/off), multivariate (A/B/C), number (rate limits, thresholds).

**Targeting Rules:**

User-based: internal users first, then % rollout by user ID.
Context-based: device type, OS version, app version, geography.
Environment: flag off in dev, staged rollout in prod.

**Mobile Integration (iOS and Android):**

SDK initialized at app launch with environment-specific API key.
Flags cached locally (offline mode).
Cache refresh: on app foreground, every 5 minutes.
Async evaluation (no blocking app start).

**Backend Integration:**

Server-side SDK with streaming connection to flag service.
Flag changes propagated within < 1 second.
Fallback: use default value if flag service unavailable.

**Developer Self-Service:**

Portal: create flag, set default value, configure environments.
Approval: boolean off→on requires 1 reviewer. Percentage rollouts self-service.
Instant kill switch: anyone on team can disable in 30 seconds.

**Rollout Process:**

New feature "checkout_v2":
1. Create flag, default: off (all environments)
2. Deploy code with flag (all users get old experience)
3. Enable for internal users (20 people, validation)
4. Enable 5% of prod users, watch error rate + funnel metrics
5. Ramp: 5% → 25% → 50% → 100% over 1 week
6. Flag reaches 100%: schedule cleanup sprint (remove flag from code)

**Audit Trail:**

Every flag change logged: who, what value, when, from which environment.
Immutable audit log in S3.
Compliance requirement: all flag changes for production have Jira ticket reference.`,
          tips: [
            'Know LaunchDarkly vs Unleash vs Flagsmith',
            'Discuss mobile SDK caching (offline mode critical)',
            'Mention flag cleanup as part of the process (avoid tech debt)',
            'Talk about audit trail for compliance'
          ]
        },
        {
          id: 'sys14',
          level: 'Senior',
          q: 'Design a log aggregation and search system for 200+ microservices.',
          a: `**Scale:**
• 200 services, 1,000 pods
• Estimated log volume: 5-10GB/day compressed
• Retention: 30 days hot, 1 year cold
• Use cases: real-time debugging, security forensics, compliance audit

**Collection: Fluent Bit (DaemonSet)**

Deployed to every Kubernetes node. Reads from container log files (/var/log/containers/).
Parses JSON (platform mandate: all logs must be structured JSON).
Adds Kubernetes metadata: pod name, namespace, labels, node.
Multi-output: Elasticsearch (30-day) + S3 (1-year).

**Fluent Bit Configuration:**

Separate outputs per log type:
• Application logs → Elasticsearch (searchable)
• Audit logs → S3 with object lock (tamper-proof compliance)
• Platform system logs → Elasticsearch (ops team)

**Elasticsearch Cluster:**

Hot nodes: 3x i3.xlarge (SSD, 30.5GB RAM) — last 7 days, full query.
Warm nodes: 3x d3.xlarge (HDD, 48GB RAM) — 7-30 days.
ILM policy: auto-move from hot → warm after 7 days.

Index design: one index per service per day (service_name-YYYY.MM.DD).
Benefits: easy cleanup, fine-grained retention, team-scoped access.

**S3 Cold Storage:**

Fluent Bit writes simultaneously to S3 (in addition to Elasticsearch).
Parquet format (compressed, queryable with Athena).
Glacier Deep Archive after 90 days.
Athena queries for compliance investigations (don't need to restore).

**Kibana Access:**

Team-scoped data views: developers see only their service's index.
Platform team: cross-service view.
Pre-built dashboards: error rates, slow queries, auth failures.
Saved searches for common investigations.

**Alerting on Log Patterns:**

ElastAlert: scan for patterns and trigger alerts.
Rules: error rate spike (>10 errors/min), specific exception patterns, auth failures.

**Cost Control:**
Per-team log volume dashboard: teams aware of their contribution.
Compression: gzip at Fluent Bit (60-70% size reduction).
Sampling: high-volume debug logs sampled at 10%.
Target cost: < $0.50 per GB per month.`,
          tips: [
            'Know hot-warm-cold Elasticsearch architecture',
            'Discuss Fluent Bit vs Fluentd (why Fluent Bit for DaemonSet)',
            'Mention S3 + Athena for cost-effective long-term retention',
            'Talk about per-team index scoping for access control'
          ]
        },
        {
          id: 'sys15',
          level: 'Senior',
          q: 'Design a Kubernetes multi-cluster management system.',
          a: `**Why Multiple Clusters:**

• Environment isolation: dev/staging/prod
• Workload isolation: web APIs vs batch vs ML
• Compliance: separate cluster for regulated workloads
• Geographic: clusters in multiple regions

**Cluster Topology:**

Management cluster: runs platform tools (ArgoCD, Vault, monitoring).
Workload clusters: run actual services (EKS in each environment/region).

**GitOps with ArgoCD (Multi-Cluster):**

ArgoCD in management cluster manages all workload clusters.
Cluster registration: each EKS cluster registered via kubeconfig secret.
App of Apps: one ArgoCD Application per cluster bootstraps all services.

**Cluster Bootstrapping (Day 2 Operations):**

New cluster provisioned via Terraform. Cluster registered in ArgoCD. ArgoCD syncs platform components: cert-manager, External Secrets, AWS LBC, Prometheus, RBAC. Takes < 30 minutes to go from empty EKS to production-ready.

**Cluster Catalog (Backstage):**

Each cluster registered as an infrastructure resource in Backstage catalog. Shows: cluster name, region, environment, Kubernetes version, node count, health status.

**Fleet-Wide Policy Enforcement:**

Kyverno: policies applied to all clusters via ArgoCD.
Single policy definition → ArgoCD deploys to all clusters simultaneously.
Policy violations visible in central dashboard.

**Observability (Multi-Cluster):**

Prometheus per cluster (local retention: 15 days).
Thanos Querier in management cluster: unified query across all clusters.
Single Grafana with global view + per-cluster drilldown.

**Upgrades at Scale:**

Sequential upgrade per cluster: dev → staging → prod (same region) → prod DR.
Version skew: max 1 minor version difference between clusters.
Automated compatibility check: add-on versions validated before upgrade.

**Access Control:**

No direct kubectl access to production (through bastion or AWS EKS access entry).
RBAC per cluster, managed centrally via GitOps.
Production access requires MFA + time-limited session.`,
          tips: [
            'Discuss ArgoCD multi-cluster architecture with management cluster',
            'Know cluster bootstrap automation process',
            'Mention Thanos for cross-cluster metrics',
            'Talk about fleet-wide policy enforcement'
          ]
        },
        {
          id: 'sys16',
          level: 'Senior',
          q: 'Design a FinOps platform for cloud cost visibility and optimization.',
          a: `**Problem:**
Engineering teams don't know what they spend. Cost grows with usage, but nobody feels accountable. Platform team needs to enable cost ownership without creating bureaucracy.

**Core Components:**

**1. Cost Data Pipeline:**

AWS Cost and Usage Report (CUR) → S3 → Glue ETL → Athena → Grafana.
Runs daily. Data available by 8am for previous day.
Tags normalized: missing tags flagged and reported.

**2. Tagging Enforcement:**

Required tags: team, service, environment, cost-center.
Terraform modules inject tags automatically.
AWS Config rule: flag untagged resources daily.
Tagging compliance dashboard: % of resources tagged per team.
Goal: 100% tagged resources before team can provision new ones.

**3. Cost Allocation:**

AWS Cost Explorer: per-tag grouping.
Kubernetes: Kubecost per namespace (pod-level allocation).
EKS node cost split by namespace proportionally.
Cost per service visible in Backstage catalog.

**4. Showback (Not Chargeback):**

Teams see their costs. No budget ownership (reduces gaming behavior).
Monthly email report per team: "Your cloud spend this month was $X (Y% vs last month)."
Anomaly alert: if spend > 120% of 30-day average → alert team lead.

**5. Optimization Recommendations:**

Compute Optimizer recommendations surfaced in developer portal.
Unused resources report: EC2/RDS instances < 5% CPU for 7 days.
Rightsizing suggestions with estimated savings.
Reserved Instance coverage report: identify gaps.

**6. FinOps Rituals:**

Monthly engineering cost review (15 minutes, all team leads).
Quarterly budget planning informed by actual spend trends.
Celebrate cost wins in #engineering Slack.

**Self-Service Actions:**

Via Backstage: request Reserved Instance (for approved services).
Schedule stop/start: dev environments auto-scale to zero at 7pm.
Rightsize suggestion: one-click to apply Compute Optimizer recommendation.

**Results:**
• Per-team cost visibility implemented
• Engineering cost grew 40% slower than services deployed
• 3 teams reduced spend > 20% after visibility enabled`,
          tips: [
            'Discuss showback vs chargeback (showback more effective culturally)',
            'Know Kubecost for Kubernetes cost allocation',
            'Mention tagging enforcement as the foundation of everything',
            'Talk about FinOps rituals, not just tooling'
          ]
        },
        {
          id: 'sys17',
          level: 'Senior',
          q: 'Design a platform engineering team structure and operating model.',
          a: `**Context:**
500 developers, 100 teams, Platform Engineering team of 8.
Ratio: 1 platform engineer per 62 developers (typical range: 1:25-1:100).

**Team Structure:**

**Platform Engineering Team (8 engineers):**
• Platform Lead (1): roadmap, stakeholder management, technical direction
• Cloud/Infrastructure (2): AWS, Terraform, networking, cost
• Developer Experience (2): CI/CD, Backstage portal, templates
• Kubernetes/Container (2): EKS platform, Helm library, GitOps
• Mobile Platform (1): iOS/Android CI/CD, Mac runners, signing

**Embedded Model:**

One platform engineer embedded in each major business domain (optional, for large domains). Bridges platform-developer gap. Stays deeply connected to actual developer pain.

**Operating Model:**

**Intake:**
All requests via Jira (not Slack DMs). Form: business impact, affected teams, urgency.
Weekly triage: scored by impact × urgency ÷ effort. Visible backlog.

**Sprint Cadence:**
2-week sprints. 60% planned (roadmap), 20% demand (team requests), 20% toil reduction.

**Communication:**
Weekly #platform-updates Slack: what shipped, what's coming.
Monthly platform office hours: open to all developers.
Quarterly roadmap review: with engineering leadership.

**Reliability:**
Platform on-call rotation (all 8 team members, 1 week rotation).
SLO for platform: 99.9% availability.
Post-mortem for all P1 platform incidents.

**Governance:**

Platform Advisory Council: 3-4 team leads who represent developers.
Review platform roadmap, provide feedback quarterly.
Decision-making: platform team decides on implementation, council provides input on priorities.

**Success Metrics:**

Team metrics (reported monthly):
• Developer NPS for platform
• Self-service adoption rate
• Platform availability
• Mean time to resolve platform issues
• Toil percentage (target < 20%)

**Scaling:**
At current 1:62 ratio: sustainable with strong self-service and automation.
Need to hire if: developer NPS drops, support tickets grow, toil > 30%.`,
          tips: [
            'Connect to Team Topologies (platform team type)',
            'Discuss the team-to-developer ratio and sustainability',
            'Mention advisory council for stakeholder alignment',
            'Talk about how you measure team health and when to hire'
          ]
        },
        {
          id: 'sys18',
          level: 'Senior',
          q: 'Design an on-call system and incident management process for a platform team.',
          a: `**On-Call Philosophy:**

On-call should be sustainable, impactful, and continuously improving. A team that dreads on-call is burning out.

**On-Call Structure:**

Primary on-call: responds to all pages, leads incident.
Secondary on-call: escalation target if primary unavailable.
Rotation: 1-week shifts, all 8 team members rotate.
Handoff: 15-minute overlap call on rotation change day.

**Tooling Stack:**

PagerDuty: alert routing, escalation, on-call schedule.
Alertmanager: routes Prometheus alerts to PagerDuty.
Slack: incident channels, status updates.
Confluence: runbooks linked from every alert.
StatusPage (internal): platform health visible to developers.

**Alert Routing:**

P1 (Critical): immediate page (breaks silence, phone call).
P2 (High): Slack notification + PagerDuty no-ack escalation after 15 min.
P3 (Low): Slack only, business hours resolution.
Info: logged, no page.

**Incident Process:**

**Detection:** Alert fires → Primary on-call acknowledges within 5 minutes.
**Triage:** Severity assessed → incident channel created (#incident-YYYY-MM-DD-HH).
**Communication (within 10 minutes):** Post in #engineering-announcements: impact, who is investigating.
**Resolution:** Work the issue, update channel every 15 minutes (P1).
**Close:** Announce resolution + brief cause summary.

**Post-Mortem:**
Every P1: blameless post-mortem within 48 hours.
Template: timeline, impact, root cause, contributing factors, action items.
Action items have owners and due dates.
Post-mortem shared publicly within engineering (builds trust).

**On-Call Health:**

Monthly on-call review:
• How many P1 pages? (target: < 5/month total)
• Were all pages actionable? (if not: fix the alert)
• Hours of sleep disturbed? (track)
• Toil from on-call? (automate)

Burnout signal: > 10 pages per rotation → investigate and fix alert quality.

**Continuous Improvement:**

Each post-mortem generates action items. 90% closure rate within 2 weeks. Platform gets more reliable with each incident.`,
          tips: [
            'Discuss sustainable on-call (rotation, load limits)',
            'Know PagerDuty escalation policy setup',
            'Emphasize blameless post-mortem culture',
            'Talk about using on-call data to drive toil reduction'
          ]
        },
        {
          id: 'sys19',
          level: 'Senior',
          q: 'Design a compliance automation system for regulated environments.',
          a: `**Regulatory Context (Pharma/Finance):**

GxP, SOX, HIPAA-adjacent requirements: evidence collection, change traceability, access controls, audit trails. Manual compliance is expensive and error-prone.

**Compliance-as-Code Architecture:**

**Layer 1: Preventive Controls (Block Non-Compliant)**

Kyverno ClusterPolicy: production deployments require change ticket label.
Terraform Sentinel: deny S3 buckets without versioning, deny IAM users in prod.
OPA/Conftest: Terraform plan validation in CI.
AWS SCP: org-level guardrails (deny CloudTrail disable, deny leaving org).

**Layer 2: Detective Controls (Alert on Violations)**

AWS Config rules: continuous compliance checking (encryption, tagging, public access).
AWS Security Hub: aggregates findings from Config, GuardDuty, Inspector, Macie.
CloudTrail Insights: unusual API call patterns.

**Layer 3: Evidence Collection (Audit-Ready)**

Every production deployment generates evidence package (stored in S3 with object lock):
• Who deployed (GitHub user)
• What changed (git diff)
• PR approval (GitHub API)
• Test results (CI artifacts)
• Security scan results (Trivy, Snyk output)
• Linked change ticket (ServiceNow ID from PR label)

**Automated Evidence Packaging:**

Post-deployment GitHub Action: queries GitHub API for PR details, collects CI artifacts, generates evidence JSON, uploads to S3 with deployment SHA as key.

**Compliance Dashboard (Grafana):**

• Policy violations by namespace and severity
• Open CVEs by service and age
• Deployment without change ticket count (should be zero)
• Access review status per system
• Certificate expiry timeline

**Access Reviews (Quarterly Automated):**

Script queries: IAM users, roles with last used date, GitHub team memberships, Vault AppRoles.
Generates report: "Not accessed in 90+ days" flagged for review.
Team leads receive report, confirm or request revocation.
Platform team processes revocations.

**Audit Preparation:**

Before (manual): 2 weeks of evidence gathering.
After (automated): 2 hours to generate evidence package.
Pre-built: "Audit Package Generator" in internal tooling portal.

**Framework Mapping:**
SOC 2 Type II, ISO 27001 controls mapped to automated checks. Evidence tagged to specific control number. Auditors can query by control.`,
          tips: [
            'Distinguish preventive vs detective controls',
            'Discuss evidence as structured data (not manual screenshots)',
            'Know SOC 2 Type II audit requirements at high level',
            'Talk about quantifying audit cost reduction from automation'
          ]
        },
        {
          id: 'sys20',
          level: 'Senior',
          q: 'Design a platform migration strategy from a legacy monolith to microservices.',
          a: `**Starting Point:**

Legacy PHP/Java monolith. Single codebase, single deployment, single database. Teams are stepping on each other. Deploy cadence: monthly (risky). Goal: independent microservices on Kubernetes.

**Guiding Principle: Strangler Fig Pattern**

Don't rewrite from scratch. Gradually extract functionality into services while the monolith continues running. Incrementally strangle the monolith.

**Phase 1: Foundation (Months 1-3)**

**Platform Setup:**
• EKS cluster provisioned (dev, staging, prod)
• CI/CD platform (GitHub Actions + Harness)
• Service template (golden path for new services)
• Secrets management (Vault)
• Monitoring baseline (Prometheus, ELK)

**Strangler Fig Infrastructure:**
• API Gateway in front of both monolith and new services
• Traffic routing based on path/header
• New services registered in API Gateway
• Monolith still handles everything else

**Phase 2: Extract First Services (Months 4-9)**

Identify extraction candidates: low coupling, high change frequency, team with capacity.

Service extraction process:
1. New service built independently (feature parity)
2. Deployed alongside monolith
3. Shadow mode: new service handles requests, results compared (not used)
4. Traffic split: 5% → 10% → 50% → 100% via API Gateway
5. Monitor carefully during each phase
6. Monolith code retired after 100% cutover

**Data Decomposition (Hardest Part):**

Start with read-only replicas (new service reads from monolith DB).
Gradually migrate writes to new service's own database.
Dual-write period: write to both, compare.
Cut over when parity confirmed.
Event streaming (Kafka/SQS) for eventual consistency between services.

**Phase 3: Team Alignment (Continuous)**

Teams aligned to domains. Each team owns one or more services.
Platform team enables: CI/CD, Kubernetes, monitoring, secrets — all self-service.
Cross-cutting concerns (auth, logging, tracing) handled by platform.

**Success Metrics:**
• Deployment frequency: monthly → multiple per day
• Service count: 0 → 20+ services extracted
• Monolith traffic: 100% → < 10% after 18 months
• Team autonomy: independent deployability achieved`,
          tips: [
            'Know the strangler fig pattern name and concept',
            'Discuss data decomposition as the hardest challenge',
            'Mention shadow mode for zero-risk service extraction',
            'Connect platform engineering role in enabling the migration'
          ]
        }
      ]
    },
    aws: {
      title: 'AWS & Cloud Architecture',
      icon: '☁️',
      questions: [
        {
          id: 'aws1',
          level: 'Senior',
          q: 'Walk me through how you architected a high-availability AWS environment.',
          a: `**Architecture at Enterprise Pharma (My Experience):**

Multi-AZ, multi-tier architecture built for enterprise pharmaceutical workloads.

**Networking Layer:**
• VPC with public, private, and data subnets across 3 AZs
• Public NLB for external entry (static IPs, TLS termination)
• Internal ALB routing to backend microservices
• Route 53 geo-DNS for latency-based routing and failover
• VPC peering and PrivateLink for cross-account services

**Compute Layer:**
• EKS for containerized microservices with managed node groups
• EC2 Auto Scaling Groups in private subnets
• ECS Fargate for serverless batch workloads
• Spot instances for non-critical jobs (cost optimization)

**Data Layer:**
• RDS PostgreSQL with Multi-AZ failover
• Read replicas for reporting workloads
• S3 with versioning and lifecycle policies
• ElastiCache for session caching

**Security Layer:**
• IAM roles with least privilege (no static credentials)
• Security Groups layered per tier
• WAF on public ALB
• VPC Flow Logs + CloudTrail for audit

**Resilience Design:**
• Health checks at every layer (NLB, ALB, EKS)
• Circuit breakers in application layer
• RDS automated backups with PITR
• Runbooks for failure scenarios

**Results:**
• 99.95% uptime achieved
• RTO < 15 minutes for most failures
• RPO < 5 minutes for database`,
          tips: [
            'Draw the layers: networking → compute → data → security',
            'Know difference between NLB and ALB use cases',
            'Discuss multi-AZ vs multi-region trade-offs',
            'Mention actual numbers: RTO, RPO, uptime'
          ]
        },
        {
          id: 'aws2',
          level: 'Senior',
          q: 'How do you approach AWS cost optimization at scale?',
          a: `**Cost Optimization Framework (AWS Well-Architected):**

**1. Visibility First:**
• AWS Cost Explorer for trends
• Cost allocation tags (team, project, environment)
• Budgets with alerts per team/project
• Kubecost for container-level spend visibility

**2. Rightsizing:**
• Compute Optimizer recommendations reviewed monthly
• Instance type analysis (memory vs CPU bound)
• EKS node group sizing per workload type
• RDS instance class review vs actual utilization

**3. Purchasing Strategy:**
• Savings Plans for baseline compute (1-year commit)
• Reserved Instances for stable RDS workloads
• Spot Instances for CI/CD runners and batch jobs
• On-demand only for unpredictable spikes

**My Enterprise Pharma Initiatives:**

**Quick Wins:**
• Identified and terminated 15+ orphaned EC2 instances
• Moved dev/staging EKS to Spot node groups (70% savings)
• Scheduled stop/start for non-prod environments (nights/weekends)
• S3 intelligent tiering for artifact storage

**Structural Changes:**
• Migrated long-running batch jobs to Fargate Spot
• Consolidated log retention policies (ELK vs CloudWatch)
• Reserved capacity for 3 production RDS clusters
• Right-sized NAT Gateways (consolidated AZs for dev)

**Ongoing Process:**
• Monthly cost review with engineering leads
• Anomaly detection alerts for sudden spikes
• Unit economics tracked (cost per deployment, per service)

**Results:**
• 30%+ reduction in monthly cloud spend
• Cost allocation visibility across 10+ teams
• Eliminated $8K/month in unused resources`,
          tips: [
            'Know the 5 pillars of cost optimization',
            'Discuss Savings Plans vs Reserved Instances difference',
            'Mention tagging strategy for allocation',
            'Have specific dollar/percentage numbers ready'
          ]
        },
        {
          id: 'aws3',
          level: 'Senior',
          q: 'Explain your experience with AWS EKS — setup, operations, and upgrades.',
          a: `**EKS Architecture I Managed:**

**Cluster Setup:**
• Managed node groups (easier patching)
• Separate node groups by workload type: general, memory-optimized, Spot
• Private API server endpoint (no public access)
• OIDC provider for IAM Roles for Service Accounts (IRSA)
• AWS CNI for VPC-native pod networking

**Add-ons and Platform Services:**
• CoreDNS, kube-proxy, VPC CNI managed add-ons
• AWS Load Balancer Controller for ALB/NLB provisioning
• External DNS for automatic Route 53 record management
• Cluster Autoscaler + Karpenter (evaluated Karpenter for faster scaling)
• Fluent Bit DaemonSet for log forwarding to ELK

**IRSA (IAM Roles for Service Accounts):**
• Every service gets its own IAM role — no shared node roles
• Fine-grained S3, SQS, RDS access per workload
• Eliminates need for instance profile over-permissions

**Cluster Upgrades (Critical Process):**
• Review EKS upgrade guide and API deprecations (kubectl convert)
• Upgrade control plane first (managed by AWS, low risk)
• Test on dev cluster, then staging, then prod
• Upgrade node groups using rolling replacement
• Validate all platform add-ons compatibility first
• Have rollback plan (snapshot, node group version pin)

**Operational Practices:**
• Namespace-level resource quotas
• Pod Disruption Budgets for critical services
• Node taints for specialized workloads
• Regular security patching via node group rotation

**Challenges Solved:**
• DNS throttling: Switched to NodeLocal DNSCache
• Spot interruptions: Implemented proper draining + PDBs
• API server latency: Tuned client-go rate limits`,
          tips: [
            'Know IRSA deeply — it comes up in every AWS interview',
            'Be ready to explain managed vs self-managed nodes trade-offs',
            'Discuss your upgrade strategy step by step',
            'Mention Karpenter as next-gen autoscaler'
          ]
        },
        {
          id: 'aws4',
          level: 'Senior',
          q: 'How do you design cross-account AWS architectures?',
          a: `**Cross-Account Strategy at Enterprise Pharma:**

**Account Structure:**
• Separate AWS accounts per environment: dev, staging, prod
• Shared services account: logging, monitoring, artifact storage
• Security/audit account: CloudTrail aggregation, GuardDuty
• Network account: Transit Gateway, shared VPCs

**Why Separate Accounts:**
• Blast radius isolation (prod issue can't touch dev billing)
• IAM permission boundaries per account
• Simpler compliance auditing
• Cost allocation per environment

**Cross-Account Patterns I Used:**

**1. S3 Cross-Account Access:**
Bucket policy on shared artifacts S3 allows role assumption from prod account. CI/CD reads from shared, deploys to prod account.

**2. Cross-Account Role Assumption:**
Deployment pipeline in shared account assumes DeployRole in target account. Role has specific permissions scoped to what's needed (least privilege).

**3. AWS Glue Job Migration:**
Migrated Glue jobs between accounts by exporting job definitions via boto3, recreating with new IAM roles, validating data catalog connections, then cutting over.

**4. ECS Fargate Cross-Account:**
Task execution role in target account, ECR image sharing via resource policy, Secrets Manager cross-account access for database credentials.

**Networking:**
• Transit Gateway for hub-and-spoke VPC connectivity
• VPC peering for simple two-account scenarios
• PrivateLink for service exposure without VPC peering

**IAM Best Practices:**
• Role chaining limited to 2 hops max
• External ID for third-party role assumptions
• CloudTrail in every account, aggregated centrally`,
          tips: [
            'Discuss AWS Organizations and SCPs',
            'Know role chaining limits (1 hour session)',
            'Mention landing zone concepts (Control Tower)',
            'Draw account structure diagram if asked'
          ]
        },
        {
          id: 'aws5',
          level: 'Senior',
          q: 'How do you handle AWS networking for microservices — VPCs, load balancers, and service discovery?',
          a: `**Network Architecture I Built:**

**VPC Design:**
• /16 CIDR for flexibility
• Public subnets: NAT Gateways, NLBs
• Private subnets: EKS nodes, EC2, internal ALBs
• Data subnets: RDS, ElastiCache (no outbound internet)
• One VPC per environment, peered via Transit Gateway

**Load Balancer Strategy:**

**Public NLB (Layer 4):**
• Static IPs for firewall whitelisting (pharma requirement)
• TLS passthrough to ALB
• Used for external-facing APIs

**Internal ALB (Layer 7):**
• Path-based and host-based routing
• Target group per microservice
• Health checks per service
• WAF integration for external ALB

**AWS Load Balancer Controller on EKS:**
• Ingress annotations provision ALBs automatically
• One ALB per Ingress class (shared for cost efficiency)
• Target type: IP mode (pod-level targeting, no NodePort)

**Service Discovery:**

**Within EKS:**
• Kubernetes DNS (CoreDNS) for service-to-service
• service.namespace.svc.cluster.local pattern
• Headless services for StatefulSets

**Cross-VPC / Cross-Account:**
• Route 53 private hosted zones
• AWS Cloud Map for ECS service discovery
• PrivateLink for exposing services without full VPC peering

**Reverse Proxy Architecture:**
• NGINX reverse proxy inside private subnet
• Routes external traffic to internal microservices
• SSL termination and header injection
• Used for legacy services not yet on EKS

**My Specific Implementation:**
Public NLB → Internal ALB → EKS Ingress → Service → Pod
Each hop with health checks and logging.`,
          tips: [
            'Know ALB vs NLB use cases cold',
            'Explain IP mode vs instance mode for EKS',
            'Discuss Service mesh consideration (Istio)',
            'Mention DNS TTL and caching issues'
          ]
        },
        {
          id: 'aws6',
          level: 'Mid-Senior',
          q: 'How do you design AWS IAM for a large organization?',
          a: `**IAM Design Principles:**

• Least privilege: minimum permissions needed
• No long-lived credentials: roles everywhere, no IAM users
• Centralized governance: SCPs at org level
• Auditability: CloudTrail for every API call

**Structure I Implement:**

**Human Access:**
• AWS SSO (IAM Identity Center) with SAML federation
• AD groups map to permission sets
• Roles: ReadOnly, Developer, DevOps, Admin per account
• No individual IAM users for humans

**Machine/Service Access:**
• EC2: Instance profiles
• EKS: IRSA (IAM Roles for Service Accounts)
• Lambda: Execution roles
• GitHub Actions: OIDC provider (no static keys)
• Cross-account: Role assumption with ExternalID

**OIDC for GitHub Actions (My Implementation):**
GitHub Actions assumes AWS role via OIDC token. Trust policy restricts to specific repo and branch. Role has scoped permissions (ECR push, EKS deploy only). Session duration limited to 1 hour.

**Permission Boundaries:**
• Applied to delegated admin roles
• Prevent privilege escalation even if role is compromised
• Developers can create roles but not exceed boundary

**SCPs (Service Control Policies) at Org Level:**
• Deny all activity outside approved regions
• Deny disabling CloudTrail
• Deny creating IAM users in prod accounts
• Deny public S3 buckets org-wide

**Audit & Compliance:**
• CloudTrail in every account (aggregated to S3)
• IAM Access Analyzer for external access detection
• Quarterly access reviews
• Alert on root account usage`,
          tips: [
            'Know OIDC vs access keys difference deeply',
            'Explain IRSA vs kube2iam difference',
            'Discuss SCPs vs IAM policies',
            'Mention IAM Access Analyzer use cases'
          ]
        },
        {
          id: 'aws7',
          level: 'Senior',
          q: 'Describe your experience with AWS migrations — on-prem to cloud.',
          a: `**Migration Experience at Enterprise Pharma:**

Led multiple migration tracks simultaneously.

**Migration 1: Monolith EC2 to EKS Microservices**

Assessment: Application dependency mapping, traffic analysis, service boundary identification.
Strategy: Strangler fig pattern — new features as microservices, legacy runs in parallel.
Execution: Containerized services using Docker, built Helm charts, deployed to EKS, gradually shifted traffic via ALB weighted target groups.
Result: Improved scalability, reduced operational overhead, 30% cost reduction.

**Migration 2: JFrog Artifactory On-Prem to Cloud**

Challenge: Zero-downtime required, 500GB+ of artifacts, CI/CD pipelines depend on it.
Approach: Set up cloud instance, replicated artifacts, updated pipeline configs gradually, cutover during maintenance window, validated checksums, decommissioned on-prem.
Result: Zero data loss, improved retrieval speeds, eliminated on-prem server maintenance.

**Migration 3: Atlassian Jira to Atlassian Cloud**

Challenge: Custom scripts, integrations, historical data.
Approach: Used Atlassian migration assistant, tested in staging, migrated user data, validated workflows and integrations, trained teams.
Result: Seamless cutover, improved performance, automatic updates going forward.

**Migration 4: ECS Fargate Cross-Account**

Challenge: Preserve IAM policies, data integrity, service continuity.
Approach: Infrastructure-as-code (Terraform) to recreate in target account, data migration via S3 sync, blue-green cutover at Route 53 level.

**Migration Framework I Follow:**
• Assess: Dependencies, risks, data volumes
• Plan: Strategy (rehost/refactor/replatform), timeline, rollback
• Migrate: Phased, with parallel running
• Validate: Functional, performance, security
• Cutover: DNS/traffic switch, monitoring spike
• Decommission: After validation period`,
          tips: [
            'Know the 6 Rs of migration (rehost, replatform, refactor...)',
            'Discuss how you handle zero-downtime requirements',
            'Mention AWS Migration Hub and tooling',
            'Be specific about validation steps'
          ]
        },
        {
          id: 'aws8',
          level: 'Senior',
          q: 'How do you implement AWS Lambda and serverless for platform engineering?',
          a: `**When Lambda Makes Sense:**

Not everything needs a server. Lambda is ideal for: event-driven processing, scheduled jobs, lightweight glue logic, and infrequent workloads.

**My Lambda Use Cases at Enterprise Pharma:**

• Scheduled compliance checks (CloudWatch Events → Lambda → Slack alert)
• S3 event processing (file upload triggers downstream pipeline)
• SNS/SQS consumers (async event handlers)
• Custom CloudWatch metric publishing
• AWS Glue job orchestration (trigger, monitor, retry)

**Lambda Architecture Pattern:**

EventBridge rule (cron) → Lambda function → publishes result to SNS → consumers react.

S3 PutObject event → Lambda → validate file → write to RDS → notify via SQS.

**Performance Configuration:**

Memory: 128MB to 10GB. CPU scales linearly with memory. For compute-heavy tasks, increase memory even if you don't need RAM — you get more CPU.

Timeout: set realistic (not 15 min for a 5-second function). Cost is duration × memory.

Provisioned Concurrency: eliminates cold starts for latency-sensitive functions. Set for APIs, not batch jobs.

**Cold Start Mitigation:**
• Keep deployment package small (< 50MB)
• Use arm64 (Graviton2) runtime — faster + cheaper
• Avoid heavy initialization in global scope (lazy-load)
• Provisioned Concurrency for critical paths

**Secrets Management in Lambda:**

Never in environment variables. Two options:
• Vault Lambda Extension: Vault sidecar extension fetches secrets at runtime
• AWS Secrets Manager with caching: boto3 client with local TTL cache (avoid per-invocation API calls)

**Terraform for Lambda:**

aws_lambda_function with runtime python3.12, handler, IAM role, S3 code source, VPC config for private subnet access, environment variables (non-sensitive only), reserved_concurrent_executions to cap scaling.

**Observability:**
• Lambda Insights: enhanced metrics (init duration, memory used, cold starts)
• X-Ray: distributed tracing with upstream correlation
• Structured JSON logging to CloudWatch
• Custom metrics via CloudWatch PutMetricData

**Cost:**
1M requests + 400,000 GB-seconds free per month. Extremely cost-effective for infrequent workloads. Monitor with Cost Explorer by Lambda function tag.`,
          tips: [
            'Know cold start causes and mitigation strategies',
            'Discuss concurrency limits and reserved vs provisioned concurrency',
            'Mention Lambda Powertools library for Python/Java',
            'Talk about when Lambda is NOT the right choice (long-running, high-throughput)'
          ]
        },
        {
          id: 'aws9',
          level: 'Senior',
          q: 'How do you design event-driven architectures using SQS and SNS?',
          a: `**Core Concepts:**

**SNS:** Fan-out. One publish → multiple subscribers. Push-based. Good for notifications and broadcast events.

**SQS:** Queue. One message → one consumer. Pull-based. Good for task queues, decoupling, load leveling, retry logic.

**SNS + SQS Fan-Out Pattern:**

Event producer publishes to SNS topic. SNS fans out to multiple SQS queues. Each consumer reads its own queue independently at its own pace.

Benefits: consumers decouple from each other, message not lost if consumer is temporarily down, each consumer has independent retry policy.

**My Implementation at Enterprise Pharma:**

Glue ETL job completes → SNS topic → three SQS queues:
• Downstream data processing service
• Audit logging Lambda
• Slack notification Lambda

All three consumers decoupled, process at their own speed.

**Queue Types:**

Standard: at-least-once delivery (design consumers for idempotency), best-effort ordering, massive throughput.

FIFO: exactly-once processing, strict ordering per message group, 3,000 messages/second max. Use for: financial transactions, ordered workflows.

**Dead Letter Queues (DLQ) — Always Configure:**

After maxReceiveCount failures, message moves to DLQ. CloudWatch alarm on DLQ message count. Investigate and fix root cause. Redrive messages back to main queue after fix.

Never skip DLQ — silent message loss is worse than a filled DLQ.

**Terraform Setup:**

aws_sqs_queue main queue with visibility_timeout_seconds, message_retention_seconds, redrive_policy pointing to DLQ ARN with max receive count. aws_sqs_queue DLQ. aws_sns_topic. aws_sns_topic_subscription for each SQS endpoint. SQS queue policy allowing SNS principal to send messages.

**EventBridge vs SNS:**

EventBridge: content-based routing, schema registry, 90+ AWS service integrations, event replay. Better for complex routing.
SNS: simpler, lower latency, good for straightforward fan-out.

**Monitoring:**
• ApproximateNumberOfMessagesVisible: queue depth (alert if growing)
• ApproximateAgeOfOldestMessage: processing lag indicator
• NumberOfMessagesSent/Deleted: throughput
• DLQ count: consumer error rate`,
          tips: [
            'Know SNS vs SQS vs EventBridge use cases clearly',
            'Always discuss DLQ — interviewers expect it',
            'Mention idempotency requirement for standard queue consumers',
            'Talk about FIFO vs standard trade-offs (throughput vs ordering)'
          ]
        },
        {
          id: 'aws10',
          level: 'Senior',
          q: 'How do you implement AWS CloudWatch for monitoring and alerting at scale?',
          a: `**CloudWatch Components I Use:**

Metrics, Logs, Alarms, Dashboards, Logs Insights, Synthetics Canaries, Contributor Insights.

**Custom Metrics from Applications:**

boto3 client.put_metric_data with namespace, MetricName, Dimensions (service + environment), Value, Unit. Published on key application events — request count, processing time, error count.

Avoid high-cardinality dimensions (per-user metrics = millions of metrics = expensive). Use aggregated dimensions instead.

**Log Groups and Retention:**

Every service gets a dedicated log group. Retention explicitly set — CloudWatch logs are expensive if retained forever.
• Application logs: 30 days
• Audit/compliance logs: 1 year (S3 archival after 30 days)
• Lambda logs: 14 days

**Metric Filters — Logs to Metrics:**

Extract metrics from log patterns without code changes. Filter pattern on ERROR keyword in log group, publish count to custom namespace with service dimension. Cost-effective way to get error rate metrics.

**Alarm Patterns:**

Standard threshold alarm: API error rate > 1% for 5 minutes → SNS → PagerDuty P1 + Slack.

Anomaly Detection alarm: uses ML baseline — alerts when metric falls outside expected band. Good for metrics with natural variance (traffic patterns, queue depth).

Composite alarms: combine multiple alarms with AND/OR logic. Alert only when both high error rate AND high latency — reduces noise.

**CloudWatch Synthetics (Canaries):**

Node.js or Python scripts that run on schedule (every 1-5 minutes). Simulate user actions: load URL, verify content, check API response. Alert immediately if canary fails — before users notice.

**Dashboards as Code:**

Terraform aws_cloudwatch_dashboard with JSON widget definitions. Version-controlled, consistent between environments. Automatic dashboard for every new service via platform Helm chart.

**Logs Insights Queries I Use:**

Error rate by service over time. Top 10 slowest API endpoints. Requests by IP (detect anomalies). Lambda cold start frequency.

**Cost Optimization:**
• Custom metrics: $0.30/metric/month — minimize cardinality
• Logs: $0.50/GB ingested — filter at Fluent Bit before sending
• High-resolution metrics (1-second): 3x cost vs standard — use only when needed`,
          tips: [
            'Know CloudWatch Logs Insights query syntax',
            'Discuss composite alarms to reduce alert noise',
            'Mention metric filters as log-to-metric bridge',
            'Talk about CloudWatch cost control — it adds up at scale'
          ]
        },
        {
          id: 'aws11',
          level: 'Senior',
          q: 'How do you implement and manage AWS ECS Fargate?',
          a: `**ECS vs EKS Decision:**

Choose ECS when: team lacks Kubernetes expertise, simpler workloads, AWS-native tooling preferred, Fargate serverless compute desired.

Choose EKS when: Kubernetes expertise exists, complex scheduling needs, rich ecosystem (Helm, operators), portability matters.

**ECS Fargate Advantages:**

No node management: no AMI patching, no node upgrades, no capacity planning.
Pay per task second: cost-efficient for variable or batch workloads.
Tight AWS integration: IAM task roles, Service Connect, native logging.

**My ECS Fargate Experience:**

Cross-account ECS migration at Enterprise Pharma: moved Fargate tasks and AWS Glue orchestration services from account A to account B with zero data loss.

Process:
1. Export task definitions via CLI (aws ecs describe-task-definition)
2. Update all ARNs (IAM roles, ECR image URIs, Secrets Manager ARNs) to new account
3. Terraform apply in new account to create clusters, task defs, services
4. Validate: tasks launch, reach healthy state, process correctly
5. Update EventBridge schedules pointing to new cluster
6. Decommission old account tasks after validation period

**Task Definition (Terraform):**

aws_ecs_task_definition with network_mode awsvpc, cpu/memory allocation, execution role (ECR pull + CloudWatch), task role (app permissions), container definitions JSON with image, portMappings, environment (non-sensitive), secrets from Secrets Manager by ARN, logConfiguration to CloudWatch.

**Networking:**

awsvpc mode: each task gets its own ENI and private IP in VPC. Security group per task (not per host). Tasks in private subnets, NAT Gateway for outbound internet.

**Service Auto Scaling:**

Application Auto Scaling on ECS service desired count. Target tracking policy on CPU at 70% target. Min 1 task, max 20 tasks. Scale-out fast, scale-in with 5-minute cooldown.

**Fargate Spot:**

70-80% cost reduction vs standard Fargate. Suitable for: batch jobs, non-critical async workers. Not for: customer-facing APIs (interruption risk). Use with Fargate Spot + standard mix.`,
          tips: [
            'Connect to your cross-account ECS migration experience',
            'Know awsvpc networking mode and its security benefits',
            'Discuss Fargate Spot for cost optimization',
            'Talk about when ECS vs EKS is the right call'
          ]
        },
        {
          id: 'aws12',
          level: 'Senior',
          q: 'How do you manage S3 security, lifecycle, and cost optimization?',
          a: `**S3 Use Cases at Enterprise Pharma:**

CI/CD artifact storage, Terraform state, log archival (CloudTrail, VPC Flow Logs), Glue ETL input/output, compliance evidence (immutable), static internal tooling assets.

**Security Baseline (Every Bucket):**

Terraform aws_s3_bucket_public_access_block: block_public_acls, block_public_policy, ignore_public_acls, restrict_public_buckets — all true. No exceptions.

aws_s3_bucket_server_side_encryption_configuration: AES-256 default or KMS for sensitive data.

aws_s3_bucket_versioning: enabled. Protects against accidental deletion.

Bucket policy: deny non-HTTPS access using aws:SecureTransport condition.

**Object Lock for Compliance:**

Compliance evidence bucket with Object Lock in GOVERNANCE mode. Retention period 7 years. Even account admin cannot delete before retention expires. Used for audit artifacts, CloudTrail logs, deployment evidence packages.

**Lifecycle Policies — Cost Control:**

Artifacts bucket lifecycle: standard storage for 30 days → S3 Infrequent Access after 30 days → Glacier Instant Retrieval after 90 days → delete after 1 year. Reduces storage cost by 60-70%.

S3 Intelligent-Tiering: for uncertain access patterns. Auto-moves objects between tiers based on 30-day access patterns. Zero retrieval fee. Best for artifact buckets.

**Cross-Region Replication:**

Compliance bucket replicated to DR region automatically. Replication rule targeting all objects. Destination bucket with same KMS encryption. Used for: DR, compliance requirement for geo-redundancy.

**S3 Event Notifications:**

s3:ObjectCreated:* → SQS or Lambda. Used for: trigger processing pipeline on file upload, compliance alert on unexpected writes, Glue job trigger on new data file.

**VPC Endpoint for S3:**

Gateway endpoint (free) in VPC route table. EKS nodes and EC2 instances access S3 without going through NAT Gateway. Significant cost saving for ECR layer pulls (stored in S3 behind the scenes).

**S3 Storage Lens:**

Organization-wide S3 usage analytics. Identifies: largest buckets, lowest-access data, replication health, object count trends. Monthly review to find optimization opportunities.`,
          tips: [
            'Know S3 storage classes and transition costs',
            'Discuss Object Lock as compliance requirement (immutable evidence)',
            'Mention Gateway Endpoint as free cost-saving for S3 in VPC',
            'Talk about lifecycle policies as mandatory cost control'
          ]
        },
        {
          id: 'aws13',
          level: 'Senior',
          q: 'How do you implement AWS GuardDuty, Security Hub, and Config for security posture?',
          a: `**Three Tools, Three Purposes:**

**GuardDuty:** Threat detection — finds active threats using ML on logs.
**Security Hub:** Aggregation — unified view of findings from all security tools.
**Config:** Compliance — continuous configuration compliance checking.

**GuardDuty Setup:**

Enabled organization-wide (delegated admin in security account).
Analyzes: VPC Flow Logs, CloudTrail, DNS logs, EKS audit logs, S3 data events, Lambda network activity.

Finding types I've seen:
• UnauthorizedAccess:EC2/SSHBruteForce
• CryptoCurrency:EC2/BitcoinTool (crypto mining on EC2)
• CredentialAccess:IAMUser/AnomalousBehavior
• Discovery:S3/MaliciousIPCaller

**Automated Response (EventBridge + Lambda):**

GuardDuty CRITICAL finding → EventBridge → response Lambda:
• CryptoMining detected: quarantine security group applied, instance snapshot, Slack P1 alert
• Compromised credentials: revoke active IAM sessions, alert security team

**AWS Config Rules:**

Continuous compliance checking. Key rules enabled:
• s3-bucket-public-read-prohibited
• encrypted-volumes (EBS encryption)
• rds-storage-encrypted
• iam-root-access-key-check
• restricted-ssh (no 0.0.0.0/0 on port 22)
• required-tags (mandatory tagging)
• cloudtrail-enabled
• vpc-flow-logs-enabled

Custom Lambda-backed rule: check EKS cluster is not on deprecated Kubernetes version.

**Config Aggregator:**

In security account: aggregates compliance data from all accounts. Single view of org-wide compliance. Reports: non-compliant resources by account, resource type, rule.

**Security Hub:**

Aggregates findings from: GuardDuty, Inspector, Macie, Config, IAM Access Analyzer.
Standards enabled: AWS Foundational Security Best Practices, CIS AWS Foundations Benchmark.
Security score tracked over time (target > 90%).

Workflow: new HIGH/CRITICAL finding → EventBridge → SNS → PagerDuty. MEDIUM finding → Jira ticket auto-created.

**Weekly Security Review:**

Review Security Hub dashboard: new findings, score delta, top failing controls. Prioritize remediation by severity and blast radius. Track compliance improvement trend month-over-month.`,
          tips: [
            'Know GuardDuty vs Config vs Security Hub — different purposes',
            'Discuss automated response via EventBridge + Lambda',
            'Mention Security Hub compliance standards scoring',
            'Talk about Config aggregator for multi-account visibility'
          ]
        },
        {
          id: 'aws14',
          level: 'Senior',
          q: 'How do you implement AWS IAM best practices at scale?',
          a: `**IAM Principles I Follow:**

Least privilege. No long-lived credentials. No IAM users in production. Everything via roles.

**No IAM Users in Production:**

SCP at org level: deny iam:CreateUser in all production accounts. Humans access via AWS SSO (IAM Identity Center) + federated roles with short-lived sessions (8 hours).

CI/CD access via OIDC (GitHub Actions) or IRSA (EKS pods) — no static access keys ever.

**IAM Roles Structure:**

Human roles (via SSO permission sets):
• ReadOnly: describe/list everything — for developers in production
• Developer: full access in dev/staging, limited in prod
• DevOps: broader access, can modify infrastructure
• Admin: break-glass only, MFA required, session recorded

Service roles (workload identity):
• EKS pod role (via IRSA): scoped to specific service needs
• ECS task execution role: ECR pull + CloudWatch logs only
• ECS task role: app-specific permissions (S3 read, SQS consume)
• Lambda role: specific resource access only
• GitHub Actions role (via OIDC): deploy permissions scoped to specific repo/branch

**IRSA (IAM Roles for Service Accounts):**

EKS OIDC provider created. IAM role trust policy: condition on Kubernetes service account name and namespace. Pod uses service account → automatically gets IAM credentials via metadata service. No credential files, no secret rotation.

**Permission Boundaries:**

Applied to all developer-created roles. Boundary allows core services but denies IAM wildcard and Organizations actions. Prevents privilege escalation even with iam:PassRole.

**Access Analyzer:**

IAM Access Analyzer identifies: external access to S3/KMS/Lambda/SQS (should these be public?), unused permissions (trim what's not used), cross-account access paths.

Monthly review of Access Analyzer findings. Findings remediated within 30 days.

**Credential Hygiene:**

CloudTrail alert on new access key creation.
Quarterly access review: unused roles/policies flagged and removed.
Access key rotation enforced via Config rule: iam-user-unused-credentials-check (alert if key > 90 days old).

**SCP Guardrails:**

At org root: deny disabling CloudTrail, deny leaving org, deny creating root access keys. At prod OU: deny IAM user creation, deny disabling GuardDuty, deny public S3.`,
          tips: [
            'Know IRSA setup step by step (OIDC provider → role trust → service account annotation)',
            'Discuss permission boundaries as privilege escalation defense',
            'Mention IAM Access Analyzer for unused permissions',
            'Talk about SCP as org-level last line of defense'
          ]
        },
        {
          id: 'aws15',
          level: 'Senior',
          q: 'How do you implement AWS Route 53 and load balancing for high availability?',
          a: `**Route 53 Routing Policies:**

Simple: one record, one value. Basic use.

Weighted: split traffic between multiple targets by weight. Use for: canary deployments (10% to new version), A/B testing, gradual blue-green cutover.

Latency-based: route user to lowest-latency AWS region automatically. Use for: multi-region active-active. No configuration needed — Route 53 measures latency to each region.

Failover: primary + secondary. Health check determines primary status. If primary fails health check → automatically route to secondary. TTL 60 seconds for fast failover. Use for: DR, active-passive setups.

Geolocation: route by user geography. Use for: data residency (EU users → EU endpoint), content localization, regulatory requirements.

**Health Checks:**

HTTP/HTTPS check on endpoint every 10 seconds. Three consecutive failures = unhealthy. Integrated with failover routing — automatic DR switchover. CloudWatch alarm on health check failure (early warning before failover triggers).

**Private Hosted Zones:**

internal.company.com zone associated with VPCs. Service-to-service DNS: service-a.internal → internal ALB. No public exposure. Associated with all peered VPCs for cross-VPC resolution.

**Load Balancer Types:**

**ALB (Application Load Balancer):**
Layer 7 — HTTP/HTTPS aware. Path-based and host-based routing. Target groups: EC2, ECS tasks, EKS pods, Lambda. WAF integration. My default for web services and APIs.

**NLB (Network Load Balancer):**
Layer 4 — TCP/UDP. Static IPs (Elastic IPs). Ultra-low latency. Use for: non-HTTP protocols, static IP requirement (whitelisting), extreme throughput. Used at Enterprise Pharma for NLB → ALB pattern (NLB for static IPs, ALB for path routing).

**Architecture Pattern:**
Public NLB (static IPs, TLS passthrough) → Internal ALB (path routing, target groups) → EKS pods. Allows static IPs for partner whitelisting while keeping Layer 7 routing benefits.

**External DNS Controller (Kubernetes):**

Automatically creates Route 53 records from Kubernetes Ingress/Service annotations. No manual DNS management. External-dns controller watches Kubernetes resources, syncs to Route 53. Engineers add annotation: external-dns.alpha.kubernetes.io/hostname: api.company.com.`,
          tips: [
            'Know all routing policies and their specific use cases',
            'Discuss NLB vs ALB layer 4 vs layer 7 difference',
            'Mention External DNS controller for Kubernetes automation',
            'Talk about health check TTL interaction with failover speed'
          ]
        },
        {
          id: 'aws16',
          level: 'Senior',
          q: 'How do you implement AWS VPC networking for enterprise workloads?',
          a: `**VPC Design Principles:**

Private by default. Explicit public where needed. Defense in depth via security groups + NACLs. Scalable CIDR design for future growth.

**CIDR Planning:**

VPC: /16 (65,536 IPs). Gives room to grow.

Subnet tiers across 3 AZs:
• Public subnets: /24 per AZ — for NAT Gateways, public-facing NLBs
• Private subnets: /20 per AZ — for EKS nodes, EC2 instances (4,094 IPs each)
• Data subnets: /24 per AZ — for RDS, ElastiCache (isolated, no internet route)

**Secondary CIDR for EKS Pod IPs:**

EKS with VPC CNI gives each pod a real VPC IP. Dense clusters exhaust IPs quickly. Solution: secondary CIDR block (100.64.0.0/16) attached to VPC. VPC CNI configured to allocate pod IPs from this range. Separates pod IP space from node IP space.

**NAT Gateway:**

One NAT Gateway per AZ for HA (not one shared — single point of failure). Private subnet route: 0.0.0.0/0 → NAT Gateway in same AZ. Cost: ~$0.045/hour + $0.045/GB data processed. Significant cost driver — optimize by using VPC Endpoints for AWS services.

**VPC Endpoints:**

Gateway endpoints (free): S3, DynamoDB. Add to route tables — traffic stays in AWS backbone.

Interface endpoints (~$0.01/hour each): ECR (docker pulls), CloudWatch Logs, Secrets Manager, SSM, STS. EKS nodes pull images via ECR endpoint instead of NAT — major cost saving (ECR images = large data volumes).

**Security Groups:**

Stateful. Applied to ENIs (EC2, EKS pods, RDS). Layered:
• ALB SG: inbound 443 from 0.0.0.0/0
• EKS node SG: inbound only from ALB SG
• RDS SG: inbound port 5432 only from EKS node SG
• No 0.0.0.0/0 on any SG in private subnets

**Multi-VPC Connectivity:**

Transit Gateway for multiple VPCs (> 5). Hub-and-spoke topology. Separate route tables per environment (prod cannot reach dev). On-premises connectivity: Direct Connect or VPN attachment to TGW.

VPC Flow Logs: enabled on all VPCs. Delivered to S3. Athena queries for: traffic analysis, security investigations, NAT Gateway cost analysis.`,
          tips: [
            'Know secondary CIDR solution for EKS IP exhaustion',
            'Calculate NAT Gateway vs VPC Endpoint cost trade-off',
            'Discuss Transit Gateway route table isolation between environments',
            'Talk about VPC Flow Logs for security and cost investigation'
          ]
        },
        {
          id: 'aws17',
          level: 'Senior',
          q: 'How do you implement AWS cost optimization strategies?',
          a: `**Cost Optimization Pillars:**

Right-sizing, pricing model, architecture efficiency, waste elimination, visibility.

**Pricing Models:**

On-Demand: full price, maximum flexibility. Use for: unpredictable workloads, new services (size before committing).

Reserved Instances / Savings Plans:
• 1-year commitment: ~40% savings vs on-demand
• 3-year commitment: ~60% savings
• Compute Savings Plans: flexible across instance types/regions
• Use for: stable production EKS nodes, RDS, baseline EC2

Spot Instances: 70-90% savings, can be interrupted. Use for: CI/CD runners, batch jobs, stateless worker nodes.

**My Cost Reduction Results at Enterprise Pharma:**

• EKS node groups: mixed — reserved for baseline, spot for burst workers → 40% EC2 cost reduction
• CI/CD runners: spot instances → 70% runner cost reduction
• RDS: reserved 1-year for production databases → 40% DB cost reduction
• S3: lifecycle policies → 60% storage cost reduction
• ECR via VPC endpoint instead of NAT → eliminated ECR-related NAT data costs

**Right-Sizing:**

AWS Compute Optimizer: recommendations per EC2, EKS node, Lambda, ECS.
VPA (Kubernetes): pod request recommendations based on actual usage.
RDS: Performance Insights identifies over-provisioned instances.

Monthly right-sizing review: apply Compute Optimizer recommendations in dev, validate, promote to prod.

**Scheduled Scaling:**

Dev/staging EKS clusters: scale to 0 nodes evenings and weekends (Karpenter or scheduled scaling). Saves 60%+ on non-prod compute. EventBridge cron triggers scale-down at 7pm, scale-up at 7am Monday-Friday.

**Cost Visibility:**

Tag enforcement (team, service, environment, cost-center) → Cost Explorer grouping by tag → per-team spend dashboards in Grafana. Anomaly detection: CloudWatch alert when spend > 120% of 30-day average.

Kubecost for Kubernetes: per-namespace and per-deployment cost visible in Backstage developer portal.

**Waste Elimination:**

Weekly report: unattached EBS volumes, unused EIPs (elastic IPs), old AMIs, stopped instances > 7 days, unused Load Balancers. Auto-delete untagged resources after 7-day warning.`,
          tips: [
            'Know Savings Plans vs Reserved Instances difference',
            'Discuss Spot for CI/CD — restartable workloads',
            'Mention scheduled scaling as highest-ROI non-prod optimization',
            'Talk about visibility first — can\'t optimize what you can\'t see'
          ]
        },
        {
          id: 'aws18',
          level: 'Senior',
          q: 'How do you implement AWS CloudTrail and audit logging for compliance?',
          a: `**CloudTrail Purpose:**

Records every AWS API call — who, what, when, from where. Essential for security investigations, compliance audits, and change tracking.

**Organization-Wide Trail:**

One trail in management account covering all regions and all member accounts. Global service events enabled (IAM, STS). Logs delivered to S3 in dedicated audit account (separate from workload accounts).

Terraform: aws_cloudtrail with is_multi_region_trail true, include_global_service_events true, enable_log_file_validation true (tamper detection), S3 bucket in audit account, CloudWatch Logs group for real-time alerting, KMS encryption.

**Tamper-Proof Log Storage:**

S3 bucket in audit account. Object Lock: COMPLIANCE mode, 7-year retention. Even audit account root cannot delete before retention. Bucket policy: deny deletion to all principals. CloudTrail cannot delete its own logs.

**Real-Time Alerting via Metric Filters:**

CloudWatch Logs metric filter patterns on CloudTrail log group:
• Root account login → P1 alert, immediate response
• Console login without MFA → P2 alert
• IAM user created in production → P1 alert (violates SCP, investigate)
• CloudTrail stopped or modified → P1 alert, automated re-enable
• New access key created → P2 alert, review within 24 hours
• Security group modified in production → P2 alert
• Unauthorized API calls (403 errors) → investigate for recon activity

**CloudTrail Lake:**

SQL queries on event history without Athena setup. Example: find all iam:AssumeRole actions for a specific role in last 30 days. Useful for incident investigation.

**Athena for Historical Queries:**

Partition CloudTrail S3 logs by account/region/date. Athena table created over S3. Query: all S3 DeleteObject calls in last 90 days, who deleted what and when. Cost-effective for historical queries (pay per scan).

**Compliance Evidence:**

Auditors ask: "who made this change on this date?" CloudTrail provides exact answer: event time, userIdentity (IAM role/user), sourceIPAddress, requestParameters, responseElements. Significantly reduces manual audit preparation time.`,
          tips: [
            'Know CloudTrail vs Config difference (API calls vs configuration state)',
            'Discuss tamper-proof storage in separate audit account',
            'Mention CloudTrail Lake for SQL queries on event history',
            'Talk about real-time alerting as the operational value of CloudTrail'
          ]
        },
        {
          id: 'aws19',
          level: 'Senior',
          q: 'How do you implement AWS Organizations and multi-account strategy?',
          a: `**Why Multi-Account:**

Blast radius isolation, billing clarity, permission boundaries per environment, compliance separation, independent security controls.

**Organization Structure I Design:**

Root
→ Management OU: management account (billing only, no workloads)
→ Security OU: security/audit account, log archive account
→ Infrastructure OU: network account (TGW, DNS), shared services account (Vault, monitoring)
→ Workloads OU
  → Production OU: prod account(s)
  → Non-Production OU: dev account, staging account
→ Sandbox OU: developer sandbox accounts (loose guardrails)

**Service Control Policies (SCPs):**

Root level (all accounts):
• Deny leaving organization
• Deny disabling CloudTrail
• Deny disabling Config
• Deny modifying audit S3 bucket

Production OU:
• Deny creating IAM users (SSO roles only)
• Deny public S3 buckets
• Deny resources outside approved regions (us-east-1, us-west-2)

Non-Production OU:
• Deny resources outside approved regions
• Deny production-scale instance types (no r5.16xlarge in dev)

Sandbox OU:
• Monthly spend limit ($200) via budget action
• Deny cross-account actions

**AWS IAM Identity Center (SSO):**

Central identity management. AD/Okta integration — corporate users and groups. Permission sets (IAM role templates) assigned per account per group.

ReadOnly set → all accounts (developers get prod read access)
DevOps set → dev/staging (full access)
Admin set → break-glass, MFA required, session logged

**Account Vending Machine:**

Request in ServiceNow → approval → Lambda + Terraform → new account created, baseline applied, SSO configured, team notified. Fully automated: < 30 minutes from approval to usable account.

Baseline Terraform per account: VPC, CloudTrail, Config, GuardDuty, Security Hub, IAM baseline roles, budget alerts.

**Control Tower vs Custom:**

Control Tower: opinionated landing zone, Account Factory for new accounts, pre-built guardrails. Good for: greenfield, less customization needed.

Custom landing zone: more control, more maintenance. Good for: complex existing environments, specific compliance requirements.

My experience: custom landing zone at Enterprise Pharma (existing accounts, specific pharma compliance controls).`,
          tips: [
            'Know SCP deny-by-default behavior (they are not allow-lists by themselves)',
            'Discuss OU structure as reflection of business/risk boundaries',
            'Mention account vending machine for scalable account creation',
            'Talk about Control Tower vs custom — when each makes sense'
          ]
        },
        {
          id: 'aws20',
          level: 'Senior',
          q: 'How do you implement AWS RDS for production database workloads?',
          a: `**RDS Configuration for Production:**

Multi-AZ: synchronous replication to standby in another AZ. Automatic failover in < 1 minute on primary failure. Non-negotiable for production.

Storage: gp3 (SSD) for most workloads. io2 for high-IOPS databases. Auto-scaling storage enabled (no manual intervention when growing).

Encryption: KMS at rest for all production databases. In-transit: SSL enforced via parameter group (rds.force_ssl = 1).

Backup: automated daily snapshots, 7-day retention. Point-In-Time Recovery (PITR) down to 5-minute granularity. Manual snapshot before every major change.

**Terraform Configuration:**

aws_db_instance with engine postgres, engine_version pinned, instance_class, allocated_storage with max_allocated_storage for autoscaling, multi_az true, storage_encrypted true, kms_key_id, backup_retention_period 7, performance_insights_enabled true, enabled_cloudwatch_logs_exports (postgresql, upgrade), deletion_protection true, db_subnet_group_name (data-only subnets), vpc_security_group_ids (restricted to app tier), final_snapshot_identifier.

**Read Replicas:**

Separate aws_db_instance with replicate_source_db. Different AZ from primary. Used for: reporting queries, analytics, read-heavy application tier. Can be promoted to standalone in DR scenario.

**Parameter Groups:**

Custom parameter group for tuning:
• log_min_duration_statement: 500ms (log slow queries)
• shared_preload_libraries: pg_stat_statements (query statistics)
• max_connections: tuned per instance class
• work_mem, shared_buffers: performance tuning

**Performance Insights:**

Enabled on all production RDS. DB Load visualization by SQL, wait event, host. Identifies top SQL statements by load. Integrated with CloudWatch for alerting on high DB load.

**Secrets Management:**

Password via random_password Terraform resource → stored in Vault → app reads from Vault. Never hardcoded, never in Terraform state unencrypted (sensitive = true). Rotation: Vault dynamic secrets for DB engine (unique credentials per service).

**Upgrade Strategy:**

Minor version: apply during maintenance window (auto-apply enabled).
Major version: test in dev, staging, then prod. Blue-green deployment for zero-downtime major upgrade via RDS Blue/Green feature.`,
          tips: [
            'Know RDS Multi-AZ vs Read Replica difference (HA vs scale)',
            'Discuss deletion_protection and final_snapshot as safety nets',
            'Mention Performance Insights for production query monitoring',
            'Talk about RDS Blue/Green deployments for zero-downtime major upgrades'
          ]
        }
      ]
    },
    devsecops: {
      title: 'DevSecOps & Compliance',
      icon: '🔐',
      questions: [
        {
          id: 'sec1',
          level: 'Senior',
          q: 'How do you implement DevSecOps in a regulated industry like pharma?',
          a: `**Pharma Context (Enterprise Pharma):**

GxP compliance requirements, audit trails, change control — security can't be bolted on, it must be built in.

**Shift-Left Security Strategy:**

**1. Pre-Commit (Developer Workstation):**
• Pre-commit hooks: secrets scanning (detect-secrets, gitleaks)
• SAST linting (semgrep rules for common vulnerabilities)
• Dependency vulnerability check (safety for Python, npm audit)

**2. CI Pipeline — Every PR:**
• SAST: Semgrep, CodeQL for code analysis
• Dependency scanning: Snyk or Dependabot alerts
• Container scanning: Trivy on every Docker image
• IaC scanning: Checkov for Terraform misconfigurations
• License compliance: Approved licenses only

**3. Container Registry:**
• Images scanned on push (ECR Inspector or Trivy)
• Only signed images promoted to staging/prod
• Base image policy: approved, patched base images only
• Automated rebuild when base image has CVEs

**4. Runtime Security:**
• Kubernetes Pod Security Standards (restricted profile)
• Falco for runtime anomaly detection
• Network policies: default deny
• No privileged containers in prod

**5. Secrets Management:**
• HashiCorp Vault: zero static credentials in code
• GitHub OIDC: dynamic AWS credentials per pipeline run
• Vault audit logs: every secret access logged
• Quarterly secret rotation automated

**Compliance Automation:**
• Automated evidence collection for audits
• Policy-as-code (Kyverno) enforces controls
• Change management tied to Jira tickets
• Immutable audit trail in CloudTrail + S3

**Results:**
• Zero critical CVEs reaching production
• Audit prep time reduced from 2 weeks to 2 days
• 100% secret rotation compliance`,
          tips: [
            'Know the difference between SAST, DAST, SCA',
            'Discuss GxP/SOX compliance if applicable',
            'Mention supply chain security (SBOM, Sigstore)',
            'Show how security enables vs blocks teams'
          ]
        },
        {
          id: 'sec2',
          level: 'Senior',
          q: 'How do you manage secrets across a large platform — rotation, access, and auditing?',
          a: `**Secrets Architecture: HashiCorp Vault**

**Secret Engines Used:**

**KV v2 (Static Secrets):**
• API keys, third-party tokens
• Versioned (can roll back)
• Per-environment paths: secret/prod/service-name/config

**AWS Secrets Engine (Dynamic):**
• Generates temporary IAM credentials on demand
• TTL of 15 minutes for CI/CD
• No long-lived AWS access keys anywhere

**Database Secrets Engine:**
• Vault creates PostgreSQL credentials dynamically
• Unique username per application instance
• Auto-revoked on lease expiry
• Eliminates shared DB passwords

**PKI Engine:**
• Internal certificate authority
• Short-lived certs for service-to-service mTLS
• Automatic renewal before expiry

**Access Control:**

**AppRoles for services:** Role + SecretID pattern for applications that can't use OIDC.
**OIDC for CI/CD:** GitHub Actions, no credentials stored.
**Kubernetes Auth:** Pod gets Vault token via service account JWT.
**Human Access:** Vault integrated with SSO, MFA required.

**Rotation Strategy:**
• Dynamic secrets: rotation is implicit (new cred each time)
• Static secrets: scheduled rotation via Vault agent
• Certificates: automated renewal at 80% lifetime
• Root credentials: manual quarterly rotation with approval workflow

**Audit & Compliance:**
• Vault audit log: every read/write/auth event
• Logs forwarded to SIEM
• Alerts on unusual access patterns
• Quarterly access review: revoke stale AppRoles

**Emergency Access:**
• Break-glass procedure documented
• Dual-approval for emergency vault admin
• Access logged and reviewed post-incident`,
          tips: [
            'Know Vault auth methods: AppRole, OIDC, K8s, AWS',
            'Explain dynamic vs static secrets trade-offs',
            'Discuss lease renewal and revocation',
            'Mention Vault HA setup for production'
          ]
        },
        {
          id: 'sec3',
          level: 'Senior',
          q: 'How do you implement container security across build, registry, and runtime?',
          a: `**Container Security Lifecycle:**

**Build-Time Security:**

**Dockerfile Best Practices Enforced:**
• Non-root user mandatory (USER 1000)
• Read-only root filesystem where possible
• Minimal base images (distroless, alpine)
• No secrets in ENV or ARG instructions
• Multi-stage builds to exclude build tools
• Hadolint in CI for Dockerfile linting

**Image Scanning in CI:**
Trivy scans image after build. Pipeline fails on CRITICAL vulnerabilities. HIGH vulnerabilities create Jira tickets for tracking. Results uploaded to S3 for audit trail.

**Registry Security (ECR):**
• ECR scanning on push (Inspector v2)
• Image tag immutability (no overwriting latest)
• Lifecycle policies: delete untagged images after 30 days
• Private registry only, no Docker Hub in prod
• Cross-account pull via resource policies

**Runtime Security (EKS):**

**Pod Security Standards:**
Namespace labeled with restricted enforce policy, blocking privileged pods.

**Security Context Enforced by Platform:**
runAsNonRoot, readOnlyRootFilesystem, drop ALL capabilities, no privilege escalation.

**Falco for Runtime Detection:**
Alerts on: shell spawned in container, sensitive file access, unexpected network connection, privilege escalation attempt.

**Supply Chain Security:**
• Cosign image signing: images signed after scan passes
• Admission controller verifies signature before deploy
• SBOM generated per image (syft)
• SBOM stored in artifact registry for compliance

**Results:**
• Zero privileged containers in production
• All prod images signed and verified
• CVE to patch time: 72 hours for critical`,
          tips: [
            'Know distroless vs Alpine trade-offs',
            'Discuss image signing (Sigstore/Cosign)',
            'Mention SBOM requirements (executive order)',
            'Know Falco rules and alerting'
          ]
        },
        {
          id: 'sec4',
          level: 'Senior',
          q: 'How do you implement compliance automation and audit readiness?',
          a: `**Compliance Context:**

At Enterprise Pharma (pharma), SOX and GxP controls required evidence collection, change traceability, and access reviews.

**Compliance as Code Framework:**

**1. Policy Enforcement (Preventive):**

Kyverno ClusterPolicy requires change-ticket label on all Deployments in production namespace. Blocks deployments without Jira ticket reference.

OPA/Conftest Terraform policy: deny S3 buckets without versioning, enforce encryption, require approved regions.

**2. Automated Evidence Collection:**

**For every deployment to prod:**
• GitHub Actions captures: who deployed, what changed, which PR, ticket reference, test results
• Evidence package stored in S3 with immutable retention
• Linked to change request in ServiceNow

**3. Audit Trail Sources:**
• CloudTrail: all AWS API calls, immutable S3 with object lock
• Vault audit log: all secret access
• Kubernetes audit log: all API server actions
• GitHub: PR history, approval records, merge events
• Jira/ServiceNow: change tickets, approvals

**4. Access Reviews:**
• Quarterly automated report: who has access to what
• IAM Access Analyzer: flags external access
• Vault: unused AppRoles flagged for removal
• GitHub: stale team memberships reviewed

**5. Compliance Dashboards:**
Grafana dashboard showing: policy violations by namespace, open CVEs by severity, secrets rotation compliance, deployment without ticket count.

**Audit Preparation:**
Before: 2 weeks of manual evidence gathering.
After: 2 days — automated evidence packages per system.

**Frameworks Mapped:**
• SOC 2 Type II: Access control, availability, confidentiality
• HIPAA-adjacent: Data handling, audit trails
• Change Management: ITIL-aligned with ServiceNow`,
          tips: [
            'Show you understand compliance is business requirement',
            'Discuss specific frameworks: SOC2, ISO 27001, GxP',
            'Mention how automation reduces audit burden',
            'Know difference between preventive and detective controls'
          ]
        },
        {
          id: 'sec5',
          level: 'Senior',
          q: 'How do you handle vulnerability management in a CI/CD platform?',
          a: `**Vulnerability Management Program:**

**Detection (Where we find vulns):**

**1. Dependency Scanning:**
• Snyk/Dependabot: PR-level alerts for new vulnerabilities
• Daily scans on all repos for newly disclosed CVEs
• Software Composition Analysis (SCA) in every pipeline

**2. Container Image Scanning:**
• Trivy in CI on every build
• ECR Inspector continuous scanning (flags new CVEs in existing images)
• Weekly scan report across all active images

**3. Infrastructure Scanning:**
• Checkov on every Terraform plan
• AWS Security Hub: aggregates findings from GuardDuty, Inspector, Macie
• CIS benchmark compliance checks monthly

**4. Runtime:**
• AWS Inspector on EC2 instances
• Falco for active exploitation attempts

**Triage & Prioritization:**

**Severity Matrix:**
• CRITICAL: Fix within 24 hours — pipeline gate, auto-creates P1 ticket
• HIGH: Fix within 72 hours — creates P2 ticket, Slack alert
• MEDIUM: Fix within 2 weeks — backlog ticket
• LOW: Track, fix in quarterly cleanup

**False Positive Management:**
• CVSS score + exploitability + our exposure considered
• Accepted risks documented with expiry date
• Snyk/Trivy .ignore files for justified suppressions

**Patching Workflow:**
1. Scanner detects CVE in image
2. Auto-ticket created in Jira with details
3. Base image rebuild triggered (if base image issue)
4. PR with updated dependency opened automatically
5. Pipeline validates fix
6. Deploys through environments

**Metrics Tracked:**
• Mean time to remediate (MTTR) by severity
• Open vuln count by age
• % of builds passing security gates
• Patch compliance rate`,
          tips: [
            'Know CVSS scoring and how to triage',
            'Discuss false positive handling',
            'Mention SLA by severity level',
            'Talk about dependency vs OS-level vulns'
          ]
        },
        {
          id: 'sec6',
          level: 'Mid-Senior',
          q: 'How do you implement network security for cloud-native workloads?',
          a: `**Defense in Depth — Network Layers:**

**1. VPC Level:**
• Public/private/data subnet separation
• NAT Gateway for outbound-only internet from private subnets
• VPC Flow Logs enabled (sent to S3 + Athena for querying)
• No direct internet access to application or data subnets

**2. Security Group Rules:**
• Ingress: Only from known sources (ALB SG, specific CIDR)
• Egress: Restricted to required destinations (not 0.0.0.0/0)
• Reference SG-to-SG instead of CIDR where possible
• Regular cleanup of unused rules (AWS Config rule)

**3. Kubernetes Network Policies:**

Default deny all ingress for each namespace. Then explicit allow from ingress controller and within same namespace. Restricts east-west traffic between services.

**4. EKS Pod-Level:**
• AWS VPC CNI with security groups per pod (for sensitive workloads)
• Network policies enforced by Calico or native VPC CNI
• Service mesh mTLS evaluated (Istio) for zero-trust internal traffic

**5. Ingress Security:**
• WAF on public ALBs (OWASP rule set + custom rules)
• AWS Shield Standard always on, Advanced for DDoS-sensitive
• Rate limiting at ALB level
• Geo-blocking for regions we don't operate in

**6. Egress Controls:**
• AWS Network Firewall for outbound filtering
• Domain-based allowlists (not IP-based, which drift)
• Alert on unexpected external connections

**DNS Security:**
• Route 53 DNSSEC for public zones
• Private hosted zones for internal service discovery
• DNS query logging enabled

**Monitoring:**
• GuardDuty: ML-based threat detection on VPC Flow Logs
• CloudWatch Logs Insights for flow log analysis
• Alerts on new security group rule additions`,
          tips: [
            'Know security group vs NACL differences',
            'Discuss Kubernetes network policy enforcement',
            'Mention PrivateLink for third-party service security',
            'Talk about zero-trust network architecture'
          ]
        },
        {
          id: 'sec7',
          level: 'Senior',
          q: 'How do you handle incident response in a cloud-native environment?',
          a: `**Incident Response Framework:**

**Preparation (Before Incidents):**
• Runbooks for common failure scenarios
• On-call rotation with PagerDuty
• Access to production scoped and pre-approved
• Tabletop exercises quarterly
• CloudTrail, GuardDuty, Falco always enabled

**Detection:**
• GuardDuty: Automated threat detection (unusual API calls, crypto mining, exfiltration)
• Falco: Runtime alerts (unexpected shell, file access)
• CloudWatch Alarms: Threshold-based (CPU spike, auth failures)
• SIEM: Correlation rules across log sources

**My Incident Response Process (PICERL):**

**Prepare:** Runbooks, tooling, access pre-staged.

**Identify:** Alert fires → severity assessed → incident channel created in Slack.

**Contain:**
• Isolate affected resource (security group change, pod deletion)
• Revoke compromised credentials immediately (Vault: vault lease revoke)
• Snapshot affected instances for forensics before changes
• Block malicious IPs at WAF/Security Group

**Eradicate:**
• Identify root cause (CloudTrail, VPC Flow Logs, audit logs)
• Remove malicious code or credentials
• Patch vulnerability that was exploited

**Recover:**
• Restore from known-good state (AMI, container image)
• Verify credentials rotated
• Enable enhanced monitoring
• Gradual traffic restoration

**Lessons Learned:**
• Blameless post-mortem within 48 hours
• 5-whys root cause analysis
• Action items tracked in Jira with owners
• Runbook updated

**Security Incident Example:**
Detected unusual AWS API calls via GuardDuty → traced to compromised CI runner → revoked credentials → rebuilt runner from scratch → implemented OIDC to eliminate static keys → zero recurrence.`,
          tips: [
            'Know PICERL or NIST IR framework',
            'Discuss forensics in cloud (immutable logs, snapshots)',
            'Mention credential revocation urgency',
            'Show blameless culture for post-mortems'
          ]
        }
      ]
    },
    observability: {
      title: 'Observability & Monitoring',
      icon: '📊',
      questions: [
        {
          id: 'obs1',
          level: 'Senior',
          q: 'How do you build an observability platform for microservices?',
          a: `**Observability = Metrics + Logs + Traces (The Three Pillars):**

**My Stack at Enterprise Pharma:**

**Metrics — Prometheus + Grafana:**
• Prometheus deployed via kube-prometheus-stack Helm chart
• ServiceMonitors auto-discover new services
• Node Exporter for infrastructure metrics
• kube-state-metrics for Kubernetes object state
• Custom application metrics via Prometheus client libraries
• Grafana dashboards: per-service, per-cluster, per-team views
• AlertManager for routing alerts to PagerDuty/Slack

**Logs — ELK Stack:**
• Fluent Bit DaemonSet on each node (lightweight collector)
• Structured JSON logging enforced as platform standard
• Elasticsearch for storage and indexing
• Kibana for search and visualization
• Log retention: 30 days hot, 90 days warm, 1 year cold (S3)
• Index lifecycle management (ILM) to control costs

**Traces — (AppDynamics / evaluated OpenTelemetry):**
• AppDynamics for APM in pharma environment
• Auto-instrumentation via agents for Java services
• Evaluated OpenTelemetry as future standard
• Distributed traces linked to logs via correlation IDs

**Platform Observability as Default:**

Every service deployed through our platform gets automatically:
• Prometheus metrics endpoint scraped
• Log forwarding configured
• Standard dashboard provisioned
• SLO-based alerts configured
• Health check endpoint

**SLO/SLA Framework:**
• SLI: Availability (% of successful requests), Latency (p99 < 500ms)
• SLO: 99.9% availability per service
• Error budget: 43 minutes downtime per month
• Burn rate alerts: 2x and 10x burn rate warnings

**Results:**
• MTTR reduced from 45 min to 12 min
• 95% of incidents detected before user reports
• Unified observability across 50+ services`,
          tips: [
            'Know the three pillars deeply',
            'Discuss cardinality challenges with Prometheus',
            'Mention OpenTelemetry as the future standard',
            'Talk about SLO/SLA/SLI differences clearly'
          ]
        },
        {
          id: 'obs2',
          level: 'Senior',
          q: 'How do you design alerting that is actionable, not noisy?',
          a: `**The Alerting Problem:**

Alert fatigue is real. Too many alerts = on-call ignores them. Too few = incidents missed. Goal: every alert is actionable.

**Principles I Follow:**

**1. Alert on Symptoms, Not Causes:**
• Wrong: "CPU > 80%" (cause, may not be a problem)
• Right: "Error rate > 1% for 5 minutes" (symptom, user impact)
• User-facing SLIs are the source of truth

**2. Every Alert Must Have:**
• Clear description of what is wrong
• Impact: who is affected and how
• Runbook link with diagnosis steps
• Severity level and expected action

**3. Severity Levels:**
• P1 (Critical): Page on-call immediately, user impact now
• P2 (High): Slack alert, fix within 4 hours
• P3 (Medium): Ticket created, fix within 24 hours
• Info: Log only, no action required

**4. Multi-Window Burn Rate Alerts:**
Instead of threshold alerts, use burn rate on error budget:
• Fast burn (1h window, 14x rate): P1 page
• Slow burn (6h window, 5x rate): P2 Slack

**AlertManager Routing:**

Routes based on severity: critical goes to PagerDuty (breaks silence), warnings go to team Slack channel, info goes to monitoring channel only.

**Noise Reduction Techniques:**
• Inhibition rules: suppress downstream alerts if upstream is firing
• Grouping: cluster related alerts into one notification
• Silence windows: maintenance, known incidents
• Wait time: 5-min evaluation period before firing

**Regular Alert Review:**
• Monthly: review alert frequency, tune thresholds
• After incidents: was alert helpful? too late? too early?
• Target: fewer than 5 P1 pages per month per service

**Results:**
• Alert volume reduced 70% after tuning
• On-call MTTA (mean time to acknowledge) improved 60%
• Zero "useless" alerts in weekly review`,
          tips: [
            'Discuss symptom-based vs cause-based alerts',
            'Explain burn rate alerting concept',
            'Mention alert review cadence',
            'Share specific noise reduction techniques'
          ]
        },
        {
          id: 'obs3',
          level: 'Senior',
          q: 'How do you implement distributed tracing in a microservices environment?',
          a: `**Why Distributed Tracing:**

In a microservices architecture, a single user request may touch 10+ services. Without tracing, debugging latency or errors is guesswork. Traces connect the dots across services.

**Concepts:**

• Trace: end-to-end journey of a request
• Span: a single operation within a trace
• Trace Context: propagated via headers (W3C TraceContext standard)
• Sampling: not every request traced (cost vs visibility)

**My Implementation Experience:**

**AppDynamics (Enterprise Pharma):**
• Agent-based auto-instrumentation for Java services
• Business Transaction detection (map transactions to services)
• Distributed correlation across service boundaries
• Linked to logs via request ID

**OpenTelemetry (Evaluated/Piloted):**
Auto-instrumentation setup: SDK installed, OTLP exporter configured to collector, which routes to Jaeger/Tempo backend.

**Correlation IDs Pattern:**
• Every request gets a unique trace ID at entry point (API gateway/ingress)
• Trace ID propagated in headers to all downstream services
• Logged in every log line: structured field trace_id
• Allows log + trace correlation in Kibana/Grafana

**Sampling Strategy:**
• Head-based: 10% of all requests sampled
• Tail-based: 100% of error requests sampled (after the fact)
• Always sample: slow requests (> p99 threshold)

**What Traces Revealed:**
• Found that 60% of API latency was in one downstream service
• Identified N+1 database query pattern via span analysis
• Traced timeout cascades across 5 services in one incident

**Challenges:**
• Instrumentation of legacy services (agent-based helps)
• Storage costs at scale (sampling essential)
• Context propagation through async/queue boundaries (message headers)`,
          tips: [
            'Know W3C TraceContext and B3 propagation formats',
            'Explain head-based vs tail-based sampling',
            'Discuss OpenTelemetry as vendor-neutral standard',
            'Mention how traces connect to logs and metrics'
          ]
        },
        {
          id: 'obs4',
          level: 'Senior',
          q: 'How do you implement SLOs and error budgets?',
          a: `**SLO Framework:**

**Definitions:**

• SLI (Service Level Indicator): What we measure (e.g., % successful requests)
• SLO (Service Level Objective): Target for the SLI (e.g., 99.9% availability)
• Error Budget: Allowed failure time = 1 - SLO (0.1% = 43 min/month)
• SLA: External contract based on SLOs

**SLIs I Define Per Service Type:**

**APIs/Web Services:**
• Availability: successful_requests / total_requests > 99.9%
• Latency: p99 response time < 500ms for 95% of periods

**Batch Jobs:**
• Success rate: successful_runs / total_runs > 99.5%
• Freshness: last successful run within 15 minutes

**Kubernetes Workloads:**
• Pod availability: desired replicas == ready replicas
• Restart rate: restarts per hour < 2

**Implementation with Prometheus:**

Recording rule calculates 28-day rolling availability from HTTP requests, excluding 5xx responses from total.

SLO alert fires when burn rate exceeds threshold using multi-window approach.

**Grafana SLO Dashboard Shows:**
• Current SLI value vs SLO target
• Error budget remaining (% and minutes)
• Burn rate over time
• Recent incidents consuming budget

**Error Budget Policy:**

Error budget > 50%: Ship new features, take on technical debt.
Error budget 10-50%: Slow down risky deployments, focus on reliability.
Error budget < 10%: Feature freeze, reliability work only, review SLO targets.
Error budget exhausted: Incident review, no production changes.

**Organizational Impact:**
• Platform and product teams aligned on reliability vs velocity trade-off
• On-call engineers empowered to freeze releases
• Reliability improvements tied to business metrics`,
          tips: [
            'Know the SLI/SLO/SLA/error budget chain clearly',
            'Discuss how to set initial SLO targets',
            'Mention error budget policy with stakeholders',
            'Talk about multi-window burn rate alerts'
          ]
        },
        {
          id: 'obs5',
          level: 'Mid-Senior',
          q: 'How do you handle log management at scale?',
          a: `**Log Management Architecture:**

**Collection:**
• Fluent Bit DaemonSet on every Kubernetes node
• Lightweight (fewer resources than Fluentd)
• Parses container logs, adds Kubernetes metadata (pod, namespace, node)
• Multiple outputs: Elasticsearch + S3 for archival

**Fluent Bit Config Pattern:**

INPUT from tail on container logs. FILTER adds Kubernetes metadata. OUTPUT routes to Elasticsearch and S3 simultaneously.

**Standardization (Platform Mandate):**

All services must log structured JSON with: timestamp (ISO8601), level, service name, trace_id, span_id, and message. No plain text logs in production.

**Elasticsearch Setup:**
• Hot-warm-cold architecture for cost management
• Hot: SSD, last 7 days, full search
• Warm: HDD, 7-30 days, less frequent
• Cold: S3 via ILM, 30-365 days, query on demand
• ILM policy automates tier movement

**Kibana:**
• Per-team index patterns
• Saved searches for common queries
• Dashboards for error rates, slow queries, auth failures
• Alerting on log patterns (error spike detection)

**Cost Control:**
• Drop debug logs in production at Fluent Bit level
• Sampling for high-volume, low-value logs
• Index lifecycle management → S3 Glacier for compliance
• Per-team log volume dashboards (self-service awareness)

**Compliance Logging:**
• Audit logs (CloudTrail, Vault, K8s API) on separate immutable index
• Object lock on S3 for tamper-proof retention
• 1-year retention for compliance, 7 years for audit logs

**Troubleshooting Workflow:**
Alert fires → Grafana (metrics) → Kibana (logs filtered by trace_id) → Jaeger (trace) → root cause in 12 minutes average.`,
          tips: [
            'Know Fluent Bit vs Fluentd trade-offs',
            'Discuss index lifecycle management',
            'Mention structured logging as platform standard',
            'Talk about cost at scale (log volumes are expensive)'
          ]
        },
        {
          id: 'obs6',
          level: 'Mid-Senior',
          q: 'How do you monitor Kubernetes cluster health as a platform engineer?',
          a: `**Kubernetes Monitoring Layers:**

**1. Control Plane:**
• API server: request latency, error rate, etcd size
• etcd: leader elections, disk I/O, peer communication
• Scheduler: pending pods, scheduling latency
• Controller manager: reconciliation loops

**kube-prometheus-stack includes all of this out of the box.**

**2. Node-Level:**
• CPU, memory, disk, network per node (Node Exporter)
• Node conditions: MemoryPressure, DiskPressure, PIDPressure
• Kubelet health and performance metrics

**3. Workload-Level:**
• Pod restarts (alert on > 5 in 10 min)
• OOMKilled events (memory limit tuning indicator)
• CPU/Memory utilization vs requests and limits
• Pending pods (scheduling issues, capacity)

**Key Alerts I Configure:**

Critical: API server unavailable, etcd leader change, high pending pods > 10 for 5 min, node NotReady.
Warning: Pod restart rate high, CPU throttling > 20%, PVC usage > 85%, HPA at max replicas (capacity planning signal).

**Grafana Dashboards:**
• Cluster Overview: node count, pod count, resource utilization
• Namespace view: per-team resource usage vs quota
• Workload view: per-deployment health, replica status
• Cost view: Kubecost integration for spend per namespace

**Capacity Planning:**
• Track resource utilization trends (60-70% target, not 90%+)
• HPA max replicas reached = signal to scale node group
• Cluster Autoscaler metrics: scale-up/down events, unschedulable pods
• Monthly capacity review with projected growth

**Upgrade Readiness Checks:**
Before EKS upgrades: deprecated API usage scan, add-on compatibility matrix, node group drain testing in staging.`,
          tips: [
            'Know the difference between requests and limits',
            'Discuss HPA vs VPA vs KEDA use cases',
            'Mention etcd monitoring importance',
            'Talk about capacity planning process'
          ]
        },
        {
          id: 'obs7',
          level: 'Senior',
          q: 'How do you build observability for mobile applications?',
          a: `**Mobile Observability Challenges:**

Unlike server-side, you can't SSH into a user's phone. Observability must be built into the app and surfaced via backend services.

**Layers of Mobile Observability:**

**1. Crash Reporting:**
• Firebase Crashlytics or Sentry for iOS/Android
• Symbolication: upload dSYMs/ProGuard mapping after each build (automated in Fastlane)
• Crash-free session rate tracked (target > 99.5%)
• Alerts: crash spike > 0.5% triggers on-call

**2. Performance Monitoring:**
• App startup time (cold start target < 2 seconds)
• Screen render time (60fps target)
• Network request latency from client perspective
• Memory and CPU usage patterns

**3. Business Metrics / Analytics:**
• Custom events per user journey
• Funnel completion rates
• Feature adoption rates
• Environment-specific events (dev/staging suppressed)

**4. CI/CD Pipeline Observability:**

Build metrics tracked in Grafana:
• Build duration per platform (iOS/Android) over time
• Build success rate (target > 99%)
• Deployment frequency to TestFlight/Play Store
• Time from commit to TestFlight available

Fastlane reports build metrics to custom endpoint. GitHub Actions exports job duration to CloudWatch. Grafana pulls from both.

**5. App Store Metrics:**
• App Store Connect API: crash rate, reviews, ratings
• Play Console API: ANR rate, crash rate by device
• Alerts on rating drop or crash rate increase post-release

**Incident Response for Mobile:**
• Crash spike detected → check Crashlytics → symbolicate → identify release → rollback via feature flag or expedited hotfix
• Remote config (Firebase Remote Config) for kill switches

**Correlation:**
Mobile trace_id propagated to backend APIs → backend trace → database query — full request trace even across client/server boundary.`,
          tips: [
            'Know symbolication for iOS (dSYM) and Android (ProGuard)',
            'Discuss crash-free rate as primary KPI',
            'Mention remote config / feature flags for mobile rollback',
            'Talk about phased rollout monitoring'
          ]
        }
      ]
    },
    stakeholder: {
      title: 'Stakeholder & Collaboration',
      icon: '🤝',
      questions: [
        {
          id: 'stk1',
          level: 'All',
          q: 'How do you communicate platform roadmaps and priorities to non-technical stakeholders?',
          a: `**The Challenge:**

Engineering leaders speak in features and velocity. Business stakeholders speak in risk, cost, and outcomes. Platform work is often invisible until it breaks.

**My Communication Approach:**

**1. Translate to Business Value:**

Instead of: "We're migrating Jenkins to GitHub Actions"
Say: "We're reducing deployment lead time by 30%, which accelerates feature delivery and reduces the risk of manual errors."

Instead of: "We're implementing Vault for secrets management"
Say: "We're eliminating the risk of credential exposure, which could result in a compliance incident or data breach."

**2. Quarterly Roadmap Review Format:**

Three sections I always include:
• What we delivered (impact in business terms, with metrics)
• What we're building next (problems we're solving, not tools we're adopting)
• What we need (headcount, budget, decisions required)

**3. Risk Communication:**

Tech Debt Report (quarterly): List of deferred items with business risk (not technical description). Example: "Legacy Jenkins infrastructure: risk of unexpected outage affecting 20+ teams. Estimated cost to remediate: X hours. Risk if deferred: operational incident during critical release."

**4. Executive Dashboard:**

One-page summary:
• Platform availability: 99.95% (Green)
• Developer NPS: +45 (Green)
• Open P1 security issues: 0 (Green)
• Cost vs budget: 5% under (Green)
• Roadmap milestones: 2 of 3 on track (Yellow)

**5. Stakeholder-Specific Communication:**
• Engineering VP: DORA metrics, velocity, reliability
• CISO: Security posture, CVE status, compliance
• CFO: Cloud cost trends, cost per deployment
• Product: How platform enables faster feature delivery

**Result:**
• Platform budget approved without cuts for 3 consecutive years
• C-level understands platform investment ROI
• Fewer surprise questions in steering committees`,
          tips: [
            'Always translate tech to business outcomes',
            'Prepare a one-page executive summary',
            'Quantify risk of not investing in platform',
            'Show you understand business context, not just tech'
          ]
        },
        {
          id: 'stk2',
          level: 'All',
          q: 'How do you work with security and compliance teams without becoming a blocker?',
          a: `**The Tension:**

Security teams want controls. Developer teams want speed. Platform engineers sit in the middle — our job is to make security easy, not to choose sides.

**My Collaboration Approach:**

**1. Involve Security Early (Shift Left for Relationships too):**
• Invite security team to architecture reviews before building
• Share platform roadmap with security quarterly
• Proactively flag new capabilities before they ask

**2. Shared Goals, Not Adversarial:**
• Framing: "How do we build this securely?" not "Can we do this?"
• Security team as advisors, not gatekeepers
• Platform team takes on security implementation burden

**3. Pre-Approved Patterns:**

Worked with security to pre-approve standard patterns:
• Pre-approved Docker base images (no review needed per PR)
• Pre-approved Terraform modules (security controls built in)
• Pre-approved network patterns (standard VPC design)

Result: Teams using golden paths need zero security reviews. Only custom/non-standard work requires review.

**4. Compliance Automation Partnership:**

Security team defined controls. Platform team automated them:
• Security: "All prod deployments need approved ticket"
• Platform: Kyverno policy enforces ticket label in CI/CD
• Security: "No public S3 buckets"
• Platform: Terraform module defaults private, SCP blocks public

**5. Clear Escalation Path:**

When security says no: "Help me understand the risk. Let's find a solution together." Escalate disagreements to joint architecture review, not email chains.

**Result at Enterprise Pharma:**
• Security team as advocates for platform work
• Pre-approval process reduced review time from 2 weeks to same-day for standard patterns
• Audit prep time cut by 70%
• Security team requested platform team present at company security summit`,
          tips: [
            'Show you respect security concerns',
            'Discuss pre-approved patterns strategy',
            'Mention shared responsibility model',
            'Avoid framing as "us vs security"'
          ]
        },
        {
          id: 'stk3',
          level: 'All',
          q: 'Describe a time you influenced a technical decision without direct authority.',
          a: `**Situation:**

At Enterprise Pharma, the architecture team had decided to build a custom internal secrets management tool to avoid a HashiCorp Vault license cost. I believed this was a significant risk and wanted to advocate for Vault.

**Challenge:**

I had no authority over architecture decisions. The decision-maker was a VP-level architect. The custom tool had already been scoped and presented.

**My Approach:**

**1. Built the Case with Data (not opinion):**
• Estimated engineering cost of building custom tool: 6 months × 2 engineers
• License cost for Vault Enterprise: fraction of build cost
• Risk assessment: secrets management is security-critical, bugs in custom tools are dangerous
• Maintenance burden: ongoing ownership of custom tool vs Vault's community

**2. Found Allies:**
• Security team concerned about custom tool auditability
• DevOps team knew Vault from previous experience
• Gathered their perspectives to amplify my case

**3. Proposed a Structured Comparison:**
Offered to run a 2-week proof-of-concept for Vault alongside the custom tool design, with a defined evaluation rubric (security, features, maintenance, cost).

**4. Presented to the Right Audience:**
Requested 30 minutes with architect + security lead + engineering manager. Presented the POC results and total cost of ownership comparison.

**5. Respected the Final Decision:**
Vault was approved. Importantly — I was prepared to accept a different outcome and committed to making it work.

**Result:**
• Vault deployed across all environments
• OIDC integration eliminated static credentials (10x security improvement)
• Custom tool project cancelled, team redirected to platform work
• Architect cited this process as a model for future architecture decisions

**Key Learning:**
Influence without authority requires data, allies, and genuine respect for others' perspectives.`,
          tips: [
            'Use concrete data to make your case',
            'Show you built allies, not just argued alone',
            'Demonstrate respect for final decisions',
            'Highlight what you learned from the process'
          ]
        },
        {
          id: 'stk4',
          level: 'All',
          q: 'How do you manage competing priorities between multiple development teams?',
          a: `**The Reality of Platform Work:**

As a platform team, you serve many teams simultaneously. Everyone thinks their request is the highest priority. Without a system, you end up reactive and burned out.

**My Prioritization System:**

**1. Transparent Intake Process:**
• Platform request form in Jira (not Slack DMs)
• Fields: business impact, affected teams, urgency, effort estimate
• Visible backlog — teams can see where their request sits

**2. Scoring Formula:**

Priority Score = (Teams Affected × 2) + (Business Impact 1-5) + (Urgency 1-5) - (Effort 1-5)

This makes trade-offs visible and data-driven, not political.

**3. Quarterly Planning with Stakeholders:**

Invite team leads to quarterly roadmap review:
• Show scored backlog
• Discuss trade-offs openly
• Lock in commitments for the quarter
• Explicitly acknowledge what we're NOT doing

**4. Managing Urgent Requests:**

New urgent request mid-quarter → explicit trade-off conversation:
"We can take this on, but it means [existing commitment] slips. Is that the right trade-off?" Document the decision.

**5. Managing Expectations:**

• Weekly status update in platform Slack channel
• Blocked requests explained: "Deprioritized because X, expected Q3"
• Under-promise, over-deliver on timelines

**Real Example:**

Two teams both needed self-service capabilities simultaneously: team A needed database provisioning, team B needed new CI/CD pipeline type.

Scored both: DB provisioning affected 12 teams (cascading value), pipeline type affected 1 team. DB provisioning went first. Team B understood the scoring. Team B's request was in next sprint.

**Result:**
• Reduced "why isn't my thing done" conversations by 80%
• Teams felt heard even when not prioritized
• Platform team had clearer focus, higher quality output`,
          tips: [
            'Show a systematic approach, not gut feel',
            'Discuss how you communicate trade-offs',
            'Mention transparency as key to managing expectations',
            'Share specific example of difficult trade-off'
          ]
        },
        {
          id: 'stk5',
          level: 'All',
          q: 'How do you build relationships across the engineering organization?',
          a: `**Why It Matters:**

Platform work is fundamentally a service business. Nobody is forced to use your platform. You earn adoption through trust, relationships, and delivering value.

**My Relationship-Building Practices:**

**1. Office Hours (Weekly):**
• Open 1-hour session: any developer can join
• No agenda, just help
• Builds informal relationships with developers
• Surfaces problems before they become complaints

**2. Embedded Collaboration:**
• Spend time in team standups when doing migrations
• Pair programming with developers on platform tooling
• Attend team retrospectives to hear feedback directly

**3. Developer Advocates:**

Identify enthusiasts in each major team: developers who enjoy platform tooling, early adopters of new capabilities. Invest in them — early access, co-design sessions. They become internal champions.

**4. Celebrate Wins Publicly:**

When a team's migration to new platform succeeds, post in #engineering Slack:
"Team X just went live on self-service deployments — from PR to production in 15 minutes. Great collaboration with [developer name]!"

This reinforces value and creates FOMO for teams who haven't migrated.

**5. Feedback Channels:**

• Quarterly developer survey (anonymous, 5 questions)
• Platform retro (open to any developer)
• #platform-feedback Slack channel always monitored

**6. Don't Just Show Up When Something Breaks:**

Proactively reach out: "We're planning to upgrade the EKS version next month — will this affect your team? Let's review together."

**Result:**
• Invited to present at engineering all-hands (earned trust)
• Teams proactively share problems before they escalate
• Platform adoption organic, not mandated
• Developer NPS: +45, specifically mentioning team responsiveness`,
          tips: [
            'Emphasize service mindset',
            'Mention office hours as concrete tactic',
            'Discuss building internal champions',
            'Show genuine interest in developers as customers'
          ]
        },
        {
          id: 'stk6',
          level: 'All',
          q: 'Tell me about a time you navigated disagreement on a technical approach.',
          a: `**Situation:**

During the cloud migration at Enterprise Pharma, there was a strong disagreement on ECS Fargate vs EKS for containerized workloads. The infrastructure team preferred Fargate (simpler, managed), while I advocated for EKS (more control, better fit for microservices at scale).

**Stakes:**

This was a foundational decision affecting 50+ services. Getting it wrong would be expensive to reverse. Both sides had valid points.

**My Approach:**

**1. Acknowledged the Valid Points on Both Sides:**
• Fargate: truly serverless, less operational overhead, faster to start
• EKS: more control, portable, Helm ecosystem, horizontal scaling flexibility

**2. Reframed from Opinion to Criteria:**

Proposed a decision framework with agreed criteria:
• Long-term scalability needs
• Team operational capability
• Cost model at projected scale
• Ecosystem and tooling maturity
• Migration effort and risk

**3. POC to Reduce Uncertainty:**
• Ran 4-week POC: migrated one service to each platform
• Measured actual operational complexity, cost, and developer experience

**4. Data-Driven Recommendation:**

POC showed: EKS cost was 20% lower at projected scale. Helm chart ecosystem was superior for managing 50+ services. Team had existing Kubernetes knowledge from previous projects. Fargate had cold start issues for the workload patterns.

Presented to architecture review board with evidence.

**5. Hybrid Outcome:**

Decision: EKS for stateful, long-running services. Fargate for batch jobs and event-driven workloads. Best of both worlds, everyone's concerns addressed.

**Result:**
• Both teams felt heard and saw their preferences reflected
• Decision documented with clear reasoning (no revisiting)
• Hybrid approach validated: right tool for the right job
• Infrastructure team became strong EKS operators within 6 months

**Key Learning:**
Disagreements are opportunities to make better decisions. Structure the conversation around criteria, not personalities.`,
          tips: [
            'Show intellectual humility',
            'Discuss how you separate opinion from data',
            'Mention POC as a way to reduce uncertainty',
            'Demonstrate collaborative decision-making'
          ]
        },
        {
          id: 'stk7',
          level: 'All',
          q: 'How do you handle being on-call and managing incident communication?',
          a: `**On-Call Philosophy:**

On-call is a service we provide to the business. The goal is fast resolution with clear communication — not just fixing things quietly.

**My On-Call Structure:**

**1. Tooling:**
• PagerDuty for alert routing and escalation
• Runbooks in Confluence (linked from every alert)
• Incident channel auto-created in Slack (#incident-YYYY-MM-DD)
• StatusPage for user-facing communication

**2. Incident Severity Classification:**

P1 (Critical): Full or partial outage, user-impacting. Page primary on-call immediately.
P2 (High): Degraded performance, workaround exists. Slack alert + 30-min acknowledgment SLA.
P3 (Medium): Non-urgent issue, no immediate user impact. Next business day.

**3. Incident Communication Cadence:**

Opening: "P1 incident declared. [Service] is experiencing [symptoms]. Impact: [X users/teams affected]. IC: [name]. Bridge: [link]."

Updates every 15 minutes during P1: "Update: We've identified the issue as [X]. Currently [action being taken]. ETA to resolve: [time]."

Resolution: "Resolved: [Service] is fully operational. Root cause: [brief]. Post-mortem scheduled for [date]."

**4. Stakeholder Communication:**
• Automatically post to #engineering-announcements for P1s
• For business-impacting: email to stakeholder list within 30 min
• Never leave stakeholders wondering — over-communicate during incidents

**5. Post-Mortem Process:**
• Blameless, within 48 hours
• Template: timeline, impact, root cause, action items, lessons learned
• Action items tracked in Jira with owners and due dates
• Shared publicly within engineering: transparency builds trust

**My Metrics:**
• MTTA (acknowledge): < 5 minutes
• MTTR P1: < 30 minutes average
• Post-mortem completion: 100% within 48 hours`,
          tips: [
            'Emphasize clear communication during incidents',
            'Discuss blameless culture',
            'Know MTTA/MTTR metrics',
            'Mention runbook discipline'
          ]
        }
      ]
    },
    career: {
      title: 'Interview & Career Guide',
      icon: '🎯',
      questions: [
        {
          id: 'car1',
          level: 'All',
          q: 'What is the STAR interview format and how should you use it?',
          a: `**STAR Method Overview:**

The STAR method is the gold standard for answering behavioral interview questions:

**1. Situation** — Set the context. Describe the project, team, and challenge. Be specific: "At Company X, we had a monolithic application serving 10M users that was experiencing frequent outages during peak hours."

**2. Task** — What was your responsibility? "I was tasked with designing a migration plan to decompose the monolith into microservices to improve reliability and scalability."

**3. Action** — What did YOU do? (Use "I", not "we"). "I identified the top 3 most failure-prone modules, designed a strangler fig pattern to extract them into independent services on EKS, set up CI/CD pipelines with ArgoCD, and implemented circuit breakers using Istio."

**4. Result** — Quantify the outcome. "We reduced outages by 95%, improved deployment frequency from monthly to daily, and reduced P99 latency from 2s to 200ms. The architecture now handles 3x the previous peak traffic."

**Preparation Tips:**

• Prepare 5–8 STAR stories that cover: technical challenge, leadership, conflict, failure/learning, and cross-team collaboration.
• Always quantify results (percentages, dollar amounts, time saved).
• Keep each STAR answer under 2 minutes unless the interviewer asks to go deeper.`,
          tips: [
            'Always use "I" not "we" when describing actions',
            'Quantify every result with specific numbers',
            'Prepare stories across multiple themes: leadership, failure, conflict, teamwork',
            'Practice out loud until stories feel natural but not rehearsed'
          ]
        },
        {
          id: 'car2',
          level: 'Mid-Senior',
          q: 'What is the difference between a Platform Team and a Developer Team?',
          a: `**Platform Team vs Developer Team Workflow:**

**Step 1:** The developer team requests the Platform team to provision appropriate AWS resources (e.g. Amazon EKS). This request is typically done via a ticketing system.

**Step 2:** The platform team receives the request.

**Step 3:** The platform team uses Infrastructure as Code (IaC) such as Terraform, CDK, etc., to provision the requested AWS resources and share credentials with the developer team.

**Step 4:** The developer team kicks off the CI/CD process. Developers check in Code, Dockerfile, and manifest YAMLs. CI tools (e.g. Jenkins, GitHub Actions) build the container image and save it in Amazon ECR.

**Step 5:** CD tools (e.g. Jenkins, Spinnaker) update the deployment manifest files with the tag of the container image.

**Step 6:** CD tools deploy the manifest files into the cluster, deploying the newly built container in Amazon EKS.

**Conclusion:**

The platform team takes care of the infrastructure (often with guardrails appropriate for the organization), and the developer team uses that infrastructure to deploy their application. The platform team does the upgrade and maintenance of the infrastructure to reduce the burden on the developer team.`,
          tips: [
            'Emphasize clear ownership boundaries between teams',
            'Mention self-service as the goal for mature platform teams',
            'Discuss how guardrails balance speed with governance',
            'Know how Team Topologies describes this relationship'
          ]
        },
        {
          id: 'car3',
          level: 'Mid-Senior',
          q: 'What are the options for running batch workloads on AWS?',
          a: `**AWS Batch Workload Options:**

**AWS Lambda:**
• Best for: Simple, short transformations
• Max duration: 15 minutes
• Scaling: Automatic (1000+ concurrent)

**AWS Batch:**
• Best for: Large-scale compute jobs (genomics, rendering, ML training)
• Max duration: Unlimited
• Scaling: Automatic (managed compute environments with Spot)

**AWS Step Functions:**
• Best for: Complex multi-step workflows with branching, retries, and error handling
• Max duration: 1 year (Standard) / 5 min (Express)
• Scaling: Automatic

**AWS Fargate:**
• Best for: Containerized batch jobs without managing servers
• Max duration: Unlimited
• Scaling: Task-based scaling

**Amazon EMR:**
• Best for: Big data processing (Spark, Hadoop, Hive)
• Max duration: Unlimited
• Scaling: Cluster auto-scaling

**Common Pattern:**

Use Step Functions to orchestrate a batch pipeline — trigger Lambda for lightweight steps, AWS Batch for heavy compute, and DynamoDB/S3 for state and output storage.`,
          tips: [
            'Match the service to the workload characteristics (duration, compute needs)',
            'Mention Spot instances for cost optimization in batch jobs',
            'Discuss Step Functions as the orchestration layer',
            'Know the concurrency and duration limits for each service'
          ]
        },
        {
          id: 'car4',
          level: 'Senior',
          q: 'How does EventBridge cross-account event routing work?',
          a: `**EventBridge Cross-Account Architecture:**

Amazon EventBridge supports routing events across AWS accounts for multi-account architectures:

**How It Works:**

1. **Source Account** — An application in Account A publishes events to an EventBridge event bus.
2. **Event Rule** — A rule in Account A matches specific events and sets the target as the event bus in Account B.
3. **Resource Policy** — Account B's event bus has a resource-based policy that allows Account A to put events onto it.
4. **Target Account** — A rule in Account B's event bus matches the received events and triggers targets (Lambda, SQS, Step Functions, etc.).

**Use Cases:**

• **Centralized audit** — All accounts send security/compliance events to a central security account.
• **Shared services** — A shared services account processes billing, notifications, or infrastructure events from workload accounts.
• **Microservices across accounts** — Different teams own different accounts; EventBridge enables event-driven communication without tight coupling.`,
          tips: [
            'Draw the cross-account flow with resource policies',
            'Mention event bus resource-based policies as the key enabler',
            'Discuss centralized audit as a common real-world pattern',
            'Compare with SNS cross-account for simpler use cases'
          ]
        },
        {
          id: 'car5',
          level: 'Mid-Senior',
          q: 'What does a typical microservice technology stack look like on AWS?',
          a: `**Microservice Tech Stack Layers:**

**API Gateway:**
• Purpose: External API routing, auth, throttling
• Technologies: Amazon API Gateway, Kong, Apigee

**Compute:**
• Purpose: Run microservices
• Technologies: Amazon EKS, ECS, Fargate, Lambda

**Service Discovery:**
• Purpose: Find other services
• Technologies: AWS Cloud Map, Kubernetes DNS, Consul

**Communication:**
• Purpose: Sync & async messaging
• Technologies: gRPC, REST, SQS, SNS, EventBridge, Kafka

**Database:**
• Purpose: Data storage (database per service)
• Technologies: DynamoDB, Aurora, ElastiCache, S3

**Observability:**
• Purpose: Metrics, logs, traces
• Technologies: CloudWatch, Prometheus, Grafana, X-Ray, Jaeger

**CI/CD:**
• Purpose: Build and deploy
• Technologies: GitHub Actions, Jenkins, ArgoCD, CodePipeline

**Security:**
• Purpose: AuthN/AuthZ, encryption
• Technologies: Cognito, IAM, KMS, Istio (mTLS)`,
          tips: [
            'Know the purpose of each layer and why it matters',
            'Be ready to justify your technology choices at each layer',
            'Discuss the "database per service" pattern and its trade-offs',
            'Mention observability as a non-negotiable for microservices'
          ]
        },
        {
          id: 'car6',
          level: 'Mid-Senior',
          q: 'What are the most common behavioral interview questions and how should you answer them?',
          a: `**Key Behavioral Question Categories:**

## Leadership & Influence
• "Tell me about a time you influenced a team to adopt a technology they were resistant to."
• "Describe a time you had to make a technical decision with incomplete information."
• "Tell me about a time you disagreed with your manager or a senior engineer."

## Failure & Learning
• "Tell me about a project that failed. What did you learn?"
• "Describe a production incident you caused or handled."
• "Tell me about a time you received critical feedback. How did you respond?"

## Collaboration & Communication
• "Describe a time you had to explain a complex technical concept to a non-technical stakeholder."
• "Tell me about a time you mentored a junior engineer who was struggling."
• "Describe a situation where two teams had conflicting priorities. How did you resolve it?"

## Scale & Innovation
• "Tell me about a time you optimized a system for 10x scale."
• "How did you reduce cloud costs significantly for your organization?"

**Key Takeaway:**

Prepare 8-10 STAR stories and practice them out loud until they feel natural but not rehearsed. Every story should have quantified results. Keep each answer under 2 minutes. Have at least one failure story ready — it shows self-awareness and is always asked.`,
          tips: [
            'Map stories to company values (e.g. Amazon Leadership Principles)',
            'Always have a failure story ready — it shows maturity',
            'Lead with data, not opinions, when describing disagreements',
            'Practice the 2-minute rule: keep initial answers concise, let interviewer probe'
          ]
        },
        {
          id: 'car7',
          level: 'All',
          q: 'What does a typical Solutions Architect interview process look like?',
          a: `**Typical Interview Rounds:**

**Phone Screen (30-45 min):**
• Focus: Resume deep-dive, "tell me about yourself," 2-3 technical questions
• Prep: Prepare a 2-minute elevator pitch. Know your resume projects cold — be ready to go deep on any bullet point.

**Technical Deep Dive (45-60 min):**
• Focus: AWS services, architecture decisions, past project analysis
• Prep: Review all topics in this guide. Be ready to whiteboard an architecture from a past project and defend your decisions.

**System Design (45-60 min):**
• Focus: Design a system from scratch on a whiteboard
• Prep: Practice the 4-step framework: 1) Clarify requirements, 2) High-level design, 3) Deep dive on components, 4) Discuss trade-offs and scaling.

**Behavioral (45-60 min):**
• Focus: Leadership, conflict, failure, collaboration (STAR format)
• Prep: Prepare 8-10 STAR stories. At Amazon, map each to a Leadership Principle. Always quantify results.

**Bar Raiser — Amazon (45-60 min):**
• Focus: Cross-functional evaluation. Tests long-term potential, not just current role fit.
• Prep: Expect unusual questions that test how you think, not what you know. Show depth AND breadth.

**How to Handle "I Don't Know":**

• Don't bluff. Experienced interviewers will probe until the bluff collapses.
• Show your reasoning: "I haven't worked with Aurora DSQL directly, but based on my understanding of distributed SQL systems like Spanner, I'd expect it provides strong consistency across regions..."
• Acknowledge and pivot: "That's not an area I've gone deep on yet. What I can share is how I'd approach learning it..."

**Company-Specific Preparation:**

• **Amazon:** 16 Leadership Principles drive every question. Map your STAR stories to: Customer Obsession, Ownership, Invent and Simplify, Bias for Action, Dive Deep, Earn Trust.
• **Google:** Focus on system design depth and "Googliness" — intellectual humility, collaboration, bringing out the best in others.
• **Startups:** Emphasize breadth, speed, and cost consciousness. They want architects who can build, not just design.`,
          tips: [
            'The system design round has the highest weight for architect roles',
            'Structure every design answer: requirements → high-level → deep dive → trade-offs',
            'Practice whiteboarding while speaking simultaneously',
            'Never bluff — show reasoning process instead'
          ]
        }
      ]
    }
  };

  const allQuestions = Object.values(categories).flatMap(c => c.questions);
  const progress = Math.round((completedQuestions.size / allQuestions.length) * 100);
  const categoryProgress = (catKey) => {
    const catQuestions = categories[catKey].questions;
    const completed = catQuestions.filter(q => completedQuestions.has(q.id)).length;
    return Math.round((completed / catQuestions.length) * 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        padding: '32px 24px',
        color: 'white',
        borderBottom: '4px solid #3b82f6',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              🏗️
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                Sathish Kumar Prakash
              </h1>
              <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '15px', fontWeight: '500' }}>
                Platform Engineer • Cloud & Mobile Platform • 17+ Years Experience
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', opacity: 0.9 }}>Preparation Progress</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                {completedQuestions.size} of {allQuestions.length} questions reviewed
              </span>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['questions', 'profile', 'tips', 'guide'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
                  color: activeTab === tab ? '#3b82f6' : '#64748b',
                  fontWeight: activeTab === tab ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {tab === 'profile' ? 'Your Profile' : tab === 'tips' ? 'Interview Tips' : tab === 'guide' ? '📋 Full Guide' : 'Questions'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'questions' && (
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* Sidebar */}
            <div style={{ width: '260px', flexShrink: 0 }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: '80px',
              }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                  Categories
                </h3>
                {Object.entries(categories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '6px',
                      background: activeCategory === key ? 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)' : 'transparent',
                      border: activeCategory === key ? '1px solid #bfdbfe' : '1px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: activeCategory === key ? '600' : '500',
                        color: activeCategory === key ? '#1e40af' : '#475569',
                      }}>
                        {cat.title}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginTop: '2px',
                      }}>
                        {cat.questions.length} questions • {categoryProgress(key)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, #fafafa 0%, #f8fafc 100%)',
                }}>
                  <span style={{ fontSize: '28px' }}>{categories[activeCategory].icon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                      {categories[activeCategory].title}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
                      {categories[activeCategory].questions.length} questions with detailed answers
                    </p>
                  </div>
                </div>

                {categories[activeCategory].questions.map((item, idx) => (
                  <div key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <div
                      onClick={() => setExpandedQuestion(expandedQuestion === item.id ? null : item.id)}
                      style={{
                        padding: '18px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        background: completedQuestions.has(item.id) ? '#f0fdf4' : 'white',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: completedQuestions.has(item.id) ? '#dcfce7' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: completedQuestions.has(item.id) ? '#16a34a' : '#64748b',
                        flexShrink: 0,
                      }}>
                        {completedQuestions.has(item.id) ? '✓' : idx + 1}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '10px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: item.level === 'Senior' ? '#fef3c7' : item.level === 'Mid-Senior' ? '#e0e7ff' : '#f0fdf4',
                            color: item.level === 'Senior' ? '#92400e' : item.level === 'Mid-Senior' ? '#3730a3' : '#166534',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {item.level}
                          </span>
                        </div>
                        <h3 style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '500',
                          color: '#1e293b',
                          lineHeight: '1.5',
                        }}>
                          {item.q}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(item.id);
                          }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: completedQuestions.has(item.id) ? 'none' : '2px solid #cbd5e1',
                            background: completedQuestions.has(item.id) ? '#22c55e' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '700',
                          }}
                        >
                          {completedQuestions.has(item.id) && '✓'}
                        </button>
                        
                        <span style={{
                          color: '#94a3b8',
                          transform: expandedQuestion === item.id ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s',
                          fontSize: '12px',
                        }}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {expandedQuestion === item.id && (
                      <div style={{
                        padding: '0 24px 24px 70px',
                        background: '#fafafa',
                      }}>
                        {/* Answer */}
                        <div style={{
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '20px',
                          marginBottom: '16px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '16px',
                            paddingBottom: '12px',
                            borderBottom: '1px solid #f1f5f9',
                          }}>
                            <span style={{
                              width: '26px',
                              height: '26px',
                              background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                            }}>💡</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af' }}>
                              Sample Answer
                            </span>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            lineHeight: '1.7',
                            color: '#334155',
                          }}>
                            {formatAnswer(item.a)}
                          </div>
                        </div>

                        {/* Tips */}
                        <div style={{
                          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                          border: '1px solid #fde68a',
                          borderRadius: '10px',
                          padding: '16px 20px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                          }}>
                            <span style={{ fontSize: '15px' }}>⚡</span>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Pro Tips
                            </span>
                          </div>
                          <ul style={{
                            margin: 0,
                            paddingLeft: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}>
                            {item.tips.map((tip, i) => (
                              <li key={i} style={{
                                fontSize: '13px',
                                color: '#78350f',
                                lineHeight: '1.6',
                              }}>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', borderRadius: '16px', padding: '32px', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: 'white', flexShrink: 0 }}>SK</div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Sathish Kumar Prakash</div>
                  <div style={{ fontSize: '14px', color: '#93c5fd', marginBottom: '10px' }}>Senior Platform / DevOps / Cloud Engineer &middot; 15+ Years</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['AWS', 'Kubernetes', 'GitHub Actions', 'Terraform', 'Fastlane', 'HashiCorp Vault'].map(function(tag) {
                      return <span key={tag} style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', background: 'rgba(59,130,246,0.3)', border: '1px solid rgba(59,130,246,0.5)', color: '#bfdbfe' }}>{tag}</span>;
                    })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                {[
                  ['📍', 'Bannockburn, IL'],
                  ['🏢', 'Global IT Consultancy @ Enterprise Pharma'],
                  ['🎓', 'M.S. Computer Science, VIT'],
                  ['📧', 'sathishkr.cs@gmail.com'],
                ].map(function(item, i) {
                  return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>{item[0]}</span><span>{item[1]}</span></div>;
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {[
                { value: '15+', label: 'Years Experience', icon: '⏱', color: '#2563eb', bg: '#eff6ff' },
                { value: '60+', label: 'Pipelines Built', icon: '🔄', color: '#0891b2', bg: '#ecfeff' },
                { value: '99.5%', label: 'Pipeline Uptime', icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
                { value: '30%', label: 'Faster Builds', icon: '⚡', color: '#d97706', bg: '#fffbeb' },
                { value: '+45', label: 'Developer NPS', icon: '💚', color: '#9333ea', bg: '#faf5ff' },
                { value: '0', label: 'Secrets Leaked', icon: '🔐', color: '#dc2626', bg: '#fef2f2' },
              ].map(function(s, i) {
                return (
                  <div key={i} style={{ background: s.bg, borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

              <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e40af)', borderRadius: '12px', padding: '24px', color: 'white', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>🎯 Elevator Pitch</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {[
                    { label: 'Opening', text: "Hi, I'm Sathish — Senior Platform Engineer with 15+ years of experience. I started as a full-stack developer, which gives me deep empathy for the developers I now serve." },
                    { label: 'Cloud Focus', text: "For the past 6 years at Global IT Consultancy embedded at Enterprise Pharma, I've owned cloud migration to AWS, built self-service CI/CD on GitHub Actions and Harness, and designed Kubernetes delivery infrastructure for 60+ services." },
                    { label: 'Differentiator', text: "What makes me unique is owning the enterprise mobile build platform — migrating iOS CI/CD from a dedicated Mac build server to GitHub-hosted macOS runners, eliminating Xcode maintenance overhead entirely. Fastlane, Vault OIDC for signing, zero static credentials. That combination is rare." },
                    { label: 'Closing', text: "I work at the intersection of cloud platform engineering and automated delivery — enabling teams to deploy safely, reliably, and at scale without tickets or manual steps." },
                  ].map(function(block, i) {
                    return (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.09)', borderRadius: '8px', padding: '14px 16px', borderLeft: '3px solid #60a5fa' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{block.label}</div>
                        <div style={{ fontSize: '13px', lineHeight: '1.7', color: '#e2e8f0', fontStyle: 'italic' }}>{block.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>⭐ Why You — Key Differentiators</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { icon: '🏗', title: 'Full-stack background + Platform depth', detail: 'Builds developer empathy — rare in platform engineers' },
                    { icon: '📱', title: 'Cloud + Mobile CI/CD (unique in market)', detail: 'Migrated dedicated Mac server to GitHub-hosted runners — zero Xcode maintenance' },
                    { icon: '🏥', title: 'Regulated industry expertise', detail: 'Pharma (Enterprise Pharma) and Finance (Societe Generale)' },
                    { icon: '🎯', title: 'Product mindset for internal platforms', detail: 'Developers as customers, NPS tracking, roadmaps' },
                    { icon: '🔐', title: 'Zero-credential security posture', detail: 'Vault OIDC eliminates all static secrets in CI/CD' },
                    { icon: '👥', title: 'Chapter Lead + technical IC experience', detail: 'Led 6+ developers, mentored juniors to promotion' },
                    { icon: '🔄', title: 'End-to-end delivery ownership', detail: 'Code to pipeline to infra to monitoring to release' },
                  ].map(function(item, i) {
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.detail}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>📊 Quantified Impact — Use These Numbers</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { cat: 'Platform', catColor: '#1d4ed8', catBg: '#eff6ff', before: '2 weeks', after: '2 hours', metric: 'New service onboarding' },
                    { cat: 'Mobile', catColor: '#92400e', catBg: '#fef3c7', before: '45 min', after: '15 min', metric: 'iOS build time (Fastlane)' },
                    { cat: 'Mobile', catColor: '#92400e', catBg: '#fef3c7', before: '2 days', after: '15 min', metric: 'Mobile release cycle' },
                    { cat: 'CI/CD', catColor: '#5b21b6', catBg: '#f5f3ff', before: '95%', after: '99.5%', metric: 'Pipeline reliability' },
                    { cat: 'CI/CD', catColor: '#5b21b6', catBg: '#f5f3ff', before: '60+ pipelines', after: 'migrated', metric: 'Jenkins to GitHub Actions' },
                    { cat: 'Deploy', catColor: '#065f46', catBg: '#ecfdf5', before: 'manual', after: '65% faster', metric: 'Deployment time' },
                    { cat: 'DevEx', catColor: '#166534', catBg: '#f0fdf4', before: 'baseline', after: '+45 NPS', metric: 'Developer satisfaction' },
                  ].map(function(item, i) {
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#f8fafc', borderRadius: '7px' }}>
                        <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700', background: item.catBg, color: item.catColor, minWidth: '48px', textAlign: 'center', flexShrink: 0 }}>{item.cat}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', minWidth: '60px' }}>{item.before}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>→</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a', minWidth: '60px' }}>{item.after}</span>
                        <span style={{ fontSize: '12px', color: '#475569' }}>{item.metric}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>🚀 Career Journey</div>
                <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '20px' }}>
                  {[
                    { role: 'Sr DevOps / Cloud / Platform Engineer', company: 'Global IT Consultancy at Enterprise Pharma', period: '2019 – Present', highlights: ['60+ pipelines migrated to GitHub Actions', 'Mobile CI/CD: dedicated Mac server → GitHub-hosted runners', 'On-prem to AWS EKS migration', 'HashiCorp Vault OIDC — zero static credentials'], current: true },
                    { role: 'Dev Chapter Lead and Lead Developer', company: 'Global IT Consultancy at Societe Generale', period: '2013 – 2019', highlights: ['Led 6+ developer team as Chapter Lead', 'Business Continuity Management suite', 'Angular 2+, Node.js, PL/SQL full-stack'], current: false },
                    { role: 'Member of Technical Staff', company: 'NetApp', period: '2012 – 2013', highlights: ['ExtJS + PHP Zend firmware debugging tools'], current: false },
                    { role: 'Senior Front-End Engineer', company: 'Verismo Networks', period: '2008 – 2012', highlights: ['HTML5 apps for GoogleTV, WD, EnjoyTV Set-Top Boxes'], current: false },
                    { role: 'Software Engineer', company: 'Adsoft Solutions', period: '2007 – 2008', highlights: ['PHP portals for media clients'], current: false },
                  ].map(function(job, i) {
                    return (
                      <div key={i} style={{ marginBottom: '16px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-27px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', background: job.current ? '#3b82f6' : '#cbd5e1', border: job.current ? '2px solid #bfdbfe' : '2px solid #e2e8f0' }} />
                        <div style={{ padding: '12px 14px', background: job.current ? '#eff6ff' : '#f8fafc', borderRadius: '9px', border: job.current ? '1px solid #bfdbfe' : '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{job.role}</div>
                              <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '1px' }}>{job.company}</div>
                            </div>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: job.current ? '#dbeafe' : '#e2e8f0', color: job.current ? '#1d4ed8' : '#475569', fontWeight: '600' }}>{job.period}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {job.highlights.map(function(h, j) {
                              return <span key={j} style={{ fontSize: '11px', color: '#475569', background: 'white', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>{h}</span>;
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>🛠 Full Tech Stack</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { cat: 'Cloud & IaC', color: '#1d4ed8', bg: '#eff6ff', items: ['AWS (EKS, EC2, Lambda, S3, RDS, IAM, CloudWatch, Route 53)', 'Terraform', 'Ansible', 'Packer'] },
                    { cat: 'CI/CD', color: '#0891b2', bg: '#ecfeff', items: ['GitHub Actions', 'Harness', 'Jenkins', 'GitLab CI/CD', 'Nexus', 'Artifactory'] },
                    { cat: 'Mobile', color: '#d97706', bg: '#fffbeb', items: ['Fastlane', 'Xcode CLI', 'Gradle', 'CocoaPods', 'React Native', 'Mendix'] },
                    { cat: 'Containers', color: '#7c3aed', bg: '#faf5ff', items: ['Docker', 'Kubernetes (EKS)', 'Helm', 'Amazon ECS/Fargate'] },
                    { cat: 'Security', color: '#dc2626', bg: '#fef2f2', items: ['HashiCorp Vault', 'OIDC', 'IRSA', 'AWS Security Groups'] },
                    { cat: 'Observability', color: '#059669', bg: '#f0fdf4', items: ['Prometheus', 'Grafana', 'ELK Stack', 'AppDynamics', 'CloudWatch'] },
                    { cat: 'Languages', color: '#475569', bg: '#f8fafc', items: ['Groovy', 'Python', 'Bash', 'TypeScript', 'Java', 'YAML'] },
                  ].map(function(stack, i) {
                    return (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: stack.bg, color: stack.color, whiteSpace: 'nowrap', minWidth: '72px', textAlign: 'center', marginTop: '1px', flexShrink: 0 }}>{stack.cat}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {stack.items.map(function(item, j) {
                            return <span key={j} style={{ fontSize: '12px', color: '#334155', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>{item}</span>;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}
        {activeTab === 'tips' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {/* Focus Areas */}
            <div style={{
              background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              gridColumn: 'span 2',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎯</span> Platform Engineering Interview Focus Areas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {[
                  { topic: 'Internal Developer Platforms', weight: 'High' },
                  { topic: 'Mobile CI/CD (iOS/Android)', weight: 'High' },
                  { topic: 'Self-Service & Golden Paths', weight: 'High' },
                  { topic: 'Kubernetes & EKS', weight: 'High' },
                  { topic: 'GitOps & Deployment', weight: 'Medium-High' },
                  { topic: 'Terraform & IaC', weight: 'Medium-High' },
                  { topic: 'Developer Experience', weight: 'Medium' },
                  { topic: 'DORA Metrics', weight: 'Medium' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>{item.topic}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Priority: {item.weight}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Concepts */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed' }}>
                <span>📚</span> Key Concepts to Know
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#334155', fontSize: '14px' }}>
                <li><strong>Platform Engineering:</strong> Building IDPs for self-service</li>
                <li><strong>Golden Paths:</strong> Opinionated, supported workflows</li>
                <li><strong>DORA Metrics:</strong> Deployment freq, lead time, MTTR, CFR</li>
                <li><strong>Fastlane:</strong> iOS/Android build automation</li>
                <li><strong>Code Signing:</strong> Certificates, profiles, match</li>
                <li><strong>GitOps:</strong> Declarative, Git-driven operations</li>
                <li><strong>Vault OIDC:</strong> Dynamic secrets for CI/CD</li>
              </ul>
            </div>

            {/* Questions to Ask */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb' }}>
                <span>❓</span> Questions to Ask Them
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#334155', fontSize: '14px' }}>
                <li>What's your current platform maturity level?</li>
                <li>Do you have mobile applications? How are they built?</li>
                <li>How do you measure developer productivity?</li>
                <li>What's the developer-to-platform engineer ratio?</li>
                <li>Do you have a developer portal?</li>
                <li>What's the biggest developer pain point today?</li>
                <li>What does success look like in 6 months?</li>
              </ul>
            </div>

            {/* Things to Emphasize */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
                <span>✓</span> Things to Emphasize
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#334155', fontSize: '14px' }}>
                <li>"Developers are my customers"</li>
                <li>Rare combo: Cloud + Mobile platform expertise</li>
                <li>Product mindset for platform work</li>
                <li>Self-service reduces bottlenecks</li>
                <li>Data-driven decisions (metrics, surveys)</li>
                <li>Security built into automation</li>
                <li>Full-stack background helps understand users</li>
              </ul>
            </div>

            {/* Things to Avoid */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
                <span>🚩</span> Things to Avoid Saying
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#334155', fontSize: '14px' }}>
                <li>"We forced teams to adopt our platform"</li>
                <li>"Developers don\'t know what they need"</li>
                <li>Overemphasis on tools vs. outcomes</li>
                <li>"One size fits all" approach</li>
                <li>Ignoring developer feedback</li>
                <li>Not measuring platform success</li>
                <li>Treating platform as pure infrastructure</li>
              </ul>
            </div>

            {/* Recommended Reading */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
                <span>📖</span> Recommended Reading
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  'Team Topologies',
                  'CNCF Platform Engineering',
                  'Accelerate (DORA)',
                  'Fastlane Documentation',
                  'platformengineering.org',
                  'Backstage.io',
                ].map((item, i) => (
                  <span key={i} style={{
                    padding: '6px 12px',
                    background: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#78350f',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <GuideTab categories={categories} allQuestions={allQuestions} />
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '32px',
        color: '#64748b',
        fontSize: '14px',
        borderTop: '1px solid #e2e8f0',
        marginTop: '24px',
      }}>
        💪 Platform Engineering + Mobile CI/CD is a rare and valuable combination. Lead with your unique strengths!
      </div>
    </div>
  );
};

export default InterviewPrep;


