import React, { useState, useEffect } from 'react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useAgentDetect } from '@/hooks/useAgentDetect';
import { useAIChat } from '@/hooks/useAIChat';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const SIDEBAR_COLLAPSED_KEY = 'algoxai_sidebar_collapsed';

const ChatLayout: React.FC = () => {
  const {
    sessions,
    grouped,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    getSession,
  } = useChatHistory();

  const { manualAgent, setManualAgent, detectAgent } = useAgentDetect();
  const { activeAgent } = useAIChat();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // ─── Session handlers ───────────────────────────────────────────────────

  const handleNewSession = () => {
    const id = createSession();
    setActiveSessionId(id);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
  };

  const handleSessionUpdate = (
    messages: ReturnType<typeof useAIChat>['messages'],
  ) => {
    if (activeSessionId) {
      updateSession(activeSessionId, messages);
    } else if (messages.length > 0) {
      // Lazy session creation on first message
      const id = createSession();
      updateSession(id, messages);
    }
  };

  const activeSession = activeSessionId ? getSession(activeSessionId) : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[var(--chat-bg)]">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex flex-col transition-all duration-200">
        <ChatSidebar
          sessions={sessions}
          grouped={grouped}
          activeSessionId={activeSessionId}
          onSelect={handleSelectSession}
          onNew={handleNewSession}
          onDelete={handleDeleteSession}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
          manualAgent={manualAgent}
          activeAgent={activeAgent}
          onAgentChange={setManualAgent}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow
          session={activeSession}
          onSessionUpdate={handleSessionUpdate}
          onNewSession={handleNewSession}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
