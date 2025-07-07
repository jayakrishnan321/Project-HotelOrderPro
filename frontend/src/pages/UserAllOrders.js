import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UserAllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const adminemail = decoded.adminemail;

        const res = await axios.get(`http://localhost:5000/api/orders/allorders/${adminemail}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchAllOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">All Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Table Number</th>
              <th className="p-3 border">Table Type</th>
              <th className="p-3 border">Total Price</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Created At</th>
              <th className="p-3 border">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{order.tableNumber}</td>
                <td className="p-2 border">{order.tableType}</td>
                <td className="p-2 border">₹{order.totalPrice}</td>
                <td className="p-2 border">{order.overallStatus}</td>
                <td className="p-2 border">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <ul className="list-disc list-inside">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.foodname} x {item.foodquantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAllOrders;
