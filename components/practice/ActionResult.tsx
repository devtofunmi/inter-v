
import React from 'react';

interface ActionResultProps {
  title: string;
  score: number;
  total: number;
  onStartNew: () => void;
  buttonText: string;
}

const ActionResult: React.FC<ActionResultProps> = ({ title, score, total, onStartNew, buttonText }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-xl w-[300px] max-w-lg text-gray-300 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="mb-2">You have completed {total} questions.</p>
      <p className="mb-2">Your score: {score} / {total}</p>
      <button
        onClick={onStartNew}
        className="mt-4 w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white transition-colors duration-200 flex items-center justify-center"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ActionResult;
