import { useState, useEffect } from 'react'
import type { Member, Attendance, Session } from '../../../api/src/types'
import { memberService } from '../api/memberService'
import { MemberList } from '../components/MemberList'
import { AddMember } from '../components/AddMember'
import { AttendanceReport } from '../components/AttendanceReport'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { checkApiHealth } from '../utils/apiHealthCheck'

import { useTheme } from '../context/useTheme'

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
  }, []);

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // First check if the API is accessible
      const isHealthy = await checkApiHealth()
      if (!isHealthy) {
        setError('Cannot connect to backend server. Please make sure the backend is running on https://msp-attendance-dashboard-j8k1.vercel.app/')
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
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string })?.message || 'Failed to load data. Make sure the server is running.'
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
        setAttendance(attendance.filter(a => a.member_id !== id))
      } catch (err) {
        setError('Failed to delete member. Please try again.')
        console.error(err)
      }
    }
  }

  const handleMarkAttendance = async (member_id: number, status: 'present' | 'absent') => {
    try {
      setError('')
      // Check if attendance record already exists for this member in this session
      const existingRecord = attendance.find(
        a => a.member_id === member_id && a.session_id === selectedSession
      )

      if (existingRecord) {
        // Update existing record via API
        const updated = await memberService.markAttendance(member_id, selectedSession, status)
        setAttendance(
          attendance.map(a =>
            a.id === existingRecord.id ? updated : a
          )
        )
      } else {
        // Create new attendance record via API
        const newAttendance = await memberService.markAttendance(member_id, selectedSession, status)
        setAttendance([...attendance, newAttendance])
      }
    } catch (err) {
      setError('Failed to mark attendance. Please try again.')
      console.error(err)
    }
  }

  const getMemberAttendanceForSession = (member_id: number, session_id: number): 'present' | 'absent' | null => {
    const record = attendance.find(a => a.member_id === member_id && a.session_id === session_id)
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
    
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-linear-to-br from-slate-50 to-slate-100 text-slate-900'}`}>
  {/* Header - NavBar */}
  <NavBar 
    handleAddClick={handleAddClick}
    selectedCategory={selectedCategory}
    onCategoryChange={setSelectedCategory}
    selectedRole={selectedRole}
    onRoleChange={setSelectedRole}
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
  />

  <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    
    {/* Error Section - محسن للدارك واللايت */}
    {error && (
      <div className={`mb-6 border-l-4 border-red-500 p-5 rounded-xl shadow-sm transition-all ${isDarkMode ? 'bg-red-900/20 border-opacity-50' : 'bg-red-50'}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className={`font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>⚠️ {error}</p>
            <button onClick={loadData} className={`font-bold text-sm px-6 py-2 rounded-lg transition-transform active:scale-95 ${isDarkMode ? 'bg-red-800 text-red-100 hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              Retry Connection
            </button>
          </div>
          <div className={`text-sm p-3 rounded-lg ${isDarkMode ? 'bg-black/40 text-red-300/80' : 'bg-white/50 text-red-600'}`}>
            <p className="font-bold mb-2 underline">Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 opacity-90">
              <li>Server status: <code className="bg-gray-800 text-pink-400 px-1 rounded">npm run dev:all</code></li>
              <li>Endpoint: <code className="bg-gray-800 text-pink-400 px-1 rounded">localhost:3000/health</code></li>
              <li>Check browser console (F12)</li>
            </ul>
          </div>
        </div>
      </div>
    )}

    {/* View Switcher Tabs */}
    <div className="mb-8 flex p-1.5 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl w-fit gap-1">
      <button
        onClick={() => setCurrentView('list')}
        className={`px-8 py-2.5 rounded-lg font-bold transition-all duration-200 ${
          currentView === 'list'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : isDarkMode
            ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 hover:bg-white hover:text-indigo-600'
        }`}
      >
        📋 Members
      </button>
      <button
        onClick={() => setCurrentView('report')}
        className={`px-8 py-2.5 rounded-lg font-bold transition-all duration-200 ${
          currentView === 'report'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : isDarkMode
            ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 hover:bg-white hover:text-indigo-600'
        }`}
      >
        📊 Reports
      </button>
    </div>

    {/* Main Content Loading State */}
    {loading ? (
      <div className={`flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-gray-800 border-t-indigo-500' : 'border-indigo-100 border-t-indigo-600'}`}></div>
        <p className={`font-bold animate-pulse ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fetching Secure Data...</p>
      </div>
    ) : currentView === 'list' ? (
      <>
        {/* Session Selector Card */}
        <div className={`mb-8 rounded-2xl shadow-sm p-6 border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               </div>
               <label htmlFor="session-select" className={`font-bold whitespace-nowrap ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Active Session</label>
            </div>
            
            <select
              id="session-select"
              value={selectedSession || ''}
              onChange={(e) => setSelectedSession(Number(e.target.value))}
              className={`flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                  : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
              disabled={sessions.length === 0}
            >
              {sessions.length === 0 ? (
                <option value="">No sessions available</option>
              ) : (
                sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.name} — {new Date(session.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                  </option>
                ))
              )}
            </select>
            
            <button
              onClick={handleAddSession}
              className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              + New Session
            </button>
          </div>
        </div>

        {/* Members Table Area */}
        <div className="transition-all duration-500">
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
        </div>
      </>
    ) : (
      <div className="animate-in fade-in duration-500">
        <AttendanceReport
          members={filteredMembers}
          sessions={sessions}
          attendance={attendance}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>
    )}
  </main>

  {/* Modals & Overlays */}
  {showAddModal && (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <AddMember
          onClose={handleCloseModal}
          onSuccess={editingMember ? () => {} : () => {}}
          editingMember={editingMember}
          onAddMember={handleAddMember}
          onUpdateMember={handleUpdateMember}
        />
      </div>
    </div>
  )}

  <Footer />
</div>
  )
}

export default App;