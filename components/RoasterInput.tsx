import React, { useState, ChangeEvent } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

interface RoasterInputProps {
  onAnalyze: (resume: string, jobDesc: string) => void;
  isLoading: boolean;
}

const RoasterInput: React.FC<RoasterInputProps> = ({ onAnalyze, isLoading }) => {
  const [jobDesc, setJobDesc] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessingFile(true);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setResumeText(fullText);
      } else {
        // Handle text/md/json
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setResumeText(text);
          setIsProcessingFile(false);
        };
        reader.readAsText(file);
        return; // Return early as reader is async but handled via callback
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to read file. Please ensure it is a valid text or PDF file.");
      setFileName(null);
    } finally {
      // For PDF this runs after await. For FileReader, we handle it in onload.
      if (file.type === 'application/pdf') {
        setIsProcessingFile(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobDesc.trim() && resumeText.trim()) {
      onAnalyze(resumeText, jobDesc);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Prepare for the Roast</h2>
        <p className="text-gray-400">Upload your resume and the job description. Don't take it personally.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Description Column */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Target Job Description
            </label>
            <textarea
              className="flex-1 w-full h-64 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm placeholder-gray-600"
              placeholder="Paste the full job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              disabled={isLoading || isProcessingFile}
            />
          </div>

          {/* Resume Column */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Your Resume
            </label>
            
            <div className="relative flex-1 flex flex-col h-64">
              <textarea
                className="flex-1 w-full p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm placeholder-gray-600 mb-2"
                placeholder={isProcessingFile ? "Extracting text from file..." : "Paste your resume text here, or upload a PDF/Text file..."}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={isLoading || isProcessingFile}
              />
              
              <div className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg p-2 px-3">
                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                  {fileName ? `📄 ${fileName}` : 'No file selected'}
                  {isProcessingFile && <span className="ml-2 text-orange-400 animate-pulse">Processing...</span>}
                </span>
                <label className={`cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-1.5 px-3 rounded transition-colors border border-gray-600 ${isProcessingFile ? 'opacity-50 pointer-events-none' : ''}`}>
                  Upload PDF/TXT
                  <input 
                    type="file" 
                    accept=".txt,.md,.json,.pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    disabled={isLoading || isProcessingFile}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !jobDesc || !resumeText || isProcessingFile}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg tracking-wide uppercase transition-all transform shadow-lg
            ${isLoading || isProcessingFile
              ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
              : 'bg-orange-600 hover:bg-orange-500 text-white hover:scale-[1.01] hover:shadow-orange-900/50'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Roast My Resume 🔥"
          )}
        </button>
      </form>
    </div>
  );
};

export default RoasterInput;