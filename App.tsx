import React, { useState, useCallback, useEffect } from 'react';
import { processMessageWithTone } from './services/geminiService';
import { Tone, ToneOption } from './types';
import ToneSelector from './components/ToneSelector';

const TONE_OPTIONS: ToneOption[] = [
  { value: Tone.FORMAL, label: 'Formal' },
  { value: Tone.POLITE, label: 'Polite' },
  { value: Tone.FRIENDLY, label: 'Friendly' },
  { value: Tone.EMPATHETIC, label: 'Empathetic' },
  { value: Tone.CONCISE, label: 'Concise' },
];

function App() {
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [currentTone, setCurrentTone] = useState<string>('');
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [targetTone, setTargetTone] = useState<Tone>(Tone.FORMAL); // Default target tone
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showBillingInfo, setShowBillingInfo] = useState<boolean>(false);

  // Check API key status on mount
  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore window.aistudio is available in the execution environment
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setShowBillingInfo(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleOpenSelectKey = useCallback(async () => {
    // @ts-ignore window.aistudio is available in the execution environment
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setShowBillingInfo(false); // Assume successful selection
      } catch (e) {
        console.error("Error opening key selection dialog:", e);
        setError("Failed to open API key selection. Please try again.");
      }
    } else {
      setError("API key selection utility not available in this environment.");
    }
  }, []);

  const handleDraftMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftMessage(e.target.value);
    setError(null); // Clear errors when user types
    setCurrentTone(''); // Clear results on input change
    setRewrittenText('');
  };

  const handleToneChange = useCallback((tone: Tone) => {
    setTargetTone(tone);
    setRewrittenText(''); // Clear rewritten text when target tone changes
  }, []);

  const handleProcessMessage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTone('');
    setRewrittenText('');
    try {
      const result = await processMessageWithTone(draftMessage, targetTone);
      setCurrentTone(result.detected_tone);
      setRewrittenText(result.rewritten_text);
    } catch (err: any) {
      console.error("Processing error:", err);
      setError(err.message || "Failed to process message. Please try again.");
      if (err.message.includes("Requested entity was not found.")) {
        setShowBillingInfo(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [draftMessage, targetTone]);

  const isInputEmpty = draftMessage.trim().length === 0;

  return (
    <div className="flex flex-col flex-grow items-center p-4 sm:p-6 md:p-8 bg-gray-50">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-2">
          Email Tone Checker
        </h1>
        <p className="text-xl text-gray-600">
          Analyze and rewrite your messages for the perfect tone.
        </p>
      </header>

      {showBillingInfo && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 w-full max-w-2xl rounded-md shadow-md">
          <p className="font-bold">API Key Required!</p>
          <p>This application requires an API key from a paid GCP project. Please select or configure your API key to use all features.</p>
          <button
            onClick={handleOpenSelectKey}
            className="mt-4 px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            Select API Key
          </button>
          <p className="mt-2 text-sm">
            Learn more about billing: {' '}
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-800 underline hover:text-yellow-900"
            >
              ai.google.dev/gemini-api/docs/billing
            </a>
          </p>
        </div>
      )}

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Input Section */}
        <section className="bg-white p-6 rounded-lg shadow-xl flex flex-col h-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Draft Message</h2>
          <textarea
            className="flex-grow w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none text-base transition-shadow duration-300 shadow-sm hover:shadow-md bg-white text-black"
            placeholder="Paste your email, chat, or note here..."
            rows={10}
            value={draftMessage}
            onChange={handleDraftMessageChange}
            disabled={isLoading || showBillingInfo}
            aria-label="Draft message input"
          ></textarea>
          
          <div className="mt-6">
            <ToneSelector
              selectedTone={targetTone}
              onToneChange={handleToneChange}
              options={TONE_OPTIONS}
              disabled={isLoading || showBillingInfo}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleProcessMessage}
              disabled={isLoading || isInputEmpty || targetTone === Tone.UNKNOWN || showBillingInfo}
              className={`w-full px-6 py-3 rounded-lg font-bold text-lg transition duration-200 ease-in-out
                ${isLoading || isInputEmpty || targetTone === Tone.UNKNOWN || showBillingInfo
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75'
                }`}
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? 'Processing...' : 'Process Message'}
            </button>
          </div>
        </section>

        {/* Output Section */}
        <section className="bg-white p-6 rounded-lg shadow-xl flex flex-col h-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
          
          <div className="mb-6 flex flex-col">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Current Tone:</h3>
            <div className="min-h-[48px] p-3 bg-blue-50 rounded-md border border-blue-200 flex items-center justify-center transition-all duration-300"
                 aria-live="polite">
              {isLoading && !currentTone ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </div>
              ) : currentTone ? (
                <p className="text-blue-800 font-semibold text-lg text-center">{currentTone}</p>
              ) : (
                <p className="text-gray-500 text-center italic">Analyze your message to see its current tone.</p>
              )}
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Rewritten Text:</h3>
            <div className="flex-grow p-4 bg-green-50 rounded-md border border-green-200 min-h-[150px] flex items-center justify-center relative transition-all duration-300"
                 aria-live="polite">
              {isLoading && !rewrittenText ? (
                 <div className="flex items-center space-x-2 text-green-600">
                 <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>Rewriting...</span>
               </div>
              ) : rewrittenText ? (
                <p className="text-green-800 whitespace-pre-wrap text-base">{rewrittenText}</p>
              ) : (
                <p className="text-gray-500 italic">Your rewritten text will appear here.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {error && (
        <div className="w-full max-w-4xl bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md shadow-md" role="alert">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <footer className="w-full max-w-4xl text-center text-gray-500 mt-8 p-4 border-t border-gray-200">
        Powered by Gemini API
      </footer>
    </div>
  );
}

export default App;
