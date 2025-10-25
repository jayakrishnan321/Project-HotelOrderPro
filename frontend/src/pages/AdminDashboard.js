import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [id, setid] = useState('')
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setName(decoded.name)
      setid(decoded.id)
    } catch (err) {
      console.log(err)
      navigate('/admin/login')
    }
  }, [navigate])





  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="glass-card-solid p-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome back, {name}
            </h1>
            <p className="text-gray-600 text-lg">Manage your restaurant operations</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div onClick={() => { navigate('/admin/addfooditem') }}
            className="dashboard-card animate-slideInRight" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Add Food Items</h3>
                <p className="text-gray-600 text-sm">Create new menu items</p>
              </div>
            </div>
          </div>

          <div onClick={() => { navigate(`/admin/viewfooditem/${id}`) }}
            className="dashboard-card animate-slideInRight" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">View Food Items</h3>
                <p className="text-gray-600 text-sm">Manage your menu</p>
              </div>
            </div>
          </div>

          <div onClick={() => { navigate(`/admin/allorders`) }}
            className="dashboard-card animate-slideInRight" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">All Food Orders</h3>
                <p className="text-gray-600 text-sm">Monitor all orders</p>
              </div>
            </div>
          </div>

          <div onClick={() => { navigate('/admin/tableconfigure') }}
            className="dashboard-card animate-slideInRight" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Table Configuration</h3>
                <p className="text-gray-600 text-sm">Manage table settings</p>
              </div>
            </div>
          </div>

          <div onClick={() => { navigate(`/admin/userlist`) }}
            className="dashboard-card animate-slideInRight" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">User List</h3>
                <p className="text-gray-600 text-sm">Manage staff members</p>
              </div>
            </div>
          </div>

          <div onClick={() => { navigate('/admin/settings') }}
            className="dashboard-card animate-slideInRight" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Settings</h3>
                <p className="text-gray-600 text-sm">Account preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
