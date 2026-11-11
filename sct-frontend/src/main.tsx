import "@fontsource/anton";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import FixtureDetail from "./pages/FixtureDetail.tsx"
import { AuthProvider } from "./contexts/AuthContext"
import './index.css'
import App from './App.tsx'
import TeamDetail from "./pages/TeamDetail";
import { MotionConfig } from "motion/react";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
    <AuthProvider>
    <BrowserRouter>
    <Routes>
<Route path="/" element={<App />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/fixtures/:id" element={<FixtureDetail />} />
<Route path="/teams/:id" element={<TeamDetail />} />
    </Routes>
   
    </BrowserRouter>
    </AuthProvider>
    </MotionConfig>
      </StrictMode>,
   
)
