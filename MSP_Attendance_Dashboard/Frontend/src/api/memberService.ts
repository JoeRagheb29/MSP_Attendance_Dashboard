import axios from 'axios';
import type { Member, Attendance, Category, AttendanceStatus } from '../types';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
});

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

  // Mark attendance
  markAttendance: async (memberId: number, status: AttendanceStatus, notes?: string): Promise<Attendance> => {
    const response = await api.post('/attendance', {
      memberId,
      status,
      notes,
      date: new Date().toISOString().split('T')[0],
    });
    return response.data;
  },

  // Get attendance for a member
  getMemberAttendance: async (memberId: number): Promise<Attendance[]> => {
    const response = await api.get(`/attendance/member/${memberId}`);
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async (): Promise<Attendance[]> => {
    const response = await api.get('/attendance/today');
    return response.data;
  },
};
