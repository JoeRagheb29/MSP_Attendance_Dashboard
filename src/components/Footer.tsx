

const Footer = () => {
  return (
      <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-indigo-400">Attendance System</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A simple yet powerful HR management system for student workshop activities. Built with modern technologies to manage members, track attendance, and organize activities efficiently.
              </p>
            </div>

            {/* Quick Links */}
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

          {/* Divider */}
          <div className="border-t border-gray-700 mt-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © 2025 Attendance Management System. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-4 md:mt-0">
                Designed & Developed by 
                <div className="flex flex-col">
                  <span className="text-indigo-600 font-semibold">Front End Head: Youssef Ragheb</span>
                  <span className="text-indigo-600 font-semibold">Back End (Position) : John Doe</span>
                </div>
              </p>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer
