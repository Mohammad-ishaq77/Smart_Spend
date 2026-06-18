import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import { API_URL, EXPENSE_ENDPOINTS } from '../config/apiConfig'

const Expenses = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [error, setError] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterMonth, setFilterMonth] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const res = await axios.get(`${API_URL}${EXPENSE_ENDPOINTS.LIST}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setExpenses(res.data.data)
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
    fetch()
  }, [navigate])

  const del = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    setDeleteLoading(id)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}${EXPENSE_ENDPOINTS.DELETE(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setExpenses((prev) => prev.filter((e) => e._id !== id))
      setError(null)
    } catch (err) {
      setError('Failed to delete expense')
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory = filterCategory === 'All' || exp.category === filterCategory
    const expDate = new Date(exp.date)
    const matchMonth = !filterMonth ||
      ((expDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth.split('-')[1] &&
        expDate.getFullYear().toString() === filterMonth.split('-')[0])
    return matchCategory && matchMonth
  })

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'amount') return b.amount - a.amount
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  const totalAmount = sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categories = ['All', ...new Set(expenses.map((e) => e.category))]

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('Monthly Expenses Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 12

    doc.setFontSize(12)
    doc.text('Total Expenses:', 20, yPosition)
    doc.text(`Rs. ${totalAmount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' })
    yPosition += 12

    doc.setFont('helvetica', 'bold')
    doc.setFillColor(59, 130, 246)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('Date', 20, yPosition)
    doc.text('Title', 60, yPosition)
    doc.text('Category', 120, yPosition)
    doc.text('Amount', pageWidth - 20, yPosition, { align: 'right' })
    yPosition += 10

    doc.setTextColor(0, 0, 0)
    let alternateColor = false

    sortedExpenses.forEach((exp) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }

      if (alternateColor) {
        doc.setFillColor(245, 245, 245)
        doc.rect(20, yPosition - 5, pageWidth - 40, 7, 'F')
      }

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(new Date(exp.date).toLocaleDateString(), 20, yPosition)
      doc.text(exp.title, 60, yPosition)
      doc.text(exp.category, 120, yPosition)
      doc.text(`Rs. ${exp.amount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' })
      yPosition += 10
      alternateColor = !alternateColor
    })

    yPosition += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Total:', 120, yPosition)
    doc.text(`Rs. ${totalAmount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' })

    doc.save(`expenses-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // SVG Icons
  const DownloadIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )

  const PlusIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )

  const AlertIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )

  const TrashIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )

  const EmptyIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  )

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

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Expenses</h1>
              <p className="mt-1 text-sm text-slate-500">Filter, sort, and export your expense history.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {sortedExpenses.length > 0 && (
                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 text-sm font-medium rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Export PDF
                </button>
              )}
              <Link
                to="/expenses/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusIcon className="w-4 h-4" />
                Add Expense
              </Link>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl text-sm flex items-center gap-3">
            <AlertIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Filters & Total */}
        <div className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.05] hover:border-white/[0.12]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#13131f] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Month</label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.05] hover:border-white/[0.12]"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.05] hover:border-white/[0.12]"
              >
                <option value="date" className="bg-[#13131f]">Date (Newest)</option>
                <option value="amount" className="bg-[#13131f]">Amount (Highest)</option>
                <option value="title" className="bg-[#13131f]">Title (A-Z)</option>
              </select>
            </div>

            <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 flex flex-col justify-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</p>
              <p className="mt-1 text-2xl font-bold text-white tracking-tight">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Expense List */}
        {sortedExpenses.length === 0 ? (
          <div className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-12 text-center">
            <EmptyIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-white">No expenses found</p>
            <p className="mt-2 text-sm text-slate-500">Add your first expense to start tracking.</p>
            <div className="mt-6">
              <Link
                to="/expenses/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                <PlusIcon className="w-4 h-4" />
                Add Your First Expense
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExpenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-[#13131f]/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 sm:p-6 hover:border-white/[0.12] transition-all duration-300 group"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-white">{exp.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium border ${getCategoryColor(exp.category)}`}>
                        {exp.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06]">
                        {exp.paymentMethod}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-2">
                    <p className="text-xl font-bold text-white tracking-tight">{formatCurrency(exp.amount)}</p>
                    <button
                      disabled={deleteLoading === exp._id}
                      onClick={() => del(exp._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      {deleteLoading === exp._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Expenses