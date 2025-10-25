import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminTableSettings() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ acTables: '', nonAcTables: '' });
  const [token, settoken] = useState('')
  const [adminemail, setAdminemail] = useState('')
  const [adminId, setadminId] = useState('')
  useEffect(() => {

    const token = sessionStorage.getItem("token");
    settoken(token)
    if (!token) {
      navigate('/admin/login')
    } try {

      const decoded = JSON.parse(atob(token.split('.')[1]));
      setadminId(decoded.id)
      setAdminemail(decoded.email)
    } catch (err) {
      console.log(err)
      navigate('/admin/login')
    }

  }, [navigate])
  useEffect(() => {
    if (!token) return;
    axios.get(`http://localhost:5000/api/tables/${adminId}`).then(res => {
      if (res.data) setForm(res.data);
    });
  }, [adminId, token]);

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
    <div className="max-w-md mx-auto mt-6">
      <div className="glass-card-solid p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Table Settings</h2>

        <label className="block mb-2">AC Tables</label>
        <input
          type="number"
          name="acTables"
          value={form.acTables}
          onChange={handleChange}
          className="input-field mb-4"
          required
        />

        <label className="block mb-2">Non-AC Tables</label>
        <input
          type="number"
          name="nonAcTables"
          value={form.nonAcTables}
          onChange={handleChange}
          className="input-field mb-4"
          required
        />

        <div className="flex gap-3">
          <button type="submit" form="" onClick={(e)=>{e.preventDefault(); handleSubmit(e);}} className="btn-primary">
            Save
          </button>
          <button onClick={() => navigate('/admin/settings')} className="btn-secondary">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminTableSettings;
