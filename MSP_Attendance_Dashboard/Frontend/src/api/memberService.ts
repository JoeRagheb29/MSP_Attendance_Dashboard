import axios from "axios";
import type { Member, Attendance, Session, Category, AttendanceStatus } from '../types';

// Prefer explicit Vite env variable VITE_API_BASE.
// If not set, default to localhost in development and the deployed backend in production.
const DEFAULT_DEPLOYED = 'https://msp-attendance-dashboard-j8k1.vercel.app/api';
const viteEnv = import.meta.env as ImportMetaEnv & { MODE?: string };
const API_BASE = viteEnv.VITE_API_BASE ?? (viteEnv.MODE === 'development' ? 'http://localhost:3000/api' : DEFAULT_DEPLOYED);

console.log("API_BASE:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const apiOrigin = API_BASE.replace(/\/api\/?$/, '');
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error(`[API] Connection refused. Is the backend server running at ${apiOrigin}?`);
      error.message = `Cannot connect to backend server. Make sure the backend is running at ${apiOrigin}`;
    } else if (error.code === 'ETIMEDOUT') {
      console.error('[API] Request timeout. The server might be slow or not responding.');
      error.message = 'Request timeout. The backend server might be slow or not responding.';
    } else if (error.response) {
      // Server responded with error status
      console.error(`[API] Server error: ${error.response.status} - ${error.response.statusText}`);
      error.message = `Server error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API] No response received from server');
      error.message = `No response from server at ${API_BASE}. Check if the backend is running.`;
    }
    return Promise.reject(error);
  }
);

export const memberService = {
  // Get all members
  getMembers: async (): Promise<Member[]> => {
    const response = await api.get('/members');
    return response.data;
  },

  // Get members by category
  getMembersByCategory: async (category: Category): Promise<Member[]> => {
    const response = await api.get(`/members/category/${category}`);
    return response.data;
  },

  // Add new member
  addMember: async (member: Omit<Member, 'id' | 'createdAt'>): Promise<Member> => {
    const response = await api.post('/members', member);
    return response.data;
  },

  // Update member
  updateMember: async (id: number, member: Partial<Omit<Member, 'id' | 'createdAt'>>): Promise<Member> => {
    const response = await api.put(`/members/${id}`, member);
    return response.data;
  },

  // Delete member
  deleteMember: async (id: number): Promise<void> => {
    await api.delete(`/members/${id}`);
  },

  // Sessions API
  // Get all sessions
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  // Get session by ID
  getSession: async (id: number): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  // Create new session
  createSession: async (session: Omit<Session, 'id' | 'createdAt'>): Promise<Session> => {
    const response = await api.post('/sessions', session);
    return response.data;
  },

  // Update session
  updateSession: async (id: number, session: Partial<Omit<Session, 'id' | 'createdAt'>>): Promise<Session> => {
    const response = await api.put(`/sessions/${id}`, session);
    return response.data;
  },

  // Delete session
  deleteSession: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },

  // Attendance API
  // Mark attendance (requires session_id)
  markAttendance: async (member_id: number, session_id: number, status: AttendanceStatus, notes?: string): Promise<Attendance> => {
    const response = await api.post('/attendance', {
      member_id,
      session_id,
      status,
      notes,
    });
    return response.data;
  },

  // Get attendance for a member
  getMemberAttendance: async (member_id: number): Promise<Attendance[]> => {
    const response = await api.get(`/attendance/member/${member_id}`);
    return response.data;
  },

  // Get attendance for a session
  getSessionAttendance: async (session_id: number): Promise<Attendance[]> => {
    const response = await api.get(`/attendance/session/${session_id}`);
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async (): Promise<Attendance[]> => {
    const response = await api.get('/attendance/today');
    return response.data;
  },
};
