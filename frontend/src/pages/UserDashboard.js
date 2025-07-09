import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'

function UserDashboard() {
   const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/users/login');
      return; // Prevent further execution
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setName(decoded.name);
    } catch (err) {
      console.error('Invalid token format:', err);
      navigate('/users/login');
    }
  }, [navigate]);

  return (
    <div className="mt-5 p-6 bg-white w-1/2 mx-auto rounded-xl shadow-md max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{name}</h1>
      <div onClick={() => { navigate('/users/viewfooditems') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">View Food Items</p>
      </div>
      <div onClick={() => { navigate('/users/takeorders') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">Take orders</p>
      </div>
      <div onClick={() => { navigate('/users/allorders') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">All  orders</p>
      </div>
      <div onClick={() => { navigate('/users/vieworders') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">View  orders</p>
      </div>
      <div onClick={() => { navigate('/users/settings') }}
        className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-700">settings</p>
      </div>
    </div>
  )
}

export default UserDashboard
