import {createBrowserRouter, Navigate} from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import CodeEditor from './CodeEditor'
import Profile from '../pages/Profile'
import History from '../pages/History'
import Result from '../pages/Result'
import ProtectedRoute from './ProtectedRoute'
import AuthLayout from './AuthLayout'
import NotFound from '../pages/NotFound'

 const router=createBrowserRouter([
  {
    element:<AuthLayout/>,
    children:[
      {
        path: '/',
        element: <Navigate to="/home" replace />
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        element:<ProtectedRoute/>,
        children:[
          {
            path:"/home",
            element:<CodeEditor/>
          },
          {
            path:"/history",
            element:<History/>
          },
          {
            path:"/profile",
            element:<Profile/>
          },
          {
            path:"/result/:id",
            element:<Result/>
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export default router