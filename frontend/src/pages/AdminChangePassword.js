import React from 'react'
import api from '../api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [id, setid] = useState('')
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setid(decoded.id)

    } catch (err) {
      console.log(err)
      navigate('/admin/login')

    }
  }, [navigate])
  const handleSubmit = async (id) => {
    if (newPassword !== confirmPassword) {
      alert("New and confirm passwords do not match");
      return;
    }

    try {
      const res = await api.put(
        `/api/admin/change-password/${id}`,
        { oldPassword, newPassword }
      );
      alert(res.data.msg || "Password updated successfully");

      // Delay navigation to allow alert to show
      setTimeout(() => {
        navigate("/admin/home");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card-solid w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold">Change Password</h2>
          <p className="text-sm text-gray-600 mt-1">Update your admin account password securely.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            handleSubmit(id);
          }}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminChangePassword
