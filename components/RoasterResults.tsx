import React from 'react';
import { AnalysisResult, CritiquePoint } from '../types';
import ScoreChart from './ScoreChart';

interface RoasterResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const CritiqueCard: React.FC<{ point: CritiquePoint; index: number }> = ({ point, index }) => (
  <div className="bg-gray-800 border-l-4 border-orange-500 p-4 rounded shadow-md mb-4">
    <div className="flex items-center mb-2">
      <span className="bg-orange-900 text-orange-200 text-xs font-bold px-2 py-1 rounded uppercase mr-2">
        Fix #{index + 1}
      </span>
      <h4 className="text-gray-300 text-sm font-semibold">Problem detected</h4>
    </div>
    
    <div className="mb-3 p-3 bg-red-900/20 rounded border border-red-900/30">
      <p className="text-xs text-red-400 font-mono mb-1 uppercase">Original:</p>
      <p className="text-gray-300 italic">"{point.original}"</p>
    </div>

    <p className="text-sm text-gray-400 mb-3 border-b border-gray-700 pb-2">
      <strong className="text-orange-400">Why it fails:</strong> {point.feedback}
    </p>

    <div className="p-3 bg-green-900/20 rounded border border-green-900/30">
      <p className="text-xs text-green-400 font-mono mb-1 uppercase">Try This Instead:</p>
      <p className="text-gray-200 font-medium">"{point.rewritten}"</p>
    </div>
  </div>
);

const RoasterResults: React.FC<RoasterResultsProps> = ({ result, onReset }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header / Roast Section */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-64 h-64 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreChart score={result.matchScore} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-2">Hiring Manager's Verdict</h2>
            <p className="text-xl text-orange-400 font-medium italic border-l-4 border-orange-600 pl-4 py-2 bg-orange-900/10 rounded-r">
              "{result.roastComment}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Keywords Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Missing Keywords
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Your resume is invisible to the ATS without these. Add them naturally.
            </p>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.length > 0 ? (
                result.missingKeywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-red-900/30 text-red-300 border border-red-800 rounded-full text-sm">
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-green-400 italic">No major keywords missing! Good job.</span>
              )}
            </div>
          </div>
        </div>

        {/* Improvements Column */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Specific Fixes
            </h3>
            <div className="space-y-2">
              {result.critiquePoints.map((point, i) => (
                <CritiqueCard key={i} point={point} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <button
          onClick={onReset}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors border border-gray-600"
        >
          Roast Another Resume
        </button>
      </div>
    </div>
  );
};

export default RoasterResults;