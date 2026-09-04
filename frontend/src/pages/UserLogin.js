import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const [form, setForm] = useState({ useremail: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/api/users/login', form);
      sessionStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/users/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="glass-card-solid p-8 w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Staff Login
          </h2>
          <p className="text-gray-600">Sign in to access your workspace</p>
          <p className="text-sm text-gray-500 mt-3">
            Guest demo: <span className="font-medium text-gray-700">sample@gmail.com</span> / <span className="font-medium text-gray-700">1234</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Email</label>
            <input
              type="email"
              name="useremail"
              value={form.useremail}
              onChange={handleChange}
              placeholder="Enter user email"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/users/register')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
