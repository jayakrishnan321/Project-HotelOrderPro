import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AdminUserlist() {
    const navigate=useNavigate()
     const [adminemail,setadminemail]=useState('')
     const [users,setusers]=useState([])
    useEffect(()=>{
        const token=sessionStorage.getItem('token')
       
        if (!token){
           return  navigate('/admin/login')
        }try{
            const decoded = JSON.parse(atob(token.split('.')[1]));
            
             setadminemail(decoded.email)
        }catch(err){
               console.log(err)
               navigate('/admin/login')
        }
           
    },[navigate])
    useEffect(()=>{
        if(!adminemail)return;
       const fetchusers = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/admin/userlist/${adminemail}`);
    setusers(res.data);
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};

        fetchusers()
    },[adminemail])
  return (
     <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">User List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">S.No</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">User Email</th>
              <th className="p-3 border">Admin Email</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{index + 1}</td>
                  <td className="p-3 border text-center">{user.name}</td>
                  <td className="p-3 border text-center">{user.useremail}</td>
                  <td className="p-3 border text-center">{user.adminemail}</td>
                  <td className="p-3 border text-center capitalize">{user.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUserlist
