
import React from 'react';
import { Loader2, ArrowUp } from 'lucide-react';

interface QuizData {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

interface QuizViewProps {
  quizData: QuizData;
  currentQuestionNumber: number;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  sendUserResponse: () => void;
  isGenerating: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ quizData, currentQuestionNumber, selectedOption, setSelectedOption, sendUserResponse, isGenerating }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto overflow-y-auto custom-scrollbar">
      <div className="pt-6 pb-6 text-gray-300 text-left overflow-y-auto custom-scrollbar" >
        <div className="mb-2">
          <span className="block text-base font-semibold text-blue-400 bg-gray-800 rounded-md px-3 py-1 w-fit mb-2 shadow">Question {currentQuestionNumber + 1}/10:</span>
          <span className="block text-lg text-white font-medium mb-4">{quizData.question}</span>
        </div>
        <div className="space-y-3">
          {Object.entries(quizData.options).map(([key, value]) => (
            <label key={key} className={`flex items-center space-x-3 cursor-pointer rounded-lg p-3 transition border-2 ${selectedOption === key ? 'border-blue-500 bg-blue-950/60' : 'border-gray-700 bg-gray-800 hover:border-blue-400'}`}>
              <input
                type="radio"
                name="quizOption"
                value={key}
                checked={selectedOption === key}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 accent-blue-600 transition"
              />
              <span className="text-lg font-medium text-white">{key}) {value}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Fixed send button for quiz mode */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-30 pointer-events-none">
        <div className="w-full max-w-2xl flex justify-end p-4 pointer-events-auto">
          <button
            onClick={sendUserResponse}
            disabled={isGenerating || !selectedOption}
            className="absolute right-10 bottom-2 px-3 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={22} /> : <ArrowUp size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
