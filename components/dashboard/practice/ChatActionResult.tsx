import React from 'react';

interface ChatActionResultProps {
  title: string;
  summary: string;
  onStartNew: () => void;
  buttonText: string;
  isModal?: boolean;
}

const ChatActionResult: React.FC<ChatActionResultProps> = ({ title, summary, onStartNew, buttonText, isModal = true }) => {
  const containerClass = isModal
    ? 'p-8 bg-white rounded-xl w-full max-w-2xl text-gray-800 border border-gray-200 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]'
    : 'p-8 bg-white rounded-xl w-full max-w-2xl text-gray-800 border border-gray-200';

  return (
    <div className={containerClass}>
      <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">{title}</h3>
      <div className="text-left whitespace-pre-wrap">{summary}</div>
      <div className="flex justify-center items-center">
        <button
          onClick={onStartNew}
          className="mt-4 w-full max-w-[200px] p-3 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-semibold transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ChatActionResult;
