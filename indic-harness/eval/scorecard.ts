/**
 * Indic Coding Harness - Evaluation Scorecard Generator
 * Compares English vs Hinglish performance, tool error rates, step efficiency, and category breakdown.
 */

import { EvalResult, EvalCategory } from '../src/types';

export interface AggregateMetrics {
  totalTasks: number;
  enPassed: number;
  hiPassed: number;
  enPassRate: number;
  hiPassRate: number;
  hinglishGap: number; // enPassRate - hiPassRate
  enAvgSteps: number;
  hiAvgSteps: number;
  enAvgToolErrors: number;
  hiAvgToolErrors: number;
  enAvgDurationMs: number;
  hiAvgDurationMs: number;
  categoryBreakdown: Record<
    EvalCategory,
    {
      enTotal: number;
      enPassed: number;
      hiTotal: number;
      hiPassed: number;
    }
  >;
}

export function computeMetrics(results: EvalResult[]): AggregateMetrics {
  const enResults = results.filter((r) => r.language === 'english');
  const hiResults = results.filter((r) => r.language === 'hinglish');

  const enTotal = enResults.length || 1;
  const hiTotal = hiResults.length || 1;

  const enPassed = enResults.filter((r) => r.pass).length;
  const hiPassed = hiResults.filter((r) => r.pass).length;

  const enPassRate = Math.round((enPassed / enTotal) * 100);
  const hiPassRate = Math.round((hiPassed / hiTotal) * 100);

  const enAvgSteps = Number((enResults.reduce((acc, r) => acc + r.steps, 0) / enTotal).toFixed(2));
  const hiAvgSteps = Number((hiResults.reduce((acc, r) => acc + r.steps, 0) / hiTotal).toFixed(2));

  const enAvgToolErrors = Number(
    (enResults.reduce((acc, r) => acc + r.toolErrors, 0) / enTotal).toFixed(2)
  );
  const hiAvgToolErrors = Number(
    (hiResults.reduce((acc, r) => acc + r.toolErrors, 0) / hiTotal).toFixed(2)
  );

  const enAvgDurationMs = Math.round(
    enResults.reduce((acc, r) => acc + r.durationMs, 0) / enTotal
  );
  const hiAvgDurationMs = Math.round(
    hiResults.reduce((acc, r) => acc + r.durationMs, 0) / hiTotal
  );

  const categories: EvalCategory[] = ['bug_fix', 'refactor', 'test_writing', 'repo_qa'];
  const categoryBreakdown = {} as AggregateMetrics['categoryBreakdown'];

  for (const cat of categories) {
    const enCat = enResults.filter((r) => r.category === cat);
    const hiCat = hiResults.filter((r) => r.category === cat);
    categoryBreakdown[cat] = {
      enTotal: enCat.length,
      enPassed: enCat.filter((r) => r.pass).length,
      hiTotal: hiCat.length,
      hiPassed: hiCat.filter((r) => r.pass).length,
    };
  }

  return {
    totalTasks: Math.max(enResults.length, hiResults.length),
    enPassed,
    hiPassed,
    enPassRate,
    hiPassRate,
    hinglishGap: enPassRate - hiPassRate,
    enAvgSteps,
    hiAvgSteps,
    enAvgToolErrors,
    hiAvgToolErrors,
    enAvgDurationMs,
    hiAvgDurationMs,
    categoryBreakdown,
  };
}

