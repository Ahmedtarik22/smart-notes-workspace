import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight, NotebookTabs, CheckCircle2, FolderOpen, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { loginStart, loginFailure, finishAuthRequest } from '../store/authSlice';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      dispatch(loginStart());

      const response = await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        dispatch(finishAuthRequest());
        navigate('/login', {
          replace: true,
          state: { message: 'Account created successfully. Please sign in.' },
        });
      } else {
        const errMsg = response.data.message || 'Registration failed';
        dispatch(loginFailure(errMsg));
        setApiError(errMsg);
      }
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Something went wrong. Please try again.';
      dispatch(loginFailure(errMsg));
      setApiError(errMsg);
    }
  };

  const benefits = [
    {
      icon: CheckCircle2,
      title: 'Your own writing space',
      text: 'Create a workspace that feels personal from the first note you add.',
    },
    {
      icon: FolderOpen,
      title: 'Organized from day one',
      text: 'Use categories, status, and tags to keep work neat without extra effort.',
    },
    {
      icon: Sparkles,
      title: 'Simple and thoughtful',
      text: 'A junior-friendly project with enough polish to feel made by a person.',
    },
  ];

  return (
    <div className="auth-shell animate-fade-in">
      <section className="glass-panel auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-header">
            <p className="auth-kicker">Register</p>
            <h2>Create your notes workspace</h2>
            <p>Start with a secure account, then build a writing space for ideas, drafts, tasks, and daily notes.</p>
          </div>

          {apiError && (
            <div style={{ padding: '0.85rem 1rem', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-danger)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1.25rem' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginTop: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  {...register('name')}
                />
              </div>
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

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
                  placeholder="Create a strong password"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  {...register('password')}
                />
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat your password"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', minHeight: '48px' }}>
              {loading ? (
                <>
                  <Loader2 className="spinning" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Start Writing Notes</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-note-box" style={{ marginTop: '1.25rem' }}>
            <p>What you get</p>
            <p>A personal notes dashboard with CRUD, filters, note details, protected routes, and responsive theme support.</p>
          </div>

          <div className="auth-link-row" style={{ marginTop: '1.25rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-panel auth-story register-story">
        <div className="auth-blob one" />
        <div className="auth-blob two" />

        <div className="auth-copy">
          <div className="auth-badge">
            <NotebookTabs size={28} />
          </div>

          <p className="auth-kicker" style={{ marginTop: '1.25rem' }}>
            Notes Project
          </p>
          <h1 className="auth-title">Make room for thoughts that would usually get lost.</h1>
          <p className="auth-text">
            This workspace is built around the simple habit of writing things down: ideas, reminders, study notes, and
            little pieces of work you want to come back to later.
          </p>
        </div>

        <div className="auth-feature-grid">
          {benefits.map((item) => (
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
