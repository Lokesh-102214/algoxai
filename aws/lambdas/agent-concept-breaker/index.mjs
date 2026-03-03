import { runAgent } from '../shared/agent-base.mjs';
import { AGENTS } from '../shared/agents.mjs';

const AGENT_ID = 'concept-breaker';
const { systemPrompt } = AGENTS[AGENT_ID];

export const handler = async (event) => {
  try {
    const result = await runAgent({ systemPrompt, agentId: AGENT_ID, event });
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    console.error('concept-breaker error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
