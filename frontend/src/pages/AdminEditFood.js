import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function AdminEditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, settoken] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: 'veg',
    nonacprice: '',
    acprice: '',
    image: null,
    description: ''
  });

  const [prevImage, setPrevImage] = useState('');
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    settoken(token)
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])
  useEffect(() => {
    if (!token) return;
    const fetchFood = async () => {
      try {
        const res = await api.get(`/api/foods/${id}`);
        const data = res.data;
        setFormData({
          name: data.foodname,
          type: data.foodtype,
          nonacprice: data.foodnonacprice,
          acprice: data.foodacprice,
          image: null,
          description: data.fooddescription
        });
        setPrevImage(data.foodimage);
      } catch (err) {
        console.error('Failed to fetch food:', err);
      }
    };
    fetchFood();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('foodname', formData.name);
    data.append('foodtype', formData.type);
    data.append('foodnonacprice', formData.nonacprice);
    data.append('foodacprice', formData.acprice);
    data.append('fooddescription', formData.description);
    if (formData.image) {
      data.append('foodimage', formData.image);
    }

    try {
      await api.put(`/api/foods/edit/${id}`, data);
      alert('Food updated successfully');
      navigate('/admin/viewfooditem/:id');
    } catch (err) {
      console.error(err);
      alert('Failed to update food item');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="glass-card-solid p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Food Item</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">Food Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Price(Non AC) (₹)</label>
            <input
              type="number"
              name="nonacprice"
              value={formData.nonacprice}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Price(AC) (₹)</label>
            <input
              type="number"
              name="acprice"
              value={formData.acprice}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Picture</label>
            {prevImage && (
              <img src={prevImage} alt="food" className="w-20 h-20 object-cover mb-2 rounded" />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Update Food
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminEditFood;
