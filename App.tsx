
import React, { useState, useCallback, useEffect } from 'react';
import type { GeneratedScript } from './types';
import { generateScript } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ScriptDisplay from './components/ScriptDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';

// Define the AIStudio interface to match the expected global type and fix declaration conflicts
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState<boolean>(false);

  // Semak jika API Key sudah ada atau perlu dipilih
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      // Use process.env.API_KEY directly as per guidelines
      const envKey = process.env.API_KEY;
      
      if (!envKey && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNeedsKey(true);
        }
      }
    };
    checkApiKeyStatus();
  }, []);

  const handleOpenKeyPicker = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Anggap pemilihan berjaya dan teruskan ke aplikasi (mitigate race condition)
      setNeedsKey(false);
    }
  };

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
    } catch (err: any) {
      console.error('Error generating script:', err);
      
      // Jika ralat disebabkan kunci tidak dijumpai (Requested entity was not found)
      if (err.message?.includes('Requested entity was not found') && window.aistudio) {
        setError('API Key tidak sah atau tidak dijumpai. Sila pilih semula.');
        setNeedsKey(true);
      } else {
        setError(err.message || 'Maaf, ada masalah teknikal semasa menjana skrip. Sila cuba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          {needsKey ? (
            <div className="bg-gray-800 p-8 rounded-xl border border-emerald-500/30 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">Sediakan API Key</h2>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Kunci API tidak dikesan. Sila pilih API Key anda untuk mula menjana skrip jualan yang power.
              </p>
              <button
                onClick={handleOpenKeyPicker}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
              >
                Pilih API Key
              </button>
              <p className="mt-6 text-xs text-gray-500">
                Nota: Anda memerlukan akaun Google Cloud dengan pengebilan aktif. Maklumat lanjut di <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">ai.google.dev/gemini-api/docs/billing</a>
              </p>
            </div>
          ) : (
            <>
              <InputForm onSubmit={handleGenerateScript} isLoading={isLoading} />
              <div className="mt-8">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} />}
                {script && <ScriptDisplay script={script} />}
                {!isLoading && !error && !script && <Welcome />}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
