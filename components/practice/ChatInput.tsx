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
  <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center px-4 lg:left-64 lg:w-[calc(100%-16rem)]">
    <div className="w-full max-w-2xl mx-auto flex items-center gap-2 relative bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
        <textarea
          className="flex-1 p-2 bg-transparent rounded-lg text-gray-800 focus:outline-none resize-none custom-scrollbar"
          placeholder="Type your answer here... or use the microphone to speak."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          disabled={isGenerating}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isGenerating) sendUserResponse();
            }
          }}
        />
        <button
          onClick={handleMicClick}
          disabled={isRecording || isGenerating}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
          title={isRecording ? 'Recording...' : 'Record voice'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRecording ? 'text-red-500' : ''}>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z" fill="currentColor"/>
          </svg>
        </button>
        <button
          onClick={sendUserResponse}
          disabled={isGenerating || !userResponse.trim()}
          className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;