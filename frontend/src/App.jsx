import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from "./components/Routes.jsx"
import { ThemeProvider } from './context/ThemeContext.jsx'

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router}/>      
    </ThemeProvider>
  )
}

export default App
