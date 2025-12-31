
import React from 'react';
import type { GeneratedScript } from '../types';
import ScriptSection from './ScriptSection';

interface ScriptDisplayProps {
  script: GeneratedScript;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-emerald-400 mb-6">Skrip Jualan Anda Sedia Untuk Digunakan!</h2>
      {script.map((section, index) => (
        <ScriptSection key={index} section={section} />
      ))}
    </div>
  );
};

export default ScriptDisplay;
