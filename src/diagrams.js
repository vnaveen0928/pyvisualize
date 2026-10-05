// ============================================================================
// PyVisualize — diagram engine
//
// Every concept diagram is DATA, not bespoke markup: a topic supplies
// `diagram = { type, steps: [...], caption? }` and one of the renderer
// components below turns each step into a picture. All renderers share the
// same "step forward / step back" contract — nothing autoplays.
//
// Renderer types implemented here, and which topics use them:
//   box       - labeled variable -> value-bubble pointers (variables, casting, type hints)
//   sequence  - index/key based blocks: list/tuple/set/dict/string, incl. pipelines (map/filter/reduce)
//   trace     - line-by-line code execution highlight + live state table + console
//   stack     - call-stack frames pushed/popped (functions, *args/**kwargs, scope, closures-call)
//   tree      - node/edge tree (inheritance, MRO, ABCs, modules/packages, class->instance)
//   pull      - lazy "pull one value at a time" animation (generators, iterators)
//   wrap      - box-inside-box wrapping (decorators, context managers, functools, descriptors)
//   backpack  - inner function carrying enclosing scope (closures)
//   timeline  - Gantt-style concurrency bars (threading, multiprocessing, asyncio)
//   key       - single token passed between threads (the GIL)
//   heap      - objects with refcounts fading out (memory management / GC)
//   flow      - flowchart with an active path (if/elif, try/except, encapsulation, descriptors, I/O)
//   regex     - text with highlighted matching spans, advancing cursor
// ============================================================================

// NOTE: classic (non-module) <script> tags share one global lexical scope,
// so these hook references use `var` (redeclare-safe) rather than `const`/`let`,
// which would throw a SyntaxError the second time another file destructures React.
var { useState, useEffect, useMemo } = React;

// ---------------------------------------------------------------------------
// Shared chrome: step controls + the frame every diagram sits inside
// ---------------------------------------------------------------------------

function StepControls({ step, setStep, total }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
      <button
        onClick={() => setStep((s) => Math.max(0, s - 1))}
        disabled={step === 0}
        className="pv-focus px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors"
      >
        ← Step back
      </button>
      <span className="text-xs font-mono text-slate-500 px-2 min-w-[70px] text-center">
        step {step + 1} / {total}
      </span>
      <button
        onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
        disabled={step === total - 1}
        className="pv-focus px-3 py-1.5 rounded-lg text-sm font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed border border-cyan-800/60 transition-colors"
      >
        Step forward →
      </button>
      {step !== 0 && (
        <button
          onClick={() => setStep(0)}
          className="pv-focus px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 underline decoration-dotted"
        >
          reset
        </button>
      )}
    </div>
  );
}

function DiagramShell({ children, step, setStep, total, note }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1420] p-4 md:p-6">
      <div className="min-h-[200px] flex items-center justify-center overflow-x-auto py-2">
        {children}
      </div>
      {note && (
        <p key={step} className="animate-in mt-4 text-sm text-slate-400 text-center leading-relaxed">
          {note}
        </p>
      )}
      <StepControls step={step} setStep={setStep} total={total} />
    </div>
  );
}

function useStep(total) {
  const [step, setStep] = useState(0);
  const clamped = Math.min(step, total - 1);
  return [clamped, setStep];
}

