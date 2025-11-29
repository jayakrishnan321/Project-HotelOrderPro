import api from '../api';
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

        const res = await api.get(`/api/orders/allorders/${adminemail}`);
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Orders</h1>
        <button onClick={() => navigate('/users/dashboard')} className="btn-secondary">Go to Home</button>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search Table Number"
            value={searchTableNumber}
            onChange={(e) => setSearchTableNumber(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search Table Type"
            value={searchTableType}
            onChange={(e) => setSearchTableType(e.target.value)}
            className="search-input"
          />

          <input
            type="text"
            placeholder="Search Status"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search Payment Status"
            value={searchPaymentStatus}
            onChange={(e) => setSearchPaymentStatus(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search Date (e.g. 08/07/2025)"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-modern overflow-x-auto">
        <table className="min-w-full">
          <thead className="table-header">
            <tr>
              <th className="p-3">Table Number</th>
              <th className="p-3">Table Type</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="table-row text-center">
                <td className="p-2">{order.tableNumber}</td>
                <td className="p-2">{order.tableType}</td>
                <td className="p-2">₹{order.totalPrice}</td>
                <td className="p-2">{order.overallStatus}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="p-2 text-left">
                  <ul className="list-disc list-inside">
                    {order.items.map((item, index) => (
                      <li key={index}>{item.foodname} x {item.foodquantity}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAllOrders;
