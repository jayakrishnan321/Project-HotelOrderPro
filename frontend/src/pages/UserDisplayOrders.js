import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDisplayOrders() {
  const { type, number } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({ food: '', quantity: 1 });
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [orderStatus, setOrderStatus] = useState('Uncompleted');
  const [orderId, setOrderId] = useState(null);
  const token = sessionStorage.getItem('token');
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const adminemail = decoded.adminemail;
  const priceKey = type === 'AC' ? 'foodacprice' : 'foodnonacprice';

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await axios.get(`http://localhost:5000/api/foods/users/fooditems/${adminemail}`);
      setFoods(res.data);
    };

    const fetchUncompletedOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/uncompleted/${number}/${type}/${adminemail}`);
        const existingOrder = res.data;
        console.log(existingOrder)
        if (existingOrder) {
          setItems(existingOrder.items);
          setOrderStatus(existingOrder.overallStatus || 'Uncompleted');
          setOrderId(existingOrder._id);
        }
      } catch (err) {
        console.log('No uncompleted order found or error occurred:', err);
      }
    };

    fetchFoods();
    fetchUncompletedOrder();
  }, [adminemail, number, type]);

  const handleAdd = () => {
    if (!form.food || !form.quantity) return alert("Fill all fields");

    const selected = foods.find(f => f.foodname === form.food);
    const price = selected[priceKey];

    const newItem = {
      foodname: selected.foodname,
      foodprice: price,
      foodquantity: parseInt(form.quantity),
      total: price * form.quantity,
      status: 'Pending'
    };

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = newItem;
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, newItem]);
    }

    setForm({ food: '', quantity: 1 });
  };

  const handleSave = async () => {
    const payload = {
    items,
    orderStatus,  // include this to retain the current status
  };
    try {
      if (orderId) {
        await axios.put(`http://localhost:5000/api/orders/update/${orderId}`, payload);
        alert("Order updated successfully");
      } else {
        const res = await axios.post("http://localhost:5000/api/orders/add", {
          tableNumber: number,
          tableType: type,
          adminemail,
          items,
        });
        alert("Order created successfully");
        setOrderId(res.data._id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  const handleEdit = (i) => {
    const item = items[i];
    setForm({ food: item.foodname, quantity: item.foodquantity });
    setEditIndex(i);
  };

  const handleDelete = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setItems(updated);
  };

  const handleStatusToggle = (i) => {
    const updated = [...items];
    updated[i].status = updated[i].status === 'Pending' ? 'Delivered' : 'Pending';
    setItems(updated);
  };

 const handleCompleteOrder = async () => {
  try {
    const payload = {
      tableNumber: number,
      tableType: type,
      adminemail,
      orderStatus: 'Completed'
    };

    await axios.put('http://localhost:5000/api/orders/complete', payload);
    setOrderStatus('Completed');
    alert('Order marked as completed');
    navigate('/users/dashboard')
  } catch (err) {
    console.error(err);
    alert('Failed to complete order');
  }
};


  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Table {number} ({type})</h1>

      {/* Form */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={form.food}
          onChange={(e) => setForm({ ...form, food: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Food</option>
          {foods.map((f, i) => (
            <option key={i} value={f.foodname}>
              {f.foodname} - ₹{f[priceKey]}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={form.quantity}
          min={1}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Items Table */}
      <table className="w-full mt-6 border border-gray-300 text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Food</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className="border p-2">{item.foodname}</td>
              <td className="border p-2">{item.foodquantity}</td>
              <td className="border p-2">₹{item.foodprice}</td>
              <td className="border p-2">₹{item.total}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleStatusToggle(i)}
                  className={`px-2 py-1 rounded ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}
                >
                  {item.status}
                </button>
              </td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(i)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(i)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Save Order
        </button>

        <button
          onClick={handleCompleteOrder}
          className={`px-6 py-2 rounded text-white ${orderStatus === 'Completed' ? 'bg-gray-500' : 'bg-purple-600'}`}
        >
          {orderStatus === 'Completed' ? 'Completed' : 'Complete Order'}
        </button>
      </div>
    </div>
  );
}

export default UserDisplayOrders;
