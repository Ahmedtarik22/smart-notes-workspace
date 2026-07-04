import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { logout } from '../store/authSlice';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // Clear local auth state even if the cookie is already missing.
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'var(--glass-blur)',
      background: 'var(--color-bg-navbar)',
      borderBottom: '1px solid var(--color-border)',
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '1rem 2rem',
    }}>
      <div className="flex-between" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
          <BookOpen color="var(--color-primary)" size={24} />
          <span>SmartNotes</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Dashboard</Link>
              <Link to="/notes" style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Notes</Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                <UserIcon size={18} />
                <span>{user?.name || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary flex-center" style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Register</Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
