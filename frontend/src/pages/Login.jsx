import React from 'react'
import api from '../services/api'


const Login = () => {
const handleLogin=async()=>{
 window.location.href = 'http://localhost:8000/auth/google';
 
}

  return (
    <div>
     
    <button onClick={handleLogin}>login with google</button>
    </div>
  )
}

export default Login
