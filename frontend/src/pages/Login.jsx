import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, NotebookPen, ShieldCheck, Search, Pin } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      dispatch(loginStart());

      const response = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        dispatch(loginSuccess({
          user: response.data.data.user,
        }));
        navigate('/dashboard');
      } else {
        const errMsg = response.data.message || 'Login failed';
        dispatch(loginFailure(errMsg));
        setApiError(errMsg);
      }
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Invalid email or password';
      dispatch(loginFailure(errMsg));
      setApiError(errMsg);
    }
  };

  const highlights = [
    {
      icon: Search,
      title: 'Find notes fast',
      text: 'Jump between ideas with search, filters, and sort controls that feel quick and clear.',
    },
    {
      icon: Pin,
      title: 'Keep priorities visible',
      text: 'Pin important notes so your dashboard feels personal and useful from the first glance.',
    },
    {
      icon: ShieldCheck,
      title: 'Private workspace',
      text: 'Your session is protected and your notes stay scoped to your own account.',
    },
  ];

  return (
    <div className="auth-shell animate-fade-in">
      <section className="glass-panel auth-story login-story">
        <div className="auth-blob one" />
        <div className="auth-blob two" />

        <div className="auth-copy">
          <div className="auth-badge">
            <NotebookPen size={28} />
          </div>

          <p className="auth-kicker" style={{ marginTop: '1.25rem' }}>
            Smart Notes Workspace
          </p>
          <h1 className="auth-title">A calmer place to collect thoughts, tasks, and unfinished ideas.</h1>
          <p className="auth-text">
            Sign in to your workspace and continue from where you stopped. This is a notes app that should feel warm,
            focused, and genuinely helpful instead of cold and generic.
          </p>
        </div>

        <div className="auth-feature-grid">
          {highlights.map((item) => (
            <div key={item.title} className="auth-feature-card">
              <div className="auth-feature-icon">
                <item.icon size={18} />
              </div>
              <div>
                <h3 className="auth-feature-title">{item.title}</h3>
                <p className="auth-feature-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-header">
            <p className="auth-kicker">Login</p>
            <h2>Welcome back</h2>
            <p>Open your notes, review your pinned work, and continue writing with less friction.</p>
          </div>

          {location.state?.message && (
            <div style={{ padding: '0.85rem 1rem', background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1.25rem' }}>
              {location.state.message}
            </div>
          )}

          {apiError && (
            <div style={{ padding: '0.85rem 1rem', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-danger)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1.25rem' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginTop: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  {...register('email')}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  {...register('password')}
                />
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', minHeight: '48px' }}>
              {loading ? (
                <>
                  <Loader2 className="spinning" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Enter Workspace</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-note-box" style={{ marginTop: '1.25rem' }}>
            <p>Inside the project</p>
            <p>Protected notes CRUD, categories, tags, search, filtering, pagination, and a theme-aware workspace.</p>
          </div>

          <div className="auth-link-row" style={{ marginTop: '1.25rem' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Create one
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
