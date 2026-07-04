import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* User Big Avatar Block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: 'var(--border-radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontSize: '2.5rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-primary)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.name || 'Workspace User'}</h2>
          <div className="badge flex-center" style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', gap: '0.25rem', padding: '0.35rem 0.75rem' }}>
            <ShieldCheck size={14} />
            <span>Verified Account</span>
          </div>
        </div>

        {/* Detailed User Information List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-primary)' }}>
              <User size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</p>
              <p style={{ fontWeight: 650, color: 'var(--color-text-main)' }}>{user?.name || 'N/A'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-primary)' }}>
              <Mail size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</p>
              <p style={{ fontWeight: 650, color: 'var(--color-text-main)' }}>{user?.email || 'N/A'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-primary)' }}>
              <Calendar size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Since</p>
              <p style={{ fontWeight: 650, color: 'var(--color-text-main)' }}>{formattedDate}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
