/**
 * AlgoX.ai — AWS WebSocket Chat Client
 * Wraps API Gateway WebSocket with automatic reconnection, token streaming,
 * and a promise-based send() interface identical to the old Supabase SSE client.
 */

export type AgentId = 'concept-breaker' | 'refactorer' | 'trouble-shooter';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SendOptions {
  message: string;
  sessionId?: string;
  userId?: string;
  forceAgent?: AgentId;
  history?: ChatMessage[];
  pageContext?: string;
  onToken: (token: string) => void;
  onAgentDetected?: (agent: AgentId) => void;
  onDone?: (usage: { inputTokens: number; outputTokens: number }) => void;
  onError?: (err: string) => void;
  signal?: AbortSignal;
}

type WSState = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

const WS_URL = import.meta.env.VITE_AWS_API_WS_URL as string | undefined;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_MS = 1000;

class AlgoXChatClient {
  private ws: WebSocket | null = null;
  private state: WSState = 'idle';
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  // Pending send call while socket is still opening
  private pendingQueue: Array<() => void> = [];

  // Active streaming callback map (keyed by a per-request nonce is overkill —
  // WS is sequential per-connection so a single slot is fine)
  private activeCallbacks: Omit<SendOptions, 'message' | 'sessionId' | 'userId' | 'forceAgent' | 'history' | 'pageContext' | 'signal'> | null = null;

  // ── connection ─────────────────────────────────────────────────────────────
  connect(userId = 'anonymous'): Promise<void> {
    if (this.state === 'open') return Promise.resolve();
    if (this.state === 'connecting') {
      return new Promise(res => this.pendingQueue.push(res));
    }

    return new Promise((resolve, reject) => {
      if (!WS_URL) {
        reject(new Error('VITE_AWS_API_WS_URL is not set. Run sam deploy first, then add it to .env'));
        return;
      }

      this.state = 'connecting';
      const url = `${WS_URL}?userId=${encodeURIComponent(userId)}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.state = 'open';
        this.reconnectAttempts = 0;
        // Flush pending queue
        this.pendingQueue.forEach(cb => cb());
        this.pendingQueue = [];
        resolve();
      };

      this.ws.onmessage = (ev) => this.handleMessage(ev);

      this.ws.onerror = (ev) => {
        console.error('[AlgoXChat] WebSocket error', ev);
        this.state = 'error';
        reject(new Error('WebSocket connection failed'));
      };

      this.ws.onclose = (ev) => {
        console.warn('[AlgoXChat] WebSocket closed', ev.code, ev.reason);
        this.state = 'closed';
        this.scheduleReconnect(userId);
      };
    });
  }

  private scheduleReconnect(userId: string) {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[AlgoXChat] Max reconnect attempts reached');
      return;
    }
    const delay = RECONNECT_BASE_MS * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    console.log(`[AlgoXChat] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.reconnectTimer = setTimeout(() => this.connect(userId), delay);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close(1000, 'Client disconnect');
    this.ws = null;
    this.state = 'idle';
    this.reconnectAttempts = 0;
  }

  get isConnected() {
    return this.state === 'open';
  }

  // ── message handling ───────────────────────────────────────────────────────
  private handleMessage(ev: MessageEvent) {
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(ev.data as string);
    } catch {
      console.warn('[AlgoXChat] Non-JSON message:', ev.data);
      return;
    }

    const cbs = this.activeCallbacks;
    if (!cbs) return;

    switch (data.type) {
      case 'agent':
        cbs.onAgentDetected?.(data.agent as AgentId);
        break;

      case 'token':
        cbs.onToken(data.content as string);
        break;

      case 'done':
        this.activeCallbacks = null;
        cbs.onDone?.({
          inputTokens: (data.usage as Record<string, number>)?.inputTokens ?? 0,
          outputTokens: (data.usage as Record<string, number>)?.outputTokens ?? 0,
        });
        break;

      case 'error':
        this.activeCallbacks = null;
        cbs.onError?.(data.message as string ?? 'Unknown error');
        break;
    }
  }

  // ── send ───────────────────────────────────────────────────────────────────
  async send(opts: SendOptions): Promise<void> {
    const {
      message,
      sessionId,
      userId = 'anonymous',
      forceAgent,
      history = [],
      pageContext,
      onToken,
      onAgentDetected,
      onDone,
      onError,
      signal,
    } = opts;

    // Handle abort before we even connect
    if (signal?.aborted) {
      onError?.('Aborted');
      return;
    }

    // Ensure connected
    try {
      await this.connect(userId);
    } catch (err) {
      onError?.((err as Error).message);
      return;
    }

    if (!this.ws || this.state !== 'open') {
      onError?.('WebSocket not connected');
      return;
    }

    // Register callbacks
    this.activeCallbacks = { onToken, onAgentDetected, onDone, onError };

    // Wire abort
    const abortHandler = () => {
      this.activeCallbacks = null;
      onError?.('Request aborted');
    };
    signal?.addEventListener('abort', abortHandler, { once: true });

    this.ws.send(JSON.stringify({
      action: 'chat',
      message,
      sessionId,
      userId,
      forceAgent,
      history: history.slice(-20),
      pageContext,
    }));
  }
}

// Singleton — one WebSocket per browser tab
export const algoxChat = new AlgoXChatClient();
