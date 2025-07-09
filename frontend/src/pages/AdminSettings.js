import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function AdminSettings() {
    const navigate = useNavigate()
    const [email, setemail] = useState('')
    const [id, setid] = useState('')
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (!token) {
            navigate('/admin/login')
        }
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setemail(decoded.email)
            setid(decoded.id)

        } catch (err) {
            console.log(err)
            navigate('/admin/login')
        }
    }, [navigate])


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
            <button
                onClick={() => navigate('/admin/home')}
                className="ml-4 mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
            >
                Go to Home
            </button>


        </div>
    )
}

export default AdminSettings
