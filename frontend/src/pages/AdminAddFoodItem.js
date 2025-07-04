import React from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function AdminAddFoodItem() {
    const navigate=useNavigate()
    const token=sessionStorage.getItem('token')
    const decoded = JSON.parse(atob(token.split('.')[1]));
const id=decoded.id
     const [formData, setFormData] = useState({
    name: '',
    type: 'veg',
    nonacprice: '',
    acprice:'',
    image: null,
    description: ''
  });
    const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('foodname', formData.name);
    data.append('foodtype', formData.type);
    data.append('foodnonacprice', formData.nonacprice);
    data.append('foodacprice',formData.acprice)
    data.append('foodimage', formData.image);
    data.append('fooddescription', formData.description);
    data.append('adminId',id)

    try {
      const res = await axios.post('http://localhost:5000/api/foods/upload', data);
      alert('Food item added!');
      console.log(res.data)
      navigate('/admin/home')
    } catch (error) {
      console.error(error);
      alert('Failed to add food item');
    }
  };
    const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
     const inputClass =
    'w-full px-4 py-2 border border-black rounded-md focus:outline-none';
  return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add Food Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Food Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Food Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Price(Non-AC) (₹)
          </label>
          <input
            type="number"
            name="nonacprice"
            value={formData.nonacprice}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Price(AC) (₹)
          </label>
          <input
            type="number"
            name="acprice"
            value={formData.acprice}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Picture
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-black rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Optional"
            className={inputClass}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Food
        </button>
      </form>
    </div>
  )
}

export default AdminAddFoodItem
