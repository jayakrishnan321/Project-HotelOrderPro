import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminTableSettings() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ acTables: '', nonAcTables: '' });
  const token = sessionStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const adminId = decoded.id
  const adminemail = decoded.email

  useEffect(() => {
    // Fetch existing settings
    axios.get(`http://localhost:5000/api/tables/${adminId}`).then(res => {
      if (res.data) setForm(res.data);
    });
  }, [adminId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/tables`, {
        ...form,
        adminId,
        adminemail
      });

      alert('Settings saved!');
      navigate('/admin/settings')
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Table Settings</h2>

      <label className="block mb-2">AC Tables</label>
      <input
        type="number"
        name="acTables"
        value={form.acTables}
        onChange={handleChange}
        className="w-full border border-gray-400 p-2 rounded mb-4"
        required
      />

      <label className="block mb-2">Non-AC Tables</label>
      <input
        type="number"
        name="nonAcTables"
        value={form.nonAcTables}
        onChange={handleChange}
        className="w-full border border-gray-400 p-2 rounded mb-4"
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}

export default AdminTableSettings;
