import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  FileCode,
  Terminal,
  Brain,
  Layers,
} from 'lucide-react';

interface StepData {
  id: number;
  label: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  fileName: string;
  fileType: 'sifr' | 'check' | 'rs' | 'native';
  code: string;
  explanation: string;
  highlights: string[];
}

const STEPS: StepData[] = [
  {
    id: 1,
    label: "Source",
    badge: "Input File",
    badgeColor: "bg-zinc-100/80 border-zinc-200/60 text-zinc-650",
    title: "1. Pythonic Source",
    description: "Write clean, highly-readable Python syntax with explicit type annotations. Standard functions and loops are parsed with absolute simplicity.",
    fileName: "main.sifr",
    fileType: 'sifr',
    code: `# main.sifr
def double(value: int) -> int:
    return value * 2

result: int = double(21)
print(result)`,
    explanation: "Standard parameters and variables are declared with clean types. Sifr is fully compliant with standard Python IDE type checking.",
    highlights: ["def double(value: int) -> int:", "result: int = double(21)"]
  },
  {
    id: 2,
    label: "Analyze",
    badge: "Verification",
    badgeColor: "bg-sky-50 border-sky-100 text-sky-700",
    title: "2. Semantic Solver & Control Flow Analysis",
    description: "Before emitting any output, the Sifr compiler evaluates typing signatures, lifetime requirements, and rules out unhandled states or memory leaks.",
    fileName: "sifr-check",
    fileType: 'check',
    code: `Analyzing main.sifr AST representation...
[Pass 1] Checking variable declarations and lexical scopes
[Pass 2] Resolving generic lifetimes and nullability states
✓ OK: 'value' resolved as primitive type 'int'
✓ OK: 'double(...)' return type contract guarantees 'int'
✓ OK: 'result' matches signature type exactly
✓ OK: No runtime memory escape leaks or ownership mutations
All semantic safety checks: PASSED`,
    explanation: "Sifr's static analyzer prevents typical memory bugs, null-pointer dereferences, and state mutations before any machine code compiles.",
    highlights: ["✓ OK:", "safety checks: PASSED"]
  },
  {
    id: 3,
    label: "Generate",
    badge: "Transpiling",
    badgeColor: "bg-amber-50 border-amber-100 text-amber-800",
    title: "3. High-Performance Rust Transpilation",
    description: "High-level structures are transpiled directly into safe, highly optimized, non-GC native Rust. No garbage collector drag, with fully optimized variables.",
    fileName: "emitted_main.rs",
    fileType: 'rs',
    code: `// emitted_main.rs
pub fn double(value: i64) -> i64 {
    value * 2
}

fn main() {
    let result: i64 = double(21);
    println!("{}", result);
}`,
    explanation: "By translating Sifr types directly to standard Rust data representations like 'i64', Sifr avoids performance trade-offs while guaranteeing memory safety.",
    highlights: ["pub fn double(value: i64) -> i64", "let result: i64"]
  },
  {
    id: 4,
    label: "Build",
    badge: "AOT Compilation",
    badgeColor: "bg-emerald-50 border-emerald-100 text-emerald-800",
    title: "4. Native Executable Creation",
    description: "The binary optimizer builds a standalone, compile-optimized native binary. Startup speed is sub-millisecond with zero container system overhead.",
    fileName: "sifr-terminal - bash",
    fileType: 'native',
    code: `sifr v0.1.0
input:  main.sifr
mode:   project
target: release native

   Loading Sifr standard library          8 ms
   Parsing import closure (4 modules)     3 ms
   Analyzing types, ownership, and flow   12 ms
   Generating Rust project                4 ms
   Materializing Cargo project            1 ms
   Building release binary                26 ms

Finished release build in 54 ms
Binary: ./main
Size:   1.4 MB`,
    explanation: "Building standard native executables allows Sifr software to cold-start instantly. Perfect for serverless pods, microservices, and edge devices.",
    highlights: ["Finished release build in 54 ms", "Size:   1.4 MB"]
  }
];

const highlightToken = (token: string, key: string) => {
  const trimmed = token.trim();
  if (!trimmed) {
    return <span key={key}>{token}</span>;
  }

  // Keywords Sifr/Rust/Python
  if (['def', 'return', 'pub', 'fn', 'let', 'if', 'is', 'try', 'except', 'as', 'import', 'from'].includes(trimmed)) {
    return <span key={key} className="text-fuchsia-400 font-semibold">{token}</span>;
  }
  if (['print', 'println!'].includes(trimmed)) {
    return <span key={key} className="text-sky-400 font-medium">{token}</span>;
  }
  // Types
  if (['int', 'i64', 'None', 'str', 'Result', 'ParseError'].includes(trimmed)) {
    return <span key={key} className="text-amber-400 font-medium">{token}</span>;
  }
  // Strings
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return <span key={key} className="text-emerald-400 font-medium">{token}</span>;
  }
  // Numbers
  if (/^\d+$/.test(trimmed)) {
    return <span key={key} className="text-amber-500 font-mono">{token}</span>;
  }
  // Functions or specific identifiers
  if (['double', 'main', 'add_one', 'value', 'result', 'x', 'parse_age', 'age', 'e', 'message'].includes(trimmed)) {
    if (['double', 'main', 'add_one', 'parse_age'].includes(trimmed)) {
      return <span key={key} className="text-blue-400 font-semibold">{token}</span>;
    }
    return <span key={key} className="text-zinc-200">{token}</span>;
  }
  // Operators
  if (['->', ':', '=', '+', '*'].includes(trimmed)) {
    return <span key={key} className="text-pink-400">{token}</span>;
  }

  return <span key={key} className="text-zinc-300">{token}</span>;
};

