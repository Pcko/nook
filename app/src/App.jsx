import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from 'react';

import Login from "./components/auth/Login";
import Register from "./components/auth/Registration"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AuthRedirect from "./components/general/AuthRedirect";
import Dashboard from "./components/general/Dashboard"
import Settings from "./components/settings/Settings";

import './index.css';

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


function App() {
  useEffect(()=>{
    const theme = localStorage.getItem('theme');
    const accessibilityMode = localStorage.getItem('accessibility');

    if(theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)){
      document.documentElement.classList.add('light');
    }

    if(accessibilityMode === 'high-contrast'){
      document.documentElement.classList.add('high-contrast');
    }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className={'h-full'}>
          <main className={'h-full bg-far-bg'}>
            <Routes>
              <Route path="/" element={<AuthRedirect/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />

              <Route element={<ProtectedRoute/>}>
                <Route path="/settings" element={<Settings/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;