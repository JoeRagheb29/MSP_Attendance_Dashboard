import Input from "../utilities/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error , setError] = useState("");
  const [loading , setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleRegister(e : React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setError("");
        
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
        
        navigate("/");
        toast.success("Registration successful!");
        
      } else {
        setError(data.message);
      }
    })
    .catch((err) => {
      console.error("Registration error:", err);
    })
    .finally(() => {
      setLoading(false);
    });
  }


  return (
    // <div className={`hero-container flex flex-col items-center justify-center min-h-screen bg-linear-to-r ${isDarkMode ? 'to-black' : 'to-white'} from-indigo-800 p-4 space-y-8`}>
    //   <button onClick={toggleDarkMode}
    //     className={`absolute top-10 right-10 gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap ${
    //       isDarkMode 
    //         ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
    //         : 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
    //     }`} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    //   >
    //     {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    //   </button>
    //   <div className="content text-center mr-10 ">
    //     <h1 className='text-3xl font-bold text-gray-100 w-2xl'>Create a New Admin Account</h1>
    //     <p className="text-gray-300">Fill in the details below to register.</p>
    //   </div>
    //   <div className="Registration bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
    //     <form className="Login flex flex-col space-y-4">
    //       {error && <p className="text-red-600"> {error} </p>}
    //       <Input type="email" placeholder="Enter Email Address" name="email" id="email" 
    //        onChange={handleInputChange} />

    //       <Input type="password" placeholder="Enter Password" name="password" id="password"
    //        onChange={handleInputChange} />

    //       <Input type="password" placeholder="Confirm Password" name="confirmPassword" id="confirmPassword"
    //        onChange={handleInputChange} />

    //       <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all' disabled={loading} onClick={handleRegister}>{loading ? "...loading" : "Register"}</button>
    //     </form>
    //   </div>
    // </div>


<div className={`min-h-screen transition-colors duration-300 ${
  isDarkMode 
    ? 'bg-black text-white' 
    : 'bg-linear-to-br from-slate-50 to-slate-100 text-gray-900'
}`}>

  <button onClick={toggleDarkMode}
    className={`absolute top-6 right-6 px-4 py-2 rounded-lg font-semibold border transition-colors shadow-sm ${
      isDarkMode 
        ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700' 
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
  </button>

  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
        <div className="text-center mb-10">
      <h1 className={`text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Create a New Admin Account
      </h1>
      <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Join the team and start managing your members.
      </p>
    </div>
    <div className={`w-full max-w-md p-8 rounded-xl shadow-md border transition-all ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      
      <form className="flex flex-col space-y-5" onSubmit={(e) => e.preventDefault()}>
        {error && (
          <div className={`p-3 border-l-4 border-red-500 rounded text-sm ${
            isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
            <Input type="email" name="email" onChange={handleInputChange} placeholder="admin@example.com"
              className={`${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <Input 
              type="password" 
              name="password"
              onChange={handleInputChange}
              placeholder="••••••••"
              className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <Input type="password" name="confirmPassword" onChange={handleInputChange}
              placeholder="••••••••"
              className={`${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        <button 
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            loading 
              ? 'bg-indigo-400 cursor-not-allowed text-white' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? 'Creating Account...' : 'Register as Admin'}
        </button>
      </form>
    </div>
    <p className={`mt-6 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
      Already have an account? <Link to={"/"} className="text-indigo-600 font-semibold cursor-pointer hover:underline">Login here</Link>
    </p>
  </div>
</div>
  )
}

export default Register

