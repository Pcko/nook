import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Registration"
import Dashboard from "./components/general/Dashboard"

import './index.css';

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className={'h-full'}>
          <main className={'h-full'}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />
              <Route path="/dashboard" element={<Dashboard/>} />
            </Routes>
          </main>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;