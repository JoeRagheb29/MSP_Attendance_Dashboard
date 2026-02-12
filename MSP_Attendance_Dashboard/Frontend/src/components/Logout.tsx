import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Logout() {
      const navigate = useNavigate();
      
      function handleLogout() {
            localStorage.removeItem('token');
            navigate('/' , {replace: true});
            toast.success('Logged out successfully');
      }

      return (
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mt-8 rounded hover:bg-red-600 transition-colors active:scale-95">
              Log out
            </button>
  )
}

export default Logout
