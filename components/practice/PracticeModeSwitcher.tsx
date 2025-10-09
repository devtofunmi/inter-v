
import React from 'react';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface PracticeModeSwitcherProps {
  practiceMode: string;
  setPracticeMode: (mode: string) => void;
}

const PracticeModeSwitcher: React.FC<PracticeModeSwitcherProps> = ({ practiceMode, setPracticeMode }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex rounded-full bg-gray-200 p-1">
        <button
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
            practiceMode === 'chat' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setPracticeMode('chat')}
        >
          <MessageSquare size={16} /> Chat Mode
        </button>
        <button
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
            practiceMode === 'quiz' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setPracticeMode('quiz')}
        >
          <HelpCircle size={16} /> Quiz Mode
        </button>
      </div>
    </div>
  );
};

export default PracticeModeSwitcher;
