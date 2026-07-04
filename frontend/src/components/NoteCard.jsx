import React from 'react';
import { Link } from 'react-router-dom';
import { Pin, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';

export default function NoteCard({ note, onDeleteClick }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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

  return (
    <div className="glass-panel" style={{
      position: 'relative',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      height: '100%',
      minHeight: '220px',
      overflow: 'hidden',
    }}>
      {/* Pin Indicator */}
      {note.isPinned && (
        <span style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <Pin size={18} fill="var(--color-primary)" style={{ transform: 'rotate(45deg)' }} />
        </span>
      )}

      {/* Category and Status Badge Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', maxWidth: '85%' }}>
        <span className="badge" style={{
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: '0.7rem'
        }}>
          {note.category || 'General'}
        </span>
        <span className="badge" style={{ ...getStatusStyle(note.status), fontSize: '0.7rem' }}>
          {note.status}
        </span>
      </div>

      {/* Title & snippet */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          margin: '0.25rem 0',
          color: 'var(--color-text-main)',
          paddingRight: note.isPinned ? '1.5rem' : '0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {note.title}
        </h3>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.9rem',
          marginTop: '0.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4',
        }}>
          {note.content}
        </p>
      </div>

      {/* Tags row */}
      {note.tags && note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              background: 'var(--color-border)',
              padding: '0.1rem 0.5rem',
              borderRadius: 'var(--border-radius-sm)',
            }}>
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom Footer Row: Date & Actions */}
      <div className="flex-between" style={{
        marginTop: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to={`/notes/${note._id}`} title="View Details" style={{ color: 'var(--color-text-muted)' }}>
            <Eye size={18} />
          </Link>
          <Link to={`/notes/edit/${note._id}`} title="Edit Note" style={{ color: 'var(--color-primary)' }}>
            <Edit2 size={18} />
          </Link>
          <button onClick={() => onDeleteClick(note._id)} title="Delete Note" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
