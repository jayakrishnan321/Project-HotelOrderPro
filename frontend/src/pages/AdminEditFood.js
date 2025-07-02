import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminEditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'veg',
    price: '',
    image: null,
    description: ''
  });

  const [prevImage, setPrevImage] = useState('');

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/foods/${id}`);
        const data = res.data;
        setFormData({
          name: data.foodname,
          type: data.foodtype,
          price: data.foodprice,
          image: null,
          description: data.fooddescription
        });
        setPrevImage(data.foodimage);
      } catch (err) {
        console.error('Failed to fetch food:', err);
      }
    };
    fetchFood();
  }, [id]);

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
    data.append('foodprice', formData.price);
    data.append('fooddescription', formData.description);
    if (formData.image) {
      data.append('foodimage', formData.image);
    }

    try {
      await axios.put(`http://localhost:5000/api/foods/edit/${id}`, data);
      alert('Food updated successfully');
      navigate('/admin/viewfooditem');
    } catch (err) {
      console.error(err);
      alert('Failed to update food item');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Food Item</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Food Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Picture</label>
          {prevImage && (
            <img src={prevImage} alt="food" className="w-20 h-20 object-cover mb-2" />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Food
        </button>
      </form>
    </div>
  );
}

export default AdminEditFood;
