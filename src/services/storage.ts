import { HistoryItem } from '../types';

export interface UserData {
  nim: string;
  nama: string;
  fakultas: string;
  semester: number;
  history: HistoryItem[];
  createdAt: string;
}

const PREFIX = 'sigap_user_';

function userKey(nim: string): string {
  return `${PREFIX}${nim}`;
}

function readUser(nim: string): UserData | null {
  const raw = localStorage.getItem(userKey(nim));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

function writeUser(data: UserData): void {
  localStorage.setItem(userKey(data.nim), JSON.stringify(data));
}

function ensureUserData(nim: string, nama: string, fakultas: string, semester: number): UserData {
  const existing = readUser(nim);
  if (existing) return existing;

  const fresh: UserData = {
    nim,
    nama,
    fakultas,
    semester,
    history: [],
    createdAt: new Date().toISOString(),
  };
  writeUser(fresh);
  return fresh;
}

function getHistory(nim: string): HistoryItem[] {
  const data = readUser(nim);
  return data?.history ?? [];
}

function addHistory(nim: string, item: HistoryItem): void {
  const data = readUser(nim);
  if (!data) return;
  data.history = [item, ...data.history];
  writeUser(data);
}

function getUserProfile(nim: string): UserData | null {
  return readUser(nim);
}

function getAllStudentData(): UserData[] {
  const results: UserData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          results.push(JSON.parse(raw) as UserData);
        } catch { /* skip corrupt entries */ }
      }
    }
  }
  return results;
}

export const storage = {
  ensureUserData,
  getHistory,
  addHistory,
  getUserProfile,
  getAllStudentData,
};
