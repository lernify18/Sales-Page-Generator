
import React, { useState } from 'react';

interface CopyableMessageProps {
  message: string;
}

const CopyableMessage: React.FC<CopyableMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group relative bg-emerald-900/30 border border-emerald-800 p-4 rounded-lg">
      <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{message}</p>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold bg-gray-700 text-gray-200 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
      >
        {copied ? 'Disalin!' : 'Salin'}
      </button>
    </div>
  );
};

export default CopyableMessage;
