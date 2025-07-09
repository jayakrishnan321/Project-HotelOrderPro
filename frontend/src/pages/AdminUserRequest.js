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
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">User Requests</h2>
      <button
        onClick={() => navigate('/admin/settings')}
        className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
      >
        Go to back
      </button>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests.</p>

      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.useremail}</td>
                  <td className="border p-2 capitalize text-blue-600">{user.status}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => {
                        if (window.confirm('do you want to approve this user')) {
                          handleStatusChange(user._id, 'approved')
                        }
                      }
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('do you want to reject this user')) {
                          handleStatusChange(user._id, 'rejected')
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
