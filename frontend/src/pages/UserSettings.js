import React from 'react'
import { useNavigate } from 'react-router-dom'
function UserSettings() {
    const navigate=useNavigate()
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
    </div>
  )
}

export default UserSettings
