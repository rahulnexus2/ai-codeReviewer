import {createBrowserRouter} from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import CodeEditor from './CodeEditor'
import Profile from '../pages/Profile'
import ProtectedRoute from './ProtectedRoute'
import AuthLayout from './AuthLayout'

 const router=createBrowserRouter([
  {
    element:<AuthLayout/>,
    children:[
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
  }
    ]
  },
]
}
])



export default router