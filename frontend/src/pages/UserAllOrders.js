import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function UserAllOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [searchTableNumber, setSearchTableNumber] = useState('');
  const [searchTableType, setSearchTableType] = useState('');

  const [searchStatus, setSearchStatus] = useState('');
  const [searchPaymentStatus, setSearchPaymentStatus] = useState('');
  const [searchDate, setSearchDate] = useState('');
  useEffect(() => {
    const fetchAllOrders = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/users/login");
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const adminemail = decoded.adminemail;

        const res = await axios.get(`http://localhost:5000/api/orders/allorders/${adminemail}`);
        setOrders(res.data);
      } catch (error) {
        navigate("/users/login");
      }
    };

    fetchAllOrders();
  }, [navigate]);

  const filteredOrders = orders.filter(order => {
    const matchTableNumber = order.tableNumber.toString().includes(searchTableNumber);
    const matchType = order.tableType.toLowerCase().includes(searchTableType.toLowerCase());

    const matchStatus = order.overallStatus.toLowerCase().includes(searchStatus.toLowerCase());
    const matchPayment = (order.paymentStatus || "Pending").toLowerCase().includes(searchPaymentStatus.toLowerCase());

    const formattedDate = new Date(order.createdAt).toLocaleDateString(); // e.g. 08/07/2025
    const matchDate = formattedDate.includes(searchDate);

    return matchTableNumber && matchType && matchStatus && matchPayment && matchDate;
  });
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">All Orders</h1>
      <input
        type="text"
        placeholder="Search Table Number"
        value={searchTableNumber}
        onChange={(e) => setSearchTableNumber(e.target.value)}
        className="border px-3 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Search Table Type"
        value={searchTableType}
        onChange={(e) => setSearchTableType(e.target.value)}
        className="border px-3 py-1 rounded"
      />

      <input
        type="text"
        placeholder="Search Status"
        value={searchStatus}
        onChange={(e) => setSearchStatus(e.target.value)}
        className="border px-3 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Search Payment Status"
        value={searchPaymentStatus}
        onChange={(e) => setSearchPaymentStatus(e.target.value)}
        className="border px-3 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Search Date (e.g. 08/07/2025)"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="border px-3 py-1 rounded"
      />
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
            {filteredOrders.map((order) => (
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
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate('/users/dashboard')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
      >
        Go to Home
      </button>

    </div>
  );
}

export default UserAllOrders;
