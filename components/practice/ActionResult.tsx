
import React from 'react';

interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface ActionResultProps {
  title: string;
  score: number;
  total: number;
  onStartNew: () => void;
  buttonText: string;
  wrongAnswers?: WrongAnswer[];
}

const ActionResult: React.FC<ActionResultProps> = ({ title, score, total, onStartNew, buttonText, wrongAnswers }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-xl w-full max-w-lg text-gray-300 border border-gray-700 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="mb-2">You have completed {total} questions.</p>
      <p className="mb-2">Your score: {score} / {total}</p>
      <button
        onClick={onStartNew}
        className="mt-4 w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white transition-colors duration-200 flex items-center justify-center"
      >
        {buttonText}
      </button>
      {wrongAnswers && wrongAnswers.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-3 text-white">Review your mistakes:</h4>
          <ul className="space-y-4">
            {wrongAnswers.map((answer, index) => (
              <li key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <p className="font-medium text-gray-300 mb-2">{index + 1}. {answer.question}</p>
                <p className="text-red-400 font-medium">Your answer: {answer.yourAnswer}</p>
                <p className="text-green-400 font-medium">Correct answer: {answer.correctAnswer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionResult;
