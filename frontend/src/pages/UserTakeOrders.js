import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function UserTakeOrders() {
  const navigate = useNavigate()
  const [tables, setTables] = useState([]);
  const [visible, setVisible] = useState(false);
  const [adminemail, setAdminemail] = useState('')

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/users/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setAdminemail(decoded.adminemail);
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/users/login");
    }
  }, [navigate]);
  const handleViewConfig = async () => {


    try {
      const res = await axios.get(`http://localhost:5000/api/tables/users/${adminemail}`);
      const { acTables = 0, nonAcTables = 0 } = res.data;

      const ac = Array.from({ length: acTables }, (_, i) => ({ type: 'AC', number: i + 1 }));
      const nonAc = Array.from({ length: nonAcTables }, (_, i) => ({ type: 'Non-AC', number: i + 1 }));

      setTables([...ac, ...nonAc]);
      setVisible(true);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch table configuration');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card-solid p-6 mb-6 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Take Orders
              </h2>
              <p className="text-gray-600">Select a table to create an order</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleViewConfig}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                View Tables
              </button>
              <button
                onClick={() => navigate('/users/dashboard')}
                className="btn-secondary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {visible && (
          <div className="space-y-8 animate-slideInRight">
            {/* Non-AC Tables Section */}
            <div className="glass-card-solid p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-700">Non-AC Tables</h3>
                  <p className="text-gray-600">Regular seating area</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables
                  .filter((table) => table.type === 'Non-AC')
                  .map((table, index) => (
                    <div
                      onClick={() => {
                        navigate(`/users/tables/${table.type}/${table.number}`)
                      }}
                      key={index}
                      className="dashboard-card animate-slideInRight"
                      style={{animationDelay: `${0.1 * index}s`}}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">{table.number}</span>
                        </div>
                        <p className="font-bold text-gray-800">Table {table.number}</p>
                        <p className="text-sm text-green-600 font-medium">{table.type}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* AC Tables Section */}
            <div className="glass-card-solid p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">AC Tables</h3>
                  <p className="text-gray-600">Air-conditioned seating area</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables
                  .filter((table) => table.type === 'AC')
                  .map((table, index) => (
                    <div
                      onClick={() => {
                        navigate(`/users/tables/${table.type}/${table.number}`)
                      }}
                      key={index}
                      className="dashboard-card animate-slideInRight"
                      style={{animationDelay: `${0.1 * (index + tables.filter(t => t.type === 'Non-AC').length)}s`}}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">{table.number}</span>
                        </div>
                        <p className="font-bold text-gray-800">Table {table.number}</p>
                        <p className="text-sm text-blue-600 font-medium">{table.type}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {!visible && (
          <div className="glass-card-solid p-12 text-center animate-fadeInUp">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Take Orders?</h3>
            <p className="text-gray-600 mb-6">Click "View Tables" to see available tables and start taking orders.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTakeOrders
