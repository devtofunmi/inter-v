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
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="p-6 text-gray-800 text-left">
        <div className="mb-6">
          <span className="block text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-md px-3 py-1 w-fit mb-3 shadow-sm">Question {currentQuestionNumber + 1}/10:</span>
          <span className="block text-xl text-gray-900 font-semibold">{quizData.question}</span>
        </div>
        <div className="space-y-3">
          {Object.entries(quizData.options).map(([key, value]) => (
            <label key={key} className={`flex items-center space-x-4 cursor-pointer rounded-xl p-4 transition-all border-2 ${selectedOption === key ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 bg-white hover:border-emerald-400'}`}>
              <input
                type="radio"
                name="quizOption"
                value={key}
                checked={selectedOption === key}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="form-radio h-5 w-5 accent-emerald-600 transition-transform duration-200 transform scale-110"
              />
              <span className="text-base font-medium text-gray-800">{value}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center z-30">
        <div className="w-full max-w-3xl flex justify-end p-4">
          <button
            onClick={sendUserResponse}
            disabled={isGenerating || !selectedOption}
            className="px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={22} /> : <ArrowUp size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;