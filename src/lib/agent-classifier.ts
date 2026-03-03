export type AgentType = 'concept-breaker' | 'refactorer' | 'trouble-shooter';

export interface ClassificationResult {
  agent: AgentType;
  confidence: number;
  canvasType: 'code' | 'diagram' | 'document' | null;
  reason: string;
}

// ─── Keyword maps ────────────────────────────────────────────────────────────

const CONCEPT_BREAKER_SIGNALS = [
  'explain', 'what is', 'how does', 'understand', 'concept', 'define',
  'difference between', 'why does', 'teach me', 'learn', 'intuition',
  'analogy', 'example of', 'tree', 'graph', 'heap', 'sorting', 'recursion',
  'dynamic programming', 'dp', 'bfs', 'dfs', 'algorithm', 'complexity',
  'big o', 'time complexity', 'space complexity', 'binary search',
  'hash', 'queue', 'stack', 'linked list', 'trie', 'segment tree',
  'how to', 'what are', 'overview of', 'introduction to',
];

const REFACTORER_SIGNALS = [
  'refactor', 'optimize', 'review', 'improve', 'clean', 'rewrite',
  'better way', 'code review', 'is my code', 'can you check', 'look at my code',
  'analyze this', 'assess', 'efficiency', 'performance', 'speed up',
  'reduce complexity', 'code quality', 'best practice', 'pattern', 'design',
  'restructure', 'simplify', 'readable', 'maintainable',
];

const TROUBLE_SHOOTER_SIGNALS = [
  'bug', 'error', 'exception', 'crash', 'not working', 'wrong output',
  'fails', 'broken', 'issue', 'problem', 'fix', 'debug', 'segfault',
  'runtime error', 'tle', 'mle', 'wrong answer', 'wa', 'tle',
  'null pointer', 'index out of bounds', 'stack overflow', 'infinite loop',
  'why is', 'why does it', 'expected', 'actual output', 'test case fails',
  'help me fix', 'what went wrong', "doesn't work", 'incorrect',
];

// Canvas signals
const CODE_CANVAS_SIGNALS = [
  'write code', 'code for', 'implement', 'function', 'class', 'solve',
  'code', 'algorithm in', 'program', 'snippet', '#include', 'def ',
  'public static', 'function(', '=>', 'const ', 'let ', 'var ',
];

const DIAGRAM_CANVAS_SIGNALS = [
  'draw', 'visualize', 'diagram', 'tree', 'graph', 'flowchart', 'show me',
  'illustrate', 'represent', 'structure of', 'example with', 'trace',
  'step by step', 'walk me through',
];

// ─── Classifier ──────────────────────────────────────────────────────────────

export function classifyMessage(message: string): ClassificationResult {
  const lower = message.toLowerCase();

  let breakerScore = 0;
  let refactorScore = 0;
  let shooterScore = 0;

  for (const kw of CONCEPT_BREAKER_SIGNALS) {
    if (lower.includes(kw)) breakerScore += kw.split(' ').length; // weight by phrase length
  }
  for (const kw of REFACTORER_SIGNALS) {
    if (lower.includes(kw)) refactorScore += kw.split(' ').length;
  }
  for (const kw of TROUBLE_SHOOTER_SIGNALS) {
    if (lower.includes(kw)) shooterScore += kw.split(' ').length;
  }

  // Code block detection boosts refactorer/trouble-shooter
  const hasCodeBlock = message.includes('```') || message.includes('    ');
  if (hasCodeBlock) {
    refactorScore += 3;
    shooterScore += 3;
  }

  // Error keywords also boost trouble-shooter heavily
  const errorPattern = /error|exception|crash|fail/i.test(message);
  if (errorPattern) shooterScore += 5;

  const total = breakerScore + refactorScore + shooterScore || 1;
  const scores = {
    'concept-breaker': breakerScore / total,
    refactorer: refactorScore / total,
    'trouble-shooter': shooterScore / total,
  };

  let agent: AgentType = 'concept-breaker';
  let topScore = scores['concept-breaker'];

  if (scores['refactorer'] > topScore) {
    agent = 'refactorer';
    topScore = scores['refactorer'];
  }
  if (scores['trouble-shooter'] > topScore) {
    agent = 'trouble-shooter';
    topScore = scores['trouble-shooter'];
  }

  // Default to concept-breaker when unclear
  if (topScore < 0.2) {
    agent = 'concept-breaker';
    topScore = 0.4;
  }

  // Canvas type detection
  let canvasType: ClassificationResult['canvasType'] = null;
  const hasCodeCanvasSignal = CODE_CANVAS_SIGNALS.some(kw => lower.includes(kw));
  const hasDiagramSignal = DIAGRAM_CANVAS_SIGNALS.some(kw => lower.includes(kw));

  if (agent === 'refactorer') {
    canvasType = 'code';
  } else if (agent === 'trouble-shooter') {
    canvasType = 'code';
  } else if (hasDiagramSignal) {
    canvasType = 'diagram';
  } else if (hasCodeCanvasSignal) {
    canvasType = 'code';
  } else if (agent === 'concept-breaker') {
    canvasType = 'document';
  }

  const reasonMap: Record<AgentType, string> = {
    'concept-breaker': 'Detected learning / explanation intent',
    refactorer: hasCodeBlock ? 'Code block detected — reviewing' : 'Code optimization intent',
    'trouble-shooter': errorPattern ? 'Error/bug keywords detected' : 'Debugging intent detected',
  };

  return {
    agent,
    confidence: Math.min(Math.round(topScore * 100), 95),
    canvasType,
    reason: reasonMap[agent],
  };
}

export const AGENT_META: Record<AgentType, {
  label: string;
  description: string;
  shortLabel: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  dotClass: string;
  canvasTypes: string[];
}> = {
  'concept-breaker': {
    label: 'Concept Breaker',
    shortLabel: 'CB',
    description: 'Explains algorithms & data structures with intuition, analogies, and visuals',
    color: 'hsl(200 100% 62%)',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/40',
    textClass: 'text-sky-400',
    dotClass: 'bg-sky-400',
    canvasTypes: ['diagram', 'document'],
  },
  refactorer: {
    label: 'Refactorer',
    shortLabel: 'RF',
    description: 'Reviews code for correctness, complexity, patterns and clean architecture',
    color: 'hsl(142 70% 52%)',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    dotClass: 'bg-emerald-400',
    canvasTypes: ['code'],
  },
  'trouble-shooter': {
    label: 'Trouble Shooter',
    shortLabel: 'TS',
    description: 'Finds bugs, traces errors, highlights problem lines, and fixes edge cases',
    color: 'hsl(28 95% 60%)',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-400',
    dotClass: 'bg-orange-400',
    canvasTypes: ['code'],
  },
};
