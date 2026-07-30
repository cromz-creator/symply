import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import './i18n'
import './index.css'
import App from './App'
import Info from './pages/Info'
import FoodsList from './pages/FoodsList'
import FoodDetail from './pages/FoodDetail'
import FoodForm from './pages/FoodForm'
import Diary from './pages/Diary'
import ReactionForm from './pages/ReactionForm'
import References from './pages/References'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/foods" replace /> },
      { path: 'info', element: <Info /> },
      { path: 'foods', element: <FoodsList /> },
      { path: 'foods/new', element: <FoodForm /> },
      { path: 'foods/:id', element: <FoodDetail /> },
      { path: 'foods/:id/edit', element: <FoodForm /> },
      { path: 'diary', element: <Diary /> },
      { path: 'diary/new', element: <ReactionForm /> },
      { path: 'references', element: <References /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
