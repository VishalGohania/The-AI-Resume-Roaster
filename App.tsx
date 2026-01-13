import React, { useState, useEffect } from 'react';
import RoasterInput from './components/RoasterInput';
import RoasterResults from './components/RoasterResults';
import Auth from './components/Auth';
import History from './components/History';
import { analyzeResume } from './services/geminiService';
import { getCurrentUser, loginUser, logoutUser, saveAnalysis, getHistory, clearHistory } from './services/storageService';
import { AnalysisResult, AppState, HistoryItem } from './types';

type ViewState = 'ROAST' | 'HISTORY';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('ROAST');
  
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username: string) => {
    loginUser(username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setResult(null);
    setAppState(AppState.IDLE);
    setView('ROAST');
  };

  const handleAnalyze = async (resumeText: string, jobDesc: string) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      const analysis = await analyzeResume(resumeText, jobDesc);
      setResult(analysis);
      setAppState(AppState.RESULTS);
      
      // Auto-save to history
      if (currentUser) {
        saveAnalysis(currentUser, jobDesc, analysis);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to generate roast. Please check your API Key and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.result);
    setAppState(AppState.RESULTS);
    setView('ROAST');
  };

  const getHistoryItems = () => {
    if (!currentUser) return [];
    return getHistory(currentUser);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md p-4 flex justify-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                The AI <span className="text-orange-500">Resume Roaster</span>
              </h1>
            </div>
        </header>
        <div className="flex-1">
          <Auth onLogin={handleLogin} />
        </div>
        <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm bg-gray-900">
          <p>© {new Date().getFullYear()} Resume Roaster. Powered by Gemini.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('ROAST'); handleReset(); }}>
            <span className="text-2xl">🔥</span>
            <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">
              The AI <span className="text-orange-500">Resume Roaster</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => { setView('ROAST'); if(appState === AppState.RESULTS) handleReset(); }}
              className={`text-sm font-medium transition-colors ${view === 'ROAST' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              New Roast
            </button>
            <button 
              onClick={() => setView('HISTORY')}
              className={`text-sm font-medium transition-colors ${view === 'HISTORY' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              History
            </button>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden sm:inline">Logged in as {currentUser}</span>
              <button 
                onClick={handleLogout}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        
        {view === 'HISTORY' && (
          <History 
            history={getHistoryItems()} 
            onSelect={handleHistorySelect} 
            onClear={() => {
              if (currentUser) clearHistory(currentUser);
              setView('HISTORY'); // Trigger re-render effectively
            }}
          />
        )}

        {view === 'ROAST' && (
          <>
            {appState === AppState.IDLE && (
              <div className="animate-fade-in">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
                    Why aren't you hired yet?
                  </h1>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Stop guessing. Our AI hiring manager will brutally analyze your resume against the job description and tell you exactly what's wrong.
                  </p>
                </div>
                <RoasterInput onAnalyze={handleAnalyze} isLoading={false} />
              </div>
            )}

            {appState === AppState.ANALYZING && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
                <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-bold text-white">Analyzing your career choices...</h2>
                <p className="text-gray-400 mt-2">Comparing keywords, judging formatting, and finding typos.</p>
              </div>
            )}

            {appState === AppState.RESULTS && result && (
              <RoasterResults result={result} onReset={handleReset} />
            )}

            {appState === AppState.ERROR && (
              <div className="max-w-lg mx-auto text-center p-8 bg-gray-800 rounded-xl border border-red-900">
                <div className="text-5xl mb-4">💥</div>
                <h2 className="text-2xl font-bold text-red-500 mb-2">Analysis Failed</h2>
                <p className="text-gray-400 mb-6">{errorMsg || "Something went wrong."}</p>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Resume Roaster. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;