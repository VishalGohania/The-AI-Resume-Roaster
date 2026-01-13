export interface CritiquePoint {
  original: string;
  feedback: string;
  rewritten: string;
}

export interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  critiquePoints: CritiquePoint[];
  roastComment: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  jobPreview: string;
  matchScore: number;
  result: AnalysisResult;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}