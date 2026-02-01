import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Hero from './pages/Hero'
import AdminInterface from './pages/Admin_Interface'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
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