export function highlightLineText(line: string) {
  if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
    return <span className="text-zinc-500 italic">{line}</span>;
  }

  // Split into tokens: words, spaces, strings, punctuation
  const tokenRegex = /("\{\}"|f"[^"\\]*(?:\\.[^"\\]*)*"|"[^"\\]*(?:\\.[^"\\]*)*"|'[^']*'|\b(?:def|return|print|pub|fn|let|println!|if|is|try|except|as|None|import|from)\b|\b(?:int|i64|str|Result|ParseError)\b|\b\d+\b|[a-zA-Z_][a-zA-Z0-9_]*|[:\-()\-&|>{}=+*,\.;\[\]]|\s+)/g;
  const matches = line.match(tokenRegex);
  if (!matches) {
    return <span className="text-zinc-300">{line}</span>;
  }

  return (
    <>
      {matches.map((token, i) => highlightToken(token, `tok-${i}`))}
    </>
  );
}

export function AnimatedPipeline() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [transitPercent, setTransitPercent] = useState<number>(0);
  const [visibleLinesCount, setVisibleLinesCount] = useState<number>(999);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStepData = STEPS[currentStep - 1];

  // Gradual terminal line loader effect
  useEffect(() => {
    const lines = activeStepData.code.split('\n');
    if (currentStep === 1) {
      setVisibleLinesCount(lines.length);
      return;
    }

    setVisibleLinesCount(1);
    const interval = setInterval(() => {
      setVisibleLinesCount((prev) => {
        if (prev >= lines.length) {
          clearInterval(interval);
          return lines.length;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [currentStep, activeStepData.code]);

  // Auto-play interval handling
  useEffect(() => {
    if (isPlaying) {
      // Loop to next step every 4.5s
      playTimerRef.current = setInterval(() => {
        setTransitPercent(0);
        setCurrentStep((prev) => (prev === 4 ? 1 : prev + 1));
      }, 4500);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  // Visual simulation flow state loop
  useEffect(() => {
    if (isPlaying) {
      let currentVal = 0;
      transitTimerRef.current = setInterval(() => {
        currentVal += 1.5;
        if (currentVal > 100) {
          currentVal = 0;
        }
        setTransitPercent(currentVal);
      }, 60);
    } else {
      setTransitPercent(0);
      if (transitTimerRef.current) clearInterval(transitTimerRef.current);
    }
    return () => {
      if (transitTimerRef.current) clearInterval(transitTimerRef.current);
    };
  }, [isPlaying, currentStep]);

  const selectStepHandler = (id: number) => {
    setIsPlaying(false);
    setCurrentStep(id);
    setTransitPercent(0);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev === 4 ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev === 1 ? 4 : prev - 1));
  };

  const getStepIcon = (type: 'sifr' | 'check' | 'rs' | 'native') => {
    switch (type) {
      case 'sifr':
        return <FileCode className="w-5 h-5 text-indigo-400" />;
      case 'check':
        return <Brain className="w-5 h-5 text-sky-400" />;
      case 'rs':
        return <Layers className="w-5 h-5 text-amber-500" />;
      case 'native':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Visual Timeline Controller & Tabs */}
      <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Step circles with dynamic connecting bars */}
        <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4 flex-1">
          {STEPS.map((step, idx) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                {/* Step circle */}
                <button
                  onClick={() => selectStepHandler(step.id)}
                  className={`flex items-center gap-2.5 px-3 md:px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-350 cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900 border-zinc-950 text-white shadow-md scale-[1.03]'
                      : isCompleted
                      ? 'bg-sky-50 border-sky-100 text-sky-700'
                      : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] ${
                    isActive 
                      ? 'bg-sky-500 text-zinc-950 font-bold' 
                      : isCompleted ? 'bg-sky-100 text-sky-800' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {step.id}
                  </span>
                  <span className="hidden sm:inline font-sans">{step.label}</span>
                </button>

                {/* Flow connector line */}
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-[2px] bg-zinc-200 relative overflow-hidden min-w-[12px] md:min-w-[40px]">
                    {/* Glowing flow indicator line logic */}
                    {((isActive && isPlaying) || (isCompleted && isPlaying && currentStep === step.id + 1)) && (
                      <motion.div 
                        className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
                        animate={{
                          left: ['-20%', '120%']
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear"
                        }}
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Video Player Style HUD controls */}
        <div className="flex items-center gap-2.5 self-center md:self-auto border-t md:border-t-0 border-zinc-200/60 pt-4 md:pt-0 w-full md:w-auto justify-center">
          <button
            onClick={handlePrev}
            className="p-2 border border-zinc-200/80 hover:bg-zinc-100 rounded-lg text-zinc-650 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-xs font-bold transition-all ${
              isPlaying 
                ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-zinc-950' 
                : 'bg-zinc-950 hover:bg-zinc-850 border-zinc-900 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Demo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Autoplay</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 border border-zinc-200/80 hover:bg-zinc-100 rounded-lg text-zinc-650 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(1);
            }}
            className="p-2 border border-zinc-200/80 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
            title="Reset Compilation Flow"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Container: Detailed visual split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Detailed Text Context Explanations & Mini Progress HUD */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xs">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full border uppercase ${activeStepData.badgeColor}`}>
                {activeStepData.badge}
              </span>

              {isPlaying && (
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Playing Auto-Flow
                </span>
              )}
            </div>

            <h3 className="font-display font-extrabold text-2xl text-zinc-950 tracking-tight">
              {activeStepData.title}
            </h3>

            <p className="text-zinc-650 text-sm leading-relaxed">
              {activeStepData.description}
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-150/80 p-4 rounded-xl flex flex-col gap-2.5 mt-4">
            <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase">
              Under The Hood Guardrail
            </span>
            <p className="text-xs text-zinc-650 leading-relaxed font-sans">
              {activeStepData.explanation}
            </p>
          </div>

          {/* Active progress tracker status bar with flowing active indicator */}
          <div className="mt-6 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10.5px] font-mono text-zinc-400">
              <span className="font-bold">COMPENSATION FLOW STATUS</span>
              <span className="text-zinc-600 font-bold">{currentStep} of 4</span>
            </div>
            
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-sky-500 rounded-full"
                animate={{
                  width: `${(currentStep / 4) * 100}%`
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut"
                }}
              />
              
              {isPlaying && (
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-white/40 shadow-xs"
                  style={{ width: `${transitPercent}%` }}
                />
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Terminal Console Window */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 md:p-6 font-mono text-xs leading-relaxed text-zinc-300 shadow-sm h-full flex flex-col justify-between">
            <div>
              {/* Simulator Header Bar */}
              <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  
                  <div className="flex items-center gap-1.5 ml-2">
                    {getStepIcon(activeStepData.fileType)}
                    <span className="text-[11px] text-zinc-400 font-sans tracking-tight font-medium select-all">
                      {activeStepData.fileName}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-550 bg-zinc-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {activeStepData.fileType === 'sifr' ? 'Source' : activeStepData.fileType === 'rs' ? 'Emitted Rust' : 'Terminal stdout'}
                </div>
              </div>

              {/* Console logs / code with syntax highlighting simulator */}
              <div className="overflow-x-auto min-h-[220px]">
                <pre className="select-text whitespace-pre text-[11.5px] md:text-[12px] leading-relaxed font-mono text-zinc-300">
                  {activeStepData.code.split('\n').slice(0, visibleLinesCount).map((line, logIndex) => {
                    const isCodeType = activeStepData.fileType === 'sifr' || activeStepData.fileType === 'rs';
                    
                    // Simple heuristic compiler highlighting for non-code terminal logs
                    let className = "text-zinc-300";
                    if (!isCodeType) {
                      if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
                        className = "text-zinc-500 italic";
                      } else if (line.includes('✓ OK:') || line.startsWith('✓')) {
                        className = "text-emerald-400 font-semibold";
                      } else if (line.includes('error[') || line.includes('error:')) {
                        className = "text-red-400 font-bold";
                      } else if (line.startsWith('Analyzing') || line.startsWith('input:') || line.startsWith('mode:')) {
                        className = "text-sky-300 font-medium";
                      }
                    }

                    // Check highlights matching the array
                    const isHighlighted = activeStepData.highlights.some(hl => line.includes(hl));

                    return (
                      <div 
                        key={logIndex} 
                        className={`px-2 py-0.5 rounded transition-all leading-normal ${className} ${
                          isHighlighted ? 'bg-zinc-900 border-l-2 border-sky-400 pl-1.5' : ''
                        }`}
                      >
                        {isCodeType ? highlightLineText(line) : line}
                      </div>
                    );
                  })}
                </pre>
              </div>

            </div>

            {/* Bottom active state indicator box */}
            <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span>Compiler State: <strong className="text-zinc-400 font-bold uppercase">{activeStepData.label}</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
