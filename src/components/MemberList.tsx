import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import type { Member } from '../types'

interface MemberListProps {
  members: Member[]
  selectedCategory: string
  onRefresh: () => void
  onEdit: (member: Member) => void
  onDelete: (id: number) => void
  onMarkAttendance: (memberId: number, status: 'present' | 'absent') => void
}

export const MemberList = ({
  members,
  selectedCategory,
  onDelete,
  onEdit,
  onMarkAttendance,
}: MemberListProps) => {
  const filteredMembers =
    selectedCategory === 'all'
      ? members
      : members.filter((m: Member) => m.category === selectedCategory)

  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-500 text-lg font-medium">No members found in this category</p>
        <p className="text-gray-400 text-sm mt-2">Try selecting a different category or add a new member</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-linear-to-r from-indigo-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-800">
          👥 Members List <span className="text-indigo-600">({filteredMembers.length})</span>
        </h2>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mark/Unmark</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map((member: Member, index: number) => (
              <tr key={member.id} className="hover:bg-linear-to-r hover:from-indigo-50 hover:to-indigo-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{member.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold gap-1 ${
                    member.category === 'game'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {member.category === 'game' ? '🎮 Game' : '🎨 Graphics'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.email || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.phone || '—'}</td>
                <td className="px-6 py-4">
                   {member.attendanceToday ? (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${
                        member.attendanceToday === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          member.attendanceToday === 'present'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}></span>
                        {member.attendanceToday === 'present' ? '✓ Present' : '✗ Absent'}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 bg-gray-100 text-gray-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
                      Not Marked
                    </span>
                  )} 
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onMarkAttendance(member.id, 'present')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-semibold shadow-sm hover:shadow-md"
                      title="Mark as present"
                      >
                      <FiCheck size={14} /> Present
                    </button>
                    <button
                      onClick={() => onMarkAttendance(member.id, 'absent')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-semibold shadow-sm hover:shadow-md"
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
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-semibold"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold"
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
