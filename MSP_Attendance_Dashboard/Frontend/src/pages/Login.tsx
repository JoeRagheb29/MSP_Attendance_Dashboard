import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    
    fetch('http://localhost:3001/api/auth/login', {
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
          navigate("/admin");
        } else {
          setError(data.message);
        }
      })
      .catch(err => console.log("error: ", err))
  }

  return (
    <>
    <div className="hero-container flex flex-row items-center justify-center min-h-screen bg-gray-300 p-4 space-y-8">
      <div className="content text-center mr-10 ">
            <h1 className='text-3xl font-bold text-blue-500 w-2xl'>Welcome to your <br/> Attendance Management System</h1>
            <p>Track and manage attendance efficiently.</p>
      </div>
      <div className="Registration bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <form action="/login" method='post' className="Login flex flex-col space-y-4">
                  {error && <p className="text-red-500">{error}</p>}
                  <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`} 
                  onChange={handleInputChange} type="email" placeholder="Enter Email Address" name="email" id="email" />

                  <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`} 
                  onChange={handleInputChange} type="password" placeholder="Enter Password" name="password" id="password" />

                  <button onClick={handleLogin} className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all' type="submit">Log In</button>
            </form>
            <div className="line bg-gray-500 w-full h-px my-4"></div>

            <Link className='m-2.5 text-lg text-blue-500 hover:underline' to="/register">Create New Admin Account</Link>
      </div>
    </div>
    </>
  )
}

export default Login
