
import React from 'react';
import type { ScriptSection as ScriptSectionType } from '../types';
import CopyableMessage from './CopyableMessage';
import ImagePlaceholder from './ImagePlaceholder';

interface ScriptSectionProps {
  section: ScriptSectionType;
}

const ScriptSection: React.FC<ScriptSectionProps> = ({ section }) => {
  return (
    <details className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden" open>
      <summary className="cursor-pointer p-4 font-semibold text-lg bg-gray-700/50 hover:bg-gray-700 transition-colors flex justify-between items-center">
        {section.title}
        <svg className="w-5 h-5 text-gray-400 transform transition-transform duration-200 details-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </summary>
      <style>{`
        details[open] > summary .details-arrow {
          transform: rotate(180deg);
        }
      `}</style>
      <div className="p-4 space-y-4">
        {section.messages.map((message, index) => {
          if (message.type === 'image') {
            return <ImagePlaceholder key={index} label={message.content} />;
          }
          return <CopyableMessage key={index} message={message.content} />;
        })}
      </div>
    </details>
  );
};

export default ScriptSection;
