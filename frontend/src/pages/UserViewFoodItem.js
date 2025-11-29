import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function UserViewFoodItem() {
  const navigate = useNavigate()
  const [foods, setFoods] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [adminemail, setAdminemail] = useState('')


  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/users/login')
      return
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setAdminemail(decoded.adminemail)
    } catch (err) {
      console.log(err)
      navigate('/users/login')
    }

  }, [navigate])
  // Fetch all food items
  const fetchFoods = useCallback(async () => {
    try {
      const res = await api.get(`/api/foods/users/fooditems/${adminemail}`);
      setFoods(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch foods', err);
    }
  }, [adminemail]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Menu Items
              </h2>
              <p className="text-gray-600">Browse available food items</p>
            </div>
            <button
              onClick={() => navigate('/users/dashboard')}
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
                  </tr>
                ))}
                {filteredFoods.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">No food items found</p>
                        <p className="text-sm">Try adjusting your search filters</p>
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

export default UserViewFoodItem
