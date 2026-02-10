import Input from "../utilities/Input";
import { useState } from "react";
import toast from "react-hot-toast";

function Register() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error , setError] = useState("");
  const [success , setSuccess ] = useState(false);
  const [loading , setLoading] = useState(false);

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
        setSuccess(true);
        setError("");

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
    <div className="hero-container flex flex-col items-center justify-center min-h-screen bg-gray-300 p-4 space-y-8">
      {success && toast.success("Registration successful!")}
      <div className="content text-center mr-10 ">
        <h1 className='text-3xl font-bold text-blue-500 w-2xl'>Create a New Admin Account</h1>
        <p>Fill in the details below to register.</p>
      </div>
      <div className="Registration bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <form className="Login flex flex-col space-y-4">
          {error && <p className="text-red-600"> {error} </p>}
          <Input type="email" placeholder="Enter Email Address" name="email" id="email" 
           onChange={handleInputChange} />

          <Input type="password" placeholder="Enter Password" name="password" id="password"
           onChange={handleInputChange} />

          <Input type="password" placeholder="Confirm Password" name="confirmPassword" id="confirmPassword"
           onChange={handleInputChange} />

          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all' disabled={loading} onClick={handleRegister}>{loading ? "...loading" : "Register"}</button>
        </form>
      </div>
    </div>
  )
}

export default Register

