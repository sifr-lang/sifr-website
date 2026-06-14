import React, { useState, useId, useCallback } from 'react';
import { 
  Terminal, 
  User, 
  Cpu, 
  FileJson, 
  Sparkles,
} from 'lucide-react';
import { highlightLineText } from './AnimatedPipeline';

export function AgentCompilerSection() {
  const [activeTab, setActiveTab] = useState<'human' | 'compact' | 'json'>('human');
  const tabListId = useId();
  const humanPanelId = useId();
  const compactPanelId = useId();
  const jsonPanelId = useId();

  const pythonCodeError = `def add_one(x: int | None) -> int:
    return x + 1

def main():
    print(add_one(41))`;

  const tabs = [
    { id: 'human' as const, label: 'Human View', icon: User, iconClass: 'text-sky-700', panelId: humanPanelId },
    { id: 'compact' as const, label: 'Compact (Agent)', icon: Cpu, iconClass: 'text-amber-600', panelId: compactPanelId },
    { id: 'json' as const, label: 'JSON (Automation)', icon: FileJson, iconClass: 'text-emerald-600', panelId: jsonPanelId },
  ];

  const focusTab = useCallback((tabId: typeof activeTab) => {
    const button = document.getElementById(`${tabListId}-${tabId}`);
    button?.focus();
  }, [tabListId]);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tabId: typeof activeTab) => {
    const order: Array<typeof activeTab> = ['human', 'compact', 'json'];
    const currentIndex = order.indexOf(tabId);

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = order[(currentIndex + 1) % order.length];
      setActiveTab(next);
      focusTab(next);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = order[(currentIndex - 1 + order.length) % order.length];
      setActiveTab(next);
      focusTab(next);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveTab('human');
      focusTab('human');
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveTab('json');
      focusTab('json');
    }
  };

  return (
    <section className="bg-zinc-50/50 py-16 md:py-24 border-t border-b border-zinc-200/60" id="agent-compiler" aria-labelledby="agent-compiler-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center items-center">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100/80 shadow-xs mb-1" aria-hidden="true">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider text-sky-700 uppercase">AI-Agent &amp; Human Centered</span>
          <h2 id="agent-compiler-heading" className="font-display text-3xl md:text-4xl font-extrabold text-zinc-950">
            A Compiler Agents Can Read
          </h2>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
            Sifr is built for the way software is written now: by humans and AI agents working together.
            <br />
            <strong className="font-bold text-zinc-900">Humans need code they can read. Agents need errors they can parse.</strong>
            <br />
            Both need a compiler that stops bad assumptions before they ship.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 -mb-2">
          <div
            className="inline-flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/85 shadow-inner max-w-xl w-full sm:w-auto overflow-x-auto scrollbar-none"
            role="tablist"
            aria-label="Compiler diagnostic output format"
            id={tabListId}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`${tabListId}-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={tab.panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                  className={`flex-1 sm:flex-initial px-4 md:px-5 py-2.5 text-xs md:text-sm rounded-xl font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200/40 text-sky-700 scale-[1.01]'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.iconClass}`} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <p className="text-center text-zinc-600 text-xs md:text-sm font-sans tracking-tight mt-1">
            Readable for humans. Parseable for agents. <span className="text-zinc-800 font-semibold">Strict enough to stop both from shipping unsafe code.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md uppercase border border-zinc-200/60">
                Source Code
              </span>
              <span className="text-[11px] text-zinc-600 font-sans tracking-tight">
                Contains an active type bug
              </span>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-[11.5px] leading-relaxed text-zinc-300 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" aria-hidden="true" />
                    <span className="text-[10.5px] text-zinc-400 font-sans ml-1.5">main.sifr</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded font-semibold">
                    Pythonic Syntax
                  </span>
                </div>
                <pre className="select-text whitespace-pre overflow-x-auto text-[11.5px] text-zinc-300 leading-relaxed font-mono">
                  {pythonCodeError.split('\n').map((line, idx) => (
                    <div key={idx} className="min-h-4">
                      {highlightLineText(line)}
                    </div>
                  ))}
                </pre>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-col gap-1.5">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                  Code Semantics
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  The parameter &apos;x&apos; is marked as potentially None. Adding an integer directly to x triggers Sifr&apos;s type safety check, preventing invalid memory state.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md uppercase border border-zinc-200/60">
                Compiler Feedback Output
              </span>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-[11.5px] leading-relaxed text-zinc-300 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold text-zinc-400">Diagnostic Terminal</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded font-semibold">
                    stdout / stderr
                  </span>
                </div>

                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    id={tab.panelId}
                    role="tabpanel"
                    aria-labelledby={`${tabListId}-${tab.id}`}
                    hidden={activeTab !== tab.id}
                  >
                    {tab.id === 'human' && (
                      <div className="space-y-1 font-mono text-[11.5px] text-zinc-100 select-text">
                        <div className="text-zinc-400 mb-2 select-none">$ sifr check main.sifr</div>
                        <div className="text-red-400 font-bold">error[SIFR-TYPE-0005]: cannot use `int | None` as `int`</div>
                        <div className="text-zinc-400">  --&gt; main.sifr:2:12</div>
                        <div className="text-zinc-400">   |</div>
                        <div className="text-zinc-300"> 2 |     return x + 1</div>
                        <div className="text-red-400">   |            ^ `x` may be None</div>
                        <div className="text-zinc-400">   |</div>
                        <div className="text-sky-300">   = help: check whether `x` is None before using it as an integer</div>
                        <div className="text-sky-400 underline select-all">   = docs: https://docs.sifr.sh/errors/SIFR-TYPE-0005</div>
                      </div>
                    )}

                    {tab.id === 'compact' && (
                      <div className="space-y-1 font-mono text-[11.5px] text-zinc-100 select-text">
                        <div className="text-zinc-400 mb-2 select-none">$ sifr --diagnostic-format compact check main.sifr</div>
                        <div className="text-zinc-200 font-bold">1 error, 0 warnings, 0 notes</div>
                        <div className="text-amber-400 font-bold">
                          <span className="bg-red-500/20 text-red-400 px-1 py-0.5 rounded mr-1">E</span>
                          SIFR-TYPE-0005 main.sifr:2:12 cannot use `int | None` as `int`
                        </div>
                      </div>
                    )}

                    {tab.id === 'json' && (
                      <div className="space-y-1 font-mono text-[11px] md:text-[11.5px] text-zinc-300 select-text overflow-x-auto whitespace-pre leading-normal">
                        <div className="text-zinc-400 mb-2 select-none">// GET /api/diag/json</div>
{`[
  {
    "code": "SIFR-TYPE-0005",
    "severity": "Error",
    "message": "cannot use \`int | None\` as \`int\`",
    "spans": [
      {
        "file": "main.sifr",
        "line": 2,
        "column": 12,
        "is_primary": true,
        "label": "\`x\` may be None"
      }
    ],
    "help": "check whether \`x\` is None before using it as an integer",
    "url": "https://docs.sifr.sh/errors/SIFR-TYPE-0005"
  }
]`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900">
                <p className="text-zinc-300 font-medium text-xs leading-relaxed flex items-start gap-2">
                  <span className="text-sky-400 font-mono select-none" aria-hidden="true">Tip:</span>
                  <span>
                    {activeTab === 'human' && 'For humans, Sifr explains the mistake at the exact line, column, and file range that caused the error.'}
                    {activeTab === 'compact' && 'For agents, compact diagnostics are short, stable, and easily digestible in context windows to solve code bugs programmatically.'}
                    {activeTab === 'json' && 'For automation tools, JSON format lists precise spans, stable error codes, and help document URLs directly. No terminal screen scraping required.'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
