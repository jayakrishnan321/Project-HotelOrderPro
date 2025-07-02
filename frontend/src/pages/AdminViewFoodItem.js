import React from 'react'
import { useState } from 'react';
import axios from 'axios';
function AdminViewFoodItem() {
     const [foods, setFoods] = useState([]);

 
    // Fetch all food items
    const fetchFoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/foods/fooditems');
        setFoods(res.data);
      } catch (err) {
        console.error('Failed to fetch foods', err);
      }
    };

    fetchFoods();
 
    const handleEdit=(id)=>{

    }
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
  return (
     <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Food Items</h2>
      <table className="min-w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Price (₹)</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food._id} className="text-center">
              <td className="border p-2">{food.foodname}</td>
              <td className="border p-2 capitalize">{food.foodtype}</td>
              <td className="border p-2">₹{food.foodprice}</td>
              <td className="border p-2">
                <img src={food.foodimage} alt="food" className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="border p-2">{food.fooddescription}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  onClick={() => handleEdit(food._id)}
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
