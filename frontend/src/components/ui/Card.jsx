import React from 'react'

const Card = ({ className = '', children }) => {
  return (
    <div className={`rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

export default Card
