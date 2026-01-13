import { AnalysisResult, HistoryItem } from '../types';

const STORAGE_KEY_PREFIX = 'resume_roaster_data_';
const USER_KEY = 'resume_roaster_user';

export const loginUser = (username: string) => {
  localStorage.setItem(USER_KEY, username);
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(USER_KEY);
};

export const saveAnalysis = (username: string, jobDesc: string, result: AnalysisResult) => {
  const key = `${STORAGE_KEY_PREFIX}${username}`;
  const existingJson = localStorage.getItem(key);
  const existing: HistoryItem[] = existingJson ? JSON.parse(existingJson) : [];
  
  // Create a preview of the job description (first 60 chars)
  const cleanJobDesc = jobDesc.trim();
  const jobPreview = cleanJobDesc.length > 60 
    ? cleanJobDesc.substring(0, 60) + '...' 
    : cleanJobDesc || 'Unknown Position';

  const newItem: HistoryItem = {
    id: Date.now().toString() + Math.random().toString(36).substring(2),
    timestamp: Date.now(),
    jobPreview,
    matchScore: result.matchScore,
    result
  };

  const updated = [newItem, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));
};

export const getHistory = (username: string): HistoryItem[] => {
  const key = `${STORAGE_KEY_PREFIX}${username}`;
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

export const clearHistory = (username: string) => {
  const key = `${STORAGE_KEY_PREFIX}${username}`;
  localStorage.removeItem(key);
};