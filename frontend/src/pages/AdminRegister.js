import React from 'react'
import { useState } from 'react'
import axios from 'axios'
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
      const res = await axios.post('http://localhost:5000/api/admin/send-otp', form);
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
      const res = await axios.post('http://localhost:5000/api/admin/verify-otp', {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Admin Registration
        </h2>

        {!otpSent ? (
          <><input
            className="w-full p-2 border rounded mb-3"
            type="name"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
            <input
              className="w-full p-2 border rounded mb-3"
              type="email"
              name="email"
              placeholder="Admin Email"
              onChange={handleChange}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              type="tel"
              name="mobilenumber"
              placeholder="Mobile Number"
              onChange={handleChange}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              type="text"
              name="secretKey"
              placeholder="Secret Key"
              onChange={handleChange}
            />
            <button
              onClick={handleSendOtp}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full p-2 border rounded mb-3"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminRegister
