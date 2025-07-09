import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AdminTableStatus() {
  const navigate = useNavigate()
  const { type, number } = useParams();
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [token, settoken] = useState('')
  const [adminemail, setAdminemail] = useState('')
  useEffect(() => {

    const token = sessionStorage.getItem("token");
    settoken(token)
    if (!token) {
      navigate('/admin/login')
    } try {

      const decoded = JSON.parse(atob(token.split('.')[1]));
      setAdminemail(decoded.email)
    } catch (err) {
      console.log(err)
      navigate('/admin/login')
    }

  }, [navigate])
  useEffect(() => {
    if (!token) return;
    const fetchOrder = async () => {


      try {
        const res = await axios.get(`http://localhost:5000/api/orders/table-status/${adminemail}/${type}/${number}`);
        setOrder(res.data);
        setSelectedStatus(res.data?.paymentStatus || 'Pending');
      } catch (error) {
        console.error("Failed to fetch table status:", error);
      }
    };

    fetchOrder();
  }, [type, number, adminemail, token]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const saveStatus = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update-payment-status/${order._id}`, {
        paymentStatus: selectedStatus
      });
      alert('Payment status updated successfully');
      navigate('/admin/home')
    } catch (err) {
      alert('Error updating payment status');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Table Status</h1>
      {order ? (
        <div className="border border-gray-300 rounded p-4 shadow-md">
          <p><strong>Table No:</strong> {order.tableNumber}</p>
          <p><strong>Type:</strong> {order.tableType}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          {order.overallStatus === "Completed" && (
            <div className="mt-4">
              <label className="font-semibold">Payment Status:</label>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="ml-2 border border-gray-400 rounded px-2 py-1"
              >
                <option value="Pending">Pending</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Mixed">Mixed</option>
              </select>
              <button
                onClick={saveStatus}
                className="ml-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          )}


          <h2 className="mt-6 font-semibold">Items:</h2>
          <ul className="list-disc pl-5">
            {order.items?.map((item, idx) => (
              <li key={idx}>
                {item.foodname} × {item.foodquantity} = ₹{item.total}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No pending payment found for this table.</p>
      )}
    </div>
  );
}

export default AdminTableStatus;
