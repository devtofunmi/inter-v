
import React from 'react';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface PracticeModeSwitcherProps {
  practiceMode: string;
  setPracticeMode: (mode: string) => void;
}

const PracticeModeSwitcher: React.FC<PracticeModeSwitcherProps> = ({ practiceMode, setPracticeMode }) => {
  return (
    <div className="flex justify-center mb-8">
      <button
        className={`px-6 py-2 rounded-l-full md:font-medium font-sm transition-colors duration-200 ${
          practiceMode === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        onClick={() => setPracticeMode('chat')}
      >
        <MessageSquare size={18} className="hidden md:inline-block mr-2" /> Chat Mode
      </button>
      <button
        className={`px-6 py-2 rounded-r-full md:font-medium font-sm transition-colors duration-200 ${
          practiceMode === 'quiz' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        onClick={() => setPracticeMode('quiz')}
      >
        <HelpCircle size={18} className="hidden md:inline-block mr-2" /> Quiz Mode
      </button>
    </div>
  );
};

export default PracticeModeSwitcher;
