
import React, { useState, useCallback } from 'react';
import type { GeneratedScript } from './types';
import { generateScript } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ScriptDisplay from './components/ScriptDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';

const App: React.FC = () => {
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = useCallback(async (productTitle: string) => {
    if (!productTitle.trim()) {
      setError('Sila masukkan nama produk.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setScript(null);

    try {
      const result = await generateScript(productTitle);
      setScript(result);
    } catch (err) {
      console.error('Error generating script:', err);
      setError('Maaf, ada masalah teknikal semasa menjana skrip. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <InputForm onSubmit={handleGenerateScript} isLoading={isLoading} />
          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {script && <ScriptDisplay script={script} />}
            {!isLoading && !error && !script && <Welcome />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
