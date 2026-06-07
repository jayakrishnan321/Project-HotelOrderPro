import React from 'react'
import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert('Please fill all fields');
      return;
    }
    try {
      const res = await api.post('/api/admin/login', form);
      alert(res.data.message);
      sessionStorage.setItem('token', res.data.token);

      navigate('/admin/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="glass-card-solid p-8 w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Login
          </h2>
          <p className="text-gray-600">Sign in to manage your restaurant</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input-field"
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleLogin}
            className="btn-primary w-full"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/admin/register')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
