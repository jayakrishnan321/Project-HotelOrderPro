import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function UserSettings() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/users/login')
    }
  })
  const handlelogout = () => {
    sessionStorage.clear()
    navigate('/users/login')
  }
  return (
    <div className="mt-5 p-6 bg-white w-1/2 mx-auto rounded-xl shadow-md max-w-md">
      <div onClick={() => { navigate('/users/changepassword') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">Change Password</p>
      </div>
      <div onClick={handlelogout}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">Logout</p>
      </div>
      <button
        onClick={() => navigate('/users/dashboard')}
        className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
      >
        Go to Home
      </button>

    </div>
  )
}

export default UserSettings
