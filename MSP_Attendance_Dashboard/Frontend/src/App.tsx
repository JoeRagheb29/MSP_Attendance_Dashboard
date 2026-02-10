import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import AdminInterface from './pages/Admin_Interface'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminInterface />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
