import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Chatbot from "./pages/Chatbot";
import Forum from "./pages/Forum";
import SelfHelp from "./pages/SelfHelp";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      setUser({
        token,
        ...JSON.parse(userData)
      });
    }
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    if (!userData.token) {
      console.error("Login error: Token missing!");
      return;
    }

    localStorage.setItem("token", userData.token);
    localStorage.setItem("userData", JSON.stringify({
      id: userData._id,
      name: userData.name,
      email: userData.email
    }));
    setUser({
      ...userData,
      id: userData._id
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  // Hide navbar on auth pages
  const showNavbar = !["/login", "/signup", "/"].includes(location.pathname);

  return (
    <SocketProvider>
      <div className="app">
        {showNavbar && <Navbar user={user} onLogout={handleLogout} />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <Signup />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/journal" 
            element={user ? <Journal user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat" 
            element={user ? <Chatbot user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/forum" 
            element={user ? <Forum user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/library" 
            element={user ? <SelfHelp user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
          />

          {/* 404 Handling */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </SocketProvider>
  );
}