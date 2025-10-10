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
  isModal?: boolean; // when false render inline (no max-h scroll wrapper)
}

const ActionResult: React.FC<ActionResultProps> = ({ title, score, total, onStartNew, buttonText, wrongAnswers, isModal = true }) => {
  const containerClass = isModal
    ? 'p-8 bg-white rounded-xl w-full max-w-2xl text-gray-800 border border-gray-200 shadow-md overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]'
    : 'p-8 bg-white rounded-xl w-full max-w-2xl text-gray-800 border border-gray-200 shadow-md';

  return (
    <div className={containerClass}>
      <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">{title}</h3>
      <p className="text-lg mb-2 text-center">You have completed {total} questions.</p>
      <p className="text-3xl font-bold mb-6 text-center">Your score: <span className="text-emerald-600">{score}</span> / {total}</p>
      <button
        onClick={onStartNew}
        className="mt-4 w-full p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100"
      >
        {buttonText}
      </button>
      {wrongAnswers && wrongAnswers.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-xl mb-4 text-gray-900 text-center">Review your mistakes:</h4>
          <ul className="space-y-4">
            {wrongAnswers.map((answer, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">{index + 1}. {answer.question}</p>
                <p className="text-red-600 font-medium">Your answer: {answer.yourAnswer}</p>
                <p className="text-green-600 font-medium">Correct answer: {answer.correctAnswer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionResult;
