import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import NoteDetails from './pages/NoteDetails';
import NotesList from './pages/NotesList';
import axiosInstance from './api/axiosInstance';
import { setUser, logout } from './store/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const { user } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.data.success) {
          dispatch(setUser(response.data.data.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }

      setIsInitializing(false);
    };

    restoreSession();
  }, [dispatch]);

  // Synchronize document attribute with theme State
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}>
        <Loader2 className="spinning" size={40} color="var(--color-primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
        <p style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Restoring secure session...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Main Landing Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Main Workspace Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <NotesList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes/create" 
            element={
              <ProtectedRoute>
                <CreateNote />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes/edit/:id" 
            element={
              <ProtectedRoute>
                <EditNote />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes/:id" 
            element={
              <ProtectedRoute>
                <NoteDetails />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
