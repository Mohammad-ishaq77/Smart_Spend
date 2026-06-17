import React from 'react'

const Input = React.forwardRef(({ label, className = '', error, ...props }, ref) => (
  <label className={`block text-sm font-medium text-slate-700 ${className}`}>
    {label}
    <input
      ref={ref}
      className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      {...props}
    />
    {error && <span className="mt-2 block text-xs text-red-500">{error}</span>}
  </label>
))

Input.displayName = 'Input'

export default Input
