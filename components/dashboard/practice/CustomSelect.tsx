import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className={`w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center ${value ? 'text-black' : 'text-gray-400'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? options.find(o => o.value === value)?.label : placeholder}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul className="py-1">
            {options.map(option => (
              <li
                key={option.value}
                className="px-3 py-2 cursor-pointer hover:bg-blue-400 hover:text-white"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
