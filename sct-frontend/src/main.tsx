import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import './index.css'
import App from './App.tsx'
import FixtureDetail from "./pages/FixtureDetail.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
<Route path="/" element={<App />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/fixtures/:id" element={<FixtureDetail />} />
    </Routes>
   
    </BrowserRouter>
      </StrictMode>,
   
)
