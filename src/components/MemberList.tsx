import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import type { Member } from '../types'
import { useTheme } from '../context/useTheme'

interface MemberListProps {
  members: Member[]
  selectedCategory: string
  onRefresh: () => void
  onEdit: (member: Member) => void
  onDelete: (id: number) => void
  onMarkAttendance: (memberId: number, status: 'present' | 'absent') => void
  getMemberAttendanceForSession: (memberId: number, sessionId: number) => 'present' | 'absent' | null
  selectedSession: number
}

export const MemberList = ({
  members, selectedCategory, onDelete, onEdit, onMarkAttendance, getMemberAttendanceForSession, selectedSession,
}: MemberListProps) => {
  const { isDarkMode } = useTheme()
  const filteredMembers =
    selectedCategory === 'all' ? members : members.filter((m: Member) => m.category === selectedCategory)

  if (filteredMembers.length === 0) {
    return (
      <div className={`text-center py-16 rounded-xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="text-5xl mb-4">📭</div>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No members found in this category</p>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try selecting a different category or add a new member</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl shadow-md overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      {/* Header */}
      <div className={`px-8 py-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-linear-to-r from-indigo-50 to-indigo-50'}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          👥 Members List <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>({filteredMembers.length})</span>
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
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mark/Unmark</th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {filteredMembers.map((member: Member, index: number) => (
              <tr key={member.id} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-linear-to-r hover:from-indigo-50 hover:to-indigo-50'}`}>
                <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{index + 1}</td>
                <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`flex flex-nowrap items-center px-3 py-1.5 rounded-full text-xs font-bold gap-1 ${
                    member.category === 'game'
                      ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                      : isDarkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {member.category === 'game' ? 
                    ( <><span>🎮</span> Game</> ) : 
                    ( <><span>🎨</span> Graphics</> )}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.email || '—'}</td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.phone || '—'}</td>
                <td className="px-6 py-4">
                   {getMemberAttendanceForSession(member.id, selectedSession) ? (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${
                        getMemberAttendanceForSession(member.id, selectedSession) === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          getMemberAttendanceForSession(member.id, selectedSession) === 'present'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}></span>
                        {getMemberAttendanceForSession(member.id, selectedSession) === 'present' ? '✓ Present' : '✗ Absent'}
                      </span>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-pulse`}></span>
                      Not Marked
                    </span>
                  )} 
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onMarkAttendance(member.id, 'present')}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold shadow-sm hover:shadow-md text-white ${
                        isDarkMode
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                      title="Mark as present"
                      >
                      <FiCheck size={14} /> Present
                    </button>
                    <button
                      onClick={() => onMarkAttendance(member.id, 'absent')}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold shadow-sm hover:shadow-md text-white ${
                        isDarkMode
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                      title="Mark as absent"
                      >
                      <FiX size={14} /> Absent
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onEdit(member)}
                      className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 border-2 border-blue-500 rounded-lg transition-colors text-xs font-semibold ${
                        isDarkMode
                          ? 'text-blue-400 hover:bg-blue-900 hover:bg-opacity-50'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 border-2 border-red-500 rounded-lg transition-colors text-xs font-semibold ${
                        isDarkMode
                          ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
