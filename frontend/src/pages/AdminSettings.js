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
        <div className="mt-8 max-w-md mx-auto animate-fadeInUp">
            <div className="glass-card-solid p-6 rounded-xl shadow-md">
                <div className="mb-3 text-sm text-gray-600">Signed in as <span className="font-medium text-gray-800">{email || 'Admin'}</span></div>

                <div onClick={() => { handleuserrequiest(email) }} className="card-hover mt-3 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="text-lg font-semibold text-blue-700">User Requests</p>
                            <p className="text-xs text-gray-500">Approve or reject user registrations</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </div>

                <div onClick={() => { handlechangetablesettings(id) }} className="card-hover mt-3 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4z" />
                            <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 11a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-lg font-semibold text-blue-700">Table Settings</p>
                            <p className="text-xs text-gray-500">Configure AC / Non-AC tables</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </div>

                <div onClick={() => { handlechangepassword(id) }} className="card-hover mt-3 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 .28.11.53.29.71l3 3a1 1 0 01-1.42 1.42l-3-3A2 2 0 1112 11z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V7a5 5 0 1110 0v4" />
                        </svg>
                        <div>
                            <p className="text-lg font-semibold text-blue-700">Change Password</p>
                            <p className="text-xs text-gray-500">Secure your admin account</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </div>

                <div onClick={handlelogout} className="card-hover mt-3 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        </svg>
                        <div>
                            <p className="text-lg font-semibold text-blue-700">Logout</p>
                            <p className="text-xs text-gray-500">Sign out of the admin panel</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </div>

                <div className="mt-4">
                    <button onClick={() => navigate('/admin/home')} className="btn-secondary">
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
