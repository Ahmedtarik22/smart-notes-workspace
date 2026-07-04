import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, FileText, Pin, Loader2, AlertCircle } from 'lucide-react';
import { useNote, useDeleteNote } from '../hooks/useNotes';
import DeleteModal from '../components/DeleteModal';

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: note, isLoading, isError, error } = useNote(id);
  const deleteMutation = useDeleteNote();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const formattedDate = note
    ? new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { color: 'var(--color-success)', background: 'var(--color-success-bg)' };
      case 'archived':
        return { color: 'var(--color-warning)', background: 'var(--color-warning-bg)' };
      case 'draft':
      default:
        return { color: 'var(--color-info)', background: 'var(--color-info-bg)' };
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      setIsDeleteOpen(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
        <Loader2 className="spinning" size={40} color="var(--color-primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Retrieving note content...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinning {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid var(--color-danger)', maxWidth: '600px', margin: '4rem auto' }}>
        <AlertCircle color="var(--color-danger)" size={48} />
        <h3 style={{ fontWeight: 700 }}>Note Not Found</h3>
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {error?.response?.data?.message || error?.message || "The note you are trying to view doesn't exist or you don't have access to it."}
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Upper Navigation Row */}
      <div className="flex-between">
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to={`/notes/edit/${note._id}`} className="btn btn-secondary flex-center" style={{ padding: '0.5rem 1rem' }}>
            <Edit2 size={16} color="var(--color-primary)" />
            <span>Edit Note</span>
          </Link>
          <button onClick={() => setIsDeleteOpen(true)} className="btn btn-danger flex-center" style={{ padding: '0.5rem 1rem' }}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Meta badges and pin indicator */}
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.3rem 0.8rem' }}>
              {note.category || 'General'}
            </span>
            <span className="badge" style={{ ...getStatusStyle(note.status), padding: '0.3rem 0.8rem' }}>
              {note.status}
            </span>
          </div>

          {note.isPinned && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              <Pin size={16} fill="var(--color-primary)" style={{ transform: 'rotate(45deg)' }} />
              <span>Pinned Note</span>
            </span>
          )}
        </div>

        {/* Note title */}
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--color-text-main)' }}>
          {note.title}
        </h1>

        {/* Date line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          <Calendar size={16} />
          <span>Last modified: {formattedDate}</span>
        </div>

        {/* Tags line */}
        {note.tags && note.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
            {note.tags.map((tag, idx) => (
              <span key={idx} style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                background: 'var(--color-border)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--border-radius-full)',
                fontWeight: 500,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Note body content */}
        <div style={{
          fontSize: '1.05rem',
          lineHeight: '1.7',
          color: 'var(--color-text-main)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          minHeight: '200px'
        }}>
          {note.content}
        </div>
      </div>

      {/* Delete confirmation modal overlay */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Notes Item"
      />
    </div>
  );
}
