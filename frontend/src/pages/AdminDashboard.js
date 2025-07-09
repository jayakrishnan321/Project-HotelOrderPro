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
    <div className="mt-5 p-6 bg-white w-1/2 mx-auto rounded-xl shadow-md max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{name}</h1>

      <div onClick={() => { navigate('/admin/addfooditem') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">Add Food Items</p>
      </div>
      <div onClick={() => { navigate(`/admin/viewfooditem/${id}`) }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">view Food Items</p>
      </div>
      <div onClick={() => { navigate(`/admin/allorders`) }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">All food orders</p>
      </div>
      <div onClick={() => { navigate('/admin/tableconfigure') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">view Table Configuration</p>
      </div>
      <div onClick={() => { navigate(`/admin/userlist`) }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">User list</p>
      </div>
      <div onClick={() => { navigate('/admin/settings') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">Settings</p>
      </div>
    </div>

  )
}

export default AdminDashboard
