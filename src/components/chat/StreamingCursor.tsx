import React from 'react';

interface StreamingCursorProps {
  visible?: boolean;
}

const StreamingCursor: React.FC<StreamingCursorProps> = ({ visible = true }) => {
  if (!visible) return null;
  return <span className="chat-cursor" aria-hidden="true" />;
};

export default StreamingCursor;
