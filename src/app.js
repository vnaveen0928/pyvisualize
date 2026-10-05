// ============================================================================
// PyVisualize — main application shell
// Sidebar (search + collapsible topic tree) + top progress bar + topic panel
// (explanation -> diagram -> code -> playground -> challenge -> mistakes)
// ============================================================================

var { useState, useMemo, useEffect, useCallback } = React;

const GROUPS = ['Basics', 'Intermediate', 'Advanced'];
const ALL_TOPICS = [...window.TOPICS_BASICS, ...window.TOPICS_INTERMEDIATE, ...window.TOPICS_ADVANCED];
const TOPICS_BY_GROUP = Object.fromEntries(GROUPS.map((g) => [g, ALL_TOPICS.filter((t) => t.group === g)]));
const TOPIC_INDEX = Object.fromEntries(ALL_TOPICS.map((t, i) => [t.id, i]));

// ---------------------------------------------------------------------------
// Read-only, syntax-highlighted code block (for the static example + solution)
// ---------------------------------------------------------------------------
function StaticCode({ code, label }) {
  const html = useMemo(() => {
    try {
      return Prism.highlight(code, Prism.languages.python, 'python');
    } catch (e) {
      return code.replace(/</g, '&lt;');
    }
  }, [code]);
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800">
      {label && (
        <div className="px-3 py-1.5 bg-slate-900/70 border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      )}
      <pre className="language-python !rounded-none !border-0 !m-0 overflow-x-auto">
        <code className="language-python" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar({ currentId, onSelect, completed, search, setSearch, collapsedGroups, toggleGroup, sidebarOpen, setSidebarOpen }) {
  const query = search.trim().toLowerCase();

  const visibleByGroup = useMemo(() => {
    const out = {};
    for (const g of GROUPS) {
      out[g] = query ? TOPICS_BY_GROUP[g].filter((t) => t.title.toLowerCase().includes(query)) : TOPICS_BY_GROUP[g];
    }
    return out;
  }, [query]);

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside
        className={`fixed md:sticky top-0 z-40 md:z-0 h-screen w-[300px] shrink-0 border-r border-slate-800 bg-[#0b0f16] flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🐍</span>
            <div>
              <div className="font-bold text-slate-100 leading-tight">PyVisualize</div>
              <div className="text-[11px] text-slate-500 leading-tight">learn Python, visually</div>
            </div>
            <button className="ml-auto md:hidden text-slate-500 hover:text-slate-200 px-2" onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics…"
              className="pv-focus w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-700"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {GROUPS.map((group) => {
            const topics = visibleByGroup[group];
            if (query && topics.length === 0) return null;
            const collapsed = collapsedGroups.has(group) && !query;
            return (
              <div key={group} className="mb-1">
                <button
                  onClick={() => toggleGroup(group)}
                  className="pv-focus w-full flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 rounded-md"
                >
                  <span className="flex items-center gap-1.5">
                    <GroupDot group={group} />
                    {group}
                    <span className="text-slate-600 font-normal normal-case">
                      ({TOPICS_BY_GROUP[group].filter((t) => completed.has(t.id)).length}/{TOPICS_BY_GROUP[group].length})
                    </span>
                  </span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${collapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {!collapsed && (
                  <ul className="ml-2.5 pl-3 tree-line">
                    {topics.map((t) => {
                      const active = t.id === currentId;
                      const done = completed.has(t.id);
                      return (
                        <li key={t.id}>
                          <button
                            onClick={() => {
                              onSelect(t.id);
                              setSidebarOpen(false);
                            }}
                            className={`pv-focus w-full flex items-center gap-2 text-left px-2.5 py-1.5 my-0.5 rounded-md text-[13px] transition-colors ${
                              active ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-800/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full shrink-0 border flex items-center justify-center text-[9px] ${done ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-600 text-transparent'}`}>
                              {done ? '✓' : ''}
                            </span>
                            <span className="truncate">{t.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
          {query && GROUPS.every((g) => visibleByGroup[g].length === 0) && (
            <div className="text-center text-slate-600 text-sm py-8">No topics match "{search}"</div>
          )}
        </nav>
      </aside>
    </>
  );
}

function GroupDot({ group }) {
  const color = { Basics: 'bg-emerald-400', Intermediate: 'bg-amber-400', Advanced: 'bg-violet-400' }[group];
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />;
}

// ---------------------------------------------------------------------------
// Top bar: progress
// ---------------------------------------------------------------------------
function TopBar({ completedCount, total, onMenu }) {
  const pct = Math.round((completedCount / total) * 100);
  return (
    <header className="sticky top-0 z-20 bg-[#0b0f16]/90 backdrop-blur border-b border-slate-800 px-4 md:px-6 py-3 flex items-center gap-4">
      <button className="md:hidden text-slate-400 hover:text-slate-200" onClick={onMenu}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1 flex items-center gap-3 max-w-md">
        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
          {completedCount} / {total} topics
        </span>
        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-mono text-cyan-300 w-9 text-right">{pct}%</span>
      </div>
      <div className="hidden sm:block text-[11px] text-slate-600 font-mono">Python, from zero to advanced — self-paced</div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Section chrome for the topic panel
// ---------------------------------------------------------------------------
function Section({ index, title, children }) {
  return (
    <section className="mb-8 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-mono text-cyan-300">{index}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Challenge({ challenge }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  return (
    <div className="rounded-xl border border-violet-900/50 bg-violet-500/[0.04] p-4 md:p-5">
      <p className="text-sm text-slate-300 leading-relaxed mb-3">{challenge.prompt}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowHint((v) => !v)}
          className="pv-focus text-xs px-3 py-1.5 rounded-md border border-amber-800/60 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
        >
          {showHint ? 'Hide hint' : '💡 Show hint'}
        </button>
        <button
          onClick={() => setShowSolution((v) => !v)}
          className="pv-focus text-xs px-3 py-1.5 rounded-md border border-emerald-800/60 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
        >
          {showSolution ? 'Hide solution' : '✅ Show solution'}
        </button>
      </div>
      {showHint && <p className="animate-in mt-3 text-xs text-amber-200/90 italic">{challenge.hint}</p>}
      {showSolution && (
        <div className="animate-in mt-3">
          <StaticCode code={challenge.solution} />
        </div>
      )}
    </div>
  );
}

function Mistakes({ mistakes }) {
  return (
    <ul className="space-y-2.5">
      {mistakes.map((m, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
          <span className="shrink-0 text-amber-400 mt-0.5">⚠</span>
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Topic panel
// ---------------------------------------------------------------------------
function TopicPanel({ topic, completed, onToggleComplete, onNavigate }) {
  const idx = TOPIC_INDEX[topic.id];
  const prev = ALL_TOPICS[idx - 1];
  const next = ALL_TOPICS[idx + 1];
  const done = completed.has(topic.id);

  return (
    <div key={topic.id} className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <Chip tone={{ Basics: 'emerald', Intermediate: 'amber', Advanced: 'violet' }[topic.group]}>{topic.group}</Chip>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-50 mt-2">{topic.title}</h1>
        </div>
        <button
          onClick={() => onToggleComplete(topic.id)}
          className={`pv-focus shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            done ? 'bg-emerald-500/15 border-emerald-700 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
          }`}
        >
          {done ? '✓ Completed' : 'Mark as complete'}
        </button>
      </div>

      <Section index={1} title="What it is">
        <p className="text-[15px] text-slate-300 leading-relaxed">{topic.explanation}</p>
      </Section>

      <Section index={2} title="Visualize it">
        <ConceptDiagram diagram={topic.diagram} />
      </Section>

      <Section index={3} title="Example">
        <StaticCode code={topic.code} />
      </Section>

      <Section index={4} title="Playground">
        <CodePlayground code={topic.playgroundCode} topicId={topic.id} />
      </Section>

      <Section index={5} title="Try it yourself">
        <Challenge challenge={topic.challenge} />
      </Section>

      <Section index={6} title="Common mistakes">
        <Mistakes mistakes={topic.mistakes} />
      </Section>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
        <button
          disabled={!prev}
          onClick={() => prev && onNavigate(prev.id)}
          className="pv-focus px-3.5 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← {prev ? prev.title : ''}
        </button>
        <button
          disabled={!next}
          onClick={() => next && onNavigate(next.id)}
          className="pv-focus px-3.5 py-2 rounded-lg text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {next ? next.title : ''} →
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
function App() {
  const [currentId, setCurrentId] = useState(ALL_TOPICS[0].id);
  const [completed, setCompleted] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const topic = ALL_TOPICS[TOPIC_INDEX[currentId]] || ALL_TOPICS[0];

  const toggleGroup = useCallback((g) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  }, []);

  const onToggleComplete = useCallback((id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const onNavigate = useCallback((id) => {
    setCurrentId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    document.title = `${topic.title} — PyVisualize`;
  }, [topic.title]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentId={currentId}
        onSelect={onNavigate}
        completed={completed}
        search={search}
        setSearch={setSearch}
        collapsedGroups={collapsedGroups}
        toggleGroup={toggleGroup}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 min-w-0">
        <TopBar completedCount={completed.size} total={ALL_TOPICS.length} onMenu={() => setSidebarOpen(true)} />
        <main>
          <TopicPanel topic={topic} completed={completed} onToggleComplete={onToggleComplete} onNavigate={onNavigate} />
        </main>
        <footer className="text-center text-xs text-slate-700 pb-8">
          PyVisualize — built for self-study. {ALL_TOPICS.length} topics, Basics → Intermediate → Advanced.
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
