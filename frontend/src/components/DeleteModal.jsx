import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, title = 'Delete Note' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'var(--color-backdrop)',
      backdropFilter: 'var(--glass-blur)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        background: 'var(--color-bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--border-radius-full)',
            backgroundColor: 'var(--color-danger-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertTriangle color="var(--color-danger)" size={20} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Are you sure you want to delete this note? This action is permanent and cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
