import { FiPlus, FiSearch, FiMoon, FiSun } from 'react-icons/fi'
import logo from '../assets/logo.jpg'
import { useTheme } from '../context/useTheme'

interface NavBarProps {
  handleAddClick: () => void
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

function NavBar({ 
  handleAddClick, 
  selectedCategory = 'all',
  onCategoryChange = () => {},
  searchQuery = '',
  onSearchChange = () => {},
}: NavBarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div>
      {/* <header className="bg-linear-to-r from-black to-purple-600 text-white shadow-xl"> */}
      <header className={`bg-linear-to-r ${isDarkMode ? 'from-gray-900 to-gray-500' : 'from-black to-indigo-600'} text-white shadow-xl`}>
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
          {/* Top Row - Logo and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
            <div className="flex-1 flex items-center gap-4">
              <img src={logo} alt="MSP Logo" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shadow-lg" />
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">MSP Attendance System</h1>
                <p className="text-indigo-100 text-lg">MSP Dashboard Workshop Management System</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button 
                onClick={toggleDarkMode}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <button onClick={handleAddClick}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap ${
                  isDarkMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <FiPlus size={20} /> Add Member
              </button>
            </div>
          </div>

          {/* Bottom Row - Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className={`flex-1 relative rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input
                type="text"
                placeholder="Search member by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md ${
                  isDarkMode
                    ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-700'
                    : 'bg-white text-gray-900 placeholder-gray-800'
                }`}
              />
            </div>

            {/* Category Filter */}
            <select
              title="Filter by category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md min-w-fit font-semibold ${
                isDarkMode
                  ? 'bg-gray-800 text-white border border-gray-700'
                  : 'bg-white text-indigo-700'
              }`}
            >
              <option value="all">📂 All Members</option>
              <option value="game">🎮 Game</option>
              <option value="graphics">🎨 Graphics</option>
            </select>
          </div>
        </div>
      </header>
    </div>
  )
}

export default NavBar
