import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useTheme } from '../context/useTheme'
// import { FiMoon, FiSun } from "react-icons/fi";
import Input from "../utilities/Input";

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({...prev , [name]: value}));
  }

  
  function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {

    event.preventDefault();
    console.log(formData);
    
    setLoading(true);

    // Use Vite env var VITE_API_BASE when available; otherwise default to deployed backend
    // const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://msp-attendance-dashboard-j8k1.vercel.app/api';

// Prefer explicit Vite env variable VITE_API_BASE.
// If not set, default to localhost in development and the deployed backend in production.
const DEFAULT_DEPLOYED = 'https://msp-attendance-dashboard-j8k1.vercel.app/api';
const viteEnv = import.meta.env as ImportMetaEnv & { MODE?: string };
const API_BASE = viteEnv.VITE_API_BASE ?? (viteEnv.MODE === 'development' ? 'http://localhost:3000/api' : DEFAULT_DEPLOYED);

console.log("API_BASE:", API_BASE);




    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then((res)=> (res.json()))
      .then((data) => {
        console.log(data.success)
        if(data.success) {
          localStorage.setItem('token', data.token);
          setFormData({ email: '', password: '' }); 
          navigate("/admin");
        } else {
          setError(data.message);
        }
      })
      .catch(err => console.log("error: ", err))
      .finally(() => setLoading(false));
  }

  return (
    <>

  <div className={`min-h-screen transition-colors duration-300 flex flex-col md:flex-row items-center justify-center p-6 gap-12 ${
  isDarkMode 
    ? 'bg-black text-white' 
    : 'bg-linear-to-br from-slate-50 to-slate-100 text-gray-900'
  }`}>
  
  <button onClick={toggleDarkMode}
    className={`absolute top-6 right-6 px-4 py-2 rounded-lg font-semibold border transition-all shadow-sm ${
      isDarkMode 
        ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700' 
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
  </button>

  <div className="content flex flex-col md:flex-row items-center text-center md:text-left gap-6 max-w-2xl">
    <img src={logo} alt="Logo" className="w-24 md:w-32 object-contain" />
    <div className="space-y-2">
      <h1 className={`text-3xl md:text-4xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Welcome to your <br/> 
        <span className="text-indigo-600">Attendance System</span>
      </h1>
      <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Track and manage attendance efficiently.
      </p>
    </div>
  </div>

  <div className={`Registration w-full max-w-md p-8 rounded-xl shadow-xl border transition-all ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-100'
  }`}>
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-5">
      <h2 className="text-xl font-bold mb-2">Login to your account</h2>
      
      {error && (
        <div className={`p-3 border-l-4 border-red-500 rounded text-sm ${
          isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input 
          className={`${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          onChange={handleInputChange} 
          type="email" 
          placeholder="Enter Email Address" 
          name="email" 
          id="email" 
        />

        <Input
          className={`${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          onChange={handleInputChange} 
          type="password" 
          placeholder="Enter Password" 
          name="password" 
          id="password" 
        />
      </div>

      <button 
        onClick={handleLogin} 
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transform active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
      >
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>

    <div className={`my-6 flex items-center before:flex-1 before:border-t after:flex-1 after:border-t ${isDarkMode ? 'before:border-gray-700 after:border-gray-700' : 'before:border-gray-200 after:border-gray-200'}`}>
      <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
    </div>

    <Link 
      className="block text-center text-indigo-500 font-semibold hover:text-indigo-600 hover:underline transition-colors" 
      to="/register"
    >
      Create New Admin Account
    </Link>
  </div>
</div>
    </>
  )
}

export default Login
