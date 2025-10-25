import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function AdminAddFoodItem() {
  const navigate = useNavigate()
  const [adminemail, setAdminemail] = useState('')
  const [id, setid] = useState('')
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setAdminemail(decoded.email)
      setid(decoded.id)

    } catch (err) {
      console.log(err)
      navigate('/admin/login')

    }
  }, [navigate])



  const [formData, setFormData] = useState({
    name: '',
    type: 'veg',
    nonacprice: '',
    acprice: '',
    image: null,
    description: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('foodname', formData.name);
    data.append('foodtype', formData.type);
    data.append('foodnonacprice', formData.nonacprice);
    data.append('foodacprice', formData.acprice)
    data.append('foodimage', formData.image);
    data.append('fooddescription', formData.description);
    data.append('adminId', id)
    data.append('adminemail', adminemail)

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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card-solid p-8 animate-fadeInUp">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Add Food Item
            </h2>
            <p className="text-gray-600">Create a new menu item for your restaurant</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter food name"
                required
                className="input-field"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>

            {/* Price Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Non-AC Price (₹) *
                </label>
                <input
                  type="number"
                  name="nonacprice"
                  value={formData.nonacprice}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AC Price (₹) *
                </label>
                <input
                  type="number"
                  name="acprice"
                  value={formData.acprice}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} Rounded="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600">Click to upload food image</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the food item (optional)"
                className="input-field resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/home')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Food Item
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminAddFoodItem
