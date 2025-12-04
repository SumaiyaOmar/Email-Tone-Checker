import React from 'react';
import { Tone, ToneOption } from '../types';

interface ToneSelectorProps {
  selectedTone: Tone;
  onToneChange: (tone: Tone) => void;
  options: ToneOption[];
  disabled?: boolean;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange,
  options,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onToneChange(event.target.value as Tone);
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:space-x-4">
      <label htmlFor="tone-select" className="text-lg font-medium text-gray-700 mb-2 md:mb-0">
        Target Tone:
      </label>
      <select
        id="tone-select"
        value={selectedTone}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full md:w-auto p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ToneSelector;
