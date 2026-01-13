import React from 'react';
import { HistoryItem } from '../types';

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 animate-fade-in">
        <span className="text-4xl block mb-4">🕸️</span>
        <p className="text-xl font-medium">No roasts recorded yet.</p>
        <p className="text-sm mt-2">Go roast some resumes to build your history!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📜</span> Your Roast History
        </h2>
        <button 
          onClick={() => {
            if (confirm("Are you sure you want to delete all history?")) {
              onClear();
            }
          }} 
          className="text-xs font-bold text-red-500 hover:text-red-400 bg-red-900/10 hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors"
        >
          CLEAR ALL
        </button>
      </div>
      
      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 cursor-pointer transition-all flex justify-between items-center group relative overflow-hidden"
          >
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-gray-200 font-semibold truncate text-lg">
                {item.jobPreview}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.timestamp).toLocaleDateString(undefined, { dateStyle: 'medium' })} 
                {' • '}
                {new Date(item.timestamp).toLocaleTimeString(undefined, { timeStyle: 'short' })}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                 <div className={`text-2xl font-bold ${
                    item.matchScore >= 80 ? 'text-green-500' : 
                    item.matchScore >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                  {item.matchScore}%
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Match</div>
              </div>
              
              <div className="text-gray-600 group-hover:text-orange-500 transition-colors transform group-hover:translate-x-1 duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;