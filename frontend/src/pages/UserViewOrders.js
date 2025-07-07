import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UserViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const adminemail = decoded.adminemail;

        const res = await axios.get(`http://localhost:5000/api/orders/vieworders/${adminemail}`);
        
        // Filter only items with status = "Pending"
        const filteredOrders = res.data.map(order => ({
          ...order,
          items: order.items.filter(item => item.status === "Pending")
        })).filter(order => order.items.length > 0); // Only include orders that still have pending items

        setOrders(filteredOrders);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
      }
    };

    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Pending Food Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No pending items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Table No.</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Food</th>
                <th className="p-3 border">Qty</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.items.map((item, index) => (
                  <tr key={order._id + index} className="text-center hover:bg-gray-50">
                    <td className="p-2 border">{order.tableNumber}</td>
                    <td className="p-2 border">{order.tableType}</td>
                    <td className="p-2 border capitalize">{item.foodname}</td>
                    <td className="p-2 border">{item.foodquantity}</td>
                    <td className="p-2 border">₹{item.foodprice}</td>
                    <td className="p-2 border">₹{item.total}</td>
                    <td className="p-2 border text-yellow-600 font-semibold">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserViewOrders;
