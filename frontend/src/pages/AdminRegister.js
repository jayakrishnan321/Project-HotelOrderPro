import React from 'react'
import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom';
function AdminRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobilenumber: '',
    secretKey: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const handleSendOtp = async () => {
    if (!form.email || !form.password || !form.confirmPassword || !form.secretKey) {
      alert('All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await api.post('/api/admin/send-otp', form);
      alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }

  }
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Enter OTP');
      return;
    }
    try {
      const res = await api.post('/api/admin/verify-otp', {
        name: form.name,
        email: form.email,
        mobilenumber: form.mobilenumber,
        otp
      });
      alert(res.data.message);
      navigate('/admin/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    }
  }
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="glass-card-solid p-8 w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Registration
          </h2>
          <p className="text-gray-600">Create your restaurant management account</p>
        </div>

        {!otpSent ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                className="input-field"
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                className="input-field"
                type="password"
                name="password"
                placeholder="Create a strong password"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                className="input-field"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                className="input-field"
                type="tel"
                name="mobilenumber"
                placeholder="Enter your mobile number"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <input
                className="input-field"
                type="text"
                name="secretKey"
                placeholder="Enter secret key"
                onChange={handleChange}
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="btn-primary w-full"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send OTP
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Verify Your Email</h3>
              <p className="text-gray-600">Enter the OTP sent to your email address</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                className="input-field text-center text-2xl tracking-widest"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="btn-success w-full"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify OTP
              </span>
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/admin/login')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminRegister
