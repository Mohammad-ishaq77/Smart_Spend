import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import CreateExpense from './pages/CreateExpense'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const AppContent = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const token = localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      {!isAuthPage && <Navbar />}
      <main
        className={
          isAuthPage
            ? 'min-h-screen'  // Auth pages handle their own background
            : 'min-h-screen mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to='/login' replace />} />
          <Route path="/expenses" element={token ? <Expenses /> : <Navigate to='/login' replace />} />
          <Route path="/expenses/new" element={token ? <CreateExpense /> : <Navigate to='/login' replace />} />
          <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App