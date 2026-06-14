/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Cpu, 
  ShieldAlert, 
  Zap, 
  Layers, 
  RefreshCw, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  ArrowRight,
} from 'lucide-react';
import type { BenchmarkItem } from './types';
import { AgentCompilerSection } from './AgentCompilerSection';
import { AnimatedPipeline, highlightLineText } from './AnimatedPipeline';

const GITHUB_URL = 'https://github.com/yaseralnajjar/sifr';
const INSTALL_COMMAND = 'curl -fsSL https://sifr.sh/install | sh';

// Raw Benchmark Data for all 20 categories
const BENCHMARK_CATEGORIES: BenchmarkItem[] = [
  { name: "Sieve of Eratosthenes (Primes)", python: 184.2, nodejs: 34.1, sifr: 2.1, rust: 1.8, unit: "ms", description: "Generating all prime numbers up to 1,000,000." },
  { name: "Recursive Fibonacci (N=35)", python: 940.0, nodejs: 52.0, sifr: 3.5, rust: 3.0, unit: "ms", description: "De-duplicated recursive calls calculating deep fibonacci sequence." },
  { name: "Matrix Multiplication (200x200)", python: 112.5, nodejs: 18.2, sifr: 1.4, rust: 0.9, unit: "ms", description: "Float64 matrix dot products and cell mutations." },
  { name: "Binary Tree Depth Search", python: 42.1, nodejs: 11.5, sifr: 0.9, rust: 0.7, unit: "ms", description: "DFS lookup over 50k dynamically nested nodes." },
  { name: "JSON String Serialization", python: 68.0, nodejs: 22.1, sifr: 1.3, rust: 1.1, unit: "ms", description: "Encoding highly nested dictionaries to text format." },
  { name: "Bubble Sort (10,000 floats)", python: 295.0, nodejs: 98.4, sifr: 4.2, rust: 3.1, unit: "ms", description: "In-place float sequence bubble sorting." },
  { name: "Regular Expression Matching", python: 31.4, nodejs: 14.8, sifr: 1.1, rust: 0.9, unit: "ms", description: "Parsing 100k paragraphs against complex email regex." },
  { name: "HashMap Insert & Retrieve", python: 89.1, nodejs: 29.5, sifr: 2.3, rust: 2.1, unit: "ms", description: "1,000,000 key-value mutations inside standard map." },
  { name: "Float Vector Normalization", python: 21.3, nodejs: 9.3, sifr: 0.4, rust: 0.3, unit: "ms", description: "Magnitude normalization for high-dim float coordinates." },
  { name: "Heap Push & Pop Ops", python: 45.8, nodejs: 14.1, sifr: 1.1, rust: 0.9, unit: "ms", description: "Priority queue ordering over 100k items." },
  { name: "JSON String De-serialization", python: 82.0, nodejs: 35.2, sifr: 2.5, rust: 2.1, unit: "ms", description: "Parsing highly nested string files into structured memory." },
  { name: "Linked List Reversal", python: 38.4, nodejs: 12.0, sifr: 0.8, rust: 0.6, unit: "ms", description: "Iterative reversal of 200,000 nodes." },
  { name: "Quick Sort (20k array)", python: 67.2, nodejs: 24.1, sifr: 1.7, rust: 1.3, unit: "ms", description: "Recursive pivot sorting over float values." },
  { name: "Dijkstra's Path Optimization", python: 141.0, nodejs: 42.0, sifr: 3.1, rust: 2.5, unit: "ms", description: "Finding shortest path across 10,000 interconnected hubs." },
  { name: "String Concatenation Loop", python: 48.2, nodejs: 19.4, sifr: 0.9, rust: 0.8, unit: "ms", description: "Building a buffer of 500k words systematically." },
  { name: "Base64 Asset Stream Encoding", python: 74.5, nodejs: 28.1, sifr: 1.8, rust: 1.4, unit: "ms", description: "Converting raw binary payload into print-safe base64." },
  { name: "Dynamic Programming Knapsack", python: 135.0, nodejs: 39.5, sifr: 2.8, rust: 2.2, unit: "ms", description: "Calculated weight optimization over 5,000 records." },
  { name: "UTF-8 Substring Extraction", python: 25.1, nodejs: 9.0, sifr: 0.4, rust: 0.3, unit: "ms", description: "Parsing non-ASCII runes and retrieving slices." },
  { name: "Linear Equation Solver", python: 158.0, nodejs: 49.1, sifr: 3.4, rust: 2.8, unit: "ms", description: "Gaussian elimination for variables calculation." },
  { name: "A* Pathfinding Simulation", python: 194.5, nodejs: 61.2, sifr: 4.8, rust: 3.2, unit: "ms", description: "Grid traversal with heuristic score calculations." }
];

