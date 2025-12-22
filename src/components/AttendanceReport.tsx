import type { Member, Attendance, Session } from '../types'
import { useTheme } from '../context/useTheme'

interface AttendanceReportProps {
  members: Member[]
  sessions: Session[]
  attendance: Attendance[]
  selectedCategory: string
  searchQuery: string
}

export const AttendanceReport = ({
  members,
  sessions,
  attendance,
  selectedCategory,
  searchQuery,
}: AttendanceReportProps) => {
  const { isDarkMode } = useTheme()
  
  // Filter members based on category and search
  const filteredMembers = members.filter((member) => {
    const matchesSearch = !searchQuery || member.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || member.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get attendance for a member in a specific session
  const getAttendanceStatus = (memberId: number, sessionId: number) => {
    const record = attendance.find(
      a => a.memberId === memberId && a.sessionId === sessionId
    )
    return record?.status || null
  }

  // Count attendance for a member
  const getAttendanceStats = (memberId: number) => {
    const memberAttendance = attendance.filter(a => a.memberId === memberId)
    const present = memberAttendance.filter(a => a.status === 'present').length
    const absent = memberAttendance.filter(a => a.status === 'absent').length
    const notMarked = sessions.length - present - absent
    return { present, absent, notMarked }
  }

  if (filteredMembers.length === 0) {
    return (
      <div className={`text-center py-16 rounded-xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="text-5xl mb-4">📊</div>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No members found</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl shadow-md overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      {/* Header */}
      <div className={`px-8 py-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-linear-to-r from-indigo-50 to-indigo-50'}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          📊 Attendance Report <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>({filteredMembers.length})</span>
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead className={`border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-linear-to-r from-gray-50 to-gray-100 border-gray-200'}`}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>#</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Present</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Absent</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Marked</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Attendance %</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sessions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {filteredMembers.map((member: Member, index: number) => {
              const stats = getAttendanceStats(member.id)
              const totalMarked = stats.present + stats.absent
              const attendancePercentage = totalMarked > 0 ? Math.round((stats.present / totalMarked) * 100) : 0

              return (
                <tr key={member.id} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-linear-to-r hover:from-indigo-50 hover:to-indigo-50'}`}>
                  <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{index + 1}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`flex flex-nowrap items-center px-3 py-1.5 rounded-full text-xs font-bold gap-1 w-fit ${
                      member.category === 'game'
                        ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        : 'bg-indigo-100 text-gray-800'
                    }`}>
                      {member.category === 'game' ? (
                        <>
                          <span>🎮</span> Game
                        </>
                      ) : (
                        <>
                          <span>🎨</span> Graphics
                        </>
                      )}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.email || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 bg-green-100 text-green-800">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                      {stats.present}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 bg-red-100 text-red-800">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-600"></span>
                      {stats.absent}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 bg-gray-100 text-gray-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                      {stats.notMarked}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-gray-700">
                        {stats.present}/{totalMarked} ({attendancePercentage}%)
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        attendancePercentage >= 80
                          ? 'bg-green-100 text-green-800'
                          : attendancePercentage >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendancePercentage >= 80
                          ? '✓'
                          : attendancePercentage >= 60
                          ? '⚠'
                          : '✗'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {sessions.map((session) => {
                        const status = getAttendanceStatus(member.id, session.id)
                        return (
                          <div
                            key={session.id}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                              status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                            title={`${session.name} - ${new Date(session.date).toLocaleDateString()}`}
                          >
                            {status === 'present'
                              ? '✓'
                              : status === 'absent'
                              ? '✗'
                              : '—'}
                          </div>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className={`px-8 py-6 border-t ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {attendance.filter(a => a.status === 'present').length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {attendance.filter(a => a.status === 'absent').length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Absent</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {filteredMembers.length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Members</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {sessions.length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sessions</div>
          </div>
        </div>
      </div>
    </div>
  )
}
