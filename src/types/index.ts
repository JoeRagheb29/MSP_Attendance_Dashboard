export type Category = 'game' | 'graphics';
export type AttendanceStatus = 'present' | 'absent';

export interface Member {
  id: number;
  name: string;
  category: Category;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Attendance {
  id: number;
  memberId: number;
  sessionId: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface Session {
  id: number;
  name: string;
  date: string;
  createdAt: string;
}

export interface MemberWithAttendance extends Member {
  attendance: Attendance[];
}
