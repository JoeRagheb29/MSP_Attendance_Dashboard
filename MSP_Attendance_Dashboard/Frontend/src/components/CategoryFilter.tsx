interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: CategoryFilterProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-select" className="block text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
            📂 Filter by Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700 font-semibold shadow-sm hover:shadow-md"
          >
            <option value="all">All Members</option>
            <option value="game">🎮 Game</option>
            <option value="graphics">🎨 Graphics</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label htmlFor="search-input" className="block text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
            🔍 Search Member
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700 shadow-sm hover:shadow-md"
          />
        </div>
      </div>
    </div>
  )
}
