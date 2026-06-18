import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL, EXPENSE_ENDPOINTS } from '../config/apiConfig'

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    thisMonth: 0,
    thisWeek: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

        const res = await axios.get(`${API_URL}${EXPENSE_ENDPOINTS.LIST}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const allExpenses = res.data.data

        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        let total = 0
        let thisMonth = 0
        let thisWeek = 0
        const byCategory = {}

        allExpenses.forEach((exp) => {
          total += exp.amount
          const expDate = new Date(exp.date)

          if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
            thisMonth += exp.amount
          }

          if (expDate >= weekAgo) {
            thisWeek += exp.amount
          }

          byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount
        })

        setStats({ total, byCategory, thisMonth, thisWeek })
        setExpenses(allExpenses.slice(0, 4)) 
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
        setError(err.response?.data?.message || 'Failed to load')
      }
    }
    fetchExpenses()
  }, [navigate])

  const getCategoryColor = (category) => {
    const colors = {
      food: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      transport: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      entertainment: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      shopping: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      bills: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      health: 'text-red-400 bg-red-500/10 border-red-500/20',
      education: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      other: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    }
    return colors[category?.toLowerCase()] || colors.other
  }

  // SVG Icons
  const WalletIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  )

  const TrendDownIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )

  const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )

  const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const TagIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  )

  const ArrowRightIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )

  const AlertIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )

  const EmptyIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )

  const getCategoryIcon = (category) => {
    const icons = {
      food: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
        </svg>
      ),
      transport: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      entertainment: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      ),
      shopping: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      bills: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m6-6h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m6-6h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m6-6h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m6-6h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5" />
        </svg>
      ),
      health: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      education: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.221 69.112 69.112 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    }
    return icons[category?.toLowerCase()] || (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    )
  }

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header — Welcome with user's name */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's your financial overview
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl text-sm flex items-center gap-3 mb-8">
            <AlertIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Stats Grid — 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total */}
          <div className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <WalletIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Spent</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {formatCurrency(stats.total)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <TrendDownIcon className="w-3 h-3" />
              <span>All time</span>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">This Month</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {formatCurrency(stats.thisMonth)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <ClockIcon className="w-3 h-3" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <TagIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Categories</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {Object.keys(stats.byCategory).length}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <span>Active spending categories</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Top Categories — 2 cols */}
          <div className="lg:col-span-2 bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Top Categories</h2>
            
            {Object.keys(stats.byCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.byCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => {
                    const percentage = stats.total > 0 ? ((amount / stats.total) * 100).toFixed(1) : 0
                    return (
                      <div key={category} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg border ${getCategoryColor(category)}`}>
                              {getCategoryIcon(category)}
                            </div>
                            <span className="text-sm font-medium text-slate-300 capitalize">{category}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <EmptyIcon className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">No data yet</p>
              </div>
            )}
          </div>

          {/* Recent Activities — 3 cols */}
          <div className="lg:col-span-3 bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Recent Activities</h2>

            {expenses.length > 0 ? (
              <div className="space-y-2">
                {expenses.slice(0, 4).map((exp) => (
                  <div
                    key={exp._id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/expenses/${exp._id}`)}
                  >
                    <div className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border ${getCategoryColor(exp.category)}`}>
                      {getCategoryIcon(exp.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{exp.title}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${getCategoryColor(exp.category)}`}>
                          {exp.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-white">{formatCurrency(exp.amount)}</p>
                      <ArrowRightIcon className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors ml-auto mt-1" />
                    </div>
                  </div>
                ))}

                {/* View All Link */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <Link
                    to="/expenses"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    View All Activities
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <EmptyIcon className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-sm text-slate-500 font-medium">No activities yet</p>
                <p className="text-xs text-slate-600 mt-1">Add your first expense to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard