import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AdminUserRequest() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [adminEmail, setAdminemail] = useState('')

  useEffect(() => {

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate('/admin/login')
    } try {

      const decoded = JSON.parse(atob(token.split('.')[1]));
      setAdminemail(decoded.email)
    } catch (err) {
      console.log(err)
      navigate('/admin/login')
    }

  }, [navigate])
  useEffect(() => {
    if (!adminEmail) return;
    axios
      .get(`http://localhost:5000/api/users/pending/${adminEmail}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users', err));
  }, [adminEmail]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/status/${userId}`, {
        status: newStatus,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      navigate('/admin/settings')
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">User Requests</h2>
        <button onClick={() => navigate('/admin/settings')} className="btn-secondary">Go back</button>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests.</p>
      ) : (
        <div className="table-modern overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-header">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="table-row text-center">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.useremail}</td>
                  <td className="p-2 capitalize text-blue-600">{user.status}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => {
                        if (window.confirm('do you want to approve this user')) {
                          handleStatusChange(user._id, 'approved')
                        }
                      }}
                      className="btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('do you want to reject this user')) {
                          handleStatusChange(user._id, 'rejected')
                        }
                      }}
                      className="btn-danger"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUserRequest;