export default function HomeApp() {
  // Navigation & Interactive Tabs State
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [compilerState, setCompilerState] = useState<'idle' | 'checking' | 'rust' | 'rustc' | 'done'>('idle');
  
  // Bento Grid states
  // Card 2: Performance Chart states
  const [benchmarkMetric, setBenchmarkMetric] = useState<'speed' | 'memory'>('speed');
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [searchBenchmark, setSearchBenchmark] = useState('');

  // Auto-run compiler log effect
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showBenchmarkModal) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    modalCloseRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowBenchmarkModal(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [showBenchmarkModal]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  const handleCopyInstall = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  // Compile CLI simulation
  const runCliSimulation = () => {
    setCompilerState('checking');
    setTerminalLogs([]);
    
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, "   ø  sifr v0.1.0"]);
      setTerminalLogs(prev => [...prev, "   ✓ Checked types & resolved lifetimes"]);
      setCompilerState('rust');
    }, 60000000); // Trigger manually except we want instant feedback loops or faster timers

    // Let's do a fast but realistic 1.5s sequence
  };

  const startCliProcess = () => {
    if (compilerState !== 'idle') return;
    setCompilerState('checking');
    setTerminalLogs([
      "$ sifr build main.sifr"
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev, 
        "sifr v0.1.0",
        "input:  main.sifr",
        "mode:   project",
        "target: release native",
        ""
      ]);
    }, 300);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        "   Loading Sifr standard library          8 ms",
        "   Parsing import closure (4 modules)     3 ms"
      ]);
    }, 650);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        "   Analyzing types, ownership, and flow   12 ms",
        "   Generating Rust project                4 ms"
      ]);
      setCompilerState('rust');
    }, 1050);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        "   Materializing Cargo project            1 ms",
        "   Building release binary                26 ms"
      ]);
      setCompilerState('rustc');
    }, 1450);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        "",
        "Finished release build in 54 ms",
        "Binary: ./main",
        "Size:   1.4 MB"
      ]);
      setCompilerState('done');
    }, 1850);
  };

  const resetCliProcess = () => {
    setCompilerState('idle');
    setTerminalLogs([]);
  };

  // Automatically kick-off compilation on load once so user sees action
  useEffect(() => {
    const timer = setTimeout(() => {
      startCliProcess();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtered benchmark list for raw tables modal
  const filteredBenchmarks = BENCHMARK_CATEGORIES.filter(item => 
    item.name.toLowerCase().includes(searchBenchmark.toLowerCase()) ||
    item.description.toLowerCase().includes(searchBenchmark.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 relative selection:bg-sky-500/10 selection:text-sky-700 font-sans text-zinc-900 overflow-x-hidden">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Decorative Top Ambient Light Tube */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent blur-sm pointer-events-none" aria-hidden="true" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-200/60" id="header-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <a href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Sifr home">
              <img
                src="/logo.webp"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
                decoding="async"
                aria-hidden="true"
              />
              <span className="font-display font-bold text-3xl leading-none tracking-wide text-zinc-950">Sifr</span>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-base font-medium text-zinc-700" aria-label="Primary">
              <a href="/" className="font-bold text-zinc-950 hover:text-zinc-950 transition-colors" id="nav-home" aria-current="page">Home</a>
              <a href="/blog" className="font-medium hover:text-zinc-950 transition-colors" id="nav-blog">Blog</a>
              <a href="#pipeline" className="font-medium hover:text-zinc-950 transition-colors" id="nav-docs">Docs</a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <details className="md:hidden relative">
              <summary className="list-none cursor-pointer p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-lg transition-all [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Open navigation menu</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </summary>
              <nav className="absolute right-0 top-full mt-2 min-w-40 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg" aria-label="Primary mobile">
                <a href="/" className="block rounded-lg px-3 py-2 text-base font-bold text-zinc-950 hover:bg-zinc-100" aria-current="page">Home</a>
                <a href="/blog" className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950">Blog</a>
                <a href="#pipeline" className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950">Docs</a>
              </nav>
            </details>

            <a 
              href={GITHUB_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-lg transition-all"
              aria-label="GitHub repository (opens in new tab)"
              id="github-link"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a 
              href="#pipeline" 
              className="hidden sm:inline-flex text-sm font-medium px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors shadow-sm"
              id="cta-get-started"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24 relative z-10 min-w-0 w-full">
        
        {/* SECTION 1: THE SPLIT HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-w-0 w-full" id="section-hero">
          
          {/* Left Column (The Brand Copy) */}
          <div className="@container flex flex-col gap-6 lg:gap-8 min-w-0 w-full">

            <div className="flex flex-col gap-4 min-w-0">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-none">
                Write Python<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700 font-black">Run Rust</span>
              </h1>
              
              <p className="text-zinc-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
                Sifr compiles Python into safe, <strong className="text-zinc-900 font-semibold">native Rust binaries</strong>.
                <br />
                No runtime interpreters, no virtual machines, and minimal runtime crashes.
              </p>
            </div>

            {/* Click-to-Copy CLI install command */}
            <div className="flex flex-col @4xl:flex-row items-stretch @4xl:items-center gap-3 w-full min-w-0">
              <div className="flex items-center justify-between gap-2 sm:gap-3 bg-white border border-zinc-200/80 p-1.5 pl-3 sm:pl-4 rounded-xl shadow-sm hover:border-zinc-300 transition-all w-full min-w-0 font-mono text-xs sm:text-sm h-12">
                <code id="install-command" className="text-zinc-600 select-all min-w-0 flex-1 overflow-x-auto whitespace-nowrap scrollbar-none pr-2">
                  {INSTALL_COMMAND}
                </code>
                <button 
                  onClick={handleCopyInstall}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-zinc-900 hover:bg-sky-600 hover:text-white text-zinc-300 rounded-lg transition-all shrink-0"
                  aria-label={copiedInstall ? 'Installation command copied' : 'Copy installation command'}
                  aria-describedby="install-command"
                  id="copy-install-btn"
                >
                  {copiedInstall ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-semibold font-sans">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-xs font-semibold font-sans">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a 
                href="#pipeline"
                className="inline-flex items-center justify-center gap-2 px-5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium rounded-xl border border-sky-200/60 transition-colors whitespace-nowrap h-12 w-full @4xl:w-auto shrink-0"
                id="hero-docs-button"
              >
                Read Docs
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>


          </div>

          {/* Right Column (The Utility CLI Sim) */}
          <div className="min-w-0 w-full flex flex-col" id="cli-panel">
            <div
              className="w-full min-w-0 bg-zinc-900 text-zinc-100 rounded-2xl terminal-shadow overflow-hidden flex flex-col font-mono text-xs border border-zinc-800"
              role="region"
              aria-label="Interactive Sifr build terminal demonstration"
            >
              {/* Terminal Titlebar */}
              <div className="bg-zinc-950 px-4 py-3 flex items-center justify-between gap-2 border-b border-zinc-800/80 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 shrink-0" aria-hidden="true" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 shrink-0" aria-hidden="true" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 shrink-0" aria-hidden="true" />
                  <span className="text-zinc-400 text-[11px] ml-2 font-sans font-medium truncate">sifr-build-terminal — bash</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-zinc-400 select-none">UTC</span>
                </div>
              </div>

              {/* Terminal Screen Body */}
              <div className="p-5 min-h-[290px] bg-zinc-900 flex flex-col justify-between">
                <div>
                  {/* Initial build statement */}
                  <div className="text-zinc-400 select-none" aria-hidden="true">// Sifr Interactive Compiler Build Visualizer</div>
                  
                  {/* Active Terminal Output */}
                  <div className="mt-4 space-y-1 font-mono text-[11.5px]" aria-live="polite" aria-relevant="additions text">
                    {terminalLogs.length === 0 ? (
                      <div className="text-zinc-400 italic">Terminal ready. Run build pipeline.</div>
                    ) : (
                      terminalLogs.map((log, index) => {
                        if (log.startsWith("$ ")) {
                          return (
                            <div key={index} className="text-zinc-400 font-bold min-h-4">
                              <span className="text-zinc-500 select-none">$ </span>
                              {log.substring(2)}
                            </div>
                          );
                        }
                        
                        // Custom styling for action verbs
                        const greenVerbs = ["Loading", "Parsing", "Analyzing", "Generating", "Materializing", "Building", "Finished"];
                        const trimmedLog = log.trim();
                        const firstWord = trimmedLog.split(/\s+/)[0];
                        
                        if (greenVerbs.includes(firstWord)) {
                          const restOfLine = trimmedLog.substring(firstWord.length);
                          const leadingSpacesCount = log.length - trimmedLog.length;
                          const leadingSpaces = "\u00A0".repeat(leadingSpacesCount);
                          return (
                            <div key={index} className="text-zinc-300 min-h-4 whitespace-pre">
                              {leadingSpaces}
                              <span className="text-emerald-400 font-bold">{firstWord}</span>
                              {restOfLine}
                            </div>
                          );
                        }

                        if (log.startsWith("sifr v0.1.0")) {
                          return (
                            <div key={index} className="text-sky-400 font-bold min-h-4">
                              {log}
                            </div>
                          );
                        }

                        // Empty line
                        if (log === "") {
                          return <div key={index} className="h-2" />;
                        }

                        return (
                          <div key={index} className="text-zinc-300 min-h-4 whitespace-pre">
                            {log}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Simulated CLI status footer badge */}
                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 select-none">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${compilerState === 'done' ? 'bg-emerald-400' : 'bg-sky-400'}`} aria-hidden="true"></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${compilerState === 'done' ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
                    </span>
                    <span className="font-sans font-semibold uppercase tracking-wider">
                      Status: {compilerState.toUpperCase()}
                    </span>
                  </div>
                  {compilerState === 'done' ? (
                    <button 
                      onClick={() => {
                        resetCliProcess();
                        setTimeout(() => {
                          startCliProcess();
                        }, 100);
                      }}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-750 hover:text-white text-zinc-300 rounded cursor-pointer transition-all flex items-center gap-1 font-sans font-semibold text-[10px]"
                      id="rebuild-trigger"
                      aria-label="Rebuild code"
                    >
                      <RefreshCw className="w-3 h-3 animate-pulse" aria-hidden="true" />
                      Rebuild Code
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-400 font-sans">Compiling...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE POWER OF SIFR */}
        <section className="flex flex-col gap-12" id="features">
          <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center items-center">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-zinc-950">
              The Power of Sifr
            </h2>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
              Explore Sifr's absolute safety and raw speed.
            </p>
          </div>

          {/* POWER 1: ZERO OVERHEADS PERFORMANCE */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-8 relative overflow-hidden" id="benchmarks">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center items-center">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100/85 shadow-2xs mb-1">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-zinc-950">
                Zero Overheads Performance
              </h3>
              <div className="flex flex-col items-center gap-5 max-w-2xl mx-auto text-center mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-left w-full sm:w-auto max-w-md mx-auto">
                  <div className="flex items-center gap-2.5 text-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="font-semibold text-sm">No interpreter tax</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="font-semibold text-sm">Native execution times</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="font-semibold text-sm">No garbage collection pauses</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="font-semibold text-sm">Near-zero memory footprint</span>
                  </div>
                </div>
                <p className="text-zinc-600 text-xs md:text-sm font-medium leading-relaxed mt-1 italic">
                  The trick: no trick, Sifr uses the great Rust compiler behind the scenes
                </p>
              </div>
            </div>

            {/* Chart Metric Toggle (Centered & Highly Prominent) */}
            <div className="flex justify-center my-1">
              <div className="inline-flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/80 shadow-inner max-w-md w-full sm:w-auto" role="group" aria-label="Benchmark metric">
                <button 
                  onClick={() => setBenchmarkMetric('speed')}
                  aria-pressed={benchmarkMetric === 'speed'}
                  className={`flex-1 sm:flex-initial px-6 py-3 text-xs sm:text-sm md:text-base rounded-xl font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 ${
                    benchmarkMetric === 'speed' 
                      ? 'bg-white text-zinc-950 shadow-md ring-1 ring-zinc-200/40 text-sky-700 scale-[1.02]' 
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50/50'
                  }`}
                  id="speed-metric-btn-v2"
                >
                  <Zap className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${benchmarkMetric === 'speed' ? 'text-sky-700' : 'text-zinc-600'}`} aria-hidden="true" />
                  Execution Speed
                </button>
                <button 
                  onClick={() => setBenchmarkMetric('memory')}
                  aria-pressed={benchmarkMetric === 'memory'}
                  className={`flex-1 sm:flex-initial px-6 py-3 text-xs sm:text-sm md:text-base rounded-xl font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 ${
                    benchmarkMetric === 'memory' 
                      ? 'bg-white text-zinc-950 shadow-md ring-1 ring-zinc-200/40 text-sky-700 scale-[1.02]' 
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50/50'
                  }`}
                  id="memory-metric-btn-v2"
                >
                  <Cpu className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${benchmarkMetric === 'memory' ? 'text-sky-700' : 'text-zinc-600'}`} aria-hidden="true" />
                  Memory Usage
                </button>
              </div>
            </div>

            {/* Large scale grid or display for the performance chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-50/50 rounded-2xl p-6 md:p-8 border border-zinc-100">
              {/* Left side: The beautiful chart itself */}
              <div className="lg:col-span-7 flex flex-col gap-5 w-full">
                <div className="text-zinc-600 text-xs font-medium font-sans flex items-center justify-between">
                  <span>{benchmarkMetric === 'speed' ? 'Lower represents faster execution time' : 'Lower represents lesser runtime memory'}</span>
                  <span className="font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded text-[10px]">Comparative Index</span>
                </div>
                
                <div className="space-y-4" role="list" aria-label={`${benchmarkMetric === 'speed' ? 'Execution speed' : 'Memory usage'} benchmark comparison`}>
                  {[
                    { name: 'Python (Standard CPython)', speedValue: 150.0, speedText: '150.0 ms', memoryValue: 28.2, memoryText: '28.2 MB', color: 'bg-zinc-400/80', percentage: 100 },
                    { name: 'Node.js (JS V8 Engine)', speedValue: 65.0, speedText: '65.0 ms', memoryValue: 38.5, memoryText: '38.5 MB', color: 'bg-emerald-500/80', percentage: 43 },
                    { name: 'Sifr (Native Binary)', speedValue: 4.8, speedText: '4.8 ms', memoryValue: 1.8, memoryText: '1.8 MB', color: 'bg-sky-500 font-bold', percentage: 4.5 },
                    { name: 'Rust (Optimized Cargo Build)', speedValue: 3.2, speedText: '3.2 ms', memoryValue: 1.6, memoryText: '1.6 MB', color: 'bg-orange-500/80', percentage: 2.1 }
                  ].map((row) => {
                    let barPercentage = 100;
                    if (benchmarkMetric === 'speed') {
                      barPercentage = (row.speedValue / 150.0) * 100;
                    } else {
                      barPercentage = (row.memoryValue / 38.5) * 100;
                    }
                    barPercentage = Math.max(barPercentage, 3.5);

                    const isSifr = row.name.includes('Sifr');

                    return (
                      <div key={row.name} className="flex flex-col gap-1.5" role="listitem">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`${isSifr ? 'text-sky-700 font-bold text-sm' : 'text-zinc-700'}`}>{row.name}</span>
                          <span className={`font-semibold ${isSifr ? 'text-sky-700 font-bold text-sm' : 'text-zinc-600'}`}>
                            {benchmarkMetric === 'speed' ? row.speedText : row.memoryText}
                          </span>
                        </div>
                        <div
                          className={`w-full bg-zinc-200/50 ${isSifr ? 'h-4' : 'h-3'} rounded-full overflow-hidden p-0.5 border border-zinc-100`}
                          role="progressbar"
                          aria-valuenow={Math.round(barPercentage)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${row.name}: ${benchmarkMetric === 'speed' ? row.speedText : row.memoryText}`}
                        >
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isSifr ? 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-xs' : row.color}`}
                            style={{ width: `${barPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right side: Key stats & Detailed breakdown button */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-white/80 p-6 md:p-8 rounded-2xl border border-zinc-200/60 shadow-xs h-full">
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-zinc-900 text-sm font-mono tracking-wide uppercase">Performance Insights</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="p-1.5 h-fit bg-emerald-50 text-emerald-600 rounded-lg">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">30x Speedup Over Python</div>
                        <div className="text-[11px] text-zinc-600 leading-relaxed">
                          Pure algorithmic operations run up to 30 times faster, mapping direct compiled instructions straight to CPU registers.
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="p-1.5 h-fit bg-sky-50 text-sky-700 rounded-lg">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">No Garbage Collector Latency</div>
                        <div className="text-[11px] text-zinc-600 leading-relaxed animate-none">
                          Say goodbye to random spikes in server response times. Memory is automatically cleaned up at precise compile-time boundaries.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-150">
                  <a 
                    href="/blog"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    id="view-benchmarks-link-v2"
                  >
                    <FileText className="w-4 h-4" />
                    View detailed benchmark data &amp; breakdown
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* POWER 2: CHECKED ERROR HANDLING */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-8 relative overflow-hidden" id="card-checked-error-handling">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center items-center">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100/80 shadow-xs mb-1">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-zinc-950">
                Elegant Error Handling
              </h3>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed text-center">
                Sifr treats errors as values, not surprises. The compiler rejects code that could silently ignore unhandled errors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-zinc-50/50 rounded-2xl p-6 md:p-8 border border-zinc-100">
              {/* Column 1: Unhandled Result */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Unhandled Result
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold tracking-wide">
                    Blocked by Compiler
                  </span>
                </div>

                {/* Editor Mock */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-[11.5px] leading-relaxed text-zinc-300 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[10.5px] text-zinc-400 font-sans ml-1.5">main.sifr</span>
                    </div>
                  </div>
                  <pre className="select-text whitespace-pre overflow-x-auto text-[11px] md:text-[11.5px] text-zinc-300 leading-normal font-mono">
                    {`def parse_age(s: str) -> Result[int, ParseError]:
    return int(s)

def main():
    parse_age("25")
    # ERROR: unused Result value`
                      .split('\n')
                      .map((line, idx) => (
                        <div key={idx} className="min-h-4">
                          {highlightLineText(line)}
                        </div>
                      ))}
                  </pre>
                </div>

                {/* Compiler Box */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-xs shadow-sm shadow-red-950/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 border-b border-zinc-850 pb-2.5 mb-3">
                    <Terminal className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">Compiler Feedback</span>
                  </div>
                  <pre className="text-red-400 leading-normal select-text text-[11px] md:text-[11.5px] whitespace-pre-wrap">
{`error[SIFR-RESULT-0001]: unused Result value of type 'Result[int, ParseError]' must be used`}
                  </pre>
                </div>
              </div>

              {/* Column 2: Handle It Explicitly */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Handle It Explicitly
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold tracking-wide">
                    Compiles Successfully
                  </span>
                </div>

                {/* Editor Mock */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-[11.5px] leading-relaxed text-zinc-300 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[10.5px] text-zinc-400 font-sans ml-1.5">main.sifr</span>
                    </div>
                  </div>
                  <pre className="select-text whitespace-pre overflow-x-auto text-[11px] md:text-[11.5px] text-zinc-300 leading-normal font-mono">
                    {`def main():
    try:
        age: int = parse_age("25")
        print(f"Age is {age}")
    except ParseError as e:
        print(e.message)`
                      .split('\n')
                      .map((line, idx) => (
                        <div key={idx} className="min-h-4">
                          {highlightLineText(line)}
                        </div>
                      ))}
                  </pre>
                </div>

                {/* Compiler Box */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-xs shadow-sm shadow-emerald-950/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 border-b border-zinc-850 pb-2.5 mb-3">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">Compiler Feedback</span>
                  </div>
                  <div className="text-emerald-400 leading-normal select-text text-[11px] md:text-[11.5px] flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>✓ no errors found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* POWER 3: STATIC TYPES THAT FOLLOW CONTROL FLOW */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-8 relative overflow-hidden" id="card-static-types">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center items-center">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100/80 shadow-xs mb-1">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-zinc-950">
                Static Types That Follow Control Flow
              </h3>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed text-center">
                Sifr rejects unsafe transactions until your code handles the missing case, automatically narrowing the type subsequently.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-zinc-50/50 rounded-2xl p-6 md:p-8 border border-zinc-100">
              {/* Column 1: Rejected by Sifr */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Rejected by Sifr
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold tracking-wide">
                    Blocked by Compiler
                  </span>
                </div>

                {/* Editor Mock */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-[11.5px] leading-relaxed text-zinc-300 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[10.5px] text-zinc-400 font-sans ml-1.5">main.sifr</span>
                    </div>
                  </div>
                  <pre className="select-text whitespace-pre overflow-x-auto text-[11px] md:text-[11.5px] text-zinc-300 leading-normal font-mono">
                    {`def add_one(x: int | None) -> int:
    return x + 1

def main():
    print(add_one(41))`
                      .split('\n')
                      .map((line, idx) => (
                        <div key={idx} className="min-h-4">
                          {highlightLineText(line)}
                        </div>
                      ))}
                  </pre>
                </div>

                {/* Compiler Box */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-4 font-mono text-xs shadow-sm shadow-red-950/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 border-b border-zinc-850 pb-2 mb-2">
                    <Terminal className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">Compiler Feedback</span>
                  </div>
                  <pre className="text-red-400 leading-normal select-text text-[11px] whitespace-pre-wrap">
{`error: cannot use \`int | None\` as \`int\`
help: check whether \`x\` is \`None\` before using it as an integer`}
                  </pre>
                </div>

                <div className="text-xs text-zinc-600 leading-relaxed font-sans px-1 pt-1">
                  <strong className="text-zinc-700 font-semibold">Compiler Interception:</strong> Because the code never handles the potential <code className="font-mono text-[11px] bg-zinc-100 px-1 py-0.5 rounded">None</code> case, Sifr blocks compilation, keeping unsafe code away from production.
                </div>
              </div>

              {/* Column 2: Accepted by Sifr */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Accepted by Sifr
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold tracking-wide">
                    Compiles Successfully
                  </span>
                </div>

                {/* Editor Mock */}
                <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 font-mono text-[11.5px] leading-relaxed text-zinc-300 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[10.5px] text-zinc-400 font-sans ml-1.5">main.sifr</span>
                    </div>
                  </div>
                  <pre className="select-text whitespace-pre overflow-x-auto text-[11px] md:text-[11.5px] text-zinc-300 leading-normal font-mono">
                    {`def add_one(x: int | None) -> int:
    if x is None:
        return 0

    return x + 1

def main():
    print(add_one(41))`
                      .split('\n')
                      .map((line, idx) => (
                        <div key={idx} className="min-h-4">
                          {highlightLineText(line)}
                        </div>
                      ))}
                  </pre>
                </div>

                <div className="text-xs text-zinc-600 leading-relaxed font-sans px-1 pt-1">
                  <strong className="text-zinc-700 font-semibold">Automatic Narrowing:</strong> Since the early return handles the <code className="font-mono text-[11px] bg-zinc-100 px-1 py-0.5 rounded">None</code> case, Sifr automatically narrows <code className="font-mono text-[11px] bg-zinc-105 px-1 py-0.5 rounded text-zinc-800">x</code> to <code className="font-mono text-[11px] bg-zinc-105 px-1 py-0.5 rounded text-zinc-800">int</code> on the subsequent lines.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGENT & HUMAN COMPILER FRIENDLY DIAGNOSTICS */}
        <AgentCompilerSection />

        {/* SECTION 3: THE PIPELINE VISUALIZER */}
        <section className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-12" id="pipeline">
          <div className="flex flex-col gap-3 max-w-3xl mx-auto text-center items-center">
            <span className="text-xs font-bold font-mono tracking-wider text-sky-700 uppercase">Architecture Flow</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-zinc-950">
              The Sifr Compiler Pipeline
            </h2>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed text-center">
              Trace how a single Python statement transits through the compiler layers. Sifr enforces type safety, checking memory and type structures to generate highly optimized native machine executables.
            </p>
          </div>

          {/* New fully-animated interactive pipeline simulation experience */}
          <AnimatedPipeline />

        </section>



      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 mt-20 relative z-10" id="footer">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand block */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <img
                src="/logo.webp"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                decoding="async"
              />
              <span className="font-display font-semibold tracking-wider">sifr.sh</span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal max-w-sm">
              Python ergonomics compiled into safe native binaries. No virtual VMs, no GC layers, and minimal runtime crashes.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2 text-xs" aria-label="Footer">
            <span className="text-zinc-200 font-bold uppercase tracking-widest font-mono text-[10px] mb-2">Community &amp; Code</span>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              GitHub repository <ExternalLink className="w-3 h-3" aria-hidden="true" />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Documentation</a>
            <span className="text-[10px] text-zinc-400 mt-4">&copy; {new Date().getFullYear()} Sifr project.</span>
          </nav>

        </div>
      </footer>

      {/* RAW BENCHMARK MODAL popup panel */}
      {showBenchmarkModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          onClick={() => setShowBenchmarkModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-xl border border-zinc-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="benchmark-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 id="benchmark-modal-title" className="font-display font-bold text-lg text-zinc-950">Raw Benchmarks Breakdown (20 Algorithmic Categories)</h3>
                <p className="text-xs text-zinc-600 font-mono">Comparing Median execution speed in milliseconds (Lower is better)</p>
              </div>
              <button 
                ref={modalCloseRef}
                onClick={() => setShowBenchmarkModal(false)}
                className="px-3 py-1.5 text-xs font-bold hover:bg-zinc-200/60 text-zinc-700 rounded-lg transition-all"
                id="close-benchmarks-modal"
                aria-label="Close benchmark modal"
                type="button"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-3 border-b border-zinc-100 flex items-center gap-2">
              <label htmlFor="benchmark-search" className="sr-only">Search benchmark tests</label>
              <input 
                id="benchmark-search"
                type="search"
                placeholder="Search benchmark tests (e.g. Sort, JSON, Dijkstra)..."
                value={searchBenchmark}
                onChange={(e) => setSearchBenchmark(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono"
              />
              {searchBenchmark && (
                <button 
                  onClick={() => setSearchBenchmark('')}
                  className="text-xs text-zinc-600 hover:text-zinc-950 px-2"
                  type="button"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Modal Table Body */}
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-600 select-none">
                    <th className="py-2.5 font-bold uppercase tracking-wider">Test Suite</th>
                    <th className="py-2.5 font-bold text-right">Python</th>
                    <th className="py-2.5 font-bold text-right">Node.js</th>
                    <th className="py-2.5 font-bold text-right text-sky-700 bg-sky-50 px-2 rounded-t">Sifr</th>
                    <th className="py-2.5 font-bold text-right text-orange-600">Rust</th>
                    <th className="py-2.5 font-bold text-right">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredBenchmarks.length > 0 ? (
                    filteredBenchmarks.map((item) => (
                      <tr key={item.name} className="hover:bg-zinc-50 group">
                        <td className="py-3 pr-4">
                          <div className="font-bold text-zinc-950 font-sans">{item.name}</div>
                          <div className="text-[10px] text-zinc-600 font-sans mt-0.5">{item.description}</div>
                        </td>
                        <td className="py-3 text-right text-zinc-600">{item.python.toFixed(1)}</td>
                        <td className="py-3 text-right text-zinc-600">{item.nodejs.toFixed(1)}</td>
                        <td className="py-3 text-right text-sky-700 font-bold bg-sky-50/50 px-2 group-hover:bg-sky-50 transition-colors">{item.sifr.toFixed(1)}</td>
                        <td className="py-3 text-right text-orange-600 font-semibold">{item.rust.toFixed(1)}</td>
                        <td className="py-3 text-right text-zinc-600">{item.unit}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-600">
                        No benchmarks matches "{searchBenchmark}" query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
              <span>Comparing hardware target: AWS c6i.metal (Ice Lake Gen)</span>
              <a 
                href={GITHUB_URL}
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-sky-700 flex items-center gap-1 font-sans"
              >
                Learn more or contribute tests <ExternalLink className="w-3 h-3" aria-hidden="true" />
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Notification for Blog / Docs / etc. */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium"
          id="system-toast"
          role="status"
          aria-live="polite"
        >
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="ml-2 hover:text-white text-zinc-400 font-bold text-sm px-1"
            aria-label="Close notification"
            type="button"
          >
            &times;
          </button>
        </div>
      )}

    </div>
  );
}
