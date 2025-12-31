
import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (productTitle: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [productTitle, setProductTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(productTitle);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={productTitle}
        onChange={(e) => setProductTitle(e.target.value)}
        placeholder="Cth: Serum Ajaib Pelicin Muka"
        className="flex-grow w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg shadow-lg hover:from-emerald-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        {isLoading ? 'Menjana Skrip...' : 'Jana Skrip Power'}
      </button>
    </form>
  );
};

export default InputForm;
