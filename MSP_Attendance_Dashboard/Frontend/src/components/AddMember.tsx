import { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import type { Member } from "../types";
import { useTheme } from "../context/useTheme";

interface AddMemberProps {
  onClose: () => void;
  onSuccess: () => void;
  editingMember?: Member | null;
  onAddMember: (member: Omit<Member, "id" | "createdAt">) => void;
  onUpdateMember: (member: Member) => void;
}

export const AddMember = ({
  onClose,
  editingMember,
  onAddMember,
  onUpdateMember,
}: AddMemberProps) => {
  const { isDarkMode } = useTheme()
  const [formData, setFormData] = useState({
    name: editingMember?.name || "",
    category: editingMember?.category || "game",
    email: editingMember?.email || "",
    phone: editingMember?.phone || "",
    role: editingMember?.role || 'attendee',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      if (editingMember) {
        onUpdateMember({
          ...editingMember,
          ...formData,
        });
      } else {
        onAddMember(formData);
      }
      onClose();
    } catch (err) {
      setError("Failed to save member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`rounded-2xl shadow-2xl max-w-sm w-full max-h-screen overflow-y-auto border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-5 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-linear-to-r from-indigo-50 to-indigo-50'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {editingMember ? "✏️ Edit Member" : "➕ Add Member"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className={`transition-colors disabled:opacity-50 rounded-lg p-2 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            title="Close"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className={`mb-6 p-4 border rounded-xl text-sm font-bold ${isDarkMode ? 'bg-red-900 bg-opacity-30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
              ❌ {error}
            </div>
          )}

          {/* Name Input */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className={`block text-sm font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="name" name="name" value={formData.name}
              onChange={handleChange} placeholder="John Doe" disabled={loading}
              required
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all shadow-sm hover:shadow-md placeholder:font-normal ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>

          {/* Category Select */}
          <div className="mb-5">
            <label
              htmlFor="category"
              className={`block text-sm font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              required
              className={`w-full px-5 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all shadow-sm hover:shadow-md ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="game">🎮 Game</option>
              <option value="graphics">🎨 Graphics</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className={`block text-sm font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all shadow-sm hover:shadow-md placeholder:font-normal ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>

          {/* Phone Input */}
          <div className="mb-7">
            <label
              htmlFor="phone"
              className={`block text-sm font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              disabled={loading}
              required
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all shadow-sm hover:shadow-md placeholder:font-normal ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>

          {/* Role Input */}
          <div className="mb-7">
            <label
              htmlFor="role"
              className={`block text-sm font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Role: <span className="text-red-500">*</span>
            </label>
            <select
              title="Select role"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              required
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all shadow-sm hover:shadow-md ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="attendee">👤 Attendee</option>
              <option value="member">👥 Member</option>
              <option value="organizer">🎖️ Organizer</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 border-2 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 uppercase tracking-wide text-sm ${
                isDarkMode ? '' : ''
              }`}
            >
              <FiSave size={18} /> {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
