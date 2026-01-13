import React, { useState } from 'react';

interface AuthProps {
  onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
       <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
          
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🔐</span>
            <h2 className="text-2xl font-bold text-white">Identify Yourself</h2>
            <p className="text-gray-400 text-sm mt-2">Enter a username to track your roast history.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Username / Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="candidate@example.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-orange-900/50"
            >
              Start Roasting
            </button>
          </form>
       </div>
    </div>
  );
};

export default Auth;