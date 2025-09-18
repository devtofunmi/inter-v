
import React, { useRef, useEffect } from 'react';

interface User {
  name: string | null;
}

interface ChatViewProps {
  conversationHistory: Array<{ role: string; parts: string }>;
  user: User | null;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationHistory, user }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  return (
    <div className="w-full max-w-2xl p-4 space-y-4 text-left">
      {conversationHistory.map((msg, index) => (
        <div
          key={index}
          className={
            msg.role === 'AI'
              ? 'text-left text-orange-500 font-semibold mb-1'
              : 'text-left text-purple-500 font-semibold mb-1'
          }
          style={{ background: 'none', marginLeft: 0, marginRight: 0 }}
        >
          <span>
            {msg.role === 'AI' ? 'AI' : (user?.name || 'User')}
          </span>
          <span className="text-white font-normal ml-2">
            {typeof msg.parts === 'string' ? (
              (() => {
                const text = msg.parts.replace(/\*/g, '');
                // Blockify and color key feedback labels
                const feedbackLabels = ['Feedback:', 'Evaluation:', 'Relevance:', 'Correctness:', 'Depth:', 'Next Question:'];
                const blocks = [];
                let remaining = text;
                while (true) {
                  let minIdx = -1;
                  let label = '';
                  for (const l of feedbackLabels) {
                    const idx = remaining.indexOf(l);
                    if (idx !== -1 && (minIdx === -1 || idx < minIdx)) {
                      minIdx = idx;
                      label = l;
                    }
                  }
                  if (minIdx === -1) {
                    if (remaining.trim()) blocks.push(remaining);
                    break;
                  }
                  if (minIdx > 0) {
                    blocks.push(remaining.slice(0, minIdx));
                  }
                  // Find end of label block (next label or end)
                  let nextIdx = remaining.length;
                  for (const l of feedbackLabels) {
                    const idx = remaining.indexOf(l, minIdx + label.length);
                    if (idx !== -1 && idx < nextIdx) nextIdx = idx;
                  }
                  // Split label and feedback
                  const labelBlock = remaining.slice(minIdx, minIdx + label.length);
                  const feedbackBlock = remaining.slice(minIdx + label.length, nextIdx);
                  blocks.push(
                    <p className="my-1">
                      <span className="text-orange-500 font-semibold">{labelBlock.trim()}</span>
                      <span className="text-white font-normal">{feedbackBlock}</span>
                    </p>
                  );
                  remaining = remaining.slice(nextIdx);
                }
                return blocks;
              })()
            ) : msg.parts}
          </span>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatView;
