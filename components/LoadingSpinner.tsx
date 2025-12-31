
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-800/50 rounded-lg">
      <div className="w-12 h-12 border-4 border-t-transparent border-emerald-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-300 font-semibold">AI sedang menulis skrip power untuk anda...</p>
    </div>
  );
};

export default LoadingSpinner;
