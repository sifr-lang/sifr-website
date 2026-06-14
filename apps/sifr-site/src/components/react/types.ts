export interface CodeExample {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  pythonCode: string;
  rustCode: string;
  safetyBenefit: string;
  terminalLog: string[];
  compilationTimeMs: number;
}

export interface BenchmarkItem {
  name: string;
  python: number;
  nodejs: number;
  sifr: number;
  rust: number;
  unit: string;
  description: string;
}

export interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  techCode: string;
  badge: string;
}
