import { storage } from './storage';

export type UserRole = 'mahasiswa' | 'konselor';

export interface UserAccount {
  nim: string;
  nama: string;
  fakultas: string;
  semester: number;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthSession {
  nim: string;
  nama: string;
  fakultas: string;
  semester: number;
  role: UserRole;
  loggedInAt: string;
}

const ACCOUNTS: UserAccount[] = [
  {
    nim: '255150300111053',
    nama: 'Arva Mada Jayastu',
    fakultas: 'FILKOM',
    semester: 5,
    email: 'arva@student.ub.ac.id',
    password: 'SIGAP-UB123',
    role: 'mahasiswa',
  },
  {
    nim: '25515030111106',
    nama: 'Fristian Boas Nathaniel',
    fakultas: 'FILKOM',
    semester: 5,
    email: 'fristian@student.ub.ac.id',
    password: 'SIGAP-UB123',
    role: 'mahasiswa',
  },
  {
    nim: '255150301111027',
    nama: 'Farrel Arzaqia Mecca',
    fakultas: 'FILKOM',
    semester: 5,
    email: 'farrel@student.ub.ac.id',
    password: 'SIGAP-UB123',
    role: 'mahasiswa',
  },
  {
    nim: 'KN-001',
    nama: 'Dr. Sari Puspita, M.Psi.',
    fakultas: 'Psikologi',
    semester: 0,
    email: 'konselor@ub.ac.id',
    password: 'SIGAP-UB123',
    role: 'konselor',
  },
];

const SESSION_KEY = 'sigap_session';

export function authenticate(identifier: string, password: string): AuthSession | null {
  const account = ACCOUNTS.find(
    (a) => (a.email === identifier || a.nim === identifier) && a.password === password,
  );
  if (!account) return null;

  const session: AuthSession = {
    nim: account.nim,
    nama: account.nama,
    fakultas: account.fakultas,
    semester: account.semester,
    role: account.role,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  storage.ensureUserData(account.nim, account.nama, account.fakultas, account.semester);
  return session;
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getAllStudentAccounts(): UserAccount[] {
  return ACCOUNTS.filter((a) => a.role === 'mahasiswa');
}