// small helper badge
function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-800/60',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-800/60',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-800/60',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-800/60',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-800/60',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-mono ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// 1. BOX — variables as labels pointing to value "bubbles"
// steps: [{ bubbles: [{id, value, tone?}], labels: [{name, bubbleId, typeTag?}], note }]
// ---------------------------------------------------------------------------
function BoxDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="flex flex-col gap-4">
          {s.labels.map((lab) => (
            <div key={lab.name} className="flex items-center gap-3 animate-in">
              <div className="diagram-node px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 font-mono text-sm text-slate-200 min-w-[90px] text-center">
                {lab.name}
                {lab.typeTag && <div className="text-[10px] text-cyan-400 mt-0.5">{lab.typeTag}</div>}
              </div>
              <svg width="60" height="24" className="diagram-arrow shrink-0">
                <defs>
                  <marker id={`arrow-${lab.name}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" />
                  </marker>
                </defs>
                <line x1="0" y1="12" x2="52" y2="12" stroke="#22d3ee" strokeWidth="2" markerEnd={`url(#arrow-${lab.name})`} />
              </svg>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 justify-center">
          {s.bubbles.map((b) => {
            const referenced = s.labels.some((l) => l.bubbleId === b.id);
            return (
              <div
                key={b.id}
                className={`diagram-node animate-pop w-24 h-24 rounded-full border-2 flex items-center justify-center font-mono text-sm text-center px-2 ${
                  referenced ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 glow-ring' : 'border-slate-700 bg-slate-900/60 text-slate-500 opacity-50'
                }`}
              >
                {b.value}
              </div>
            );
          })}
        </div>
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 2. SEQUENCE — indexable / keyed collections, optionally a transform pipeline
// steps: [{ mode: 'list'|'dict'|'set'|'string'|'pipeline', items:[{key,value,id,tone,removed?,added?}], resultItems?:[...], fnLabel?, note }]
// ---------------------------------------------------------------------------
function SeqBlock({ item }) {
  const toneClass = {
    add: 'border-emerald-400 bg-emerald-500/10 text-emerald-100 animate-pop',
    remove: 'border-rose-400 bg-rose-500/10 text-rose-200 opacity-40 line-through',
    active: 'border-cyan-400 bg-cyan-500/10 text-cyan-100 glow-ring',
    default: 'border-slate-700 bg-slate-800/80 text-slate-200',
  }[item.tone || 'default'];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`diagram-node min-w-[52px] h-12 px-2 rounded-lg border-2 flex items-center justify-center font-mono text-sm ${toneClass}`}>
        {item.key !== undefined ? (
          <span>
            <span className="text-violet-300">{item.key}</span>
            <span className="text-slate-500">:</span> {item.value}
          </span>
        ) : (
          item.value
        )}
      </div>
      {item.index !== undefined && <span className="text-[10px] font-mono text-slate-500">{item.index}</span>}
    </div>
  );
}

function SequenceDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  const isSet = s.mode === 'set';
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex flex-col items-center gap-6 w-full">
        <div className={`flex gap-3 flex-wrap justify-center ${isSet ? 'max-w-md' : ''}`}>
          {s.items.map((it) => (
            <SeqBlock key={it.id} item={it} />
          ))}
          {s.items.length === 0 && <span className="text-slate-600 font-mono text-sm">empty</span>}
        </div>
        {s.mode === 'pipeline' && (
          <>
            <div className="flex items-center gap-2 text-slate-500">
              <svg width="2" height="28"><line x1="1" y1="0" x2="1" y2="28" stroke="#334155" strokeWidth="2" strokeDasharray="4 3" /></svg>
            </div>
            <div className="px-4 py-2 rounded-lg border border-violet-700 bg-violet-500/10 text-violet-200 font-mono text-sm">
              {s.fnLabel}
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <svg width="2" height="28"><line x1="1" y1="0" x2="1" y2="28" stroke="#334155" strokeWidth="2" strokeDasharray="4 3" /></svg>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {(s.resultItems || []).map((it) => (
                <SeqBlock key={it.id} item={it} />
              ))}
            </div>
          </>
        )}
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 3. TRACE — line-by-line execution: code lines + live variable table + console
// steps: [{ activeLine (0-indexed into diagram.code), vars: {name:value}, output: [strings], note }]
// diagram.code: string (multi-line)
// ---------------------------------------------------------------------------
function TraceDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  const lines = diagram.code.split('\n');
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="grid md:grid-cols-2 gap-5 w-full items-start text-left">
        <div className="rounded-lg border border-slate-800 bg-[#0a0f18] overflow-hidden">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`px-3 py-1 font-mono text-[13px] whitespace-pre transition-colors duration-300 ${
                i === s.activeLine ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-100' : 'border-l-2 border-transparent text-slate-400'
              }`}
            >
              <span className="text-slate-600 select-none mr-3">{String(i + 1).padStart(2, '0')}</span>
              {line || ' '}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Variables</div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 flex flex-wrap gap-2 min-h-[44px]">
              {Object.keys(s.vars || {}).length === 0 && <span className="text-slate-600 text-xs">— none yet —</span>}
              {Object.entries(s.vars || {}).map(([k, v]) => (
                <div key={k} className="animate-pop px-2 py-1 rounded-md bg-slate-800 border border-slate-700 font-mono text-xs">
                  <span className="text-violet-300">{k}</span> <span className="text-slate-500">=</span> <span className="text-emerald-300">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Console output</div>
            <div className="rounded-lg border border-slate-800 bg-black/60 p-3 font-mono text-xs min-h-[44px] text-emerald-400 space-y-0.5">
              {(s.output || []).length === 0 && <span className="text-slate-600">— nothing printed yet —</span>}
              {(s.output || []).map((line, i) => (
                <div key={i} className="animate-in">
                  &gt; {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 4. STACK — call frames pushed/popped
// steps: [{ frames: [{id, name, args, locals, returning?}], note }]
// ---------------------------------------------------------------------------
function StackDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex flex-col-reverse gap-2 w-full max-w-md">
        {s.frames.length === 0 && <div className="text-slate-600 font-mono text-sm text-center py-6">stack empty</div>}
        {s.frames.map((f, i) => (
          <div
            key={f.id}
            className={`diagram-node animate-float rounded-lg border-2 px-4 py-2.5 font-mono text-sm ${
              f.returning
                ? 'border-amber-400 bg-amber-500/10 text-amber-100'
                : i === s.frames.length - 1
                ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 glow-ring'
                : 'border-slate-700 bg-slate-800/70 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span>
                {f.name}({f.args})
              </span>
              {f.returning && <span className="text-[10px] text-amber-300">returns {f.returning}</span>}
            </div>
            {f.locals && <div className="text-[11px] text-slate-500 mt-1">locals: {f.locals}</div>}
          </div>
        ))}
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 5. TREE — node/edge diagrams: inheritance, MRO, packages, class->instance
// steps: [{ nodes: [{id, label, x, y, tone?, sub?}], edges: [{from,to,label?}], note }]
// coordinates are 0..100 (percent-based) so the diagram scales
// ---------------------------------------------------------------------------
function TreeDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  const W = 480,
    H = 260;
  const pos = (n) => ({ x: (n.x / 100) * W, y: (n.y / 100) * H });
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl" style={{ minHeight: 220 }}>
        {s.edges.map((e, i) => {
          const a = pos(s.nodes.find((n) => n.id === e.from));
          const b = pos(s.nodes.find((n) => n.id === e.to));
          if (!a || !b) return null;
          return (
            <g key={i} className="diagram-arrow">
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={e.tone === 'active' ? '#22d3ee' : '#334155'} strokeWidth={e.tone === 'active' ? 2.5 : 1.5} />
              {e.label && (
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} fontSize="9" fill="#64748b" textAnchor="middle">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {s.nodes.map((n) => {
          const p = pos(n);
          const tone =
            n.tone === 'active'
              ? { fill: 'rgba(34,211,238,0.15)', stroke: '#22d3ee', text: '#a5f3fc' }
              : n.tone === 'abstract'
              ? { fill: 'rgba(167,139,250,0.12)', stroke: '#8b5cf6', text: '#ddd6fe' }
              : { fill: '#1e293b', stroke: '#475569', text: '#cbd5e1' };
          const w = Math.max(56, n.label.length * 7 + 18);
          return (
            <g key={n.id} className="diagram-node" transform={`translate(${p.x - w / 2}, ${p.y - 14})`}>
              <rect width={w} height="28" rx="7" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.5" />
              <text x={w / 2} y="18" fontSize="11" textAnchor="middle" fill={tone.text} fontFamily="monospace">
                {n.label}
              </text>
              {n.sub && (
                <text x={w / 2} y="40" fontSize="9" textAnchor="middle" fill="#64748b" fontFamily="monospace">
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 6. PULL — lazy generation: values produced one at a time "on request"
// steps: [{ produced: [values], requesting: bool, exhausted?: bool, note }]
// ---------------------------------------------------------------------------
function PullDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 font-mono text-sm text-slate-300">consumer</div>
          <svg width="70" height="20">
            <defs>
              <marker id="pullArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={s.requesting ? '#f59e0b' : '#334155'} />
              </marker>
            </defs>
            <line x1="65" y1="10" x2="5" y2="10" stroke={s.requesting ? '#f59e0b' : '#334155'} strokeWidth="2" markerEnd="url(#pullArrow)" className="diagram-arrow" />
          </svg>
          <div
            className={`px-4 py-2 rounded-lg border-2 font-mono text-sm ${
              s.exhausted ? 'border-rose-700 bg-rose-500/10 text-rose-300' : s.requesting ? 'border-amber-400 bg-amber-500/10 text-amber-100 animate-pulseGlow' : 'border-slate-700 bg-slate-800 text-slate-300'
            }`}
          >
            generator {s.exhausted ? '(exhausted → StopIteration)' : s.requesting ? '(computing next value…)' : '(paused, waiting)'}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-center min-h-[48px] items-center">
          <span className="text-xs text-slate-500 mr-1">produced so far:</span>
          {s.produced.length === 0 && <span className="text-slate-600 font-mono text-xs">(nothing yet)</span>}
          {s.produced.map((v, i) => (
            <div key={i} className="animate-pop px-3 py-1.5 rounded-md border border-emerald-700 bg-emerald-500/10 text-emerald-200 font-mono text-sm">
              {v}
            </div>
          ))}
        </div>
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 7. WRAP — box-inside-box wrapping: decorators, context managers, functools, descriptors
// steps: [{ layers: [{label, active}], resultLabel?, note }]  outer-to-inner order
// ---------------------------------------------------------------------------
function WrapDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex flex-col items-center gap-4">
        <Nested layers={s.layers} />
        {s.resultLabel && <Chip tone="emerald">{s.resultLabel}</Chip>}
      </div>
    </DiagramShell>
  );
}
function Nested({ layers }) {
  if (!layers.length) return null;
  const [first, ...rest] = layers;
  return (
    <div
      className={`diagram-node animate-in rounded-xl border-2 p-4 flex flex-col items-center gap-3 ${
        first.active ? 'border-cyan-400 bg-cyan-500/5 glow-ring' : 'border-slate-700 bg-slate-900/40'
      }`}
    >
      <span className={`font-mono text-xs ${first.active ? 'text-cyan-300' : 'text-slate-400'}`}>{first.label}</span>
      {rest.length > 0 ? <Nested layers={rest} /> : <span className="text-[10px] text-slate-600 font-mono px-3 py-2 border border-dashed border-slate-700 rounded-lg">original function</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. BACKPACK — closure carrying enclosing scope
// steps: [{ enclosingVars: [{name,value}], innerActive: bool, note }]
// ---------------------------------------------------------------------------
function BackpackDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="relative flex flex-col items-center">
        <div
          className={`diagram-node rounded-xl border-2 px-8 py-5 font-mono text-sm ${
            s.innerActive ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 glow-ring' : 'border-slate-700 bg-slate-800/70 text-slate-300'
          }`}
        >
          inner()
        </div>
        <svg width="4" height="26"><line x1="2" y1="0" x2="2" y2="26" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" /></svg>
        <div className="rounded-2xl border-2 border-amber-600 bg-amber-500/5 px-5 py-3 -mt-1">
          <div className="text-[10px] uppercase tracking-wide text-amber-400 mb-2 text-center">🎒 backpack (enclosing scope)</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {s.enclosingVars.map((v) => (
              <div key={v.name} className="px-2 py-1 rounded-md bg-slate-900/60 border border-amber-800/60 font-mono text-xs text-amber-200">
                {v.name} = {v.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 9. TIMELINE — Gantt-style concurrency bars
// steps: [{ lanes: [{label, segments:[{startPct,widthPct,tone}]}], cursorPct?, note }]
// ---------------------------------------------------------------------------
function TimelineDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  const toneBg = { run: 'bg-cyan-500', wait: 'bg-slate-700', io: 'bg-amber-500', done: 'bg-emerald-600' };
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="w-full max-w-xl flex flex-col gap-3">
        {s.lanes.map((lane) => (
          <div key={lane.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 font-mono text-xs text-slate-400 text-right">{lane.label}</span>
            <div className="relative flex-1 h-7 bg-slate-900/60 rounded-md border border-slate-800 overflow-hidden">
              {lane.segments.map((seg, i) => (
                <div
                  key={i}
                  className={`diagram-node absolute top-0 h-full rounded-sm ${toneBg[seg.tone] || toneBg.run} ${seg.tone === 'run' ? 'opacity-90' : 'opacity-70'}`}
                  style={{ left: `${seg.startPct}%`, width: `${seg.widthPct}%` }}
                />
              ))}
              {s.cursorPct !== undefined && (
                <div className="absolute top-0 h-full w-[2px] bg-white/80" style={{ left: `${s.cursorPct}%` }} />
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 justify-center mt-1 text-[10px] font-mono text-slate-500">
          <span><span className="inline-block w-2 h-2 bg-cyan-500 rounded-sm mr-1" />running</span>
          <span><span className="inline-block w-2 h-2 bg-amber-500 rounded-sm mr-1" />waiting on I/O</span>
          <span><span className="inline-block w-2 h-2 bg-slate-700 rounded-sm mr-1" />idle</span>
          <span><span className="inline-block w-2 h-2 bg-emerald-600 rounded-sm mr-1" />done</span>
        </div>
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 10. KEY — the GIL: a single token passed between threads
// steps: [{ threads: [{name, hasKey, waiting}], note }]
// ---------------------------------------------------------------------------
function KeyDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex gap-8 flex-wrap justify-center">
        {s.threads.map((t) => (
          <div key={t.name} className="flex flex-col items-center gap-2">
            <div
              className={`diagram-node w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center font-mono text-xs ${
                t.hasKey ? 'border-amber-400 bg-amber-500/10 text-amber-100 glow-ring animate-pulseGlow' : 'border-slate-700 bg-slate-900/50 text-slate-500'
              }`}
            >
              {t.hasKey && <span className="text-xl mb-1">🔑</span>}
              {t.name}
              <span className="text-[10px] mt-0.5">{t.hasKey ? 'running' : t.waiting ? 'blocked' : 'idle'}</span>
            </div>
          </div>
        ))}
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 11. HEAP — objects with refcounts; garbage collected ones fade out
// steps: [{ objects: [{id,label,refcount,collected?}], note }]
// ---------------------------------------------------------------------------
function HeapDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex gap-6 flex-wrap justify-center">
        {s.objects.map((o) => (
          <div
            key={o.id}
            className={`diagram-node w-28 rounded-lg border-2 px-3 py-3 text-center font-mono text-xs transition-opacity ${
              o.collected ? 'opacity-20 border-rose-800 bg-rose-950/30 text-rose-500' : o.refcount === 0 ? 'border-amber-500 bg-amber-500/10 text-amber-200 animate-pulseGlow' : 'border-slate-700 bg-slate-800/70 text-slate-200'
            }`}
          >
            <div className="mb-1">{o.label}</div>
            <div className="text-[10px] text-slate-500">refcount: <span className={o.refcount === 0 ? 'text-amber-300' : 'text-cyan-300'}>{o.refcount}</span></div>
            {o.collected && <div className="text-[10px] mt-1">🗑 collected</div>}
          </div>
        ))}
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 12. FLOW — flowchart with an active path highlighted
// steps: [{ nodes:[{id,label,x,y,shape:'start'|'end'|'decision'|'process',active}], edges:[{from,to,label?,active}], note }]
// ---------------------------------------------------------------------------
function FlowDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  const W = 480,
    H = 260;
  const pos = (n) => ({ x: (n.x / 100) * W, y: (n.y / 100) * H });
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl" style={{ minHeight: 230 }}>
        <defs>
          <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#334155" />
          </marker>
          <marker id="flowArrowActive" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" />
          </marker>
        </defs>
        {s.edges.map((e, i) => {
          const a = pos(s.nodes.find((n) => n.id === e.from));
          const b = pos(s.nodes.find((n) => n.id === e.to));
          if (!a || !b) return null;
          return (
            <g key={i} className="diagram-arrow">
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={e.active ? '#22d3ee' : '#334155'}
                strokeWidth={e.active ? 2.5 : 1.5}
                markerEnd={e.active ? 'url(#flowArrowActive)' : 'url(#flowArrow)'}
              />
              {e.label && (
                <text x={(a.x + b.x) / 2 + 6} y={(a.y + b.y) / 2} fontSize="9" fill={e.active ? '#67e8f9' : '#64748b'}>
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {s.nodes.map((n) => {
          const p = pos(n);
          const w = Math.max(60, n.label.length * 6.5 + 20);
          const h = n.shape === 'decision' ? 40 : 30;
          const tone = n.active ? { fill: 'rgba(34,211,238,0.15)', stroke: '#22d3ee', text: '#a5f3fc' } : { fill: '#1e293b', stroke: '#475569', text: '#cbd5e1' };
          return (
            <g key={n.id} className="diagram-node" transform={`translate(${p.x - w / 2}, ${p.y - h / 2})`}>
              {n.shape === 'decision' ? (
                <polygon points={`${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`} fill={tone.fill} stroke={tone.stroke} strokeWidth="1.5" />
              ) : n.shape === 'start' || n.shape === 'end' ? (
                <rect width={w} height={h} rx={h / 2} fill={tone.fill} stroke={tone.stroke} strokeWidth="1.5" />
              ) : (
                <rect width={w} height={h} rx="6" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.5" />
              )}
              <text x={w / 2} y={h / 2 + 4} fontSize="10" textAnchor="middle" fill={tone.text} fontFamily="monospace">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// 13. REGEX — text with highlighted matching spans + moving cursor
// steps: [{ text, spans: [{start,end}], cursor?, note }]
// ---------------------------------------------------------------------------
function RegexDiagram({ diagram }) {
  const [step, setStep] = useStep(diagram.steps.length);
  const s = diagram.steps[step];
  const chars = s.text.split('');
  return (
    <DiagramShell step={step} setStep={setStep} total={diagram.steps.length} note={s.note}>
      <div className="flex flex-wrap justify-center gap-0.5 font-mono text-base leading-loose">
        {chars.map((c, i) => {
          const inSpan = (s.spans || []).some((sp) => i >= sp.start && i < sp.end);
          const atCursor = s.cursor === i;
          return (
            <span
              key={i}
              className={`diagram-node inline-block px-1 rounded ${inSpan ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-600' : 'text-slate-400'} ${
                atCursor ? 'ring-2 ring-amber-400' : ''
              }`}
            >
              {c === ' ' ? ' ' : c}
            </span>
          );
        })}
      </div>
    </DiagramShell>
  );
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
const DIAGRAM_RENDERERS = {
  box: BoxDiagram,
  sequence: SequenceDiagram,
  trace: TraceDiagram,
  stack: StackDiagram,
  tree: TreeDiagram,
  pull: PullDiagram,
  wrap: WrapDiagram,
  backpack: BackpackDiagram,
  timeline: TimelineDiagram,
  key: KeyDiagram,
  heap: HeapDiagram,
  flow: FlowDiagram,
  regex: RegexDiagram,
};

function ConceptDiagram({ diagram }) {
  if (!diagram || !diagram.type || !diagram.steps || diagram.steps.length === 0) {
    return <div className="text-slate-500 text-sm italic">No diagram configured for this topic yet.</div>;
  }
  const Renderer = DIAGRAM_RENDERERS[diagram.type];
  if (!Renderer) {
    return <div className="text-rose-400 text-sm">Unknown diagram type: {diagram.type}</div>;
  }
  return <Renderer diagram={diagram} />;
}

window.ConceptDiagram = ConceptDiagram;
