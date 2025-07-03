import React from 'react'
import { useNavigate } from 'react-router-dom'
function AdminSettings() {
     const token = sessionStorage.getItem('token')
 const decoded = JSON.parse(atob(token.split('.')[1]));
 const id=decoded.id
    const navigate=useNavigate()
    const handlechangepassword=(id)=>{
        navigate(`/admin/changepassword/${id}`)
            
    }
  return (
     <div className="mt-5 p-6 bg-white w-1/2 mx-auto rounded-xl shadow-md max-w-md">
  

  <div onClick={()=>{navigate('/admin/settings') 
                    handlechangepassword(id)
  }}
  className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
    <p className="text-lg font-semibold text-blue-700">Change Password</p>
  </div>
 
</div>
  )
}

export default AdminSettings
