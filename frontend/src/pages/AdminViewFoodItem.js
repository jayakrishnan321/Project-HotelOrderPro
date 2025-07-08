import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AdminViewFoodItem() {
  const [foods, setFoods] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const token = sessionStorage.getItem('token')
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const id = decoded.id

  const navigate = useNavigate()
  // Fetch all food items
  const fetchFoods = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/foods/fooditems/${id}`);
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to fetch foods', err);
    }
  }, [id]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

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
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Food Items</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Search by type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Search by price"
          value={searchPrice}
          onChange={(e) => setSearchPrice(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <table className="min-w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Price(Non AC) (₹)</th>
            <th className="border p-2">Price(AC) (₹)</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoods.map((food) => (
            <tr key={food._id} className="text-center">
              <td className="border p-2">{food.foodname}</td>
              <td className="border p-2 capitalize">{food.foodtype}</td>
              <td className="border p-2">₹{food.foodnonacprice}</td>
              <td className="border p-2">₹{food.foodacprice}</td>
              <td className="border p-2">
                <img src={food.foodimage} alt="food" className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="border p-2">{food.fooddescription}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  onClick={() => {
                    navigate(`/admin/editfooditem/${food._id}`)
                  }}
                >
                  Edit
                </button>
              </td>
              <td className="border p-2">
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(food._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {foods.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No food items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminViewFoodItem
