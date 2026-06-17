import React from 'react'

const variants = {
  primary:
    'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 focus:ring-indigo-500',
  secondary:
    'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 focus:ring-emerald-500',
  ghost:
    'bg-white text-slate-900 shadow-sm hover:bg-slate-100 focus:ring-slate-300 border border-slate-200',
}

const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const variantClass = variants[variant] || variants.primary
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
