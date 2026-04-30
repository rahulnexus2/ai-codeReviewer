import axios from "axios"

const api=axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true,
  timeout:5000,
  headers:{
    'Content-Type':'applicatin/json',

  }
})


export default api