import { useState, useEffect } from 'react'
import type { Member, Attendance, Session } from './types'
import { memberService } from './api/memberService'
import { MemberList } from './components/MemberList'
import { AddMember } from './components/AddMember'
import { AttendanceReport } from './components/AttendanceReport'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { checkApiHealth } from './utils/apiHealthCheck'

import { useTheme } from './context/useTheme'

function App() {
  const [members, setMembers] = useState<Member[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')

  const [selectedSession, setSelectedSession] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentView, setCurrentView] = useState<'list' | 'report'>('list')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // First check if the API is accessible
      const isHealthy = await checkApiHealth()
      if (!isHealthy) {
        setError('Cannot connect to backend server. Please make sure the backend is running on http://localhost:3001')
        setLoading(false)
        return
      }
      
      const [membersData, sessionsData] = await Promise.all([
        memberService.getMembers(),
        memberService.getSessions(),
      ])
      setMembers(membersData)
      setSessions(sessionsData)
      
      // Load attendance for all sessions
      if (sessionsData.length > 0) {
        await loadAttendance(sessionsData)
        // Set selected session to the latest one
        setSelectedSession(sessionsData[sessionsData.length - 1].id)
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load data. Make sure the server is running.'
      setError(errorMessage)
      console.error('Load data error:', err)
    } finally {
      setLoading(false)
    }
  }

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

  const loadAttendance = async (sessionsList: Session[]) => {
    try {
      // Load attendance for all sessions
      const allAttendance: Attendance[] = []
      for (const session of sessionsList) {
        const sessionAttendance = await memberService.getSessionAttendance(session.id)
        allAttendance.push(...sessionAttendance)
      }
      setAttendance(allAttendance)
    } catch (err) {
      console.error('Failed to load attendance:', err)
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

  const handleAddMember = async (newMember: Omit<Member, 'id' | 'createdAt'>) => {
    try {
      setError('')
      const member = await memberService.addMember(newMember)
      setMembers([member, ...members])
      handleCloseModal()
    } catch (err) {
      setError('Failed to add member. Please try again.')
      console.error(err)
    }
  }

  const handleUpdateMember = async (updatedMember: Member) => {
    try {
      setError('')
      const member = await memberService.updateMember(updatedMember.id, updatedMember)
      setMembers(members.map(m => m.id === member.id ? member : m))
      handleCloseModal()
    } catch (err) {
      setError('Failed to update member. Please try again.')
      console.error(err)
    }
  }

  const handleDeleteMember = async (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        setError('')
        await memberService.deleteMember(id)
        setMembers(members.filter(m => m.id !== id))
        // Also remove attendance records for this member
        setAttendance(attendance.filter(a => a.memberId !== id))
      } catch (err) {
        setError('Failed to delete member. Please try again.')
        console.error(err)
      }
    }
  }

  const handleMarkAttendance = async (memberId: number, status: 'present' | 'absent') => {
    try {
      setError('')
      // Check if attendance record already exists for this member in this session
      const existingRecord = attendance.find(
        a => a.memberId === memberId && a.sessionId === selectedSession
      )

      if (existingRecord) {
        // Update existing record via API
        const updated = await memberService.markAttendance(memberId, selectedSession, status)
        setAttendance(
          attendance.map(a =>
            a.id === existingRecord.id ? updated : a
          )
        )
      } else {
        // Create new attendance record via API
        const newAttendance = await memberService.markAttendance(memberId, selectedSession, status)
        setAttendance([...attendance, newAttendance])
      }
    } catch (err) {
      setError('Failed to mark attendance. Please try again.')
      console.error(err)
    }
  }

  const getMemberAttendanceForSession = (memberId: number, sessionId: number): 'present' | 'absent' | null => {
    const record = attendance.find(a => a.memberId === memberId && a.sessionId === sessionId)
    return record ? record.status : null
  }

  // Reload attendance when a new session is added
  const handleAddSession = async () => {
    try {
      setError('')
      const sessionNumber = sessions.length + 1
      const newSession = await memberService.createSession({
        name: `Session ${sessionNumber}`,
        date: new Date().toISOString(),
      })
      const updatedSessions = [...sessions, newSession]
      setSessions(updatedSessions)
      setSelectedSession(newSession.id)
      // Reload attendance to include the new session
      await loadAttendance(updatedSessions)
    } catch (err) {
      setError('Failed to create session. Please try again.')
      console.error(err)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || member.category === selectedCategory
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesCategory && matchesRole
  })

  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-linear-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <NavBar 
        handleAddClick={handleAddClick}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error Banner */}
        {error && (
          <div className={`mb-6 border-l-4 border-red-500 p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
                <button onClick={loadData} className={`font-semibold text-sm px-4 py-2 rounded ${isDarkMode ? 'bg-red-800 text-red-200 hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                  Retry
                </button>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                <p className="font-semibold mb-1">Troubleshooting steps:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Make sure the backend server is running: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">cd backend && npm run dev</code></li>
                  <li>Or run both together: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm run dev:all</code></li>
                  <li>Check if the backend is accessible at <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3001/health</code></li>
                  <li>Check the browser console (F12) for detailed error messages</li>
                </ul>
              </div>
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
                  value={selectedSession || ''}
                  onChange={(e) => setSelectedSession(Number(e.target.value))}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  disabled={sessions.length === 0}
                >
                  {sessions.length === 0 ? (
                    <option value="">No sessions available</option>
                  ) : (
                    sessions.map(session => (
                      <option key={session.id} value={session.id}>
                        {session.name} - {new Date(session.date).toLocaleDateString()}
                      </option>
                    ))
                  )}
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