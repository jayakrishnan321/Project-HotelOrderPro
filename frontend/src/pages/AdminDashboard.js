import React from 'react'
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const navigate = useNavigate()
  const token = sessionStorage.getItem('token')
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const name = decoded.name
  const id = decoded.id


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
      <div onClick={() => { navigate('/admin/settings') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">Settings</p>
      </div>
    </div>

  )
}

export default AdminDashboard
