import { useState, useCallback } from 'react';
import { classifyMessage, ClassificationResult, AgentType } from '@/lib/agent-classifier';

export function useAgentDetect() {
  const [manualAgent, setManualAgent] = useState<AgentType | 'auto'>('auto');
  const [lastClassification, setLastClassification] = useState<ClassificationResult | null>(null);

  const detectAgent = useCallback(
    (message: string): AgentType => {
      if (manualAgent !== 'auto') return manualAgent;

      const result = classifyMessage(message);
      setLastClassification(result);
      return result.agent;
    },
    [manualAgent],
  );

  const resolveCanvasType = useCallback(
    (message: string): ClassificationResult['canvasType'] => {
      if (lastClassification) return lastClassification.canvasType;
      return classifyMessage(message).canvasType;
    },
    [lastClassification],
  );

  return {
    manualAgent,
    setManualAgent,
    detectAgent,
    resolveCanvasType,
    lastClassification,
  };
}
