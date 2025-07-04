import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function UserRegister() {
    const navigate=useNavigate()
  const [form, setForm] = useState({
    name: '',
    useremail: '',
    adminemail:'',
    password: '',
    confirmPassword: '',
    
  });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/send-otp', form);
      alert('Registered successfully! Check your email for OTP.');
      setOtpSent(true);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };
  const handleVerifyOtp=async()=>{
     if (!otp) {
        alert('Enter OTP');
        return;
      }
          try {
        const res = await axios.post('http://localhost:5000/api/users/verify-otp', {
          name:form.name,
          useremail: form.useremail,
          adminemail:form.adminemail,
          otp
        });
        alert(res.data.message);
        navigate('/users/login');
      } catch (err) {
        alert(err.response?.data?.message || 'Invalid OTP');
      }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">User Registration</h2>
      {!otpSent ? (
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border border-gray-400 p-2 rounded"
          required
        />

        <input
          type="email"
          name="useremail"
          value={form.useremail}
          onChange={handleChange}
          placeholder="User Email"
          className="w-full border border-gray-400 p-2 rounded"
          required
        />

        <input
          type="email"
          name="adminemail"
          value={form.adminemail}
          onChange={handleChange}
          placeholder="Admin Email"
          className="w-full border border-gray-400 p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border border-gray-400 p-2 rounded"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full border border-gray-400 p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
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
  );
}

export default UserRegister;
