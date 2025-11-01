import React, { useRef, useEffect } from 'react';
import { Bot, User as UserIcon } from 'lucide-react';

interface ChatViewProps {
  conversationHistory: Array<{ role: string; parts: string }>;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationHistory }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  const formatMessage = (text: string) => {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: formattedText.replace(/\n/g, '<br />') }} />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4 text-left font-sans">
      {conversationHistory.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 ${msg.role === 'User' ? 'justify-start' : ''} w-full`}>
          
          {(msg.role === 'AI' || msg.role === 'User') && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'AI' ? 'bg-emerald-100' : 'bg-gray-200'}`}>
              {msg.role === 'AI' ? <Bot size={18} className="text-emerald-600" /> : <UserIcon size={18} className="text-gray-600" />}
            </div>
          )}

          <div className={`p-4 rounded-xl max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl break-words break-all min-w-0 ${msg.role === 'AI' ? 'bg-white border border-gray-200' : 'bg-emerald-600 text-white'}`}>
            <div className="text-base">
              {formatMessage(msg.parts)}
            </div>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatView;
