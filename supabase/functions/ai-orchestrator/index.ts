import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type AgentType = "concept-explainer" | "code-analyzer" | "debugging-assistant";
type Intent = "EXPLAIN" | "ANALYZE" | "DEBUG" | "GENERAL";

function classifyIntent(message: string, pageContext: string): { intent: Intent; confidence: number } {
  const lower = message.toLowerCase().slice(0, 200);
  const ctx = pageContext.toLowerCase();

  // DEBUG signals
  const debugKeywords = ["error", "bug", "wrong output", "tle", "mle", "wa", "re ", "runtime error", "time limit", "memory limit", "segfault", "crash", "fix", "not working", "fails"];
  const debugScore = debugKeywords.filter(k => lower.includes(k)).length;
  if (debugScore >= 2) return { intent: "DEBUG", confidence: 0.95 };
  if (debugScore >= 1) return { intent: "DEBUG", confidence: 0.8 };

  // ANALYZE signals
  const analyzeKeywords = ["optimize", "review", "complexity", "is this correct", "check my", "improve", "refactor", "faster", "efficient"];
  const hasCode = lower.includes("```") || lower.includes("#include") || lower.includes("int main") || lower.includes("def ") || lower.includes("class ") || lower.includes("function ");
  const analyzeScore = analyzeKeywords.filter(k => lower.includes(k)).length;
  if (hasCode && analyzeScore >= 1) return { intent: "ANALYZE", confidence: 0.95 };
  if (hasCode) return { intent: "ANALYZE", confidence: 0.8 };
  if (analyzeScore >= 1) return { intent: "ANALYZE", confidence: 0.75 };
  if (ctx.includes("practice")) return { intent: "ANALYZE", confidence: 0.6 };

  // EXPLAIN signals
  const explainKeywords = ["what is", "explain", "how does", "how do", "why", "tell me about", "describe", "define", "concept", "algorithm", "data structure", "learn"];
  const explainScore = explainKeywords.filter(k => lower.includes(k)).length;
  if (explainScore >= 1) return { intent: "EXPLAIN", confidence: 0.85 };
  if (ctx.includes("algorithm")) return { intent: "EXPLAIN", confidence: 0.7 };

  return { intent: "GENERAL", confidence: 0.5 };
}

function intentToAgent(intent: Intent): AgentType {
  switch (intent) {
    case "DEBUG": return "debugging-assistant";
    case "ANALYZE": return "code-analyzer";
    case "EXPLAIN":
    case "GENERAL":
    default: return "concept-explainer";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, pageContext, forceAgent } = await req.json();
    
    let agent: AgentType;
    let confidence: number;

    if (forceAgent) {
      agent = forceAgent as AgentType;
      confidence = 1.0;
    } else {
      const classification = classifyIntent(message, pageContext || "");
      agent = intentToAgent(classification.intent);
      confidence = classification.confidence;
    }

    // Route to the specialist agent
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    const agentUrl = `${supabaseUrl}/functions/v1/agent-${agent}`;
    
    const agentResponse = await fetch(agentUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, pageContext }),
    });

    if (!agentResponse.ok) {
      const errorBody = await agentResponse.text();
      console.error(`Agent ${agent} error:`, agentResponse.status, errorBody);
      return new Response(JSON.stringify({ error: `Agent error: ${agentResponse.status}` }), {
        status: agentResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return SSE stream with agent metadata prepended
    const metaLine = `data: ${JSON.stringify({ meta: true, agent, confidence })}\n\n`;
    const encoder = new TextEncoder();
    
    const transformedStream = new ReadableStream({
      async start(controller) {
        // Send metadata first
        controller.enqueue(encoder.encode(metaLine));
        
        const reader = agentResponse.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(transformedStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("orchestrator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
