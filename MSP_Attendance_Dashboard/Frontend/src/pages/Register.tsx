

function Register() {


  
  return (
    <div className="hero-container flex flex-col items-center justify-center min-h-screen bg-gray-300 p-4 space-y-8">
      <div className="content text-center mr-10 ">
        <h1 className='text-3xl font-bold text-blue-500 w-2xl'>Create a New Admin Account</h1>
        <p>Fill in the details below to register.</p>
      </div>
      <div className="Registration bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <form action="/register" method='post' className="Login flex flex-col space-y-4">

          <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`}
            type="email" placeholder="Enter Email Address" name="email" id="email" />

          <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`}
            type="password" placeholder="Enter Password" name="password" id="password" />

          <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal`}
            type="password" placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" />

          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all' type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register

