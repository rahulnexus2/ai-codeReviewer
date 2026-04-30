import React from 'react'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import router from "./components/Routes.jsx"

import { AuthProvider } from './context/AuthCOntext.jsx'

const App = () => {
  return (
    <div>
    
      
      <RouterProvider router={router}/>
      
      
    </div>
  )
}

export default App
