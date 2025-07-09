import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function TableConfigure() {
  const navigate = useNavigate()
  const [tables, setTables] = useState([]);
  const [visible, setVisible] = useState(false);
  const [adminId, setadminId] = useState('')
  useEffect(() => {

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate('/admin/login')
    } try {

      const decoded = JSON.parse(atob(token.split('.')[1]));
      setadminId(decoded.id)
    } catch (err) {
      console.log(err)
      navigate('/admin/login')
    }

  }, [navigate])
  const handleViewConfig = async () => {

    try {
      const res = await axios.get(`http://localhost:5000/api/tables/${adminId}`);
      const { acTables = 0, nonAcTables = 0 } = res.data;

      const ac = Array.from({ length: acTables }, (_, i) => ({ type: 'AC', number: i + 1 }));
      const nonAc = Array.from({ length: nonAcTables }, (_, i) => ({ type: 'Non-AC', number: i + 1 }));

      setTables([...ac, ...nonAc]);
      setVisible(true);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch table configuration');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleViewConfig}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        View Table Configuration
      </button>
      <button
        onClick={() => navigate('/admin/home')}
        className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
      >
        Go to Home
      </button>
      {visible && (
        <div className="space-y-8">
          {/* Non-AC Tables Section */}
          <div>
            <h1 className="text-xl font-bold mb-2 text-green-700">Non-AC Tables</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables
                .filter((table) => table.type === 'Non-AC')
                .map((table, index) => (
                  <div
                    onClick={() => {
                      navigate(`/admin/tables/${table.type}/${table.number}`)
                    }}
                    key={index}
                    className="p-4 rounded shadow-md text-center text-white bg-green-600"
                  >
                    <p className="font-bold">Table {table.number}</p>
                    <p>{table.type}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* AC Tables Section */}
          <div>
            <h1 className="text-xl font-bold mb-2 text-gray-800">AC Tables</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables
                .filter((table) => table.type === 'AC')
                .map((table, index) => (
                  <div
                    onClick={() => {
                      navigate(`/admin/tables/${table.type}/${table.number}`)
                    }}
                    key={index}
                    className="p-4 rounded shadow-md text-center text-white bg-gray-700"
                  >
                    <p className="font-bold">Table {table.number}</p>
                    <p>{table.type}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableConfigure;
