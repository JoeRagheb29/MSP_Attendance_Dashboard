import { useState, useEffect } from 'react'
import type { Member, Attendance, Session } from './types'
import { memberService } from './api/memberService'
import { MemberList } from './components/MemberList'
import { AddMember } from './components/AddMember'
import { AttendanceReport } from './components/AttendanceReport'
import { getMockMembers } from './data/mockData'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { useTheme } from './context/useTheme'

// Mock data for development
const MOCK_MEMBERS: Member[] = getMockMembers()
const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    name: 'Session 1',
    date: new Date('2024-12-15').toISOString(),
    createdAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: 2,
    name: 'Session 2',
    date: new Date('2024-12-18').toISOString(),
    createdAt: new Date('2024-12-18').toISOString(),
  },
  {
    id: 3,
    name: 'Session 3',
    date: new Date('2024-12-21').toISOString(),
    createdAt: new Date('2024-12-21').toISOString(),
  },
]

function App() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS)
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS)
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSession, setSelectedSession] = useState<number>(sessions[sessions.length - 1]?.id || 1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentView, setCurrentView] = useState<'list' | 'report'>('list')

  useEffect(() => {
    // Uncomment to load from real server
    // loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await memberService.getMembers()
      setMembers(data)
    } catch (err) {
      setError('Failed to load members. Make sure the server is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setEditingMember(null)
    setShowAddModal(true)
  }

  const handleEditClick = (member: Member) => {
    setEditingMember(member)
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingMember(null)
  }

  const handleAddMember = (newMember: Omit<Member, 'id' | 'createdAt'>) => {
    const member: Member = {
      ...newMember,
      id: Math.max(...members.map(m => m.id), 0) + 1,
      createdAt: new Date().toISOString()
    }
    setMembers([...members, member])
    handleCloseModal()
  }

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m))
    handleCloseModal()
  }

  const handleDeleteMember = (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id))
      // Also remove attendance records for this member
      setAttendance(attendance.filter(a => a.memberId !== id))
    }
  }

  const handleAddSession = () => {
    const newSession: Session = {
      id: Math.max(...sessions.map(s => s.id), 0) + 1,
      name: `Session ${Math.max(...sessions.map(s => s.id), 0) + 1}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    setSessions([...sessions, newSession])
    setSelectedSession(newSession.id)
  }

  const handleMarkAttendance = (memberId: number, status: 'present' | 'absent') => {
    // Check if attendance record already exists for this member in this session
    const existingRecord = attendance.find(
      a => a.memberId === memberId && a.sessionId === selectedSession
    )

    if (existingRecord) {
      // Update existing record
      setAttendance(
        attendance.map(a =>
          a.id === existingRecord.id ? { ...a, status } : a
        )
      )
    } else {
      // Create new attendance record
      const newAttendance: Attendance = {
        id: Math.max(...attendance.map(a => a.id), 0) + 1,
        memberId,
        sessionId: selectedSession,
        status,
      }
      setAttendance([...attendance, newAttendance])
    }
  }

  const getMemberAttendanceForSession = (memberId: number, sessionId: number): 'present' | 'absent' | null => {
    const record = attendance.find(a => a.memberId === memberId && a.sessionId === sessionId)
    return record ? record.status : null
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || member.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-linear-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <NavBar 
        handleAddClick={handleAddClick}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error Banner */}
        {error && (
          <div className={`mb-6 border-l-4 border-red-500 p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <p className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
              <button onClick={loadMembers} className={`font-semibold text-sm ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* View Toggle Buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setCurrentView('list')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              currentView === 'list'
                ? 'bg-indigo-600 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📋 Members List
          </button>
          <button
            onClick={() => setCurrentView('report')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              currentView === 'report'
                ? 'bg-indigo-600 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📊 Attendance Report
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`w-14 h-14 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-gray-700 border-t-indigo-500' : 'border-indigo-200 border-t-indigo-600'}`}></div>
            <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading members...</p>
          </div>
        ) : currentView === 'list' ? (
          <>
            {/* Session Selector - only show in list view */}
            <div className={`mb-6 rounded-xl shadow-md p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label htmlFor="session-select" className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Session:</label>
                <select
                  id="session-select"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(Number(e.target.value))}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {sessions.map(session => (
                    <option key={session.id} value={session.id}>
                      {session.name} - {new Date(session.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddSession}
                  className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  + New Session
                </button>
              </div>
            </div>
            <MemberList
              members={filteredMembers}
              selectedCategory={selectedCategory}
              onRefresh={loadMembers}
              onEdit={handleEditClick}
              onDelete={handleDeleteMember}
              onMarkAttendance={handleMarkAttendance}
              getMemberAttendanceForSession={getMemberAttendanceForSession}
              selectedSession={selectedSession}
            />
          </>
        ) : (
          <AttendanceReport
            members={filteredMembers}
            sessions={sessions}
            attendance={attendance}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Modal */}
      {showAddModal && (
        <AddMember
          onClose={handleCloseModal}
          onSuccess={editingMember ? () => {} : () => {}}
          editingMember={editingMember}
          onAddMember={handleAddMember}
          onUpdateMember={handleUpdateMember}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App