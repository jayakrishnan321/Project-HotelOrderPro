import React from 'react'

function AdminDashboard() {
     const token = sessionStorage.getItem('token')
 const decoded = JSON.parse(atob(token.split('.')[1]));
const name=decoded.name
const id=decoded.id
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

export default AdminDashboard
