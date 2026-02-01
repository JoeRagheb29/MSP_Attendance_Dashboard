import { Link, Navigate } from "react-router-dom";



function Hero() {

  const isAuth : boolean = false; // Replace with real authentication logic

  function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    console.log("Login button clicked");

  }


  return (
    isAuth ? <Navigate to="/admin" /> :
    <>
    
    <div className="hero-container flex flex-row items-center justify-center min-h-screen bg-gray-300 p-4 space-y-8">
      <div className="content text-center mr-10 ">
            <h1 className='text-3xl font-bold text-blue-500 w-2xl'>Welcome to your <br/> Attendance Management System</h1>
            <p>Track and manage attendance efficiently.</p>
      </div>
      <div className="Registration bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <form action="/login" method='post' className="Login flex flex-col space-y-4">

                  <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`} 
                  type="email" placeholder="Enter Email Address" name="email" id="email" />

                  <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`} 
                  type="password" placeholder="Enter Password" name="password" id="password" />

                  <button onClick={handleLogin} className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all' type="submit">Log In</button>
            </form>
            <div className="line bg-gray-500 w-full h-px my-4"></div>

            <Link className='m-2.5 text-lg text-blue-500 hover:underline' to="/register">Create New Admin Account</Link>
      </div>
    </div>
    </>
  )
}

export default Hero
