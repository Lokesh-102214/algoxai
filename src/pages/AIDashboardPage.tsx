import React from 'react';
import ChatLayout from '@/components/chat/ChatLayout';

const AIDashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <ChatLayout />
    </div>
  );
};

export default AIDashboardPage;