export function generateMarkdownScorecard(
  results: EvalResult[],
  modelName: string,
  timestamp = new Date().toISOString()
): string {
  const metrics = computeMetrics(results);

  let md = `# Indic Coding Harness - Evaluation Scorecard\n\n`;
  md += `**Model:** \`${modelName}\` | **Date:** ${timestamp} | **Tasks Evaluated:** ${metrics.totalTasks} (Dual English & Hinglish)\n\n`;

  md += `## 1. High-Level Summary\n\n`;
  md += `| Metric | English Prompt | Hinglish Prompt | Delta (Hinglish Gap) |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  md += `| **Pass Rate** | **${metrics.enPassRate}%** (${metrics.enPassed}/${metrics.totalTasks}) | **${metrics.hiPassRate}%** (${metrics.hiPassed}/${metrics.totalTasks}) | **${metrics.hinglishGap > 0 ? '-' : '+'}${Math.abs(metrics.hinglishGap)}%** |\n`;
  md += `| **Avg Steps / Task** | ${metrics.enAvgSteps} | ${metrics.hiAvgSteps} | ${(metrics.hiAvgSteps - metrics.enAvgSteps).toFixed(2)} |\n`;
  md += `| **Avg Tool Errors** | ${metrics.enAvgToolErrors} | ${metrics.hiAvgToolErrors} | ${(metrics.hiAvgToolErrors - metrics.enAvgToolErrors).toFixed(2)} |\n`;
  md += `| **Avg Latency** | ${metrics.enAvgDurationMs} ms | ${metrics.hiAvgDurationMs} ms | ${metrics.hiAvgDurationMs - metrics.enAvgDurationMs} ms |\n\n`;

  md += `## 2. Category Breakdown\n\n`;
  md += `| Category | English Pass Rate | Hinglish Pass Rate | Hinglish Gap |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;

  for (const [cat, data] of Object.entries(metrics.categoryBreakdown)) {
    const enRate = data.enTotal ? Math.round((data.enPassed / data.enTotal) * 100) : 0;
    const hiRate = data.hiTotal ? Math.round((data.hiPassed / data.hiTotal) * 100) : 0;
    const gap = enRate - hiRate;
    const catName = cat.replace('_', ' ').toUpperCase();
    md += `| ${catName} | ${enRate}% (${data.enPassed}/${data.enTotal}) | ${hiRate}% (${data.hiPassed}/${data.hiTotal}) | ${gap > 0 ? '-' : '+'}${Math.abs(gap)}% |\n`;
  }

  md += `\n## 3. Individual Task Outcomes\n\n`;
  md += `| Task ID | Title | Category | English | Hinglish | Feedback |\n`;
  md += `| :--- | :--- | :--- | :---: | :---: | :--- |\n`;

  const taskIds = Array.from(new Set(results.map((r) => r.taskId)));
  for (const id of taskIds) {
    const en = results.find((r) => r.taskId === id && r.language === 'english');
    const hi = results.find((r) => r.taskId === id && r.language === 'hinglish');
    const title = en?.title || hi?.title || id;
    const cat = en?.category || hi?.category || 'unknown';
    const enIcon = en?.pass ? '✅ Pass' : '❌ Fail';
    const hiIcon = hi?.pass ? '✅ Pass' : '❌ Fail';
    const feedback = hi?.feedback || en?.feedback || 'N/A';
    md += `| \`${id}\` | ${title} | ${cat} | ${enIcon} | ${hiIcon} | ${feedback} |\n`;
  }

  return md;
}

export function printConsoleScorecard(results: EvalResult[], modelName: string): void {
  const metrics = computeMetrics(results);

  console.log('\n===============================================================');
  console.log(`       INDIC CODING HARNESS EVALUATION SCORECARD (${modelName})`);
  console.log('===============================================================');
  console.log(`Evaluated Tasks: ${metrics.totalTasks} dual (English vs Hinglish)\n`);
  console.log(`English Pass Rate:    ${metrics.enPassRate}% (${metrics.enPassed}/${metrics.totalTasks})`);
  console.log(`Hinglish Pass Rate:   ${metrics.hiPassRate}% (${metrics.hiPassed}/${metrics.totalTasks})`);
  console.log(`Hinglish Gap:         ${metrics.hinglishGap > 0 ? '-' : '+'}${Math.abs(metrics.hinglishGap)}%`);
  console.log(`Avg Steps per Task:   EN: ${metrics.enAvgSteps} | HI: ${metrics.hiAvgSteps}`);
  console.log(`Avg Tool Call Errors: EN: ${metrics.enAvgToolErrors} | HI: ${metrics.hiAvgToolErrors}`);
  console.log('---------------------------------------------------------------');
  console.log('Category Breakdown:');
  for (const [cat, data] of Object.entries(metrics.categoryBreakdown)) {
    const enRate = data.enTotal ? Math.round((data.enPassed / data.enTotal) * 100) : 0;
    const hiRate = data.hiTotal ? Math.round((data.hiPassed / data.hiTotal) * 100) : 0;
    console.log(`  - ${cat.padEnd(14)}: EN ${enRate}% (${data.enPassed}/${data.enTotal}) | HI ${hiRate}% (${data.hiPassed}/${data.hiTotal}) | Gap: ${enRate - hiRate}%`);
  }
  console.log('===============================================================\n');
}
