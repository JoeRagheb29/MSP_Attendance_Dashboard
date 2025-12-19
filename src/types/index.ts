export type Category = 'game' | 'graphics';
export type AttendanceStatus = 'present' | 'absent';

export interface Member {
  id: number;
  name: string;
  category: Category;
  email?: string;
  phone?: string;
  createdAt: string;
  attendanceToday?: AttendanceStatus;
}

export interface Attendance {
  id: number;
  memberId: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface MemberWithAttendance extends Member {
  attendanceToday?: AttendanceStatus;
}
