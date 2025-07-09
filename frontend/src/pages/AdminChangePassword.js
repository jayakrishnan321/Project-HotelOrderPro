import React from 'react'
import axios from 'axios';
import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

const[id,setid]=useState('')
  useEffect(()=>{
         const token = sessionStorage.getItem('token')
         if(!token){
          navigate('/admin/login')
          return
         }
         try{
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setid(decoded.id)
  
         }catch(err){
          console.log(err)
          navigate('/admin/login')
  
         }
  },[navigate])
  const handleSubmit = async (id) => {
    if (newPassword !== confirmPassword) {
      alert("New and confirm passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/change-password/${id}`,
        { oldPassword, newPassword }
      );
      alert(res.data.msg || "Password updated successfully");

      // Delay navigation to allow alert to show
      setTimeout(() => {
        navigate("/admin/home");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          handleSubmit(id);
        }}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}

export default AdminChangePassword
