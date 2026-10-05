// ============================================================================
// PyVisualize — live Python playground, powered by Pyodide (CPython -> WASM).
// One Pyodide instance is loaded lazily (on first "Run" anywhere in the app)
// and reused for every topic afterwards, so subsequent runs are instant.
// ============================================================================

var { useState, useEffect, useRef, useCallback } = React;

const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/';

function getPyodideSingleton(onProgress) {
  if (!window.__pyodidePromise) {
    onProgress && onProgress('Downloading the Python runtime (first time only, ~10-20s)…');
    window.__pyodidePromise = loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  }
  return window.__pyodidePromise;
}

// ---------------------------------------------------------------------------
// A minimal code editor: a transparent <textarea> layered over a
// Prism-highlighted <pre>, scroll-synced. No external editor library needed.
// ---------------------------------------------------------------------------
function CodeEditor({ value, onChange, minHeight = 200 }) {
  const preRef = useRef(null);
  const taRef = useRef(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const grammar = (window.Prism && Prism.languages.python) || null;
      setHtml(grammar ? Prism.highlight(value, grammar, 'python') : value.replace(/</g, '&lt;'));
    } catch (e) {
      setHtml(value.replace(/</g, '&lt;'));
    }
  }, [value]);

  const syncScroll = useCallback((e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = e.target;
        const start = el.selectionStart,
          end = el.selectionEnd;
        const newVal = value.slice(0, start) + '    ' + value.slice(end);
        onChange(newVal);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 4;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="relative rounded-lg border border-slate-800 bg-[#0d1420] overflow-hidden" style={{ height: minHeight }}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="absolute inset-0 m-0 p-3 overflow-auto pointer-events-none font-mono text-[13px] leading-6 whitespace-pre-wrap break-words"
      >
        <code dangerouslySetInnerHTML={{ __html: html + '\n' }} />
      </pre>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="code-editor pv-focus absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-cyan-300 font-mono text-[13px] leading-6 resize-none outline-none whitespace-pre-wrap break-words overflow-auto"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// The playground itself
// ---------------------------------------------------------------------------
function CodePlayground({ code, topicId }) {
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | running | done | error
  const [loadingMsg, setLoadingMsg] = useState('');

  useEffect(() => {
    setSource(code);
    setOutput('');
    setStatus('idle');
  }, [topicId, code]);

  const handleRun = useCallback(async () => {
    setOutput('');
    try {
      setStatus(window.__pyodidePromise ? 'running' : 'loading');
      const pyodide = await getPyodideSingleton(setLoadingMsg);
      setStatus('running');
      pyodide.globals.set('_pv_source', source);
      const wrapped = [
        'import sys, io, traceback',
        '_pv_buf = io.StringIO()',
        '_pv_old_stdout = sys.stdout',
        '_pv_old_stderr = sys.stderr',
        'sys.stdout = _pv_buf',
        'sys.stderr = _pv_buf',
        'try:',
        "    exec(compile(_pv_source, '<playground>', 'exec'), {'__name__': '__main__'})",
        'except SystemExit:',
        '    pass',
        'except Exception:',
        '    traceback.print_exc()',
        'finally:',
        '    sys.stdout = _pv_old_stdout',
        '    sys.stderr = _pv_old_stderr',
        '_pv_buf.getvalue()',
      ].join('\n');
      const result = await pyodide.runPythonAsync(wrapped);
      setOutput(result && result.length ? result : '(ran with no output — try adding a print() statement)');
      setStatus('done');
    } catch (err) {
      setOutput('⚠ ' + (err && err.message ? err.message : String(err)));
      setStatus('error');
    }
  }, [source]);

  const isBusy = status === 'loading' || status === 'running';

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0f1622]/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/50">
        <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Live playground — edit &amp; run real Python</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSource(code);
              setOutput('');
              setStatus('idle');
            }}
            className="pv-focus text-xs text-slate-500 hover:text-slate-300 underline decoration-dotted"
          >
            reset code
          </button>
          <button
            onClick={handleRun}
            disabled={isBusy}
            className="pv-focus px-3.5 py-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-800/60 text-xs font-semibold disabled:opacity-50 disabled:cursor-wait flex items-center gap-1.5 transition-colors"
          >
            {status === 'loading' ? (
              <>
                <Spinner /> Loading Python…
              </>
            ) : status === 'running' ? (
              <>
                <Spinner /> Running…
              </>
            ) : (
              <>▶ Run</>
            )}
          </button>
        </div>
      </div>
      <div className="p-3">
        <CodeEditor value={source} onChange={setSource} />
      </div>
      {status === 'loading' && <div className="px-4 pb-1 text-[11px] text-amber-400/90">{loadingMsg}</div>}
      <div className="px-3 pb-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Output</div>
        <pre className="rounded-lg border border-slate-800 bg-black/70 p-3 font-mono text-[12px] text-emerald-400 min-h-[52px] max-h-56 overflow-auto whitespace-pre-wrap">
          {status === 'idle'
            ? 'Click "Run" to execute this exact code with a real Python interpreter (Pyodide), entirely in your browser — no server involved.'
            : status === 'error'
            ? output
            : output || (status === 'done' ? '(no output)' : '')}
        </pre>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3 text-emerald-300" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

window.CodePlayground = CodePlayground;
