import React from 'react'
import { useNavigate } from 'react-router-dom'
function AdminSettings() {
    const token = sessionStorage.getItem('token')
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const id = decoded.id
    const email = decoded.email
    const navigate = useNavigate()
    const handlechangepassword = (id) => {
        navigate(`/admin/changepassword/${id}`)

    }
    const handlelogout = () => {
        sessionStorage.clear()
        navigate('/admin/login')
    }
    const handlechangetablesettings = (id) => {
        navigate(`/admin/tablesettings/${id}`)
    }
    const handleuserrequiest = (email) => {
        navigate(`/admin/adminuserrequest/${email}`)
    }

    return (
        <div className="mt-5 p-6 bg-white w-1/2 mx-auto rounded-xl shadow-md max-w-md">
            <div onClick={() => { handleuserrequiest(email) }}
                className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
                <p className="text-lg font-semibold text-blue-700">User Request</p>
            </div>
            <div onClick={() => { handlechangetablesettings(id) }}
                className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
                <p className="text-lg font-semibold text-blue-700">Change Table Settings</p>
            </div>

            <div onClick={() => { handlechangepassword(id) }}
                className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
                <p className="text-lg font-semibold text-blue-700">Change Password</p>
            </div>
            <div onClick={handlelogout}
                className="mt-5 bg-blue-100 cursor-pointer border border-blue-300 rounded-lg p-4">
                <p className="text-lg font-semibold text-blue-700">Logout</p>
            </div>


        </div>
    )
}

export default AdminSettings
