
import React from 'react';
import { Loader2, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  userResponse: string;
  setUserResponse: (response: string) => void;
  isGenerating: boolean;
  isRecording: boolean;
  handleMicClick: () => void;
  sendUserResponse: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ userResponse, setUserResponse, isGenerating, isRecording, handleMicClick, sendUserResponse }) => {
  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="w-full max-w-2xl flex items-end gap-2 bg-transparent p-0" style={{ position: 'relative' }}>
        <textarea
          className="flex-1 p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none h-28 pr-10 sidebar-scrollbar"
          placeholder="Type your answer here..."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          disabled={isGenerating}
          style={{ minHeight: '4rem' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isGenerating) sendUserResponse();
            }
          }}
        ></textarea>
        {/* Microphone Button */}
        <button
          onClick={handleMicClick}
          disabled={isRecording || isGenerating}
          className="absolute cursor-pointer right-12 bottom-2 px-2 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold text-white transition-colors duration-200 flex items-center justify-center"
          title={isRecording ? 'Recording...' : 'Record voice'}
        >
          {/* Record icon SVG, red when recording */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill={isRecording ? '#ef4444' : 'currentColor'} xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="7" fill={isRecording ? '#ef4444' : 'currentColor'} />
          </svg>
        </button>
        {/* Send Button */}
        <button
          onClick={sendUserResponse}
          disabled={isGenerating}
          className="absolute cursor-pointer right-2 bottom-2 px-2.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={15} /> : <ArrowUp size={15} />}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
