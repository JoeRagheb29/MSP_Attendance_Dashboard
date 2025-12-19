import { FiPlus } from 'react-icons/fi'
import logo from '../assets/logo.jpg'

interface NavBarProps {
  handleAddClick: () => void
}

function NavBar({ handleAddClick }: NavBarProps) {
  return (
    <div>
      {/* <header className="bg-linear-to-r from-black to-purple-600 text-white shadow-xl"> */}
      <header className="bg-linear-to-r from-black to-indigo-600 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1 flex items-center gap-4">
              <img src={logo} alt="MSP Logo" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shadow-lg" />
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">MSP Attendance System</h1>
                <p className="text-indigo-100 text-lg">MSP Dashboard Workshop Management System</p>
              </div>
            </div>
            <button onClick={handleAddClick}
              className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <FiPlus size={20} /> Add Member
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default NavBar
