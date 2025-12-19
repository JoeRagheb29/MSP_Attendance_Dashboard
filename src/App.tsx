import { useState, useEffect } from 'react'
import type { Member } from './types'
import { memberService } from './api/memberService'
import { MemberList } from './components/MemberList'
import { AddMember } from './components/AddMember'
import { CategoryFilter } from './components/CategoryFilter'
import { getMockMembers } from './data/mockData'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

// Mock data for development
const MOCK_MEMBERS: Member[] = getMockMembers()

function App() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    }
  }

  const handleMarkAttendance = (memberId: number, status: 'present' | 'absent') => {
    setMembers(members.map(m => 
      m.id === memberId 
        ? { ...m, attendanceToday: status }
        : m
    ))
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || member.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <NavBar handleAddClick={handleAddClick} />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-red-700 font-medium">{error}</p>
              <button onClick={loadMembers} className="text-red-600 hover:text-red-800 font-semibold text-sm">
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
            <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">Loading members...</p>
          </div>
        ) : (
          <MemberList
            members={filteredMembers}
            selectedCategory={selectedCategory}
            onRefresh={loadMembers}
            onEdit={handleEditClick}
            onDelete={handleDeleteMember}
            onMarkAttendance={handleMarkAttendance}
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
      {/* <Footer /> */}
      <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-indigo-400">Attendance System</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A simple yet powerful HR management system for student workshop activities. Built with modern technologies to manage members, track attendance, and organize activities efficiently.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-indigo-400">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-indigo-400 transition-colors">✓ Member Management</li>
                <li className="hover:text-indigo-400 transition-colors">✓ Attendance Tracking</li>
                <li className="hover:text-indigo-400 transition-colors">✓ Category Filtering</li>
                <li className="hover:text-indigo-400 transition-colors">✓ Quick Search</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © 2025 Attendance Management System. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-4 md:mt-0">
                Designed & Developed by <span className="text-indigo-600 font-semibold">Front End Head: Youssef Ragheb</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
