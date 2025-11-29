import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api';

function UserChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [id, setid] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate('/users/login')
      return
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setid(decoded.id)
    } catch (e) {
      console.error('Invalid token', e)
      navigate('/users/login')
    }
  }, [navigate])

  const handleSubmit = async (id) => {
    setMessage("")
    setError("")

    if (newPassword !== confirmPassword) {
      setError("New and confirm passwords do not match")
      return;
    }

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const res = await api.put(
        `/api/users/change-password/${id}`,
        { oldPassword, newPassword }
      );
      setMessage(res.data.msg || "Password updated successfully")

      // small delay so user sees the message, then navigate
      setTimeout(() => {
        navigate("/users/dashboard");
      }, 900);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Something went wrong")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card-solid w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold">Change Password</h2>
          <p className="text-sm text-gray-600 mt-1">Keep your account secure — choose a strong password.</p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(id);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Old Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle old password visibility"
              >
                {showOld ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Create a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle new password visibility"
              >
                {showNew ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Use 6+ characters. Combine letters and numbers for strength.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserChangePassword
