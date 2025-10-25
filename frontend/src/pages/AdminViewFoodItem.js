import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AdminViewFoodItem() {
  const [foods, setFoods] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const navigate = useNavigate()
  const [id, setId] = useState('')
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setId(decoded.id)
    } catch (err) {
      console.log(err)
      navigate('/admin/login')
    }
  }, [navigate])


  // Fetch all food items
  const fetchFoods = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/foods/fooditems/${id}`);
      setFoods(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch foods', err);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchFoods();
  }, [fetchFoods, id]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/foods/${id}`);
        fetchFoods()
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };
  const filteredFoods = foods.filter((food) => {
    const matchesName = food.foodname.toLowerCase().includes(searchName.toLowerCase());
    const matchesType = food.foodtype.toLowerCase().includes(searchType.toLowerCase());
    const matchesPrice =
      searchPrice === '' ||
      food.foodacprice.toString().includes(searchPrice) ||
      food.foodnonacprice.toString().includes(searchPrice);
    return matchesName && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card-solid p-6 mb-6 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Food Items Management
              </h2>
              <p className="text-gray-600">Manage your restaurant menu items</p>
            </div>
            <button
              onClick={() => navigate('/admin/home')}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Search Filters */}
        <div className="glass-card-solid p-6 mb-6 animate-slideInRight">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Search by type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-input"
            />
            <input
              type="number"
              placeholder="Search by price"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              className="search-input"
            />
            <button
              onClick={() => {
                setSearchName('');
                setSearchType('');
                setSearchPrice('');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="table-modern animate-slideInRight" style={{animationDelay: '0.2s'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Non-AC Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">AC Price</th>
                  <th className="px-6 py-4 text-center text-sm font-medium">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Description</th>
                  <th className="px-6 py-4 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFoods.map((food, index) => (
                  <tr key={food._id} className="table-row animate-slideInRight" style={{animationDelay: `${0.1 * index}s`}}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{food.foodname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        food.foodtype === 'veg' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {food.foodtype === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{food.foodnonacprice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{food.foodacprice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <img 
                        src={food.foodimage} 
                        alt={food.foodname} 
                        className="w-16 h-16 object-cover rounded-lg mx-auto shadow-md" 
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{food.fooddescription || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex space-x-2 justify-center">
                        <button
                          className="btn-warning"
                          onClick={() => navigate(`/admin/editfooditem/${food._id}`)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(food._id)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredFoods.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">No food items found</p>
                        <p className="text-sm">Try adjusting your search filters or add new items</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminViewFoodItem
