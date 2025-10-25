import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function UserSettings() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/users/login')
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setEmail(decoded.useremail || decoded.email || '')
    } catch (e) {
      // ignore
    }
  },[navigate])
  const handlelogout = () => {
    sessionStorage.clear()
    navigate('/users/login')
  }
  return (
    <div className="mt-8 max-w-md mx-auto animate-fadeInUp">
      <div className="glass-card-solid p-6 rounded-xl shadow-md">
        <div className="mb-2 text-sm text-gray-600">Signed in as <span className="font-medium text-gray-800">{email || 'User'}</span></div>

        <div onClick={() => { navigate('/users/changepassword') }} className="card-hover mt-3 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 .28.11.53.29.71l3 3a1 1 0 01-1.42 1.42l-3-3A2 2 0 1112 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V7a5 5 0 1110 0v4" />
            </svg>
            <div>
              <p className="text-lg font-semibold text-blue-700">Change Password</p>
              <p className="text-xs text-gray-500">Keep your account secure</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
        </div>

        <div onClick={handlelogout} className="card-hover mt-3 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            <div>
              <p className="text-lg font-semibold text-blue-700">Logout</p>
              <p className="text-xs text-gray-500">Sign out of your account</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
        </div>

        <div className="mt-4">
          <button onClick={() => navigate('/users/dashboard')} className="btn-secondary">Go to Home</button>
        </div>
      </div>
    </div>
  )
}

export default UserSettings
