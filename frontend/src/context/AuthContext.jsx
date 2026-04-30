import { createContext, useState,useEffect,useContext } from "react";
import api from "../services/api.js"



const AuthContext=createContext();



export const AuthProvider=({children})=>{
  const [user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);


useEffect(()=>{

  const verifyUser=async()=>{
    try{
    const res=await api.get("user/verify")
    console.log(res)
    setUser(res.data.user)
    }catch(error){
      setUser(null)

    }finally{
      setLoading(false)
    }
  };
  verifyUser()
},[])


const Login=()=>{
    window.location.href='http://localhost:8000/auth/google';
}

const Logout=async()=>{
  try{
    const res=await api.post("/auth/logout")
    
    Navigate('/login')
    setUser(null)

  }
  catch(error)
  {
    console.log("logout failed ", error)
  }
}

return(
  <AuthContext.Provider value={{user,Login,Logout,loading}}>
    {!loading && children}
  </AuthContext.Provider>
)
}



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};